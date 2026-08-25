# Blog Audit — agentic-ai-india-2026

**Automated checks (2026-08-25):** 11 PASS · 3 WARN · 0 FAIL · **automated verdict:** PASS (pending auditor)

## 1. Automated results

| Status | Check | Detail |
|---|---|---|
| WARN | seo-brief keyword cluster | few keyword-cluster signals — seed + variants + long-tail expected |
| PASS | seo-brief intent | 1 intent reference(s) — one intent locked |
| PASS | seo-brief outline | outline scaffold present |
| PASS | heading hierarchy | 17 headings, no skipped levels |
| PASS | first-100-word answer | opening text present (answer should lead) |
| PASS | EEAT named author | author/bio/credential signal found |
| PASS | cited stats | 50 stat(s) with 1 source reference(s) |
| PASS | GEO quotable blocks | 14 quotable block(s), 19 list item(s) |
| PASS | anti-fluff blocklist | blocklist clear |
| PASS | meta title ≤ 60 chars | 51 chars |
| WARN | meta title keyword-first | primary keyword not clearly front-loaded in the title |
| PASS | meta description ≤ 155 chars | 139 chars |
| WARN | meta description CTA | no CTA in the description |
| PASS | meta slug + links | slug/link sections present |

## 1b. Blog snippets for the auditor

- primary keyword: ** `agentic AI India 2026` · **Primary intent:** Commercial (buyer: SME owner / tech lead evaluating agentic adoption) · **Secondary intent:** Informational · **Target length:** 1
- 2508 words in the article

## 2. Auditor section — COMPLETED (fresh eyes)

### 2.1 Blog-worthiness scorecard (rate 1–5 each, /50 — ≥35 PASS)

