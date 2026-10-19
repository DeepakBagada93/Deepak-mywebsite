/**
 * n8n workflow audit library. Zero dependencies. Node 18+ ESM.
 * Static analysis of exported workflow JSON only — no n8n instance required.
 */

export const SCHEMA_VERSION = '1.0';

const SECRET_KEY_RE = /(api[-_]?key|token|secret|password|authorization|bearer|access[-_]?key)/i;
const TRIGGER_RE = /(trigger|webhook|schedule)/i;
const WRITE_RE = /(postgres|mysql|mongo|airtable|googleSheets|httpRequest|slack|gmail|emailSend|hubspot|salesforce|notion)/i;
const RETRYABLE_RE = /(httpRequest|postgres|mysql|mongo|airtable|googleSheets|slack|gmail|emailSend|hubspot|salesforce|notion|graphql)/i;

export const SEVERITY_WEIGHT = { critical: 15, high: 10, medium: 5, low: 2 };

export function isTrigger(node) {
  return TRIGGER_RE.test(node.type || '');
}

export function loadWorkflow(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!data || !Array.isArray(data.nodes)) throw new Error('Not an n8n workflow export: missing nodes[]');
  return data;
}

export function adjacency(workflow) {
  const map = new Map();
  for (const [source, outputs] of Object.entries(workflow.connections || {})) {
    const targets = [];
    for (const branch of outputs.main || []) {
      for (const link of branch || []) {
        if (link && link.node) targets.push(link.node);
      }
    }
    map.set(source, targets);
  }
  return map;
}

export function reachableNodes(workflow) {
  const adj = adjacency(workflow);
  const starts = workflow.nodes.filter(isTrigger).map((node) => node.name);
  const seen = new Set(starts);
  const queue = [...starts];
  while (queue.length) {
    const current = queue.shift();
    for (const next of adj.get(current) || []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen;
}

function walkStrings(value, path, out) {
  if (typeof value === 'string') out.push({ path, value });
  else if (Array.isArray(value)) value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, out));
  else if (value && typeof value === 'object') {
    for (const [key, inner] of Object.entries(value)) walkStrings(inner, path ? `${path}.${key}` : key, out);
  }
}

export function findInlineSecrets(workflow) {
  const hits = [];
  for (const node of workflow.nodes) {
    const strings = [];
    walkStrings(node.parameters || {}, '', strings);
    for (const item of strings) {
      const leaf = item.path.split('.').pop().replace(/\[\d+\]$/g, '');
      const looksLikeExpression = item.value.startsWith('={{') || item.value.includes('$env') || item.value.startsWith('$');
      if (!looksLikeExpression && item.value.length >= 12 && (SECRET_KEY_RE.test(leaf) || /^Bearer\s+\S{12,}/i.test(item.value))) {
        hits.push({ node: node.name, path: item.path, valuePreview: `${item.value.slice(0, 4)}…${item.value.slice(-2)}` });
      }
    }
    for (const [credName, cred] of Object.entries(node.credentials || {})) {
      if (cred && cred.data && Object.keys(cred.data).length) {
        hits.push({ node: node.name, path: `credentials.${credName}.data`, valuePreview: '(credential data embedded)' });
      }
    }
  }
  return hits;
}

export function finding(id, type, severity, message, evidence, fix) {
  return { id, type, severity, message, evidence: evidence || [], fix };
}

