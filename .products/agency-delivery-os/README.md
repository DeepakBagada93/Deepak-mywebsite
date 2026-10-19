# AI Agency Delivery OS

Run client engagements as a guarded state machine instead of a folder of half-finished documents. Validated intake → phase artifacts → permissions boundary → audit gate → traceable handoff.

## What it does

1. **Validates intake** — no budget, no decision maker, no measurable success metric, no explicit exclusions means no engagement. The initializer refuses and lists every gap.
2. **Generates the workspace** — ten artifacts from one intake: brief, scope with exclusions, risk register, permissions boundary, proposal with milestone payments, delivery plan, QA gates tied to the success metric, and a handoff skeleton.
3. **Audits by phase** — only the artifacts required for the current phase are enforced, plus placeholders, missing exclusions, missing approval boundaries, budget mismatch, and QA gates that ignore the success metric.
4. **Guards advancement** — a phase transition fails if the audit has critical/high findings or the next phase's artifacts are missing. Nothing changes on failure.
5. **Gates delivery** — `verify-engagement.mjs --strict` must exit 0 before anything goes to a client.

## What's in the box

```
skills/engagement-os/
  SKILL.md
  scripts/lib.mjs                  # intake validation, phase requirements, audit
  scripts/init-engagement.mjs
  scripts/audit-engagement.mjs
  scripts/advance-engagement.mjs
  scripts/verify-engagement.mjs
examples/intake.json               # complete example
examples/intake-incomplete.json    # rejected example
examples/engagement-example/       # generated workspace, audited at build time
tests/engagement-os.test.mjs
```

## Requirements

- Node.js 18+ (verified on Node 25.9.0)
- No dependencies, no network, no client data leaves the machine.

## First successful run (2 minutes)

```bash
cd agency-delivery-os

# 1) Initialize from the example intake
node skills/engagement-os/scripts/init-engagement.mjs examples/intake.json --out /tmp/quote

# 2) Audit the scoped phase: expect 0 findings, 100/100
node skills/engagement-os/scripts/audit-engagement.mjs /tmp/quote

# 3) Advance through the guarded phases
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → risk-reviewed
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → delivery
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → qa
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → handoff

# 4) Gate
node skills/engagement-os/scripts/verify-engagement.mjs /tmp/quote --strict

# 5) Watch a vague intake get rejected
node skills/engagement-os/scripts/init-engagement.mjs examples/intake-incomplete.json --out /tmp/nope
```

## The phases

| Phase | Required artifacts | Gate |
| --- | --- | --- |
| `discovery` | intake only | Valid intake |
| `scoped` | `brief.md`, `scope.md` + exclusions | No placeholders |
| `risk-reviewed` | `risk.md`, `permissions.md` | Approval boundary present |
| `delivery` | `proposal.md`, `delivery-plan.md` | Budget restated |
| `qa` | `qa-gates.md` | Success metric referenced |
| `handoff` | `handoff.md` | Open items recorded |

## Permissions boundary

Generated into every engagement: allowed actions, actions requiring the named decision maker's approval (deploy, spend, data export, deletion, external comms), and never-actions (secrets, disabling tests, claiming ungiven approval).

## Limitations — read before buying

- **It is a process system, not an autopilot.** It generates and audits artifacts; it does not negotiate, price, or decide for you.
- **Proposal terms are a template.** 40/40/20 milestones and 14-day validity are defaults, not legal or commercial advice. Review before sending.
- **No e-signature, invoicing, time tracking, or CRM integration.**
- **No client portal.** Artifacts are local files.
- **Audit is structural.** It checks presence, placeholders, exclusions, boundaries, and metric linkage — not whether the proposal is a good deal.
- **Client activation is untested** in Claude Code, Cursor, Antigravity, or Codex; scripts run standalone.

## Support and license

- Email: support@deepakbagada.in · Website: https://deepakbagada.in
- License: `LICENSE.md` (client use; no resale of raw source).
- Changelog: `CHANGELOG.md`.
