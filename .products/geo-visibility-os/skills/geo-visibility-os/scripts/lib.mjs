// GEO Visibility OS — core engine (zero dependencies)
import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { promises as fs } from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';

export const VERSION = '1.1.0';
export const PLATFORMS = ['chatgpt', 'perplexity', 'google_ai', 'gemini', 'copilot', 'claude'];
export const STAGES = ['awareness', 'comparison', 'decision', 'objection', 'branded'];
export const STYLE_PRESETS = ['local_service', 'b2b_saas', 'ecommerce', 'professional'];

const MAX_LOCAL_PAGES = 50;
const MAX_URL_PAGES = 10;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;
const MAX_REDIRECTS = 5;
const USER_AGENT = 'GEO-Visibility-OS/1.1 (+audit; contact site owner)';

export const AI_BOTS = [
  { id: 'GPTBot', owner: 'OpenAI', job: 'training', weight: 'training' },
  { id: 'OAI-SearchBot', owner: 'OpenAI', job: 'search', weight: 'search' },
  { id: 'ChatGPT-User', owner: 'OpenAI', job: 'user fetch', weight: 'search' },
  { id: 'ClaudeBot', owner: 'Anthropic', job: 'training', weight: 'training' },
  { id: 'Claude-SearchBot', owner: 'Anthropic', job: 'search', weight: 'search' },
  { id: 'PerplexityBot', owner: 'Perplexity', job: 'search', weight: 'search' },
  { id: 'Google-Extended', owner: 'Google', job: 'Gemini training control', weight: 'training' },
  { id: 'Applebot-Extended', owner: 'Apple', job: 'Apple Intelligence control', weight: 'training' },
  { id: 'CCBot', owner: 'Common Crawl', job: 'open dataset', weight: 'training' }
];

export const SOURCE_TYPES = {
  local_service: [
    'Google Business Profile',
    'review platforms in the category',
    'local news and city publications',
    'chamber of commerce and local directories',
    'health or trade directories',
    'community forums and local subreddits',
    'podcasts and local YouTube shows',
    'partner and referral pages',
    'comparison and best-of listicles',
    'professional association pages'
  ],
  b2b_saas: [
    'G2 and Capterra category pages',
    'Reddit and niche communities',
    'industry newsletters',
    'podcasts and webinars',
    'comparison and alternatives pages',
    'review round-ups',
    'partner and integration directories',
    'analyst and research mentions',
    'conference and association pages',
    'LinkedIn creator posts'
  ],
  ecommerce: [
    'Trustpilot and category review sites',
    'expert and editor round-ups',
    'Reddit and hobby communities',
    'YouTube reviews and tutorials',
    'retail partner pages',
    'marketplace product pages',
    'comparison and buying guides',
    'podcasts and creator newsletters',
    'PR and launch coverage',
    'brand community and UGC pages'
  ],
  professional: [
    'industry directories and associations',
    'review platforms',
    'trade publications',
    'Reddit and professional communities',
    'podcasts and webinars',
    'conference speaker pages',
    'partner and referral pages',
    'local and national media',
    'comparison and best-of lists',
    'LinkedIn and newsletter mentions'
  ]
};

export const AUDIT_CLASSES = {
  structure: 8,
  crawl: 16,
  entity: 14,
  content: 18,
  citation: 12,
  prompt: 12,
  measurement: 10,
  delivery: 10
};

const PLACEHOLDER = /\{\{[a-z0-9_]+\}\}|\bTODO\b|\bTBD\b|lorem ipsum/i;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requireText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Brief field "${field}" must be a non-empty string.`);
  return value.trim();
}

function optionalStringArray(value, field) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || !item.trim())) {
    throw new Error(`Brief field "${field}" must be an array of non-empty strings.`);
  }
  return [...new Set(value.map((item) => item.trim()))];
}

function optionalDate(value, field) {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !DATE_ONLY.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`Brief field "${field}" must be a valid YYYY-MM-DD date.`);
  }
  return value;
}

export function validateBrief(input) {
  if (!isPlainObject(input)) throw new Error('Brief must be a JSON object.');
  const brief = { ...input };
  for (const field of ['brand', 'domain', 'category', 'buyer']) brief[field] = requireText(brief[field], field);

  let domainUrl;
  try {
    const rawDomain = /^https?:\/\//i.test(brief.domain) ? brief.domain : `https://${brief.domain}`;
    domainUrl = new URL(rawDomain);
  } catch {
    throw new Error('Brief field "domain" must be a bare hostname such as example.com.');
  }
  if (domainUrl.username || domainUrl.password || domainUrl.pathname !== '/' || domainUrl.search || domainUrl.hash) {
    throw new Error('Brief field "domain" must be a bare hostname without a path, query, credentials or fragment.');
  }
  if (!domainUrl.hostname.includes('.') || !/^[a-z0-9.-]+$/i.test(domainUrl.hostname)) {
    throw new Error('Brief field "domain" must be a public hostname such as example.com.');
  }
  brief.domain = domainUrl.hostname.toLowerCase();

  if (brief.market !== undefined) brief.market = requireText(brief.market, 'market');
  else brief.market = 'US';
  if (brief.vertical !== undefined) {
    if (!STYLE_PRESETS.includes(brief.vertical)) {
      throw new Error(`Brief field "vertical" must be one of: ${STYLE_PRESETS.join(', ')}.`);
    }
  } else brief.vertical = 'professional';

  brief.competitors = optionalStringArray(brief.competitors, 'competitors');
  brief.differentiators = optionalStringArray(brief.differentiators, 'differentiators');
  brief.proof = optionalStringArray(brief.proof, 'proof');
  brief.serviceArea = optionalStringArray(brief.serviceArea, 'serviceArea');
  brief.primaryPages = optionalStringArray(brief.primaryPages, 'primaryPages');
  brief.sameAs = optionalStringArray(brief.sameAs, 'sameAs');
  brief.faqs = brief.faqs === undefined ? [] : brief.faqs;
  if (!Array.isArray(brief.faqs) || brief.faqs.some((item) => !isPlainObject(item) || typeof item.q !== 'string' || typeof item.a !== 'string')) {
    throw new Error('Brief field "faqs" must be an array of { q, a } objects.');
  }

  if (brief.platforms === undefined) brief.platforms = [...PLATFORMS];
  if (!Array.isArray(brief.platforms) || brief.platforms.length < 4) {
    throw new Error('Brief field "platforms" must contain at least four supported engines.');
  }
  const platforms = [...new Set(brief.platforms.map((item) => String(item).toLowerCase()))];
  const unsupported = platforms.filter((item) => !PLATFORMS.includes(item));
  if (unsupported.length) throw new Error(`Brief field "platforms" contains unsupported engines: ${unsupported.join(', ')}.`);
  brief.platforms = platforms;

  for (const field of ['baselineDate', 'reMeasureDate', 'reportDate']) {
    const value = optionalDate(brief[field], field);
    if (value) brief[field] = value;
  }
  if (brief.agencyName !== undefined) brief.agencyName = requireText(brief.agencyName, 'agencyName');
  return brief;
}

function normalizePage(input) {
  const page = isPlainObject(input) ? input : {};
  const text = (value) => (typeof value === 'string' ? value : '');
  const list = (value) => (Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []);
  const number = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
  return {
    ...page,
    path: text(page.path) || '/',
    url: text(page.url),
    title: text(page.title),
    metaDescription: text(page.metaDescription),
    canonical: text(page.canonical),
    h1: list(page.h1),
    h2: list(page.h2),
    h3: list(page.h3),
    headings: list(page.headings),
    wordCount: number(page.wordCount),
    schemaTypes: list(page.schemaTypes),
    hasFaqSchema: Boolean(page.hasFaqSchema),
    hasComparisonTable: Boolean(page.hasComparisonTable),
    questionHeadings: number(page.questionHeadings),
    answerFirst: text(page.answerFirst),
    answerFirstWords: number(page.answerFirstWords),
    internalLinks: list(page.internalLinks),
    externalLinks: list(page.externalLinks),
    imageCount: number(page.imageCount),
    imagesWithAlt: number(page.imagesWithAlt),
    hasAuthor: Boolean(page.hasAuthor),
    hasDate: Boolean(page.hasDate),
    visibleDate: Boolean(page.visibleDate),
    hasStats: Boolean(page.hasStats),
    hasPrice: Boolean(page.hasPrice),
    hasContact: Boolean(page.hasContact),
    jsonLdValid: Boolean(page.jsonLdValid),
    jsonLdBlocks: number(page.jsonLdBlocks),
    jsOnly: Boolean(page.jsOnly),
    sameAs: list(page.sameAs)
  };
}

