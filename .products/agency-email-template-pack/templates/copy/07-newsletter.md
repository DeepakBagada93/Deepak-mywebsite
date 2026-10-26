# Newsletter Template

- **File:** `templates/html/07-newsletter.html`
- **Accent:** `#1d4ed8`
- **When to use:** Replace the issue title and body per send. Keep one primary CTA and one secondary forward ask.
- **Default subject:** The handoff nobody owns
- **Default preheader:** A 3-minute read on agency operations and one tool worth testing.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
Every agency has one handoff that exists only because nobody wants to own it. Ours was the weekly client note. Yours might be the QA pass, the invoice reconciliation, or the intake form.

### Detail
This issue covers: why invisible handoffs survive, a 15-minute audit for finding yours, and the one metric that makes the cost visible to a client. Read time: 3 minutes.

### Callout
One practical idea, one real example, no motivational filler.

### Primary CTA
Read this week’s issue → {{cta_url|https://your-agency.com/newsletter}}

### Secondary action
Forward this to the person who owns operations. They will thank you.

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
