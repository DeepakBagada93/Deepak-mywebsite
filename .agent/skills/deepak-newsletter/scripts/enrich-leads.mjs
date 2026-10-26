#!/usr/bin/env node
/**
 * enrich-leads.mjs — Normalize, score, dedupe and enrich metro India leads.
 *
 * Usage:
 *   node enrich-leads.mjs --in research/leads.json --out research/leads-enriched.json --mx
 *   node enrich-leads.mjs --in leads.json --metro-only --min-score=65 --strict
 *
 * Input:  array of lead objects, or { leads: [...] }
 * Output: array of enriched leads, sorted by research_score desc.
 */

import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';

const METRO_ALIASES = {
  bengaluru: 'Bengaluru', bangalore: 'Bengaluru', blr: 'Bengaluru',
  mumbai: 'Mumbai', bombay: 'Mumbai', thane: 'Mumbai', 'navi mumbai': 'Mumbai',
  'delhi ncr': 'Delhi NCR', delhi: 'Delhi NCR', 'new delhi': 'Delhi NCR',
  gurgaon: 'Delhi NCR', gurugram: 'Delhi NCR', noida: 'Delhi NCR',
  'greater noida': 'Delhi NCR', faridabad: 'Delhi NCR', ghaziabad: 'Delhi NCR',
  pune: 'Pune', pimpri: 'Pune', chinchwad: 'Pune',
  hyderabad: 'Hyderabad', secunderabad: 'Hyderabad', 'hitec city': 'Hyderabad', gachibowli: 'Hyderabad',
  chennai: 'Chennai', madras: 'Chennai', omr: 'Chennai',
  kolkata: 'Kolkata', calcutta: 'Kolkata', 'salt lake': 'Kolkata', 'new town': 'Kolkata',
  ahmedabad: 'Ahmedabad', amdavad: 'Ahmedabad', gandhinagar: 'Ahmedabad',
};

const METROS = new Set(['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad']);

const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com',
  'live.com', 'rediffmail.com', 'icloud.com', 'protonmail.com', 'aol.com', 'mail.com', 'zoho.com',
]);

const ROLE_ADDRESSES = new Set(['founder', 'founders', 'ceo', 'cto', 'coo', 'cfo', 'team', 'leadership', 'engineering', 'tech']);

const GENERIC_LOCALPARTS = new Set([
  'info', 'contact', 'hello', 'hi', 'sales', 'support', 'admin', 'team', 'office', 'enquiry',
  'enquiries', 'inquiry', 'help', 'care', 'hr', 'jobs', 'marketing', 'billing', 'accounts',
  'no-reply', 'noreply', 'webmaster', 'press', 'media',
]);

const SEGMENT_RULES = [
  { key: 'agency', words: ['agency', 'studio', 'software house', 'consulting', 'consultancy', 'freelance', 'development', 'digital'] },
  { key: 'fintech', words: ['fintech', 'payment', 'lending', 'insurance', 'gst', 'invoice', 'compliance', 'accounting', 'tax'] },
  { key: 'ai', words: ['artificial intelligence', ' ai ', 'agent', 'llm', 'ml ', 'machine learning', 'automation'] },
  { key: 'saas', words: ['saas', 'b2b', 'platform', 'software product', 'product company', 'cloud'] },
  { key: 'd2c', words: ['d2c', 'ecommerce', 'e-commerce', 'retail', 'brand', 'catalogue', 'catalog', 'shopify'] },
  { key: 'manufacturing', words: ['manufacturing', 'textile', 'ceramic', 'chemical', 'export', 'industrial', 'factory', 'plant'] },
  { key: 'logistics', words: ['logistics', 'supply chain', 'warehouse', 'delivery', 'freight', 'shipping'] },
  { key: 'healthtech', words: ['health', 'medtech', 'clinic', 'hospital', 'pharma', 'diagnostic'] },
  { key: 'edtech', words: ['edtech', 'education', 'learning', 'coaching', 'school', 'college'] },
];

const PRODUCT_FIT = {
  agency: 'AI Agency Delivery OS',
  saas: 'AI Systems Master Bundle',
  ai: 'MCP Server Launch Kit',
  fintech: 'GST Invoice & HSN Compliance Kit',
  d2c: 'n8n Production Hardening Pack',
  manufacturing: 'n8n Production Hardening Pack',
  logistics: 'n8n Production Hardening Pack',
  healthtech: 'AI Systems Master Bundle',
  edtech: 'AI Systems Master Bundle',
  software: 'AI Systems Master Bundle',
};

