#!/usr/bin/env node
/**
 * harden-workflow — apply safe, deterministic hardening to an n8n workflow export.
 *
 * Usage: node harden-workflow.mjs <workflow.json> [--out <file>]
 * Exit: 0 on success, 1 when the workflow is not safe to transform.
 *
 * Safe transforms only: retries, HTTP timeouts, executionOrder, pinned-data removal.
 * Inline secrets are NEVER rewritten — the tool refuses until they are moved to credentials.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditWorkflow, loadWorkflow } from './lib.mjs';

const RETRYABLE_RE = /(httpRequest|postgres|mysql|mongo|airtable|googleSheets|slack|gmail|emailSend|hubspot|salesforce|notion|graphql)/i;

const argv = process.argv.slice(2);
let target = null;
let out = null;
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--out') out = argv[++i];
  else target = argv[i];
}
if (!target) {
  console.error('Usage: node harden-workflow.mjs <workflow.json> [--out <file>]');
  process.exit(1);
}

const inputPath = path.resolve(target);
let workflow;
try {
  workflow = loadWorkflow(await fs.readFile(inputPath, 'utf8'));
} catch (error) {
  console.error(`Cannot read workflow: ${error.message}`);
  process.exit(1);
}

const before = auditWorkflow(workflow);
const blocking = before.findings.filter((item) => item.type === 'security' && item.severity === 'critical');
if (blocking.length) {
  console.error('Refusing to harden: inline secrets must be moved to n8n credentials first.');
  for (const item of blocking) {
    console.error(`  [${item.severity}] ${item.message}`);
    for (const ev of item.evidence) console.error(`    ${ev.node}: ${ev.path} (${ev.valuePreview})`);
  }
  console.error('Nothing was written. Fix the credentials, re-export, then run this command again.');
  process.exit(1);
}

const patch = [];
for (const node of workflow.nodes) {
  if (RETRYABLE_RE.test(node.type || '') && !node.retryOnFail) {
    node.retryOnFail = true;
    node.maxTries = 3;
    node.waitBetweenTries = 1000;
    patch.push(`${node.name}: retry 3× with 1s wait`);
  }
  if (/httpRequest/i.test(node.type || '')) {
    node.parameters = node.parameters || {};
    node.parameters.options = node.parameters.options || {};
    if (!node.parameters.options.timeout) {
      node.parameters.options.timeout = 30000;
      patch.push(`${node.name}: HTTP timeout 30000 ms`);
    }
  }
}
workflow.settings = workflow.settings || {};
if (workflow.settings.executionOrder !== 'v1') {
  workflow.settings.executionOrder = 'v1';
  patch.push('settings: executionOrder v1');
}
if (workflow.pinData && Object.keys(workflow.pinData).length) {
  workflow.pinData = {};
  patch.push('pinData: cleared');
}

const outputPath = path.resolve(out || inputPath.replace(/\.json$/i, '') + '.hardened.json');
await fs.writeFile(outputPath, `${JSON.stringify(workflow, null, 2)}\n`);

const after = auditWorkflow(workflow);
console.log(`Hardened copy written to ${outputPath}`);
console.log(`Applied ${patch.length} safe patch(es):`);
for (const item of patch) console.log(`  + ${item}`);
console.log(`Score: ${before.summary.score} → ${after.summary.score}`);
const remaining = after.findings.filter((item) => ['critical', 'high'].includes(item.severity));
if (remaining.length) {
  console.log('Remaining manual work (not auto-fixed):');
  for (const item of remaining) console.log(`  [${item.severity}] ${item.message}`);
}
