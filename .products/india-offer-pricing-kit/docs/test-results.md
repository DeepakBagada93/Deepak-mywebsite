# Test Results — India Offer & Pricing Kit v1.0.0

Run date: 2026-10-20 · Environment: macOS, Node.js 20+

## Functional results

| Case | Expected | Actual | Status |
| --- | --- | --- | --- |
| Single ladder | 1499 / 3499 / 6999 | same | pass |
| Floor net | every tier ≥ ₹1,000 | all pass | pass |
| GST on ₹1,499 | ₹228.66 | ₹228.66 | pass |
| Gateway on ₹1,499 | ₹29.98 | ₹29.98 | pass |
| Net on ₹1,499 | ₹1,240.36 | ₹1,240.36 | pass |
| Break-even CPA | ₹1,240.36 | ₹1,240.36 | pass |
| Break-even ROAS | 1.21× | 1.21× | pass |
| Projected ROAS | 1.66× | 1.66× | pass |
| Verdict | PROFITABLE TEST | PROFITABLE TEST | pass |
| Bundle price | ₹2,999 | ₹2,999 | pass |
| Bundle discount | ≥ 15% | 21% | pass |
| Bundle launch | ₹1,999 | ₹1,999 | pass |
| Bundle warnings | none | none | pass |
| Psych helpers | correct rounding | correct | pass |
| GSTIN validation | accept valid, reject junk | pass | pass |
| Clean page | 100/100 | 100 | pass |
| Refund wording | not a guarantee claim | not flagged | pass |
| Non-compliant page | 0/100 with GST, urgency, income, guarantee, refund, contact, CTA | all present | pass |

## Structural checks

Frontmatter, required sections, placeholder absence, dependency-free scripts, required docs, tutorial coverage, listing pricing and guarantee, license terms, example parsing and path hygiene.

## Commands run

```bash
node --test tests/*.test.mjs
node skills/india-offer-pricing-kit/scripts/price-offer.mjs examples/economics.single.json
node skills/india-offer-pricing-kit/scripts/price-offer.mjs examples/economics.bundle.json
node skills/india-offer-pricing-kit/scripts/audit-offer-page.mjs examples/offer-page.clean.json --strict
node skills/india-offer-pricing-kit/scripts/audit-offer-page.mjs examples/offer-page.fixture.json
```

## Not verified

- GST treatment for a specific seller or state.
- Actual gateway rates, payment success and settlement time.
- Conversion, refund rate or revenue.
- Legal sufficiency of the dark-pattern and claim screening.
- Installation inside each IDE UI (Node CLI verified only).
