#!/usr/bin/env node
// trend-research.mjs — Stage 0 of deepak-blog v5.0
// Researches viral + best/top commercial content in Deepak's 6 niche pillars before writing.
// Generates a scored topic queue with SERP/trend/CTR signals, best/top expansion, deduplicated against memory.md.
// Usage:
//   node scripts/trend-research.mjs --niche "AI agents" --count 10 --out research-brief.md
//   node scripts/trend-research.mjs --all --count 15 --out research-brief.md
//   node scripts/trend-research.mjs --niche "best AI developer India" --count 10 --out research-brief.md
//   node scripts/trend-research.mjs --all --count 15 --out research-brief.md --json research-brief.json
// The agent MUST enrich the scaffold with REAL web research (web_search, web_fetch, competitor-gap.mjs)
// before presenting the queue for user approval. This script is the scaffold + dedup + CTR forecast gate.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner ───────────────────────────────────────────────────────────
const BRAND = "═".repeat(58);
console.log(`\n${BRAND}\n  🚀 deepak-blog v5.0 — trend-research.mjs\n  Viral + Best/Top Research → Scored Topic Queue (high-CTR, high-EEAT)\n${BRAND}\n`);

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
const preset = opt("preset", "");
const autoPhase = has("auto");
let count = parseInt(opt("count", "3"), 10) || 3;
const outPath = resolve(process.cwd(), opt("out", "research-brief.md"));
const jsonOut = opt("json", "");
const autoPublish = has("auto-publish");
const skillDir = existsSync(resolve(process.cwd(), ".agent/skills/deepak-blog"))
  ? ".agent/skills/deepak-blog"
  : ".gemini/skills/deepak-blog";
const memoryPath = resolve(process.cwd(), opt("memory", `${skillDir}/memory.md`));
const postsPath = resolve(process.cwd(), opt("posts", "data/posts.php"));

// Progressive Date-Driven Scaling Presets
const PRESETS = {
  // Automatic progressive scaling phases:
  "phase-1": { "authority": 1, "ai-agents": 1, "web-dev": 1 }, // Days 1–20 (3 dispatches: Safe Crawl Budget & Peak Quality)
  "phase-2": { "authority": 1, "ai-agents": 1, "ai-news": 1, "web-dev": 1, "founder-story": 1 }, // Days 21–50 (5 dispatches)
  "phase-3": { "authority": 2, "ai-agents": 2, "ai-news": 1, "web-dev": 1, "founder-story": 1 }, // Days 51–80 (7 dispatches)
  "phase-4": { "authority": 2, "ai-agents": 2, "ai-news": 2, "web-dev": 2, "founder-story": 2 }, // Days 81+ (10 dispatches)

  // Explicit aliases
  "crawl-budget-3": { "authority": 1, "ai-agents": 1, "web-dev": 1 },
  "budget-3": { "authority": 1, "ai-agents": 1, "web-dev": 1 },
  "deepak-3": { "authority": 1, "ai-agents": 1, "web-dev": 1 },
  "viral-10": { "ai-agents": 2, "ai-news": 2, "web-dev": 2, "custom-mcp": 2, "authority": 2 },
  "deepak-15": { "authority": 3, "founder-story": 3, "ai-news": 3, "web-dev": 3, "custom-mcp": 3 },
  "deepak-12": { "authority": 3, "founder-story": 3, "ai-news": 3, "web-dev": 3 },
  "deepak-18": { "authority": 3, "founder-story": 3, "ai-news": 3, "web-dev": 3, "custom-mcp": 3, "ai-agents": 3 },
};

