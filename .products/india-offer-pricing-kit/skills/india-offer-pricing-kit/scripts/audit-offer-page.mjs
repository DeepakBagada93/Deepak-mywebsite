#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditOfferPage, renderOfferAudit, parseArgs } from './lib.mjs';

export { auditOfferPage };

async function main() {
  const args = parseArgs();
  const file = args._[0];
  if (!file) {
    console.error('Usage: node audit-offer-page.mjs <offer.json> [--json=report.json] [--md=report.md] [--strict]');
    process.exit(2);
  }

  const raw = await fs.readFile(file, 'utf8');
  let offer;
  try {
    offer = JSON.parse(raw);
  } catch (error) {
    console.error(`Invalid JSON: ${error.message}`);
    process.exit(2);
  }

  const result = auditOfferPage(offer);
  const markdown = renderOfferAudit(result);

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
