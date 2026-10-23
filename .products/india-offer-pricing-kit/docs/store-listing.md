# India Offer & Pricing Kit

## Your price is not the problem. Your net is.

₹1,499 looks fine until GST takes ₹228, the gateway takes ₹30, one refund takes ₹1,499 and support takes an hour.

India Offer & Pricing Kit is a Claude Code skill that builds a GST-aware price ladder from your actual costs, computes what you can afford to spend on ads, and audits the offer page before you send traffic.

---

## The problem

You copied a $49 price, added "₹", and launched. Then:

- GST was added at checkout and conversion dropped.
- UPI was buried, so half the buyers left.
- The refund policy was missing, so nobody trusted the page.
- The "only 3 seats left" countdown reset every hour.
- You spent ₹15,000 on ads and could not tell whether the price or the page was wrong.

## What you get

| Feature | What it does |
| --- | --- |
| **GST-aware pricing** | Net per sale after 18% GST and ~2.36% effective gateway fees |
| **Floor-net guard** | Rejects tiers that cannot cover support, refunds and profit |
| **Psychological ladder** | Solo / Pro / Agency on ₹99, ₹499, ₹999, ₹1,499, ₹2,999 points |
| **Launch & anchor** | A time-boxed launch price and a real reference price, not a fake one |
| **Ad economics** | Break-even CPA, break-even ROAS, projected profit and an honest verdict |
| **Offer audit** | GSTIN, refund window, delivery, email/WhatsApp, UPI, terms, privacy |
| **Dark-pattern check** | False urgency, drip pricing and undisclosed recurring charges |
| **Claim scan** | Guarantees, income promises, health claims and superlatives |

## What's included

```
skills/india-offer-pricing-kit/SKILL.md      The skill your agent loads
skills/india-offer-pricing-kit/scripts/      Pricing engine + offer audit (zero dependencies)
examples/                                     Single product, bundle, clean page, flawed page
docs/tutorial-guide.md                       3-minute setup, 4 installs, 4 prompt recipes
tests/                                       Structural and functional tests
```

No API keys. No subscriptions. No network calls.

## Proof it works

- Ad Creative Lab at ₹1,499 → net **₹1,240.36**, break-even CPA **₹1,240.36**
- Three-skill bundle at ₹2,999 → net **₹2,481.55** per sale, projected ROAS **3.33×**
- Clean page → **100/100, READY TO SELL**
- Flawed page → **0/100, DO NOT LAUNCH**: USD, GST-exclusive, no refund, no contact, false urgency and an income claim all caught

Run it before you buy:

```bash
node --test tests/*.test.mjs
```

## Pricing

| Tier | Price | Seats | Best for |
| --- | --- | --- | --- |
| **Solo** | **₹999** | 1 | One product or service |
| **Pro** | **₹2,499** | 5 | Full toolkit for a small team |
| **Agency** | **₹4,999** | Unlimited | Client pricing work |

Launch offer: **₹699** for the first 100 Solo buyers.

All tiers include the skill, both scripts, examples, tests, tutorial and v1.x updates. GST invoice available.

## 30-day money-back guarantee

Run the engine on your own numbers. If the calculations or audit do not work as documented, email support@deepakbagada.in within 30 days with your order ID for a full refund.

## Who it is for

- Indian founders launching a digital product between ₹499 and ₹9,999
- Course creators who need instalments and a credible price ladder
- Agencies pricing client offers and audits
- Anyone who has said "₹1,499 plus GST" and lost the sale

## Who it is not for

- Businesses outside India
- Sellers who need GST filing or accounting software
- Anyone looking for guaranteed conversion or revenue

## FAQ

**Is this tax advice?**
No. It applies a configurable GST model and flags what to confirm. Your CA decides the filing position.

**Which GST rate is used?**
18% by default for digital services. You can change it; the engine warns when it is not 18%.

**What gateway fee is assumed?**
2% for domestic cards plus 18% GST on the fee, about 2.36% effective. Edit it to your negotiated rate.

**Can I use my existing prices?**
Yes. Pass `tierPrices` and the engine still validates net revenue and computes break-even CPA.

**Does it update my store?**
No. It recommends and audits; you change the store.

**Will this guarantee sales?**
No. It guarantees the arithmetic and the trust checklist. Sales still depend on the offer and the traffic.

**What if I hate it?**
30-day refund, no argument.

---

**Buy India Offer & Pricing Kit →** [deepakbagada.in/products/india-offer-pricing-kit](https://deepakbagada.in/products/india-offer-pricing-kit)
