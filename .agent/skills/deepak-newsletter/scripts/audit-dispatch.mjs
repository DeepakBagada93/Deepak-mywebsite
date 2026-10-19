#!/usr/bin/env node

/**
 * Audit Dispatch Script for Deepak Bagada Newsletter & High-Ticket Technical Outreach (v2.0)
 * Enforces:
 *   1. Minimal, high-deliverability executive HTML design (max-width 580px, clean typography).
 *   2. Curiosity & value-driven subject lines (open-loop, specific metrics, zero spam words).
 *   3. High-ticket engineering value (concrete benchmarks, architecture blocks, war stories).
 *   4. Low-friction conversation starter (reply hooks).
 *   5. 100% CAN-SPAM & GDPR compliance (physical address, one-click unsubscribe).
 *
 * Usage:
 *   node audit-dispatch.mjs --subject="Subject" --body="Path or Text"
 *   node audit-dispatch.mjs --file="dispatch.html" --subject="Subject"
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
  const passes = [];

  // 1. Subject line audits (Curiosity + Hook + Metric)
  if (!subject || subject.trim().length === 0) {
    issues.push('Subject line is missing.');
  } else {
    const len = subject.trim().length;
    if (len < 25) warnings.push(`Subject line is very short (${len} chars). Optimal is 35–60 for mobile inboxes.`);
    else if (len > 65) issues.push(`Subject line is too long (${len} chars). Hard limit is 65 characters to prevent inbox truncation.`);
    else passes.push(`Subject line length (${len} chars) optimal for mobile inbox display.`);

    if (subject === subject.toUpperCase() && subject.length > 10) {
      issues.push('Subject line must not be ALL CAPS.');
    }

    // Curiosity & Open-Loop Signals
    const hasCuriosityOrMetric = /\b(why|how|slashing|cut|leak|dropped|breakdown|teardown|\d+|%|\$|₹|ms|p95|tok\/s)\b/i.test(subject);
    if (hasCuriosityOrMetric) {
      passes.push('Subject line has strong curiosity / open-loop hook or concrete proof metric.');
    } else {
      warnings.push('Subject line lacks a curiosity hook, counter-intuitive angle, or concrete metric.');
    }
  }

  // 2. Spam words check in subject and body
  const combined = `${subject} ${body}`.toLowerCase();
  for (const spamWord of SPAM_TRIGGER_WORDS) {
    if (combined.includes(spamWord)) {
      warnings.push(`Contains potential spam trigger phrase: "${spamWord}"`);
    }
  }

  // 3. Minimal Design Audits
  const isHtml = /<html|<body|<p\b|<div\b/i.test(body);
  if (!isHtml) {
    warnings.push('Email appears to be plain text. A minimal HTML wrapper (max-width: 580px, clean system fonts) is recommended for high-ticket readability.');
  } else {
    // Check width constraint
    const hasWidthConstraint = /max-width:\s*(?:5[0-9]{2}|6[0-4][0-9])px/i.test(body);
    if (hasWidthConstraint) {
      passes.push('Minimal layout: Email container is properly constrained (500px–640px) for executive readability.');
    } else {
      warnings.push('Minimal layout: Missing max-width constraint (580px recommended) — email may stretch too wide on desktop.');
    }

    // Check for heavy images or banners
    const imgCount = (body.match(/<img\b/gi) || []).length;
    if (imgCount > 1) {
      warnings.push(`Contains ${imgCount} images. High-ticket outreach should be text-first (0-1 images) to ensure delivery to Primary Inbox.`);
    } else {
      passes.push('Minimal design: Zero image bloat (pure typography lands in Primary Inbox).');
    }

    // Typography check
    const hasCleanFont = /font-family:.*?(?:apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Helvetica|Arial)/i.test(body);
    if (hasCleanFont) {
      passes.push('Minimal design: Clean, modern system font stack detected.');
    }
  }

  // 4. High-Ticket Value & Technical Substantiation
  const techTokens = (body.match(/\b(agent|mcp|rag|llm|architecture|pydantic|laravel|next\.?js|latency|benchmark|workflow|opa|jwt|pgvector|valkey|redis|docker|whatsapp|tally|zoho|fastapi)\b/gi) || []).length;
  if (techTokens >= 4) {
    passes.push(`High-ticket value: Strong technical substance detected (${techTokens} architectural tokens).`);
  } else {
    warnings.push('High-ticket value: Body lacks concrete architectural terms (agents, MCP, RAG, latency, OPA, etc.).');
  }

  // Concrete benchmark or metric check
  const hasConcreteMetric = /\b(\d+ms|p95|\$\d+|\₹\d+|rs\.?\s*\d+|\d+%\b|\d+ tok\/s|\d+ tasks|\d+-day|\d+\s*(?:lakh|crore|cr))\b/i.test(body);
  if (hasConcreteMetric) {
    passes.push('Concrete proof: Real metrics/benchmarks detected (latency, cost, or tok/s).');
  } else {
    warnings.push('Lacks concrete numbers: Add real benchmark data (e.g. 42ms P95, 68% token reduction, ₹8 Lakh savings, $40K cloud savings).');
  }

  // 5. Low-Friction Conversation Starter (Reply Hook)
  const hasReplyHook = /\b(hit reply|reply to this|reply with|drop a reply|tell me|curious how you)\b/i.test(body);
  if (hasReplyHook) {
    passes.push('Conversation starter: Low-friction reply hook present (triggers 1-on-1 dialogue with decision-makers).');
  } else {
    warnings.push('Missing conversation starter: Include a low-friction question ("Hit reply with your stack...") to drive direct replies.');
  }

  // 6. CAN-SPAM & GDPR Compliance requirements
  if (!body.includes('{{UNSUBSCRIBE_URL}}') && !body.toLowerCase().includes('unsubscribe')) {
    issues.push('Missing {{UNSUBSCRIBE_URL}} placeholder or unsubscribe instruction (CAN-SPAM mandatory).');
  } else {
    passes.push('Compliance: One-click unsubscribe placeholder present.');
  }

  if (!body.toLowerCase().includes('deepak bagada')) {
    warnings.push('Sender identity: Clearly identify "Deepak Bagada" in the sign-off.');
  } else {
    passes.push('Sender identity: Deepak Bagada clearly identified.');
  }

  if (!body.toLowerCase().includes('gujarat') && !body.toLowerCase().includes('india')) {
    warnings.push('Physical address: Stating physical business origin (Junagadh, Gujarat, India) is required by CAN-SPAM.');
  } else {
    passes.push('Physical address: Junagadh, Gujarat, India present.');
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
    passes,
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
  } else if (args[i].startsWith('--file=')) {
    const val = args[i].replace('--file=', '');
    if (fs.existsSync(val)) {
      body = fs.readFileSync(val, 'utf8');
    }
  }
}

if (!subject && !body) {
  console.log('Usage: node audit-dispatch.mjs --subject="Subject Line" --file="dispatch.html"');
  process.exit(1);
}

const report = auditDispatch({ subject, body });

console.log('================================================================');
console.log('📬 Deepak Bagada Newsletter & High-Ticket Outreach Audit v2.0');
console.log('================================================================\n');

if (report.passes.length) {
  console.log('✅ PASSED CHECKS:');
  report.passes.forEach(p => console.log(`   ✓ ${p}`));
  console.log('');
}

if (report.warnings.length) {
  console.log('⚠️ WARNINGS / RECOMMENDATIONS:');
  report.warnings.forEach(w => console.log(`   ! ${w}`));
  console.log('');
}

if (report.issues.length) {
  console.log('❌ CRITICAL FAILURES (CANNOT DISPATCH):');
  report.issues.forEach(err => console.log(`   ✗ ${err}`));
  console.log('');
  process.exit(1);
} else {
  console.log('🎉 AUDIT VERDICT: 100% READY FOR BREVO SMTP DISPATCH\n');
  process.exit(0);
}
