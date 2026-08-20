---
name: deepak-blog
description: >
  Autonomous SEO & AEO journal blog generator for Deepak Bagada (deepakbagada.in).
  Researches high-CTR trending topics in AI News & Agents, Day-in-the-Life Founder Stories,
  Web Dev, Automation, and SEO/AEO. Enforces 1,000+ words, answer-first AEO intro, 3-5 strategic
  internal links, 3-4 FAQ items, clean formatting (zero raw ## or ** symbol leaks), anti-duplication
  via memory.md, subagent content audit, and dual-publishing to local data/posts.php and Hostinger MySQL database.
---

# 🚀 Deepak Bagada SEO & AEO Journal Creator Skill (`deepak-blog` v3.1)

This skill creates high-CTR, deeply authentic, and search-optimized journal posts for **Deepak Bagada** (Leading AI Expert, AI Agent Architect, Web Developer, and Marketing Automation Specialist based in Junagadh, Gujarat, India).

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

## ✍️ Content, SEO & AEO Standards

Every post MUST strictly fulfill these quality standards:

### 1. Word Count & Tone
- **Depth**: **1,000 to 1,500+ words** of practical, high-value, and actionable content.
- **Voice**: Authentic first-person perspective of Deepak Bagada (*"founder of SaaS Next, builder of Curro, AI agent developer based in Junagadh, Gujarat"*). Zero generic filler or AI fluff.

### 2. High-CTR Meta Title & Description
- **Title**: Under 60 characters, high-CTR curiosity gap, includes power keywords and year (`2026`).
- **Excerpt / Meta Description**: 140–160 characters, direct answer-first summary for search snippets and AI citation.
- **Tag**: `AI DEV`, `AI NEWS`, `MY STORY`, `AUTOMATION`, `WEB DEV`, `AEO`, or `LOCAL SEO`.

### 3. Answer-First Intro (AEO Core Trigger)
- The opening 2–3 sentences **MUST directly answer** the primary question/topic in clear, authoritative language.
- Engineered specifically for quotation in Google AI Overviews, Perplexity, Claude, and ChatGPT Search.

### 4. Mandatory Strategic Internal Links (3 to 5 Links)
Every post MUST include 3–5 contextual markdown links mapped to:
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
To ensure flawless rendering across frontend Blade templates:
- **Headings**: Either use `### Heading Text` with explicit double newlines (`\n\n`) before and after, or use clean HTML `<h3>Heading Text</h3>`.
- **Inline Bold**: Ensure all bold tags `**text**` are properly opened and closed on the same line.
- **No Raw Symbol Leaks**: Never leave loose `#`, `##`, `###`, or `**` in body paragraphs.
- **Lists**: Format lists as clean `- item` or `* item` on separate lines.

---

## 🔍 MANDATORY STEP 2: Content & SEO Subagent Audit

Before updating any files, invoke or execute a comprehensive content audit:
- [ ] Word count verified (>= 1,000 words).
- [ ] Meta Title verified (< 60 chars, high-CTR).
- [ ] Excerpt verified (140–160 chars, answer-first).
- [ ] 3 to 5 working internal links present.
- [ ] Frequently Asked Questions section with 3–4 Q&As included.
- [ ] **Zero unclosed or leaking raw markdown symbols (`##`, `###`, `**`).**

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
- [ ] Word count is 1,000+ words with rich subheadings.
- [ ] 3–5 strategic internal links are present and working.
- [ ] 3–4 AEO FAQs are included.
- [ ] Zero raw markdown symbol leaks verified.
- [ ] `php -l data/posts.php` passes with zero errors.
- [ ] `php artisan db:seed --class=PostSeeder --force` synced successfully.
- [ ] `memory.md` updated.
- [ ] Deployed and verified live on `https://deepakbagada.in/journal/<slug>`.
