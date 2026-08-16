# Deployment Guide

Three parts: **1) push to GitHub**, **2) create the remote MySQL database**, **3) deploy to Hostinger/cPanel**.

---

## 1. GitHub

The repo is already initialised locally (`.gitignore` is set — `.env`, `vendor/`, etc. are excluded).

Create the repository on GitHub (empty, no README), then run:

```bash
git add .
git commit -m "Initial portfolio: Laravel single page with GSAP, journal + projects from DB"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

> Note: `database/database.sqlite` is only for local dev. On the server you'll use MySQL,
> so the SQLite file never needs to reach production.

---

## 2. Remote MySQL database (phpMyAdmin)

1. In **Hostinger → hPanel → Databases → MySQL Databases**, create a database
   (e.g. `u000000000_portfolio`) and a database user with **All Privileges**.
2. Note down: **DB name**, **DB user**, **DB password**, **host** (`localhost` on Hostinger).

> You do NOT need to create tables by hand. Run the migrations in step 3 and Laravel
> creates everything (`posts`, `projects`, `contact_messages`).

---

## 3. Hostinger / cPanel deployment

Laravel runs from its `public/` folder, so on shared hosting we put the app in a subfolder
and point the document root at it. Layout:

```
~/domains/YOURDOMAIN.COM/
├── portfolio/          ← the whole Laravel app (uploaded from GitHub)
│   └── public/         ← Laravel's public folder (index.php, css, js, images)
└── public_html/        ← hPanel's web root
    └── (empty or index.php → redirect)
```

### Option A — recommended: point domain to the Laravel public folder (needs SSH)

With SSH access (Hostinger supports it), this is the cleanest:

```bash
cd ~/domains/YOURDOMAIN.COM
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git portfolio
cd portfolio
composer install --no-dev --optimize-autoloader
cp .env.example .env && php artisan key:generate
```

Then edit `.env`:

```env
APP_NAME="Deepak Bagada"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://YOURDOMAIN.COM

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u000000000_portfolio
DB_USERNAME=u000000000_portfolio_user
DB_PASSWORD=your_db_password
```

Create the tables and demo content:

```bash
php artisan migrate --force
php artisan db:seed --force        # optional — removes this after first run if you want
php artisan config:cache
php artisan route:cache
```

Finally, in **hPanel → Websites → YOURDOMAIN.COM → Document Root**, change the document
root from `public_html` to `portfolio/public`.

### Option B — no SSH: use cPanel File Manager

1. Zip the project locally (exclude `vendor`, `.env`, `database/database.sqlite`), upload
   to `~/domains/YOURDOMAIN.COM/portfolio/` and extract.
2. Upload `vendor/` — easiest is zipping your local `vendor/` (Linux-only files are fine)
   and uploading it, OR ask Hostinger support to run `composer install`.
3. Copy `portfolio/public/*` **into `public_html/`** (move `index.php`, `css/`, `js/`,
   `images/`, `.htaccess`, `robots.txt`).
4. Edit `public_html/index.php` and point the two bootstrap paths at the portfolio folder:

```php
$app = require __DIR__ . '/../portfolio/bootstrap/app.php';
// and
require __DIR__ . '/../portfolio/vendor/autoload.php';
```

5. Create `portfolio/.env` (same contents as Option A), then trigger the migration by
   visiting `https://YOURDOMAIN.COM/setup` once — or if you have SSH, run
   `php artisan migrate --force`.

> **Security:** delete `setup` route if you added one, keep `APP_DEBUG=false`, and make sure
> `portfolio/.env` is not web-accessible (Hostinger blocks dotfiles by default).

---

## 4. Keeping it updated

```bash
# local
git add . && git commit -m "update" && git push

# on the server (SSH)
cd ~/domains/YOURDOMAIN.COM/portfolio
git pull
php artisan migrate --force   # if the DB schema changed
```

Content changes (journal entries, projects, images) don't need redeploys — edit them in
phpMyAdmin / upload images directly.

---

## Customisation cheat-sheet

| What            | Where                                                       |
|-----------------|-------------------------------------------------------------|
| Hero video      | `public/images/hero-video.mp4` (+ `hero-poster.png` poster) |
| Your photos     | `public/images/hero-poster.png`, `public/images/about-portrait.png` |
| Project images  | `public/images/projects/*` or the `image` column in `projects` |
| Bio / facts     | `resources/views/portfolio/partials/about.blade.php`        |
| Skills + bars   | `resources/views/portfolio/partials/skills.blade.php`       |
| Contact details | `resources/views/portfolio/partials/contact.blade.php`      |
| Colors          | `:root` variables at the top of `public/css/app.css`        |
| Animations      | `public/js/main.js` (GSAP)                                  |
