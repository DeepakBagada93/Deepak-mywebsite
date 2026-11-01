---
name: google-indexing-sentinel
description: >
  Autonomous Google Indexing, Sitemaps & Search Console Performance Sentinel for Deepak Bagada (deepakbagada.in).
  Guarantees 100% indexing health across digital products, journal posts, tools, library, and core architecture pages.
  Protects against Google Indexing API daily quota limits (200 requests/day cap), eliminates HTTP 429 rate limit errors,
  enforces HTTP 200 preflight checks to prevent submitting 404 or dead URLs, audits URL inspection states in GSC,
  resolves "Discovered - currently not indexed" via internal link blueprints, and surfaces high-intent quick-win queries (positions 3–15).
---

# 🛡️ Google Indexing & Search Console Sentinel (`google-indexing-sentinel` v1.0)
### (100% Indexing Health · Daily Quota Protection · Zero 429 Errors · Instant Sitemaps Sync · Quick-Win Query Harvesting)

> [!IMPORTANT]
> **CORE MISSION & ARCHITECTURAL GUARDRAILS**:
> 1. **Zero 429 Errors**: Google Indexing API enforces a hard ceiling of **200 publish requests/day per project**. This sentinel enforces a safe local counter buffer (max 190/day) and automatically halts or throttles before hitting Google's rate limiter.
> 2. **HTTP 200 Preflight Gate**: Never notify Google about a URL without verifying it responds with HTTP 200. Submitting 404s damages site crawl quality scores in Google Search Console.
> 3. **Orphan Page Elimination**: Any page with status `"Discovered - currently not indexed"` suffers from insufficient internal link equity. Resolve by adding contextual links from high-authority indexed pages (`/`, `/journal`, `/services`, or the global footer).
> 4. **Weekly & Event-Driven Sitemap Resubmission**: XML sitemaps must reflect the exact published URLs with accurate `lastmod` timestamps.

---

## 🛠️ CLI Quick Reference

The sentinel comes with a dedicated automation script located at [scripts/google-indexing.py](file:///Users/deepakbagada/saasnext%20project/my-website/scripts/google-indexing.py) and [.agent/skills/google-indexing-sentinel/scripts/sentinel.py](file:///Users/deepakbagada/saasnext%20project/my-website/.agent/skills/google-indexing-sentinel/scripts/sentinel.py).

```bash
# 1. Ping and refresh sitemap in Search Console:
.venv/bin/python3 scripts/google-indexing.py --ping-only

# 2. Submit a single newly published URL to Google Indexing API:
.venv/bin/python3 scripts/google-indexing.py --url https://deepakbagada.in/products/<slug>

# 3. Inspect a URL's live indexation and crawl status in Search Console:
.venv/bin/python3 scripts/google-indexing.py --inspect --url https://deepakbagada.in/products/<slug>

# 4. Run full indexing audit across all core pages & 27 digital products:
.venv/bin/python3 .agent/skills/google-indexing-sentinel/scripts/sentinel.py --audit
```

---

## 📋 The 5-Step Autonomous Indexing Workflow

### Step 1: Preflight Verification (HTTP 200)
Before triggering any indexing API call:
- Issue a HEAD or GET request to the target URL.
- Ensure the server returns `HTTP 200 OK`.
- If the URL returns 404, 500, or redirect, abort the notification and fix the routing/view first.

### Step 2: Quota Check (`.agent/indexing_quota.json`)
- Check current daily quota usage in `.agent/indexing_quota.json`.
- If `count >= 190`, do not submit via Indexing API. Rely on sitemap submission (`service_sc.sitemaps().submit`) which has no daily limit and queues asynchronous crawls.

### Step 3: Google Indexing API Dispatch (`URL_UPDATED`)
- Dispatch URL notification payload: `{"url": targetUrl, "type": "URL_UPDATED"}`.
- If Google returns HTTP 429 (`RATE_LIMIT_EXCEEDED`), catch the exception gracefully, set local quota to MAX, and exit without throwing fatal errors.

### Step 4: URL Inspection Audit in Search Console
Query the URL Inspection API (`searchconsole.v1.urlInspection.index.inspect`):
- **`PASS (Submitted and indexed)`**: URL is live in Google's index.
- **`NEUTRAL (Discovered - currently not indexed)`**: Google knows the URL exists but hasn't crawled it.
  - *Fix*: Add internal cross-links from high-traffic pages ([footer.blade.php](file:///Users/deepakbagada/saasnext%20project/my-website/resources/views/partials/footer.blade.php), [masthead.blade.php](file:///Users/deepakbagada/saasnext%20project/my-website/resources/views/partials/masthead.blade.php), or top journal articles).
- **`NEUTRAL (Crawled - currently not indexed)`**: Google crawled the page but decided not to index it yet.
  - *Fix*: Enrich page content, expand word count, add structured Schema JSON-LD, ensure unique value propositions.

### Step 5: Quick-Win Search Opportunity Harvesting
Analyze search performance queries every 7 days:
- Identify queries ranking between **Position 3.0 and 15.0** with impressions >= 5.
- Update target page meta titles, H2s, or introductory paragraphs to closely match search intent.

---

## 🔒 Quota Guardrails & Limits

| Metric | Google Limit | Sentinel Safe Ceiling | Failover Action |
| :--- | :---: | :---: | :--- |
| **Publish Requests per Day** | 200 requests/day | **190 requests/day** | Sitemap refresh + next-day queue |
| **Inspection API Calls** | 2,000 queries/day | **500 queries/day** | Batching with 0.1s sleep |
| **Sitemap Submissions** | Unlimited | **Once per publish / daily** | Instant GSC ping |
