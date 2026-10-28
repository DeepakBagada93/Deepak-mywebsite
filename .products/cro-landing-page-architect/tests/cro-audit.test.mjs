#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[1], '../../');
const toolScript = path.join(root, 'scripts', 'cro-audit.mjs');
const lowPath = path.join(root, 'examples', 'saas-landing-page', 'low-converting-hero.html');
const highPath = path.join(root, 'examples', 'saas-landing-page', 'high-converting-hero.html');

test('CRO Audit CLI Functional Verification', async (t) => {
  await t.test('detects failures on low-converting page', () => {
    const stdout = execFileSync('node', [toolScript, lowPath], { encoding: 'utf8' });
    const result = JSON.parse(stdout);

    assert.ok(result.score <= 30, 'Low-converting score should be <= 30%');
    assert.ok(result.failed.length >= 7, 'Should flag at least 7 failed dimensions');
  });

  await t.test('confirms 100% pass on high-converting page', () => {
    const stdout = execFileSync('node', [toolScript, highPath], { encoding: 'utf8' });
    const result = JSON.parse(stdout);

    assert.strictEqual(result.score, 100, 'High-converting score should be 100%');
    assert.strictEqual(result.failed.length, 0, 'Zero failed dimensions');
    assert.strictEqual(result.passed.length, 10, 'All 10 dimensions passed');
  });
});
