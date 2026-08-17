#!/usr/bin/env bash
# =============================================================================
# Hostinger one-shot setup for the Laravel portfolio (deepakbagada.in).
#
# Run this inside the repo on the server after the code is deployed, e.g.:
#
#     cd ~/domains/deepakbagada.in/repo   # wherever the repo lives on the server
#     bash deploy/setup-server.sh
#
# Then point the domain's Document Root at <repo>/public (hPanel → Websites →
# your domain → Advanced → Document Root).
#
# Safe to re-run: composer install is skipped when vendor/ exists, migrations
# are idempotent (the existing production `posts` table is left untouched),
# and the cache commands just rebuild caches.
# =============================================================================
set -e

echo "== Working in: $(pwd)"
echo "== PHP: $(php -v 2>/dev/null | head -1 || echo 'php not found')"

# ---------- 1. PHP dependencies ----------
if [ ! -f ./artisan ]; then
    echo ""
    echo "ERROR: artisan not found here."
    echo "Run this script from inside the Laravel repo (the folder containing artisan)."
    exit 1
fi

if [ ! -d ./vendor ]; then
    echo ""
    echo "!! vendor/ is missing."
    echo "!! Hostinger disables proc_open, so composer install cannot run here."
    echo "!! Build locally instead:"
    echo "!!     composer install --no-dev --optimize-autoloader"
    echo "!! then upload the repo (including vendor/) via File Manager / FTP and re-run this script."
    exit 1
else
    echo "== vendor/ present — skipping composer install (build/upload vendor locally; see DEPLOYMENT.md)."
fi

# ---------- 2. .env ----------
if [ ! -f ./.env ]; then
    cp ./.env.example ./.env
    php artisan key:generate --force
    echo ""
    echo "!! .env created from the example. Edit DB_HOST / DB_DATABASE / DB_USERNAME /"
    echo "!! DB_PASSWORD (remote MySQL) and APP_URL=https://deepakbagada.in, then re-run this script."
    exit 1
fi

# ---------- 3. Storage permissions ----------
chmod -R 775 ./storage ./bootstrap/cache

# ---------- 4. Migrate (safe — existing `posts` table is skipped) ----------
php artisan migrate --force

# ---------- 5. Caches ----------
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ""
echo "== Done!"
echo "   Point the domain's Document Root at: $(pwd)/public"
echo "   Then open https://deepakbagada.in — you should see the portfolio."
echo "   Journal posts: edit data/posts.php and run 'php artisan db:seed --class=PostSeeder' (or the blog-creator skill)."
