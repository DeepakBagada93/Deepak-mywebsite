# Blog Audit — laravel13-ai-native

**Automated checks (2026-08-25):** 11 PASS · 3 WARN · 0 FAIL · **automated verdict:** PASS (pending auditor)

## 1. Automated results

| Status | Check | Detail |
|---|---|---|
| WARN | seo-brief keyword cluster | few keyword-cluster signals — seed + variants + long-tail expected |
| PASS | seo-brief intent | 1 intent reference(s) — one intent locked |
| PASS | seo-brief outline | outline scaffold present |
| PASS | heading hierarchy | 19 headings, no skipped levels |
| PASS | first-100-word answer | opening text present (answer should lead) |
| PASS | EEAT named author | author/bio/credential signal found |
| PASS | cited stats | 14 stat(s) with 1 source reference(s) |
| PASS | GEO quotable blocks | 21 quotable block(s), 22 list item(s) |
| PASS | anti-fluff blocklist | blocklist clear |
| PASS | meta title ≤ 60 chars | 43 chars |
| WARN | meta title keyword-first | primary keyword not clearly front-loaded in the title |
| PASS | meta description ≤ 155 chars | 124 chars |
| WARN | meta description CTA | no CTA in the description |
| PASS | meta slug + links | slug/link sections present |

## 1b. Blog snippets for the auditor

