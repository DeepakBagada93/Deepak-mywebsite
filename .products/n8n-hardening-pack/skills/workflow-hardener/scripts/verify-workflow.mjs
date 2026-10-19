#!/usr/bin/env node
/**
 * verify-workflow — CI gate for n8n workflow exports.
 *
 * Usage: node verify-workflow.mjs <workflow.json | directory> [--strict] [--json <file>]
 * Exit: 0 when no blocking findings remain, 1 otherwise.
 * Default blocking: critical + high. --strict also blocks medium.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditWorkflow, loadWorkflow } from './lib.mjs';

const argv = process.argv.slice(2);
let target = null;
let jsonOut = null;
let strict = false;
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--json') jsonOut = argv[++i];
  else if (argv[i] === '--strict') strict = true;
  else target = argv[i];
}
if (!target) {
  console.error('Usage: node verify-workflow.mjs <workflow.json | directory> [--strict] [--json <file>]');
  process.exit(1);
}

async function collect(input) {
  const stat = await fs.stat(input).catch(() => null);
  if (!stat) throw new Error(`Path does not exist: ${input}`);
  if (stat.isFile()) return [input];
  const files = [];
  for (const entry of await fs.readdir(input, { withFileTypes: true })) {
    const full = path.join(input, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(full)));
    else if (entry.name.endsWith('.json')) files.push(full);
  }
  return files;
}

const blockingSeverities = strict ? ['critical', 'high', 'medium'] : ['critical', 'high'];
const files = await collect(path.resolve(target));
const results = [];
let failures = 0;

for (const file of files) {
  const workflow = loadWorkflow(await fs.readFile(file, 'utf8'));
  const report = auditWorkflow(workflow);
  const blocking = report.findings.filter((item) => blockingSeverities.includes(item.severity));
  const rel = path.relative(process.cwd(), file);
  results.push({ file: rel, score: report.summary.score, blocking: blocking.map((item) => ({ id: item.id, severity: item.severity, message: item.message })) });
  if (blocking.length) {
    failures += 1;
    console.log(`✗ ${rel}: ${blocking.length} blocking finding(s)`);
    for (const item of blocking) console.log(`   [${item.severity}] ${item.message}`);
  } else {
    console.log(`✓ ${rel}: no blocking findings (score ${report.summary.score}/100)`);
  }
}

if (jsonOut) {
  await fs.mkdir(path.dirname(path.resolve(jsonOut)), { recursive: true });
  await fs.writeFile(path.resolve(jsonOut), `${JSON.stringify({ checkedAt: new Date().toISOString(), strict, status: failures ? 'FAIL' : 'PASS', results }, null, 2)}\n`);
}
console.log(failures ? `\nVERDICT: FAIL (${failures} file(s))` : '\nVERDICT: PASS');
process.exitCode = failures ? 1 : 0;
