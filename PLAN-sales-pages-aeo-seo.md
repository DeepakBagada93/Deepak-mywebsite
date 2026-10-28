# Sales Page, Store & Home — AEO/SEO + Conversion Plan

Status: Plan only. No implementation yet.
Scope: `https://deepakbagada.in/` (home), `/products` (store), `/products/{slug}` (product template), plus the shared layout, product data, schema, analytics, and checkout handoff.
Goal: make the three surfaces convert qualified buyers and get cited by Google AI Overviews, ChatGPT, Perplexity, Gemini, and Claude.

---

## 0. Baseline Findings (measured from the current code)

These are the starting numbers. The plan is built around fixing them, not around a redesign for its own sake.

| Surface | Current issue | Measured |
|---|---|---|
| Home | Title is far over the SERP budget | 99 chars |
| Home | Meta description is far over the snippet budget | 293 chars |
| Home | H1 is only the name, plus a second H1 in the preloader | `Deepak Bagada` ×2 |
| Home | Money pages are not in the main conversion path | No product/service card above the journal |
| Store | Title is over budget | 70 chars |
| Store | Meta description is over budget | 234 chars |
| Store | H1 is a slogan, not a search-intent statement | `Buy once. Own forever. Ship today.` |
| Store | Filter URLs are indexable duplicates | `?category=` has no canonical strategy |
| Product | SEO titles are over budget on every product | 20/20 over 60 chars, max 93 |
| Product | One product description is over 160 chars | 1/20 |
| Product | Rich schema includes `aggregateRating` with no visible reviews | Trust/compliance risk |
| Product | No visible testimonials, screenshots, or demo proof | Ratings exist only in config |
| All | No ecommerce funnel events | Only newsletter + generic `data-event` |
| All | Home preloader + global GSAP + Google Fonts CDN | CWV/LCP risk |
| Assets | 20 products, 1 free, 10 categories | Good catalog depth, weak merchandising |

Existing strengths to keep:

- Product page already has an AEO summary, comparison table, deliverables, step-by-step usage, FAQ, related products, mobile sticky buy bar, and desktop buy box.
- Checkout already has Razorpay trust signals, instant delivery, commercial license, 30-day guarantee, and a builder note.
- Home already has a strong entity graph: `Person`, `ProfilePage`, `ProfessionalService`, `FAQPage`.
- Store already has `ItemList` structured data and a featured bundle spotlight.
- `llms.txt` exists and is linked from the layout.

---

## 1. Guardrails

- [ ] Keep the current editorial design language: Fraunces, Inter, IBM Plex Mono, paper/ink palette. Do not introduce a new UI framework.
- [ ] Do not publish invented ratings, review counts, client logos, or "best" claims that cannot be substantiated.
- [ ] If real reviews do not exist, remove `aggregateRating` from schema and the star UI until verified reviews are collected.
- [ ] Preserve the checkout flow and Razorpay integration. This plan optimizes the pages that lead to checkout, not the payment rails.
- [ ] Every page change must pass a repeatable audit script, not only visual review.
- [ ] Keep the existing journal/blog pipeline untouched.

---

## 1A. Keyword Preservation Contract (do not remove)

The current site ranks for high-intent entity keywords. The conversion rewrite must keep them, not replace them with generic sales copy. Every keyword below stays in the page, schema, metadata, or body.

