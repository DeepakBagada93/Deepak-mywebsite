#!/usr/bin/env node
// trend-research.mjs — Stage 0 of deepak-blog v4.0
// Researches viral & trending content in Deepak's 5 niche pillars before writing.
// Generates a scored topic queue with SERP/trend signals, deduplicated against memory.md.
//
// Usage:
//   node scripts/trend-research.mjs --niche "AI agents" --count 10 --out research-brief.md
//   node scripts/trend-research.mjs --all --count 15 --out research-brief.md
//   node scripts/trend-research.mjs --all --count 15 --out research-brief.md --json research-brief.json
//
// The agent MUST enrich the scaffold with REAL web research (web_search, web_fetch)
// before presenting the queue for user approval. This script is the scaffold + dedup gate.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, dirname, join } from "node:path";

// ─── brand banner ───────────────────────────────────────────────────────────
const BRAND = "═".repeat(58);
console.log(`\n${BRAND}\n  🚀 deepak-blog v4.0 — trend-research.mjs\n  Viral & Trending Research → Scored Topic Queue\n${BRAND}\n`);

// ─── arg parser ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const has = (name) => args.includes(`--${name}`);

const niche = opt("niche", "");
const all = has("all");
const count = parseInt(opt("count", "10"), 10) || 10;
const outPath = resolve(process.cwd(), opt("out", "research-brief.md"));
const jsonOut = opt("json", "");
const memoryPath = resolve(process.cwd(), opt("memory", ".gemini/skills/deepak-blog/memory.md"));
const postsPath = resolve(process.cwd(), opt("posts", "data/posts.php"));

if (!niche && !all) {
  console.error("Usage: node trend-research.mjs --niche \"AI agents\" --count 10 --out research-brief.md");
  console.error("   or: node trend-research.mjs --all --count 15 --out research-brief.md");
  console.error("  --niche <pilllar>  Single pillar research");
  console.error("  --all              Research all 5 pillars");
  console.error("  --count <n>        Topics to generate (default 10)");
  console.error("  --out <file>       Markdown brief output");
  console.error("  --json <file>      Optional JSON queue for automation");
  process.exit(2);
}

// ─── 5 pillar definitions ───────────────────────────────────────────────────
const PILLARS = [
  {
    id: "ai-news",
    label: "AI News & Niche Breakthroughs",
    seed: "AI agents MCP reasoning models",
    keywords: ["AI developer Junagadh", "AI agents India", "MCP server workflows", "RAG vector search India"],
    angles: ["Agentic AI", "MCP (Model Context Protocol)", "Reasoning models", "Local LLMs", "RAG techniques"],
    trendSources: ["Google News AI", "X/Twitter AI", "Hacker News", "Perplexity trending", "YouTube AI news"],
  },
  {
    id: "founder-story",
    label: "Day in the Life & Founder Journey",
    seed: "AI developer founder Junagadh Gujarat",
    keywords: ["Deepak Bagada story", "building from Junagadh", "tech founder Gujarat"],
    angles: ["Building from Tier-3 city", "Shipping client projects", "Developer routines", "Failures & wins"],
    trendSources: ["LinkedIn founder stories", "Indie Hacker trending", "X build-in-public"],
  },
  {
    id: "ai-agents",
    label: "AI Agents & Autonomous Swarms",
    seed: "multi-agent AI systems autonomous swarms",
    keywords: ["multi-agent AI systems India", "AI automation Gujarat", "custom AI agent developer"],
    angles: ["Multi-agent orchestration", "Tool calling", "Hallucination-free RAG", "Client ROI"],
    trendSources: ["LangChain blog", "Anthropic engineering", "OpenAI cookbook trending"],
  },
  {
    id: "web-dev",
    label: "Web Dev & High-Speed Laravel",
    seed: "Laravel web development speed Core Web Vitals",
    keywords: ["best web developer Junagadh", "Laravel developer Gujarat", "custom website cost India"],
    angles: ["Sub-second load times", "Core Web Vitals", "Conversion architecture", "Laravel 13"],
    trendSources: ["Laravel News", "Web.dev trending", "Hacker News Show HN"],
  },
  {
    id: "seo-aeo",
    label: "SEO, AEO & Growth Marketing",
    seed: "AEO answer engine optimization Google AI Overviews",
    keywords: ["AEO expert Gujarat", "SEO expert Junagadh", "Google AI Overviews ranking"],
    angles: ["Google AI Overviews", "Perplexity citations", "JSON-LD schema", "Viral Reels frameworks"],
    trendSources: ["Google Search Central", "SEO Twitter/X", "Perplexity AI blog"],
  },
];

