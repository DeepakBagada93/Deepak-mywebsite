# Test Plan — India Offer & Pricing Kit

## Scope

| Area | Tested | Method |
| --- | --- | --- |
| GST and gateway maths | Yes | Unit tests |
| Floor-net enforcement | Yes | Tier fixtures |
| Psychological pricing | Yes | Helper tests |
| Break-even CPA / ROAS | Yes | Economics fixtures |
| Bundle price and discount | Yes | Bundle fixture |
| Offer audit | Yes | Clean and non-compliant fixtures |
| GSTIN validation | Yes | Pattern tests |
| CLI exit codes | Yes | Strict and default runs |
| GST filing correctness | No | Requires a CA |
| Conversion outcome | No | Cannot be guaranteed |

## Cases

1. **Single ladder** — ₹1,499 / ₹3,499 / ₹6,999, every tier nets at least the ₹1,000 floor.
2. **Net maths** — ₹1,499 yields ₹228.66 GST, ₹29.98 gateway, ₹1,240.36 net.
3. **Ad economics** — ₹30,000 at ₹18 CPC / 2% CVR gives 1,667 clicks, 33.3 sales, ROAS 1.66×, profitable.
4. **Bundle** — ₹2,999 bundle, 21% off the ₹3,797 sum, launch ₹1,999.
5. **Helpers** — next and previous psychological points round correctly.
6. **GSTIN** — valid 15-character number accepted; junk rejected.
7. **Clean page** — 100/100, refund wording not treated as a guarantee claim.
8. **Non-compliant page** — GST-exclusive, false urgency, income and guarantee claims, missing refund/contact/CTA; score 0.

## Exit criteria

- `node --test tests/*.test.mjs` exits 0.
- Clean offer strict run exits 0 with 100/100.
- Pricing output is strictly ascending.

## Out of scope

GST filing, invoicing, legal review, gateway integration, storefront updates and conversion guarantees.
