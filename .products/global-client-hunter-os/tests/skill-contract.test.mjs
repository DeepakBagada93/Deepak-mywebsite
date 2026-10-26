import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('SKILL.md exists and contains valid frontmatter', async () => {
  const skillFile = path.join(root, 'skills/global-client-hunter-os/SKILL.md');
  const content = await fs.readFile(skillFile, 'utf8');
  assert.match(content, /^---\nname:\s*global-client-hunter-os\ndescription:\s*.+\n---/m);
  assert.ok(content.includes('Prospect Intelligence'));
  assert.ok(content.includes('0% Synthetic Cold Outreach'));
});

test('Examples parse properly and contain valid JSON and Markdown', async () => {
  const prospectJson = path.join(root, 'examples/sample-prospect.json');
  const content = await fs.readFile(prospectJson, 'utf8');
  const parsed = JSON.parse(content);
  assert.equal(parsed.target.company, 'Apex Logistics Cloud Inc.');
  assert.ok(parsed.seller.stack.includes('Next.js'));

  const matrixJson = path.join(root, 'examples/export-pricing-matrix.json');
  const matrix = JSON.parse(await fs.readFile(matrixJson, 'utf8'));
  assert.equal(matrix.baseCurrency, 'USD');
});
