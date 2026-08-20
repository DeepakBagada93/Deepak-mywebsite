---
name: deepak-blog
description: >
  Autonomous SEO & AEO journal blog generator for Deepak Bagada (deepakbagada.in).
  Produces 1,200+ word in-depth articles across 5 pillars (AI News & Agents, Founder Stories,
  Web Dev, Automation, SEO/AEO). Enforces answer-first AEO intro, 3-5 strategic internal links,
  3-4 FAQ items, clean formatting (zero raw ## or ** symbol leaks), anti-duplication via memory.md,
  mandatory subagent content & SEO/AEO quality audit, and dual-publishing to local data/posts.php and Hostinger MySQL.
---

# 🚀 Deepak Bagada SEO & AEO Journal Creator Skill (`deepak-blog` v3.2)

This skill creates 1,200+ word, high-CTR, deeply authentic, and search-optimized journal posts for **Deepak Bagada** (Leading AI Expert, AI Agent Architect, Web Developer, and Marketing Automation Specialist based in Junagadh, Gujarat, India).

---

## 🧠 MANDATORY STEP 1: Anti-Duplication Check
Before selecting or drafting any topic:
1. **Read & Index**: Inspect `.gemini/skills/deepak-blog/memory.md` and `data/posts.php`.
2. **Deduplication Filter**: Reject any proposed topic, title, or slug that overlaps with existing records in `memory.md`.

---

## 🎯 5 Core Content Clusters & Topic Matrix

Select topics dynamically across these 5 core editorial pillars:

| Cluster | Focus & Angles | Key Keywords & Geo Modifiers | Example High-CTR Topic Pattern |
|---|---|---|---|
| **1: AI News & Niche Breakthroughs** | Agentic AI, MCP (Model Context Protocol), Reasoning models, Local LLMs, AI coding workflows, RAG techniques | `AI developer Junagadh`, `AI agents India`, `MCP server workflows`, `best AI expert Gujarat`, `RAG vector search India` | *"The 2026 AI Agent Revolution: How MCP & Autonomous Workflows Are Replacing Static SaaS"* |
| **2: Day in the Life & Founder Journey** | Real stories building from Junagadh, Gujarat; developer routines; shipping client projects; technical decisions; failures & wins | `Deepak Bagada story`, `building from Junagadh`, `tech founder Gujarat`, `Laravel developer journey` | *"A Day in My Life as an AI Developer in Junagadh: Routines, Agent Swarms & Lessons"* |
| **3: AI Agents & Autonomous Swarms** | Deep technical blueprints, multi-agent orchestration, tool calling, hallucination-free RAG, practical client ROI | `multi-agent AI systems India`, `AI automation Gujarat`, `custom AI agent developer`, `RAG knowledge base` | *"Building Autonomous AI Swarms for Indian Businesses: Architecture & Zero-Hallucination Guide"* |
| **4: Web Dev & High-Speed Laravel** | Sub-second load times, Core Web Vitals, conversion architecture, clean code vs bloated builders | `best web developer Junagadh`, `Laravel developer Gujarat`, `custom website cost India`, `speed optimization` | *"Why We Rebuilt Client Websites on Laravel 13: Sub-Second Speed & 3x Conversion Playbook"* |
| **5: SEO, AEO & Growth Marketing** | Google AI Overviews, Perplexity citations, structured JSON-LD schema, viral short-form Reels frameworks | `AEO expert Gujarat`, `SEO expert Junagadh`, `Google AI Overviews ranking`, `viral reels marketing India` | *"How to Rank on Google AI Overviews & ChatGPT Search (The Definitive AEO Guide for 2026)"* |

---

## ✍️ Strict Content, SEO & AEO Standards

Every post MUST strictly fulfill these quality standards:

### 1. Mandatory Word Count & Tone
- **Depth**: **Strictly 1,200 to 1,600+ words** with comprehensive explanations, actionable breakdowns, real-world numbers, and code/architecture snippets.
- **Voice**: Authentic first-person perspective of Deepak Bagada (*"founder of SaaS Next, builder of Curro, AI agent developer based in Junagadh, Gujarat"*). Zero generic filler or AI fluff.

### 2. High-CTR Meta Title & Description
- **Title**: Under 60 characters, high-CTR curiosity gap, includes power keywords, geographic angle, and year (`2026`).
- **Excerpt / Meta Description**: 140–160 characters, direct answer-first summary for Google snippets and AI search citation.
- **Tag**: `AI DEV`, `AI NEWS`, `MY STORY`, `AUTOMATION`, `WEB DEV`, `AEO`, or `LOCAL SEO`.

### 3. Answer-First Intro (AEO Core Trigger)
- The opening 2–3 sentences **MUST directly answer** the primary question/topic in clear, authoritative language.
- Formatted to be extracted verbatim by Google AI Overviews, Perplexity, Claude, and ChatGPT Search.

### 4. Mandatory Strategic Internal Links (3 to 5 Links)
Every post MUST include **3–5 contextual markdown links** mapped to active site routes:
- **AI Services**: `[AI Development & Autonomous Agents](/services/ai-development)`
- **Automation Services**: `[Business Workflow Automation](/services/automation-expert)`
- **Web Development**: `[Website Development & Laravel Architecture](/services/web-development)`
- **SEO / AEO Services**: `[SEO & AEO Services](/services/seo-aeo)`
- **Social Media Growth**: `[Social Media Marketing & Viral Growth](/services/social-media-marketing)`
- **Portfolio & Contact**: `[featured projects](/#projects)`, `[get in touch](/#contact)`, or `[explore all services](/services)`
- **Related Articles**: `[read our guide on multi-agent AI](/journal/building-multi-agent-ai-systems-indian-smes-2026)`

### 5. Dedicated AEO FAQ Section
Every post MUST conclude with a dedicated `## Frequently Asked Questions` block containing **3–4 high-intent Q&As** formatted for search engines:
```markdown
## Frequently Asked Questions

### What is the primary benefit of [Topic]?
[Direct, concise answer in 2-3 sentences]

### How does Deepak Bagada implement [Topic] for clients?
[Clear explanation linking to /services or /#contact]
```

### 6. Clean Formatting & Zero Raw Markdown Leaks
- **Headings**: Use `### Heading Text` with explicit double newlines (`\n\n`) before and after, or clean HTML `<h3>Heading Text</h3>`.
- **Inline Bold**: Ensure all bold tags `**text**` are properly opened and closed on the same line.
- **No Raw Symbol Leaks**: Zero stray `#`, `##`, `###`, or `**` in body paragraphs.
- **Lists**: Format lists as clean `- item` or `* item` on separate lines.

---

## 🔍 MANDATORY STEP 2: Subagent Content Quality & SEO/AEO Audit

Before writing to `data/posts.php`, invoke the **`content-quality-auditor`** subagent (or audit rigorously against this rubric):

### Subagent Audit Prompt / Instructions:
```text
You are the Content Quality & AEO/SEO Auditor for Deepak Bagada (deepakbagada.in).
Inspect the provided journal post draft and audit strictly against these criteria:

1. [WORD COUNT]: Count all words in the article body. It MUST be >= 1,200 words. (Reject if < 1,200 words).
2. [AEO INTRO]: Verify opening 2-3 sentences provide an immediate, definitive answer for Google AI Overviews.
3. [INTERNAL LINKS]: Verify exactly 3 to 5 valid internal markdown links are present (e.g. /services/ai-development, /services/web-development, /services/seo-aeo, /#projects, /#contact).
4. [AEO FAQ]: Verify dedicated '## Frequently Asked Questions' section with 3-4 high-intent Q&As.
5. [META TAGS]: Title < 60 chars (high CTR), Excerpt 140-160 chars (answer-first).
6. [ZERO SYMBOL LEAKS]: Confirm 0% raw unrendered markdown leaks (no unclosed **, no unparsed ###).

Return your structured report:
- Word Count: [Number] (PASS/FAIL)
- AEO Intro: PASS/FAIL
- Internal Links: [Count] (PASS/FAIL)
- FAQ Section: [Count] (PASS/FAIL)
- Meta Tags: PASS/FAIL
- Zero Symbol Leaks: PASS/FAIL
- Final Verdict: STATUS: AUDIT PASS or STATUS: AUDIT FAIL
```

---

## 🔄 Step 3: Dual Database Publishing & Deployment

### Step 3.1: Prepend Entry to `data/posts.php`
Add the audited post array block right after `return [` in `data/posts.php`:
```php
    [
        'title'        => '...',
        'slug'         => '...',
        'tag'          => '...',
        'excerpt'      => '...',
        'body'         => <<<'BODY'
...
BODY,
        'published_at' => 'YYYY-MM-DD',
    ],
```

### Step 3.2: Verify PHP Syntax
```bash
php -l data/posts.php
```

### Step 3.3: Sync to Remote Hostinger Database
Sync data to remote MySQL database:
```bash
php artisan db:seed --class=PostSeeder --force
```

### Step 3.4: Update Memory Ledger
Append the new post details (`Title`, `Slug`, `Tag`, `Published Date`) to `memory.md`.

### Step 3.5: Auto-Deploy to Production
Commit and push to GitHub (triggers GitHub Actions CI/CD to Hostinger):
```bash
git add . && git commit -m "Publish journal post: <title>" && git push origin main
```
*(Or run `./deploy.sh` for an instant 3-second terminal deployment).*

---

## 🎯 Verification Checklist
- [ ] Topic passed anti-duplication check against `memory.md`.
- [ ] Subagent content quality audit returned `STATUS: AUDIT PASS`.
- [ ] Word count strictly verified (**>= 1,200 words**).
- [ ] 3–5 strategic internal links are present and verified.
- [ ] 3–4 AEO FAQs are included.
- [ ] Zero raw markdown symbol leaks verified.
- [ ] `php -l data/posts.php` passes with zero errors.
- [ ] `php artisan db:seed --class=PostSeeder --force` synced successfully.
- [ ] `memory.md` updated.
- [ ] Deployed and verified live on `https://deepakbagada.in/journal/<slug>`.
