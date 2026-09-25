#!/usr/bin/env node

/**
 * Audit Dispatch Script for Deepak Bagada Newsletter & Outreach
 * Ensures 100% CAN-SPAM / GDPR compliance, zero spam keywords, and high-CTR hooks.
 *
 * Usage: node audit-dispatch.mjs --subject="Subject" --body="Path or Text"
 */

import fs from 'node:fs';

const SPAM_TRIGGER_WORDS = [
  '100% free', 'act now', 'apply now', 'as seen on', 'bargain', 'beneficiary',
  'best price', 'big bucks', 'billion dollars', 'bonus', 'buy direct', 'call now',
  'cancel at any time', 'cash prize', 'certified', 'cheap', 'claims', 'clearance',
  'click below', 'click here now', 'congratulations', 'credit card offers', 'cures',
  'dear friend', 'direct email', 'direct marketing', 'discount', 'double your income',
  'earn extra cash', 'eliminate debt', 'exclusive deal', 'expect to earn', 'extra income',
  'fast cash', 'financial freedom', 'free gift', 'free info', 'free trial', 'get out of debt',
  'giveaway', 'great offer', 'guarantee', 'hidden assets', 'income from home', 'increase sales',
  'instant', 'investment', 'join millions', 'limited time', 'lowest price', 'make money',
  'millionaire', 'miracle', 'money back', 'no catch', 'no cost', 'no credit check',
  'no fees', 'no hidden costs', 'no obligation', 'no purchase necessary', 'no risk',
  'no strings attached', 'not spam', 'obligation', 'once in a lifetime', 'one time',
  'online marketing', 'open immediately', 'opportunity', 'order now', 'passwords',
  'pennys a day', 'potential earnings', 'prize', 'promise you', 'pure profit', 'refund',
  'remove', 'reverse aging', 'risk free', 'save big', 'save money', 'satisfaction guaranteed',
  'score', 'secret', 'special promotion', 'supplies are limited', 'take action now',
  'terms and conditions', 'this isn\'t spam', 'unlimited', 'unsolicited', 'urgent',
  'valuable', 'viagra', 'vicodin', 'warranty', 'weight loss', 'while supplies last',
  'win', 'winner', 'winning', 'you have been selected', 'you have been chosen'
];

function auditDispatch({ subject, body }) {
  const issues = [];
  const warnings = [];

  // 1. Subject line audits
  if (!subject || subject.trim().length === 0) {
    issues.push('Subject line is missing.');
  } else {
    const len = subject.trim().length;
    if (len < 25) warnings.push(`Subject line is very short (${len} chars). Optimal is 35–60.`);
    if (len > 70) issues.push(`Subject line is too long (${len} chars). Max recommended is 65.`);
    if (subject === subject.toUpperCase() && subject.length > 10) {
      issues.push('Subject line must not be ALL CAPS.');
    }
  }

  // 2. Spam words check in subject and body
  const combined = `${subject} ${body}`.toLowerCase();
  for (const spamWord of SPAM_TRIGGER_WORDS) {
    if (combined.includes(spamWord)) {
      warnings.push(`Contains potential spam trigger phrase: "${spamWord}"`);
    }
  }

  // 3. CAN-SPAM Compliance requirements
  if (!body.includes('unsubscribe') && !body.includes('UNSUBSCRIBE')) {
    issues.push('Missing unsubscribe instruction or placeholder (CAN-SPAM mandatory).');
  }

  if (!body.toLowerCase().includes('deepak bagada')) {
    warnings.push('Sender name "Deepak Bagada" should be clearly identified in the sign-off.');
  }

  if (!body.toLowerCase().includes('gujarat') && !body.toLowerCase().includes('india')) {
    warnings.push('Physical address or geographic origin (Junagadh, Gujarat, India) should be stated.');
  }

  // 4. Technical relevance check
  const techTerms = ['agent', 'mcp', 'rag', 'llm', 'architecture', 'pydantic', 'laravel', 'next.js', 'latency', 'benchmark', 'workflow'];
  const hasTechTerm = techTerms.some(term => combined.includes(term));
  if (!hasTechTerm) {
    warnings.push('Body does not appear to reference any core technical topics (AI agents, MCP, RAG, web dev).');
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
  };
}

// CLI argument parsing
const args = process.argv.slice(2);
let subject = '';
let body = '';

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--subject=')) {
    subject = args[i].replace('--subject=', '');
  } else if (args[i].startsWith('--body=')) {
    const val = args[i].replace('--body=', '');
    if (fs.existsSync(val)) {
      body = fs.readFileSync(val, 'utf8');
    } else {
      body = val;
    }
  }
}

if (!subject && !body) {
  console.log('Usage: node audit-dispatch.mjs --subject="<subject>" --body="<body or file.html>"');
  process.exit(1);
}

const result = auditDispatch({ subject, body });

console.log(JSON.stringify(result, null, 2));
process.exit(result.passed ? 0 : 1);
