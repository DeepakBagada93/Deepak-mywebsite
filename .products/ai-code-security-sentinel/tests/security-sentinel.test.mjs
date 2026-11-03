import test from 'node:test';
import assert from 'node:assert/strict';
import { scanTarget, scanContent } from '../scripts/scan.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

test('Security Sentinel: Detects vulnerabilities in vulnerable code sample', async () => {
  const vulnerablePath = path.join(root, 'examples', 'vulnerable-code-sample.js');
  const result = await scanTarget(vulnerablePath);

  assert.ok(result.filesScanned >= 1, 'Should scan at least 1 file');
  assert.ok(result.summary.total >= 5, `Expected at least 5 findings, got ${result.summary.total}`);
  assert.ok(result.summary.critical >= 3, `Expected at least 3 critical findings, got ${result.summary.critical}`);

  const ruleIds = result.findings.map(f => f.ruleId);
  assert.ok(ruleIds.includes('SEC-003'), 'Must detect OpenAI key exposure');
  assert.ok(ruleIds.includes('SEC-007'), 'Must detect embedded DB credentials');
  assert.ok(ruleIds.includes('INJ-001'), 'Must detect SQL injection');
  assert.ok(ruleIds.includes('LLM-002'), 'Must detect eval() dynamic execution');
  assert.ok(ruleIds.includes('INJ-004'), 'Must detect insecure CORS wildcard');
});

test('Security Sentinel: Clean scan on secure hardened sample', async () => {
  const securePath = path.join(root, 'examples', 'secure-hardened-sample.js');
  const result = await scanTarget(securePath);

  assert.equal(result.summary.critical, 0, 'Hardened sample must have 0 critical findings');
  assert.equal(result.summary.high, 0, 'Hardened sample must have 0 high findings');
  assert.equal(result.summary.total, 0, 'Hardened sample must have 0 findings');
});

test('Security Sentinel: Correctly scans isolated inline string tokens', () => {
  // Test AWS Key rule
  const awsKey = 'AKIA' + '1234567890ABCDEF';
  const awsFindings = scanContent(`const authKey = '${awsKey}';`);
  assert.equal(awsFindings.length, 1);
  assert.equal(awsFindings[0].ruleId, 'SEC-001');
  assert.equal(awsFindings[0].severity, 'CRITICAL');

  // Test Anthropic Key rule
  const antKey = 'sk-ant-' + 'api03-abcdefghijklmnopqrstuvwxyz12345';
  const antFindings = scanContent(`const ant = '${antKey}';`);
  assert.equal(antFindings.length, 1);
  assert.equal(antFindings[0].ruleId, 'SEC-002');
  assert.equal(antFindings[0].severity, 'CRITICAL');

  // Test Stripe Secret Key rule
  const stripeKey = 'sk_live_' + '51Abcdefghijklmnopqrstuvwx999';
  const stripeFindings = scanContent(`const st = '${stripeKey}';`);
  assert.equal(stripeFindings.length, 1);
  assert.equal(stripeFindings[0].ruleId, 'SEC-004');
  assert.equal(stripeFindings[0].severity, 'CRITICAL');
});
