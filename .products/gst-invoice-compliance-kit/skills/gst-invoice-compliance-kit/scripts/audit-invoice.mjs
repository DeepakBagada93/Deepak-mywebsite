#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditInvoice, renderInvoiceAudit, parseArgs, parseInvoiceDate } from './lib.mjs';

export { auditInvoice };

const USAGE = [
  'Usage: node audit-invoice.mjs <invoice.json> [options]',
  '',
  'Options:',
  '  --json=<path>              Write the deterministic JSON report.',
  '  --md=<path>                Write the Markdown report.',
  '  --aato=<rupees>            Override the turnover stated in the invoice.',
  '  --ewayBillThreshold=<amt>  Override the e-way bill threshold.',
  '  --today=YYYY-MM-DD         Audit-date override (Asia/Kolkata calendar date).',
  '  --strict                   Exit 1 when any critical or high finding exists.',
  '',
  'Exit codes: 0 clean, 1 blocking findings under --strict, 2 bad input.'
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

  let invoice;
  try {
    invoice = JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON: ${error.message}`);
    process.exit(2);
  }

  const options = {};
  if (args.aato !== undefined) options.aato = Number(args.aato);
  if (args.ewayBillThreshold !== undefined) options.ewayBillThreshold = Number(args.ewayBillThreshold);
  if (args.today !== undefined) options.today = String(args.today);

  const result = auditInvoice(invoice, options);
  const markdown = renderInvoiceAudit(result);

  if (args.json) {
    await fs.mkdir(path.dirname(path.resolve(String(args.json))), { recursive: true });
    await fs.writeFile(String(args.json), `${JSON.stringify(result, null, 2)}\n`);
  }
  if (args.md) {
    await fs.mkdir(path.dirname(path.resolve(String(args.md))), { recursive: true });
    await fs.writeFile(String(args.md), markdown);
  }

  console.log(markdown);
  const blocking = result.findings.filter((finding) => finding.severity === 'critical' || finding.severity === 'high');
  if (args.strict && blocking.length) {
    console.error(`Strict mode: ${blocking.length} critical/high finding(s).`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
