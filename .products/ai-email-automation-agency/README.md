# AI Email Automation for Agencies

**Commercial AI workflow product v1.0.0 | Deepak Bagada Systems**

Turn a new lead into a personalized, compliance-checked email draft, route it to a human for approval, then send it and schedule two follow-ups automatically. Built for agencies, consultancies, and service businesses that want outbound speed without losing the founder's judgment.

## What it does

1. Receives a lead from any form, webhook, or CRM.
2. Normalizes and segments the lead.
3. Generates a subject, preview text, body, and two follow-ups with an LLM.
4. Runs a hard guardrail: no links, no calendar links, no spam phrases, subject and word limits.
5. Creates a Gmail draft and stores the record in Postgres.
6. Posts an approval link to Slack.
7. On approval, sends the email and schedules follow-ups at day 4 and day 9.
8. Routes every failure to a dead-letter table and a Slack alert.

## Quick start

```bash
# 1. Start Postgres, Redis, and n8n
cp .env.example .env
docker compose up -d

# 2. Create the tables
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < schema.sql

# 3. Open n8n
open http://localhost:5678

# 4. Import the three workflow JSON files from workflows/
#    Bind OpenAI, Gmail, Slack, and Postgres credentials.
#    Set N8N_PUBLIC_URL in .env so approval links resolve.

# 5. Send a sample lead (offline-safe; point at your instance)
bash tests/test-email-curl.sh
```

## Package contents

| Folder | Contents |
| --- | --- |
| `workflows/` | Main n8n workflow, approval/sequence workflow, error handler, Make blueprint |
| `docs/` | Architecture, research, tutorial, store listing, test plan/results, release report |
| `pdf/` | Compiled implementation manual |
| `tests/` | Sample lead, curl verification, structural test suite |
| `schema.sql` | Postgres tables for drafts and dead letters |
| `.env.example` | Every required key with placeholders |
| `docker-compose.yml` | Postgres + Redis + n8n stack |
| `dist/` | Clean customer distribution ZIP |

## Safety model

- No email is sent without an approval token and a human decision.
- Approval tokens expire after 7 days.
- Cold email bodies cannot contain links or calendar links.
- A guardrail failure returns HTTP 422 and sends no draft.
- Every failure is written to `agency_email_dead_letters` and posted to Slack.
- No API keys, tokens, or credentials are embedded in the workflow JSON.

## Related product

Need the email templates this system drafts into? Pair it with `../agency-email-template-pack` for eight responsive agency templates and copy sheets.

## Requirements

- n8n 1.60+ (cloud or self-hosted).
- Postgres 14+.
- OpenAI API key (or swap the model node for Anthropic).
- Gmail or Google Workspace with OAuth2.
- Slack app with chat:write.
- A verified sending domain with SPF, DKIM, and DMARC.

See `docs/tutorial-guide.md` for the full setup and `docs/system-architecture.md` for the data contracts.
