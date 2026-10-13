# US-50 Email Proposal — Deepak Newsletter (deepak-newsletter v1.0)

**Date:** 2026-09-26
**Batch:** `US-50-PROPOSED` (NOT SENT — proposal only)
**Leads file:** `.agent/skills/deepak-newsletter/leads-50-us.json` (50 US contacts)
**From:** Deepak Bagada <ceo@saasnext.in> / Reply-To: ceo@saasnext.in
**Regions:** SF Bay, NYC, Austin/TX, Seattle, Boston, Chicago, Miami/FL, Denver/LA/GA/WY
**Niches:** Autonomous Agents (30), Enterprise RAG (9), MCP Tooling (4), Modern Web (7)
**Compliance:** CAN-SPAM + GDPR — physical address + {{UNSUBSCRIBE_URL}} in every send

> Anti-duplication: all 50 checked against `leads-30.json` (10 prior US emails). Zero overlaps.
> Prior US suppressed: info@microcis.net, info@aisuperior.com, contact@ichelonconsulting.com, nyc@kiwisoftservices.com, austin@kiwisoftservices.com, info@innowise.us, info@aibyneoteric.com, info@markovate.com, sales@leewayhertz.com, reception@10clouds.com

---

## 1. Segmentation (send in 5 x 10, 2–4s throttle, <2% bounce target)

| Split | IDs | Hubs | Core hook |
|---|---|---|---|
| S1 Bay Area | US-001–US-011 (pick 10) | SF / Menlo Park | Token burn + P95 latency, OPA guardrails |
| S2 NYC / Boston | US-012–US-020 + US-032–US-034 | NYC, Brooklyn, Boston | Ship velocity, eval harnesses, HIPAA/SOC2 |
| S3 Texas | US-021–US-031 + US-046 + US-049 | Austin, Frisco, Round Rock, Sheridan | Eval + cost engineering, n8n/WhatsApp ops |
| S4 Seattle / Chicago | US-029, US-035–US-039 | Seattle, Chicago | Readiness audits, ECM/RAG grounding |
| S5 Sunbelt / West | US-040–US-045, US-047–US-048, US-050 | Miami, Canton GA, Denver, Valencia CA | 2–6 week ships, voice agents, SMB automation |

Verification mix: 47x `public-website-verified`, 2x `public-linkedin-proposed` (US-047/048), 1x `pattern-proposed-needs-verification` (US-034). Verify US-034 + US-047/048 with `check-recipient.php` + inbox test before Batch 1.

---

## 2. Subject lines (A/B, 40–58 chars, mobile-optimized)

Primary (recommended):
- `// [Blueprint] 62 tok/s local RAG cuts $40K burn` (47 chars)

Variants:
- `[MCP Teardown] 60% faster tools for Claude + GPT` (47 chars)
- `Why agent swarms die at 200 calls/day — fix inside` (49 chars)

Rules enforced: no ALL CAPS, no spam triggers, includes `//` / `[Blueprint]` / metrics per SKILL.md §3.

---

## 3. EMAIL 1 — Initial Dispatch (Day 0, PROPOSED, not sent)

**Subject:** `// [Blueprint] 62 tok/s local RAG cuts $40K burn`

**Body (HTML + text, <50% links, {{UNSUBSCRIBE_URL}} required):**

> Hey — Deepak here, founder building production AI agents from Junagadh, India.
>
> Last month I watched a US voice-agent team burn $40K/mo on cloud tokens for 200+ calls/day — same loop I see in SF, Austin and NYC builds: brittle prompt chains, no tool timeouts, vector search without RRF.
>
> The reality: most multi-agent swarms don't fail on models. They fail on orchestration — no OPA policy gate, no typed Pydantic tool schemas, no HITL checkpoint before refunds/charges.
>
> Here's the governed stack I ship (Laravel 12 + Next.js + LangGraph):
>
> ```
> user -> orchestrator -> [retriever: BM25 + pgvector + RRF]
>       -> tool_gate (OPA: allow/deny) -> executor (PydanticAI)
>       -> HITL if confidence < 0.82 -> audit_log
> ```
>
> Numbers from my bench (Pi 5 + Ollama vs cloud):
> - Local RAG: 62 tok/s, 42ms P95 retrieval, ~$0/query
> - GPT-4o-mini: ~$0.0002/q | Claude 3.7: ~$0.005/q | GPT-4.1: ~$0.007/q
> - Hybrid BM25 + pgvector + rerank: +31% recall on support docs
> - MCP schema shrink (SEP-2640 style): -60% tool latency
>
> Full teardown + runnable 10-line FastAPI MCP pattern is in my open library: https://deepakbagada.in/library
>
> Quick question to earn your reply: how are you handling tool timeout fallbacks in your agent loop right now? Hit reply — I read every response.
>
> — Deepak Bagada, Junagadh, Gujarat 362001, India
> ceo@saasnext.in | https://deepakbagada.in
> Unsubscribe one-click: {{UNSUBSCRIBE_URL}}

