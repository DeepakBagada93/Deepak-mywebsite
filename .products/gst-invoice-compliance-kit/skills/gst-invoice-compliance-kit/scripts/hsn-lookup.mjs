#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import { findHsn, suggestHsn, hsnDigitsRequired, hsnBandLabel, HSN_CATALOG, parseArgs } from './lib.mjs';

export { findHsn, suggestHsn };

function render({ code, query, aato }) {
  const lines = [];
  if (code) {
    const entry = findHsn(code);
    if (!entry) {
      lines.push(`No orientation entry for HSN/SAC "${code}".`);
      lines.push('');
      lines.push('That is normal — this kit only carries a small orientation table. Confirm the exact code on the GST portal (Search Taxpayer → HSN/SAC master) and use that code in your invoice.');
    } else {
      lines.push(`**${entry.code}** — ${entry.description}`);
      lines.push('');
      lines.push(`- Type: ${entry.type}`);
      lines.push(`- Commonly seen GST slabs: ${entry.rates.join('%, ')}%`);
      lines.push('- Confirm the exact 6-digit code and the applicable rate on the GST portal. This kit never asserts that a code is correct.');
    }
  } else {
    const suggestions = suggestHsn(query);
    lines.push(`Orientation matches for "${query}"`);
    lines.push('');
    if (!suggestions.length) {
      lines.push('No match in the orientation table. Search the GST portal HSN/SAC master for the product description you actually sell.');
    } else {
      lines.push('| Code | Description | Type | Rate hint |');
      lines.push('| --- | --- | --- | --- |');
      for (const item of suggestions) {
        const cell = (text) => String(text).replace(/\|/g, '\\|');
        lines.push(`| ${cell(item.code)} | ${cell(item.description)} | ${item.type} | ${cell(item.rateHint)} |`);
      }
      lines.push('');
      lines.push('Rate hints are orientation only. Confirm on the GST portal before you invoice.');
    }
  }
  if (aato !== undefined && aato !== null) {
    const digits = hsnDigitsRequired(aato);
    lines.push('');
    lines.push(`Turnover band: ${hsnBandLabel(aato)} → HSN/SAC needs **${digits ?? 'n/a'} digits**.`);
  }
  lines.push('');
  lines.push('Digit depth: 4 digits up to ₹5 crore AATO, 6 digits above ₹5 crore (Notification 78/2020-Central Tax; GSTN Phase-3 from the May 2025 return period). There is no 8-digit requirement.');
  lines.push('');
  lines.push('This tool orients you. It does not determine the correct code for your product, and it is not tax advice.');
  lines.push('');
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const query = args._[0];
  const code = args.code ? String(args.code) : null;
  if (!query && !code) {
    console.error('Usage: node hsn-lookup.mjs "<product description>" [--code=190590] [--aato=4200000]');
    console.error('       node hsn-lookup.mjs --code=190590');
    process.exit(2);
  }
  const aato = args.aato !== undefined ? Number(args.aato) : null;
  if (aato !== null && !Number.isFinite(aato)) {
    console.error(`Invalid --aato value "${args.aato}". Use a number of rupees.`);
    process.exit(2);
  }
  console.log(render({ code, query, aato }));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

export { HSN_CATALOG, hsnDigitsRequired, hsnBandLabel };
