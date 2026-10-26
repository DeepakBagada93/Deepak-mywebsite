---
name: agency-email-template-pack
description: Use this skill when an agency or service business needs production-ready email templates and copy for cold outreach, discovery follow-ups, proposal nudges, client onboarding, case-study broadcasts, win-back, newsletters, and referral requests. Generates responsive, dark-mode-safe HTML with merge-tag fallbacks, plus subject lines, preview text, and a compliance QA pass.
---

# Agency Email Template Pack

## 1. When to use

Activate this skill when the user asks for:
- Agency cold outreach emails or follow-up sequences.
- A discovery-call recap, proposal nudge, or onboarding email.
- A case-study broadcast, newsletter, win-back, or referral request.
- A reusable HTML email template that renders across Gmail, Outlook, Apple Mail, and mobile.
- A copy review for spam risk, CTA friction, or compliance.

Do not use it for full lifecycle strategy, deliverability DNS setup, or automated workflow builds. Pair it with the `email-marketing` skill for strategy and the `ai-email-automation-agency` product for automation.

## 2. Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| HTML templates | `templates/html/*.html` | Self-contained, responsive sends |
| Copy sheets | `templates/copy/*.md` | Editable copy, merge tags, QA |
| Subject vault | `templates/subject-line-vault.md` | Subject + preview pairings |
| Reference campaign | `examples/agency-campaign/` | Full strategy-to-QA example |
| Builder | `scripts/build-templates.mjs` | Regenerates all eight templates |
| Validator | `scripts/validate-template-pack.mjs` | Rendering, spam, compliance, secret audit |

## 3. Workflow

### Step 1 — Pick the moment, not the template
Choose by the buyer's current state:
- No prior contact → `01-cold-outreach.html`.
- Call completed in the last 2 hours → `02-discovery-follow-up.html`.
- Proposal sent 48+ hours ago → `03-proposal-nudge.html`.
- Contract signed → `04-client-onboarding.html`.
- A documented win exists → `05-case-study-broadcast.html` or `08-referral-request.html`.
- Client dormant 60–90 days → `06-winback-reactivation.html`.
- Weekly editorial send → `07-newsletter.html`.

### Step 2 — Replace copy, keep the structure
1. Copy the HTML file into your ESP.
2. Replace the `{{merge_tag|fallback}}` values.
3. Keep one primary CTA. Delete the secondary line if it competes.
4. Keep the preheader different from the headline.
5. Never add a second link to a cold Step 1.

### Step 3 — Verify before send
```bash
node scripts/build-templates.mjs
node scripts/validate-template-pack.mjs
```
The validator checks required assets, doctype, viewport, preheader, 600px container, role="presentation", dark mode, mobile media query, unsubscribe, address, no scripts, no external stylesheets, spam phrases, secrets, and the reference campaign.

### Step 4 — Run the human QA
- Seed test in Gmail, Outlook, and Apple Mail.
- Check dark mode on iOS.
- Confirm reply routing reaches a monitored inbox.
- Confirm opt-out processing within 24 hours.

## 4. Non-negotiable rules

1. **One idea per email.** If the draft has two asks, split it.
2. **No calendar link in cold Step 1.** Ask for a reply or permission to send an asset.
3. **Every merge tag has a fallback.** Broken personalization is worse than none.
4. **No fake urgency.** No countdowns, no “act now”, no invented scarcity.
5. **Proof must be real.** Every metric needs a client, a period, and a method.
6. **Compliance is structural.** Unsubscribe and business address live in the template, not in a checklist.
7. **Plain text beats decoration** for cold outreach. Use the HTML shell for warm, lifecycle, and broadcast sends.

## 5. Production checklist

- [ ] Template chosen for the correct buyer moment.
- [ ] Copy replaced and merge tags have fallbacks.
- [ ] Subject 2–7 words, preview under 90 characters.
- [ ] One primary CTA, no competing link in cold Step 1.
- [ ] Unsubscribe and address populated.
- [ ] Validator exits 0.
- [ ] Seed test passed in three clients.
- [ ] Owner approval recorded before the first live send.
