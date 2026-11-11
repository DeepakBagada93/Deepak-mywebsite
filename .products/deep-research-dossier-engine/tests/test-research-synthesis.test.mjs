import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Deep research mock inputs parse and validate properly', () => {
  const payloadPath = path.resolve(root, 'tests/sample-payload.json');
  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

  assert.ok(payload.topic || payload.competitor, 'Must specify topic or competitor');
  assert.equal(payload.depth, 'deep');
  assert.ok(payload.max_sources > 0);
});

test('Workflows contain required nodes and structure', () => {
  const wfPath = path.resolve(root, 'workflows/main-automation.json');
  const wf = JSON.parse(fs.readFileSync(wfPath, 'utf8'));

  assert.ok(Array.isArray(wf.nodes));
  assert.ok(wf.nodes.some(n => n.name === 'Tavily Parallel Deep Search'));
  assert.ok(wf.nodes.some(n => n.name === 'Synthesize Executive Dossier'));
});
