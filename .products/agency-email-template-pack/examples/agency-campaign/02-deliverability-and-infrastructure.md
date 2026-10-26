# 02. Deliverability & Sending Infrastructure

**Sending domain:** `try.northline.studio` (secondary, never the primary root domain)  
**Primary domain:** `northline.studio` (transactional and client work only)  
**ESP:** Google Workspace mailboxes for cold outreach; Brevo for opted-in lifecycle.

## Authentication record

| Record | Host | Value | Status |
| --- | --- | --- | --- |
| SPF | `try.northline.studio` | `v=spf1 include:_spf.google.com ~all` | Required |
| DKIM | `google._domainkey.try` | 2048-bit selector from Google Admin | Required |
| DMARC | `_dmarc.try` | `v=DMARC1; p=none; rua=mailto:dmarc@northline.studio; adkim=s; aspf=s` | Required |
| Tracking CNAME | `track.northline.studio` | `go.brevo.com` | Required |
| MX | `try.northline.studio` | Google Workspace | Required |

Roll DMARC from `p=none` to `p=quarantine` after 14 clean days, then `p=reject` after 30.

## Mailbox rotation

| Mailbox | Daily cold cap | Warmup state | Role |
| --- | --- | --- | --- |
| alex@try.northline.studio | 30 | 21 days complete | Founder-led outbound |
| maya@try.northline.studio | 25 | 14 days complete | New business |
| studio@try.northline.studio | 20 | 7 days in progress | Case study broadcasts |

Rules:
- Never exceed 45 cold sends per mailbox per day.
- Send Monday–Thursday, 08:30–10:30 local time.
- Stop a mailbox for 48 hours if bounce rate exceeds 2% or spam complaints exceed 0.1%.
- Keep plain-text Step 1 link-free; add tracking only from Step 2.

## Warmup schedule

| Week | Sends/day | Action |
| --- | --- | --- |
| 1 | 5 | Peer-to-peer warmup only, no campaign |
| 2 | 12 | Warmup plus 10 manual replies |
| 3 | 22 | Begin Step 1 to the safest 50 contacts |
| 4 | 30 | Full campaign, monitor reputation daily |

## Opt-out and compliance

- Every template includes an unsubscribe link and registered business address.
- Process opt-outs within 24 hours across all mailboxes.
- Keep a dated consent/source record for every contact.
- For EU/UK contacts, document legitimate interest and keep the relevance test on file.
