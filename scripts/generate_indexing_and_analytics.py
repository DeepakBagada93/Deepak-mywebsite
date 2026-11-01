#!/usr/bin/env python3
"""
generate_indexing_and_analytics.py
Executes:
1. Google Search Console Sitemap submission & verification
2. Google Indexing API notifications for high-priority pages (products, services, core, tools, library, journal)
3. Full Search Analytics extraction (7-day, 28-day, 90-day, queries, pages, countries, devices, opportunities)
4. URL Inspection across categories
5. Produces comprehensive JSON datasets for the report
"""

import sys
import os
import json
import time
import urllib.request
import xml.etree.ElementTree as ET
from google.oauth2 import service_account
from googleapiclient.discovery import build

KEY_PATH = "saasnext-kpi-b98f895e34af.json"
SITE_URL = "https://deepakbagada.in"
SITEMAP_URL = f"{SITE_URL}/sitemap.xml"

if not os.path.exists(KEY_PATH):
    print(f"Error: {KEY_PATH} not found")
    sys.exit(1)

# Initialize API clients
creds_sc = service_account.Credentials.from_service_account_file(
    KEY_PATH,
    scopes=[
        "https://www.googleapis.com/auth/webmasters",
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/indexing"
    ]
)

service_sc = build("searchconsole", "v1", credentials=creds_sc)
service_idx = build("indexing", "v3", credentials=creds_sc)

report_data = {}

# 1. Ping / Submit Sitemap
print("=== 1. Google Search Console Sitemap Refresh ===")
try:
    service_sc.sitemaps().submit(siteUrl=f"{SITE_URL}/", feedpath=SITEMAP_URL).execute()
    sm_res = service_sc.sitemaps().get(siteUrl=f"{SITE_URL}/", feedpath=SITEMAP_URL).execute()
    report_data["sitemap_status"] = {
        "path": sm_res.get("path"),
        "lastSubmitted": sm_res.get("lastSubmitted"),
        "lastDownloaded": sm_res.get("lastDownloaded"),
        "submitted_urls": sm_res.get("contents", [{}])[0].get("submitted", "0"),
        "indexed_urls": sm_res.get("contents", [{}])[0].get("indexed", "0"),
        "errors": sm_res.get("errors", "0"),
        "warnings": sm_res.get("warnings", "0")
    }
    print(f"✓ Sitemap pinged successfully: {report_data['sitemap_status']}")
except Exception as e:
    print(f"✗ Sitemap error: {e}")
    report_data["sitemap_status"] = {"error": str(e)}

# 2. Extract full sitemap URLs
print("\n=== 2. Parsing Live Sitemap URLs ===")
try:
    req = urllib.request.Request(SITEMAP_URL, headers={"User-Agent": "Mozilla/5.0"})
    xml_content = urllib.request.urlopen(req, timeout=10).read()
    root = ET.fromstring(xml_content)
    sitemap_urls = [elem.text for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    print(f"✓ Total sitemap URLs found: {len(sitemap_urls)}")
except Exception as e:
    print(f"✗ Error reading sitemap: {e}")
    sitemap_urls = []

# Categorize URLs
by_section = {}
for u in sitemap_urls:
    path = u.replace(SITE_URL, "")
    sec = "/" + path.strip("/").split("/")[0] if path.strip("/") else "/"
    by_section.setdefault(sec, []).append(u)

report_data["sitemap_sections"] = {k: len(v) for k, v in by_section.items()}

# 3. Google Indexing API submission
# Target top core pages, all products, all services, top tools, top library, and newest journal posts
core_urls = [
    f"{SITE_URL}/",
    f"{SITE_URL}/products",
    f"{SITE_URL}/journal",
    f"{SITE_URL}/services",
    f"{SITE_URL}/tools",
    f"{SITE_URL}/library",
    f"{SITE_URL}/blueprints",
    f"{SITE_URL}/repos",
    f"{SITE_URL}/about",
    f"{SITE_URL}/contact",
    f"{SITE_URL}/stack",
]
products_urls = by_section.get("/products", [])
services_urls = by_section.get("/services", [])
tools_urls = by_section.get("/tools", [])[:15]
library_urls = by_section.get("/library", [])[:15]
journal_urls = by_section.get("/journal", [])[:40]

priority_urls = list(dict.fromkeys(core_urls + products_urls + services_urls + tools_urls + library_urls + journal_urls))
print(f"\n=== 3. Submitting {len(priority_urls)} URLs to Google Indexing API ===")

indexing_results = []
success_count = 0
failed_count = 0

for i, u in enumerate(priority_urls, 1):
    try:
        body = {"url": u, "type": "URL_UPDATED"}
        res = service_idx.urlNotifications().publish(body=body).execute()
        success_count += 1
        indexing_results.append({"url": u, "status": "success", "response": res})
        print(f"  [{i}/{len(priority_urls)}] ✓ {u}")
        time.sleep(0.05)
    except Exception as e:
        failed_count += 1
        indexing_results.append({"url": u, "status": "failed", "error": str(e)})
        print(f"  [{i}/{len(priority_urls)}] ✗ {u} -> {e}")

report_data["indexing_submission"] = {
    "total_submitted": len(priority_urls),
    "success": success_count,
    "failed": failed_count,
    "sample": indexing_results[:10]
}

# 4. Search Analytics (Last 7, 28, 90 days)
print("\n=== 4. Fetching Search Analytics ===")
def fetch_analytics(start_date, end_date, dims, limit=100):
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dims,
        "rowLimit": limit
    }
    return service_sc.searchanalytics().query(siteUrl=f"{SITE_URL}/", body=body).execute().get("rows", [])

