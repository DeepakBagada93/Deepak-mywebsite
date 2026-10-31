#!/usr/bin/env node
// GEO Visibility OS — pack builder
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { VERSION, buildPack, scanLocal, scanUrl, siteReadiness } from './lib.mjs';

const HELP = `GEO Visibility OS — pack builder v${VERSION}

Usage:
  node scripts/build-geo-pack.mjs --brief <brief.json> --snapshot <snapshot.json> [options]
  node scripts/build-geo-pack.mjs --brief <brief.json> --dir <site-dir> [options]
  node scripts/build-geo-pack.mjs --brief <brief.json> --url <https://example.com> [options]

Options:
  --brief <file>      Brand brief JSON (required)
  --snapshot <file>   Reuse a prior snapshot.json
  --dir <path>        Scan a local HTML snapshot instead
  --url <url>         Scan a public site instead
  --out <dir>         Output directory (default: geo-pack)
  --agency <name>     Override the agency name in the white-label report
  --max-pages <n>     Maximum pages to scan (default: 10 local, 5 url)
  --allow-private     Allow localhost/private staging URLs (trusted use only)
  --version           Print the version
  --help              Show this help

Exit codes: 0 = pack built, 2 = bad input.
`;

function parseArgs(argv) {
  const out = { brief: null, snapshot: null, dir: null, url: null, out: 'geo-pack', agency: null, maxPages: null, allowPrivate: false, version: false, help: false };
  const value = (index, flag) => {
    const next = argv[index + 1];
    if (next === undefined || next.startsWith('--')) throw new Error(`Missing value for ${flag}.`);
    return next;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--help' || item === '-h') out.help = true;
    else if (item === '--version') out.version = true;
    else if (item === '--allow-private') out.allowPrivate = true;
    else if (item === '--brief') { out.brief = value(i, '--brief'); i += 1; }
    else if (item.startsWith('--brief=')) out.brief = item.slice(8);
    else if (item === '--snapshot') { out.snapshot = value(i, '--snapshot'); i += 1; }
    else if (item.startsWith('--snapshot=')) out.snapshot = item.slice(11);
    else if (item === '--dir') { out.dir = value(i, '--dir'); i += 1; }
    else if (item.startsWith('--dir=')) out.dir = item.slice(6);
    else if (item === '--url') { out.url = value(i, '--url'); i += 1; }
    else if (item.startsWith('--url=')) out.url = item.slice(6);
    else if (item === '--out') { out.out = value(i, '--out'); i += 1; }
    else if (item.startsWith('--out=')) out.out = item.slice(6);
    else if (item === '--agency') { out.agency = value(i, '--agency'); i += 1; }
    else if (item.startsWith('--agency=')) out.agency = item.slice(9);
    else if (item === '--max-pages') { out.maxPages = Number(value(i, '--max-pages')); i += 1; }
    else if (item.startsWith('--max-pages=')) out.maxPages = Number(item.slice(12));
    else throw new Error(`Unknown argument: ${item}`);
  }
  return out;
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  return [columns.join(','), ...rows.map((row) => columns.map((c) => csvCell(row[c])).join(','))].join('\n') + '\n';
}

function promptCsv(prompts) {
  return toCsv(prompts.map((p) => ({
    id: p.id,
    stage: p.stage,
    intent: p.intent,
    platform: p.platform,
    prompt: p.prompt,
    branded: String(p.branded),
    competitor: String(p.competitor),
    runs: p.runs,
    success_signal: p.successSignal
  })), ['id', 'stage', 'intent', 'platform', 'prompt', 'branded', 'competitor', 'runs', 'success_signal']);
}

function roadmapCsv(actions) {
  return toCsv(actions, ['id', 'priority', 'owner', 'effort', 'impact', 'action', 'verification']);
}

