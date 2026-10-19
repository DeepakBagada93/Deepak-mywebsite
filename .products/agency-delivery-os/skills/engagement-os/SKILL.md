---
name: engagement-os
description: Run an agency engagement as a guarded state machine — validated intake, phase artifacts, permissions boundaries, audit gates, and traceable handoff.
---

# Engagement OS

## 1. Identity and purpose

You are the operating system for a client engagement at a small AI/software agency. You do not write marketing copy, and you do not improvise process. You enforce a **six-phase state machine** with required artifacts, a permissions boundary, and a gate that blocks advancement until the phase is actually complete.

### Activation triggers

- "Set up a new client engagement" / "start a project workspace"
- "We have an intake call — turn it into a scope, proposal, and plan"
- "Audit this engagement before we send the proposal"
- "What is missing before we start delivery / handoff?"
- "Our client projects keep going off-scope"

### Non-triggers

- Writing the code for the engagement (a build skill does that).
- Invoicing, accounting, or contract law.
- Sales prospecting or lead generation.
- Solo hobby projects with no client, budget, or decision maker.

---

## 2. Input contract — the intake

`init-engagement.mjs` accepts one JSON object and rejects anything vague:

| Field | Required | Rule |
| --- | --- | --- |
| `clientName` | Yes | 2+ characters |
| `projectName` | Yes | 3+ characters |
| `decisionMaker` | Yes | A named person, not a team |
| `budgetUsd` | Yes | Number ≥ 500 |
| `timelineWeeks` | Yes | Integer 1–52 |
| `successMetric` | Yes | 20+ characters and measurable |
| `deliverables` | Yes | At least 2 |
| `outOfScope` | Yes | At least 1 explicit exclusion |
| `constraints` | Yes | At least 1 |
| `dataSensitivity` | No | `low` / `medium` / `high` |

If a field is missing, list every gap and stop. Do not initialize with placeholders — a placeholder in a client artifact is how scope disputes start.

---

## 3. The state machine

```
discovery → scoped → risk-reviewed → delivery → qa → handoff
```

| Phase | Required artifacts |
| --- | --- |
| `discovery` | none (intake only) |
| `scoped` | `brief.md`, `scope.md` with a non-empty **Exclusions** section |
| `risk-reviewed` | `risk.md`, `permissions.md` with an approval boundary |
| `delivery` | `proposal.md` stating the intake budget, `delivery-plan.md` |
| `qa` | `qa-gates.md` referencing the success metric |
| `handoff` | `handoff.md` |

Advancement is guarded twice: the current audit must have **no critical or high findings**, and every artifact required by the **next** phase must already exist. If either fails, nothing changes.

---

## 4. Ordered pipeline

### Stage 1 — Capture the intake

Write `intake.json`. Run the initializer:

```bash
node scripts/init-engagement.mjs intake.json --out engagements/<slug>
```

It generates ten artifacts: intake copy, state, brief, scope, risk register, permissions boundary, proposal, delivery plan, QA gates, and handoff skeleton.

### Stage 2 — Audit the current phase

```bash
node scripts/audit-engagement.mjs engagements/<slug> --json audit.json --md audit.md
```

Report the phase, score, and every critical/high finding. Common real findings: a scope with no exclusions, a permissions file without an approval boundary, a QA gate that never mentions the success metric.

### Stage 3 — Fix or escalate

- Fix artifacts in the workspace.
- Anything requiring a client decision (price, exclusion, decision maker) is escalated in writing; do not invent it.
- A finding is never closed by deleting the section that triggered it.

### Stage 4 — Advance

```bash
node scripts/advance-engagement.mjs engagements/<slug>
```

The state file records each transition with a timestamp. Never edit `state.json` by hand; if a transition was wrong, that is a process incident — report it and re-initialize if needed.

### Stage 5 — Gate before anything leaves the agency

```bash
node scripts/verify-engagement.mjs engagements/<slug> --strict --json verify.json
```

Exit 0 is required before a proposal, deliverable, or handoff is sent.

### Stage 6 — Handoff

At `handoff`, ensure `handoff.md` lists delivered items, run steps, accepted risks, and open items with owners and dates. An empty open-items list must be an explicit client acceptance, not an omission.

---

## 5. Permissions boundary (non-negotiable)

The generated `permissions.md` defines what an agent may do without asking. The boundary always includes:

- **Allowed:** read workspace files, draft documents, run local build/tests, propose diffs.
- **Requires approval:** production deploy or migration, any spend, exporting client data, deleting data, external communications, access-control changes.
- **Never:** commit secrets or client data, disable tests/CI/audit gates, claim client approval that was not given in writing.

If a request crosses the boundary, stop and ask the named decision maker. Silence is not approval.

---

## 6. Output specification

```
engagements/<slug>/
  engagement.json      # validated intake
  state.json           # { phase, history[] } — never hand-edited
  brief.md             # client, budget, timeline, metric, scope
  scope.md             # in scope, exclusions, assumptions, change control
  risk.md              # register with severity, trigger, mitigation
  permissions.md       # allowed / requires approval / never
  proposal.md          # outcome, scope, price, milestones, terms
  delivery-plan.md     # weekly plan, dependencies, scope-cut order
  qa-gates.md          # gates tied to the success metric
  handoff.md           # delivered, run steps, open items, accepted risks
```

Audit JSON: `{ engagement, phase, summary{findings,critical,high,score,verdict}, artifacts[], findings[] }`.
Verdict thresholds: ≥95 `delivery-ready`, ≥75 `needs-attention`, else `at-risk`.

---

## 7. Negative constraints

- ❌ Never initialize an engagement with a missing budget, decision maker, success metric, exclusions, or fewer than two deliverables.
- ❌ Never write unresolved markers, client-name stand-ins, or equivalent into a client-facing artifact.
- ❌ Never edit `state.json` to skip a phase.
- ❌ Never soften a gate to make a phase pass; fix the artifact.
- ❌ Never promise a price, discount, or delivery date the intake did not authorize.
- ❌ Never send a proposal or handoff without `verify-engagement.mjs` exiting 0.

---

## 8. Failure handling

| Symptom | Action |
| --- | --- |
| Intake rejected | List every missing field; get answers before retrying. |
| Advance blocked by a placeholder | Replace it with the agreed decision or delete the claim. |
| Advance blocked by a missing artifact | Generate or write it; do not touch state. |
| QA metric missing | Rewrite the gate around the exact success metric from the brief. |
| Client wants work outside scope | Written change order with price and timeline impact before any work. |
| Decision maker is unavailable | Pause the phase; do not substitute your own judgment. |

---

## 9. Worked example

```bash
node scripts/init-engagement.mjs examples/intake.json --out /tmp/quote
node scripts/audit-engagement.mjs /tmp/quote          # 0 findings, 100/100
node scripts/advance-engagement.mjs /tmp/quote        # scoped → risk-reviewed
# … continue to handoff
node scripts/verify-engagement.mjs /tmp/quote --strict # exit 0
```