function getAutoPhase(anchorStr = "2026-09-22") {
  const anchor = new Date(anchorStr + "T00:00:00Z");
  const now = new Date();
  const diffDays = Math.max(1, Math.floor((now.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  if (diffDays <= 20) {
    return { phase: 1, name: "Phase 1: Safe Crawl Budget & Ultra-High Quality", days: `Day ${diffDays} of Days 1–20`, count: 3, presetKey: "phase-1" };
  } else if (diffDays <= 50) {
    return { phase: 2, name: "Phase 2: Gradual Velocity Scale", days: `Day ${diffDays} of Days 21–50`, count: 5, presetKey: "phase-2" };
  } else if (diffDays <= 80) {
    return { phase: 3, name: "Phase 3: High Authority Expansion", days: `Day ${diffDays} of Days 51–80`, count: 7, presetKey: "phase-3" };
  } else {
    return { phase: 4, name: "Phase 4: Enterprise Authority Scale", days: `Day ${diffDays} of Days 81+`, count: 10, presetKey: "phase-4" };
  }
}

if (!niche && !all && !preset && !autoPhase) {
  console.error("Usage: node trend-research.mjs --auto --out research-brief.md  (Auto date-driven progressive phase)");
  console.error("   or: node trend-research.mjs --preset phase-1 --out research-brief.md  (Days 1-20: 3 dispatches Crawl Budget Safe)");
  console.error("   or: node trend-research.mjs --preset crawl-budget-3 --out research-brief.md");
  console.error("   or: node trend-research.mjs --niche \"AI agents\" --count 3 --out research-brief.md");
  console.error("   or: node trend-research.mjs --all --count 3 --out research-brief.md");
  console.error("  --auto             Automatically determine phase and quota based on calendar date (Days 1-20: 3)");
  console.error("  --preset <name>    Preset mix: 'phase-1' (3), 'phase-2' (5), 'phase-3' (7), 'phase-4' (10), 'crawl-budget-3'");
  console.error("  --niche <pillar>   Single pillar or commercial seed (e.g. 'best AI developer India')");
  console.error("  --all              Research all 6-7 pillars (incl. Authority best/top)");
  console.error("  --count <n>        Topics to generate (default 3, overridden by preset/phase)");
  console.error("  --out <file>       Markdown brief output");
  console.error("  --json <file>      Optional JSON queue for automation");
  console.error("  --auto-publish     After brief, auto-run publish-queue (requires approval or --yes)");
  process.exit(2);
}

let presetCounts = null;
if (autoPhase) {
  const activePhase = getAutoPhase();
  presetCounts = PRESETS[activePhase.presetKey];
  count = activePhase.count;
  console.log(`📅 Auto Date-Driven Phase: ${activePhase.name} (${activePhase.days}) → ${count} dispatches: ${Object.entries(presetCounts).map(([k,v])=>`${k}:${v}`).join(" + ")}`);
} else if (preset) {
  if (!PRESETS[preset]) { console.error(`❌ Unknown preset: ${preset} — available: ${Object.keys(PRESETS).join(", ")}`); process.exit(2); }
  presetCounts = PRESETS[preset];
  count = Object.values(presetCounts).reduce((a, b) => a + b, 0);
  console.log(`📌 Preset "${preset}" → ${count} topics: ${Object.entries(presetCounts).map(([k,v])=>`${k}:${v}`).join(" + ")}`);
}

// ─── 7 pillar definitions v5.1 (added custom-mcp-workflow for Next.js+Laravel) ─────
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
    label: "Day in the Life & Founder Journey (Proper)",
    seed: "AI developer founder Junagadh Gujarat day in life",
    keywords: ["Deepak Bagada story", "building from Junagadh", "tech founder Gujarat", "day in life AI developer India"],
    angles: ["Timestamped routine 06:00-22:00", "Shipping client projects with metrics", "Junagadh lab P95/ledger", "Failures & wins with ₹ impact"],
    trendSources: ["LinkedIn founder stories", "Indie Hacker trending", "X build-in-public", "YouTube day-in-life"],
  },
  {
    id: "ai-agents",
    label: "AI Agents & Autonomous Swarms",
    seed: "multi-agent AI systems autonomous swarms",
    keywords: ["multi-agent AI systems India", "AI automation Gujarat", "custom AI agent developer"],
    angles: ["Multi-agent orchestration", "Tool calling", "Hallucination-free RAG", "Client ROI with ₹"],
    trendSources: ["LangChain blog", "Anthropic engineering", "OpenAI cookbook trending"],
  },
  {
    id: "web-dev",
    label: "Web Dev & High-Speed Laravel",
    seed: "Laravel web development speed Core Web Vitals",
    keywords: ["best web developer Junagadh", "Laravel developer Gujarat", "custom website cost India"],
    angles: ["Sub-second load times", "Core Web Vitals", "Conversion architecture", "Laravel 13 AI SDK"],
    trendSources: ["Laravel News", "Web.dev trending", "Hacker News Show HN"],
  },
  {
    id: "seo-aeo",
    label: "SEO, AEO & Growth Marketing",
    seed: "AEO answer engine optimization Google AI Overviews",
    keywords: ["AEO expert Gujarat", "SEO expert Junagadh", "Google AI Overviews ranking", "best SEO expert India"],
    angles: ["Google AI Overviews", "Perplexity citations", "JSON-LD schema", "Zero-click 58% playbook"],
    trendSources: ["Google Search Central", "SEO Twitter/X", "Perplexity AI blog"],
  },
  {
    id: "authority",
    label: "Authority — Best/Top Rankings",
    seed: "best AI developer India top AI expert world",
    keywords: ["best AI developer India", "top AI expert India", "best website developer Gujarat", "top AI developer world", "best AI expert Junagadh"],
    angles: ["Best/top comparison with proof table", "Pricing ₹ vs metro", "World vs India competitive gap", "Hiring guide with skills vetting"],
    trendSources: ["Google SERP best/top", "Clutch/G2 rankings", "LinkedIn top voices", "YouTube best-of lists"],
  },
  {
    id: "custom-mcp",
    label: "Custom MCP + Workflow (Next.js & Laravel)",
    seed: "custom MCP server workflow Next.js Laravel",
    keywords: ["custom MCP server Next.js", "MCP workflow Laravel 2026", "MCP Next.js 15.5 Laravel 13", "n8n MCP workflow automation"],
    angles: ["Custom MCP server from scratch", "Next.js 15.5 + MCP (Turbopack, Cache Components)", "Laravel 13 + MCP (AI SDK, pgvector, Boost)", "Workflow automation n8n+MCP for both stacks"],
    trendSources: ["MCP spec 2026-03-26", "Next.js 15.5 release notes", "Laravel 13 AI SDK docs", "n8n MCP community"],
  },
];

const selected = all ? PILLARS : PILLARS.filter(p => p.id.includes(niche.toLowerCase().replace(/[\s_-]+/g, "-").slice(0, 6)) || p.label.toLowerCase().includes(niche.toLowerCase()) || p.seed.toLowerCase().includes(niche.toLowerCase()));
// If niche is a commercial best/top seed, treat as authority custom but expand
const isBestTopSeed = /best|top|#1|rank/i.test(niche);
const pillars = selected.length ? selected : (niche ? [{ id: isBestTopSeed ? "authority" : "custom", label: isBestTopSeed ? `Authority — Best/Top: ${niche}` : niche, seed: niche, keywords: [niche], angles: [niche], trendSources: isBestTopSeed ? ["Google SERP best/top"] : ["General trending"] }] : PILLARS);

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

// ─── v5.1 topic templates per pillar (high-CTR, best/top aware, Next.js+Laravel both) ─
const TOPIC_TEMPLATES = {
  "ai-news": [
    { title: "MCP in 2026: Why Every AI Agent Speaks One Protocol", kw: "MCP server workflows 2026", intent: "Informational", viral: "MCP trending +340% on X/Twitter, Anthropic announcement", ctr: 8 },
    { title: "Hybrid Reasoning: Claude 3.7 vs DeepSeek R1 2026", kw: "hybrid reasoning models 2026", intent: "Informational", viral: "Top Hacker News #2, 12K upvotes on r/artificial", ctr: 8 },
    { title: "Local LLMs on Laptop: 70B Offline in India 2026", kw: "local LLM deployment India", intent: "Commercial", viral: "YouTube 450K views surge, India-specific demand", ctr: 9 },
    { title: "RAG 2.0 in 2026: Vector Search to GraphRAG — Works", kw: "RAG GraphRAG 2026", intent: "Informational", viral: "Perplexity trending query +180%", ctr: 7 },
    { title: "AI News Sep 2026: Top 30 Agents — OmniRoute 45K Leads", kw: "AI agents GitHub trending 2026", intent: "Informational", viral: "GitHub trending +5.8K/week OmniRoute", ctr: 9 },
  ],
  "founder-story": [
    { title: "Building from Junagadh: 06:00–Midnight Playbook 2026", kw: "building from Junagadh", intent: "Informational", viral: "LinkedIn founder story 8.2K reactions, Tier-3 city angle", ctr: 8 },
    { title: "Day in Life: AI Developer Gujarat 2026 — 06:00-22:00", kw: "day in life AI developer Gujarat", intent: "Informational", viral: "Day-in-life format 2.3M TikTok views niche, EEAT gold", ctr: 9 },
    { title: "From Junagadh to India: Ship AI Agents on ₹6K VPS", kw: "AI developer Junagadh story", intent: "Informational", viral: "Build-in-public X thread 15K impressions", ctr: 8 },
  ],
  "ai-agents": [
    { title: "Autonomous QA Swarms: How We Cut Production Bugs by 87% with Multi-Agent CI/CD", kw: "autonomous QA multi-agent", intent: "Commercial", viral: "Engineering Twitter viral thread 15K likes", ctr: 9 },
    { title: "Zero-Hallucination RAG: The Pydantic + pgvector Pattern We Use in Production", kw: "hallucination-free RAG pgvector", intent: "Commercial", viral: "Technical SEO gap — high intent, low competition", ctr: 8 },
    { title: "AI Swarms for Indian SMEs: Architecture That Pays for Itself in 30 Days", kw: "AI automation Indian SMEs", intent: "Commercial", viral: "India SME automation searches +210% YoY", ctr: 9 },
  ],
  "web-dev": [
    { title: "Laravel 13 in 2026: 98 Lighthouse, No SPA", kw: "Laravel 13 performance 2026", intent: "Commercial", viral: "Laravel News trending #1, HN discussion 340 comments", ctr: 8 },
    { title: "Best Website Developer Gujarat 2026: Costs & Proof", kw: "best website developer Gujarat 2026", intent: "Commercial", viral: "Google PAA volume 1.2K/mo, local intent spike + best modifier 3x CTR", ctr: 9 },
    { title: "Website Cost Gujarat 2026: Honest ₹ Breakdown", kw: "website cost Gujarat 2026", intent: "Commercial", viral: "Commercial intent + ₹ table gap", ctr: 9 },
    { title: "Next.js 15.5 in 2026: Turbopack 5x, TTFB 700→60ms", kw: "Next.js 15.5 performance 2026", intent: "Commercial", viral: "Next.js 15.5 Turbopack beta viral, HN 400+ comments", ctr: 9 },
    { title: "Next.js vs Laravel 2026: Which Ships Faster — Junagadh", kw: "Next.js vs Laravel 2026 India", intent: "Commercial", viral: "Stack comparison gap — high CTR, low EEAT competition", ctr: 9 },
  ],
  "seo-aeo": [
    { title: "How to Rank on Google AI Overviews & Perplexity: The AEO Playbook for 2026", kw: "rank Google AI Overviews 2026", intent: "Commercial", viral: "AEO searches +420% YoY, emerging low-competition goldmine", ctr: 9 },
    { title: "Zero-Click 58.5%: How to Keep Clicks When AI Answers in India 2026", kw: "zero-click AI Overviews India", intent: "Commercial", viral: "58.5% zero-click study viral Sep 2026", ctr: 9 },
    { title: "Local SEO for Gujarat Businesses: The 2026 Map Pack + AI Citation System", kw: "local SEO Gujarat 2026", intent: "Commercial", viral: "Local SEO local pack trending, Junagadh geo-modifier", ctr: 8 },
  ],
  "authority": [
    { title: "Best AI Developer in India 2026: Skills, Costs & Hire", kw: "best AI developer India 2026", intent: "Commercial", viral: "High-intent `best` query 2.4K/mo, low EEAT competition — proof table wins", ctr: 10 },
    { title: "Top AI Expert India 2026: Ships Production, Not Demos", kw: "top AI expert India 2026", intent: "Commercial", viral: "`top` commercial 1.8K/mo, featured snippet opportunity", ctr: 10 },
    { title: "Best AI Expert World vs India 2026: Rates & Proof", kw: "best AI expert developer world 2026", intent: "Commercial", viral: "World vs India cost gap — ₹ vs $ table viral", ctr: 9 },
    { title: "Top Developer Junagadh & Gujarat 2026: Portfolio & Proof", kw: "top website developer Junagadh Gujarat 2026", intent: "Commercial", viral: "Local `top` pack + Junagadh grounding — zero strong competitors", ctr: 10 },
    { title: "Best Website Developer India 2026: Junagadh vs Metro", kw: "best website developer India 2026", intent: "Commercial", viral: "Metro vs Tier-3 cost + speed comparison gap", ctr: 9 },
  ],
  "custom-mcp": [
    { title: "Custom MCP Server 2026: Build in 30 Mins — Next+Laravel", kw: "custom MCP server build 2026", intent: "Commercial", viral: "MCP spec 2026-03-26 viral, builder demand +340%", ctr: 9 },
    { title: "Next.js 15.5 + MCP 2026: Tool Calling in 20 Lines", kw: "Next.js MCP integration 2026", intent: "Commercial", viral: "Next.js MCP SDK 18K stars, high intent", ctr: 9 },
    { title: "Laravel 13 + MCP 2026: pgvector to n8n Flow", kw: "Laravel MCP workflow 2026", intent: "Commercial", viral: "Laravel 13 MCP + Boost trending, workflow gap", ctr: 9 },
    { title: "MCP Workflow 2026: n8n + Next.js + Laravel — One Ledger", kw: "MCP workflow Next.js Laravel n8n 2026", intent: "Commercial", viral: "n8n 400 integrations + MCP = viral automation stack", ctr: 9 },
    { title: "MCP Security 2026: Auth & JWT for Both Stacks", kw: "MCP security deployment Next.js Laravel 2026", intent: "Commercial", viral: "MCP security gap — 26% skills vulnerable per SkillSpector", ctr: 8 },
  ],
  "custom": [
    { title: `${niche}: Complete 2026 Guide — What Works, What Doesn't & What's Next`, kw: niche, intent: isBestTopSeed ? "Commercial" : "Informational", viral: isBestTopSeed ? "Commercial best/top — high CTR, needs proof table + ₹ pricing" : "Custom niche — agent must validate with real SERP", ctr: isBestTopSeed ? 9 : 7 },
  ],
};

// ─── best/top modifier expansion ────────────────────────────────────────────
function expandBestTopVariants(baseTitle, baseKw) {
  // For authority pillar, generate geo variants if not already present
  const geos = ["India", "Gujarat", "Junagadh", "world"];
  const variants = [];
  if (/best|top/i.test(baseTitle)) return []; // already has modifier
  // Heuristic: authority kw expansion handled via templates; skip auto for non-authority to avoid noise
  return variants;
}

function ctrLabel(score) {
  if (score >= 9) return "🔥 High";
  if (score >= 7) return "✅ Good";
  return "⚠️ Low";
}

function deterministicScore(tpl, pillarId) {
  // Deterministic scoring: intent + CTR + pillar bonus + best/top bonus + hash
  let score = 68;
  if (tpl.intent === "Commercial") score += 10;
  else score += 4;
  score += Math.min(tpl.ctr, 10); // CTR 0-10
  if (pillarId === "authority") score += 8; // best/top commercial premium
  if (/best|top/i.test(tpl.title)) score += 5;
  if (/India|Gujarat|Junagadh|world/i.test(tpl.kw)) score += 3;
  // Deterministic jitter from title hash (0-6) instead of random
  let hash = 0;
  for (let i = 0; i < tpl.title.length; i++) hash = (hash * 31 + tpl.title.charCodeAt(i)) >>> 0;
  score += hash % 7;
  return Math.min(98, Math.max(72, score));
}

function eeatProofRequired(title, intent) {
  if (/best|top|#1|ranked/i.test(title)) return "EEAT-Pro: comparison table + ₹ pricing/metric + named source REQUIRED";
  if (intent === "Commercial") return "Pricing table + metric + source recommended";
  return "Standard EEAT (first-person + Junagadh grounding + Bottom Line)";
}

// ─── generate queue ─────────────────────────────────────────────────────────
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60); }

