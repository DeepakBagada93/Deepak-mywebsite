# 📝 Tomorrow's Build Checklist: Skills & Digital Products with Cashfree
**Execution Date:** Monday, September 28, 2026  
**Project:** Deepak Bagada Digital Commerce & Skills Marketplace  
**Payment Gateway:** Cashfree (Native UPI, Cards, Netbanking)  
**Status:** READY TO BUILD TOMORROW  

---

## 📌 Quick Task Summary

```
[ ] Phase 1: Database & Cashfree Payment Backend (08:30 - 11:00)
[ ] Phase 2: Product Packaging & Clean ZIP Bundling (11:00 - 13:00)
[ ] Phase 3: Storefront UI & Cashfree Drop-in Checkout (14:00 - 16:00)
[ ] Phase 4: Webhook, Secure Downloads & Sandbox QA (16:00 - 17:30)
[ ] Phase 5: Social Distribution & Daily Ledger Log (17:30 - 19:00)
```

---

## 🚀 Detailed Phase-by-Phase Checklist

### Phase 1: Database & Cashfree Backend Architecture
- [ ] **1.1 Environment Variables Configuration:**
  - Add to `.env`:
    ```ini
    CASHFREE_APP_ID=your_cashfree_app_id
    CASHFREE_SECRET_KEY=your_cashfree_secret_key
    CASHFREE_API_VERSION=2023-08-01
    CASHFREE_ENV=sandbox # switch to production after testing
    CASHFREE_BASE_URL=https://sandbox.cashfree.com/pg
    ```
- [ ] **1.2 Database Migrations:**
  - Create `digital_products` table: `id`, `slug`, `title`, `price_inr`, `file_path`, `features_json`, `is_active`.
  - Create `product_orders` table: `id`, `order_reference`, `cf_order_id`, `product_id`, `customer_name`, `customer_email`, `customer_phone`, `amount`, `payment_status`, `download_token`, `download_count`, `download_max_limit`, `download_expires_at`.
  - Run database migration on local & Hostinger MySQL.
- [ ] **1.3 Cashfree Service Implementation:**
  - Create `app/Services/CashfreeService.php`:
    - `createPgOrder(ProductOrder $order)` -> calls Cashfree `/pg/orders` and returns `payment_session_id`.
    - `fetchOrderStatus(string $cfOrderId)` -> sync fallback if webhook fails.
- [ ] **1.4 Order Controller:**
  - Create `app/Http/Controllers/OrderController.php`:
    - `initiate(Request $request)` -> validates input, creates pending order in DB, calls Cashfree service, returns session ID.

---

### Phase 2: Packaging the 3 Downloadable Digital Products
- [ ] **2.1 Product #1: FastMCP Production Server Suite (₹2,499)**
  - Source code: Redis cache (<4ms), DuckDB OLAP, LanceDB hybrid search, ClickHouse agent analytics, clean markdown scraper.
  - Include: `docker-compose.yml`, `README.md`, `LICENSE.md`, `setup.sh`.
  - Include Antigravity & Claude Code config snippets (`antigravity_mcp_config.json`).
  - Sanitize and zip: `fastmcp-production-suite-v1.0.zip` -> place in `storage/app/products/`.
- [ ] **2.2 Product #2: SaaS Next AI Micro-SaaS Boilerplate (₹6,499)**
  - Monorepo: Next.js 15 (App Router, Tailwind v4) + Laravel 11 backend + Sanctum Auth + Cashfree webhook listeners.
  - Sanitize (`node_modules`, `.env`, vendor stripped) and zip: `saasnext-boilerplate-2026.zip` -> place in `storage/app/products/`.
- [ ] **2.3 Product #3: HyperFrames Viral Reel Automation Engine (₹3,999)**
  - Python CLI runner + 3 motion video templates (Action, Breaking News, Minimalist White) + multi-platform caption generator.
  - Sanitize and zip: `hyperframes-reel-engine-v1.0.zip` -> place in `storage/app/products/`.
- [ ] **2.4 Free Lead Magnet: Agent Skills Starter Pack (₹0 / Free Download)**
  - Basic Redis MCP server + 3 essential prompt templates + context compaction cheatsheet.
  - Package into `free-agent-skills-starter-kit.zip`.

---

### Phase 3: Storefront UI & Cashfree SDK Drop-in
- [ ] **3.1 Products Showcase Page (`/products`):**
  - Clean, high-converting product grid with live technical badges (`Sub-4ms latency`, `Zero DAG bottleneck`).
  - Clear breakdown of what's inside each download.
  - Embedded "Buy Now" button triggering the modal.
- [ ] **3.2 Cashfree Web SDK Integration:**
  - Include official Cashfree JS SDK: `<script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>`.
  - Wire modal to call `initiatePayment()` and invoke `cashfree.checkout({ paymentSessionId })`.
  - Supports instant UPI (PhonePe, GPay, Paytm, BHIM, Cred), Credit/Debit cards, and Net Banking.
- [ ] **3.3 Free Lead Magnet Opt-in:**
  - Simple email capture form that delivers the free starter pack link instantly.

---

### Phase 4: Webhook, Secure Downloads & Quality Assurance
- [ ] **4.1 Cashfree Webhook Controller:**
  - Create `app/Http/Controllers/CashfreeWebhookController.php` listening at `POST /api/webhooks/cashfree`.
  - Verify HMAC-SHA256 signature using `x-webhook-signature` header and `CASHFREE_SECRET_KEY`.
  - On `PAYMENT_SUCCESS_WEBHOOK`:
    - Update order status to `SUCCESS`.
    - Generate unique 48-hour expiring download token.
    - Trigger transactional receipt email with the customer's secure download link.
- [ ] **4.2 Tokenized Expiring Download Controller:**
  - Create `app/Http/Controllers/DownloadController.php`:
    - Endpoint: `GET /download/{token}`.
    - Checks: status == `SUCCESS`, `now() < download_expires_at`, `download_count < 5`.
    - If valid: increment count, safely stream the private ZIP archive with `Content-Type: application/zip`.
    - If invalid or expired: return clean 403 Forbidden with support contact.
- [ ] **4.3 Sandbox End-to-End Verification:**
  - Run test order using Cashfree Sandbox UPI QR code.
  - Verify webhook triggers and marks order `SUCCESS` in MySQL database.
  - Click download link and confirm ZIP archive extracts cleanly with zero corrupted files.

---

### Phase 5: Launch, Social Distribution & Daily Ledger Log
- [ ] **5.1 Open-Source Library Cross-Linking:**
  - Publish 2 flagship skill documentation pages on `deepakbagada.in/library`.
  - Add callouts linking back to `/products` for the complete commercial suite.
- [ ] **5.2 Social Announcement:**
  - Post technical architecture breakdown on X (Twitter).
  - Post developer case study on LinkedIn.
  - Render and post 1 viral reel using `viral-reel-creator` + HyperFrames.
- [ ] **5.3 Daily Ledger Log:**
  - Update `memory.md` with tomorrow's published products, live URLs, and metrics.
