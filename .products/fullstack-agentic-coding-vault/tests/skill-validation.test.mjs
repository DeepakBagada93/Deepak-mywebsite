import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('SKILL.md exists and contains valid YAML frontmatter', () => {
  const skillPath = path.resolve(root, 'skills/fullstack-agentic-coding-vault/SKILL.md');
  assert.ok(fs.existsSync(skillPath), 'SKILL.md must exist');
  
  const content = fs.readFileSync(skillPath, 'utf8');
  assert.ok(content.startsWith('---'), 'SKILL.md must start with YAML frontmatter');
  assert.ok(content.includes('name: fullstack-agentic-coding-vault'));
  assert.ok(content.includes('description:'));
});

test('Cursor MDC rules exist and define globs', () => {
  const rules = [
    'nextjs-fullstack-guardrails.mdc',
    'clean-architecture-tdd.mdc',
    'database-safety-migrations.mdc'
  ];

  for (const rule of rules) {
    const rulePath = path.resolve(root, 'rules', rule);
    assert.ok(fs.existsSync(rulePath), `Rule ${rule} must exist`);
    const content = fs.readFileSync(rulePath, 'utf8');
    assert.ok(content.includes('globs:'), `Rule ${rule} must define target file globs`);
  }
});
