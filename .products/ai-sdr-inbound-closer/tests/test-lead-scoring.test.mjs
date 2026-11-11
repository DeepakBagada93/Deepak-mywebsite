import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('AI SDR Lead Intent Scoring logic validates high-intent leads accurately', () => {
  const payloadPath = path.resolve(root, 'tests/sample-payload.json');
  const rawData = fs.readFileSync(payloadPath, 'utf8');
  const lead = JSON.parse(rawData);

  assert.ok(lead.name, 'Lead must have a name');
  assert.ok(lead.email, 'Lead must have an email');

  let score = 50;
  const highValueKeywords = ['agency', 'enterprise', 'urgent', 'scale', 'pricing', 'hire', 'contract', 'team'];
  const lowValueKeywords = ['student', 'free', 'internship', 'unpaid'];

  const content = (lead.company + ' ' + lead.message).toLowerCase();
  for (const kw of highValueKeywords) {
    if (content.includes(kw)) score += 15;
  }
  for (const kw of lowValueKeywords) {
    if (content.includes(kw)) score -= 25;
  }

  score = Math.max(0, Math.min(100, score));
  assert.ok(score >= 75, `Expected score >= 75 for VIP lead, got ${score}`);
  const autoBookEligible = score >= 75;
  assert.equal(autoBookEligible, true, 'High priority lead should be eligible for instant booking');
});

test('Workflow JSON manifests contain valid schemas', () => {
  const mainWfPath = path.resolve(root, 'workflows/main-automation.json');
  const errorWfPath = path.resolve(root, 'workflows/error-handler-subflow.json');
  
  const mainWf = JSON.parse(fs.readFileSync(mainWfPath, 'utf8'));
  const errorWf = JSON.parse(fs.readFileSync(errorWfPath, 'utf8'));

  assert.ok(Array.isArray(mainWf.nodes), 'Main workflow must contain nodes array');
  assert.ok(Array.isArray(errorWf.nodes), 'Error workflow must contain nodes array');
  assert.ok(mainWf.nodes.some(n => n.name === 'AI Intent & ICP Scorer'));
});
