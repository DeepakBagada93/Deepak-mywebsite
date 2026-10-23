# Test Plan — Content Repurpose Engine

## Scope

| Area | Tested | Method |
| --- | --- | --- |
| Planner determinism | Yes | Functional test |
| Platform cadence | Yes | Functional test |
| Insight coverage | Yes | Functional test |
| Duplicate cell prevention | Yes | Functional test |
| Audit rules | Yes | Clean and flawed fixtures |
| Cross-post similarity | Yes | Unit test |
| CLI exit codes | Yes | Strict and default runs |
| Auto-publishing | No | Out of scope |
| Reach or engagement | No | Cannot be guaranteed |

## Cases

1. **Thirty-day plan** — 30 items, correct start and end dates, zero warnings.
2. **Coverage** — every insight used at least once.
3. **Cell uniqueness** — no repeated platform + insight + angle.
4. **Cadence** — Instagram 8, LinkedIn 6, X 6, Shorts 4, newsletter 3, blog 3.
5. **Seven-day override** — 7 dated pieces ending on day 7.
6. **Clean pack** — 100/100, no findings.
7. **Flawed pack** — body over X limit, missing CTA, cross-post duplicate, AI phrase; score 0.
8. **Similarity** — identical text 1.0; unrelated text below 0.2.
9. **Structure** — docs, pricing, license, no placeholders, no path leaks.

## Exit criteria

- `node --test tests/*.test.mjs` exits 0.
- Clean pack strict run exits 0 with 100/100.
- Planner output has exactly the requested number of pieces.

## Out of scope

Publishing, scheduling integrations, image or video generation, live trend data and reach forecasting.
