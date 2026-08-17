---
name: deepakbagada-blog-creator
description: >
  Autonomous SEO & AEO journal blog generator for Deepak Bagada's personal website (deepakbagada.in).
  Researches high-CTR trending topics in Web Dev, AI Agents, and SEO/AEO for Indian & global SMEs,
  enforces anti-duplication via memory.md, includes 2-3 internal links and AEO FAQ sections,
  and dual-publishes to local data/posts.php and Hostinger MySQL database.
---

# 🚀 Deepak Bagada SEO & AEO Journal Blog Creator Skill

This skill creates high-CTR, text-only journal posts for **Deepak Bagada** (Web Developer, AI Expert, and SEO/AEO Specialist based in Junagadh, Gujarat, India).

---

## 🧠 MANDATORY FIRST STEP: Anti-Duplication Check
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

1. **Title & Tag**:
   - High-CTR Title with Curiosity Gap + Numbers/Year (2026) + Geographic/Niche relevance.
   - Tag: `WEB DEV`, `AI DEV`, `AEO`, `LOCAL SEO`, `AUTOMATION`, or `MY STORY`.

2. **Answer-First Intro Paragraph (AEO Core)**:
   - The opening 2–3 sentences MUST directly answer the primary question/topic in plain language.
   - Designed to be quoted verbatim by AI answer engines (ChatGPT, Gemini, Perplexity, Google AI Overviews).

3. **Narrative & Structure**:
   - Written in Deepak Bagada's authentic voice (first-person "I", practical, direct, zero buzzword fluff).
   - Structured into clear chapters or numbered points.

4. **Strategic Internal Links (2–3 links minimum)**:
   - Must include markdown links to internal pages where relevant:
     - Web Dev: `[Website Development Services](/services/web-development)`
     - AI Systems: `[AI Development & AI Agents](/services/ai-development)`
     - SEO / AEO: `[SEO & AEO Services](/services/seo-aeo)`
     - Portfolio / Projects: `[featured projects](/#projects)`
     - Contact: `[contact me](/#contact)` or `[reach out directly](/services/seo-aeo#contact)`

5. **AEO FAQ Section**:
   - End every post body with a dedicated `## Frequently Asked Questions` section containing 2–3 Q&As tailored for search engines and answer engines.

---

## 🔄 Execution Workflow

### Step 1: Insert Post Entry into `data/posts.php`
Format the generated post as a valid PHP array block and prepend it right after `return [` in `data/posts.php`:
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

### Step 2: Validate PHP Syntax
Run PHP linting to confirm zero syntax errors:
```bash
php -l data/posts.php
```

### Step 3: Dual-Sync to Remote Hostinger MySQL
Run the sync script:
```bash
python3 .gemini/skills/deepakbagada-blog-creator/scripts/publish_blog.py
```

### Step 4: Log to `memory.md`
Append the new post details (`Title`, `Slug`, `Tag`, `Published Date`) to BOTH:
- `.gemini/skills/deepakbagada-blog-creator/memory.md`
- `~/.gemini/config/skills/deepakbagada-blog-creator/memory.md`

---

## 🎯 Verification Checklist
- [ ] `php -l data/posts.php` passes with zero syntax errors.
- [ ] `python3 .gemini/skills/deepakbagada-blog-creator/scripts/publish_blog.py` reports clean sync.
- [ ] Post contains answer-first intro, 2+ internal links, and an AEO FAQ section.
- [ ] `memory.md` updated.
