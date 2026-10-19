#!/usr/bin/env node
/**
 * audit-workflow — static production-readiness audit for n8n workflow exports.
 *
 * Usage: node audit-workflow.mjs <workflow.json | directory> [--json <file>] [--md <file>]
 * Exit: 0 when the audit completes, 1 when a file cannot be parsed.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditWorkflow, loadWorkflow, renderMarkdown } from './lib.mjs';

function parseArgs(argv) {
  const args = { target: '.', json: null, md: null };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--json') args.json = argv[++i];
    else if (argv[i] === '--md') args.md = argv[++i];
    else rest.push(argv[i]);
  }
  if (rest[0]) args.target = rest[0];
  return args;
}

async function collect(target) {
  const stat = await fs.stat(target).catch(() => null);
  if (!stat) throw new Error(`Path does not exist: ${target}`);
  if (stat.isFile()) return [target];
  const files = [];
  for (const entry of await fs.readdir(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(full)));
    else if (entry.name.endsWith('.json') && !entry.name.endsWith('.hardened.json')) files.push(full);
  }
  return files;
}

const args = parseArgs(process.argv.slice(2));
let files;
try {
  files = await collect(path.resolve(args.target));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
if (!files.length) {
  console.error('No workflow JSON files found.');
  process.exit(1);
}

const reports = [];
let failed = 0;
for (const file of files) {
  try {
    const workflow = loadWorkflow(await fs.readFile(file, 'utf8'));
    const report = { file: path.relative(process.cwd(), file), ...auditWorkflow(workflow) };
    reports.push(report);
    console.log(`${report.file}: ${report.summary.findings} finding(s), score ${report.summary.score}/100 (${report.summary.verdict})`);
    for (const item of report.findings) console.log(`  [${item.severity}] ${item.message}`);
  } catch (error) {
    failed += 1;
    console.error(`${file}: cannot parse workflow — ${error.message}`);
  }
}

const output = { schemaVersion: '1.0', generatedAt: new Date().toISOString(), reports };
if (args.json) {
  await fs.mkdir(path.dirname(path.resolve(args.json)), { recursive: true });
  await fs.writeFile(path.resolve(args.json), `${JSON.stringify(output, null, 2)}\n`);
  console.log(`JSON written to ${path.resolve(args.json)}`);
}
if (args.md) {
  const body = reports.map(renderMarkdown).join('\n---\n\n');
  await fs.mkdir(path.dirname(path.resolve(args.md)), { recursive: true });
  await fs.writeFile(path.resolve(args.md), body);
  console.log(`Markdown written to ${path.resolve(args.md)}`);
}

process.exitCode = failed ? 1 : 0;
