# Deployment Guide

Three parts: **1) push to GitHub**, **2) create the remote MySQL database**, **3) deploy to Hostinger/cPanel `public_html`**.

---

## 1. GitHub

The repo is already pushed to **https://github.com/DeepakBagada93/Deepak-mywebsite** (branch `main`).

```bash
git add .
git commit -m "update"
git push
```

> `database/database.sqlite` is only for local dev. On the server you use MySQL — the
> SQLite file never reaches production.

---

## 2. Remote MySQL database (phpMyAdmin)

1. In **Hostinger → hPanel → Databases → MySQL Databases**, create a database
   (e.g. `u000000000_portfolio`) and a database user with **All Privileges**.
2. Note down: **DB name**, **DB user**, **DB password**, **host** (`localhost` on Hostinger).

> You do NOT need to create tables by hand — running `php artisan migrate` (step 3)
> creates `posts`, `projects`, and `contact_messages` automatically.

---

## 3. Hostinger / cPanel deployment (public_html)

The `public/index.php` in this project **auto-detects the app folder**, so no path
editing is ever needed. The layout that works (verified):

```
~/domains/YOURDOMAIN.COM/
├── portfolio/          ← the whole Laravel app (except .env — created on the server)
└── public_html/        ← hPanel's web root
    ├── index.php       ← copied from portfolio/public/index.php (auto-detects ../portfolio)
    ├── .htaccess       ← copied from portfolio/public/.htaccess
    ├── robots.txt
    ├── css/  js/  images/
```

> **If `composer install` fails with “Your lock file does not contain a compatible set
> of packages”** — the project needs **PHP 8.3+** and a recent Composer. Either:
> 1. In **hPanel → Websites → YOURDOMAIN.COM → PHP Configuration**, set PHP to **8.3 or 8.4**, and run `composer self-update` (or pick a newer Composer in hPanel), or
> 2. Skip Composer entirely — use the **`deploy-portfolio.zip`** path below (it already includes `vendor/`).

### Option B — cPanel File Manager (no SSH)

1. **Create the database** (step 2 above) so the credentials are ready.
2. **Get the files onto the server** — pick one:
   - **Easiest — no Composer needed:** locally run the included script
     ```bash
     php deploy/build-zip.php   # or just re-zip the folder as described in the zip itself
     ```
     and upload **`deploy-portfolio.zip`** (it already contains `vendor/`) to
     `~/domains/YOURDOMAIN.COM/`, extract it in File Manager, and rename the folder to `portfolio`.
   - **SSH/Terminal (hPanel → Websites → YOURDOMAIN.COM → Terminal):**
     ```bash
     cd ~/domains/YOURDOMAIN.COM
     git clone https://github.com/DeepakBagada93/Deepak-mywebsite.git portfolio
     cd portfolio
     composer install --no-dev --optimize-autoloader
     ```
   - **File Manager + Composer:** upload a project zip (exclude `vendor`, `.env`,
     `database/database.sqlite`), extract, rename to `portfolio`, then run `composer install`
     via hPanel's **File Manager → composer** button (needs PHP 8.3+, see note above).
3. **Copy the web files into `public_html`:**
   In File Manager, copy the contents of `portfolio/public/` (index.php, .htaccess,
   robots.txt, css/, js/, images/) **into `public_html/`** (replace anything there).
4. **Create `.env`** at `portfolio/.env` (copy `.env.example` and fill in):
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
5. **Create the tables** (SSH/terminal, from `~/domains/YOURDOMAIN.COM/portfolio`):
   ```bash
   php artisan key:generate
   php artisan migrate --force
   php artisan db:seed --force     # optional demo content
   php artisan config:cache
   php artisan route:cache
   ```
6. **Set permissions** so Laravel can write (SSH):
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```
7. **Check it**: open `https://YOURDOMAIN.COM` — you should see the portfolio. If you
   see "Laravel application root not found", the app folder isn't a sibling of
   `public_html` (rename it to `portfolio` next to `public_html`).

> **Security:** keep `APP_DEBUG=false`, and confirm `portfolio/.env` is not web-accessible
> (Hostinger blocks dotfiles by default). Remove the seed demo content when you're ready.

### Option A — point the document root at the Laravel public folder (SSH, cleaner)

If you can change the document root: in **hPanel → Websites → YOURDOMAIN.COM →
Document Root**, set it to `portfolio/public` instead of `public_html`. Everything else
is the same, and `index.php` works unchanged.

---

## 4. Keeping it updated

```bash
# local
git add . && git commit -m "update" && git push

# on the server (SSH)
cd ~/domains/YOURDOMAIN.COM/portfolio
git pull
php artisan migrate --force   # only if the DB schema changed
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