const PRODUCT_PRICES = {
  'AI Systems Master Bundle': 9999,
  'AI Agency Delivery OS': 5999,
  'MCP Server Launch Kit': 3499,
  'Agent Context Architect': 2999,
  'n8n Production Hardening Pack': 2499,
  'GST Invoice & HSN Compliance Kit': 1499,
  'ITC Recovery Desk': 1499,
  'Ad Creative Lab': 999,
  'Global Client Hunter OS': 999,
  'Content Repurpose Engine': 899,
  'India Offer & Pricing Kit': 699,
};

const args = process.argv.slice(2);
const opt = (name, fallback = '') => {
  const found = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!found) return fallback;
  const eq = found.indexOf('=');
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1] ?? fallback;
};
const flag = (name) => args.includes(`--${name}`);

const inFile = opt('in');
if (!inFile) {
  console.error('Usage: node enrich-leads.mjs --in <leads.json> [--out <file>] [--mx] [--metro-only] [--min-score=65] [--strict]');
  process.exit(1);
}

const inPath = path.resolve(process.cwd(), inFile);
const outPath = path.resolve(process.cwd(), opt('out', inPath.replace(/\.json$/, '-enriched.json')));
const reportPath = path.resolve(process.cwd(), opt('report', outPath.replace(/\.json$/, '-report.md')));
const minScore = parseInt(opt('min-score', '0'), 10) || 0;
const metroOnly = flag('metro-only');
const strict = flag('strict');
const doMx = flag('mx');
const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

let raw;
try {
  raw = JSON.parse(fs.readFileSync(inPath, 'utf8'));
} catch (error) {
  console.error(`Cannot read ${inPath}: ${error.message}`);
  process.exit(1);
}
const leads = Array.isArray(raw) ? raw : Array.isArray(raw.leads) ? raw.leads : null;
if (!leads) {
  console.error('Input must be an array or an object with a leads array.');
  process.exit(1);
}

const normalize = (value) => String(value || '').trim().toLowerCase();
const titleCase = (value) => String(value || '').trim().replace(/\s+/g, ' ');

function canonicalCity(value) {
  const key = normalize(value).replace(/[.,]/g, '').replace(/\s+/g, ' ');
  if (METRO_ALIASES[key]) return METRO_ALIASES[key];
  const partial = Object.keys(METRO_ALIASES).find((alias) => key.includes(alias));
  return partial ? METRO_ALIASES[partial] : titleCase(value);
}

function inferSegment(lead) {
  const haystack = ` ${normalize(`${lead.segment || ''} ${lead.niche || ''} ${lead.company || ''} ${lead.signal || ''}`)} `;
  for (const rule of SEGMENT_RULES) {
    if (rule.words.some((word) => haystack.includes(word))) return rule.key;
  }
  return 'software';
}

function roleTier(title) {
  const t = normalize(title);
  if (/\b(founder|co-founder|cofounder|ceo|md|managing director|owner|proprietor|partner)\b/.test(t)) return 'founder';
  if (/\b(cto|cio|ciso|vp|vice president|head of|chief|president)\b/.test(t)) return 'exec';
  if (/\b(director|principal|general manager)\b/.test(t)) return 'director';
  if (/\b(manager|lead|architect|senior engineer|staff engineer)\b/.test(t)) return 'manager';
  return 'unknown';
}

function roleScore(tier) {
  return { founder: 20, exec: 18, director: 14, manager: 9, unknown: 3 }[tier] ?? 3;
}

function parseEmail(email) {
  const value = normalize(email);
  const match = value.match(/^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+)$/);
  if (!match) return { valid: false, local: '', domain: '' };
  return { valid: true, local: match[1], domain: match[2] };
}

