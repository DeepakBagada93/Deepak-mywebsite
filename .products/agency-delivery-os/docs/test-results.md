# Test results — 2026-10-18

Environment: macOS, Node.js 25.9.0.

| Suite | Command | Result |
| --- | --- | --- |
| Functional | `node tests/engagement-os.test.mjs` | **8/8 passed**, exit 0 |
| Structural | `node tests/skill-structure.test.mjs` | **9/9 passed**, exit 0 |
| Factory validator | `validate-product.mjs products/agency-delivery-os` | **0 failures** |
| Commercial readiness | `validate-skill-readiness.mjs products/agency-delivery-os` | **0 failures** |
| Archive audit | `package-skill-product.mjs products/agency-delivery-os` | **0 failures** |

## Measurements

| Scenario | Result |
| --- | --- |
| Complete intake | 10 artifacts, phase `scoped`, audit 100/100 |
| Incomplete intake | Exit 1 with 5 named gaps; no workspace created |
| `TBD` in scope | Advance blocked; state remains `scoped` |
| Full chain | `scoped → risk-reviewed → delivery → qa → handoff`, history length 6 |
| Missing artifact | Advance blocked with "missing artifact" |
| QA without metric | Verify exit 1 |
| Non-empty target | Refused without `--force`; accepted with it |

## Reproduce

```bash
node tests/engagement-os.test.mjs
node skills/engagement-os/scripts/init-engagement.mjs examples/intake.json --out /tmp/quote
node skills/engagement-os/scripts/audit-engagement.mjs /tmp/quote
node skills/engagement-os/scripts/verify-engagement.mjs /tmp/quote --strict
```

## Known gaps

| Gap | Status | Why |
| --- | --- | --- |
| Real client engagement | Not executed | No client available; behavior is tested on synthetic intake |
| CRM / e-signature / invoicing | Not implemented | Out of scope |
| Multi-user concurrency | Not implemented | No locking; one operator per workspace |
| Node 18/20/22, Windows | Not executed | Only Node 25.9.0 on macOS available |
| Generated validator reports | Not shipped | Absolute build paths; results recorded here |
