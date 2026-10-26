# Product Specification: Global Client Hunter OS

## 1. Product Identity
* **Name**: Global Client Hunter OS
* **Slug**: `global-client-hunter-os`
* **Version**: 1.0.0
* **Category**: `ai-skill-bundle`
* **Primary Host Platforms**: Google Antigravity, Claude Code, Cursor, Codex

---

## 2. System Architecture & Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GLOBAL CLIENT HUNTER OS                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Prospect Ingestion (URL, LinkedIn summary, job posting, stack)      │
│                                ↓                                       │
│ 2. ICP Friction Audit (identifies technical bottleneck, velocity drag) │
│                                ↓                                       │
│ 3. 3-Touch Cold Outreach Crafter (Teardown, Hiring Relief, Case Study) │
│                                ↓                                       │
│ 4. Executive Scope & Proposal Architect (3-tier milestone pricing)     │
│                                ↓                                       │
│ 5. Cross-Border Onboarding & Export Compliance Guidance (LUT & rails)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Input & Output Contracts

### Input Schema (User Prompt)
```json
{
  "prospect": {
    "name": "Acme SaaS Inc.",
    "url": "https://acmesaas.io",
    "persona": "CTO / Head of Engineering",
    "hiringRole": "Senior Full-Stack Engineer (Next.js & Supabase)",
    "observations": "Homepage has 4.2s LCP on mobile; auth redirect occasionally hangs."
  },
  "seller": {
    "specialty": "Next.js 15, React Server Components, Supabase, Edge Performance",
    "proofMetric": "Reduced API latency by 68% for Series A health-tech SaaS",
    "targetSprintPrice": 4500
  }
}
```

### Output Deliverables
1. **Friction Analysis Summary**: 3 concrete bullet points highlighting business impact.
2. **Cold Outreach Set (3 Variants)**:
   - Variant A (Direct Teardown / Fix)
   - Variant B (Hiring Queue Relief)
   - Variant C (Proven Case Study Pattern)
   - Includes 2 follow-up bumps (Day 4 and Day 8).
3. **Formal Sprint Proposal**:
   - Scope breakdown with Week 1–3 milestones.
   - Tiered pricing ($2,500 / $4,500 / $7,500).
   - SLA guarantees and payment terms.
4. **Cross-Border Financial Protocol**:
   - Client invoice recommendations (Stripe/Wise).
   - Export of services declaration note (Section 16 IGST Act, LUT).

---

## 4. Quality & Safety Constraints

- **Strict Negative Constraints**:
  - NO robotic greetings ("Dear respected sir", "Hope you are doing fine").
  - NO unsubstantiated claims ("We are India's #1 web development team").
  - NO vague pricing ("Rate is negotiable"). Pricing must always be firm, transparent, and structured around deliverables.
