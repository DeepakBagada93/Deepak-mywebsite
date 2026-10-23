# India Offer & Pricing Kit

**Stop guessing what to charge. Price for GST, UPI and the Indian buyer.**

A Claude Code skill that turns your costs into a GST-aware three-tier price ladder, computes break-even CPA and ROAS, and audits the offer page for the trust signals and dark patterns that decide whether an Indian buyer pays.

## The problem

Most Indian digital products are priced by copying a US number and adding "₹". Then GST is added at checkout, the gateway takes 2.36%, the refund hits, and the founder discovers the ₹999 product nets ₹826 — before support.

Or the page shows "₹1,499 + GST", has no UPI option, no refund window and a countdown that resets every hour. Traffic arrives; nobody buys.

## What it does

| Stage | Output |
| --- | --- |
| Economics | GST, gateway fee, net per sale, floor net |
| Ladder | Solo / Pro / Agency on psychological price points |
| Ad maths | Break-even CPA, break-even ROAS, projected profit |
| Offer | Core deliverable, proof, risk reversal, tier difference |
| Page | Headline, inclusions, price block, FAQ, CTA |
| Audit | GST display, GSTIN, refund, contact, UPI, dark patterns, claims |
| Launch | 7-day measurement plan and price-test rules |

## Quickstart

```bash
cd skills/india-offer-pricing-kit

# 1. Build the ladder
node scripts/price-offer.mjs my-economics.json --md=pricing.md

# 2. Audit the offer page
node scripts/audit-offer-page.mjs my-offer.json --md=audit.md --strict
```

Pure Node 20+, no dependencies, no API keys, no network calls.

## What's included

```
skills/india-offer-pricing-kit/SKILL.md    # the skill your agent loads
skills/india-offer-pricing-kit/scripts/    # pricing engine + offer audit
examples/                                  # economics briefs, clean page, flawed page, expected reports
docs/tutorial-guide.md                     # setup + 4 prompt recipes
docs/store-listing.md                      # ready-to-paste sales page
tests/                                     # structural + functional tests
```

## Pricing (India)

| Tier | Price | For |
| --- | --- | --- |
| Solo | ₹999 | One product or service |
| Pro | ₹2,499 | 5 seats, full toolkit |
| Agency | ₹4,999 | Unlimited client pricing work |

30-day money-back guarantee. Launch price ₹699 for the Solo tier.

## Verify it yourself

```bash
node --test tests/*.test.mjs
node skills/india-offer-pricing-kit/scripts/audit-offer-page.mjs examples/offer-page.clean.json --strict
```

Expected: all tests pass, clean page 100/100, flawed page 0/100.

## Support

support@deepakbagada.in · [deepakbagada.in/products](https://deepakbagada.in/products)