export function normalizeSnapshot(input) {
  if (!isPlainObject(input)) throw new Error('Snapshot must be a JSON object.');
  if (!Array.isArray(input.pages) || input.pages.length === 0) throw new Error('Snapshot has no pages.');
  const site = isPlainObject(input.site) ? input.site : {};
  return {
    ...input,
    site: {
      ...site,
      url: typeof site.url === 'string' ? site.url : '',
      https: Boolean(site.https),
      source: site.source === 'url' ? 'url' : 'local',
      robotsTxt: Boolean(site.robotsTxt),
      robotsSitemaps: Array.isArray(site.robotsSitemaps) ? site.robotsSitemaps.filter((item) => typeof item === 'string') : [],
      sitemapPresent: Boolean(site.sitemapPresent),
      sitemapUrls: Array.isArray(site.sitemapUrls) ? site.sitemapUrls.filter((item) => typeof item === 'string') : [],
      llmsTxt: Boolean(site.llmsTxt),
      aiBots: isPlainObject(site.aiBots) ? site.aiBots : {},
      blockedBots: Array.isArray(site.blockedBots) ? site.blockedBots.filter((item) => typeof item === 'string') : []
    },
    pages: input.pages.map(normalizePage)
  };
}

export function validatePack(pack) {
  if (!isPlainObject(pack)) throw new Error('Pack must be a JSON object.');
  if (!isPlainObject(pack.meta)) throw new Error('Pack is missing a meta object.');
  if (!isPlainObject(pack.snapshot)) throw new Error('Pack is missing a snapshot object.');
  normalizeSnapshot(pack.snapshot);
  for (const field of ['promptPanel', 'contentBriefs', 'citations', 'roadmap']) {
    if (!Array.isArray(pack[field])) throw new Error(`Pack field "${field}" must be an array.`);
  }
  if (!isPlainObject(pack.schema)) throw new Error('Pack field "schema" must be an object.');
  if (!isPlainObject(pack.measurement)) throw new Error('Pack field "measurement" must be an object.');
  if (!isPlainObject(pack.delivery)) throw new Error('Pack field "delivery" must be an object.');
  if (typeof pack.report !== 'string') throw new Error('Pack field "report" must be a string.');
  return true;
}

export function hashSeed(value) {
  return createHash('sha256').update(String(value)).digest('hex').slice(0, 12);
}

export function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

export function sentenceCase(text) {
  const s = String(text || '').trim();
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function decodeEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

export function stripTags(html) {
  return decodeEntities(
    String(html || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();
}

function firstMatch(html, rx) {
  const m = String(html || '').match(rx);
  return m ? decodeEntities(m[1] || '').replace(/\s+/g, ' ').trim() : '';
}

function allMatches(html, rx) {
  const out = [];
  const source = String(html || '');
  let m;
  while ((m = rx.exec(source))) out.push(decodeEntities(m[1] || '').replace(/\s+/g, ' ').trim());
  return out;
}

function attr(tag, name) {
  const rx = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i');
  const m = String(tag).match(rx);
  return m ? decodeEntities(m[1]).trim() : '';
}

function metaContent(html, key) {
  const tags = String(html || '').match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const name = (attr(tag, 'name') || attr(tag, 'property') || '').toLowerCase();
    if (name === key.toLowerCase()) return attr(tag, 'content');
  }
  return '';
}

function linkHref(html, rel) {
  const tags = String(html || '').match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if ((attr(tag, 'rel') || '').toLowerCase() === rel.toLowerCase()) return attr(tag, 'href');
  }
  return '';
}

export function parseJsonLd(html) {
  const blocks = [];
  const rx = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = rx.exec(String(html || '')))) {
    const raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      blocks.push({ valid: true, data: parsed });
    } catch {
      blocks.push({ valid: false, data: null, raw: raw.slice(0, 200) });
    }
  }
  return blocks;
}

function flattenJsonLd(value, out = []) {
  if (!value) return out;
  if (Array.isArray(value)) {
    for (const item of value) flattenJsonLd(item, out);
    return out;
  }
  if (typeof value === 'object') {
    out.push(value);
    if (value['@graph']) flattenJsonLd(value['@graph'], out);
    for (const key of ['mainEntity', 'itemListElement', 'author', 'publisher', 'provider']) {
      if (value[key] && typeof value[key] === 'object') flattenJsonLd(value[key], out);
    }
  }
  return out;
}

function typeNames(data) {
  const types = new Set();
  for (const node of flattenJsonLd(data)) {
    const t = node['@type'];
    if (Array.isArray(t)) t.forEach((x) => types.add(x));
    else if (typeof t === 'string') types.add(t);
  }
  return [...types];
}

export function parseRobots(text) {
  const groups = [];
  let agents = [];
  let rules = [];
  let sitemaps = [];
  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === 'user-agent') {
      if (rules.length) {
        groups.push({ agents, rules });
        agents = [];
        rules = [];
      }
      agents.push(value.toLowerCase());
    } else if (key === 'allow' || key === 'disallow') {
      if (!agents.length) agents = ['*'];
      rules.push({ allow: key === 'allow', path: value });
    } else if (key === 'sitemap') {
      sitemaps.push(value);
    }
  }
  if (agents.length) groups.push({ agents, rules });
  return { groups, sitemaps };
}

function robotsPatternMatches(pattern, targetPath) {
  if (!pattern) return false;
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}${anchored ? '$' : '.*'}`).test(targetPath);
}

export function botAccess(robots, bot, targetPath = '/') {
  const groups = robots?.groups || [];
  const agent = String(bot).toLowerCase();
  const pathName = String(targetPath || '/') || '/';
  const specific = groups.filter((g) => g.agents.includes(agent));
  const wildcard = groups.filter((g) => g.agents.includes('*'));
  const group = specific.length ? specific : wildcard;
  if (!group.length) return { allowed: true, reason: 'No matching rule; allowed by default.' };
  const matching = [];
  for (const g of group) {
    for (const rule of g.rules) {
      if (!rule.path) {
        if (!rule.allow) matching.push({ allow: true, path: '', specificity: 0 });
        continue;
      }
      if (robotsPatternMatches(rule.path, pathName)) {
        matching.push({ allow: rule.allow, path: rule.path, specificity: rule.path.length });
      }
    }
  }
  if (!matching.length) return { allowed: true, reason: 'No matching rule for this path; allowed by default.' };
  matching.sort((a, b) => (b.specificity - a.specificity) || (Number(b.allow) - Number(a.allow)));
  const winner = matching[0];
  return {
    allowed: winner.allow,
    reason: winner.allow ? `Allowed by "Allow: ${winner.path || '/'}".` : `Blocked by "Disallow: ${winner.path || '/'}".`
  };
}

function createPage(html, filePath, options = {}) {
  const jsonLd = parseJsonLd(html);
  const nodes = jsonLd.filter((b) => b.valid).flatMap((b) => flattenJsonLd(b.data));
  const schemaTypes = [...new Set(nodes.flatMap((n) => typeNames(n)))];
  const sameAs = [...new Set(nodes.flatMap((n) => (Array.isArray(n.sameAs) ? n.sameAs : n.sameAs ? [n.sameAs] : [])))];
  const authorNode = nodes.find((n) => n.author);
  const authorValue = authorNode ? (typeof authorNode.author === 'string' ? authorNode.author : authorNode.author?.name || '') : '';
  const visible = stripTags(html);
  const paragraphs = allMatches(html, /<p\b[^>]*>([\s\S]*?)<\/p>/gi).filter((p) => p.length >= 60);
  const h1 = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2 = allMatches(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3 = allMatches(html, /<h3\b[^>]*>([\s\S]*?)<\/h3>/gi);
  const headings = [...h2, ...h3];
  const links = (String(html).match(/<a\b[^>]*>/gi) || []).map((tag) => attr(tag, 'href')).filter(Boolean);
  const base = options.baseUrl ? new URL(options.baseUrl) : null;
  const internalLinks = [];
  const externalLinks = [];
  for (const href of links) {
    if (href.startsWith('/') || href.startsWith('.') || href.startsWith('?')) {
      internalLinks.push(href);
      continue;
    }
    if (!/^https?:\/\//i.test(href)) continue;
    try {
      const url = new URL(href);
      if (base && url.origin === base.origin) internalLinks.push(url.pathname + url.search);
      else externalLinks.push(href);
    } catch {
      /* ignore malformed links */
    }
  }
  const images = String(html).match(/<img\b[^>]*>/gi) || [];
  const imagesWithAlt = images.filter((tag) => attr(tag, 'alt').length > 0);
  const hasFaqSchema = schemaTypes.includes('FAQPage') || schemaTypes.includes('Question');
  const hasDate = Boolean(metaContent(html, 'article:published_time') || metaContent(html, 'article:modified_time') || nodes.some((n) => n.datePublished || n.dateModified) || /(updated|published)\s+(on\s+)?[A-Z][a-z]+\s+\d{1,2},?\s+20\d\d/i.test(visible));
  const visibleDate = /(updated|published)\s+(on\s+)?[A-Z][a-z]+\s+\d{1,2},?\s+20\d\d/i.test(visible);
  const answerFirst = paragraphs[0] || '';
  return {
    path: filePath,
    url: '',
    title: firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    metaDescription: metaContent(html, 'description'),
    canonical: linkHref(html, 'canonical'),
    h1,
    h2,
    h3,
    headings,
    wordCount: wordCount(visible),
    schemaTypes,
    hasFaqSchema,
    hasComparisonTable: /<table\b[^>]*>/i.test(html),
    questionHeadings: headings.filter((h) => /\?$/.test(h)).length,
    answerFirst,
    answerFirstWords: wordCount(answerFirst),
    internalLinks: [...new Set(internalLinks)],
    externalLinks: [...new Set(externalLinks)],
    imageCount: images.length,
    imagesWithAlt: imagesWithAlt.length,
    hasAuthor: Boolean(authorValue || metaContent(html, 'author') || /\bby\s+[A-Z][a-z]+\s+[A-Z][a-z]+/.test(visible)),
    hasDate,
    visibleDate,
    hasStats: /\d+(\.\d+)?%|\$\s?\d/.test(visible) && /\b20(2[4-9])\b/.test(visible),
    hasPrice: /\$\s?\d|\bprice\b/i.test(visible),
    hasContact: /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\b(contact|book|appointment|consultation)\b/i.test(visible),
    jsonLdValid: jsonLd.length > 0 && jsonLd.every((b) => b.valid),
    jsonLdBlocks: jsonLd.length,
    jsOnly: wordCount(visible) < 120 && (String(html).match(/<script\b/gi) || []).length > 3,
    sameAs
  };
}

export async function scanLocal(dir, options = {}) {
  const root = path.resolve(dir);
  const maxPages = Math.max(1, Math.min(Number(options.maxPages) || 10, MAX_LOCAL_PAGES));
  const domain = String(options.domain || 'example.com').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const baseUrl = `https://${domain}`;
  const files = [];
  async function walk(current) {
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
        await walk(full);
      } else if (entry.isFile() && /\.html?$/i.test(entry.name)) {
        const stat = await fs.stat(full);
        if (stat.size <= MAX_RESPONSE_BYTES) files.push(full);
      }
    }
  }
  await walk(root);
  files.sort();
  const pages = [];
  const pageOrder = (pagePath) => (pagePath === '/' ? 0 : pagePath.split('/').filter(Boolean).length);
  for (const file of files.slice(0, maxPages)) {
    const html = await fs.readFile(file, 'utf8');
    const rel = '/' + path.relative(root, file).split(path.sep).join('/');
    let pagePath = rel === '/index.html' ? '/' : rel.replace(/index\.html$/i, '').replace(/\.html?$/i, '');
    if (pagePath.length > 1) pagePath = pagePath.replace(/\/$/, '');
    const page = createPage(html, pagePath, { baseUrl });
    page.url = page.path;
    pages.push(page);
  }
  pages.sort((a, b) => pageOrder(a.path) - pageOrder(b.path) || a.path.localeCompare(b.path));
  if (!pages.length) throw new Error('No HTML pages found in directory');
  const robotsPath = path.join(root, 'robots.txt');
  let robotsRaw = '';
  try { robotsRaw = await fs.readFile(robotsPath, 'utf8'); } catch { /* absent */ }
  const robots = parseRobots(robotsRaw);
  const aiBots = Object.fromEntries(AI_BOTS.map((bot) => [bot.id, botAccess(robots, bot.id)]));
  let sitemapPresent = false;
  let sitemapUrls = [];
  try {
    const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
    if (/<urlset\b|<sitemapindex\b/i.test(sitemap)) {
      sitemapPresent = true;
      sitemapUrls = allMatches(sitemap, /<loc>([\s\S]*?)<\/loc>/gi);
    }
  } catch { /* absent */ }
  let llmsTxt = false;
  try { await fs.access(path.join(root, 'llms.txt')); llmsTxt = true; } catch { /* absent */ }
  return {
    site: {
      url: baseUrl,
      https: true,
      source: 'local',
      robotsTxt: Boolean(robotsRaw),
      robotsSitemaps: robots.sitemaps,
      sitemapPresent,
      sitemapUrls,
      llmsTxt,
      aiBots,
      blockedBots: Object.entries(aiBots).filter(([, v]) => !v.allowed).map(([k]) => k)
    },
    pages
  };
}

