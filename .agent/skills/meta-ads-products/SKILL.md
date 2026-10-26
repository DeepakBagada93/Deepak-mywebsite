---
name: meta-ads-products
description: >
  Plan and produce a complete Meta (Facebook/Instagram) ads pack for a digital product without the Marketing API:
  budget → campaign/ad-set count, audience targeting, placements and bidding, high-converting single-image and
  carousel prompts, three UGC video ad prompts with verbatim dialogue for Veo 3.1 / Flow, ad copy within Meta
  limits, a launch checklist and stop/scale rules. Includes a deterministic pack generator and an audit gate.
  Never guarantees results; never spends; never asks an image model to render captions or logos.
---

# Meta Ads Products (`meta-ads-products` v1.0)

Cold-start a Meta ads test for a digital product — with budget math, the right number of ad sets, audience targeting, and a complete creative pack: 3 single images, a 5-card carousel, 3 UGC video prompts with dialogue, and the copy to run them.

Built for the ₹10,000 / 14-day example, and scales the same model from a ₹3,000 smoke test to ₹50,000+.

## The quality bar (non-negotiable)

| Rail | Rule |
|---|---|
| **Offer economics first** | Price, margin, break-even CPA and one provable promise. If the promise is vague, stop. |
| **Budget decides structure** | Total → daily → campaign count → ad-set count → per-ad-set budget. Never split below ₹300/day per cold ad set. |
| **One broad ad set is the default** | Broad + Advantage+ audience beats a pile of interest guesses at small budgets. Interest is a test, not a home. |
| **Honest projection** | Show CPM, CTR, CVR, CPA and ROAS assumptions. Say "learning-constrained" when it is. Never promise ROAS. |
| **Three creatives minimum per ad set** | One image, one carousel and one video is a test. One creative is a coin flip. |
| **Copy within limits** | Primary text ≤125 chars for feed, headline ≤40, description ≤30, carousel card description ≤20. |
| **Prompts are production-complete** | Format, subject, action, environment, lighting, lens, color grade, composition, negative space and negative prompt. No "make it viral". |
| **UGC has real dialogue** | 9:16, 10s, one continuous take, ≤30 words, verbatim dialogue inside the prompt, shared character block, no burned-in text. |
| **Text is added in the editor** | Image models should not render headlines, prices or logos. Prompts reserve negative space; Canva/CapCut adds type. |
| **Manual by design** | No API keys, no ad-account OAuth. The output is a build-ready markdown pack for Ads Manager. |
| **Policy-safe** | No income guarantees, fake urgency, personal-attribute copy or invented proof. |
| **Audit before launch** | `audit-meta-pack.mjs` must pass. Warnings are decisions, not noise. |

## When to use

- "Make me a Meta ads plan for my product"
- "How many ad sets should I run on ₹10,000?"
- "Give me high-converting image ad prompts — single image and carousel"
- "Give me 3 UGC video prompts with dialogue for Veo / Flow"
- "Write the primary text, headlines and descriptions for Facebook/Instagram"
- "I want to build the campaign manually — give me everything in one file"
- "Audit my Meta creative pack before I spend"

Not for: Google Search (`google-ads-products`), organic social calendars (`social-media-content-plan`), or landing-page design (`vibe-code-webapp`).

## Files

```
.agent/skills/meta-ads-products/
├── SKILL.md
├── memory.md                          # run ledger — append every pack
├── examples/
│   ├── n8n-10000-india.json           # ₹10,000 / 14-day example
│   └── n8n-3000-india.json            # ₹3,000 / 7-day smoke test
├── references/
│   ├── meta-playbook.md               # budget ladder, audiences, creative, benchmarks
│   └── meta-setup.md                  # Business Manager, pixel/CAPI, AEM, manual build
├── scripts/
│   ├── build-meta-pack.mjs            # brief → full markdown + JSON pack
│   ├── plan-core.mjs                  # budget → campaigns/ad sets/projections
│   ├── prompts.mjs                    # image, carousel and UGC prompt builders
│   ├── audit-meta-pack.mjs            # hard gate: structure, copy limits, prompt completeness
│   └── lib.mjs                        # args, JSON, INR/table helpers
└── runs/                              # generated packs + plan JSON
```

## The mandatory workflow

### Stage 0 — Offer economics (5 minutes)

Establish:

- **Price** and **gross margin** (digital product: usually 80–95%).
- **Break-even CPA** = price × margin. For the n8n pack: ₹2,499 × 0.85 = **₹2,124**.
- **Target CPA** = break-even × 0.7 = **₹1,487**.
- **Landing page** that matches the ad promise and takes payment.
- **Conversion event** (Purchase) that fires with value + INR.
- **One provable promise**: "12 checks before your n8n workflow goes live", not "grow your business".