Personalization tokens per lead: `{{Company}}` + `{{Angle}}` from leads-50-us.json (e.g. Titan AI → autonomy loop; FoxyAI → property-data RAG; Proven ROI → prospecting audit trails).

---

## 4. EMAIL 2 — Follow-up #1 (Day 4, 3 sentences + value)

**Subject:** `Quick follow-up on agent guardrails — Deepak` (43 chars)

> Hey {{Name}} — following up on the local-RAG / OPA teardown from Friday.
>
> Did you get a chance to test OPA gates for tool execution? I just published live P95 + cost benchmarks at deepakbagada.in/library — {{Angle}}.
>
> Worth a 15-min teardown of your loop? Reply with your stack and I'll send 2 specific fixes. Unsubscribe: {{UNSUBSCRIBE_URL}}
>
> — Deepak, Junagadh, Gujarat, India | ceo@saasnext.in

---

## 5. EMAIL 3 — Break-up / value-add (Day 9, last touch)

**Subject:** `Closing the loop — free MCP checklist inside` (44 chars)

> Hey {{Name}} — closing the loop so I don't clutter your inbox.
>
> Leaving you the 1-page MCP tool checklist I use (schema shrink, timeouts, HITL thresholds, eval harness): deepakbagada.in/library — no opt-in.
>
> If {{Company}} ever wants a second pair of eyes on latency or token burn, just reply. Otherwise wishing you clean deploys.
>
> — Deepak Bagada, Junagadh, Gujarat 362001, India | Unsubscribe: {{UNSUBSCRIBE_URL}}

---

## 6. Per-lead hook table (first 10 shown, full angles in JSON)

| ID | Company | Email | Hook to inject |
|---|---|---|---|
| US-001 | Agent Matrix | hello@agentmatrix.tech | OPA + HITL for enterprise demos |
| US-003 | Agintex | contact@agintex.com | LangGraph vs CrewAI prod tradeoffs |
| US-006 | Titan AI | sales@titan.ai | Perception-planning-sim reliability |
| US-010 | PolyAI | sales@poly.ai | Voice P95 + $/call |
| US-015 | IDT Partners | info@idtpartners.com | Boutique ship velocity NYC |
| US-023 | Codestreaks | hello@codestreaks.com | Evals + cost eng Austin |
| US-029 | Aiinfox | sales@aiinfox.com | Typed tools + memory Seattle |
| US-032 | Zapata AI | bd@zapata.ai | Industrial Orquestra Boston |
| US-035 | ChicagoAI | brian@chicagoai.com | Honest scoping audit |
| US-042 | Intellectyx | hello@intellectyx.ai | Denver/LA aligned builds |

Full 50 angles: see `leads-50-us.json` → `.angle` field.

---

## 7. Send plan (proposal — DO NOT SEND without approval)

1. `php .agent/skills/deepak-newsletter/scripts/check-recipient.php "<email>"` for all 50 (DB pre-check).
2. `node .agent/skills/deepak-newsletter/scripts/audit-dispatch.mjs --subject="..." --body="draft.html"` — must PASS (0 issues).
3. 5 batches x 10, Brevo SMTP, 2–4s random throttle, Reply-To ceo@saasnext.in.
4. Upsert `subscribers` with source `outreach_us_50_2026`.
5. Log to `memory.md` as BATCH-US-50 + `us-50-followups.json`, follow-ups due +4 business days.
6. Monitor: bounce <2%, complaints <0.1%, primary KPI = replies.

## 8. Audit status (2026-09-26)

- Subject lengths: 47 / 47 / 49 / 43 / 44 chars — all within 35–65.
- Spam scan: run `audit-dispatch.mjs` before send — drafts contain `unsubscribe`, `Deepak Bagada`, `Gujarat/India`, tech terms (agent/mcp/rag/latency/benchmark).
- No send executed in this proposal. Awaiting user approval to dispatch.

---
*Stored in `.agent/skills/deepak-newsletter/` per request. Next: approve → verify inboxes → dispatch S1 (10).*
