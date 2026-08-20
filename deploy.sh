#!/usr/bin/env bash
# =============================================================================
# Automated Hostinger Deploy Script for deepakbagada.in
# Safely deploys Laravel 13 without touching other websites or the database.
# =============================================================================
set -e

echo "🚀 Step 1: Installing production dependencies locally..."
composer install --no-dev --optimize-autoloader --quiet

echo "📦 Step 2: Syncing files to Hostinger server (domains/deepakbagada.in/public_html)..."
rsync -avz -e "ssh -i $HOME/.ssh/hostinger_deepak -p 65002" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='storage/logs/*' \
    --exclude='storage/framework/cache/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/views/*' \
    --exclude='deploy.zip' \
    ./ u775719140@86.38.243.124:domains/deepakbagada.in/public_html/

echo "🔧 Step 3: Setting permissions and building Laravel caches on server..."
ssh -i $HOME/.ssh/hostinger_deepak -p 65002 u775719140@86.38.243.124 \
    "cd domains/deepakbagada.in/public_html && chmod -R 775 storage bootstrap/cache && php artisan config:cache && php artisan route:cache && php artisan view:cache"

echo "✅ Step 4: Verifying website..."
curl -s -o /dev/null -w "HTTP Response Code: %{http_code}\n" https://deepakbagada.in/

echo "🎉 Deployment complete! Visit https://deepakbagada.in"