function isPrivateAddress(address) {
  const version = isIP(address);
  if (version === 4) {
    const parts = address.split('.').map(Number);
    if (parts[0] === 0 || parts[0] === 10 || parts[0] === 127) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
    if (parts[0] === 198 && (parts[1] === 18 || parts[1] === 19)) return true;
    if (parts[0] >= 224) return true;
    return false;
  }
  if (version === 6) {
    const value = address.toLowerCase();
    if (value === '::' || value === '::1') return true;
    if (value.startsWith('fc') || value.startsWith('fd')) return true;
    if (/^fe[89ab]/.test(value)) return true;
    if (value.startsWith('ff')) return true;
    if (value.startsWith('::ffff:')) return isPrivateAddress(value.slice(7));
    return false;
  }
  return false;
}

export function normalizeStartUrl(rawUrl, options = {}) {
  let url;
  try {
    url = new URL(String(rawUrl));
  } catch {
    throw new Error('URL must be a valid http:// or https:// URL.');
  }
  if (!/^https?:$/.test(url.protocol)) throw new Error('URL must start with http:// or https://.');
  if (url.username || url.password) throw new Error('URL must not contain credentials.');
  url.hash = '';
  if (options.allowPrivate) return url;
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    throw new Error('Refusing to scan localhost. Use --allow-private only for a trusted staging server.');
  }
  if (isIP(hostname) && isPrivateAddress(hostname)) {
    throw new Error('Refusing to scan a private, loopback or link-local address. Use --allow-private only for a trusted staging server.');
  }
  return url;
}

async function assertHostAllowed(hostname, allowPrivate) {
  if (allowPrivate) return;
  const host = String(hostname).replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost')) throw new Error('Refusing to scan localhost.');
  if (isIP(host)) {
    if (isPrivateAddress(host)) throw new Error('Refusing to scan a private, loopback or link-local address.');
    return;
  }
  const records = await lookup(host, { all: true, verbatim: true });
  if (!records.length) throw new Error(`Could not resolve host: ${host}`);
  if (records.some((record) => isPrivateAddress(record.address))) {
    throw new Error('Refusing to scan a host that resolves to a private, loopback or link-local address.');
  }
}

async function readLimited(response, maxBytes) {
  if (!response.body) return '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let output = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new Error(`Response exceeds the ${maxBytes}-byte limit.`);
      }
      output += decoder.decode(value, { stream: true });
    }
    output += decoder.decode();
    return output;
  } finally {
    reader.releaseLock();
  }
}

