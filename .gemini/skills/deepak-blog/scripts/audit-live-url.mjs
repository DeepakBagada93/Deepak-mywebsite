#!/usr/bin/env node
// audit-live-url.mjs — Stage 6 of deepak-blog v4.0
// Audits a LIVE journal URL after deployment: content format, rendering, SEO/AEO, links.
//
// Checks: HTTP 200, title, meta description, headings, word count, internal links,
// FAQ section, JSON-LD schema, OG tags, canonical, mobile viewport, code blocks, leaks.
//
// Usage:
//   node scripts/audit-live-url.mjs --url https://deepakbagada.in/journal/my-slug
//   node scripts/audit-live-url.mjs --url https://deepakbagada.in/journal/my-slug --out live-audit.md
//   node scripts/audit-live-url.mjs --slug my-slug --base https://deepakbagada.in
//
// Exit: 0 = PASS (all critical checks pass), 1 = FAIL (any critical FAIL), 2 = usage error

import { writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

const BRAND = "═".repeat(58);
console.log(`\n${BRAND}\n  🔍 deepak-blog v4.0 — audit-live-url.mjs\n  Live URL Format & Content Audit\n${BRAND}\n`);

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

let url = opt("url", "");
const slug = opt("slug", "");
const base = opt("base", "https://deepakbagada.in");
const outPath = opt("out", "");

if (!url && slug) url = `${base.replace(/\/$/, "")}/journal/${slug}`;
if (!url) {
  console.error("Usage: node audit-live-url.mjs --url https://deepakbagada.in/journal/<slug>");
  console.error("   or: node audit-live-url.mjs --slug <slug> --base https://deepakbagada.in");
  process.exit(2);
}

console.log(`🌐 Auditing: ${url}\n`);

// ─── fetch ──────────────────────────────────────────────────────────────────
let html = "";
let status = 0;
let headers = {};
try {
  const res = await fetch(url, {
    headers: { "User-Agent": "deepak-blog-live-auditor/4.0 (+https://deepakbagada.in)" },
    redirect: "follow",
  });
  status = res.status;
  headers = Object.fromEntries(res.headers.entries());
  html = await res.text();
  console.log(`  HTTP ${status} · ${html.length.toLocaleString()} bytes · content-type: ${headers["content-type"] || "unknown"}`);
} catch (e) {
  console.error(`❌ Fetch failed: ${e.message}`);
  process.exit(1);
}

// ─── helpers ────────────────────────────────────────────────────────────────
const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });
const has = (re) => re.test(html);
const count = (re) => (html.match(re) || []).length;
const extract = (re, group = 1) => {
  const m = html.match(re);
  return m ? m[group].trim() : "";
};

// ─── 1. HTTP & basics ──────────────────────────────────────────────────────
if (status === 200) add("PASS", "HTTP 200", "Live URL returns 200 OK");
else if (status >= 300 && status < 400) add("FAIL", "HTTP 200", `Redirect ${status} — check canonical/HTACCESS`);
else add("FAIL", "HTTP 200", `Status ${status} — page not live or blocked`);

if (html.length < 2000) add("FAIL", "Page body size", `${html.length} bytes — page looks empty or blocked`);
else add("PASS", "Page body size", `${html.length.toLocaleString()} bytes`);

// ─── 2. Meta title & description ───────────────────────────────────────────
const title = extract(/<title[^>]*>([^<]+)<\/title>/i);
if (!title) add("FAIL", "Meta title", "No <title> tag found");
else if (title.length > 60) add("WARN", "Meta title ≤60 chars", `${title.length} chars: "${title.slice(0, 60)}..." — slightly long but OK`);
else if (title.length < 15) add("WARN", "Meta title", `${title.length} chars — too short for CTR`);
else add("PASS", "Meta title", `${title.length} chars: "${title}"`);

