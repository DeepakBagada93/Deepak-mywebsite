/**
 * Agent Context Architect — shared analysis library.
 * Zero dependencies. Node 18+ (ESM). No network access.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

export const SCHEMA_VERSION = '1.0';

export const DEFAULT_BUDGET = {
  kernel: 300,
  repoMap: 800,
  playbook: 400,
  adapter: 120,
  total: 1100,
};

export const CONTEXT_FILE_NAMES = [
  'CLAUDE.md',
  'AGENTS.md',
  'GEMINI.md',
  '.cursorrules',
  '.windsurfrules',
  '.clinerules',
  'copilot-instructions.md',
  '.github/copilot-instructions.md',
];

const CONTEXT_DIRS = ['.cursor/rules', '.claude/rules', '.agent/rules'];

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.output',
  'coverage', '.turbo', '.cache', 'vendor', 'target', '.venv', 'venv', '__pycache__',
  '.context', '.idea', '.vscode', '.DS_Store',
]);

const SKIP_FILE_RE = /(\.lock|lock\.json|package-lock\.json|\.png|\.jpg|\.jpeg|\.gif|\.webp|\.ico|\.pdf|\.zip|\.woff2?|\.ttf|\.mp4)$/i;

export const SOFT_PHRASES = [
  'be careful',
  'write clean code',
  'follow best practices',
  'use good judgment',
  'use your judgment',
  'as needed',
  'where appropriate',
  'try to',
  'if possible',
  'make sure to',
];

export const CONFLICT_FAMILIES = [
  {
    id: 'package-manager',
    label: 'Package manager',
    values: [
      { value: 'pnpm', re: /\bpnpm\b/i },
      { value: 'yarn', re: /\byarn\b/i },
      { value: 'bun', re: /\bbun\b/i },
      { value: 'npm', re: /\bnpm\b/i },
    ],
    evidence: /(?:install|add|run|ci|\bi\b)\b/i,
    severity: 'critical',
    fix: 'Pick one package manager, state it once in the kernel, and delete every other manager instruction.',
  },
  {
    id: 'quotes',
    label: 'Quote style',
    values: [
      { value: 'single', re: /\bsingle[- ]quotes?\b/i },
      { value: 'double', re: /\bdouble[- ]quotes?\b/i },
    ],
    severity: 'high',
    fix: 'Keep one quote rule, or defer formatting to the configured formatter and delete both rules.',
  },
  {
    id: 'semicolons',
    label: 'Semicolon policy',
    values: [
      { value: 'always', re: /semicolons?\s*(?:[:=]\s*)?(?:always|required|true)|(?:always|required)\s+(?:use\s+)?semicolons?/i },
      { value: 'never', re: /semicolons?\s*(?:[:=]\s*)?(?:never|false)|(?:never|no|omit|without)\s+(?:use\s+)?semicolons?/i },
    ],
    severity: 'high',
    fix: 'Delete both; let Prettier/Biome own semicolon policy. If neither exists, keep exactly one rule.',
  },
  {
    id: 'indentation',
    label: 'Indentation',
    values: [
      { value: 'tabs', re: /\b(?:indent\w*|use)\b[^.\n]{0,20}\btabs?\b/i },
      { value: 'spaces', re: /\b(?:2|4|two|four)[- ]spaces?\b|\bspaces?\s+for\s+indent/i },
    ],
    severity: 'medium',
    fix: 'Defer indentation to the formatter config, then remove it from prose rules.',
  },
  {
    id: 'test-runner',
    label: 'Test runner',
    values: [
      { value: 'vitest', re: /\bvitest\b/i },
      { value: 'jest', re: /\bjest\b/i },
      { value: 'node:test', re: /\bnode:test\b|\bnode --test\b/i },
    ],
    severity: 'critical',
    fix: 'Name the one test command in the kernel and delete instructions that invoke a different runner.',
  },
];

export async function exists(target) {
  return !!(await fs.stat(target).catch(() => null));
}

export async function readText(target) {
  return fs.readFile(target, 'utf8').catch(() => null);
}

/** Deliberate approximation: ~4 characters per token. Never claim tokenizer-exact counts. */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateTokensFromBytes(bytes) {
  return Math.ceil(bytes / 4);
}

