#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { planTestMatrix, renderPlan, parseArgs } from './lib.mjs';

export { planTestMatrix };

async function main() {
  const args = parseArgs();
  const file = args._[0];
  if (!file) {
    console.error('Usage: node plan-test-matrix.mjs <brief.json> [--budget=30000] [--days=21] [--out=plan.json] [--md=plan.md]');
    process.exit(2);
  }

  const brief = JSON.parse(await fs.readFile(file, 'utf8'));
  const overrides = {};
  if (args.budget) overrides.budget = Number(args.budget);
  if (args.days) overrides.days = Number(args.days);

  const plan = planTestMatrix(brief, overrides);
  const markdown = renderPlan(plan);

  if (args.out) {
    await fs.mkdir(path.dirname(path.resolve(String(args.out))), { recursive: true });
    await fs.writeFile(String(args.out), `${JSON.stringify(plan, null, 2)}\n`);
  }
  if (args.md) {
    await fs.mkdir(path.dirname(path.resolve(String(args.md))), { recursive: true });
    await fs.writeFile(String(args.md), markdown);
  }

  console.log(markdown);
  const sum = plan.cells.reduce((total, cell) => total + cell.budget, 0);
  if (sum !== plan.budget) {
    console.error(`Allocation error: cells sum to ₹${sum}, budget is ₹${plan.budget}.`);
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
