# 07. Email Campaign Production QA & Pre-Send Signoff

**Campaign Slug / Name**: {{CAMPAIGN_SLUG}}  
**Target ESP**: {{ESP_PLATFORM}}  
**QA Inspector**: {{INSPECTOR_NAME}}  
**Audit Date**: {{DATE}}

---

## 1. Pre-Flight Deliverability & Technical Check

| Check Item | Status | Notes / Evidence |
| :--- | :--- | :--- |
| **SPF Record Validated** | `[PASS / FAIL]` | Verified via MXToolbox; 0 lookup errors |
| **DKIM 2048-bit Signed** | `[PASS / FAIL]` | Valid signature detected |
| **DMARC Record Active** | `[PASS / FAIL]` | `p=none` / `p=quarantine` verified |
| **Custom Tracking Domain (CNAME)** | `[PASS / FAIL]` | Host `track.domain.com` resolves with SSL |
| **Domain Warmup Verification** | `[PASS / FAIL]` | 14+ days completed; health score >95% |
| **Daily Send Limits Set** | `[PASS / FAIL]` | Capped at 30–45 sends/inbox/day |

---

## 2. Copy & Creative Quality Inspection

| Check Item | Status | Notes / Evidence |
| :--- | :--- | :--- |
| **Spam Trigger Words Audit** | `[PASS / FAIL]` | 0 high-risk urgency/financial words |
| **Cold Word Count (<85 words)** | `[PASS / FAIL]` | Average cold email length: {{WORD_COUNT}} words |
| **Token Fallback Logic** | `[PASS / FAIL]` | All `{{first_name|there}}` properly braced |
| **CTA Friction Level** | `[PASS / FAIL]` | Soft interest-based ask verified |
| **Preheader Synergized** | `[PASS / FAIL]` | 40–80 chars defined; no raw code visible |
| **Unsubscribe / Opt-Out Included** | `[PASS / FAIL]` | Valid CAN-SPAM / GDPR footer in place |

---

## 3. Rendering & Multi-Client Tests

- **Apple Mail (iOS & macOS)**: `[PASS / FAIL]`
- **Gmail (Web & Android/iOS App)**: `[PASS / FAIL]`
- **Microsoft Outlook (Office 365 & Desktop)**: `[PASS / FAIL]`
- **Dark Mode Rendering**: `[PASS / FAIL]` (Logos visible, text contrast high)

---

## 4. Final Signoff

- **Cold Email Rubric Score**: {{COLD_SCORE}}/100 (Must be ≥ 85)
- **Lifecycle Email Rubric Score**: {{LIFECYCLE_SCORE}}/100 (Must be ≥ 85)
- **Production Status**: `[READY FOR ACTIVATION / BLOCKED]`
- **Auditor Signature**: `{{AUDITOR_SIGNATURE}}`
