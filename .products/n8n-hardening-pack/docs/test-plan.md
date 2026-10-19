# Test plan — n8n Production Hardening Pack 1.0.0

## Environment

macOS, Node.js 25.9.0, no dependencies, no network, no n8n instance.

## Suites

| Suite | File | Covers |
| --- | --- | --- |
| Structural | `tests/skill-structure.test.mjs` | Frontmatter, sections, no placeholders, scripts, docs, fixtures, no absolute paths |
| Functional | `tests/workflow-hardener.test.mjs` | Detection, determinism, refusal path, patch application, gating, batch mode |

## Case matrix

| ID | Case | Expected | Criterion |
| --- | --- | --- | --- |
| T1 | Audit unsafe fixture | 12 findings; inline secrets, error workflow, pinned data, webhook auth, idempotency, orphans all present; score < 30 | A1 |
| T2 | Audit twice | Identical ids and score | A2 |
| T3 | Harden unsafe fixture | Exit 1; no output file created; stderr says refusing | A3 |
| T4 | Harden half-hardened fixture | Exit 0; retryOnFail/maxTries/3, timeout 30000, executionOrder v1; score 85 → 100 | A4 |
| T5 | Verify unsafe / clean / hardened | Exit 1 / 0 / 0 (strict) | A5 |
| T6 | Directory mode | Three reports from three files | A6 |
| T7 | Structural checks | All pass | A7 |
| T8 | Package and archive audit | 0 failures, no forbidden entries | A8 |

## Out of scope

- Importing the hardened JSON into n8n or executing it.
- Make.com / Zapier schemas.
- Community-node behavior.
- Node.js 18/20/22 and Windows.
