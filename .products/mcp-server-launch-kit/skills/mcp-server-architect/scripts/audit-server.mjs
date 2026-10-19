#!/usr/bin/env node
/**
 * audit-server — static launch audit for an MCP server directory.
 *
 * Usage: node audit-server.mjs <dir> [--json <file>] [--md <file>]
 * Exit: 0 when the audit completes, 1 when the directory is missing.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditProject, exists, readJson, renderMarkdown } from './lib.mjs';

const argv = process.argv.slice(2);
let target = null;
let jsonOut = null;
let mdOut = null;
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--json') jsonOut = argv[++i];
  else if (argv[i] === '--md') mdOut = argv[++i];
  else target = argv[i];
}
if (!target) {
  console.error('Usage: node audit-server.mjs <dir> [--json <file>] [--md <file>]');
  process.exit(1);
}

const root = path.resolve(target);
if (!(await exists(root))) {
  console.error(`Directory does not exist: ${root}`);
  process.exit(1);
}

const spec = await readJson(path.join(root, 'mcp.spec.json'));
const report = await auditProject(root, spec);

if (jsonOut) {
  await fs.mkdir(path.dirname(path.resolve(jsonOut)), { recursive: true });
  await fs.writeFile(path.resolve(jsonOut), `${JSON.stringify(report, null, 2)}\n`);
}
if (mdOut) {
  await fs.mkdir(path.dirname(path.resolve(mdOut)), { recursive: true });
  await fs.writeFile(path.resolve(mdOut), renderMarkdown(report));
}

console.log(`${report.project.name}: ${report.summary.findings} finding(s), score ${report.summary.score}/100 (${report.summary.verdict})`);
for (const item of report.findings) console.log(`  [${item.severity}] ${item.message}`);
if (jsonOut) console.log(`JSON written to ${path.resolve(jsonOut)}`);
if (mdOut) console.log(`Markdown written to ${path.resolve(mdOut)}`);
