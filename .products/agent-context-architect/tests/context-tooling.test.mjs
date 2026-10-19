import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = path.join(root, 'examples', 'messy-repo');
const scripts = path.join(root, 'skills', 'context-architect', 'scripts');
const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'context-architect-test-'));
const estimate = (text) => Math.ceil(text.length / 4);
const homeMarker = ['', 'Users', ''].join('/');

function run(script, args, options = {}) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], {
    cwd: options.cwd || root,
    encoding: 'utf8',
  });
  return { code: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('audit detects seeded conflicts, bloat, duplicates, and stale paths', async () => {
  const jsonPath = path.join(tmpRoot, 'audit.json');
  const result = run('audit-context.mjs', [fixture, '--json', jsonPath]);
  assert.equal(result.code, 0, `audit failed: ${result.stderr}`);
  const report = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const ids = report.findings.map((finding) => finding.id);
  for (const expected of [
    'conflict-package-manager',
    'conflict-quotes',
    'conflict-semicolons',
    'conflict-indentation',
    'oversize-claude-md',
    'stale-path-src-server-api-ts',
  ]) {
    assert.ok(ids.includes(expected), `missing finding ${expected}; got ${ids.join(', ')}`);
  }
  assert.ok(report.findings.filter((f) => f.type === 'duplication').length >= 1, 'no duplicates detected');
  assert.equal(report.summary.contextFiles, 3);
  assert.ok(report.summary.score < 60, 'score should flag the fixture as needs-rework');
  const claude = report.files.find((file) => file.path === 'CLAUDE.md');
  assert.ok(claude.estimatedTokens > 600, 'CLAUDE.md should be measured as oversize');
});

check('audit finding order is deterministic across runs', async () => {
  const first = path.join(tmpRoot, 'audit-a.json');
  const second = path.join(tmpRoot, 'audit-b.json');
  assert.equal(run('audit-context.mjs', [fixture, '--json', first]).code, 0);
  assert.equal(run('audit-context.mjs', [fixture, '--json', second]).code, 0);
  const a = JSON.parse(await fs.readFile(first, 'utf8'));
  const b = JSON.parse(await fs.readFile(second, 'utf8'));
  assert.deepEqual(a.findings.map((f) => f.id), b.findings.map((f) => f.id));
  assert.deepEqual(a.files.map((f) => f.path), b.files.map((f) => f.path));
});

check('audit reports a critical finding when no context files exist', async () => {
  const empty = path.join(tmpRoot, 'empty-repo');
  await fs.mkdir(empty, { recursive: true });
  await fs.writeFile(path.join(empty, 'package.json'), JSON.stringify({ name: 'empty', scripts: {} }));
  const jsonPath = path.join(tmpRoot, 'empty-audit.json');
  assert.equal(run('audit-context.mjs', [empty, '--json', jsonPath]).code, 0);
  const report = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  assert.ok(report.findings.some((f) => f.id === 'no-context-files' && f.severity === 'critical'));
});

check('compile produces a budgeted kernel with resolved style conflicts', async () => {
  const out = path.join(tmpRoot, 'compiled');
  const result = run('compile-context.mjs', [fixture, '--out', out]);
  assert.equal(result.code, 0, `compile failed: ${result.stderr}`);
  const kernel = await fs.readFile(path.join(out, 'kernel.md'), 'utf8');
  assert.ok(estimate(kernel) <= 300, `kernel is ${estimate(kernel)} estimated tokens`);
  assert.ok(kernel.includes('pnpm run test'), 'kernel should use the lockfile package manager');
  assert.ok(!/double[- ]quotes?|single[- ]quotes?|semicolon/i.test(kernel), 'style rules should be delegated to the formatter');
  assert.match(kernel, /migration/i, 'domain boundaries should be carried forward');
  assert.ok(!kernel.includes(homeMarker), 'kernel should not leak absolute paths');

  const manifest = JSON.parse(await fs.readFile(path.join(out, 'manifest.json'), 'utf8'));
  assert.equal(manifest.stack.packageManager, 'pnpm');
  assert.ok(manifest.layers.every((layer) => layer.ok), 'all layers should be within budget');
  assert.ok(manifest.driftProbes >= 5, 'at least five drift probes are required');
  assert.equal(manifest.sources.length, 3);
});

check('install writes pointer-only adapters, backs up originals, and verify passes', async () => {
  const repo = path.join(tmpRoot, 'installed-repo');
  await fs.cp(fixture, repo, { recursive: true });
  const out = path.join(repo, '.context');
  const result = run('compile-context.mjs', [repo, '--out', out, '--install']);
  assert.equal(result.code, 0, `install compile failed: ${result.stderr}`);

  const claude = await fs.readFile(path.join(repo, 'CLAUDE.md'), 'utf8');
  assert.ok(claude.includes('context-architect:managed:begin'), 'managed marker missing');
  assert.ok(claude.includes('.context/kernel.md'), 'adapter must point at the kernel');
  assert.ok(claude.length < 800, 'adapter should stay pointer-only');

  const backup = await fs.readFile(path.join(out, 'backup', 'CLAUDE.md'), 'utf8');
  assert.ok(backup.includes('Indent with 2 spaces'), 'legacy content should be backed up');
  assert.ok(await fs.stat(path.join(repo, '.cursor/rules/000-context.mdc')).catch(() => false), 'cursor adapter missing');

  const verify = run('verify-context.mjs', [repo]);
  assert.equal(verify.code, 0, `verification failed:\n${verify.stdout}${verify.stderr}`);
  assert.match(verify.stdout, /PASS/);
});

check('verify fails while legacy context still loads beside the kernel', async () => {
  const repo = path.join(tmpRoot, 'no-install-repo');
  await fs.cp(fixture, repo, { recursive: true });
  const compiled = run('compile-context.mjs', [repo, '--out', path.join(repo, '.context')]);
  assert.equal(compiled.code, 0, `compile failed: ${compiled.stderr}`);
  const result = run('verify-context.mjs', [repo]);
  assert.equal(result.code, 1, 'verification should fail when the legacy CLAUDE.md still loads');
  assert.match(result.stdout, /Unmanaged legacy context/i);
});

check('verify fails when the kernel exceeds budget, and passes after recompile', async () => {
  const repo = path.join(tmpRoot, 'installed-repo');
  const kernelPath = path.join(repo, '.context', 'kernel.md');
  const original = await fs.readFile(kernelPath, 'utf8');
  const filler = Array.from({ length: 40 }, (_, i) => `- Filler rule ${i} that adds tokens without adding any enforceable instruction to the system.`).join('\n');
  await fs.writeFile(kernelPath, `${original}\n${filler}\n`);

  const failed = run('verify-context.mjs', [repo]);
  assert.equal(failed.code, 1, 'verification should fail on an oversize kernel');
  assert.match(failed.stdout, /budget/i);

  const recompiled = run('compile-context.mjs', [repo, '--out', path.join(repo, '.context')]);
  assert.equal(recompiled.code, 0, `recompile failed: ${recompiled.stderr}`);
  const passed = run('verify-context.mjs', [repo]);
  assert.equal(passed.code, 0, `verification should pass after recompile:\n${passed.stdout}`);
});

check('verify fails when the kernel names a script that package.json does not define', async () => {
  const repo = path.join(tmpRoot, 'installed-repo');
  const pkgPath = path.join(repo, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  delete pkg.scripts.test;
  await fs.writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const result = run('verify-context.mjs', [repo]);
  assert.equal(result.code, 1, 'verification should fail on a stale command');
  assert.match(result.stdout, /does not define/i);

  pkg.scripts.test = 'vitest run';
  await fs.writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  const restored = run('verify-context.mjs', [repo]);
  assert.equal(restored.code, 0, 'verification should pass once the script is restored');
});

let failures = 0;
for (const { name, fn } of checks) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${name}\n    ${error.message}`);
  }
}

await fs.rm(tmpRoot, { recursive: true, force: true });
if (failures) {
  console.error(`\n${failures} functional check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} functional checks passed.`);
