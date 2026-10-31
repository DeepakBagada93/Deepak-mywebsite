import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  AI_BOTS,
  auditPack,
  botAccess,
  buildPack,
  normalizeStartUrl,
  parseRobots,
  scanLocal,
  scanUrl,
  siteReadiness,
  validateBrief
} from '../skills/geo-visibility-os/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillDir = path.join(root, 'skills', 'geo-visibility-os');
const scanScript = path.join(skillDir, 'scripts', 'scan-site.mjs');
const buildScript = path.join(skillDir, 'scripts', 'build-geo-pack.mjs');
const auditScript = path.join(skillDir, 'scripts', 'audit-geo-pack.mjs');
const siteDir = path.join(root, 'examples', 'pulse-dental-site');
const briefPath = path.join(root, 'examples', 'pulse-dental-brief.json');
const cleanPackPath = path.join(root, 'examples', 'pulse-dental-pack', 'pack.json');
const brokenPackPath = path.join(root, 'examples', 'broken-pack.json');

function run(script, args) {
  try {
    const stdout = execFileSync('node', [script, ...args], {
      cwd: skillDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    return { code: 0, stdout, stderr: '' };
  } catch (error) {
    return { code: error.status ?? 1, stdout: error.stdout || '', stderr: error.stderr || '' };
  }
}

async function tempDir(prefix) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

test('scanner reads the local fixture and scores its readiness', async () => {
  const snapshot = await scanLocal(siteDir, { domain: 'pulsedental.example' });
  assert.equal(snapshot.pages.length, 3);
  assert.equal(snapshot.site.robotsTxt, true);
  assert.equal(snapshot.site.sitemapPresent, true);
  assert.equal(snapshot.site.blockedBots.length, 0);
  for (const bot of AI_BOTS) assert.equal(snapshot.site.aiBots[bot.id].allowed, true, bot.id);
  assert.equal(siteReadiness(snapshot), 100);
  const paths = snapshot.pages.map((page) => page.path).sort();
  assert.deepEqual(paths, ['/', '/about', '/services/veneers']);
  for (const page of snapshot.pages) {
    assert.ok(page.wordCount >= 400, `${page.path} is thin`);
    assert.ok(page.questionHeadings >= 2, `${page.path} lacks question headings`);
    assert.ok(page.answerFirstWords >= 40, `${page.path} lacks an answer-first summary`);
    assert.ok(page.canonical, `${page.path} lacks a canonical`);
  }
});

test('robots parser distinguishes wildcard blocks and named allows', () => {
  const blocked = parseRobots('User-agent: *\nDisallow: /\n');
  assert.equal(botAccess(blocked, 'GPTBot').allowed, false);
  const split = parseRobots([
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: *',
    'Disallow: /private'
  ].join('\n'));
  assert.equal(botAccess(split, 'GPTBot').allowed, false);
  assert.equal(botAccess(split, 'OAI-SearchBot').allowed, true);
  assert.equal(botAccess(split, 'PerplexityBot').allowed, true);
});

test('builder is deterministic and produces the full prompt panel', async () => {
  const brief = JSON.parse(await fs.readFile(briefPath, 'utf8'));
  const snapshot = await scanLocal(siteDir, { domain: brief.domain });
  const first = buildPack(brief, snapshot);
  const second = buildPack(JSON.parse(JSON.stringify(brief)), JSON.parse(JSON.stringify(snapshot)));
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.equal(first.promptPanel.length, 30);
  assert.deepEqual([...new Set(first.promptPanel.map((p) => p.stage))].sort(), ['awareness', 'branded', 'comparison', 'decision', 'objection']);
  assert.ok(first.promptPanel.some((p) => p.branded));
  assert.ok(first.promptPanel.some((p) => !p.branded));
  assert.ok(first.promptPanel.some((p) => p.competitor));
  assert.ok(first.promptPanel.every((p) => p.platform && p.runs === 3 && p.successSignal));
});

test('builder produces six briefs, five schema blocks and a 25+ action roadmap', async () => {
  const brief = JSON.parse(await fs.readFile(briefPath, 'utf8'));
  const snapshot = await scanLocal(siteDir, { domain: brief.domain });
  const pack = buildPack(brief, snapshot);
  assert.equal(pack.contentBriefs.length, 6);
  for (const contentBrief of pack.contentBriefs) {
    assert.ok(contentBrief.targetPrompt);
    assert.ok(contentBrief.answerBlock.length > 120);
    assert.ok(contentBrief.evidenceRequired.length >= 3);
    assert.ok(contentBrief.sections.length >= 6);
  }
  assert.deepEqual(Object.keys(pack.schema).sort(), ['article', 'breadcrumb', 'faq', 'organization', 'service']);
  for (const block of Object.values(pack.schema)) {
    assert.equal(block['@context'], 'https://schema.org');
    assert.ok(block['@type']);
  }
  assert.ok(pack.roadmap.length >= 25);
  assert.ok(pack.roadmap.some((action) => action.priority === 'P0'));
  assert.ok(pack.roadmap.every((action) => action.owner && action.effort && action.verification));
  assert.ok(pack.citations.length >= 8);
  assert.ok(pack.measurement.sources.some((source) => /Search Console/i.test(source.name)));
  assert.match(pack.delivery.llmsTxtNote, /optional/i);
});

test('clean pack audits at 100/100 PASS with all 40 checks', async () => {
  const pack = JSON.parse(await fs.readFile(cleanPackPath, 'utf8'));
  const report = auditPack(pack);
  assert.equal(report.score, 100);
  assert.equal(report.verdict, 'PASS');
  assert.equal(report.stats.checks, 40);
  assert.equal(report.stats.passed, 40);
  assert.equal(report.findings.length, 0);
});

test('broken pack fails below 60 with at least five critical findings', async () => {
  const pack = JSON.parse(await fs.readFile(brokenPackPath, 'utf8'));
  const report = auditPack(pack);
  assert.equal(report.verdict, 'DO NOT SHIP');
  assert.ok(report.score < 60, `score was ${report.score}`);
  assert.ok(report.stats.critical >= 5, `critical was ${report.stats.critical}`);
  const ids = report.findings.map((finding) => finding.id);
  for (const id of ['structure.identity', 'structure.placeholders', 'citation.ethics', 'delivery.report', 'delivery.limits']) {
    assert.ok(ids.includes(id), `missing critical finding ${id}`);
  }
});

test('a pack without limits cannot pass', async () => {
  const pack = JSON.parse(await fs.readFile(cleanPackPath, 'utf8'));
  pack.delivery.limits = [];
  const report = auditPack(pack);
  assert.equal(report.verdict, 'DO NOT SHIP');
  assert.ok(report.findings.some((finding) => finding.id === 'delivery.limits' && finding.severity === 'critical'));
});

test('CLI exits 0 for PASS, 1 for failures and keeps JSON-only output clean', async () => {
  const out = await tempDir('geo-audit-');
  const pass = run(auditScript, [cleanPackPath, `--json=${path.join(out, 'pass.json')}`, `--md=${path.join(out, 'pass.md')}`]);
  assert.equal(pass.code, 0, pass.stderr);
  assert.match(pass.stdout, /score 100\/100/);
  assert.match(pass.stdout, /Ready to deliver/);

  const fail = run(auditScript, [brokenPackPath]);
  assert.equal(fail.code, 1);
  assert.match(fail.stdout, /DO NOT SHIP/);

  const streamed = run(auditScript, [cleanPackPath, '--json=-']);
  assert.equal(streamed.code, 0, streamed.stderr);
  const parsed = JSON.parse(streamed.stdout);
  assert.equal(parsed.verdict, 'PASS');
  assert.doesNotMatch(streamed.stdout, /Ready to deliver/);
  await fs.rm(out, { recursive: true, force: true });
});

test('CLI scan and build round-trip into an auditable pack', async () => {
  const out = await tempDir('geo-build-');
  const snapshotPath = path.join(out, 'snapshot.json');
  const scan = run(scanScript, ['--dir', siteDir, '--domain', 'pulsedental.example', '--out', snapshotPath]);
  assert.equal(scan.code, 0, scan.stderr);
  assert.match(scan.stdout, /readiness 100\/100/);

  const packDir = path.join(out, 'pack');
  const build = run(buildScript, ['--brief', briefPath, '--snapshot', snapshotPath, '--out', packDir]);
  assert.equal(build.code, 0, build.stderr);
  for (const file of ['snapshot.json', 'pack.json', 'client-report.md', 'prompt-panel.csv', 'fix-roadmap.csv', 'content-briefs.md', 'schema-pack.json', 'schema-install.md', 'citation-plan.md', 'measurement-plan.md', 'README.md']) {
    await fs.access(path.join(packDir, file));
  }
  const audit = run(auditScript, [path.join(packDir, 'pack.json')]);
  assert.equal(audit.code, 0, audit.stderr);
  assert.match(audit.stdout, /score 100\/100/);
  await fs.rm(out, { recursive: true, force: true });
});

test('robots parser honours wildcards, end anchors and allow tie-breaks', () => {
  const robots = parseRobots([
    'User-agent: *',
    'Disallow: /private',
    'Allow: /private/public',
    'Disallow: /*.pdf$',
    'Allow: /',
    'Disallow: /'
  ].join('\n'));
  assert.equal(botAccess(robots, 'GPTBot', '/').allowed, true);
  assert.equal(botAccess(robots, 'GPTBot', '/private').allowed, false);
  assert.equal(botAccess(robots, 'GPTBot', '/private/public/page').allowed, true);
  assert.equal(botAccess(robots, 'GPTBot', '/guide.pdf').allowed, false);
  assert.equal(botAccess(robots, 'GPTBot', '/guide.html').allowed, true);
});

test('URL safety rejects local, private and non-http targets', () => {
  assert.throws(() => normalizeStartUrl('file:///etc/passwd'), /http/i);
  assert.throws(() => normalizeStartUrl('ftp://example.com/file'), /http/i);
  assert.throws(() => normalizeStartUrl('http://localhost:3000'), /localhost/i);
  assert.throws(() => normalizeStartUrl('http://127.0.0.1/'), /private|loopback/i);
  assert.throws(() => normalizeStartUrl('http://10.0.0.5/'), /private|loopback/i);
  assert.throws(() => normalizeStartUrl('http://192.168.1.20/'), /private|loopback/i);
  assert.throws(() => normalizeStartUrl('http://169.254.169.254/latest/meta-data'), /private|loopback/i);
  assert.throws(() => normalizeStartUrl('http://[::1]/'), /private|loopback/i);
  assert.equal(normalizeStartUrl('https://example.com/path?q=1#section').toString(), 'https://example.com/path?q=1');
  assert.equal(normalizeStartUrl('http://127.0.0.1:8080/staging', { allowPrivate: true }).toString(), 'http://127.0.0.1:8080/staging');
});

test('brief validation rejects malformed input and normalises safe values', async () => {
  const base = JSON.parse(await fs.readFile(briefPath, 'utf8'));
  assert.throws(() => validateBrief({ ...base, buyer: '' }), /buyer/i);
  assert.throws(() => validateBrief({ ...base, domain: 'https://example.com/path' }), /bare hostname/i);
  assert.throws(() => validateBrief({ ...base, platforms: ['chatgpt'] }), /at least four/i);
  assert.throws(() => validateBrief({ ...base, platforms: ['chatgpt', 'perplexity', 'google_ai', 'not_an_engine'] }), /unsupported/i);
  assert.throws(() => validateBrief({ ...base, vertical: 'unknown' }), /vertical/i);
  assert.throws(() => validateBrief({ ...base, baselineDate: '2026-13-99' }), /baselineDate/i);
  const clean = validateBrief({ ...base, brand: '  Pulse Dental Studio  ', domain: 'https://PulseDental.example/' });
  assert.equal(clean.brand, 'Pulse Dental Studio');
  assert.equal(clean.domain, 'pulsedental.example');
  assert.equal(clean.platforms.length, 6);
});

test('URL scanner starts at the requested path, follows absolute links and reads the sitemap', async () => {
  let port = 0;
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === '/robots.txt') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end('User-agent: *\nAllow: /\n');
      return;
    }
    if (url.pathname === '/sitemap.xml') {
      res.writeHead(200, { 'content-type': 'application/xml' });
      res.end(`<urlset><url><loc>http://127.0.0.1:${port}/services</loc></url></urlset>`);
      return;
    }
    const pages = {
      '/start': '<title>Start page</title><h1>Start</h1><p>This is a sufficiently long answer-first paragraph for the scanner to read from the start page.</p><a href="/about">About</a><a href="http://127.0.0.1:PORT/services">Services</a><a href="https://example.com/external">External</a>',
      '/about': '<title>About page</title><h1>About</h1><p>This is a sufficiently long answer-first paragraph for the scanner to read from the about page.</p>',
      '/services': '<title>Services page</title><h1>Services</h1><p>This is a sufficiently long answer-first paragraph for the scanner to read from the services page.</p>'
    };
    if (pages[url.pathname]) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(pages[url.pathname].replaceAll('PORT', String(port)));
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
  try {
    const snapshot = await scanUrl(`http://127.0.0.1:${port}/start`, { allowPrivate: true, maxPages: 5 });
    assert.equal(snapshot.site.robotsTxt, true);
    assert.equal(snapshot.site.sitemapPresent, true);
    assert.equal(snapshot.site.blockedBots.length, 0);
    assert.equal(snapshot.pages[0].path, '/start');
    assert.deepEqual(snapshot.pages.map((page) => page.path).sort(), ['/about', '/services', '/start']);
    assert.ok(snapshot.pages[0].externalLinks.includes('https://example.com/external'));
    assert.ok(snapshot.pages[0].internalLinks.includes('/services'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('URL scanner rejects non-text responses and oversized pages', async () => {
  let port = 0;
  const huge = Buffer.alloc(6 * 1024 * 1024, 'a');
  const server = http.createServer((req, res) => {
    if (req.url === '/image') {
      res.writeHead(200, { 'content-type': 'image/png' });
      res.end('not html');
      return;
    }
    if (req.url === '/huge') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(huge);
      return;
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
  try {
    await assert.rejects(scanUrl(`http://127.0.0.1:${port}/image`, { allowPrivate: true }), /Unsupported content type/);
    await assert.rejects(scanUrl(`http://127.0.0.1:${port}/huge`, { allowPrivate: true }), /exceeds|fetch failed|terminated/i);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('audit CLI validates flags, creates output directories and rejects malformed packs', async () => {
  const out = await tempDir('geo-cli-');
  const nested = path.join(out, 'nested', 'audit');
  try {
    const pass = run(auditScript, [cleanPackPath, `--json=${nested}.json`, `--md=${nested}.md`, '--min', '90']);
    assert.equal(pass.code, 0, pass.stderr);
    await fs.access(`${nested}.json`);
    await fs.access(`${nested}.md`);

    const badMin = run(auditScript, [cleanPackPath, '--min', '101']);
    assert.equal(badMin.code, 2);

    const conflict = run(auditScript, [cleanPackPath, '--json=-', '--md=-']);
    assert.equal(conflict.code, 2);

    const invalid = path.join(out, 'invalid.json');
    await fs.writeFile(invalid, '{}\n');
    const malformed = run(auditScript, [invalid]);
    assert.equal(malformed.code, 2);
    assert.match(malformed.stderr, /meta object/i);
  } finally {
    await fs.rm(out, { recursive: true, force: true });
  }
});
