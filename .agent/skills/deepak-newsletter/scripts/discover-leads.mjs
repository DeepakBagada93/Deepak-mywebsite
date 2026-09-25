#!/usr/bin/env node

/**
 * Lead Discovery Assistant for Deepak Bagada Newsletter Outreach
 * Generates high-intent search queries targeting US, Australia, and Dubai AI/web founders.
 *
 * Usage: node discover-leads.mjs --region=US|AU|Dubai --topic=agents|mcp|web
 */

const REGION_DATA = {
  US: {
    name: 'United States',
    cities: ['San Francisco', 'New York', 'Austin', 'Seattle', 'Boston'],
    roleKeywords: [
      '"Founder" OR "Co-Founder"',
      '"Chief Technology Officer" OR "CTO"',
      '"Head of AI" OR "VP of Engineering"',
      '"AI Agency Owner"',
    ],
  },
  AU: {
    name: 'Australia',
    cities: ['Sydney', 'Melbourne', 'Brisbane'],
    roleKeywords: [
      '"Founder" OR "Managing Director"',
      '"CTO" OR "Head of Technology"',
      '"Digital Agency Founder"',
    ],
  },
  Dubai: {
    name: 'Dubai / UAE',
    cities: ['Dubai', 'Abu Dhabi'],
    roleKeywords: [
      '"Managing Director" OR "CEO"',
      '"Head of Digital Transformation"',
      '"CTO" OR "Tech Founder"',
      '"AI Consultant Dubai"',
    ],
  },
};

const TOPIC_QUERIES = {
  agents: ['"autonomous agents" OR "multi-agent"', '"LangGraph" OR "CrewAI"', '"enterprise AI automation"'],
  mcp: ['"Model Context Protocol" OR "MCP"', '"LLM tools" OR "FastAPI MCP"'],
  web: ['"Next.js" OR "Laravel"', '"custom software agency"', '"high performance web development"'],
};

const args = process.argv.slice(2);
const regionArg = (args.find(a => a.startsWith('--region=')) || '--region=US').replace('--region=', '');
const topicArg = (args.find(a => a.startsWith('--topic=')) || '--topic=agents').replace('--topic=', '');

const region = REGION_DATA[regionArg] || REGION_DATA.US;
const topics = TOPIC_QUERIES[topicArg] || TOPIC_QUERIES.agents;

console.log(`========================================================`);
console.log(`🎯 Lead Discovery Matrix: ${region.name} | Topic: ${topicArg}`);
console.log(`========================================================\n`);

console.log(`🔍 Google / LinkedIn Search Queries:\n`);
region.cities.forEach(city => {
  region.roleKeywords.forEach(role => {
    const query = `site:linkedin.com/in (${role}) "${city}" (${topics.join(' OR ')})`;
    console.log(`- ${query}`);
  });
});

console.log(`\n💡 Twitter / X Search Queries:\n`);
topics.forEach(t => {
  console.log(`- (${t}) (${region.cities.join(' OR ')}) "founder" OR "building"`);
});

console.log(`\n========================================================`);