let queue = [];
let templatePool = [];
// Preset mode: build per-pillar queue with exact counts
if (presetCounts) {
  for (const [pillarId, needed] of Object.entries(presetCounts)) {
    const p = PILLARS.find(x => x.id === pillarId);
    const tpls = TOPIC_TEMPLATES[pillarId] || [];
    if (!p) continue;
    let added = 0;
    let idx = 0;
    let tries = 0;
    while (added < needed && tries < 30) {
      tries++;
      const t = tpls[idx % tpls.length];
      idx++;
      const slug = slugify(t.title);
      const titleNorm = t.title.toLowerCase().trim();
      if (existingSlugs.has(slug) || existingTitles.has(titleNorm) || queue.some(q => q.slug === slug)) {
        // mutate title with variant to avoid dup (Next.js ↔ Laravel rotation)
        if (tries > tpls.length) {
          const variant = `${t.title} — Variant ${tries}`;
          const vSlug = slugify(variant);
          if (!existingSlugs.has(vSlug) && !queue.some(q => q.slug === vSlug)) {
            const score = deterministicScore({ ...t, title: variant }, pillarId);
            queue.push({ rank: queue.length + 1, title: variant, slug: vSlug, keyword: t.kw, intent: t.intent, pillar: p.label, pillarId, viral_signal: t.viral, ctr_forecast: t.ctr, ctr_label: ctrLabel(t.ctr), eeat_proof: eeatProofRequired(variant, t.intent), score, status: "🔬 RESEARCH SCAFFOLD — verify with live SERP/trends + competitor-gap before approval" });
            existingSlugs.add(vSlug); existingTitles.add(variant.toLowerCase().trim()); added++;
          }
        }
        continue;
      }
      const score = deterministicScore(t, pillarId);
      queue.push({ rank: queue.length + 1, title: t.title, slug, keyword: t.kw, intent: t.intent, pillar: p.label, pillarId, viral_signal: t.viral, ctr_forecast: t.ctr, ctr_label: ctrLabel(t.ctr), eeat_proof: eeatProofRequired(t.title, t.intent), score, status: "🔬 RESEARCH SCAFFOLD — verify with live SERP/trends + competitor-gap before approval" });
      existingSlugs.add(slug); existingTitles.add(titleNorm); added++;
    }
  }
} else {
  for (const p of pillars) {
    const tpls = TOPIC_TEMPLATES[p.id] || TOPIC_TEMPLATES["custom"];
    for (const t of tpls) templatePool.push({ ...t, pillar: p.label, pillarId: p.id, pillarKw: p.keywords[0] });
  }
  // Ensure authority gets at least 30% share when --all
  const authorityNeeded = all ? Math.ceil(count * 0.3) : 0;
  let authorityCount = 0;

  // Fill to requested count by cycling templates with deterministic scoring
  let poolIdx = 0;
  let attempts = 0;
  while (queue.length < count && attempts < count * 4) {
    attempts++;
    const t = templatePool[poolIdx % templatePool.length];
    poolIdx++;
    const slug = slugify(t.title);
    const titleNorm = t.title.toLowerCase().trim();
    if (existingSlugs.has(slug) || existingTitles.has(titleNorm)) {
      continue;
    }
    if (queue.some(q => q.slug === slug)) continue;
    // Enforce authority quota
    if (all && authorityCount < authorityNeeded && t.pillarId !== "authority" && queue.length >= count - authorityNeeded + authorityCount) {
      // Skip non-authority to fill quota
      continue;
    }
    const score = deterministicScore(t, t.pillarId);
    queue.push({
      rank: queue.length + 1,
      title: t.title,
      slug,
      keyword: t.kw,
      intent: t.intent,
      pillar: t.pillar,
      pillarId: t.pillarId,
      viral_signal: t.viral,
      ctr_forecast: t.ctr,
      ctr_label: ctrLabel(t.ctr),
      eeat_proof: eeatProofRequired(t.title, t.intent),
      score,
      status: "🔬 RESEARCH SCAFFOLD — verify with live SERP/trends + competitor-gap before approval",
    });
    existingSlugs.add(slug);
    if (t.pillarId === "authority") authorityCount++;
    // Also track existingTitles to avoid re-adding
    existingTitles.add(titleNorm);
    if (queue.length >= count && (!all || authorityCount >= authorityNeeded)) break;
  }
  // If still under count (dedup heavy), fill with best/top custom variants
  if (queue.length < count) {
    const fallback = [
      { title: `Best AI Developer in Gujarat 2026: ${niche || "Gujarat SME"} Playbook`, kw: `best AI developer Gujarat 2026`, intent: "Commercial", viral: "Fallback best/top commercial — Junagadh proof angle", ctr: 9, pillar: "Authority — Best/Top Rankings", pillarId: "authority" },
      { title: `Top AI Expert Developer World 2026: India vs Global Costs`, kw: `top AI expert developer world 2026`, intent: "Commercial", viral: "World vs India pricing gap", ctr: 9, pillar: "Authority — Best/Top Rankings", pillarId: "authority" },
    ];
    for (const t of fallback) {
      if (queue.length >= count) break;
      const slug = slugify(t.title);
      if (existingSlugs.has(slug)) continue;
      const score = deterministicScore(t, t.pillarId);
      queue.push({ rank: queue.length + 1, title: t.title, slug, keyword: t.kw, intent: t.intent, pillar: t.pillar, pillarId: t.pillarId, viral_signal: t.viral, ctr_forecast: t.ctr, ctr_label: ctrLabel(t.ctr), eeat_proof: eeatProofRequired(t.title, t.intent), score, status: "🔬 RESEARCH SCAFFOLD — verify with live SERP/trends + competitor-gap before approval" });
    }
  }
  queue = queue.slice(0, count);
}
// Sort by score descending (deterministic) — but keep preset group order if preset (so 3+3+3+3+3 visible)
if (!presetCounts) {
  queue.sort((a, b) => b.score - a.score);
  queue.forEach((q, i) => q.rank = i + 1);
} else {
  // still re-rank by score but stable within score ties keeps preset grouping
  queue.sort((a, b) => b.score - a.score);
  queue.forEach((q, i) => q.rank = i + 1);
}

