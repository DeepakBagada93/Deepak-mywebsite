#!/usr/bin/env node
/**
 * research-leads.mjs — Metro India deep-research scaffold for deepak-newsletter v3.0
 *
 * Produces a research brief + machine-readable search plan for high-ticket leads
 * in Indian metro cities. The agent then runs the queries with web search, fills
 * the enrichment contract, and validates with enrich-leads.mjs + audit-leads.mjs.
 *
 * Usage:
 *   node research-leads.mjs --metro=all --segment=agency --topic=context
 *   node research-leads.mjs --metro=Bengaluru --segment=saas --count=30
 *   node research-leads.mjs --metro="Delhi NCR" --segment=fintech --out-dir=research
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(HERE, '..');

const METROS = {
  Bengaluru: {
    aliases: ['bangalore', 'bengaluru', 'blr'],
    sectors: ['B2B SaaS', 'AI infrastructure', 'Dev tools', 'Fintech', 'D2C'],
    roles: ['Founder', 'Co-Founder', 'CTO', 'VP Engineering', 'Head of AI', 'Head of Platform'],
    pains: [
      'LLM token spend growing faster than ARR',
      'Agent retries and zombie tool-call loops in production',
      'Context drift across CLAUDE.md, Cursor rules and AGENTS.md',
      'MCP servers shipped without security or auth gates',
    ],
    triggers: ['Series A/B funding', 'hiring AI/ML engineers', 'launched an AI copilot', 'migrating to pgvector or self-hosted models'],
    product_fit: ['AI Systems Master Bundle', 'MCP Server Launch Kit', 'Agent Context Architect'],
  },
  Mumbai: {
    aliases: ['mumbai', 'bombay', 'thane', 'navi mumbai'],
    sectors: ['Fintech', 'BFSI', 'D2C', 'Media', 'Enterprise SaaS'],
    roles: ['Founder', 'Managing Director', 'CTO', 'Head of Digital', 'VP Engineering'],
    pains: [
      'Compliance-heavy agent workflows with no audit trail',
      'Razorpay/Cashfree webhook duplication and reconciliation gaps',
      'WhatsApp support volume with slow first response',
      'Agency retainers leaking margin on scope creep',
    ],
    triggers: ['RBI or compliance deadline', 'festive sale scale-up', 'new CTO hire', 'funding round', 'agency hiring automation leads'],
    product_fit: ['GST Invoice & HSN Compliance Kit', 'AI Agency Delivery OS', 'n8n Production Hardening Pack'],
  },
  'Delhi NCR': {
    aliases: ['delhi', 'new delhi', 'delhi ncr', 'gurgaon', 'gurugram', 'noida', 'greater noida', 'faridabad', 'ghaziabad'],
    sectors: ['SaaS', 'Edtech', 'Healthtech', 'Agencies', 'Public sector tech'],
    roles: ['Founder', 'Co-Founder', 'CTO', 'VP Engineering', 'Head of AI', 'Director of Technology'],
    pains: [
      'Enterprise procurement demands security proof before an AI pilot',
      'Agent demos work, production deployments stall',
      'Tally/Zoho/SAP integrations break at month-end',
      'Token costs rise after every prompt iteration',
    ],
    triggers: ['government or enterprise RFP', 'Series A', 'new AI practice launch', 'hiring automation engineers'],
    product_fit: ['AI Systems Master Bundle', 'MCP Server Launch Kit', 'AI Agency Delivery OS'],
  },
  Pune: {
    aliases: ['pune', 'pimpri', 'chinchwad'],
    sectors: ['Engineering services', 'Manufacturing tech', 'SaaS', 'Automotive', 'Agencies'],
    roles: ['Founder', 'CTO', 'VP Engineering', 'Head of Automation', 'Delivery Head'],
    pains: [
      'Client delivery teams rework the same AI agent scaffolding',
      'Manufacturing ERP data is trapped in Excel and Tally',
      'n8n workflows fail silently at month-end',
      'Senior engineers spend days on proposal and scope documents',
    ],
    triggers: ['new client contract', 'plant digitisation project', 'hiring AI engineers', 'agency expansion'],
    product_fit: ['AI Agency Delivery OS', 'n8n Production Hardening Pack', 'AI Systems Master Bundle'],
  },
  Hyderabad: {
    aliases: ['hyderabad', 'secunderabad', 'hitec city', 'gachibowli'],
    sectors: ['Enterprise SaaS', 'Pharma tech', 'AI services', 'BFSI', 'Global capability centres'],
    roles: ['Founder', 'CTO', 'VP Engineering', 'Head of AI', 'Director of Engineering'],
    pains: [
      'Global client security reviews block MCP adoption',
      'Agent evaluation and regression testing are manual',
      'Cloud token bills are billed in USD and hurt margins',
      'Multiple delivery teams use conflicting coding-agent rules',
    ],
    triggers: ['new GCC setup', 'enterprise AI pilot', 'Series B', 'hiring platform engineers'],
    product_fit: ['MCP Server Launch Kit', 'Agent Context Architect', 'AI Systems Master Bundle'],
  },
  Chennai: {
    aliases: ['chennai', 'madras', 'omr'],
    sectors: ['SaaS', 'Manufacturing', 'Logistics', 'Healthcare', 'IT services'],
    roles: ['Founder', 'CTO', 'Head of Technology', 'VP Engineering', 'Delivery Director'],
    pains: [
      'Logistics and warehouse agents need deterministic retries',
      'IT services teams need white-label AI delivery assets',
      'Manual GST and invoice checks consume finance hours',
      'Client handovers lack runbooks and acceptance gates',
    ],
    triggers: ['new logistics contract', 'GST audit season', 'AI practice launch', 'funding'],
    product_fit: ['AI Agency Delivery OS', 'GST Invoice & HSN Compliance Kit', 'n8n Production Hardening Pack'],
  },
  Kolkata: {
    aliases: ['kolkata', 'calcutta', 'salt lake', 'new town'],
    sectors: ['Agencies', 'D2C', 'Edtech', 'Manufacturing', 'IT services'],
    roles: ['Founder', 'Managing Director', 'CTO', 'Head of Digital', 'Delivery Head'],
    pains: [
      'Small agency teams underprice and overdeliver',
      'Client reporting is manual and slow',
      'WhatsApp commerce workflows break during peak season',
      'AI pilots never reach production sign-off',
    ],
    triggers: ['festive campaign', 'new agency contract', 'hiring automation lead', 'funding'],
    product_fit: ['AI Agency Delivery OS', 'n8n Production Hardening Pack', 'Agent Context Architect'],
  },
  Ahmedabad: {
    aliases: ['ahmedabad', 'amdavad', 'gandhinagar'],
    sectors: ['Manufacturing', 'Textiles', 'Chemicals', 'Pharma', 'D2C', 'Agencies'],
    roles: ['Founder', 'Managing Director', 'CTO', 'Head of IT', 'Export Head'],
    pains: [
      'Catalogue and ERP sync delays at 18:00',
      'Tally-to-Postgres reconciliation errors',
      'Export documentation and GST checks are manual',
      'Agency proposals leak scope before signing',
    ],
    triggers: ['export season', 'plant digitisation', 'new ERP rollout', 'agency growth'],
    product_fit: ['n8n Production Hardening Pack', 'GST Invoice & HSN Compliance Kit', 'AI Agency Delivery OS'],
  },
};

const SEGMENTS = {
  all: { label: 'All high-ticket segments', match: [], product: 'AI Systems Master Bundle' },
  saas: { label: 'B2B SaaS & product startups', match: ['saas', 'b2b', 'platform', 'software product'], product: 'AI Systems Master Bundle' },
  ai: { label: 'AI infrastructure & agent studios', match: ['ai', 'agent', 'llm', 'ml', 'automation'], product: 'MCP Server Launch Kit' },
  agency: { label: 'Digital agencies & software houses', match: ['agency', 'studio', 'software house', 'consulting', 'freelance', 'development'], product: 'AI Agency Delivery OS' },
  fintech: { label: 'Fintech, BFSI & compliance', match: ['fintech', 'payments', 'lending', 'insurance', 'gst', 'invoice', 'compliance'], product: 'GST Invoice Compliance Kit' },
  d2c: { label: 'D2C, retail & ecommerce', match: ['d2c', 'ecommerce', 'retail', 'brand', 'catalogue', 'catalog'], product: 'n8n Production Hardening Pack' },
  performance: { label: 'Performance marketing, D2C growth & media buying', match: ['performance marketing', 'media buying', 'paid ads', 'd2c', 'growth', 'advertising', 'creative agency'], product: 'Ad Creative Lab' },
  manufacturing: { label: 'Manufacturing & exports', match: ['manufacturing', 'textile', 'ceramic', 'chemical', 'export', 'industrial'], product: 'n8n Production Hardening Pack' },
  logistics: { label: 'Logistics & supply chain', match: ['logistics', 'supply chain', 'warehouse', 'delivery'], product: 'n8n Production Hardening Pack' },
  healthtech: { label: 'Healthtech & pharma', match: ['health', 'medtech', 'clinic', 'hospital', 'pharma'], product: 'AI Systems Master Bundle' },
  edtech: { label: 'Edtech & coaching', match: ['edtech', 'education', 'learning', 'coaching'], product: 'AI Systems Master Bundle' },
};

const TOPIC_QUERIES = {
  agents: ['"autonomous agents"', '"multi-agent"', '"LangGraph" OR "Pydantic-AI" OR "CrewAI"'],
  mcp: ['"Model Context Protocol"', '"MCP server"', '"FastMCP" OR "MCP security"'],
  context: ['"CLAUDE.md" OR "AGENTS.md" OR "Cursor rules"', '"context engineering"', '"prompt drift"'],
  costs: ['"OpenAI API bill" OR "LLM spend"', '"token cost" OR "inference cost"', '"self-hosted LLM"'],
  web: ['"Next.js 15"', '"Laravel 12"', '"pgvector" OR "sub-second TTFB"'],
  whatsapp: ['"WhatsApp Business API"', '"WhatsApp automation"', '"n8n WhatsApp"'],
  data: ['"pgvector" OR "Postgres RAG"', '"Tally integration" OR "Zoho CRM integration"', '"data pipeline"'],
  adcreative: ['"Meta ads" OR "Facebook ads"', '"Google Ads" OR "performance marketing"', '"ad creative" OR "UGC scripts"', '"ROAS" OR "CPA"'],
};

const PRODUCT_CATALOG = {
  'AI Systems Master Bundle': { price_inr: 9999, compare_inr: 19999, slug: 'agent-skills-master-bundle', outcome: 'Four production toolkits for AI delivery, context, MCP and n8n.' },
  'AI Agency Delivery OS': { price_inr: 5999, compare_inr: 11999, slug: 'agency-delivery-os', outcome: 'Ten phase-gated artifacts from one client intake.' },
  'MCP Server Launch Kit': { price_inr: 3499, compare_inr: 6999, slug: 'mcp-server-launch-kit', outcome: 'Ship a secure MCP server from one spec, with zero dependencies.' },
  'Agent Context Architect': { price_inr: 2999, compare_inr: 5999, slug: 'agent-context-architect', outcome: 'Compile conflicting agent rules into one sub-300 token kernel.' },
  'n8n Production Hardening Pack': { price_inr: 2499, compare_inr: 4999, slug: 'n8n-hardening-pack', outcome: 'Audit n8n exports and patch silent production failures.' },
  'GST Invoice & HSN Compliance Kit': { price_inr: 1499, compare_inr: 3999, slug: 'gst-invoice-compliance-kit', outcome: 'Audit GST invoices across eight statutory checks offline.' },
  'ITC Recovery Desk': { price_inr: 1499, compare_inr: 3999, slug: 'itc-recovery-desk', outcome: 'Reconcile purchase registers against GSTR-2B and recover blocked input tax credit.' },
  'Ad Creative Lab': { price_inr: 999, compare_inr: 1499, slug: 'ad-creative-lab', outcome: 'Audit ad copy and build a break-even CPA test matrix before spending.' },
  'Content Repurpose Engine': { price_inr: 899, compare_inr: 2499, slug: 'content-repurpose-engine', outcome: 'Turn one source asset into a 30-day platform-native content calendar.' },
  'India Offer & Pricing Kit': { price_inr: 699, compare_inr: 1999, slug: 'india-offer-pricing-kit', outcome: 'Model costs, price ladders and break-even CPA for the Indian market.' },
};

const SCORING_RUBRIC = {
  fit: { max: 25, rules: ['Metro city +15', 'Segment match +10', 'Adjacent segment +4'] },
  pain: { max: 25, rules: ['Named pain hypothesis +10', 'Trigger signal +10', 'Product fit mapped +5'] },
  authority: { max: 20, rules: ['Founder/CEO/MD +20', 'CTO/VP/Head +18', 'Director +14', 'Manager +9', 'Unknown +3'] },
  reachability: { max: 20, rules: ['Valid email +4', 'Company-domain email +6', 'Named person +4', 'MX verified +3', 'Generic inbox -8', 'Free inbox -4'] },
  timing: { max: 10, rules: ['Funding/raised +5', 'Hiring +4', 'Launch +3', 'Migration +3', 'Cost/compliance trigger +3'] },
};

const ENRICHMENT_CONTRACT = {
  required: ['id', 'company', 'domain', 'website', 'email', 'name', 'title', 'city', 'metro', 'segment', 'niche', 'source_url', 'signal', 'tech_stack', 'pain_hypothesis', 'personalization_hook', 'why_now', 'product_fit', 'research_score', 'tier', 'email_status', 'quality_flags', 'researched_at'],
  notes: {
    signal: 'A dated, verifiable trigger: funding, hiring, launch, migration, compliance deadline, or public post.',
    pain_hypothesis: 'One sentence tying the company context to a product-relevant failure mode. No generic claims.',
    personalization_hook: 'The exact opening line the email will use. Must reference a real, specific detail.',
    source_url: 'Public URL that proves the company/role/signal. No scraped databases or guesswork.',
    research_score: 'Computed by enrich-leads.mjs, 0-100. Do not hand-write.',
  },
};

const QUALITY_GATES = [
  'Metro city only (Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad).',
  'Named decision-maker or role-based company email. No info@, contact@, sales@, hello@, support@.',
  'Source URL is public and https. No Apollo/ZoomInfo/Lusha exports.',
  'Signal is dated within 90 days and specific to the company.',
  'Personalization hook is at least 30 characters and names a real detail.',
  'Research score >= 65 for Tier B, >= 80 for Tier A. Send only A/B.',
  'One bounce halts the batch. Re-verify before resuming.',
];

const args = process.argv.slice(2);
const opt = (name, fallback = '') => {
  const found = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!found) return fallback;
  const eq = found.indexOf('=');
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1] ?? fallback;
};

const rawMetro = opt('metro', 'all');
const rawSegment = opt('segment', 'all');
const rawTopic = opt('topic', 'agents');
const perCity = Math.max(5, parseInt(opt('count', '25'), 10) || 25);
const outDir = path.resolve(process.cwd(), opt('out-dir', path.join(SKILL_ROOT, 'research')));
const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
const date = opt('date', istNow.toISOString().slice(0, 10));

const normalize = (value) => String(value || '').trim().toLowerCase();
const metroKeys = rawMetro === 'all'
  ? Object.keys(METROS)
  : Object.keys(METROS).filter((key) => METROS[key].aliases.includes(normalize(rawMetro)) || normalize(key) === normalize(rawMetro));

if (!metroKeys.length) {
  console.error(`Unknown metro: ${rawMetro}`);
  console.error(`Choose one of: ${Object.keys(METROS).join(', ')}, all`);
  process.exit(1);
}

const segmentKey = Object.keys(SEGMENTS).includes(normalize(rawSegment)) ? normalize(rawSegment) : 'all';
const topicKey = Object.keys(TOPIC_QUERIES).includes(normalize(rawTopic)) ? normalize(rawTopic) : 'agents';
const topicQueries = TOPIC_QUERIES[topicKey];

const searchPlan = metroKeys.map((metro) => {
  const profile = METROS[metro];
  const segment = SEGMENTS[segmentKey];
  const roleQuery = profile.roles.map((r) => `"${r}"`).join(' OR ');
  const sectorQuery = profile.sectors.map((s) => `"${s}"`).join(' OR ');
  const segmentQuery = segment.match.length ? segment.match.map((m) => `"${m}"`).join(' OR ') : sectorQuery;

  return {
    metro,
    target_leads: perCity,
    priority: metro === 'Bengaluru' || metro === 'Mumbai' || metro === 'Delhi NCR' ? 'P1' : 'P2',
    queries: {
      linkedin_people: `site:linkedin.com/in (${roleQuery}) "${metro}" (${segmentQuery}) (${topicQueries.join(' OR ')})`,
      linkedin_companies: `site:linkedin.com/company "${metro}" (${sectorQuery}) ("Series A" OR "Series B" OR "funding" OR "hiring")`,
      funding_news: `(site:inc42.com OR site:yourstory.com OR site:entrackr.com) "${metro}" ("raised" OR "funding") (${segmentQuery}) 2026`,
      hiring: `(site:wellfound.com OR site:instahyre.com OR site:naukri.com) "${metro}" ("AI engineer" OR "ML engineer" OR "automation engineer")`,
      github: `site:github.com "${metro}" (${topicQueries.join(' OR ')})`,
      x_twitter: `"${metro}" ("token bill" OR "agent retries" OR "MCP server" OR "context drift")`,
      email_discovery: `"${metro}" (${roleQuery}) (${sectorQuery}) ("email" OR "@") -site:apollo.io -site:zoominfo.com -site:lusha.com`,
    },
    sources: ['LinkedIn', 'Company website', 'Inc42 / YourStory / Entrackr', 'Wellfound / Instahyre', 'GitHub', 'X/Twitter', 'Product Hunt'],
  };
});

const brief = {
  version: '3.0',
  generated_at: new Date().toISOString(),
  target: { metros: metroKeys, segment: SEGMENTS[segmentKey].label, topic: topicKey, per_city: perCity, total_target: perCity * metroKeys.length },
  strategy: {
    primary_market: 'Indian metro cities',
    secondary_market: 'Gujarat industrial belt (Ahmedabad, Surat, Rajkot, Vadodara)',
    ticket_size_inr: '₹699 – ₹9,999 digital products; ₹3L – ₹25L custom builds',
    outreach_mode: 'Founder-to-founder technical value email, no calendar links',
    product_first: 'Lead with the paid product; custom build is the reply conversation, not the pitch.',
  },
  metro_profiles: metroKeys.map((metro) => ({ metro, ...METROS[metro] })),
  segment: SEGMENTS[segmentKey],
  topic_queries: topicQueries,
  search_plan: searchPlan,
  product_catalog: PRODUCT_CATALOG,
  scoring_rubric: SCORING_RUBRIC,
  enrichment_contract: ENRICHMENT_CONTRACT,
  quality_gates: QUALITY_GATES,
  agent_checklist: [
    'Run each search query with web search and collect public evidence, not database dumps.',
    'Open the company site and the decision-maker profile. Record the exact source URL.',
    'Capture one dated signal per lead (funding, hiring, launch, migration, compliance, public post).',
    'Write the pain hypothesis in one sentence tied to the signal and the product.',
    'Write the personalization hook as the literal first line of the email.',
    'Map the best product from product_catalog. Do not default every lead to the bundle.',
    'Run enrich-leads.mjs, then audit-leads.mjs. Fix every FAIL before drafting.',
  ],
  next_commands: [
    `node .agent/skills/deepak-newsletter/scripts/enrich-leads.mjs --in research/leads-${date}.json --out research/leads-${date}-enriched.json --mx`,
    `node .agent/skills/deepak-newsletter/scripts/audit-leads.mjs --file research/leads-${date}-enriched.json --min-score=65 --metro-only`,
  ],
};

fs.mkdirSync(outDir, { recursive: true });
const jsonPath = path.join(outDir, `research-brief-${date}-${metroKeys.length === 1 ? normalize(metroKeys[0]).replace(/\s+/g, '-') : 'all'}-${segmentKey}.json`);
const mdPath = jsonPath.replace(/\.json$/, '.md');
fs.writeFileSync(jsonPath, JSON.stringify(brief, null, 2));
fs.writeFileSync(mdPath, renderMarkdown(brief));

console.log('='.repeat(68));
console.log('🔎 deepak-newsletter v3.0 — Metro India Deep Research Brief');
console.log('='.repeat(68));
console.log(`Metros:  ${metroKeys.join(', ')}`);
console.log(`Segment: ${SEGMENTS[segmentKey].label}`);
console.log(`Topic:   ${topicKey}`);
console.log(`Target:  ${perCity} leads/city · ${brief.target.total_target} total`);
console.log(`JSON:    ${path.relative(process.cwd(), jsonPath)}`);
console.log(`Brief:   ${path.relative(process.cwd(), mdPath)}`);
console.log('\nNext: run the search plan, fill the enrichment contract, then:');
brief.next_commands.forEach((c) => console.log(`  ${c}`));

function renderMarkdown(b) {
  const lines = [];
  lines.push(`# Metro India Lead Research Brief — ${b.target.metros.join(', ')}`);
  lines.push('');
  lines.push(`**Generated:** ${b.generated_at}  `);
  lines.push(`**Segment:** ${b.target.segment}  `);
  lines.push(`**Topic:** ${b.target.topic}  `);
  lines.push(`**Target:** ${b.target.per_city} leads/city · ${b.target.total_target} total  `);
  lines.push(`**Ticket size:** ${b.strategy.ticket_size_inr}`);
  lines.push('');
  lines.push('> Primary market is Indian metro cities. Gujarat is the secondary industrial belt. Do not dilute the batch with non-metro leads.');
  lines.push('');
  lines.push('## Metro Profiles');
  lines.push('');
  lines.push('| Metro | Priority | Sectors | Target roles | Product fit |');
  lines.push('|---|---|---|---|---|');
  b.search_plan.forEach((plan) => {
    const p = b.metro_profiles.find((m) => m.metro === plan.metro);
    lines.push(`| ${plan.metro} | ${plan.priority} | ${p.sectors.join(', ')} | ${p.roles.join(', ')} | ${p.product_fit.join(', ')} |`);
  });
  lines.push('');
  lines.push('## Pain Hooks By Metro');
  lines.push('');
  b.metro_profiles.forEach((m) => {
    lines.push(`### ${m.metro}`);
    lines.push(`- **Pains:** ${m.pains.join(' · ')}`);
    lines.push(`- **Triggers:** ${m.triggers.join(' · ')}`);
    lines.push('');
  });
  lines.push('## Search Plan');
  lines.push('');
  b.search_plan.forEach((plan) => {
    lines.push(`### ${plan.metro} — ${plan.target_leads} leads`);
    Object.entries(plan.queries).forEach(([key, query]) => lines.push(`- **${key}:** \`${query}\``));
    lines.push('');
  });
  lines.push('## Scoring Rubric (0–100)');
  lines.push('');
  lines.push('| Dimension | Max | Rules |');
  lines.push('|---|---|---|');
  Object.entries(b.scoring_rubric).forEach(([name, rule]) => {
    lines.push(`| ${name} | ${rule.max} | ${rule.rules.join('; ')} |`);
  });
  lines.push('');
  lines.push('Tier A ≥ 80, Tier B ≥ 65, Tier C ≥ 50. Send only A/B.');
  lines.push('');
  lines.push('## Enrichment Contract');
  lines.push('');
  lines.push('Required fields:');
  lines.push('');
  lines.push(`\`${b.enrichment_contract.required.join('`, `')}\``);
  lines.push('');
  Object.entries(b.enrichment_contract.notes).forEach(([field, note]) => {
    lines.push(`- **${field}:** ${note}`);
  });
  lines.push('');
  lines.push('## Quality Gates');
  lines.push('');
  b.quality_gates.forEach((gate) => lines.push(`- ${gate}`));
  lines.push('');
  lines.push('## Agent Checklist');
  lines.push('');
  b.agent_checklist.forEach((item, index) => lines.push(`${index + 1}. ${item}`));
  lines.push('');
  lines.push('## Next Commands');
  lines.push('');
  lines.push('```bash');
  b.next_commands.forEach((cmd) => lines.push(cmd));
  lines.push('```');
  lines.push('');
  return lines.join('\n');
}
