#!/usr/bin/env node
/**
 * audit-leads.mjs — Hard gate before any metro product campaign.
 *
 * Usage:
 *   node audit-leads.mjs --file research/leads-enriched.json --min-score=65 --metro-only
 *   node audit-leads.mjs --file leads.json --out reports/lead-audit.md --allow-free
 *
 * Exit 1 on any FAIL. Warnings do not block.
 */

import fs from 'node:fs';
import path from 'node:path';

const METROS = new Set(['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad']);
const GENERIC = new Set(['info', 'contact', 'hello', 'hi', 'sales', 'support', 'admin', 'office', 'enquiry', 'enquiries', 'inquiry', 'help', 'care', 'hr', 'jobs', 'marketing', 'billing', 'accounts', 'no-reply', 'noreply', 'webmaster', 'press', 'media']);
const ROLE_ADDRESSES = new Set(['founder', 'founders', 'ceo', 'cto', 'coo', 'cfo', 'team', 'leadership', 'engineering', 'tech']);
const FREE = new Set(['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com', 'live.com', 'rediffmail.com', 'icloud.com', 'protonmail.com', 'aol.com', 'mail.com', 'zoho.com']);
const REQUIRED = ['company', 'email', 'name', 'title', 'city', 'segment', 'source_url', 'signal', 'pain_hypothesis', 'personalization_hook', 'why_now', 'product_fit', 'research_score'];

const args = process.argv.slice(2);
const opt = (name, fallback = '') => {
  const found = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!found) return fallback;
  const eq = found.indexOf('=');
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1] ?? fallback;
};
const flag = (name) => args.includes(`--${name}`);

const file = opt('file');
if (!file) {
  console.error('Usage: node audit-leads.mjs --file <leads.json> [--min-score=65] [--metro-only] [--out report.md] [--allow-generic] [--allow-free]');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), file);
const minScore = parseInt(opt('min-score', '65'), 10) || 65;
const metroOnly = flag('metro-only');
const allowGeneric = flag('allow-generic');
const allowFree = flag('allow-free');
const outPath = path.resolve(process.cwd(), opt('out', filePath.replace(/\.json$/, '-audit.md')));
const maxAgeDays = parseInt(opt('max-age', '90'), 10) || 90;

