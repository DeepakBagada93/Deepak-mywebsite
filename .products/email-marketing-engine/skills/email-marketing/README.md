# Email Marketing & Cold Outreach Engine

A comprehensive, production-grade email marketing system engineered to build high-converting cold outbound prospecting sequences, automated lifecycle & retention flows, editorial newsletters, and promotional launch campaigns for any business.

---

## Capabilities

- **Deep Audience & ICP Research**: Uncovers firmographics, buyer psychology, daily friction, competitor swipe files, and high-intent buying triggers (hiring surges, tech migrations, funding rounds).
- **Deliverability & Technical Infrastructure**: Comprehensive DNS setup guides (SPF, DKIM, DMARC, BIMI, CNAME tracking), mailbox rotation configurations, and warmup schedules adhering to Google and Yahoo 2024+ sender mandates.
- **B2B Cold Outreach Engine**: 4-sentence cold outreach architecture (50–85 words), multi-touch 5-step threaded follow-up sequences, interest-based soft CTAs, and dynamic token fallbacks (`{{first_name|there}}`).
- **Lifecycle & Retention Flows**: Automated triggers for Welcome & Onboarding (5 emails), Abandoned Checkout/Cart (3 emails), Post-Purchase Delight (4 emails), and Customer Win-Back (3 emails).
- **Editorial Newsletters & Launch Campaigns**: Story → Lesson → Offer (SLO) weekly newsletter frameworks and 5-day promotional product launch campaigns.
- **Copywriting Vault & QA Rubrics**: High-open subject lines, preview text pairings, spam trigger word filters, and 100-point quality rubrics.
- **Automated Validation CLI**: Zero-dependency validation script verifying file completeness, spam score, token syntax, and sequence depth.

---

## Directory Structure

```
.agent/skills/email-marketing/
├── SKILL.md                                 # Master skill instructions and triggering rules
├── README.md                                # Skill overview and usage guide
├── COMPATIBILITY.md                         # Platform, ESP, and LLM compatibility specifications
├── config/
│   ├── deliverability-and-dns-standards.md  # SPF, DKIM, DMARC, BIMI, and sending limits
│   └── esp-platform-blueprints.md           # Klaviyo, Instantly, Smartlead, Loops, Resend setups
├── quality/
│   ├── spam-trigger-words-blacklist.md      # 300+ flagged spam terms and safe alternatives
│   ├── deliverability-checklist.md          # 15-point pre-send verification checklist
│   ├── cold-email-rubric.md                 # 100-point rubric for cold outbound sequences
│   └── lifecycle-email-rubric.md            # 100-point rubric for inbound/retention flows
├── templates/
│   ├── 01-audience-icp-research.template.md
│   ├── 02-deliverability-infrastructure.template.md
│   ├── 03-cold-email-sequence.template.md
│   ├── 04-lifecycle-nurture-flows.template.md
│   ├── 05-promotional-and-newsletter.template.md
│   ├── 06-subject-line-copy-vault.template.md
│   ├── 07-production-qa.template.md
│   └── responsive-html-email.template.html  # Mobile-responsive, dark-mode bulletproof HTML
├── workflows/
│   ├── 01-audience-and-icp-research.md
│   ├── 02-cold-outreach-engineering.md
│   ├── 03-lifecycle-and-retention-flows.md
│   ├── 04-promotional-and-editorial-newsletters.md
│   ├── 05-deliverability-and-domain-warmup.md
│   └── 06-email-testing-and-qa.md
├── scripts/
│   └── validate-email-campaign.mjs          # Campaign audit & validation script
└── examples/
    └── b2b-saas-cold-outreach/              # Complete reference campaign
```

---

## Quick Start: Generating an Email Campaign

### 1. Trigger the Skill
To build an email marketing campaign for any business or offer, invoke the skill:
```text
Build a complete email marketing pack for [Product / Business Name].
Target audience: [Target B2B ICP or B2C Persona]
Core offer / value: [What result or solution does it provide?]
```

### 2. Output Artifacts
The skill creates deterministic files inside `emails/<campaign-slug>/`:
```
emails/<campaign-slug>/
├── 01-audience-and-icp-research.md
├── 02-deliverability-and-infrastructure.md
├── 03-cold-email-sequences.md
├── 04-lifecycle-and-nurture-flows.md
├── 05-promotional-and-newsletter-campaigns.md
├── 06-subject-line-and-copy-vault.md
├── 07-email-production-qa.md
└── email-campaign-delivery.json
```

### 3. Run Automated Campaign Validation
Verify the campaign package using the built-in validator:
```bash
node .agent/skills/email-marketing/scripts/validate-email-campaign.mjs emails/<campaign-slug>
```
