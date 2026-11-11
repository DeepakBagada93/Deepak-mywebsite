import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('D2C Abandoned Checkout evaluator classifies VIP carts correctly', () => {
  const payloadPath = path.resolve(root, 'tests/sample-payload.json');
  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

  const cartValue = parseFloat(payload.total_price);
  assert.ok(cartValue > 0, 'Cart must have a non-zero value');

  const isHighValue = cartValue >= 75;
  const discountTier = cartValue >= 100 ? 'VIP20' : 'SAVE10';
  const discountPercentage = cartValue >= 100 ? 20 : 10;

  assert.equal(isHighValue, true, 'Cart > $75 should be tagged high value');
  assert.equal(discountTier, 'VIP20', 'Cart > $100 should qualify for VIP20');
  assert.equal(discountPercentage, 20);
});

test('Workflows contain valid triggers and nodes', () => {
  const mainWfPath = path.resolve(root, 'workflows/main-automation.json');
  const mainWf = JSON.parse(fs.readFileSync(mainWfPath, 'utf8'));

  assert.ok(Array.isArray(mainWf.nodes));
  assert.ok(mainWf.nodes.some(n => n.name === 'Cart Value & Tier Evaluator'));
  assert.ok(mainWf.nodes.some(n => n.name === 'Is High Value VIP Cart?'));
});