function firstWord(value) {
  return String(value || '').trim().split(/\s+/)[0]?.replace(/[^A-Za-z'-]/g, '') || '';
}

function domainFromLead(lead, parsed) {
  if (lead.domain) return normalize(lead.domain).replace(/^www\./, '');
  if (lead.website) {
    try { return new URL(lead.website).hostname.replace(/^www\./, ''); } catch { /* ignore */ }
  }
  return parsed.domain;
}

function websiteFromLead(lead, domain) {
  if (lead.website && /^https?:\/\//i.test(lead.website)) return lead.website;
  return domain ? `https://${domain}` : '';
}

function signalText(lead) {
  return normalize(`${lead.signal || ''} ${lead.trigger || ''} ${lead.why_now || ''} ${lead.notes || ''}`);
}

function timingScore(signal) {
  let score = 0;
  if (/\b(raised|funding|series [abc]|seed|investment|valuation)\b/.test(signal)) score += 5;
  if (/\b(hiring|hired|job|career|recruit|opening)\b/.test(signal)) score += 4;
  if (/\b(launched|launch|released|shipped|new product|beta)\b/.test(signal)) score += 3;
  if (/\b(migrat|replatform|self-host|pgvector|upgrade)\b/.test(signal)) score += 3;
  if (/\b(cost|bill|spend|budget|margin|compliance|deadline|audit|security)\b/.test(signal)) score += 3;
  return Math.min(10, score);
}

function buildPain(lead, segment) {
  if (lead.pain_hypothesis && String(lead.pain_hypothesis).length >= 20) return lead.pain_hypothesis;
  const city = canonicalCity(lead.city);
  const bySegment = {
    agency: 'Delivery scope expands faster than the proposal, so senior time leaks into unbilled revisions.',
    saas: 'AI features are shipping faster than the cost, context and reliability controls around them.',
    ai: 'Agent and MCP prototypes work in demos but lack security, retry and evaluation gates for production.',
    fintech: 'Invoice, GST and payment workflows still depend on manual checks that break at month-end.',
    d2c: 'Catalogue, order and WhatsApp workflows fail silently during peak campaigns.',
    manufacturing: 'ERP, Tally and export data still move through spreadsheets and manual reconciliation.',
    logistics: 'Warehouse and dispatch automations retry blindly and hide failures until customers complain.',
    healthtech: 'Patient and compliance data workflows need deterministic audit trails before automation.',
    edtech: 'Enrolment and content operations scale faster than the automations supporting them.',
    software: 'AI delivery work is growing faster than the engineering controls around it.',
  };
  const fallback = `Teams in ${city || 'India'} are shipping AI faster than their delivery and cost controls can absorb.`;
  return bySegment[segment] || fallback;
}

function buildHook(lead, first, company, city) {
  if (lead.personalization_hook && String(lead.personalization_hook).length >= 30) return lead.personalization_hook;
  const signal = String(lead.signal || '').trim().replace(/\.$/, '');
  if (first && company && signal) return `${first}, saw ${company} ${signal.charAt(0).toLowerCase()}${signal.slice(1)}.`;
  if (first && company) return `${first}, ${company} is doing serious work in ${city || 'India'} — this is relevant to your delivery stack.`;
  if (company) return `Saw ${company} is building in ${city || 'India'} — this is relevant to your delivery stack.`;
  return `Saw your work in ${city || 'India'} — this is relevant to your delivery stack.`;
}

function buildWhyNow(lead, segment) {
  if (lead.why_now && String(lead.why_now).length >= 10) return lead.why_now;
  const signal = String(lead.signal || '').trim();
  if (signal) return signal;
  return `The ${segment} team is at the stage where ad-hoc AI delivery starts costing more than it returns.`;
}

function qualityFlags(lead, parsed, city, tier, score, segment) {
  const flags = [];
  if (!parsed.valid) flags.push('invalid_email');
  else {
    if (GENERIC_LOCALPARTS.has(parsed.local)) flags.push('generic_inbox');
    if (FREE_DOMAINS.has(parsed.domain)) flags.push('free_email');
  }
  if (!lead.name && !ROLE_ADDRESSES.has(parsed.local)) flags.push('missing_name');
  if (ROLE_ADDRESSES.has(parsed.local)) flags.push('role_based_address');
  if (!lead.title) flags.push('missing_title');
  if (!lead.source_url || !/^https:\/\//i.test(String(lead.source_url))) flags.push('missing_source');
  if (!METROS.has(city)) flags.push('non_metro');
  if (!lead.signal) flags.push('no_signal');
  if (score < 65) flags.push('low_score');
  if (tier === 'unknown') flags.push('unknown_role');
  if (!lead.pain_hypothesis) flags.push('derived_pain');
  if (!lead.personalization_hook) flags.push('derived_hook');
  if (segment === 'software') flags.push('segment_inferred');
  return flags;
}

function scoreLead(lead, ctx) {
  const { parsed, city, tier, segment, domain, signal } = ctx;
  let fit = METROS.has(city) ? 15 : 0;
  fit += segment !== 'software' ? 10 : 4;

  let pain = 0;
  if (lead.pain_hypothesis && String(lead.pain_hypothesis).length >= 20) pain += 10;
  if (signal) pain += 10;
  if (lead.product_fit) pain += 5;

  const authority = roleScore(tier);

  let reach = 0;
  if (parsed.valid) reach += 4;
  if (parsed.valid && !FREE_DOMAINS.has(parsed.domain)) reach += 6;
  if (lead.name) reach += 4;
  if (lead.mx === true) reach += 3;
  if (GENERIC_LOCALPARTS.has(parsed.local)) reach -= 8;
  if (FREE_DOMAINS.has(parsed.domain)) reach -= 4;
  reach = Math.max(0, Math.min(20, reach));

  const timing = timingScore(signal);

  const raw = fit + pain + authority + reach + timing;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

function tierFor(score) {
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

const seen = new Map();
const enriched = [];

for (const lead of leads) {
  const parsed = parseEmail(lead.email);
  const city = canonicalCity(lead.city);
  const segment = lead.segment && PRODUCT_FIT[lead.segment] ? lead.segment : inferSegment(lead);
  const tier = roleTier(lead.title);
  const domain = domainFromLead(lead, parsed);
  const website = websiteFromLead(lead, domain);
  const signal = signalText(lead);

  const ctx = { parsed, city, tier, segment, domain, signal };
  let researchScore = scoreLead(lead, ctx);
  if (lead.research_score && Number.isFinite(Number(lead.research_score))) {
    researchScore = Math.round((Number(lead.research_score) + researchScore) / 2);
  }
  let productFit = lead.product_fit || PRODUCT_FIT[segment] || PRODUCT_FIT.software;
  if (!PRODUCT_PRICES[productFit]) productFit = PRODUCT_FIT.software;

  const first = firstWord(lead.name);
  const company = titleCase(lead.company);
  const pain = buildPain(lead, segment);
  const hook = buildHook(lead, first, company, city);
  const whyNow = buildWhyNow(lead, segment);
  const flags = qualityFlags(lead, parsed, city, tier, researchScore, segment);

  const enrichedLead = {
    id: lead.id || `${city.slice(0, 3).toUpperCase()}-${segment.toUpperCase()}-${String(enriched.length + 1).padStart(3, '0')}`,
    company,
    domain,
    website,
    email: normalize(lead.email),
    name: titleCase(lead.name),
    first_name: first,
    title: titleCase(lead.title),
    role_tier: tier,
    city,
    metro: METROS.has(city),
    segment,
    niche: lead.niche || `${segment} company in ${city}`,
    source_url: lead.source_url || '',
    signal: lead.signal || '',
    tech_stack: Array.isArray(lead.tech_stack) ? lead.tech_stack : lead.tech_stack ? String(lead.tech_stack).split(',').map((s) => s.trim()).filter(Boolean) : [],
    pain_hypothesis: pain,
    personalization_hook: hook,
    why_now: whyNow,
    product_fit: productFit,
    product_price_inr: PRODUCT_PRICES[productFit],
    research_score: researchScore,
    tier: tierFor(researchScore),
    email_status: parsed.valid ? (FREE_DOMAINS.has(parsed.domain) ? 'risky' : 'valid') : 'invalid',
    mx: lead.mx === true ? true : lead.mx === false ? false : null,
    quality_flags: [...new Set(flags)],
    researched_at: lead.researched_at || today,
    notes: lead.notes || '',
  };

  if (enrichedLead.email && seen.has(enrichedLead.email)) {
    const previous = seen.get(enrichedLead.email);
    enrichedLead.quality_flags = [...new Set([...enrichedLead.quality_flags, 'duplicate'])];
    if (enrichedLead.research_score > previous.research_score) {
      const index = enriched.indexOf(previous);
      if (index !== -1) enriched[index] = enrichedLead;
      seen.set(enrichedLead.email, enrichedLead);
    } else {
      previous.quality_flags = [...new Set([...previous.quality_flags, 'duplicate'])];
    }
    continue;
  }

  if (enrichedLead.email) seen.set(enrichedLead.email, enrichedLead);
  enriched.push(enrichedLead);
}

const mxDomain = (lead) => {
  const emailDomain = String(lead.email || '').split('@')[1] || '';
  return FREE_DOMAINS.has(emailDomain) ? emailDomain : lead.domain;
};

if (doMx) {
  const domains = [...new Set(enriched.filter((l) => l.email_status !== 'invalid').map(mxDomain).filter(Boolean))];
  const results = new Map();
  const queue = [...domains];
  const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
    while (queue.length) {
      const domain = queue.shift();
      try {
        const mx = await Promise.race([
          dns.resolveMx(domain),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3500)),
        ]);
        results.set(domain, Array.isArray(mx) && mx.length > 0);
      } catch {
        results.set(domain, false);
      }
    }
  });
  await Promise.all(workers);
  enriched.forEach((lead) => {
    const target = mxDomain(lead);
    if (results.has(target)) {
      lead.mx = results.get(target);
      if (!lead.mx) lead.quality_flags = [...new Set([...lead.quality_flags, 'mx_missing'])];
    }
  });
}

const filtered = enriched
  .filter((lead) => (!metroOnly || lead.metro) && lead.research_score >= minScore)
  .sort((a, b) => b.research_score - a.research_score || a.company.localeCompare(b.company));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2));
