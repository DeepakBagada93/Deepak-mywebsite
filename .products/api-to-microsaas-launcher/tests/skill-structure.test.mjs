#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[1], '../../');

test('Skill Root Structure & Core Files', async (t) => {
  await t.test('required root files exist', async () => {
    const required = ['README.md', 'LICENSE.md', 'CHANGELOG.md', 'COMPATIBILITY.md'];
    for (const file of required) {
      const exists = await fs.stat(path.join(root, file)).catch(() => null);
      assert.ok(exists, `Expected file to exist: ${file}`);
    }
  });

  await t.test('skill definition has valid YAML frontmatter', async () => {
    const skillPath = path.join(root, 'skills', 'microsaas-launcher', 'SKILL.md');
    const content = await fs.readFile(skillPath, 'utf8');
    assert.match(content, /^---\s*\nname:\s*microsaas-launcher\ndescription:\s*.+\n---/m);
    assert.ok(content.length > 1000, 'SKILL.md must contain comprehensive instructions (>1000 chars)');
  });

  await t.test('docs folder has complete documentation suite', async () => {
    const requiredDocs = [
      'docs/research-dossier.md',
      'docs/product-specification.md',
      'docs/tutorial-guide.md',
      'docs/store-listing.md'
    ];
    for (const doc of requiredDocs) {
      const exists = await fs.stat(path.join(root, doc)).catch(() => null);
      assert.ok(exists, `Expected documentation file to exist: ${doc}`);
    }
  });

  await t.test('examples directory has weather AI API deliverables', async () => {
    const files = [
      'examples/weather-ai-api/openapi-spec.json',
      'examples/weather-ai-api/generated-dashboard-route.tsx',
      'examples/weather-ai-api/generated-metered-billing.ts'
    ];
    for (const file of files) {
      const exists = await fs.stat(path.join(root, file)).catch(() => null);
      assert.ok(exists, `Expected example file to exist: ${file}`);
    }
  });
});
