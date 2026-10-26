#!/usr/bin/env node
/**
 * build-product-email.mjs — Render the dark product-sales email per lead.
 *
 * Usage:
 *   node build-product-email.mjs --product products/agency-delivery-os.json --lead research/lead.json
 *   node build-product-email.mjs --product products/agency-delivery-os.json --leads research/leads-enriched.json --out-dir campaigns/oct
 *   node build-product-email.mjs --product products/agency-delivery-os.json --preview
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(HERE, '..');
const TEMPLATE = path.join(SKILL_ROOT, 'templates', 'dark-product-sales.html');

const args = process.argv.slice(2);
const opt = (name, fallback = '') => {
  const found = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!found) return fallback;
  const eq = found.indexOf('=');
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1] ?? fallback;
};
const flag = (name) => args.includes(`--${name}`);

const productPath = opt('product');
if (!productPath) {
  console.error('Usage: node build-product-email.mjs --product <product.json> (--lead <lead.json> | --leads <leads.json> | --preview) [--out-dir <dir>] [--subject <subject>]');
  process.exit(1);
}

const productFile = path.resolve(process.cwd(), productPath);
const product = JSON.parse(fs.readFileSync(productFile, 'utf8'));
const templateFile = path.resolve(process.cwd(), opt('template', TEMPLATE));
const template = fs.readFileSync(templateFile, 'utf8');
const today = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
const defaultOut = path.join(SKILL_ROOT, 'campaigns', `${today}-${product.slug || 'product'}`);
const outDir = path.resolve(process.cwd(), opt('out-dir', defaultOut));
const explicitSubject = opt('subject');

const leadFile = opt('lead');
const leadsFile = opt('leads');
const preview = flag('preview') || (!leadFile && !leadsFile);

let leads;
if (leadFile) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), leadFile), 'utf8'));
  leads = [Array.isArray(raw) ? raw[0] : raw];
} else if (leadsFile) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), leadsFile), 'utf8'));
  leads = Array.isArray(raw) ? raw : raw.leads;
  if (!Array.isArray(leads)) {
    console.error('Leads file must be an array or { leads: [...] }.');
    process.exit(1);
  }
} else {
  leads = [{
    name: 'Preview',
    first_name: 'there',
    company: 'your team',
    city: 'Bengaluru',
    email: 'preview@example.com',
    personalization_hook: 'Saw your team is shipping AI features faster than the delivery controls around them.',
    pain_hypothesis: 'AI delivery is moving faster than the cost, context and reliability controls around it.',
    why_now: 'The team is at the stage where ad-hoc AI delivery starts costing more than it returns.',
    product_fit: product.name,
  }];
}

fs.mkdirSync(outDir, { recursive: true });

const inr = (value) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value) || 0)}`;
const price = product.price_label || inr(product.price_inr);
const comparePrice = product.compare_label || (product.compare_inr ? inr(product.compare_inr) : '');
const year = String(new Date().getFullYear());

const subjectVariants = buildSubjectVariants(product, leads[0], price);
const manifest = {
  campaign: `${today}-${product.slug}`,
  product: product.slug,
  product_name: product.name,
  template: path.relative(process.cwd(), templateFile),
  built_at: new Date().toISOString(),
  lead_count: leads.length,
  subject: explicitSubject || subjectVariants[0],
  subject_variants: subjectVariants,
  entries: [],
};

for (const lead of leads) {
  const subject = explicitSubject || buildSubjectVariants(product, lead, price)[0];
  const html = render(product, lead, subject, { price, comparePrice, year });
  const text = renderText(product, lead, subject, { price, comparePrice });
  const safeEmail = String(lead.email || `lead-${manifest.entries.length + 1}`).replace(/[^a-z0-9._-]/gi, '_');
  const base = `${String(manifest.entries.length + 1).padStart(3, '0')}-${safeEmail}`;
  const htmlPath = path.join(outDir, `${base}.html`);
  const textPath = path.join(outDir, `${base}.txt`);
  fs.writeFileSync(htmlPath, html);
  fs.writeFileSync(textPath, text);

  manifest.entries.push({
    email: lead.email || '',
    company: lead.company || '',
    name: lead.name || '',
    city: lead.city || '',
    product_fit: lead.product_fit || product.name,
    research_score: lead.research_score ?? null,
    subject,
    html_path: path.relative(process.cwd(), htmlPath),
    text_path: path.relative(process.cwd(), textPath),
  });
}

const manifestPath = path.join(outDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('='.repeat(68));
console.log('🎨 Dark Product Email Builder');
console.log('='.repeat(68));
console.log(`Product:  ${product.name} · ${price}`);
console.log(`Template: ${path.relative(process.cwd(), templateFile)}`);
console.log(`Leads:    ${leads.length}`);
console.log(`Out dir:  ${path.relative(process.cwd(), outDir)}`);
console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
console.log(`Subject:  ${manifest.subject}`);
console.log('\nSubject variants:');
subjectVariants.forEach((s, i) => console.log(`  ${i + 1}. ${s} (${s.length} chars)`));
console.log('\nNext:');
console.log(`  node .agent/skills/deepak-newsletter/scripts/audit-product-email.mjs --file ${path.relative(process.cwd(), path.join(outDir, manifest.entries[0].html_path))} --subject "${manifest.subject}"`);

function buildSubjectVariants(p, lead, priceLabel) {
  if (Array.isArray(p.subject_variants) && p.subject_variants.length) {
    return p.subject_variants.map((s) => fill(s, p, lead, priceLabel)).map((s) => trimSubject(s));
  }
  const first = lead.first_name || lead.name?.split(/\s+/)[0] || (lead.company ? lead.company.split(/\s+/)[0] : 'there');
  const company = lead.company || 'your team';
  const companyShort = company.length > 28 ? company.split(/\s+/)[0] : company;
  const city = lead.city || 'India';
  const outcome = p.outcome_short || p.outcome || p.tagline || 'ship AI without the delivery mess';
  const pain = p.pain_short || 'the delivery gap';
  return [
    `${first}, ${outcome} (${priceLabel})`,
    `${companyShort}: ${outcome} for ${priceLabel}`,
    `${city} teams: ${p.name} at ${priceLabel}`,
    `${outcome} without hiring`,
    `${first}, a ${priceLabel} fix for ${pain}`,
  ].map((s) => trimSubject(fill(s, p, lead, priceLabel)));
}

function trimSubject(subject) {
  let value = String(subject || '').replace(/\s+/g, ' ').trim();
  if (value.length <= 65) return value;
  let cut = value.slice(0, 65);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 45) cut = cut.slice(0, lastSpace);
  return cut.replace(/[\s,;:.-]+$/, '');
}

function fill(value, p, lead, priceLabel) {
  return String(value || '')
    .replace(/\{\{FIRST_NAME\}\}/g, lead.first_name || lead.name?.split(/\s+/)[0] || (lead.company ? lead.company.split(/\s+/)[0] : 'there'))
    .replace(/\{\{COMPANY\}\}/g, lead.company || 'your team')
    .replace(/\{\{COMPANY_SHORT\}\}/g, lead.company && lead.company.length > 28 ? lead.company.split(/\s+/)[0] : (lead.company || 'your team'))
    .replace(/\{\{CITY\}\}/g, lead.city || 'India')
    .replace(/\{\{PRODUCT_NAME\}\}/g, p.name || '')
    .replace(/\{\{PRICE\}\}/g, priceLabel);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(p, lead, subject, ctx) {
  const hook = lead.personalization_hook || lead.hook || `Saw ${lead.company || 'your team'} is building in ${lead.city || 'India'}.`;
  const pain = lead.pain_hypothesis || lead.pain || p.pain_points?.[0] || 'The delivery gap is widening faster than the team can patch it.';
  const outcome = p.outcome || p.tagline || 'Ship the work with fewer retries, lower cost and a clean handoff.';
  const proof = (p.proof_bullets || []).map((item) => `<li style="margin:0 0 6px 0;">${escapeHtml(item)}</li>`).join('\n                ');
  const features = (p.features || []).map((row) => `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #1f2630;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#7d8590;width:42%;">${escapeHtml(row.label)}</td>
                  <td style="padding:12px 0;border-bottom:1px solid #1f2630;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#c9d1d9;text-align:right;">${escapeHtml(row.value)}</td>
                </tr>`).join('');
  const bonus = p.bonus ? `<strong style="color:#c9d1d9;">Included:</strong> ${escapeHtml(p.bonus)}` : 'Includes free updates and direct email support.';
  const guarantee = p.guarantee || 'If the first artifact does not save you an hour, reply and I will refund the purchase.';
  const ps = p.ps || `Reply with your current ${lead.segment || 'delivery'} workflow and I will tell you which artifact to run first.`;
  const unsubscribe = lead.unsubscribe_url || p.unsubscribe_url || 'https://deepakbagada.in/newsletter/unsubscribe/preview';
  const ctaLabel = fill(p.cta_label || `Get ${p.name} — ${ctx.price}`, p, lead, ctx.price);
  const preheader = p.preheader || `${p.name} for ${lead.company || 'your team'} — ${ctx.price}. ${outcome}`;

  const replacements = {
    SUBJECT: subject,
    PREHEADER: escapeHtml(preheader),
    HOOK: escapeHtml(hook),
    PAIN: escapeHtml(pain),
    OUTCOME: escapeHtml(outcome),
    PRODUCT_NAME: escapeHtml(p.name),
    PRODUCT_TAGLINE: escapeHtml(p.tagline || ''),
    PRICE: escapeHtml(ctx.price),
    COMPARE_PRICE: escapeHtml(ctx.comparePrice),
    PRICE_NOTE: escapeHtml(p.price_note || 'One-time · commercial license'),
    PROOF_BULLETS: proof,
    FEATURE_ROWS: features,
    BONUS_BLOCK: bonus,
    GUARANTEE: escapeHtml(guarantee),
    CTA_URL: escapeHtml(p.cta_url || `https://deepakbagada.in/products/${p.slug}`),
    CTA_LABEL: escapeHtml(ctaLabel),
    PS: escapeHtml(ps),
    UNSUBSCRIBE_URL: escapeHtml(unsubscribe),
    EMAIL: escapeHtml(lead.email || ''),
    REGION: escapeHtml(lead.city || p.audience_cities?.[0] || 'India'),
    YEAR: ctx.year,
  };

  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }

  const unresolved = html.match(/\{\{[A-Z_]+\}\}/g);
  if (unresolved) throw new Error(`Unresolved placeholders: ${[...new Set(unresolved)].join(', ')}`);
  return html;
}

function renderText(p, lead, subject, ctx) {
  const hook = lead.personalization_hook || lead.hook || `Saw ${lead.company || 'your team'} is building in ${lead.city || 'India'}.`;
  const pain = lead.pain_hypothesis || lead.pain || p.pain_points?.[0] || 'The delivery gap is widening faster than the team can patch it.';
  const lines = [];
  lines.push(subject);
  lines.push('');
  lines.push(hook);
  lines.push('');
  lines.push(pain);
  lines.push('');
  lines.push(`THE FIX: ${p.outcome || p.tagline || ''}`);
  lines.push('');
  lines.push(`${p.name}`);
  lines.push(p.tagline || '');
  lines.push('');
  lines.push(`${ctx.price}${ctx.comparePrice ? ` (was ${ctx.comparePrice})` : ''}`);
  lines.push(p.price_note || 'One-time · commercial license');
  lines.push('');
  lines.push(`Get it: ${p.cta_url || `https://deepakbagada.in/products/${p.slug}`}`);
  lines.push('');
  lines.push('WHAT YOU GET');
  (p.proof_bullets || []).forEach((item) => lines.push(`- ${item}`));
  lines.push('');
  (p.features || []).forEach((row) => lines.push(`${row.label}: ${row.value}`));
  lines.push('');
  if (p.bonus) lines.push(`Included: ${p.bonus}`);
  lines.push(`Guarantee: ${p.guarantee || 'If the first artifact does not save you an hour, reply and I will refund the purchase.'}`);
  lines.push('');
  lines.push(p.ps || `Reply with your current ${lead.segment || 'delivery'} workflow and I will tell you which artifact to run first.`);
  lines.push('');
  lines.push('— Deepak Bagada');
  lines.push('Founder, SaaS Next · AI systems engineer · Junagadh, India');
  lines.push('');
  lines.push(`Unsubscribe: ${lead.unsubscribe_url || p.unsubscribe_url || 'https://deepakbagada.in/newsletter/unsubscribe/preview'}`);
  lines.push('Deepak Bagada · Junagadh, Gujarat 362001, India');
  return lines.join('\n');
}
