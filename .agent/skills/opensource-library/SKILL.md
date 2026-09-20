---
name: opensource-library
description: >
  Autonomous Rank-#1 Open-Source Hub & Architecture Publisher for Deepak Bagada (deepakbagada.in/library & /repos).
  Produces high-CTR, high-EEAT, 100% human-written, anti-AI fluff engineering content across 3 types:
  Skill Pages (agent architectures, MCP servers, automation workflows), Curated Great Repos (personal practitioner take),
  and Architecture Blueprints (SVG/Mermaid diagrams with trade-offs).
  Executes a strict 10-DISPATCH SEQUENTIAL ONE-BY-ONE loop (Search One → Anti-Duplication Pre-Check → Write One →
  Pre-Publish Audit → Direct Push to Live DB + Frontend data/library → Verify Live URL → Log Memory → Repeat 10x).
  Features high-converting symbols and brackets ([ ], ( ), :, |, —, //, $, %, →, &).
  ZERO git commits/pushes needed — content goes live instantly via remote MySQL database.
---

# 🏛️ Deepak Bagada Open-Source Library Engine (`opensource-library` v4.0)
### (10 Trending Open-Source Dispatches Loop · High-CTR Symbols Edition · Zero Git Push Needed)

> [!IMPORTANT]
> **CORE ARCHITECTURE: 10 TRENDING OPEN-SOURCE DISPATCHES — STRICT ONE-BY-ONE CLOSED LOOP**:
> When invoked, this skill executes a strict sequential loop across **10 trending open-source dispatches**:
> - **Flagship Skill Pages** (`/library/{slug}`): Full production documentation (1,200–2,000 words, architecture diagram, runnable code, audit score, trade-offs).
> - **Curated Repositories** (`/repos`): Vetted trending GitHub repositories (TopGit, GitHub Trending, Trendshift) with Deepak's personal engineer take, stars, and honest "When NOT to use it" section.
> - **Architecture Blueprints** (`/blueprints/{id}`): High-level system diagrams (Mermaid / SVG) with component trade-off matrices.
>
> **MANDATORY SEQUENTIAL FLOW (SEARCH 1 → WRITE 1 → AUDIT 1 → PUSH 1 → VERIFY LIVE URL 1 → LOG 1)**:
> **NEVER batch search, write, or push items in parallel**. Each item in the sequence must complete all stages before the next begins:
> - **Step 1 — Search Trending Repo/Skill**: Real-time research on GitHub Trending, TopGit, and tech forums for breakthrough AI libraries.
> - **Step 2 — Anti-Duplication & Live DB Pre-Check**: Run `php .agent/skills/opensource-library/scripts/check-collision.php "<Repo URL or Slug>"`. Prohibit duplicate numeric suffixes (`-[0-9]+` like `-2`, `-3` strictly banned; year `2026` allowed).
> - **Step 3 — Write 1 High-CTR Item Payload**: (Skill: 1,200–2,000 words, runnable code, Mermaid/SVG architecture, honest limits; Repo: personal take, trade-offs, stars, tags).
> - **Step 4 — Pre-Publish Audit**: Run `node .agent/skills/opensource-library/scripts/audit-library.mjs`.
> - **Step 5 — Direct Push to Live DB + Frontend**: Run `php .agent/skills/opensource-library/scripts/publish-single-item.php --json=item.json` to insert/upsert directly into Hostinger Live MySQL DB (`skills`, `curated_repos`, or `skill_architectures`), write local `data/library/` file, and clear cache.
> - **Step 6 — Live URL Quality Audit**: Script automatically verifies `https://deepakbagada.in/library/<slug>` or `/repos` for HTTP 200, title, meta description, rendered code/diagrams, and image alt tags.
> - **Step 7 — Log to `memory.md`**: Append title, slug/URL, stars, and published date.
> - **Step 8 — Advance to Next Item**: Proceed to the next item only after current is verified live.
> - **ZERO GIT PUSH NEEDED**: Publishing goes directly into the live database and updates local files. Zero git commits/pushes protects search engine indexing stability.

---

## 🎯 HIGH-CTR TITLE ENGINEERING WITH SYMBOLS & BRACKETS

All skill and blueprint titles MUST be engineered for maximum CTR using high-converting symbols:
* **Brackets & Tags**: `[2026]`, `[Playbook]`, `[Benchmark]`, `[Blueprint]`, `[Production Guide]`, `[Deep Dive]`
* **Parentheses (Metrics & Proof)**: `(Step-by-Step)`, `(30-Min Ship)`, `(P95 42ms)`, `(Full Code)`
* **Separators & Operators**: Colon `:`, Vertical pipe `|`, Em-dash `—`, `→`, `&`, `%`

**Examples**:
- `[Blueprint] MCP Agent Builder India 2026: 30-Min Ship (Full Code)`
- `Build an Enterprise PostgreSQL MCP Server for Claude & Cursor [Step-by-Step]`
- `[2026 Playbook] Stateful Swarm Orchestration: Self-Healing & Zero Leaks`

---

## ✍️ ANTI-AI SLOP & 100% HUMAN PRACTITIONER MANIFESTO
### (Zero AI Slop Guarantee · Defeating Google Core Updates & AI Detectors)

Every library skill page, curated repo, and architecture blueprint must read as genuine software engineering documentation written by a veteran developer:

### 1. 🚫 The 90+ Banned AI Slop & Buzzword Blacklist (Instant Audit FAIL)
Any occurrence of the following phrases triggers an **instant FAIL** during the pre-publish audit:
* **Banned Openers & Throat-Clearing**:
  - `In today's fast-paced world`, `In today's digital landscape`, `In today's fast-paced digital world`, `In today's modern world`
  - `In the fast-evolving world of`, `In the ever-evolving landscape`, `In the realm of`
  - `In this blog post, we will explore`, `In this article, we will delve`, `In this guide, we will`
  - `Let's dive in`, `Let's dive into`, `Have you ever wondered`, `As an AI language model`
  - `The world of AI is constantly changing`, `Imagine a world where`, `Gone are the days when`
  - `Fast-forward to today`, `Without further ado`, `It goes without saying`, `Needless to say`, `First and foremost`
* **Banned Hype Buzzwords & Clichés**:
  - `Delve into`, `Delving into`, `Unlock the power`, `Unlock the potential`, `Game-changer`, `Game-changing`
  - `Revolutionize`, `Revolutionizing`, `Skyrocket your`, `Tapestry`, `Rich tapestry`, `Nestled`, `Plethora`
  - `Embark on a journey`, `Cutting-edge solution`, `Cutting-edge`, `Leverage the power`, `Harness the power of`
  - `Harnessing the power`, `Testament to`, `A testament to`, `Beacon of`, `Beacon of hope`, `Pivotal role`, `Pivotal in`
  - `Navigating the landscape`, `A double-edged sword`, `Brimming with`, `Treasure trove`, `Demystifying`, `Demystify`
  - `Look no further`, `Revolutionary approach`, `Take a deep dive`, `Unleash the potential`, `Unleash the power`
  - `A holistic approach`, `Seamless integration`, `Seamlessly integrate`, `Seamlessly integrates`, `Paradigm shift`
  - `Supercharge`, `Unrivaled`, `Second to none`, `Groundbreaking solution`, `Unparalleled`, `Powerhouse of`
  - `Multifaceted`, `Paramount`, `Myriad of`, `An array of`, `Shines bright`, `Stands out as a shining example`
  - `Pushes the boundaries`, `At the forefront of innovation`, `At the forefront`, `State-of-the-art solution`
* **Banned Synthetic Transitions & Conclusions**:
  - `It's important to remember`, `It is worth noting`, `At its core`, `In essence`
  - `Moreover,`, `Furthermore,`, `In conclusion`, `To sum up`, `All in all`
  - `To wrap things up`, `To wrap up`, `In summary`, `Final thoughts`, `With that being said`, `That being said`
  - `On the other hand,`, `Last but not least`

### 2. 👨‍💻 Deepak Bagada Authentic Commentary & Lived Experience
* Ground every tool review and architecture in actual deployments from your Junagadh engineering lab (SaaS Next, Curro, Gujarat SME client systems).
* Cite exact token consumption, P95 latencies, Docker configurations, and memory metrics.

### 3. 📉 Honest Critical Limitations ("When NOT to Use This")
* Every skill page and curated repo MUST contain an explicit **"When NOT to Use This"** section highlighting trade-offs, overheads, and failure modes (e.g. *"Do not use this for workloads under 100 requests/day where a simple cron script is faster and cheaper"*).

### 4. 🖼️ Strict Image Alt Tag Protocol
* Every diagram, architecture graphic, or screenshot MUST have rich descriptive alt text (≥5 words). Empty or generic alt tags fail audit.

---

## 🔄 THE 10-ITEM ONE-BY-ONE EXECUTION LOOP

Run this strict closed loop for each of the 10 open-source items:

```
[For Item 1 to 10]
  │
  ├── 1. SEARCH: Real-time search for trending GitHub repos, MCP servers, agent tools
  │
  ├── 2. PRE-CHECK: Anti-duplication check against live DB & memory.md
  │      php .agent/skills/opensource-library/scripts/check-collision.php "<Repo URL or Slug>"
  │
  ├── 3. WRITE: Draft item payload (Skill page, Repo entry, or Blueprint)
  │
  ├── 4. PRE-AUDIT: Automated pre-publish audit
  │      node .agent/skills/opensource-library/scripts/audit-library.mjs
  │
  ├── 5. DIRECT PUSH: Insert into Live Hostinger MySQL DB + update data/library
  │      php .agent/skills/opensource-library/scripts/publish-single-item.php --json=item.json
  │      (Zero git push — live immediately!)
  │
  ├── 6. VERIFY LIVE URL: Automated audit of live URL
  │      node .agent/skills/opensource-library/scripts/audit-live-library.mjs --slug <slug>
  │
  ├── 7. LOG: Append published details to .agent/skills/opensource-library/memory.md
  │
  └── 8. NEXT: Only after 100% verified live, proceed to next item in sequence!
```

---

## 🛠 Script Directory Reference

All scripts are located in `.agent/skills/opensource-library/scripts/`:

| Script | Purpose |
|---|---|
| `scripts/publish-single-item.php` | Direct push of 1 skill, repo, or blueprint to Hostinger Live DB, updates `data/library/`, clears cache, audits live URL, and updates `memory.md` (Zero git push) |
| `scripts/check-collision.php` | Anti-duplication pre-check against live MySQL DB (`skills`, `curated_repos`) and `memory.md` |
| `scripts/sync.php` | Helper CLI for validation, audit, check-collision, and live verification |
| `scripts/audit-library.mjs` | Pre-publish automated audit (word count, alt tags, anti-fluff, architecture, syntax) |
| `scripts/audit-live-library.mjs` | Live URL audit (HTTP 200, title, meta description, code rendering, diagrams, alt tags) |

---

## 🚫 Strictly Enforced Anti-Patterns

- ❌ **No Git Pushes for Publishing**: Content is stored and served dynamically from the remote MySQL database. Running `git push` triggers redundant deployments.
- ❌ **No Batch Writing**: Must search, write, audit, push to DB, and verify live URL one item at a time.
- ❌ **No Numeric Suffix Slugs**: Slugs ending in `-2`, `-3`, `-v2` are banned.
- ❌ **No Generic Repo Descriptions**: Every repo entry must have Deepak's firsthand practitioner take explaining why he uses it in Junagadh and when NOT to use it.
- ❌ **No Missing Image Alt Tags**: Every diagram or screenshot must have rich descriptive alt text.