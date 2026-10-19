#!/usr/bin/env node
/**
 * audit-engagement — audit an engagement workspace for its current phase.
 *
 * Usage: node audit-engagement.mjs <dir> [--json <file>] [--md <file>]
 * Exit: 0 when the audit completes, 1 when the workspace is unreadable.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { auditWorkspace, exists } from './lib.mjs';

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
  console.error('Usage: node audit-engagement.mjs <dir> [--json <file>] [--md <file>]');
  process.exit(1);
}

const root = path.resolve(target);
if (!(await exists(root))) {
  console.error(`Directory does not exist: ${root}`);
  process.exit(1);
}

const report = await auditWorkspace(root);
if (jsonOut) {
  await fs.mkdir(path.dirname(path.resolve(jsonOut)), { recursive: true });
  await fs.writeFile(path.resolve(jsonOut), `${JSON.stringify(report, null, 2)}\n`);
}
if (mdOut) {
  const lines = [
    `# Engagement audit — ${report.engagement?.project || path.basename(root)}`,
    '',
    `- Phase: ${report.phase}`,
    `- Score: ${report.summary.score}/100 — ${report.summary.verdict}`,
    `- Findings: ${report.summary.findings} (${report.summary.critical} critical, ${report.summary.high} high)`,
    '',
  ];
  for (const item of report.findings) lines.push(`## [${item.severity.toUpperCase()}] ${item.message}`, '', `- Fix: ${item.fix}`, '');
  if (!report.findings.length) lines.push('No findings. This phase is complete.');
  await fs.mkdir(path.dirname(path.resolve(mdOut)), { recursive: true });
  await fs.writeFile(path.resolve(mdOut), `${lines.join('\n')}\n`);
}

console.log(`${report.engagement?.project || path.basename(root)} @ ${report.phase}: ${report.summary.findings} finding(s), score ${report.summary.score}/100 (${report.summary.verdict})`);
for (const item of report.findings) console.log(`  [${item.severity}] ${item.message}`);
