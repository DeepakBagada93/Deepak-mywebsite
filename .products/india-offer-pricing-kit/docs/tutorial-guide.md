# Tutorial Guide — India Offer & Pricing Kit

## 3-minute quickstart

1. Copy `skills/india-offer-pricing-kit/` into your agent's skills directory.
2. Open a terminal in `skills/india-offer-pricing-kit/`.
3. Price the sample product:

```bash
node scripts/price-offer.mjs ../../examples/economics.single.json --md=pricing.md
```

You should see Solo ₹1,499 / Pro ₹3,499 / Agency ₹6,999, with net ₹1,240.36 at Solo and break-even CPA ₹1,240.36.

4. Audit the sample page:

```bash
node scripts/audit-offer-page.mjs ../../examples/offer-page.clean.json --strict
```

You should see `Score: 100/100 · READY TO SELL` and exit code 0.

5. Ask your agent: *"Use India Offer & Pricing Kit to price this product and audit the page."*

## Install per client

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -R skills/india-offer-pricing-kit ~/.claude/skills/
```

Restart Claude Code and confirm with `/skills`.

### Cursor

```bash
mkdir -p .cursor/skills
cp -R skills/india-offer-pricing-kit .cursor/skills/
```

Add to `.cursorrules`: `For pricing and offer pages, follow .cursor/skills/india-offer-pricing-kit/SKILL.md.`

### Codex CLI

```bash
mkdir -p ~/.codex/skills
cp -R skills/india-offer-pricing-kit ~/.codex/skills/
```

Start a new session and reference the skill by name.

### Google Antigravity

Copy the folder into the project skills directory and attach `SKILL.md` to the agent context. Run scripts from the integrated terminal.

## Your first economics file

Create `my-economics.json`:

```json
{
  "product": "My Product",
  "audience": "Who buys it and what they compare it to",
  "floorNet": 800,
  "anchorValue": 2999,
  "gstRate": 18,
  "gatewayFeePct": 2,
  "gatewayGstOnFee": 18,
  "priceIncludesGst": true,
  "adSpend": 15000,
  "cpc": 18,
  "cvr": 0.02
}
```

Run:

```bash
node scripts/price-offer.mjs my-economics.json --out=pricing.json --md=pricing.md
```

If you already have a store ladder, add `"tierPrices": [999, 2499, 4999]` and `"economicsPrice": 999`. The engine still validates that every tier clears your floor.

## Your first offer file

Create `my-offer.json`:

```json
{
  "product": "My Product",
  "url": "https://example.in/products/my-product",
  "currency": "INR",
  "price": 999,
  "priceIncludesGst": true,
  "gstNumber": "24ABCDE1234F1Z5",
  "refundPolicy": "7-day refund if the files are not as described.",
  "deliveryTime": "Instant download",
  "contact": { "email": "hello@example.in", "whatsapp": "+91 90000 00000" },
  "paymentMethods": ["upi", "cards", "netbanking"],
  "headline": "A clear outcome for a specific buyer.",
  "cta": "Get it for ₹999",
  "testimonials": [{ "name": "Real Name", "result": "Specific result" }],
  "termsUrl": "https://example.in/terms",
  "privacyUrl": "https://example.in/privacy",
  "claims": ["What is actually true about the product."]
}
```

Run:

```bash
node scripts/audit-offer-page.mjs my-offer.json --md=audit.md --strict
```

## Prompt recipes

### Recipe 1 — Price from scratch

> Load India Offer & Pricing Kit. My product is [product] and the buyer is [audience]. My floor net is ₹[amount] after GST, refunds and support. Build the Solo/Pro/Agency ladder for India, show GST, gateway fee and net for each tier, then give me the launch price and a defensible anchor. Do not invent a higher anchor.

### Recipe 2 — Audit my page

> Load India Offer & Pricing Kit. Audit this offer page for GST-inclusive display, GSTIN, refund window, delivery, contact, UPI, testimonials, dark patterns and claims. Give me the score and the exact fix for every critical and high finding. Do not rewrite the whole page yet.

### Recipe 3 — Ad budget at this price

> Load India Offer & Pricing Kit. At ₹[price], 18% GST and a 2% gateway, what is my net per sale and break-even CPA? With ₹[spend] at ₹[cpc] and [cvr]% CVR, is this a learning test or a scale budget? Show the maths and the decision rule.

### Recipe 4 — Bundle pricing

> Load India Offer & Pricing Kit. I sell three products at ₹1,499, ₹1,299 and ₹999. Recommend a bundle price for India, the discount percentage, the tier ladder for the bundle and the launch offer. Keep it defensible under the dark-pattern rules.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Adding GST at checkout | Display the inclusive price and show the breakup |
| Leaving `floorNet` at zero | Compute support + refund + profit per sale |
| Using a $99 anchor for a ₹999 product | Use a real reference or no anchor |
| Discounting before fixing proof | Conversion problems are usually trust, not price |
| Offering three tiers with no difference | Differentiate seats, client rights or support |
| Launch price that never ends | Time-box it with a real date |

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Usage: node price-offer.mjs <economics.json>` | No file argument | Pass the JSON path |
| `Pricing error: tiers are not strictly ascending` | Duplicate or unordered `tierPrices` | Use three distinct ascending prices |
| Score drops on `money-back guarantee` | None — refund language is exempt | If it still flags, rephrase as "refund policy" |
| `OFFER_GSTIN_INVALID` | Wrong length or characters | Use the 15-character GSTIN from the portal |
| `OFFER_NO_UPI` | UPI not listed | Enable UPI and show it at checkout |
| `OFFER_GST_EXCLUSIVE` | `priceIncludesGst` false | Make the displayed price inclusive |
| Skill not discovered | Folder copied incompletely | Copy the whole directory |

## FAQ

**Is the 18% GST rate always correct?** Digital services are normally 18%, but registration and classification vary. Confirm with a CA.

**What gateway fee should I use?** 2% for domestic cards is a common planning default; add 18% GST on the fee. Your negotiated rate may differ.

**Do I need a GSTIN to sell?** Not always, but if you are registered you must display it and issue invoices. The audit warns, it does not decide.

**Can I use this for services?** Yes. Set the floor net from delivery cost and target profit per engagement.

**Does it change prices on my store?** No. It recommends and audits; you update the store.

**Is a ₹2,999 bundle better than ₹3,499?** The engine computes both; ₹2,999 is a stronger psychological point and roughly 21% off the individual sum.

**What if refunds exceed 5%?** Fix the promise or the product. Hiding the refund policy is not a fix.
