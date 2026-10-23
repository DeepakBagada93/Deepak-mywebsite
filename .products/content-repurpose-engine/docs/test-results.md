# Test Results — Content Repurpose Engine v1.0.0

Run date: 2026-10-20 · Environment: macOS, Node.js 20+

## Functional results

| Case | Expected | Actual | Status |
| --- | --- | --- | --- |
| Plan length | 30 | 30 | pass |
| First and last date | 2026-10-21 / 2026-11-19 | same | pass |
| Warnings | none | none | pass |
| Coverage | every insight > 0 | 5 uses each | pass |
| Duplicate cells | 0 | 0 | pass |
| Platform counts | 8/6/6/4/3/3 | 8/6/6/4/3/3 | pass |
| Seven-day override | 7 pieces | 7 | pass |
| Clean pack score | 100 | 100 | pass |
| Clean pack strict exit | 0 | 0 | pass |
| Flawed pack score | 0 | 0 | pass |
| Flawed pack findings | length, CTA, duplicate, AI phrase | all four | pass |
| Similarity identical | 1.0 | 1.0 | pass |
| Similarity unrelated | below 0.2 | below 0.2 | pass |

## Structural checks

Frontmatter, required sections, placeholder absence, dependency-free scripts, required docs, tutorial coverage, listing pricing and guarantee, license terms, example parsing and path hygiene.

## Commands run

```bash
node --test tests/*.test.mjs
node skills/content-repurpose-engine/scripts/build-content-plan.mjs examples/source.asset.json --days=30
node skills/content-repurpose-engine/scripts/audit-content-pack.mjs examples/content-pack.clean.json --strict
node skills/content-repurpose-engine/scripts/audit-content-pack.mjs examples/content-pack.fixture.json
```

## Not verified

- Publishing to Instagram, LinkedIn, X, YouTube, an ESP or a blog CMS.
- Reach, saves, clicks or follower growth.
- Installation inside each IDE UI (Node CLI verified only).
- Translation quality for Hindi and Hinglish beyond labelling and script detection.
