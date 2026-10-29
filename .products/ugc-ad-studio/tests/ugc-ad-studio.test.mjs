import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(root, 'skills', 'ugc-ad-studio');
const buildScript = path.join(skillDir, 'scripts', 'build-ugc-campaign.mjs');
const auditScript = path.join(skillDir, 'scripts', 'audit-ugc-pack.mjs');
const brief = path.join(root, 'examples', 'nara-brief.json');

function run(script, args, options = {}) {
  try {
    const stdout = execFileSync('node', [script, ...args], {
      cwd: skillDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return { code: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      code: error.status ?? 1,
      stdout: error.stdout || '',
      stderr: error.stderr || ''
    };
  }
}

async function tempDir(prefix) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

test('builder produces a complete campaign pack', async () => {
  const out = await tempDir('ugc-build-');
  const result = run(buildScript, [brief, '--out', out, '--json']);
  assert.equal(result.code, 0, result.stderr);
  for (const file of ['campaign.json', 'prompts-video.md', 'prompts-image.md', 'heygen-pack.md', 'scripts.md', 'captions.md', 'compliance.md', 'README.md']) {
    await fs.access(path.join(out, file));
  }
  const pack = JSON.parse(await fs.readFile(path.join(out, 'campaign.json'), 'utf8'));
  assert.equal(pack.meta.angleCount, 6);
  assert.equal(pack.meta.totalVideoPrompts, 30);
  assert.equal(pack.meta.totalImagePrompts, 24);
  assert.equal(pack.meta.duration, 30);
  for (const angle of pack.angles) {
    assert.ok(angle.hook.length > 0);
    assert.ok(angle.beats.length >= 4);
    assert.equal(angle.totalDuration, 30);
    for (const scene of angle.scenes) {
      assert.match(scene.prompt, /9:16/);
      assert.ok(scene.prompt.includes(pack.consistency.characterBlock));
      assert.ok(scene.prompt.includes(pack.consistency.productBlock));
      assert.ok(scene.prompt.includes(pack.consistency.gradeBlock));
      assert.match(scene.prompt, /Negative prompt:/);
      assert.ok(scene.seed > 0);
    }
  }
  await fs.rm(out, { recursive: true, force: true });
});

test('clean pack scores 100/100 and exits 0', async () => {
  const out = await tempDir('ugc-clean-');
  run(buildScript, [brief, '--out', out, '--json']);
  const result = run(auditScript, [path.join(out, 'campaign.json'), '--json=' + path.join(out, 'audit.json'), '--md=' + path.join(out, 'audit.md')]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const report = JSON.parse(await fs.readFile(path.join(out, 'audit.json'), 'utf8'));
  assert.equal(report.score, 100);
  assert.equal(report.verdict, 'PASS');
  assert.equal(report.findings.length, 0);
  const md = await fs.readFile(path.join(out, 'audit.md'), 'utf8');
  assert.match(md, /Score: 100\/100/);
  await fs.rm(out, { recursive: true, force: true });
});

test('broken pack fails loudly with critical findings', async () => {
  const result = run(auditScript, [path.join(root, 'examples', 'broken-pack.json')]);
  assert.equal(result.code, 1);
  assert.match(result.stdout, /DO NOT SHIP/);
  const json = run(auditScript, [path.join(root, 'examples', 'broken-pack.json'), '--json']);
  const report = JSON.parse(json.stdout);
  assert.ok(report.score < 60);
  assert.ok(report.stats.critical >= 5);
  assert.ok(report.findings.some((finding) => finding.id === 'video.character'));
  assert.ok(report.findings.some((finding) => finding.id === 'compliance.bannedClaims'));
  assert.ok(report.findings.some((finding) => finding.id === 'structure.placeholders'));
});

test('--report-only exits 0 on a broken pack', () => {
  const result = run(auditScript, [path.join(root, 'examples', 'broken-pack.json'), '--report-only']);
  assert.equal(result.code, 0);
});

test('builder is deterministic for the same brief and seed', async () => {
  const a = await tempDir('ugc-det-a-');
  const b = await tempDir('ugc-det-b-');
  run(buildScript, [brief, '--out', a, '--json']);
  run(buildScript, [brief, '--out', b, '--json']);
  const left = await fs.readFile(path.join(a, 'campaign.json'), 'utf8');
  const right = await fs.readFile(path.join(b, 'campaign.json'), 'utf8');
  assert.equal(left, right);
  await fs.rm(a, { recursive: true, force: true });
  await fs.rm(b, { recursive: true, force: true });
});

test('15s and cinematic variants also pass the audit', async () => {
  const out = await tempDir('ugc-variants-');
  for (const [name, args] of [
    ['15s', ['--duration', '15']],
    ['45s', ['--duration', '45']],
    ['cinematic', ['--style', 'cinematic-product']]
  ]) {
    const dir = path.join(out, name);
    const build = run(buildScript, [brief, '--out', dir, '--json', ...args]);
    assert.equal(build.code, 0, build.stderr);
    const audit = run(auditScript, [path.join(dir, 'campaign.json')]);
    assert.equal(audit.code, 0, `${name}: ${audit.stdout}${audit.stderr}`);
    assert.match(audit.stdout, /PASS/);
  }
  await fs.rm(out, { recursive: true, force: true });
});

test('builder rejects an incomplete brief with a named field', async () => {
  const out = await tempDir('ugc-bad-');
  const badBrief = path.join(out, 'bad.json');
  await fs.writeFile(badBrief, JSON.stringify({ brand: 'X', product: 'Y' }));
  const result = run(buildScript, [badBrief, '--out', out]);
  assert.equal(result.code, 1);
  assert.match(result.stderr, /missing required fields/i);
  assert.match(result.stderr, /buyer/);
  assert.match(result.stderr, /pain/);
  await fs.rm(out, { recursive: true, force: true });
});

test('scripts expose --help without touching the filesystem', () => {
  assert.match(run(buildScript, ['--help']).stdout, /campaign builder/i);
  assert.match(run(auditScript, ['--help']).stdout, /pack audit/i);
});
