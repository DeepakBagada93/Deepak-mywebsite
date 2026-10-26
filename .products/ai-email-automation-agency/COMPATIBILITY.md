# Compatibility

## Runtime

| Component | Supported | Notes |
| --- | --- | --- |
| n8n | 1.60+ | Cloud or self-hosted |
| n8n queue mode | Yes | Redis included in the compose stack |
| Postgres | 14+ | `schema.sql` uses standard types and indexes |
| Node.js (tests) | 18+ | Zero-dependency test suite |
| Docker | 24+ | Compose v2 recommended |
| Make.com | Core plan+ | Blueprint covers draft and review |

## Integrations

| Integration | Node used | Required scope |
| --- | --- | --- |
| OpenAI | `lmChatOpenAi` | Chat completions |
| Anthropic | Optional swap | Messages API |
| Gmail | `n8n-nodes-base.gmail` | `gmail.compose`, `gmail.send` |
| Google Workspace | Same as Gmail | Admin may need to allow OAuth app |
| Slack | `n8n-nodes-base.slack` | `chat:write`, channel membership |
| Postgres | `n8n-nodes-base.postgres` | Read/write on the two tables |
| SMTP / Brevo / Mailgun | Optional swap | Replace Gmail nodes |

## Sending domain requirements

- SPF record with a single policy.
- DKIM 2048-bit selector.
- DMARC at `p=none` for the first 14 days, then quarantine.
- Verified custom tracking domain if the ESP requires it.
- Warmup completed before any cold volume.

## Not supported

- Autonomous sending without human approval.
- Bulk list uploads or purchased lists.
- Reply classification out of the box.
- Outlook/Exchange sending without replacing the Gmail nodes.
- Multi-tenant SaaS resale of the raw workflow package.

## Model portability

The prompt returns a fixed JSON contract. Any chat model that can follow JSON instructions can replace OpenAI. The guardrail code does not depend on the model provider.
