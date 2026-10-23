#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditBatch, renderBatchAudit, parseArgs, parseInvoiceDate } from './lib.mjs';

export { auditBatch };

const USAGE = [
  'Usage: node batch-audit.mjs <invoices.json> [options]',
  '',
  '  <invoices.json> may be an array of invoices or { "invoices": [...] }.',
  '',
  'Options:',
  '  --json=<path>              Write the deterministic JSON report.',
  '  --md=<path>                Write the Markdown report.',
  '  --aato=<rupees>            Override the turnover stated in every invoice.',
  '  --ewayBillThreshold=<amt>  Override the e-way bill threshold.',
  '  --today=YYYY-MM-DD         Audit-date override (Asia/Kolkata calendar date).',
  '  --now=<ISO timestamp>      Deterministic checkedAt value, e.g. 2026-10-20T00:00:00.000Z.',
  '  --strict                   Exit 1 when any critical or high finding exists.',
  '',
  'Exit codes: 0 clean, 1 blocking findings, 2 bad input.'
].join('\n');

async function main() {
  const args = parseArgs();
  const file = args._[0];
  if (!file) {
    console.error(USAGE);
    process.exit(2);
  }
  if (args.json === true || args.md === true) {
    console.error('Use --json=<path> and --md=<path> with an explicit output path.');
    process.exit(2);
  }
  if (args.today !== undefined && !parseInvoiceDate(args.today)) {
    console.error(`Invalid --today value "${args.today}". Use YYYY-MM-DD.`);
    process.exit(2);
  }
  if (args.now !== undefined && Number.isNaN(Date.parse(String(args.now)))) {
    console.error(`Invalid --now value "${args.now}". Use an ISO timestamp.`);
    process.exit(2);
  }
  if (args.aato !== undefined && !Number.isFinite(Number(args.aato))) {
    console.error(`Invalid --aato value "${args.aato}". Use a number of rupees.`);
    process.exit(2);
  }
  if (args.ewayBillThreshold !== undefined && !Number.isFinite(Number(args.ewayBillThreshold))) {
    console.error(`Invalid --ewayBillThreshold value "${args.ewayBillThreshold}". Use a number of rupees.`);
    process.exit(2);
  }

  let raw;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch (error) {
    console.error(`Cannot read ${file}: ${error.message}`);
    process.exit(2);
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON: ${error.message}`);
    process.exit(2);
  }

  const invoices = Array.isArray(payload) ? payload : (Array.isArray(payload.invoices) ? payload.invoices : null);
  if (!invoices) {
    console.error('Expected an array of invoices or an object with an "invoices" array.');
    process.exit(2);
  }

  const options = {};
  if (args.aato !== undefined) options.aato = Number(args.aato);
  if (args.ewayBillThreshold !== undefined) options.ewayBillThreshold = Number(args.ewayBillThreshold);
  if (args.today !== undefined) options.today = String(args.today);
  if (args.now !== undefined) options.now = String(args.now);

  const result = auditBatch(invoices, options);
  const markdown = renderBatchAudit(result);

  if (args.json) {
    await fs.mkdir(path.dirname(path.resolve(String(args.json))), { recursive: true });
    await fs.writeFile(String(args.json), `${JSON.stringify(result, null, 2)}\n`);
  }
  if (args.md) {
    await fs.mkdir(path.dirname(path.resolve(String(args.md))), { recursive: true });
    await fs.writeFile(String(args.md), markdown);
  }

  console.log(markdown);
  const blocking = args.strict
    ? result.totals.critical + result.totals.high
    : result.totals.critical;
  if (blocking > 0) {
    console.error(args.strict
      ? `Batch contains ${blocking} critical/high finding(s). Fix before issuing.`
      : `Batch contains ${result.totals.critical} critical finding(s). Fix before issuing.`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
