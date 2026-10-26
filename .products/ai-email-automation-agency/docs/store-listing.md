# AI Email Automation for Agencies

**Your agency's outbound, without the generic AI voice or the accidental send.**

Turn a lead into a personalized email draft in seconds. Code checks it. You approve it in Slack. The system sends it and handles the follow-ups.

## The cost of doing it manually

- 34 minutes of research, writing, QA, and tracking per lead.
- 28+ hours per week at 50 leads.
- A junior sending generic emails that damage the domain.
- An AI tool that sends a hallucinated claim before anyone reads it.
- Follow-ups that depend on someone remembering a spreadsheet row.

## The turnkey solution

A three-workflow n8n system that separates drafting from sending:

1. **Draft** — AI writes the subject, preview, body, and two follow-ups.
2. **Check** — code blocks links, calendar links, spam phrases, and length violations.
3. **Approve** — a Slack link requires a human decision and a valid token.
4. **Send** — Gmail sends only after approval.
5. **Follow up** — two follow-ups are scheduled at day 4 and day 9.
6. **Recover** — every failure goes to Slack and a Postgres dead-letter table.

## What's Included

- 3 production n8n workflows: draft/review, approval/sequence, error handler.
- 1 Make.com blueprint for the draft/review stage.
- Postgres schema for drafts and dead letters.
- Self-hosted Postgres + Redis + n8n stack (`docker-compose.yml`).
- `.env.example` with every required key.
- PDF implementation manual.
- Sample lead and curl test script.
- Structural test suite and QA report.
- Architecture, research, tutorial, and release documentation.

## Who It Is For

- Agency founders and new-business leads doing founder-led outbound.
- 2–50 person agencies with Gmail/Workspace, Slack, and Postgres.
- Ops leads who want a human approval step, not an autonomous blaster.
- Agencies that need an auditable draft → approve → send trail.

## Who It Is Not For

- Teams looking for a bulk cold-email platform with built-in warmup.
- Teams without a lawful basis for outbound.
- Teams that refuse human review.
- Teams that need reply classification out of the box.

## The 15-Minute Implementation Guarantee

Import three JSON files, bind four credentials, run the schema, and send the sample lead. If the workflows do not import or the sample request cannot complete because of a package defect, we will fix it or refund the purchase.

## Pricing

| Tier | Price | Best for |
| --- | --- | --- |
| Solo | $147 | Founder-operated agency, one deployment |
| Agency | $297 | 2–10 person agency, client work included |
| Agency Pro | $497 | 10+ person agency, white-label edits, priority support |

## What You Need

| Requirement | Detail |
| --- | --- |
| n8n | 1.60+ cloud or self-hosted |
| Postgres | 14+ |
| AI | OpenAI key (Anthropic supported with a node swap) |
| Email | Gmail or Google Workspace OAuth2 |
| Chat | Slack bot with `chat:write` |
| Domain | SPF, DKIM, DMARC configured |

## FAQ

**Does it send email automatically?** It sends only after a human clicks Approve with a valid token. The approval step is mandatory.

**Can I change the AI model?** Yes. Swap the chat model node and keep the same JSON output contract.

**Can I send through Brevo or Mailgun?** Yes. Replace the Gmail nodes with your provider's node or HTTP request. Keep the guardrails and approval logic.

**Can I use this for clients?** Yes. The license permits client deployments. It forbids reselling the raw package.

**Does it handle replies?** No. It sends and follows up. Reply handling is intentionally human so no lead gets an automated response.

**What if the AI writes a bad email?** The guardrail blocks rule violations, and the human approval step catches judgment issues. No draft is sent unread.

**What happens on failure?** A Slack alert fires and a dead-letter row is written to Postgres.

**Is it GDPR compliant?** The software provides the mechanism. You must supply the lawful basis, consent records, and deletion process.

**Is there a refund policy?** 30-day money-back guarantee if the package does not import or does not match the description.

## License

Commercial license. Client deployments permitted. Resale, redistribution, and white-label resale prohibited.
