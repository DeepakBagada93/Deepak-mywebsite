# Email Deliverability & DNS Infrastructure Standards

Technical standards and deliverability rules for high-inbox-rate email operations across both Cold Outbound and Lifecycle/Marketing streams.

---

## 1. Google & Yahoo Sender Requirements (Mandatory 2024+)

All senders must adhere to these baseline requirements to prevent outright domain throttling or spam box routing:

1. **Authentication Trinity**: SPF, DKIM, and DMARC must all align and pass.
2. **Spam Complaint Threshold**: Maintain Google Postmaster spam complaint rate **strictly below 0.10%** (1 spam report per 1,000 sent emails). Immediate throttling begins at 0.30%.
3. **One-Click Unsubscribe (RFC 8058)**: Marketing and promotional emails must support both:
   - Header-level: `List-Unsubscribe: <mailto:unsubscribe@domain.com>, <https://domain.com/unsubscribe>`
   - `List-Unsubscribe-Post: List-Unsubscribe=One-Click`
   - Visible body unsubscribe link processed within 48 hours (CAN-SPAM allows 10 days, but modern ESPs enforce instant).
4. **Valid Forward and Reverse DNS (rDNS / PTR records)**: Sending MTA IP must resolve reversibly to the sending hostname.
5. **TLS Encryption**: Enforce opportunistic TLS 1.2+ on all outbound connections.

---

## 2. DNS Infrastructure Specifications

### A. SPF (Sender Policy Framework)
- **Record Type**: TXT
- **Host**: `@` (Root domain or designated subdomain)
- **Rule**: Single SPF record per domain (multiple SPF records cause total failure / PERMERROR). Max 10 DNS lookups.
- **Example**:
  ```dns
  v=spf1 include:_spf.google.com include:servers.mcsv.net ip4:192.0.2.1 ~all
  ```
  *(Note: Use `~all` [SoftFail] during rollout, `~all` or `-all` [HardFail] when all sending IPs are declared).*

### B. DKIM (DomainKeys Identified Mail)
- **Record Type**: TXT or CNAME (depending on provider, e.g., 2048-bit RSA)
- **Host**: `<selector>._domainkey` (e.g., `google._domainkey` or `k1._domainkey`)
- **Rule**: Unique 2048-bit cryptographic key signature per sending service. Never share private keys across different ESPs.

### C. DMARC (Domain-based Message Authentication, Reporting, and Conformance)
- **Record Type**: TXT
- **Host**: `_dmarc`
- **Phased Implementation Policy**:
  - **Phase 1 (Monitoring)**:
    ```dns
    v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com; pct=100; adkim=r; aspf=r;
    ```
  - **Phase 2 (Quarantine)**:
    ```dns
    v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=100; adkim=s; aspf=s;
    ```
  - **Phase 3 (Strict Enforcement / Enforced Reject)**:
    ```dns
    v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.com; ruf=mailto:dmarc-failures@yourdomain.com; pct=100;
    ```

### D. BIMI (Brand Indicators for Message Identification)
- Requires `p=quarantine` or `p=reject` with 100% pct.
- Displays brand avatar in Gmail/Apple Mail client inbox.
- Requires SVG Tiny P.S. logo and a Verified Mark Certificate (VMC) for Gmail blue checkmark display.

### E. Custom Tracking Domain (CNAME)
- Never use the shared ESP tracking domain (`clk.klaviyo.com` or `track.instantly.ai`) for high-volume cold outreach or branded enterprise newsletters.
- Set up a dedicated CNAME record:
  ```dns
  track.yourdomain.com CNAME sendgrid.net / custom.tracking.provider
  ```
- Protects domain reputation from noisy neighbors sharing default tracking domains.

---

## 3. Cold Outbound vs Marketing Sending Architecture

| Dimension | Cold Outbound Engine (Instantly / Smartlead / Apollo) | Lifecycle & Marketing Engine (Klaviyo / Kit / Brevo) |
| :--- | :--- | :--- |
| **Domain Strategy** | **Secondary Lookalike Domains Only** (e.g. `getcompany.com`, `usecompany.io`, `trycompany.co`). Never send cold outreach from primary domain. | **Primary Corporate Domain** (`company.com` or `mail.company.com` subdomain). |
| **Mailboxes** | Google Workspace or Microsoft 365 dedicated business inboxes (3 to 5 inboxes per secondary domain). | Dedicated ESP sending IP (Shared high-reputation pool or dedicated IP for 100k+ monthly). |
| **Daily Send Limits** | Max 30–50 cold emails per inbox/day (including 15–20 warmup emails). | 1,000 to 1,000,000+ subscriber blasts (segmented by engagement). |
| **Warmup Protocol** | Mandatory 14–21 day automated peer-to-peer warmup before any live outreach. Ramp slow: 5 → 10 → 20 → 35/day. Keep warmup active at 20-30% volume indefinitely. | IP/Domain warming: Send first to 30-day active openers, gradually expanding to 60-day, then 90-day. |
| **Email Format** | Plain text or minimalist inline HTML (0 images, max 1 link or 0 links in Step 1). | Styled responsive HTML, brand typography, bulletproof CTA buttons, product grids, media assets. |
| **Tracking Settings** | Disable open tracking (pixel) & click tracking on cold Step 1 to maximize deliverability and avoid spam triggers. | Full open, click, and revenue attribution tracking enabled. |

---

## 4. Cold Domain Ramp Schedule

```
Day 1–3:     DNS records setup & propagation (SPF, DKIM, DMARC, MX). Zero live sends.
Day 4–10:    Warmup pool only: 5 to 15 warmup emails/day. Zero live cold sends.
Day 11–14:   Warmup pool: 20 to 25 emails/day. Start test cold sends (3-5 live emails/day).
Day 15–21:   Warmup pool: 15 emails/day + Cold sends: 15 to 25 emails/day.
Day 22+:     Cruising speed: 30 cold sends + 15 warmup sends = 45 total per inbox/day.
```

**Inbox Scaling Formula**:
To send 300 cold emails/day sustainably:
- Need 10 separate mailboxes across 3 secondary domains.
- 10 mailboxes × 30 cold emails/day = 300 target volume.
- Zero risk to primary company domain.
