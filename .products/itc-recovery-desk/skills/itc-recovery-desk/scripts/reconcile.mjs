#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  VERSION,
  formatSummaryMarkdown,
  readTable,
  reconcile,
  writeOutputs
} from './lib.mjs';

const USAGE = `ITC Recovery Desk ${VERSION}

Usage:
  node reconcile.mjs --books <purchase-register.csv> --gstr2b <gstr2b.csv> [options]

Options:
  --books <path>       Purchase register CSV export
  --gstr2b <path>      GSTR-2B CSV export
  --out <dir>          Output directory (default: itc-recovery-output)
  --period <YYYY-MM>   Label the reconciliation period
  --tolerance <rupees> Amount tolerance for taxable value and tax (default: 1)
  --strict             Exit 1 when any exception is found
  --now <iso-date>     Override the generatedAt timestamp
  --help               Show this help

CSV columns are matched by common aliases. Required: supplier GSTIN, invoice number,
invoice date and taxable value. Tax columns IGST, CGST, SGST and CESS default to 0.
`;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const [rawKey, inline] = token.slice(2).split('=');
    if (inline !== undefined) {
      args[rawKey] = inline;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      args[rawKey] = next;
      index += 1;
    } else {
      args[rawKey] = true;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(USAGE);
    return;
  }
  if (!args.books || !args.gstr2b || args.books === true || args.gstr2b === true) {
    process.stderr.write(USAGE);
    process.exitCode = 2;
    return;
  }

  const booksPath = path.resolve(String(args.books));
  const gstr2bPath = path.resolve(String(args.gstr2b));
  const outDir = path.resolve(String(args.out || 'itc-recovery-output'));
  const tolerance = args.tolerance === undefined ? 1 : Number(args.tolerance);
  if (!Number.isFinite(tolerance) || tolerance < 0) {
    throw new Error('--tolerance must be a non-negative number.');
  }

  const [booksText, gstr2bText] = await Promise.all([
    fs.readFile(booksPath, 'utf8'),
    fs.readFile(gstr2bPath, 'utf8')
  ]);
  const books = readTable(booksText, 'books');
  const gstr2b = readTable(gstr2bText, 'gstr2b');
  const result = reconcile(books, gstr2b, {
    tolerance,
    period: args.period ? String(args.period) : '',
    generatedAt: args.now ? String(args.now) : new Date().toISOString(),
    booksName: path.basename(booksPath),
    gstr2bName: path.basename(gstr2bPath)
  });

  const written = await writeOutputs(result, outDir);
  process.stdout.write(formatSummaryMarkdown(result));
  process.stdout.write(`\nOutput files written to ${outDir}\n`);
  process.stdout.write(written.files.map((file) => `- ${file}`).join('\n') + '\n');

  if (args.strict && result.exceptions.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`ITC Recovery Desk error: ${error.message}\n`);
  process.exitCode = 2;
});