export function auditWorkflow(workflow) {
  const findings = [];
  const nodes = workflow.nodes;
  const settings = workflow.settings || {};
  const byName = new Map(nodes.map((node) => [node.name, node]));

  const triggers = nodes.filter(isTrigger);
  if (!triggers.length) {
    findings.push(finding('no-trigger', 'structure', 'critical', 'Workflow has no trigger node and can never start.', [], 'Add a Webhook, Schedule, or manual trigger.'));
  }

  const hasErrorTrigger = nodes.some((node) => /errorTrigger/i.test(node.type || ''));
  if (!settings.errorWorkflow && !hasErrorTrigger) {
    findings.push(finding('missing-error-workflow', 'reliability', 'high', 'No error workflow is configured; failed runs fail silently.', [], 'Set Settings → Error Workflow to a workflow that starts with an Error Trigger.'));
  }

  for (const node of nodes) {
    const type = node.type || '';
    const params = node.parameters || {};

    if (RETRYABLE_RE.test(type) && !node.retryOnFail) {
      findings.push(finding(`no-retry-${node.name}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase(), 'reliability', 'medium', `\`${node.name}\` has no retry policy; a single transient failure ends the run.`, [{ node: node.name, path: 'retryOnFail' }], 'Enable Retry On Fail with 3 tries and a 1s wait.'));
    }

    if (/httpRequest/i.test(type)) {
      const options = params.options || {};
      if (!options.timeout) {
        findings.push(finding(`no-timeout-${node.name}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase(), 'reliability', 'medium', `\`${node.name}\` makes an HTTP call with no timeout.`, [{ node: node.name, path: 'parameters.options.timeout' }], 'Set a timeout (30000 ms is a safe default).'));
      }
      if (params.authentication && params.authentication !== 'none' && !node.credentials) {
        findings.push(finding(`missing-credentials-${node.name}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase(), 'security', 'high', `\`${node.name}\` declares authentication but has no credential attached.`, [{ node: node.name, path: 'credentials' }], 'Attach a credential instead of inlining values in parameters.'));
      }
    }

    if (/webhook/i.test(type) && (!params.authentication || params.authentication === 'none')) {
      findings.push(finding('webhook-without-auth', 'security', 'high', 'Webhook trigger accepts unauthenticated requests.', [{ node: node.name, path: 'parameters.authentication' }], 'Require header or basic authentication, or add a signature check node.'));
    }

    if (node.disabled === true) {
      findings.push(finding(`disabled-node-${node.name}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase(), 'maintenance', 'low', `\`${node.name}\` is disabled and will be skipped silently in production.`, [{ node: node.name }], 'Delete it or document why it is disabled.'));
    }
  }

  const secrets = findInlineSecrets(workflow);
  if (secrets.length) {
    findings.push(finding('inline-secrets', 'security', 'critical', `${secrets.length} credential value(s) are inlined in node parameters or embedded credential data.`, secrets, 'Move each value into an n8n credential and reference it; then re-export.'));
  }

  if (workflow.pinData && Object.keys(workflow.pinData).length) {
    findings.push(finding('pinned-data', 'hygiene', 'high', 'Workflow export contains pinned test data.', [{ path: 'pinData' }], 'Unpin data before exporting; pinned data can leak customer records.'));
  }

  const reachable = reachableNodes(workflow);
  const orphans = nodes.filter((node) => !isTrigger(node) && !reachable.has(node.name)).map((node) => node.name);
  if (orphans.length) {
    findings.push(finding('orphan-nodes', 'structure', 'medium', `Unreachable node(s) from any trigger: ${orphans.join(', ')}.`, orphans.map((name) => ({ node: name })), 'Delete them or connect them; dead branches hide drift.'));
  }

  if (triggers.some((node) => /webhook/i.test(node.type || ''))) {
    const writes = nodes.filter((node) => WRITE_RE.test(node.type || ''));
    const hasGuard = nodes.some((node) => /(^|\.)(if|switch|removeDuplicates|filter)$/i.test(node.type || '') || /removeDuplicates|dedupe|duplicate/i.test(node.name || ''));
    if (writes.length && !hasGuard) {
      findings.push(finding('no-idempotency-guard', 'reliability', 'medium', 'Webhook-driven workflow writes to an external system with no duplicate guard.', writes.map((node) => ({ node: node.name })), 'Add a dedupe check (event id lookup, Remove Duplicates, or an IF on last-seen timestamp) before the write.'));
    }
  }

  if (settings.executionOrder !== 'v1') {
    findings.push(finding('legacy-execution-order', 'maintenance', 'low', 'Workflow does not use executionOrder v1.', [], 'Set settings.executionOrder to "v1" and re-test branch order.'));
  }

  const duplicateNames = nodes
    .map((node) => node.name)
    .filter((name, index, all) => all.indexOf(name) !== index);
  if (duplicateNames.length) {
    findings.push(finding('duplicate-node-names', 'structure', 'medium', `Duplicate node name(s): ${[...new Set(duplicateNames)].join(', ')}.`, [], 'Rename nodes; n8n connections are keyed by name.'));
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => (order[a.severity] - order[b.severity]) || a.id.localeCompare(b.id));

  const score = Math.max(0, 100 - findings.reduce((sum, item) => sum + (SEVERITY_WEIGHT[item.severity] || 1), 0));
  const verdict = score >= 95 ? 'production-ready' : score >= 70 ? 'needs-hardening' : 'not-production-ready';

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    workflow: { name: workflow.name || '(unnamed)', nodes: nodes.length, triggers: triggers.length, settings: Object.keys(settings) },
    summary: { findings: findings.length, critical: findings.filter((f) => f.severity === 'critical').length, high: findings.filter((f) => f.severity === 'high').length, score, verdict },
    findings,
  };
}

export function renderMarkdown(report) {
  const lines = [
    `# Workflow audit — ${report.workflow.name}`,
    '',
    `- Generated: ${report.generatedAt}`,
    `- Nodes: ${report.workflow.nodes} (${report.workflow.triggers} trigger(s))`,
    `- Findings: ${report.summary.findings} (${report.summary.critical} critical, ${report.summary.high} high)`,
    `- Score: ${report.summary.score}/100 — ${report.summary.verdict}`,
    '',
  ];
  if (!report.findings.length) lines.push('No findings. This workflow is ready to run in production.');
  for (const item of report.findings) {
    lines.push(`## [${item.severity.toUpperCase()}] ${item.message}`, '', `- Type: \`${item.type}\``, `- Fix: ${item.fix}`, '');
    for (const ev of item.evidence.slice(0, 5)) lines.push(`- Evidence: ${JSON.stringify(ev)}`);
    if (item.evidence.length) lines.push('');
  }
  return `${lines.join('\n')}\n`;
}
