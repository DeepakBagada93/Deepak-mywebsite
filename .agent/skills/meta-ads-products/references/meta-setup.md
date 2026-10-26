# Meta Ads Setup — Business Manager, Pixel, CAPI and Manual Build

This skill is **manual-first**: it produces the plan, copy and creative prompts; you build the campaign in Ads Manager or Meta Ads Manager's bulk tools. No Marketing API token is required.

## 1. Accounts and access

1. Create or open **Meta Business Manager** (`business.facebook.com`).
2. Create an **ad account** with currency **INR** and timezone **Asia/Kolkata**.
3. Add a payment method. Prepaid cards can trigger a temporary hold; keep a buffer.
4. Add the landing-page domain to **Brand Safety → Domains** and verify it with DNS or meta-tag.
5. Give yourself **Admin** on the pixel, page, ad account and catalog (if used).

Do not run the plan on a USD ad account. The budget math, minimums and price are INR.

## 2. Pixel + Conversions API

Install the Meta Pixel on every page and the **Conversions API** server-side (or via your platform's native integration).

Required events:

| Event | Fires when | Value |
| --- | --- | --- |
| `PageView` | Every page | — |
| `ViewContent` | Product page | price |
| `AddToCart` | Add to cart | price |
| `InitiateCheckout` | Checkout starts | price |
| `Purchase` | Thank-you page / server webhook | price + `currency: INR` |

Rules:

- Send `value` and `currency` on Purchase. Without value, ROAS is blind.
- Deduplicate browser + server events with the same `event_id`.
- Use **Test Events** in Events Manager and complete a real test purchase before spending.
- Check **Event Match Quality**; add email/phone hashing if your checkout supports it.
- Do not fire Purchase on page load of a thank-you page that can be refreshed without a server check; use the order webhook when possible.

## 3. Aggregated Event Measurement (AEM)

1. Business Manager → **Aggregated Event Measurement**.
2. Select the verified domain.
3. Configure up to 8 web events in priority order: `Purchase`, `InitiateCheckout`, `AddToCart`, `ViewContent`, `Lead`, `PageView`.
4. Verify the domain and re-check after any site migration.

AEM matters for iOS opt-outs and attribution. If Purchase is not in the list, the campaign cannot optimize correctly.

## 4. Manual campaign build (Ads Manager)

### Campaign

1. Objective: **Sales**.
2. Campaign name: `META-IN-<product>-Sales-<date>`.
3. Turn on **Advantage+ campaign budget** only when there are 2+ ad sets.
4. Set the campaign budget from the pack (daily or lifetime). Lifetime is safer for a fixed test.
5. Do not enable Advantage+ shopping/catalog unless you have a product catalog; this is a digital product.

### Ad set

1. Conversion location: **Website**.
2. Pixel: select the verified pixel.
3. Conversion event: `Purchase` (or `AddToCart` if purchase volume is low).
4. Budget: from the pack, per ad set, if not using CBO.
5. Schedule: start date, no end date (or align with the test window).
6. Audience:
   - Broad: India, age 25–50, all genders, Advantage+ audience on, no interests.
   - Interest: India, age 25–50, the 6–10 interests from the pack.
   - Retargeting: custom audience from site/video/engagers, exclude purchasers.
7. Placements: **Advantage+ placements**, then exclude **Audience Network**.
8. Optimization and delivery: Highest volume; no cost cap for the first 7 days.
9. Attribution: 7-day click, 1-day view.

### Ad

1. Format: Single image, carousel, or video.
2. Upload the generated asset. For carousel, upload 5 cards in order.
3. Primary text, headline, description from the pack.
4. CTA: `Download` for the paid pack, `Learn more` for the free kit.
5. Destination URL with UTMs:
   `?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`
6. Preview on Facebook Feed, Instagram Feed, Reels and Stories before publishing.

### Naming

```
META-IN-<product>-Sales-<YYYYMMDD>
AS-Broad
AS-Interest
AS-Retargeting-30d
CR-IMG-1-Silent-Failure
CR-VID-1-Confession
```

## 5. UTM template

```
https://deepakbagada.in/products/n8n-hardening-pack
  ?utm_source=meta
  &utm_medium=paid
  &utm_campaign=meta-in-n8n-hardening-sales-2026-10-19
  &utm_content=cr-vid-1-confession
```

Use lowercase, hyphens, no spaces. Keep one naming convention across campaigns so reporting does not fragment.

## 6. Pre-launch verification

- [ ] Pixel fires PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.
- [ ] Purchase sends value + INR.
- [ ] Test Events shows browser and server events, deduplicated.
- [ ] Domain verified; AEM priority includes Purchase.
- [ ] Landing page loads <2.5s on 4G; checkout works on mobile.
- [ ] Ad account currency is INR.
- [ ] Campaign budget and ad set budgets match the pack.
- [ ] Each ad set has at least 3 creatives.
- [ ] Audience Network excluded.
- [ ] Purchasers excluded from prospecting.
- [ ] All copy passes character limits.
- [ ] Preview looks correct on Reels/Stories safe areas.

## 7. Common failures

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "Learning limited" | Too few events per ad set | Consolidate ad sets; optimize Add to Cart; raise budget |
| Purchase not tracked | Pixel/CAPI missing or AEM misconfigured | Test Events; check event priority; fire server-side |
| High CPM | Narrow audience or creative fatigue | Broaden; refresh creative; check frequency |
| Low CTR | Weak hook / unclear first frame | New first 2 seconds and new headline |
| Clicks but no add-to-cart | Landing page mismatch or slow page | Match promise; fix mobile speed; show price early |
| Ad disapproved | Personal attributes, income claim, before/after | Rewrite copy; remove guarantees; appeal |
| Spend not delivering | Budget below floor or bid cap too low | Raise to ₹300+/day; remove cost cap for 7 days |
| Retargeting ROAS looks huge | Tiny audience, last-click attribution | Wait for 1,000+ audience; compare incremental sales |

## 8. No-API note

There is no API-key-only path for Meta ads. The Marketing API requires an app, OAuth, ad account access and app review for production scopes. This skill deliberately avoids that: it generates a build-ready pack, and you paste it into Ads Manager. If you later automate, use the Marketing API with a system user token and keep the same plan JSON as the source of truth.