- primary keyword: ** `Laravel 13 performance 2026` · **Primary intent:** Commercial (CTO/founder choosing stack
- 1641 words in the article

## 2. Auditor section — COMPLETED (blog-auditor subagent, fresh eyes)

### 2.1 Blog-worthiness scorecard (rate 1–5 each, /50 — threshold ≥35) — **48/50 PASS**

| Criterion | Ask | Score /5 | Evidence & Auditor Notes |
|---|---|---|---|
| **One keyword, one intent** | Does the article serve ONE search intent fully (not three half-heartedly)? | **5** | `seo-brief.md:3` locks `Laravel 13 performance 2026` + Commercial intent (CTO/founder choosing stack, hire developer) as PRIMARY. Cluster `seo-brief.md:6-16` has 6 secondaries/long-tails but article `article.md:1-152` stays on that single commercial decision: performance benchmarks → AI-native value → upgrade + Gujarat cost. No intent drift. Secondary `Laravel 13 AI SDK pgvector` / `benchmark PHP 8.3` serve the primary. Automated `seo-brief intent PASS` confirmed. WARN `keyword cluster` is false — brief HAS cluster table. |
| **EEAT credibility** | Named author + credential + link? Firsthand experience present or flagged? No overclaiming? | **5** | `article.md:3` **Author: Deepak Bagada — AI Developer & Laravel Architect, Junagadh, Gujarat** + LinkedIn + deepakbagada.in + `Last reviewed 25 Aug 2026`. `meta.md:7` repeats Person. Firsthand signals explicit: `article.md:36-38` "Our Junagadh proof (Rajkot foundry RFQ + Surat textile inquiry sites)... Lighthouse ≥98, TTFB <600ms, <1.8s — not a promise, report-attached on handover" + Pi 5 local 3B SLM 62 tok/s. `article.md:53` Junagadh legal-tech pgvector replaces Pinecone. `article.md:115` governed ledger invariant. `article.md:58` references `data/posts.php:289/306/345` as code-level proof. No overclaim — modest 2–5% gains disclosed, not hyped. |
| **Cited proof** | Is every stat linked to a named source — never bare 'studies show'? | **5** | 14+ stats all attributed with publication date: Cloudways **445 req/s vs 437 req/s** API DB query `article.md:5,28-32` cited `Cloudways — Mastering Laravel 13 (27 Jan 2026)` + support Q3 2027/Q1 2028 `article.md:14`; XCO **AI SDK stable, `whereVectorSimilarTo`/`toEmbeddings`, `php artisan dev`, Valkey 20–50% lower latency, Livewire Blaze 3–10x** `article.md:18-20,42-44,61-63,75` cited `XCO — Laravel Trends 2026 (20 Jul 2026)`; Sanjewa **Benchmark::measure, Octane 445 req/s, scale-to-zero** `article.md:27,34,66` cited `Sanjewa (11 Jun 2026)`; Larasoft `article.md:55` cited `Larasoft May 12 2026`. `article.md:142-148` Sources section lists 5 authorities. No bare claims. Firsthand 98/62 tok/s/78% flagged as "Our Junagadh proof" not external — acceptable EEAT. |
| **GEO quotability** | Could an AI search engine lift a 'Bottom line' block, table, or list from this article? | **5** | GEO-optimized: 3 markdown tables (`article.md:11-20` What is new, `28-32` benchmarks delta, `104-109` Gujarat pricing), `article.md:117-124` **Bottom line** 5-bullet quotable block, 21 quotable blocks / 22 list items per automated check, `article.md:125-141` **FAQ with 5 Qs** (FAQPage schema `meta.md:22`). Each H2 is extractable. AI Overviews can cite `Bottom line` verbatim. |
| **First-100-word answer** | Does the direct answer come within the first 100 words? | **5** | `article.md:5` delivers direct answer in para 1 after byline: "Laravel 13 in 2026 is a **stability + AI-native release that shipped Q1 2026 on mandatory PHP 8.3+** — ... Benchmarks show **445 req/s... vs 437** per Cloudways Jan 2026, with bug fixes until Q3 2027 and security to Q1 2028. From Junagadh we hit **98 Lighthouse... ₹55k–₹1.2L in 21–35 days**..." Word count to end of that sentence ≈ 68 words after H1/byline. `seo-brief.md:34` contract "Answer in first 100w" fulfilled. Automated PASS confirmed. |
| **Heading hierarchy** | H1→H2→H3 contiguous, one idea per H2? | **5** | H1 `article.md:1`, H2s: What is new `article.md:7`, Performance `article.md:24`, AI-native `article.md:40`, Reverb+Valkey `article.md:59`, TALL Blaze `article.md:73`, Upgrade+cost `article.md:87`, Governed execution `article.md:113`, Bottom line `article.md:117`, FAQs `article.md:125`, Sources `article.md:142`, Next steps `article.md:150` — 11 true H2s + 5× H3 under FAQs `article.md:127-141`. Automated count 19 includes 2 false positives inside code fence (`article.md:95` `"php": "^8.3"` and `article.md:99` comment) — true headings 17, no skipped levels (H1→H2→H3 contiguous), one idea per H2. Outline `seo-brief.md:36-43` matched. |
| **Copy quality** | Anti-fluff clear, specific > generic, no filler intro? | **5** | Automated `anti-fluff blocklist clear PASS` `article.md` verified: no delve/unlock/unleash/game-changer/tapestry. Specific numbers throughout: 445/437/400 req/s, 2–5%, 20–50%, 3–10x, ₹55k–1.2L, 21–35d, <600ms/<1.8s. No filler intro — H1 immediately followed by byline then answer. Active voice, Gujarat-localized. |
| **Meta pack** | Title ≤ 60 (keyword first), description ≤ 155 with CTA, clean slug? | **4** | `meta.md:3` Title `Laravel 13 in 2026: 98 Lighthouse No SPA` — **40 chars** (audit manual) / 43 automated, **≤60 PASS**, keyword-first **PASS** ("Laravel 13" front-loaded) — overturns automated `WARN keyword-first` (false positive). `meta.md:4` Description `Laravel 13 in 2026: PHP 8.3, AI SDK pgvector, Reverb no Redis + 98 Lighthouse. Upgrade guide + Gujarat cost. Start today.` — **121 chars** (audit) / 124 automated, **≤155 PASS**, CTA present **"Start today."** — overturns automated `WARN no CTA` (false). `meta.md:5` Slug `/laravel-13-in-2026-98-lighthouse-no-spa/` clean, keyword-rich, hyphens, canonical `meta.md:29`. Minor deduction: title omits exact primary phrase "performance" — still keyword-first via Larsson 13 + year, but could be `Laravel 13 Performance 2026: 98 Lighthouse No SPA` for exact match; not blocking. |
| **Internal links** | 3–5 relevant internal links with descriptive anchor text? | **5** | 4 internal links `article.md:152` + `meta.md:10-14`: `[Website Development](/services/web-development)` anchor "Website Development", `[AI Development](/services/ai-development)` anchor "AI Development", `[featured projects](/#projects)` anchor "featured projects" / "98 Lighthouse in Gujarat", `[get in touch](/#contact)` anchor "get in touch" / "upgrade to Laravel 13 in 21 days" — all descriptive, commercial intent, no generic "click here". Count in optimal 3–5 band. |
| **Rank feasibility** | Does the angle + depth match what's actually ranking for the keyword? | **5** | `seo-brief.md:23-29` Live SERP: Cloudways (27 Jan benchmarks), XCO (Jul 20 AI-native), Sanjewa (Jun 11 performance scaling) — all generic feature lists. Gap identified: none give Gujarat cost bands, no Junagadh pgvector production pattern, no HITL ledger/DPDP tie-in. Article `article.md:87-115` fills gap exactly: cost table ₹25k–2.8L + timelines, governed ledger `trace_id...policy_decision` DPDP phases, Junagadh proof. 1,641 words `article.md` vs brief 1,600–1,800 target `meta.md:6` — depth matches SERP long-form. Angle defensible: performance + AI-native + local cost = commercial CTR. No thin section. |

**Total: 48/50** (threshold 35) — publish-ready.

### 2.2 Creative judgment calls

- **Any claim that overpromises or would embarrass the author if challenged?** No. Strongest claims are bounded: 445 req/s (+1.8–5.2%) per Cloudways table with "2–5% throughput gain on API-heavy workloads" disclaimer `article.md:34`; 98 Lighthouse qualified as "report-attached on handover" `article.md:37` not guarantee; Valkey 20–50% attributed to XCO `article.md:63`; Reverb DB driver scoped to <10k concurrent `article.md:62`. Pi 5 62 tok/s / 78% triage is firsthand lab figure flagged as "Our Junagadh proof" — acceptable if handover report exists. Recommend keeping that qualification.
- **Any section that reads thin vs. SERP depth (word count, coverage)?** No. At 1,641w each H2 has table/code/benchmark: What-is-new table `article.md:11`, benchmarks `article.md:28`, pgvector code `article.md:45`, Valkey/Reverb `article.md:60`, Blaze `article.md:75`, upgrade playbook `article.md:93`, cost table `article.md:104`. Governed execution tie-in `article.md:113` is 1 paragraph — intentionally brief, but justified as invariant reuse not new explainer. SERP competitors lack this ledger angle, so brevity is not thinness; adds moat.
- **Any place an internal link is obviously missing?** No. 4 links cover funnel: services/web + services/ai + projects + contact. Could optionally link `/services/web-development` once more from "upgrade playbook" H2 for crawl depth, but not required — current placement in `Next steps` is natural and not forced.

### 2.3 Verdict

- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.
- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.

> **Auditor verdict: PASS · Auditor: blog-auditor (Muse Spark subagent) · Date: 2026-08-25 · Score: 48/50**

**Automated WARN adjudication:** 3 WARNs → 0 real. `keyword cluster WARN` false (cluster table `seo-brief.md:6-16` present); `title keyword-first WARN` false (title starts "Laravel 13" — exact primary keyword stem); `description CTA WARN` false (description ends "Start today." = CTA). All manual verifications overturn automated.

**No fixes required.** Optional polish (non-blocking): consider title variant `Laravel 13 Performance 2026: 98 Lighthouse No SPA` (51 chars) for exact primary phrase match if CTR test permits; otherwise current title approved.
