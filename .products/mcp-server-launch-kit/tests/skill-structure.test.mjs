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

check('skill frontmatter and mandatory sections', async () => {
  const body = await read('skills/mcp-server-architect/SKILL.md');
  assert.match(body, /^---\nname: [a-z0-9-]+\ndescription: .+\n---/);
  assert.ok(body.length > 3000);
  for (const heading of ['## 3.', '## 5. Negative constraints', 'Failure handling']) assert.ok(body.includes(heading));
});

check('no placeholder markers in skill', async () => {
  const body = await read('skills/mcp-server-architect/SKILL.md');
  for (const marker of ['TODO', 'TBD', '[Insert', '{{']) assert.ok(!body.includes(marker), marker);
});

check('scripts exist with shebangs and node-only imports', async () => {
  const dir = 'skills/mcp-server-architect/scripts';
  const entries = await fs.readdir(path.join(root, dir));
  for (const file of ['lib.mjs', 'scaffold-server.mjs', 'audit-server.mjs', 'verify-server.mjs']) {
    assert.ok(entries.includes(file), file);
    const body = await fs.readFile(path.join(root, dir, file), 'utf8');
    assert.ok(body.length > 400, file);
    if (file !== 'lib.mjs') assert.ok(body.startsWith('#!/usr/bin/env node'), file);
    assert.ok(!/from '(?!node:|\.\/)/.test(body), `${file} has an external import`);
  }
});

check('required files exist', async () => {
  for (const file of [
    'README.md', 'LICENSE.md', 'CHANGELOG.md', 'COMPATIBILITY.md', 'product-manifest.json',
    'docs/product-specification.md', 'docs/tutorial-guide.md', 'docs/store-listing.md',
    'docs/test-plan.md', 'docs/test-results.md', 'docs/release-report.md', 'docs/research-dossier.md',
  ]) assert.ok(await exists(file), file);
});

check('tutorial covers clients, recipes, troubleshooting', async () => {
  const guide = await read('docs/tutorial-guide.md');
  for (const topic of ['quickstart', 'Claude Code', 'Cursor', 'Antigravity', 'Codex', 'Recipe 1', 'Troubleshooting', 'FAQ']) {
    assert.ok(guide.toLowerCase().includes(topic.toLowerCase()), topic);
  }
  assert.ok((guide.match(/### Recipe /g) || []).length >= 3);
});

check('listing has pricing, guarantee, FAQ, inclusions', async () => {
  const listing = await read('docs/store-listing.md');
  for (const item of ['$79', '$199', '$299', 'money-back guarantee', 'FAQ', "What's included"]) assert.ok(listing.includes(item), item);
});

check('license permits client work and generated output ownership', async () => {
  const license = await read('LICENSE.md');
  assert.match(license, /client/i);
  assert.match(license, /may NOT resell/i);
  assert.match(license, /generated servers/i);
});

check('specs and generated examples exist and parse', async () => {
  for (const file of [
    'examples/repo-search.spec.json',
    'examples/insecure-server/mcp.spec.json',
    'examples/scaffolded-example/server.mjs',
    'examples/scaffolded-example/tools.mjs',
    'examples/expected/audit-insecure-server.json',
    'examples/expected/audit-scaffolded-example.json',
  ]) assert.ok(await exists(file), file);
  for (const file of ['examples/repo-search.spec.json', 'examples/scaffolded-example/mcp.spec.json', 'examples/expected/audit-scaffolded-example.json']) {
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
      } else if (/\.(md|json|mjs)$/.test(entry.name)) files.push(full);
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