If the promise cannot be shown in a screenshot or a 10-second clip, rewrite it before generating creative.

### Stage 1 — Pick three angles, not thirty

Every pack uses three psychological jobs:

| Angle | Job | Example hook |
|---|---|---|
| Loss / silent failure | Make the invisible risk visible | "It didn't fail. It failed silently." |
| Authority / client story | Borrow trust from real work | "My client's workflow died at 2AM." |
| Specific value | Make the mechanism concrete | "12 checks before handoff." |

Three angles map cleanly to three UGC videos, three single images and five carousel cards. More angles at a small budget dilutes the test.

### Stage 2 — Budget → structure

The engine in `plan-core.mjs`:

```
daily            = total ÷ days
campaigns        = 1 (2 only at ₹40,000+)
ad sets          = 1 / 2 / 3 / 4 by budget and daily floor
per ad set       = total × share
cold ad-set floor= ₹300/day
projection       = spend ÷ CPM × 1000 × CTR × CVR × price
break-even CPA   = price × margin
```

| Total budget | Days | Daily | Campaigns | Ad sets |
|---|---|---|---|---|
| < ₹3,000 | 7 | < ₹430 | 1 | 1 broad |
| ₹3,000–₹7,000 | 10–14 | ₹300–₹700 | 1 | 1 broad |
| ₹7,000–₹15,000 | 10–14 | ₹600–₹1,070 | 1 | 2 (broad + interest) |
| ₹15,000–₹40,000 | 14–21 | ₹700–₹2,800 | 1 | 3 (broad + interest + retarget) |
| ₹40,000+ | 21–30 | ₹1,300+ | 2 | 3 prospecting + 1 retarget |

The engine **reduces the ad-set count** when a split would leave a cold ad set below ₹300/day. It does not "make the numbers work" by starving a test.

For ₹10,000 / 14 days at ₹714/day: **2 ad sets** — Broad ₹393/day (55%) and Interest ₹321/day (45%), 4 creatives each. Projected 499 clicks, 6.4 sales, ₹15,913 revenue, ROAS 1.59×, CPA ₹1,570 at the default assumptions.

**Say the honest part out loud:** at a ₹1,487 target CPA, Meta wants ~₹10,600/day for 50 events/week per ad set. This budget will not exit learning. Judge hook rate, CTR and cost per add-to-cart first. Do not promise a stable CPA.

### Stage 3 — Build the pack

```bash
node .agent/skills/meta-ads-products/scripts/build-meta-pack.mjs \
  --brief=.agent/skills/meta-ads-products/examples/n8n-10000-india.json \
  --out=.agent/skills/meta-ads-products/runs/n8n-10000-india-meta-pack.md \
  --json=.agent/skills/meta-ads-products/runs/n8n-10000-india-meta-pack.json
```

For a smoke test:

```bash
node .agent/skills/meta-ads-products/scripts/build-meta-pack.mjs \
  --brief=.agent/skills/meta-ads-products/examples/n8n-3000-india.json \
  --out=.agent/skills/meta-ads-products/runs/n8n-3000-india-meta-pack.md \
  --json=.agent/skills/meta-ads-products/runs/n8n-3000-india-meta-pack.json
```

The pack contains:

1. Snapshot and honest projection.
2. Campaign/ad-set structure with the budget ladder.
3. Audience targeting, placements, bidding and pixel setup.
4. **3 single-image prompts** (4:5) with on-image copy and negative prompts.
5. **5 carousel prompts** (1:1) hook → problem → mechanism → proof → offer.
6. **3 UGC video prompts** (9:16, 10s) with verbatim dialogue, beats, on-screen text, caption, shared character block and Veo settings.
7. Ad copy bank with character counts.
8. Launch checklist.
9. Measurement and stop/scale rules.
10. Assumptions and disclaimers.

### Stage 4 — Generate the visuals

**Single images** (4:5, 1080×1350): generate 4 variations per prompt. Pick clean hands, readable screens, real skin. Add the headline in Canva in a bold grotesk, max 6 words, inside the safe area.

**Carousel** (1:1, 1080×1080): same grade across all 5 cards. Card 1 must work alone in feed. Card 5 is the only card with price and CTA.

**UGC video** (9:16, 1080×1920, 10s): Veo 3.1 / Flow. Use a reference image of the creator and paste the CHARACTER block verbatim. Lock the seed. Generate 3 takes per prompt. Keep one continuous take; add captions and on-screen text in CapCut. Normalize dialogue to −14 LUFS.

