#!/usr/bin/env bash
# =============================================================================
# Automated Hostinger Deploy Script for deepakbagada.in
# Safely deploys Laravel 13 without touching other websites or the database.
# =============================================================================
set -e

echo "🚀 Step 1: Installing production dependencies locally..."
composer install --no-dev --optimize-autoloader --quiet

echo "📦 Step 2: Syncing files to Hostinger server (domains/deepakbagada.in/public_html)..."
rsync -avz --no-owner --no-group -e "ssh -i $HOME/.ssh/hostinger_deepak -p 65002" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='storage/logs/*' \
    --exclude='storage/framework/cache/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/views/*' \
    --exclude='deploy.zip' \
    ./ u775719140@86.38.243.124:domains/deepakbagada.in/public_html/

echo "🔧 Step 3: Syncing posts to MySQL + building Laravel caches on server..."
echo "   (PostSeeder is upsert-only — live-only posts are never deleted.)"
ssh -i $HOME/.ssh/hostinger_deepak -p 65002 u775719140@86.38.243.124 \
    "cd domains/deepakbagada.in/public_html && chmod -R 775 storage bootstrap/cache && php artisan db:seed --class=PostSeeder --force && php artisan config:cache && php artisan route:cache && php artisan view:cache"

echo "🔍 Step 4: Verifying journal shows the latest post..."
LATEST_SLUG=$(php -r '$p=require "data/posts.php"; usort($p, fn($a,$b)=>strcmp($b["published_at"]??"", $a["published_at"]??"")); foreach($p as $x){ if(!preg_match("/-(variant-\d+|v\d+)$/",$x["slug"])){ echo $x["slug"]; break; }}')
echo "   Expecting: $LATEST_SLUG"
for i in 1 2 3; do
    if curl -sL "https://deepakbagada.in/journal" | grep -q "$LATEST_SLUG"; then
        echo "   ✅ Journal freshness VERIFIED — latest post is live."
        break
    fi
    if [ "$i" = "3" ]; then
        echo "   ❌ FAIL: /journal does not list $LATEST_SLUG after deploy. Check the seed output above."
        exit 1
    fi
    echo "   Retry $i/3 — waiting 15s..."
    sleep 15
done

echo "✅ Step 4: Verifying website..."
curl -s -o /dev/null -w "HTTP Response Code: %{http_code}\n" https://deepakbagada.in/

echo "🎉 Deployment complete! Visit https://deepakbagada.in"
