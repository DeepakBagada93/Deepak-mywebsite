# Test Plan — Ad Creative Lab

## Scope

| Area | Tested | Method |
| --- | --- | --- |
| Skill structure | Yes | `tests/skill-structure.test.mjs` |
| Audit engine | Yes | `tests/ad-creative-lab.test.mjs` |
| Test-matrix maths | Yes | `tests/ad-creative-lab.test.mjs` |
| CLI exit codes | Yes | Strict and default runs |
| Ad platform submission | No | Requires live accounts |
| Approval or ROAS outcome | No | Cannot be guaranteed |

## Cases

1. **Clean pack** — no findings, score 100, verdict READY TO LAUNCH, strict exit 0.
2. **Broken pack** — critical guarantee finding, fake urgency, all caps, missing UGC hook/CTA, score below 50.
3. **Price consistency** — a ₹999 quote against a ₹1,499 catalog is flagged; a ₹18 CPC mention is not.
4. **Hook scoring** — a specific pain + number hook scores at least 4; a generic line scores 0.
5. **Budget allocation** — cells sum exactly to the supplied budget; break-even CPA is price × margin.
6. **Small budget** — warnings for fewer than 30 clicks per cell and fewer than 14 days.
7. **Packaging hygiene** — no absolute developer paths, no placeholders, no external imports.

## Exit criteria

- `node --test tests/` exits 0.
- `node scripts/audit-creative-pack.mjs examples/creative-pack.clean.json --strict` exits 0 with score 100.
- `node scripts/plan-test-matrix.mjs examples/test-matrix.brief.json --budget=30000` exits 0 and allocates exactly ₹30,000.
- `node .agent/scripts/validate-product.mjs products/ad-creative-lab` exits 0.

## Out of scope

Live Meta or Google submission, account-level bans, landing-page speed, tracking accuracy, and legal review of regulated claims.
