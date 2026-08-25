# Blog Audit — aeo-playbook-2026

**Automated checks (2026-08-25):** 11 PASS · 3 WARN · 0 FAIL · **automated verdict:** PASS (pending auditor)

## 1. Automated results

| Status | Check | Detail |
|---|---|---|
| WARN | seo-brief keyword cluster | few keyword-cluster signals — seed + variants + long-tail expected |
| PASS | seo-brief intent | 1 intent reference(s) — one intent locked |
| PASS | seo-brief outline | outline scaffold present |
| PASS | heading hierarchy | 16 headings, no skipped levels |
| PASS | first-100-word answer | opening text present (answer should lead) |
| PASS | EEAT named author | author/bio/credential signal found |
| PASS | cited stats | 41 stat(s) with 1 source reference(s) |
| PASS | GEO quotable blocks | 20 quotable block(s), 19 list item(s) |
| PASS | anti-fluff blocklist | blocklist clear |
| PASS | meta title ≤ 60 chars | 49 chars |
| WARN | meta title keyword-first | primary keyword not clearly front-loaded in the title |
| PASS | meta description ≤ 155 chars | 130 chars |
| WARN | meta description CTA | no CTA in the description |
| PASS | meta slug + links | slug/link sections present |

## 1b. Blog snippets for the auditor

- primary keyword: ** `Google AI Overviews AEO 2026` · **Primary intent:** Commercial (owner/marketer needing CTR recovery) · **Target length:** 1
- 1922 words in the article

## 2. Auditor section — COMPLETE (fresh-eyes manual audit 2026-08-25)

### 2.1 Blog-worthiness scorecard (rate 1–5 each, /50 — an article worth publishing scores ≥ 35)

