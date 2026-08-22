#!/usr/bin/env node
// audit-blog.mjs — Stage 4 of deepak-blog v4.0
// Pre-publish audit harness for the sequential write pipeline.
// Scans a draft pack (or a single body string) and checks EEAT, AEO, SEO, formatting.
// Writes blog-audit.md with scaffold for subagent auditor.
//
// Usage:
//   node scripts/audit-blog.mjs --body "path/to/draft.md" --meta title="..." --out blog-audit.md
//   node scripts/audit-blog.mjs --pack ./draft-pack --out blog-audit.md
//   node scripts/audit-blog.mjs --post-index 0  (audit data/posts.php[0] body)
//

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

const BRAND = "═".repeat(58);
console.log(`\n${BRAND}\n  📝 deepak-blog v4.0 — audit-blog.mjs\n  Pre-Publish Content & SEO/AEO Audit\n${BRAND}\n`);

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const packArg = opt("pack", "");
const bodyArg = opt("body", "");
const titleArg = opt("title", "");
const excerptArg = opt("excerpt", "");
const slugArg = opt("slug", "");
const tagArg = opt("tag", "");
const outPath = resolve(process.cwd(), opt("out", "blog-audit.md"));

let title = titleArg;
let excerpt = excerptArg;
let slug = slugArg;
let tag = tagArg;
let body = "";
let packDir = "";

if (packArg) {
  packDir = resolve(process.cwd(), packArg);
  if (!existsSync(packDir)) { console.error(`❌ Pack folder not found: ${packDir}`); process.exit(2); }
  const read = (f) => existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null;
  const article = read("article.md") || read("body.md") || read("draft.md") || "";
  const meta = read("meta.md") || "";
  body = article;
  if (!title && meta) { const m = meta.match(/title[:：]\s*["“']?([^"”\n]{0,100})/i); if (m) title = m[1].trim(); }
  if (!excerpt && meta) { const m = meta.match(/description[:：]\s*["“']?([^"”\n]{0,200})/i); if (m) excerpt = m[1].trim(); }
  if (!body) body = meta ? "" : (read("index.md") || "");
} else if (bodyArg) {
  const p = resolve(process.cwd(), bodyArg);
  if (!existsSync(p)) { console.error(`❌ Body file not found: ${p}`); process.exit(2); }
  body = readFileSync(p, "utf8");
} else if (opt("post-index", "") !== "") {
  const idx = parseInt(opt("post-index", "0"), 10);
  const postsPath = resolve(process.cwd(), "data/posts.php");
  const raw = readFileSync(postsPath, "utf8");
  // crude extract: find body blocks
  const bodies = [...raw.matchAll(/'body'\s*=>\s*<<<'BODY'([\s\S]*?)BODY,/g)].map(m => m[1]);
  const titles = [...raw.matchAll(/'title'\s*=>\s*'([^']+)'/g)].map(m => m[1]);
  const excerpts = [...raw.matchAll(/'excerpt'\s*=>\s*'([^']+)'/g)].map(m => m[1]);
  const slugs = [...raw.matchAll(/'slug'\s*=>\s*'([^']+)'/g)].map(m => m[1]);
  const tags = [...raw.matchAll(/'tag'\s*=>\s*'([^']+)'/g)].map(m => m[1]);
  if (bodies[idx] !== undefined) {
    body = bodies[idx];
    title = titles[idx] || title;
    excerpt = excerpts[idx] || excerpt;
    slug = slugs[idx] || slug;
    tag = tags[idx] || tag;
  } else { console.error(`❌ No post at index ${idx} in data/posts.php`); process.exit(2); }
} else {
  console.error("Usage:");
  console.error("  node scripts/audit-blog.mjs --pack ./draft-pack --out blog-audit.md");
  console.error("  node scripts/audit-blog.mjs --body draft.md --title \"...\" --excerpt \"...\" --out blog-audit.md");
  console.error("  node scripts/audit-blog.mjs --post-index 0 --out blog-audit.md");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

// ─── title / excerpt ───────────────────────────────────────────────────────
if (!title) add("FAIL", "Meta title", "Missing — title must be <60 chars, high-CTR, with year 2026");
else if (title.length > 60) add("FAIL", "Meta title ≤60 chars", `${title.length} chars: "${title}" — over cap`);
else if (title.length < 20) add("WARN", "Meta title", `${title.length} chars — too short for CTR`);
else add("PASS", "Meta title ≤60 chars", `${title.length} chars: "${title}"`);

if (!excerpt) add("FAIL", "Meta description / excerpt", "Missing — need 140-160 chars, answer-first");
else if (excerpt.length < 90) add("WARN", "Meta description 140-160", `${excerpt.length} chars — short: "${excerpt.slice(0, 80)}..."`);
else if (excerpt.length > 165) add("WARN", "Meta description 140-160", `${excerpt.length} chars — may truncate`);
else add("PASS", "Meta description 140-160", `${excerpt.length} chars`);

if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) add("WARN", "Slug format", `"${slug}" — use lowercase-kebab-case`);
else if (slug) add("PASS", "Slug format", `\`${slug}\``);

