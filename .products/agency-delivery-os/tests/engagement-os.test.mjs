import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = path.join(root, 'skills', 'engagement-os', 'scripts');
const examples = path.join(root, 'examples');
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'engagement-os-test-'));

function run(script, args) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], { cwd: root, encoding: 'utf8' });
  return { code: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('initializer creates a complete scoped workspace', async () => {
  const out = path.join(tmp, 'quote-automation');
  const result = run('init-engagement.mjs', [path.join(examples, 'intake.json'), '--out', out]);
  assert.equal(result.code, 0, result.stderr);
  for (const file of ['engagement.json', 'state.json', 'brief.md', 'scope.md', 'risk.md', 'permissions.md', 'proposal.md', 'delivery-plan.md', 'qa-gates.md', 'handoff.md']) {
    assert.ok(await fs.stat(path.join(out, file)).catch(() => false), `${file} missing`);
  }
  const state = JSON.parse(await fs.readFile(path.join(out, 'state.json'), 'utf8'));
  assert.equal(state.phase, 'scoped');
  assert.equal(state.history.length, 2);
});

check('fresh workspace audits clean and passes strict verification', async () => {
  const out = path.join(tmp, 'quote-automation');
  const audit = run('audit-engagement.mjs', [out, '--json', path.join(tmp, 'audit.json')]);
  assert.equal(audit.code, 0, audit.stderr);
  const report = JSON.parse(await fs.readFile(path.join(tmp, 'audit.json'), 'utf8'));
  assert.equal(report.summary.findings, 0);
  assert.equal(report.summary.score, 100);
  const verify = run('verify-engagement.mjs', [out, '--strict']);
  assert.equal(verify.code, 0, verify.stdout);
});

check('incomplete intake is rejected with named gaps', async () => {
  const out = path.join(tmp, 'rejected');
  const result = run('init-engagement.mjs', [path.join(examples, 'intake-incomplete.json'), '--out', out]);
  assert.equal(result.code, 1);
  for (const gap of ['budgetUsd', 'successMetric', 'deliverables', 'outOfScope', 'constraints']) {
    assert.ok(result.stderr.includes(gap), `missing gap ${gap}`);
  }
  await assert.rejects(fs.stat(out), 'no workspace should be created');
});

check('a placeholder blocks phase advancement and leaves state unchanged', async () => {
  const out = path.join(tmp, 'guarded');
  await fs.cp(path.join(tmp, 'quote-automation'), out, { recursive: true });
  await fs.appendFile(path.join(out, 'scope.md'), '\n- TBD pricing approval\n');
  const result = run('advance-engagement.mjs', [out]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /placeholder/i);
  const state = JSON.parse(await fs.readFile(path.join(out, 'state.json'), 'utf8'));
  assert.equal(state.phase, 'scoped');
});

check('a guarded workspace advances through all phases in order', async () => {
  const out = path.join(tmp, 'flow');
  await fs.cp(path.join(tmp, 'quote-automation'), out, { recursive: true });
  const expected = ['risk-reviewed', 'delivery', 'qa', 'handoff'];
  for (const phase of expected) {
    const result = run('advance-engagement.mjs', [out]);
    assert.equal(result.code, 0, result.stderr);
    const state = JSON.parse(await fs.readFile(path.join(out, 'state.json'), 'utf8'));
    assert.equal(state.phase, phase);
  }
  const final = JSON.parse(await fs.readFile(path.join(out, 'state.json'), 'utf8'));
  assert.deepEqual(final.history.map((entry) => entry.phase), ['discovery', 'scoped', 'risk-reviewed', 'delivery', 'qa', 'handoff']);
  const blocked = run('advance-engagement.mjs', [out]);
  assert.equal(blocked.code, 1);
  assert.match(blocked.stderr, /final phase/i);
});

check('a missing artifact blocks the transition', async () => {
  const out = path.join(tmp, 'missing-artifact');
  await fs.cp(path.join(tmp, 'quote-automation'), out, { recursive: true });
  assert.equal(run('advance-engagement.mjs', [out]).code, 0);
  assert.equal(run('advance-engagement.mjs', [out]).code, 0);
  await fs.rm(path.join(out, 'qa-gates.md'));
  const result = run('advance-engagement.mjs', [out]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing artifact/i);
});

check('verification fails when the QA gate loses the success metric', async () => {
  const out = path.join(tmp, 'metric');
  await fs.cp(path.join(tmp, 'quote-automation'), out, { recursive: true });
  for (let i = 0; i < 3; i += 1) assert.equal(run('advance-engagement.mjs', [out]).code, 0);
  await fs.writeFile(
    path.join(out, 'qa-gates.md'),
    '# QA gates\n\n- Build passes from a clean checkout.\n- All tests pass with no skipped or deleted assertions.\n- Handoff documents the owner, runbook, and rollback steps.\n- No secrets or client data appear in the repository.\n',
  );
  const result = run('verify-engagement.mjs', [out]);
  assert.equal(result.code, 1);
  assert.match(result.stdout, /success metric/i);
});

check('initializer refuses a non-empty directory without --force', async () => {
  const out = path.join(tmp, 'quote-automation');
  const result = run('init-engagement.mjs', [path.join(examples, 'intake.json'), '--out', out]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /not empty/i);
  const forced = run('init-engagement.mjs', [path.join(examples, 'intake.json'), '--out', out, '--force']);
  assert.equal(forced.code, 0, forced.stderr);
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

await fs.rm(tmp, { recursive: true, force: true });
if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed.`);
