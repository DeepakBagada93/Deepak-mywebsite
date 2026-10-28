# Developer B2B Distribution Engine
## Customer Tutorial & Outbound Implementation Guide

Welcome to the **Developer B2B Distribution Engine**! This guide takes you step-by-step through setting up, finding high-intent prospects, running hyper-personalized 4-sentence outreach, and closing high-ticket client contracts ($5,000 – $30,000 or ₹3,00,000 – ₹15,00,000).

---

## 1. 3-Minute Quickstart

### Step 1: Run the Standalone Intent Scorer
You can run the included intent scorer tool locally without external APIs:

```bash
node scripts/intent-scraper.mjs examples/agency-pitch-pack/raw-lead-data.json
```

The tool parses your prospect list, evaluates hiring signals and tech stack triggers, assigns an Intent Score (0–100), and outputs the exact personalized angle to use in your pitch.

### Step 2: Activate the AI Agent Skill
Copy `skills/b2b-distribution-engine/` into your agent environment (`.agent/skills/` for Antigravity, or append to `CLAUDE.md` / `.cursorrules`).

Prompt your agent:
> *"Act as the Developer B2B Distribution Engine. Using this company brief [insert URL], generate a personalized 4-touch cold sequence and a 3-minute Loom audit script."*

---

## 2. Multi-Client Installation

- **Google Antigravity:** Copy `skills/b2b-distribution-engine/` into `.agent/skills/`.
- **Anthropic Claude Code:** Reference in `CLAUDE.md`.
- **Cursor IDE:** Import into `.cursorrules` or `.cursor/rules/b2b-distribution.mdc`.
- **OpenAI CLI:** Provide `SKILL.md` as system prompt instructions.

---

## 3. High-Converting Prompt Recipes

### Recipe 1: Personalized Outbound Sequence from Job Post
```
Here is a link / text of a company's open job posting: [insert job post].
1. Identify the core business bottleneck that is causing this role to be opened.
2. Draft a 4-sentence cold outreach email to the VP of Engineering using the Observation & Value Asset formula.
3. Keep it under 100 words with a soft, frictionless CTA.
```

### Recipe 2: 3-Minute Technical Video (Loom) Script
```
Here is the URL of a prospect company: [insert website].
Draft a 3-minute technical audit Loom script:
- 0:00 - 0:45: Point out a specific observable technical or UX bottleneck without being condescending.
- 0:45 - 2:00: Present the exact architectural blueprint to fix it.
- 2:00 - 2:45: Low-pressure invitation to walk their lead developer through the code.
```

### Recipe 3: Fixed-Price Risk-Reversal Proposal
```
Here is the scope of work agreed upon during our discovery call: [insert scope].
Generate a structured, fixed-scope proposal with:
- 3 tangible milestone deliverables with objective acceptance tests.
- 50/50 payment milestone schedule.
- 100% money-back risk reversal guarantee on milestone 1.
```

---

## 4. Troubleshooting & FAQs

#### Q: How many emails should I send per day?
**A:** Because this engine uses high-intent personalization and custom Loom audits, send **15 to 25 highly targeted emails per day** rather than blasting 1,000 generic spam emails. Typical reply rates on this formula range from 18% to 32%.

#### Q: Who should I target inside the prospective company?
**A:** For companies with 10–50 employees, target the **Founder, CEO, or CTO**. For companies with 50–250 employees, target the **VP of Engineering or Head of Product**.
