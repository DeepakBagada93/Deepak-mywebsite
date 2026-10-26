#!/usr/bin/env node

/**
 * High-Ticket Business & Lead Discovery Engine for Deepak Bagada
 * Generates high-intent search queries targeting high-value B2B tech decision-makers
 * ($5K–$50K+ / ₹3L–₹25L+ ticket size: Series A/B startups, funded scaleups, high-margin agencies, and enterprise CTOs).
 *
 * Supported Regions:
 *   --region=India|US|AU|Dubai|UK
 *   --metro=all|Bengaluru|Mumbai|"Delhi NCR"|Pune|Hyderabad|Chennai|Kolkata|Ahmedabad
 *   --segment=all|saas|ai|agency|fintech|d2c|manufacturing|logistics|healthtech|edtech
 *
 * India is metro-first by default. Gujarat is the secondary industrial belt.
 *
 * Usage:
 *   node discover-leads.mjs --region=India --metro=all --segment=agency --topic=agents
 *   node discover-leads.mjs --region=India --metro=Bengaluru --topic=costs
 *   node discover-leads.mjs --region=US --topic=agents
 */

const REGION_DATA = {
  India: {
    name: 'India (Metro Startups & Regional Enterprises)',
    cities: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Surat'],
    roleKeywords: [
      '"Founder" OR "Co-Founder" ("Series A" OR "funded" OR "SaaS")',
      '"Chief Technology Officer" OR "CTO" ("Bengaluru" OR "Bangalore" OR "Mumbai" OR "Pune")',
      '"Head of AI" OR "VP Engineering" ("product" OR "scaleup")',
      '"Managing Director" OR "Director" ("Manufacturing" OR "Exports" OR "Textiles" OR "D2C" OR "Fintech")',
      '"Digital Agency Founder" OR "Software Dev Agency Owner"',
    ],
    fundingSignals: [
      '"backed by Peak XV" OR "backed by Elevation" OR "backed by Blume" OR "backed by Matrix"',
      '"Series A" OR "Series B" "India"',
      '"profitable SaaS" OR "bootstrapped SaaS India"',
      '"ARR" ("₹10 Cr" OR "₹25 Cr" OR "₹50 Cr" OR "$2M" OR "$5M")',
    ],
  },
  US: {
    name: 'United States',
    cities: ['San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Los Angeles'],
    roleKeywords: [
      '"Founder" OR "Co-Founder" "Series A" OR "Series B"',
      '"Chief Technology Officer" OR "CTO" "SaaS"',
      '"Head of AI" OR "VP of Engineering" ("startup" OR "scaleup")',
      '"Digital Agency Founder" OR "Managing Director" ("50+ employees" OR "20+ developers")',
    ],
    fundingSignals: ['"Series A" OR "Series B"', '"Seed round" "backed by"', '"raised $"', '"ARR" "$5M" OR "$10M"'],
  },
  AU: {
    name: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    roleKeywords: [
      '"Founder" OR "Managing Director" "SaaS"',
      '"CTO" OR "Head of Technology" "Australia"',
      '"Digital Product Agency" "Founder" OR "Director"',
      '"Head of Engineering" ("Sydney" OR "Melbourne")',
    ],
    fundingSignals: ['"backed by" OR "Series A"', '"fastest growing" OR "AFR Fast 100"', '"scaleup"'],
  },
  Dubai: {
    name: 'Dubai / UAE',
    cities: ['Dubai', 'Abu Dhabi'],
    roleKeywords: [
      '"Managing Director" OR "CEO" "AI"',
      '"Chief Technology Officer" OR "CTO" "DIFC" OR "Internet City"',
      '"Head of Digital Transformation" OR "Head of AI"',
      '"Tech Founder" "Dubai"',
    ],
    fundingSignals: ['"DIFC Innovation Hub" OR "Hub71"', '"backed by" OR "expansion"', '"enterprise"'],
  },
  UK: {
    name: 'United Kingdom / Europe',
    cities: ['London', 'Berlin', 'Amsterdam'],
    roleKeywords: [
      '"CTO" OR "VP Engineering" "London"',
      '"AI Founder" OR "Co-Founder" ("Series A" OR "Seed")',
      '"Head of AI" OR "Principal Architect"',
      '"Software Agency Founder" OR "Managing Director"',
    ],
    fundingSignals: ['"Series A" OR "Series B"', '"backed by Index" OR "backed by Balderton"', '"scaleup"'],
  },
};

