# Product specification — AI Agency Delivery OS 1.0.0

## 1. Promise

**From a vague client intake to a gated, auditable engagement workspace — with the phase machine refusing to advance until the work is actually done.**

Measurable on shipped artifacts:

1. A complete intake produces ten artifacts and starts at `scoped` with a 100/100 audit.
2. An incomplete intake is rejected with five named gaps and creates nothing.
3. A `TBD` placeholder blocks advancement and leaves state unchanged.
4. The full chain `scoped → risk-reviewed → delivery → qa → handoff` passes with a clean audit at each step.
5. Removing the success metric from QA gates fails `verify-engagement.mjs`.

## 2. Scope

### In scope

- Strict intake validation (budget, decision maker, metric, deliverables, exclusions, constraints).
- Deterministic artifact generation: brief, scope, risk register, permissions, proposal, delivery plan, QA gates, handoff.
- Six-phase state machine with append-only history.
- Phase-aware audit: required artifacts, placeholders, exclusions, approval boundary, budget restatement, QA metric linkage.
- Guarded transitions and a delivery gate.

### Out of scope

- CRM, invoicing, e-signature, time tracking, or client portals.
- Contract law, pricing strategy, or tax advice.
- Automated negotiation or client communication.
- Multi-user concurrency or permissions inside the workspace.

## 3. Architecture

```
intake.json ──► init-engagement.mjs ──► workspace (10 artifacts, phase=scoped)
                                            │
                          ┌─────────────────┴──────────────────┐
                          ▼                                    ▼
                 audit-engagement.mjs                 advance-engagement.mjs
                 (phase-aware findings)               (guards: audit clean +
                          │                            next-phase artifacts)
                          └──────────► verify-engagement.mjs ◄──┘
```

| Script | Reads | Writes | Exit |
| --- | --- | --- | --- |
| `init-engagement.mjs` | intake | workspace | 1 on invalid intake or non-empty target |
| `audit-engagement.mjs` | workspace | report | 1 only if unreadable |
| `advance-engagement.mjs` | workspace | `state.json` | 1 when a guard blocks |
| `verify-engagement.mjs` | workspace | report | 1 on blocking findings |

## 4. Phase requirements

| Phase | Artifacts | Additional rules |
| --- | --- | --- |
| `discovery` | intake | Valid intake |
| `scoped` | `brief.md`, `scope.md` | Exclusions section non-empty; no placeholders |
| `risk-reviewed` | `risk.md`, `permissions.md` | "Requires approval" present |
| `delivery` | `proposal.md`, `delivery-plan.md` | Proposal states intake budget |
| `qa` | `qa-gates.md` | References the success metric |
| `handoff` | `handoff.md` | No placeholders |

Scoring: `100 − Σ(critical 15, high 10, medium 5, low 2)`. Verdict: ≥95 `delivery-ready`, ≥75 `needs-attention`, else `at-risk`.

## 5. Acceptance criteria

| # | Criterion | Verification |
| --- | --- | --- |
| A1 | Valid intake → 10 artifacts, phase `scoped`, history length 2 | Functional test |
| A2 | Invalid intake → exit 1, five gaps named, no directory | Functional test |
| A3 | Placeholder blocks advance; state unchanged | Functional test |
| A4 | Full chain advances in order and records history | Functional test |
| A5 | Missing artifact blocks advance | Functional test |
| A6 | QA without metric fails verify | Functional test |
| A7 | Non-empty dir refused without `--force` | Functional test |
| A8 | No placeholders, valid frontmatter, no absolute paths | Structural test |
| A9 | Archive contains only customer files | `audit-package.mjs` |

## 6. Pricing

| Tier | Price | Seats / scope |
| --- | --- | --- |
| Solo | **$199** | 1 operator |
| Studio | **$499** | Up to 5 operators |
| Agency | **$999** | Unlimited, unlimited client engagements |

Rationale: document kits are commoditized at $15–$29; a gated system prevents scope disputes worth thousands per engagement. Price is a hypothesis and is labeled as such in the research dossier.

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Buyers expect a CRM | Listing states local files, no integrations |
| Templates mistaken for legal advice | License and README disclaim; proposal terms labeled defaults |
| Operators bypass the gate | `state.json` is never hand-edited; transitions are logged; verify is the release bar |
| Process overhead for tiny projects | Intake requirements are explicit; small projects can stay at `scoped` |
| Price resistance | Solo tier at $199 with a concrete risk framing; refund guarantee |
