# Winback Reactivation Template

- **File:** `templates/html/06-winback-reactivation.html`
- **Accent:** `#475569`
- **When to use:** Send to clients inactive 60-90 days. Never more than two win-back touches before suppressing.
- **Default subject:** It has been a while — here is what changed
- **Default preheader:** No guilt. Just the three updates that matter.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
You paused your work with us {{months_away|six months}} ago. I am not writing to pretend nothing changed. I am writing because three things did:

### Detail
**1.** {{update_one|Faster onboarding: first deliverable in five working days}}.\n**2.** {{update_two|A smaller entry scope for teams testing the fit}}.\n**3.** {{update_three|One owner per account instead of a rotating pod}}.

### Callout
If the timing is still wrong, reply “not now” and I will close the loop for good.

### Primary CTA
See the new scope → {{cta_url|https://your-agency.com/new-scope}}

### Secondary action
If it is right, reply “tell me more” and I will send the one-page comparison.

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