| Target keyword | Keep on | Placement |
|---|---|---|
| best AI expert in Gujarat | Home | Title, H1/supporting line, meta description, `Person.jobTitle`, `knowsAbout` |
| AI consultant in Gujarat | Home | Meta description, services block, `ProfessionalService.description` |
| AI developer in Gujarat | Home | Subhead/body, `Person.jobTitle`, `knowsAbout` |
| AI expert in Junagadh | Home/About | Body, address/entity block, `Person`, `ProfessionalService` |
| AI agent developer India | Home/Product | Body, product/service copy, `knowsAbout` |
| AI automation agency India | Home/Services | Body, service CTA, `ProfessionalService` |
| hire AI consultant India | Home/Services | Contact CTA and FAQ |
| custom AI agent development India | Home/Services | Services section and FAQ |
| enterprise AI automation India | Home/Services | Services section and schema |
| AI agent architect | Home | Hero supporting line, `Person.jobTitle` |
| web developer Junagadh / Gujarat | Home/Footer | Subhead, footer, `Person.hasOccupation` |
| SEO / AEO expert Gujarat | Home/Footer | Subhead, footer, service block |
| AI toolkits India | Store | H1, meta description, body |
| buy AI agent toolkit | Store/Product | Product intro, CTA copy |
| production AI agents | Store/Product | H1/supporting copy |
| MCP server toolkit | MCP product | Title, H1, body, FAQ |
| n8n workflow automation | n8n product | Title, H1, body, FAQ |
| AI agency delivery | Agency product | Title, H1, body, FAQ |

Rules:

- [ ] Do not delete existing `alternateName`, `jobTitle`, `knowsAbout`, `areaServed`, service offers, or location entities from the home schema.
- [ ] Do not shorten the home title in a way that drops both `Best AI Expert in Gujarat` and `AI Consultant in Gujarat`.
- [ ] Product metadata may be tightened for CTR, but the product's primary keyword must remain in the H1, meta title, or opening 100 words.
- [ ] Every keyword above must appear at least once in the rendered HTML after the rewrite.
- [ ] The audit script must report keyword coverage per page. Missing keyword = failure.
- [ ] Prefer exact phrases in headings and opening paragraphs. Do not keyword-stuff tables or alt text.

Recommended home title candidates (50-60 chars, keyword-preserving):

1. `Best AI Expert in Gujarat | Deepak Bagada` (46; expand with `AI Consultant`)
2. `Best AI Expert & AI Consultant Gujarat | Deepak` (50)
3. `Best AI Expert in Gujarat | AI Consultant India` (50)
4. `Best AI Expert in Gujarat | AI Consultant 2026` (48)

Pick one that keeps both priority phrases and the brand if possible. The meta description carries the second phrase if the title cannot fit both.

---

## 2. Success Metrics

Track before/after for 28 days. Do not judge by aesthetics.

| Metric | Baseline | Target |
|---|---|---|
| Store conversion rate (sessions to paid order) | Capture in week 1 | +15% relative |
| Product page add-to-cart rate | Capture in week 1 | +20% relative |
| Checkout start rate | Capture in week 1 | +15% relative |
| Home to money-page click rate | Capture in week 1 | +25% relative |
| Organic non-brand clicks to `/products/*` | GSC baseline | +20% in 60 days |
| Product pages with valid rich results | Audit baseline | 100% |
| Mobile LCP | Measure | < 2.0 s |
| INP | Measure | < 200 ms |
| CLS | Measure | < 0.1 |
| AI citation checks (manual prompt set) | Baseline list | At least 3 target queries cited |
| Keyword coverage | Audit baseline | 100% of contract keywords present |

---

## 3. Phase 0 — Measurement and Audit

- [ ] 0.1 Export current GSC data for `/`, `/products`, `/products/*` (queries, impressions, CTR, position, indexed pages).
- [ ] 0.2 Export GA4 baseline: sessions, product views, add-to-cart, checkout starts, purchases, revenue, device split.
- [ ] 0.3 Run PageSpeed Insights mobile + desktop on home, store, bundle product, and one paid product. Save JSON.
- [x] 0.4 Crawl the three surfaces with a link/heading/schema checker. Record title/meta/H1/canonical/robots. → `scripts/audit-sales-pages.php`; baseline in `research/sales-page-audit-baseline.md`.
- [ ] 0.5 Validate current JSON-LD with Schema Markup Validator and Rich Results Test.
- [ ] 0.6 Inventory proof assets: real testimonials, screenshots, terminal demos, case-study metrics, refund terms, license terms.
- [x] 0.7 Create `scripts/audit-sales-pages.php` with hard budgets:
  - title 50-60 chars, description 145-158 chars
  - exactly one H1 per page
  - canonical present
  - no `aggregateRating` without visible reviews
  - minimum one direct-answer block, one comparison/table, one FAQ block
  - at least 3 internal links to money pages
  - schema parses as valid JSON
