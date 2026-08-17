---
name: deepakbagada-blog-creator
description: >
  Autonomous SEO & AEO journal blog generator for Deepak Bagada's personal website (deepakbagada.in).
  Researches high-CTR trending topics in Web Dev, AI Agents, and SEO/AEO for Indian & global SMEs,
  enforces anti-duplication via memory.md, includes 2-3 internal links and AEO FAQ sections,
  audits content quality via blog-content-auditor subagent, and dual-publishes to local data/posts.php
  and Hostinger MySQL database.
---

# 🚀 Deepak Bagada SEO & AEO Journal Blog Creator Skill (v2.0 Auditor-Enforced)

This skill creates high-CTR, clean-formatted journal posts for **Deepak Bagada** (Web Developer, AI Expert, and SEO/AEO Specialist based in Junagadh, Gujarat, India).

---

## 🧠 MANDATORY STEP 1: Anti-Duplication Check
Before drafting any topic:
1. **Read & Index**: Inspect `.gemini/skills/deepakbagada-blog-creator/memory.md` and `data/posts.php`.
2. **Deduplication Filter**: Reject any generated topic that overlaps with past titles or slugs in `memory.md`.

---

## 🎯 Topic & Keyword Mix Matrix

Choose topics dynamically from these three clusters:

| Cluster | Key Keywords & Geo Modifiers | Example High-CTR Topic Pattern |
|---|---|---|
| **A: Web Development** | `website developer Junagadh`, `Laravel developer Gujarat`, `custom PHP speed`, `website cost India` | *"How Much Does a Custom Website Cost in Gujarat? (2026 Price Breakdown)"* |
| **B: AI & Automation** | `AI developer Junagadh`, `AI agents India`, `RAG knowledge base`, `LLM integration` | *"5 Practical AI Automations Saved 20+ Hours/Week for Indian SMEs"* |
| **C: SEO & AEO** | `SEO expert Junagadh`, `AEO expert Gujarat`, `Google AI Overviews ranking`, `local SEO India` | *"How to Rank on Google AI Overviews & ChatGPT in 2026 (AEO Blueprint)"* |

---

## ✍️ Content & Copywriting Requirements

Every post MUST follow these exact rules:

1. **Length Requirement**:
   - Article body MUST be **1,000 to 1,200+ words** with deep, practical, and actionable insights.

2. **Clean Frontend Formatting (Zero Raw Markdown Symbols)**:
   - Ensure the content renders cleanly on the frontend.
   - Headings, internal links, and bold text will be parsed by `render_post_body()`. Avoid stray, unclosed markdown symbols.

3. **Title & Excerpt / Meta Description**:
   - Title: High-CTR Title with Curiosity Gap + Numbers/Year (2026) + Geographic/Niche relevance (under 60 chars).
   - Excerpt: 140–160 character answer-first summary for meta description & search snippet.
   - Tag: `WEB DEV`, `AI DEV`, `AEO`, `LOCAL SEO`, `AUTOMATION`, or `MY STORY`.

4. **Answer-First Intro Paragraph (AEO Core)**:
   - The opening 2–3 sentences MUST directly answer the primary question/topic in plain language.
   - Designed to be quoted verbatim by AI answer engines (ChatGPT, Gemini, Perplexity, Google AI Overviews).

5. **Strategic Internal Links (2–3 links minimum)**:
   - Must include markdown links to internal pages where relevant:
     - Web Dev: `[Website Development Services](/services/web-development)`
     - AI Systems: `[AI Development & AI Agents](/services/ai-development)`
     - SEO / AEO: `[SEO & AEO Services](/services/seo-aeo)`
     - Portfolio / Projects: `[featured projects](/#projects)`
     - Contact: `[contact me](/#contact)` or `[reach out directly](/services/seo-aeo#contact)`

6. **AEO FAQ Section**:
   - End every post body with a dedicated `## Frequently Asked Questions` section containing 2–3 Q&As tailored for search engines and answer engines.

---

## 🔍 MANDATORY STEP 2: Subagent Content & SEO Audit

Before writing to `data/posts.php`, spawn the **`blog-content-auditor`** subagent to inspect the draft:
- Verify word count (1,000+ words).
- Verify 2-3 internal links exist.
- Verify meta title & excerpt length/CTR quality.
- Verify zero raw markdown symbol leaks.

---

## 🔄 Step 3: Deployment & Dual-Sync Workflow

### Step 3.1: Insert Post Entry into `data/posts.php`
Format the audited post as a valid PHP array block and prepend it right after `return [` in `data/posts.php`:
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

### Step 3.2: Validate PHP Syntax
Run PHP linting to confirm zero syntax errors:
```bash
php -l data/posts.php
```

### Step 3.3: Dual-Sync to Remote Hostinger MySQL
Run the sync script:
```bash
python3 .gemini/skills/deepakbagada-blog-creator/scripts/publish_blog.py
```

### Step 3.4: Log to `memory.md` & Deploy to GitHub
1. Append new post details (`Title`, `Slug`, `Tag`, `Published Date`) to BOTH:
   - `.gemini/skills/deepakbagada-blog-creator/memory.md`
   - `~/.gemini/config/skills/deepakbagada-blog-creator/memory.md`
2. Push to GitHub repo (triggers Hostinger Webhook deployment):
   ```bash
   git add . && git commit -m "Publish blog post: <title>" && git push origin main
   ```

---

## 🎯 Verification Checklist
- [ ] Subagent `blog-content-auditor` returned AUDIT PASS.
- [ ] Word count verified (1,000+ words).
- [ ] `php -l data/posts.php` passes with zero syntax errors.
- [ ] `python3 .gemini/skills/deepakbagada-blog-creator/scripts/publish_blog.py` reports clean sync.
- [ ] `git push origin main` executed for Hostinger auto-deploy.