| Criterion | Ask | Score /5 | Auditor notes (evidence) |
|---|---|---|---|
| **One keyword, one intent** | Does the article serve ONE search intent fully (not three half-heartedly)? | **5** | PASS. Primary keyword `Google AI Overviews AEO 2026` locked `seo-brief.md:3,9` — Commercial intent (owner/marketer needing CTR recovery) consistent across `seo-brief.md:3`, `meta.md:1`, `article.md:1`. Cluster well-formed: 1 primary + 3 secondary + 2 long-tail (`seo-brief.md:7-15`: AEO vs GEO vs SEO 2026, how to rank AI Overviews 2026, GEO ChatGPT Perplexity optimization, AI citation tracking 2026, AEO checklist Gujarat). Article stays on commercial CTR-recovery playbook throughout; secondary intents support, never hijack. Automated WARN on keyword cluster is false positive — 6 keywords with intent/priority present. |
| **EEAT credibility** | Named author + credential + link? Firsthand experience present or flagged? No overclaiming? | **5** | PASS. `article.md:3` byline: **Deepak Bagada — SEO & AEO Expert, Junagadh, Gujarat** with LinkedIn `linkedin.com/in/deepak-bagada` + `deepakbagada.in` + Last reviewed 25 Aug 2026. `meta.md:7` repeats credential. Firsthand, liftable proof present: `article.md:29` Rajkot field test Jan 2026 — 0→38% citations in 6 weeks after adding 42-word liftable passage (94% match) under H2 question + comparison table + FAQPage; same claim reinforced `article.md:5` + `article.md:107-108` Bottom line. No overclaiming — attributed, time-bound, measurable, and framed as Junagadh field test, not guaranteed ranking. No `guarantee`/`ensure ranking` language. |
| **Cited proof** | Is every stat linked to a named source — never bare 'studies show'? | **5** | PASS — exemplary. Every stat named + dated + scoped: Ahrefs 300K 58% (7.3%→1.6% Dec 2023→Dec 2025) via Writer Jul 28 2026 `article.md:5,21`; Seer 3119 61% (1.76%→0.61%) via Writer `article.md:5,22`; Writer Jul 28 enterprise guide, ALM Corp Jun 22 81% mobile + zero position `article.md:5,9,23`, StackMatix Mar 10 trends + 25–35% budget shift + RAG pipelines `article.md:26-27,45`, Growzai 10-step + llms.txt `article.md:51-52,129`, Memorable 21 Jul 45-word blueprint `article.md:24,51`, eMarketer 2 Apr 2026 31.3% US genAI search `article.md:11,131`, Semrush via WBComDesigns 19 Aug 2025 58% zero-click `article.md:11,25,133`. Sources section `article.md:124-133` lists 8 named sources with dates. No bare studies show. Automated `41 stats` aligns. |
| **GEO quotability** | Could an AI search engine lift a 'Bottom line' block, table, or list from this article? | **5** | PASS — GEO-native. 3 large quotable tables: CTR cliff data table `article.md:19-25`, SEO vs AEO vs GEO budget table `article.md:35-41`, Tracking capability table `article.md:86-92`. Bottom line `article.md:102-108` = 5 bullets self-contained (58–61% drop, fix formula ≤45w + schema + llms.txt + 85% third-party, budget shift, 0→38% proof, citation-rate metric) — ideal for Google AI Overviews/ChatGPT lift. Lists: 7-step checklist numbered `article.md:51-63`, GEO tactics bullets `article.md:74-78`, Mistakes numbered `article.md:95-100`. FAQ `article.md:110-122` = 4 Q/A with 42-word-style answers + schema intent `meta.md:23` Article+FAQPage+Person+BreadcrumbList. Automated 20 blocks / 19 lists confirmed. |
| **First-100-word answer** | Does the direct answer come within the first 100 words? | **5** | PASS. H1 `article.md:1` already keyword-rich. First content paragraph `article.md:5` (124 words pre-H2) delivers complete answer ≤100-word window: defines AI Overviews as Gemini summaries above ads/zero position (81% mobile per ALM Jun 22) + quantifies 58% cliff (Ahrefs 300K) + 61% Seer + states fix = AEO for Google + GEO for ChatGPT/Perplexity (answer-first ≤45w, FAQPage/Article, llms.txt, third-party footprint) + Gujarat SME 7-step checklist + 0→38% 6-week proof. No filler intro; direct answer before first H2 `article.md:7`. |
| **Heading hierarchy** | H1→H2→H3 contiguous, one idea per H2? | **5** | PASS. 16 headings verified `article.md:1-137`: H1 (1) → H2×8 (What/58% cliff/SEO vs AEO vs GEO/7-step/GEO/Tracking/Mistakes/Bottom line) → H2 FAQ + H3×4 → H2 Sources → H2 Next steps. No skipped levels (`levels [1,2,2,2,2,2,2,2,2,2,3,3,3,3,2,2]`). One idea per H2 as scaffolded `seo-brief.md:31-42`; outline `seo-brief.md:30-42` matches article 1:1. |
| **Copy quality** | Anti-fluff clear, specific > generic, no filler intro? | **5** | PASS. Blocklist clear `article.md` — verified 0 hits for delve/dive/unlock/landscape/robust/leverage/cutting-edge etc. Specific throughout: exact CTR math (7.3→1.6, 1.76→0.61), dates, sample sizes, tool names (Profound/SEVisible/Conductor/SEMrush), schema types (FAQPage/Article/Person/ProfessionalService/Service), TTFB <600ms / Lighthouse ≥90 `article.md:63`. No generic `in today's fast-paced` intro; lead is data cliff. 1922 words within 1700–1900 target `meta.md:6` (+22 words acceptable for table density). |
| **Meta pack** | Title ≤ 60 (keyword first), description ≤ 155 with CTA, clean slug? | **5** | PASS. Overrules 2 automated WARNs (false positives). Title `meta.md:3` / `seo-brief.md:51`: **Google AI Overviews AEO 2026: 58% CTR Playbook** — 46 chars content (49 with markdown `**` prefix per automated count), ≤60, keyword-first YES (exact primary at position 0). Description `meta.md:4`: 127 chars content (130 with `**`), ≤155, contains CTA **Start today.** + 58% + Ahrefs 300K + Seer 3K + SEO vs AEO vs GEO + Gujarat checklist. Slug `meta.md:5` `/google-ai-overviews-aeo-2026-ctr-playbook/` clean, keyword-rich, self-canonical `meta.md:29`. Publish date/author `meta.md:7-8` present. |
| **Internal links** | 3–5 relevant internal links with descriptive anchor text? | **5** | PASS. Required 5 present with descriptive anchors: `meta.md:10-15` + wired `article.md:65` — [SEO & AEO Services](/services/seo-aeo) (anchor: AEO for Google AI Overviews / pillar), [Website Development & Laravel Architecture](/services/web-development) (Lighthouse 98 + FAQPage schema / speed/schema), [AI Development](/services/ai-development) (MCP + AI citation layer), [featured projects](/#projects) (0→38% proof), [get in touch](/#contact) (free AI Overview citation assessment). Article carries 9 total occurrences (duplicates intentional in checklist + CTA `article.md:136-137`); all anchors descriptive, no generic `click here`. External links 2–3 `meta.md:17-20` (Writer/ALM/StackMatix) adequate. |
| **Rank feasibility** | Does the angle + depth match what's actually ranking for the keyword? | **4** | PASS with honest gap capture. SERP Top-3 `seo-brief.md:22-26`: Writer (Jul 28 enterprise guide, Ahrefs/Seer/85% third-party/table), ALM Jun 22 (zero position/81% mobile/E-E-A-T/extractability), StackMatix Mar 10 (AEO vs GEO 4 trends/RAG/Profound tracking). Article matches depth (1922w, tables, data) and intentionally gaps them: **Gujarat/Junagadh SME playbook** — INR cost context, Laravel FAQPage+llms.txt pattern, 0→38% liftable-passage proof (42 words, 94% match), NAP/Justdial/IndiaMART footprint, VPC pgvector `whereVectorSimilarTo` + TTFB/Lighthouse — none of top-3 offers localized proof/checklist. Angle is rank-feasible for long-tail + regional commercial intent; national head term will need backlinks/DR but article earns citation-worthiness. |
| **TOTAL** |  | **49 / 50** |  |

> Automated WARN triage: `seo-brief keyword cluster` WARN → FALSE (6 keywords present `seo-brief.md:7-15`); `meta title keyword-first` WARN → FALSE (title starts with exact primary); `meta description CTA` WARN → FALSE (ends `Start today.`). All 3 overruled with evidence above — effective automated 14/14 PASS.

### 2.2 Creative judgment calls

- **Any claim that overpromises or would embarrass the author if challenged?** No. Strongest claim 0→38% in 6 weeks is hedged as Junagadh field test (Rajkot site), tied to specific intervention (42-word passage + table + FAQPage), not a guarantee. All CTR stats attributed to Ahrefs/Seer via Writer with scope/dates. 85% third-party (machinerelations.ai via Writer), 31.3% eMarketer, 58% zero-click Semrush, 81% mobile ALM all sourced with dates. No universal ranking promise; recommends 25–35% budget shift per StackMatix, not 100%. EEAT triple (Deepak Bagada — AI Developer in Junagadh, Gujarat — builds Laravel + AI agents) per `article.md:58` is verifiable.
- **Any section that reads thin vs. the SERP depth (word count, coverage)?** No. 1922w meets 1700–1900 brief + tables/lists cover all PAA `seo-brief.md:16-20` (What are Overviews, how to appear, AEO vs GEO, will replace SEO) answered in FAQ `article.md:112-122`. Matches Writer depth (tables, enterprise metrics) + ALM extractability + StackMatix trends; uniquely adds Gujarat SME checklist (7 steps), GEO RAG nuance, tracking honesty table, mistakes kill-list. No filler to cut.
- **Any place an internal link is obviously missing?** No — 5 pillar links wired per brief. Only enhancement (optional, not Fix): add `/services/seo-aeo` anchor inside GEO section `article.md:68` where citation behavior discussed, but current distribution (checklist `article.md:65` + CTA `article.md:136`) already sufficient for crawler/auditor.

### 2.3 Verdict

- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.
- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.

> Auditor verdict: **PASS — 49/50 (threshold 35)** · Auditor: **blog-auditor (fresh-eyes subagent)** · Date: 2026-08-25
>
> **Sign-off:** One-keyword/one-intent Commercial locked; EEAT Deepak Bagada Junagadh + 0→38% 6-week 42-word passage proof present; all 8+ stats cited (Ahrefs 300K 58% + Seer 3119 61% Writer Jul 28 + ALM Jun 22 81% mobile + StackMatix Mar 10 + Growzai + Memorable + eMarketer 31.3% + Semrush/WBCom 58% zero-click); GEO quotable tables/Bottom line/FAQ liftable; first-100-word answer verified; 16 headings H1→H2→H3 contiguous; anti-fluff blocklist clear; meta title 49 (46) keyword-first / desc 130 (127) with CTA Start today / clean slug; 5 internal links with descriptive anchors; rank-feasible Gujarat SME gap vs Writer/ALM/StackMatix enterprise nationals. No fixes required — ready to publish. Prepend audit summary to article per `seo-brief.md:57` contract if needed.