- [ ] 0.8 Freeze a 20-query AI citation baseline (ChatGPT, Perplexity, Gemini, Google AI Overview where available).

Definition of done: baseline spreadsheet + audit script committed, current failures reproducible.

---

## 4. Phase 1 — Offer, Positioning, and Copy

### 4.1 Home

- [x] 1.1 Replace the name-only H1 with an offer-led H1 that still contains the entity and the primary keyword:
  - Implemented: H1 = "AI systems, built to ship."; eyebrow keeps "Best AI Expert in Gujarat · AI Consultant in Gujarat"; subhead keeps "AI Agent Developer India · Enterprise AI Automation India · Web Developer Junagadh".
  - Keep `Deepak Bagada`, `AI Consultant in Gujarat`, and `AI Developer in Gujarat` in the subhead, about section, and schema.
- [x] 1.2 Add a 40-60 word direct-answer block under the H1:
  - Who he is, what he builds, who it is for, where he is based, primary outcome.
- [x] 1.3 Add two clear conversion paths above the fold:
  - Primary: "Hire me for an AI build" -> `/services` or `/#contact`
  - Secondary: "Shop production toolkits" -> `/products`
- [ ] 1.4 Add a trust strip with verifiable facts: years building, projects shipped, location, response time, payment/guarantee where relevant.
- [ ] 1.5 Add an outcome section: 3 case-style cards with problem, build, measurable result. Only use real numbers.
- [x] 1.6 Add a featured products row (bundle + 2 paid products) between the hero and the story. → `portfolio.partials.products`.
- [ ] 1.7 Keep the story/timeline, but move it below the offer, proof, and products.
- [ ] 1.8 Add a "Start here" split section: Hire / Buy / Use free tools.
- [ ] 1.9 Rewrite the final CTA to one action, not two equal actions.

### 4.2 Store

- [x] 1.10 New H1 with search intent and offer: "AI Toolkits & Digital Products India."
- [x] 1.11 Add a 40-60 word direct-answer block: what the store sells, who it is for, delivery format, license, guarantee. → store lede.
- [x] 1.12 Add a "Who this is for / not for" split. This improves qualification and reduces refunds.
- [x] 1.13 Add a bundle-first offer stack: bundle price, individual total, savings, what is inside, CTA.
- [x] 1.14 Add a comparison table: buying separate vs bundle vs hiring a custom build.
- [x] 1.15 Add a store FAQ (6 questions): delivery, license, stack compatibility, updates, refunds, support. → visible `<details>` + `FAQPage` JSON-LD.
- [ ] 1.16 Rewrite product cards to lead with outcome, not category/tech:
  - outcome headline, one proof line, price, CTA.
- [x] 1.17 Add a guarantee/trust row directly under the grid, not only at the bottom. → existing store trust strip retained.

### 4.3 Product Page

- [ ] 1.18 Above the fold, in this order:
  - category, H1, outcome subhead, rating/proof (only if real), price anchor, primary CTA, secondary "see what is inside", 3 outcome bullets, delivery/license/guarantee microcopy.
- [ ] 1.19 Add a product visual: real screenshot, terminal output, or annotated workflow. A generic icon is not proof.
- [ ] 1.20 Add "Who it is for / not for" immediately after the outcome block.
- [ ] 1.21 Add "What you get" with tangible artifacts: files, scripts, templates, tests, docs, examples.
- [ ] 1.22 Add "See it in action" with 1-3 screenshots or a short demo GIF/video.
- [ ] 1.23 Add a "Before / after" table using concrete workflow outcomes, not adjectives.
- [ ] 1.24 Add a 3-step "How it works" section; keep the existing detailed steps below it.
- [ ] 1.25 Add a guarantee block near the buy box and repeat it near the final CTA. → buy-box guarantee done; final CTA repeat pending.
- [x] 1.26 Add a real testimonial block or remove the star rating entirely. → removed stars + `aggregateRating`; replaced with production-tested/commercial-license proof labels.
- [ ] 1.27 Add a "Complete the stack" cross-sell: bundle, adjacent product, service.
- [ ] 1.28 Add a final CTA section after the FAQ, not only the sidebar.