let raw;
try {
  raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (error) {
  console.error(`Cannot read ${filePath}: ${error.message}`);
  process.exit(1);
}
const leads = Array.isArray(raw) ? raw : Array.isArray(raw.leads) ? raw.leads : null;
if (!leads) {
  console.error('Input must be an array or an object with a leads array.');
  process.exit(1);
}

const normalize = (value) => String(value || '').trim().toLowerCase();
const now = Date.now();
const seen = new Map();
const results = [];

for (const lead of leads) {
  const fails = [];
  const warns = [];
  const email = normalize(lead.email);
  const [local, domain] = email.split('@');
  const roleBased = ROLE_ADDRESSES.has(local);

  for (const field of REQUIRED) {
    if (field === 'name' && roleBased) continue;
    if (lead[field] === undefined || lead[field] === null || String(lead[field]).trim() === '') fails.push(`missing_${field}`);
  }

  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(email)) {
    fails.push('invalid_email');
  }

  if (email && seen.has(email)) {
    fails.push(`duplicate_of_${seen.get(email)}`);
  } else if (email) {
    seen.set(email, lead.id || lead.company || 'unknown');
  }

  if (GENERIC.has(local) && !allowGeneric) fails.push('generic_inbox');
  if (FREE.has(domain) && !allowFree) warns.push('free_email');
  if (metroOnly && !METROS.has(lead.city)) fails.push('non_metro');
  if (Number(lead.research_score || 0) < minScore) fails.push(`score_below_${minScore}`);
  if (!lead.metro) warns.push('metro_flag_false');
  if (!/^https:\/\//i.test(String(lead.source_url || ''))) fails.push('source_not_https');
  if (String(lead.personalization_hook || '').length < 30) fails.push('hook_too_short');
  if (String(lead.signal || '').length < 8) fails.push('signal_too_weak');
  if (String(lead.pain_hypothesis || '').length < 20) warns.push('pain_thin');
  if (!lead.why_now || String(lead.why_now).length < 10) warns.push('why_now_thin');
  if (['unknown'].includes(lead.role_tier)) fails.push('unknown_role');
  if (['manager'].includes(lead.role_tier)) warns.push('non_decision_maker');
  if (lead.mx === false) fails.push('mx_missing');
  if (lead.mx === null || lead.mx === undefined) warns.push('mx_unverified');
  if (lead.email_status === 'invalid') fails.push('email_status_invalid');
  if (lead.email_status === 'risky') warns.push('email_status_risky');

  const researched = Date.parse(lead.researched_at || '');
  if (!Number.isFinite(researched)) warns.push('researched_at_missing');
  else if ((now - researched) / 86400000 > maxAgeDays) warns.push('research_stale');

  if (!lead.product_fit) warns.push('product_fit_missing');
  if (!Array.isArray(lead.tech_stack) || lead.tech_stack.length === 0) warns.push('tech_stack_missing');
  if (!roleBased && (!lead.name || lead.name.split(/\s+/).length < 2)) warns.push('name_incomplete');
  if (roleBased) warns.push('role_based_address');

  results.push({ lead, fails: [...new Set(fails)], warns: [...new Set(warns)] });
}

const failed = results.filter((r) => r.fails.length > 0);
const warned = results.filter((r) => r.fails.length === 0 && r.warns.length > 0);
const passed = results.filter((r) => r.fails.length === 0);

const flagCounts = results.flatMap((r) => [...r.fails, ...r.warns]).reduce((acc, flag) => {
  acc[flag] = (acc[flag] || 0) + 1;
  return acc;
}, {});

const lines = [];
lines.push('# Metro Lead Audit');
lines.push('');
lines.push(`**File:** \`${path.relative(process.cwd(), filePath)}\`  `);
lines.push(`**Rules:** min score ${minScore} · metro only ${metroOnly ? 'yes' : 'no'} · generic inboxes ${allowGeneric ? 'allowed' : 'blocked'} · free email ${allowFree ? 'allowed' : 'warn'}  `);
lines.push(`**Result:** ${failed.length ? '❌ FAIL' : '✅ PASS'} — ${passed.length}/${results.length} clean, ${failed.length} failed, ${warned.length} warned.`);
lines.push('');
lines.push('## Issue Counts');
lines.push('');
lines.push('| Issue | Count |');
lines.push('|---|---:|');
Object.entries(flagCounts).sort((a, b) => b[1] - a[1]).forEach(([flag, count]) => lines.push(`| ${flag} | ${count} |`));
lines.push('');

if (failed.length) {
  lines.push('## Failed Leads');
  lines.push('');
  lines.push('| Score | Company | Email | City | Fails | Warns |');
  lines.push('|---:|---|---|---|---|---|');
  failed.forEach(({ lead, fails, warns }) => {
    lines.push(`| ${lead.research_score ?? '—'} | ${lead.company || '—'} | ${lead.email || '—'} | ${lead.city || '—'} | ${fails.join(', ')} | ${warns.join(', ') || '—'} |`);
  });
  lines.push('');
}

lines.push('## Sendable Leads');
lines.push('');
lines.push('| Score | Tier | Name | Company | Email | City | Product |');
lines.push('|---:|---|---|---|---|---|---|');
passed
  .sort((a, b) => (b.lead.research_score || 0) - (a.lead.research_score || 0))
  .forEach(({ lead }) => {
    lines.push(`| ${lead.research_score} | ${lead.tier || '—'} | ${lead.name} | ${lead.company} | ${lead.email} | ${lead.city} | ${lead.product_fit} |`);
  });
lines.push('');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join('\n'));

console.log('='.repeat(68));
console.log('🛡️  Metro Lead Audit');
console.log('='.repeat(68));
console.log(`File:   ${path.relative(process.cwd(), filePath)} (${results.length} leads)`);
console.log(`Report: ${path.relative(process.cwd(), outPath)}`);
console.log(`Result: ${failed.length ? '❌ FAIL' : '✅ PASS'} · ${passed.length} clean · ${failed.length} failed · ${warned.length} warned`);
if (Object.keys(flagCounts).length) {
  console.log(`Issues: ${Object.entries(flagCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
}
if (failed.length) {
  console.log('\nFix before sending:');
  failed.slice(0, 10).forEach(({ lead, fails }) => console.log(`  ${lead.company || lead.email || 'unknown'} — ${fails.join(', ')}`));
  process.exit(1);
}
