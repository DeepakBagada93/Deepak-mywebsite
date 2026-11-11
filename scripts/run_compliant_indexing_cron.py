#!/usr/bin/env python3
"""
scripts/run_compliant_indexing_cron.py
Deepak Bagada (deepakbagada.in) — 100% Google Guideline-Compliant Indexing Cron Engine

Strict Compliance & Anti-Spam Guardrails:
1. Pacing & Throttling: Enforces 250ms-350ms delays between calls (prevents burst spamming & 429 errors).
2. Preflight Gate: Strictly verifies HTTP 200 OK before notifying Google (prevents 404/redirect crawl pollution).
3. Anti-Spam Fair Rotation:
   - Tier 1: Fresh & newly published URLs (highest priority).
   - Tier 2: Core conversion hubs & products (once every cooldown cycle, e.g. 4-7 days).
   - Tier 3: Oldest-submitted archival journal posts & library items (fair circular queue across 630+ URLs).
4. Idempotency & Cooldown: Never submits the same URL twice in 24 hours.
5. Quota Guard: Safe daily batch cap (default 80-100 URLs, ceiling 180), leaving buffer for real-time publishing.
6. GSC Sitemap Auto-Ping: Always notifies Search Console to refresh sitemap index.
7. Structured Logging: Appends audit entries to .agent/logs/google_indexing_cron.log.

Usage:
  .venv/bin/python3 scripts/run_compliant_indexing_cron.py
  .venv/bin/python3 scripts/run_compliant_indexing_cron.py --dry-run
  .venv/bin/python3 scripts/run_compliant_indexing_cron.py --batch-size=60
"""

import sys
import os
import json
import time
import argparse
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY_PATH = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", os.path.join(BASE_DIR, "saasnext-kpi-b98f895e34af.json"))
SITE_URL = os.environ.get("GSC_SITE_URL", "https://deepakbagada.in")
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"

QUOTA_FILE = os.path.join(BASE_DIR, ".agent", "indexing_quota.json")
HISTORY_FILE = os.path.join(BASE_DIR, ".agent", "google_indexing_history.json")
LOG_FILE = os.path.join(BASE_DIR, ".agent", "logs", "google_indexing_cron.log")

MAX_DAILY_QUOTA = 180      # Safe ceiling (Google absolute cap is 200/day)
DEFAULT_BATCH_SIZE = 80    # Balanced daily rotation (cycles all 630+ pages across ~7 days)
DEFAULT_COOLDOWN_DAYS = 4  # Minimum days before submitting the same unchanged URL again
REQUEST_SLEEP_SEC = 0.30   # 300ms pacing delay between API calls (anti-burst)


def log_message(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{ts}] {msg}"
    print(formatted)
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(formatted + "\n")
    except Exception:
        pass


def get_daily_quota_used():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if os.path.exists(QUOTA_FILE):
        try:
            with open(QUOTA_FILE, "r", encoding="utf-8") as f:
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
        with open(QUOTA_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "date": today,
                "count": new_count,
                "last_updated": datetime.now(timezone.utc).isoformat()
            }, f, indent=2)
    except Exception:
        pass
    return new_count


def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_history(history):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        log_message(f"Warning: Failed to save history: {e}")


def verify_http_200(url, timeout=6):
    """Preflight check: only notify Google of healthy live HTTP 200 pages."""
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; GoogleIndexingSentinel/2.0; +https://deepakbagada.in)"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status == 200
    except Exception:
        return False


def ping_sitemap(service_sc):
    """Ping Google Search Console to refresh the sitemap index."""
    log_message(f"📡 Pinging GSC Sitemap: {SITEMAP_URL}")
    try:
        service_sc.sitemaps().submit(siteUrl=f"{SITE_URL}/", feedpath=SITEMAP_URL).execute()
        res = service_sc.sitemaps().get(siteUrl=f"{SITE_URL}/", feedpath=SITEMAP_URL).execute()
        submitted = res.get("contents", [{}])[0].get("submitted", "N/A")
        downloaded = res.get("lastDownloaded", "N/A")
        log_message(f"✓ Sitemap ping successful in GSC (Submitted: {submitted}, Last Crawled: {downloaded})")
        return True
    except Exception as e:
        log_message(f"✗ Sitemap ping warning: {e}")
        return False


