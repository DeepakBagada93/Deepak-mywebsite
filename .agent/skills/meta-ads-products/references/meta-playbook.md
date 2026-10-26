# Meta Ads Playbook — Budget, Audiences, Creative, Measurement

Directional rules for small-budget Meta ads selling a digital product in India. Replace every benchmark with your own last-30-day account data as soon as you have it.

## 1. Budget → ad-set ladder

Meta's learning phase wants ~50 optimization events per ad set per week. A ₹2,499 product at a ₹1,500 CPA needs ~₹10,600/day to hit that — which is why most small budgets are learning-constrained. That is not a reason to avoid Meta; it is a reason to consolidate and judge earlier signals.

| Total budget | Days | Daily | Campaigns | Ad sets | What the test can answer |
| --- | --- | --- | --- | --- | --- |
| < ₹3,000 | 7 | < ₹430 | 1 | 1 broad | Pixel, checkout, creative render, hook rate. |
| ₹3,000–₹7,000 | 10–14 | ₹300–₹700 | 1 | 1 broad | CTR and cost per add-to-cart. Purchases are directional. |
| ₹7,000–₹15,000 | 10–14 | ₹600–₹1,070 | 1 | 2 (broad + interest) | Which audience angle and which 3–4 creatives deserve budget. |
| ₹15,000–₹40,000 | 14–21 | ₹700–₹2,800 | 1 | 3 (broad + interest + retarget) | Cold vs warm demand; first stable CPA signal. |
| ₹40,000+ | 21–30 | ₹1,300+ | 2 (prospecting + retargeting) | 3 + 1 | Scale winners; isolate retargeting economics. |

Rules:

- **₹300/day per cold ad set** is the practical floor. Below it, delivery is unstable and learning is noise.
- **Consolidate before you split.** Two ad sets at ₹250/day are worse than one at ₹500/day.
- **Retargeting is not a cold-start audience.** Build it only with 1,000+ site visitors, video viewers or engagers in the last 30 days.
- **Lookalikes need source volume.** 1% purchasers needs 1,000+ purchasers/leads. Otherwise use a 1% add-to-cart or lead source.
- **Do not run 6 ad sets on ₹10,000.** You will starve every one of them.

## 2. Audience recipes

### Broad (default)

- Country: India.
- Age: 25–50 for a ₹2,499 B2B/prosumer product.
- Gender: all.
- Languages: English + Hindi (drop Hindi if the page is English-only and bounce is high).
- Advantage+ audience: on.
- Interests: none.
- Exclusions: purchasers 180d, existing customer list.

Broad wins because Meta's delivery system optimizes on the conversion event, not on your assumptions about job titles.

### Interest stack (test only)

Use 6–10 interests, not 30:

- Business owners
- Software developers
- Automation
- SaaS
- Digital marketing
- No-code
- Make.com
- Zapier
- AI tools

If the interest ad set's cost per add-to-cart is >30% worse than broad after 7 days, turn it off. Do not keep it "for reach".

### Lookalike 1%

- Source: purchasers (best), add-to-cart, or leads.
- Minimum source: 1,000 users.
- Country: same as source.
- Age: 25–50.
- Exclude purchasers 180d.
- One lookalike is enough at small budgets; 1%, 2% and 3% stacked is usually waste.

### Retargeting

- Website visitors 30d.
- Video viewers 50% (last 30d).
- Instagram/Facebook engagers 90d.
- Add-to-cart / initiate-checkout 7d (highest intent).
- Exclude purchasers 180d.
- Frequency cap: not available in the ad set; watch frequency in reporting. Above 4–5 in 7 days, refresh creative.

### Exclusions that always apply

- Purchasers 180d.
- Existing customer email list.
- Employees / internal IPs where possible.
- Do not exclude "all visitors" from prospecting at small budgets; the overlap is usually too large and shrinks delivery.

## 3. Campaign settings

| Setting | Recommendation |
| --- | --- |
| Objective | Sales |
| Conversion location | Website |
| Optimization event | Purchase; use Add to Cart if <50 purchases in 30 days |
| Bid strategy | Highest volume (lowest cost) for 7 days, then cost cap at target CPA |
| Attribution | 7-day click, 1-day view |
| Placements | Advantage+ placements; exclude Audience Network |
| Campaign budget | CBO when 2+ ad sets |
| Ad set budget | Only when intentionally capping a test |
| Schedule | Run continuously; do not daypart a small test |
| Creative | 3–4 per ad set, not 15 |

## 4. Creative principles

One ad = one idea. The first six words are the ad.

