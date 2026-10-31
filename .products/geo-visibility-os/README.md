# GEO Visibility OS v1.1.0

A local, zero-dependency audit and fix system for AI search visibility (GEO/AEO). Point it at a site snapshot, get a scored audit, 30 buyer prompts, six answer-first content briefs, a JSON-LD schema pack, a citation plan, a 25+ action roadmap, a measurement plan and a white-label client report.

Built for US SEO agencies, freelance GEO consultants, B2B SaaS marketing leads and local businesses that are losing AI answers to competitors.

## The problem

Buyers now ask ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot and Claude before they search. In 2026, most US Google searches end without a click, and AI answers routinely name a shortlist without sending traffic. Agencies are being asked for GEO work faster than they can produce a defensible deliverable.

GEO Visibility OS gives you the audit, the fix backlog and the client report in one run — without an API key, a subscription or a live rank tracker.

## Quickstart

Requires Node.js 20 or newer. No `npm install`.

```bash
# 1. Scan a local HTML snapshot (offline, deterministic)
node skills/geo-visibility-os/scripts/scan-site.mjs \
  --dir examples/pulse-dental-site \
  --domain pulsedental.example \
  --out /tmp/snapshot.json

# 2. Build the client pack
node skills/geo-visibility-os/scripts/build-geo-pack.mjs \
  --brief examples/pulse-dental-brief.json \
  --snapshot /tmp/snapshot.json \
  --out /tmp/pulse-pack \
  --agency "Northline SEO"

# 3. Audit before delivery
node skills/geo-visibility-os/scripts/audit-geo-pack.mjs /tmp/pulse-pack/pack.json \
  --md=/tmp/pulse-pack/audit.md \
  --json=/tmp/pulse-pack/audit.json
```

You can also scan a public URL with `--url https://example.com`. URL scanning only fetches public HTML, `robots.txt`, `sitemap.xml` and `llms.txt`; it blocks localhost, private, link-local and cloud-metadata addresses by default, caps responses at 5 MB and times out after 15 seconds. For a trusted staging server, add `--allow-private`. See `docs/security-and-privacy.md`.

Run the shipped checks from the product root:

```bash
npm test
```

## What you get

| Output | What it does |
| --- | --- |
| `snapshot.json` | Raw page, schema, robots and sitemap signals |
| `pack.json` | Single source of truth used by the audit |
| `client-report.md` | White-label report with score, findings, plan and limits |
| `prompt-panel.csv` | 30 prompts across five funnel stages and six engines |
| `content-briefs.md` | Six answer-first briefs with evidence requirements |
| `schema-pack.json` | Organization, Service, FAQPage, BreadcrumbList, Article |
| `schema-install.md` | Placement and validation steps |
| `fix-roadmap.csv` | 25+ actions with owner, effort, impact and verification |
| `citation-plan.md` | Ten source types with concrete, ethical actions |
| `measurement-plan.md` | GSC, Bing, GA4 and a manual prompt panel |
| `audit.md` / `audit.json` | 40-check score, findings and verdict |

## Scoring

Forty weighted checks across eight classes total 100 points:

- Structure 8
- Crawl access 16
- Entity 14
- Content 18
- Citation 12
- Prompt coverage 12
- Measurement 10
- Delivery 10

Verdicts: `PASS` at 85+ with no critical or high findings; `FIX NEEDED` at 60–84; `DO NOT SHIP` below 60 or on any critical finding.

## Sample evidence

The included fictional dental brand (`Pulse Dental Studio`, Austin TX) demonstrates the full pack:

- Clean pack: **100/100 PASS**, 40/40 checks.
- Deliberately broken pack: **3/100 DO NOT SHIP**, 5 critical and 21 high findings.
- Same brief + snapshot produce byte-identical `pack.json`.

The sample brand, proof numbers and competitors are fictional. Replace them with verified client facts.

## Honest limits

This is a diagnostic and delivery system, not a crystal ball.

- It reads public HTML. It does not execute JavaScript or log into a CMS.
- It does not query live AI engines. The prompt panel is a manual test plan.
- It cannot prove that AI will cite the brand, and it does not guarantee rankings or revenue.
- It does not verify that the client's claims are true.
- It treats `llms.txt` as optional agent readability, not a visibility lever. In 2026 crawler studies it was rarely fetched and did not measurably lift citations.
- It is not legal advice.

Read `docs/tutorial-guide.md` before your first client engagement and keep the limits section in every deliverable.

## Documentation

- `docs/tutorial-guide.md` — setup, first audit, delivery workflow, prompt recipe, troubleshooting
- `docs/product-specification.md` — scope, requirements, scoring model, pricing
- `docs/research-report.md` — US market evidence, competitors and pricing benchmarks
- `docs/store-listing.md` — commercial listing copy, tiers and FAQ
- `docs/test-plan.md` / `docs/test-results.md` — verification coverage and results
- `docs/security-and-privacy.md` — data handling, URL-scan safety and disclosure
- `docs/production-readiness.md` — release gates, known limits and owner actions
- `docs/release-report.md` — release evidence and owner actions

## Security and privacy

GEO Visibility OS runs locally, has no telemetry, makes no runtime network calls during local scans and ships zero npm dependencies. URL scans use an allowlist of text content types, a 5 MB response cap, a 15-second timeout, at most five redirects and a private-address blocklist. Do not expose the CLI as a public URL-fetching service. Read `docs/security-and-privacy.md` before scanning a third-party site.

## License

Commercial EULA. Agencies may deliver generated packs to clients; the raw skill files may not be resold or redistributed. See `LICENSE.md`.
