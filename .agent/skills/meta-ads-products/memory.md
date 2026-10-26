# meta-ads-products — Memory

## Purpose

Manual-first Meta ads pack for digital products: budget → ad-set structure, audience targeting, 3 single-image prompts, 5 carousel prompts, 3 UGC video prompts with dialogue, copy and an audit gate. No API, no spend.

## Operating defaults

- **Product example:** n8n Production Hardening Pack, ₹2,499, 85% margin.
- **Break-even CPA:** ₹2,124. **Target CPA:** ₹1,487.
- **Currency:** INR only.
- **Budget guardrail:** `META_MAX_BUDGET` default ₹50,000.
- **Cold ad-set floor:** ₹300/day.
- **Structure tiers:** <₹3k/₹3k–7k = 1 ad set; ₹7k–15k = 2; ₹15k–40k = 3; ₹40k+ = 2 campaigns / 4 ad sets.
- **Projection defaults:** CPM ₹250, CTR 1.3%, purchase CVR 1.2%. Directional only.
- **Copy limits:** primary 125 (feed), headline 40, description 30, carousel description 20.
- **Creative rule:** 3–4 per ad set; text added in Canva/CapCut, never rendered by the image/video model.

## Run ledger

| Date | Product | Budget | Structure | Output | Audit |
| --- | --- | --- | --- | --- | --- |
| 2026-10-19 | n8n Production Hardening Pack | ₹10,000 / 14 days (₹714/day) | 1 campaign · 2 ad sets (Broad ₹5,500 / Interest ₹4,500) | `runs/n8n-10000-india-meta-pack.md` | PASS |
| 2026-10-19 | n8n Production Hardening Pack | ₹3,000 / 7 days (₹429/day) | 1 campaign · 1 broad ad set | `runs/n8n-3000-india-meta-pack.md` | PASS |

## What was built

- `scripts/plan-core.mjs` — tier selection, stepwise ad-set consolidation, audience definitions, projections, warnings.
- `scripts/prompts.mjs` — 3 single-image prompts, 5 carousel prompts, 3 UGC prompts, shared character block, Veo notes.
- `scripts/build-meta-pack.mjs` — one-command markdown + JSON pack.
- `scripts/audit-meta-pack.mjs` — budget, structure, copy limits, fluff, prompt completeness, markdown sections.
- `references/meta-playbook.md` — budget ladder, audiences, creative rules, benchmarks, stop/scale.
- `references/meta-setup.md` — Business Manager, pixel/CAPI, AEM, manual build, common failures.

## Notes

- 2026-10-19 — The ₹10,000 plan projects ~6.4 sales and ROAS 1.59× on default assumptions. It is learning-constrained: 2 ad sets × ~1.5 purchases/week vs Meta's ~50/week learning threshold. Judge hook rate, CTR and cost per add-to-cart first.
- 2026-10-19 — The engine reduces ad-set count when a split would leave a cold ad set under ₹300/day (e.g. ₹9,000/14d → 1 ad set; ₹15,000/21d → 2 ad sets).
- 2026-10-19 — UGC prompts use one creator ("Riya") across all three ads to avoid a synthetic-looking account. Replace the character block for a real creator and keep it verbatim across prompts.
