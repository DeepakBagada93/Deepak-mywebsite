---
name: deepak-blog
description: >
  End-to-end SEO & AEO journal pipeline for Deepak Bagada (deepakbagada.in) — viral/trending research
  → scored topic queue → sequential one-by-one writing (1,200-1,600 words, high-EEAT, AEO answer-first,
  meta title/description, 3-5 internal links, 3-4 FAQ) → pre-publish audit → push one-by-one to
  data/posts.php + Hostinger MySQL → live URL format & content audit. Anti-duplication via memory.md,
  current-date publishing, dual-publish + deploy, and closed-loop live verification before next topic.
---

# 🚀 Deepak Bagada SEO & AEO Journal Pipeline (`deepak-blog` v4.0)

> **One-by-one, research → write → audit → push → verify.** No batch dumps. Every post is individually
> researched for viral/trending demand, written to high-EEAT/AEO standards, audited, pushed live, and
> **live-URL audited for format correctness** before the next topic starts.

This skill builds **1,200–1,600+ word**, deeply authentic, search- and AEO-optimized journal posts for
**Deepak Bagada** — *Leading AI Expert, AI Agent Architect, Web Developer & Marketing Automation Specialist,
founder of SaaS Next, builder of Curro, based in Junagadh, Gujarat, India*.

---

## 🔄 Pipeline Overview (7 Stages — Sequential, One-by-One)

```
Stage 0  Viral & Trending Research  ─┐
Stage 1  Scored Queue + Approval     ─┤  One queue, user approves which topics go live
         ┌───────────────────────────┘
         ▼
Stage 2  Sequential Write Loop (ONE BY ONE)
  ┌─► Stage 3  Write 1 post (EEAT + AEO + meta + links + FAQ)
  │   Stage 4  Pre-publish audit (audit-blog.mjs + subagent → PASS)
  │   Stage 5  Push THIS post → data/posts.php + MySQL + deploy
  │   Stage 6  Live URL audit (audit-live-url.mjs → PASS, format OK)
  └── Stage 7  Next topic? → loop back to Stage 3 until queue done
```

**Critical rule:** Never write/push multiple posts in parallel. Each topic completes **Stages 3→6 fully**
before the next topic starts. This is how you guarantee quality, correct formatting, and live verification.

---

## 🧠 STAGE 0 — Viral & Trending Research (MANDATORY FIRST STEP)

**Goal:** Find what your niche actually wants *right now*, not what you assume.

### Step 0.1 — Generate scaffold queue
```bash
# Research a single pillar:
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --niche "AI agents" --count 10 --out research-brief.md

# Research ALL 5 pillars at once:
node .gemini/skills/deepak-blog/scripts/trend-research.mjs --all --count 15 --out research-brief.md --json research-brief.json
```

### Step 0.2 — Enrich with REAL live research (agent does this, not the script)
For **each** scaffold topic, run live research and replace placeholder signals:

| Signal | How to verify |
|---|---|
| **SERP top-10** | `web_search "<keyword> 2026"` + `web_fetch` top 3 results — note titles, angles, gaps |
| **People-Also-Ask** | `web_search "<keyword> questions"` — collect 3-4 PAA questions |
| **Trend momentum** | Google Trends (30/90d), `web_search "<keyword> trending 2026"` |
| **Social viral** | `web_search "<keyword> site:twitter.com OR site:linkedin.com OR site:youtube.com"` — impressions/views |
| **Community heat** | Hacker News / Reddit / Perplexity trending queries |
| **Competition gap** | What do existing top results miss? Your unique angle (first-person, Junagadh, production code) |

### Step 0.3 — Re-score & re-rank (0–100)
```
Trend momentum (0-30) + Search intent value (0-30) + AEO citation potential (0-20) + Competition gap (0-20) = /100
```
Re-rank queue descending by final score. Cross-check every slug:
- Against `memory.md` + `data/posts.php` (already deduped by script)
- **Live check:** `https://deepakbagada.in/journal/<slug>` must return **404** (not already live with different storage)

### Output: `research-brief.md` (enriched)
Contains ranked queue with per-topic: pillar, primary keyword, intent, viral proof (with URLs), competition gap, suggested Deepak angle, internal link targets, final score.

---

## ✅ STAGE 1 — Scored Queue + User Approval Gate

**Stop and present `research-brief.md` to the user.** Do not write a single word until approved.

User ticks **Approved? ☑/☐** per topic. Only `Approved = Yes` topics enter Stage 2.
Rejected topics stay in the file as audit trail.

**Approval format:**
```
1. Title — Approved ☑  (or ☐ skip)
2. Title — Approved ☐
...
```