fs.writeFileSync(reportPath, renderReport(filtered, { inPath, outPath, minScore, metroOnly, doMx }));

const distribution = (key) => filtered.reduce((acc, lead) => {
  acc[lead[key]] = (acc[lead[key]] || 0) + 1;
  return acc;
}, {});
const tiers = distribution('tier');
const metros = distribution('city');
const segments = distribution('segment');
const flagCounts = filtered.flatMap((lead) => lead.quality_flags).reduce((acc, flag) => {
  acc[flag] = (acc[flag] || 0) + 1;
  return acc;
}, {});

console.log('='.repeat(68));
console.log('🧪 Lead Enrichment — Metro India');
console.log('='.repeat(68));
console.log(`Input:    ${path.relative(process.cwd(), inPath)} (${leads.length} rows)`);
console.log(`Output:   ${path.relative(process.cwd(), outPath)} (${filtered.length} kept)`);
console.log(`Report:   ${path.relative(process.cwd(), reportPath)}`);
console.log(`Tiers:    A ${tiers.A || 0} · B ${tiers.B || 0} · C ${tiers.C || 0} · D ${tiers.D || 0}`);
console.log(`Metros:   ${Object.entries(metros).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}`);
console.log(`Segments: ${Object.entries(segments).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}`);
console.log(`Flags:    ${Object.entries(flagCounts).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}`);
if (filtered.length) {
  console.log('\nTop 10:');
  filtered.slice(0, 10).forEach((lead) => {
    console.log(`  ${String(lead.research_score).padStart(3)} ${lead.tier}  ${lead.name || '—'} · ${lead.company} · ${lead.city} · ${lead.product_fit}`);
  });
}

