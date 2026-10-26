# 02. Deliverability & Sending Infrastructure Blueprint

**Campaign / Product**: {{CAMPAIGN_NAME}}  
**Root Domain**: {{ROOT_DOMAIN}}  
**Secondary Outbound Domains**: {{SECONDARY_DOMAINS}}  
**ESP / Sending Software**: {{ESP_PLATFORM_NAME}}

---

## 1. DNS Records & Authentication Map

### SPF Record
- **Host**: `@`
- **Type**: `TXT`
- **Value**: `v=spf1 include:_spf.google.com include:sendgrid.net ~all`
- **Lookup Count**: {{LOOKUP_COUNT}}/10

### DKIM Record
- **Host**: `{{SELECTOR}}._domainkey`
- **Type**: `TXT` / `CNAME`
- **Key Length**: 2048-bit RSA
- **Status**: Verified

### DMARC Policy
- **Host**: `_dmarc`
- **Type**: `TXT`
- **Policy**: `v=DMARC1; p=none; rua=mailto:dmarc@{{ROOT_DOMAIN}}; pct=100;`
- **Enforcement Milestone**: Upgrade to `p=quarantine` on Day 14, `p=reject` on Day 30.

### Custom Tracking Domain (CNAME)
- **Host**: `track`
- **Type**: `CNAME`
- **Value**: `{{CUSTOM_TRACKING_CNAME_TARGET}}`
- **SSL Certificate**: Enabled

---

## 2. Mailbox Rotation & Sending Capacity Schedule

| Domain | Mailbox User | Provider | Warmup Days | Max Daily Cold Limit | Warmup Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `{{OUTBOUND_DOMAIN_1}}` | `alex@{{OUTBOUND_DOMAIN_1}}` | Google Workspace | 14+ | 30 | 15 / day |
| `{{OUTBOUND_DOMAIN_1}}` | `sarah@{{OUTBOUND_DOMAIN_1}}` | Google Workspace | 14+ | 30 | 15 / day |
| `{{OUTBOUND_DOMAIN_2}}` | `alex@{{OUTBOUND_DOMAIN_2}}` | Microsoft 365 | 14+ | 30 | 15 / day |
| `{{OUTBOUND_DOMAIN_2}}` | `sarah@{{OUTBOUND_DOMAIN_2}}` | Microsoft 365 | 14+ | 30 | 15 / day |

**Total Fleet Sending Capacity**: {{TOTAL_MAILBOXES}} inboxes × 30 emails/day = **{{TOTAL_DAILY_SENDS}} cold prospects/day**.

---

## 3. Ramp-Up & Throttling Plan

- **Days 1–7**: 100% Warmup Pool (Zero cold outbound).
- **Days 8–14**: Ramp warmup to 20 emails/day. Test 5 cold sends/inbox.
- **Days 15+**: Full deployment at 30 cold + 15 warmup per inbox/day.
- **Send Window**: 8:30 AM to 5:30 PM in prospect local timezone, randomized 6–11 minute interval between emails.
