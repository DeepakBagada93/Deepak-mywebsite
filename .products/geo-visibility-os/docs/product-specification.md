# Product specification — GEO Visibility OS v1.1.0

Status: READY FOR OWNER APPROVAL · Date: 2026-11-01 · Owner: Deepak Bagada Systems

## 1. Transformation promise

**From** "a client asked if they show up in ChatGPT and I have a blank page" **to** "a scored AI-search readiness audit, 30 buyer prompts, six answer-first content briefs, a schema pack, a 90-day fix roadmap, a citation-source plan, a measurement plan and a white-label client report" — in one local run, with no API keys.

## 2. Buyer

| Persona | Pain | What they buy |
| --- | --- | --- |
| US SEO agency owner (2–25 people) | Clients ask for GEO; the team lacks a repeatable audit | A white-label audit + fix system |
| Freelance SEO/GEO consultant | Needs a higher-ticket deliverable | A $1,500+ audit produced in hours |
| B2B SaaS marketing lead | AI answers cite competitors | A readiness diagnosis and fix backlog |
| SMB owner (dental, law, home services) | Invisible in AI recommendations | A plain-English report and priority actions |
| Content/PR lead | Cannot connect citations to pages | A citation-source map and content briefs |

## 3. Scope

### In scope

- Scan a public URL or a local site snapshot for AI-readiness signals.
- Deterministic 40-check audit with weighted score (`0–100`) and verdict.
- 30-prompt buyer panel across awareness, comparison, decision, objection and branded stages.
- Six answer-first content briefs with evidence requirements and extraction blocks.
- JSON-LD schema pack: Organization, Service/Product, FAQPage, BreadcrumbList, Article.
- 90-day fix roadmap with owner, effort, impact and verification.
- Citation-source map by source type, with honesty rules.
- Measurement plan using GSC generative AI report, Bing citation share, GA4 AI referrals and a manual prompt panel.
- White-label client report (Markdown) with agency name.
- A "no snake oil" section that rejects `llms.txt` as a visibility lever.
- Deterministic tests and sample fixtures.

### Out of scope

- Live AI-engine querying or rank tracking.
- Paid subscriptions or API keys.
- Automated CMS edits.
- Guaranteed citations, rankings or revenue.
- Legal advice or platform-policy approval.
- Backlink buying, Reddit spam or review manipulation.
- Real-time monitoring (the pack integrates with a tracker instead).

## 4. Functional requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| FR-1 | Scan a local directory or URL | `scan-site.mjs` writes `snapshot.json`; local fixture passes offline; URL scans start at the requested path and add same-origin sitemap URLs |
| FR-2 | Detect AI crawler rules | Reads `robots.txt`, reports allowed/blocked for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot |
| FR-3 | Extract page signals | Title, meta, H1/H2, word count, schema types, FAQ, author, date, canonical, table, question headings, answer-first paragraph, links, image alt coverage |
| FR-4 | Build a prompt panel | ≥30 prompts; ≥4 stages; branded and non-branded; competitor prompts |
| FR-5 | Build six content briefs | Each has target prompt, intent, answer block, evidence, schema, internal links, CTA |
| FR-6 | Generate schema | Valid JSON-LD for the advertised types; no invented ratings or prices |
| FR-7 | Build a fix roadmap | ≥25 actions with priority, owner, effort, impact and verification |
| FR-8 | Build a citation plan | Source types and actions; no fabricated URLs; no spam tactics |
| FR-9 | Build a measurement plan | GSC, Bing, GA4, manual panel, baseline and re-measure date |
| FR-10 | Produce a white-label report | Agency name, executive summary, score, findings, roadmap, limits |
| FR-11 | Audit the pack | 40 weighted checks, score, verdict, exit code; malformed packs exit 2 with a clear error |
| FR-12 | Fail unsafe packs | Guarantees, fake rankings, `llms.txt`-only strategy, blocked AI bots, missing measurement all fail |
| FR-13 | Be deterministic | Same brief + snapshot = byte-identical `pack.json` |
| FR-14 | Work offline | No network required for tests; zero dependencies |
| FR-15 | Fail safely on bad input | Malformed briefs, packs, flags and output paths exit 2 without a stack trace |
| FR-16 | Constrain URL fetches | Block localhost/private/link-local/metadata targets by default; 5 MB cap, 15 s timeout, 5 redirects, no HTTPS downgrade |

## 5. Non-functional requirements

