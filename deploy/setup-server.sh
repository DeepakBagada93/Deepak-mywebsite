#!/usr/bin/env bash
# =============================================================================
# Hostinger one-shot setup for the pure-PHP portfolio (no Laravel, no Composer).
#
# The whole repo IS the website — its contents go straight into public_html.
#
# Two ways to use it:
#
#   A) GitHub deploy (recommended): point your deploy tool / git clone at the
#      repo root and it goes into public_html directly. Nothing else needed.
#
#   B) Manual: copy the repo contents into public_html (or clone the repo
#      there), then run this script from public_html:
#
#        bash setup-server.sh
#
# It only removes Hostinger's placeholder page, nothing else. Safe to re-run.
# =============================================================================
set -e

echo "== Working in: $(pwd)"
echo "== PHP: $(php -v 2>/dev/null | head -1 || echo 'php not found')"

if [ ! -f ./index.php ]; then
    echo ""
    echo "ERROR: index.php not found here."
    echo "Run this script from inside public_html after copying/cloning the repo."
    exit 1
fi

# ---------- Remove Hostinger placeholders that shadow index.php ----------
rm -f ./default.php ./index.html ./index.htm
echo "== Removed Hostinger placeholder pages (if any)"

# ---------- Confirm key files are present ----------
for f in .htaccess index.php journal.php data/posts.php css/app.css js/main.js; do
    [ -f "./$f" ] || echo "!! Missing: $f"
done

echo ""
echo "== Done!"
echo "   Open https://YOURDOMAIN - you should see the portfolio."
echo "   To change content, edit data/posts.php & data/projects.php, then git push."
