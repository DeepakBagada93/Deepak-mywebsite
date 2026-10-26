# 07. Production QA & Sign-Off

## Pre-send checklist

| Check | Standard | Status |
| --- | --- | --- |
| Spam trigger scan | Zero high-risk phrases | Pass |
| Link count | Step 1: 0 links; later steps: 1 contextual link | Pass |
| Subject length | 2–5 words, no exclamation mark, no ALL CAPS | Pass |
| Preview text | Under 90 characters, different from headline | Pass |
| Merge tags | Every tag has a fallback (`{{first_name|there}}`) | Pass |
| Mobile rendering | 320px–420px, body ≥16px, tap targets ≥44px | Pass |
| Dark mode | Text and button contrast checked | Pass |
| Unsubscribe | Present in every template, link tested | Pass |
| Business address | Present in every template | Pass |
| Seed test | Gmail, Outlook, Apple Mail | Pass |
| Tracking | UTM parameters on every link | Pass |
| Reply routing | Replies reach a monitored inbox | Pass |

## Rubric score

| Dimension | Weight | Score | Notes |
| --- | --- | --- | --- |
| Relevance to ICP | 25 | 23 | Trigger-specific opener |
| Clarity | 20 | 19 | One idea per email |
| Proof | 20 | 17 | One quantified example per touch |
| CTA friction | 15 | 15 | Reply-based micro-commitment |
| Deliverability | 10 | 10 | Secondary domain, warmup complete |
| Compliance | 10 | 10 | Opt-out and address present |
| **Total** | **100** | **94** | **Status: PASS** |

## Final sign-off

- Copy owner: approved
- Deliverability owner: approved
- Compliance owner: approved
- Release status: `PASS — ready for owner approval`

No campaign may be sent while any row is `Fail`. Re-run the validator after every copy change:

```bash
node scripts/validate-template-pack.mjs
```
