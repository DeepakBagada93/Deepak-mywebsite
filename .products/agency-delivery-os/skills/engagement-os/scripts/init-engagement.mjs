#!/usr/bin/env node
/**
 * init-engagement — create a complete engagement workspace from a client intake.
 *
 * Usage: node init-engagement.mjs <intake.json> [--out <dir>] [--force]
 * Exit: 0 on success, 1 on invalid intake or non-empty target.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { exists, readJson, validateIntake } from './lib.mjs';

const argv = process.argv.slice(2);
let intakePath = null;
let outDir = null;
let force = false;
for (let i = 0; i < argv.length; i += 1) {
  if (argv[i] === '--out') outDir = argv[++i];
  else if (argv[i] === '--force') force = true;
  else intakePath = argv[i];
}
if (!intakePath) {
  console.error('Usage: node init-engagement.mjs <intake.json> [--out <dir>] [--force]');
  process.exit(1);
}

const intake = await readJson(path.resolve(intakePath));
if (!intake) {
  console.error(`Cannot parse intake: ${intakePath}`);
  process.exit(1);
}
const errors = validateIntake(intake);
if (errors.length) {
  console.error('Intake is not ready to initialize:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const slug = intake.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const target = path.resolve(outDir || slug);
if ((await exists(target)) && (await fs.readdir(target)).length && !force) {
  console.error(`Output directory is not empty: ${target}. Pass --force to overwrite generated artifacts.`);
  process.exit(1);
}
await fs.mkdir(target, { recursive: true });

const money = `$${intake.budgetUsd.toLocaleString('en-US')}`;
const sensitivity = intake.dataSensitivity || 'low';
const now = new Date().toISOString();
const bullets = (items) => items.map((item) => `- ${item}`).join('\n');
const weeks = (fraction) => Math.max(1, Math.round(intake.timelineWeeks * fraction));

const brief = `# Engagement brief — ${intake.projectName}

- Client: ${intake.clientName}
- Decision maker: ${intake.decisionMaker}
- Budget: ${money}
- Timeline: ${intake.timelineWeeks} week(s)
- Data sensitivity: ${sensitivity}

## Success metric

${intake.successMetric}

## Deliverables

${bullets(intake.deliverables)}

## Constraints

${bullets(intake.constraints)}

## Out of scope

${bullets(intake.outOfScope)}
`;

const scope = `# Scope — ${intake.projectName}

## In scope

${bullets(intake.deliverables)}

## Exclusions

${bullets(intake.outOfScope)}

## Assumptions

- The client provides access, test data, and a named reviewer within two business days of request.
- Decisions are made by ${intake.decisionMaker}; approvals from other stakeholders are the client's responsibility.

## Change control

Any work not listed under "In scope" requires a written change order with price and timeline impact before it starts.
`;

const riskRows = [
  ['Scope creep', sensitivity === 'high' ? 'high' : 'medium', 'Out-of-scope requests arrive without a change order.', 'Change control section in scope.md; written approval before work.'],
  ['Data handling', sensitivity, sensitivity === 'low' ? 'Standard access controls and no client data in prompts.' : 'Least-privilege access, redacted fixtures, no production data in prompts.'],
  ['Timeline', intake.timelineWeeks <= 4 ? 'high' : 'medium', `${intake.timelineWeeks}-week window with review checkpoints.`, 'Weekly checkpoint; scope cut list agreed in week one.'],
  ['Budget', intake.budgetUsd < 5000 ? 'medium' : 'low', `${money} fixed budget with 40/40/20 schedule.`, 'No work beyond scope without a change order.'],
];
const risk = `# Risk register — ${intake.projectName}

| Risk | Severity | Trigger | Mitigation |
| --- | --- | --- | --- |
${riskRows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} |`).join('\n')}

## Review cadence

Reviewed at every phase transition by the engagement owner and ${intake.decisionMaker}.
`;

const permissions = `# Permissions boundary — ${intake.projectName}

## Agent may do without asking

- Read repository files inside the workspace.
- Draft documents, plans, and tests in the workspace.
- Run local build and test commands.
- Propose changes as a diff.

## Requires approval before acting

- Any production deploy, migration, or infrastructure change.
- Any spend, subscription, or paid API call above $0.
- Exporting, copying, or transmitting client data.
- Deleting data, branches, or customer records.
- Sending external communications on behalf of the client.
- Changing access controls or credentials.

## Never

- Commit secrets or client data to a repository.
- Disable tests, CI checks, or audit gates to pass a release.
- Represent generated content as client-approved without written confirmation.

## Escalation

Approval requests go to ${intake.decisionMaker} in writing; silence is not approval.
`;

const deposit = Math.round(intake.budgetUsd * 0.4);
const midpoint = Math.round(intake.budgetUsd * 0.4);
const final = intake.budgetUsd - deposit - midpoint;
const proposal = `# Proposal — ${intake.projectName}

Prepared for ${intake.clientName}.

## Outcome

${intake.successMetric}

## Scope

${bullets(intake.deliverables)}

**Not included:** ${intake.outOfScope.join('; ')}.

## Investment

Total: ${money}

| Milestone | Amount | When |
| --- | ---: | --- |
| Deposit | $${deposit.toLocaleString('en-US')} | On signature |
| Midpoint | $${midpoint.toLocaleString('en-US')} | At delivery review |
| Final | $${final.toLocaleString('en-US')} | At handoff |

## Timeline

${intake.timelineWeeks} week(s) from signed scope and access. Any pause longer than five business days moves the delivery date by the same length.

## Terms

- Valid for 14 days from the date above.
- One consolidated revision round per deliverable.
- Additional work is quoted as a change order before it starts.
- Decision maker: ${intake.decisionMaker}.
`;

const plan = `# Delivery plan — ${intake.projectName}

| Week | Phase | Output | Checkpoint |
| ---: | --- | --- | --- |
| 1–${weeks(0.25)} | Discovery | Confirmed scope, access, test data | Scope signed by ${intake.decisionMaker} |
| ${weeks(0.25) + 1}–${weeks(0.5)} | Build | ${intake.deliverables[0]} | Demo against success metric |
| ${weeks(0.5) + 1}–${weeks(0.75)} | Build | ${intake.deliverables[Math.min(1, intake.deliverables.length - 1)]} | Review and revision round |
| ${weeks(0.75) + 1}–${intake.timelineWeeks} | QA and handoff | Tests, documentation, walkthrough | Written acceptance |

## Dependencies

${bullets(intake.constraints)}

## Scope-cut order

If the timeline slips, cut in this order: polish, then optional integrations, then reporting. Never cut tests or the success metric.
`;

const qa = `# QA gates — ${intake.projectName}

## Gate 1 — Success metric

- The agreed metric is demonstrable: ${intake.successMetric}
- Evidence is recorded in the handoff, not asserted verbally.

## Gate 2 — Deliverables

${intake.deliverables.map((item, index) => `- Deliverable ${index + 1}: ${item} — reviewed by ${intake.decisionMaker}.`).join('\n')}

## Gate 3 — Quality

- Build passes from a clean checkout.
- Tests pass; no skipped or deleted tests.
- No secrets or client data in the repository or in prompts.

## Gate 4 — Handoff

- Owner, runbook, and rollback steps are written down.
- Open items list is empty or explicitly accepted by the client.
`;

const handoff = `# Handoff — ${intake.projectName}

## Delivered

${bullets(intake.deliverables)}

## How to run it

Documented in the delivery repository README; verified from a clean checkout before handoff.

## Open items

None recorded at initialization. Update this list during QA; every item needs an owner and a date.

## Accepted risks

${riskRows.filter((row) => row[1] === 'high').map((row) => `- ${row[0]}: ${row[2]}`).join('\n') || '- None.'}
`;

const state = {
  schemaVersion: '1.0',
  engagementId: `${slug}-${Date.now().toString(36)}`,
  phase: 'scoped',
  createdAt: now,
  history: [{ phase: 'discovery', at: now }, { phase: 'scoped', at: now }],
};

const files = {
  'engagement.json': `${JSON.stringify(intake, null, 2)}\n`,
  'state.json': `${JSON.stringify(state, null, 2)}\n`,
  'brief.md': brief,
  'scope.md': scope,
  'risk.md': risk,
  'permissions.md': permissions,
  'proposal.md': proposal,
  'delivery-plan.md': plan,
  'qa-gates.md': qa,
  'handoff.md': handoff,
};
for (const [file, content] of Object.entries(files)) {
  await fs.writeFile(path.join(target, file), content);
}

console.log(`Initialized engagement "${intake.projectName}" at ${target}`);
console.log(`Phase: scoped — ${Object.keys(files).length} artifact(s) written.`);
console.log('Next: node audit-engagement.mjs <dir>, then advance-engagement.mjs when the review is done.');
