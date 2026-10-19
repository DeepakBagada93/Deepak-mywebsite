#!/usr/bin/env node
/**
 * advance-engagement — move an engagement to the next phase, with guards.
 *
 * Usage: node advance-engagement.mjs <dir> [--json <file>]
 * Exit: 0 on a successful transition, 1 when the guard blocks it.
 *
 * Guards: the current audit must have no critical or high findings, and every
 * artifact required by the next phase must already exist.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditWorkspace, nextPhase, exists, PHASE_REQUIREMENTS } from './lib.mjs';

const argv = process.argv.slice(2);
let target = null;
let jsonOut = null;
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--json') jsonOut = argv[++i];
  else target = argv[i];
}
if (!target) {
  console.error('Usage: node advance-engagement.mjs <dir> [--json <file>]');
  process.exit(1);
}

const root = path.resolve(target);
if (!(await exists(path.join(root, 'state.json')))) {
  console.error(`No state.json in ${root}. Run init-engagement.mjs first.`);
  process.exit(1);
}

const before = await auditWorkspace(root);
const targetPhase = nextPhase(before.phase);
if (!targetPhase) {
  console.error(`Engagement is already at the final phase (${before.phase}).`);
  process.exit(1);
}

const blocking = before.findings.filter((item) => ['critical', 'high'].includes(item.severity));
const missing = [];
for (const file of PHASE_REQUIREMENTS[targetPhase] || []) {
  if (!(await exists(path.join(root, file)))) missing.push(file);
}

if (blocking.length || missing.length) {
  console.error(`Cannot advance ${before.phase} → ${targetPhase}:`);
  for (const item of blocking) console.error(`  ✗ [${item.severity}] ${item.message}`);
  for (const file of missing) console.error(`  ✗ missing artifact for ${targetPhase}: ${file}`);
  console.error('Nothing was changed.');
  process.exit(1);
}

const statePath = path.join(root, 'state.json');
const state = JSON.parse(await fs.readFile(statePath, 'utf8'));
state.phase = targetPhase;
state.history = [...(state.history || []), { phase: targetPhase, at: new Date().toISOString() }];
await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);

const after = await auditWorkspace(root);
const result = { from: before.phase, to: targetPhase, status: 'advanced', score: after.summary.score, findings: after.summary.findings };
if (jsonOut) {
  await fs.mkdir(path.dirname(path.resolve(jsonOut)), { recursive: true });
  await fs.writeFile(path.resolve(jsonOut), `${JSON.stringify(result, null, 2)}\n`);
}
console.log(`Advanced ${before.phase} → ${targetPhase}. Score ${after.summary.score}/100, ${after.summary.findings} finding(s).`);
