# Deployment Guide

The site is now **pure PHP with no database** — the whole repo is the website. Deploy its
contents to `public_html` and you're done. No Composer, no `proc_open`, no `.env`, no migrations.

---

## 1. Push to GitHub

```bash
git add .
git commit -m "update"
git push
```

That single push is your content-update workflow. Everything on the site (journal posts,
projects, contact info) lives in plain files:

| Content            | Edit this file             |
|--------------------|----------------------------|
| Journal / news     | `data/posts.php`           |
| Projects           | `data/projects.php`        |
| Name / email / URL | `data/site.php`            |
| Bio / skills       | `partials/about.php`, `partials/skills.php` |

Change the file, commit, push, deploy. No phpMyAdmin, no database.

---

## 2. Hostinger / cPanel — deploy to `public_html`

The repository root is the web root. Three equivalent ways to get it there:

### Hostinger hPanel Git Auto-Deploy (Recommended - Zero Setup)

Hostinger supports automatic deployment directly from GitHub on every `git push`:

1. Log in to **Hostinger hPanel** → Go to **Websites** → Select `deepakbagada.in`.
2. Open **Advanced** → **Git**.
3. Create a new repository link:
   - **Repository:** `https://github.com/DeepakBagada93/Deepak-mywebsite.git`
   - **Branch:** `main`
   - **Install Directory:** `public_html`
4. Click **Create** then click **Deploy**.
5. Enable **Auto-Deployment** (copy the Webhook URL and paste it into **GitHub Repo Settings → Webhooks**).
6. **Result:** Every time you run `git push`, Hostinger automatically syncs the changes to `public_html` instantly!

### PHP version

Nothing here needs anything special — plain PHP runs on Hostinger's default. If a specific
version is selected in **hPanel → Websites → YOURDOMAIN.COM → PHP Configuration**, any
**PHP 8.x** is fine.

---

## 3. Check it

Open **`https://deepakbagada.in`** — you should see the portfolio. Verify:

- `/` → homepage with all sections
- `/journal/<slug>` → each story page (clean URL via `.htaccess`)
- `/sitemap.xml` → XML sitemap (submit it in Google Search Console)

---

## Keeping it updated (your routine)

```bash
# edit content in data/*.php locally or right on GitHub's web editor
git add . && git commit -m "new journal post" && git push
# deploy (git pull on the server, or your deploy tool picks it up)
cd ~/domains/YOURDOMAIN.COM/public_html && git pull
```

That's the whole workflow: **edit → push → pull**. No database to keep in sync.

---

## 4. Useful notes

- **Domain:** `https://deepakbagada.in` is set in `data/site.php` (`url`) and `robots.txt`.
  The contact email still reads `ceo@saasnext.in` — update it in `data/site.php` when your
  `deepakbagada.in` mailbox is ready.
- **Old Laravel version:** preserved in the `laravel-version` branch (`git checkout laravel-version`).
- **Images:** drop files into `images/` — `hero-video.mp4`, `hero-poster.png`,
  `about-portrait.png`, `projects/project-1.png`, etc. — and reference them from the partials.
- **Customisation cheat-sheet**

  | What            | Where                                                       |
  |-----------------|-------------------------------------------------------------|
  | Hero video      | `images/hero-video.mp4` (+ `hero-poster.png` poster)        |
  | Your photos     | `images/hero-poster.png`, `images/about-portrait.png`       |
  | Project images  | `images/projects/*` or the `image` field in `data/projects.php` |
  | Bio / facts     | `partials/about.php`                                        |
  | Skills + bars   | `partials/skills.php`                                       |
  | Contact details | `data/site.php`, `partials/contact.php`                     |
  | Colors          | `:root` variables at the top of `css/app.css`               |
  | Animations      | `js/main.js` (GSAP)                                         |