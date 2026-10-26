# 02. Deliverability & Sending Infrastructure Blueprint

**Brand**: Lumina Glow  
**Root Domain**: `luminaglow.com`  
**Sending ESP**: Klaviyo (D2C Lifecycle) + Smartlead.ai (Wholesale Outbound via `luminabeautypartners.com`)

---

## 1. D2C Klaviyo Dedicated Sending Infrastructure
- **Sending Domain**: `send.luminaglow.com`
- **SPF**: `v=spf1 include:klaviyomail.com ~all`
- **DKIM**: 2048-bit key verified with Klaviyo selector.
- **DMARC**: `v=DMARC1; p=quarantine; rua=mailto:dmarc@luminaglow.com; pct=100;`
- **BIMI Record**: Verified with registered SVG brand mark.

---

## 2. B2B Wholesale Secondary Outreach Fleet
- **Domain**: `luminabeautypartners.com`
- **Mailboxes**: 4 Google Workspace inboxes.
- **Limit**: 30 cold outreach emails per inbox/day.
- **Warmup**: Continuous 15 warmup emails/day.