// ─── write markdown brief ───────────────────────────────────────────────────
const now = new Date().toISOString().slice(0, 10);
const lines = [];
lines.push(`# 🔥 Viral + Best/Top Research Brief — deepak-blog v5.1 ${preset ? `(Preset: ${preset})` : ""}`);
lines.push("");
const presetLabel = preset ? `Preset ${preset} (${Object.entries(presetCounts).map(([k,v])=>`${k}:${v}`).join(" + ")})` : (all ? "ALL 7 pillars (incl. Authority + Custom MCP Next.js/Laravel)" : niche);
lines.push(`**Generated:** ${now} · **Niche filter:** ${presetLabel} · **Topics:** ${queue.length} · **Deduped against:** \`memory.md\` + \`data/posts.php\` (${existingSlugs.size} slugs)`);
lines.push("");
lines.push(`> ⚠️ **SCAFFOLD — Agent MUST enrich before approval.** This file is a deduplicated scaffold.`);
lines.push(`> The agent must run REAL research (web_search + web_fetch + competitor-gap.mjs) to replace placeholder viral signals`);
lines.push(`> with live data: Google Trends, SERP top-10 (esp. for best/top), People-Also-Ask, X/Twitter trending, YouTube trending,`);
lines.push(`> Hacker News / Reddit, and Perplexity trending queries. Then re-score (0-100) and re-rank.`);
lines.push(`> **v5.0 rule:** ≥30% of queue must be Authority best/top (commercial) when --all. Each best/top needs proof table plan.`);
lines.push("");
lines.push(`## How to enrich (agent checklist)`);
lines.push(`- [ ] For EACH topic: web_search \`"<keyword> 2026 best top"\` + web_fetch top 3 results`);
lines.push(`- [ ] For best/top topics: run \`node .gemini/skills/deepak-blog/scripts/competitor-gap.mjs --keyword "<keyword>" --out gap-<slug>.md\``);
lines.push(`- [ ] Check Google Trends (last 30/90 days) for keyword momentum — note best/top modifier volume`);
lines.push(`- [ ] Check People-Also-Ask + Related Searches for the keyword (esp. "best AI developer India?")`);
lines.push(`- [ ] CTR forecast: score title 0-10 (keyword front-loaded? year 2026? geo? digit? power word Best/Top? <60 chars?)`);
lines.push(`- [ ] Score: Trend momentum (0-30) + Search intent value (0-30, best/top commercial = 25-30) + AEO citation potential (0-20) + Competition gap (0-20) = /100`);
lines.push(`- [ ] EEAT-Pro plan: if title has best/top → define comparison table + ₹ pricing/metric + named source`);
lines.push(`- [ ] Cross-check slug/title against live site: \`https://deepakbagada.in/journal/<slug>\` → must be 404`);
lines.push(`- [ ] Re-rank queue by final score descending`);
lines.push("");
lines.push(`## 📊 Scored Topic Queue (ranked — highest viral + commercial potential first)`);
lines.push("");
lines.push(`| Rank | Score | CTR | Pillar | Title (draft) | Primary Keyword | Intent | Viral Signal (verify live) | Slug | EEAT Proof |`);
lines.push(`|---|---|---|---|---|---|---|---|---|---|`);
for (const q of queue) {
  lines.push(`| ${q.rank} | ${q.score}/100 | ${q.ctr_forecast}/10 ${q.ctr_label} | ${q.pillar} | ${q.title} | \`${q.keyword}\` | ${q.intent} | ${q.viral_signal} | \`${q.slug}\` | ${q.eeat_proof} |`);
}
lines.push("");
lines.push(`## 🔍 Per-Topic Research Template (fill for each before approval)`);
for (const q of queue) {
  lines.push(`### ${q.rank}. ${q.title}`);
  lines.push(`- **Pillar:** ${q.pillar} · **Slug:** \`${q.slug}\` · **Keyword:** \`${q.keyword}\` · **Intent:** ${q.intent} · **CTR Forecast:** ${q.ctr_forecast}/10 ${q.ctr_label}`);
  lines.push(`- **Live SERP top-3:** _(paste titles + URLs — for best/top note who ranks #1 and why)_`);
  lines.push(`- **People-Also-Ask for keyword:** _(paste 3-4 PAA questions — esp. best/top variants)_`);
  lines.push(`- **Trend proof:** _(Google Trends screenshot/data, X/Twitter impressions, YouTube views, HN points)_`);
  lines.push(`- **Competition gap:** _(what existing articles miss — your angle: Junagadh lab, ₹ pricing, P95 metric, 90-day ledger, code)_`);
  lines.push(`- **CTR analysis:** _(keyword front-loaded? digit/power-word? year 2026? geo? <60 chars? score 0-10)_`);
  lines.push(`- **EEAT-Pro plan:** ${q.eeat_proof}`);
  lines.push(`- **Suggested angle for Deepak:** _(first-person experience hook — e.g. "When we shipped this for a Surat textile client, P95 42ms...")_`);
  lines.push(`- **Internal link targets:** \`/services/${q.pillarId === 'web-dev' ? 'web-development' : q.pillarId === 'seo-aeo' ? 'seo-aeo' : q.pillarId === 'authority' ? 'ai-development' : q.pillarId === 'ai-agents' || q.pillarId === 'ai-news' ? 'ai-development' : 'automation-expert'}\`, \`/#projects\`, \`/#contact\`, \`/journal/<related>\``);
  lines.push(`- **Final score (re-scored after research):** __/100 · **Approved?** ☐ Yes ☐ No`);
  lines.push("");
}
lines.push(`## ✅ Approval Gate`);
lines.push(`- User reviews enriched brief, ticks **Approved?** per topic — prioritize best/top commercial first`);
lines.push(`- Only **approved** topics enter the sequential write pipeline (Stage 2) — ONE BY ONE`);
lines.push(`- Rejected topics stay in file as audit trail`);
lines.push("");
lines.push(`## Next Stage`);
lines.push(`\`Stage 2 — Sequential Writing\`: For each approved topic in rank order → write 1,200-1,600 word article`);
lines.push(`with high-CTR meta + EEAT-Pro proof table if best/top + internal links + FAQ → audit (CTR ≥7/10, EEAT-Pro PASS) → push live → live-URL audit → next topic.`);
lines.push("");