export async function walkFiles(root, { maxFiles = 5000 } = {}) {
  const out = [];
  async function walk(dir) {
    if (out.length >= maxFiles) return;
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (out.length >= maxFiles) return;
      const full = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        await walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (SKIP_FILE_RE.test(entry.name)) continue;
      out.push(full);
    }
  }
  await walk(root);
  return out;
}

export async function discoverContextFiles(root) {
  const found = [];
  for (const name of CONTEXT_FILE_NAMES) {
    const full = path.join(root, name);
    if (await exists(full)) found.push({ path: name, kind: 'adapter-or-legacy' });
  }
  for (const dir of CONTEXT_DIRS) {
    const full = path.join(root, dir);
    if (!(await exists(full))) continue;
    const entries = await fs.readdir(full, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/\.(md|mdc|mdx|txt)$/i.test(entry.name)) continue;
      found.push({ path: `${dir}/${entry.name}`, kind: 'scoped-rule' });
    }
  }
  const seen = new Set();
  return found.filter((f) => (seen.has(f.path) ? false : seen.add(f.path)));
}

export function normalizeRuleLine(line) {
  return line
    .toLowerCase()
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '')
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[.;:,!]+$/, '')
    .trim();
}

export function extractRuleLines(text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;
    if (/^#{1,6}\s/.test(line)) return;
    if (/^```/.test(line)) return;
    if (/^\[.*\]\(.*\)$/.test(line)) return;
    if (line.length < 12) return;
    const normalized = normalizeRuleLine(line);
    if (normalized.length < 12) return;
    out.push({ line: index + 1, raw: line, normalized });
  });
  return out;
}

export function detectSoftPhrases(text) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const phrase of SOFT_PHRASES) {
      if (line.toLowerCase().includes(phrase)) {
        hits.push({ phrase, line: index + 1, raw: line.trim() });
      }
    }
  });
  return hits;
}

export function detectConflicts(entries) {
  const findings = [];
  for (const family of CONFLICT_FAMILIES) {
    const perValue = new Map();
    for (const entry of entries) {
      const lines = entry.text.split(/\r?\n/);
      lines.forEach((line, index) => {
        if (!line.trim()) return;
        if (family.evidence && !family.evidence.test(line)) return;
        for (const candidate of family.values) {
          const match = line.match(candidate.re);
          if (!match) continue;
          if (family.id === 'package-manager' && !/(install|\badd\b|\brun\b|\bci\b)/i.test(line)) continue;
          if (!perValue.has(candidate.value)) perValue.set(candidate.value, []);
          perValue.get(candidate.value).push({ path: entry.path, line: index + 1, raw: line.trim() });
        }
      });
    }
    if (perValue.size < 2) continue;
    const values = [...perValue.keys()].sort();
    const evidence = values.flatMap((value) => perValue.get(value).slice(0, 2).map((e) => ({ value, ...e })));
    findings.push({
      id: `conflict-${family.id}`,
      type: 'conflict',
      severity: family.severity,
      message: `Conflicting ${family.label.toLowerCase()} instructions: ${values.join(' vs ')}.`,
      evidence,
      fix: family.fix,
    });
  }
  return findings;
}

export async function findStalePaths(root, entries) {
  const claims = [];
  for (const entry of entries) {
    const lines = entry.text.split(/\r?\n/);
    lines.forEach((line, index) => {
      const matches = line.match(/`([A-Za-z0-9_.\-/]+\/[A-Za-z0-9_.\-]+)`/g) || [];
      for (const token of matches) {
        const candidate = token.slice(1, -1);
        if (/[*{}<>|]|^https?:|^\.\.\//.test(candidate)) continue;
        if (!candidate.includes('/')) continue;
        if (!/\.[A-Za-z0-9]{1,8}$/.test(candidate) && !candidate.endsWith('/')) continue;
        claims.push({ path: entry.path, line: index + 1, raw: line.trim(), candidate });
      }
    });
  }
  const missing = [];
  for (const claim of claims) {
    const full = path.join(root, claim.candidate);
    if (!(await exists(full))) missing.push(claim);
  }
  return { claims, missing };
}

export function detectDuplicates(entries) {
  const index = new Map();
  for (const entry of entries) {
    for (const rule of extractRuleLines(entry.text)) {
      if (rule.normalized.length < 40) continue;
      if (!index.has(rule.normalized)) index.set(rule.normalized, []);
      index.get(rule.normalized).push({ path: entry.path, line: rule.line, raw: rule.raw });
    }
  }
  const duplicates = [];
  for (const [normalized, locations] of index) {
    const files = new Set(locations.map((l) => l.path));
    if (files.size < 2) continue;
    duplicates.push({ normalized: normalized.slice(0, 160), locations });
  }
  return duplicates;
}

export async function readJson(target) {
  const text = await readText(target);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function detectStack(root) {
  const pkg = (await readJson(path.join(root, 'package.json'))) || {};
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const scripts = pkg.scripts || {};

  let packageManager = null;
  if (await exists(path.join(root, 'pnpm-lock.yaml'))) packageManager = 'pnpm';
  else if (await exists(path.join(root, 'yarn.lock'))) packageManager = 'yarn';
  else if (await exists(path.join(root, 'bun.lockb'))) packageManager = 'bun';
  else if (await exists(path.join(root, 'package-lock.json'))) packageManager = 'npm';

  const frameworks = [];
  if (deps.next) frameworks.push('Next.js');
  if (deps.react && !deps.next) frameworks.push('React');
  if (deps.vue || deps.nuxt) frameworks.push('Vue');
  if (deps.svelte || deps['@sveltejs/kit']) frameworks.push('Svelte');
  if (deps.expo) frameworks.push('Expo');
  if (deps['@nestjs/core']) frameworks.push('NestJS');
  if (deps.express) frameworks.push('Express');
  if (deps.fastify) frameworks.push('Fastify');

  const formatters = [];
  if (deps.prettier) formatters.push('prettier');
  if (deps['@biomejs/biome'] || deps.biome) formatters.push('biome');
  if (deps.eslint) formatters.push('eslint');

  const testRunners = [];
  if (deps.vitest) testRunners.push('vitest');
  if (deps.jest) testRunners.push('jest');

  const files = await walkFiles(root);
  const relFiles = files.map((f) => path.relative(root, f).split(path.sep).join('/'));
  const hasTs = relFiles.some((f) => f.endsWith('.ts') || f.endsWith('.tsx')) || (await exists(path.join(root, 'tsconfig.json')));

  return {
    name: pkg.name || path.basename(root),
    version: pkg.version || null,
    packageManager,
    scripts,
    frameworks,
    formatters,
    testRunners,
    language: hasTs ? 'TypeScript' : relFiles.some((f) => f.endsWith('.py')) ? 'Python' : 'JavaScript',
    files: relFiles,
    engines: pkg.engines || null,
  };
}

export function commandFor(packageManager, script) {
  const pm = packageManager || 'npm';
  return pm === 'npm' ? `npm run ${script}` : `${pm} run ${script}`;
}

export function severityWeight(severity) {
  return { critical: 15, high: 10, medium: 5, low: 2 }[severity] || 1;
}

export function scoreFindings(findings) {
  const score = findings.reduce((acc, f) => acc - severityWeight(f.severity), 100);
  return Math.max(0, Math.min(100, score));
}

export function verdictFor(score) {
  if (score >= 80) return 'ready';
  if (score >= 60) return 'needs-cleanup';
  return 'needs-rework';
}

export function sortFindings(findings) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...findings].sort((a, b) => {
    const bySeverity = (order[a.severity] ?? 9) - (order[b.severity] ?? 9);
    if (bySeverity !== 0) return bySeverity;
    return a.id.localeCompare(b.id);
  });
}

export async function countDirFiles(dir, files) {
  const prefix = dir.endsWith('/') ? dir : `${dir}/`;
  return files.filter((f) => f.startsWith(prefix)).length;
}
