# Test Plan — AI Email Automation for Agencies

## Scope

Validate workflow integrity, connection integrity, guardrail coverage, schema completeness, secret hygiene, documentation completeness, PDF generation, and clean packaging.

## Environment

| Item | Value |
| --- | --- |
| OS | macOS (darwin) |
| Node.js | 25.9.0 |
| n8n | Import-structure validation only (no live instance required) |
| Browser | Google Chrome (PDF generation) |
| Dependencies | None for tests; n8n runtime only for live execution |

## Test cases

| ID | Test | Method | Expected |
| --- | --- | --- | --- |
| T01 | Valid JSON | Parse all workflow files | No syntax errors |
| T02 | Draft pipeline nodes | Structural test | Webhook, LLM, code, IF, Gmail, Postgres, Slack, respond |
| T03 | Approval and follow-ups | Structural test | Approval webhook, IF, Gmail, 2 waits, status updates |
| T04 | Error handling | Structural test | Error Trigger, Slack, Postgres dead letter |
| T05 | Connection integrity | Structural test | Every target resolves to a real node |
| T06 | Secret hygiene | Regex scan | No `sk-`, `xox`, `ghp`, or developer paths |
| T07 | Guardrail logic | Code inspection | Links, calendar links, spam, length checks present |
| T08 | Schema completeness | File inspection | Both tables and indexes present |
| T09 | Self-hosted stack | Compose review | Postgres, Redis, n8n, health checks |
| T10 | Documentation | Validator | Tutorial >1,500 chars, prerequisites and troubleshooting |
| T11 | PDF manual | Validator | PDF exists or is generated |
| T12 | Distribution ZIP | Validator | Clean archive, no OS metadata |
| T13 | Sample lead | JSON parse | Valid corporate email and pain point |

## Out of scope

- Live OpenAI, Gmail, Slack, and Postgres calls.
- Deliverability or inbox placement.
- Load testing at production volume.
- Legal review for a specific jurisdiction.
- Reply classification, which is intentionally excluded.

## Pass criteria

All structural tests exit 0. The product validator reports zero errors. Warnings must be documented and non-blocking. No live send, charge, or public action is performed during testing.