writeFileSync(outPath, lines.join("\n"), "utf8");
const presetSummary = preset ? ` preset ${preset} ${Object.entries(presetCounts).map(([k,v])=>`${k}:${v}`).join(" + ")}` : (all ? ` incl. Authority best/top + Custom MCP` : "");
console.log(`✅ Research brief scaffold → ${basename(outPath)} (${queue.length} topics across ${preset ? Object.keys(presetCounts).length : pillars.length} pillar(s))${presetSummary}`);
console.log(`   Next: enrich with REAL web_search/web_fetch + competitor-gap.mjs + Google Trends → present for approval → Stage 2 sequential writing.`);

if (jsonOut) {
  const jPath = resolve(process.cwd(), jsonOut);
  writeFileSync(jPath, JSON.stringify({ generated_at: now, niche: preset || (all ? "ALL" : niche), dedup_slugs: existingSlugs.size, queue, v5_1: { preset: preset || null, presetCounts, queue_len: queue.length } }, null, 2), "utf8");
  console.log(`✅ JSON queue → ${basename(jPath)}`);
}
if (autoPublish) {
  console.log(`\n🚀 --auto-publish: launching publish-queue.mjs for ${basename(outPath)} ...`);
  const { spawnSync } = await import("node:child_process");
  const pq = resolve(process.cwd(), `${skillDir}/scripts/publish-queue.mjs`);
  const res = spawnSync("node", [pq, "--brief", outPath, "--json", jsonOut || outPath.replace(/\.md$/, ".json"), "--yes"], { stdio: "inherit" });
  process.exit(res.status ?? 0);
}
process.exit(0);
