import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const validatorScript = path.join(root, 'skills', 'email-marketing', 'scripts', 'validate-email-campaign.mjs');

const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

check('validator runs cleanly on B2B SaaS example', () => {
  const examplePath = path.join(root, 'examples', 'b2b-saas-cold-outreach');
  const stdout = execFileSync('node', [validatorScript, examplePath], { encoding: 'utf8' });
  assert.ok(stdout.includes('CAMPAIGN PASSED AUDIT'), 'B2B example passed');
});

check('validator runs cleanly on E-Commerce retention example', () => {
  const examplePath = path.join(root, 'examples', 'ecommerce-retention-engine');
  const stdout = execFileSync('node', [validatorScript, examplePath], { encoding: 'utf8' });
  assert.ok(stdout.includes('CAMPAIGN PASSED AUDIT'), 'Ecom example passed');
});

let failures = 0;
for (const { name, fn } of checks) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${name}\n    ${error.message}`);
  }
}

if (failures) {
  console.error(`\n${failures} functional check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} functional checks passed.`);
