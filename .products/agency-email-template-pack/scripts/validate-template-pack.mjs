#!/usr/bin/env node
/**
 * Agency Email Template Pack - quality, compliance, and security audit.
 * Zero external dependencies. Run: node scripts/validate-template-pack.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED_HTML = [
  '01-cold-outreach.html',
  '02-discovery-follow-up.html',
  '03-proposal-nudge.html',
  '04-client-onboarding.html',
  '05-case-study-broadcast.html',
  '06-winback-reactivation.html',
  '07-newsletter.html',
  '08-referral-request.html'
];

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /ghp_[a-zA-Z0-9]{20,}/,
  /xox[baprs]-[a-zA-Z0-9]{10,}/,
  /AIza[0-9A-Za-z-_]{35}/
];

const report = { auditTimestamp: new Date().toISOString(), product: 'agency-email-template-pack', passed: [], warnings: [], errors: [] };
const pass = (m) => { report.passed.push(m); console.log(`  ✔ ${m}`); };
const warn = (m) => { report.warnings.push(m); console.log(`  ⚠ ${m}`); };
const fail = (m) => { report.errors.push(m); console.log(`  ✘ ${m}`); };

async function exists(p) {
  try { await fs.access(path.join(root, p)); return true; } catch { return false; }
}

console.log('\n======================================================');
console.log('[Template Pack QA] agency-email-template-pack');
console.log('======================================================\n');

console.log('1. Required assets');
for (const file of REQUIRED_HTML) {
  if (await exists(`templates/html/${file}`)) pass(`HTML template present: ${file}`);
  else fail(`Missing HTML template: templates/html/${file}`);
}
for (const file of REQUIRED_HTML.map(f => f.replace('.html', '.md'))) {
  if (await exists(`templates/copy/${file}`)) pass(`Copy sheet present: ${file}`);
  else fail(`Missing copy sheet: templates/copy/${file}`);
}
for (const file of ['templates/subject-line-vault.md', 'templates/README.md', 'skill/SKILL.md']) {
  if (await exists(file)) pass(`Support asset present: ${file}`);
  else fail(`Missing support asset: ${file}`);
}

console.log('\n2. HTML rendering and compliance');
for (const file of REQUIRED_HTML) {
  const rel = `templates/html/${file}`;
  if (!(await exists(rel))) continue;
  const html = await fs.readFile(path.join(root, rel), 'utf8');
  const checks = [
    ['doctype', /^<!DOCTYPE html>/i.test(html)],
    ['viewport meta', /name="viewport"/i.test(html)],
    ['preheader', /class="preheader"/i.test(html)],
    ['600px container', /max-width:\s*600px/i.test(html)],
    ['presentation tables', /role="presentation"/i.test(html)],
    ['unsubscribe link', /unsubscribe/i.test(html)],
    ['business address merge tag', /company_address/i.test(html)],
    ['dark mode styles', /prefers-color-scheme:\s*dark/i.test(html)],
    ['mobile media query', /@media only screen and \(max-width:\s*620px\)/i.test(html)],
    ['no scripts', !/<script/i.test(html)],
    ['no external stylesheet', !/<link[^>]+rel=["']stylesheet/i.test(html)],
    ['no absolute developer path', !/\/Users\//.test(html)]
  ];
  const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
  if (failed.length) fail(`${file} failed: ${failed.join(', ')}`);
  else pass(`${file} passed all rendering checks`);
}

console.log('\n3. Copy quality');
const banned = ['act now', '100% free', 'guaranteed returns', 'risk-free trial', 'make money fast'];
const copyFiles = REQUIRED_HTML.map(f => `templates/copy/${f.replace('.html', '.md')}`);
for (const rel of copyFiles) {
  if (!(await exists(rel))) continue;
  const body = (await fs.readFile(path.join(root, rel), 'utf8')).toLowerCase();
  if (banned.some(word => body.includes(word))) fail(`${rel} contains a high-risk spam phrase`);
  else pass(`${rel} free of high-risk spam phrases`);
  if (body.includes('subject')) pass(`${rel} documents a subject line`);
  else fail(`${rel} is missing a subject line section`);
}

console.log('\n4. Reference campaign audit');
const campaignDir = path.join(root, 'examples', 'agency-campaign');
const campaignFiles = [
  '01-audience-and-icp-research.md',
  '02-deliverability-and-infrastructure.md',
  '03-cold-email-sequences.md',
  '04-lifecycle-and-nurture-flows.md',
  '05-promotional-and-newsletter-campaigns.md',
  '06-subject-line-and-copy-vault.md',
  '07-email-production-qa.md',
  'email-campaign-delivery.json'
];
const campaignRead = {};
for (const file of campaignFiles) {
  const full = path.join(campaignDir, file);
  try {
    campaignRead[file] = await fs.readFile(full, 'utf8');
    pass(`Campaign asset present: ${file}`);
  } catch {
    fail(`Campaign asset missing: ${file}`);
  }
}
if (campaignRead['03-cold-email-sequences.md']) {
  const cold = campaignRead['03-cold-email-sequences.md'];
  if (/step 1/i.test(cold) && /step 2/i.test(cold) && /step 3/i.test(cold)) pass('Cold campaign has at least three touches');
  else fail('Cold campaign must document Steps 1-3');
  if (/calendly\.com|schedule 30 minutes/i.test(cold)) fail('Cold campaign contains a high-friction calendar link');
  else pass('Cold campaign is free of high-friction calendar links');
}
if (campaignRead['04-lifecycle-and-nurture-flows.md']) {
  const lifecycle = campaignRead['04-lifecycle-and-nurture-flows.md'];
  if (/welcome|onboarding/i.test(lifecycle) && /abandoned|cart|checkout/i.test(lifecycle)) pass('Lifecycle covers welcome and dropout recovery');
  else fail('Lifecycle must cover welcome and checkout/cart dropout');
}
if (campaignRead['07-email-production-qa.md']) {
  if (/rubric|score|status|pass/i.test(campaignRead['07-email-production-qa.md'])) pass('Production QA documents a rubric and signoff');
  else fail('Production QA must document a rubric and signoff');
}
if (campaignRead['email-campaign-delivery.json']) {
  try {
    const manifest = JSON.parse(campaignRead['email-campaign-delivery.json']);
    if (manifest.campaign_name) pass('Campaign delivery manifest is valid JSON');
    else fail('Campaign delivery manifest is missing campaign_name');
  } catch (error) {
    fail(`Campaign delivery manifest is invalid JSON: ${error.message}`);
  }
}

console.log('\n5. Secret and path scan');
const scanTargets = ['templates', 'examples', 'skill', 'scripts'];
async function walk(dir) {
  const entries = await fs.readdir(path.join(root, dir), { withFileTypes: true });
  for (const entry of entries) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(rel);
    else {
      const content = await fs.readFile(path.join(root, rel), 'utf8');
      if (SECRET_PATTERNS.some(p => p.test(content))) fail(`Possible secret in ${rel}`);
      if (/\/Users\/[^/]+\//.test(content) && !rel.endsWith('validate-template-pack.mjs')) warn(`Absolute developer path in ${rel}`);
    }
  }
}
for (const target of scanTargets) if (await exists(target)) await walk(target);
pass('Secret and developer-path scan complete');

report.releaseReady = report.errors.length === 0;
await fs.writeFile(path.join(root, 'template-qa-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log('\n--- SUMMARY ---');
console.log(`Passed: ${report.passed.length} | Warnings: ${report.warnings.length} | Errors: ${report.errors.length}`);
console.log(`Release ready: ${report.releaseReady ? 'YES (owner approval required)' : 'NO'}\n`);
process.exit(report.releaseReady ? 0 : 1);
