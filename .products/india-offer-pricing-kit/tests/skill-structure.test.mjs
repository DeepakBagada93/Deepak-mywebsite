import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFile(path.join(root, relative), 'utf8');
const exists = async (relative) => !!(await fs.stat(path.join(root, relative)).catch(() => null));
const homeMarker = ['', 'Users', ''].join('/');

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('skill frontmatter and required sections', async () => {
  const body = await read('skills/india-offer-pricing-kit/SKILL.md');
  assert.match(body, /^---\nname: india-offer-pricing-kit\ndescription: .+\n---/);
  assert.ok(body.length > 3000);
  for (const heading of ['## 3.', '## 5. Negative constraints', 'Failure handling', 'Scoring rubric']) {
    assert.ok(body.includes(heading), heading);
  }
});

check('no placeholder markers in skill instructions', async () => {
  const body = await read('skills/india-offer-pricing-kit/SKILL.md');
  for (const marker of ['TODO', 'TBD', '[Insert', '{{']) assert.ok(!body.includes(marker), marker);
});

check('scripts are dependency-free and executable', async () => {
  const dir = 'skills/india-offer-pricing-kit/scripts';
  for (const file of ['lib.mjs', 'price-offer.mjs', 'audit-offer-page.mjs']) {
    const body = await fs.readFile(path.join(root, dir, file), 'utf8');
    assert.ok(body.length > 400, file);
    if (file !== 'lib.mjs') assert.ok(body.startsWith('#!/usr/bin/env node'), file);
    const imports = [...body.matchAll(/from '([^']+)'/g)].map((match) => match[1]);
    for (const specifier of imports) {
      assert.ok(specifier.startsWith('node:') || specifier.startsWith('./'), `${file} imports ${specifier}`);
    }
  }
});

check('required files and docs exist', async () => {
  for (const file of [
    'README.md', 'LICENSE.md', 'CHANGELOG.md', 'COMPATIBILITY.md', 'product-manifest.json',
    'docs/product-specification.md', 'docs/tutorial-guide.md', 'docs/store-listing.md',
    'docs/test-plan.md', 'docs/test-results.md', 'docs/release-report.md', 'docs/research-dossier.md'
  ]) assert.ok(await exists(file), file);
});

check('tutorial covers clients and recipes', async () => {
  const guide = await read('docs/tutorial-guide.md');
  for (const topic of ['quickstart', 'Claude Code', 'Cursor', 'Antigravity', 'Codex', 'Recipe 1', 'Troubleshooting', 'FAQ']) {
    assert.ok(guide.toLowerCase().includes(topic.toLowerCase()), topic);
  }
  assert.ok((guide.match(/### Recipe /g) || []).length >= 3);
});

check('listing has pricing, guarantee, FAQ and inclusions', async () => {
  const listing = await read('docs/store-listing.md');
  for (const item of ['₹999', '₹2,499', '₹4,999', 'money-back guarantee', 'FAQ', "What's included"]) {
    assert.ok(listing.includes(item), item);
  }
});

check('license permits client work and forbids raw resale', async () => {
  const license = await read('LICENSE.md');
  assert.match(license, /client/i);
  assert.match(license, /may NOT resell/i);
});

check('examples and expected outputs parse', async () => {
  for (const file of [
    'examples/economics.single.json',
    'examples/economics.bundle.json',
    'examples/offer-page.clean.json',
    'examples/offer-page.fixture.json',
    'examples/expected/pricing-single.json',
    'examples/expected/pricing-bundle.json',
    'examples/expected/offer-audit-clean.json',
    'examples/expected/offer-audit-fixture.json'
  ]) {
    assert.ok(await exists(file), file);
    JSON.parse(await read(file));
  }
});

check('no absolute developer paths in shipped files', async () => {
  const files = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['dist', 'node_modules', '.git'].includes(entry.name)) continue;
        await walk(full);
      } else if (/\.(md|json|mjs)$/.test(entry.name) && !['package-audit-report.json', 'validation-report.json'].includes(entry.name)) files.push(full);
    }
  }
  await walk(root);
  for (const file of files) {
    const body = await fs.readFile(file, 'utf8');
    assert.ok(!body.includes(homeMarker), `leak in ${path.relative(root, file)}`);
  }
});

let failures = 0;
for (const { name, fn } of checks) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${name}\n    ${error.message}`);
  }
}
if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} structural checks passed.`);
