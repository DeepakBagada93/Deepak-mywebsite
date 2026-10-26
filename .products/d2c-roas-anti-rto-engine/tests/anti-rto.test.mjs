import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('SKILL.md exists and contains valid frontmatter', async () => {
  const skillFile = path.join(root, 'skills/d2c-roas-anti-rto-engine/skills/d2c-roas-anti-rto-engine/SKILL.md');
  // wait! check the path: skills/d2c-roas-anti-rto-engine/SKILL.md
  const directSkill = path.join(root, 'skills/d2c-roas-anti-rto-engine/SKILL.md');
  const content = await fs.readFile(directSkill, 'utf8');
  assert.match(content, /^---\nname:\s*d2c-roas-anti-rto-engine\ndescription:\s*.+\n---/m);
  assert.ok(content.includes('High-CTR Hinglish Meta Ad Copy'));
  assert.ok(content.includes('Address Hygiene & Bogus COD Order Filter'));
});

test('RTO scoring matrix and sample order parse without errors', async () => {
  const orderFile = path.join(root, 'examples/sample-d2c-order.json');
  const order = JSON.parse(await fs.readFile(orderFile, 'utf8'));
  assert.equal(order.orderId, 'VR-98421');
  assert.equal(order.riskEvaluation.riskLevel, 'LOW');

  const matrixFile = path.join(root, 'examples/rto-risk-scoring-matrix.json');
  const matrix = JSON.parse(await fs.readFile(matrixFile, 'utf8'));
  assert.equal(matrix.actionThresholds.lowRiskMinScore, 75);
});
