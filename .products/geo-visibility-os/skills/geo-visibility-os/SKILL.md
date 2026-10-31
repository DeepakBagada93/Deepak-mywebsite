---
name: geo-visibility-os
description: Run a defensible GEO/AEO visibility audit for a US brand, then produce the fix pack an agency can deliver — a 40-check scored audit, 30-prompt buyer panel, six answer-first content briefs, JSON-LD schema pack, citation plan, 90-day roadmap and white-label client report, all offline with zero dependencies and no API keys.
---

# GEO Visibility OS

GEO Visibility OS turns "the client asked if they show up in ChatGPT" into a scored audit and a fix pack. It is **not** a rank tracker and it does not query live AI engines. It reads public HTML, measures the signals AI search systems actually consume, and produces the deliverables an agency needs to sell and execute the work.

The product is deliberately honest about what moves AI visibility. In 2026, studies still show weak evidence that `llms.txt` changes citations, while crawler access, entity clarity, answer-first structure and third-party corroboration remain the defensible levers. The pack refuses to sell the first and prioritizes the rest.

## Activation triggers

Use this skill when the user asks for any of the following:

- "GEO audit", "AEO audit", "AI search visibility audit", "AI SEO audit"
- "How do we show up in ChatGPT / Perplexity / Google AI Overviews / Gemini / Copilot / Claude?"
- "Why do AI answers cite our competitors but not us?"
- "Build a GEO retainer deliverable", "white-label AI visibility report"
- "Audit our schema / robots.txt / llms.txt for AI crawlers"
- "Write content briefs that AI search can extract and cite"
- "Build a prompt panel to measure AI visibility"

Do **not** use this skill for classic technical SEO crawling at scale, paid media, review generation, or live prompt monitoring. It complements a tracker; it does not replace one.

## Input contract

The builder needs a brief JSON. Only `brand`, `domain`, `category` and `buyer` are required, but a real engagement supplies the rest.

```json
{
  "brand": "Pulse Dental Studio",
  "domain": "pulsedental.example",
  "market": "US",
  "category": "cosmetic dentistry",
  "buyer": "adults 30-55 in Austin comparing veneers and implants",
  "offer": "consultation and written treatment plan",
  "city": "Austin, TX",
  "serviceArea": ["Austin", "Round Rock", "Cedar Park"],
  "vertical": "local_service",
  "competitors": ["Lone Star Dental", "Riverbend Smiles"],
  "differentiators": ["same-day crowns", "sedation options"],
  "proof": ["a 4.9 average from 380 verified reviews"],
  "faqs": [{ "q": "Where do you work?", "a": "Austin, Round Rock and Cedar Park." }],
  "platforms": ["chatgpt", "perplexity", "google_ai", "gemini", "copilot", "claude"],
  "agencyName": "Northline SEO",
  "primaryPages": ["/", "/services/veneers", "/about"],
  "sameAs": ["https://www.google.com/maps/place/example", "https://www.linkedin.com/company/example"],
  "baselineDate": "2026-10-29",
  "reMeasureDate": "2026-11-28",
  "reportDate": "2026-10-29"
}
```

Rules for the brief:

1. Competitors must be real businesses the buyer actually loses to. Never invent one.
2. `proof` must be a verified first-party or third-party fact with a date. If the client cannot supply one, leave the array short and let the audit flag the gap.
3. `vertical` must be one of `local_service`, `b2b_saas`, `ecommerce`, `professional`. It selects the citation source map.
4. `platforms` must contain at least four supported engines. The builder rejects unknown engine names instead of silently generating an untestable panel.
5. Keep one brand name, one category description and one service area across the brief, the site and the JSON-LD. The audit checks entity consistency.
6. `domain` must be a bare public hostname. The builder rejects paths, credentials, fragments and malformed dates.
7. `sameAs` links must be real profiles for the same entity. Do not invent a profile or a review page.

The scanner accepts either a local HTML snapshot (`--dir`) or a public URL (`--url`). Local scanning is the default for client work because it is reproducible and does not hammer a live site. URL scanning fetches public HTML, `robots.txt`, `sitemap.xml` and `llms.txt` with an identifying user agent, and blocks private/local targets by default.

## Ordered pipeline

Run the stages in order. Do not skip the scan or the audit.

### Stage 1 — Capture the site

```bash
node scripts/scan-site.mjs --dir ./client-site --domain client.example --out snapshot.json
node scripts/scan-site.mjs --url https://client.example --max-pages 5 --out snapshot.json
# Trusted local staging only:
node scripts/scan-site.mjs --url http://127.0.0.1:8080 --allow-private --out snapshot.json
```

