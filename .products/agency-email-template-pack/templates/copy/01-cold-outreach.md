# Cold Outreach Template

- **File:** `templates/html/01-cold-outreach.html`
- **Accent:** `#2563eb`
- **When to use:** Cold outreach template. Keep Step 1 link-free; swap the CTA for a reply ask when sending from a new domain.
- **Default subject:** A quieter way to fix {{pain_point|the bottleneck}}
- **Default preheader:** One trigger, one question, no calendar link.

## Copy blocks

### Intro
Hi {{first_name|there}},

### Context
Saw {{trigger_event|the recent change}} at {{company|your team}}. Most agencies respond by adding more delivery hours. The teams that break the cycle usually remove one manual handoff first.

### Detail
We mapped that handoff for {{peer_company|a similar agency}} and cut {{metric|turnaround time}} by {{metric_delta|38%}} without adding headcount.

### Callout
Worth a 2-minute look at the handoff map? No call needed.

### Primary CTA
Send me the map → {{cta_url|https://your-agency.com/handoff-map}}

### Secondary action
Or reply with “send it” and I will keep it to one email.

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
