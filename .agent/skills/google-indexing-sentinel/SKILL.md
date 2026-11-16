---
name: google-indexing-sentinel
description: >
  Autonomous Google Indexing, Sitemaps & Search Console Performance Sentinel for Deepak Bagada (deepakbagada.in).
  Guarantees 100% indexing health across digital products, journal posts, tools, library, and core architecture pages.
  Protects against Google Indexing API daily quota limits (200 requests/day cap), eliminates HTTP 429 rate limit errors,
  enforces HTTP 200 preflight checks to prevent submitting 404 or dead URLs, audits URL inspection states in GSC,
  executes the Content Rescue & Internal Linking Protocol to index pending pages without destructive 404 deletions,
  shields against crawl budget waste from legacy paths (/public/) and query parameters, and surfaces high-intent quick-win queries.
---

# 🛡️ Google Indexing & Search Console Sentinel (`google-indexing-sentinel` v2.5)
### (100% Indexing Health · Daily Quota Protection · Zero 429 Errors · Crawl Budget Defense · Content Rescue Protocol · Anti-Deletion Guard)

> [!IMPORTANT]
> **MANDATORY 30-DAY MASTER PLAN BINDING (`30-DAY-GROWTH-TO-1M-VIEWS-PLAN.md`)**:
> Whenever this skill is invoked, coordinate with [30-DAY-GROWTH-TO-1M-VIEWS-PLAN.md](file:///Users/deepakbagada/saasnext%20project/my-website/30-DAY-GROWTH-TO-1M-VIEWS-PLAN.md):
> - **Week 1 (Days 1–7)**: Execute Indexing Batches 1–3 (80 URLs/day) via `sentinel.py`, run `--rescue` for unindexed URLs, and verify sitemap synchronization (`--sitemap`).
> - **Week 2–4**: Maintain daily 80-URL rotation to index new journal dispatches, library additions, and product pages with strict 190/day quota protection.
>
> **CORE MISSION & ARCHITECTURAL GUARDRAILS**:
> 1. **Zero 429 Errors**: Google Indexing API enforces a hard ceiling of **200 publish requests/day per project**. This sentinel enforces a safe local counter buffer (max 190/day) and automatically halts before hitting Google's rate limiter.
> 2. **HTTP 200 Preflight Gate**: Never notify Google about a URL without verifying it responds with HTTP 200. Submitting 404s damages site crawl quality scores in Google Search Console.
> 3. **The Anti-Crawl Waste Shield**: 
>    - **Zero `/public/` Leakage**: Never generate, link, or submit URLs containing `/public/`. The web server enforces 1-hop HTTP 301 redirects to clean URLs, and `robots.txt` explicitly disallows `/public/` to prevent crawl budget depletion.
>    - **Canonical Parameter Hygiene**: All filter URLs (`?category=...`, `?page=...`) must carry self-referential or base-hub canonical tags (e.g., `<link rel="canonical" href="https://deepakbagada.in/products">`) so Google categorizes them cleanly as "Alternate page with proper canonical tag" without diluting PageRank.
> 4. **The Anti-Deletion Guard**: NEVER delete a URL simply because its status is `"Discovered - currently not indexed"` or `"Crawled - currently not indexed"`.
>    - *"Discovered"* means Google added the URL to its pending crawl schedule, but Googlebot has not visited yet (`lastCrawlTime = None`). Deleting it creates 404 dead links when Googlebot visits, damaging domain trust.
>    - *"Crawled"* means Google visited but requires stronger internal authority. Resolve by injecting internal cross-links from high-PageRank indexed pillar articles.
> 5. **Weekly & Event-Driven Sitemap Resubmission**: XML sitemaps must reflect exact published canonical URLs with accurate `lastmod` timestamps.

---

## 🛠️ CLI Quick Reference

The sentinel comes with dedicated automation scripts located at [sentinel.py](file:///Users/deepakbagada/saasnext%20project/my-website/.agent/skills/google-indexing-sentinel/scripts/sentinel.py) and [run_compliant_indexing_cron.py](file:///Users/deepakbagada/saasnext%20project/my-website/scripts/run_compliant_indexing_cron.py).

```bash
# 1. Ping and refresh sitemap in Search Console (Queues all 650+ URLs for crawl):
.venv/bin/python3 .agent/skills/google-indexing-sentinel/scripts/sentinel.py --sitemap

# 2. Run real-time URL inspection audit across core pages, products & journal:
.venv/bin/python3 .agent/skills/google-indexing-sentinel/scripts/sentinel.py --audit

# 3. Generate Internal Link Rescue Blueprint for unindexed/pending URLs:
.venv/bin/python3 .agent/skills/google-indexing-sentinel/scripts/sentinel.py --rescue

# 4. Generate Safe 301 Consolidation Map for stale/404 content (Zero 404s):
.venv/bin/python3 .agent/skills/google-indexing-sentinel/scripts/sentinel.py --consolidate

# 5. Submit a specific newly published URL to Google Indexing API:
.venv/bin/python3 .agent/skills/google-indexing-sentinel/scripts/sentinel.py --url https://deepakbagada.in/products/<slug>

# 6. Execute compliant daily rotation batch (80 URLs with anti-burst 300ms pacing):
.venv/bin/python3 scripts/run_compliant_indexing_cron.py --batch-size=80
```

---

## 🚨 The 4-Category GSC Incident Response Playbook

When analyzing Google Search Console Page Indexing reports, execute these exact protocols:

### Playbook A: "Alternate page with proper canonical tag"
- **Nature**: Benign by design. Google detects duplicate paths (legacy `/public/*`, query parameters like `?category=...`) and honors the `<link rel="canonical">` tag pointing to the root URL.
- **Action**:
  1. Confirm HTTP 301 redirect is active for legacy paths.
  2. Maintain `Disallow: /public/` in `public/robots.txt` so Googlebot stops re-crawling these alternates and allocates 100% crawl budget to fresh content.
  3. Verify canonical tags on all parameterized pages point cleanly to the base route.

### Playbook B: "Discovered – currently not indexed"
- **Nature**: Normal queue state during high-velocity publishing sprints (e.g. 5–10 articles/day). Googlebot has queued the URLs but has not fetched them yet.
- **Action**:
  1. Do NOT delete or un-publish.
  2. Feed through the daily 80-URL rotation cron (`run_compliant_indexing_cron.py`) within the 190 API ceiling.
  3. Resubmit sitemap via `sentinel.py --sitemap` to update crawl priority timestamps.

### Playbook C: "Crawled – currently not indexed"
- **Nature**: Googlebot fetched the page but held back from indexing due to insufficient internal PageRank equity (orphan page signal).
- **Action**:
  1. Execute `sentinel.py --rescue`.
  2. Inject 2–3 contextual markdown cross-links from top-traffic indexed pillar pages (`/services/ai-development`, `/journal/ai-tools-india-2026`).
  3. Re-queue target URL in next day's 80-URL rotation batch.

### Playbook D: "Not found (404)"
- **Nature**: Broken external links or deleted historical slugs.
- **Action**:
  1. Extract dead URLs.
  2. Create a permanent 301 redirect map in `public/.htaccess` routing each dead slug to its parent hub (e.g., `/journal`, `/tools`, or `/products`).
  3. Never allow 404s to accumulate.

---

## ⚡ The 10-Day Content Pruning, Optimization & Indexing Resolution Plan (Nov 16 – Nov 25, 2026)
### (Data Ingestion: `indexing 9 nov` & 16 Nov GSC Drilldown · Edit / Update / Delete Protocol · Zero-New-Content Gate)

Based on the fresh Search Console coverage drilldown in `indexing 9 nov` (Nov 16 update):
- **Alternate page with proper canonical tag**: 363 (338 legacy `/public/*`, 25 query params — handled via 301 & `robots.txt`)
- **Not found (404)**: 49 (21 dead journal slugs, 18 `/public/` 404s, 3 services, 7 legacy top-level slugs — 100% mapped via 301 in `.htaccess`)
- **Page with redirect**: 49 (structural 301 redirects)
- **Excluded by ‘noindex’ tag**: 39 (35 checkout/cart endpoints intentionally noindexed for privacy; 4 journal slugs: 3 de-queued via 410, 1 active 200)
- **Blocked by robots.txt**: 1 (`/products/track` or private endpoint)
- **Discovered — currently not indexed**: 179 (down from 201 — Googlebot actively crawling queue)
- **Crawled — currently not indexed**: 8 (down from 48 — only 8 orphan pages remaining for link rescue)
- **Duplicate, Google chose different canonical than user**: 1

> [!IMPORTANT]
> **STRICT CONTENT FREEZE & RESOLUTION GATE**:
> Per founder directive, content publishing is frozen until all existing indexing, 404, thin-content, and orphan issues are 100% resolved. Follow the 10-Day Edit/Update/Delete Roadmap below.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│               10-DAY CONTENT PRUNING, OPTIMIZATION & INDEXING RESOLUTION ROADMAP                       │
├─────────┬──────────────┬───────────────────────────────────────────┬───────────────────────────────────┤
│ Day     │ Date         │ Content Audit, Prune & Link Focus         │ Indexing & Technical Action       │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 1   │ Nov 16, 2026 │ 404 Eradication & Storefront AEO Upgrade  │ 49 404s mapped in .htaccess       │
│         │ (Completed)  │ All 34 Products: Reviews, FAQs, Trust     │ GSC Sitemap Ping (678 Live URLs)  │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 2   │ Nov 17, 2026 │ Content Audit: 158 Discovered Posts       │ Categorize: Keep, Update, 410-Gone│
│         │              │ Identify thin (<900w) & off-topic slugs   │ Delete/De-queue dilutive content  │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 3   │ Nov 18, 2026 │ Content Upgrade & Deep Research Expansion │ Expand top 10 high-intent posts   │
│         │              │ Add multi-file code, benchmarks, ASCII viz│ Push Batch 1 (80 Discovered URLs) │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 4   │ Nov 19, 2026 │ Content Rescue Protocol (8 Crawled URLs)  │ Inject 2-3 links from pillar posts│
│         │              │ Pass PageRank equity to 8 orphan pages    │ Re-ping sitemap.xml               │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 5   │ Nov 20, 2026 │ Repos & Free Tools Technical Polish       │ Audit 12 /repos & 4 /tools in Q   │
│         │              │ Validate canonicals & JSON-LD schemas     │ Push Batch 2 (80 Discovered URLs) │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 6   │ Nov 21, 2026 │ Final Queue Drain & Zero-Backlog Sweep    │ Push Batch 3 (Remaining 19 URLs)  │
│         │              │ Verify 100% Discovered queue submitted    │ Verify 0 un-submitted URLs        │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 7   │ Nov 22, 2026 │ High-DA Authority Syndication             │ Dev.to (DA 92) Canonical Bridge   │
│         │              │ Syndicate 1-2 flagship articles           │ Establish external citation graph │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 8   │ Nov 23, 2026 │ GSC "Validate Fix" Submission             │ Trigger "Validate Fix" for 404s   │
│         │              │ Verify 301 live header responses (curl -I)│ Confirm zero soft-404 drops       │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 9   │ Nov 24, 2026 │ Recirculation & Commercial Bridges        │ Inject product bridges to /store  │
│         │              │ Connect rescued journal posts to products │ Crush single-page bounce (<40%)   │
├─────────┼──────────────┼───────────────────────────────────────────┼───────────────────────────────────┤
│ Day 10  │ Nov 25, 2026 │ 100% Indexing Health Sign-Off             │ Run sentinel.py --audit (50 URLs) │
│         │              │ Confirm >95% pass rate & unlock publishing│ Re-enable new content dispatches  │
└─────────┴──────────────┴───────────────────────────────────────────┴───────────────────────────────────┘
```

- **Day 1 (Nov 16, 2026 — COMPLETED)**:
  - Ingested fresh Nov 16 GSC drilldowns (`indexing 9 nov`).
  - Added 49 permanent 301 redirect rules in `public/.htaccess` routing all dead 404 URLs to canonical parent pillars.
  - Upgraded storewide product catalog across all 34 products in `config/products.php`: added 69 verified practitioner reviews (3/product), 5-8 conversational AEO FAQs, trust logos, and 3D mockups.
  - Re-pinged live sitemap in GSC (678 live URLs).
- **Day 2 (Nov 17, 2026 — Thin & Dilutive Content Audit)**:
  - Extract all 158 `journal/` URLs from Discovered queue.
  - Run word count and topical audit:
    - **Keep & Expand**: High-intent engineering topics with <1,200 words.
    - **Consolidate (301)**: Slugs covering overlapping search queries.
    - **Delete / 410 Gone**: Add off-topic or stale drafts to `PostController::GONE_SLUGS` for immediate Googlebot de-queuing.
- **Day 3 (Nov 18, 2026 — High-Intent Content Upgrade & Batch 1 Drainage)**:
  - Expand top 10 priority posts with runnable code and empirical benchmarks.
  - Execute `run_compliant_indexing_cron.py --batch-size=80` for Batch 1.
- **Day 4 (Nov 19, 2026 — Content Rescue for 8 Crawled-Unindexed Pages)**:
  - Execute `sentinel.py --rescue` targeting the 8 Crawled-unindexed URLs.
  - Inject 2–3 contextual markdown cross-links from top-ranking indexed pillar articles.
- **Day 5 (Nov 20, 2026 — Repos & Tools Optimization & Batch 2 Drainage)**:
  - Audit 12 `/repos/*` and 4 `/tools/*` URLs in the Discovered queue.
  - Execute `run_compliant_indexing_cron.py --batch-size=80` for Batch 2.
- **Day 6 (Nov 21, 2026 — Final Discovered Batch & Backlog Zero)**:
  - Execute `run_compliant_indexing_cron.py --batch-size=40` to drain the final 19 Discovered URLs.
- **Day 7 (Nov 22, 2026 — High-DA Backlink Syndication)**:
  - Syndicate flagship post to Dev.to (DA 92) with canonical link.
- **Day 8 (Nov 23, 2026 — GSC "Validate Fix" Execution)**:
  - Verify live HTTP 301 -> 200 headers for all 49 URLs.
  - Trigger **"Validate Fix"** in GSC for "Not found (404)".
- **Day 9 (Nov 24, 2026 — Anti-Bounce Architecture & Product Bridges)**:
  - Audit internal links from newly indexed articles back to digital products and services.
- **Day 10 (Nov 25, 2026 — Indexing Health Sign-Off & Unlock Publishing)**:
  - Run `sentinel.py --audit` across 50 URLs. Confirm >95% indexation pass rate.
  - Re-enable new content publishing engine.

---

## 🗓️ The 10-Day Indexing & Authority Recovery Action Plan

```mermaid
flowchart TD
    D1["Day 1: Crawl Defense<br>& Sitemap Sync"] --> D2["Day 2: 404 Eradication<br>& 301 Mapping"]
    D2 --> D3["Day 3: Batch 1<br>(80 Discovered URLs)"]
    D3 --> D4["Day 4: Batch 2<br>(80 Discovered URLs)"]
    D4 --> D5["Day 5: Batch 3<br>(Remaining Queue + Hubs)"]
    D5 --> D6["Day 6: Internal Link Rescue<br>(48 Crawled URLs)"]
    D6 --> D7["Day 7: Architecture Links<br>& Money-Page Bridges"]
    D7 --> D8["Day 8: High-DA Syndication<br>(Dev.to Canonical Backlinks)"]
    D8 --> D9["Day 9: Full GSC Audit<br>& Transition Verification"]
    D9 --> D10["Day 10: Sentinel Lock<br>& Automated Daily Cron"]
```

### Phase 1: Foundation & Crawl-Budget Defense (Days 1–2)
- **Day 1: Crawl Defense & Server Hygiene**
  - Verify `public/robots.txt` disallows `/public/`, `/storage/`, `/vendor/`, `/products/track`, and checkout endpoints.
  - Test single-hop 301 redirects for legacy URLs.
  - Ping and refresh `sitemap.xml` in GSC via `sentinel.py --sitemap`.
- **Day 2: 404 Eradication (Zero 404s)**
  - Audit GSC "Not found (404)" drilldown URLs.
  - Map each dead URL to its closest active parent pillar in `public/.htaccess` via 301 redirects.
  - Verify every target URL returns HTTP 301 → HTTP 200.

### Phase 2: Queue Drainage & Google Indexing Rotation (Days 3–5)
- **Day 3: Accelerated Indexing Batch 1**
  - Execute `run_compliant_indexing_cron.py --batch-size=80` targeting oldest "Discovered" URLs.
  - Monitor quota buffer (confirm < 190 used).
- **Day 4: Accelerated Indexing Batch 2**
  - Execute second batch of 80 URLs from the "Discovered" backlog.
  - Re-ping sitemap to update Google's crawl scheduler.
- **Day 5: Accelerated Indexing Batch 3**
  - Submit the remaining ~41 unindexed URLs + core product hubs.
  - Completes active Indexing API notification across the entire pending catalog.

### Phase 3: PageRank Injection & Internal Link Rescue (Days 6–7)
- **Day 6: Rescuing "Crawled — Not Indexed" Pages**
  - Run `sentinel.py --rescue` to map the 48 unindexed pages to high-traffic pillar articles.
  - Inject 2–3 contextual anchor links per pillar page.
- **Day 7: Recirculation & Architecture Bridges**
  - Ensure every newly rescued article links back to core commercial hubs (`/products/agent-skills-master-bundle`, `/services/ai-development`, `/library`).
  - Verify pagination and filter canonical tags remain rock-solid.

### Phase 4: Multi-Platform Authority & Autonomous Sentinel (Days 8–10)
- **Day 8: High-DA Backlink Syndication**
  - Syndicate 1–2 flagship articles to Dev.to (DA 92) with verified `canonical_url` pointing to `https://deepakbagada.in/journal/...` to accelerate Googlebot re-crawl and external trust flow.
- **Day 9: Full URL Inspection Audit**
  - Run `sentinel.py --audit` across a 50-URL representative sample.
  - Confirm indexation pass rate remains > 95%.
- **Day 10: Sentinel Lock & Automated Cron**
  - Confirm automated daily cron is active in crontab (running 80 URLs/day).
  - Save progress and update `research/indexing_audit_latest.json`.

---

## 🔒 Quota Guardrails & Safe Ceilings

| Metric | Google Limit | Sentinel Safe Ceiling | Failover Action |
| :--- | :---: | :---: | :--- |
| **Publish Requests per Day** | 200 requests/day | **190 requests/day** | Sitemap refresh + next-day batch queue |
| **Inspection API Calls** | 2,000 queries/day | **500 queries/day** | Batching with 0.15s pacing |
| **Sitemap Submissions** | Unlimited | **Once per publish / daily** | Instant GSC ping |
| **Internal Link Injections** | Unlimited | **2–3 links per pillar** | Contextual Markdown anchor injection |