URL scans block localhost, private, link-local and cloud-metadata addresses by default, cap responses at 5 MB, time out after 15 seconds, follow at most five redirects, reject HTTPS-to-HTTP downgrades and accept text/HTML/XML/JSON content types only. `--allow-private` bypasses the address guard for trusted staging; never expose it as a public fetcher.

The scanner starts at the requested path, follows same-origin relative and absolute links, adds same-origin sitemap URLs, records per page: title, meta description, canonical, H1/H2/H3, word count, schema types, FAQ schema, author, published/modified date, comparison table, question-form headings, the first substantial paragraph, internal and external links, image alt coverage and whether the page is JavaScript-dependent. It also parses `robots.txt` and reports allow/block for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended and CCBot, plus sitemap and optional `llms.txt` presence.

If the snapshot shows fewer than three pages, fix the crawl scope before building. A one-page audit is a sample, not a diagnosis.

### Stage 2 — Build the pack

```bash
node scripts/build-geo-pack.mjs \
  --brief client-brief.json \
  --snapshot snapshot.json \
  --out ./client-pack \
  --agency "Northline SEO"
```

The builder writes eleven files:

| File | Purpose |
| --- | --- |
| `snapshot.json` | Raw signals; keep it with the engagement record |
| `pack.json` | Single source of truth for the audit and delivery |
| `client-report.md` | White-label report with score, findings, plan and limits |
| `prompt-panel.csv` | 30 prompts across five stages and six engines |
| `content-briefs.md` | Six answer-first briefs with evidence requirements |
| `schema-pack.json` | Organization, Service, FAQPage, BreadcrumbList, Article |
| `schema-install.md` | Placement and validation instructions |
| `fix-roadmap.csv` | 25+ owned actions with effort, impact and verification |
| `citation-plan.md` | Ten source types with concrete actions |
| `measurement-plan.md` | GSC, Bing, GA4 and manual panel |
| `README.md` | How to read and deliver the pack |

### Stage 3 — Audit before delivery

```bash
node scripts/audit-geo-pack.mjs ./client-pack/pack.json \
  --md=./client-pack/audit.md \
  --json=./client-pack/audit.json
```

The audit is deterministic. Forty weighted checks across eight classes total 100 points:

| Class | Weight | What it catches |
| --- | ---: | --- |
| Structure | 8 | Missing brand/domain/market, fewer than two competitors, weak platform coverage, placeholders |
| Crawl access | 16 | Missing robots.txt, blocked ChatGPT-User/OAI-SearchBot/PerplexityBot/Claude-SearchBot, no sitemap, JavaScript-only copy. Training-bot blocks (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot) are reported separately and are not scored as retrieval failures. |
| Entity | 14 | Missing Organization/Service/FAQ/Breadcrumb schema, no sameAs, inconsistent brand/city, no author |
| Content | 18 | No answer-first summary, weak question headings, thin pages, no dated evidence, no comparison, stale pages, missing alt text |
| Citation | 12 | Thin source map, no reviews/community, no earned media, manipulative tactics |
| Prompt coverage | 12 | Missing funnel stages, all branded or no competitor prompts, unassigned platforms, fewer than 30 prompts |
| Measurement | 10 | No GSC/Bing/GA4 plan, no baseline/re-measure, dishonest attribution claims |
| Delivery | 10 | Report too thin, roadmap under 20 actions or missing owners, no schema install, no limits |

Verdicts:

- `PASS` — score ≥85 with zero critical and zero high findings.
- `FIX NEEDED` — score 60–84, or any high finding.
- `DO NOT SHIP` — score <60 or any critical finding.

Exit codes: `0` PASS, `1` FIX NEEDED or DO NOT SHIP, `2` bad input. Use `--report-only` in exploratory runs and the default in CI.

### Stage 4 — Deliver and fix

1. Read the client report end to end. Replace every generated example with a verified client fact.
2. Send the report with the P0 fixes and the first two content briefs, not the whole 100-page dump.
3. Install schema only after the matching visible content exists. Validate with a schema validator or Rich Results Test.
4. Run the prompt panel manually: three runs per prompt per engine on the same day, logging mention, citation, position and sentiment.
5. Re-measure at the date in the measurement plan and report deltas, not a single score.

## Output specification

A delivered pack must contain all eleven files and satisfy these contracts:

