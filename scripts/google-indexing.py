#!/usr/bin/env python3
"""
google-indexing.py — Automated Google Indexing & Sitemaps Dispatcher (v2.0)
Uses Google Indexing API (URL Notifications) & Google Search Console API.
Features quota guardrails, HTTP 200 verification, and graceful 429 rate limit protection.
"""

import sys
import os
import json
import time
import argparse
import subprocess
import urllib.request
import urllib.error
from datetime import datetime, timezone
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

KEY_PATH = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "saasnext-kpi-b98f895e34af.json")
if not os.path.isabs(KEY_PATH):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    candidate = os.path.join(base_dir, KEY_PATH)
    if os.path.exists(candidate):
        KEY_PATH = candidate

SITE_URL = os.environ.get("GSC_SITE_URL", "https://deepakbagada.in")
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"
QUOTA_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".agent", "indexing_quota.json")
MAX_DAILY_QUOTA = 190  # Google API daily cap is 200; buffer of 10 requests

if not os.path.exists(KEY_PATH):
    print(f"Error: Credentials file not found at {KEY_PATH}")
    sys.exit(1)


def get_daily_quota_used():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if os.path.exists(QUOTA_FILE):
        try:
            with open(QUOTA_FILE, "r") as f:
                data = json.load(f)
                if data.get("date") == today:
                    return data.get("count", 0)
        except Exception:
            pass
    return 0


def record_quota_used(added=1):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    current = get_daily_quota_used()
    new_count = current + added
    os.makedirs(os.path.dirname(QUOTA_FILE), exist_ok=True)
    try:
        with open(QUOTA_FILE, "w") as f:
            json.dump({"date": today, "count": new_count, "last_updated": datetime.now(timezone.utc).isoformat()}, f, indent=2)
    except Exception:
        pass
    return new_count


