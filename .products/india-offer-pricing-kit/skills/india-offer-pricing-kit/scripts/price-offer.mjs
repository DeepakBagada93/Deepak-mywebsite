#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { priceOffer, renderPricing, parseArgs } from './lib.mjs';

export { priceOffer };

async function main() {
  const args = parseArgs();
  const file = args._[0];
  if (!file) {
    console.error('Usage: node price-offer.mjs <economics.json> [--out=pricing.json] [--md=pricing.md]');
    process.exit(2);
  }

  const input = JSON.parse(await fs.readFile(file, 'utf8'));
  const pricing = priceOffer(input);
  const markdown = renderPricing(pricing);

  if (args.out) {
    await fs.mkdir(path.dirname(path.resolve(String(args.out))), { recursive: true });
    await fs.writeFile(String(args.out), `${JSON.stringify(pricing, null, 2)}\n`);
  }
  if (args.md) {
    await fs.mkdir(path.dirname(path.resolve(String(args.md))), { recursive: true });
    await fs.writeFile(String(args.md), markdown);
  }

  console.log(markdown);
  const ascending = pricing.tiers.every((tier, index) => index === 0 || tier.price > pricing.tiers[index - 1].price);
  if (!ascending) {
    console.error('Pricing error: tiers are not strictly ascending.');
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
