#!/usr/bin/env node
/**
 * verify-server — release gate for an MCP server.
 *
 * Usage: node verify-server.mjs <dir> [--strict] [--json <file>]
 * Exit: 0 when no blocking findings remain, 1 otherwise.
 * Blocking by default: critical + high. --strict also blocks medium.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditProject, exists, readJson } from './lib.mjs';

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
  console.error('Usage: node verify-server.mjs <dir> [--strict] [--json <file>]');
  process.exit(1);
}

const root = path.resolve(target);
if (!(await exists(root))) {
  console.error(`Directory does not exist: ${root}`);
  process.exit(1);
}

const spec = await readJson(path.join(root, 'mcp.spec.json'));
const report = await auditProject(root, spec);
const blockingSeverities = strict ? ['critical', 'high', 'medium'] : ['critical', 'high'];
const blocking = report.findings.filter((item) => blockingSeverities.includes(item.severity));

for (const item of report.findings.filter((entry) => !blocking.includes(entry))) {
  console.log(`  ! [${item.severity}] ${item.message}`);
}
for (const item of blocking) console.log(`  ✗ [${item.severity}] ${item.message}`);

const status = blocking.length ? 'FAIL' : 'PASS';
console.log(`\n${status} — ${report.project.name}: score ${report.summary.score}/100, ${blocking.length} blocking finding(s)`);

if (jsonOut) {
  await fs.mkdir(path.dirname(path.resolve(jsonOut)), { recursive: true });
  await fs.writeFile(
    path.resolve(jsonOut),
    `${JSON.stringify({ checkedAt: new Date().toISOString(), status, strict, score: report.summary.score, blocking }, null, 2)}\n`,
  );
}
process.exitCode = blocking.length ? 1 : 0;
