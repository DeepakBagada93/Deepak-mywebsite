#!/usr/bin/env node
// audit-blog.mjs — Stage 4 of deepak-blog v5.0
// Pre-publish audit harness for the sequential write pipeline.
// Scans a draft pack (or a single body string) and checks EEAT, AEO, SEO, formatting, CTR, EEAT-Pro.
// Writes blog-audit.md with scaffold for subagent auditor.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

const BRAND = "═".repeat(58);
console.log(`\n${BRAND}\n  📝 deepak-blog v5.0 — audit-blog.mjs\n  Pre-Publish Content & SEO/AEO Audit (CTR + EEAT-Pro)\n${BRAND}\n`);

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

if (packArg) {
  const packDir = resolve(process.cwd(), packArg);
  if (!existsSync(packDir)) { console.error(`❌ Pack folder not found: ${packDir}`); process.exit(2); }
  const read = (f) => existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null;
  const article = read("article.md") || read("body.md") || read("draft.md") || "";
  const meta = read("meta.md") || "";
  body = article;
  if (!title && meta) { const m = meta.match(/title[:：]\s*["“']?([^"”\n]{0,120})/i); if (m) title = m[1].trim(); }
  if (!excerpt && meta) { const m = meta.match(/description[:：]\s*["“']?([^"”\n]{0,220})/i); if (m) excerpt = m[1].trim(); }
  if (!body) body = meta ? "" : (read("index.md") || "");
} else if (bodyArg) {
  const p = resolve(process.cwd(), bodyArg);
  if (!existsSync(p)) { console.error(`❌ Body file not found: ${p}`); process.exit(2); }
  body = readFileSync(p, "utf8");
} else if (opt("post-index", "") !== "") {
  const idx = parseInt(opt("post-index", "0"), 10);
  const postsPath = resolve(process.cwd(), "data/posts.php");
  const raw = readFileSync(postsPath, "utf8");
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
  console.error("  node scripts/audit-blog.mjs --body draft.md --title \"...\" --excerpt \"...\" --tag \"AI DEV\" --out blog-audit.md");
  console.error("  node scripts/audit-blog.mjs --post-index 0 --out blog-audit.md");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

// ─── helpers v6.0 ───────────────────────────────────────────────────────────
function ctrScore(titleStr) {
  if (!titleStr) return { score: 0, reasons: ["no title"] };
  let s = 0;
  const reasons = [];
  if (titleStr.length > 0 && titleStr.length <= 60) { s += 2; reasons.push("≤60 chars"); } else if (titleStr.length <= 60) reasons.push("≤60 chars"); else reasons.push(`>${60} chars (-2)`);
  if (/^\s*(best|top|how|why|what|when)\b/i.test(titleStr) || titleStr.toLowerCase().includes(titleStr.split(" ")[0]?.toLowerCase())) { /* front-loaded check below */ }
  // Keyword front-loaded (first 2 words contain intent or first 20 chars contain keyword)
  const first20 = titleStr.slice(0, 20).toLowerCase();
  if (/best|top|ai |laravel|rag|mcp|seo|aeo|website|developer/i.test(first20)) { s += 2; reasons.push("keyword front-loaded"); } else reasons.push("keyword not front-loaded (-2)");
  if (/2026/.test(titleStr)) { s += 1; reasons.push("year 2026"); } else reasons.push("no year 2026 (-1)");
  if (/india|gujarat|junagadh|world/i.test(titleStr)) { s += 1; reasons.push("geo modifier"); } else reasons.push("no geo (-1)");
  if (/\d/.test(titleStr)) { s += 2; reasons.push("digit present"); } else reasons.push("no digit (-2)");
  if (/best|top|guide|playbook|breakdown|proven|ultimate|complete/i.test(titleStr)) { s += 1; reasons.push("power word"); } else reasons.push("no power word (-1)");
  if (/:\s*.+/.test(titleStr)) { s += 1; reasons.push("colon benefit"); }
  return { score: Math.min(10, s), reasons };
}

const isBestTop = /best|top|#1|ranked/i.test(title || "");

// ─── title / excerpt / slug ─────────────────────────────────────────────────
if (!title) add("FAIL", "Meta title", "Missing — title must be <60 chars, high-CTR, with year 2026, keyword front-loaded");
else if (title.length > 60) add("FAIL", "Meta title ≤60 chars", `${title.length} chars: "${title}" — over cap (hurts CTR)`);
else if (title.length < 20) add("WARN", "Meta title", `${title.length} chars — too short for CTR`);
else add("PASS", "Meta title ≤60 chars", `${title.length} chars: "${title}"`);

// CTR 0-10
const ctr = ctrScore(title);
if (!title) add("FAIL", "CTR score ≥7/10", `No title — CTR 0/10`);
else if (ctr.score >= 7) add("PASS", `CTR score ${ctr.score}/10`, ctr.reasons.join(" · "));
else if (ctr.score >= 5) add("WARN", `CTR score ${ctr.score}/10 (target ≥7)`, ctr.reasons.join(" · ") + " — add year/geo/digit/power-word, front-load keyword");
else add("FAIL", `CTR score ${ctr.score}/10 (need ≥7)`, ctr.reasons.join(" · ") + " — title needs CTR formula: Best/Top + digit + geo + 2026 + colon benefit");

if (!excerpt) add("FAIL", "Meta description / excerpt", "Missing — need 150-160 chars, answer-first, keyword in first 20 chars + proof + CTA");
else if (excerpt.length < 140) add("FAIL", "Meta description 150-160", `${excerpt.length} chars — too short, need 150-160: "${excerpt.slice(0, 80)}..."`);
else if (excerpt.length < 150) add("WARN", "Meta description 150-160", `${excerpt.length} chars — below 150 sweet spot, pad with proof/CTA`);
else if (excerpt.length > 160) add("FAIL", "Meta description 150-160", `${excerpt.length} chars — over 160, will truncate in SERP`);
else {
  const kwFirst20 = /best|top|ai |laravel|rag|mcp|seo|aeo|website|developer|junagadh|gujarat|india/i.test(excerpt.slice(0, 30).toLowerCase());
  const hasProof = /₹|Rs\.?|INR|P95|tok\/s|ms\b|ledger|Top \d|-guide|proof|cost|hire/i.test(excerpt);
  if (kwFirst20 && hasProof) add("PASS", "Meta description 150-160", `${excerpt.length} chars, keyword early + proof token`);
  else if (!kwFirst20) add("FAIL", "Meta description 150-160", `${excerpt.length} chars — keyword must be in first 20 chars for snippet`);
  else add("WARN", "Meta description 150-160", `${excerpt.length} chars — add proof token (₹/P95/tok/s/Top N) + CTA for CTR`);
}

if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) add("WARN", "Slug format", `"${slug}" — use lowercase-kebab-case`);
else if (slug) {
  if (isBestTop && !/(india|gujarat|junagadh|world|2026)/i.test(slug)) add("WARN", "Slug geo/year for best/top", `best/top slug should include geo/year: \`${slug}\``);
  else add("PASS", "Slug format", `\`${slug}\``);
}

