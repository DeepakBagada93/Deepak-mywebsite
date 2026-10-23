# Test Results — Ad Creative Lab v1.0.0

Run date: 2026-10-20 · Environment: macOS, Node.js 20+

## Functional tests

| Case | Expected | Actual | Status |
| --- | --- | --- | --- |
| Clean pack score | 100, 0 findings | 100, 0 findings | pass |
| Clean pack strict exit | 0 | 0 | pass |
| Broken pack score | below 50 | 8 | pass |
| Broken pack critical claim | CLAIM_GUARANTEE present | present | pass |
| Broken pack UGC findings | missing hook + CTA | both present | pass |
| CPC amount not flagged as price | no mismatch | no mismatch | pass |
| Real price mismatch flagged | mismatch | mismatch | pass |
| Hook score, specific line | ≥ 4 | 5 | pass |
| Hook score, generic line | 0 | 0 | pass |
| Matrix budget sum | equals input | ₹30,000 | pass |
| Break-even CPA | ₹1,349.10 | ₹1,349.10 | pass |
| Projected clicks | 1,667 | 1,667 | pass |
| Small-budget warnings | click + duration | both present | pass |

## Structural checks

`tests/skill-structure.test.mjs` covers frontmatter, required sections, absence of placeholders, dependency-free scripts, presence of docs, tutorial coverage, listing pricing and guarantee, license terms, example parsing and path hygiene.

## Commands run

```bash
node --test tests/
node skills/ad-creative-lab/scripts/audit-creative-pack.mjs examples/creative-pack.clean.json --strict
node skills/ad-creative-lab/scripts/audit-creative-pack.mjs examples/creative-pack.fixture.json
node skills/ad-creative-lab/scripts/plan-test-matrix.mjs examples/test-matrix.brief.json --budget=30000 --days=21
```

## Not verified

- Submission to Meta Ads Manager or Google Ads.
- Live CPA, CTR or ROAS performance.
- Installation inside Claude Code, Cursor, Codex and Antigravity UIs (instructions are portable; execution was verified via Node CLI only).
- Legal sufficiency of India claim screening for regulated categories.
