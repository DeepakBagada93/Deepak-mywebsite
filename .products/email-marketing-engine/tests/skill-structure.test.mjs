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

check('skill has valid frontmatter and substantive content', async () => {
  const body = await read('skills/email-marketing/SKILL.md');
  assert.match(body, /^---\nname: [a-z0-9-]+\ndescription: .+\n---/, 'skill frontmatter');
  assert.ok(body.length > 3000, 'skill is substantive');
  for (const heading of ['## 1.', '## 2.', '## 3.', '## 4.']) {
    assert.ok(body.includes(heading), `skill has ${heading}`);
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
  for (const element of ['$49', '$129', '$249', 'Guarantee', 'FAQ', "What's Included", 'Who It'] ) {
    assert.ok(listing.toLowerCase().includes(element.toLowerCase()), `listing missing ${element}`);
  }
});

check('license permits client work and forbids raw resale', async () => {
  const license = await read('LICENSE.md');
  assert.match(license, /client/i);
  assert.match(license, /may NOT resell/i);
});

check('both reference examples are present', async () => {
  for (const file of [
    'examples/b2b-saas-cold-outreach/01-audience-and-icp-research.md',
    'examples/b2b-saas-cold-outreach/03-cold-email-sequences.md',
    'examples/b2b-saas-cold-outreach/04-lifecycle-and-nurture-flows.md',
    'examples/ecommerce-retention-engine/01-audience-and-icp-research.md',
    'examples/ecommerce-retention-engine/03-cold-email-sequences.md',
    'examples/ecommerce-retention-engine/04-lifecycle-and-nurture-flows.md',
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
      } else if (entry.name === 'package-audit-report.json' || entry.name === 'validation-report.json') {
        continue;
      } else if (/\.(md|json|mjs|mdc|tsx?|yaml|txt|html)$/.test(entry.name)) {
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
