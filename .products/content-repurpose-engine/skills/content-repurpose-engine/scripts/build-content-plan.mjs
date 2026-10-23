#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildContentPlan, renderPlan, parseArgs } from './lib.mjs';

export { buildContentPlan };

async function main() {
  const args = parseArgs();
  const file = args._[0];
  if (!file) {
    console.error('Usage: node build-content-plan.mjs <source.json> [--days=30] [--out=plan.json] [--md=plan.md]');
    process.exit(2);
  }

  const source = JSON.parse(await fs.readFile(file, 'utf8'));
  const overrides = {};
  if (args.days) overrides.days = Number(args.days);

  const plan = buildContentPlan(source, overrides);
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
  console.log(`\n${plan.items.length} pieces across ${plan.platforms.length} platforms.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
