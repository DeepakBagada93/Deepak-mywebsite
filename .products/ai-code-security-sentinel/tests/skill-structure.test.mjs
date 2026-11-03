import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

test('Skill Structure: SKILL.md exists with valid YAML frontmatter', async () => {
  const skillPath = path.join(root, 'skills', 'ai-code-security-sentinel', 'SKILL.md');
  const content = await fs.readFile(skillPath, 'utf8');

  assert.match(content, /^---\s*\nname:\s*ai-code-security-sentinel\s*\ndescription:\s*.+\n---/m,
    'SKILL.md must have valid YAML frontmatter with name and description');
  
  assert.ok(content.length > 800, 'SKILL.md must contain comprehensive operational instructions');
  assert.match(content, /Phase 1: Target Discovery/i, 'Must contain multi-phase instructions');
  assert.match(content, /Phase 2: Secret & Sensitive Token/i, 'Must contain secret detection phase');
  assert.match(content, /OWASP/i, 'Must reference OWASP standards');
});

test('Skill Structure: Required customer-facing documentation exists', async () => {
  const required = [
    'README.md',
    'LICENSE.md',
    'CHANGELOG.md',
    'COMPATIBILITY.md',
    'docs/tutorial-guide.md',
    'docs/store-listing.md',
    'docs/product-specification.md',
    'docs/test-plan.md'
  ];

  for (const rel of required) {
    const full = path.join(root, rel);
    const stat = await fs.stat(full).catch(() => null);
    assert.ok(stat && stat.isFile(), `Required file must exist: ${rel}`);
  }
});
