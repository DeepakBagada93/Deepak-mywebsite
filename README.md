# Deepak Bagada — Portfolio (Issue Vol. 01)

A portfolio for **Deepak Bagada — AI Developer, Web Developer & Marketing Expert**,
built with **Laravel 13** and styled as **editorial luxury**: Fraunces serif display
type, hairlines, huge whitespace, and a strict black-&-white palette. The content
reads like a life story — code → marketing → AI — with a dated timeline and a
news-desk journal, all animated with restrained GSAP motion. SEO/AEO optimized for
Junagadh, Gujarat.

Content lives in a **remote MySQL database** (Hostinger / phpMyAdmin) — posts are
synced from `data/posts.php` by the blog-creator skill, everything else is seeded
or edited directly in the DB.

## Stack

| Layer      | Choice                                          |
|------------|-------------------------------------------------|
| Backend    | Laravel 13 (PHP 8.3+)                           |
| Frontend   | Plain CSS/JS (no build step)                    |
| Content    | Remote MySQL — Eloquent models, migrations, seeders |
| Animation  | GSAP + ScrollTrigger (CDN)                      |
| Hosting    | Hostinger / cPanel shared hosting (`public/` as document root) |
| Versioning | GitHub                                          |

## What's on the page

1. **Masthead** — sticky magazine header + nav
2. **Hero** — huge serif name, 9:16 video reel (scroll-triggered shrink/dim), editorial rule
3. **About** — life story (code → marketing → AI), pull quote, fact list, animated stat counters
4. **Skills** — "power level" lists with animated bars
5. **Main Projects** — Curro, SaaS Next, DailyAIWorld (from the `projects` table)
6. **The News** — journal entries (from the `posts` table); each story opens as a full page (`/journal/<slug>`)
7. **Questions, answered** — FAQ section (`faqs` table), emitted as FAQPage schema
8. **Contact** — email card, socials, no form

Plus dedicated **service pages** (from the `services` table), each with `Service` + `FAQPage`
schema and a FAQ block:

- `/services/web-development` — website developer Junagadh / Gujarat
- `/services/ai-development` — AI developer & AI agents
- `/services/seo-aeo` — SEO & AEO expert
- `/services` — hub page listing all three

**SEO / AEO:** Person + ProfessionalService + FAQPage schema on the homepage,
Article schema on every journal post, `llms.txt`, a sitemap covering all pages,
and the full strategy in [`SEO-AEO-PLAN.md`](SEO-AEO-PLAN.md).

## Files you'll actually edit

| File | What it controls |
|------|------------------|
| `config/site.php` | Name, domain, email, phone, socials |
| `data/posts.php` | Journal entries (title, body, tag) — synced to the DB |
| `database/seeders/` | Projects, services, FAQs seed data (re-run to re-seed) |
| `resources/views/portfolio/partials/about.blade.php` | Bio text, timeline |
| `resources/views/portfolio/partials/skills.blade.php` | Skill lists + percentages |
| `public/css/app.css` | Colors (see `:root` variables) |
| `public/images/` | hero-video.mp4, about-portrait.png, etc. |

**Add a journal entry:** copy one block in `data/posts.php`, change the fields, give
it a new `slug`, set `published_at` to today — then sync to the DB:

```bash
php artisan db:seed --class=PostSeeder
```

**Edit projects / services / FAQs:** change rows in phpMyAdmin, or edit the seeders
and run `php artisan db:seed --force`.

## Local preview

```bash
composer install
php artisan key:generate        # if APP_KEY is missing
php artisan migrate --force
php artisan db:seed --force
php artisan serve               # → http://localhost:8000
```

Your `.env` already points at the remote MySQL database, so the same content
shows locally and on the live site.

## Deployment (Hostinger)

1. Push to GitHub.
2. Hostinger Git deploy → repo into `public_html`.
3. Set the domain's **Document Root** to the repo's `public/` folder.
4. Run `bash deploy/setup-server.sh` once on the server (Composer deps, migrate, caches).
5. Done — `https://deepakbagada.in` shows the portfolio.

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full walkthrough.
