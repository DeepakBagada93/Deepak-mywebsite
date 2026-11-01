#!/usr/bin/env python3
"""
sentinel.py — Google Indexing Sentinel CLI
Autonomous verification, indexing dispatch, GSC inspection, and performance auditing.
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

# Resolve project root (5 levels up from sentinel.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
KEY_PATH = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", os.path.join(BASE_DIR, "saasnext-kpi-b98f895e34af.json"))
if not os.path.exists(KEY_PATH):
    candidate = os.path.join(BASE_DIR, "saasnext-kpi-b98f895e34af.json")
    if os.path.exists(candidate):
        KEY_PATH = candidate
SITE_URL = "https://deepakbagada.in"
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"
QUOTA_FILE = os.path.join(BASE_DIR, ".agent", "indexing_quota.json")
MAX_DAILY_QUOTA = 190

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
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Google-Indexing-Sentinel/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status == 200
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
        print(f"✅ Sitemap successfully refreshed!")
        print(f"   Submitted URLs: {res.get('contents', [{}])[0].get('submitted', 'N/A')}")
        print(f"   Last Downloaded: {res.get('lastDownloaded', 'N/A')}")
        return res
    except Exception as e:
        print(f"❌ Error submitting sitemap: {e}")
        return None


def submit_urls(urls):
    quota_used = get_daily_quota_used()
    quota_remaining = max(0, MAX_DAILY_QUOTA - quota_used)
    print(f"📊 Daily Quota: {quota_used}/{MAX_DAILY_QUOTA} used ({quota_remaining} remaining today)")

    if quota_remaining <= 0:
        print(f"⚠️ Daily quota reached. Skipping Google Indexing API submission.")
        return 0

    to_submit = urls[:quota_remaining]
    try:
        creds_idx = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        service_idx = build("indexing", "v3", credentials=creds_idx)
        success = 0

        for i, u in enumerate(to_submit, 1):
            if not verify_http_200(u):
                print(f"  [{i}/{len(to_submit)}] ⚠️ Skipping non-200 URL: {u}")
                continue
            try:
                body = {"url": u, "type": "URL_UPDATED"}
                service_idx.urlNotifications().publish(body=body).execute()
                print(f"  [{i}/{len(to_submit)}] ✓ Submitted: {u}")
                success += 1
                record_quota_used(1)
                time.sleep(0.08)
            except HttpError as he:
                if he.resp.status == 429:
                    print(f"  [{i}/{len(to_submit)}] 🛑 Google 429 Rate limit reached. Stopping batch.")
                    record_quota_used(MAX_DAILY_QUOTA)
                    break
                else:
                    print(f"  [{i}/{len(to_submit)}] ✗ Error: {u} -> {he}")
            except Exception as e:
                print(f"  [{i}/{len(to_submit)}] ✗ Error: {u} -> {e}")

        print(f"✅ Successfully notified Google for {success}/{len(to_submit)} URLs.")
        return success
    except Exception as e:
        print(f"Indexing API Error: {e}")
        return 0


def audit_indexing():
    print("🔍 Auditing Live Indexation Status Across Site Core & Products...")
    creds_sc = service_account.Credentials.from_service_account_file(
        KEY_PATH,
        scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
    )
    service_sc = build("searchconsole", "v1", credentials=creds_sc)

    urls = [
        f"{SITE_URL}/",
        f"{SITE_URL}/products",
        f"{SITE_URL}/journal",
        f"{SITE_URL}/services",
        f"{SITE_URL}/tools",
        f"{SITE_URL}/library",
        f"{SITE_URL}/stack",
        f"{SITE_URL}/about",
        f"{SITE_URL}/contact"
    ]

    try:
        res = subprocess.run(["php", "artisan", "tinker", "--execute=echo json_encode(collect(config(\"products\"))->pluck(\"slug\"));"], capture_output=True, text=True, cwd=BASE_DIR)
        if res.returncode == 0 and res.stdout.strip():
            for slug in json.loads(res.stdout.strip()):
                urls.append(f"{SITE_URL}/products/{slug}")
    except Exception:
        pass

    results = []
    indexed_count = 0
    discovered_count = 0
    unknown_count = 0

    for i, u in enumerate(urls, 1):
        try:
            r = service_sc.urlInspection().index().inspect(body={
                "inspectionUrl": u,
                "siteUrl": f"{SITE_URL}/"
            }).execute().get("inspectionResult", {}).get("indexStatusResult", {})

            verdict = r.get("verdict", "UNKNOWN")
            cov = r.get("coverageState", "UNKNOWN")
            crawled = r.get("lastCrawlTime")

            if verdict == "PASS":
                indexed_count += 1
                icon = "✅"
            elif "Discovered" in cov:
                discovered_count += 1
                icon = "🟡"
            else:
                unknown_count += 1
                icon = "⚪"

            print(f"  [{i}/{len(urls)}] {icon} {verdict} ({cov}) -> {u.replace(SITE_URL, '') or '/'}")
            results.append({"url": u, "verdict": verdict, "coverage": cov, "lastCrawlTime": crawled})
        except Exception as e:
            print(f"  [{i}/{len(urls)}] ✗ Error inspecting {u}: {e}")
            results.append({"url": u, "error": str(e)})

    print(f"\n📊 Indexing Audit Summary:")
    print(f"   Total Audited: {len(urls)}")
    print(f"   Indexed (PASS): {indexed_count} ({round(indexed_count/len(urls)*100, 1)}%)")
    print(f"   Discovered (Needs crawl/links): {discovered_count}")
    print(f"   Other/Unknown: {unknown_count}")

    report_path = os.path.join(BASE_DIR, "research", "indexing_audit_latest.json")
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w") as f:
        json.dump({"summary": {"total": len(urls), "indexed": indexed_count, "discovered": discovered_count}, "urls": results}, f, indent=2)
    print(f"💾 Full audit saved to {report_path}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Google Indexing Sentinel")
    parser.add_argument("--audit", action="store_true", help="Audit all core pages and products")
    parser.add_argument("--sitemap", action="store_true", help="Ping sitemap in GSC")
    parser.add_argument("--url", help="Submit specific URL for indexing")
    args = parser.parse_args()

    if args.sitemap:
        ping_sitemap()
    elif args.url:
        submit_urls([args.url.strip()])
    elif args.audit:
        audit_indexing()
    else:
        ping_sitemap()
        audit_indexing()


if __name__ == "__main__":
    main()
