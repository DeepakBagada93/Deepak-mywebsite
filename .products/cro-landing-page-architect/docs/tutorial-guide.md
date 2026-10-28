# CRO Landing Page Architect
## Customer Tutorial & Conversion Optimization Guide

Welcome to the **CRO Landing Page Architect**! This guide takes you step-by-step through auditing your landing page, rewriting technical jargon into high-converting value propositions, and deploying responsive Tailwind CSS UI blocks.

---

## 1. 3-Minute Quickstart

### Step 1: Run the Standalone CRO Scanner
Run the included scanner CLI against your landing page file:

```bash
node scripts/cro-audit.mjs examples/saas-landing-page/high-converting-hero.html
```

The tool audits 10 critical conversion dimensions and outputs your Conversion Score (0–100%) and a list of failed dimensions.

### Step 2: Activate the AI Agent Skill
Copy `skills/cro-architect/` into `.agent/skills/` (for Antigravity) or append to `CLAUDE.md` / `.cursorrules`.

Prompt your agent:
> *"Act as the CRO Landing Page Architect. Audit my landing page [insert text or URL] and rewrite the hero headline, feature grid, and FAQ for maximum conversion."*

---

## 2. The 10 Conversion Dimensions Audited

1. **Outcome-Driven Headline**: Contains numbers, timeframes, or specific ROI promises.
2. **High-Intent Action CTA**: Value-oriented verb phrase (never generic "Submit").
3. **Social Proof & Evidence**: User counts, logos, and testimonials.
4. **Objection-Neutralizing FAQ**: Addresses tech-stack, security, and setup concerns.
5. **Risk-Reversal Guarantee**: 30-day money-back guarantee or trial terms.
6. **Transparent Pricing**: Clear tiers without hidden surprises.
7. **Feature-to-Benefit Bridges**: "So that you can..." connective phrasing.
8. **Visual Proof / Demo**: App screenshot or interactive sandbox.
9. **Subheading Problem Stating**: Acknowledges user friction.
10. **Zero Fluff**: Clean, authentic, non-generic copy.

---

## 3. High-Converting Prompt Recipes

### Recipe 1: 3-Part Hero Headline Rewrite
```
Here is my current product description: [insert description].
Rewrite this into 3 high-converting hero headlines following the formula:
- Negative hook + Measurable transformation + Without-clause.
```

### Recipe 2: Objection-Killing FAQ Generator
```
Here are the common doubts customers have about my product: [insert doubts].
Generate a 4-question FAQ accordion section that neutralizes each objection completely.
```

---

## 4. Troubleshooting & FAQs

#### Q: Will higher conversion copy feel "salesy" to developers?
**A:** No. Developers hate hype and empty buzzwords ("The future of synergy"), but love **specific technical outcomes** ("Cut build times by 40% in Next.js 15"). The Sentinel enforces technical honesty while eliminating ambiguity.