const invalid = filtered.filter((lead) => lead.email_status === 'invalid');
const low = filtered.filter((lead) => lead.research_score < Math.max(minScore, 65));
if (strict && (invalid.length || low.length || filtered.length === 0)) {
  console.error(`\nSTRICT FAIL: ${invalid.length} invalid emails, ${low.length} below 65, ${filtered.length} total.`);
  process.exit(1);
}

function renderReport(rows, meta) {
  const lines = [];
  lines.push('# Lead Enrichment Report');
  lines.push('');
  lines.push(`**Input:** \`${meta.inPath}\`  `);
  lines.push(`**Output:** \`${meta.outPath}\`  `);
  lines.push(`**Min score:** ${meta.minScore} · **Metro only:** ${meta.metroOnly ? 'yes' : 'no'} · **MX:** ${meta.doMx ? 'yes' : 'no'}`);
  lines.push('');
  lines.push(`**Kept:** ${rows.length}`);
  lines.push('');
  lines.push('## Top Leads');
  lines.push('');
  lines.push('| Score | Tier | Name | Title | Company | City | Segment | Product | Flags |');
  lines.push('|---:|---|---|---|---|---|---|---|---|');
  rows.slice(0, 30).forEach((lead) => {
    lines.push(`| ${lead.research_score} | ${lead.tier} | ${lead.name || '—'} | ${lead.title || '—'} | ${lead.company} | ${lead.city} | ${lead.segment} | ${lead.product_fit} | ${lead.quality_flags.join(', ') || '—'} |`);
  });
  lines.push('');
  lines.push('## Hooks To Use');
  lines.push('');
  rows.slice(0, 15).forEach((lead) => {
    lines.push(`### ${lead.company} — ${lead.name || 'unknown'} (${lead.research_score}/${lead.tier})`);
    lines.push(`- **Hook:** ${lead.personalization_hook}`);
    lines.push(`- **Pain:** ${lead.pain_hypothesis}`);
    lines.push(`- **Why now:** ${lead.why_now}`);
    lines.push(`- **Product:** ${lead.product_fit} · ₹${lead.product_price_inr}`);
    lines.push('');
  });
  return lines.join('\n');
}