### Hook formulas that work for this category

- **Loss / silent failure:** "It didn't fail. It failed silently."
- **Confession:** "I almost sent this to a client."
- **Specific number:** "12 checks before handoff."
- **Stakes:** "2AM. No alert. No retry."
- **Contrarian:** "Your workflow isn't broken. Your monitoring is."

### Image rules

- 4:5 for feed (1080×1350), 1:1 for carousel (1080×1080), 9:16 for Stories/Reels.
- One focal point; high contrast; real hands, real desks, real screens.
- Leave 30–40% negative space for the headline.
- Max 6 words on the image. Add text in Canva, not in the image model.
- Faces and eyes beat abstract dashboards. A founder at a desk beats a generic laptop.
- Use a consistent grade across a carousel: charcoal + emerald + warm paper works for technical products.
- No stock-photo smiles, no floating UI, no neon cyberpunk.

### Image prompt formula

```
[format + lens] + [subject and action] + [environment/props] + [lighting] + [color grade] + [composition / negative space] + [style] + [no text / no logos]
```

Then a separate **negative prompt**: extra fingers, distorted hands, illegible UI, warped text, logos, stock smile, oversaturated, low resolution.

### UGC video formula

```
[format, duration, camera] + [character block verbatim] + [action/beat] + [verbatim dialogue] + [audio/SFX] + [continuity rules] + [negative]
```

- 9:16, 1080×1920, 10s, 24fps, handheld front camera, natural window light.
- One continuous take; no cuts; no burned-in captions.
- Dialogue ≤30 words for 10 seconds.
- Hook in the first 2 seconds; one CTA at the end.
- Same creator, wardrobe and setting across all three ads so the account looks like one human, not a creative factory.
- Add captions, on-screen text and the product card in CapCut/Premiere.

## 5. Ad copy limits

| Placement | Limit | Practical target |
| --- | --- | --- |
| Primary text | 63,206 chars | ≤125 chars for feed |
| Headline | 40 chars | ≤40 |
| Description | 30 chars | ≤30 |
| Carousel card headline | 40 chars | ≤40 |
| Carousel card description | 20 chars | ≤20 |
| CTA | Platform button | One CTA |

Write three primary-text variants: loss, specificity, proof. Do not write three versions of the same sentence.

## 6. Benchmarks (India, directional)

| Metric | Weak | Healthy | Investigate |
| --- | --- | --- | --- |
| CPM | > ₹450 | ₹150–₹350 | < ₹100 (junk inventory) |
| CTR (link) | < 0.8% | 1.2–2.5% | > 4% (curiosity without intent) |
| 3-sec hook rate | < 20% | 25–40% | > 50% (check retention) |
| Purchase CVR | < 0.8% | 1.2–2.5% | > 4% (check pixel duplication) |
| CPA | > break-even | ≤ target CPA | — |
| ROAS (cold) | < 1.0× | 1.3–2.0× | > 3× (check attribution) |
| Retargeting ROAS | < 2× | 3–6× | > 10× (tiny audience, low confidence) |

At ₹2,499 with 85% margin: break-even CPA ₹2,124, target CPA ₹1,487.

## 7. Read / stop / scale

### 72 hours

- Hook rate <20% → new first 2 seconds.
- CTR <0.8% → new creative, not a new audience.
- CPM >₹450 → audience too narrow or creative fatigue.
- Cost per add-to-cart is the early signal before purchases.

### 7 days

- CPA within 30% of target → keep.
- CPA 30–50% over → new angle.
- CPA 2× over → kill the ad set.
- Any ad at 2× the best CPA with <3 purchases → pause.

### 14 days

- Scale 20% every 3 days while CPA stays within 20% of target. Never double overnight.
- If one ad set owns 80% of conversions, move budget to it and keep one test alive.
- Judge retargeting only after 1,000+ visitors.
- Stop after two consecutive weeks above break-even CPA with no improving trend.

### Do not

- Judge a ₹10,000 test on day 2.
- Change creative and audience at the same time.
- Scale before the pixel has 50 purchases.
- Optimize for Purchase with <50 purchases in 30 days; use Add to Cart first.

## 8. Policy guardrails

- No income guarantees, get-rich claims, or "guaranteed clients".
- No before/after that implies a guaranteed result.
- No personal-attribute claims ("Are you a failed developer?"). Write about the work, not the person.
- No fake urgency or countdown timers that reset.
- No unsubstantiated "best #1" claims.
- Disclose the price on the landing page, not just in the ad.
- Use the brand's real name and real proof; do not invent client logos or testimonials.