const METRO_PLAYBOOK = {
  Bengaluru: {
    priority: 'P1',
    pains: ['token spend outrunning ARR', 'agent retries in production', 'context drift across CLAUDE.md / Cursor rules', 'MCP servers without security gates'],
    products: ['AI Systems Master Bundle', 'MCP Server Launch Kit', 'Agent Context Architect'],
  },
  Mumbai: {
    priority: 'P1',
    pains: ['compliance-heavy agent workflows', 'payment webhook reconciliation', 'WhatsApp support volume', 'agency scope creep'],
    products: ['GST Invoice & HSN Compliance Kit', 'AI Agency Delivery OS', 'n8n Production Hardening Pack'],
  },
  'Delhi NCR': {
    priority: 'P1',
    pains: ['enterprise security reviews stalling pilots', 'Tally/Zoho/SAP integration breaks', 'token cost after every prompt change', 'AI demos that never ship'],
    products: ['AI Systems Master Bundle', 'MCP Server Launch Kit', 'AI Agency Delivery OS'],
  },
  Pune: {
    priority: 'P2',
    pains: ['repeated agent scaffolding across clients', 'ERP data trapped in Excel', 'silent n8n failures', 'proposal and scope rework'],
    products: ['AI Agency Delivery OS', 'n8n Production Hardening Pack', 'AI Systems Master Bundle'],
  },
  Hyderabad: {
    priority: 'P2',
    pains: ['global client security reviews', 'manual agent regression testing', 'USD token bills', 'conflicting coding-agent rules'],
    products: ['MCP Server Launch Kit', 'Agent Context Architect', 'AI Systems Master Bundle'],
  },
  Chennai: {
    priority: 'P2',
    pains: ['logistics retries', 'white-label AI delivery assets', 'manual GST checks', 'missing handover runbooks'],
    products: ['AI Agency Delivery OS', 'GST Invoice & HSN Compliance Kit', 'n8n Production Hardening Pack'],
  },
  Kolkata: {
    priority: 'P2',
    pains: ['underpriced agency delivery', 'manual client reporting', 'WhatsApp commerce peak failures', 'AI pilots stuck before sign-off'],
    products: ['AI Agency Delivery OS', 'n8n Production Hardening Pack', 'Agent Context Architect'],
  },
  Ahmedabad: {
    priority: 'P2',
    pains: ['catalogue/ERP sync delays', 'Tally-to-Postgres errors', 'manual export documentation', 'agency scope leaks'],
    products: ['n8n Production Hardening Pack', 'GST Invoice & HSN Compliance Kit', 'AI Agency Delivery OS'],
  },
};

const METRO_ALIASES = {
  bangalore: 'Bengaluru', bengaluru: 'Bengaluru', blr: 'Bengaluru',
  mumbai: 'Mumbai', bombay: 'Mumbai', thane: 'Mumbai', 'navi mumbai': 'Mumbai',
  delhi: 'Delhi NCR', 'new delhi': 'Delhi NCR', 'delhi ncr': 'Delhi NCR',
  gurgaon: 'Delhi NCR', gurugram: 'Delhi NCR', noida: 'Delhi NCR', 'greater noida': 'Delhi NCR',
  faridabad: 'Delhi NCR', ghaziabad: 'Delhi NCR',
  pune: 'Pune', pimpri: 'Pune', chinchwad: 'Pune',
  hyderabad: 'Hyderabad', secunderabad: 'Hyderabad',
  chennai: 'Chennai', madras: 'Chennai', omr: 'Chennai',
  kolkata: 'Kolkata', calcutta: 'Kolkata',
  ahmedabad: 'Ahmedabad', amdavad: 'Ahmedabad', gandhinagar: 'Ahmedabad',
  surat: 'Surat', rajkot: 'Rajkot', vadodara: 'Vadodara',
};