Once approved, you have your **sequential queue** — e.g., 5 approved topics ranked 1→5.

---

## ✍️ STAGE 2+3 — Sequential Writing Loop (ONE BY ONE)

> **Loop invariant:** One topic at a time. Complete Stages 3→6 for topic N before touching topic N+1.

### Stage 3 — Write ONE Post (High-EEAT, AEO-Optimized)

Pick the **next approved topic** in rank order. Write strictly to these standards:

#### 3.1 Word Count & Voice
- **1,200–1,600+ words** — comprehensive, actionable, with real numbers + code/architecture snippets
- **First-person Deepak voice:** *"founder of SaaS Next, builder of Curro, AI agent developer in Junagadh, Gujarat"* — zero generic filler/AI fluff

#### 3.2 High-CTR Meta (Title + Excerpt)
- **Title:** `<60 chars`, curiosity gap, power keyword, geo angle, year `2026`
- **Excerpt / Meta Description:** `140–160 chars`, answer-first summary for Google snippets + AI citation
- **Tag:** `AI DEV` | `AI NEWS` | `MY STORY` | `AUTOMATION` | `WEB DEV` | `AEO` | `LOCAL SEO` | `AI AGENTS` | `WEB & AI`

#### 3.3 Answer-First Intro (AEO Core Trigger — Non-Negotiable)
Opening **2–3 sentences MUST directly answer** the primary question in authoritative, quotable language.
Formatted for verbatim extraction by Google AI Overviews, Perplexity, ChatGPT Search, Claude.

#### 3.4 Strategic Internal Links (3–5, Contextual Markdown)
Map to active routes — every post needs 3–5:
- `[AI Development & Autonomous Agents](/services/ai-development)`
- `[Business Workflow Automation](/services/automation-expert)`
- `[Website Development & Laravel Architecture](/services/web-development)`
- `[SEO & AEO Services](/services/seo-aeo)`
- `[Social Media Marketing & Viral Growth](/services/social-media-marketing)`
- `[featured projects](/#projects)` · `[get in touch](/#contact)` · `[explore all services](/services)`
- `[related guide](/journal/<related-slug>)` — interlink to prior journal posts where relevant

#### 3.5 Dedicated AEO FAQ Section (3–4 Q&As)
Must conclude with:
```markdown
## Frequently Asked Questions

### What is ...?
[Direct 2-3 sentence answer]

### How does Deepak Bagada implement ... for clients?
[Clear answer linking to /services or /#contact]

### ... (3rd and 4th Q)
```

#### 3.6 Clean CommonMark Formatting (Zero Leaks)
- Headings: `##` for major, `###` for sub — blank lines before/after
- Fenced code: ```` ```python ```` / ```` ```php ```` / ```` ```json ```` — always closed
- Bold: `**text**` — always opened+closed same line
- Lists: `- item` or `1. item` — clean indentation
- No raw `##`, `**`, or ``` leaks outside proper blocks

#### 3.7 EEAT Signals (Every Post)
- Named author + credential + `Junagadh, Gujarat` grounding
- Firsthand experience: *"When we shipped this for a Surat textile client..."*
- Real metrics, named sources for stats — no bare "studies show"
- Quotable **Bottom Line** block — the sentence AI engines lift:
  ```markdown
  > **Bottom Line**: One-sentence takeaway an AI can quote verbatim.
  ```

---

## 🔍 STAGE 4 — Pre-Publish Audit (MANDATORY — No Publish Without PASS)

### Step 4a — Automated audit
```bash
# If you wrote to a draft pack folder:
node .gemini/skills/deepak-blog/scripts/audit-blog.mjs --pack ./draft-pack --out blog-audit.md

# If you have title/excerpt/body variables:
node .gemini/skills/deepak-blog/scripts/audit-blog.mjs --body draft.md --title "..." --excerpt "..." --out blog-audit.md

# Audit the newest post in data/posts.php (post-write check):
node .gemini/skills/deepak-blog/scripts/audit-blog.mjs --post-index 0 --out blog-audit.md
```
Checks: title ≤60, excerpt 140-160, word count ≥1200, answer-first intro, 3-5 internal links, FAQ 3-4, EEAT signals, headings, code fences, bold closure, Bottom Line, anti-fluff. **Exit 1 on any FAIL.**

### Step 4b — Subagent auditor (fresh eyes, never self-audit)
Invoke `content-quality-auditor` subagent with this exact prompt:

