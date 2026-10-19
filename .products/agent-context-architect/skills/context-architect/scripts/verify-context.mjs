#!/usr/bin/env node
/**
 * verify-context — CI gate for a compiled context system.
 *
 * Usage:
 *   node verify-context.mjs <repo> [--context .context] [--json <file>]
 *
 * Exit codes: 0 = all checks passed, 1 = at least one check failed.
 * Checks: layer presence, budget compliance, adapter wiring, stale commands,
 * manifest freshness, drift-probe coverage, and rule conflicts.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  exists,
  readJson,
  readText,
  estimateTokens,
  detectConflicts,
  detectStack,
  discoverContextFiles,
  DEFAULT_BUDGET,
} from './lib.mjs';

function parseArgs(argv) {
  const args = { repo: '.', context: '.context', json: null };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--context') args.context = argv[++i];
    else if (item === '--json') args.json = argv[++i];
    else rest.push(item);
  }
  if (rest[0]) args.repo = rest[0];
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.repo);
  const contextDir = path.isAbsolute(args.context) ? args.context : path.join(root, args.context);
  const report = { checkedAt: new Date().toISOString(), repo: root, passed: [], failures: [], warnings: [] };

  if (!(await exists(contextDir))) {
    report.failures.push(`Missing context directory: ${contextDir}. Run compile-context.mjs first.`);
    finish(report, args);
    return;
  }

  const manifest = await readJson(path.join(contextDir, 'manifest.json'));
  if (!manifest) {
    report.failures.push('Missing or invalid .context/manifest.json. Run compile-context.mjs.');
    finish(report, args);
    return;
  }

  const budget = { ...DEFAULT_BUDGET, ...(manifest.budget || {}) };

  if (!manifest.schemaVersion) report.failures.push('Manifest is missing schemaVersion.');
  if (!Array.isArray(manifest.layers) || !manifest.layers.length) report.failures.push('Manifest lists no layers.');

  let kernelTokens = 0;
  let staleLayers = 0;
  for (const layer of manifest.layers || []) {
    const full = path.join(contextDir, layer.path);
    const text = await readText(full);
    if (!text) {
      report.failures.push(`Layer missing on disk: ${layer.path}`);
      continue;
    }
    const actual = estimateTokens(text);
    if (layer.path === 'kernel.md') kernelTokens = actual;
    const limit = layer.budget || budget.kernel;
    if (actual > limit) {
      report.failures.push(`Layer ${layer.path} is ~${actual} tokens, above its ${limit}-token budget.`);
    } else {
      report.passed.push(`Layer ${layer.path} within budget (~${actual}/${limit} tokens).`);
    }
    if (Math.abs(actual - (layer.estimatedTokens || 0)) > Math.max(5, Math.round(actual * 0.1))) {
      staleLayers += 1;
    }
  }
  if (staleLayers) {
    report.failures.push(`Manifest sizes are stale for ${staleLayers} layer(s). Regenerate with compile-context.mjs.`);
  }

  if (!kernelTokens) report.failures.push('Kernel layer is missing or empty.');

  let adapterTokens = 0;
  for (const adapter of manifest.adapters || []) {
    const full = path.join(root, adapter.path);
    const text = await readText(full);
    if (!text) {
      report.failures.push(`Adapter missing on disk: ${adapter.path}`);
      continue;
    }
    adapterTokens += estimateTokens(text);
    if (!text.includes('.context/kernel.md')) {
      report.failures.push(`Adapter ${adapter.path} does not point at .context/kernel.md.`);
    }
    if (estimateTokens(text) > budget.adapter * 3) {
      report.failures.push(`Adapter ${adapter.path} is bloated (~${estimateTokens(text)} tokens). Keep adapters pointer-only.`);
    }
  }

  const alwaysOn = kernelTokens + adapterTokens;
  const alwaysOnLimit = budget.kernel + budget.adapter * Math.max(1, (manifest.adapters || []).length);
  if (alwaysOn > alwaysOnLimit) {
    report.failures.push(`Always-on context is ~${alwaysOn} tokens, above the ${alwaysOnLimit}-token limit.`);
  } else {
    report.passed.push(`Always-on context within limit (~${alwaysOn}/${alwaysOnLimit} tokens).`);
  }

  const probes = await readText(path.join(contextDir, 'drift-probes.md'));
  if (!probes) {
    report.failures.push('Missing drift-probes.md; verification cannot detect context drift.');
  } else {
    const count = (probes.match(/^## Probe /gm) || []).length;
    if (count < 5) report.failures.push(`drift-probes.md has ${count} probe(s); at least 5 are required.`);
    else report.passed.push(`Drift probes present: ${count}.`);
  }

  const stack = await detectStack(root);
  const kernelText = (await readText(path.join(contextDir, 'kernel.md'))) || '';
  const declared = [...kernelText.matchAll(/\b(?:npm|pnpm|yarn|bun) run ([a-z0-9:_-]+)/gi)].map((m) => m[1]);
  const unknown = [...new Set(declared)].filter((script) => !stack.scripts[script]);
  if (unknown.length) {
    report.failures.push(`Kernel declares script(s) that package.json does not define: ${unknown.join(', ')}.`);
  } else if (declared.length) {
    report.passed.push(`Kernel commands resolve against package.json: ${[...new Set(declared)].join(', ')}.`);
  }

  const ruleTexts = [{ path: '.context/kernel.md', text: kernelText }];
  for (const adapter of manifest.adapters || []) {
    const text = await readText(path.join(root, adapter.path));
    if (text) ruleTexts.push({ path: adapter.path, text });
  }
  const conflicts = detectConflicts(ruleTexts).filter((c) => c.severity === 'critical' || c.severity === 'high');
  if (conflicts.length) {
    for (const conflict of conflicts) report.failures.push(`Unresolved conflict in compiled context: ${conflict.message}`);
  } else {
    report.passed.push('No critical or high-severity rule conflicts in compiled layers.');
  }

  const knownAdapters = new Set((manifest.adapters || []).map((a) => a.path));
  const legacy = (await discoverContextFiles(root)).filter(
    (file) => !knownAdapters.has(file.path) && !file.path.startsWith(args.context.replace(/^\.\//, '')),
  );
  for (const file of legacy) {
    const text = await readText(path.join(root, file.path));
    if (!text) continue;
    const tokens = estimateTokens(text);
    if (tokens > budget.kernel) {
      report.failures.push(`Unmanaged legacy context ${file.path} still loads ~${tokens} tokens. Migrate it into .context/ and delete it.`);
    }
  }
  if (!legacy.length) report.passed.push('No unmanaged legacy context files remain.');

  finish(report, args);
}

async function finish(report, args) {
  const status = report.failures.length ? 'FAIL' : 'PASS';
  console.log(`Context verification: ${status}`);
  for (const item of report.passed) console.log(`  ✓ ${item}`);
  for (const item of report.warnings) console.log(`  ! ${item}`);
  for (const item of report.failures) console.log(`  ✗ ${item}`);
  if (args.json) {
    const out = path.resolve(args.json);
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, `${JSON.stringify({ ...report, status }, null, 2)}\n`);
  }
  process.exitCode = report.failures.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`Verification failed to run: ${error.message}`);
  process.exit(1);
});