- **Portability:** Node.js 20+, ESM, no npm install, no native modules.
- **Safety:** no secrets, no telemetry, no uploads; URL scans fetch only public text/HTML/XML/JSON, block private/local targets by default and cap response size, time and redirects. `--allow-private` is documented for trusted staging only.
- **Determinism:** stable sorting and hashing; no `Math.random()`, no `Date.now()` inside outputs except the scan timestamp in the snapshot.
- **Readability:** prompts and briefs are plain Markdown; schema is pretty-printed JSON.
- **Auditability:** every failed check has id, class, severity, message and fix.
- **Input validation:** briefs are validated before scanning; packs are validated before audit; errors are actionable.
- **Performance:** build + audit under 2 seconds for a 5-page snapshot.
- **Licensing:** commercial EULA; agencies may deliver outputs to clients; raw files may not be resold.

## 6. Input contract

```json
{
  "brand": "Pulse Dental Studio",
  "domain": "pulsedental.example",
  "market": "US",
  "category": "cosmetic dentistry",
  "buyer": "adults 30-55 in Austin researching veneers and implants",
  "offer": "consultation and treatment plan",
  "city": "Austin, TX",
  "serviceArea": ["Austin", "Round Rock", "Cedar Park"],
  "competitors": ["Competitor A", "Competitor B"],
  "differentiators": ["same-day crowns", "sedation options"],
  "proof": ["4.9 rating from 380 reviews"],
  "platforms": ["chatgpt", "perplexity", "google_ai", "gemini", "copilot", "claude"],
  "agencyName": "Northline SEO",
  "primaryPages": ["/", "/services/veneers", "/about"],
  "sameAs": ["https://www.google.com/maps/place/example"],
  "baselineDate": "2026-10-29",
  "reMeasureDate": "2026-11-28",
  "reportDate": "2026-10-29"
}
```

## 7. Output contract

```
snapshot.json                 Site signals used by the build
pack.json                     Single source of truth for the audit
client-report.md              White-label report
prompt-panel.csv              30 prompts with stage, intent, platform and success signal
fix-roadmap.csv               Prioritized actions
content-briefs.md             Six answer-first briefs
schema-pack.json              Valid JSON-LD blocks
schema-install.md             Placement instructions
citation-plan.md              Source map and outreach actions
measurement-plan.md           Baseline, KPIs and re-measurement
README.md                     How to read and deliver the pack
```

## 8. Scoring model

40 checks, 8 classes, weights sum to 100:

| Class | Weight | What it covers |
| --- | ---: | --- |
| Structure | 8 | Brand, domain, market, competitors, platforms, prompts |
| Crawl access | 16 | AI bots, sitemap, HTTPS, renderability, canonical |
| Entity | 14 | Schema, sameAs, NAP/description consistency, author |
| Content | 18 | Answer-first, question headings, depth, evidence, tables, freshness |
| Citation | 12 | Source map, third-party mentions, reviews, community, PR |
| Prompt coverage | 12 | Funnel stages, branded/non-branded, competitor prompts |
| Measurement | 10 | GSC, Bing, GA4, baseline, re-measure, model honesty |
| Client delivery | 10 | Report, roadmap, owners, schema install, limits |

Verdicts: `PASS` ≥85 with no critical/high; `FIX NEEDED` 60–84; `DO NOT SHIP` <60 or any critical.

## 9. Pricing

| Tier | Price | Seats | Best for |
| --- | --- | --- | --- |
| Solo | **$149** | 1 | Freelancer or single brand |
| Pro | **$299** | 5 | In-house team or small agency |
| Agency | **$599** | Unlimited | Client accounts and white-label delivery |

Launch: **$99** for the first 100 Solo buyers. 30-day money-back guarantee. USD pricing for the US market; GST/invoice handled at checkout.

## 10. Limitations

- The scan reads public HTML; it does not execute JavaScript or log into a CMS.
- It does not query ChatGPT/Perplexity/Gemini; the prompt panel is a manual test plan.
- It cannot prove that AI will cite the brand.
- It does not verify that claims or proof are true.
- AI answers vary by user, location, model and date; the pack reports a distribution, not a single truth.
- It is not legal advice and does not guarantee platform approval.

## 11. Definition of done

- 27/27 tests pass.
- Clean sample pack 100/100; broken pack <60 with ≥5 critical findings.
- Scanner works on the local fixture, a local HTTP fixture and a public URL; private/local targets are rejected by default.
- Validation, readiness, packaging and package audit all pass.
- Every advertised deliverable exists in the sample pack.
- Store listing and tutorial match the shipped behavior.
