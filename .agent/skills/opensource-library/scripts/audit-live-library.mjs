#!/usr/bin/env node
// audit-live-library.mjs — Live URL Format, Display, SEO/AEO & Image Alt Tag Auditor for opensource-library

import { writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

const BRAND = "═".repeat(60);
console.log(`\n${BRAND}\n  🌐 opensource-library — audit-live-library.mjs\n  Live URL Display, Architecture, AEO & Image Alt Tag Audit\n${BRAND}\n`);

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
const type = opt("type", "library"); // library | blueprints | repos | stack
const base = opt("base", "https://deepakbagada.in");
const outPath = opt("out", "");

if (!url && slug) {
  if (type === "blueprints") url = `${base.replace(/\/$/, "")}/blueprints/${slug}`;
  else if (type === "repos") url = `${base.replace(/\/$/, "")}/repos`;
  else if (type === "stack") url = `${base.replace(/\/$/, "")}/stack`;
  else url = `${base.replace(/\/$/, "")}/library/${slug}`;
}

if (!url) {
  console.error("Usage:");
  console.error("  node scripts/audit-live-library.mjs --slug mcp-agent-builder");
  console.error("  node scripts/audit-live-library.mjs --url https://deepakbagada.in/library/mcp-agent-builder");
  console.error("  node scripts/audit-live-library.mjs --slug 1 --type blueprints");
  console.error("  node scripts/audit-live-library.mjs --type stack");
  process.exit(2);
}

console.log(`Auditing live URL: ${url}\n`);

let html = "";
let status = 0;
let headers = {};

try {
  const res = await fetch(url, {
    headers: { "User-Agent": "opensource-library-live-auditor/2.0 (+https://deepakbagada.in)" },
    redirect: "follow",
  });
  status = res.status;
  headers = Object.fromEntries(res.headers.entries());
  html = await res.text();
  console.log(`  HTTP ${status} · ${html.length.toLocaleString()} bytes · Content-Type: ${headers["content-type"] || "unknown"}`);
} catch (e) {
  console.error(`❌ Fetch failed: ${e.message}`);
  process.exit(1);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });
const has = (re) => re.test(html);
const count = (re) => (html.match(re) || []).length;
const extract = (re, group = 1) => {
  const m = html.match(re);
  return m ? m[group].trim() : "";
};

// 1. HTTP 200
if (status === 200) add("PASS", "HTTP 200", "Live URL returns 200 OK");
else if (status >= 300 && status < 400) add("FAIL", "HTTP 200", `Redirect ${status}`);
else add("FAIL", "HTTP 200", `Status ${status} — page not live or error`);

// 2. Page body size
if (html.length < 2500) add("FAIL", "Page body size", `${html.length} bytes — page is too short or blocked`);
else add("PASS", "Page body size", `${html.length.toLocaleString()} bytes`);

// 3. Meta title
const title = extract(/<title[^>]*>([^<]+)<\/title>/i);
if (!title) add("FAIL", "Meta title", "No <title> tag found");
else if (title.length > 70) add("WARN", "Meta title length", `${title.length} chars: "${title}"`);
else add("PASS", "Meta title", `${title.length} chars: "${title}"`);

