# Research dossier — Agent Context Architect

Access date for all sources: **2026-10-18**. Research policy applied: `.agent/config/research-policy.md` (no fabricated demand, pricing, or ad claims).

## 1. Opportunity statement

Developers using AI coding agents accumulate multiple instruction files (`CLAUDE.md`, `AGENTS.md`, `.cursor/rules/*`, client-specific rule files) that duplicate, contradict, and grow without a budget. The agent loads them every session, spends tokens on stale or contradictory rules, and then ignores them under context pressure. The buyer does not need another prompt pack; they need the existing context **measured, de-duplicated, restructured, and gated**.

## 2. Paid-ad verification — attempted, not achieved

| Source | Attempt | Result | Conclusion |
| --- | --- | --- | --- |
| Meta Ad Library (`facebook.com/ads/library`) | Automated fetch of an active-ad search for "claude code" (US) | HTTP 403 client challenge | **No ad data obtained.** No ad-longevity claim is made. |
| Google Ads Transparency Center (`adstransparency.google.com`) | Automated fetch of a query page for "n8n" (US) | Response exceeded the extractor's size limit; page is a JS application with no extractable ad rows | **No ad data obtained.** No ad-longevity claim is made. |

This is a real limitation, not a formality. The "ads running >30 days" signal in `ACTIVATE.md` is unverified for this product, and the product makes no claim that paid advertisers are currently spending on this category. Any future claim must come from a manual, logged Ad Library session.

## 3. Verified pricing anchors

| Source (URL) | Observation | Date on source | Evidence type |
| --- | --- | --- | --- |
| `https://www.agensi.io/claude-marketplace` | "GEO SEO Suite" listed at **$29.99**; marketplace header claims 11,500+ skills, free and paid | Accessed 2026-10-18 | Direct (page text) |
| `https://authority.md/guides/best-places-to-buy-claude-skills` | "Most individual skills are **$29**" | 2026-09-22 | Direct (search snippet + page) |
| `https://clskillshub.com/skills` | "$19 lifetime unlocks 845 … skills" | 2026-05-02 | Direct (search snippet) |
| `https://www.etsy.com/market/claude_skills_business` | "Claude SMALL BUSINESS Bundle \| 2,500+ Skills … **$15.00**" | Accessed 2026-10-18 | Direct (search snippet) |
| `https://www.etsy.com/market/n8n_automation_templates` | "4000+ n8n Automation Templates Mega Bundle … **$2.00**" | Accessed 2026-10-18 | Direct (search snippet) |
| `https://implo.ai/how-to-sell-ai-prompts-online/` | Prompt packs command **$29–$69**; agent templates **$49–$149** | 2026-03-24 | Direct (search snippet) |
| `https://usamaakrm.gumroad.com/l/100-premium-n8n-templates` | "100+ Premium n8n Templates (Worth $1000+)" — Gumroad listing exists; price not extractable (JS-rendered) | Accessed 2026-10-18 | Listing exists; price **unverified** |
| `https://faressal.gumroad.com/l/AIResearchAgent` | "AI Research Agent — N8N Workflow Template" listing exists; price not extractable | Accessed 2026-10-18 | Listing exists; price **unverified** |

**Interpretation (hypothesis, not fact):** list-style bundles are commoditized below $20, while individual *systems* with a specific outcome are listed around $29–$79. The defensible price band for this product is therefore **$39–$79**, with a team tier at **$129–$149**.

## 4. Organic demand signals

| Signal | Source | Evidence type | What it suggests |
| --- | --- | --- | --- |
| "AGENTS.md file is costing you $100+ in API fees" | Reddit r/ClaudeCode thread (search snippet, thread not opened) | Indirect | Buyers already connect context bloat to money |
| "claude.md doesn't scale. built a memory agent for…" | Reddit r/ClaudeCode (search snippet) | Indirect | Practitioners are building their own fixes → tooling gap |
| "Before you add more agents, fix your CLAUDE.md" | Reddit r/ClaudeAI (search snippet) | Indirect | Advice market exists; no deterministic product |
| "I got tired of being the human middleware between my AI…" | Reddit r/ClaudeAI (search snippet) | Indirect | Re-explaining context is a felt, recurring pain |
| "How are you centralizing knowledge and context from AI…" | Reddit r/AI_Agents, ~3 weeks before access | Indirect | Active, unresolved question |
| "PMB — Stop re-explaining your project to AI coding agents" | Product Hunt weekly leaderboard (promoted) | Direct (listing) | A paid product is being promoted on exactly this pain |
| "Skills for Agents" / "Skills Marketplace by Databox" | Product Hunt launches | Direct (listing) | Skills distribution is normalizing; buyers understand the format |
| Anthropic, "Effective context engineering for AI agents" | anthropic.com/engineering | Direct | Category vocabulary is vendor-endorsed |
| 8-tool comparison of context engineering tools | mintlify.com/library (2026-09-07) | Direct (search snippet) | Tooling category is crowded at the *platform* layer, not at the *repo context file* layer |

**What is not evidenced:** any verified sales volume, revenue figure, or customer count for competing products. None is claimed.

## 5. Target buyer

| Persona | Situation | Willingness to pay |
| --- | --- | --- |
| Solo developer / indie hacker | 3–4 AI clients, rules copied between them, 500–2,000-token rules file | $29–$49 one-time |
| Small product team (3–15 devs) | Shared `CLAUDE.md` edited by everyone, drift every sprint | $79–$149 with team seats |
| Agency / consultant | Repeatedly onboards client repos; needs a repeatable context setup and a CI gate | $149–$299 with client-use rights |

## 6. Competitor gaps

| Alternative | Gap this product exploits |
| --- | --- |
| Free "awesome skills" collections | No audit, no budget, no verification; they add rules rather than reduce them |
| $15–$19 mega-bundles | Volume of prompts; nothing measures or gates a specific repository |
| Agent memory platforms (Zep, Recallium, etc.) | Runtime memory, not static repo context; requires a service and ongoing cost |
| Hand-written `CLAUDE.md` advice threads | Non-deterministic; no artifact, no CI, no before/after measurement |
| Linters (markdownlint, etc.) | Check Markdown syntax, not rule conflicts, token budgets, or stale commands |

## 7. Positioning derived from the evidence

> "Your agent is not ignoring your rules. It is drowning in them."

The product's claim is deliberately narrow and testable: **reduce always-on context from N estimated tokens to a budgeted kernel, eliminate critical rule conflicts, and gate it in CI** — demonstrated on a fixture (1,011 → 278 estimated tokens; four conflicts resolved; verification passing).

## 8. Confidence and next validation experiment

| Claim | Confidence | Basis |
| --- | --- | --- |
| Buyers pay $29–$79 for outcome-specific developer skills | Medium | Three independent price listings |
| Context bloat is a felt, recurring pain | Medium-high | Multiple practitioner reports + promoted competitor |
| This product's tooling works on a JS/TS repo | High | Executed tests (see `test-results.md`) |
| Paid ads are profitably running for this category | **Unverified** | Ad Library inaccessible to automated fetch |
| This product will convert at a specific rate | **Unverified** | No traffic or sales data exists |

Cheapest next experiment: publish the audit script alone as a free lead magnet on the store page, measure downloads → paid conversion over 14 days. If fewer than 2% of downloaders buy, reposition before building additional tiers.
