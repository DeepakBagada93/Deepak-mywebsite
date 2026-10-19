/**
 * MCP Server Launch Kit — shared validation and static audit logic.
 * Zero dependencies. Node 18+ ESM.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

export const SCHEMA_VERSION = '1.0';
export const SEVERITY_WEIGHT = { critical: 15, high: 10, medium: 5, low: 2 };
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next']);

export const DESTRUCTIVE_RE = /(^|_)(delete|remove|drop|destroy|purge|reset|revoke|exec|execute|shell|run_command|rm)(_|$)/i;

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

export function validateSpec(spec) {
  const errors = [];
  if (!spec || typeof spec !== 'object') {
    errors.push('Spec must be a JSON object.');
    return errors;
  }
  if (!/^[a-z0-9][a-z0-9-]{2,}$/.test(spec.name || '')) errors.push('name must be kebab-case, at least 3 characters.');
  if (!spec.version || !/^\d+\.\d+\.\d+$/.test(spec.version)) errors.push('version must be semver (e.g. 0.1.0).');
  if (!spec.description || spec.description.length < 20) errors.push('description must be at least 20 characters.');
  if (!Array.isArray(spec.tools) || spec.tools.length === 0) errors.push('tools must be a non-empty array.');
  else if (spec.tools.length > 20) errors.push('tools must contain at most 20 entries.');

  const seen = new Set();
  for (const [index, tool] of (spec.tools || []).entries()) {
    const label = tool?.name || `tools[${index}]`;
    if (!/^[a-z][a-z0-9_]{2,40}$/.test(tool?.name || '')) errors.push(`${label}: name must be snake_case, 3-40 chars.`);
    if (seen.has(tool?.name)) errors.push(`${label}: duplicate tool name.`);
    seen.add(tool?.name);
    if (!tool?.description || tool.description.length < 20) errors.push(`${label}: description must be at least 20 characters.`);
    if (!tool?.inputSchema || tool.inputSchema.type !== 'object') errors.push(`${label}: inputSchema.type must be "object".`);
    if (tool?.inputSchema && typeof tool.inputSchema.properties !== 'object') errors.push(`${label}: inputSchema.properties is required.`);
    if (DESTRUCTIVE_RE.test(tool?.name || '') && !/destructive/i.test(tool?.description || '')) {
      errors.push(`${label}: destructive tools must say "destructive" in their description.`);
    }
  }

  const serialized = JSON.stringify(spec);
  if (/(api[_-]?key|secret|password|token)\s*[:=]/i.test(serialized) && /(sk_|pk_live|ghp_)[A-Za-z0-9]{8,}/.test(serialized)) {
    errors.push('Spec appears to contain a real credential; use an env var name instead.');
  }
  return errors;
}

export async function collectSourceFiles(root) {
  const files = [];
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(full);
      } else if (/\.(mjs|cjs|js|ts)$/.test(entry.name)) {
        files.push(full);
      }
    }
  }
  await walk(root);
  return files;
}

export function finding(id, type, severity, message, evidence, fix) {
  return { id, type, severity, message, evidence: evidence || [], fix };
}

const CODE_RULES = [
  {
    id: 'dynamic-eval',
    severity: 'critical',
    type: 'security',
    test: (text) => /\beval\(|new Function\(/.test(text),
    message: 'Server uses dynamic code evaluation, which turns any input into executable code.',
    fix: 'Remove eval/new Function; dispatch through an explicit tool registry.',
  },
  {
    id: 'hardcoded-secret',
    severity: 'critical',
    type: 'security',
    test: (text) => /(api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-]{12,}['"]/i.test(text) || /process\.env\.[A-Z0-9_]+\s*\|\|\s*['"][^'"]{8,}['"]/.test(text),
    message: 'A credential-shaped literal is embedded in source or used as an env fallback.',
    fix: 'Read the value from the environment and fail closed when it is missing.',
  },
  {
    id: 'secret-logged',
    severity: 'high',
    type: 'security',
    test: (text) => /console\.(log|error|warn|info)\([^;\n]*process\.env\.(?:[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*)/.test(text),
    message: 'An environment secret is written to logs.',
    fix: 'Log a presence flag, never the value.',
  },
  {
    id: 'exec-capability',
    severity: 'high',
    type: 'capability',
    test: (text) => /child_process|execSync|\bexec\(|\bspawn\(/.test(text),
    message: 'Server can execute shell or child processes.',
    fix: 'Remove it, or document the allowlist, require confirmation, and sandbox the call.',
  },
  {
    id: 'http-server-no-auth',
    severity: 'high',
    type: 'security',
    test: (text) => /createServer\(|\.listen\(/.test(text) && !/authorization|bearer|api[_-]?key/i.test(text),
    message: 'Server exposes a network listener with no visible authentication check.',
    fix: 'Require a bearer token or signature before handling requests.',
  },
  {
    id: 'filesystem-write',
    severity: 'medium',
    type: 'capability',
    test: (text) => /writeFile|appendFile|unlink|rmSync|\brm\(/.test(text),
    message: 'Server can write to or delete from the filesystem.',
    fix: 'Constrain paths to a declared workspace root and reject traversal.',
  },
  {
    id: 'wildcard-cors',
    severity: 'medium',
    type: 'security',
    test: (text) => /access-control-allow-origin['"]?\s*[:,]\s*['"]\*/i.test(text),
    message: 'CORS allows every origin.',
    fix: 'Allow only the origins that need the server.',
  },
  {
    id: 'unbounded-fetch',
    severity: 'low',
    type: 'reliability',
    test: (text) => /\bfetch\(/.test(text) && !/AbortSignal|timeout/i.test(text),
    message: 'Outbound fetch has no visible timeout.',
    fix: 'Pass an AbortSignal with a timeout.',
  },
];

