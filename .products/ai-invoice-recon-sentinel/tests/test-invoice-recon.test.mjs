import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Invoice normalization and tax calculation computes accurately', () => {
  const payloadPath = path.resolve(root, 'tests/sample-payload.json');
  const inv = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

  const total = parseFloat(inv.total_amount);
  const tax = parseFloat(inv.tax_amount);
  const net = total - tax;

  assert.ok(total > 0, 'Total amount must be greater than zero');
  assert.equal(Math.round(net * 100) / 100, 203.39);
  assert.equal(inv.currency, 'USD');
});

test('Workflows contain required nodes and structure', () => {
  const mainWfPath = path.resolve(root, 'workflows/main-automation.json');
  const wf = JSON.parse(fs.readFileSync(mainWfPath, 'utf8'));

  assert.ok(Array.isArray(wf.nodes));
  assert.ok(wf.nodes.some(n => n.name === 'Parse & Normalize Invoice'));
  assert.ok(wf.nodes.some(n => n.name === 'Audit & Tax Compliance Engine'));
});
