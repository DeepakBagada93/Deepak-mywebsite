#!/usr/bin/env bash
# =============================================================================
# Hostinger / cPanel one-shot setup for the Deepak Bagada portfolio.
#
# Run it from the DOMAIN ROOT via hPanel -> Websites -> your domain -> Terminal:
#
#     bash setup-server.sh
#
# It arranges the Laravel app + public_html correctly, removes Hostinger's
# default.php placeholder, copies the web files into public_html, creates .env
# if missing, and sets storage permissions. Safe to re-run.
# =============================================================================
set -e

APP_DIR="portfolio"
WEB_ROOT="public_html"
DOMAIN_ROOT="$(pwd)"

# Everything that belongs to the app (as opposed to the web root).
APP_ITEMS="app artisan bootstrap composer.json composer.lock config database public resources routes storage vendor .env.example .gitignore README.md DEPLOYMENT.md package.json phpunit.xml vite.config.js tests deploy .editorconfig .gitattributes .npmrc"

echo "== Domain root: $DOMAIN_ROOT"

# ---------- 0. Preflight: PHP version + proc_open (Composer needs both) ----------
PHP_FULL="$(php -v 2>/dev/null | head -1)"
echo "== PHP: ${PHP_FULL:-php not found}"
PHP_MAJOR="$(php -r 'echo PHP_MAJOR_VERSION;' 2>/dev/null)"
PHP_MINOR="$(php -r 'echo PHP_MINOR_VERSION;' 2>/dev/null)"

if [ "$PHP_MAJOR" -lt 8 ] || { [ "$PHP_MAJOR" -eq 8 ] && [ "$PHP_MINOR" -lt 3 ]; }; then
    echo ""
    echo "ERROR: this project needs PHP 8.3+ (Laravel 13), found PHP $PHP_MAJOR.$PHP_MINOR."
    echo "Fix in hPanel: Websites -> YOUR DOMAIN -> Advanced -> PHP Configuration ->"
    echo "  change PHP version to 8.3 or 8.4, then log out/in of SSH and re-run."
    exit 1
fi

if ! php -r 'exit(function_exists("proc_open") ? 0 : 1);' 2>/dev/null; then
    echo ""
    echo "ERROR: the PHP function 'proc_open' is DISABLED on this server. Composer depends"
    echo "on it, so 'composer install' fails with:"
    echo "  The Process class relies on proc_open, which is not available on your PHP installation."
    echo ""
    echo "Fix in hPanel: Websites -> YOUR DOMAIN -> Advanced -> PHP Configuration"
    echo "  -> PHP options tab -> scroll to 'disableFunctions' -> remove 'proc_open' -> Save."
    echo "Then re-run this script."
    exit 1
fi

# ---------- 1. Find the app (three possible locations) ----------
if [ -f "$DOMAIN_ROOT/$APP_DIR/public/index.php" ] && [ -d "$DOMAIN_ROOT/$APP_DIR/vendor" ]; then
    echo "== App found at ./$APP_DIR (ideal layout)"
    APP="$DOMAIN_ROOT/$APP_DIR"
elif [ -f "$DOMAIN_ROOT/public/index.php" ] && [ -d "$DOMAIN_ROOT/vendor" ]; then
    echo "== App files found in the domain root - moving them into ./$APP_DIR ..."
    mkdir -p "$DOMAIN_ROOT/$APP_DIR"
    for item in $APP_ITEMS; do
        [ -e "$DOMAIN_ROOT/$item" ] && mv "$DOMAIN_ROOT/$item" "$DOMAIN_ROOT/$APP_DIR/"
    done
    APP="$DOMAIN_ROOT/$APP_DIR"
elif [ -f "$DOMAIN_ROOT/$WEB_ROOT/public/index.php" ] && [ -d "$DOMAIN_ROOT/$WEB_ROOT/vendor" ]; then
    echo "== App files found INSIDE public_html - moving them into ./$APP_DIR ..."
    mkdir -p "$DOMAIN_ROOT/$APP_DIR"
    for item in $APP_ITEMS; do
        [ -e "$DOMAIN_ROOT/$WEB_ROOT/$item" ] && mv "$DOMAIN_ROOT/$WEB_ROOT/$item" "$DOMAIN_ROOT/$APP_DIR/"
    done
    APP="$DOMAIN_ROOT/$APP_DIR"
else
    echo ""
    echo "ERROR: could not find the Laravel app."
    echo "Expected one of:"
    echo "  - $DOMAIN_ROOT/$APP_DIR/public/index.php"
    echo "  - $DOMAIN_ROOT/public/index.php"
    echo "  - $DOMAIN_ROOT/$WEB_ROOT/public/index.php"
    echo ""
    echo "Upload/clone the project first, then re-run this script."
    exit 1
fi

# ---------- 2. Remove Hostinger placeholders ----------
mkdir -p "$DOMAIN_ROOT/$WEB_ROOT"
rm -f "$DOMAIN_ROOT/$WEB_ROOT/default.php" \
      "$DOMAIN_ROOT/$WEB_ROOT/index.html"  \
      "$DOMAIN_ROOT/$WEB_ROOT/index.htm"

# ---------- 3. Copy the web files to the root of public_html ----------
echo "== Copying web files into ./$WEB_ROOT ..."
cp -f "$APP/public/index.php"  "$DOMAIN_ROOT/$WEB_ROOT/index.php"
cp -f "$APP/public/.htaccess"  "$DOMAIN_ROOT/$WEB_ROOT/.htaccess"
cp -f "$APP/public/robots.txt" "$DOMAIN_ROOT/$WEB_ROOT/robots.txt"
cp -rf "$APP/public/css"    "$DOMAIN_ROOT/$WEB_ROOT/"
cp -rf "$APP/public/js"     "$DOMAIN_ROOT/$WEB_ROOT/"
cp -rf "$APP/public/images" "$DOMAIN_ROOT/$WEB_ROOT/"

# ---------- 4. Create .env from .env.example if missing ----------
if [ ! -f "$APP/.env" ]; then
    cp "$APP/.env.example" "$APP/.env"
    echo "== Created $APP_DIR/.env from .env.example (edit it later for MySQL)"
fi

# ---------- 5. Permissions ----------
chmod -R 775 "$APP/storage" "$APP/bootstrap/cache" 2>/dev/null || true

echo ""
echo "== Done!"
echo "   1. hPanel -> Websites -> YOURDOMAIN -> PHP Configuration -> PHP 8.3 or 8.4"
echo "   2. Check the domain's document root is $WEB_ROOT"
echo "   3. Open https://YOURDOMAIN.in - you should see the portfolio"
echo "   4. Later: create the MySQL DB, edit $APP_DIR/.env (DB_CONNECTION=mysql ...)"
echo "      then run: cd $APP_DIR && php artisan migrate --force"
