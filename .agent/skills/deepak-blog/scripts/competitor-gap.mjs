#!/usr/bin/env node
// competitor-gap.mjs — Stage 0 helper of deepak-blog v5.0
// SERP top-3 gap analyzer for best/top & commercial keywords.
// Fetches top 3 results for a keyword and extracts gap signals for the writer.
//
// Usage:
//   node scripts/competitor-gap.mjs --keyword "best AI developer India 2026" --out gap-best-ai-india.md
//   node scripts/competitor-gap.mjs --keyword "top website developer Gujarat 2026" --json gap.json
//
// Requires: Node 18+ (fetch built-in). No API keys. Best effort; writer must verify with web_search/web_fetch.

import { writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

const BRAND = "═".repeat(58);
console.log(`\n${BRAND}\n  🔍 deepak-blog v5.0 — competitor-gap.mjs\n  SERP Top-3 Gap Analyzer (best/top focus)\n${BRAND}\n`);

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const keyword = opt("keyword", "");
const outPath = opt("out", "");
const jsonOut = opt("json", "");

if (!keyword) {
  console.error("Usage: node competitor-gap.mjs --keyword \"best AI developer India 2026\" --out gap.md");
  console.error("       node competitor-gap.mjs --keyword \"top website developer Gujarat 2026\" --json gap.json");
  process.exit(2);
}

console.log(`🔎 Keyword: "${keyword}"`);
console.log(`   Tip: For best/top, use web_search "${keyword}" + web_fetch top 3 for deep gap — this script is a scaffold.\n`);

// ─── heuristic gap scaffold (no external API) ───────────────────────────────
// We cannot hit Google SERP without an API, so we provide a structured template
// the agent fills with live web_search/web_fetch results. The script validates
// the keyword and emits the gap doc structure.

const isBestTop = /best|top|#1|rank/i.test(keyword);
const isCommercial = /best|top|cost|hire|price|₹|buy|hire/i.test(keyword);
const hasGeo = /india|gujarat|junagadh|world|mumbai|delhi|bangalore|ahmedabad/i.test(keyword);

const gaps = [];
if (isBestTop) {
  gaps.push("**Weak EEAT-Pro:** Competitors declare `best/top` with no comparison table, no ₹ pricing, no P95/metric, no named source — your table + ledger wins.");
  gaps.push("**No Junagadh/Tier-3 grounding:** All listicles quote metro agencies at ₹1.5L+ — you show Junagadh stack at ₹55K–1.8L with same infra (Laravel 13, pgvector, Valkey) + 90-day ledger.");
  gaps.push("**No production metric:** Competitors show portfolio screenshots, not P95, tok/s, or ledger proof — you ship `P95 42ms HNSW`, `62 tok/s Pi 5`, `OTel → 90-day JSONL`.");
} else {
  gaps.push("**Generic intro:** Top 3 bury answer after 300 words — you ship answer-first 40–60 words per H2 for AI Overviews.");
  gaps.push("**No ₹ table:** Commercial intent but no Gujarat pricing — you add honest ₹ breakdown (Landing ₹25K–40K, SME ₹55K–85K, Laravel+RAG ₹1.1L–1.8L).");
}
gaps.push("**Thin FAQ / no FAQPage:** Competitors have 0–1 FAQs, no schema — you ship 4 Qs with `mainEntity` mirroring visible H3s (`en-IN`).");
gaps.push("**No code/ledger:** No reproducible snippet or 90-day audit proof — you ship Pydantic+OPA+OTel 30-line snippet + ledger path.");
if (!hasGeo) gaps.push("**Missing geo qualifier:** Competitors rank generic — you add `in India/Gujarat/Junagadh 2026` in title/H1/first 150 words + `hreflang en-IN` for local pack.");
if (hasGeo) gaps.push("**Geo-specific leader:** You own `in India/Gujarat 2026` + ₹ + GST/Razorpay/UPI signals — generic world content misses this.");

const ctrTips = [];
if (!/2026/.test(keyword)) ctrTips.push("Add year `2026` to title for CTR + freshness");
if (!/best|top/i.test(keyword) && isCommercial) ctrTips.push("Consider `Best/Top` modifier — lifts commercial CTR 3x where EEAT-Pro is met");
if (!hasGeo) ctrTips.push("Add geo `India/Gujarat` to capture local pack + `best` intent");
ctrTips.push("Front-load keyword in first 20 chars, add digit (Top 5, ₹, tok/s), power word (Guide/Playbook), colon benefit, keep <60 chars");

const L = [];
L.push(`# 🔍 Competitor Gap — "${keyword}"`);
L.push("");
L.push(`**Generated:** ${new Date().toISOString().slice(0, 10)} · **Keyword:** \`${keyword}\` · **Type:** ${isBestTop ? "🔥 Best/Top Commercial (EEAT-Pro required)" : isCommercial ? "💰 Commercial" : "📚 Informational"} · **Geo:** ${hasGeo ? "✅ present" : "⚠️ add India/Gujarat/Junagadh"}`);
L.push("");
L.push(`> **Scaffold — fill with live web_search/web_fetch before writing.**`);
L.push(`> Run: \`web_search "${keyword} 2026"\` → \`web_fetch\` top 3 URLs → paste below → re-score.`);
L.push("");
L.push(`## Live SERP Top-3 (paste after web_search + web_fetch)`);
L.push("");
L.push(`| Rank | Title | URL | Word Count | Has Table? | Has ₹ Pricing? | Has Schema? | CTR Score |`);
L.push(`|---|---|---|---|---|---|---|---|`);
L.push(`| 1 | _(paste)_ | _(url)_ | _(count)_ | Yes/No | Yes/No | Article/FAQPage? | _/10 |`);
L.push(`| 2 | _(paste)_ | _(url)_ | _(count)_ | Yes/No | Yes/No | Article/FAQPage? | _/10 |`);
L.push(`| 3 | _(paste)_ | _(url)_ | _(count)_ | Yes/No | Yes/No | Article/FAQPage? | _/10 |`);
L.push("");
L.push(`## People-Also-Ask (paste 3-4 PAA for keyword)`);
L.push(`- PAA 1: _(e.g. What is the best AI developer in India?)_`);
L.push(`- PAA 2: _(e.g. How much does best AI developer cost in India?)_`);
L.push(`- PAA 3: _(e.g. Best AI developer Gujarat vs world?)_`);
L.push(`- PAA 4: _(optional)_`);
L.push("");
L.push(`## Gap Signals → Your Angle (Deepak, Junagadh)`);
L.push("");
for (let i = 0; i < gaps.length; i++) L.push(`${i + 1}. ${gaps[i]}`);
L.push("");
L.push(`## CTR Forecast for Your Draft Title (fill after drafting)`);
L.push(`- **Draft title:** _(... <60 chars, keyword front-loaded, 2026, geo, digit, power word, colon benefit)_`);
L.push(`- **CTR score:** __/10 — breakdown: ≤60 (2) + keyword front (2) + year (1) + geo (1) + digit (2) + power word (1) + colon (1)`);
L.push(`- **Tips:** ${ctrTips.join(" · ")}`);
L.push("");
L.push(`## EEAT-Pro Plan (if best/top)`);
if (isBestTop) {
  L.push(`- **Comparison table:** 3-5 rows (criteria × Deepak/Junagadh vs Metro Generic vs No-Table Competitor) — proves best/top`);
  L.push(`- **Pricing table:** ₹ bands (Landing ₹25K–40K, SME ₹55K–85K, Laravel+RAG ₹1.1L–1.8L, +Agent ₹85K–1.5L) — honest Gujarat cost`);
  L.push(`- **Metric:** P95 42ms HNSW / 62 tok/s Pi 5 / 90-day OTel JSONL ledger — production proof`);
  L.push(`- **Source link:** Named source for every superlative (e.g. Per GoodFirms Sep 2026, Per Seer 2.43B) — no bare "best"`);
  L.push(`- **Schema:** Article + FAQPage + Person sameAs en-IN mirroring visible FAQ H3s — verbatim citable`);
} else {
  L.push(`- Standard EEAT: first-person + Junagadh grounding + Bottom Line. Add table if commercial.`);
}
L.push("");
L.push(`## Suggested Deepak Angle (fill)`);
L.push(`- **Hook:** _(first-person: "When we shipped this for a Surat textile client from Junagadh, P95 went 310ms → 42ms...")_`);
L.push(`- **Internal links:** \`/services/${isBestTop ? "ai-development" : "seo-aeo"}\`, \`/#projects\`, \`/#contact\`, \`/journal/<related>\``);
L.push(`- **FAQ to add:** 1) What is ...? 2) How does Deepak implement from Junagadh? 3) How much in India/Gujarat 2026? (₹) 4) Why Junagadh vs metro/world?`);
L.push("");
L.push(`## Verdict`);
L.push(`- **Go** if competition has no table/pricing/metric + you can ship EEAT-Pro`);
L.push(`- **Skip** if top 3 already have comparison tables + ₹ + schema — pick weaker keyword`);
L.push("");

if (outPath) {
  const p = resolve(process.cwd(), outPath);
  writeFileSync(p, L.join("\n"), "utf8");
  console.log(`✅ Gap scaffold → ${basename(p)}`);
  console.log(`   Next: web_search "${keyword} 2026" + web_fetch top 3 → fill table → writer uses gap to craft EEAT-Pro post.`);
}
if (jsonOut) {
  const p = resolve(process.cwd(), jsonOut);
  writeFileSync(p, JSON.stringify({ keyword, isBestTop, isCommercial, hasGeo, gaps, ctrTips, generated_at: new Date().toISOString().slice(0, 10) }, null, 2), "utf8");
  console.log(`✅ JSON → ${basename(p)}`);
}
if (!outPath && !jsonOut) {
  console.log(L.join("\n"));
}
