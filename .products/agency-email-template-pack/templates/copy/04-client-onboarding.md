# Client Onboarding Template

- **File:** `templates/html/04-client-onboarding.html`
- **Accent:** `#b45309`
- **When to use:** Send immediately after signature. This template doubles as the first onboarding sequence email.
- **Default subject:** Your kickoff starts here
- **Default preheader:** Access, owners, and the first 72 hours.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
We are ready to start on {{start_date|Monday}}. Three small things make the first week calm instead of chaotic:

### Detail
**1. Access:** {{access_list|Analytics, ad account, and shared drive}}.\n**2. Owners:** {{owner_map|one approver and one day-to-day contact}}.\n**3. First checkpoint:** {{first_checkpoint|Thursday at 3pm, 20 minutes}}.

### Callout
Reply “confirmed” once the access is in place and we will send the kickoff agenda.

### Primary CTA
Open the kickoff checklist → {{cta_url|https://your-agency.com/kickoff}}

### Secondary action
If anything is missing, send what you have and we will start with that.

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
