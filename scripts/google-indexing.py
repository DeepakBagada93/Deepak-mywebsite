#!/usr/bin/env python3
"""
google-indexing.py — Automated Google Indexing & Sitemaps Dispatcher
Uses Google Indexing API (URL Notifications) & Google Search Console API.
"""

import sys
import os
import json
import time
import subprocess
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_PATH = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "saasnext-kpi-b98f895e34af.json")
SITE_URL = os.environ.get("GSC_SITE_URL", "https://deepakbagada.in")
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"

if not os.path.exists(KEY_PATH):
    print(f"Error: Credentials file not found at {KEY_PATH}")
    sys.exit(1)

def ping_sitemap():
    print(f"📡 Submitting Sitemap to Google Search Console: {SITEMAP_URL}")
    try:
        creds_sc = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/webmasters"]
        )
        service_sc = build("searchconsole", "v1", credentials=creds_sc)
        service_sc.sitemaps().submit(siteUrl=f"{SITE_URL}/", feedpath=SITEMAP_URL).execute()
        res = service_sc.sitemaps().get(siteUrl=f"{SITE_URL}/", feedpath=SITEMAP_URL).execute()
        print(f"✅ Sitemap successfully submitted and downloaded by Googlebot!")
        print(f"   Submitted URLs: {res.get('contents', [{}])[0].get('submitted', 'N/A')}")
        print(f"   Last Downloaded: {res.get('lastDownloaded', 'N/A')}")
        print(f"   Errors: {res.get('errors', '0')} | Warnings: {res.get('warnings', '0')}")
    except Exception as e:
        print(f"❌ Error submitting sitemap: {e}")

def notify_indexing_api(urls, action="URL_UPDATED"):
    print(f"\n🚀 Sending {len(urls)} URLs to Google Indexing API (type={action})...")
    try:
        creds_idx = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        service_idx = build("indexing", "v3", credentials=creds_idx)

        success = 0
        for i, u in enumerate(urls, 1):
            try:
                body = {"url": u, "type": action}
                res = service_idx.urlNotifications().publish(body=body).execute()
                print(f"  [{i}/{len(urls)}] ✓ {u}")
                success += 1
                time.sleep(0.08)
            except Exception as e:
                print(f"  [{i}/{len(urls)}] ✗ {u} -> {e}")
        print(f"\n✅ Indexing Complete: {success}/{len(urls)} URLs successfully submitted to Google.")
    except Exception as e:
        print(f"Indexing API Error: {e}")

def main():
    # 1. Ping GSC sitemap
    ping_sitemap()

    # 2. Collect core URLs
    urls_to_index = [
        f"{SITE_URL}/",
        f"{SITE_URL}/products",
        f"{SITE_URL}/journal",
        f"{SITE_URL}/tools",
        f"{SITE_URL}/tools/pdf-compress",
        f"{SITE_URL}/library",
        f"{SITE_URL}/services",
        f"{SITE_URL}/about",
        f"{SITE_URL}/contact",
    ]

    # 3. Add products from config
    try:
        res = subprocess.run(["php", "artisan", "tinker", "--execute=echo json_encode(collect(config(\"products\"))->pluck(\"slug\"));"], capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            product_slugs = json.loads(res.stdout.strip())
            for slug in product_slugs:
                urls_to_index.append(f"{SITE_URL}/products/{slug}")
    except Exception:
        pass

    # 4. Add latest journal articles
    try:
        res_posts = subprocess.run(["php", "artisan", "tinker", "--execute=echo json_encode(collect(require \"data/posts.php\")->sortByDesc(\"published_at\")->take(15)->pluck(\"slug\"));"], capture_output=True, text=True)
        if res_posts.returncode == 0 and res_posts.stdout.strip():
            journal_slugs = json.loads(res_posts.stdout.strip())
            for slug in journal_slugs:
                urls_to_index.append(f"{SITE_URL}/journal/{slug}")
    except Exception:
        pass

    urls_to_index = list(dict.fromkeys(urls_to_index))
    notify_indexing_api(urls_to_index)

if __name__ == "__main__":
    main()
