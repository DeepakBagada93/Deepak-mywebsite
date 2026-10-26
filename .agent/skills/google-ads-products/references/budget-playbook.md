# Budget playbook — Google Search for digital products (India, 2026)

The goal is not to spend ₹3,000. The goal is to buy the **minimum amount of evidence** needed to decide whether to scale, fix the offer, or stop.

## 1. Start from unit economics

```
break-even CPA = price × gross margin
target CPA     = break-even CPA × 0.7   (leave room for refunds and fees)
required sales = ad spend ÷ price
```

n8n Production Hardening Pack:

| Input | Value |
|---|---|
| Price | ₹2,499 |
| Gross margin | 85% |
| Break-even CPA | ₹2,124 |
| Target CPA | ₹1,487 |
| Sales needed to return ₹3,000 | 2 |

If the product price is ₹499 with a 70% margin, break-even CPA is ₹349. At ₹15–₹25 CPC you need a 2–4% CVR just to break even — usually not realistic for cold search traffic. Fix AOV (bundle/upsell) before buying ads.

## 2. The ₹3,000 model, three ways

Assumptions: 21 days, ₹142/day, India Search, English, manual CPC, digital product at ₹2,499.

| Scenario | CPC | Clicks | CVR | Sales | Revenue | ROAS | Read |
|---|---:|---:|---:|---:|---:|---:|---|
| Conservative | ₹22 | 136 | 0.5% | 0.7 | ₹1,700 | 0.57× | Losing test; offer/landing page problem. |
| Base | ₹17 | 176 | 1.0% | 1.8 | ₹4,400 | 1.47× | Break-even-ish; one extra sale makes it work. |
| Aggressive | ₹13 | 231 | 2.0% | 4.6 | ₹11,500 | 3.83× | Scale only after 2+ weeks of real data. |

**Base-case verdict:** ₹3,000 buys ~176 clicks and ~1.8 sales. That is enough to read CTR and CPC, and barely enough to read CVR. It is **not** enough to prove a channel. Do not promise "₹3,000 → 10 sales". Promise a decision.

## 3. Budget ladder

| Budget | Window | Daily | Base clicks | Base sales | What it can decide |
|---:|---|---:|---:|---:|---|
| ₹1,000 | 7 days | ₹143 | ~59 | 0.6 | Nothing statistically useful; smoke test only. |
| ₹1,500 | 10 days | ₹150 | ~88 | 0.9 | Smoke test: verifies tracking, settings and copy — not the offer. |
| ₹3,000 | 21 days | ₹143 | ~176 | 1.8 | CTR, CPC, search terms, early CVR signal. |
| ₹5,000 | 21 days | ₹238 | ~294 | 2.9 | First usable CVR read. |
| ₹10,000 | 30 days | ₹333 | ~588 | 5.9 | Confident scale/stop decision. |
| ₹20,000 | 30 days | ₹667 | ~1,176 | 11.8 | Real channel test with room for 2 ad variants. |

Clicks assume ₹17 average CPC. Your account will differ; re-run `research-keywords.mjs` for live bids.

The skill ships a ₹1,500 manual-test brief at `examples/n8n-1500-india.json` (10 days × ₹150/day, 3 ad groups). Generate the full paste-ready campaign file with:

```bash
node .agent/skills/google-ads-products/scripts/build-campaign-md.mjs \
  --brief=.agent/skills/google-ads-products/examples/n8n-1500-india.json \
  --keywords=.agent/skills/google-ads-products/examples/keyword-research-india.json \
  --out=.agent/skills/google-ads-products/runs/n8n-1500-india-campaign.md
```

At ₹1,500 the base case is **0.9 sales** — treat it as a setup/tracking test. Do not conclude the offer is bad from it.

## 4. Allocation across ad groups

For ₹142/day with three groups:

| Group | Intent | Share | Daily | Max CPC |
|---|---|---:|---:|---:|
| n8n audit & hardening | commercial | 35% | ₹50 | ₹18 |
| n8n developers & agencies | transactional | 35% | ₹50 | ₹22 |
| n8n templates & workflows | commercial | 30% | ₹42 | ₹12 |

Why not equal? Spend follows expected value: audit/hardening is the closest match to the product, agencies have the highest ticket tolerance, templates are the cheapest clicks but the weakest intent. Rebalance after 7 days using real CPA, not opinion.

Google may spend up to 2× the daily budget on a single day, but averages to the daily amount over the month. The monthly ceiling is what matters.

## 5. India Search benchmarks (directional)

| Segment | CPC range | Typical CVR |
|---|---:|---:|
| Generic SaaS / tools | ₹10–₹30 | 1–3% |
| Developer tools / templates | ₹8–₹25 | 0.5–2% |
| B2B services / agencies | ₹20–₹60 | 2–5% (lead form) |
| High-ticket consulting | ₹40–₹120 | 3–8% (qualified lead) |

These are planning ranges, not guarantees. Competition, Quality Score, landing page and ad relevance move CPC by 2–3×.

## 6. Stop and scale rules (pre-commit)

**Stop / fix the offer:**
- ₹1,000 spent, CTR < 0.8%, zero add-to-cart → rewrite the RSA and landing-page headline.
- 100 clicks, zero purchases → the offer or landing page is the problem; more budget will not fix it.
- CPA > 1.5× break-even after 2 sales → cut the worst keywords before adding spend.
- ROAS < 1 after 14 days and no improving trend → stop; do not "give it more time" without a change.

**Scale:**
- CPA ≤ target CPA and at least 2 sales → raise budget 20–30% per week, never double.
- One ad group carries the CPA → shift 20% of the worst group's budget to it.
- Add a second RSA only after the first has 1,000+ impressions.
- Keep the same campaign and landing page; change one variable at a time.

## 7. Research checklist (before you trust a keyword)

- Search the keyword in incognito. Are there ads? What do they promise? What price?
- Does the top result match your product, or is it a course/job board? If it is DIY content, skip it.
- Is the intent "buy/audit/hire" or "learn/free"? Only buy the first.
- Is the top-of-page bid ≤ 25% of your price? If not, the economics are hostile.
- Does your landing page answer the exact query in the H1 within 5 seconds?
- Can you prove the promise with a specific number, screenshot or checklist?

## 8. When not to run ads

- No conversion tracking.
- Landing page converts below ~1% from organic/referral traffic.
- Price under ₹500 with thin margin and a 1–2% CVR ceiling.
- No differentiation from free templates/docs.
- You need sales within 24 hours.
- You cannot handle the support load of 5+ sales per week.

Ads amplify an offer that already works. They do not fix a weak offer.