```text
You are the Content Quality & AEO/SEO Auditor for Deepak Bagada (deepakbagada.in).
Inspect the provided journal post draft + blog-audit.md and audit strictly:

1. [WORD COUNT] Body MUST be >=1,200 words (reject if <1,200)
2. [AEO INTRO] Opening 2-3 sentences provide immediate definitive answer for AI Overviews
3. [INTERNAL LINKS] Exactly 3-5 valid internal markdown links (/services/*, /#projects, /#contact, /journal/*)
4. [AEO FAQ] Dedicated '## Frequently Asked Questions' with 3-4 high-intent Q&As
5. [META TAGS] Title <60 chars (high CTR, year 2026), Excerpt 140-160 chars (answer-first)
6. [ZERO LEAKS] No raw markdown leaks (unclosed **, unparsed ###, unclosed ```)
7. [TODAY DATE] published_at == today's date (YYYY-MM-DD)
8. [EEAT] First-person experience + Junagadh/Gujarat grounding + quotable Bottom Line

Score blog-worthiness /50 (10 criteria × 5pts, ≥35 = worth publishing).

Return:
- Word Count: [N] (PASS/FAIL)
- AEO Intro: PASS/FAIL
- Internal Links: [N] (PASS/FAIL)
- FAQ Section: [N] (PASS/FAIL)
- Meta Tags: PASS/FAIL
- Zero Symbol Leaks: PASS/FAIL
- Today's Date: PASS/FAIL
- EEAT: PASS/FAIL
- Score: __/50
- Final Verdict: STATUS: AUDIT PASS or STATUS: AUDIT FAIL (with fixes per file)
```

**Fix loop:** Any FAIL or auditor WARN → fix draft → re-run `audit-blog.mjs` → re-submit to fresh auditor. **Nothing is published until `STATUS: AUDIT PASS` + auditor signs PASS in `blog-audit.md`.**

---

## 🚀 STAGE 5 — Push THIS Post Live (One-by-One Publishing)

> Only after Stage 4 `AUDIT PASS`. Push **this single post**, not the whole queue.

### Step 5.1 — Prepend to `data/posts.php`
Add audited block right after `return [` with **today's date** (`YYYY-MM-DD`):
```php
    [
        'title'        => '...',           // <60 chars
        'slug'         => '...',           // kebab-case, unique
        'tag'          => '...',           // AI DEV / AI NEWS / MY STORY / AUTOMATION / WEB DEV / AEO
        'excerpt'      => '...',           // 140-160 chars
        'body'         => <<<'BODY'
... 1,200-1,600+ word body with 3-5 internal links + FAQ + Bottom Line ...
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

> **This is the new v4.0 gate.** After deploy, verify the live page actually renders correctly before moving to the next topic.

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
| **Meta title** | `<title>` present, ≤60 chars | SEO snippet broken |
| **Meta description** | Present, 140-160 chars | Snippet / AEO citation weak |
| **Canonical** | Present | Duplicate content risk |
| **OG / Twitter** | `og:title` + `twitter:card` | Social shares plain |
| **Viewport** | Present | Mobile broken |
| **H1** | Exactly 1 | SEO hierarchy broken |
| **Word count** | ≥1,200 | Thin content / truncation |
| **FAQ section** | Present | AEO FAQPage won't trigger |
| **FAQ questions** | 3-4 H3 Q&As | FAQ too thin |
| **Internal links** | 3-5 unique `/services/*` / `/#` / `/journal/*` | Linking strategy failed |
| **JSON-LD** | `Article` + `FAQPage` + `Person/author` | AI citation signals missing |
| **Format leaks** | No raw `##`, `**`, ``` in HTML | Markdown not rendered → body formatting broken |
| **Code blocks** | `<pre>/<code>` rendered | Code fences not parsed |
| **Image alts** | All `<img>` have `alt` | Accessibility / SEO gap |

### Step 6.3 — Verdict handling
- **`PASS` (0 FAIL):** Live URL is good → log `live-audit-<slug>.md` → proceed to **Stage 7 (next topic)**
- **`FAIL` (≥1 critical FAIL):** Fix immediately:
  - Raw markdown leaks → fix `body` CommonMark + re-check journal rendering pipeline
  - Missing JSON-LD → verify `Article`/`FAQPage` schema in page template
  - HTTP ≠200 → check `deploy.sh` / GitHub Actions / Hostinger cache / `.htaccess`
  - Re-deploy → re-run `audit-live-url.mjs` until **PASS**

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

## 🎯 5 Content Pillars & Topic Matrix

| Cluster | Focus & Angles | Key Keywords & Geo Modifiers | Example High-CTR Pattern |
|---|---|---|---|
| **1: AI News & Niche Breakthroughs** | Agentic AI, MCP, Reasoning models, Local LLMs, RAG | `AI developer Junagadh`, `AI agents India`, `MCP server workflows`, `RAG vector search India` | *"MCP in 2026: Why Every AI Agent Now Speaks the Same Protocol"* |
| **2: Day in the Life & Founder Journey** | Building from Junagadh, routines, shipping, failures/wins | `Deepak Bagada story`, `building from Junagadh`, `tech founder Gujarat` | *"Building AI Products from Junagadh: The Playbook No One Talks About"* |
| **3: AI Agents & Autonomous Swarms** | Orchestration, tool calling, hallucination-free RAG, ROI | `multi-agent AI systems India`, `AI automation Gujarat`, `custom AI agent developer` | *"Zero-Hallucination RAG: The Pydantic + pgvector Pattern We Use"* |
| **4: Web Dev & High-Speed Laravel** | Sub-second LCP, Core Web Vitals, conversion arch, Laravel 13 | `best web developer Junagadh`, `Laravel developer Gujarat`, `custom website cost India` | *"Laravel 13 in 2026: 98 Lighthouse Without a Single SPA"* |
| **5: SEO, AEO & Growth Marketing** | AI Overviews, Perplexity citations, JSON-LD, Reels | `AEO expert Gujarat`, `SEO expert Junagadh`, `Google AI Overviews ranking` | *"How to Rank on Google AI Overviews & Perplexity: The 2026 AEO Playbook"* |

---

## 📋 Verification Checklist (Per-Post — Must All Be ☑ Before Next Topic)

- [ ] Stage 0: Topic came from enriched `research-brief.md` with live SERP/trend proof (not invented)
- [ ] Stage 1: Topic was user-approved in queue order
- [ ] Stage 3: Body is 1,200–1,600+ words, first-person Deepak voice, answer-first intro
- [ ] Stage 3: Meta title <60 chars (CTR, year 2026) + excerpt 140–160 chars (answer-first)
- [ ] Stage 3: 3–5 strategic internal links verified
- [ ] Stage 3: `## Frequently Asked Questions` with 3–4 Q&As + Bottom Line quotable block
- [ ] Stage 3: Zero raw markdown leaks (code fences closed, bold closed, headings clean)
- [ ] Stage 3: `published_at` is today's date (`YYYY-MM-DD`)
- [ ] Stage 4: `audit-blog.mjs` → **PASS** (exit 0)
- [ ] Stage 4: Subagent auditor → `STATUS: AUDIT PASS` + score ≥35/50 in `blog-audit.md`
- [ ] Stage 5: `php -l data/posts.php` → No syntax errors
- [ ] Stage 5: `php artisan db:seed --class=PostSeeder --force` synced + caches cleared
- [ ] Stage 5: `memory.md` updated + `git push` deployed + HTTP 200 confirmed
- [ ] Stage 6: `audit-live-url.mjs` → **PASS** (0 FAIL) — format, rendering, schema, links all verified live
- [ ] Loop: Only then start next topic

---

## 🛠 Scripts Reference

| Script | Stage | Purpose |
|---|---|---|
| `scripts/trend-research.mjs` | 0 | Scaffold + dedup queue; agent enriches with live viral/SERP research → `research-brief.md` |
| `scripts/audit-blog.mjs` | 4 | Pre-publish automated audit (title, excerpt, word count, links, FAQ, EEAT, leaks) → `blog-audit.md` |
| `scripts/audit-live-url.mjs` | 6 | Live URL format & content audit (HTTP, meta, headings, schema, links, leaks) → `live-audit-<slug>.md` |
| `scripts/publish_blog.py` | 5 | Fallback MySQL sync (if `artisan` unavailable) — syncs `data/posts.php` → Hostinger |

---

## ⚠️ Anti-Patterns (Will Be Rejected in Audit)

- **Batch writing 5 posts then pushing together** — violates one-by-one sequential rule
- **Inventing topics without Stage 0 research** — every topic must have SERP/trend proof
- **Skipping live URL audit** — Stage 6 is mandatory; a post is not "done" until live-verified
- **Fabricating stats/sources** — engines detect this and poison all citations; only real sources
- **Duplicate slugs/titles** — always check `memory.md` + `data/posts.php` + live 404 before writing
- **Wrong `published_at`** — must be today's date so post surfaces as latest on home + journal feed

---

## 🔗 Cross-Skill Notes

- **For keyword deep-dives:** Pair with `blog-seo-content`'s `keyword-outline.mjs` for extended keyword clusters per topic
- **For library publishing:** `opensource-library` skill for `/library` skill pages (different pipeline)
- **Schedule:** Recommended cadence — **1–2 posts/week** from approved queue; re-run Stage 0 monthly to refresh trends

