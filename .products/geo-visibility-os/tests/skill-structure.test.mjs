import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(root, 'skills', 'geo-visibility-os');
const skillFile = path.join(skillDir, 'SKILL.md');

test('product root contains the required commercial files', async () => {
  for (const file of ['README.md', 'LICENSE.md', 'CHANGELOG.md', 'COMPATIBILITY.md', 'package.json', 'product-manifest.json']) {
    await fs.access(path.join(root, file));
  }
});

test('skill frontmatter is valid and substantial', async () => {
  const body = await fs.readFile(skillFile, 'utf8');
  const match = body.match(/^---\nname:\s*([^\n]+)\ndescription:\s*([^\n]+)\n---/);
  assert.ok(match, 'YAML frontmatter must parse');
  assert.equal(match[1].trim(), 'geo-visibility-os');
  assert.ok(match[2].length > 80, 'description must be discriminating');
  assert.ok(body.length > 9000, 'SKILL.md must contain a real pipeline, not a stub');
});

test('skill defines triggers, inputs, pipeline, outputs and guardrails', async () => {
  const body = await fs.readFile(skillFile, 'utf8');
  for (const heading of ['Activation triggers', 'Input contract', 'Ordered pipeline', 'Output specification', 'Negative constraints']) {
    assert.ok(body.includes(heading), `missing section: ${heading}`);
  }
});

test('skill covers the advertised GEO and engine surface', async () => {
  const body = (await fs.readFile(skillFile, 'utf8')).toLowerCase();
  for (const token of ['geo', 'aeo', 'ai search', 'chatgpt', 'perplexity', 'google ai overviews', 'gemini', 'copilot', 'claude', 'schema', 'llms.txt', 'robots.txt']) {
    assert.ok(body.includes(token), `missing term: ${token}`);
  }
});

test('customer tutorial exists with quickstart, prompt recipe and troubleshooting', async () => {
  const tutorial = await fs.readFile(path.join(root, 'docs', 'tutorial-guide.md'), 'utf8');
  assert.match(tutorial, /quickstart/i);
  assert.match(tutorial, /prompt recipe/i);
  assert.match(tutorial, /troubleshoot/i);
  assert.ok(tutorial.length > 4000);
});

test('store listing has pricing, deliverables, FAQ and guarantee in USD', async () => {
  const listing = await fs.readFile(path.join(root, 'docs', 'store-listing.md'), 'utf8');
  assert.match(listing, /pricing/i);
  assert.match(listing, /what's included/i);
  assert.match(listing, /faq/i);
  assert.match(listing, /guarantee/i);
  assert.match(listing, /\$149/);
  assert.match(listing, /\$299/);
  assert.match(listing, /\$599/);
});

test('required documentation set exists', async () => {
  for (const doc of [
    'product-specification.md',
    'research-report.md',
    'test-plan.md',
    'test-results.md',
    'release-report.md',
    'store-listing.md',
    'tutorial-guide.md',
    'security-and-privacy.md',
    'production-readiness.md'
  ]) {
    await fs.access(path.join(root, 'docs', doc));
  }
});

test('package metadata exposes the documented commands', async () => {
  const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.name, 'geo-visibility-os');
  assert.equal(pkg.version, '1.1.0');
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts.test, /node --test/);
});

test('skill scripts ship and expose the documented commands', async () => {
  for (const script of ['lib.mjs', 'scan-site.mjs', 'build-geo-pack.mjs', 'audit-geo-pack.mjs']) {
    const body = await fs.readFile(path.join(skillDir, 'scripts', script), 'utf8');
    assert.ok(body.length > 1000, `${script} looks like a stub`);
  }
  for (const script of ['scan-site.mjs', 'build-geo-pack.mjs', 'audit-geo-pack.mjs']) {
    const body = await fs.readFile(path.join(skillDir, 'scripts', script), 'utf8');
    assert.match(body, /--help/, `${script} must expose --help`);
  }
});

test('no placeholder markers ship in customer-facing files', async () => {
  const targets = [skillFile, path.join(root, 'README.md'), path.join(root, 'docs', 'tutorial-guide.md')];
  for (const target of targets) {
    const body = await fs.readFile(target, 'utf8');
    assert.doesNotMatch(body, /\{\{[a-z_]+\}\}/i, `unreplaced template token in ${path.basename(target)}`);
    assert.doesNotMatch(body, /\bTODO\b|\bTBD\b|lorem ipsum/i, `placeholder in ${path.basename(target)}`);
  }
});

test('examples and expected audit reports exist', async () => {
  for (const file of [
    'pulse-dental-brief.json',
    'pulse-dental-site/index.html',
    'pulse-dental-site/robots.txt',
    'pulse-dental-site/sitemap.xml',
    'pulse-dental-pack/pack.json',
    'broken-pack.json',
    'expected/clean-audit.json',
    'expected/clean-audit.md',
    'expected/broken-audit.json',
    'expected/broken-audit.md'
  ]) {
    await fs.access(path.join(root, 'examples', file));
  }
});

test('manifest lists every shipped file with a matching hash', async () => {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'product-manifest.json'), 'utf8'));
  assert.equal(manifest.name, 'GEO Visibility OS');
  assert.equal(manifest.slug, 'geo-visibility-os');
  assert.equal(manifest.version, '1.1.0');
  assert.equal(manifest.category, 'ai-skill-bundle');
  assert.ok(Array.isArray(manifest.files) && manifest.files.length > 20);
  for (const file of manifest.files) {
    if (file.path === 'docs/package-audit-report.json' || file.path === 'docs/validation-report.json') continue;
    const bytes = await fs.readFile(path.join(root, file.path));
    const hash = createHash('sha256').update(bytes).digest('hex');
    assert.equal(file.sha256, hash, `hash mismatch for ${file.path}`);
    assert.equal(file.bytes, bytes.length, `size mismatch for ${file.path}`);
  }
});