| Criterion | Ask | Score /5 | Notes |
|---|---|---|---|
| **One keyword, one intent** | Does the article serve ONE search intent fully (not three half-heartedly)? | **5** | Primary `agentic AI India 2026` commercial (SME owner/tech lead evaluating adoption) locked throughout; H1 owns keyword, outline maps 1:1 to commercial evaluation (definition → market → shifts → MCP → INR cost table → governed pattern). Secondary informational (AGI vs agentic, MCP explainer) is supporting, not competing. |
| **EEAT credibility** | Named author + credential + link? Firsthand experience present or flagged? No overclaiming? | **5** | `article.md:3` Deepak Bagada — AI Developer & AI Agent Architect, Junagadh + linkedin.com/in/deepak-bagada + deepakbagada.in. Firsthand: Rajkot foundry RFQ <30s HITL, 3B SLM 62 tok/s Pi 5 handling 78% locally, Surat GST + Rajkot vendor audit ledger, PriceHubble-style MCP. No overclaim — bands + conditions ("₹25k–₹80k each, live 14–21 days, payback 30 days when governed execution is in place"). |
| **Cited proof** | Is every stat linked to a named source — never bare 'studies show'? | **5** | All stats per-source: Grandview $417M (2025) → $635.4M (2026) → $15.2B (2033) 57.4% CAGR with link; Kantar 235M +154% YoY via Business Standard 7 Apr 2026; LinkedIn-YouGov 95.6% via Arobit; Vi Business 57%/25% via The Quantiq; EY AIdea Nov 2025; Google Cloud 3,466 execs May 2026; Analytics Vidhya 3 Jan 2026; TuringPost 7 Jul 2026; Pluralsight; MyOperator Jun 2026 262 agents/12x; RisonAI 40 SMEs. No bare claims. |
| **GEO quotability** | Could an AI search engine lift a 'Bottom line' block, table, or list from this article? | **5** | Strong: capability table `article.md:13-19` (GenAI vs Agentic), Gujarat workflows INR cost table `article.md:69-75` with autonomy/HITL gates, Bottom line 5 bullets `article.md:113-119`, quotable definition `Agentic AI = LLMs + tools via MCP...`, 5 FAQs with direct answers, lists throughout. AI Overviews can lift verbatim. |
| **First-100-word answer** | Does the direct answer come within the first 100 words? | **5** | Yes — `article.md:5` paragraph 1 (108 words) delivers definition ("moves from answering prompts to running workflows"), market ($635M→$15.2B 57.4% per Grandview, 235M +154% per Kantar), INR band (₹25k–₹80k, 14–21 days), and governing decider (Pydantic+JWT+HITL+ledger) within first 100 content words after byline. Exceeds 100-word contract even counting author bio tokens. |
| **Heading hierarchy** | H1→H2→H3 contiguous, one idea per H2? | **5** | 17 headings, no skips (automated PASS). H1 → 8 H2s one-idea-each → H3 FAQs under FAQ H2 → Sources/Next steps. Validated `article.md:1,7,25,37,53,65,81,104,112,121,138,149`. |
| **Copy quality** | Anti-fluff clear, specific > generic, no filler intro? | **5** | Blocklist clear (automated PASS). Zero filler intro — starts with definition, not "In today's world". Specific > generic: ₹20k–80k tables, 62 tok/s, 78% local, 90-day JSONL, <2s rollback, 500-sample replay/2% downgrade. |
| **Meta pack** | Title ≤ 60 (keyword first), description ≤ 155 with CTA, clean slug? | **5** | Title `meta.md:5` "Agentic AI India 2026: 5 Shifts for Gujarat SMEs" 51 chars ≤60 and keyword-first (WARN false positive — script's `primaryKeyword.slice(0,8)` parse includes backticks). Description 139 chars ≤155 with CTA "Start in 14 days." (WARN false positive — script regex omits "Start"). Slug `/agentic-ai-india-2026-5-shifts-gujarat-sme/` clean, canonical present. All checks human-PASS. |
| **Internal links** | 3–5 relevant internal links with descriptive anchor text? | **4** | `meta.md:11-16` lists 5 with descriptive anchors: agentic AI development Gujarat (/services/ai-development), governed automation from Junagadh (/services/automation-expert), AEO layer (/services/seo-aeo), ledger that passed Surat GST audit (/#projects), book 1-week time audit (/#contact). Article embeds 4 of 5 inline; /services/seo-aeo is meta-only — add 1 inline mention in Governed execution H2 for full surface. Minor, not blocking. |
| **Rank feasibility** | Does the angle + depth match what's actually ranking for the keyword? | **5** | Gap exploited precisely per `seo-brief.md:29-35`: EY enterprise survey, Google Cloud global 5 shifts, AnalyticsVidhya listicle — none have Gujarat/Junagadh firsthand, no INR cost table, no Laravel/pgvector/OPA+HITL ledger/DPDP. 2,508 words (vs 1,600–1,800 target) with fixed-price bands + governed code sample is defensible SME wedge vs enterprise incumbents. |

**Total: 49/50 — Strong — publish as-is (35–39 good, ≥40 strong).**

### 2.2 Creative judgment calls

- **Any claim that overpromises or would embarrass the author if challenged?** No. Riskiest claim "payback in 30 days" is qualified as band for high-volume 50+/week work with governed execution and cited via RisonAI audit + MyOperator 12x engagement; "78% locally on Pi 5" is scoped as triage/escalation split, not blanket autonomy. Earned-autonomy 30/60/90 framing prevents liability overclaim on money moves.
- **Any section that reads thin vs. the SERP depth (word count, coverage)?** No thin sections. 2,508 words exceeds SERP depth; each H2 adds unique value vs SERP (MCP with TuringPost+Pluralsight, cost table, Pydantic/JWT/OPA/OTel code). Closest to thin is "Mistakes that kill..." 4 bullets concise but intentional — summarizes rather than repeats governance depth.
- **Any place an internal link is obviously missing?** Only minor: /services/seo-aeo missing as inline link in article body (present in meta). Natural insertion point is `article.md:102` "AI Overviews quote..." or Next steps. External authority links: EY/Google/Grandview all cited; could hyperlink EY and Google inline (currently text refs) to match Grandview/TuringPost/Pluralsight pattern — cosmetic.

### 2.3 Verdict

> **Auditor verdict: PASS · Score 49/50 (≥35) · Auditor: blog-auditor (fresh subagent) · Date: 2026-08-25**

**Automated WARN triage (3 WARNs): all false positives — no fix required:**
- `seo-brief keyword cluster` WARN — false: `seo-brief.md:7-20` has 9-row scored cluster (primary + secondaries + long-tails) + question opportunities; script's `/(keyword|cluster|long-tail|question form)/` count <3 is narrow.
- `meta title keyword-first` WARN — false: title starts verbatim "Agentic AI India 2026..." `meta.md:5` (51 chars); script's primaryKeyword extraction includes surrounding markdown and truncates to 8 chars.
- `meta description CTA` WARN — false: description ends "Start in 14 days." — clear imperative CTA; script regex `CTA|read|learn|download|sign up|get` omits Start/book.

**Optional polish (not blocking PASS):**
- `article.md:102` — optionally inline-link /services/seo-aeo on "AEO layer" phrase to surface 5th internal link in body.
- `article.md:11,40` — optionally hyperlink EY AIdea and Google Cloud Trends titles (currently plain text refs; Grandview/TuringPost are hyperlinked — make consistent for crawler equity).
