#!/usr/bin/env node
/**
 * CRO Landing Page Audit CLI
 * Standalone zero-dependency Node.js tool.
 *
 * Scans HTML, TSX, JSX, or Markdown landing page files
 * across 10 critical conversion rate optimization dimensions.
 *
 * Usage:
 *   node scripts/cro-audit.mjs [path-to-file]
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const inputFile = process.argv[2];

const CRO_DIMENSIONS = [
  { id: 'CRO-01', name: 'Outcome-Driven Headline (Numbers/Time/ROI)', weight: 15, test: (c) => /(?:\d+%|\$\d+|in \d+ (?:minutes|hours|days)|cut|save|eliminate)/i.test(c) },
  { id: 'CRO-02', name: 'High-Intent Action-Oriented CTA', weight: 15, test: (c) => /(?:start free|get instant access|claim your|launch your|try now)/i.test(c) && !/(?:submit|click here)/i.test(c) },
  { id: 'CRO-03', name: 'Social Proof & Empirical Evidence', weight: 10, test: (c) => /(?:testimonial|rating|reviews?|trusted by|users?|case stud)/i.test(c) },
  { id: 'CRO-04', name: 'Objection-Neutralizing FAQ Section', weight: 10, test: (c) => /(?:frequently asked|faq|questions?)/i.test(c) },
  { id: 'CRO-05', name: 'Risk-Reversal Guarantee Callout', weight: 10, test: (c) => /(?:money-back|guarantee|risk-free|cancel anytime|refund)/i.test(c) },
  { id: 'CRO-06', name: 'Transparent Pricing Breakdown', weight: 10, test: (c) => /(?:\$|₹|pricing|tiers?|per month|one-time)/i.test(c) },
  { id: 'CRO-07', name: 'Feature-to-Benefit Bridges ("so you can")', weight: 10, test: (c) => /(?:so you can|allows you to|without|means you never)/i.test(c) },
  { id: 'CRO-08', name: 'Visual Demo / Product Screenshot Hook', weight: 10, test: (c) => /(?:img|screenshot|demo|preview|video|svg)/i.test(c) },
  { id: 'CRO-09', name: 'Subheading Clarity & Problem Stating', weight: 5, test: (c) => /(?:problem|tired of|stop|struggling)/i.test(c) },
  { id: 'CRO-10', name: 'Zero Low-Trust Generic Placeholders', weight: 5, test: (c) => !/(?:lorem ipsum|placeholder text|company name here)/i.test(c) }
];

async function runCroAudit() {
  let content = '';
  let targetPath = inputFile ? path.resolve(inputFile) : '';

  if (targetPath) {
    content = await fs.readFile(targetPath, 'utf8');
  } else {
    content = `<h1>World-class cloud orchestration tool</h1><p>Our distributed microservice proxy is robust.</p><button>Submit</button>`;
  }

  const passed = [];
  const failed = [];
  let score = 0;

  for (const dim of CRO_DIMENSIONS) {
    if (dim.test(content)) {
      passed.push(dim);
      score += dim.weight;
    } else {
      failed.push(dim);
    }
  }

  console.error(`\n======================================================`);
  console.error(` CRO Landing Page Audit Complete`);
  console.error(`======================================================`);
  console.error(` File: ${targetPath || 'Inline Sample'}`);
  console.error(` Conversion Readiness Score: ${score}% / 100%`);
  console.error(` Dimensions Passed: ${passed.length} / 10`);
  console.error(` Dimensions Failed: ${failed.length} / 10`);
  console.error(`======================================================\n`);

  return { score, passed, failed };
}

if (process.argv[1] && process.argv[1].endsWith('cro-audit.mjs')) {
  runCroAudit().then(res => {
    console.log(JSON.stringify(res, null, 2));
  }).catch(err => {
    console.error('CRO audit error:', err);
    process.exit(1);
  });
}

export { runCroAudit, CRO_DIMENSIONS };
