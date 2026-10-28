#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[1], '../../');
const scannerScript = path.join(root, 'scripts', 'launch-sentinel.mjs');

test('Sentinel Scanner CLI Functional Verification', async (t) => {
  await t.test('scanner detects vulnerabilities in vulnerable-mvp', async () => {
    const vulnDir = path.join(root, 'examples', 'vulnerable-mvp');
    const output = execFileSync('node', [scannerScript, vulnDir], { encoding: 'utf8' });

    assert.match(output, /Audit Complete/);
    assert.match(output, /Launch Readiness Score: 30% \/ 100%/);
    assert.match(output, /Failed Vectors: 9 \/ 12/);

    const reportPath = path.join(vulnDir, 'LAUNCH-AUDIT-REPORT.md');
    const reportContent = await fs.readFile(reportPath, 'utf8');
    assert.match(reportContent, /HIGH RISK - REMEDIATION REQUIRED/);
    assert.match(reportContent, /\[V-01\] Stripe Webhook Signature Verification/);
  });

  await t.test('scanner confirms 100% pass on hardened-mvp', async () => {
    const hardDir = path.join(root, 'examples', 'hardened-mvp');
    const output = execFileSync('node', [scannerScript, hardDir], { encoding: 'utf8' });

    assert.match(output, /Audit Complete/);
    assert.match(output, /Launch Readiness Score: 100% \/ 100%/);
    assert.match(output, /Passed Vectors: 12 \/ 12/);
    assert.match(output, /Failed Vectors: 0 \/ 12/);

    const reportPath = path.join(hardDir, 'LAUNCH-AUDIT-REPORT.md');
    const reportContent = await fs.readFile(reportPath, 'utf8');
    assert.match(reportContent, /READY FOR PRODUCTION LAUNCH/);
    assert.match(reportContent, /All 12 critical launch vectors passed/);
  });
});
