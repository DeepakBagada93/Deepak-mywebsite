import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = path.join(root, 'skills', 'workflow-hardener', 'scripts');
const examples = path.join(root, 'examples');
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'n8n-hardener-test-'));

function run(script, args) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], { cwd: root, encoding: 'utf8' });
  return { code: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('audit reports the seeded production risks', async () => {
  const jsonPath = path.join(tmp, 'audit.json');
  const result = run('audit-workflow.mjs', [path.join(examples, 'lead-intake.workflow.json'), '--json', jsonPath]);
  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(await fs.readFile(jsonPath, 'utf8')).reports[0];
  const ids = report.findings.map((item) => item.id);
  for (const expected of ['inline-secrets', 'missing-error-workflow', 'pinned-data', 'webhook-without-auth', 'no-idempotency-guard', 'orphan-nodes']) {
    assert.ok(ids.includes(expected), `missing ${expected}; got ${ids.join(', ')}`);
  }
  assert.ok(report.summary.score < 30, `score should be low, got ${report.summary.score}`);
  assert.equal(report.summary.critical, 1);
});

check('audit is deterministic across runs', async () => {
  const first = path.join(tmp, 'a.json');
  const second = path.join(tmp, 'b.json');
  assert.equal(run('audit-workflow.mjs', [path.join(examples, 'lead-intake.workflow.json'), '--json', first]).code, 0);
  assert.equal(run('audit-workflow.mjs', [path.join(examples, 'lead-intake.workflow.json'), '--json', second]).code, 0);
  const a = JSON.parse(await fs.readFile(first, 'utf8')).reports[0];
  const b = JSON.parse(await fs.readFile(second, 'utf8')).reports[0];
  assert.deepEqual(a.findings.map((f) => f.id), b.findings.map((f) => f.id));
  assert.equal(a.summary.score, b.summary.score);
});

check('hardener refuses to rewrite a workflow containing inline secrets', async () => {
  const out = path.join(tmp, 'refused.json');
  const result = run('harden-workflow.mjs', [path.join(examples, 'lead-intake.workflow.json'), '--out', out]);
  assert.equal(result.code, 1, 'hardener must refuse when inline secrets exist');
  assert.match(result.stderr, /Refusing to harden/i);
  await assert.rejects(fs.stat(out), 'no output file should be written');
});

check('hardener applies safe patches and raises the score to 100', async () => {
  const out = path.join(tmp, 'orders.hardened.json');
  const result = run('harden-workflow.mjs', [path.join(examples, 'orders-sync.workflow.json'), '--out', out]);
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /Score: 85 → 100/);
  const workflow = JSON.parse(await fs.readFile(out, 'utf8'));
  const fetchNode = workflow.nodes.find((node) => node.name === 'Fetch Orders');
  const dbNode = workflow.nodes.find((node) => node.name === 'Upsert Orders');
  assert.equal(fetchNode.retryOnFail, true);
  assert.equal(fetchNode.maxTries, 3);
  assert.equal(fetchNode.parameters.options.timeout, 30000);
  assert.equal(dbNode.retryOnFail, true);
  assert.equal(workflow.settings.executionOrder, 'v1');
});

check('verify blocks the unsafe workflow and passes the hardened outputs', async () => {
  const dirty = run('verify-workflow.mjs', [path.join(examples, 'lead-intake.workflow.json')]);
  assert.equal(dirty.code, 1);
  assert.match(dirty.stdout, /VERDICT: FAIL/);

  const clean = run('verify-workflow.mjs', [path.join(examples, 'lead-intake-clean.workflow.json')]);
  assert.equal(clean.code, 0, clean.stdout);
  assert.match(clean.stdout, /VERDICT: PASS/);

  const hardened = path.join(tmp, 'orders.hardened.json');
  const strict = run('verify-workflow.mjs', [hardened, '--strict']);
  assert.equal(strict.code, 0, strict.stdout);
});

check('directory mode audits every workflow in a folder', async () => {
  const dir = path.join(tmp, 'workflows');
  await fs.mkdir(dir, { recursive: true });
  for (const file of ['lead-intake.workflow.json', 'orders-sync.workflow.json', 'lead-intake-clean.workflow.json']) {
    await fs.copyFile(path.join(examples, file), path.join(dir, file));
  }
  const out = path.join(tmp, 'dir.json');
  const result = run('audit-workflow.mjs', [dir, '--json', out]);
  assert.equal(result.code, 0, result.stderr);
  const report = JSON.parse(await fs.readFile(out, 'utf8'));
  assert.equal(report.reports.length, 3);
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