def fetch_sitemap_urls():
    """Fetch and parse all live URLs from the XML sitemap."""
    try:
        req = urllib.request.Request(SITEMAP_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12) as response:
            xml_data = response.read()
        root = ET.fromstring(xml_data)
        urls = [elem.text.strip() for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if elem.text]
        # Filter out any accidental legacy /public/ paths
        clean_urls = [u for u in urls if "/public/" not in u]
        if len(clean_urls) < len(urls):
            log_message(f"⚠️ Filtered out {len(urls) - len(clean_urls)} legacy /public/ URLs from sitemap rotation")
        return clean_urls
    except Exception as e:
        log_message(f"✗ Failed to read sitemap at {SITEMAP_URL}: {e}")
        return []


def build_rotating_queue(all_urls, history, batch_limit, cooldown_days):
    """
    Intelligent Anti-Spam Queue Builder:
    1. Excludes URLs submitted today (idempotency guard).
    2. Prioritizes fresh/never-submitted URLs (Tier 1).
    3. Selects core money hubs (products, services) if past cooldown (Tier 2).
    4. Fair circular rotation of oldest submitted archival content (Tier 3).
    """
    now = datetime.now(timezone.utc)
    today_str = now.strftime("%Y-%m-%d")
    cooldown_cutoff = now - timedelta(days=cooldown_days)

    never_submitted = []
    eligible_urls = []

    for u in all_urls:
        meta = history.get(u)
        if not meta:
            never_submitted.append(u)
            continue

        last_sub_str = meta.get("last_submitted")
        if not last_sub_str:
            never_submitted.append(u)
            continue

        try:
            last_sub_dt = datetime.fromisoformat(last_sub_str.replace("Z", "+00:00"))
        except Exception:
            never_submitted.append(u)
            continue

        # Skip if submitted today
        if last_sub_dt.strftime("%Y-%m-%d") == today_str:
            continue

        # Eligible if beyond cooldown window
        if last_sub_dt <= cooldown_cutoff:
            eligible_urls.append((u, last_sub_dt))

    # Sort eligible URLs by oldest last_submitted timestamp (circular fair queue)
    eligible_urls.sort(key=lambda x: x[1])

    # Tier 1 & 2: Segregate core hubs and products
    core_prefixes = ("/products", "/services", "/library", "/tools")
    tier_core = []
    tier_archive = []

    for u, _ in eligible_urls:
        path = u.replace(SITE_URL, "")
        if u == f"{SITE_URL}/" or any(path.startswith(cp) for cp in core_prefixes):
            tier_core.append(u)
        else:
            tier_archive.append(u)

    # Combine: Never submitted first, then balanced core hubs, then archival rotation
    queue = []
    for u in never_submitted:
        if u not in queue:
            queue.append(u)

    # Add core hubs (up to 15 per run to prevent dominating the batch)
    for u in tier_core[:15]:
        if u not in queue:
            queue.append(u)

    # Fill remainder with oldest archival items
    for u in tier_archive:
        if len(queue) >= batch_limit:
            break
        if u not in queue:
            queue.append(u)

    return queue[:batch_limit]