const SEGMENT_QUERIES = {
  all: { label: 'All high-ticket segments', terms: [] },
  saas: { label: 'B2B SaaS', terms: ['"B2B SaaS"', '"software product"', '"platform"'] },
  ai: { label: 'AI infrastructure & agent studios', terms: ['"AI startup"', '"agent"', '"LLM"'] },
  agency: { label: 'Agencies & software houses', terms: ['"digital agency"', '"software development agency"', '"design studio"'] },
  fintech: { label: 'Fintech & compliance', terms: ['"fintech"', '"payments"', '"GST"', '"compliance"'] },
  d2c: { label: 'D2C & ecommerce', terms: ['"D2C"', '"ecommerce"', '"Shopify"'] },
  manufacturing: { label: 'Manufacturing & exports', terms: ['"manufacturing"', '"textile"', '"chemical"', '"export"'] },
  logistics: { label: 'Logistics & supply chain', terms: ['"logistics"', '"warehouse"', '"supply chain"'] },
  healthtech: { label: 'Healthtech & pharma', terms: ['"healthtech"', '"clinic"', '"pharma"'] },
  edtech: { label: 'Edtech & coaching', terms: ['"edtech"', '"learning"', '"coaching"'] },
};

const TOPIC_QUERIES = {
  agents: [
    '"autonomous agents" OR "multi-agent swarms"',
    '"LangGraph" OR "Pydantic-AI" OR "CrewAI"',
    '"enterprise AI automation" OR "agent governance"',
  ],
  mcp: [
    '"Model Context Protocol" OR "MCP server"',
    '"FastAPI MCP" OR "Cursor MCP" OR "Claude tools"',
    '"zero-trust agent gateway" OR "tool security"',
  ],
  web: [
    '"Next.js 15" OR "Laravel 13"',
    '"high performance web application" OR "sub-second TTFB"',
    '"SaaS application architecture" OR "pgvector"',
  ],
  costs: [
    '"slashing token costs" OR "OpenAI API bill" OR "LLM spend"',
    '"high inference latency" OR "local LLM deployment"',
    '"cloud spend optimization" OR "fractional CTO AI"',
  ],
  india_biz: [
    '"WhatsApp AI agent" OR "WhatsApp catalog automation"',
    '"Tally AI automation" OR "Zoho CRM agent integration"',
    '"cutting USD token bill India" OR "self-hosted LLM India"',
    '"custom AI agent development cost India"',
  ],
};

const HIGH_TICKET_PROFILES = `
💎 HIGH-TICKET CLIENT QUALIFICATION CRITERIA:
  1. Indian Metro Tech Startups & B2B SaaS (Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad):
     - Series Seed to Series B ($1M–$20M raised) or high-ARR bootstrapped SaaS.
     - Slashing heavy USD cloud/OpenAI bills (converting to local models or pgvector).
     - Need deterministic guardrails (OPA, Pydantic, SOC2 compliance).
     - Deal Sizing: ₹5,00,000 – ₹25,00,000+ INR ($6K–$30K USD).
  2. Gujarat & Western India Industrial / Export Scaleups (Ahmedabad, Surat, Rajkot, Vadodara):
     - Large manufacturing, textile, ceramic, chemical, or logistics leaders.
     - Automating complex ERP/CRM (Tally, SAP, Zoho) workflows, WhatsApp multi-agent routing.
     - High willingness to pay for proven builder credibility (Junagadh/Gujarat base).
     - Deal Sizing: ₹3,00,000 – ₹15,00,000+ INR ($3.5K–$18K USD).
  3. Indian & Global Digital Product Agencies (15–80 employees):
     - Need white-label autonomous AI agents and MCP tools for their enterprise end clients.
     - Lack in-house frontier agent engineering; seek trusted senior technical partner.
  4. Global Funded SaaS & Scaleups (US, UK, Australia, Dubai):
     - Seeking world-class engineering execution without inflated metro overheads.
     - Deal Sizing: $10,000 – $50,000+ USD (₹8L – ₹40L).
`;

const TIER_GUIDE = `
📊 Lead Quality Tiers (Decision-Maker Priority):
  Tier 1 — Named High-Ticket Decision Maker with Direct Public Business Email
           (Founder, CEO, CTO, Managing Director on company site, press release, podcast, or public GitHub).
           Highest reply & deal conversion rate.
           Fill first (unlimited).
  Tier 2 — Role-based / Team Email on Company Domain
           (founders@company.com, team@company.com, cto@company.com).
           Reaches internal leadership cleanly.
  Tier 3 — Pattern-Derived Address, strictly VERIFIED before send
           (firstname@company.com confirmed via public pattern / SPF ping).
           Max 10 per batch. 1 bounce = immediately pause and re-verify.
  Tier 4 — Generic Info Inbox (info@, contact@, hello@).
           Lowest reply rate. Never use as the core of a high-ticket campaign.
`;

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const found = args.find(a => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!found) return fallback;
  const eq = found.indexOf('=');
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1] ?? fallback;
};
const rawRegion = arg('region', 'India');
const topicArg = arg('topic', 'agents');
const rawMetro = arg('metro', 'all');
const rawSegment = arg('segment', 'all');

