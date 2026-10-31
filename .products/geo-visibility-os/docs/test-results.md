# Test results — GEO Visibility OS v1.1.0

Run date: 2026-11-01 · Environment: macOS, Node.js 25.9.0 · Guard: offline, zero dependencies

## Summary

| Gate | Result |
| --- | --- |
| Unit and functional tests | **27/27 pass** |
| Clean sample pack | **100/100 PASS**, 40/40 checks, 0 findings |
| Broken sample pack | **3/100 DO NOT SHIP**, 5 critical, 21 high, 13 medium, 0 low |
| Deterministic build | Byte-identical `pack.json` across two builds |
| Product validation | Passed; regenerate with `validate-product.mjs` (the release ZIP includes the generated report) |
| Skill readiness | Passed |
| Package audit | Passed; ZIP has safe entries only |
| Portfolio audit | Passed; 1/1 product, manifest hashes verified inside the ZIP |
| URL safety | Private/local/metadata targets rejected; non-text and oversized responses rejected; timeout/redirect caps configured |
| Manifest | On-disk hashes match every listed file |

## Test suite output

```
node --test tests/*.test.mjs
# tests 27
# pass 27
# fail 0
```

## Functional evidence

### Scanner

The local fixture returns three pages (`/`, `/services/veneers`, `/about`), detects `robots.txt` and `sitemap.xml`, reports zero blocked AI bots and scores readiness 100/100. Every page has at least 400 words, two question-form headings, a 40+ word answer-first paragraph and a canonical URL. A local HTTP fixture additionally verifies that URL scanning starts at the requested path, follows absolute same-origin links, adds same-origin sitemap URLs and excludes external links. Private/local/metadata URL targets are rejected by default. Non-text responses and a response over 5 MB are rejected. A live `https://example.com` smoke scan completed at readiness 28/100 with one page and no blocked bots, confirming the public-URL path works without local fixtures.

### Builder

The sample brief produces:

- 30 prompts across awareness, comparison, decision, objection and branded stages.
- 6 content briefs with target prompts, answer blocks, six sections and four evidence requirements each.
- 5 JSON-LD blocks: Organization, Service, FAQPage, BreadcrumbList, Article.
- 27 unconditional roadmap actions plus any site-specific fixes (28 for the clean fixture), each with priority, owner, effort and verification.
- 10 citation source types with ethical actions.
- A measurement plan covering Search Console, Bing, GA4 and the manual panel.

Two consecutive builds of the same brief and snapshot produce identical JSON.

### Clean audit

```
Pulse Dental Studio — score 100/100 · PASS
  checks: 40/40 passed · findings: 0 critical, 0 high, 0 medium, 0 low
```

### Broken audit

The deliberately broken pack removes identity fields, injects a placeholder, blocks every AI bot, strips schema and author signals, empties the prompt panel and measurement plan, recommends paid review manipulation, removes the report and limits, and empties the roadmap.

```
Unknown brand — score 3/100 · DO NOT SHIP
  checks: 1/40 passed · findings: 5 critical, 21 high, 13 medium, 0 low
```

Critical findings: `structure.identity`, `structure.placeholders`, `citation.ethics`, `delivery.report`, `delivery.limits`.

### CLI behavior

- `audit-geo-pack.mjs pack.json` exits 0 for PASS and 1 for DO NOT SHIP.
- Writing `--json=file` or `--md=file` still prints the human summary.
- `--json=-` prints only parseable JSON, with no summary contamination.
- `--report-only` always exits 0 for exploratory runs.

## Packaging evidence

The distribution archive `dist/geo-visibility-os-1.1.0.zip` is built from the product root and excludes `dist/`, `.git`, `.agent`, `node_modules`, environment files and OS metadata. The package audit confirms every entry is a safe relative path and that README, LICENSE, CHANGELOG, COMPATIBILITY, `package.json` and the manifest are present. The archive was extracted to a clean temporary directory and `npm test` passed 27/27 there.

## What was not tested

- Only a public `https://example.com` smoke scan, not a full third-party production-site audit. The URL scanner is covered by a local HTTP fixture and private-target rejection tests.
- Rendering the client report to PDF or a branded document.
- Actual AI engine responses; the prompt panel is a manual plan.
- Legal review of the commercial license.
- A real client engagement and outcome measurement.
