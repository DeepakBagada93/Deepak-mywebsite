import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('SKILL.md exists and contains valid frontmatter', async () => {
  const skillFile = path.join(root, 'skills/bharat-local-seo-kit/SKILL.md');
  const content = await fs.readFile(skillFile, 'utf8');
  assert.match(content, /^---\nname:\s*bharat-local-seo-kit\ndescription:\s*.+\n---/m);
  assert.ok(content.includes('Local NAP & Profile Completeness Audit'));
  assert.ok(content.includes('52-Week Bharat Festive'));
});

test('JSON-LD schema parses validly with geo coordinates', async () => {
  const schemaFile = path.join(root, 'examples/local-business-schema.json');
  const content = await fs.readFile(schemaFile, 'utf8');
  const parsed = JSON.parse(content);
  assert.equal(parsed['@context'], 'https://schema.org');
  assert.equal(parsed['@type'], 'Dentist');
  assert.equal(parsed.geo.latitude, 12.9784);
});
