#!/usr/bin/env node
/**
 * audit-product-email.mjs — Dark-theme product email gate.
 *
 * Usage:
 *   node audit-product-email.mjs --file campaigns/.../001-lead.html --subject "Subject"
 *   node audit-product-email.mjs --manifest campaigns/.../manifest.json
 *   node audit-product-email.mjs --file email.html --text email.txt --out report.md
 *
 * Exit 1 on any FAIL. Warnings do not block.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback = '') => {
  const found = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!found) return fallback;
  const eq = found.indexOf('=');
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1] ?? fallback;
};
const flag = (name) => args.includes(`--${name}`);

const SPAM_WORDS = [
  'act now', 'buy now', 'cash bonus', 'click here', 'congratulations', 'credit card offer',
  'double your', 'earn extra', 'exclusive deal', 'free money', 'guaranteed income',
  'limited time', 'lowest price', 'make money', 'no cost', 'no obligation', 'once in a lifetime',
  'order now', 'risk-free', 'satisfaction guaranteed', 'special promotion', 'urgent',
  'viagra', 'work from home', 'winner', 'you have been selected', '100% free',
];

const BANNED_PHRASES = [
  'dear sir/madam', 'i hope this email finds you well', 'i hope you are doing well',
  'revolutionary', 'game-changer', 'game changer', 'cutting-edge', 'synergy',
  'circle back', 'touch base', 'world-class', 'best-in-class', 'unlock the power',
];

const manifestFile = opt('manifest');
let files = [];
let subjects = [];

if (manifestFile) {
  const manifestPath = path.resolve(process.cwd(), manifestFile);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const base = path.dirname(manifestPath);
  files = (manifest.entries || []).map((entry) => ({
    html: path.resolve(process.cwd(), entry.html_path),
    text: entry.text_path ? path.resolve(process.cwd(), entry.text_path) : null,
    subject: entry.subject || manifest.subject || '',
    label: entry.company || entry.email || path.basename(entry.html_path),
  }));
  subjects = manifest.subject_variants || [manifest.subject].filter(Boolean);
} else {
  const file = opt('file');
  if (!file) {
    console.error('Usage: node audit-product-email.mjs (--file <email.html> | --manifest <manifest.json>) [--subject "..."] [--text <email.txt>] [--out report.md]');
    process.exit(1);
  }
  files = [{
    html: path.resolve(process.cwd(), file),
    text: opt('text') ? path.resolve(process.cwd(), opt('text')) : null,
    subject: opt('subject', ''),
    label: path.basename(file),
  }];
  subjects = [files[0].subject].filter(Boolean);
}

const results = [];
const globalIssues = [];

for (const item of files) {
  if (!fs.existsSync(item.html)) {
    results.push({ label: item.label, fails: [`missing_file: ${item.html}`], warns: [], subject: item.subject });
    continue;
  }
  const html = fs.readFileSync(item.html, 'utf8');
  const text = item.text && fs.existsSync(item.text) ? fs.readFileSync(item.text, 'utf8') : '';
  const subject = item.subject || (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  const lower = html.toLowerCase();
  const fails = [];
  const warns = [];

  if (!subject) fails.push('missing_subject');
  else {
    if (subject.length < 20) warns.push('subject_short');
    if (subject.length > 65) fails.push(`subject_${subject.length}_chars_max_65`);
    if (subject === subject.toUpperCase() && /[A-Z]/.test(subject)) fails.push('subject_all_caps');
    if (/[!]{2,}|[?]{2,}/.test(subject)) fails.push('subject_punctuation_spam');
    const subjectLower = subject.toLowerCase();
    SPAM_WORDS.forEach((word) => { if (subjectLower.includes(word)) fails.push(`subject_spam:${word}`); });
  }

  const unresolved = html.match(/\{\{[A-Z_]+\}\}/g);
  if (unresolved) fails.push(`unresolved_placeholders:${[...new Set(unresolved)].join('|')}`);

  if (!/#07090d|#0a0c10|#0b0d10|#0e1117/i.test(html)) fails.push('dark_palette_missing');
  if (!/max-width:\s*600px/i.test(html)) fails.push('container_width_not_600');
  if (/<img\b/i.test(html)) fails.push('image_tag_found');
  if (/<script\b/i.test(html)) fails.push('script_tag_found');
  if (/<link[^>]+rel=["']stylesheet/i.test(html)) fails.push('external_stylesheet_found');
  if (/@import\s+url/i.test(html)) fails.push('css_import_found');
  if (!/display\s*:\s*none/i.test(html)) fails.push('preheader_hidden_missing');
  if (!/href="https:\/\/deepakbagada\.in\/products\//i.test(html)) fails.push('product_cta_missing');
  if (!/[$₹]/.test(html)) fails.push('price_missing');
  if (!/unsubscribe/i.test(html)) fails.push('unsubscribe_missing');
  if (!/junagadh/i.test(html) || !/362001/.test(html)) fails.push('physical_address_missing');
  if (!/Deepak Bagada/i.test(html)) fails.push('sender_identity_missing');
  if (!/-apple-system|BlinkMacSystemFont|Segoe UI/i.test(html)) warns.push('system_font_stack_missing');
  if (!/role="presentation"/i.test(html)) warns.push('layout_table_role_missing');
  if (/style="[^"]*position:\s*fixed/i.test(html)) warns.push('position_fixed_found');
  if (/background-color:\s*#fff(?:fff)?/i.test(html)) warns.push('white_background_found');

  const bodyText = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  BANNED_PHRASES.forEach((phrase) => { if (bodyText.includes(phrase)) fails.push(`banned_phrase:${phrase}`); });
  SPAM_WORDS.forEach((word) => { if (bodyText.includes(word)) warns.push(`spam_word:${word}`); });

  if (bodyText.length < 500) fails.push('body_too_thin');
  if (bodyText.length > 6000) warns.push('body_too_long');
  if (text) {
    if (!/unsubscribe/i.test(text)) fails.push('plain_text_unsubscribe_missing');
    if (!/junagadh/i.test(text)) fails.push('plain_text_address_missing');
    if (text.length < 400) warns.push('plain_text_thin');
  } else {
    warns.push('plain_text_missing');
  }

  const productLinks = (html.match(/https:\/\/deepakbagada\.in\/products\//gi) || []).length;
  if (productLinks > 3) warns.push('too_many_product_links');

  results.push({ label: item.label, subject, fails: [...new Set(fails)], warns: [...new Set(warns)] });
}

if (subjects.length > 1) {
  const duplicates = subjects.filter((s, i) => subjects.indexOf(s) !== i);
  if (duplicates.length) globalIssues.push(`duplicate_subjects:${[...new Set(duplicates)].join('|')}`);
}

const failed = results.filter((r) => r.fails.length);
const passed = results.filter((r) => !r.fails.length);

const lines = [];
lines.push('# Dark Product Email Audit');
lines.push('');
lines.push(`**Files:** ${results.length} · **Pass:** ${passed.length} · **Fail:** ${failed.length}`);
lines.push('');
lines.push('## Results');
lines.push('');
lines.push('| Lead | Subject | Result | Fails | Warns |');
lines.push('|---|---|---|---|---|');
results.forEach((r) => {
  lines.push(`| ${r.label} | ${r.subject || '—'} | ${r.fails.length ? 'FAIL' : 'PASS'} | ${r.fails.join(', ') || '—'} | ${r.warns.join(', ') || '—'} |`);
});
if (globalIssues.length) {
  lines.push('');
  lines.push('## Global');
  lines.push('');
  globalIssues.forEach((issue) => lines.push(`- ${issue}`));
}
lines.push('');

const outPath = opt('out');
if (outPath) {
  const resolved = path.resolve(process.cwd(), outPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, lines.join('\n'));
}

console.log('='.repeat(68));
console.log('🛡️  Dark Product Email Audit');
console.log('='.repeat(68));
console.log(`Files: ${results.length} · Pass: ${passed.length} · Fail: ${failed.length}`);
results.forEach((r) => {
  console.log(`  ${r.fails.length ? '❌' : '✅'} ${r.label}${r.subject ? ' — ' + r.subject : ''}`);
  if (r.fails.length) console.log(`     FAIL: ${r.fails.join(', ')}`);
  if (r.warns.length) console.log(`     WARN: ${r.warns.join(', ')}`);
});
if (globalIssues.length) console.log(`\nGlobal: ${globalIssues.join(' · ')}`);
if (failed.length) process.exit(1);
