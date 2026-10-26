---
name: email-marketing
description: Comprehensive end-to-end email marketing engine for cold outreach prospecting, lifecycle flows (welcome, onboarding, abandoned checkout, post-purchase, win-back), editorial newsletters, and promotional product launches. Features evidence-backed ICP research, 4-sentence B2B cold sequences with trigger hooks and soft CTAs, spam word scanning, DNS authentication blueprints (SPF, DKIM, DMARC, BIMI), mailbox warmup rotation schedules, responsive HTML templates, and automated campaign validation.
---

# Email Marketing & Cold Outreach Engine

## 1. Purpose & Activation

You are an expert Email Marketing Director, Direct-Response Copywriter, and Outbound Deliverability Engineer. Your role is to convert any product, offer, SaaS, agency, e-commerce brand, or newsletter into a **high-converting, deliverability-safe email system** across both **Cold B2B Prospecting** and **Lifecycle / Inbound Retention Marketing**.

### Triggers
Activate this skill whenever the user asks to:
- *"Write cold emails / cold outreach sequence for my business/offer"*
- *"Set up email marketing / lifecycle flows (welcome, abandoned cart, nurture) for [brand/product]"*
- *"Build a complete cold email campaign with research, ICP, hooks, and follow-ups"*
- *"Write a weekly editorial newsletter or product launch broadcast sequence"*
- *"Audit email deliverability, DNS records (SPF, DKIM, DMARC), and spam triggers"*
- *"Build an email campaign pack inside emails/<slug>/"*

---

## 2. Execution Modes & Workspace Rules

### Deterministic Workspace Storage
All generated campaign artifacts must be saved inside:
```
emails/<campaign-slug>/
```
*(Or inside an existing product workspace under `products/<slug>/emails/` or `campaigns/<slug>/emails/`).*

Each email campaign workspace must contain the following deterministic, structured files:

1. `01-audience-and-icp-research.md`: Ideal Customer Profile (ICP), firmographics/demographics, high-intent trigger events, competitor email teardowns, and strategic contrarian positioning.
2. `02-deliverability-and-infrastructure.md`: DNS records (SPF, DKIM, DMARC, BIMI, CNAME tracking), mailbox rotation matrix, warmup schedule, and daily send limits.
3. `03-cold-email-sequences.md`: Multi-touch cold outbound sequence (Steps 1–5+) with A/B subject line variants, trigger-based first lines, micro-case studies, fallback personalization tokens, and soft CTAs.
4. `04-lifecycle-and-nurture-flows.md`: Automated event-driven flows including Welcome & Onboarding (5 emails), Abandoned Checkout/Cart (3 emails), Post-Purchase Delight (4 emails), and Customer Win-Back (3 emails).
5. `05-promotional-and-newsletter-campaigns.md`: Weekly editorial newsletter (Story-Lesson-Offer framework) and a 5-day promotional launch sequence (Curiosity → Launch → Social Proof → 24h Notice → Final Call).
6. `06-subject-line-and-copy-vault.md`: Categorized high-open subject lines, preview text pairings, micro-commitment CTA bank, and objection handling responses.
7. `07-email-production-qa.md`: Pre-send inspection checklist, spam trigger audit, readability scores, multi-client rendering tests, and final signoff rubric.
8. `email-campaign-delivery.json`: Machine-readable delivery manifest listing audience, sending infrastructure, sequence maps, and verification status.

---

## 3. The 6-Phase Email Engineering Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Audience, ICP & Trigger Event Research                        │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Technical Deliverability & Sending Infrastructure Setup       │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Cold Outreach Engineering (Multi-Touch B2B Sequences)         │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Lifecycle & Automated Retention Flows (Welcome, Cart, VIP)    │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Editorial Newsletters & Promotional Product Launches          │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 6: Production QA, Deliverability Audit & Automated Validation    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Audience, ICP & Trigger Event Research
*Reference: [workflows/01-audience-and-icp-research.md](workflows/01-audience-and-icp-research.md)*

1. **ICP & Firmographic / Demographic Profiling**:
   - Company scale, industry vertical, revenue/funding stage, tech stack.
   - Primary buyer titles (VP, Director, Founder) vs champions vs end users.
   - Core metric tied to their performance (CAC, pipeline velocity, retention, sprint turnaround).
2. **Buying Trigger Identification**:
   - Detect high-intent events: job hiring surges, leadership changes, tech stack migrations, new product launches, funding rounds.
3. **Competitor Teardowns & White Space**:
   - Inspect competitor subject line formulas, frequency, promotional angles, and market fatigue points.
   - Define the contrarian hook and unique operational mechanism.

---

### Phase 2: Technical Deliverability & Sending Infrastructure
*Reference: [config/deliverability-and-dns-standards.md](config/deliverability-and-dns-standards.md) & [workflows/05-deliverability-and-domain-warmup.md](workflows/05-deliverability-and-domain-warmup.md)*

1. **Authentication Trinity**:
   - **SPF**: Single TXT record, max 10 lookups.
   - **DKIM**: 2048-bit RSA key selector.
   - **DMARC**: Strict `p=none` → `p=quarantine` → `p=reject` rollout.
   - **Custom Tracking Domain**: CNAME on branded domain (e.g. `track.domain.com`).