function contentBriefMarkdown(briefs, meta) {
  const lines = [`# Content briefs — ${meta.brand}`, '', 'Six answer-first pages mapped to the prompt panel. Replace every evidence line with a verified first-party fact before publishing.', ''];
  for (const brief of briefs) {
    lines.push(`## ${brief.id} — ${brief.title}`, '');
    lines.push(`- **Target prompt:** ${brief.targetPrompt}`);
    lines.push(`- **Stage / intent:** ${brief.stage} / ${brief.intent}`);
    lines.push(`- **Page type:** ${brief.pageType}`);
    lines.push(`- **Suggested URL:** ${brief.urlSuggestion}`);
    lines.push(`- **Word target:** ${brief.wordTarget}`);
    lines.push(`- **CTA:** ${brief.cta}`);
    lines.push('', '**Answer block (first 40–60 words)**', '', brief.answerBlock, '', '**Sections**', '');
    for (const section of brief.sections) {
      lines.push(`### ${section.h2}`, '');
      for (const point of section.points) lines.push(`- ${point}`);
      lines.push('');
    }
    lines.push('**Evidence required**', '');
    for (const item of brief.evidenceRequired) lines.push(`- ${item}`);
    lines.push('', `**Schema:** ${brief.schema.join(', ')}`, '', `**Internal links:** ${brief.internalLinks.join(', ')}`, '', '**Extraction rules**', '');
    for (const item of brief.extractionRules) lines.push(`- ${item}`);
    lines.push('', '**Do not**', '');
    for (const item of brief.doNot) lines.push(`- ${item}`);
    lines.push('');
  }
  return lines.join('\n');
}

function citationMarkdown(citations) {
  const lines = ['# Citation-source plan', '', 'Work the sources where buyers already ask. Every action must be factual, disclosed and allowed by the community rules.', '', '| ID | Source type | Action | KPI | Caution |', '| --- | --- | --- | --- | --- |'];
  for (const c of citations) lines.push(`| ${c.id} | ${c.sourceType} | ${c.action} | ${c.kpi} | ${c.caution} |`);
  lines.push('');
  return lines.join('\n');
}

function measurementMarkdown(measure) {
  const lines = ['# Measurement plan', '', `Baseline: **${measure.baselineDate}** · Re-measure: **${measure.reMeasureDate}**`, '', measure.cadence, '', '## KPIs', '', '| KPI | Definition | Target |', '| --- | --- | --- |'];
  for (const kpi of measure.kpis) lines.push(`| ${kpi.name} | ${kpi.definition} | ${kpi.target} |`);
  lines.push('', '## Sources', '');
  for (const source of measure.sources) lines.push(`- **${source.name}** — ${source.action} _${source.note}_`);
  lines.push('', '## Reporting rules', '');
  for (const rule of measure.reporting) lines.push(`- ${rule}`);
  lines.push('');
  return lines.join('\n');
}

function schemaInstallMarkdown(delivery) {
  return ['# Schema install', '', ...delivery.schemaInstall.map((step, i) => `${i + 1}. ${step}`), '', 'Validate every block before deploy, then re-scan the live page. Schema that does not match visible content is a risk, not a win.', ''].join('\n');
}

