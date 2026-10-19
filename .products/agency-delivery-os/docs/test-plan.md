# Test plan — AI Agency Delivery OS 1.0.0

Environment: macOS, Node.js 25.9.0, no dependencies, no network.

| Suite | File | Covers |
| --- | --- | --- |
| Functional | `tests/engagement-os.test.mjs` | Init, rejection, audit, placeholder guard, full chain, missing artifact, metric gate, overwrite protection |
| Structural | `tests/skill-structure.test.mjs` | Frontmatter, sections, placeholders, scripts, docs, example workspace, absolute paths |

| ID | Case | Expected | Criterion |
| --- | --- | --- | --- |
| T1 | Init complete intake | 10 files, phase `scoped`, history length 2 | A1 |
| T2 | Audit fresh workspace | 0 findings, 100/100, strict verify exit 0 | A1 |
| T3 | Init incomplete intake | Exit 1, five gaps named, no directory | A2 |
| T4 | `TBD` in scope | Advance exit 1, state unchanged | A3 |
| T5 | Full chain | Four transitions, history six phases, final advance refuses | A4 |
| T6 | Missing `qa-gates.md` | Advance exit 1, "missing artifact" | A5 |
| T7 | QA without metric | Verify exit 1, metric finding | A6 |
| T8 | Non-empty target | Refused without `--force`, accepted with it | A7 |
| T9 | Structural checks | All pass | A8 |
| T10 | Package + archive | 0 failures | A9 |

Out of scope: CRM/e-signature integration, multi-user concurrency, legal review, Node 18/20/22, Windows.