def run_cron(batch_size=DEFAULT_BATCH_SIZE, cooldown_days=DEFAULT_COOLDOWN_DAYS, dry_run=False, ignore_quota_dryrun=False):
    log_message("=========================================================================")
    log_message("🌐 DEEPAK BAGADA — GOOGLE COMPLIANT INDEXING CRON ENGINE (v2.0)")
    log_message(f"Mode: {'DRY-RUN (Simulated)' if dry_run else 'LIVE PRODUCTION'}")
    log_message(f"Config: Batch Size={batch_size} | Cooldown={cooldown_days} days | Pacing={int(REQUEST_SLEEP_SEC*1000)}ms")
    log_message("=========================================================================")

    if not os.path.exists(KEY_PATH):
        log_message(f"❌ Error: Service account key not found at {KEY_PATH}")
        sys.exit(1)

    # 1. Initialize API credentials
    try:
        creds_sc = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/webmasters"]
        )
        service_sc = build("searchconsole", "v1", credentials=creds_sc)

        creds_idx = service_account.Credentials.from_service_account_file(
            KEY_PATH,
            scopes=["https://www.googleapis.com/auth/indexing"]
        )
        service_idx = build("indexing", "v3", credentials=creds_idx)
    except Exception as e:
        log_message(f"❌ Credentials Error: {e}")
        sys.exit(1)

    # 2. Ping Search Console sitemap
    if not dry_run:
        ping_sitemap(service_sc)

    # 3. Quota check
    quota_used = get_daily_quota_used()
    quota_remaining = max(0, MAX_DAILY_QUOTA - quota_used)
    log_message(f"📊 Daily Google API Quota: {quota_used}/{MAX_DAILY_QUOTA} used ({quota_remaining} remaining today)")

    if quota_remaining <= 0 and not (dry_run and ignore_quota_dryrun):
        log_message("✅ Daily quota ceiling reached (180/180). Exiting gracefully to protect API reputation.")
        return

    effective_batch = min(batch_size, quota_remaining if not (dry_run and ignore_quota_dryrun) else batch_size)

    # 4. Fetch sitemap URLs
    all_urls = fetch_sitemap_urls()
    log_message(f"✓ Found {len(all_urls)} total URLs in live sitemap.xml")
    if not all_urls:
        log_message("❌ No URLs found in sitemap. Aborting.")
        return

    # 5. Build intelligent rotating queue
    history = load_history()
    queue = build_rotating_queue(all_urls, history, effective_batch, cooldown_days)
    log_message(f"📋 Candidate queue selected: {len(queue)} URLs for rotation")

    if not queue:
        log_message("✅ All URLs are fresh and within cooldown window. No indexing dispatch required today.")
        return

    # 6. Execute Dispatch Loop with Anti-Burst Pacing & Preflight Gate
    success_count = 0
    skipped_count = 0
    now_iso = datetime.now(timezone.utc).isoformat()

    for i, url in enumerate(queue, 1):
        # Preflight verification
        if not verify_http_200(url):
            log_message(f"  [{i}/{len(queue)}] ⚠️ Preflight Failed (Non-200 status): {url} — Skipped")
            skipped_count += 1
            continue

        if dry_run:
            log_message(f"  [{i}/{len(queue)}] [SIMULATED] ✓ {url}")
            success_count += 1
            continue

        # Submit to Google Indexing API
        try:
            body = {"url": url, "type": "URL_UPDATED"}
            res = service_idx.urlNotifications().publish(body=body).execute()
            success_count += 1
            record_quota_used(1)

            # Update history entry
            prev_entry = history.get(url, {})
            history[url] = {
                "last_submitted": now_iso,
                "status": 200,
                "submission_count": prev_entry.get("submission_count", 0) + 1
            }

            log_message(f"  [{i}/{len(queue)}] ✓ {url}")
            time.sleep(REQUEST_SLEEP_SEC)

        except HttpError as he:
            if he.resp.status == 429:
                log_message(f"  [{i}/{len(queue)}] 🛑 Google 429 Rate Limit Encountered. Halting gracefully.")
                record_quota_used(MAX_DAILY_QUOTA)
                break
            else:
                log_message(f"  [{i}/{len(queue)}] ✗ {url} -> HTTP {he.resp.status}: {he}")
        except Exception as e:
            log_message(f"  [{i}/{len(queue)}] ✗ {url} -> Error: {e}")

    # 7. Persist updated history
    if not dry_run and success_count > 0:
        save_history(history)

    log_message("=========================================================================")
    log_message(f"🎉 Batch Complete: {success_count} submitted, {skipped_count} skipped.")
    log_message(f"📈 Total Daily Quota Now: {get_daily_quota_used()}/{MAX_DAILY_QUOTA}")
    log_message("=========================================================================\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Google Guideline-Compliant Indexing Cron")
    parser.add_argument("--dry-run", action="store_true", help="Simulate execution without calling Google Indexing API")
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE, help=f"Number of URLs per run (default: {DEFAULT_BATCH_SIZE})")
    parser.add_argument("--cooldown-days", type=int, default=DEFAULT_COOLDOWN_DAYS, help=f"Minimum days between submissions for a URL (default: {DEFAULT_COOLDOWN_DAYS})")
    parser.add_argument("--ignore-quota-for-dry-run", action="store_true", help="Bypass quota check during dry-run simulation only")
    args = parser.parse_args()

    run_cron(batch_size=args.batch_size, cooldown_days=args.cooldown_days, dry_run=args.dry_run, ignore_quota_dryrun=args.ignore_quota_for_dry_run)