function packReadme(meta, readiness, prompts, briefs, roadmap) {
  return [
    `# GEO pack — ${meta.brand}`,
    '',
    `Prepared for ${meta.buyer} in ${meta.city}. Domain: ${meta.domain}. Market: ${meta.market}.`,
    '',
    `- Readiness snapshot: **${readiness}/100** (diagnostic, not a prediction)`,
    `- Prompt panel: **${prompts.length}** prompts`,
    `- Content briefs: **${briefs.length}**`,
    `- Roadmap actions: **${roadmap.length}**`,
    '',
    '## Files',
    '',
    '| File | What it is |',
    '| --- | --- |',
    '| `pack.json` | Single source of truth used by the audit |',
    '| `snapshot.json` | Raw site signals the pack was built from |',
    '| `client-report.md` | White-label report with findings and limits |',
    '| `prompt-panel.csv` | 30 buyer prompts with stage, intent, platform and success signal |',
    '| `content-briefs.md` | Six answer-first content briefs |',
    '| `schema-pack.json` | Copy-paste JSON-LD blocks |',
    '| `schema-install.md` | Placement and validation steps |',
    '| `fix-roadmap.csv` | Prioritized actions with owner, effort and verification |',
    '| `citation-plan.md` | Source map and outreach actions |',
    '| `measurement-plan.md` | Baseline, KPIs and re-measurement |',
    '',
    '## Before you deliver',
    '',
    '1. Replace placeholder evidence with verified first-party facts.',
    '2. Confirm the service area, credentials and pricing language with the client.',
    '3. Run `audit-geo-pack.mjs` and fix every critical and high finding.',
    '4. Read the limits section aloud to the client. This pack does not guarantee citations or revenue.',
    ''
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }
  if (args.version) {
    process.stdout.write(`${VERSION}\n`);
    return;
  }
  if (!args.brief) throw new Error('--brief is required.');
  if (args.maxPages !== null && (!Number.isFinite(args.maxPages) || args.maxPages < 1)) {
    throw new Error('--max-pages must be a positive number.');
  }
  if (args.agency !== null && !args.agency.trim()) throw new Error('--agency must not be empty.');
  if (args.agency !== null) args.agency = args.agency.replace(/[\r\n]+/g, ' ').trim();

  let brief;
  try {
    brief = JSON.parse(await fs.readFile(path.resolve(args.brief), 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read brief ${args.brief}: ${error.message}`);
  }
  if (args.agency) brief.agencyName = args.agency;

  let snapshot;
  if (args.snapshot) {
    try {
      snapshot = JSON.parse(await fs.readFile(path.resolve(args.snapshot), 'utf8'));
    } catch (error) {
      throw new Error(`Cannot read snapshot ${args.snapshot}: ${error.message}`);
    }
  } else if (args.dir) {
    const options = {};
    if (args.maxPages !== null) options.maxPages = args.maxPages;
    snapshot = await scanLocal(args.dir, { ...options, domain: brief.domain });
  } else if (args.url) {
    const options = {};
    if (args.maxPages !== null) options.maxPages = args.maxPages;
    if (args.allowPrivate) options.allowPrivate = true;
    snapshot = await scanUrl(args.url, options);
  } else {
    throw new Error('Pass --snapshot, --dir or --url.');
  }

  if (Array.isArray(brief.primaryPages)) {
    const wanted = new Set(brief.primaryPages.map((p) => String(p).replace(/\/$/, '') || '/'));
    const missing = [...wanted].filter((p) => !snapshot.pages.some((page) => (String(page.path).replace(/\/$/, '') || '/') === p));
    if (missing.length) process.stderr.write(`Warning: primary pages not found in snapshot: ${missing.join(', ')}\n`);
  }

  const pack = buildPack(brief, snapshot);
  const readiness = siteReadiness(pack.snapshot);
  const out = path.resolve(args.out);
  if (out === path.parse(out).root) throw new Error('--out must not be the filesystem root.');
  await fs.mkdir(out, { recursive: true });

  const files = {
    'snapshot.json': JSON.stringify(pack.snapshot, null, 2) + '\n',
    'pack.json': JSON.stringify(pack, null, 2) + '\n',
    'client-report.md': pack.report,
    'prompt-panel.csv': promptCsv(pack.promptPanel),
    'fix-roadmap.csv': roadmapCsv(pack.roadmap),
    'content-briefs.md': contentBriefMarkdown(pack.contentBriefs, pack.meta),
    'schema-pack.json': JSON.stringify(pack.schema, null, 2) + '\n',
    'schema-install.md': schemaInstallMarkdown(pack.delivery),
    'citation-plan.md': citationMarkdown(pack.citations),
    'measurement-plan.md': measurementMarkdown(pack.measurement),
    'README.md': packReadme(pack.meta, readiness, pack.promptPanel, pack.contentBriefs, pack.roadmap)
  };
  for (const [name, body] of Object.entries(files)) await fs.writeFile(path.join(out, name), body);

  process.stdout.write([
    `Built GEO pack for ${pack.meta.brand} — readiness ${readiness}/100`,
    `  pages: ${pack.snapshot.pages.length} · prompts: ${pack.promptPanel.length} · briefs: ${pack.contentBriefs.length} · roadmap: ${pack.roadmap.length}`,
    `  wrote ${Object.keys(files).length} files to ${out}`,
    `  next: node scripts/audit-geo-pack.mjs ${path.join(out, 'pack.json')}`,
    ''
  ].join('\n'));
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(2);
});