const selected = all ? PILLARS : PILLARS.filter(p => p.id.includes(niche.toLowerCase().replace(/[\s_-]+/g, "-").slice(0, 6)) || p.label.toLowerCase().includes(niche.toLowerCase()) || p.seed.toLowerCase().includes(niche.toLowerCase()));
const pillars = selected.length ? selected : (niche ? [{ id: "custom", label: niche, seed: niche, keywords: [niche], angles: [niche], trendSources: ["General trending"] }] : PILLARS);

// ─── load memory for dedup ──────────────────────────────────────────────────
let existingSlugs = new Set();
let existingTitles = new Set();
if (existsSync(memoryPath)) {
  const mem = readFileSync(memoryPath, "utf8");
  for (const m of mem.matchAll(/Slug:\s*`([^`]+)`/gi)) existingSlugs.add(m[1].toLowerCase().trim());
  for (const m of mem.matchAll(/-\s\*\*([^*]+)\*\*/g)) existingTitles.add(m[1].toLowerCase().trim());
  console.log(`📚 Memory: ${existingSlugs.size} slugs indexed from ${basename(memoryPath)}`);
}
if (existsSync(postsPath)) {
  const posts = readFileSync(postsPath, "utf8");
  for (const m of posts.matchAll(/'slug'\s*=>\s*'([^']+)'/g)) existingSlugs.add(m[1].toLowerCase().trim());
  console.log(`📄 Posts: ${existingSlugs.size} total slugs after merging data/posts.php`);
}

// ─── topic templates per pillar (scaffold — agent replaces with real viral hits) ─
const TOPIC_TEMPLATES = {
  "ai-news": [
    { title: "MCP in 2026: Why Every AI Agent Now Speaks the Same Protocol", kw: "MCP server workflows 2026", intent: "Informational", viral: "MCP trending +340% on X/Twitter, Anthropic announcement" },
    { title: "Hybrid Reasoning Models Explained: How Claude 3.7 & DeepSeek R1 Think Differently", kw: "hybrid reasoning models 2026", intent: "Informational", viral: "Top Hacker News #2, 12K upvotes on r/artificial" },
    { title: "Local LLMs on Your Laptop: Running 70B Reasoning Models Offline in India", kw: "local LLM deployment India", intent: "Commercial", viral: "YouTube 450K views surge, India-specific demand" },
    { title: "RAG 2.0 in 2026: From Vector Search to GraphRAG — What Actually Works", kw: "RAG GraphRAG 2026", intent: "Informational", viral: "Perplexity trending query +180%" },
  ],
  "founder-story": [
    { title: "Building AI Products from Junagadh: The Real Playbook No One Talks About", kw: "building from Junagadh", intent: "Informational", viral: "LinkedIn founder story 8.2K reactions, Tier-3 city angle" },
    { title: "My Daily Routine as an AI Agent Developer: 6 AM to Midnight in Gujarat", kw: "AI developer routine Gujarat", intent: "Informational", viral: "Day-in-life format 2.3M TikTok views niche" },
  ],
  "ai-agents": [
    { title: "Autonomous QA Swarms: How We Cut Production Bugs by 87% with Multi-Agent CI/CD", kw: "autonomous QA multi-agent", intent: "Commercial", viral: "Engineering Twitter viral thread 15K likes" },
    { title: "Zero-Hallucination RAG: The Pydantic + pgvector Pattern We Use in Production", kw: "hallucination-free RAG pgvector", intent: "Commercial", viral: "Technical SEO gap — high intent, low competition" },
    { title: "AI Swarms for Indian SMEs: Architecture That Pays for Itself in 30 Days", kw: "AI automation Indian SMEs", intent: "Commercial", viral: "India SME automation searches +210% YoY" },
  ],
  "web-dev": [
    { title: "Laravel 13 in 2026: How We Hit 98 Lighthouse Scores Without a Single SPA", kw: "Laravel 13 performance 2026", intent: "Commercial", viral: "Laravel News trending #1, HN discussion 340 comments" },
    { title: "How Much Does a Website Cost in Gujarat in 2026? Honest Breakdown", kw: "website cost Gujarat 2026", intent: "Commercial", viral: "Google PAA volume 1.2K/mo, local intent spike" },
    { title: "Monolith vs Microservices in 2026: Why We Went Back to Monoliths", kw: "monolith vs microservices 2026", intent: "Informational", viral: "Engineering debate viral — 450K impressions on X" },
  ],
  "seo-aeo": [
    { title: "How to Rank on Google AI Overviews & Perplexity: The AEO Playbook for 2026", kw: "rank Google AI Overviews 2026", intent: "Commercial", viral: "AEO searches +420% YoY, emerging low-competition goldmine" },
    { title: "JSON-LD Schema That Gets You Cited by ChatGPT: A Developer's Guide", kw: "JSON-LD AEO schema ChatGPT", intent: "Informational", viral: "Technical AEO gap — few cover implementation" },
    { title: "Local SEO for Gujarat Businesses: The 2026 Map Pack + AI Citation System", kw: "local SEO Gujarat 2026", intent: "Commercial", viral: "Local SEO local pack trending, Junagadh geo-modifier" },
  ],
  "custom": [
    { title: `${niche}: Complete 2026 Guide — What Works, What Doesn't & What's Next`, kw: niche, intent: "Informational", viral: "Custom niche — agent must validate with real SERP" },
  ],
};

// ─── generate queue ─────────────────────────────────────────────────────────
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }

let queue = [];
let templatePool = [];
for (const p of pillars) {
  const tpls = TOPIC_TEMPLATES[p.id] || TOPIC_TEMPLATES["custom"];
  for (const t of tpls) templatePool.push({ ...t, pillar: p.label, pillarId: p.id, pillarKw: p.keywords[0] });
}
// Fill to requested count by cycling templates with year/variant tweaks
while (queue.length < count && templatePool.length) {
  for (const t of templatePool) {
    if (queue.length >= count) break;
    // Deduplicate against memory
    const slug = slugify(t.title);
    const titleNorm = t.title.toLowerCase().trim();
    if (existingSlugs.has(slug) || existingTitles.has(titleNorm)) {
      console.log(`  ⏭️  Skipped duplicate: "${t.title}" (slug: ${slug})`);
      continue;
    }
    // Avoid queue-internal duplicates
    if (queue.some(q => q.slug === slug)) continue;
    queue.push({
      rank: queue.length + 1,
      title: t.title,
      slug,
      keyword: t.kw,
      intent: t.intent,
      pillar: t.pillar,
      pillarId: t.pillarId,
      viral_signal: t.viral,
      score: Math.floor(72 + Math.random() * 24), // 72-96 placeholder — agent replaces with real scoring
      status: "🔬 RESEARCH SCAFFOLD — verify with live SERP/trends before approval",
    });
    existingSlugs.add(slug);
  }
  if (queue.length < count) break; // avoid infinite
}
queue = queue.slice(0, count);

// ─── write markdown brief ───────────────────────────────────────────────────
const now = new Date().toISOString().slice(0, 10);
const lines = [];
lines.push(`# 🔥 Viral & Trending Research Brief — deepak-blog v4.0`);
lines.push("");
lines.push(`**Generated:** ${now} · **Niche filter:** ${all ? "ALL 5 pillars" : niche} · **Topics:** ${queue.length} · **Deduped against:** \`memory.md\` + \`data/posts.php\` (${existingSlugs.size} slugs)`);
lines.push("");
lines.push(`> ⚠️ **SCAFFOLD — Agent MUST enrich before approval.** This file is a deduplicated scaffold.`);
lines.push(`> The agent must run REAL research (web_search + web_fetch) to replace placeholder viral signals`);
lines.push(`> with live data: Google Trends, SERP top-10, People-Also-Ask, X/Twitter trending, YouTube trending,`);
lines.push(`> Hacker News / Reddit, and Perplexity trending queries. Then re-score (0-100) and re-rank.`);
lines.push("");
lines.push(`## How to enrich (agent checklist)`);
lines.push(`- [ ] For EACH topic: web_search \`"<keyword> 2026 trending"\` + web_fetch top 3 results`);
lines.push(`- [ ] Check Google Trends (last 30/90 days) for keyword momentum`);
lines.push(`- [ ] Check People-Also-Ask + Related Searches for the keyword`);
lines.push(`- [ ] Score: Trend momentum (0-30) + Search intent value (0-30) + AEO citation potential (0-20) + Competition gap (0-20) = /100`);
lines.push(`- [ ] Cross-check slug/title against live site: \`https://deepakbagada.in/journal/<slug>\` → must be 404`);
lines.push(`- [ ] Re-rank queue by final score descending`);
lines.push("");
lines.push(`## 📊 Scored Topic Queue (ranked — highest viral potential first)`);
lines.push("");
lines.push(`| Rank | Score | Pillar | Title (draft) | Primary Keyword | Intent | Viral Signal (verify live) | Slug |`);
lines.push(`|---|---|---|---|---|---|---|---|`);
for (const q of queue) {
  lines.push(`| ${q.rank} | ${q.score}/100 | ${q.pillar} | ${q.title} | \`${q.keyword}\` | ${q.intent} | ${q.viral_signal} | \`${q.slug}\` |`);
}
lines.push("");
lines.push(`## 🔍 Per-Topic Research Template (fill for each before approval)`);
for (const q of queue) {
  lines.push(`### ${q.rank}. ${q.title}`);
  lines.push(`- **Pillar:** ${q.pillar} · **Slug:** \`${q.slug}\` · **Keyword:** \`${q.keyword}\``);
  lines.push(`- **Live SERP top-3:** _(paste titles + URLs)_`);
  lines.push(`- **People-Also-Ask for keyword:** _(paste 3-4 PAA questions)_`);
  lines.push(`- **Trend proof:** _(Google Trends screenshot/data, X/Twitter impressions, YouTube views, HN points)_`);
  lines.push(`- **Competition gap:** _(what existing articles miss — your angle)_`);
  lines.push(`- **Suggested angle for Deepak:** _(first-person experience hook)_`);
  lines.push(`- **Internal link targets:** \`/services/${q.pillarId === 'web-dev' ? 'web-development' : q.pillarId === 'seo-aeo' ? 'seo-aeo' : q.pillarId === 'ai-agents' || q.pillarId === 'ai-news' ? 'ai-development' : 'automation-expert'}\`, \`/#projects\`, \`/#contact\``);
  lines.push(`- **Final score (re-scored after research):** __/100 · **Approved?** ☐ Yes ☐ No`);
  lines.push("");
}
lines.push(`## ✅ Approval Gate`);
lines.push(`- User reviews enriched brief, ticks **Approved?** per topic`);
lines.push(`- Only **approved** topics enter the sequential write pipeline (Stage 2) — ONE BY ONE`);
lines.push(`- Rejected topics stay in file as audit trail`);
lines.push("");
lines.push(`## Next Stage`);
lines.push(`\`Stage 2 — Sequential Writing\`: For each approved topic in rank order → write 1,200-1,600 word article`);
lines.push(`with EEAT + AEO + internal links + FAQ → audit → push live → live-URL audit → next topic.`);
lines.push("");

writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`✅ Research brief scaffold → ${basename(outPath)} (${queue.length} topics across ${pillars.length} pillar(s))`);
console.log(`   Next: enrich with REAL web_search/web_fetch + Google Trends → present for approval → Stage 2 sequential writing.`);

if (jsonOut) {
  const jPath = resolve(process.cwd(), jsonOut);
  writeFileSync(jPath, JSON.stringify({ generated_at: now, niche: all ? "ALL" : niche, dedup_slugs: existingSlugs.size, queue }, null, 2), "utf8");
  console.log(`✅ JSON queue → ${basename(jPath)}`);
}
process.exit(0);
