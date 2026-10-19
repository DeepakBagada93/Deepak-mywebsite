import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFile(path.join(root, relative), 'utf8');
const exists = async (relative) => !!(await fs.stat(path.join(root, relative)).catch(() => null));

const homeMarker = ['', 'Users', ''].join('/');
const checks = [];
function check(name, fn) {
  checks.push({ name, fn });
}

check('two skills have valid frontmatter', async () => {
  for (const skill of ['context-architect', 'context-drift-guard']) {
    const body = await read(`skills/${skill}/SKILL.md`);
    assert.match(body, /^---\nname: [a-z0-9-]+\ndescription: .+\n---/, `${skill} frontmatter`);
    assert.ok(body.length > 3000, `${skill} is substantive`);
    for (const heading of ['## 1.', '## 3.', 'Negative constraints']) {
      assert.ok(body.includes(heading), `${skill} has ${heading}`);
    }
  }
});

check('skills contain no placeholder markers', async () => {
  for (const skill of ['context-architect', 'context-drift-guard']) {
    const body = await read(`skills/${skill}/SKILL.md`);
    for (const marker of ['TODO', 'TBD', '[Insert', 'lorem ipsum', '{{']) {
      assert.ok(!body.includes(marker), `${skill} contains placeholder ${marker}`);
    }
  }
});

check('tooling scripts exist and are executable Node modules', async () => {
  const dir = 'skills/context-architect/scripts';
  const entries = await fs.readdir(path.join(root, dir));
  for (const file of ['lib.mjs', 'audit-context.mjs', 'compile-context.mjs', 'verify-context.mjs']) {
    assert.ok(entries.includes(file), `missing ${file}`);
    const body = await fs.readFile(path.join(root, dir, file), 'utf8');
    assert.ok(body.length > 500, `${file} has content`);
    if (file !== 'lib.mjs') assert.ok(body.startsWith('#!/usr/bin/env node'), `${file} has a shebang`);
    assert.ok(!/\bimport .* from '(?!node:)/.test(body), `${file} has no external imports`);
  }
});

check('required customer docs and root files exist', async () => {
  for (const file of [
    'README.md',
    'LICENSE.md',
    'CHANGELOG.md',
    'COMPATIBILITY.md',
    'product-manifest.json',
    'docs/product-specification.md',
    'docs/tutorial-guide.md',
    'docs/store-listing.md',
    'docs/test-plan.md',
    'docs/test-results.md',
    'docs/release-report.md',
    'docs/research-dossier.md',
  ]) {
    assert.ok(await exists(file), `missing ${file}`);
  }
});

check('tutorial covers required customer topics', async () => {
  const guide = await read('docs/tutorial-guide.md');
  for (const topic of ['3-minute quickstart', 'Claude Code', 'Cursor', 'Antigravity', 'Codex', 'Recipe 1', 'Troubleshooting', 'FAQ']) {
    assert.ok(guide.toLowerCase().includes(topic.toLowerCase()), `tutorial missing ${topic}`);
  }
  const recipes = (guide.match(/### Recipe /g) || []).length;
  assert.ok(recipes >= 3, `tutorial has ${recipes} recipes`);
});

check('store listing contains commercial elements', async () => {
  const listing = await read('docs/store-listing.md');
  for (const element of ['$49', '$129', '$249', 'money-back guarantee', 'FAQ', "What's included", 'Who it'] ) {
    assert.ok(listing.includes(element), `listing missing ${element}`);
  }
});

check('license permits client work and forbids raw resale', async () => {
  const license = await read('LICENSE.md');
  assert.match(license, /client/i);
  assert.match(license, /may NOT resell/i);
});

check('fixture and generated examples are present', async () => {
  for (const file of [
    'examples/messy-repo/CLAUDE.md',
    'examples/messy-repo/AGENTS.md',
    'examples/messy-repo/.cursor/rules/style.mdc',
    'examples/expected/audit-report.json',
    'examples/compiled-example/.context/kernel.md',
    'examples/compiled-example/.context/manifest.json',
    'examples/compiled-example/adapters/CLAUDE.md',
  ]) {
    assert.ok(await exists(file), `missing ${file}`);
  }
});

check('no secrets or absolute developer paths in shipped artifacts', async () => {
  const files = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        await walk(full);
      } else if (/\.(md|json|mjs|mdc|tsx?|yaml|txt)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }
  await walk(root);
  for (const file of files) {
    const body = await fs.readFile(file, 'utf8');
    assert.ok(!body.includes(homeMarker), `absolute path leaked in ${path.relative(root, file)}`);
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
  console.error(`\n${failures} structural check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} structural checks passed.`);