**Never** ask the model to render the headline, price, captions or logos. It will warp them.

### Stage 5 — Copy within Meta limits

- **Primary text:** ≤125 chars for feed (hard fail >250).
- **Headline:** ≤40.
- **Description:** ≤30.
- **Carousel card description:** ≤20.
- **CTA:** one per ad.
- **Fluff blocklist:** unlock, game-changer, revolutionary, guaranteed, secret, skyrocket, insane, hack, 100%, best ever, amazing.
- **Policy:** no income guarantees, no personal-attribute copy ("Are you a failed developer?"), no fake urgency.

### Stage 6 — Audit (hard gate)

```bash
node .agent/skills/meta-ads-products/scripts/audit-meta-pack.mjs \
  --pack=.agent/skills/meta-ads-products/runs/n8n-10000-india-meta-pack.json \
  --md=.agent/skills/meta-ads-products/runs/n8n-10000-india-meta-pack.md
```

The audit fails on: budget over `META_MAX_BUDGET` (default ₹50,000), ad-set budgets that do not sum to total, too many ad sets for the budget, missing purchaser exclusions, Audience Network not excluded, copy over hard limits, fluff phrases, missing carousel cards, incomplete image/UGC prompts, dialogue not verbatim in the prompt, or missing markdown sections.

**Do not hand over a pack with errors.** Warnings about learning volume and thin daily budgets are expected and should be stated to the user.

### Stage 7 — Build and launch manually

Follow `references/meta-setup.md`:

1. Verify the domain and pixel/CAPI.
2. Confirm Purchase fires with `value` + INR in Test Events.
3. Configure AEM with Purchase in the priority list.
4. Build the campaign exactly as the pack says: Sales objective, correct ad-set count, broad + interest, Audience Network excluded, purchasers excluded.
5. Upload 3–4 creatives per ad set.
6. Add UTMs and preview on Reels/Stories.
7. Launch with the pack's daily budget. Do not "test" a higher budget on day one.

### Stage 8 — Measure and decide

- **72h:** hook rate, CTR, CPM, cost per add-to-cart.
- **7 days:** CPA vs target, ROAS, creative-level kill list.
- **14 days:** scale 20% every 3 days if CPA holds; consolidate if one ad set owns 80% of conversions; stop after two weeks above break-even with no improving trend.
- Retargeting is judged only after 1,000+ visitors.

## Custom brief

```bash
cp .agent/skills/meta-ads-products/examples/n8n-10000-india.json \
   .agent/skills/meta-ads-products/runs/my-product.json
```

Edit:

- `offer` — product, price, margin, promise, landing page, proof.
- `budget` — total, days, max.
- `conversion` — event and optimization event.
- `targeting` — countries, age, languages, interests, audience availability.
- `creative` — tool, checks, palette, workspace, creator identity.
- `ad_copy` — primary text, headlines, descriptions, carousel cards, CTA.

Then rerun `build-meta-pack.mjs`. If `ad_copy` is omitted, the generator writes n8n-specific defaults — replace them for any other product.

## Guardrails

- **No spend.** This skill never touches an ad account or API.
- **No fabricated proof.** Use real client work, real numbers, real screenshots.
- **No guarantees.** "12 checks" is a mechanism; "guaranteed clients" is a policy violation.
- **No AI-rendered text.** Prompts reserve space; editors add type.
- **One creator across UGC ads.** Same face, wardrobe and setting; otherwise the account looks synthetic.
- **No 15-creative ad sets.** 3–4 per ad set at this budget.
- **No interest stacking on broad.** Broad stays broad.
- **No scaling before signal.** 50 purchases or a stable cost per add-to-cart first.

## Examples

| Brief | Output |
|---|---|
| `examples/n8n-10000-india.json` | `runs/n8n-10000-india-meta-pack.md` — 2 ad sets, 3 images, 5 carousel cards, 3 UGC prompts, 3 primary texts, 5 headlines |
| `examples/n8n-3000-india.json` | `runs/n8n-3000-india-meta-pack.md` — 1 broad ad set smoke test |

Both pass `audit-meta-pack.mjs`.

## Related

- `references/meta-playbook.md` — budget ladder, audience recipes, prompt formulas, benchmarks, policy.
- `references/meta-setup.md` — Business Manager, pixel/CAPI, AEM, manual build, common failures.
- `paid-ads-studio` — broader paid-ads prompt/campaign patterns across Meta and Google.
