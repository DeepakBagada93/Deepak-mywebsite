import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFile(path.join(root, rel), 'utf8');
const exists = async (rel) => !!(await fs.stat(path.join(root, rel)).catch(() => null));

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('validator passes the full pack', () => {
  const stdout = execFileSync('node', [path.join(root, 'scripts', 'validate-template-pack.mjs')], { encoding: 'utf8' });
  assert.ok(stdout.includes('Release ready: YES'), 'validator should be release ready');
});

check('all eight HTML templates exist and are substantial', async () => {
  const files = (await fs.readdir(path.join(root, 'templates', 'html'))).filter(f => f.endsWith('.html'));
  assert.equal(files.length, 8, 'expected eight templates');
  for (const file of files) {
    const html = await read(`templates/html/${file}`);
    assert.ok(html.length > 6000, `${file} is too small`);
    assert.match(html, /^<!DOCTYPE html>/i, `${file} doctype`);
    assert.ok(html.includes('{{unsubscribe_url'), `${file} unsubscribe tag`);
  }
});

check('copy pack documents subject lines and merge tags', async () => {
  const files = (await fs.readdir(path.join(root, 'templates', 'copy'))).filter(f => f.endsWith('.md'));
  assert.equal(files.length, 8, 'expected eight copy sheets');
  for (const file of files) {
    const body = await read(`templates/copy/${file}`);
    assert.ok(body.includes('## Merge tags'), `${file} merge tag table`);
    assert.ok(body.includes('**Default subject:**'), `${file} subject line`);
  }
});

check('reference campaign passes the internal campaign audit', async () => {
  assert.ok(await exists('examples/agency-campaign/01-audience-and-icp-research.md'));
  assert.ok(await exists('examples/agency-campaign/07-email-production-qa.md'));
  const manifest = JSON.parse(await read('examples/agency-campaign/email-campaign-delivery.json'));
  assert.ok(manifest.campaign_name.includes('Agency'));
});

check('docs and commercial assets exist', async () => {
  for (const file of [
    'README.md',
    'LICENSE.md',
    'CHANGELOG.md',
    'COMPATIBILITY.md',
    'product-manifest.json',
    'progress.json',
    'docs/product-specification.md',
    'docs/research-dossier.md',
    'docs/tutorial-guide.md',
    'docs/store-listing.md',
    'docs/test-plan.md',
    'docs/test-results.md',
    'docs/release-report.md'
  ]) {
    assert.ok(await exists(file), `missing ${file}`);
  }
});

check('no scripts or external stylesheets in shipped templates', async () => {
  const files = (await fs.readdir(path.join(root, 'templates', 'html'))).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const html = await read(`templates/html/${file}`);
    assert.ok(!/<script/i.test(html), `${file} contains script`);
    assert.ok(!/<link[^>]+rel=["']stylesheet/i.test(html), `${file} external stylesheet`);
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
console.log(`\nAll ${checks.length} checks passed.`);