### 4.4 Objection and FAQ Matrix

- [ ] 1.29 Write answers for these objections and reuse them across pages:
  - "Is this code, prompts, or a course?"
  - "Do I need paid API keys?"
  - "Will it work with Laravel/Node/Python/n8n?"
  - "Can I use it for client work?"
  - "How is it delivered?"
  - "What if it does not work?"
  - "How long do updates last?"
  - "Is support included?"
- [ ] 1.30 Put the top 3 objections on the product page above the FAQ; put the full set in the FAQ.

Definition of done: final copy deck approved before template work starts.

---

## 5. Phase 2 — Page Architecture and Templates

### 5.1 Home

- [ ] 2.1 New section order:
  1. Hero with offer + dual CTA + proof strip
  2. Direct answer + "Start here" paths
  3. Featured products / bundle
  4. Services with outcomes and price-from
  5. Case proof
  6. Story/timeline (shortened)
  7. Skills (shortened)
  8. Journal
  9. FAQ
  10. Final CTA
- [ ] 2.2 Remove the preloader on home or make it non-blocking. It competes with LCP.
- [ ] 2.3 Make the hero image the LCP element: preload, explicit dimensions, AVIF/WebP, no layout shift.
- [ ] 2.4 Reduce the hero copy to one promise + one proof line + one CTA pair.

### 5.2 Store

- [ ] 2.5 New section order:
  1. H1 + direct answer + trust strip
  2. Bundle spotlight
  3. Category filters
  4. Product grid with outcome-first cards
  5. "Who it is for / not for"
  6. Comparison table
  7. Guarantee + license + delivery
  8. FAQ
  9. Custom-build CTA
- [ ] 2.6 Canonicalize category filters to `/products` or create indexable category landing pages with unique copy. Do not leave both.
- [ ] 2.7 Add result count and "sorted by" clarity; keep the current filter pills.
- [ ] 2.8 Ensure the bundle card is visually dominant and not just one card in the grid.

### 5.3 Product

- [ ] 2.9 New template sections in order:
  1. Breadcrumb
  2. Hero: category, H1, outcome, proof, price, CTA, 3 bullets
  3. Product visual / demo
  4. Who it is for / not for
  5. What you get
  6. See it in action
  7. Before/after
  8. How it works
  9. Built with
  10. Included with every purchase
  11. Testimonials or proof
  12. Guarantee
  13. FAQ
  14. Complete the stack
  15. Final CTA
- [ ] 2.10 Keep the desktop sticky buy box; add a compact sticky bar on tablet, not only mobile.
- [ ] 2.11 Ensure the primary CTA text is specific: "Buy the bundle — ₹9,999" or "Get instant access", not only "Buy now".
- [ ] 2.12 Add price anchoring: current price, compare price, savings, and what the price includes.
- [ ] 2.13 Add a "Not sure?" link to the contact page or a 2-question product finder.

### 5.4 Shared Components

- [ ] 2.14 Create shared Blade partials for: answer block, proof strip, guarantee, FAQ, comparison table, product card, CTA band.
- [ ] 2.15 Keep components server-rendered for SEO. No client-side-only content for primary copy.
- [ ] 2.16 Add `aria` labels and focus states to all interactive cards and FAQ items.

Definition of done: templates render with current data, no visual regression, and all copy is server-rendered.

---

## 6. Phase 3 — Product Catalog Data

- [ ] 3.1 Add these fields to every product in `config/products.php`:
  - `outcome` (one sentence)
  - `who_for` (3 bullets)
  - `not_for` (2 bullets)
  - `proof` (real metric or artifact)
  - `demo_image` / `demo_alt`
  - `sku`
  - `price_valid_until`
  - `license_summary`
  - `support_window`
