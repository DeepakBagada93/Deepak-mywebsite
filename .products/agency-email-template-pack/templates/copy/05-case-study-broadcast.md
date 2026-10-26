# Case Study Broadcast Template

- **File:** `templates/html/05-case-study-broadcast.html`
- **Accent:** `#be123c`
- **When to use:** Broadcast to warm list or use as a case-study lead magnet. Lead with the client outcome, not the agency.
- **Default subject:** How {{client_name|one agency}} cut {{metric|reporting time}} by {{metric_delta|41%}}
- **Default preheader:** The before, the change, and the result.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
{{client_name|The client}} had a familiar problem: the work was good, but every new account added another manual reporting loop. The team was winning clients faster than it could document them.

### Detail
We rebuilt one handoff: {{intervention|a single source of truth for weekly account notes}}. No new headcount. No six-month rollout. {{result_detail|Reporting moved from nine hours to five hours per week, and the account lead stopped writing updates on Sundays}}.

### Callout
The full teardown is four screens: the old loop, the new loop, the numbers, and the trade-offs.

### Primary CTA
Read the teardown → {{cta_url|https://your-agency.com/case-study}}

### Secondary action
Prefer the 90-second version? Reply “video” and I will send it.

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
