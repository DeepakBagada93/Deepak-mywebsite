#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[1], '../../');
const toolScript = path.join(root, 'scripts', 'schema-to-saas.mjs');
const specPath = path.join(root, 'examples', 'weather-ai-api', 'openapi-spec.json');

test('Schema to SaaS CLI Functional Verification', async (t) => {
  await t.test('parses openapi spec and generates API key verification code', () => {
    const stdout = execFileSync('node', [toolScript, specPath], { encoding: 'utf8' });

    assert.match(stdout, /verifyApiKey/);
    assert.match(stdout, /recordApiUsage/);
    assert.match(stdout, /crypto\.createHash\('sha256'\)/);
  });
});
