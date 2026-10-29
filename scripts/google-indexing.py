#!/usr/bin/env python3
"""
google-indexing.py — Automated Google Indexing & Sitemaps Dispatcher
Uses Google Indexing API (URL Notifications) & Google Search Console API.
"""

import sys
import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_PATH = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "saasnext-kpi-b98f895e34af.json")
SITE_URL = os.environ.get("GSC_SITE_URL", "https://deepakbagada.in/")
SITEMAP_URL = "https://deepakbagada.in/sitemap.xml"

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
        service_sc.sitemaps().submit(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
        res = service_sc.sitemaps().get(siteUrl=SITE_URL, feedpath=SITEMAP_URL).execute()
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
        for u in urls:
            try:
                body = {"url": u, "type": action}
                res = service_idx.urlNotifications().publish(body=body).execute()
                print(f"  ✓ {u} -> Notification sent at {res.get('urlNotificationMetadata', {}).get('latestUpdate', {}).get('notifyTime')}")
                success += 1
            except Exception as e:
                err_str = str(e)
                if "Permission denied. Failed to verify the URL ownership" in err_str:
                    print(f"  ⚠ Ownership Permission Required in GSC: To use urlNotifications directly, the service account must be given 'Owner' role in Search Console Settings > Users.")
                    break
                else:
                    print(f"  ✗ {u} -> {e}")
        if success > 0:
            print(f"✅ Successfully notified {success}/{len(urls)} URLs to Google Indexing API.")
    except Exception as e:
        print(f"Indexing API Error: {e}")

def main():
    # 1. Always ping GSC sitemap
    ping_sitemap()

    # 2. Extract product URLs from config
    product_urls = [
        "https://deepakbagada.in/products",
        "https://deepakbagada.in/products/agent-skills-master-bundle",
        "https://deepakbagada.in/products/mcp-server-launch-kit",
        "https://deepakbagada.in/products/agent-context-architect",
        "https://deepakbagada.in/products/n8n-hardening-pack",
        "https://deepakbagada.in/products/ai-lead-intelligence-engine",
        "https://deepakbagada.in/products/ai-support-triage-sentinel",
        "https://deepakbagada.in/products/ai-content-factory-pipeline",
        "https://deepakbagada.in/products/bharat-local-seo-kit",
        "https://deepakbagada.in/products/d2c-roas-anti-rto-engine",
        "https://deepakbagada.in/products/global-client-hunter-os",
        "https://deepakbagada.in/products/india-offer-pricing-kit",
        "https://deepakbagada.in/products/ad-creative-lab",
        "https://deepakbagada.in/products/codebase-context-engine",
    ]

    notify_indexing_api(product_urls)

if __name__ == "__main__":
    main()
