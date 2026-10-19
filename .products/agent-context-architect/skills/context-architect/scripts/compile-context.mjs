#!/usr/bin/env node
/**
 * compile-context — generate a budgeted, layered context system for a repository.
 *
 * Usage:
 *   node compile-context.mjs <repo> [--out .context] [--install] [--budget <file>] [--json <file>]
 *
 * Layers written to <out>:
 *   kernel.md        always-on rules and commands (small)
 *   repo-map.md      generated path map (on demand)
 *   playbooks/*.md   task procedures built from real package scripts
 *   drift-probes.md  questions that detect context drift
 *   manifest.json    layer sizes, sources, budget compliance
 *
 * With --install, client adapters (CLAUDE.md, AGENTS.md, .cursor/rules/000-context.mdc)
 * are written to the repository root. Existing adapters are backed up to <out>/backup/.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  SCHEMA_VERSION,
  DEFAULT_BUDGET,
  discoverContextFiles,
  detectStack,
  estimateTokens,
  exists,
  readJson,
  readText,
  commandFor,
  normalizeRuleLine,
} from './lib.mjs';

const TOOL_VERSION = '1.0.0';
const MANAGED_START = '<!-- context-architect:managed:begin -->';
const MANAGED_END = '<!-- context-architect:managed:end -->';

function parseArgs(argv) {
  const args = { repo: '.', out: '.context', install: false, budget: null, json: null };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--out') args.out = argv[++i];
    else if (item === '--install') args.install = true;
    else if (item === '--budget') args.budget = argv[++i];
    else if (item === '--json') args.json = argv[++i];
    else rest.push(item);
  }
  if (rest[0]) args.repo = rest[0];
  return args;
}

const STYLE_RULE_RE = /\b(quotes?|semicolons?|indent\w*|tabs?|spaces?)\b/i;

function extractDomainBoundaries(entries, stack) {
  const candidates = [];
  const seen = new Set();
  for (const entry of entries) {
    for (const rawLine of entry.text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (line.length < 24 || line.length > 180) continue;
      if (!/\b(never|do not|don't|must not|forbidden|avoid)\b/i.test(line)) continue;
      if (!/^(?:[-*+]|\d+[.)])\s+/.test(line)) continue;
      if (STYLE_RULE_RE.test(line) && stack.formatters.length) continue;
      if (/\b(npm|pnpm|yarn|bun)\b/i.test(line)) continue;
      const normalized = normalizeRuleLine(line);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      candidates.push(line.replace(/^(?:[-*+]|\d+[.)])\s+/, '- '));
    }
  }
  return candidates.slice(0, 6);
}

function buildKernel(stack, budget, entries) {
  const pm = stack.packageManager || 'npm';
  const scriptEntries = ['build', 'test', 'lint', 'typecheck']
    .filter((name) => stack.scripts[name])
    .map((name) => `- ${name}: \`${commandFor(pm, name)}\``);

  const facts = [];
  const framework = stack.frameworks.length ? stack.frameworks.join(' + ') : null;
  facts.push(`- Language: ${stack.language}${framework ? `; framework: ${framework}` : ''}`);
  facts.push(`- Package manager: ${pm}${stack.packageManager ? '' : ' (no lockfile detected — confirm before installing)'}`);
  if (stack.formatters.length) facts.push(`- Formatter/linter: ${stack.formatters.join(', ')}`);
  if (stack.testRunners.length) facts.push(`- Test runner: ${stack.testRunners.join(', ')}`);
  if (stack.engines && stack.engines.node) facts.push(`- Node: ${stack.engines.node}`);

  const genericBoundaries = [
    { key: /secret|\.env/i, text: '- Never commit secrets, `.env` files, or credentials.' },
    { key: /package manager|lockfile/i, text: '- Do not change the package manager or its lockfile policy without an explicit instruction.' },
    { key: /\bgit\b|reset --hard|force/i, text: '- Do not run destructive git commands (`reset --hard`, `push --force`, branch deletion) unprompted.' },
    { key: /\btests?\b/i, text: '- Do not weaken, skip, or delete a failing test to make a check pass.' },
  ];
  const domainBoundaries = extractDomainBoundaries(entries, stack);
  const boundaries = [
    ...domainBoundaries,
    ...genericBoundaries.filter((rule) => !domainBoundaries.some((line) => rule.key.test(line))).map((rule) => rule.text),
  ];

  const sourceNote = entries.length
    ? `Sources: ${entries.map((entry) => entry.path).join(', ')}`
    : 'Sources: none (no existing context files were found)';

  const header = [
    `# Context kernel — ${stack.name}`,
    '',
    'Read this file before any task. Load deeper layers only when the task needs them.',
    'Layers: `.context/repo-map.md` (paths), `.context/playbooks/` (task steps), `.context/drift-probes.md` (verification).',
    '',
    '## Commands',
  ];

  const commands = scriptEntries.length
    ? [`- install: \`${pm} install\``, ...scriptEntries]
    : [`- install: \`${pm} install\``, '- No build/test/lint scripts were found in package.json; confirm commands before running them.'];

  const sections = [
    { priority: 0, lines: header },
    { priority: 0, lines: commands },
    { priority: 1, lines: ['', '## Facts', ...facts] },
    { priority: 2, lines: ['', '## Boundaries', ...boundaries] },
    { priority: 3, lines: ['', sourceNote] },
  ];

  const render = (groups) => `${groups.flatMap((group) => group.lines).join('\n')}\n`;

  let groups = sections.map((section) => ({ ...section, lines: [...section.lines] }));
  let text = render(groups);

  let guard = 0;
  while (estimateTokens(text) > budget.kernel && guard < 200) {
    guard += 1;
    const candidates = groups.filter((group) => group.priority > 0 && group.lines.length > 0);
    if (!candidates.length) break;
    candidates.sort((a, b) => b.priority - a.priority);
    const target = candidates[0];
    let cutoff = -1;
    for (let i = target.lines.length - 1; i >= 0; i -= 1) {
      const line = target.lines[i];
      if (line && !line.startsWith('## ')) {
        cutoff = i;
        break;
      }
    }
    if (cutoff === -1) {
      target.lines = [];
      text = render(groups);
      continue;
    }
    target.lines.splice(cutoff, 1);
    if (target.lines.every((line) => !line || line.startsWith('## '))) target.lines = [];
    text = render(groups);
  }

  return text;
}

function roleFor(dir) {
  const lower = dir.toLowerCase();
  if (/(^|\/)(app|pages|routes|views)(\/|$)/.test(lower)) return 'UI routes / pages';
  if (/(^|\/)(api|server|backend|handlers)(\/|$)/.test(lower)) return 'Server / API code';
  if (/(^|\/)(lib|utils|shared|core|src)(\/|$)/.test(lower) && !lower.includes('/')) return 'Shared source';
  if (/(^|\/)(components|ui)(\/|$)/.test(lower)) return 'UI components';
  if (/(^|\/)(tests?|__tests__|spec)(\/|$)/.test(lower)) return 'Tests';
  if (/(^|\/)(docs?|adr)(\/|$)/.test(lower)) return 'Documentation / decisions';
  if (/(^|\/)(scripts?|tooling|bin)(\/|$)/.test(lower)) return 'Tooling';
  if (/(^|\/)(migrations|db|prisma|schema)(\/|$)/.test(lower)) return 'Data layer';
  if (/(^|\/)(public|assets|static)(\/|$)/.test(lower)) return 'Static assets';
  return 'Source';
}

function buildRepoMap(stack, files, generatedAt) {
  const dirCounts = new Map();
  for (const file of files) {
    const parts = file.split('/');
    if (parts.length < 2) continue;
    const dir = parts.slice(0, parts.length > 2 ? 2 : 1).join('/');
    dirCounts.set(dir, (dirCounts.get(dir) || 0) + 1);
  }
  const rows = [...dirCounts.entries()]
    .filter(([dir]) => !dir.startsWith('.'))
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([dir, count]) => `| \`${dir}\` | ${count} | ${roleFor(dir)} |`);

  const entryFiles = files
    .filter((file) => /^(src\/)?(index|main|app|server|cli)\.(ts|tsx|js|jsx|mjs|py)$/.test(file) || /(^|\/)package\.json$/.test(file))
    .slice(0, 8)
    .map((file) => `- \`${file}\``);

  const lines = [
    `# Repository map — ${stack.name}`,
    '',
    `Generated from disk at ${generatedAt}. Regenerate with \`compile-context.mjs\`; do not hand-edit.`,
    '',
    '| Path | Files | Role |',
    '| --- | ---: | --- |',
    ...rows,
  ];
  if (entryFiles.length) {
    lines.push('', '## Entry points', '', ...entryFiles);
  }
  if (stack.scripts && Object.keys(stack.scripts).length) {
    lines.push('', '## Declared scripts', '', ...Object.entries(stack.scripts).map(([key, value]) => `- \`${key}\`: \`${value}\``));
  }
  lines.push('');
  return lines.join('\n');
}

function buildPlaybook(stack, script, command) {
  const descriptions = {
    build: 'Compile or bundle the application. Run before claiming a change is shippable.',
    test: 'Run the automated test suite. Run before handing work back.',
    lint: 'Run static analysis. Fix causes, never suppress rules.',
    typecheck: 'Run the type checker. Zero new errors is the bar.',
    dev: 'Start the local development server for manual verification.',
  };
  return [
    `# Playbook: ${script}`,
    '',
    `Command: \`${command}\``,
    '',
    `Run when: ${descriptions[script] || `Run the declared \`${script}\` workflow.`}`,
    '',
    '## Procedure',
    '1. Run the command exactly as written, from the repository root.',
    '2. Read the first error, not the last line of output.',
    '3. Fix the cause in source; do not edit the command, config thresholds, or test expectations to pass.',
    '4. Rerun the same command until it exits 0.',
    '5. Record the final command and result in your handoff note.',
    '',
    '## Failure handling',
    '- Missing dependency: install with the declared package manager only.',
    '- Environment failure (port in use, missing variable): report it; do not silently stub the code.',
    '- Flaky test: report the test name and evidence; do not retry more than twice.',
    '',
  ].join('\n');
}

function buildDriftProbes(stack, installedPaths) {
  const pm = stack.packageManager || 'npm';
  const probes = [];
  probes.push({
    question: 'Which package manager is canonical here, and what exact install command should be used?',
    expected: `${pm}; \`${pm} install\``,
  });
  for (const script of ['test', 'build', 'lint']) {
    if (!stack.scripts[script]) continue;
    probes.push({
      question: `What exact command runs the ${script} step?`,
      expected: `\`${commandFor(pm, script)}\``,
    });
  }
  probes.push({
    question: 'Where do task-specific procedures live, and when should they be loaded?',
    expected: '`.context/playbooks/` — load only when the task matches the playbook.',
  });
  probes.push({
    question: 'Name one action the agent must never take unprompted in this repository.',
    expected: 'One of the kernel boundaries (secrets, package-manager change, destructive git).',
  });
  probes.push({
    question: 'What is the runtime language and framework?',
    expected: `${stack.language}${stack.frameworks.length ? `; ${stack.frameworks.join(' + ')}` : ''}`,
  });
  if (installedPaths.length) {
    probes.push({
      question: 'Which file is the authoritative always-on context, and which files are thin adapters?',
      expected: '`.context/kernel.md` is authoritative; adapters only point to it.',
    });
  }

  const lines = [
    `# Drift probes — ${stack.name}`,
    '',
    'Ask an agent these probes in a fresh session. Answers must come from `.context/kernel.md`, not guesswork.',
    'A wrong or hedged answer means the context drifted or the agent never loaded it. Fix the context, then re-run.',
    '',
  ];
  probes.forEach((probe, index) => {
    lines.push(`## Probe ${index + 1}`, '', probe.question, '', `Expected: ${probe.expected}`, '');
  });
  return lines.join('\n');
}

function adapterBody(kind, stack) {
  const pm = stack.packageManager || 'npm';
  const header = `${MANAGED_START}\n`;
  const footer = `\n${MANAGED_END}\n`;
  if (kind === 'cursor') {
    return [
      '---',
      'description: Authoritative project context (managed)',
      'alwaysApply: true',
      '---',
      MANAGED_START,
      '',
      'Read `.context/kernel.md` before any task. Load `.context/repo-map.md` for paths and',
      '`.context/playbooks/` for task procedures. Do not restate rules here.',
      '',
      `Canonical package manager: \`${pm}\`.`,
      MANAGED_END,
      '',
    ].join('\n');
  }
  const label = kind === 'agents' ? 'AGENTS.md' : 'CLAUDE.md';
  return [
    header.trimEnd(),
    `# Project context (managed)`,
    '',
    `Authoritative context lives in \`.context/\`. Read \`.context/kernel.md\` before any task.`,
    '',
    '- Paths and roles: `.context/repo-map.md`',
    '- Task procedures: `.context/playbooks/`',
    '- Verification probes: `.context/drift-probes.md`',
    '',
    `This \`${label}\` is a thin adapter. Edit \`.context/kernel.md\` and regenerate with \`compile-context.mjs\`; do not add rules here.`,
    footer.trimEnd(),
    '',
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.repo);
  const outDir = path.resolve(args.out);
  if (!(await exists(root))) {
    console.error(`Repository path does not exist: ${root}`);
    process.exit(1);
  }
  if (outDir === root || root.startsWith(`${outDir}${path.sep}`)) {
    console.error('Refusing to write .context outside the repository.',
      'Pass --out with a directory inside or beside the project, not its parent.');
    process.exit(1);
  }

  const budget = { ...DEFAULT_BUDGET };
  if (args.budget) {
    const override = await readJson(path.resolve(args.budget));
    if (override) Object.assign(budget, override);
  }

  const stack = await detectStack(root);
  const discovered = await discoverContextFiles(root);
  const entries = [];
  for (const item of discovered) {
    const text = await readText(path.join(root, item.path));
    if (text) entries.push({ path: item.path, text });
  }
  const sources = entries.map((entry) => ({ path: entry.path, estimatedTokens: estimateTokens(entry.text) }));

  const generatedAt = new Date().toISOString();
  const kernel = buildKernel(stack, budget, entries);
  const repoMap = buildRepoMap(stack, stack.files, generatedAt);

  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(path.join(outDir, 'playbooks'), { recursive: true });

  const kernelTokens = estimateTokens(kernel);
  if (kernelTokens > budget.kernel) {
    console.error(`Kernel is ~${kernelTokens} tokens, above the ${budget.kernel}-token budget even after trimming. Reduce detected facts and retry.`);
    process.exit(1);
  }

  const layers = [];
  await fs.writeFile(path.join(outDir, 'kernel.md'), kernel);
  layers.push({ path: 'kernel.md', estimatedTokens: kernelTokens, budget: budget.kernel, ok: true });

  const mapTokens = estimateTokens(repoMap);
  await fs.writeFile(path.join(outDir, 'repo-map.md'), repoMap);
  layers.push({ path: 'repo-map.md', estimatedTokens: mapTokens, budget: budget.repoMap, ok: mapTokens <= budget.repoMap });

  const playbookScripts = ['build', 'test', 'lint', 'typecheck', 'dev'].filter((name) => stack.scripts[name]);
  for (const script of playbookScripts) {
    const body = buildPlaybook(stack, script, commandFor(stack.packageManager || 'npm', script));
    const tokens = estimateTokens(body);
    await fs.writeFile(path.join(outDir, 'playbooks', `${script}.md`), body);
    layers.push({ path: `playbooks/${script}.md`, estimatedTokens: tokens, budget: budget.playbook, ok: tokens <= budget.playbook });
  }

  const adapters = [];
  if (args.install) {
    const backupDir = path.join(outDir, 'backup');
    const targets = [
      { file: 'CLAUDE.md', kind: 'claude' },
      { file: 'AGENTS.md', kind: 'agents' },
      { file: '.cursor/rules/000-context.mdc', kind: 'cursor' },
    ];
    for (const target of targets) {
      const full = path.join(root, target.file);
      const existing = await readText(full);
      if (existing && !existing.includes(MANAGED_START)) {
        await fs.mkdir(backupDir, { recursive: true });
        const backupPath = path.join(backupDir, target.file.replace(/\//g, '__'));
        await fs.writeFile(backupPath, existing);
      }
      await fs.mkdir(path.dirname(full), { recursive: true });
      const body = adapterBody(target.kind, stack);
      await fs.writeFile(full, body);
      adapters.push({ path: target.file, estimatedTokens: estimateTokens(body) });
    }
  }

  const probes = buildDriftProbes(stack, adapters);
  const probeTokens = estimateTokens(probes);
  await fs.writeFile(path.join(outDir, 'drift-probes.md'), probes);
  layers.push({ path: 'drift-probes.md', estimatedTokens: probeTokens, budget: budget.playbook, ok: probeTokens <= budget.playbook });

  const alwaysOnTokens = kernelTokens + adapters.reduce((sum, a) => sum + a.estimatedTokens, 0);
  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    generator: `context-architect/${TOOL_VERSION}`,
    generatedAt,
    repo: stack.name,
    stack: {
      language: stack.language,
      packageManager: stack.packageManager,
      frameworks: stack.frameworks,
      formatters: stack.formatters,
      testRunners: stack.testRunners,
    },
    budget,
    layers,
    adapters,
    alwaysOnTokens,
    alwaysOnBudget: budget.kernel + budget.adapter * adapters.length,
    sources,
    driftProbes: probes.split(/^## Probe /m).length - 1,
    notes: [
      'Token counts are estimates (~4 characters per token), not tokenizer-exact.',
      alwaysOnTokens <= budget.kernel + budget.adapter * adapters.length
        ? 'Always-on context is within budget.'
        : 'Always-on context exceeds budget; trim adapters.',
    ],
  };
  await fs.writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const summary = {
    repo: root,
    out: outDir,
    kernelTokens,
    alwaysOnTokens,
    layers: layers.length,
    adapters: adapters.map((a) => a.path),
    withinBudget: alwaysOnTokens <= budget.kernel + budget.adapter * adapters.length,
  };
  if (args.json) {
    const out = path.resolve(args.json);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, `${JSON.stringify(summary, null, 2)}\n`);
  }

  console.log(`Compiled context for ${stack.name}: kernel ~${kernelTokens} tokens, always-on ~${alwaysOnTokens} tokens.`);
  console.log(`Wrote ${layers.length} layer(s) to ${outDir}`);
  if (adapters.length) console.log(`Installed adapters: ${adapters.map((a) => a.path).join(', ')}`);
  console.log(summary.withinBudget ? 'Budget check: PASS' : 'Budget check: FAIL — trim adapters or kernel.');
  if (args.install) {
    console.log('Legacy adapters were backed up under .context/backup/ when they lacked the managed marker.');
  }
  if (!summary.withinBudget) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Compile failed: ${error.message}`);
  process.exit(1);
});