- [x] 3.2 Rewrite `seo_title` for all 20 products to 50-60 chars. Current max is 93. → `config/product-seo.php`.
- [x] 3.3 Rewrite `seo_description` for all 20 products to 145-158 chars. Current max is over 160 on one. → `config/product-seo.php`.
- [ ] 3.4 Rewrite product `tagline` to lead with the outcome, not the mechanism.
- [ ] 3.5 Rewrite product `description` to a scannable structure: problem, mechanism, proof, who it is for, what changes.
- [ ] 3.6 Add category-level copy for the 10 categories. Use it on indexable category pages if created.
- [x] 3.7 Confirm which ratings/review counts are real. Remove or replace the rest. → removed from schema and visible UI; config fields kept for future verified reviews.
- [ ] 3.8 Add bundle merchandising data: individual total, bundle savings, contents, best-for.
- [ ] 3.9 Add a `last_updated` field and show it on product pages. Freshness helps AEO.

Priority order if time is limited:

1. Bundle
2. Agent Context Architect
3. MCP Server Launch Kit
4. n8n Hardening Pack
5. Agency Delivery OS
6. The 3 email products
7. Remaining products

---

## 7. Phase 4 — AEO and Structured Data

- [ ] 4.1 Add one answer-first block to each surface:
  - Home: who, what, for whom, where, outcome.
  - Store: what is sold, format, license, delivery, guarantee.
  - Product: what it is, who it is for, what it produces, how it is delivered.
- [ ] 4.2 Add a "Key facts" table to store and product pages: price, format, delivery, license, updates, support, refund.
- [ ] 4.3 Upgrade FAQs to 6-8 question-first entries per page. Answers 40-60 words, no fluff.
- [ ] 4.4 Add a comparison table to each surface. AI engines cite comparison content heavily.
- [ ] 4.5 Add "When not to use this" to each product. It increases trust and qualifies buyers.
- [ ] 4.6 Add author/entity block to product pages: built by, role, location, sameAs links.
- [ ] 4.7 Add `dateModified` and visible "Last updated" on product pages.
- [ ] 4.8 Schema upgrades:
  - Home: add `WebSite` + `Organization` (or keep `ProfessionalService`) and `ItemList` for featured products.
  - Store: add `CollectionPage` + `ItemList` + `FAQPage` + `BreadcrumbList`.
  - Product: keep `Product`, `Offer`, `FAQPage`, `BreadcrumbList`, `HowTo`.
  - Product: add `sku`, `image`, `category`, `seller`, `priceValidUntil`, `url`.
  - Product: remove `aggregateRating` unless visible, verified reviews exist.
  - Product: remove `OfferShippingDetails` for digital goods unless it is accurate; keep `MerchantReturnPolicy`.
  - Add `isSimilarTo` / `isRelatedTo` for cross-sells where valid.
- [ ] 4.9 Keep the JSON-LD as one `@graph` per page. Validate after every change.
- [ ] 4.10 Update `public/llms.txt` with:
  - all products with price, URL, format, license
  - store URL
  - bundle offer
  - refund/guarantee terms
  - last-updated date
- [ ] 4.11 Add a short "How to choose" section on the store to capture comparison queries.
- [ ] 4.12 Add internal links from journal articles to the relevant product pages where genuinely relevant. Do not force links.

Definition of done: Schema Validator shows zero errors; each surface has an answer block, key-facts table, FAQ, and comparison.

---

## 8. Phase 5 — Technical SEO and Performance

- [ ] 5.1 Title/meta budgets:
  - Home: 50-60 / 145-158
  - Store: 50-60 / 145-158
  - Product: 50-60 / 145-158, unique
- [ ] 5.2 One H1 per page. Demote repeated product card headings to H3 where appropriate.
- [ ] 5.3 Canonical rules:
  - `/products?category=x` -> canonical to `/products` unless a real category page is created.
  - `/products/{slug}?currency=INR` -> canonical to clean product URL.
  - Checkout, track, return, download -> `noindex, nofollow`.
- [ ] 5.4 Add `noindex` to thin/duplicate filter states.
- [ ] 5.5 Sitemap: include only canonical, indexable URLs. Add `lastmod` for products.
- [ ] 5.6 Internal linking:
  - Home -> bundle, store, top 3 services, contact.
  - Store -> each product, bundle, guarantee, FAQ.
  - Product -> related products, bundle, relevant service, contact.
  - Journal -> relevant product when the article maps to it.