const metaDesc = extract(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || extract(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
if (!metaDesc) add("FAIL", "Meta description", "No meta description found — critical for SEO/AEO snippets");
else if (metaDesc.length < 90) add("WARN", "Meta description 140-160", `${metaDesc.length} chars — short for snippet: "${metaDesc}"`);
else if (metaDesc.length > 165) add("WARN", "Meta description 140-160", `${metaDesc.length} chars — slightly long, may truncate`);
else add("PASS", "Meta description", `${metaDesc.length} chars`);

const canonical = extract(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || extract(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
if (!canonical) add("WARN", "Canonical URL", "No canonical link — add for SEO");
else add("PASS", "Canonical URL", canonical);

// ─── 3. OG / Twitter ───────────────────────────────────────────────────────
if (has(/property=["']og:title["']/i)) add("PASS", "OG tags", "og:title present");
else add("WARN", "OG tags", "No og:title — social shares will look plain");
if (has(/name=["']twitter:card["']/i)) add("PASS", "Twitter card", "twitter:card present");
else add("WARN", "Twitter card", "No twitter:card");

// ─── 4. Viewport & mobile ──────────────────────────────────────────────────
if (has(/name=["']viewport["']/i)) add("PASS", "Viewport meta", "Mobile viewport present");
else add("FAIL", "Viewport meta", "No viewport meta — mobile rendering broken");

// ─── 5. Headings & structure ───────────────────────────────────────────────
const h1Count = count(/<h1[^>]*>/gi);
const h2Count = count(/<h2[^>]*>/gi);
const h3Count = count(/<h3[^>]*>/gi);
if (h1Count === 0) add("FAIL", "H1 heading", "No H1 found — SEO critical");
else if (h1Count > 1) add("WARN", "H1 heading", `${h1Count} H1 tags — should be exactly 1`);
else add("PASS", "H1 heading", "Single H1 present");
if (h2Count === 0) add("WARN", "H2 headings", "No H2 — article lacks section structure");
else add("PASS", "H2 headings", `${h2Count} H2(s)`);
if (h3Count > 0) add("PASS", "H3 headings", `${h3Count} H3(s) — good hierarchy depth`);

// Extract text for word count (strip tags roughly)
const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = textOnly.split(/\s+/).filter(Boolean).length;
if (words < 900) add("FAIL", "Word count ≥1200", `${words} words — thin content, expected 1,200-1,600`);
else if (words < 1200) add("WARN", "Word count ≥1200", `${words} words — slightly below 1,200 target`);
else add("PASS", "Word count ≥1200", `${words} words`);

// ─── 6. FAQ section ────────────────────────────────────────────────────────
if (has(/frequently asked questions/i)) add("PASS", "FAQ section", "FAQ heading found");
else add("FAIL", "FAQ section", "No FAQ section — required for AEO/FAQPage schema");
const faqQuestions = count(/<h3[^>]*>\s*what|how|why|can|does|is|should/gi);
if (faqQuestions >= 2) add("PASS", "FAQ questions", `${faqQuestions} FAQ-style H3s`);
else if (faqQuestions > 0) add("WARN", "FAQ questions", `Only ${faqQuestions} FAQ question(s) — need 3-4`);

// ─── 7. Internal links ─────────────────────────────────────────────────────
const internalLinks = [...html.matchAll(/href=["'](\/services\/[^"']+|\/#[^"']*|\/journal\/[^"']+)["']/gi)].map(m => m[1]);
const uniqueInternal = [...new Set(internalLinks)];
if (uniqueInternal.length >= 3 && uniqueInternal.length <= 8) add("PASS", "Internal links 3-5", `${uniqueInternal.length} internal links: ${uniqueInternal.slice(0, 5).join(", ")}`);
else if (uniqueInternal.length < 3) add("FAIL", "Internal links 3-5", `Only ${uniqueInternal.length} internal links — need 3-5 strategic links`);
else add("WARN", "Internal links", `${uniqueInternal.length} internal links — many is OK but check relevance`);

// ─── 8. JSON-LD schema ─────────────────────────────────────────────────────
const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
if (jsonLdBlocks.length === 0) add("FAIL", "JSON-LD schema", "No JSON-LD found — AEO/SEO schema required (Article + FAQPage + Person)");
else {
  add("PASS", "JSON-LD blocks", `${jsonLdBlocks.length} JSON-LD block(s)`);
  const joined = jsonLdBlocks.join(" ");
  if (/["']@type["']\s*:\s*["']Article["']/i.test(joined) || /"Article"/.test(joined)) add("PASS", "Article schema", "Article schema present");
  else add("WARN", "Article schema", "No Article schema detected");
  if (/FAQPage/i.test(joined)) add("PASS", "FAQPage schema", "FAQPage schema present");
  else add("WARN", "FAQPage schema", "No FAQPage schema — FAQ section won't get rich results");
  if (/Person|author/i.test(joined)) add("PASS", "Person/Author schema", "Person/author in schema");
  else add("WARN", "Person/Author schema", "No Person/author — weak EEAT signal");
}

// ─── 9. Content format / leak checks ───────────────────────────────────────
if (has(/undefined|null|NaN.*render/i)) add("WARN", "Render leaks", "Possible JS render leak (undefined/null in HTML)");
if (count(/\*\*.*\*\*/) > 20) { /* markdown bold is OK if rendered — but raw ** in HTML is a leak */
  // Check if ** appears outside code blocks — likely unrendered markdown
  const withoutCode = html.replace(/<code[\s\S]*?<\/code>/gi, "").replace(/<pre[\s\S]*?<\/pre>/gi, "");
  if (/\*\*[^<]{5,}\*\*/.test(withoutCode)) add("WARN", "Raw markdown leaks", "Raw **bold** markers in HTML — markdown not rendered");
}
if (has(/<h[1-6][^>]*>\s*#{1,6}\s+/)) add("FAIL", "Heading leaks", "Raw ## markers inside headings — markdown leak");
if (has(/```/)) add("WARN", "Code fence leaks", "Raw ``` fences in HTML — code blocks not rendered");
if (count(/<pre[^>]*>/gi) > 0 || count(/<code[^>]*>/gi) > 2) add("PASS", "Code blocks", "Code blocks rendered as <pre>/<code>");
else if (has(/```|<\s*code/i)) { /* has code intent but not rendered */ }
else add("WARN", "Code blocks", "No <pre>/<code> blocks — if article has code, ensure rendering");

// ─── 10. Images & alt ──────────────────────────────────────────────────────
const imgs = count(/<img[^>]*>/gi);
if (imgs > 0) {
  const imgsWithAlt = count(/<img[^>]+alt=["'][^"']+["']/gi);
  if (imgsWithAlt === imgs) add("PASS", "Image alt text", `${imgs} image(s), all with alt`);
  else add("WARN", "Image alt text", `${imgsWithAlt}/${imgs} images have alt — fill missing alts`);
}

// ─── report ─────────────────────────────────────────────────────────────────
const fails = results.filter(r => r.status === "FAIL");
const warns = results.filter(r => r.status === "WARN");
const passes = results.filter(r => r.status === "PASS");

console.log("\n" + "─".repeat(58));
console.log(`  Results: ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL`);
for (const r of results) {
  const icon = r.status === "PASS" ? "✅" : r.status === "FAIL" ? "❌" : "⚠️";
  console.log(`  ${icon} [${r.status}] ${r.check}: ${r.detail}`);
}
console.log("─".repeat(58));
const verdict = fails.length === 0 ? "PASS" : "FAIL";
console.log(`\n  Verdict: ${verdict} ${fails.length ? "— fix FAILs before moving to next topic" : "— live URL looks good, proceed to next topic"}\n`);

// ─── markdown report ────────────────────────────────────────────────────────
if (outPath) {
  const reportPath = resolve(process.cwd(), outPath);
  const L = [];
  L.push(`# 🔍 Live URL Audit — ${url}`);
  L.push("");
  L.push(`**Audited:** ${new Date().toISOString().slice(0, 10)} · **HTTP:** ${status} · **Size:** ${html.length.toLocaleString()} bytes · **Words:** ~${words} · **Verdict:** **${verdict}**`);
  L.push("");
  L.push(`| Status | Check | Detail |`);
  L.push(`|---|---|---|`);
  for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
  L.push("");
  L.push(`## Summary`);
  L.push(`- **${passes.length} PASS** · **${warns.length} WARN** · **${fails.length} FAIL**`);
  L.push(`- **Verdict:** **${verdict}**${fails.length ? " — fix FAIL items and re-audit before proceeding to next topic in queue" : " — format & content OK, safe to continue queue"}`);
  L.push("");
  if (uniqueInternal.length) {
    L.push(`## Internal links found (${uniqueInternal.length})`);
    for (const l of uniqueInternal) L.push(`- \`${l}\``);
    L.push("");
  }
  L.push(`## What to fix if FAIL`);
  L.push(`- HTTP ≠ 200 → check deploy, .htaccess, Hostinger cache`);
  L.push(`- Missing FAQ/FAQPage → re-check body formatting and schema injection in journal rendering`);
  L.push(`- Raw markdown leaks (\`##\`, \`**\`, \`\`\`) → fix body markdown rendering (CommonMark → HTML)`);
  L.push(`- No JSON-LD → verify Article + FAQPage schema in page template`);
  L.push("");

  writeFileSync(reportPath, L.join("\n"), "utf8");
  console.log(`📝 Report → ${basename(reportPath)}`);
}

process.exit(fails.length ? 1 : 0);
