# Workflow 05: Deliverability Engineering & Domain Warmup

Technical guide to setting up sending infrastructure, domain authentication, warmup automation, and spam complaint prevention.

---

## 1. Step-by-Step DNS Authentication Guide

### Step 1: Add SPF Record
In your domain registrar / DNS provider (Cloudflare, Namecheap, Route 53):
- **Type**: `TXT`
- **Name / Host**: `@`
- **Value**: `v=spf1 include:_spf.google.com ~all` (or your specific provider include string).
- *Rule: If an SPF record already exists, merge the new provider with `include:provider.com` before the `~all`. Never have two separate SPF TXT records.*

### Step 2: Configure DKIM
- Generate a 2048-bit key in your sending platform (Google Workspace admin, Klaviyo, or Resend).
- Add the DNS record:
  - **Type**: `TXT` or `CNAME`
  - **Name / Host**: `google._domainkey` or designated selector.
  - **Value**: The public key string provided by your platform.

### Step 3: Implement DMARC
- Add the DNS record:
  - **Type**: `TXT`
  - **Name / Host**: `_dmarc`
  - **Value**: `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com; pct=100;`
- Monitor reports for 14 days. Once all legitimate sending streams pass SPF/DKIM, upgrade policy to `p=quarantine` and eventually `p=reject`.

### Step 4: Add Custom Tracking Domain (CNAME)
- Add DNS record:
  - **Type**: `CNAME`
  - **Name / Host**: `track` (or `inst`, `click`)
  - **Value**: Provider's tracking target (e.g., `prox.instantly.ai`).

---

## 2. Mailbox Warmup Protocol (Cold Outbound)

1. **Connect to Peer Warmup Pool**: Use built-in warmup pools in Instantly or Smartlead.
2. **Warmup Ramp Schedule**:
   - Starting sends: 5 warmup emails/day.
   - Increment: Increase by 2–3 emails per day.
   - Target limit: Cap at 20–25 warmup emails/day per mailbox.
   - Reply rate setting: 30%–35%.
3. **Warmup Duration**: Minimum 14 continuous days before initiating live cold outreach.
4. **Maintenance**: Leave warmup running continuously in the background at 15–20 emails/day throughout the life of the mailbox.

---

## 3. List Hygiene & Scrubbing Protocols

Never upload raw, unverified lead lists directly into your sending software:
1. **Scrubbing Engine**: Run all prospect lists through verification tools (NeverBounce, ZeroBounce, Scrubby, or MillionVerifier) before sending.
2. **Acceptable Bounce Threshold**:
   - Total Hard Bounce rate must remain **strictly below 2.0%**.
   - If bounce rate exceeds 3%, pause campaign immediately and purge unverified emails.
3. **Role-Based Email Filter**: Suppress generic inboxes like `admin@`, `support@`, `info@`, `sales@`, `billing@` in cold outreach; target named decision-makers only.
