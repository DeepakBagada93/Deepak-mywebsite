# Research dossier — n8n Production Hardening Pack

Access date: **2026-10-18**. Policy: `.agent/config/research-policy.md`.

## 1. Opportunity

n8n template packs are a commodity: bundles of ready-made JSON sell for $2–$47, so reselling templates is a race to the bottom. The unmet need is the layer above templates — **will this workflow survive production?** Exported workflows commonly ship without error workflows, retries, timeouts, authentication, or duplicate guards, and often contain pinned customer data or inline keys.

## 2. Paid-ad verification — attempted, not achieved

| Source | Attempt | Result |
| --- | --- | --- |
| Meta Ad Library | Automated active-ad fetch for "n8n template" (US) | HTTP 403 client challenge |
| Google Ads Transparency Center | Automated query page for "n8n" | No extractable ad rows (JS application) |

**No ad-longevity claim is made anywhere in this product.** The ">30 days of paid ads" signal was not verified.

## 3. Verified market anchors

| Source | Observation | Date | Type |
| --- | --- | --- | --- |
| `etsy.com/market/n8n_automation_templates` | "4000+ n8n Automation Templates Mega Bundle … **$2.00**" | Accessed 2026-10-18 | Direct (snippet) |
| YouTube review of a "$47" 2,000-template bundle | Template bundles are sold at volume, low price | 1 year old | Direct (search snippet) |
| `usamaakrm.gumroad.com/l/100-premium-n8n-templates` | "100+ Premium n8n Templates (Worth $1000+)" listing exists; price not extractable | Accessed 2026-10-18 | Listing exists, price **unverified** |
| `faressal.gumroad.com/l/AIResearchAgent` | Single-purpose "AI Research Agent — N8N Workflow Template" listing exists | Accessed 2026-10-18 | Listing exists, price **unverified** |
| `n8n.io/workflows` | Official template library is free and large (e.g., a Gumroad CRM template with 27 ratings) | Accessed 2026-10-18 | Direct |
| `implo.ai` (2026-03-24) | Automation templates sell at $49–$149 when they promise a specific outcome | 2026-03-24 | Direct (snippet) |

**Interpretation (hypothesis):** buyers will not pay for more templates when the official library is free, but will pay for a *review-and-repair* tool tied to production risk. Price band **$59–$149**.

## 4. Demand signals

| Signal | Type | Relevance |
| --- | --- | --- |
| "How I automated my entire Gumroad business with n8n — and what I learned" (dev.to, 2026-05-12) | Direct (snippet) | Practitioners run business-critical workflows, not demos |
| n8n workflow reviews/ratings on official templates (e.g., 4.6/5, 27 ratings) | Direct | Users evaluate reliability, not just existence |
| YouTube "I bought 2,000 n8n templates for $47" review | Direct (snippet) | Buyers are actively testing cheap bundles and finding them lacking |
| Freelancer/agency content on selling n8n builds | Direct (snippet) | Agencies ship client workflows and carry the support burden |

No sales volume, revenue, or customer count is claimed for any competitor.

## 5. Buyer

| Persona | Pain | Willingness to pay |
| --- | --- | --- |
| Automation freelancer | Client workflow breaks silently; support call is unpaid | $59–$99 |
| Small agency | Ships n8n to SMB clients without a QA gate | $149–$249 |
| Ops lead in a small company | Depends on one workflow for revenue ops; no error visibility | $99–$199 |

## 6. Competitive gaps

| Alternative | Gap |
| --- | --- |
| Free template library | Templates, not audits; no CI gate |
| $2–$47 bundles | Volume; reliability unknown; often include pinned data and inline keys |
| n8n's own error handling docs | Correct but manual; no automated gate |
| Generic JSON linters | Do not understand node semantics, credentials, or triggers |

## 7. Positioning

> "Your template bundle gave you a workflow. It did not give you error handling, retries, auth, or a duplicate guard."

Claim, testable on the shipped fixture: **12 findings on an unsafe workflow (score 21/100), 3 safe patches on a half-hardened one (85 → 100), and a strict gate that fails the unsafe file and passes the hardened one.**

## 8. Confidence and next experiment

| Claim | Confidence | Basis |
| --- | --- | --- |
| Template bundles are commoditized | High | $2 and $47 price points |
| Production reliability is an unmet need | Medium | Supply is templates; audits are absent |
| Buyers will pay $59+ for this | Medium-low | No direct price anchor for an n8n *auditor* |
| Paid ads are profitable in this niche | **Unverified** | Ad Library inaccessible |

Cheapest experiment: publish the audit script as a free "n8n workflow health check" and measure how many downloads come from agencies within 14 days. Fewer than 50 downloads → demand is weaker than the pain suggests.
