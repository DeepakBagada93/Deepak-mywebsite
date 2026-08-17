# Deployment Guide

The site is now a **Laravel 13 application** backed by **remote MySQL** (Hostinger),
with content in the database. The web server must serve the repo's `public/`
folder — that is the only directory exposed to the web.

---

## 1. Requirements

| Requirement | Value |
|-------------|-------|
| PHP | **8.3+** (Laravel 13) — set in hPanel → Websites → your domain → PHP Configuration |
| Composer | Required on the server (or build locally and upload `vendor/`) |
| Database | Remote MySQL already configured in `.env` (Hostinger / phpMyAdmin) |
| Document root | Must point at `<repo>/public` |

---

## 2. What's where

| Path | Purpose |
|------|---------|
| `public/` | **The only web-exposed folder** — `index.php` (front controller), `css/`, `js/`, `images/`, `llms.txt`, `robots.txt` |
| `app/` | Controllers, models, `Support\Markdown` renderer |
| `config/site.php` | Name, domain, email, location, socials |
| `database/seeders/` | Content seeders (posts read `data/posts.php`; projects/services/faqs embedded) |
| `data/posts.php` | Journal posts source of truth for the blog-creator skill (synced to the DB) |
| `routes/web.php` | All URLs: `/`, `/services`, `/services/{slug}`, `/journal/{slug}`, `/sitemap.xml` |

---

## 3. Deploy to Hostinger

### Option A — Hostinger hPanel Git Auto-Deploy

1. Push to GitHub: `git push origin main`.
2. hPanel → **Websites** → `deepakbagada.in` → **Advanced → Git**: link the repo
   (`https://github.com/DeepakBagada93/Deepak-mywebsite.git`, branch `main`).
3. **Set the document root:** hPanel → Websites → `deepakbagada.in` →
   **Advanced → Document Root** → set it to the repo's `public` folder
   (e.g. `public_html/public` if the repo installs into `public_html`).
4. Run the server setup once (hPanel → Advanced → **Terminal**, or SSH):

   ```bash
   cd <repo-path-on-server>
   bash deploy/setup-server.sh
   ```

   This installs Composer deps, generates an app key if missing, runs
   `php artisan migrate --force`, and builds the config/route/view caches.

### Option B — Manual upload

Upload the repo (excluding `vendor/`) to the server, `composer install --no-dev`,
copy `.env` (with your MySQL creds + `APP_KEY`), set the document root to `public/`,
and run the same setup script.

---

## 4. The `.env` file (server + local)

`.env` is git-ignored and holds the remote MySQL connection. Required keys:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://deepakbagada.in
DB_CONNECTION=mysql
DB_HOST=<host>
DB_PORT=3306
DB_DATABASE=<db name>
DB_USERNAME=<db user>
DB_PASSWORD=<db password>
```

Generate the app key with `php artisan key:generate` if `APP_KEY` is missing.
The same `.env` works locally for development.

---

## 5. Check it

- `https://deepakbagada.in/` → homepage with all sections
- `/services` and `/services/<slug>` → service hub + pages
- `/journal/<slug>` → story pages
- `/sitemap.xml` → XML sitemap (still submit it in Google Search Console)

---

## 6. Keeping content updated

### Journal posts (the blog-creator skill still works unchanged)

1. Add the post to `data/posts.php` (or use the skill, which does this).
2. Sync it to the database — either:
   ```bash
   php artisan db:seed --class=PostSeeder   # reads data/posts.php
   ```
   or the skill's existing sync:
   ```bash
   python3 .gemini/skills/deepakbagada-blog-creator/scripts/publish_blog.py
   ```
3. Push to GitHub.

### Everything else (projects, services, FAQs)

Content lives in the database. Edit rows in **phpMyAdmin**, or change the
seeders and re-run:

```bash
php artisan db:seed --force
```

### Site settings (name, email, socials)

Edit `config/site.php`, then `php artisan config:cache`.

---

## 7. Useful notes

- **Existing `posts` table:** the production `posts` table (managed by the
  blog-creator skill) is left untouched — the Laravel migration skips it if it
  already exists, and the `Post` model maps to its existing schema
  (`id` = slug, `content`, `date`, `category`).
- **Old pure-PHP version:** preserved in git history (`main` before this
  migration) and in the `laravel-version` branch.
- **Local preview:**
  ```bash
  composer install
  php artisan key:generate
  php artisan migrate --force && php artisan db:seed --force
  php artisan serve   # → http://localhost:8000
  ```
- **Customisation cheat-sheet**

  | What | Where |
  |------|-------|
  | Hero video / photos | `public/images/` (`hero-video.mp4`, `about-portrait.png`) |
  | Project images | `public/images/projects/*` or the `image` row in the DB |
  | Bio / skills | `resources/views/portfolio/partials/about.blade.php`, `skills.blade.php` |
  | Contact details | `config/site.php`, `resources/views/portfolio/partials/contact.blade.php` |
  | Colors | `:root` variables at the top of `public/css/app.css` |
  | Animations | `public/js/main.js` (GSAP) |
