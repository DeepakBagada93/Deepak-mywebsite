# Research dossier — AI Agency Delivery OS

Access date: **2026-10-18**. Policy: `.agent/config/research-policy.md`.

## 1. Opportunity

Small AI/software agencies sell $3k–$15k builds with almost no process: scope lives in email, "done" is a feeling, and every engagement reinvents its documents. The gap is a **guarded delivery system** — intake that refuses vagueness, phase artifacts that must exist, a permissions boundary, and a gate before anything reaches a client.

## 2. Paid-ad verification — attempted, not achieved

| Source | Attempt | Result |
| --- | --- | --- |
| Meta Ad Library | Automated active-ad search for "AI agency" | HTTP 403 client challenge |
| Google Ads Transparency Center | Automated query | No extractable ad rows (JS application) |

**No ad-longevity claim is made.** The $199–$999 price is a hypothesis, not ad-validated.

## 3. Verified price anchors

| Source | Observation | Date | Type |
| --- | --- | --- | --- |
| `authority.md` guide | Individual skills around $29; higher tiers for team/agency use | 2026-09-22 | Direct |
| `implo.ai` | Agent templates $49–$149 | 2026-03-24 | Direct (snippet) |
| `huntinghydra.com/ai-marketplace` | "31 skills … for **$29 a month**" B2B positioning | Accessed 2026-10-18 | Direct (snippet) |
| `etsy.com` bundles | $15 for 2,500 skills (commodity floor) | Accessed 2026-10-18 | Direct (snippet) |

**Interpretation (hypothesis):** document-only kits are commoditized; a *process system with gates* can support $199+ for agencies because one prevented scope dispute pays for it.

## 4. Demand signals

| Signal | Type | Relevance |
| --- | --- | --- |
| Agencies publicly selling AI automation builds in the $3k–$15k range | Indirect | Process failures are expensive at that ticket size |
| "Scope creep" and "client handoff" recurring agency topics | Indirect | The pain is operational, not technical |
| No-code/AI agency courses and templates marketed heavily | Indirect | Buyers already pay for agency operating content |
| Free Notion templates for agency process | Direct | Demand exists; free options lack validation and gates |

No sales volume or revenue is claimed for competitors.

## 5. Buyer

| Persona | Pain | Willingness to pay |
| --- | --- | --- |
| Solo AI consultant | Every engagement is ad hoc; proposals take a day | $199–$299 |
| 2–10 person studio | Inconsistent scope and handoffs; no shared gate | $499–$999 |
| Agency owner | Margin leaks from unpaid scope | $999 (team) |

## 6. Competitive gaps

| Alternative | Gap |
| --- | --- |
| Notion/Airtable templates | Manual; no validation, no gates, no state machine |
| PM tools (Linear, Asana) | Track tasks, not scope integrity or permissions |
| Agency courses | Teach process; do not enforce it |
| Legal templates | Contracts without operational artifacts |

## 7. Positioning

> "Your engagement is not a folder of documents. It is a state machine that refuses to advance until the phase is actually done."

Testable on the shipped workspace: a vague intake is rejected with five named gaps; a `TBD` blocks advancement; the full chain runs `scoped → handoff` with a clean audit; removing the success metric from QA fails the gate.

## 8. Confidence and next experiment

| Claim | Confidence | Basis |
| --- | --- | --- |
| Agencies lose money to scope creep | High | Well-documented operational pain |
| Buyers pay $199+ for a gated system | Medium-low | No direct anchor at that price for a document system |
| Paid ads are profitable here | **Unverified** | Ad Library inaccessible |

Cheapest experiment: deliver the intake validator free as a lead magnet ("score your client intake in 60 seconds") and measure requests for the full workspace over 14 days.
