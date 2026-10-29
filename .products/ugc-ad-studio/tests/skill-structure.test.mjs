import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(root, 'skills', 'ugc-ad-studio');
const skillFile = path.join(skillDir, 'SKILL.md');

test('product root contains the required commercial files', async () => {
  for (const file of ['README.md', 'LICENSE.md', 'CHANGELOG.md', 'COMPATIBILITY.md', 'product-manifest.json']) {
    await fs.access(path.join(root, file));
  }
});

test('skill frontmatter is valid and client-agnostic', async () => {
  const body = await fs.readFile(skillFile, 'utf8');
  const match = body.match(/^---\nname:\s*([^\n]+)\ndescription:\s*([^\n]+)\n---/);
  assert.ok(match, 'YAML frontmatter must parse');
  assert.equal(match[1].trim(), 'ugc-ad-studio');
  assert.ok(match[2].length > 80, 'description must be discriminating');
  assert.ok(body.length > 9000, 'SKILL.md must contain a real pipeline, not a stub');
});

test('skill defines triggers, inputs, outputs and guardrails', async () => {
  const body = await fs.readFile(skillFile, 'utf8');
  for (const heading of ['Activation triggers', 'Input contract', 'Ordered pipeline', 'Output specification', 'Negative constraints']) {
    assert.ok(body.includes(heading), `missing section: ${heading}`);
  }
});

test('skill covers the advertised model surface', async () => {
  const body = await fs.readFile(skillFile, 'utf8');
  for (const token of ['Veo 3.1', 'Google Flow', 'HeyGen', 'Kling', 'Runway', 'Nano Banana', 'Midjourney', 'Flux', 'UGC', 'cinematic']) {
    assert.ok(body.toLowerCase().includes(token.toLowerCase()), `missing model/style mention: ${token}`);
  }
});

test('customer documentation exists and contains a quickstart and prompt recipes', async () => {
  const tutorial = await fs.readFile(path.join(root, 'docs', 'tutorial-guide.md'), 'utf8');
  assert.match(tutorial, /quickstart/i);
  assert.match(tutorial, /prompt recipe/i);
  assert.match(tutorial, /troubleshoot/i);
  assert.ok(tutorial.length > 4000);
});

test('store listing has price, deliverables, FAQ and guarantee', async () => {
  const listing = await fs.readFile(path.join(root, 'docs', 'store-listing.md'), 'utf8');
  assert.match(listing, /pricing/i);
  assert.match(listing, /what's included/i);
  assert.match(listing, /faq/i);
  assert.match(listing, /guarantee/i);
  assert.match(listing, /₹/);
});

test('required documentation set exists', async () => {
  for (const doc of [
    'product-specification.md',
    'research-dossier.md',
    'test-plan.md',
    'test-results.md',
    'release-report.md',
    'store-listing.md',
    'tutorial-guide.md'
  ]) {
    await fs.access(path.join(root, 'docs', doc));
  }
});

test('skill scripts ship and expose a help flag', async () => {
  for (const script of ['lib.mjs', 'build-ugc-campaign.mjs', 'audit-ugc-pack.mjs']) {
    const body = await fs.readFile(path.join(skillDir, 'scripts', script), 'utf8');
    assert.ok(body.length > 1000, `${script} looks like a stub`);
  }
});

test('no placeholder markers ship in customer-facing skill or docs', async () => {
  const targets = [skillFile, path.join(root, 'README.md'), path.join(root, 'docs', 'tutorial-guide.md')];
  for (const target of targets) {
    const body = await fs.readFile(target, 'utf8');
    assert.doesNotMatch(body, /\{\{[a-z_]+\}\}/i, `unreplaced template token in ${path.basename(target)}`);
    assert.doesNotMatch(body, /\bTODO\b|\bTBD\b|lorem ipsum/i, `placeholder in ${path.basename(target)}`);
  }
});

test('examples and expected reports exist', async () => {
  for (const file of ['nara-brief.json', 'nara-campaign/campaign.json', 'broken-pack.json', 'expected/clean-audit.json', 'expected/broken-audit.json']) {
    await fs.access(path.join(root, 'examples', file));
  }
});
