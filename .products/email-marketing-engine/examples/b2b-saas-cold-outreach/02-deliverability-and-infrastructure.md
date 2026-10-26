# 02. Deliverability & Sending Infrastructure Blueprint

**Campaign / Product**: PipePilot Outbound Engine  
**Root Domain**: `pipepilot.io` (Protected, zero cold outbound)  
**Secondary Outbound Domains**: `trypipepilot.com`, `usepipepilot.io`, `getpipepilot.co`  
**Sending Software**: Instantly.ai with Google Workspace Business Starter inboxes

---

## 1. DNS Records & Authentication Configuration

### Domain 1: `trypipepilot.com`
- **SPF Record**:
  - Type: `TXT`
  - Host: `@`
  - Value: `v=spf1 include:_spf.google.com ~all`
- **DKIM Record**:
  - Type: `TXT`
  - Host: `google._domainkey`
  - Value: `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3f...` (2048-bit key)
- **DMARC Record**:
  - Type: `TXT`
  - Host: `_dmarc`
  - Value: `v=DMARC1; p=none; rua=mailto:dmarc-reports@trypipepilot.com; pct=100;`
- **Custom Tracking Domain (CNAME)**:
  - Type: `CNAME`
  - Host: `track`
  - Target: `prox.instantly.ai`

---

## 2. Mailbox Rotation Fleet

| Domain | Email Address | Mailbox Type | Daily Cold Limit | Warmup Ratio | Daily Total |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `trypipepilot.com` | `marcus@trypipepilot.com` | Google Workspace | 30 | 15 / day | 45 |
| `trypipepilot.com` | `elena@trypipepilot.com` | Google Workspace | 30 | 15 / day | 45 |
| `usepipepilot.io` | `marcus@usepipepilot.io` | Microsoft 365 | 30 | 15 / day | 45 |
| `usepipepilot.io` | `elena@usepipepilot.io` | Microsoft 365 | 30 | 15 / day | 45 |
| `getpipepilot.co` | `marcus@getpipepilot.co` | Google Workspace | 30 | 15 / day | 45 |
| `getpipepilot.co` | `elena@getpipepilot.co` | Google Workspace | 30 | 15 / day | 45 |

**Fleet Totals**: 6 Mailboxes × 30 cold outbound sends = **180 targeted accounts reached per business day** (3,600 accounts/month).

---

## 3. Warmup Schedule & Sending Guardrails

- **Days 1–14**: Peer warmup network only (Gradual scale from 5 to 20 emails/day, 35% reply simulation).
- **Day 15+**: Outbound deployment initiated with randomized 7–12 minute delays between sends.
- **Bounce Rate Cutoff**: Automatic campaign pause triggered if bounce rate reaches 2.0%.
