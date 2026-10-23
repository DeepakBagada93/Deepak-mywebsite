# Product Specification — Ad Creative Lab

Version 1.0.0 · 2026-10-20

## 1. Promise

From "my ads are not converting and I do not know why" to a scored, compliant creative pack and a budgeted test plan — in one working session, without an agency retainer.

## 2. Transformation

| Before | After |
| --- | --- |
| Copy judged by vibes | 0–100 score with severity-ranked fixes |
| Random hooks | 6 angles × 5 hooks, scored for signal |
| Static-only or boosted posts | 3 UGC scripts with shot lists and pacing |
| Unclear spend | Break-even CPA, per-cell budget, kill/scale rules |
| Policy rejection risk | Claim-class scan before submission |

## 3. Target buyer

Primary: Indian D2C founder or solo marketer spending ₹50,000–₹5,00,000 per month on Meta and Google.
Secondary: freelance media buyer or 2–10 person agency that needs a repeatable audit to sell.
Not for: enterprises with a procurement-heavy ad-ops team, or buyers who want the tool to create campaigns in the ad account.

## 4. Deliverables

| # | Artifact | Acceptance criterion |
| --- | --- | --- |
| 1 | `SKILL.md` | 7 ordered stages, input contract, scoring rubric, negative constraints, failure table |
| 2 | Audit engine | Deterministic; 20+ checks; JSON + Markdown; strict exit code |
| 3 | Test-matrix planner | Budget sums exactly; break-even CPA; warnings below a readable cell |
| 4 | Creative system | 6 angles, 30 hooks, 6 statics, 3 UGC scripts, optional RSA set |
| 5 | Examples | One clean pack at 100, one broken pack below 50, one 12-cell plan |
| 6 | Tests | Structural + functional, zero dependencies |
| 7 | Tutorial | 3-minute quickstart, 4 client installs, 3 prompt recipes, FAQ |
| 8 | Store listing | Hook, proof, inclusions, India pricing, guarantee, FAQ |

## 5. Pricing

| Tier | Price | Seats | Included |
| --- | --- | --- | --- |
| Solo | ₹1,499 | 1 | Skill, scripts, examples, tutorial, 1 year of updates |
| Pro | ₹3,499 | 5 | Everything + priority email support |
| Agency | ₹6,999 | Unlimited | Everything + client-delivery license |

Launch offer: Solo at ₹999 for the first 100 buyers, then ₹1,499.
Bundle: with Content Repurpose Engine and India Offer & Pricing Kit at ₹3,999.

Rationale: below the ₹2,499 floor of the engineering toolkits because the buyer is a marketer, not a developer; above ₹999 prompt packs because the audit engine and tests are real software.

## 6. Success metrics

- Buyer runs the audit on their own pack within 10 minutes of install.
- At least one critical or high finding is fixed before the next launch.
- Buyer can state their break-even CPA without opening a spreadsheet.
- Refund rate below 5%.

## 7. Non-goals

- Creating or editing campaigns through ad APIs.
- Guaranteeing approval, ROAS or sales.
- Replacing legal review for regulated categories.
- Generating images or videos; it writes the scripts and concepts.
