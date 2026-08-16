# Deepak Bagada — Portfolio (Issue Vol. 01)

A single-page portfolio for **Deepak Bagada — AI Developer, Web Developer & Marketing Expert**.
Built with **Laravel + Blade**, styled as **minimal comic + magazine**: Bebas Neue display
type, ink panels, one comic burst and speech bubble, halftone texture, and a black-&-white
palette with red/yellow pops. The content reads like a life story — code → marketing → AI —
with a dated timeline and a news-desk journal, all animated with GSAP.

## Stack

| Layer      | Choice                                          |
|------------|-------------------------------------------------|
| Backend    | Laravel (PHP 8.3+)                              |
| Frontend   | Blade + plain CSS/JS in `public/` (no build step) |
| Animation  | GSAP + ScrollTrigger (CDN)                      |
| Database   | MySQL via phpMyAdmin (remote) — SQLite for local dev |
| Hosting    | Hostinger / cPanel shared hosting               |
| Versioning | GitHub                                          |

## What's on the page (single page, all sections)

1. **Masthead** — sticky magazine header + nav
2. **Hero** — big Bebas headline, 9:16 video reel (scroll-triggered shrink/dim), comic "HELLO!" burst, speech bubble, halftone texture
3. **About** — life story (code → marketing → AI), pull quote, fact list, animated stat counters
4. **Skills** — "power level" lists with animated bars
5. **Main Projects** — Curro, SaaS Next, DailyAIWorld, read from the `projects` table
6. **The News** — journal entries from the `posts` table; each story opens as a full page in a new tab
7. **Contact** — email card (`ceo@saasnext.in`), socials, no form

## Local development (zero setup)

```bash
composer install
cp .env.example .env && php artisan key:generate   # local .env already points to SQLite
php artisan migrate:fresh --seed                    # creates tables + demo content
php artisan serve                                   # http://127.0.0.1:8000
```

No database server needed locally — it uses `database/database.sqlite`.

## Database tables (manage via phpMyAdmin)

| Table               | Purpose                                    | Managed where             |
|---------------------|--------------------------------------------|---------------------------|
| `posts`             | Journal / news entries (title, body, tag…) | **phpMyAdmin → posts**    |
| `projects`          | Main projects (title, image, tags…)        | **phpMyAdmin → projects** |

> The `contact_messages` table still exists from the original form; it's unused while the form is removed.

To add a journal entry in phpMyAdmin: insert a row into `posts` with `published_at` set
(entries without `published_at` stay hidden). New posts appear on the page automatically.

## Images

Drop your own files into `public/images/` and reference them from the templates:

- `public/images/hero-video.mp4` → 9:16 reel played in the hero (with scroll-trigger shrink/dim)
- `public/images/hero-poster.png` → poster frame shown before the video loads
- `public/images/about-portrait.png` → the about-section portrait
- `public/images/projects/project-1.png` → Curro, `project-2.png` → SaaS Next, `project-3.png` → DailyAIWorld
  (or update the `image` column in the `projects` table and drop files anywhere in `public/`)

## Deployment

Full step-by-step (Hostinger/cPanel + remote MySQL + GitHub push) is in **[DEPLOYMENT.md](DEPLOYMENT.md)**.