// 4. Meta description
const metaDesc = extract(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || extract(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
if (!metaDesc) add("FAIL", "Meta description", "Missing meta description");
else if (metaDesc.length < 100) add("WARN", "Meta description length", `${metaDesc.length} chars — short`);
else add("PASS", "Meta description", `${metaDesc.length} chars: "${metaDesc.slice(0, 80)}..."`);

// 5. Open Graph & Twitter
if (has(/property=["']og:title["']/i)) add("PASS", "OG tags", "og:title present");
else add("WARN", "OG tags", "No og:title");
if (has(/name=["']twitter:card["']/i)) add("PASS", "Twitter card", "twitter:card present");
else add("WARN", "Twitter card", "No twitter:card");

// 6. Viewport
if (has(/name=["']viewport["']/i)) add("PASS", "Mobile viewport", "Viewport meta tag present");
else add("FAIL", "Mobile viewport", "Missing mobile viewport tag");

// 7. H1 Heading
const h1Count = count(/<h1[^>]*>/gi);
if (h1Count === 0) add("FAIL", "H1 heading", "Missing <h1> tag");
else if (h1Count > 1) add("WARN", "H1 heading", `${h1Count} <h1> tags found — should be exactly 1`);
else add("PASS", "H1 heading", "Single <h1> present");

// 8. Word count
const textOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const words = textOnly.split(/\s+/).filter(Boolean).length;
if (words < 800) add("FAIL", "Word count", `${words} words — content appears truncated or thin`);
else add("PASS", "Word count", `~${words} words rendered`);

// 9. Code Blocks Rendered
const preCount = count(/<pre[^>]*>/gi);
const codeCount = count(/<code[^>]*>/gi);
if (preCount > 0 || codeCount > 2) add("PASS", "Code block rendering", `${preCount} <pre> block(s), ${codeCount} <code> tag(s)`);
else add("WARN", "Code block rendering", "No <pre> code blocks detected");

// 10. Diagrams & Visuals
const svgCount = count(/<svg[^>]*>/gi);
if (svgCount > 0) add("PASS", "SVG Diagrams / Icons", `${svgCount} SVG element(s) rendered`);
else if (type === "blueprints" || type === "stack") add("FAIL", "SVG Diagrams", "No SVG architecture diagrams detected on blueprint page");

// 11. Images & Strict Alt Tag Audit (Frontend Quality & Accessibility)
const imgTags = [...html.matchAll(/<img\b([^>]*?)>/gi)].map(m => {
  const alt = (m[1].match(/alt=["'](.*?)["']/i) || [])[1] || "";
  const src = (m[1].match(/src=["'](.*?)["']/i) || [])[1] || "";
  return { tag: m[0], alt: alt.trim(), src: src.trim() };
});

if (imgTags.length > 0) {
  const genericAlt = /^(image|screenshot|diagram|photo|graphic|pic|picture|img|illustration|unnamed|alt)$/i;
  const badAlts = imgTags.filter(img => !img.alt || img.alt.length < 5 || genericAlt.test(img.alt));
  if (badAlts.length > 0) {
    add("FAIL", "Image alt tags (Accessibility & AEO)", `${badAlts.length}/${imgTags.length} image(s) missing descriptive alt text: ${badAlts.map(b => `"${b.alt || "(empty)"}" [${b.src.slice(0, 30)}]`).join("; ")}`);
  } else {
    add("PASS", "Image alt tags", `${imgTags.length} image(s) live with valid, descriptive alt tags`);
  }
} else {
  add("PASS", "Image audit", "No <img> dependencies on page (text/SVG/code cleanly rendered)");
}

// 12. Markdown Leaks
if (has(/<h[1-6][^>]*>\s*#{1,6}\s+/)) add("FAIL", "Markdown leaks", "Raw ## markdown markers inside headings");
if (count(/\*\*.*\*\*/) > 20) {
  const withoutCode = html.replace(/<code[\s\S]*?<\/code>/gi, "").replace(/<pre[\s\S]*?<\/pre>/gi, "");
  if (/\*\*[^<]{5,}\*\*/.test(withoutCode)) add("WARN", "Markdown leaks", "Unparsed **bold** markers detected in HTML");
}

// 13. Summary
const fails = results.filter(r => r.status === "FAIL");
const warns = results.filter(r => r.status === "WARN");
const passes = results.filter(r => r.status === "PASS");

console.log("\n" + "─".repeat(60));
console.log(`  Results: ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL`);
for (const r of results) {
  const icon = r.status === "PASS" ? "✅" : r.status === "FAIL" ? "❌" : "⚠️";
  console.log(`  ${icon} [${r.status}] ${r.check}: ${r.detail}`);
}
console.log("─".repeat(60));

const verdict = fails.length === 0 ? "STATUS: LIVE AUDIT PASS" : "STATUS: LIVE AUDIT FAIL";
console.log(`\n  Final Verdict: ${verdict}\n`);

if (outPath) {
  const report = [
    `# 🌐 Open-Source Library Live URL Audit Report`,
    ``,
    `**URL:** \`${url}\` · **Date:** ${new Date().toISOString().slice(0, 10)} · **HTTP:** ${status} · **Verdict:** **${verdict}**`,
    ``,
    `| Status | Check | Detail |`,
    `|---|---|---|`,
    ...results.map(r => `| ${r.status} | ${r.check} | ${r.detail} |`),
    ``,
  ].join("\n");
  writeFileSync(resolve(process.cwd(), outPath), report, "utf8");
  console.log(`📝 Report written to ${outPath}\n`);
}

process.exit(fails.length ? 1 : 0);
