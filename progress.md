# PROGRESS — Digital Products Store (INR + USD)

> Handoff notes to resume tomorrow. Last updated: end of day **Sat 18 Oct 2026**.
> Older planning doc lives at `TODO_TOMORROW_DIGITAL_PRODUCTS.md` (kept for reference; the build it describes is now largely done).

---

## 1. TL;DR — where we are

The storefront is **built and working end-to-end in Cashfree sandbox**, including a full
**multi-currency (INR + USD)** layer added today.

- Live locally at **http://127.0.0.1:8000/products**
- Test suite: **54 passing** (`php artisan test`)
- Code style: **clean** (`./vendor/bin/pint`)
- **Not yet shippable:** the real product ZIP archives are not in `storage/app/products/`
  and Cashfree production keys are not set.

---

## 2. How to run / verify

```bash
# Dev server (already running on :8000; restart if needed)
php artisan serve --host=127.0.0.1 --port=8000
# (earlier it was started with nohup; log at /tmp/laravel-serve.log)

# Tests (never hit the network — Cashfree keys are blanked in phpunit.xml)
php artisan test

# Code style
./vendor/bin/pint app config tests
```

Store URLs: `/products`, `/products/{slug}`, `/products/track`, `/products/return`.
Route list: `php artisan route:list --path=products`.

---

## 3. Environment & credentials (IMPORTANT)

- `.env` is **gitignored**. Key facts:
  - `DB_*` points at the **remote production MySQL** (`193.203.184.64`), `APP_ENV=production`,
    `APP_DEBUG=false`. The two product migrations were already run against it:
    `2026_10_18_000000_create_product_orders_table` and `..._000001_add_cart_reference...`.
    (These only ADD a table + column — non-destructive.)
  - Cashfree **sandbox**:
    `CASHFREE_APP_ID=TEST113022381971afd658f9144c7ecf83220311`,
    `CASHFREE_SECRET_KEY=[configured-in-env]`,
    `CASHFREE_API_VERSION=2023-08-01`, `CASHFREE_ENV=sandbox`,
    `CASHFREE_BASE_URL=https://sandbox.cashfree.com/pg`.
  - `PRODUCTS_ADMIN_EMAIL` (default `ceo@saasnext.in`) — where "new sale" alerts go.
- `config/store.php` holds the currency config (default currency, cookie name, symbols/locales,
  US auto-detect hints).
- To go live later: switch `CASHFREE_ENV=production` + set live keys + `CASHFREE_BASE_URL=https://api.cashfree.com/pg`.

---

## 4. Feature status

### Done (INR flow)
- Config-driven catalog in `config/products.php` (6 products: 5 paid + 1 free).
- Storefront: `ProductController@index/show`, views `products/index`, `products/show`,
  `products/partials/card`, `products/download-expired`, `products/return`, `products/track`.
  JSON-LD Product / FAQ / Breadcrumb schema on the detail page.
- Client cart (localStorage `db_cart_v1`, floating `.cart-fab`, slide-in `.cart-drawer`)
  in `products/partials/cart.blade.php`; multi-item checkout groups lines under one `cart_reference`.
- Checkout modal `products/partials/checkout-modal.blade.php` → `window.StoreCheckout.open(items)`
  → `POST /products/checkout`.
- Backend: `OrderController` (`initiate`/`returnFromPayment`/`track`),
  `CashfreeWebhookController` (HMAC-SHA256 verify; CSRF-exempt `POST /webhooks/cashfree` via
  `bootstrap/app.php`), `DownloadController` (`GET /download/{token}`),
  `CashfreeService`, `OrderFulfiller` (idempotent group fulfillment + buyer & admin emails),
  `ProductOrder` model.
- Mail: `ProductDeliveryMail` + `AdminPurchaseMail` with `emails/product-delivery.blade.php`
  and `emails/admin-purchase.blade.php`.
- Guest-only by design — no accounts; delivery is an emailed expiring link (48h / 5 downloads).
- Verified live in sandbox: real multi-item checkout → single Cashfree order, grouped webhook →
  all lines SUCCESS with tokens, invalid signature → 401.

