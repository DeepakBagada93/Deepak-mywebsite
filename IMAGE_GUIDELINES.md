# Image Guidelines

## Purpose

October 2026 journal/blog posts embed images as absolute URLs pointing to
`https://deepakbagada.in/...`. Those files did not exist on disk, so every
image 404'd. This document records the spec and the reproducible process used
to create the missing files locally in Laravel's `public/` directory at the
exact paths the content already references.

Do **not** edit the URLs in post content; instead, keep the files at these
paths. The content is the source of truth and was not modified.

## Spec

| Property   | Value                                                             |
| ---------- | ----------------------------------------------------------------- |
| Dimensions | 1200 × 630 px                                                     |
| Aspect     | 1.91:1 (standard Open Graph)                                      |
| Format     | JPEG (`.jpg`) for `/images/journal/`; WebP for `/assets/images/posts/` |
| Quality    | JPEG: ffmpeg `-q:v 4` (stepped up to 12 as needed); WebP: `cwebp -q 82` (stepped down as needed) |
| Max size   | Target < 200 KB per file (automatic quality step-down enforced)   |

## Naming convention

- `public/images/journal/<name>.jpg`
- `public/assets/images/posts/<name>.webp`

Local target path is the referenced URL with the `https://deepakbagada.in/`
origin stripped (1:1 mapping). `<name>` matches the post slug (or a
slug-derived asset name). Example:

```
https://deepakbagada.in/images/journal/turso-edge-database-nextjs-worldwide-reads-2026.jpg
  -> public/images/journal/turso-edge-database-nextjs-worldwide-reads-2026.jpg

https://deepakbagada.in/assets/images/posts/nextjs-15-benchmarks.webp
  -> public/assets/images/posts/nextjs-15-benchmarks.webp
```

Deterministic source seed = filename without extension + folder kind
(`-journal` or `-posts`), so the two folders never collide and re-running
reproduces the same image.

## Alt-text rule

Every image must carry a descriptive alt attribute explaining what the image
communicates — the topic, system, metric, or diagram it depicts.

- Minimum 5 words.
- Banned generic alts: `image`, `screenshot`, `diagram`, `photo`, `picture`,
  `graphic`, or any alt that merely repeats the filename.
- Alt text describes meaning/intent, not the file.

The alt text for each image already exists in the post content (captured in
`storage/app/oct-image-manifest.json` under each ref's `alt`). This work only
created the files; it did not change any alt text.

## Source & license policy

- Source: **Lorem Picsum** (`https://picsum.photos`), which serves photos
  sourced from **Unsplash**.
- License: **Unsplash License** — free for commercial and non-commercial use,
  **no attribution required**. (See `CREDITS.md`.)
- Images are stable/deterministic by seed, so regeneration is reproducible.
- No paid API key is required.

## Reproducible regeneration

The exact script used is embedded below. Run it from anywhere with Node v25
plus `curl`, `cwebp`, and `ffmpeg` on PATH:

```bash
node gen-oct-images.mjs "/Users/deepakbagada/saasnext project/my-website"
```

Save the following as `gen-oct-images.mjs`:

```js
#!/usr/bin/env node
// Reproducible generation of October 2026 journal/post images.
// Source: Lorem Picsum (Unsplash-licensed). Deterministic by seed.
// Usage: node gen-oct-images.mjs /path/to/project
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const PROJECT = process.argv[2] || process.cwd();
const MANIFEST = path.join(PROJECT, 'storage/app/oct-image-manifest.json');
const TMP = '/tmp/oct-img-work';
fs.mkdirSync(TMP, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const urls = manifest.distinct_urls;
const ORIGIN = 'https://deepakbagada.in/';

let created = 0, totalBytes = 0;
const failures = [];

for (const url of urls) {
  try {
    const rel = url.replace(ORIGIN, '');          // images/journal/x.jpg
    const target = path.join(PROJECT, 'public', rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });

    const ext = path.extname(rel).toLowerCase();  // .jpg | .webp
    const base = path.basename(rel, ext);         // x
    const kind = rel.startsWith('images/journal') ? 'journal' : 'posts';
    const seed = `${base}-${kind}`;               // deterministic

    const tmpJpg = path.join(TMP, `${base}.${kind}.src.jpg`);
    execFileSync('curl', ['-sL', '--fail', '-o', tmpJpg,
      `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630.jpg`], { stdio: 'pipe' });

    const stat = fs.statSync(tmpJpg);
    if (stat.size === 0) throw new Error('zero-byte download');

    const MAX = 200 * 1024;
    if (ext === '.webp') {
      // cwebp q82 base, step quality down until under MAX where possible
      for (const q of [82, 75, 68, 60, 52]) {
        execFileSync('cwebp', ['-q', String(q), '-quiet', tmpJpg, '-o', target], { stdio: 'pipe' });
        if (fs.statSync(target).size <= MAX) break;
      }
    } else {
      // ffmpeg scale 1200 wide, step q up until under MAX where possible
      for (const q of [4, 6, 8, 10, 12]) {
        execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmpJpg,
          '-vf', 'scale=1200:-2', '-q:v', String(q), target], { stdio: 'pipe' });
        if (fs.statSync(target).size <= MAX) break;
      }
    }

    const outSize = fs.statSync(target).size;
    if (outSize === 0) throw new Error('zero-byte output');

    created++;
    totalBytes += outSize;
    console.log(`OK  ${rel}  ${outSize}B`);
  } catch (e) {
    failures.push(`${url} :: ${e.message}`);
    console.error(`FAIL ${url} :: ${e.message}`);
  }
}

console.log(`\nCreated ${created}/${urls.length}  total=${totalBytes} bytes`);
console.log(`Failures: ${failures.length}`);
failures.forEach(f => console.log('  ' + f));
process.exit(failures.length ? 1 : 0);
```

### Verify serving

With the dev server running (`php artisan serve --host=127.0.0.1 --port=8000`),
each referenced path should return HTTP 200 with non-zero bytes:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  http://127.0.0.1:8000/images/journal/turso-edge-database-nextjs-worldwide-reads-2026.jpg
```
