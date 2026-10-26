# 15-Point Pre-Send Deliverability & Compliance Checklist

Complete every check before deploying any automated sequence, cold outreach campaign, or mass newsletter broadcast.

---

## Technical & DNS Configuration (Checks 1–5)

- [ ] **1. SPF Alignment**: A single valid `TXT` SPF record exists on the sending domain and contains all sending MTA servers without exceeding the 10 DNS lookup limit.
- [ ] **2. DKIM 2048-Bit Signed**: Outbound test emails contain valid cryptographic DKIM signatures matching the sending domain selector.
- [ ] **3. DMARC Enforced**: A valid DMARC record exists on the root domain (`p=none`, `p=quarantine`, or `p=reject`) with configured `rua` reporting.
- [ ] **4. Custom Tracking Domain Verified**: CNAME record configured for click/open tracking on your own brand domain rather than shared ESP hostnames.
- [ ] **5. Domain Warmup Complete**: Inboxes have undergone at least 14 days of gradual warmup with healthy open/reply ratios before cold volume deployment.

---

## Content & Hygiene Verification (Checks 6–10)

- [ ] **6. Spam Word Clean**: No prohibited spam trigger words, zero all-caps strings in subject lines, and zero multiple punctuation marks (`!!!`, `???`, `$$$`).
- [ ] **7. Link Restraint**:
  - Cold Outreach Step 1: Maximum 1 link or 0 links (plain text preferred).
  - Marketing/Newsletter: Contextual hyperlinking; no raw naked URLs that mismatch destination URLs.
- [ ] **8. Clean Text-to-Image Balance**: Marketing emails maintain at least 60% written HTML copy and at most 40% imagery. Every image has descriptive `alt` text.
- [ ] **9. Plain-Text MIME Fallback**: Multipart MIME email contains a clean, human-readable plain text version alongside the HTML version.
- [ ] **10. Mobile Responsive Layout**: Email renders cleanly without horizontal scrolling on mobile viewports (320px–420px). Body font size is minimum 16px for legibility.

---

## Compliance, Personalization & Unsubscribe (Checks 11–15)

- [ ] **11. One-Click Unsubscribe & Physical Address**:
  - Marketing broadcasts include clear unsubscribe link and physical mailing address (CAN-SPAM / GDPR requirement).
  - Cold B2B emails include an easy opt-out mechanism (e.g., *"If you'd rather not hear from me, just let me know and I'll remove you immediately."*).
- [ ] **12. Fallback Tokens Tested**: Every dynamic variable has an airtight fallback (e.g., `{{first_name|there}}` or `{{company_name|your team}}`). Never allow `Hey [FIRST_NAME]` to ship.
- [ ] **13. Subject Line Length & Preheader**:
  - Subject lines are 30–50 characters (or 3–7 words) to avoid truncation on mobile.
  - Preheader / Preview Text is explicitly defined (35–90 characters) and complements the subject line.
- [ ] **14. Sending Volume & Throttling Limits**:
  - Cold outreach is strictly throttled to 30–45 emails per inbox per day with randomized intervals.
  - Marketing broadcasts to unengaged contacts (>90 days inactive) are suppressed.
- [ ] **15. Seed List & Test Render Passed**: Test email sent to Gmail, Outlook/Office 365, and Apple Mail client accounts, confirming primary inbox placement.
