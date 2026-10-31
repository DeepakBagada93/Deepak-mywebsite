#!/usr/bin/env node
// GEO Visibility OS — site scanner
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { VERSION, scanLocal, scanUrl, siteReadiness } from './lib.mjs';

const HELP = `GEO Visibility OS — site scanner v${VERSION}

Usage:
  node scripts/scan-site.mjs --dir <site-dir> [options]
  node scripts/scan-site.mjs --url <https://example.com> [options]

Options:
  --dir <path>        Scan a local HTML snapshot (offline, no network)
  --url <url>         Scan a public site (fetches public HTML only)
  --domain <domain>   Domain label for a local scan (default: example.com)
  --max-pages <n>     Maximum pages to scan (default: 10 local, 5 url; cap 50 local, 10 url)
  --out <file>        Write snapshot JSON to a file (default: stdout)
  --allow-private     Allow localhost/private staging URLs (trusted use only)
  --version           Print the version
  --help              Show this help

Safety: URL scans block localhost, private, link-local and cloud-metadata
addresses by default, cap responses at 5 MB, time out after 15 seconds and
follow at most 5 redirects.

Exit codes: 0 = scanned, 2 = bad input or scan failure.
`;

function parseArgs(argv) {
  const out = { dir: null, url: null, domain: null, maxPages: null, out: null, allowPrivate: false, version: false, help: false };
  const value = (index, flag) => {
    const next = argv[index + 1];
    if (next === undefined || next.startsWith('--')) throw new Error(`Missing value for ${flag}.`);
    return next;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--help' || item === '-h') out.help = true;
    else if (item === '--version') out.version = true;
    else if (item === '--allow-private') out.allowPrivate = true;
    else if (item === '--dir') { out.dir = value(i, '--dir'); i += 1; }
    else if (item.startsWith('--dir=')) out.dir = item.slice(6);
    else if (item === '--url') { out.url = value(i, '--url'); i += 1; }
    else if (item.startsWith('--url=')) out.url = item.slice(6);
    else if (item === '--domain') { out.domain = value(i, '--domain'); i += 1; }
    else if (item.startsWith('--domain=')) out.domain = item.slice(9);
    else if (item === '--max-pages') { out.maxPages = Number(value(i, '--max-pages')); i += 1; }
    else if (item.startsWith('--max-pages=')) out.maxPages = Number(item.slice(12));
    else if (item === '--out') { out.out = value(i, '--out'); i += 1; }
    else if (item.startsWith('--out=')) out.out = item.slice(6);
    else throw new Error(`Unknown argument: ${item}`);
  }
  return out;
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
  if (args.dir && args.url) throw new Error('Pass either --dir or --url, not both.');
  if (!args.dir && !args.url) throw new Error('Pass --dir or --url.');
  if (args.maxPages !== null && (!Number.isFinite(args.maxPages) || args.maxPages < 1)) {
    throw new Error('--max-pages must be a positive number.');
  }
  const options = {};
  if (args.maxPages !== null) options.maxPages = args.maxPages;
  if (args.allowPrivate) options.allowPrivate = true;
  const snapshot = args.url
    ? await scanUrl(args.url, options)
    : await scanLocal(args.dir, { ...options, domain: args.domain || undefined });
  const readiness = siteReadiness(snapshot);
  const serialized = JSON.stringify(snapshot, null, 2) + '\n';
  if (args.out) {
    const target = path.resolve(args.out);
    if (target === path.parse(target).root) throw new Error('--out must not be the filesystem root.');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, serialized);
    process.stdout.write([
      `Scanned ${snapshot.site.url} — readiness ${readiness}/100`,
      `  pages: ${snapshot.pages.length} · sitemap: ${snapshot.site.sitemapPresent ? 'yes' : 'no'} · robots: ${snapshot.site.robotsTxt ? 'yes' : 'no'}`,
      `  blocked AI bots: ${snapshot.site.blockedBots.length ? snapshot.site.blockedBots.join(', ') : 'none'}`,
      `  wrote ${target}`,
      ''
    ].join('\n'));
  } else {
    process.stdout.write(serialized);
  }
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(2);
});