def verify_http_200(url, timeout=5):
    """Ensure URL is live and returns HTTP 200 before notifying Google."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Google-Indexing-Preflight/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status == 200
    except urllib.error.HTTPError as e:
        return False
    except Exception:
        return False


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
        print(f"✅ Sitemap successfully submitted and refreshed in Google Search Console!")
        print(f"   Submitted URLs: {res.get('contents', [{}])[0].get('submitted', 'N/A')}")
        print(f"   Last Downloaded: {res.get('lastDownloaded', 'N/A')}")
        print(f"   Errors: {res.get('errors', '0')} | Warnings: {res.get('warnings', '0')}")
        return True
    except Exception as e:
        print(f"❌ Error submitting sitemap: {e}")
        return False


def notify_indexing_api(urls, action="URL_UPDATED", skip_preflight=False):
    if not urls:
        print("No URLs provided to index.")
        return 0

    quota_used = get_daily_quota_used()
    quota_remaining = max(0, MAX_DAILY_QUOTA - quota_used)
    print(f"📊 Google Indexing API Daily Quota: {quota_used}/{MAX_DAILY_QUOTA} used ({quota_remaining} remaining today)")

    if quota_remaining <= 0:
        print(f"⚠️ Daily quota limit reached ({quota_used}/{MAX_DAILY_QUOTA}). Skipping Indexing API notification to prevent 429 errors.")
        print("ℹ️ Note: Sitemap refresh was submitted and Googlebot will crawl asynchronously.")
        return 0

    urls_to_submit = urls[:quota_remaining]
    if len(urls) > quota_remaining:
        print(f"⚠️ Truncating batch from {len(urls)} to {quota_remaining} to respect daily quota.")

    print(f"\n🚀 Sending {len(urls_to_submit)} URLs to Google Indexing API (type={action})...")
    try:
        creds_idx = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        service_idx = build("indexing", "v3", credentials=creds_idx)

        success = 0
        quota_hit = False

        for i, u in enumerate(urls_to_submit, 1):
            if not skip_preflight:
                if not verify_http_200(u):
                    print(f"  [{i}/{len(urls_to_submit)}] ⚠️ Skipped (non-200 HTTP status): {u}")
                    continue

            try:
                body = {"url": u, "type": action}
                res = service_idx.urlNotifications().publish(body=body).execute()
                print(f"  [{i}/{len(urls_to_submit)}] ✓ {u}")
                success += 1
                record_quota_used(1)
                time.sleep(0.08)
            except HttpError as he:
                if he.resp.status == 429:
                    print(f"  [{i}/{len(urls_to_submit)}] 🛑 429 Rate limit / Daily quota reached from Google. Halting gracefully.")
                    record_quota_used(MAX_DAILY_QUOTA)
                    quota_hit = True
                    break
                else:
                    print(f"  [{i}/{len(urls_to_submit)}] ✗ {u} -> {he}")
            except Exception as e:
                print(f"  [{i}/{len(urls_to_submit)}] ✗ {u} -> {e}")

        print(f"✅ Indexing Complete: {success}/{len(urls_to_submit)} URLs successfully submitted to Google.")
        return success
    except Exception as e:
        print(f"Indexing API Error: {e}")
        return 0


def inspect_urls(urls):
    """Inspect URLs in Google Search Console URL Inspection API."""
    print(f"\n🔍 Inspecting {len(urls)} URLs in Google Search Console...")
    try:
        creds_sc = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
        service_sc = build("searchconsole", "v1", credentials=creds_sc)
        results = []
        for i, u in enumerate(urls, 1):
            try:
                res = service_sc.urlInspection().index().inspect(body={
                    "inspectionUrl": u,
                    "siteUrl": f"{SITE_URL}/"
                }).execute()
                r = res.get("inspectionResult", {}).get("indexStatusResult", {})
                verdict = r.get("verdict", "UNKNOWN")
                cov = r.get("coverageState", "UNKNOWN")
                crawled = r.get("lastCrawlTime", "Never")
                print(f"  [{i}/{len(urls)}] {verdict} ({cov}) -> {u} (crawled: {crawled})")
                results.append({"url": u, "verdict": verdict, "coverage": cov, "lastCrawlTime": crawled})
            except Exception as e:
                print(f"  [{i}/{len(urls)}] Error inspecting {u}: {e}")
                results.append({"url": u, "error": str(e)})
        return results
    except Exception as e:
        print(f"Inspection API Error: {e}")
        return []


def main():
    parser = argparse.ArgumentParser(description="Google Indexing & Sitemap Dispatcher v2.0")
    parser.add_argument("--url", help="Single URL to submit for indexing")
    parser.add_argument("--urls", help="Comma-separated list of URLs to index")
    parser.add_argument("--ping-only", action="store_true", help="Only ping sitemap in GSC")
    parser.add_argument("--skip-sitemap", action="store_true", help="Do not ping sitemap")
    parser.add_argument("--inspect", action="store_true", help="Inspect URL status instead of publishing")
    parser.add_argument("--skip-preflight", action="store_true", help="Skip HTTP 200 preflight check")
    args = parser.parse_args()

    if not args.skip_sitemap and not args.inspect:
        ping_sitemap()

    if args.ping_only:
        return

    if args.url:
        urls = [args.url.strip()]
        if args.inspect:
            inspect_urls(urls)
        else:
            notify_indexing_api(urls, skip_preflight=args.skip_preflight)
        return

    if args.urls:
        urls = [u.strip() for u in args.urls.split(",") if u.strip()]
        if args.inspect:
            inspect_urls(urls)
        else:
            notify_indexing_api(urls, skip_preflight=args.skip_preflight)
        return

    # Default: Collect core URLs and latest items
    urls_to_index = [
        f"{SITE_URL}/",
        f"{SITE_URL}/products",
        f"{SITE_URL}/journal",
        f"{SITE_URL}/tools",
        f"{SITE_URL}/library",
        f"{SITE_URL}/services",
        f"{SITE_URL}/about",
        f"{SITE_URL}/contact",
        f"{SITE_URL}/stack",
    ]

    try:
        res = subprocess.run(["php", "artisan", "tinker", "--execute=echo json_encode(collect(config(\"products\"))->pluck(\"slug\"));"], capture_output=True, text=True)
        if res.returncode == 0 and res.stdout.strip():
            product_slugs = json.loads(res.stdout.strip())
            for slug in product_slugs:
                urls_to_index.append(f"{SITE_URL}/products/{slug}")
    except Exception:
        pass

    try:
        res_posts = subprocess.run(["php", "artisan", "tinker", "--execute=echo json_encode(collect(require \"data/posts.php\")->sortByDesc(\"published_at\")->take(10)->pluck(\"slug\"));"], capture_output=True, text=True)
        if res_posts.returncode == 0 and res_posts.stdout.strip():
            journal_slugs = json.loads(res_posts.stdout.strip())
            for slug in journal_slugs:
                urls_to_index.append(f"{SITE_URL}/journal/{slug}")
    except Exception:
        pass

    urls_to_index = list(dict.fromkeys(urls_to_index))
    if args.inspect:
        inspect_urls(urls_to_index)
    else:
        notify_indexing_api(urls_to_index, skip_preflight=args.skip_preflight)


if __name__ == "__main__":
    main()
