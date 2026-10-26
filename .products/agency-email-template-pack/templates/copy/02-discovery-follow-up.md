# Discovery Follow Up Template

- **File:** `templates/html/02-discovery-follow-up.html`
- **Accent:** `#0f766e`
- **When to use:** Send within 2 hours of the call while recall is high. Keep it under 150 words.
- **Default subject:** The three notes from our call
- **Default preheader:** The decision, the risk, and the next smallest step.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
Thanks for the candid walkthrough. I wrote down three things so we are deciding from the same page:

### Detail
**1. The goal:** {{goal|ship the new offer without stretching the delivery team}}.\n**2. The risk:** {{risk|another quarter of manual reporting}}.\n**3. The next step:** {{next_step|a 20-minute scope check with your ops lead}}.

### Callout
If any of those notes are off, reply with the correction and I will rework the scope before we speak again.

### Primary CTA
Confirm the next step → {{cta_url|https://your-agency.com/scope-check}}

### Secondary action
No deck attached. Just the notes.

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