### Done today (multi-currency INR/USD)
- `config/products.php` now has `price_usd` / `compare_usd` on every product. Current USD prices:

  | Product | INR | USD |
  |---|---|---|
  | Agent Skills Master Bundle | ₹12,999 (was ₹24,696) | $199 (was $399) |
  | FastMCP Production Server Suite | ₹2,499 (was ₹4,999) | $39 (was $79) |
  | SaaS Next AI Boilerplate | ₹6,499 (was ₹12,999) | $99 (was $199) |
  | HyperFrames Viral Reel Engine | ₹3,999 (was ₹7,999) | $59 (was $119) |
  | AI Automation Prompt Vault | ₹999 (was ₹1,999) | $19 (was $39) |
  | Free Agent Skills Starter Kit | Free | Free |

- `app/Support/Money.php` — currency-aware `format()` (intl: `₹1,29,999` lakh grouping / `$199`),
  `priceFor()`, `compareFor()`, `supported()`.
- `app/Support/StoreCurrency.php` — resolves active currency from cookie; shared to all views via
  `AppServiceProvider`; layout sets `html[data-store-currency]`.
- `products/partials/currency-switch.blade.php` — ₹ INR / $ USD toggle; persists to
  localStorage + cookie; updates the html attribute; emits `store:currency`; auto-selects USD for
  `America/*` timezones on a first visit.
- Views render **both** currencies; CSS (`public/css/app.css`, section "MULTI-CURRENCY") hides the
  inactive one (no flash for returning visitors).
- Cart + checkout modal re-price live on currency change and post `currency` to the backend.
- `OrderController@initiate` validates currency and prices **server-side from the catalog** (never
  trusts the client); `CashfreeService::createPaymentSession($ref, $amount, $currency, $customer)`
  sends `order_currency`.
- Emails, `/products/track`, `/products/return`, and JSON-LD offers are all currency-aware.
- Confirmed live: USD auto-detect → card `$199` → cart subtotal `$199` → modal `TOTAL $199` /
  `PAY $199 →`.

---

## 5. Known caveats / risks

1. **Cashfree + USD (verify with real keys).** Cashfree PG is India-domestic; it may **reject
   `order_currency=USD`**. We wired USD exactly as requested — if Cashfree rejects it, checkout
   returns a friendly 502 and we flip USD to "convert-to-INR at charge time" **or** add
   Stripe/Paddle. The switch is localized to `OrderController@initiate` + `CashfreeService`.
