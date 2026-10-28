#!/usr/bin/env node

/**
 * Personal-email discovery for Deepak Bagada's outreach engine.
 *
 * Generic inboxes (info@, hello@, contact@) get filtered by spam systems and
 * rarely reach a decision-maker. This script crawls each company's own site
 * (home, contact, about, team, leadership) and keeps only a named person's
 * address, with the name and role found next to it.
 *
 * Usage:
 *   node find-personal-emails.mjs \
 *     --in research/profiles.json \
 *     --out research/personal-leads.json \
 *     --country="United States" \
 *     --exclude=campaigns/2026-10-27/sent.json \
 *     --mx --limit=50
 *
 * Input: JSON array of { company, website, city, region, country, description,
 *        services, founded, profile_url } OR a newline list of domains via --domains.
 *
 * Output: raw leads JSON compatible with enrich-leads.mjs. Every row carries
 *         contact_type:"personal" and name_source:"page" | "email".
 */

import fs from 'node:fs';
import dns from 'node:dns/promises';

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (!a.startsWith('--')) continue;
  const eq = a.indexOf('=');
  if (eq !== -1) {
    args[a.slice(2, eq)] = a.slice(eq + 1);
  } else {
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      args[a.slice(2)] = next;
      i++;
    } else {
      args[a.slice(2)] = true;
    }
  }
}

const inputFile = args.in || args.file;
const domainsFile = args.domains;
const outFile = args.out || 'research/personal-leads.json';
const country = (args.country || '').toLowerCase();
const limit = Number(args.limit || 0);
const concurrency = Math.max(1, Number(args.concurrency || 8));
const maxPages = Math.max(2, Number(args['max-pages'] || 8));
const timeoutMs = Math.max(3000, Number(args.timeout || 9000));
const checkMx = Boolean(args.mx);
const includeRole = Boolean(args['include-role']);

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const GENERIC = new Set([
  'info', 'contact', 'hello', 'hi', 'hey', 'sales', 'support', 'admin', 'office',
  'team', 'enquiry', 'enquiries', 'inquiry', 'inquiries', 'help', 'care', 'hr',
  'jobs', 'careers', 'marketing', 'billing', 'accounts', 'accounting', 'finance',
  'no-reply', 'noreply', 'donotreply', 'webmaster', 'press', 'media', 'pr',
  'legal', 'privacy', 'security', 'biz', 'business', 'newbusiness', 'general',
  'mail', 'email', 'getstarted', 'connect', 'work', 'projects', 'consulting',
  'deploy', 'humans', 'weare', 'communications', 'partnerships', 'partners',
  'founder', 'founders', 'ceo', 'cto', 'coo', 'cmo', 'team', 'studio', 'agency',
  'clients', 'client', 'success', 'onboarding', 'intake', 'apply', 'join',
  'recruiting', 'talent', 'people', 'dev', 'developers', 'engineering', 'tech',
  'it', 'ops', 'operations', 'reception', 'frontdesk', 'orders', 'returns',
]);

const ROLE_TITLE = /\b(Founder|Co[\s-]?Founder|CEO|Chief Executive|CTO|Chief Technology|COO|CMO|Partner|Principal|Owner|President|Managing Director|Managing Partner|Director|Head of [A-Z][a-z]+)\b/;
const NAME_RE = /\b([A-Z][a-z]{1,15}(?:\s+[A-Z][a-z]{1,20}){1,2})\b/;

const PAGES = [
  '', 'contact', 'contact-us', 'about', 'about-us', 'team', 'our-team',
  'people', 'leadership', 'founders', 'company', 'who-we-are', 'meet-the-team',
];

function decodeCfEmail(hex) {
  try {
    const key = parseInt(hex.slice(0, 2), 16);
    let out = '';
    for (let i = 2; i < hex.length; i += 2) out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    return out;
  } catch {
    return '';
  }
}

function deobfuscate(text) {
  return text
    .replace(/\s*[[(]?\s*(?:at|AT)\s*[\])]?\s*/g, '@')
    .replace(/\s*[[(]?\s*(?:dot|DOT)\s*[\])]?\s*/g, '.');
}

function stripTags(html) {
  return deobfuscate(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ');
}

function domainOf(url) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
    });
    if (!res.ok) return '';
    const type = res.headers.get('content-type') || '';
    if (!/text\/html|text\/plain/i.test(type)) return '';
    const body = await res.text();
    return body.length > 700000 ? body.slice(0, 700000) : body;
  } catch {
    return '';
  }
}

