#!/usr/bin/env node
/**
 * audit-context — deterministic audit of a repository's AI context files.
 *
 * Usage:
 *   node audit-context.mjs <repo> [--json <file>] [--md <file>] [--budget <file>]
 *
 * Exit codes: 0 = audit completed (regardless of score), 1 = audit could not run.
 * The audit never modifies the target repository.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  SCHEMA_VERSION,
  DEFAULT_BUDGET,
  discoverContextFiles,
  readText,
  readJson,
  exists,
  estimateTokens,
  detectConflicts,
  detectDuplicates,
  detectSoftPhrases,
  findStalePaths,
  detectStack,
  extractRuleLines,
  scoreFindings,
  verdictFor,
  sortFindings,
} from './lib.mjs';

function parseArgs(argv) {
  const args = { repo: null, json: null, md: null, budget: null };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--json') args.json = argv[++i];
    else if (item === '--md') args.md = argv[++i];
    else if (item === '--budget') args.budget = argv[++i];
    else rest.push(item);
  }
  args.repo = rest[0] || '.';
  return args;
}

function finding(id, type, severity, message, evidence, fix) {
  return { id, type, severity, message, evidence: evidence || [], fix };
}

function markdownReport(report) {
  const lines = [];
  lines.push('# Context audit report');
  lines.push('');
  lines.push(`- Repository: \`${report.repo}\``);
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Context files: ${report.summary.contextFiles}`);
  lines.push(`- Estimated context tokens: ${report.summary.estimatedTokens} (budget ${report.summary.budgetTokens})`);
  lines.push(`- Findings: ${report.summary.findings}`);
  lines.push(`- Score: ${report.summary.score}/100 (${report.summary.verdict})`);
  lines.push('');
  lines.push('> Token counts are estimates (~4 characters per token), not tokenizer-exact.');
  lines.push('');
  lines.push('## Files');
  lines.push('');
  lines.push('| File | Est. tokens | Rules |');
  lines.push('| --- | ---: | ---: |');
  for (const file of report.files) {
    lines.push(`| \`${file.path}\` | ${file.estimatedTokens} | ${file.rules} |`);
  }
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  if (!report.findings.length) {
    lines.push('No findings. The context layer is within budget and internally consistent.');
  }
  for (const item of report.findings) {
    lines.push(`### [${item.severity.toUpperCase()}] ${item.message}`);
    lines.push('');
    lines.push(`- Type: \`${item.type}\` (\`${item.id}\`)`);
    if (item.evidence.length) {
      for (const ev of item.evidence.slice(0, 6)) {
        lines.push(`- Evidence: \`${ev.path}\` line ${ev.line} — ${String(ev.raw).slice(0, 160)}`);
      }
      if (item.evidence.length > 6) lines.push(`- Evidence: ${item.evidence.length - 6} more occurrence(s) in the JSON report`);
    }
    lines.push(`- Fix: ${item.fix}`);
    lines.push('');
  }
  lines.push('## Next step');
  lines.push('');
  lines.push('Run `compile-context.mjs` to generate a budgeted `.context/` system, then `verify-context.mjs` to gate it in CI.');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.repo);
  if (!(await exists(root))) {
    console.error(`Repository path does not exist: ${root}`);
    process.exit(1);
  }

  const budget = { ...DEFAULT_BUDGET };
  if (args.budget) {
    const override = await readJson(path.resolve(args.budget));
    if (override) Object.assign(budget, override);
  }

  const discovered = await discoverContextFiles(root);
  const stack = await detectStack(root);
  const findings = [];

  if (!discovered.length) {
    findings.push(
      finding(
        'no-context-files',
        'structure',
        'critical',
        'No AI context files were found. Agents are guessing at conventions.',
        [],
        'Run compile-context.mjs to generate a .context/ system and install adapters for your clients.',
      ),
    );
  }

  const entries = [];
  for (const item of discovered) {
    const text = await readText(path.join(root, item.path));
    if (!text) continue;
    entries.push({ path: item.path, kind: item.kind, text });
  }

  const conflicts = detectConflicts(entries);
  findings.push(...conflicts);

  const duplicates = detectDuplicates(entries);
  duplicates.slice(0, 10).forEach((dup, index) => {
    findings.push(
      finding(
        `duplicate-rule-${index + 1}`,
        'duplication',
        'medium',
        `The same rule appears in ${new Set(dup.locations.map((l) => l.path)).size} files; duplicated rules drift apart.`,
        dup.locations.map((l) => ({ path: l.path, line: l.line, raw: l.raw })),
        'Keep the rule in exactly one layer (usually the kernel) and delete the copies.',
      ),
    );
  });

  const stale = await findStalePaths(root, entries);
  const uniqueMissing = new Map();
  for (const miss of stale.missing) {
    if (!uniqueMissing.has(miss.candidate)) uniqueMissing.set(miss.candidate, miss);
  }
  for (const [candidate, miss] of uniqueMissing) {
    findings.push(
      finding(
        `stale-path-${candidate.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
        'staleness',
        'medium',
        `Context references \`${candidate}\`, which does not exist in the repository.`,
        [{ path: miss.path, line: miss.line, raw: miss.raw }],
        'Remove the reference or update it to the current path.',
      ),
    );
  }

  const softHits = detectSoftPhrases(entries.map((e) => e.text).join('\n'));
  if (softHits.length) {
    findings.push(
      finding(
        'soft-instructions',
        'specificity',
        softHits.length > 5 ? 'medium' : 'low',
        `${softHits.length} instruction(s) are unenforceable ("write clean code", "as needed").`,
        softHits.slice(0, 6).map((hit) => ({ path: 'context files', line: hit.line, raw: hit.raw })),
        'Replace each soft phrase with an observable check: a command, a file path, or a forbidden action.',
      ),
    );
  }

  const fileReports = entries.map((entry) => {
    const tokens = estimateTokens(entry.text);
    if (tokens > budget.kernel) {
      findings.push(
        finding(
          `oversize-${entry.path.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
          'budget',
          tokens > budget.kernel * 2 ? 'critical' : 'high',
          `\`${entry.path}\` loads ~${tokens} tokens on every session (kernel budget: ${budget.kernel}).`,
          [{ path: entry.path, line: 1, raw: `${entry.text.length} characters` }],
          'Move task-specific detail into an on-demand playbook; keep always-on rules in the kernel only.',
        ),
      );
    }
    return {
      path: entry.path,
      bytes: Buffer.byteLength(entry.text, 'utf8'),
      estimatedTokens: tokens,
      rules: extractRuleLines(entry.text).length,
    };
  });

  const totalTokens = fileReports.reduce((sum, file) => sum + file.estimatedTokens, 0);
  if (totalTokens > budget.total) {
    findings.push(
      finding(
        'total-budget-exceeded',
        'budget',
        'high',
        `Total context is ~${totalTokens} tokens against a ${budget.total}-token budget.`,
        [],
        'Compile a layered system: small kernel, generated repo map, task playbooks loaded on demand.',
      ),
    );
  }

  const combinedText = entries.map((e) => e.text).join('\n');
  const commandPattern = /\b(?:npm|pnpm|yarn|bun)\s+run\s+[a-z:-]+|\bmake\s+[a-z:-]+|\b(?:cargo|go|pytest|python)\b[^\n]{0,30}/i;
  const missingSections = [];
  if (!commandPattern.test(combinedText)) missingSections.push('commands (build/test/lint)');
  if (!/\b(never|do not|don't|must not|forbidden)\b/i.test(combinedText)) missingSections.push('boundaries (what the agent must not do)');
  if (!/\b(convention|style|prefer|standard)\b/i.test(combinedText)) missingSections.push('conventions');
  if (missingSections.length) {
    findings.push(
      finding(
        'missing-sections',
        'coverage',
        'medium',
        `Context is missing: ${missingSections.join(', ')}.`,
        [],
        'Add the missing category to the kernel; keep each entry to one observable statement.',
      ),
    );
  }

  if (stack.packageManager) {
    const mentioned = new Set();
    for (const family of [{ id: 'package-manager', values: ['npm', 'pnpm', 'yarn', 'bun'] }]) {
      for (const value of family.values) {
        const re = new RegExp(`\\b${value}\\b`, 'i');
        if (re.test(combinedText)) mentioned.add(value);
      }
    }
    if (mentioned.size === 1 && !mentioned.has(stack.packageManager)) {
      findings.push(
        finding(
          'stack-mismatch-package-manager',
          'staleness',
          'high',
          `Context instructs \`${[...mentioned][0]}\` but the lockfile shows \`${stack.packageManager}\`.`,
          [],
          `Update every command to \`${stack.packageManager}\`, or delete the command block and let the kernel own it.`,
        ),
      );
    }
  }

  const sorted = sortFindings(findings);
  const score = scoreFindings(sorted);

  const report = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    repo: root,
    tokenEstimator: 'characters/4 (approximation, not tokenizer-exact)',
    budget,
    summary: {
      contextFiles: fileReports.length,
      estimatedTokens: totalTokens,
      budgetTokens: budget.total,
      findings: sorted.length,
      score,
      verdict: verdictFor(score),
    },
    stack: {
      name: stack.name,
      language: stack.language,
      packageManager: stack.packageManager,
      frameworks: stack.frameworks,
      formatters: stack.formatters,
      testRunners: stack.testRunners,
      scripts: Object.keys(stack.scripts),
    },
    files: fileReports,
    findings: sorted,
  };

  if (args.json) {
    const out = path.resolve(args.json);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, `${JSON.stringify(report, null, 2)}\n`);
  }
  if (args.md) {
    const out = path.resolve(args.md);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, markdownReport(report));
  }

  console.log(`Context audit: ${report.summary.contextFiles} file(s), ~${totalTokens} tokens, ${sorted.length} finding(s), score ${score}/100 (${report.summary.verdict}).`);
  for (const item of sorted) console.log(`  [${item.severity}] ${item.message}`);
  if (args.json) console.log(`JSON written to ${path.resolve(args.json)}`);
  if (args.md) console.log(`Markdown written to ${path.resolve(args.md)}`);
}

main().catch((error) => {
  console.error(`Audit failed: ${error.message}`);
  process.exit(1);
});
