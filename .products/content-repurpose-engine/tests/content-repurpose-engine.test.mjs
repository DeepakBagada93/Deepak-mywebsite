import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContentPlan, auditContentPack, similarity } from '../skills/content-repurpose-engine/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));

test('30-day plan covers every insight and has no duplicate cell', async () => {
  const plan = buildContentPlan(await load('examples/source.asset.json'));
  assert.equal(plan.items.length, 30);
  assert.equal(plan.items[0].date, '2026-10-21');
  assert.equal(plan.items[29].date, '2026-11-19');
  assert.equal(plan.warnings.length, 0);
  for (const entry of plan.coverage) assert.ok(entry.uses > 0, entry.insightId);
  const triples = plan.items.map((item) => `${item.platform}|${item.insightId}|${item.angleId}`);
  assert.equal(new Set(triples).size, triples.length);
});

test('platform counts follow the configured cadence weights', async () => {
  const plan = buildContentPlan(await load('examples/source.asset.json'));
  const counts = plan.items.reduce((acc, item) => {
    acc[item.platform] = (acc[item.platform] || 0) + 1;
    return acc;
  }, {});
  assert.equal(counts.instagram, 8);
  assert.equal(counts.linkedin, 6);
  assert.equal(counts.x, 6);
  assert.equal(counts.youtube_shorts, 4);
  assert.equal(counts.newsletter, 3);
  assert.equal(counts.blog, 3);
  assert.equal(Object.values(counts).reduce((a, b) => a + b, 0), 30);
});

test('a seven-day override produces seven dated pieces', async () => {
  const plan = buildContentPlan(await load('examples/source.asset.json'), { days: 7 });
  assert.equal(plan.items.length, 7);
  assert.equal(plan.items[6].date, '2026-10-27');
});

test('clean pack scores 100 and passes strict mode semantics', async () => {
  const result = auditContentPack(await load('examples/content-pack.clean.json'));
  assert.equal(result.summary.score, 100);
  assert.equal(result.summary.verdict, 'READY TO PUBLISH');
  assert.equal(result.findings.length, 0);
});

test('flawed pack is blocked for length, missing CTA and cross-posting', async () => {
  const result = auditContentPack(await load('examples/content-pack.fixture.json'));
  const codes = result.findings.map((finding) => finding.code);
  assert.ok(codes.includes('PIECE_BODY_LENGTH'));
  assert.ok(codes.includes('PIECE_NO_CTA'));
  assert.ok(codes.includes('PIECE_CROSS_POST_DUPLICATE'));
  assert.ok(codes.includes('PIECE_AI_PHRASE'));
  assert.equal(result.summary.verdict, 'DO NOT PUBLISH');
  assert.equal(result.summary.score, 0);
});

test('similarity distinguishes rewritten copy from a paste', () => {
  const a = 'A workflow that fails silently is not automation it is a liability';
  const b = 'A workflow that fails silently is not automation it is a liability';
  const c = 'Backups only count when you have restored one into staging';
  assert.equal(similarity(a, b), 1);
  assert.ok(similarity(a, c) < 0.2);
});
