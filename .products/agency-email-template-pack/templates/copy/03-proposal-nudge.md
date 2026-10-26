# Proposal Nudge Template

- **File:** `templates/html/03-proposal-nudge.html`
- **Accent:** `#7c3aed`
- **When to use:** Use once per proposal. If there is no reply, send the polite close in the copy pack.
- **Default subject:** One question before you decide
- **Default preheader:** A useful nudge that does not chase.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
You have had the proposal for {{days_since_sent|four days}}. I am not writing to chase a yes. I am writing to surface the one thing that usually stalls this decision.

### Detail
Most teams pause on {{objection|internal capacity}}, not price. If that is the blocker, the scope can start with {{smaller_scope|one workflow}} and expand after the first result.

### Callout
Which is closer: budget timing, internal capacity, or the scope itself?

### Primary CTA
Reply with A, B, or C → mailto:{{sender_email|hello@your-agency.com}}?subject=Proposal%20question

### Secondary action
A one-line reply is enough. I will adjust from there.

### Signature
{{sender_name|Alex}}
Founder, {{brand_name|Northline Studio}}

## Merge tags

| Tag | Purpose | Fallback |
| --- | --- | --- |
| `{{first_name}}` | Recipient first name | there |
| `{{company}}` | Recipient company | your team |
| `{{brand_name}}` | Your agency name | Northline Studio |
| `{{sender_name}}` | Sender name | Alex |
| `{{sender_title}}` | Sender role | Founder, {{brand_name}} |
| `{{cta_url}}` | Primary destination | your-agency.com |
| `{{unsubscribe_url}}` | Compliance link | your-agency.com/unsubscribe |

## QA before send

1. Replace every demo value that should not ship.
2. Keep the preheader under 90 characters and different from the headline.
3. Test one desktop client, Gmail mobile, and dark mode.
4. Confirm the unsubscribe and address are populated.
5. Send a seed copy to yourself and check link tracking.
