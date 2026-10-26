#!/usr/bin/env node

/**
 * Validation Script for Email Marketing Campaigns
 * Usage: node .agent/skills/email-marketing/scripts/validate-email-campaign.mjs <campaign-directory>
 */

import fs from 'fs';
import path from 'path';

const targetDir = process.argv[2];

if (!targetDir) {
  console.error('\x1b[31mError: Missing campaign directory argument.\x1b[0m');
  console.log('Usage: node .agent/skills/email-marketing/scripts/validate-email-campaign.mjs emails/<campaign-slug>');
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), targetDir);

if (!fs.existsSync(resolvedPath)) {
  console.error(`\x1b[31mError: Target directory does not exist: ${resolvedPath}\x1b[0m`);
  process.exit(1);
}

console.log(`\n\x1b[36m==================================================\x1b[0m`);
console.log(`\x1b[1m📧 Validating Email Marketing Campaign:\x1b[0m ${targetDir}`);
console.log(`\x1b[36m==================================================\x1b[0m\n`);

let passed = true;
let totalChecks = 0;
let passedChecks = 0;
let warnings = [];
let errors = [];

function check(title, condition, failureMessage) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  \x1b[32m✔\x1b[0m ${title}`);
  } else {
    passed = false;
    errors.push(failureMessage);
    console.log(`  \x1b[31m✘\x1b[0m ${title}`);
    console.log(`    \x1b[31mReason: ${failureMessage}\x1b[0m`);
  }
}

function warn(title, message) {
  warnings.push(`${title}: ${message}`);
  console.log(`  \x1b[33m⚠\x1b[0m \x1b[33m${title}: ${message}\x1b[0m`);
}

// 1. Check Directory Files
const files = fs.readdirSync(resolvedPath);

const requiredPatterns = [
  { name: '01-audience-and-icp-research', regex: /01-.*audience.*icp.*\.md$/i },
  { name: '02-deliverability-and-infrastructure', regex: /02-.*deliverability.*\.md$/i },
  { name: '03-cold-email-sequences', regex: /03-.*cold-email.*\.md$/i },
  { name: '04-lifecycle-and-nurture-flows', regex: /04-.*lifecycle.*\.md$/i },
  { name: '05-promotional-and-newsletter-campaigns', regex: /05-.*(promotional|newsletter).*\.md$/i },
  { name: '06-subject-line-and-copy-vault', regex: /06-.*subject-line.*\.md$/i },
  { name: '07-email-production-qa', regex: /07-.*production-qa.*\.md$/i }
];

console.log(`\x1b[1m1. File Completeness Audit:\x1b[0m`);
const matchedFiles = {};

for (const req of requiredPatterns) {
  const match = files.find(f => req.regex.test(f));
  matchedFiles[req.name] = match ? path.join(resolvedPath, match) : null;
  check(
    `Required Asset: ${req.name}`,
    !!match,
    `Missing required file matching pattern ${req.regex} in ${targetDir}`
  );
}

// 2. Content Quality & Spam Inspection
console.log(`\n\x1b[1m2. Content Quality & Spam Trigger Inspection:\x1b[0m`);

const highRiskSpamWords = [
  '100% free',
  'act now',
  'urgent notice',
  'make money fast',
  'double your wealth',
  'risk-free trial',
  'guaranteed returns',
  'no catch',
  'pure profit',
  'wire transfer',
  'billion dollars'
];

for (const [key, filePath] of Object.entries(matchedFiles)) {
  if (!filePath || !fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for unclosed template variables like {{first_name without closing }}
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.includes('{{') && !line.includes('}}')) {
      warn(`File ${path.basename(filePath)}`, `Found unclosed dynamic variable line: "${line.trim()}"`);
      break;
    }
  }

  const rawPlaceholders = content.match(/\[(INSERT|ADD|YOUR_HERE|FIRST_NAME)\]/gi);
  if (rawPlaceholders) {
    warn(`File ${path.basename(filePath)}`, `Found unreplaced placeholder string: ${rawPlaceholders[0]}`);
  }

  // Check for severe spam words
  for (const spamWord of highRiskSpamWords) {
    const regex = new RegExp(`\\b${spamWord}\\b`, 'gi');
    if (regex.test(content)) {
      warn(
        `File ${path.basename(filePath)}`,
        `Contains prohibited high-risk spam phrase: "${spamWord}". Consider replacing with conversational alternative.`
      );
    }
  }

  // File-specific checks
  if (key === '03-cold-email-sequences') {
    // Check for CTA friction
    if (/calendly\.com\/|schedule 30 minutes/i.test(content)) {
      warn('Cold Sequence CTA', 'High-friction calendar link detected in cold sequence. Recommend using low-friction soft CTA instead.');
    }
    // Check that steps exist
    const hasStep1 = /step 1/i.test(content);
    const hasStep2 = /step 2/i.test(content);
    const hasStep3 = /step 3/i.test(content);
    check('Cold Sequence Multi-Touch Architecture (Steps 1, 2, 3+)', hasStep1 && hasStep2 && hasStep3, 'Cold outreach sequence must have at least 3 distinct multi-touch steps.');
  }

  if (key === '04-lifecycle-and-nurture-flows') {
    const hasWelcome = /welcome|onboarding/i.test(content);
    const hasCart = /abandoned|cart|checkout/i.test(content);
    check('Lifecycle Sequences (Welcome & Cart Recovery present)', hasWelcome && hasCart, 'Lifecycle flows must include both Welcome/Onboarding and Cart/Dropout recovery flows.');
  }

  if (key === '07-email-production-qa') {
    const hasSignoff = /rubric|score|status|pass/i.test(content);
    check('Production QA Audit Checklist Verification', hasSignoff, '07-email-production-qa.md must document rubric scores and signoff status.');
  }
}

// 3. Optional Manifest check
const manifestPath = path.join(resolvedPath, 'email-campaign-delivery.json');
if (fs.existsSync(manifestPath)) {
  console.log(`\n\x1b[1m3. Machine-Readable Delivery Manifest:\x1b[0m`);
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    check('JSON Manifest Valid', manifest && manifest.campaign_name, 'email-campaign-delivery.json is missing campaign_name');
  } catch (err) {
    check('JSON Manifest Valid', false, `Invalid JSON syntax in manifest: ${err.message}`);
  }
}

// Summary Output
console.log(`\n\x1b[36m==================================================\x1b[0m`);
console.log(`\x1b[1mVerification Summary:\x1b[0m`);
console.log(`  Passed Checks: ${passedChecks}/${totalChecks}`);
if (warnings.length > 0) {
  console.log(`  Warnings: ${warnings.length}`);
}
if (errors.length > 0) {
  console.log(`  Errors: ${errors.length}`);
}

if (passed) {
  console.log(`\n\x1b[32m✔ CAMPAIGN PASSED AUDIT — READY FOR STAGING & OWNER APPROVAL\x1b[0m\n`);
  process.exit(0);
} else {
  console.log(`\n\x1b[31m✘ CAMPAIGN AUDIT FAILED — FIX REQUIRED ERRORS ABOVE\x1b[0m\n`);
  process.exit(1);
}
