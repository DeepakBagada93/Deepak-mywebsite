# Test results — 2026-10-18

Environment: macOS, Node.js 25.9.0.

## Summary

| Suite | Command | Result |
| --- | --- | --- |
| Functional | `node tests/workflow-hardener.test.mjs` | **6/6 passed**, exit 0 |
| Structural | `node tests/skill-structure.test.mjs` | **9/9 passed**, exit 0 |
| Factory validator | `node .agent/scripts/validate-product.mjs products/n8n-hardening-pack` | **0 failures** |
| Commercial readiness | `validate-skill-readiness.mjs products/n8n-hardening-pack` | **0 failures** |
| Archive audit | `package-skill-product.mjs products/n8n-hardening-pack` | **0 failures** |

## Measurements

| Fixture | Findings | Score | Hardener |
| --- | --- | --- | --- |
| `lead-intake.workflow.json` | 12 (1 critical, 3 high, 6 medium, 2 low) | 21/100 | Refuses (exit 1, nothing written) |
| `orders-sync.workflow.json` | 3 (all medium) | 85/100 | 3 safe patches → 100/100 |
| `lead-intake-clean.workflow.json` | 0 | 100/100 | No patches needed |

## Reproduce

```bash
node tests/workflow-hardener.test.mjs
node skills/workflow-hardener/scripts/audit-workflow.mjs examples/lead-intake.workflow.json --md /tmp/a.md
node skills/workflow-hardener/scripts/harden-workflow.mjs examples/orders-sync.workflow.json --out /tmp/o.json
node skills/workflow-hardener/scripts/verify-workflow.mjs /tmp/o.json --strict
```

## Known gaps

| Gap | Status | Why |
| --- | --- | --- |
| Import into a live n8n instance | Not executed | No instance available; hardened file preserves schema and node set only |
| Workflow execution behavior | Not executed | Static analysis by design |
| n8n 1.x version variance | Not executed | Rules target common parameter shapes |
| Node 18/20/22, Windows | Not executed | Only Node 25.9.0 on macOS was available |
| Generated validator reports | Not shipped | They embed the build machine's absolute path; results are recorded here |