2. **Product ZIPs are missing.** `storage/app/products/` is empty. Downloads return the friendly
   404 until the real archives are placed there (filenames are in each product's `file_path`).
3. **Migrations ran on the production DB.** Only additive, but double-check before any more
   `migrate` runs against production.
4. **Mail delivery** depends on `.env` mail config — confirm buyer + admin emails actually send
   (sandbox sale already logged, but verify inbox/SPF).
5. `amount` column stores whole units (rupees / dollars). If we ever need cents, revisit
   `Money::minor` and the column type.

---

## 6. Next steps for tomorrow (suggested order)

1. **Package the 6 archives** into `storage/app/products/` (names must match `file_path`), then
   re-test a real download stream end-to-end.
2. **Cashfree USD reality check** with sandbox: run a USD order; if rejected, decide the fallback
   (convert-to-INR vs add Stripe/Paddle) and implement in one place.
3. **Prod keys + go-live**: set live Cashfree keys, `APP_DEBUG=false` review, confirm webhook URL
   is publicly reachable (webhooks can't reach localhost — the `returnFromPayment` sync fallback
   covers local testing).
4. **Auto-detect polish**: consider server-side geo (e.g. Cloudflare header) instead of the
   timezone heuristic; add a "prices shown in X, you're paying in Y" note if we convert.
5. **Marketing for US**: EN-US copy pass, USD-first hero for US traffic, and update
   `store__trust` / buybox copy (already mentions "international cards").
6. **Social distribution + ledger** (from the old TODO Phase 5): X thread, LinkedIn case study,
   one reel, and update `memory.md`.

---

## 7. File map (added/changed for the store)

**Backend**
- `app/Http/Controllers/ProductController.php` — index/show, JSON-LD (multi-currency offers)
- `app/Http/Controllers/OrderController.php` — checkout / return / track (currency-aware)
- `app/Http/Controllers/CashfreeWebhookController.php`, `app/Http/Controllers/DownloadController.php`
- `app/Services/CashfreeService.php`, `app/Services/OrderFulfiller.php`
- `app/Models/ProductOrder.php` — group(), markPaid(), isDownloadable()
- `app/Mail/ProductDeliveryMail.php`, `app/Mail/AdminPurchaseMail.php`
- `app/Support/Money.php`, `app/Support/StoreCurrency.php`
- `app/Providers/AppServiceProvider.php` — shares `storeCurrency`

**Config / DB**
- `config/products.php` (catalog + INR/USD prices), `config/store.php` (currencies)
- `database/migrations/2026_10_18_000000_create_product_orders_table.php`,
  `2026_10_18_000001_add_cart_reference_to_product_orders_table.php`

**Views**
- `resources/views/products/index.blade.php`, `show.blade.php`, `return.blade.php`, `track.blade.php`
- `resources/views/products/partials/{card,cart,checkout-modal,price,currency-switch,download-expired}.blade.php`
- `resources/views/emails/{product-delivery,admin-purchase}.blade.php`
- `resources/views/layouts/app.blade.php` (html `data-store-currency`), `partials/masthead.blade.php` (Store nav)

**Assets / Routes / Tests**
- `public/css/app.css` (store, cart, modal, track, **multi-currency** sections)
- `routes/web.php` (products + `webhooks/cashfree`), `bootstrap/app.php` (CSRF exemption)
- `tests/Feature/ProductsTest.php` (16 store tests, incl. USD checkout + currency validation)

---

## 8. October journal task (done Sat 18 Oct 2026)

**Goal:** finish the October content plan + fix the 404 journal images.

**State found:** 86/104 dispatches published; **18 still `scheduled`** (Oct 18 12:30 → Oct 21 18:30).
Every October body embedded ABSOLUTE image URLs (`https://deepakbagada.in/images/journal/*.jpg`,
`.../assets/images/posts/*.webp`) whose files did not exist → all 404'd (82 October refs; 28 more in Sept).

**Decision (user):** we do **NOT** want images in article bodies at all.

**What was done:**
1. **Published the 18 queued dispatches** via
   `.agent/skills/deepak-blog/scripts/process-scheduled-posts.php --force-all`
   → live MySQL `posts` (+18) and `data/posts.php` (+18). `scheduled_posts` now 104 published / 0 scheduled.
   All 18 verified HTTP 200 at `https://deepakbagada.in/journal/<slug>`.
   *Caveat:* the pipeline stores `date = scheduled_for`; since `PostController@show()` 404s future-dated
   posts, the 18 `date`/`published_at` values were set to "now" (order-preserving) in `posts` + `data/posts.php`.
2. **Removed ALL images from October bodies** (policy change): live DB `posts` (112 October rows updated,
   0 image markdown left) AND `data/posts.php` (107 October entries sanitized). September untouched (28 refs remain).
   Verified live: `/journal/<slug>` no longer contains `images/journal` or `assets/images/posts`
   (only layout `about-portrait` remains). 54 tests still pass.
3. **Skill upgraded** (`.agent/skills/deepak-blog/`): `SKILL.md` §6 is now **"🚫 Zero Images In Article Body"**;
   `audit-blog.mjs` + `audit-live-url.mjs` now **FAIL** on any body image; image lines stripped from
   `oct-data-generator.mjs`, `oct14-data-generator.mjs`, and the historical `articles-oct-*.mjs`.
   Policy note appended to `memory.md`.

**Orphaned artifacts (cleanup candidate):** an earlier step created + deployed 82 stock images
(`public/images/journal/` ×61, `public/assets/images/posts/` ×21) which the image-free policy made
unreferenced. `IMAGE_GUIDELINES.md` / `CREDITS.md` at repo root also came from that step. Delete if unwanted.
