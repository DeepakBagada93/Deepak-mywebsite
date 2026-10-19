/**
 * Agency Delivery OS — engagement state machine and workspace audit.
 * Zero dependencies. Node 18+ ESM.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

export const SCHEMA_VERSION = '1.0';
export const PHASES = ['discovery', 'scoped', 'risk-reviewed', 'delivery', 'qa', 'handoff'];
export const SEVERITY_WEIGHT = { critical: 15, high: 10, medium: 5, low: 2 };

export const REQUIRED_INTAKE = [
  ['clientName', (v) => typeof v === 'string' && v.trim().length >= 2, 'client name (2+ characters)'],
  ['projectName', (v) => typeof v === 'string' && v.trim().length >= 3, 'project name (3+ characters)'],
  ['decisionMaker', (v) => typeof v === 'string' && v.trim().length >= 2, 'decision maker name'],
  ['budgetUsd', (v) => Number.isFinite(v) && v >= 500, 'budget in USD (500+)'],
  ['timelineWeeks', (v) => Number.isInteger(v) && v >= 1 && v <= 52, 'timeline in whole weeks (1-52)'],
  ['successMetric', (v) => typeof v === 'string' && v.trim().length >= 20, 'measurable success metric (20+ characters)'],
  ['deliverables', (v) => Array.isArray(v) && v.length >= 2, 'at least two deliverables'],
  ['outOfScope', (v) => Array.isArray(v) && v.length >= 1, 'at least one explicit exclusion'],
  ['constraints', (v) => Array.isArray(v) && v.length >= 1, 'at least one constraint'],
];

export function validateIntake(intake) {
  const errors = [];
  if (!intake || typeof intake !== 'object') return ['Intake must be a JSON object.'];
  for (const [field, test, description] of REQUIRED_INTAKE) {
    if (!test(intake[field])) errors.push(`${field}: require ${description}.`);
  }
  if (intake.dataSensitivity && !['low', 'medium', 'high'].includes(intake.dataSensitivity)) {
    errors.push('dataSensitivity must be low, medium, or high.');
  }
  return errors;
}

export const PHASE_REQUIREMENTS = {
  discovery: [],
  scoped: ['brief.md', 'scope.md'],
  'risk-reviewed': ['risk.md', 'permissions.md'],
  delivery: ['proposal.md', 'delivery-plan.md'],
  qa: ['qa-gates.md'],
  handoff: ['handoff.md'],
};

export async function exists(target) {
  return !!(await fs.stat(target).catch(() => null));
}

export async function readJson(target) {
  const text = await fs.readFile(target, 'utf8').catch(() => null);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function readText(target) {
  return fs.readFile(target, 'utf8').catch(() => null);
}

export function finding(id, severity, message, evidence, fix) {
  return { id, severity, message, evidence: evidence || [], fix };
}

const PLACEHOLDER_RE = /(\bTBD\b|\bTODO\b|\[insert|\[client|lorem ipsum|\{\{)/i;

export async function auditWorkspace(dir) {
  const findings = [];
  const state = await readJson(path.join(dir, 'state.json'));
  const intake = await readJson(path.join(dir, 'engagement.json'));

  if (!intake) findings.push(finding('missing-intake', 'critical', 'engagement.json is missing or invalid; the workspace has no contract.', [], 'Re-run init-engagement.mjs with a valid intake.'));
  if (!state) findings.push(finding('missing-state', 'critical', 'state.json is missing; the engagement has no phase.', [], 'Re-run init-engagement.mjs.'));
  if (intake && state) {
    const errors = validateIntake(intake);
    for (const error of errors) findings.push(finding(`intake-${error.split(':')[0]}`, 'high', `Intake invalid: ${error}`, [{ path: 'engagement.json' }], 'Fix the intake and re-initialize.'));
  }

  const phase = state?.phase;
  if (state && !PHASES.includes(phase)) {
    findings.push(finding('unknown-phase', 'critical', `Unknown phase "${phase}".`, [{ path: 'state.json' }], `Use one of: ${PHASES.join(', ')}.`));
  }
  if (state && (!Array.isArray(state.history) || !state.history.length)) {
    findings.push(finding('empty-history', 'medium', 'State history is empty; phase changes are untraceable.', [{ path: 'state.json' }], 'Re-initialize the workspace.'));
  }

  const required = PHASE_REQUIREMENTS[phase] || [];
  const artifacts = {};
  for (const file of required) {
    const text = await readText(path.join(dir, file));
    if (!text || text.trim().length < 80) {
      findings.push(finding(`missing-${file}`, 'critical', `Required artifact for phase "${phase}" is missing or too thin: ${file}.`, [{ path: file }], 'Generate it with init-engagement.mjs or write the real content.'));
      continue;
    }
    artifacts[file] = text;
    const placeholder = text.match(PLACEHOLDER_RE);
    if (placeholder) {
      findings.push(finding(`placeholder-${file}`, 'critical', `${file} still contains a placeholder ("${placeholder[0]}").`, [{ path: file }], 'Replace it with an agreed decision or delete the section.'));
    }
  }

  if (artifacts['scope.md']) {
    const scope = artifacts['scope.md'];
    const exclusions = scope.split(/^## Exclusions\s*$/m)[1] || '';
    if (!/(^|\n)\s*[-*]\s+\S/.test(exclusions)) {
      findings.push(finding('scope-no-exclusions', 'high', 'scope.md has no explicit exclusions.', [{ path: 'scope.md' }], 'List what is not included; unstated exclusions become free work.'));
    }
  }

  if (artifacts['permissions.md'] && !/requires approval/i.test(artifacts['permissions.md'])) {
    findings.push(finding('no-approval-boundary', 'high', 'permissions.md does not state which actions require approval.', [{ path: 'permissions.md' }], 'Add an approval boundary for deploys, spend, and client data.'));
  }

  if (artifacts['proposal.md'] && intake?.budgetUsd) {
    const rendered = `$${intake.budgetUsd.toLocaleString('en-US')}`;
    if (!artifacts['proposal.md'].includes(rendered) && !artifacts['proposal.md'].includes(String(intake.budgetUsd))) {
      findings.push(finding('proposal-budget-mismatch', 'medium', 'proposal.md does not state the intake budget.', [{ path: 'proposal.md' }], 'Restate the budget and payment schedule verbatim.'));
    }
  }

  if (artifacts['qa-gates.md'] && intake?.successMetric) {
    const fragments = intake.successMetric.toLowerCase().split(/\s+/).filter((word) => word.length > 4).slice(0, 3);
    const text = artifacts['qa-gates.md'].toLowerCase();
    if (!fragments.some((fragment) => text.includes(fragment))) {
      findings.push(finding('qa-metric-missing', 'high', 'qa-gates.md does not reference the agreed success metric.', [{ path: 'qa-gates.md' }], 'Every QA gate must tie back to the success metric.'));
    }
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => (order[a.severity] - order[b.severity]) || a.id.localeCompare(b.id));
  const score = Math.max(0, 100 - findings.reduce((sum, item) => sum + (SEVERITY_WEIGHT[item.severity] || 1), 0));
  return {
    schemaVersion: SCHEMA_VERSION,
    checkedAt: new Date().toISOString(),
    engagement: intake ? { client: intake.clientName, project: intake.projectName, budgetUsd: intake.budgetUsd, timelineWeeks: intake.timelineWeeks } : null,
    phase: phase || null,
    summary: {
      findings: findings.length,
      critical: findings.filter((item) => item.severity === 'critical').length,
      high: findings.filter((item) => item.severity === 'high').length,
      score,
      verdict: score >= 95 ? 'delivery-ready' : score >= 75 ? 'needs-attention' : 'at-risk',
    },
    artifacts: required.map((file) => ({ path: file, present: Boolean(artifacts[file]) })),
    findings,
  };
}

export function nextPhase(phase) {
  const index = PHASES.indexOf(phase);
  return index >= 0 && index < PHASES.length - 1 ? PHASES[index + 1] : null;
}
