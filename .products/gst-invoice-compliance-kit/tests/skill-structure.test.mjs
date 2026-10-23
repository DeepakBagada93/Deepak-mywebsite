import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFile(path.join(root, relative), 'utf8');
const exists = async (relative) => !!(await fs.stat(path.join(root, relative)).catch(() => null));
const homeMarker = ['', 'Users', ''].join('/');
const skillPath = 'skills/gst-invoice-compliance-kit/SKILL.md';

test('skill frontmatter carries the package name and a description', async (t) => {
  if (!(await exists(skillPath))) return t.skip('SKILL.md is supplied by the documentation stage');
  const body = await read(skillPath);
  assert.match(body, /^---\nname: gst-invoice-compliance-kit\ndescription: .+\n---/);
  assert.ok(body.length > 3000);
});

test('skill documents identity, input contract, pipeline, scoring, constraints and failure handling', async (t) => {
  if (!(await exists(skillPath))) return t.skip('SKILL.md is supplied by the documentation stage');
  const body = (await read(skillPath)).toLowerCase();
  for (const keyword of ['identity', 'input contract', 'pipeline', 'scoring rubric', 'negative constraints', 'failure handling']) {
    assert.ok(body.includes(keyword), `missing section keyword: ${keyword}`);
  }
  for (const marker of ['TODO', 'TBD', '[Insert', '{{']) assert.ok(!(await read(skillPath)).includes(marker), marker);
});

test('scripts are dependency-free, executable entry points', async () => {
  const dir = 'skills/gst-invoice-compliance-kit/scripts';
  for (const file of ['lib.mjs', 'audit-invoice.mjs', 'batch-audit.mjs', 'hsn-lookup.mjs']) {
    const body = await fs.readFile(path.join(root, dir, file), 'utf8');
    assert.ok(body.length > 400, file);
    if (file !== 'lib.mjs') assert.ok(body.startsWith('#!/usr/bin/env node'), file);
    const imports = [...body.matchAll(/from '([^']+)'/g)].map((match) => match[1]);
    for (const specifier of imports) {
      assert.ok(specifier.startsWith('node:') || specifier.startsWith('./'), `${file} imports ${specifier}`);
    }
  }
});

test('test plan and test results are present', async () => {
  for (const file of ['docs/test-plan.md', 'docs/test-results.md']) {
    assert.ok(await exists(file), file);
    assert.ok((await read(file)).length > 500, file);
  }
});

test('example fixtures and golden outputs parse', async () => {
  for (const file of [
    'examples/invoice.clean.json',
    'examples/invoice.fixture.json',
    'examples/invoices.batch.json',
    'examples/expected/invoice-clean.json',
    'examples/expected/invoice-fixture.json',
    'examples/expected/batch.json'
  ]) {
    assert.ok(await exists(file), file);
    JSON.parse(await read(file));
  }
  for (const file of [
    'examples/expected/invoice-clean.md',
    'examples/expected/invoice-fixture.md',
    'examples/expected/batch.md'
  ]) {
    assert.ok(await exists(file), file);
    assert.ok((await read(file)).includes('# GST Invoice'), file);
  }
  const clean = JSON.parse(await read('examples/expected/invoice-clean.json'));
  assert.equal(clean.summary.score, 100);
  assert.ok(Array.isArray(clean.findings));
  assert.equal(clean.findings.length, 0);
  const broken = JSON.parse(await read('examples/expected/invoice-fixture.json'));
  assert.equal(broken.summary.verdict, 'DO NOT ISSUE');
  const batch = JSON.parse(await read('examples/expected/batch.json'));
  assert.equal(batch.invoiceCount, 3);
  assert.equal(batch.checkedAt, '2026-10-20T00:00:00.000Z');
});

test('tutorial covers clients, recipes and troubleshooting', async (t) => {
  if (!(await exists('docs/tutorial-guide.md'))) return t.skip('tutorial-guide.md is supplied by the documentation stage');
  const guide = await read('docs/tutorial-guide.md');
  for (const topic of ['quickstart', 'Claude Code', 'Cursor', 'Antigravity', 'Codex', 'Troubleshooting', 'FAQ']) {
    assert.ok(guide.toLowerCase().includes(topic.toLowerCase()), topic);
  }
  assert.ok((guide.match(/### Recipe /g) || []).length >= 3);
});

test('store listing carries a guarantee and FAQ', async (t) => {
  if (!(await exists('docs/store-listing.md'))) return t.skip('store-listing.md is supplied by the documentation stage');
  const listing = await read('docs/store-listing.md');
  for (const item of ['money-back guarantee', 'FAQ']) {
    assert.ok(listing.toLowerCase().includes(item.toLowerCase()), item);
  }
});

test('license permits client work and forbids raw resale', async (t) => {
  if (!(await exists('LICENSE.md'))) return t.skip('LICENSE.md is supplied by the documentation stage');
  const license = await read('LICENSE.md');
  assert.match(license, /client/i);
  assert.match(license, /may NOT resell/i);
});

async function shippedFiles() {
  const files = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['dist', 'node_modules', '.git'].includes(entry.name)) continue;
        await walk(full);
      } else if (/\.(md|json|mjs)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }
  await walk(root);
  return files;
}

test('shipped files contain no absolute developer paths', async () => {
  for (const file of await shippedFiles()) {
    const body = await fs.readFile(file, 'utf8');
    assert.ok(!body.includes(homeMarker), `absolute path leak in ${path.relative(root, file)}`);
  }
});

test('shipped files contain no credentials or private keys', async () => {
  const patterns = [
    /AKIA[0-9A-Z]{16}/,
    /BEGIN (?:RSA|OPENSSH|EC|PGP) PRIVATE KEY/,
    /sk-[A-Za-z0-9]{20,}/,
    /ghp_[A-Za-z0-9]{20,}/,
    /xox[baprs]-[A-Za-z0-9-]{10,}/
  ];
  for (const file of await shippedFiles()) {
    const body = await fs.readFile(file, 'utf8');
    for (const pattern of patterns) {
      assert.ok(!pattern.test(body), `possible secret in ${path.relative(root, file)}`);
    }
  }
});