// Resolve region alias (IN -> India)
const matchedKey = Object.keys(REGION_DATA).find(
  k => k.toLowerCase() === rawRegion.toLowerCase() || (rawRegion.toLowerCase() === 'in' && k === 'India')
) || 'India';

const region = REGION_DATA[matchedKey];
const topics = TOPIC_QUERIES[topicArg] || TOPIC_QUERIES.agents;
const segment = SEGMENT_QUERIES[rawSegment] || SEGMENT_QUERIES.all;
const metroLookup = METRO_ALIASES[rawMetro.toLowerCase()] || Object.keys(METRO_PLAYBOOK).find(k => k.toLowerCase() === rawMetro.toLowerCase());
const metroKeys = matchedKey !== 'India' || rawMetro === 'all'
  ? Object.keys(METRO_PLAYBOOK).filter(k => region.cities.includes(k))
  : metroLookup ? [metroLookup] : [];
const cities = metroKeys.length ? metroKeys : region.cities;
const segmentTerms = segment.terms.length ? segment.terms.join(' OR ') : topics.join(' OR ');

console.log(`================================================================`);
console.log(`🚀 High-Ticket Lead Discovery Matrix: ${region.name} | Topic: ${topicArg}`);
console.log(`   Metro: ${metroKeys.length ? metroKeys.join(', ') : 'region default'} | Segment: ${segment.label}`);
console.log(`   Target Deal Size: ₹3,00,000 – ₹25,00,000+ INR / $5,000 – $50,000+ USD`);
console.log(`   Engine: Deepak Bagada Autonomous Technical Outreach`);
console.log(`================================================================\n`);

console.log(HIGH_TICKET_PROFILES);

console.log(`🔍 1. High-Ticket LinkedIn / Google Boolean Dorks (${region.name}):\n`);
cities.forEach(city => {
  region.roleKeywords.forEach(role => {
    const query = `site:linkedin.com/in (${role}) "${city}" (${segmentTerms})`;
    console.log(`- ${query}`);
  });
});

if (matchedKey === 'India') {
  console.log(`\n📍 1b. Metro Playbook — Pains, Triggers & Product Fit:\n`);
  metroKeys.forEach(metro => {
    const play = METRO_PLAYBOOK[metro];
    if (!play) return;
    console.log(`- ${metro} [${play.priority}]`);
    console.log(`  Pains:    ${play.pains.join(' · ')}`);
    console.log(`  Products: ${play.products.join(' · ')}`);
  });
}

console.log(`\n💰 2. Funded Company & High-Growth Searches (High-Ticket Intent):\n`);
region.fundingSignals.forEach(fund => {
  console.log(`- site:linkedin.com/company (${fund}) (${segmentTerms}) ("careers" OR "we're hiring")`);
});
cities.slice(0, 4).forEach(city => {
  console.log(`- (site:inc42.com OR site:yourstory.com OR site:entrackr.com) "${city}" ("raised" OR "funding") (${segmentTerms}) 2026`);
});

console.log(`\n💡 3. Twitter / X Real-Time Engineering Discussions (Curiosity & Pain Signals):\n`);
topics.forEach(t => {
  console.log(`- (${t}) (${cities.slice(0, 4).join(' OR ')}) ("token bill" OR "production latency" OR "agent failed" OR "hiring AI")`);
});

console.log(`\n📧 4. Direct Public Email Discovery Queries (Tier 1/2 High-Ticket):\n`);
cities.slice(0, 5).forEach(city => {
  console.log(`- "founder" OR "CTO" "${city}" (${segmentTerms}) "email" "@" -site:zoominfo.com -site:apollo.io -site:lusha.com`);
});
console.log(`- site:*.in OR site:*.ai ("founder" OR "CTO" OR "Managing Director") ("contact us" OR "about") email "@"`);

console.log(`\n================================================================`);
console.log(TIER_GUIDE);
console.log(`================================================================\n`);
