# Templates

Eight production-ready agency email templates. Each HTML file is self-contained: no external CSS, no scripts, no remote fonts, and no image dependencies.

| # | Template | Job | Default CTA |
| --- | --- | --- | --- |
| 1 | `01-cold-outreach.html` | Trigger-based first touch | Send the handoff map |
| 2 | `02-discovery-follow-up.html` | Recap a discovery call | Confirm the next step |
| 3 | `03-proposal-nudge.html` | Surface the real objection | Reply A, B, or C |
| 4 | `04-client-onboarding.html` | Kick off a signed client | Open the checklist |
| 5 | `05-case-study-broadcast.html` | Distribute proof | Read the teardown |
| 6 | `06-winback-reactivation.html` | Reactivate a dormant client | See the new scope |
| 7 | `07-newsletter.html` | Weekly editorial issue | Read the issue |
| 8 | `08-referral-request.html` | Ask for one introduction | Introduce me |

## Merge tag convention

All tags use `{{tag|fallback}}` so a missing value never renders as an empty gap.

| Tag | Meaning |
| --- | --- |
| `{{first_name}}` | Recipient first name |
| `{{company}}` | Recipient company |
| `{{brand_name}}` | Your agency name |
| `{{sender_name}}` | Sender name |
| `{{sender_title}}` | Sender role |
| `{{cta_url}}` | Primary CTA destination |
| `{{unsubscribe_url}}` | Compliance opt-out |
| `{{company_address}}` | Registered business address |

## Platform mapping

| Pack token | Brevo | MailerLite | Mailchimp |
| --- | --- | --- | --- |
| `{{first_name|there}}` | `{{ contact.FIRSTNAME | default: "there" }}` | `{$name}` | `*|FNAME|*` |
| `{{company|your team}}` | `{{ contact.COMPANY | default: "your team" }}` | `{$company}` | `*|COMPANY|*` |
| `{{unsubscribe_url}}` | `{{ unsubscribe }}` | `{$unsubscribe}` | `*|UNSUB|*` |

Replace the pack tokens with your ESP's syntax before importing, or keep the pack tokens if your sending tool supports custom merge syntax.

## Build and validate

```bash
node scripts/build-templates.mjs
node scripts/validate-template-pack.mjs
```