function namesFromLocal(local) {
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    const [a, b] = parts;
    if (!/^[a-z]{2,15}$/.test(a) || !/^[a-z]{2,20}$/.test(b)) return null;
    return { name: `${cap(a)} ${cap(b)}`, first: cap(a), good: true };
  }
  if (/^[a-z]{3,10}$/.test(local)) return { name: cap(local), first: cap(local), good: true };
  return null;
}

function cap(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function nearName(text, email) {
  const i = text.toLowerCase().indexOf(email);
  if (i === -1) return null;
  const win = text.slice(Math.max(0, i - 220), i + email.length + 220);
  const names = [...win.matchAll(NAME_RE)].map((m) => m[1]).filter((n) => !/^(United States|New York|San Francisco|Los Angeles|Our Team|Meet The|Book A|Get In|Contact Us)$/i.test(n));
  const titles = [...win.matchAll(ROLE_TITLE)];
  if (!names.length) return null;
  return { name: names[0], title: titles.length ? titles[0][1] : '' };
}

function titleScore(title) {
  if (!title) return 0;
  if (/Founder|CEO|Chief Executive|Owner|President|Managing Director|Managing Partner/i.test(title)) return 3;
  if (/CTO|COO|CMO|Chief|Partner|Principal|Director|Head of/i.test(title)) return 2;
  return 1;
}

function collect(html, siteDomain) {
  const found = new Map();
  const text = stripTags(html);

  for (const m of html.matchAll(/data-cfemail="([0-9a-fA-F]+)"/g)) {
    const email = decodeCfEmail(m[1]).toLowerCase();
    if (email) found.set(email, { source: 'cf' });
  }
  for (const re of [
    /mailto:([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})/gi,
    /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g,
  ]) {
    for (const m of html.matchAll(re)) {
      const email = (m[1] || m[0]).toLowerCase();
      if (!found.has(email)) found.set(email, { source: 'html' });
    }
  }

  const out = [];
  for (const [email, meta] of found) {
    if (!email || email.length > 90) continue;
    const [local, edom] = email.split('@');
    if (!local || !edom) continue;
    if (!(edom === siteDomain || edom.endsWith(`.${siteDomain}`))) continue;
    if (!includeRole && GENERIC.has(local)) continue;
    if (/^(sentry|wixpress|example|yourdomain|domain|email|name|user)/.test(edom)) continue;
    if (/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(email)) continue;
    if (!/^[a-z][a-z0-9._-]{1,34}$/.test(local)) continue;
    if (/\d{3,}/.test(local)) continue;

    const localName = namesFromLocal(local);
    const near = nearName(text, email);
    const name = near?.name || localName?.name;
    if (!name) continue;
    const first = name.split(/\s+/)[0];
    if (!/^[A-Z][a-z]{1,20}$/.test(first)) continue;

    out.push({
      email,
      name,
      first_name: first,
      title: near?.title || '',
      name_source: near?.name ? 'page' : 'email',
      found_on: meta.source,
      _score: titleScore(near?.title) + (near?.name ? 2 : 0) + (localName ? 1 : 0),
    });
  }
  return out;
}

const mxCache = new Map();
async function mxOk(domain) {
  if (!checkMx) return true;
  if (mxCache.has(domain)) return mxCache.get(domain);
  const ok = await Promise.race([
    dns.resolveMx(domain).then((mx) => mx.length > 0).catch(() => false),
    new Promise((resolve) => setTimeout(() => resolve(false), 2500)),
  ]);
  mxCache.set(domain, ok);
  return ok;
}

async function crawlCompany(item) {
  const site = item.website?.startsWith('http') ? item.website : `https://${item.website}`;
  if (!site) return [];
  const siteDomain = domainOf(site);
  if (!siteDomain) return [];
  const base = site.replace(/\/+$/, '');
  const seen = new Set();
  const people = [];

  for (const page of PAGES.slice(0, maxPages)) {
    const url = page ? `${base}/${page}` : base;
    const html = await fetchText(url);
    if (!html) continue;
    for (const p of collect(html, siteDomain)) {
      if (seen.has(p.email)) continue;
      seen.add(p.email);
      people.push({ ...p, page_url: url });
    }
    if (people.filter((p) => titleScore(p.title) >= 2).length >= 2) break;
  }

  people.sort((a, b) => b._score - a._score);
  return people.slice(0, 2);
}

async function pool(items, worker, n) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        results[idx] = await worker(items[idx], idx);
      } catch {
        results[idx] = [];
      }
    }
  });
  await Promise.all(runners);
  return results.flat();
}

