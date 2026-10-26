# Workflow 06: Pre-Send QA, Testing & Validation

Systematic testing protocol to guarantee flawless inbox delivery, pixel-perfect rendering across devices, dynamic token safety, and zero spam triggers.

---

## 1. The 4-Tier QA Inspection Process

Before pushing any campaign live or handing deliverables to a client, pass through these four inspection stages:

```
[Tier 1: Syntax & Variable Integrity]
       │
       ▼
[Tier 2: Algorithmic Spam & Trigger Scan]
       │
       ▼
[Tier 3: Multi-Client Rendering & Dark Mode]
       │
       ▼
[Tier 4: Live Seed List Delivery Test]
```

---

## 2. Tier 1: Syntax & Variable Integrity Check

- **Missing Fallback Audit**: Search all copy for single opening braces or raw tags without fallback (e.g., `{{first_name}}` without fallback logic).
- **Hyperlink Destination Check**: Click every single URL and verify UTM parameters:
  - Source: `utm_source=email`
  - Medium: `utm_medium=cold_outreach` or `utm_medium=newsletter`
  - Campaign: `utm_campaign=[campaign_slug]`
- **Unsubscribe Link Test**: Verify that clicking unsubscribe opens a functional preference center or instant opt-out confirmation.

---

## 3. Tier 2: Algorithmic Spam & Trigger Scan

- Scan body text and subject lines against the `quality/spam-trigger-words-blacklist.md`.
- Check word count:
  - Cold B2B emails: Under 85 words per step.
  - Newsletter / Lifecycle: 250–600 words for standard dispatches, 800–1200 words for deep-dive tutorials.
- Verify MIME parts: Both `text/html` and `text/plain` are present.

---

## 4. Tier 3: Multi-Client Rendering & Dark Mode

- **Mobile Viewport Test (375px width)**:
  - Ensure font size is ≥16px for body copy.
  - CTA button spans at least 44px in height (easy tap target).
  - No horizontal scrolling.
- **Dark Mode Test**:
  - Logos should have transparent backgrounds or be designed with an outline that looks sharp on dark backgrounds (`#121212`).
  - Text colors must invert cleanly without losing contrast against dark email backgrounds.

---

## 5. Tier 4: Live Seed List Delivery Test

Send test emails to real seed accounts across the three major email providers:
1. Personal `@gmail.com` inbox (Check Primary vs Promotions vs Spam tabs).
2. Enterprise Microsoft Office 365 / Outlook inbox (Check Focused vs Other vs Junk).
3. Apple Mail on iOS and macOS.

If the email lands anywhere other than Primary / Focused, review trigger words, sender reputation, and domain authentication before launching to your audience.