async function fetchText(rawUrl, options = {}) {
  const timeout = Number(options.timeout) || FETCH_TIMEOUT_MS;
  const maxBytes = Number(options.maxBytes) || MAX_RESPONSE_BYTES;
  const allowPrivate = Boolean(options.allowPrivate);
  let current = rawUrl instanceof URL ? rawUrl : normalizeStartUrl(rawUrl, { allowPrivate });

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    await assertHostAllowed(current.hostname, allowPrivate);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let response;
    try {
      response = await fetch(current, {
        signal: controller.signal,
        redirect: 'manual',
        cache: 'no-store',
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xhtml+xml,text/plain,application/xml;q=0.9,*/*;q=0.1'
        }
      });
    } catch (error) {
      if (error.name === 'AbortError') throw new Error(`Timed out after ${timeout}ms fetching ${current}`);
      throw error;
    } finally {
      clearTimeout(timer);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) throw new Error(`HTTP ${response.status} redirect without a Location header for ${current}`);
      if (redirects === MAX_REDIRECTS) throw new Error(`Too many redirects fetching ${rawUrl}`);
      const next = new URL(location, current);
      if (!/^https?:$/.test(next.protocol)) throw new Error('Redirect target must use http:// or https://.');
      if (current.protocol === 'https:' && next.protocol !== 'https:') throw new Error('Refusing to follow an HTTPS-to-HTTP redirect.');
      current = next;
      continue;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status} for ${current}`);
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (contentType && !/^(text\/|application\/(xhtml\+xml|xml|json|ld\+json|rss\+xml|atom\+xml))/i.test(contentType)) {
      throw new Error(`Unsupported content type "${contentType}" for ${current}`);
    }
    const declaredLength = Number(response.headers.get('content-length') || 0);
    if (declaredLength > maxBytes) throw new Error(`Response exceeds the ${maxBytes}-byte limit.`);
    const text = await readLimited(response, maxBytes);
    return { text, url: current.toString(), contentType };
  }
  throw new Error(`Too many redirects fetching ${rawUrl}`);
}

function pageCandidate(href, origin) {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin || !/^https?:$/.test(url.protocol)) return '';
    if (/\.(pdf|jpe?g|png|webp|gif|svg|zip|gz|mp4|mov|mp3|css|js|woff2?|ttf)$/i.test(url.pathname)) return '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

export async function scanUrl(rawUrl, options = {}) {
  const allowPrivate = Boolean(options.allowPrivate);
  const start = normalizeStartUrl(rawUrl, { allowPrivate });
  const maxPages = Math.max(1, Math.min(Number(options.maxPages) || 5, MAX_URL_PAGES));
  const root = await fetchText(start, { allowPrivate });
  if (root.contentType && !/html|xhtml/i.test(root.contentType)) {
    throw new Error(`Start URL did not return HTML (content-type: ${root.contentType}).`);
  }
  const rootUrl = new URL(root.url);
  const origin = rootUrl.origin;
  const rootPath = rootUrl.pathname || '/';

  let robotsRaw = '';
  try { robotsRaw = (await fetchText(new URL('/robots.txt', origin), { allowPrivate })).text; } catch { /* absent */ }
  const robots = parseRobots(robotsRaw);
  const aiBots = Object.fromEntries(AI_BOTS.map((bot) => [bot.id, botAccess(robots, bot.id)]));
  let sitemapPresent = false;
  let sitemapUrls = [];
  try {
    const sitemap = (await fetchText(new URL('/sitemap.xml', origin), { allowPrivate })).text;
    if (/<urlset\b|<sitemapindex\b/i.test(sitemap)) {
      sitemapPresent = true;
      sitemapUrls = allMatches(sitemap, /<loc>([\s\S]*?)<\/loc>/gi);
    }
  } catch { /* absent */ }
  let llmsTxt = false;
  try { await fetchText(new URL('/llms.txt', origin), { allowPrivate }); llmsTxt = true; } catch { /* absent */ }

  const pages = [];
  const rootPage = createPage(root.text, rootPath, { baseUrl: origin });
  rootPage.url = rootUrl.toString();
  pages.push(rootPage);

  const candidates = [...new Set([
    ...rootPage.internalLinks.map((href) => pageCandidate(href, origin)),
    ...sitemapUrls.map((href) => pageCandidate(href, origin))
  ].filter(Boolean))];

  for (const href of candidates) {
    if (pages.length >= maxPages) break;
    if (pages.some((page) => page.url === href)) continue;
    try {
      const fetched = await fetchText(href, { allowPrivate });
      if (fetched.contentType && !/html|xhtml/i.test(fetched.contentType)) continue;
      const finalUrl = new URL(fetched.url);
      if (finalUrl.origin !== origin) continue;
      const page = createPage(fetched.text, finalUrl.pathname || '/', { baseUrl: origin });
      page.url = finalUrl.toString();
      if (pages.some((existing) => existing.url === page.url)) continue;
      pages.push(page);
    } catch { /* skip broken or disallowed pages */ }
  }

  return {
    site: {
      url: origin,
      startUrl: start.toString(),
      finalUrl: rootUrl.toString(),
      https: origin.startsWith('https://'),
      source: 'url',
      robotsTxt: Boolean(robotsRaw),
      robotsSitemaps: robots.sitemaps,
      sitemapPresent,
      sitemapUrls,
      llmsTxt,
      aiBots,
      blockedBots: Object.entries(aiBots).filter(([, v]) => !v.allowed).map(([k]) => k)
    },
    pages
  };
}

export function pageScore(page) {
  let score = 0;
  if (page.title.length >= 10 && page.title.length <= 60) score += 10;
  if (page.metaDescription.length >= 70 && page.metaDescription.length <= 160) score += 10;
  if (page.h1.length === 1) score += 10;
  if (page.wordCount >= 600) score += 15;
  if (page.answerFirstWords >= 40) score += 15;
  if (page.questionHeadings >= 2) score += 10;
  if (page.schemaTypes.length >= 2) score += 10;
  if (page.canonical) score += 5;
  if (page.imageCount === 0 || page.imagesWithAlt / page.imageCount >= 0.8) score += 5;
  if (page.internalLinks.length >= 3) score += 5;
  if (page.hasStats) score += 5;
  return Math.min(100, score);
}

export function siteReadiness(snapshot) {
  const pages = snapshot.pages || [];
  const site = snapshot.site || {};
  let score = 0;
  if (site.https) score += 5;
  if (site.robotsTxt) score += 5;
  const searchBots = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot'];
  const allowed = searchBots.filter((b) => site.aiBots?.[b]?.allowed).length;
  score += Math.round((allowed / searchBots.length) * 15);
  if (site.sitemapPresent) score += 5;
  const avgPage = pages.length ? pages.reduce((a, p) => a + pageScore(p), 0) / pages.length : 0;
  score += Math.round(avgPage * 0.5);
  const anyOrg = pages.some((p) => p.schemaTypes.includes('Organization'));
  const anyService = pages.some((p) => p.schemaTypes.some((t) => ['Service', 'Product', 'LocalBusiness', 'Dentist', 'MedicalBusiness'].includes(t)));
  const anyFaq = pages.some((p) => p.hasFaqSchema);
  const anyBreadcrumb = pages.some((p) => p.schemaTypes.includes('BreadcrumbList'));
  if (anyOrg) score += 5;
  if (anyService) score += 5;
  if (anyFaq) score += 3;
  if (anyBreadcrumb) score += 2;
  const anySameAs = pages.some((p) => p.sameAs.length > 0);
  if (anySameAs) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function displayCity(brief) {
  return brief.city || brief.serviceArea?.[0] || 'your service area';
}

function platformFor(index, platforms) {
  return platforms[index % platforms.length];
}

function promptRows(brief) {
  const brand = brief.brand;
  const category = brief.category;
  const city = displayCity(brief);
  const buyer = brief.buyer;
  const competitors = (brief.competitors || []).slice(0, 2);
  const c1 = competitors[0] || 'the leading alternative';
  const c2 = competitors[1] || 'another local provider';
  const templates = {
    awareness: [
      { text: `best ${category} in ${city}`, intent: 'commercial investigation' },
      { text: `how to choose ${category} in ${city}`, intent: 'informational' },
      { text: `${category} near me`, intent: 'local commercial' },
      { text: `what should ${buyer} know before ${category}`, intent: 'informational' },
      { text: `is ${category} worth it for ${buyer}`, intent: 'commercial investigation' },
      { text: `${category} options in ${city}`, intent: 'commercial investigation' }
    ],
    comparison: [
      { text: `${brand} vs ${c1}`, intent: 'comparison' },
      { text: `best ${category} providers in ${city}`, intent: 'comparison' },
      { text: `${brand} alternatives`, intent: 'comparison' },
      { text: `${c1} vs ${c2} for ${buyer}`, intent: 'comparison' },
      { text: `top rated ${category} in ${city}`, intent: 'comparison' },
      { text: `which ${category} is best for ${buyer}`, intent: 'comparison' }
    ],
    decision: [
      { text: `${brand} reviews`, intent: 'decision' },
      { text: `${brand} pricing`, intent: 'decision' },
      { text: `is ${brand} legit`, intent: 'decision' },
      { text: `${brand} consultation`, intent: 'decision' },
      { text: `${brand} near ${city}`, intent: 'local decision' },
      { text: `book ${category} in ${city}`, intent: 'transactional' }
    ],
    objection: [
      { text: `does ${category} hurt`, intent: 'objection' },
      { text: `how long does ${category} take`, intent: 'objection' },
      { text: `${category} cost without insurance in ${city}`, intent: 'objection' },
      { text: `is ${brand} worth the price`, intent: 'objection' },
      { text: `risks of ${category}`, intent: 'objection' },
      { text: `${category} before and after`, intent: 'objection' }
    ],
    branded: [
      { text: `${brand}`, intent: 'navigational' },
      { text: `${brand} ${city}`, intent: 'navigational' },
      { text: `${brand} services`, intent: 'navigational' },
      { text: `${brand} reviews ${city}`, intent: 'reputation' },
      { text: `${brand} vs ${c1}`, intent: 'comparison' },
      { text: `${brand} appointment`, intent: 'transactional' }
    ]
  };
  const success = {
    awareness: 'Brand named in the answer or cited as a source',
    comparison: 'Brand included in the shortlist with a correct differentiator',
    decision: 'Brand recommended with a correct next step',
    objection: 'Brand answer corrects the objection without inventing proof',
    branded: 'Brand facts are accurate and the official page is cited'
  };
  const rows = [];
  for (const stage of STAGES) {
    templates[stage].forEach((item) => {
      rows.push({
        id: `P${String(rows.length + 1).padStart(2, '0')}`,
        stage,
        prompt: item.text,
        intent: item.intent,
        platform: platformFor(rows.length, brief.platforms || PLATFORMS),
        branded: stage === 'branded' || item.text.includes(brand),
        competitor: competitors.some((c) => item.text.includes(c)),
        successSignal: success[stage],
        runs: 3
      });
    });
  }
  return rows;
}

function contentBriefs(brief, prompts) {
  const brand = brief.brand;
  const category = brief.category;
  const city = displayCity(brief);
  const buyer = brief.buyer;
  const proof = (brief.proof || [])[0] || 'a verified first-party fact supplied by the business';
  const diff = (brief.differentiators || [])[0] || 'the service model';
  const picks = [
    { prompt: prompts.find((p) => p.stage === 'awareness' && p.prompt.startsWith('best')), pageType: 'service page', title: `${sentenceCase(category)} in ${city}`, angle: 'category + location' },
    { prompt: prompts.find((p) => p.stage === 'comparison'), pageType: 'comparison page', title: `${brand} vs ${brief.competitors?.[0] || 'the leading alternative'}`, angle: 'honest comparison' },
    { prompt: prompts.find((p) => p.stage === 'decision' && p.prompt.includes('pricing')), pageType: 'pricing page', title: `${category} pricing: what changes the cost`, angle: 'price transparency' },
    { prompt: prompts.find((p) => p.stage === 'objection' && p.prompt.includes('hurt')), pageType: 'FAQ page', title: `${sentenceCase(category)}: risks, comfort and recovery`, angle: 'objection handling' },
    { prompt: prompts.find((p) => p.stage === 'objection' && p.prompt.includes('before and after')), pageType: 'proof page', title: `${sentenceCase(category)} before and after: what the evidence shows`, angle: 'proof and expectations' },
    { prompt: prompts.find((p) => p.stage === 'branded' && p.prompt.includes('reviews')), pageType: 'about and author page', title: `About ${brand}: who does the work`, angle: 'entity and trust' }
  ];
  return picks.map((pick, i) => {
    const p = pick.prompt || prompts[i];
    return {
      id: `B${i + 1}`,
      targetPrompt: p.prompt,
      stage: p.stage,
      intent: p.intent,
      pageType: pick.pageType,
      urlSuggestion: pick.pageType === 'service page' ? `/services/${slugify(category)}` : pick.pageType === 'comparison page' ? `/compare/${slugify(brand)}-vs-${slugify(brief.competitors?.[0] || 'alternative')}` : pick.pageType === 'pricing page' ? '/pricing' : pick.pageType === 'FAQ page' ? '/faq' : pick.pageType === 'proof page' ? '/results' : '/about',
      title: pick.title,
      h1: pick.title,
      angle: pick.angle,
      answerBlock: `${brand} provides ${category} for ${buyer} in ${city}. This page explains ${pick.angle}, what to expect, what changes the outcome, and how to decide whether ${brand} is the right fit. It cites ${proof} and names the limits instead of promising a result.`,
      sections: [
        { h2: `What ${category} includes`, points: ['Define the service in plain language', 'Name who it is for and who it is not for', 'List the steps and the decision points'] },
        { h2: `How to judge a provider`, points: [`Explain ${diff} and why it matters`, 'List the credentials, training and safety checks to verify', 'Explain what a fair quote should include'] },
        { h2: `${sentenceCase(category)} cost and what changes it`, points: ['Explain the cost drivers without inventing a price', 'Name what is included and what is not', 'Offer a next step to get a specific quote'] },
        { h2: 'Risks, comfort and recovery', points: ['State the common risks and side effects', 'Explain who should not proceed', 'Explain the aftercare and escalation path'] },
        { h2: 'Evidence and limits', points: [`Cite ${proof} with a date`, 'Separate first-party evidence from third-party claims', 'State what the page cannot prove'] },
        { h2: 'Next step', points: [`Offer ${brief.offer || 'a consultation'}`, 'Explain what happens after the form or call', 'Give a response-time expectation'] }
      ],
      evidenceRequired: [proof, 'the current service list and service area', 'the real credential or license number', 'the actual aftercare policy'],
      schema: ['Service', 'FAQPage', 'BreadcrumbList'],
      internalLinks: ['/', '/about', '/pricing', '/faq'],
      cta: brief.offer || 'Book a consultation',
      wordTarget: 1400,
      extractionRules: ['Answer in the first 45 words', 'Use question-form headings', 'Use a table for options, costs or comparison', 'Put one verifiable fact in every section', 'Keep the answer consistent with the JSON-LD'],
      doNot: ['Invent a review or rating', 'Promise a guaranteed outcome', 'Use a competitor trademark in a misleading way', 'Hide the price drivers']
    };
  });
}

function schemaPack(brief, briefs) {
  const brand = brief.brand;
  const category = brief.category;
  const city = displayCity(brief);
  const domain = `https://${String(brief.domain || 'example.com').replace(/^https?:\/\//, '')}`;
  const orgId = `${domain}/#organization`;
  const sameAs = (brief.sameAs || []).filter(Boolean);
  const areaServed = brief.serviceArea?.length ? brief.serviceArea : [city];
  const faqs = brief.faqs?.length ? brief.faqs : [
    { q: `What does ${brand} offer?`, a: `${brand} offers ${category} in ${city}. Contact ${brand} for current services, availability and pricing.` },
    { q: `Where does ${brand} work?`, a: `${brand} serves ${areaServed.join(', ')}. Confirm the current service area on the official website.` },
    { q: `How do I book ${brand}?`, a: `Use the official ${brand} website or phone number. Confirm the current availability and next step with the business.` },
    { q: `What makes ${brand} different?`, a: `${brand} highlights ${(brief.differentiators || ['a clear, documented process']).join(', ')}. Verify the details with the business before booking.` },
    { q: `How is pricing determined?`, a: `Pricing depends on the scope of ${category}. Contact ${brand} for a specific quote and a written list of what is included.` }
  ];
  return {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': orgId,
      name: brand,
      url: domain,
      description: `${brand} provides ${category} for ${brief.buyer} in ${city}.`,
      areaServed,
      knowsAbout: [...new Set([category, ...(brief.differentiators || [])])],
      sameAs
    },
    service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `${category} — ${brand}`,
      serviceType: category,
      provider: { '@id': orgId },
      areaServed,
      description: `${brand} provides ${category} for ${brief.buyer} in ${city}.`,
      url: `${domain}/services/${slugify(category)}`
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: domain },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${domain}/services` },
        { '@type': 'ListItem', position: 3, name: category, item: `${domain}/services/${slugify(category)}` }
      ]
    },
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: briefs[0].title,
      description: briefs[0].answerBlock,
      about: category,
      author: { '@id': orgId },
      publisher: { '@id': orgId },
      mainEntityOfPage: `${domain}${briefs[0].urlSuggestion}`
    }
  };
}

function citationPlan(brief) {
  const vertical = brief.vertical && SOURCE_TYPES[brief.vertical] ? brief.vertical : 'professional';
  const sources = SOURCE_TYPES[vertical];
  return sources.map((source, i) => ({
    id: `C${i + 1}`,
    sourceType: source,
    why: `${source} is a source type AI answers use to verify and recommend ${brief.category}.`,
    action: `Find the 3 most relevant pages in ${source}, check whether ${brief.brand} is mentioned or cited, and pitch a factual correction, inclusion or expert contribution where the rules allow.`,
    kpi: 'Brand mentioned or cited with a correct fact',
    caution: 'No paid placement disguised as editorial, no fabricated reviews, and follow each community rule.'
  }));
}

function roadmap(brief, snapshot) {
  const actions = [];
  const add = (priority, owner, effort, impact, action, verification) => {
    if (actions.some((a) => a.action === action)) return;
    actions.push({ id: `A${String(actions.length + 1).padStart(2, '0')}`, priority, owner, effort, impact, action, verification });
  };
  const site = snapshot.site || {};
  const pages = snapshot.pages || [];
  const blocked = site.blockedBots || [];
  const retrievalBots = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Claude-SearchBot'];
  const blockedRetrieval = blocked.filter((bot) => retrievalBots.includes(bot));
  const blockedTraining = blocked.filter((bot) => !retrievalBots.includes(bot));
  if (blockedRetrieval.length) add('P0', 'dev', '1h', 'high', `Unblock retrieval bots ${blockedRetrieval.join(', ')} in robots.txt for the AI search agents you want to appear in.`, 'Re-scan and confirm each retrieval bot shows allowed.');
  if (blockedTraining.length) add('P2', 'dev', '30m', 'medium', `Review training-bot blocks (${blockedTraining.join(', ')}) separately from retrieval access. Keep them blocked only if that is a deliberate content-licensing decision.`, 'Document the training-vs-retrieval decision and confirm retrieval bots remain allowed.');
  if (!site.sitemapPresent) add('P0', 'dev', '2h', 'high', 'Publish an XML sitemap with canonical URLs and accurate lastmod dates.', 'Sitemap returns 200 and lists every priority page.');
  if (!pages.some((p) => p.schemaTypes.includes('Organization'))) add('P0', 'dev', '2h', 'high', 'Add Organization JSON-LD with name, url, description, areaServed and sameAs.', 'Rich Results Test or schema validator returns no errors.');
  if (!pages.some((p) => p.schemaTypes.some((t) => ['Service', 'Product', 'LocalBusiness', 'Dentist', 'MedicalBusiness'].includes(t)))) add('P0', 'dev', '2h', 'high', 'Add Service or Product JSON-LD that matches the visible offer.', 'Schema validates and matches the page copy.');
  if (!pages.some((p) => p.hasFaqSchema)) add('P1', 'content', '3h', 'high', 'Add a visible FAQ and matching FAQPage schema to the priority service page.', 'FAQ is visible, schema validates, answers match.');
  if (pages.some((p) => p.answerFirstWords < 40)) add('P0', 'content', '4h', 'high', 'Add a 40–60 word answer-first summary under the H1 on every priority page.', 'First paragraph answers the page question without a scroll.');
  if (pages.some((p) => p.questionHeadings < 2)) add('P1', 'content', '3h', 'medium', 'Rewrite two H2s per priority page as buyer questions.', 'At least two question-form headings per page.');
  if (pages.some((p) => p.wordCount < 600)) add('P1', 'content', '1d', 'medium', 'Expand thin priority pages to cover the decision, cost, risks and next step.', 'Each page is at least 900 words with no filler.');
  if (pages.some((p) => !p.hasStats)) add('P1', 'content', '4h', 'medium', 'Add one dated, verifiable fact or first-party data point per priority page.', 'Every fact has a source and a date.');
  if (pages.some((p) => !p.hasComparisonTable)) add('P2', 'content', '4h', 'medium', 'Add a comparison table for options, inclusions or cost drivers.', 'Table is readable on mobile and matches the schema.');
  if (pages.some((p) => !p.canonical)) add('P0', 'dev', '1h', 'high', 'Add a self-referencing canonical to every priority page.', 'Canonical resolves to the preferred URL.');
  if (pages.some((p) => p.imageCount > 0 && p.imagesWithAlt / p.imageCount < 0.8)) add('P2', 'content', '2h', 'low', 'Write descriptive alt text for the images that carry meaning.', 'At least 80% of images have useful alt text.');
  if (!pages.some((p) => p.hasAuthor)) add('P1', 'content', '2h', 'medium', 'Add a named author or reviewer with credentials and a profile page.', 'Author schema and visible byline match.');
  if (!pages.some((p) => p.sameAs.length)) add('P1', 'content', '2h', 'medium', 'Add sameAs links to verified profiles and directories.', 'Every sameAs URL returns 200 and represents the same entity.');
  add('P1', 'content', '1d', 'high', 'Publish the six answer-first content briefs with evidence and internal links.', 'Each brief is live, indexed and linked from the service page.');
  add('P1', 'dev', '2h', 'high', 'Install the Organization, Service, FAQPage, BreadcrumbList and Article JSON-LD.', 'All blocks validate and match the visible content.');
  add('P1', 'marketing', '1d', 'high', 'Build the 30-prompt panel and record a baseline across the chosen engines.', 'Baseline file has prompt, engine, date, mention, citation and position.');
  add('P1', 'marketing', '2h', 'high', 'Set up the GA4 AI referral segment and the Search Console generative AI report.', 'AI referrals and AI impressions are visible in the reports.');
  add('P1', 'marketing', '1d', 'high', 'Work the citation plan: three sources per month with a factual contribution.', 'Each placement is logged with URL, date and status.');
  add('P2', 'marketing', '1d', 'medium', 'Create one honest comparison page against the top two alternatives.', 'Page names the alternatives and the real trade-offs.');
  add('P2', 'content', '4h', 'medium', 'Add internal links from the highest-traffic pages to the priority pages.', 'Every priority page has at least three contextual internal links.');
  add('P2', 'content', '1d', 'medium', 'Refresh the priority pages every quarter with new evidence and dates.', 'Visible updated date and changelog.');
  add('P2', 'marketing', '2h', 'medium', 'Add a monthly prompt-panel review to the client reporting cadence.', 'Report shows movement, not a single score.');
  add('P2', 'dev', '2h', 'low', 'Add an optional llms.txt for agent readability only, not as a visibility lever.', 'File exists and the report says it is optional.');
  add('P2', 'marketing', '4h', 'medium', 'Pitch one podcast or trade publication with a genuine expert angle.', 'Pitch logged; no paid placement.');
  add('P2', 'content', '4h', 'medium', 'Add a proof page with real, consented before-and-after evidence where allowed.', 'Consent and substantiation are on file.');
  add('P2', 'dev', '2h', 'low', 'Keep robots.txt, sitemap and schema in a deploy checklist.', 'Checklist runs on every release.');
  add('P2', 'marketing', '2h', 'medium', 'Add the brand to the three most relevant industry directories.', 'Listings are complete and consistent.');
  add('P2', 'content', '4h', 'medium', 'Add an FAQ block to the comparison page using real sales objections.', 'Questions match the prompt panel and schema.');
  add('P2', 'marketing', '1d', 'medium', 'Run a 30-day re-measure and compare citation rate, mention rate and referrals.', 'Before/after table with dates and limits.');
  add('P0', 'marketing', '2h', 'high', 'Record the 30-prompt baseline before changing the site so improvement is measurable.', 'Baseline sheet has prompt, engine, date, mention, citation and position.');
  add('P0', 'content', '2h', 'high', 'Confirm the service list, service area and primary offer with the client before publishing.', 'Client signs off on one canonical description of the offer.');
  add('P1', 'content', '3h', 'medium', 'Add a visible "last reviewed" date and a named owner to every priority page.', 'Date and owner are visible and match the schema.');
  add('P1', 'content', '4h', 'medium', 'Add a pricing explainer that names the cost drivers and what the quote includes.', 'Page answers cost questions without inventing a fixed price.');
  add('P1', 'content', '4h', 'medium', 'Add a proof section with consented, substantiated examples where the category allows it.', 'Consent and substantiation are on file.');
  add('P1', 'content', '1d', 'medium', 'Add a service-area page for each priority city with genuinely local detail.', 'Each page names local logistics, hours and coverage limits.');
  add('P1', 'content', '4h', 'medium', 'Add an "Our process" section with steps, timing and decision points.', 'A buyer can describe the process after reading the page.');
  add('P1', 'content', '3h', 'medium', 'Add a "who this is for and who it is not for" section to the main service page.', 'The page disqualifies poor-fit buyers honestly.');
  add('P1', 'dev', '2h', 'medium', 'Add a contact page with the real business name, address, phone and hours.', 'NAP matches the Google Business Profile and schema.');
  add('P1', 'content', '4h', 'medium', 'Add a comparison table of options, inclusions and cost drivers.', 'Table is readable on mobile and matches the visible copy.');
  add('P1', 'marketing', '2h', 'medium', 'Store the baseline and every re-measure in one shared sheet with dates.', 'Sheet is accessible to the client and the delivery team.');
  const order = { P0: 0, P1: 1, P2: 2 };
  return actions
    .map((action, index) => ({ action, index }))
    .sort((a, b) => (order[a.action.priority] - order[b.action.priority]) || (a.index - b.index))
    .map(({ action }, index) => ({ ...action, id: `A${String(index + 1).padStart(2, '0')}` }));
}

function measurementPlan(brief) {
  return {
    baselineDate: brief.baselineDate || '2026-10-29',
    reMeasureDate: brief.reMeasureDate || '2026-11-28',
    cadence: 'Baseline, then weekly checks for the first month, then monthly for 90 days.',
    kpis: [
      { name: 'Mention rate', definition: 'Share of tracked prompts where the brand is named', target: 'Up and to the right; no fixed guarantee' },
      { name: 'Citation rate', definition: 'Share of tracked prompts where the official domain is cited', target: 'Track the delta, not a single run' },
      { name: 'Share of voice', definition: 'Brand mentions divided by all brand and competitor mentions', target: 'Compare against the two named competitors' },
      { name: 'AI referral sessions', definition: 'Sessions from ChatGPT, Perplexity, Gemini, Copilot and Claude referrers', target: 'Track weekly; expect undercounting' },
      { name: 'Assisted conversions', definition: 'Conversions where an AI referral or branded-search touch appears in the path', target: 'Report as modelled, not causal' }
    ],
    sources: [
      { name: 'Google Search Console', action: 'Open the Generative AI performance report and export impressions by page and country.', note: 'AI Overviews and AI Mode clicks are not cleanly separable from organic.' },
      { name: 'Bing Webmaster Tools', action: 'Review citation share, cited pages and grounding queries for Microsoft AI experiences.', note: 'Citation presence is not traffic share.' },
      { name: 'GA4', action: 'Create a custom channel group for chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com and claude.ai.', note: 'Some AI clients strip the referrer; direct traffic may hide AI visits.' },
      { name: 'Manual prompt panel', action: 'Run all 30 prompts three times per engine on the same day and log mention, citation, position and sentiment.', note: 'AI answers vary by user, location and model; report a distribution.' }
    ],
    reporting: [
      'Show the baseline and the current run side by side.',
      'Label every modelled number as modelled.',
      'Do not claim causality from a visibility change alone.',
      'Include what did not move and what you could not measure.'
    ]
  };
}

function delivery(brief, snapshot, prompts, briefs, schema) {
  return {
    agencyName: brief.agencyName || 'Your Agency',
    preparedFor: brief.brand,
    reportDate: brief.reportDate || '2026-10-29',
    schemaInstall: [
      'Paste Organization into the sitewide head or the home page template.',
      'Paste Service on the primary service page and keep the name identical to the visible service.',
      'Paste FAQPage only after the same questions and answers are visible on the page.',
      'Paste BreadcrumbList on the service and comparison pages.',
      'Paste Article on each content brief page and keep the author consistent with the visible byline.',
      'Validate every block before deploy and re-scan after deploy.'
    ],
    limits: [
      'The scan reads public HTML; it does not execute JavaScript or log in.',
      'The prompt panel is a manual test plan, not a live rank tracker.',
      'AI answers vary by user, location, model and date; this is a sample, not a guarantee.',
      'The report does not verify that the business claims are true.',
      'No citation, ranking or revenue outcome is guaranteed.',
      'This is not legal advice and does not replace platform policy review.'
    ],
    llmsTxtNote: 'llms.txt is optional for agent readability. In 2026 crawler studies it was rarely fetched by AI search bots and did not measurably lift citations. Do not sell it as a visibility lever.'
  };
}

function clientReport(brief, snapshot, readiness, prompts, briefs, roadmapActions, schema, measure, deliver) {
  const top = roadmapActions.filter((a) => a.priority === 'P0').slice(0, 3);
  const topFixes = top.map((a) => a.action.replace(/\.$/, ''));
  const primaryTypes = [...new Set(snapshot.pages.flatMap((p) => p.schemaTypes))]
    .filter((type) => !['ListItem', 'Question', 'Answer', 'Person'].includes(type));
  const lines = [
    `# AI Search Visibility Audit — ${brief.brand}`,
    '',
    `**Prepared for:** ${brief.brand}  `,
    `**Prepared by:** ${deliver.agencyName}  `,
    `**Date:** ${deliver.reportDate}  `,
    `**Market:** ${brief.market || 'US'}  `,
    `**Readiness score:** ${readiness}/100`,
    '',
    '## Executive summary',
    '',
    `${brief.brand} is being evaluated by buyers in AI answers for ${brief.category} in ${displayCity(brief)}. This audit checked the public site, the entity signals, the answer-first content, the citation surface and the measurement plan. The readiness score is a diagnostic, not a prediction of revenue.`,
    '',
    `The highest-leverage fixes are: ${topFixes.join('; ')}.`,
    '',
    '## Score breakdown',
    '',
    '| Area | What we checked | Result |',
    '| --- | --- | --- |',
    `| Crawl access | robots.txt, sitemap, AI user agents | ${snapshot.site.robotsTxt ? 'robots.txt found' : 'no robots.txt'}; blocked: ${snapshot.site.blockedBots?.length ? snapshot.site.blockedBots.join(', ') : 'none detected'} |`,
    `| Structured data | Organization, Service, FAQ, Breadcrumb | ${primaryTypes.join(', ') || 'none detected'} |`,
    `| Answer-first content | summary, question headings, depth | ${snapshot.pages.filter((p) => p.answerFirstWords >= 40).length}/${snapshot.pages.length} pages have an answer-first summary |`,
    `| Entity | sameAs, author, consistency | ${snapshot.pages.some((p) => p.sameAs.length) ? 'sameAs found' : 'no sameAs found'} |`,
    `| Citation surface | third-party sources | ${brief.citationNotes ? 'buyer notes supplied' : 'plan generated; audit the live sources'} |`,
    '',
    '## What we found',
    '',
    ...snapshot.pages.map((p) => `- **${p.path}** — ${p.title || 'missing title'}; ${p.wordCount} words; ${p.questionHeadings} question headings; schema: ${p.schemaTypes.join(', ') || 'none'}.`),
    '',
    '## 90-day plan',
    '',
    '| Priority | Action | Owner | Effort | Verification |',
    '| --- | --- | --- | --- | --- |',
    ...roadmapActions.slice(0, 20).map((a) => `| ${a.priority} | ${a.action} | ${a.owner} | ${a.effort} | ${a.verification} |`),
    '',
    '## Prompt panel',
    '',
    `The pack includes ${prompts.length} buyer prompts across ${new Set(prompts.map((p) => p.stage)).size} stages. Run three times per engine and record mention, citation, position and sentiment. See \`prompt-panel.csv\`.`,
    '',
    '## Content and schema delivered',
    '',
    `- ${briefs.length} answer-first content briefs`,
    `- ${Object.keys(schema).length} JSON-LD blocks (Organization, Service, FAQPage, BreadcrumbList, Article)`,
    `- Citation plan, measurement plan and install notes`,
    '',
    '## Measurement',
    '',
    `Baseline: ${measure.baselineDate}. Re-measure: ${measure.reMeasureDate}. ${measure.cadence}`,
    '',
    'Track mention rate, citation rate, share of voice, AI referral sessions and assisted conversions. Treat all revenue-impact numbers as modelled.',
    '',
    '## What this audit does not do',
    '',
    ...deliver.limits.map((l) => `- ${l}`),
    '',
    '## Next step',
    '',
    `Approve the P0 fixes, then the first two content briefs. Re-scan after deploy and start the prompt panel.`,
    ''
  ];
  return lines.join('\n');
}

export function buildPack(inputBrief, inputSnapshot) {
  const brief = validateBrief(inputBrief);
  const snapshot = normalizeSnapshot(inputSnapshot);
  const readiness = siteReadiness(snapshot);
  const prompts = promptRows(brief);
  const briefs = contentBriefs(brief, prompts);
  const schema = schemaPack(brief, briefs);
  const citations = citationPlan(brief);
  const roadmapActions = roadmap(brief, snapshot);
  const measure = measurementPlan(brief);
  const deliver = delivery(brief, snapshot, prompts, briefs, schema);
  const report = clientReport(brief, snapshot, readiness, prompts, briefs, roadmapActions, schema, measure, deliver);
  return {
    version: VERSION,
    meta: {
      brand: brief.brand,
      domain: brief.domain,
      market: brief.market,
      category: brief.category,
      buyer: brief.buyer,
      city: displayCity(brief),
      vertical: brief.vertical,
      competitors: brief.competitors,
      platforms: brief.platforms,
      seed: hashSeed(`${brief.brand}|${brief.domain}|${brief.category}`),
      reportDate: deliver.reportDate
    },
    snapshot,
    readiness,
    promptPanel: prompts,
    contentBriefs: briefs,
    schema,
    citations,
    roadmap: roadmapActions,
    measurement: measure,
    delivery: deliver,
    report
  };
}

export function auditPack(pack, options = {}) {
  validatePack(pack);
  const min = options.min === undefined ? 85 : Number(options.min);
  if (!Number.isFinite(min) || min < 0 || min > 100) throw new Error('Audit minimum must be a number between 0 and 100.');
  const findings = [];
  const checks = [];
  const M = pack.meta;
  const snapshot = normalizeSnapshot(pack.snapshot);
  const site = snapshot.site;
  const pages = snapshot.pages;
  const prompts = pack.promptPanel || [];
  const briefs = pack.contentBriefs || [];
  const schema = pack.schema || {};
  const citations = pack.citations || [];
  const roadmap = pack.roadmap || [];
  const measure = pack.measurement || {};
  const delivery = pack.delivery || {};
  const report = pack.report || '';

  const add = (id, cls, weight, passed, message, fix, severity = 'high') => {
    checks.push({ id, class: cls, weight, passed, message });
    if (!passed) findings.push({ id, class: cls, severity, message, fix });
  };

  const text = JSON.stringify(pack);
  add('structure.identity', 'structure', 3, Boolean(M.brand && M.domain && M.market), 'Brand, domain and market are present.', 'Add brand, domain and market to the brief.', 'critical');
  add('structure.competitors', 'structure', 2, (briefCompetitors(pack) >= 2), 'At least two competitors are named.', 'Add two real competitors so comparison prompts are meaningful.', 'high');
  add('structure.platforms', 'structure', 2, (M.platforms || []).length >= 4, 'At least four AI platforms are covered.', 'Add ChatGPT, Perplexity, Google AI, Gemini, Copilot or Claude.');
  add('structure.placeholders', 'structure', 1, !PLACEHOLDER.test(text), 'No placeholders or unreplaced tokens.', 'Replace every template token with a real value.', 'critical');

  const robots = site.robotsTxt;
  add('crawl.robots', 'crawl', 2, Boolean(robots), 'robots.txt is present.', 'Publish robots.txt and allow the AI search agents you want.', 'high');
  add('crawl.chatgptUser', 'crawl', 2, Boolean(site.aiBots?.['ChatGPT-User']?.allowed), 'ChatGPT-User is allowed at the root.', 'Allow ChatGPT-User for user-initiated retrieval without enabling model training.', 'high');
  add('crawl.oaiSearch', 'crawl', 2, Boolean(site.aiBots?.['OAI-SearchBot']?.allowed), 'OAI-SearchBot is allowed at the root.', 'Allow OAI-SearchBot separately from GPTBot; blocking training does not have to block search.', 'high');
  add('crawl.perplexity', 'crawl', 2, Boolean(site.aiBots?.PerplexityBot?.allowed), 'PerplexityBot is allowed at the root.', 'Allow PerplexityBot if Perplexity matters for the category.', 'high');
  add('crawl.claude', 'crawl', 2, Boolean(site.aiBots?.['Claude-SearchBot']?.allowed), 'Claude-SearchBot is allowed at the root.', 'Allow Claude-SearchBot for Claude retrieval; ClaudeBot is a separate training decision.', 'high');
  add('crawl.renderable', 'crawl', 2, !pages.some((p) => p.jsOnly), 'Critical content is present in the HTML.', 'Server-render the main copy; several AI fetchers do not execute JavaScript.', 'high');
  add('crawl.siteBasics', 'crawl', 2, pages.length >= 3 && pages.every((p) => p.canonical || p.path === '/'), 'At least three pages are scanned and canonicals are present where needed.', 'Add self-referencing canonicals and scan at least three priority pages.', 'medium');
  add('crawl.sitemap', 'crawl', 2, Boolean(site.sitemapPresent), 'An XML sitemap is present.', 'Publish a sitemap with canonical URLs and accurate lastmod dates.', 'medium');

  const allTypes = new Set(pages.flatMap((p) => p.schemaTypes));
  add('entity.organizationSchema', 'entity', 3, allTypes.has('Organization'), 'Organization schema is present.', 'Add Organization JSON-LD with name, url, description, areaServed and sameAs.', 'high');
  add('entity.serviceSchema', 'entity', 3, ['Service', 'Product', 'LocalBusiness', 'Dentist', 'MedicalBusiness'].some((t) => allTypes.has(t)), 'A Service, Product or business schema is present.', 'Add Service or Product JSON-LD that matches the visible offer.', 'high');
  add('entity.structuredData', 'entity', 2, allTypes.has('FAQPage') && allTypes.has('BreadcrumbList'), 'FAQPage and BreadcrumbList schema are present.', 'Add FAQPage and BreadcrumbList after the visible content exists.', 'medium');
  add('entity.sameAs', 'entity', 2, pages.some((p) => p.sameAs.length > 0) || (schema.organization?.sameAs || []).length > 0, 'sameAs profile links are present.', 'Add verified sameAs links to profiles and directories.', 'medium');
  add('entity.consistency', 'entity', 2, entityConsistent(pack), 'Brand name and service description are consistent across the pack.', 'Use one brand name, one service description and one service area everywhere.', 'high');
  add('entity.author', 'entity', 2, pages.some((p) => p.hasAuthor), 'A named author or reviewer is present.', 'Add a visible byline and credentials, and keep the schema author consistent.', 'medium');

  add('content.answerFirst', 'content', 3, pages.filter((p) => p.answerFirstWords >= 40).length >= Math.ceil(pages.length * 0.6), 'Most priority pages have a 40+ word answer-first summary.', 'Add a 40–60 word answer under the H1 on every priority page.', 'high');
  add('content.questionHeadings', 'content', 3, pages.filter((p) => p.questionHeadings >= 2).length >= Math.ceil(pages.length * 0.5), 'At least half the pages use two question-form headings.', 'Rewrite two H2s per priority page as buyer questions.', 'medium');
  add('content.depth', 'content', 3, pages.every((p) => p.wordCount >= 400), 'Priority pages have at least 400 words.', 'Expand thin pages to cover the decision, cost, risks and next step.', 'medium');
  add('content.evidence', 'content', 3, pages.some((p) => p.hasStats) && (briefs.every((b) => (b.evidenceRequired || []).length >= 3)), 'Pages carry dated evidence and every brief names its evidence.', 'Add one dated, verifiable fact per page and keep the evidence list in every brief.', 'high');
  add('content.comparison', 'content', 3, pages.some((p) => p.hasComparisonTable) || briefs.some((b) => b.pageType === 'comparison page'), 'A comparison page or table is planned.', 'Add an honest comparison table or page against the top alternatives.', 'medium');
  add('content.maintenance', 'content', 3, pages.some((p) => p.hasDate) && pages.some((p) => p.internalLinks.length >= 3) && pages.every((p) => p.imageCount === 0 || p.imagesWithAlt / p.imageCount >= 0.8), 'Freshness, internal links and image alt coverage are present.', 'Show an updated date, add three contextual internal links and write useful alt text.', 'medium');

  add('citation.sourceMap', 'citation', 4, citations.length >= 8 && citations.every((c) => c.sourceType && c.action), 'The citation plan covers at least eight source types with actions.', 'Build a source map with a concrete action per source type.', 'high');
  add('citation.thirdParty', 'citation', 3, citations.some((c) => /review|community|reddit|forum|g2|capterra|trustpilot|healthgrades|zocdoc/i.test(c.sourceType)), 'Review and community sources are included.', 'Add the review platforms and communities buyers actually use.', 'medium');
  add('citation.pr', 'citation', 2, citations.some((c) => /media|publication|podcast|news|association|conference/i.test(c.sourceType)), 'Earned media and expert sources are included.', 'Add publications, podcasts or associations where an expert contribution is credible.', 'medium');
  add('citation.ethics', 'citation', 3, citations.every((c) => !/buy reviews|fake review|paid link|astroturf|spam/i.test(c.action + c.caution)) && /no (paid|fake)|follow each community rule|disclos/i.test(JSON.stringify(citations)), 'The citation plan rejects fake reviews, paid placement and spam.', 'Remove manipulative tactics and add disclosure rules.', 'critical');

  const stages = new Set(prompts.map((p) => p.stage));
  add('prompt.funnel', 'prompt', 3, stages.size >= 4, 'The prompt panel covers at least four funnel stages.', 'Add awareness, comparison, decision and objection prompts.', 'high');
  add('prompt.mix', 'prompt', 3, prompts.some((p) => p.branded) && prompts.some((p) => !p.branded) && prompts.some((p) => p.competitor), 'The panel mixes branded, non-branded and competitor prompts.', 'Add branded, non-branded and at least one competitor prompt.', 'high');
  add('prompt.coverage', 'prompt', 3, (M.platforms || []).length >= 4 && prompts.every((p) => p.platform), 'Every prompt is assigned to a platform and at least four platforms are covered.', 'Assign each prompt to a platform and cover the four engines that matter.');
  add('prompt.testPlan', 'prompt', 3, prompts.every((p) => p.runs >= 1 && p.successSignal) && prompts.length >= 30, 'The panel has 30+ prompts, each with runs and a success signal.', 'Add 30 prompts, three runs each, and define what success means.', 'high');

  add('measurement.gsc', 'measurement', 3, /Search Console/i.test(JSON.stringify(measure)), 'Search Console generative AI reporting is in the plan.', 'Add the GSC generative AI performance report to the measurement plan.', 'medium');
  add('measurement.analytics', 'measurement', 2, /GA4/i.test(JSON.stringify(measure)) && /Bing/i.test(JSON.stringify(measure)), 'Bing citation share and GA4 AI referrals are in the plan.', 'Add Bing Webmaster Tools and a GA4 AI referral segment.', 'medium');
  add('measurement.cadence', 'measurement', 3, Boolean(measure.baselineDate && measure.reMeasureDate && measure.cadence), 'Baseline, re-measure date and cadence are defined.', 'Set a baseline date, a 30-day re-measure and a reporting cadence.', 'high');
  add('measurement.honesty', 'measurement', 2, /var(y|ies)|not a guarantee|modelled|distribution|undercount/i.test(JSON.stringify(measure)), 'The measurement plan states variance and attribution limits.', 'Add the variance, undercount and modelled-number limits.', 'high');

  add('delivery.report', 'delivery', 3, typeof report === 'string' && report.length > 1500 && /Prepared for/i.test(report) && /does not/i.test(report), 'A white-label report with limits is present.', 'Generate the client report with a prepared-for block and a limits section.', 'critical');
  add('delivery.roadmap', 'delivery', 3, roadmap.length >= 20 && roadmap.every((a) => a.priority && a.owner && a.effort && a.verification) && roadmap.some((a) => a.priority === 'P0'), 'The roadmap has 20+ owned actions with verification.', 'Add a prioritized roadmap with owner, effort and verification.', 'high');
  add('delivery.schemaInstall', 'delivery', 2, (delivery.schemaInstall || []).length >= 4, 'Schema install instructions are present.', 'Add placement and validation instructions for every schema block.', 'medium');
  add('delivery.limits', 'delivery', 2, (delivery.limits || []).length >= 4 && /guarantee/i.test((delivery.limits || []).join(' ')), 'The delivery states the limits and the no-guarantee rule.', 'Add the audit limits and a no-guarantee statement.', 'critical');

  const totalWeight = checks.reduce((a, c) => a + c.weight, 0);
  const passedWeight = checks.filter((c) => c.passed).reduce((a, c) => a + c.weight, 0);
  const score = totalWeight ? Math.round((passedWeight / totalWeight) * 100) : 0;
  const critical = findings.filter((f) => f.severity === 'critical').length;
  const high = findings.filter((f) => f.severity === 'high').length;
  let verdict = 'FIX NEEDED';
  if (critical > 0 || score < 60) verdict = 'DO NOT SHIP';
  else if (score >= min && high === 0) verdict = 'PASS';

  return {
    campaign: M.brand || 'Unknown brand',
    score,
    verdict,
    min,
    stats: {
      checks: checks.length,
      passed: checks.filter((c) => c.passed).length,
      findings: findings.length,
      critical,
      high,
      medium: findings.filter((f) => f.severity === 'medium').length,
      low: findings.filter((f) => f.severity === 'low').length,
      prompts: prompts.length,
      briefs: briefs.length,
      roadmap: roadmap.length
    },
    checks,
    findings
  };
}

function briefCompetitors(pack) {
  return (pack.meta?.competitors || []).length || new Set((pack.promptPanel || []).filter((p) => p.competitor).map((p) => p.prompt)).size;
}

function entityConsistent(pack) {
  const name = pack.meta?.brand || '';
  const city = String(pack.meta?.city || '').split(',')[0].trim();
  const description = pack.schema?.organization?.description || '';
  const services = pack.contentBriefs || [];
  if (!name || !description || !services.length) return false;
  if (city && !description.toLowerCase().includes(city.toLowerCase())) return false;
  if (services.some((b) => !b.answerBlock?.includes(name))) return false;
  if (city && services.some((b) => !b.answerBlock?.includes(city))) return false;
  return !/{{|TODO|TBD/i.test(`${description}${services.map((b) => b.answerBlock).join(' ')}`);
}
