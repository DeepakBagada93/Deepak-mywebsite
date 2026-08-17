# Deepak Bagada — Portfolio (Issue Vol. 01)

A single-page portfolio for **Deepak Bagada — AI Developer, Web Developer & Marketing Expert**.
Built with **pure PHP** (no framework, no database), styled as **editorial luxury**: Fraunces serif
display type, hairlines, huge whitespace, and a strict black-&-white palette. The content reads
like a life story — code → marketing → AI — with a dated timeline and a news-desk journal, all
animated with restrained GSAP motion. SEO/AEO optimized for Junagadh, Gujarat.

The whole repo **is** the website — its contents go straight into `public_html` on Hostinger.
No Composer, no `proc_open`, no SQL. Content changes = edit a file → `git push`.

## Stack

| Layer      | Choice                                          |
|------------|-------------------------------------------------|
| Backend    | Pure PHP (no framework)                         |
| Frontend   | Plain CSS/JS (no build step)                    |
| Content    | Files in `data/` — no database                  |
| Animation  | GSAP + ScrollTrigger (CDN)                      |
| Hosting    | Hostinger / cPanel shared hosting               |
| Versioning | GitHub                                          |

## What's on the page (single page, all sections)

1. **Masthead** — sticky magazine header + nav
2. **Hero** — huge serif name, 9:16 video reel (scroll-triggered shrink/dim), editorial rule
3. **About** — life story (code → marketing → AI), pull quote, fact list, animated stat counters
4. **Skills** — "power level" lists with animated bars
5. **Main Projects** — Curro, SaaS Next, DailyAIWorld, read from `data/projects.php`
6. **The News** — journal entries from `data/posts.php`; each story opens as a full page (`/journal/<slug>`) in a new tab
7. **Questions, answered** — FAQ section (`data/faq.php`), emitted as FAQPage schema for AI engines
8. **Contact** — email card, socials, no form

Plus dedicated **service pages** (one per SEO keyword cluster), each with `Service` + `FAQPage`
schema and a FAQ block:

- `/services/web-development` — website developer Junagadh / Gujarat
- `/services/ai-development` — AI developer & AI agents
- `/services/seo-aeo` — SEO & AEO expert
- `/services` — hub page listing all three

**SEO / AEO:** the site ships with Person + ProfessionalService + FAQPage schema on the
homepage, Article schema on every journal post, `llms.txt` (AI-agent content map), a
sitemap covering all pages, and the full strategy in [`SEO-AEO-PLAN.md`](SEO-AEO-PLAN.md).

## Files you'll actually edit

| File                          | What it controls                          |
|-------------------------------|-------------------------------------------|
| `data/site.php`               | Name, domain, email, phone, socials       |
| `data/posts.php`              | Journal / news entries (title, body, tag) |
| `data/projects.php`           | Main projects (title, image, tags, link)  |
| `data/services.php`           | Service pages (title, copy, offerings, FAQ)| 
| `data/faq.php`                | Homepage FAQ Q&As (also feed FAQPage schema) |
| `partials/about.php`          | Bio text, timeline                        |
| `partials/skills.php`         | Skill lists + percentages                 |
| `css/app.css`                 | Colors (see `:root` variables)            |
| `images/`                     | hero-video.mp4, about-portrait.png, etc.  |

**Add a journal entry:** copy one block in `data/posts.php`, change the fields, give it a new
`slug`, and set `published_at` to today's date. Push — it's live.

## Local preview (no setup)

```bash
php -S localhost:8000          # from the repo root → http://localhost:8000
```

## Deployment (Hostinger)

1. Push to GitHub.
2. Deploy the repo contents into `public_html` (git clone there, or upload, or your GitHub deploy tool).
3. If you see Hostinger's default page: delete `public_html/default.php` or run `bash deploy/setup-server.sh`.
4. Done — `https://deepakbagada.in` shows the portfolio. No composer, no database.

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full walkthrough.

> The previous Laravel version of this site is preserved in the `laravel-version` branch.