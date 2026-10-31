#!/usr/bin/env node
// GEO Visibility OS — deterministic pack audit
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { VERSION, auditPack, AUDIT_CLASSES } from './lib.mjs';

const HELP = `GEO Visibility OS — pack audit v${VERSION}

Usage:
  node scripts/audit-geo-pack.mjs <pack.json> [options]

Options:
  --md[=file]       Write a Markdown report (prints it when no file is given)
  --json[=file]     Write a JSON report (prints it when no file is given)
  --min <n>         Minimum score for PASS (default: 85, range 0-100)
  --report-only     Always exit 0, even when the pack fails
  --version         Print the version
  --help            Show this help

Exit codes: 0 = PASS, 1 = FIX NEEDED or DO NOT SHIP, 2 = bad input.
`;

function parseArgs(argv) {
  const out = { input: null, md: null, json: null, min: 85, reportOnly: false, version: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--help' || item === '-h') out.help = true;
    else if (item === '--version') out.version = true;
    else if (item === '--report-only') out.reportOnly = true;
    else if (item === '--md') out.md = '-';
    else if (item.startsWith('--md=')) out.md = item.slice(5);
    else if (item === '--json') out.json = '-';
    else if (item.startsWith('--json=')) out.json = item.slice(7);
    else if (item === '--min') {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) throw new Error('Missing value for --min.');
      out.min = Number(next);
      i += 1;
    } else if (item.startsWith('--min=')) out.min = Number(item.slice(6));
    else if (!item.startsWith('--') && !out.input) out.input = item;
    else throw new Error(`Unknown argument: ${item}`);
  }
  return out;
}

function escapeCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function renderMarkdown(report) {
  const lines = [
    `# GEO pack audit — ${report.campaign}`,
    '',
    `**Score: ${report.score}/100 · ${report.verdict}**`,
    '',
    `Prompts: ${report.stats.prompts} · briefs: ${report.stats.briefs} · roadmap: ${report.stats.roadmap} · checks: ${report.stats.passed}/${report.stats.checks} passed`,
    '',
    '## Class weights',
    '',
    '| Class | Weight |',
    '| --- | ---: |',
    ...Object.entries(AUDIT_CLASSES).map(([name, weight]) => `| ${name} | ${weight} |`),
    '',
    '## Findings',
    ''
  ];
  if (!report.findings.length) {
    lines.push('No findings. Every deterministic check passed.', '');
  } else {
    for (const severity of ['critical', 'high', 'medium', 'low']) {
      const items = report.findings.filter((item) => item.severity === severity);
      if (!items.length) continue;
      lines.push(`### ${severity.toUpperCase()} (${items.length})`, '');
      for (const item of items) {
        lines.push(`- **${item.id}** — ${item.message}`);
        if (item.fix) lines.push(`  - Fix: ${item.fix}`);
      }
      lines.push('');
    }
  }
  lines.push('## All checks', '', '| Check | Class | Weight | Status | Detail |', '| --- | --- | ---: | --- | --- |');
  for (const item of report.checks) {
    lines.push(`| ${item.id} | ${item.class} | ${item.weight} | ${item.passed ? 'PASS' : 'FAIL'} | ${escapeCell(item.message)} |`);
  }
  lines.push('', '## What this audit does not do', '');
  lines.push('- It does not verify that the business claims are true. Attach evidence and get human sign-off.');
  lines.push('- It does not query live AI engines or predict citations, rankings or revenue.');
  lines.push('- It does not replace a platform policy review or legal review.');
  return lines.join('\n') + '\n';
}

async function writeOutput(target, body) {
  const resolved = path.resolve(target);
  if (resolved === path.parse(resolved).root) throw new Error('Output path must not be the filesystem root.');
  await fs.mkdir(path.dirname(resolved), { recursive: true });
  await fs.writeFile(resolved, body);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }
  if (args.version) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }
  if (!args.input) throw new Error('pack.json path is required.');
  if (args.md === '' || args.json === '') throw new Error('--md= and --json= require a file path or "-".');
  if (!Number.isFinite(args.min) || args.min < 0 || args.min > 100) throw new Error('--min must be a number between 0 and 100.');
  if (args.md === '-' && args.json === '-') throw new Error('Pass only one of --md=- or --json=- so stdout stays parseable.');

  let pack;
  try {
    pack = JSON.parse(await fs.readFile(path.resolve(args.input), 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read pack: ${error.message}`);
  }

  const report = auditPack(pack, { min: args.min });
  report.checkedAt = new Date().toISOString();
  const md = renderMarkdown(report);

  if (args.json) {
    const output = JSON.stringify(report, null, 2) + '\n';
    if (args.json === '-') process.stdout.write(output);
    else await writeOutput(args.json, output);
  }
  if (args.md) {
    if (args.md === '-') process.stdout.write(md);
    else await writeOutput(args.md, md);
  }
  if (args.md !== '-' && args.json !== '-') {
    process.stdout.write([
      `${report.campaign} — score ${report.score}/100 · ${report.verdict}`,
      `  checks: ${report.stats.passed}/${report.stats.checks} passed · findings: ${report.stats.critical} critical, ${report.stats.high} high, ${report.stats.medium} medium, ${report.stats.low} low`,
      report.verdict === 'PASS'
        ? '  Ready to deliver. Keep the pack and the evidence with the client file.'
        : '  Fix critical and high findings before delivery. Re-run with --md=audit.md for the full report.',
      ''
    ].join('\n'));
  }

  if (args.reportOnly) return;
  process.exitCode = report.verdict === 'PASS' ? 0 : 1;
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(2);
});
