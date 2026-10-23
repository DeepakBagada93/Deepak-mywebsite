import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFile(path.join(root, relative), 'utf8');

test('skill has parseable frontmatter and required operating sections', async () => {
  const body = await read('skills/itc-recovery-desk/SKILL.md');
  assert.match(body, /^---\nname:\s*itc-recovery-desk\ndescription:\s*.+\n---/m);
  for (const section of [
    'Identity and purpose',
    'Activation triggers',
    'Non-triggers',
    'Input contract',
    'Workflow',
    'Output contract',
    'Negative constraints',
    'Failure handling',
    'Acceptance evidence'
  ]) {
    assert.match(body, new RegExp(section, 'i'), `missing section: ${section}`);
  }
  assert.doesNotMatch(body, /TODO|TBD|placeholder/i);
});

test('README contains a first successful run and limitations', async () => {
  const body = await read('README.md');
  assert.match(body, /First successful run/i);
  assert.match(body, /Potential ITC at risk is a review amount/i);
  assert.match(body, /No legal ITC eligibility logic/i);
  assert.match(body, /node --test tests\/\*\.test\.mjs/);
});

test('required customer documentation exists', async () => {
  for (const file of [
    'docs/product-specification.md',
    'docs/research-dossier.md',
    'docs/validation-plan.md',
    'docs/tutorial-guide.md',
    'docs/store-listing.md',
    'docs/test-plan.md',
    'docs/test-results.md',
    'docs/release-report.md'
  ]) {
    const stat = await fs.stat(path.join(root, file));
    assert.ok(stat.size > 0, `${file} is empty`);
  }
});

test('runtime scripts import only node built-ins and local modules', async () => {
  for (const file of [
    'skills/itc-recovery-desk/scripts/lib.mjs',
    'skills/itc-recovery-desk/scripts/reconcile.mjs'
  ]) {
    const body = await read(file);
    const imports = [...body.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1]);
    for (const specifier of imports) {
      assert.ok(
        specifier.startsWith('node:') || specifier.startsWith('./') || specifier.startsWith('../'),
        `${file} imports a non-built-in dependency: ${specifier}`
      );
    }
    assert.doesNotMatch(body, /https?:\/\//, `${file} contains a network URL`);
  }
});

test('examples do not contain absolute personal paths', async () => {
  async function walk(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        const body = await fs.readFile(full, 'utf8');
        assert.doesNotMatch(body, /\/Users\/|\/home\/|[A-Z]:\\Users\\/, `${full} contains an absolute path`);
      }
    }
  }
  await walk(path.join(root, 'examples'));
});