// ─── body checks ───────────────────────────────────────────────────────────
if (!body || body.trim().length < 200) {
  add("FAIL", "Article body", "Missing or too short");
} else {
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 1200) add("FAIL", "Word count ≥1200", `${words} words — need 1,200-1,600+`);
  else if (words > 2200) add("WARN", "Word count", `${words} words — long, ensure every section earns it`);
  else add("PASS", "Word count ≥1200", `${words} words`);

  // AEO intro: first 2-3 sentences should answer the question
  const intro = body.replace(/^#{1,6}\s+.*$/gm, "").trim().split(/\n+/)[0] || body.slice(0, 400);
  if (intro.length > 80 && intro.split(/\s+/).length >= 20) add("PASS", "AEO answer-first intro", "Opening provides direct answer block");
  else add("WARN", "AEO answer-first intro", "Opening looks thin — first 2-3 sentences must directly answer the primary question");

  // Internal links 3-5
  const links = [...body.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)].map(m => m[2]);
  const internal = links.filter(h => h.startsWith("/services/") || h.startsWith("/#") || h.startsWith("/journal/") || h.startsWith("/services"));
  if (internal.length < 3) add("FAIL", "Internal links 3-5", `Only ${internal.length} internal links: ${internal.join(", ") || "none"} — need 3-5`);
  else if (internal.length > 5) add("WARN", "Internal links 3-5", `${internal.length} links — OK but ensure relevance`);
  else add("PASS", "Internal links 3-5", `${internal.length} links: ${internal.join(", ")}`);

  // FAQ section 3-4 Q&As
  const hasFAQ = /frequently asked questions/i.test(body);
  if (!hasFAQ) add("FAIL", "FAQ section", "No '## Frequently Asked Questions' block — required for AEO FAQPage");
  else {
    const faqQs = (body.match(/###\s+What|###\s+How|###\s+Why|###\s+Can|###\s+Does|###\s+Is/gi) || []).length;
    const altQs = (body.split("Frequently Asked Questions")[1] || "").split("\n").filter(l => /^###\s+/.test(l)).length;
    const count = Math.max(faqQs, altQs);
    if (count < 3) add("FAIL", "FAQ 3-4 Q&As", `Only ${count} FAQ questions — need 3-4`);
    else if (count > 4) add("WARN", "FAQ 3-4 Q&As", `${count} questions — 3-4 is ideal`);
    else add("PASS", "FAQ 3-4 Q&As", `${count} questions`);
  }

  // EEAT signals
  const hasFirstPerson = /\bI (built|shipped|designed|deployed|tested|use|recommend)\b/i.test(body);
  const hasExperience = /Junagadh|Gujarat|SaaS Next|Curro|client|production/i.test(body);
  if (hasFirstPerson && hasExperience) add("PASS", "EEAT experience", "First-person experience + geo/client grounding");
  else if (hasExperience) add("WARN", "EEAT experience", "Geo/client grounding present but weak first-person voice — add 'I built...' sentences");
  else add("FAIL", "EEAT experience", "No EEAT signals — add first-person experience, Junagadh/Gujarat grounding, client proof");

  // Headings
  const headings = [...body.matchAll(/^#{2,3}\s+.+/gm)].map(m => m[0]);
  if (headings.length < 4) add("WARN", "Heading hierarchy", `Only ${headings.length} H2/H3 headings — article needs 4-7 sections`);
  else add("PASS", "Heading hierarchy", `${headings.length} headings`);

  // Code blocks
  const hasCode = /```/.test(body);
  if (hasCode) {
    const fences = (body.match(/```/g) || []).length;
    if (fences % 2 !== 0) add("FAIL", "Code fences", "Unclosed ``` fence — every block needs opening + closing");
    else add("PASS", "Code fences", `${fences / 2} code block(s), properly closed`);
  }

  // Raw markdown leak checks
  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  if (/^#{4,6}\s+/m.test(withoutCode)) add("WARN", "Heading depth", "H4-H6 used — stick to H2/H3 for journal rendering");
  if (/\*\*[^*]+\*\*/.test(body)) add("PASS", "Bold formatting", "Bold markers present and likely closed");
  // check unclosed bold
  const bolds = (body.match(/\*\*/g) || []).length;
  if (bolds % 2 !== 0) add("FAIL", "Bold leaks", "Unclosed ** — odd number of bold markers");

  // Quotable Bottom Line
  if (/bottom line/i.test(body)) add("PASS", "Quotable Bottom Line", "Bottom Line block present — AI engines can cite this");
  else add("WARN", "Quotable Bottom Line", "No Bottom Line — add a quotable summary block AI can lift");

  // Anti-fluff
  const FLUFF = ["in today's fast-paced world", "delve into", "unlock the power", "game-changer", "revolutionize", "skyrocket your"];
  const fluffHits = FLUFF.filter(w => body.toLowerCase().includes(w));
  if (fluffHits.length) add("FAIL", "Anti-fluff", `Blocklisted phrases: ${fluffHits.join(", ")}`);
  else add("PASS", "Anti-fluff", "No blocklisted fluff");

  // Tag
  if (tag && !/^(AI DEV|AI NEWS|MY STORY|AUTOMATION|WEB DEV|AEO|LOCAL SEO|WEB & AI|AI AGENTS)$/i.test(tag)) {
    add("WARN", "Tag", `"${tag}" — use one of: AI DEV, AI NEWS, MY STORY, AUTOMATION, WEB DEV, AEO, LOCAL SEO`);
  } else if (tag) add("PASS", "Tag", tag);
}

// ─── report ──────────────────────────────────────────────────────────────────
const fails = results.filter(r => r.status === "FAIL");
const warns = results.filter(r => r.status === "WARN");
const passes = results.filter(r => r.status === "PASS");

console.log(`\n  Results: ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL`);
for (const r of results) {
  const icon = r.status === "PASS" ? "✅" : r.status === "FAIL" ? "❌" : "⚠️";
  console.log(`  ${icon} [${r.status}] ${r.check}: ${r.detail}`);
}
const verdict = fails.length === 0 ? "PASS (pending subagent auditor)" : "FAIL";
console.log(`\n  Automated verdict: ${verdict}\n`);

const L = [];
L.push(`# 📝 Pre-Publish Audit — ${title ? `"${title}"` : "(untitled draft)"}`);
L.push("");
L.push(`**Audited:** ${new Date().toISOString().slice(0, 10)} · **Slug:** \`${slug || "—"}\` · **Tag:** ${tag || "—"} · **Words:** ${body ? body.split(/\s+/).filter(Boolean).length : 0} · **Verdict:** **${verdict}**`);
L.push("");
L.push(`| Status | Check | Detail |`);
L.push(`|---|---|---|`);
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
L.push(`## Auditor section — COMPLETE THIS (subagent, fresh eyes)`);
L.push("");
L.push(`### Blog-worthiness scorecard (1-5 each, /50 — ≥35 worth publishing)`);
L.push(`| Criterion | Ask | Score /5 |`);
L.push(`|---|---|---|`);
L.push(`| One keyword, one intent | ONE search intent served fully? | |`);
L.push(`| EEAT credibility | First-person experience + credential + no overclaiming? | |`);
L.push(`| Cited proof | Every stat linked to named source? | |`);
L.push(`| GEO quotability | Bottom Line / table / list AI can lift? | |`);
L.push(`| First-100-word answer | Direct answer in first 100 words? | |`);
L.push(`| Heading hierarchy | H2/H3 contiguous, one idea per H2? | |`);
L.push(`| Copy quality | Anti-fluff clear, specific > generic? | |`);
L.push(`| Internal links | 3-5 relevant links with descriptive anchors? | |`);
L.push(`| FAQ quality | 3-4 high-intent Q&As, FAQPage-ready? | |`);
L.push(`| Rank feasibility | Angle + depth match SERP for keyword? | |`);
L.push("");
L.push(`### Verdict`);
L.push(`- All automated PASS + scorecard ≥35 → **PASS** → proceed to publish`);
L.push(`- Any FAIL or WARN judged real → **FIX NEEDED** → fix file → re-run audit`);
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");
console.log(`📝 Report → ${basename(outPath)}`);
process.exit(fails.length ? 1 : 0);
