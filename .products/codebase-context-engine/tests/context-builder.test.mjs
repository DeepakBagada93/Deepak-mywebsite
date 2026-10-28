#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[1], '../../');
const builderScript = path.join(root, 'scripts', 'context-builder.mjs');
const sampleRepo = path.join(root, 'examples', 'react-nextjs-repo');

test('Context Builder CLI Functional Verification', async (t) => {
  await t.test('builder inspects repo and generates Next.js 15 rules', () => {
    const stdout = execFileSync('node', [builderScript, sampleRepo], { encoding: 'utf8' });

    assert.match(stdout, /PROJECT ARCHITECTURAL CONTEXT/);
    assert.match(stdout, /Next\.js/);
    assert.match(stdout, /Tailwind CSS/);
    assert.match(stdout, /Prisma/);
    assert.match(stdout, /NEVER suggest deprecated Next\.js Pages router/);
  });
});
