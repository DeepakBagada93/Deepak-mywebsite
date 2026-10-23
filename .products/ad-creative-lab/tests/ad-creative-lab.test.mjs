import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditPack, planTestMatrix, analyzeHook } from '../skills/ad-creative-lab/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));

test('clean pack scores 100 and is ready', async () => {
  const result = auditPack(await load('examples/creative-pack.clean.json'));
  assert.equal(result.summary.score, 100);
  assert.equal(result.summary.verdict, 'READY TO LAUNCH');
  assert.equal(result.findings.length, 0);
});

test('broken pack is blocked by claim, urgency and UGC findings', async () => {
  const result = auditPack(await load('examples/creative-pack.fixture.json'));
  const codes = result.findings.map((finding) => finding.code);
  assert.ok(codes.includes('CLAIM_GUARANTEE'));
  assert.ok(codes.includes('CLAIM_FAKE_URGENCY'));
  assert.ok(codes.includes('UGC_NO_HOOK'));
  assert.ok(codes.includes('UGC_NO_CTA'));
  assert.equal(result.summary.verdict, 'DO NOT SPEND');
  assert.ok(result.summary.score < 50);
});

test('low-value amounts such as CPC are not treated as price mismatches', async () => {
  const pack = await load('examples/creative-pack.clean.json');
  pack.creatives[0].primaryText = `${pack.creatives[0].primaryText} Clicks cost ₹18.`;
  const result = auditPack(pack);
  assert.ok(!result.findings.some((finding) => finding.code === 'CREATIVE_PRICE_MISMATCH'));
});

test('a real price mismatch is still caught', async () => {
  const pack = await load('examples/creative-pack.clean.json');
  pack.creatives[0].primaryText = `${pack.creatives[0].primaryText} Get it for ₹999.`;
  const result = auditPack(pack);
  assert.ok(result.findings.some((finding) => finding.code === 'CREATIVE_PRICE_MISMATCH'));
});

test('hook scoring rewards specificity and penalises generic lines', () => {
  assert.ok(analyzeHook('Stop losing ₹18 per click on ads that never convert').score >= 4);
  assert.equal(analyzeHook('Grow your business fast').score, 0);
});

test('test matrix allocates exactly the budget and computes break-even CPA', async () => {
  const plan = planTestMatrix(await load('examples/test-matrix.brief.json'), { budget: 30000, days: 21 });
  const total = plan.cells.reduce((sum, cell) => sum + cell.budget, 0);
  assert.equal(total, 30000);
  assert.equal(plan.breakEvenCPA, 1349.1);
  assert.equal(plan.daily, 1429);
  assert.ok(plan.cells.length >= 4);
  assert.ok(plan.cells.every((cell) => cell.budget > 0));
  assert.equal(plan.projected.clicks, 1667);
});

test('small budgets produce an explicit warning', async () => {
  const plan = planTestMatrix(await load('examples/test-matrix.brief.json'), { budget: 3000, days: 7 });
  assert.ok(plan.warnings.some((warning) => warning.includes('30 clicks')));
  assert.ok(plan.warnings.some((warning) => warning.includes('14 days')));
});
