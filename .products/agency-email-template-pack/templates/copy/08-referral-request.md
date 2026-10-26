# Referral Request Template

- **File:** `templates/html/08-referral-request.html`
- **Accent:** `#15803d`
- **When to use:** Send after a visible win, not after an invoice. One ask, one follow-up maximum.
- **Default subject:** Know one team with this problem?
- **Default preheader:** A 15-second ask, no awkward follow-up.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
We just wrapped {{project_name|the onboarding rebuild}} for {{client_name|a client}} and the result was {{result|a 41% cut in reporting time}}.

### Detail
I am not asking for a testimonial. I am asking for one introduction to a team that is still stuck in {{problem|the same manual reporting loop}}.

### Callout
If one name comes to mind, reply with it and I will send a short forwardable note. No pressure if not.

### Primary CTA
Introduce me → mailto:{{sender_email|hello@your-agency.com}}?subject=Introduction

### Secondary action
Thank you either way.

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
