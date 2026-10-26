# AI Email Automation for Agencies — Implementation Guide

## 1. What you are installing

A three-workflow n8n system:

1. **Draft & Review** — receives a lead, generates a personalized email with AI, runs hard guardrails, creates a Gmail draft, and posts an approval link to Slack.
2. **Approval & Sequence** — validates the approval token, sends the email, then schedules two follow-ups at day 4 and day 9.
3. **Error Handler** — posts failures to Slack and writes a dead-letter row to Postgres.

A Make.com blueprint covers the same draft-and-review stage if you prefer Make.

## 2. Prerequisites

- n8n 1.60 or newer, cloud or self-hosted.
- Postgres 14 or newer.
- OpenAI API key (or an Anthropic key if you swap the model node).
- Gmail or Google Workspace with OAuth2 enabled.
- Slack workspace with a bot token that can post to two channels.
- A verified sending domain with SPF, DKIM, and DMARC.
- A lawful basis for contacting every lead, and an opt-out process.
- Docker Desktop if you use the included self-hosted stack.

## 3. Install the stack (self-hosted)

```bash
cp .env.example .env
# Edit .env and replace every REPLACE_WITH_ value.
docker compose up -d

# Create the tables
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < schema.sql

# Open n8n
open http://localhost:5678
```

If you use n8n Cloud, skip Docker and run `schema.sql` against your managed Postgres.

## 4. Import the workflows

1. In n8n, go to **Workflows → Import from File**.
2. Import `workflows/n8n-agency-email-engine.json`.
3. Import `workflows/n8n-approval-and-sequence.json`.
4. Import `workflows/n8n-error-handler.json`.
5. Open each workflow and bind credentials:
   - **OpenAI API** on `OpenAI Chat Model`.
   - **Gmail OAuth2** on `Create Gmail Draft`, `Send Approved Email`, `Send Follow-up 1`, `Send Follow-up 2`.
   - **Slack API** on the three Slack nodes.
   - **Postgres** on `Save Draft Record`, `Load Draft`, `Mark Sent`, `Mark Sequence Complete`, `Mark Rejected`, `Write Dead Letter`.
6. In the Draft & Review workflow, set **Settings → Error Workflow** to the error handler.
7. Activate all three workflows.
8. Set `N8N_PUBLIC_URL` in `.env` to your public n8n URL so approval links work.

## 5. Configure the environment

| Variable | Purpose | Example |
| --- | --- | --- |
| `OPENAI_API_KEY` | LLM access | `sk-...` |
| `OPENAI_MODEL` | Model name | `gpt-4o-mini` |
| `N8N_PUBLIC_URL` | Public base URL for approval links | `https://n8n.your-agency.com` |
| `SLACK_REVIEW_CHANNEL_ID` | Approval channel | `C01234567` |
| `SLACK_ALERT_CHANNEL_ID` | Incident channel | `C07654321` |
| `POSTGRES_*` | Database connection | from `.env` |
| `DAILY_EMAIL_CAP` | Manual operating cap | `45` |

## 6. Test with a sample lead

With n8n running locally:

```bash
bash tests/test-email-curl.sh
```

Expected response:

```json
{
  "status": "pending_review",
  "record_id": 1,
  "subject": "the weekly report rebuild"
}
```

What should happen:

1. A Gmail draft appears in the connected mailbox.
2. A Slack message arrives with Approve and Reject links.
3. A row appears in `agency_email_drafts` with status `pending_review`.

Approve it:

```bash
curl "http://localhost:5678/webhook/agency-email-approval?record=1&token=<token>&decision=approve"
```

Expected: the email sends, status becomes `sent`, Slack confirms, and two wait nodes are scheduled.

## 7. Guardrail behavior

The system blocks a draft when any of these is true:

- Subject is empty or longer than 60 characters.
- Subject contains an exclamation mark.
- Body is longer than 130 words.
- Body contains `http://` or `https://`.
- Body contains a Calendly, Cal.com, or HubSpot meetings link.
- A spam phrase is detected.
- Either follow-up is missing.
- The AI response is not valid JSON.

A blocked draft returns HTTP 422, sends a Slack alert, and creates no Gmail draft.

## 8. Operating the approval flow

1. Review the subject, preview text, and body in Slack or in Gmail drafts.
2. Click Approve if it sounds like the founder wrote it.
3. Click Reject if it needs a rewrite; the draft stays in Gmail for manual editing.
4. Never forward the approval link. It contains the record token.
5. Tokens expire after 7 days. Expired rows must be regenerated, not reused.

## 9. Follow-up timing

| Touch | Delay after send | Content |
| --- | --- | --- |
| First email | 0 | Trigger, friction, proof, soft CTA |
| Follow-up 1 | 4 days | One proof point, permission-based asset offer |
| Follow-up 2 | 9 days | Polite close, no guilt |

The sequence stops after follow-up 2. It does not auto-enroll new leads. The buyer decides the daily cap and the list source.

## 10. Troubleshooting

| Error | Likely cause | Fix |
| --- | --- | --- |
| 401 from OpenAI | Invalid or missing key | Rebind the OpenAI credential |
| 401 from Gmail | OAuth expired or wrong scopes | Reconnect Gmail with send and draft scopes |
| 403 from Slack | Bot not in the channel | Invite the bot, recheck the channel ID |
| `Draft not found` | Wrong token, expired token, or wrong record | Regenerate a draft; do not reuse old links |
| `Draft is not pending review` | Already sent or rejected | Check the row status; create a new draft |
| `AI output was not valid JSON` | Model returned prose | Lower temperature, keep `hasOutputParser`, retry |
| `relation "agency_email_drafts" does not exist` | Schema not applied | Run `schema.sql` against the correct database |
| Approval link goes to localhost | `N8N_PUBLIC_URL` missing | Set the public URL and restart n8n |
| Follow-up sent twice | Workflow activated twice | Deactivate duplicate workflows; check executions |
| Postgres connection refused | Stack not healthy | `docker compose ps`, then check logs |
| Emails land in spam | Domain not warmed or link-heavy copy | Warm the domain; keep cold Step 1 link-free |

## 11. Security checklist

- [ ] Credentials bound in n8n, never pasted into JSON.
- [ ] Approval token TTL set to 7 days or less.
- [ ] Postgres not exposed publicly.
- [ ] n8n behind HTTPS and rate limiting.
- [ ] Dedicated sending mailbox, not a personal inbox.
- [ ] Opt-out processing within 24 hours.
- [ ] Dead-letter table monitored daily.
- [ ] Execution data pruning enabled.

## 12. FAQ

**Can I use Anthropic instead of OpenAI?** Yes. Replace the `OpenAI Chat Model` node with the Anthropic chat model node and keep the same prompt contract.

**Can I send through Brevo or Mailgun instead of Gmail?** Yes. Replace the Gmail nodes with the provider's HTTP request or native node. Keep the guardrail and approval steps unchanged.

**Does it send without approval?** No. The design requires a valid approval token and a human decision.

**Does it handle replies?** The package ships the send and follow-up sequence. Reply classification is intentionally left out so a human reads every response. You can add an IMAP trigger and an AI classifier later.

**Can I use this for client work?** Yes. The license permits client deployments. It forbids reselling the raw workflow package.

**What happens if Slack is down?** The email can still send after approval, but the notification may fail. The error workflow writes a dead letter; monitor it.

**Can I change the follow-up delays?** Yes. Edit the two Wait nodes. Keep the total sequence under three weeks.

**Is this compliant with GDPR?** The software provides the mechanism, not the legal basis. You must document consent or legitimate interest and honor deletion requests.
