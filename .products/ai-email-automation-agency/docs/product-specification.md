# Product Specification — AI Email Automation for Agencies

## 1. Summary

| Field | Value |
| --- | --- |
| Name | AI Email Automation for Agencies |
| Slug | ai-email-automation-agency |
| Version | 1.0.0 |
| Category | ai-workflow-automation |
| Buyer | Agency founders, growth leads, ops leads |
| Platforms | n8n, Make.com, Gmail, Slack, Postgres |
| License | Commercial, client deployments permitted, resale prohibited |

## 2. Problem

Agency outbound has a quality-versus-volume conflict. Manual personalization does not scale, and autonomous AI sending risks hallucinated claims and domain damage. The product resolves the conflict by keeping AI in the drafting seat and the human in the send seat.

## 3. System behavior

1. Accept a lead over a webhook.
2. Validate and normalize the lead.
3. Generate subject, preview, body, and two follow-ups.
4. Enforce hard guardrails in code.
5. Create a Gmail draft and store a pending record.
6. Send a Slack approval link with a scoped token.
7. On approval, send and schedule follow-ups at day 4 and day 9.
8. On rejection, keep the draft and mark the record rejected.
9. On any failure, alert Slack and write a dead-letter row.

## 4. Deliverables

| Asset | Count | Notes |
| --- | --- | --- |
| n8n workflows | 3 | Draft, approval/sequence, error handler |
| Make blueprint | 1 | Draft/review equivalent |
| Postgres schema | 1 | Drafts and dead letters |
| Docker stack | 1 | Postgres + Redis + n8n |
| Environment template | 1 | Placeholders only |
| PDF manual | 1 | Generated from the tutorial |
| Tests | 3 | Sample payload, curl script, structural suite |
| Docs | 8 | Spec, architecture, research, tutorial, listing, plan, results, release |

## 5. Guardrails

| Rule | Enforcement |
| --- | --- |
| Valid email | Normalize code node |
| Subject 1–60 chars | Guardrail code node |
| No exclamation mark | Guardrail code node |
| Body 1–130 words | Guardrail code node |
| No links in cold body | Guardrail code node |
| No calendar links | Guardrail code node |
| No spam phrases | Guardrail code node |
| Both follow-ups present | Guardrail code node |
| Human approval | Approval token + status check |
| Token expiry | 7-day SQL window |

## 6. Non-goals

- Not a bulk sender or warmup platform.
- Not a CRM.
- Not a reply inbox or classifier.
- Not a guarantee of deliverability, replies, or revenue.
- Not an autonomous sender.

## 7. Acceptance criteria

1. All four workflow JSON files parse.
2. All connection targets resolve.
3. The guardrail blocks links, calendar links, spam, and length violations.
4. A draft cannot be sent without a valid token and `pending_review` status.
5. Failures produce a Slack alert and a dead-letter row.
6. The product validator reports zero errors.
7. The structural tests exit 0.
8. The distribution ZIP includes the root license, manifest, and compatibility files.

## 8. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| LLM hallucination | Guardrail + human approval |
| Duplicate sends | Status check requires `pending_review` |
| Token leakage | Short TTL, record + token required |
| Credential exposure | n8n credential store, no secrets in JSON |
| Provider outage | Error workflow + dead-letter table |
| Deliverability damage | Link-free cold copy, manual cap, domain warmup guidance |