// ─── body checks ───────────────────────────────────────────────────────────
if (!body || body.trim().length < 200) {
  add("FAIL", "Article body", "Missing or too short");
} else {
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words < 1200) add("FAIL", "Word count ≥1200", `${words} words — need 1,200-1,600+`);
  else if (words > 2200) add("WARN", "Word count", `${words} words — long, ensure every section earns it`);
  else add("PASS", "Word count ≥1200", `${words} words`);

  // AEO intro — v6.0: 40-60 word answer block with exact best/top phrase for money queries
  // Scan first 3 non-heading blocks (byline-first hand drafts still pass if answer follows immediately)
  const blocks = body.replace(/^#{1,6}\s+.*$/gm, "").trim().split(/\n+/).filter(b => b.trim().length > 40);
  // Answer block = first block carrying the comparative best/top signal (else first block)
  const ansIdx = isBestTop ? blocks.findIndex(b => /best|top/i.test(b)) : 0;
  const intro = (ansIdx >= 0 ? blocks[ansIdx] : blocks[0]) || body.slice(0, 500);
  const introWindow = blocks.slice(0, 3).join(" ");
  const introWords = intro.split(/\s+/).filter(Boolean).length;
  if (intro.length > 80 && introWords >= 20) {
    if (isBestTop && !/vs|versus|comparison|table|₹|best|top/i.test(introWindow.toLowerCase())) add("FAIL", "AEO answer-first intro (best/top)", "best/top intro must be comparative/specific with exact best/top+niche+geo phrase + metric in first 40-60 words");
    else if (isBestTop && (introWords < 40 || introWords > 70)) add("WARN", "AEO answer block 40-60 words", `${introWords} words — trim/pad opening answer to 40-60 words for AI Overviews verbatim lift`);
    else if (/who is the best|best .* (developer|expert) .* (india|gujarat|junagadh|world)/i.test(introWindow)) add("PASS", "AEO answer-first intro", `Exact best/top+niche+geo phrase present, ${introWords} words — citable`);
    else add("PASS", "AEO answer-first intro", "Opening provides direct answer block");
  } else add("WARN", "AEO answer-first intro", "Opening looks thin — first 40-60 words must directly answer the primary question");

  // Internal links 3-5
  const links = [...body.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)].map(m => m[2]);
  const internal = links.filter(h => h.startsWith("/services/") || h.startsWith("/#") || h.startsWith("/journal/") || h.startsWith("/services"));
  if (internal.length < 3) add("FAIL", "Internal links 3-5", `Only ${internal.length} internal links: ${internal.join(", ") || "none"} — need 3-5`);
  else if (internal.length > 5) add("WARN", "Internal links 3-5", `${internal.length} links — OK but ensure relevance`);
  else add("PASS", "Internal links 3-5", `${internal.length} links: ${internal.join(", ")}`);

  // FAQ section — v6.0: 4 Q&As, Q1 exact-match for best/top
  const hasFAQ = /frequently asked questions/i.test(body);
  if (!hasFAQ) add("FAIL", "FAQ section", "No '## Frequently Asked Questions' block — required for AEO FAQPage");
  else {
    const faqQs = (body.match(/###\s+What|###\s+How|###\s+Why|###\s+Can|###\s+Does|###\s+Is|###\s+Who/gi) || []).length;
    const altQs = (body.split("Frequently Asked Questions")[1] || "").split("\n").filter(l => /^###\s+/.test(l)).length;
    const count = Math.max(faqQs, altQs);
    if (count < 4) add("FAIL", "FAQ 4 Q&As", `Only ${count} FAQ questions — need 4 (Q1 = Who is the best … in …? for best/top)`);
    else if (count > 4) add("WARN", "FAQ 4 Q&As", `${count} questions — 4 is ideal`);
    else {
      const faqBlock = body.split("Frequently Asked Questions")[1] || "";
      if (isBestTop && !/who is the best/i.test(faqBlock)) add("FAIL", "FAQ Q1 exact-match", "best/top post Q1 must be 'Who is the best … in …?' with 40-60 word answer naming Deepak Bagada");
      else if (isBestTop || /cost|price|hire|₹/i.test(title)) {
        const hasPricingFAQ = /how much|pricing|cost|hire/i.test(faqBlock);
        if (!hasPricingFAQ) add("WARN", "FAQ pricing/geo", "Commercial/best-top post should have a pricing or 'how to hire' FAQ");
        else add("PASS", "FAQ 4 Q&As", `${count} questions incl. Q1 exact-match + pricing`);
      } else add("PASS", "FAQ 4 Q&As", `${count} questions`);
    }
  }

  // Tables — mandatory for best/top/commercial
  const tableCount = (body.match(/\|.*\|.*\|/g) || []).length;
  const hasTable = tableCount >= 2; // at least header + one row
  if (isBestTop && !hasTable) add("FAIL", "EEAT-Pro: comparison/pricing table", "Title has best/top — body MUST have a markdown comparison or pricing table with 3-5 rows (proof for superlative)");
  else if (isBestTop && hasTable) add("PASS", "EEAT-Pro: comparison/pricing table", `Table present (${Math.floor(tableCount/2)} rows est.) — proves best/top claim`);
  else if (!isBestTop && /cost|price|pricing|hire|₹/i.test(title) && !hasTable) add("WARN", "Pricing table", "Commercial title suggests ₹ pricing table — add one for EEAT");
  else if (hasTable) add("PASS", "Table present", `${Math.floor(tableCount/2)} table rows — good quotability`);

  // EEAT signals
  const hasFirstPerson = /\bI (built|shipped|designed|deployed|tested|use|recommend|run|ship)\b/i.test(body);
  const hasExperience = /Junagadh|Gujarat|SaaS Next|Curro|client|production|ledger|P95|tok\/s/i.test(body);
  if (hasFirstPerson && hasExperience) add("PASS", "EEAT experience", "First-person experience + geo/client/metric grounding");
  else if (hasExperience) add("WARN", "EEAT experience", "Geo/client grounding present but weak first-person voice — add 'I built...' sentences");
  else add("FAIL", "EEAT experience", "No EEAT signals — add first-person experience, Junagadh/Gujarat grounding, metric (P95, tok/s)");

  // EEAT-Pro for best/top
  if (isBestTop) {
    const hasPricing = /₹\s*\d|Rs\.?\s*\d|INR/i.test(body);
    const hasMetric = /P95|latency|tok\/s|ms\b|ledger|90-day/i.test(body);
    const hasSourceLink = /https?:\/\//.test(body);
    const hasComparison = /vs\.?|versus|comparison|compare/i.test(body);
    if (hasPricing || hasMetric) add("PASS", "EEAT-Pro: pricing/metric proof", hasPricing ? "₹ pricing present" : "Metric (P95/tok/s/ledger) present");
    else add("FAIL", "EEAT-Pro: pricing/metric proof", "best/top claim needs ₹ pricing OR metric (P95, tok/s, P95 42ms, 62 tok/s, 90-day ledger)");
    if (hasSourceLink) add("PASS", "EEAT-Pro: named source link", "External source link present — superlative is sourced");
    else add("WARN", "EEAT-Pro: named source link", "Add named source link for every superlative stat (hallucination risk)");
    if (hasComparison) add("PASS", "EEAT-Pro: comparison signal", "Comparison language present");
    else add("WARN", "EEAT-Pro: comparison signal", "best/top should use 'vs/versus/comparison' in body");
  }

  // Headings
  const headings = [...body.matchAll(/^#{2,3}\s+.+/gm)].map(m => m[0]);
  if (headings.length < 4) add("WARN", "Heading hierarchy", `Only ${headings.length} H2/H3 headings — article needs 4-7 sections`);
  else add("PASS", "Heading hierarchy", `${headings.length} headings`);
  // Day-in-life timestamp check
  if (/day in life|daily routine|my story/i.test(title) && !/\b0?\d:\d{2}\b|\b06:00|09:00|18:00\b/.test(body)) add("WARN", "Day-in-life timestamps", "Day-in-life post should have timestamped blocks (06:00, 09:00, 18:00)");

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
  const bolds = (body.match(/\*\*/g) || []).length;
  if (bolds % 2 !== 0) add("FAIL", "Bold leaks", "Unclosed ** — odd number of bold markers");
  else if (/\*\*[^*]+\*\*/.test(body)) add("PASS", "Bold formatting", "Bold markers present and likely closed");

  // Quotable Bottom Line
  if (/bottom line/i.test(body)) add("PASS", "Quotable Bottom Line", "Bottom Line block present — AI engines can cite this");
  else add("WARN", "Quotable Bottom Line", "No Bottom Line — add a quotable summary block AI can lift");

  // Anti-fluff v5.0 expanded
  const FLUFF = ["in today's fast-paced world", "delve into", "unlock the power", "game-changer", "revolutionize", "skyrocket your", "in the realm of", "tapestry", "nestled", "plethora", "embark on a journey", "cutting-edge solution", "leverage the power"];
  const fluffHits = FLUFF.filter(w => body.toLowerCase().includes(w));
  if (fluffHits.length) add("FAIL", "Anti-fluff", `Blocklisted phrases: ${fluffHits.join(", ")}`);
  else add("PASS", "Anti-fluff", "No blocklisted fluff");

  // Tag
  if (tag && !/^(AI DEV|AI NEWS|MY STORY|AUTOMATION|WEB DEV|AEO|LOCAL SEO|WEB & AI|AI AGENTS|FINTECH)$/i.test(tag)) {
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
const ctrPass = !title || (isBestTop ? ctr.score >= 8 : ctr.score >= 7);
const verdict = fails.length === 0 ? (ctrPass ? "PASS (pending subagent auditor)" : "FAIL (CTR)") : "FAIL";
console.log(`\n  CTR: ${ctr.score}/10 — ${ctr.reasons.join(" · ")}`);
console.log(`  Automated verdict: ${verdict}\n`);

const L = [];
L.push(`# 📝 Pre-Publish Audit v5.0 — ${title ? `"${title}"` : "(untitled draft)"}`);
L.push("");
L.push(`**Audited:** ${new Date().toISOString().slice(0, 10)} · **Slug:** \`${slug || "—"}\` · **Tag:** ${tag || "—"} · **Words:** ${body ? body.split(/\s+/).filter(Boolean).length : 0} · **CTR:** ${ctr.score}/10 · **EEAT-Pro:** ${isBestTop ? "REQUIRED (best/top)" : "standard"} · **Verdict:** **${verdict}**`);
L.push("");
L.push(`| Status | Check | Detail |`);
L.push(`|---|---|---|`);
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
L.push(`## CTR Breakdown (${ctr.score}/10)`);
L.push(`- ${ctr.reasons.join("\n- ")}`);
L.push(`- Formula: ≤60 chars (2) + keyword front-loaded (2) + year 2026 (1) + geo (1) + digit (2) + power word (1) + colon benefit (1) = 10`);
L.push(`- Target: ≥7/10 for all posts, ≥8/10 for best/top`);
L.push("");
if (isBestTop) {
  L.push(`## EEAT-Pro Gate (best/top detected)`);
  L.push(`- Title contains best/top → body MUST have: comparison table + ₹ pricing OR P95/tok/s metric + named source link`);
  L.push(`- Fabricated best/top without proof = E-E-A-T de-rank + AI citation poison. Demonstrate, don't declare.`);
  L.push("");
}
L.push(`## Auditor section — COMPLETE THIS (subagent, fresh eyes)`);
L.push("");
L.push(`### Blog-worthiness scorecard (1-5 each, /50 — ≥35 worth publishing)`);
L.push(`| Criterion | Ask | Score /5 |`);
L.push(`|---|---|---|`);
L.push(`| One keyword, one intent | ONE search intent served fully? (esp. best/top = commercial) | |`);
L.push(`| EEAT credibility | First-person experience + credential + no overclaiming? best/top proven via table? | |`);
L.push(`| Cited proof | Every stat linked to named source? ₹ pricing sourced? | |`);
L.push(`| GEO quotability | Bottom Line / table / list AI can lift? | |`);
L.push(`| First-100-word answer | Direct answer in first 100 words? comparative if best/top? | |`);
L.push(`| Heading hierarchy | H2/H3 contiguous, one idea per H2? timestamps if day-in-life? | |`);
L.push(`| Copy quality | Anti-fluff clear, specific > generic? | |`);
L.push(`| Internal links | 3-5 relevant links with descriptive anchors? | |`);
L.push(`| FAQ quality | 3-4 high-intent Q&As, pricing + geo if commercial? FAQPage-ready? | |`);
L.push(`| Rank feasibility | Angle + depth + table match SERP for keyword? CTR ≥7/10? | |`);
L.push("");
L.push(`### Verdict`);
L.push(`- All automated PASS + CTR ≥7/10 + scorecard ≥35 → **PASS** → proceed to publish`);
L.push(`- Any FAIL or WARN judged real → **FIX NEEDED** → fix file → re-run audit`);
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");
console.log(`📝 Report → ${basename(outPath)}`);
process.exit(fails.length ? 1 : 0);