export async function auditProject(root, spec = null) {
  const findings = [];
  const files = await collectSourceFiles(root);
  if (!files.length) {
    findings.push(finding('no-source', 'structure', 'critical', 'No JavaScript or TypeScript source files found.', [], 'Point the audit at the server directory.'));
  }

  if (spec) {
    const errors = validateSpec(spec);
    if (errors.length) {
      findings.push(
        finding(
          'spec-invalid',
          'spec',
          'high',
          `Spec has ${errors.length} violation(s): ${errors.slice(0, 3).join(' ')}${errors.length > 3 ? ' …' : ''}`,
          errors.map((error) => ({ path: 'mcp.spec.json', detail: error })),
          'Fix every spec violation before scaffolding or publishing.',
        ),
      );
    }
  } else {
    findings.push(finding('no-spec', 'spec', 'medium', 'No mcp.spec.json found; tool contracts cannot be verified.', [], 'Add a spec so tools, schemas, and destructive flags are reviewable.'));
  }

  const readme = await exists(path.join(root, 'README.md'));
  if (!readme) findings.push(finding('no-readme', 'docs', 'medium', 'No README; installers cannot tell what the server does.', [], 'Document run command, tools, and required environment variables.'));

  const packageJson = await readJson(path.join(root, 'package.json'));
  if (packageJson && !packageJson.engines?.node) {
    findings.push(finding('no-engines', 'packaging', 'low', 'package.json does not declare a Node engine.', [], 'Add "engines": { "node": ">=18" }.'));
  }

  const testFiles = files.filter((file) => /(test|spec)/i.test(file));
  if (!testFiles.length) {
    findings.push(finding('no-tests', 'quality', 'high', 'No test file found; protocol behavior is unverified.', [], 'Add a smoke test that initializes the server and lists tools.'));
  }

  const combined = [];
  for (const file of files) {
    const relative = path.relative(root, file);
    if (/(^|\/)(test|tests|__tests__|spec)(\/|$)/i.test(relative)) continue;
    combined.push({ file: relative, text: await fs.readFile(file, 'utf8') });
  }
  for (const rule of CODE_RULES) {
    const hits = combined.filter((entry) => rule.test(entry.text));
    if (!hits.length) continue;
    findings.push(finding(rule.id, rule.type, rule.severity, rule.message, hits.map((hit) => ({ path: hit.file })), rule.fix));
  }

  if (spec && spec.tools?.some((tool) => (tool.inputSchema?.required || []).length)) {
    const validates = combined.some((entry) => /validate\w*\(|required|z\.object|ajv/i.test(entry.text));
    if (!validates) {
      findings.push(finding('no-input-validation', 'security', 'high', 'Tools declare required arguments but the server has no visible validation.', [], 'Validate required fields and types before invoking a handler.'));
    }
  }

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => (order[a.severity] - order[b.severity]) || a.id.localeCompare(b.id));
  const score = Math.max(0, 100 - findings.reduce((sum, item) => sum + (SEVERITY_WEIGHT[item.severity] || 1), 0));
  const verdict = score >= 95 ? 'launch-ready' : score >= 75 ? 'needs-fixes' : 'not-launch-ready';

  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    project: { name: spec?.name || packageJson?.name || path.basename(root), tools: spec?.tools?.length || 0, files: files.length },
    summary: { findings: findings.length, critical: findings.filter((f) => f.severity === 'critical').length, high: findings.filter((f) => f.severity === 'high').length, score, verdict },
    findings,
  };
}

export function renderMarkdown(report) {
  const lines = [
    `# MCP server audit — ${report.project.name}`,
    '',
    `- Generated: ${report.generatedAt}`,
    `- Tools declared: ${report.project.tools}`,
    `- Findings: ${report.summary.findings} (${report.summary.critical} critical, ${report.summary.high} high)`,
    `- Score: ${report.summary.score}/100 — ${report.summary.verdict}`,
    '',
  ];
  if (!report.findings.length) lines.push('No findings. The server is ready for a launch review.');
  for (const item of report.findings) {
    lines.push(`## [${item.severity.toUpperCase()}] ${item.message}`, '', `- Type: \`${item.type}\``, `- Fix: ${item.fix}`);
    for (const ev of item.evidence.slice(0, 4)) lines.push(`- Evidence: \`${ev.path}\``);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}