let companies = [];
if (inputFile) {
  const raw = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  companies = Array.isArray(raw) ? raw : raw.leads || raw.companies || [];
} else if (domainsFile) {
  companies = fs.readFileSync(domainsFile, 'utf8').split(/\r?\n/).map((d) => d.trim()).filter(Boolean).map((d) => ({ company: domainOf(d), website: d }));
} else {
  console.error('Pass --in profiles.json or --domains domains.txt');
  process.exit(2);
}

if (country) companies = companies.filter((c) => String(c.country || '').toLowerCase().includes(country));

const contacted = new Set();
const contactedDomains = new Set();
for (const f of String(args.exclude || '').split(',').map((s) => s.trim()).filter(Boolean)) {
  if (!fs.existsSync(f)) continue;
  const raw = JSON.parse(fs.readFileSync(f, 'utf8'));
  const rows = Array.isArray(raw) ? raw : raw.sent || raw.leads || [];
  for (const r of rows) {
    const email = String(r.email || '').toLowerCase();
    if (!email.includes('@')) continue;
    contacted.add(email);
    contactedDomains.add(email.split('@')[1]);
  }
}

const seenDomain = new Set();
companies = companies.filter((c) => {
  const d = domainOf(c.website || '');
  if (!d || seenDomain.has(d)) return false;
  seenDomain.add(d);
  if (contactedDomains.has(d)) return false;
  return true;
});

console.log(`Crawling ${companies.length} sites for named emails (concurrency ${concurrency})…`);
const t0 = Date.now();
let done = 0;
const found = await pool(companies, async (c) => {
  const people = await crawlCompany(c);
  done++;
  if (done % 15 === 0 || done === companies.length) {
    console.log(`  ${done}/${companies.length} sites · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  return people.map((p) => ({ company: c, person: p }));
}, concurrency);

const candidates = [];
const taken = new Set();
for (const { company, person } of found) {
  if (contacted.has(person.email) || taken.has(person.email)) continue;
  taken.add(person.email);
  candidates.push({ company, person, domain: person.email.split('@')[1] });
}

const mx = await Promise.all(candidates.map((c) => mxOk(c.domain)));

const results = [];
for (let idx = 0; idx < candidates.length; idx++) {
  if (!mx[idx]) continue;
  const { company, person, domain } = candidates[idx];
  results.push({
    id: `PERSON-${String(results.length + 1).padStart(3, '0')}`,
    company: company.company || company.name || domain,
    domain,
    website: company.website,
    email: person.email,
    name: person.name,
    first_name: person.first_name,
    title: person.title || 'Team member',
    role_tier: titleScore(person.title) >= 2 ? 'founder' : 'operator',
    city: company.city || '',
    state: company.region || '',
    country: company.country || 'United States',
    segment: 'agency',
    niche: Array.isArray(company.services) ? company.services.slice(0, 2).join(' · ') : 'AI automation agency',
    source_url: person.page_url,
    signal: `Named contact published on ${person.page_url} (${person.name_source === 'page' ? 'name and role on page' : 'name derived from address'}).`,
    tech_stack: Array.isArray(company.services) ? company.services : [],
    pain_hypothesis: '',
    personalization_hook: '',
    why_now: '',
    product_fit: '',
    email_status: 'valid',
    mx: checkMx ? true : undefined,
    contact_type: 'personal',
    name_source: person.name_source,
    email_source: person.found_on,
    quality_flags: [],
    researched_at: new Date().toISOString().slice(0, 10),
    notes: '',
  });
}

results.sort((a, b) => titleScore(b.title) - titleScore(a.title) || a.company.localeCompare(b.company));
const final = limit > 0 ? results.slice(0, limit) : results;

fs.writeFileSync(outFile, JSON.stringify(final, null, 1));
console.log(`\nSites crawled: ${companies.length}`);
console.log(`Named emails found: ${results.length}`);
console.log(`Written: ${final.length} → ${outFile}`);
console.log(`Time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
for (const r of final.slice(0, 12)) console.log(`  ${r.email} · ${r.name}${r.title ? ` (${r.title})` : ''} · ${r.company}`);
