#!/usr/bin/env node
/**
 * Build the customer distribution archive and a hashed product manifest.
 * Run: node scripts/package.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'agency-email-template-pack';
const version = '1.0.0';

const INCLUDE = [
  'README.md',
  'LICENSE.md',
  'CHANGELOG.md',
  'COMPATIBILITY.md',
  'templates',
  'examples',
  'skill',
  'scripts',
  'docs',
  'tests'
];

async function walk(rel, files = []) {
  const full = path.join(root, rel);
  const stat = await fs.stat(full);
  if (stat.isFile()) {
    files.push(rel);
    return files;
  }
  for (const entry of await fs.readdir(full)) {
    if (entry === '.DS_Store') continue;
    await walk(path.join(rel, entry), files);
  }
  return files;
}

const files = [];
for (const item of INCLUDE) await walk(item, files);

const manifest = {
  name: 'Agency Email Template Pack',
  slug,
  version,
  category: 'email-templates',
  license: 'Commercial — client work permitted, resale prohibited',
  generatedAt: new Date().toISOString(),
  files: []
};

for (const rel of files.sort()) {
  const buffer = await fs.readFile(path.join(root, rel));
  manifest.files.push({
    path: rel,
    bytes: buffer.length,
    sha256: crypto.createHash('sha256').update(buffer).digest('hex')
  });
}

manifest.manualReview = [
  'Owner approval for pricing and store publication.',
  'Buyer seed test in the target ESP before the first live send.'
];

await fs.writeFile(path.join(root, 'product-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await fs.mkdir(path.join(root, 'dist'), { recursive: true });

const zipPath = path.join(root, 'dist', `${slug}-v${version}.zip`);
await fs.rm(zipPath, { force: true });
await execFileAsync('zip', [
  '-r', '-X', zipPath,
  ...INCLUDE,
  'product-manifest.json',
  '-x', '*.DS_Store*', '-x', '*__MACOSX*'
], { cwd: root });

const stat = await fs.stat(zipPath);
console.log(`Packaged ${files.length} files → dist/${slug}-v${version}.zip (${(stat.size / 1024).toFixed(1)} KB)`);
