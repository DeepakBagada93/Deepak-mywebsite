# Agency Email Template Pack — Tutorial Guide

## 1. What you have

Eight HTML email templates for the moments that decide agency revenue, plus copy sheets, a subject line vault, a reference campaign, a builder, and a validator.

## 2. Prerequisites

- A computer with Node.js 18+ (only for the builder, validator, and tests).
- An email platform: Brevo, MailerLite, Mailchimp, Klaviyo, HubSpot, or a plain SMTP tool.
- A verified sending domain with SPF, DKIM, and DMARC configured.
- Your brand name, logo text, business address, and unsubscribe URL.
- 20 minutes for the first send.

## 3. 3-minute quickstart

```bash
# 1. Open a template
open templates/html/01-cold-outreach.html

# 2. Regenerate after editing the copy data in the builder
node scripts/build-templates.mjs

# 3. Audit the pack
node scripts/validate-template-pack.mjs

# 4. Run the tests
node tests/template-pack.test.mjs
```

## 4. Choose the right template

| Buyer moment | Template | CTA |
| --- | --- | --- |
| No prior contact | `01-cold-outreach.html` | Send the handoff map |
| Call completed | `02-discovery-follow-up.html` | Confirm the next step |
| Proposal sent 48h ago | `03-proposal-nudge.html` | Reply A, B, or C |
| Contract signed | `04-client-onboarding.html` | Open the checklist |
| Documented win | `05-case-study-broadcast.html` | Read the teardown |
| Dormant 60–90 days | `06-winback-reactivation.html` | See the new scope |
| Weekly editorial | `07-newsletter.html` | Read the issue |
| After a visible win | `08-referral-request.html` | Introduce me |

## 5. Import into your ESP

### Brevo
1. Campaigns → Email → Create → Import HTML.
2. Paste the template HTML.
3. Replace `{{first_name|there}}` with `{{ contact.FIRSTNAME | default: "there" }}`.
4. Replace `{{unsubscribe_url}}` with `{{ unsubscribe }}`.
5. Send a test to yourself before scheduling.

### MailerLite
1. Create a regular campaign → Edit → Code view.
2. Paste the HTML.
3. Replace `{$name}`, `{$company}`, and `{$unsubscribe}` tokens.
4. Preview on mobile and dark mode.
5. Send a test.

### Mailchimp
1. Create a campaign → Edit design → Code your own.
2. Paste the HTML.
3. Replace `*|FNAME|*`, `*|COMPANY|*`, and `*|UNSUB|*`.
4. Use “Preview and test” → “Send a test email”.
5. Check the plain-text version.

## 6. Personalization rules

- Every merge tag must have a fallback, e.g. `{{first_name|there}}`.
- If your ESP does not support fallbacks, set a default value before import.
- Never leave a demo company name, metric, or client name in a live send.
- Keep one primary CTA. Remove the secondary line if it competes.

## 7. Reference campaign

`examples/agency-campaign/` contains a complete campaign:

1. ICP and trigger research.
2. Deliverability and infrastructure.
3. Five-touch cold sequence.
4. Welcome, proposal dropout, onboarding, and win-back flows.
5. Newsletter and five-day launch.
6. Subject line and copy vault.
7. Production QA and rubric.

Run the pack validator, which audits the reference campaign end to end:

```bash
node scripts/validate-template-pack.mjs
```

## 8. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Gmail clips the email | HTML over 102KB | Remove comments and unused blocks |
| Outlook adds spacing | Missing `mso-table-lspace` | Keep the inline table styles intact |
| Button is not full width on mobile | Missing `class="btn"` | Preserve the class and media query |
| Dark mode text disappears | Custom color override | Keep the `ink` and `muted` classes |
| Merge tag renders blank | No fallback | Use `{{tag|fallback}}` |
| Unsubscribe link 404s | Placeholder URL | Replace `{{unsubscribe_url}}` with your ESP tag |
| Images not loading | Remote image blocked | The pack intentionally has no required images |
| Spam folder | New domain or link-heavy copy | Warm up the domain, remove links, test again |

## 9. FAQ

**Can I use these for client work?** Yes. The license permits client work. It forbids reselling the raw templates.

**Do I need coding skills?** No for sending. The builder and validator are optional and require Node.js.

**Are the metrics real?** The reference campaign uses illustrative values. Replace them with documented client results before sending.

**Can I change the colors?** Yes. Edit the `accent` value in `scripts/build-templates.mjs` and rebuild.

**Do the templates include images?** No. They are text-first for deliverability and rendering reliability.

**How often should I send?** Cold: one sequence, then stop. Newsletter: weekly or biweekly. Win-back: maximum two touches.
