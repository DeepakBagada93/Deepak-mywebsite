# Product Specification — Agency Email Template Pack

## 1. Summary

| Field | Value |
| --- | --- |
| Name | Agency Email Template Pack |
| Slug | agency-email-template-pack |
| Version | 1.0.0 |
| Category | Email templates / agency operations |
| Audience | Agencies, consultancies, fractional operators, service businesses |
| Format | HTML templates + Markdown copy sheets + docs |
| License | Commercial, client-work permitted, resale prohibited |

## 2. Problem

Agencies lose revenue in the gaps between the work: the first cold touch is never sent, the discovery call has no recap, the proposal goes quiet, the client waits for a kickoff, the case study is never distributed, and the old client is never re-contacted. Most template packs sell visual decoration. This pack sells the eight moments that move an agency pipeline.

## 3. Deliverables

| Asset | Count | Notes |
| --- | --- | --- |
| HTML email templates | 8 | Responsive, dark-mode aware, no external dependencies |
| Copy sheets | 8 | Subject, preview, body, merge tags, QA |
| Subject/preview pairings | 20+ | Cold, warm, proposal, and client |
| Reference campaign | 1 | Seven-file strategy-to-QA campaign |
| Builder script | 1 | Regenerates templates deterministically |
| Validator | 1 | Rendering, spam, compliance, secrets, campaign audit |
| Test suite | 1 | Zero-dependency Node tests |
| Commercial docs | 7 | Spec, research, tutorial, listing, test plan/results, release report |
| Skill instructions | 1 | Agent-ready usage workflow |

## 4. Design system

- **Width:** 600px maximum, fluid below 620px.
- **Typography:** system sans stack, 16px body, 27–31px headline.
- **Color:** warm off-white background, white card, one accent per template.
- **Structure:** text-first, no hero images, no icons required.
- **Accessibility:** semantic tables, `role="presentation"`, contrast-checked colors, 44px tap targets.
- **Compliance:** unsubscribe, preference link, business address, consent reason in every footer.
- **Personalization:** every dynamic value has a fallback (`{{tag|fallback}}`).

## 5. Non-goals

- Not a full ESP replacement.
- Not a deliverability DNS setup service.
- Not a drag-and-drop editor.
- Not a newsletter strategy course.
- Not a guarantee of open, reply, or conversion rates.

## 6. Acceptance criteria

1. Eight HTML templates render without external assets.
2. Every template contains a preheader, unsubscribe link, address, and mobile media query.
3. Every template passes the validator with zero errors.
4. The reference campaign passes the internal campaign audit.
5. The test suite exits 0.
6. The distribution ZIP excludes OS metadata, tests, and progress files.
7. The store listing and tutorial accurately describe the shipped assets only.