- [ ] 5.7 Image SEO:
  - descriptive filenames, alt text, width/height, lazy loading below fold.
  - product demo images optimized to AVIF/WebP.
- [ ] 5.8 Performance:
  - remove or defer GSAP on store/product pages if not used.
  - self-host or preload fonts; reduce font weights.
  - preload the LCP image on home and product pages.
  - defer non-critical third-party scripts (AdSense, Pixel, Razorpay) where possible.
  - set long cache headers for static assets.
- [ ] 5.9 Accessibility:
  - color contrast, focus visible, keyboard FAQ, button labels, form errors.
- [ ] 5.10 Add `hreflang` only if a real second language exists. Do not add fake locales.

Definition of done: Lighthouse mobile >= 90 performance on store/product, 100 SEO, 100 best practices where feasible; no indexable duplicates.

---

## 9. Phase 6 — CRO and Analytics

- [ ] 6.1 Define the event map:
  - `view_item_list` on store
  - `select_item` on card click
  - `view_item` on product page
  - `add_to_cart`
  - `remove_from_cart`
  - `begin_checkout`
  - `add_payment_info`
  - `purchase`
  - `refund`
  - `generate_lead` for contact
  - `newsletter_subscribe`
- [ ] 6.2 Add client-side GA4 events in `public/js/main.js` / cart / checkout.
- [ ] 6.3 Add server-side `purchase` from `OrderController` or the Razorpay webhook, with `transaction_id` deduplication.
- [ ] 6.4 Add Meta Pixel standard events (`ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`) and dedupe with `event_id`.
- [ ] 6.5 Add UTM naming rules and a dashboard for: store sessions, product views, ATC rate, checkout start, purchase, AOV, refund rate.
- [ ] 6.6 Install a heatmap/session tool only with consent. Do not leak email/phone into recordings.
- [ ] 6.7 Add consent handling for analytics/marketing pixels if not already present.
- [ ] 6.8 Run experiments in this order:
  1. Hero CTA/offer
  2. Product above-fold outcome + proof
  3. Bundle spotlight vs grid-first
  4. INR-default vs USD-default price display
  5. Guarantee placement
- [ ] 6.9 Define one primary metric per experiment and a minimum sample. Do not call winners early.

Definition of done: GA4 DebugView shows the full funnel; purchase fires once per order; dashboard exists.

---

## 10. Phase 7 — QA and Launch

- [ ] 7.1 Run `scripts/audit-sales-pages.mjs` and require zero failures.
- [ ] 7.2 Validate schema on home, store, bundle, and 2 paid products.
- [ ] 7.3 Test checkout in Razorpay test mode: single product, cart with 3 items, free product, failed payment, success, download link.
- [ ] 7.4 Test mobile 360/390/430 px, tablet, desktop; check sticky bars and modals.
- [ ] 7.5 Test keyboard navigation and screen-reader labels on FAQ, cart, checkout.
- [ ] 7.6 Check 404s, redirects, canonical tags, and sitemap after deploy.
- [ ] 7.7 Submit updated sitemap in GSC; request indexing for the three surfaces.
- [ ] 7.8 Deploy behind a short observation window; keep the previous templates easy to restore.
- [ ] 7.9 Monitor for 7 days: errors, conversion, CWV, GSC coverage.
- [ ] 7.10 Run a 28-day review and decide the next experiment.

Definition of done: all gates pass, revenue events verified, no regression in checkout.

---

## 10A. Progress Log

### 2026-10-28 — Baseline + first implementation slice

