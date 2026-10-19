import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSpec } from '../skills/mcp-server-architect/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = path.join(root, 'skills', 'mcp-server-architect', 'scripts');
const examples = path.join(root, 'examples');
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-kit-test-'));
const specPath = path.join(examples, 'repo-search.spec.json');

function run(script, args, options = {}) {
  const result = spawnSync(process.execPath, [path.join(scripts, script), ...args], { cwd: options.cwd || root, encoding: 'utf8' });
  return { code: result.status, stdout: result.stdout || '', stderr: result.stderr || '' };
}

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('valid spec passes validation and the insecure spec fails with named violations', async () => {
  const valid = JSON.parse(await fs.readFile(specPath, 'utf8'));
  assert.deepEqual(validateSpec(valid), []);
  const bad = JSON.parse(await fs.readFile(path.join(examples, 'insecure-server', 'mcp.spec.json'), 'utf8'));
  const errors = validateSpec(bad);
  assert.ok(errors.some((e) => /destructive/i.test(e)), 'destructive warning required');
  assert.ok(errors.some((e) => /semver/i.test(e)), 'semver required');
  assert.ok(errors.some((e) => /inputSchema\.properties/i.test(e)), 'schema properties required');
});

check('scaffolder rejects an invalid spec', async () => {
  const out = path.join(tmp, 'bad');
  const result = run('scaffold-server.mjs', [path.join(examples, 'insecure-server', 'mcp.spec.json'), '--out', out]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /Spec is invalid/);
  await assert.rejects(fs.stat(out));
});

check('scaffolder generates a runnable server and the smoke test passes', async () => {
  const out = path.join(tmp, 'generated');
  const result = run('scaffold-server.mjs', [specPath, '--out', out]);
  assert.equal(result.code, 0, result.stderr);
  for (const file of ['server.mjs', 'tools.mjs', 'package.json', 'README.md', 'mcp.spec.json', 'test/smoke.test.mjs']) {
    assert.ok(await fs.stat(path.join(out, file)).catch(() => false), `${file} missing`);
  }
  const smoke = spawnSync(process.execPath, [path.join(out, 'test', 'smoke.test.mjs')], { encoding: 'utf8', timeout: 15000 });
  assert.equal(smoke.status, 0, `smoke test failed:\n${smoke.stdout}\n${smoke.stderr}`);
  assert.match(smoke.stdout, /MCP smoke test passed/);
});

check('scaffolded server audits clean and passes the strict gate', async () => {
  const out = path.join(tmp, 'generated');
  const audit = run('audit-server.mjs', [out, '--json', path.join(tmp, 'audit.json')]);
  assert.equal(audit.code, 0, audit.stderr);
  const report = JSON.parse(await fs.readFile(path.join(tmp, 'audit.json'), 'utf8'));
  assert.equal(report.summary.findings, 0, `unexpected findings: ${JSON.stringify(report.findings)}`);
  assert.equal(report.summary.score, 100);
  const verify = run('verify-server.mjs', [out, '--strict']);
  assert.equal(verify.code, 0, verify.stdout);
});

check('insecure server yields the seeded findings and fails the gate', async () => {
  const out = path.join(tmp, 'insecure.json');
  const audit = run('audit-server.mjs', [path.join(examples, 'insecure-server'), '--json', out]);
  assert.equal(audit.code, 0, audit.stderr);
  const report = JSON.parse(await fs.readFile(out, 'utf8'));
  const ids = report.findings.map((item) => item.id);
  for (const expected of ['hardcoded-secret', 'exec-capability', 'secret-logged', 'no-tests', 'spec-invalid']) {
    assert.ok(ids.includes(expected), `missing ${expected}; got ${ids.join(', ')}`);
  }
  assert.equal(report.summary.score, 38);
  const verify = run('verify-server.mjs', [path.join(examples, 'insecure-server')]);
  assert.equal(verify.code, 1);
  assert.match(verify.stdout, /FAIL/);
});

check('scaffolder refuses a non-empty target without --force', async () => {
  const out = path.join(tmp, 'generated');
  const result = run('scaffold-server.mjs', [specPath, '--out', out]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /not empty/i);
  const forced = run('scaffold-server.mjs', [specPath, '--out', out, '--force']);
  assert.equal(forced.code, 0, forced.stderr);
});

check('audit is deterministic', async () => {
  const first = path.join(tmp, 'd1.json');
  const second = path.join(tmp, 'd2.json');
  assert.equal(run('audit-server.mjs', [path.join(examples, 'insecure-server'), '--json', first]).code, 0);
  assert.equal(run('audit-server.mjs', [path.join(examples, 'insecure-server'), '--json', second]).code, 0);
  const a = JSON.parse(await fs.readFile(first, 'utf8'));
  const b = JSON.parse(await fs.readFile(second, 'utf8'));
  assert.deepEqual(a.findings.map((f) => f.id), b.findings.map((f) => f.id));
  assert.equal(a.summary.score, b.summary.score);
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
