# Store listing — AI Agency Delivery OS

**Price:** $199 Solo / $499 Studio / $999 Agency
**Format:** instant download, `agency-delivery-os-1.0.0.zip`

---

## Headline

> **Your engagement is not a folder of documents. It is a state machine.**
> It refuses to advance until the phase is actually done.

**Subhead:** One intake produces ten artifacts — brief, scope with exclusions, risk register, permissions boundary, proposal, delivery plan, QA gates, handoff. Vague intakes are rejected with named gaps; `TBD` blocks advancement; the gate fails before anything reaches a client.

---

## The problem

Agency work leaks money in the gaps between documents:

- The intake call had no budget, no named decision maker, and no measurable success metric — but work started anyway.
- "Out of scope" was never written down, so the third revision was free.
- The proposal quoted one number; the plan assumed another.
- QA checked "looks good", not the metric the client actually bought.
- Handoff was a Slack message and a repo link.

Every one of those is a process failure, not a talent failure. And at $3k–$15k per engagement, one prevented dispute pays for the system.

## What it does

1. **Refuses vague intake** — budget ≥ $500, a named decision maker, a measurable metric, at least two deliverables, explicit exclusions, and constraints. Missing any of them means no workspace.
2. **Generates the paper trail** — ten artifacts derived deterministically from the intake, including a risk register weighted by data sensitivity and timeline, and a permissions boundary with an approval list.
3. **Audits by phase** — only what the current phase requires, plus placeholders, missing exclusions, missing approval boundary, budget mismatch, and QA gates that ignore the success metric.
4. **Guards advancement** — a transition fails on critical/high findings or missing next-phase artifacts. State is unchanged on failure.
5. **Gates delivery** — `verify-engagement.mjs --strict` must exit 0 before a proposal, deliverable, or handoff leaves the agency.

## What's included

| Item | Purpose |
| --- | --- |
| `skills/engagement-os/SKILL.md` | Intake contract, six-phase machine, permissions rules, handoff discipline |
| `init-engagement.mjs` | Strict validation + ten-artifact workspace |
| `audit-engagement.mjs` | Phase-aware findings with severity and fix |
| `advance-engagement.mjs` | Guarded transitions with append-only history |
| `verify-engagement.mjs` | Delivery gate with `--strict` |
| `examples/intake.json` | Complete intake |
| `examples/intake-incomplete.json` | Rejected intake with five gaps |
| `examples/engagement-example/` | Generated workspace, audited at build time |
| `tests/engagement-os.test.mjs` | Eight checks including both guards |

## Who it's for

- Solo AI consultants who want proposals and scope to take minutes, not a day.
- Studios of 2–10 that need one process across every engagement.
- Agency owners who want a gate before work leaves the building.

## Who it's not for

- Teams looking for a CRM, invoicing, or e-signature tool.
- Anyone who wants contract templates reviewed by a lawyer.
- Hobby projects without a client, budget, or decision maker.

## Pricing

| Tier | Price | Includes |
| --- | --- | --- |
| **Solo** | **$199** | One operator, unlimited personal engagements, 30-day guarantee |
| **Studio** | **$499** | Up to 5 operators, shared process, priority email |
| **Agency** | **$999** | Unlimited operators and client engagements |

One-time payment. No subscription, no per-seat metering.

**Why $199+:** document packs sell for $15–$29; this enforces a process and blocks bad handoffs, and one prevented scope dispute is worth more than the license. The price is a hypothesis backed by adjacent anchors, not by ad data — see `docs/research-dossier.md`.

## 30-day money-back guarantee

Run the quickstart on the included intake. If initialization, the guards, or the gate do not behave as documented, email within 30 days for a full refund.

## FAQ

**Is this a CRM?**
No. It writes local files and enforces phase gates. No integrations.

**Does it write my proposal for me?**
It generates a proposal from the intake with a 40/40/20 milestone schedule and 14-day validity. Those are defaults, not legal or commercial advice — review before sending.

**Can I change the phases or templates?**
Yes; edit `lib.mjs` and the templates. Keep the gate behavior, or the product's value disappears.

**What stops someone from skipping a phase?**
`state.json` is only written by `advance-engagement.mjs`, which requires a clean audit and the next phase's artifacts. Hand-editing state is a process violation, not a supported path.

**Does it handle multiple clients?**
Yes — one directory per engagement.

**Is my client data sent anywhere?**
No. Local files, no network code.

**Can my team use it?**
Studio covers 5 operators; Agency is unlimited.

**How do updates work?**
1.x free for 12 months through the same download.

## What this product does not claim

- No paid-ad or demand validation (Ad Library was inaccessible; documented).
- No legal, tax, or pricing advice.
- No claim that following the process guarantees profitable engagements.

## Call to action

**Buy the AI Agency Delivery OS — $199.** Refuse the vague intake, generate the paper trail, and gate the handoff.

Support: support@deepakbagada.in · https://deepakbagada.in
