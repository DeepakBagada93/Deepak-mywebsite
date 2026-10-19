# AI Agency Delivery OS — Customer Guide

From a client intake to a gated engagement in under 10 minutes. The 3-minute quickstart uses the included example.

---

## 1. What's in your download

```
agency-delivery-os/
├── skills/engagement-os/
│   ├── SKILL.md
│   └── scripts/{lib,init-engagement,audit-engagement,advance-engagement,verify-engagement}.mjs
├── examples/
│   ├── intake.json                 # complete
│   ├── intake-incomplete.json      # rejected
│   └── engagement-example/         # generated workspace
├── tests/engagement-os.test.mjs
├── docs/ (this guide, research, spec, listing, test plan/results, release report)
└── COMPATIBILITY.md · CHANGELOG.md · LICENSE.md · README.md · product-manifest.json
```

Requirement: Node.js 18+. No dependencies, no network, no CRM.

## 2. Three-minute quickstart

```bash
cd agency-delivery-os

# 1) Initialize from a complete intake
node skills/engagement-os/scripts/init-engagement.mjs examples/intake.json --out /tmp/quote

# 2) Audit: expect 0 findings, 100/100
node skills/engagement-os/scripts/audit-engagement.mjs /tmp/quote

# 3) Advance through the guarded phases
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → risk-reviewed
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → delivery
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → qa
node skills/engagement-os/scripts/advance-engagement.mjs /tmp/quote   # → handoff

# 4) Gate strictly: expect PASS, exit 0
node skills/engagement-os/scripts/verify-engagement.mjs /tmp/quote --strict

# 5) See rejection: five named gaps, no workspace
node skills/engagement-os/scripts/init-engagement.mjs examples/intake-incomplete.json --out /tmp/nope
```

## 3. Install the skill in your client

Client activation is **untested**; scripts run standalone.

### Claude Code

```bash
mkdir -p .claude/skills/engagement-os
cp -R /path/to/agency-delivery-os/skills/engagement-os/* .claude/skills/engagement-os/
```

Prompt: `Use engagement-os. Turn this intake into a workspace, then audit it. Do not invent missing answers.`

### Cursor

```bash
mkdir -p .agent/skills
cp -R /path/to/agency-delivery-os/skills/engagement-os .agent/skills/
```

### Antigravity

```bash
mkdir -p ~/.gemini/antigravity-cli/skills
cp -R /path/to/agency-delivery-os/skills/engagement-os ~/.gemini/antigravity-cli/skills/
```

### Codex / other CLI agents

Load `SKILL.md` by path, or run the scripts directly and paste `SKILL.md` as session instructions.

## 4. Run a real engagement

### Step 1 — Capture the intake (the hard part)

Copy `examples/intake.json` and fill it in. Every field is required except `dataSensitivity`. If the client has not decided the budget or the success metric, you do not have an engagement yet — you have a conversation.

### Step 2 — Initialize

```bash
node skills/engagement-os/scripts/init-engagement.mjs client-intake.json --out engagements/northwind-quote
```

Ten files appear. Read `scope.md` and `proposal.md` before anything else: they are the two documents that decide whether the engagement is profitable.

### Step 3 — Audit the phase

```bash
node skills/engagement-os/scripts/audit-engagement.mjs engagements/northwind-quote --md audit.md
```

Fix critical and high findings. Do not delete the section that caused a finding.

### Step 4 — Advance deliberately

```bash
node skills/engagement-os/scripts/advance-engagement.mjs engagements/northwind-quote
```

Each successful transition appends to `state.json`. If it refuses, read the reasons — a placeholder or a missing artifact, never a mystery.

### Step 5 — Gate before sending

```bash
node skills/engagement-os/scripts/verify-engagement.mjs engagements/northwind-quote --strict
```

Run this before sending the proposal, before starting delivery, and before handoff. Exit 0 or nothing leaves the agency.

### Step 6 — Handoff

Update `handoff.md`: delivered items, run steps, accepted risks, open items with owners and dates. An empty open-items list needs explicit client acceptance.

---

## 5. Prompt recipes

### Recipe 1 — Standard engagement setup

```markdown
Use the engagement-os skill at skills/engagement-os/SKILL.md.

Here is the intake: <paste JSON or notes>.
1. Extract every required field. List anything missing and stop — do not guess.
2. Once complete, initialize the workspace.
3. Audit it and show me the scope exclusions and the proposal before advancing.
```

### Recipe 2 — Pre-proposal review

```markdown
Use engagement-os on engagements/acme-rag.

Audit the current phase and focus on commercial risk:
- Are exclusions real, or just polite?
- Does the proposal restate the intake budget and payment schedule?
- Does the QA gate reference the metric the client is actually buying?
Recommend PASS or FAIL. Do not edit the proposal without approval.
```

### Recipe 3 — Express gate

```bash
node skills/engagement-os/scripts/verify-engagement.mjs engagements/acme-rag --strict --json /tmp/verify.json
```

```markdown
Read /tmp/verify.json. List blocking findings and the smallest fix for each.
```

### Recipe 4 — Rescue an off-scope engagement

```markdown
Use engagement-os on engagements/legacy-client.

The client keeps asking for work outside scope.
1. Audit the workspace.
2. Identify which boundary failed: intake, exclusions, change control, or QA.
3. Draft a change order template with price and timeline impact for the current request.
Do not agree to the work on our behalf.
```

---

## 6. CI / review ritual

Run the gate in a pre-send checklist rather than CI if you prefer:

```bash
node skills/engagement-os/scripts/verify-engagement.mjs engagements/<slug> --strict || echo "DO NOT SEND"
```

For a studio, run it in a scheduled job across `engagements/*` and fail the build on any `at-risk` workspace.

---

## 7. Worked example

| Step | Result |
| --- | --- |
| Complete intake | 10 artifacts, phase `scoped` |
| Fresh audit | 0 findings, 100/100 |
| Add `TBD` to scope | Advance blocked, state still `scoped` |
| Remove `qa-gates.md` before QA | Advance blocked: missing artifact |
| QA without the success metric | Verify FAIL (high) |
| Full chain | `scoped → risk-reviewed → delivery → qa → handoff` |

---

## 8. Troubleshooting

**Intake rejected**
The error lists each gap. Budget, metric, deliverables, exclusions, and constraints are the usual missing ones. Get answers; do not lower the bar.

**Advance blocked by a placeholder**
Replace `TBD` with the agreed decision or remove the claim from the document.

**Scope has no exclusions**
Add at least three bullets: adjacent features, integrations, and ongoing support you are not delivering.

**Proposal budget mismatch**
Restate the exact intake figure; do not round it in one document and not the other.

**QA gate ignores the metric**
Copy the success metric into the gate verbatim, with the evidence required to prove it.

**Client asks for extra work**
Written change order with price and timeline impact. The permissions boundary requires approval; it is not optional courtesy.

**Two people editing one workspace**
No locking is implemented. One operator at a time; merge outside the tool.

---

## 9. FAQ

**Is this a CRM?**
No. Local files only.

**Is the proposal legally reviewed?**
No. It is a structured default; have your contract reviewed separately.

**Can I customize phases?**
Yes, by editing `lib.mjs`. Keep the guards.

**Does it store client data anywhere?**
No network code; everything stays on disk.

**Can I use it for every client?**
Yes on Studio and Agency tiers; Solo covers one operator.

**How do updates work?**
1.x free for 12 months.

---

## 10. Support

- Email: support@deepakbagada.in
- Include: Node version, command, exit code, and the failing finding ids. Never send client-confidential content.
- 30-day guarantee: see `docs/store-listing.md`.