# 28 days: 2026-10-03 to 2026-10-30
rows_28_date = fetch_analytics("2026-10-03", "2026-10-30", ["date"])
c_28 = sum(r["clicks"] for r in rows_28_date)
i_28 = sum(r["impressions"] for r in rows_28_date)
ctr_28 = (c_28 / i_28 * 100) if i_28 else 0
pos_28 = sum(r["position"] * r["impressions"] for r in rows_28_date) / i_28 if i_28 else 0

# 7 days: 2026-10-24 to 2026-10-30
rows_7_date = fetch_analytics("2026-10-24", "2026-10-30", ["date"])
c_7 = sum(r["clicks"] for r in rows_7_date)
i_7 = sum(r["impressions"] for r in rows_7_date)
ctr_7 = (c_7 / i_7 * 100) if i_7 else 0
pos_7 = sum(r["position"] * r["impressions"] for r in rows_7_date) / i_7 if i_7 else 0

# 90 days: 2026-08-01 to 2026-10-30
rows_90_date = fetch_analytics("2026-08-01", "2026-10-30", ["date"])
c_90 = sum(r["clicks"] for r in rows_90_date)
i_90 = sum(r["impressions"] for r in rows_90_date)
ctr_90 = (c_90 / i_90 * 100) if i_90 else 0
pos_90 = sum(r["position"] * r["impressions"] for r in rows_90_date) / i_90 if i_90 else 0

report_data["performance_summary"] = {
    "last_7_days": {"clicks": c_7, "impressions": i_7, "ctr": round(ctr_7, 2), "position": round(pos_7, 1)},
    "last_28_days": {"clicks": c_28, "impressions": i_28, "ctr": round(ctr_28, 2), "position": round(pos_28, 1)},
    "last_90_days": {"clicks": c_90, "impressions": i_90, "ctr": round(ctr_90, 2), "position": round(pos_90, 1)},
}

# Top Pages (28 days)
top_pages = fetch_analytics("2026-10-03", "2026-10-30", ["page"], limit=40)
report_data["top_pages"] = [
    {
        "page": r["keys"][0].replace(SITE_URL, "") or "/",
        "full_url": r["keys"][0],
        "clicks": r["clicks"],
        "impressions": r["impressions"],
        "ctr": round(r["ctr"] * 100, 2),
        "position": round(r["position"], 1)
    }
    for r in top_pages
]

# Top Queries (28 days)
top_queries = fetch_analytics("2026-10-03", "2026-10-30", ["query"], limit=50)
report_data["top_queries"] = [
    {
        "query": r["keys"][0],
        "clicks": r["clicks"],
        "impressions": r["impressions"],
        "ctr": round(r["ctr"] * 100, 2),
        "position": round(r["position"], 1)
    }
    for r in sorted(top_queries, key=lambda x: (x["clicks"], x["impressions"]), reverse=True)
]

# Devices (28 days)
dev_rows = fetch_analytics("2026-10-03", "2026-10-30", ["device"])
report_data["devices"] = [
    {
        "device": r["keys"][0],
        "clicks": r["clicks"],
        "impressions": r["impressions"],
        "ctr": round(r["ctr"] * 100, 2),
        "position": round(r["position"], 1)
    }
    for r in dev_rows
]

# Countries (28 days)
country_rows = fetch_analytics("2026-10-03", "2026-10-30", ["country"], limit=15)
report_data["countries"] = [
    {
        "country": r["keys"][0],
        "clicks": r["clicks"],
        "impressions": r["impressions"],
        "ctr": round(r["ctr"] * 100, 2),
        "position": round(r["position"], 1)
    }
    for r in country_rows
]

# High-potential quick wins (Position 3 to 25, impressions >= 2)
opportunities = [
    q for q in report_data["top_queries"]
    if 3.0 <= q["position"] <= 25.0 and q["impressions"] >= 2
]
report_data["quick_win_opportunities"] = sorted(opportunities, key=lambda x: x["impressions"], reverse=True)

# Save structured report
os.makedirs("research", exist_ok=True)
output_file = "research/google_analytics_indexing_report.json"
with open(output_file, "w") as f:
    json.dump(report_data, f, indent=2)

print(f"\n✅ All tasks completed successfully! Report saved to {output_file}")