- **Prompt panel:** exactly 30 prompts, five stages (awareness, comparison, decision, objection, branded), at least one competitor prompt, at least one branded and one non-branded prompt, every prompt assigned to a platform with a success signal and three runs.
- **Content briefs:** six briefs, each with target prompt, intent, page type, suggested URL, title, answer block, six sections, evidence required (at least four items), schema list, internal links, CTA, extraction rules and a "do not" list.
- **Schema pack:** five JSON-LD blocks. No aggregateRating, no price and no credential is invented. FAQ answers must match visible page copy.
- **Roadmap:** at least 25 actions, each with priority (`P0`–`P2`), owner, effort, impact and a verification step. At least one P0 must exist in every pack.
- **Citation plan:** at least eight source types, with a concrete action and a disclosure/ethics caution per source. No fabricated URLs.
- **Measurement:** baseline date, re-measure date, cadence, five KPIs and four sources (Google Search Console generative AI report, Bing Webmaster Tools citation share, GA4 AI referral segment, manual prompt panel), plus reporting rules that label modelled numbers.
- **Client report:** prepared-for block, executive summary, score breakdown, per-page findings, 90-day plan, prompt-panel summary, measurement section and a limits section.
- **Delivery limits:** the report must state that the scan does not execute JavaScript or log in, the panel is not a live tracker, AI answers vary, claims are not verified and no citation, ranking or revenue outcome is guaranteed.

## Scoring and severity discipline

Weights are fixed in `lib.mjs`. Do not hand-edit a score. If a check is wrong, fix the check and regenerate every expected audit. Critical findings are reserved for: missing brand/domain/market, placeholders, manipulative citation tactics, a report that cannot be delivered and missing limits. High findings are the conditions that make a pack commercially unsafe or ineffective. Medium and low findings are improvements.

When a client disputes a score, show the failed check ids and the verification step. Do not negotiate the number.

## Measurement discipline

The pack treats AI visibility as a distribution, not a truth:

- Run every prompt multiple times; AI answers vary by user, location, model and date.
- Report mention rate, citation rate, share of voice, AI referral sessions and assisted conversions.
- Label every revenue or conversion number as modelled.
- Expect undercounting: many AI clients strip the referrer, so AI sessions hide in direct traffic.
- Do not claim causality from a visibility change alone. Pair it with a control period or a holdout where possible.

## Negative constraints

- **Never promise citations, rankings or revenue.** The words "guaranteed" and "100%" must not appear in client deliverables except inside the limits statement.
- **Never invent proof.** No fake reviews, ratings, awards, credentials, prices, addresses or case studies. If the client cannot verify it, it does not ship.
- **Never recommend buying reviews, paid links, astroturfing or community spam.** The citation plan must be factual, disclosed and allowed by each community's rules.
- **Never sell `llms.txt` as a visibility lever.** It is optional agent readability. In 2026 crawler studies it was rarely fetched and did not measurably lift citations. Say that plainly.
- **Never block training bots by accident.** Blocking GPTBot or ClaudeBot is a training decision; OAI-SearchBot, ChatGPT-User, PerplexityBot and Claude-SearchBot are retrieval paths. Separate the decisions and explain the trade-off.
- **Never claim the scan sees JavaScript-rendered content.** If the page is client-rendered, say so and recommend server rendering.
- **Never present the readiness score as a forecast.** It is a diagnostic of observed signals.
- **Never use competitor trademarks in a misleading comparison.** Name the competitor factually and link to their official page.
- **Never ship a pack with placeholders.** Run the audit; placeholders are a critical failure.
- **Never upload client data.** The tool is local and offline by design.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `No HTML pages found` | Wrong directory or only `.htm` files in a skipped folder | Point `--dir` at the folder containing `index.html` |
| Readiness is low but the site looks fine | Pages are client-rendered (low text, many scripts) | Server-render or pre-render the main copy |
| All AI bots show blocked | `Disallow: /` under `User-agent: *` | Add explicit allow groups for the search bots you want |
| Audit fails `citation.ethics` | The plan text contains manipulative language | Remove paid-link, fake-review or spam tactics |
| Audit fails `delivery.roadmap` | Fewer than 20 actions or missing owner/verification | Regenerate the pack; do not hand-trim the roadmap |
| `Refusing to scan localhost` or a private address | The URL resolves to a local/private target | Use a public URL, or `--allow-private` only for a trusted staging server |
| `Unsupported content type` | The URL returned an image, PDF or binary | Point the scanner at an HTML page, not a file download |
| `Brief field ... must be` | Malformed brief input | Fix the named field; the builder validates before scanning |
| `Pack is missing ...` | Malformed or truncated `pack.json` | Rebuild the pack; do not hand-edit it |
| Score changes between runs | The brief or snapshot changed | Re-scan, rebuild and keep one pack per engagement |

## Definition of done

- `npm test` (or `node --test tests/*.test.mjs`) passes from the product root.
- The clean sample pack audits at 100/100 PASS.
- The broken sample audits below 60 with at least five critical findings.
- Building the same brief and snapshot twice produces byte-identical `pack.json`.
- The scanner works offline on the included fixture and rejects private/local URL targets by default.
- Malformed briefs and packs exit with code 2 and a clear error, not a stack trace.
- Every advertised deliverable exists in the sample pack.
- The audit prints a summary unless `--json=-` or `--md=-` is used.