- Built and ran `scripts/audit-sales-pages.php`; fixed a `bool` type bug in schema traversal.
- Baseline: 0/4 pages passed. After metadata/copy/schema fixes: 4/4 pages passed, 12/12 home keywords covered.
- Home: title 52 / description 156; premium H1 `AI systems, built to ship.` with keyword eyebrow; preloader `<h1>` removed; two above-fold CTAs (Hire + Shop); featured product row added above the story.
- Store: title 52 / description 152; H1 `AI Toolkits & Digital Products India`; offer-led lede; added qualification split, bundle comparison table, 6-question FAQ, and FAQ schema.
- Product metadata: all 20 titles/descriptions moved to `config/product-seo.php` within 50-60 / 145-158 char budgets.
- Product schema: removed unverified `aggregateRating`; added `sku`; visible star ratings replaced with production-tested/commercial-license labels.
- Store: added who-this-is-for split, bundle comparison table, 6-question FAQ with `FAQPage` JSON-LD, and buy-box guarantee.
- Home hero: premium H1 `AI systems, built to ship.`; keyword phrase moved to the eyebrow so SEO coverage stays intact while the headline reads like a brand line.
- Home hero: added four animated minimal SVGs for AI agent development, skill development, AI automation, and agentic website development; responsive 4/2/1 columns with reduced-motion fallback.
- Home: reduced to exactly one content image — the about portrait (`Fig. 02 — Deepak Bagada, AI Architect`); Meta Pixel `<noscript>` retained as tracking only. Hero portrait and project preview images removed.
- Home hero: replaced the portrait with a text-only "Currently" availability panel (Based in / Focus / Stack / Start a project), keeping the right column useful without an image.
- Home projects: redesigned "Main projects" as text-only editorial rows (index, tags, title, summary, description, visit link) with no imagery; removed the duplicate rule under the section heading.
- Home about: restored exact `AI Developer in Gujarat` phrasing; portrait lazy-loaded.
- Final audit: `research/sales-page-audit-one-image-projects-final.md` — 4/4 PASS.
- Product pages: added a "See what ships" terminal preview built from real `how_to_use` commands (only renders when read-only `cat/head/ls/tree` commands exist) and a "Before you buy" objection block covering stack fit, subscription, delivery speed, and refunds.
- Product pages: fixed escaped quotes in command previews so shell snippets render as `grep "retainer"` rather than `grep \"retainer\"`.
- Analytics: GA4 + Meta funnel events now fire — `view_item_list`/ViewContent on the store, `view_item`/ViewContent on products, `add_to_cart`/AddToCart, `begin_checkout`/InitiateCheckout on buy links and cart checkout, and deduplicated `purchase`/Purchase on the return page via `sessionStorage`.
- Performance: home intro preloader shortened (1.5s counter → 0.9s, 1.6s delay → 0.75s) and skipped entirely on repeat visits within a session; GSAP scripts deferred; added jsDelivr preconnect.
- Final audit after this slice: `research/sales-page-audit-final-2026-10-28.md` — 4/4 PASS. Tests: 80/81, with only the pre-existing `JournalTest` canonical-post failure.
- Still open: GSC/GA4/PageSpeed baselines, JSON-LD external validation, real testimonials/screenshots, product demo environments.

---

## 11. Dependencies and Inputs Needed

- [ ] Real testimonials or permission to quote clients.
- [ ] Real sales/usage numbers if they will be shown.
- [ ] Product screenshots or a demo environment for each featured product.
- [ ] Confirmation of the refund policy and support window.
- [ ] GA4, GSC, Razorpay, and Meta access for implementation and verification.
- [ ] Decision on category pages: index them with unique copy, or canonicalize filters to the store.

---

## 12. Out of Scope

- Rebuilding the checkout or payment provider.
- Changing the journal/blog publishing pipeline.
- A full brand identity redesign.
- Adding fake urgency, fake discounts, or fake reviews.
- Building a customer account area or affiliate system.

---

## 13. Suggested Execution Order

Day 1: Phase 0 audit + baseline + audit script.
Day 2: Phase 1 copy for home, store, bundle, and one paid product.
Day 3: Phase 2 templates for home and store.
Day 4: Phase 2 product template + shared components.
Day 5-6: Phase 3 data/copy for the remaining products.
Day 7: Phase 4 AEO/schema + `llms.txt`.
Day 8: Phase 5 technical SEO + performance.
Day 9: Phase 6 analytics + CRO instrumentation.
Day 10: Phase 7 QA + launch.
Day 11-38: monitor and run experiments.
