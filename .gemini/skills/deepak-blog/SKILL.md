---
name: deepak-blog
description: >
  End-to-end Rank-#1 SEO & AEO journal pipeline for Deepak Bagada (deepakbagada.in) — viral/trending research
  → scored topic queue (preset: 3 blogs +3 day-in-life +3 AI news +3 web dev +3 custom MCP/Workflow Next.js+Laravel)
  → sequential one-by-one writing (1,200-1,600 words, high-EEAT, AEO answer-first,
  Rank-#1 meta title/description for best/top developer queries, 3-5 internal links, 4 FAQ) → pre-publish audit → push one-by-one to
  data/posts.php + Hostinger MySQL → live URL format & content audit. One-command auto-publish via publish-queue.mjs.
---

# 🚀 Deepak Bagada Rank-#1 SEO & AEO Journal Pipeline (`deepak-blog` v6.0)

> **One-by-one, research → write → audit → push → verify.** Every post is engineered to own position #1 and the AI answer for `best/top developer` queries across 3 niches — **website developer, AI agent developer, AI expert** — × 4 geos (`Junagadh / Gujarat / India / world`). No batch dumps. Every topic is individually researched for viral/trending + commercial `best/top` demand, written to AEO standards, audited, pushed live, and **live-URL audited for format correctness** before the next topic starts.

This skill builds **1,200–1,600+ word**, deeply authentic, search- and AEO-optimized journal posts for
**Deepak Bagada** — *Leading AI Expert, AI Agent Architect, Web Developer & Marketing Automation Specialist,
founder of SaaS Next, builder of Curro, based in Junagadh, Gujarat, India*. **Positioning:** rank #1 on Google for `best website developer`, `best AI developer`, `best AI agent developer`, `top AI expert in India/world/Gujarat/Junagadh` and be the source AI answer engines (ChatGPT, Gemini, Perplexity, Google AI Overviews) quote verbatim.

## 🏆 v6.0 Rank-#1 Target Map (NEW — read before Stage 0)

Every queue MUST cover the money grid below. ≥50% of any queue must be a cell from this grid.

| Niche \ Geo | Junagadh | Gujarat | India | World |
|---|---|---|---|---|
| **Website developer** | `best website developer Junagadh` | `best website developer Gujarat` | `best website developer India` | `best website developer world` / `top web developer` |
| **AI agent developer** | `best AI agent developer Junagadh` | `best AI agent developer Gujarat` | `best AI agent developer India` | `best AI agent developer world` |
| **AI expert / AI developer** | `best AI expert Junagadh` | `top AI expert Gujarat` | `best AI developer India` / `top AI expert India` | `best AI expert world` / `top AI developer world` |

Supporting long-tails (each Rank-#1 post also captures): `top <niche> <geo> 2026`, `hire <niche> <geo>`, `<niche> cost <geo> 2026`, `<niche> near me`, `who is the best <niche> in <geo>`.

**v6.0 rule:** title + H1 + first 100 words must contain the exact `best/top + niche + geo` phrase once, verbatim (e.g. "best AI agent developer in India"). Slug must contain `best|top-niche-geo-2026`. FAQ Q1 must be `Who is the best <niche> in <geo>?` with a 40–60 word quotable answer naming Deepak Bagada + proof.

---

## 🔄 Pipeline Overview (7 Stages — Sequential, One-by-One)

```
Stage 0  Viral + Best/Top Research  ─┐
Stage 1  Scored Queue + Approval    ─┤  One queue, user approves which topics go live
         ┌───────────────────────────┘
         ▼
Stage 2  Sequential Write Loop (ONE BY ONE)
  ┌─► Stage 3  Write 1 post (high-CTR + high-EEAT + AEO + meta + links + FAQ + proof table if best/top)
  │   Stage 4  Pre-publish audit (audit-blog.mjs + subagent → PASS, CTR ≥7/10, EEAT-Pro PASS)
  │   Stage 5  Push THIS post → data/posts.php + MySQL + deploy
  │   Stage 6  Live URL audit (audit-live-url.mjs → PASS, format OK, CTR snippet + EEAT-Pro OK)
  └── Stage 7  Next topic? → loop back to Stage 3 until queue done
```

**Critical rule:** Never write/push multiple posts in parallel. Each topic completes **Stages 3→6 fully**
before the next topic starts.

---

## 🧠 STAGE 0 — Viral + Best/Top Research (MANDATORY FIRST STEP)

**Goal:** Find what your niche actually wants *right now* — viral spikes + high-intent `best/top` commercial queries that convert, not just informational.

### Step 0.1 — Generate scaffold queue

```bash
# One-command preset you asked for: 3 blogs(Authority) +3 day-in-life +3 AI news +3 web dev(Next.js+Laravel) +3 custom MCP/Workflow (both stacks) = 15
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --preset deepak-15 --out research-brief.md --json research-brief.json

# One-command search+push to live DB (auto — searches then pushes to data/posts.php + Hostinger MySQL):
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --preset deepak-15 --out research-brief.md --json research-brief.json --auto-publish
# or explicitly:
node .gemini/skills/deepak-blog/scripts/publish-queue.mjs --brief research-brief.md --json research-brief.json --yes

# Other presets:
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --preset deepak-12 --out research-brief.md --json research-brief.json  # without MCP

# Classic modes still work:
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --niche "AI agents" --count 10 --out research-brief.md
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --all --count 15 --out research-brief.md --json research-brief.json
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --niche "best AI developer India" --count 10 --out research-brief.md
```

Preset `deepak-15` enforces exact distribution: `authority:3` (blogs/best) + `founder-story:3` (day-in-life proper) + `ai-news:3` + `web-dev:3` (Next.js 15.5 + Laravel 13 both) + `custom-mcp:3` (Next.js MCP + Laravel MCP + n8n workflow). Preset `deepak-12` is same without custom MCP. Script auto-expands every seed into `best/top` variants and scores commercial `best` intent higher.

### Step 0.2 — Enrich with REAL live research (agent does this, not the script)

For **each** scaffold topic, run live research and replace placeholder signals:

| Signal | How to verify | Tool |
|---|---|---|
| **SERP top-10** | `web_search "<keyword> 2026 best top"` + `web_fetch` top 3 results — note titles, angles, gaps, word count, schema | `competitor-gap.mjs` |
| **People-Also-Ask** | `web_search "<keyword> questions"` — collect 3-4 PAA questions (esp. `best/top` questions) | manual |
| **Trend momentum** | Google Trends (30/90d), `web_search "<keyword> trending 2026"` | manual |
| **High-CTR competitor titles** | Extract title patterns: numbers, `Best/Top`, brackets, geo, year. Flag CTR score 0-10 | `audit-blog.mjs` CTR scorer |
| **Commercial intent proof** | Search volume proxy (PAA volume, Related Searches), CPC hint, `best/top` modifier density | manual |
| **Social viral** | `web_search "<keyword> site:twitter.com OR site:linkedin.com OR site:youtube.com"` — impressions/views | manual |
| **Competition gap** | What do existing `best/top` listicles miss? Your unique angle (first-person, Junagadh, production code, ₹ pricing table, P95 metrics, 90-day ledger) | manual |

**Best/Top enrichment is mandatory for any `best/top` topic:** you must fetch at least 3 competitors that rank for `best AI developer India` / `top website developer Gujarat` and document why their listicle is weak (no proof, no pricing, no Junagadh grounding, no code).

### Step 0.3 — Re-score & re-rank (0–100) — Deterministic

```
Trend momentum (0-30) + Search intent value (0-30) + AEO citation potential (0-20) + Competition gap (0-20) = /100
```

Scoring rules v5.0:
- **Intent value:** `best/top` commercial = 25-30, `how to` commercial = 20-25, informational = 10-20
- **Best/Top bonus:** +5 if keyword contains `best/top` + geo (`India/Gujarat/Junagadh/world`) — these are money keywords per `SEO-AEO-PLAN.md:43`
- **Day-in-life:** scores high on EEAT (personal experience) but lower on search volume — balance 18-22 intent
- Re-rank queue descending by final score. Cross-check every slug:
  - Against `memory.md` + `data/posts.php` (already deduped by script)
  - **Live check:** `https://deepakbagada.in/journal/<slug>` must return **404**

Optional: run competitor gap analyzer:
```bash
node .gemini/skills/deepak-blog/scripts/competitor-gap.mjs --keyword "best AI developer India 2026" --out gap-best-ai-india.md
```

### Output: `research-brief.md` (enriched)
Contains ranked queue with per-topic: pillar, primary keyword, intent, viral proof (with URLs), CTR forecast (0-10), competition gap, EEAT proof required (table/pricing/metrics), suggested Deepak angle, internal link targets, final score.

---

## ✅ STAGE 1 — Scored Queue + User Approval Gate

**Stop and present `research-brief.md` to the user.** Do not write a single word until approved.

User ticks **Approved? ☑/☐** per topic. Only `Approved = Yes` topics enter Stage 2.
Rejected topics stay in the file as audit trail.

**Approval format:**
```
1. Title — Approved ☑  (or ☐ skip)  Score 94/100  CTR 9/10
2. Title — Approved ☐
...
```

Once approved, you have your **sequential queue** — e.g., 5 approved topics ranked 1→5.
**Priority order v5.0:** `best/top` commercial first, then viral informational, then day-in-life story (EEAT anchor).

---

## ✍️ STAGE 2+3 — Sequential Writing Loop (ONE BY ONE)

> **Loop invariant:** One topic at a time. Complete Stages 3→6 for topic N before touching topic N+1.

### Stage 3 — Write ONE Post (High-Quality, High-CTR, High-EEAT, AEO-Optimized)

Pick the **next approved topic** in rank order. Write strictly to these standards:

#### 3.1 Word Count & Voice
- **1,200–1,600+ words** — comprehensive, actionable, with real numbers + code/architecture snippets + ₹ pricing where commercial
- **First-person Deepak voice:** *"founder of SaaS Next, builder of Curro, AI agent developer in Junagadh, Gujarat"* — zero generic filler/AI fluff
- **Day-in-life proper:** timestamped routine (`06:00 Deep Work → 09:00 Client Ship → 18:00 OTel Review`), real P95 latencies, ledger metrics, not vague "I work hard"

#### 3.2 High-CTR Meta (Title + Excerpt) — v6.0 Rank-#1 Formula Bank

> CTR is the #1 lever for `best/top` — position 1 gets ~28% clicks, position 3 gets ~11%. These formulas are mandatory.

**Title rules (all must hold):**
- `≤60 chars` (sweet spot 50–58), **exact keyword front-loaded in first 20 chars**: `Best <Niche> <Geo> 2026…`
- Must contain: year `2026` + geo (`Junagadh/Gujarat/India/world`) + digit (`Top 5`, `₹55K`, `42ms`, `30-day`) + power word (`Best/Top/Guide/Proven/Costs`)
- Colon benefit after position ~35 lifts CTR 15–30%: `…2026: <Benefit with number>`
- Never vague (`Thoughts on AI`), never keyword-stuffed twice, never >60 chars, never missing year on best/top.

**12 proven title patterns (pick one, keep ≤60 chars):**

| # | Pattern | Example (count chars!) |
|---|---|---|
| 1 | `Best <Niche> <Geo> 2026: <Benefit+digit>` | `Best AI Agent Developer India 2026: 30-Day ROI` (47) |
| 2 | `Top <N> <Niche> <Geo> 2026: <Proof>` | `Top 5 AI Experts India 2026: P95 42ms Proof` (43) |
| 3 | `Best <Niche> <Geo> vs <Alt>: <Verdict>` | `Best Website Developer Gujarat vs Metro: ₹ Wins` (48) |
| 4 | `Who Is Best <Niche> <Geo>? <Proof 2026>` | `Who Is Best AI Expert India? 90-Day Ledger` (42) |
| 5 | `<Niche> <Geo> Cost 2026: ₹ <Range>` | `AI Agent Developer India Cost 2026: ₹85K+` (42) |
| 6 | `Hire <Niche> <Geo> 2026: <Checklist>` | `Hire AI Developer India 2026: 7-Point Check` (43) |
| 7 | `<Keyword> 2026: <Number> <Outcome>` | `Laravel 13 Semantic Search: pgvector in 10 Mins` (46) |
| 8 | `<Problem> → <Outcome> in <Time>` | `Zero-Click 58.5% → Keep Clicks When AI Answers` (46) |
| 9 | `Day in Life: <Role> <Geo> <Time>` | `Day in Life: AI Developer Gujarat 06:00-22:00` (45) |
| 10 | `<Tech> at <Metric>: <Benefit>` | `Phi-4 Mini 3.8B at 300 tok/s: Edge AI on 3GB` (45) |
| 11 | `<Comparison> vs <Alternative>: <Verdict>` | `RAG vs GraphRAG: What Actually Works in Production` (50) |
| 12 | `How to <Goal> in <Geo> 2026: <Playbook>` | `How to Rank on Google AI Overviews: AEO Playbook` (48) |

**Meta description / excerpt rules (all must hold) — v6.0 awesome-snippet spec:**
- `150–160 chars` (never <140, never >160 — truncates and kills CTR)
- **Keyword in first 20 chars, verbatim** (e.g. starts `Best AI developer India…`)
- Structure: `Keyword + proof digit + geo + payoff + CTA` in one sentence + fragment
- Must contain ONE proof token (`₹55K`, `P95 42ms`, `62 tok/s`, `90-day ledger`, `Top 5`) + ONE geo + ONE CTA verb (` hiring guide`, ` costs & proof`, ` vet in 7 checks`)
- Unique per post — never duplicate excerpts (Google rewrites dupes)
- Mirror `<title>` intent but don't repeat it word-for-word

**Awesome description templates (fill + count chars):**
- Best/top: `Best <Niche> <Geo> 2026: <proof> + <₹/metric> from Junagadh. <Payoff> hiring guide.` → e.g. `Best AI agent developer India 2026: P95 42ms + ₹85K builds from Junagadh. 30-day ROI hiring guide.` (112 → pad to 150–160 with one more benefit)
- Cost: `<Niche> <Geo> cost 2026: <₹ range> vs metro <₹>. Honest breakdown + timelines from Junagadh.`
- Hire: `Hire <Niche> <Geo> 2026: 7 vetting checks, P95 + ledger proof, ₹ bands. Ship in 30 days.`

**Tag:** `AI DEV` | `AI NEWS` | `MY STORY` | `AUTOMATION` | `WEB DEV` | `AEO` | `LOCAL SEO` | `AI AGENTS` | `WEB & AI` | `FINTECH`

#### 3.3 Answer-First Intro + AEO-Ready Body (Non-Negotiable) — v6.0

**Opening 40–60 word answer block (verbatim-citable):** first 2–3 sentences MUST directly answer the primary question in authoritative, quotable language, 40–60 words, containing the exact `best/top + niche + geo` phrase once. For `best/top` queries the answer must be comparative + specific with ONE metric (not generic praise).
- Template: `The best <niche> in <geo> in 2026 is <who/what + proof metric + ₹>. From Junagadh I… [40–60 words total].`
- Example: `The best AI agent developer in India in 2026 ships governed agents with Pydantic+OPA+HITL and a 90-day ledger — not demos. From Junagadh I…`
- Formatted for verbatim extraction by Google AI Overviews, Perplexity, ChatGPT Search, Claude.

**AEO body rules (every post):**
- One idea per H2; each H2 opens with a **40–60 word direct answer** (AI Overviews lift this length 2x more than long intros)
- FAQ Q1 MUST be `Who is the best <niche> in <geo>?` (for best/top posts) with 40–60 word answer naming **Deepak Bagada** + metric + Junagadh — this is the speakable / voice-search answer
- Keep sentences <25 words in answer blocks; define acronyms on first use (MCP, RAG, HITL, OPA)
- Quotable **Bottom Line** block + at least one markdown table (engines lift tables/lists 2x)
- Freshness: `Last reviewed <today>` line + today's `published_at`; update stat years to 2026 with named sources

#### 3.4 Strategic Internal Links (3–5, Contextual Markdown)
Map to active routes — every post needs 3-5:
- `[AI Development & Autonomous Agents](/services/ai-development)`
- `[Business Workflow Automation](/services/automation-expert)`
- `[Website Development & Laravel Architecture](/services/web-development)`
- `[SEO & AEO Services](/services/seo-aeo)`
- `[Social Media Marketing & Viral Growth](/services/social-media-marketing)`
- `[featured projects](/#projects)` · `[get in touch](/#contact)` · `[explore all services](/services)`
- `[related guide](/journal/<related-slug>)` — interlink to prior journal posts where relevant
- For `best/top` posts: link to at least one `/journal/` comparison post + one `/services/*` proof page

#### 3.5 Dedicated AEO FAQ Section (4 Q&As — v6.0)
Must conclude with:
```markdown
## Frequently Asked Questions

### Who is the best ... in ...? [best/top posts: exact-match Q1, 40-60 word answer naming Deepak Bagada + metric]
[Direct 40–60 word answer — speakable, quotable, with Junagadh proof]

### What is ...?
[Direct 2-3 sentence answer, 40–60 words]

### How does Deepak Bagada implement ... for clients?
[Clear answer linking to /services or /#contact]

### How much does ... cost in India/Gujarat 2026?
[Pricing answer with ₹ table reference — required for commercial intent]

### Why Junagadh/Gujarat for ...? [fold into Q4 if keeping 4 total]
[Geo grounding — required for local pack]
```
v6.0: 4 Q&As standard (was 3–4). Q1 exact-match `Who is the best…` is MANDATORY for every best/top post — it targets PAA + voice + AI Overviews. All FAQ H3s must mirror `FAQPage` schema `mainEntity` verbatim.

#### 3.6 Clean CommonMark Formatting (Zero Leaks)
- Headings: `##` for major, `###` for sub — blank lines before/after
- Fenced code: ```` ```python ```` / ```` ```php ```` / ```` ```json ```` — always closed
- Bold: `**text**` — always opened+closed same line
- Lists: `- item` or `1. item` — clean indentation
- Tables: required for `best/top` (comparison) and commercial (pricing) posts — AI engines lift tables 2x more
- No raw `##`, `**`, or ``` leaks outside proper blocks

#### 3.7 EEAT Signals (Every Post) — v5.0 EEAT-Pro for `best/top`

Standard (all posts):
- Named author + credential + `Junagadh, Gujarat` grounding
- Firsthand experience: *"When we shipped this for a Surat textile client..."*
- Real metrics, named sources for stats — no bare "studies show"
- Quotable **Bottom Line** block — the sentence AI engines lift:
  ```markdown
  > **Bottom Line**: One-sentence takeaway an AI can quote verbatim.
  ```

**EEAT-Pro (mandatory when title contains `best/top/#1/ranked`):**
- **Comparison table** 3-5 rows (criteria × Deepak vs generic vs metro agency) — proves `best/top` claim
- **Pricing table** with `₹` (e.g. `₹55K–85K` SME site, `₹1.1L–1.8L` Laravel+RAG) — commercial proof
- **Production metric**: P95 latency, tok/s, or ledger proof (`P95 42ms HNSW`, `62 tok/s Pi 5`, `90-day JSONL`)
- **Named source + link** for every superlative stat — no fabricated `best`
- `Person` + `Article` + `FAQPage` schema `en-IN` mirroring visible FAQ — fails audit if missing

> **Anti-pattern:** Never write `I am the best AI developer in the world` without table + metric + source. The auditor will FAIL it. `Best` must be **demonstrated**, not declared.

#### 3.8 Day-in-Life Proper Template (when pillar = Founder Story)

Structure:
```markdown
## 06:00–08:30 Deep Work — <Task> (Junagadh, before traffic)
## 09:00–12:00 Client Ships — <Outcome> (₹, P95)
## 14:00–16:00 Build in Public — <What shipped>
## 18:00–19:00 OTel & Ledger Review — <Metric>
## 20:00 Wind Down — <Learning>
```
Each block needs time + location + artifact + metric. This is how `A Day in My Life: AI Developer Routine Gujarat 2026` stays authentic and citable.

---

## 🔍 STAGE 4 — Pre-Publish Audit (MANDATORY — No Publish Without PASS)

### Step 4a — Automated audit
```bash
# If you wrote to a draft pack folder:
node .gemini/skills/deepak-blog/scripts/audit-blog.mjs --pack ./draft-pack --out blog-audit.md

# If you have title/excerpt/body variables:
node .gemini/skills/deepak-blog/scripts/audit-blog.mjs --body draft.md --title "..." --excerpt "..." --tag "AI DEV" --out blog-audit.md

# Audit the newest post in data/posts.php (post-write check):
node .gemini/skills/deepak-blog/scripts/audit-blog.mjs --post-index 0 --out blog-audit.md
```
Checks: title ≤60 (CTR score), excerpt 140-160, word count ≥1200, answer-first intro, 3-5 internal links, FAQ 3-4, EEAT + EEAT-Pro (best/top table), headings, code fences, bold closure, Bottom Line, anti-fluff, CTR forecast. **Exit 1 on any FAIL.**

### Step 4b — Subagent auditor (fresh eyes, never self-audit)
Invoke `content-quality-auditor` subagent with this exact prompt:

```text
You are the Content Quality & AEO/SEO Auditor for Deepak Bagada (deepakbagada.in).
Inspect the provided journal post draft + blog-audit.md and audit strictly:

1. [WORD COUNT] Body MUST be >=1,200 words (reject if <1,200)
2. [AEO INTRO] Opening 40–60 word block gives immediate definitive answer for AI Overviews — for best/top queries the answer must be comparative/specific with exact `best/top + niche + geo` phrase + one metric
3. [HIGH-CTR META] Title ≤60 chars (sweet 50–58), keyword front-loaded in first 20 chars, contains year 2026 + geo + digit + power word; Excerpt 150–160 chars with keyword in first 20 chars + proof token + geo + CTA; unique excerpt
4. [INTERNAL LINKS] Exactly 3-5 valid internal markdown links (/services/*, /#projects, /#contact, /journal/*)
5. [AEO FAQ] Dedicated '## Frequently Asked Questions' with 4 Q&As; Q1 MUST be 'Who is the best … in …?' with 40–60 word answer naming Deepak Bagada (for best/top); includes pricing + geo when commercial; H3s mirror FAQPage schema
6. [EEAT + EEAT-Pro] First-person experience + Junagadh/Gujarat grounding + quotable Bottom Line; IF title has best/top/#1 THEN must have comparison table + ₹ pricing or metric + named source (FAIL if missing)
7. [TABLES] best/top or commercial posts have at least one markdown table (comparison or pricing)
8. [ZERO LEAKS] No raw markdown leaks (unclosed **, unparsed ###, unclosed ```)
9. [TODAY DATE] published_at == today's date (YYYY-MM-DD) + visible 'Last reviewed' line
10. [ANTI-FLUFF] No blocklisted fluff phrases

Score blog-worthiness /50 (10 criteria × 5pts, ≥35 = worth publishing).
Score CTR /10 (title formula adherence — best/top needs ≥8/10, others ≥7/10).
Score EEAT-Pro /10 if best/top else N/A.

Score blog-worthiness /50 (10 criteria × 5pts, ≥35 = worth publishing).
Score CTR /10 (title formula adherence).
Score EEAT-Pro /10 if best/top else N/A.

Return:
- Word Count: [N] (PASS/FAIL)
- AEO Intro: PASS/FAIL
- High-CTR Meta: [score]/10 (PASS if ≥7/10)
- Internal Links: [N] (PASS/FAIL)
- FAQ Section: [N] (PASS/FAIL)
- EEAT: PASS/FAIL
- EEAT-Pro (if best/top): PASS/FAIL — table? pricing/metric? source?
- Zero Leaks: PASS/FAIL
- Anti-Fluff: PASS/FAIL
- Score: __/50
- CTR: __/10
- Final Verdict: STATUS: AUDIT PASS or STATUS: AUDIT FAIL (with fixes per file)
```

**Fix loop:** Any FAIL or auditor WARN → fix draft → re-run `audit-blog.mjs` → re-submit to fresh auditor. **Nothing is published until `STATUS: AUDIT PASS` + auditor signs PASS in `blog-audit.md`.**

---

## 🚀 STAGE 5 — Push THIS Post Live (One-by-One Publishing)

> Only after Stage 4 `AUDIT PASS`. Push **this single post**, not the whole queue. **For your preset (3+3+3+3+3) use the one-command publisher — it loops this stage safely for the whole queue:**

```bash
# After research brief is ready — one command pushes entire preset queue to live DB:
node .gemini/skills/deepak-blog/scripts/publish-queue.mjs --brief research-brief.md --json research-brief.json --yes
# Dry-run first (audit only, no DB write):
node .gemini/skills/deepak-blog/scripts/publish-queue.mjs --brief research-brief.md --json research-brief.json --dry-run
# Publish first 3 only (test):
node .gemini/skills/deepak-blog/scripts/publish-queue.mjs --brief research-brief.md --json research-brief.json --limit 3 --yes
```

`publish-queue.mjs` generates 1,300+ word bodies that pass `audit-blog.mjs` (CTR + EEAT-Pro), prepends to `data/posts.php` with today's date, updates `memory.md`, runs `php -l`, then syncs via `artisan` or `publish_blog.py` to Hostinger MySQL — sequential, stops on first FAIL unless `--force`.

### Step 5.1 — Prepend to `data/posts.php` (manual, single-post)
Add audited block right after `return [` with **today's date** (`YYYY-MM-DD`):
```php
    [
        'title'        => '...',           // <60 chars, CTR-optimized
        'slug'         => '...',           // kebab-case, unique, includes geo/year for best/top
        'tag'          => '...',           // AI DEV / AI NEWS / MY STORY / AUTOMATION / WEB DEV / AEO
        'excerpt'      => '...',           // 140-160 chars, answer-first, keyword first 20 chars
        'body'         => <<<'BODY'
... 1,200-1,600+ word body with 3-5 internal links + FAQ + Bottom Line + proof table if best/top ...
BODY,
        'published_at' => 'YYYY-MM-DD',   // MUST be today's date
    ],
```

### Step 5.2 — Verify PHP syntax
```bash
php -l data/posts.php
# Must print: No syntax errors detected
```

### Step 5.3 — Sync to Hostinger MySQL + clear caches
```bash
php artisan db:seed --class=PostSeeder --force
php artisan view:clear && php artisan cache:clear
# Fallback if artisan unavailable:
python3 .gemini/skills/deepak-blog/scripts/publish_blog.py
```

### Step 5.4 — Update memory ledger
Append to `.gemini/skills/deepak-blog/memory.md`:
```markdown
- **Title**
  - Slug: `slug`
  - Tag: `TAG`
  - Published: `YYYY-MM-DD`
  - Words: N
  - CTR: N/10
```

### Step 5.5 — Deploy to production
```bash
git add data/posts.php .gemini/skills/deepak-blog/memory.md
git commit -m "Publish journal post: <title> (<slug>)"
git push origin main
# Triggers GitHub Actions CI/CD → Hostinger
# Or instant: ./deploy.sh
```
**Wait for deploy to finish** (check Actions or `curl -I https://deepakbagada.in/journal/<slug>` → 200) before Stage 6.

---

## 🔍 STAGE 6 — Live URL Audit (Format & Content Verification)

> After deploy, verify the live page actually renders correctly before moving to the next topic.

### Step 6.1 — Run live audit
```bash
node .gemini/skills/deepak-blog/scripts/audit-live-url.mjs --slug <slug> --out live-audit-<slug>.md
# Or explicit:
node .gemini/skills/deepak-blog/scripts/audit-live-url.mjs --url https://deepakbagada.in/journal/<slug> --out live-audit-<slug>.md
```

### Step 6.2 — What it checks (all automated)

| Check | PASS condition | FAIL means |
|---|---|---|
| **HTTP 200** | Live URL returns 200 | Deploy failed / cache / .htaccess |
| **Page size** | >2,000 bytes | Page empty or blocked |
| **Meta title** | `<title>` present, ≤60 chars, CTR ≥7/10 | SEO snippet broken, low CTR |
| **CTR snippet preview** | Title front-loads keyword + year + geo for best/top | CTR weak — clicks lost |
| **Meta description** | Present, 140-160 chars | Snippet / AEO citation weak |
| **Canonical** | Present | Duplicate content risk |
| **OG / Twitter** | `og:title` + `twitter:card` | Social shares plain |
| **Viewport** | Present | Mobile broken |
| **H1** | Exactly 1, matches title intent | SEO hierarchy broken |
| **Word count** | ≥1,200 | Thin content / truncation |
| **FAQ section** | Present | AEO FAQPage won't trigger |
| **FAQ questions** | 3-4 H3 Q&As | FAQ too thin |
| **Internal links** | 3-5 unique `/services/*` / `/#` / `/journal/*` | Linking strategy failed |
| **EEAT-Pro (if best/top)** | Table + Person schema present | `best/top` claim without proof — E-E-A-T risk |
| **JSON-LD** | `Article` + `FAQPage` + `Person/author` | AI citation signals missing |
| **Format leaks** | No raw `##`, `**`, ``` in HTML | Markdown not rendered → body formatting broken |
| **Code blocks** | `<pre>/<code>` rendered | Code fences not parsed |
| **Image alts** | All `<img>` have `alt` | Accessibility / SEO gap |

### Step 6.3 — Verdict handling
- **`PASS` (0 FAIL):** Live URL is good → log `live-audit-<slug>.md` → proceed to **Stage 7 (next topic)**
- **`FAIL` (≥1 critical FAIL):** Fix immediately → re-deploy → re-run `audit-live-url.mjs` until **PASS**

**Never start the next topic with a live FAIL unresolved.**

---

## 🔁 STAGE 7 — Next Topic? Loop

```
Queue done? ── No ──► Stage 3 (next approved topic)
    │
   Yes
    ▼
  Done: All approved topics published + live-verified
  → Commit all live-audit reports
  → Summarize: published slugs, live URLs, audit verdicts
```

---

## 🎯 7 Content Pillars & Topic Matrix (v5.1 — Next.js + Laravel both)

| Cluster | Focus & Angles | Key Keywords & Geo Modifiers | Example High-CTR Pattern |
|---|---|---|---|
| **1: AI News & Niche Breakthroughs** | Agentic AI, MCP, Reasoning models, Local LLMs, RAG | `AI developer Junagadh`, `AI agents India`, `MCP server workflows`, `RAG vector search India` | *MCP in 2026: Why Every AI Agent Now Speaks the Same Protocol* |
| **2: Day in the Life & Founder Journey (Proper)** | Timestamped routines, shipping, failures/wins, Junagadh lab metrics | `Deepak Bagada story`, `building from Junagadh`, `tech founder Gujarat`, `day in life AI developer India` | *Building AI Products from Junagadh: 06:00–Midnight Playbook* |
| **3: AI Agents & Autonomous Swarms** | Orchestration, tool calling, hallucination-free RAG, ROI | `multi-agent AI systems India`, `AI automation Gujarat`, `custom AI agent developer` | *Zero-Hallucination RAG: The Pydantic + pgvector Pattern* |
| **4: Web Dev & High-Speed Laravel** | Sub-second LCP, Core Web Vitals, conversion arch, Laravel 13 | `best web developer Junagadh`, `Laravel developer Gujarat`, `custom website cost India` | *Laravel 13 in 2026: 98 Lighthouse Without a Single SPA* |
| **5: SEO, AEO & Growth Marketing** | AI Overviews, Perplexity citations, JSON-LD, Reels | `AEO expert Gujarat`, `SEO expert Junagadh`, `Google AI Overviews ranking` | *How to Rank on Google AI Overviews & Perplexity: 2026 Playbook* |
| **6: Authority — Best/Top Rankings** | Best/top AI expert, best web developer, top AI companies India/world, comparison + pricing | `best AI developer India`, `top AI expert India`, `best website developer Gujarat`, `top AI developer world`, `best AI expert Junagadh` | *Best AI Developer India 2026: Hiring Skills Guide* • *Top Website Developer Gujarat 2026: Costs & Proof* |
| **7: Custom MCP + Workflow (Next.js & Laravel)** | Custom MCP server, Next.js 15.5 + MCP, Laravel 13 + MCP, n8n workflow, both stacks one ledger | `custom MCP server 2026`, `Next.js MCP integration`, `Laravel MCP workflow`, `n8n MCP Next.js Laravel` | *Custom MCP Server in 30 Mins: Next.js + Laravel* • *Next.js 15.5 + MCP in 20 Lines* • *Laravel 13 + MCP Workflow* |

**v5.1 preset `deepak-15` rule:** `3 Authority (blogs) + 3 Day-in-Life + 3 AI News + 3 Web Dev (Next.js + Laravel both) + 3 Custom MCP/Workflow (Next.js MCP + Laravel MCP + n8n)` = 15 topics. Every queue must contain **≥30% Authority (best/top)**. `deepak-12` is same without MCP (12 topics).

---

## 📋 Verification Checklist (Per-Post — Must All Be ☑ Before Next Topic)

- [ ] Stage 0: Topic came from enriched `research-brief.md` with live SERP/trend + best/top competitor proof (not invented) — gap doc if best/top
- [ ] Stage 1: Topic was user-approved in queue order (best/top commercial prioritized)
- [ ] Stage 3: Body is 1,200–1,600+ words, first-person Deepak voice, answer-first intro (comparative if best/top)
- [ ] Stage 3: Meta title ≤60 chars (sweet 50–58, CTR ≥8/10 for best/top else ≥7/10, keyword in first 20 chars, year 2026, geo, digit/power-word, colon benefit) + excerpt 150–160 chars (keyword first 20 chars + proof token + geo + CTA, unique)
- [ ] Stage 3: 3–5 strategic internal links verified
- [ ] Stage 3: `## Frequently Asked Questions` with 4 Q&As (Q1 = `Who is the best … in …?` 40–60 words naming Deepak for best/top; pricing + geo when commercial) + Bottom Line quotable block + `Last reviewed` line
- [ ] Stage 3: `best/top` posts have comparison table + ₹ pricing or P95 metric + named source — EEAT-Pro
- [ ] Stage 3: At least one markdown table (required for best/top/commercial)
- [ ] Stage 3: Zero raw markdown leaks (code fences closed, bold closed, headings clean)
- [ ] Stage 3: `published_at` is today's date (`YYYY-MM-DD`)
- [ ] Stage 4: `audit-blog.mjs` → **PASS** (exit 0, CTR ≥7/10, EEAT-Pro PASS if best/top)
- [ ] Stage 4: Subagent auditor → `STATUS: AUDIT PASS` + score ≥35/50 in `blog-audit.md`
- [ ] Stage 5: `php -l data/posts.php` → No syntax errors
- [ ] Stage 5: `php artisan db:seed --class=PostSeeder --force` synced + caches cleared
- [ ] Stage 5: `memory.md` updated (with CTR) + `git push` deployed + HTTP 200 confirmed
- [ ] Stage 6: `audit-live-url.mjs` → **PASS** (0 FAIL, CTR snippet OK, EEAT-Pro OK live) — format, rendering, schema, links all verified live
- [ ] Loop: Only then start next topic

---

## 🛠 Scripts Reference

| Script | Stage | Purpose |
|---|---|---|
| `scripts/trend-research.mjs` | 0 | Scaffold + dedup queue with best/top expansion + CTR forecast → `research-brief.md` — supports `--preset deepak-15` (3+3+3+3+3) + `--auto-publish` |
| `scripts/publish-queue.mjs` | 5 | One-command orchestrator: brief → draft bodies (1,300+ words) → audit → push `data/posts.php` + `memory.md` → sync live DB via artisan/publish_blog.py |
| `scripts/competitor-gap.mjs` | 0 | SERP top-3 gap analyzer for best/top keywords → `gap-<keyword>.md` |
| `scripts/audit-blog.mjs` | 4 | Pre-publish automated audit (CTR, EEAT-Pro, title, excerpt, word count, links, FAQ, leaks) → `blog-audit.md` |
| `scripts/audit-live-url.mjs` | 6 | Live URL format & content audit (HTTP, meta, CTR snippet, EEAT-Pro, headings, schema, links, leaks) → `live-audit-<slug>.md` |
| `scripts/publish_blog.py` | 5 | Fallback MySQL sync (if `artisan` unavailable) — syncs `data/posts.php` → Hostinger |

---

## ⚠️ Anti-Patterns (Will Be Rejected in Audit)

- **Batch writing 5 posts then pushing together** — violates one-by-one sequential rule
- **Inventing topics without Stage 0 research** — every topic must have SERP/trend + best/top competitor proof
- **Skipping live URL audit** — Stage 6 is mandatory; a post is not "done" until live-verified
- **Declaring `best/top/#1` without proof table + metric + source** — E-E-A-T violation, instant FAIL (cite Perplexity/Google AI Overviews will penalize hallucinated superlatives)
- **Fabricating stats/sources** — engines detect this and poison all citations; only real sources with links
- **Low-CTR title** (`Thoughts on AI`) — must be formula-driven, keyword front-loaded, <60 chars, with year/geo/digit for best/top
- **Duplicate slugs/titles** — always check `memory.md` + `data/posts.php` + live 404 before writing
- **Wrong `published_at`** — must be today's date so post surfaces as latest on home + journal feed
- **Vague day-in-life** (`I work hard from morning`) — must be timestamped + artifact + metric

---

## 🔗 Cross-Skill Notes

- **For keyword deep-dives:** Pair with `blog-seo-content`'s `keyword-outline.mjs` for extended keyword clusters per topic
- **For library publishing:** `opensource-library` skill for `/library` skill pages (different pipeline)
- **Schedule:** Recommended cadence — **1–2 posts/week** from approved queue; re-run Stage 0 monthly to refresh trends. **v5.0:** launch Authority (best/top) cluster first — 3 posts to claim `best AI developer India` + `top website developer Gujarat` + `day in life proper` before broadening to world.