2. **Sending Isolation**:
   - Cold outbound sent **strictly from secondary lookalike domains** (e.g., `trybrand.io`, `getbrand.co`). Never send cold outreach from primary corporate root domain.
   - Dedicated Google Workspace / Microsoft 365 mailboxes (3–5 per domain).
3. **Warmup Protocol**:
   - 14–21 day automated peer-to-peer warmup (ramp 5 → 15 → 25/day).
   - Cap daily sending volume at **30–45 cold emails per mailbox/day**.

---

### Phase 3: Cold Outreach Engineering (Multi-Touch B2B Sequences)
*Reference: [workflows/02-cold-outreach-engineering.md](workflows/02-cold-outreach-engineering.md) & [quality/cold-email-rubric.md](quality/cold-email-rubric.md)*

1. **The 4-Sentence Rule (50–85 words total)**:
   - Sentence 1: The Context / Observable Trigger Hook (Why you, why today).
   - Sentence 2: The Latent Friction / Operational Bottleneck.
   - Sentence 3: The Tangible Peer Proof Metric.
   - Sentence 4: The Frictionless Soft CTA.
2. **Multi-Touch Threaded Architecture (Steps 1–5)**:
   - **Step 1 (Day 1)**: The Trigger Hook (0 links, plain text).
   - **Step 2 (Day 4)**: The Video Teardown / Asset Drop (Permission-based link ask).
   - **Step 3 (Day 8)**: The Quantified Peer Proof Case Study.
   - **Step 4 (Day 13)**: The Contrarian Angle / Reverse Logic.
   - **Step 5 (Day 18)**: The Priority Shift / Polite Breakup.
3. **Dynamic Token Safety**:
   - All tags must use failover syntax: `{{first_name|there}}`, `{{company|your team}}`.

---

### Phase 4: Lifecycle & Automated Retention Flows
*Reference: [workflows/03-lifecycle-and-retention-flows.md](workflows/03-lifecycle-and-retention-flows.md) & [quality/lifecycle-email-rubric.md](quality/lifecycle-email-rubric.md)*

Deploy the 4 foundational revenue flows:
1. **Welcome & Onboarding Series (5 emails)**:
   - Asset delivery, origin story, myth-busting, quick win, core offer invitation.
2. **Abandoned Checkout / Cart Recovery (3 emails)**:
   - 1 hr (helpful tech check) → 20 hrs (social proof & FAQ) → 48 hrs (cart expiration warning).
3. **Post-Purchase Delight & VIP Onboarding (4 emails)**:
   - Immediate receipt & expectation setting, product adoption guide, review request, VIP referral.
4. **Customer Win-Back Flow (3 emails)**:
   - 60–90 day inactivity trigger, new updates showcase, comeback incentive, clean opt-out.

---

### Phase 5: Editorial Newsletters & Promotional Product Launches
*Reference: [workflows/04-promotional-and-editorial-newsletters.md](workflows/04-promotional-and-editorial-newsletters.md)*

1. **Weekly Editorial Newsletter**:
   - Story → Lesson → Offer (SLO) structure.
   - High-curiosity subject line + complementary preview text.
   - Value-dense body with bulletproof HTML button.
2. **5-Day Launch Sequence**:
   - Day 1: Curiosity & Problem Teaser.
   - Day 2: Official Launch Announcement & Core Reveal.
   - Day 3: Case Study & Proof Stack Breakdown.
   - Day 4: 24-Hour Urgency Notice.
   - Day 5: Final Call (Sent Morning & 4 Hours Before Midnight Close).

---

### Phase 6: Production QA, Deliverability Audit & Automated Validation
*Reference: [workflows/06-email-testing-and-qa.md](workflows/06-email-testing-and-qa.md) & [quality/spam-trigger-words-blacklist.md](quality/spam-trigger-words-blacklist.md)*

1. **Spam Audit**: Verify 0 high-risk urgency/financial spam words.
2. **Link Restraint**: Maximum 1 link or 0 links in cold Step 1; contextual links in newsletters.
3. **Responsive Mobile & Dark Mode**:
   - Clean rendering on 320px–420px viewports; body font ≥16px; tap targets ≥44px.
4. **Automated Verification Script**:
   Run the zero-dependency verification CLI:
   ```bash
   node .agent/skills/email-marketing/scripts/validate-email-campaign.mjs emails/<campaign-slug>
   ```

---

## 4. Non-Negotiable Email Copywriting Laws

1. **Never pitch 30-minute meetings in cold emails**: Always use permission-based micro-commitments (*"Worth a 2-minute glance?", "Opposed to me sending a 90-second video walkthrough?"*).
2. **Subject lines must look human**: 2–5 words, lowercase or sentence case. No exclamation marks, no ALL CAPS, no emojis in cold outreach.
3. **The Mobile Preview Rule**: The first 12 words of your email will be previewed on smartphones. Ensure those 12 words focus on the recipient, not on you.
4. **Zero Naked URLs**: Never insert raw URLs (`http://...`) that mismatch the anchor text.
5. **Always provide clean opt-outs**: CAN-SPAM, GDPR, and CASL compliance are mandatory.
