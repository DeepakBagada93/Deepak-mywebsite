#!/usr/bin/env node
// audit-library.mjs — Pre-publish quality, EEAT, AEO, and Alt Tag auditor for opensource-library
// Audits skill pages, blueprints, curated repos, and stack docs before publishing.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";
import { execSync } from "node:child_process";

const BRAND = "═".repeat(60);
console.log(`\n${BRAND}\n  🏗️  opensource-library — audit-library.mjs\n  Pre-Publish Content, EEAT, Anti-AI Fluff & Alt Tag Audit\n${BRAND}\n`);

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const fileArg = opt("file", "");
const slugArg = opt("slug", "");
const typeArg = opt("type", "skill"); // skill | blueprint | repo | stack
const outPath = opt("out", "");

let filePath = fileArg;
if (!filePath && slugArg) {
  if (typeArg === "skill") {
    filePath = resolve(process.cwd(), `data/library/skills/${slugArg}.php`);
  } else if (typeArg === "blueprint") {
    filePath = resolve(process.cwd(), `data/library/blueprints/${slugArg}.php`);
  }
}

if (!filePath && !existsSync(resolve(process.cwd(), "data/library"))) {
  console.error("Usage:");
  console.error("  node scripts/audit-library.mjs --file data/library/skills/mcp-agent-builder.php");
  console.error("  node scripts/audit-library.mjs --slug mcp-agent-builder --type skill");
  console.error("  node scripts/audit-library.mjs --all-skills");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

// ─── helpers ─────────────────────────────────────────────────────────────────
const AI_FLUFF = [
  // 1. Synthetic Openers & Throat Clearing
  "in today's fast-paced world", "in today's digital landscape", "in today's fast-paced digital world",
  "in today's modern world", "in the fast-evolving world of", "in the ever-evolving landscape",
  "in the realm of", "in this blog post", "in this article, we will", "in this guide, we will",
  "let's dive in", "let's dive into", "let us dive into", "have you ever wondered",
  "as an ai language model", "the world of ai is constantly changing", "imagine a world where",
  "gone are the days when", "fast-forward to today", "fast forward to today", "without further ado",
  "it goes without saying", "needless to say", "first and foremost",

  // 2. Synthetic Buzzwords & Hype Clichés
  "delve into", "delving into", "delves into", "unlock the power", "unlocking the power", "unlock the potential",
  "unlocking the potential", "game-changer", "game changer", "game-changing", "revolutionize", "revolutionizing",
  "skyrocket your", "tapestry", "rich tapestry", "nestled", "plethora", "embark on a journey", "embarking on a journey",
  "cutting-edge solution", "cutting edge solution", "cutting-edge", "leverage the power", "harness the power of",
  "harnessing the power", "testament to", "a testament to", "beacon of", "beacon of hope", "pivotal role",
  "plays a pivotal role", "pivotal in", "navigating the landscape", "a double-edged sword", "brimming with",
  "treasure trove", "demystifying", "demystify", "look no further", "revolutionary approach", "take a deep dive",
  "unleash the potential", "unleash the power", "a holistic approach", "holistic approach", "seamless integration",
  "seamlessly integrate", "seamlessly integrates", "seamlessly integrated", "paradigm shift", "supercharge your",
  "supercharge", "unrivaled", "second to none", "groundbreaking solution", "unparalleled", "powerhouse of",
  "multifaceted", "paramount", "myriad of", "an array of", "shines bright", "stands out as a shining example",
  "pushes the boundaries", "at the forefront of innovation", "at the forefront", "state-of-the-art solution",

  // 3. Synthetic Transitions & Robotic Conclusions
  "it's important to remember", "it is important to remember", "it is worth noting", "it's worth noting",
  "at its core", "in essence", "moreover,", "furthermore,", "in conclusion", "to sum up", "all in all",
  "to wrap things up", "to wrap up", "in summary", "final thoughts", "with that being said", "that being said",
  "on the other hand,", "last but not least"
];

function auditSkillFile(path) {
  const absPath = resolve(process.cwd(), path);
  if (!existsSync(absPath)) {
    add("FAIL", "File existence", `File not found: ${absPath}`);
    return;
  }

  // 1. PHP Syntax Check
  try {
    execSync(`php -l ${JSON.stringify(absPath)}`, { stdio: "pipe" });
    add("PASS", "PHP syntax check", "No syntax errors detected");
  } catch (err) {
    add("FAIL", "PHP syntax check", `PHP lint failed: ${err.message}`);
  }

  const raw = readFileSync(absPath, "utf8");

  // Extract fields
  const titleMatch = raw.match(/'title'\s*=>\s*'([^']+)'/) || raw.match(/'title'\s*=>\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : "";

  const slugMatch = raw.match(/'slug'\s*=>\s*'([^']+)'/) || raw.match(/'slug'\s*=>\s*"([^"]+)"/);
  const slug = slugMatch ? slugMatch[1] : "";

  const summaryMatch = raw.match(/'summary'\s*=>\s*'([^']+)'/) || raw.match(/'summary'\s*=>\s*"([^"]+)"/);
  const summary = summaryMatch ? summaryMatch[1] : "";

  const contentMatch = raw.match(/'content'\s*=>\s*<<<'CONTENT'([\s\S]*?)CONTENT,/);
  const content = contentMatch ? contentMatch[1] : "";

  // 2. Title audit
  if (!title) add("FAIL", "Title presence", "Missing 'title' field");
  else if (title.length > 60) add("WARN", "Title length ≤60 chars", `${title.length} chars: "${title}" — slightly over recommended 60 chars`);
  else add("PASS", "Title length ≤60 chars", `${title.length} chars: "${title}"`);

  // 3. Slug audit
  if (!slug) add("FAIL", "Slug presence", "Missing 'slug' field");
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) add("FAIL", "Slug format", `"${slug}" must be lowercase-kebab-case`);
  else add("PASS", "Slug format", `\`${slug}\``);

  // 4. Summary audit
  if (!summary) add("FAIL", "Summary presence", "Missing 'summary' field (meta description for library)");
  else if (summary.length < 120) add("WARN", "Summary length 140-160 chars", `${summary.length} chars — too short for full snippet`);
  else if (summary.length > 170) add("WARN", "Summary length 140-160 chars", `${summary.length} chars — over 160 chars, may truncate in search`);
  else add("PASS", "Summary length 140-160 chars", `${summary.length} chars`);

  // 5. Content Word Count
  const words = content.split(/\s+/).filter(Boolean).length;
  if (words < 1000) add("FAIL", "Word count ≥1,200", `${words} words — too thin for an authoritative engineering skill page`);
  else if (words < 1200) add("WARN", "Word count ≥1,200", `${words} words — close to 1,200 target, expand architectural details`);
  else add("PASS", "Word count ≥1,200", `${words} words — excellent technical depth`);

  // 6. AEO Answer-First Intro
  const introBlocks = content.replace(/^#{1,6}\s+.*$/gm, "").trim().split(/\n+/).filter(b => b.trim().length > 30);
  const firstBlock = introBlocks[0] || "";
  const introWords = firstBlock.split(/\s+/).filter(Boolean).length;
  if (introWords >= 25 && /built|shipped|architecture|protocol|agent|pipeline|workflow/i.test(firstBlock)) {
    add("PASS", "AEO answer-first intro", `First block has ${introWords} words answering what this skill delivers`);
  } else {
    add("WARN", "AEO answer-first intro", "Opening should provide a 40-60 word quotable definition of what this skill does and who it serves");
  }

  // 7. Human EEAT & Voice
  const hasFirstPerson = /\b(I built|I designed|I run|I use|I deployed|in my production stack|at SaaS Next|for Curro)\b/i.test(content);
  const hasGeoGrounding = /\b(Junagadh|Gujarat|India)\b/i.test(content) || /\b(Junagadh|Gujarat|India)\b/i.test(raw);
  if (hasFirstPerson && hasGeoGrounding) add("PASS", "EEAT personal experience", "Direct first-person builder framing + geo grounding");
  else if (hasFirstPerson) add("PASS", "EEAT personal experience", "First-person builder framing present");
  else add("WARN", "EEAT personal experience", "Add first-person practitioner framing ('I designed this architecture for...', 'In my Junagadh lab...')");

  // 8. Architecture Section
  const hasArch = /## Architecture|## System Architecture|## Component Breakdown|## Data Flow/i.test(content);
  if (hasArch) add("PASS", "Architecture section", "Architecture / System Design section present");
  else add("FAIL", "Architecture section", "Missing '## Architecture' or component breakdown section");

  // 9. Code Blocks
  const codeBlocks = (content.match(/```[a-z0-9_-]*[\s\S]*?```/gi) || []).length;
  if (codeBlocks >= 1) add("PASS", "Code blocks", `${codeBlocks} fenced code block(s) present`);
  else add("FAIL", "Code blocks", "Missing code block — skill pages MUST include at least 1 production code snippet");

  // 10. Audit Output Section
  const hasAuditBlock = /## Quality Audit|AUDITOR SCORE|STATUS: AUDIT PASS|Audit Verification/i.test(content);
  if (hasAuditBlock) add("PASS", "Audit output block", "Skill quality audit output section present");
  else add("WARN", "Audit output block", "Recommended to display actual audit scores in a '## Quality Audit' block");

  // 11. Internal Links
  const links = [...content.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)].map(m => m[2]);
  const internalLinks = links.filter(h => h.startsWith("/services") || h.startsWith("/journal") || h.startsWith("/library") || h.startsWith("/blueprints") || h.startsWith("/#"));
  if (internalLinks.length >= 3) add("PASS", "Internal cross-linking", `${internalLinks.length} internal links found (links to journal/services/blueprints)`);
  else add("WARN", "Internal cross-linking", `Only ${internalLinks.length} internal link(s) — add 3-5 links to services or best/top journal articles`);

  // 12. FAQ Section
  const hasFAQ = /frequently asked questions/i.test(content);
  if (hasFAQ) {
    const faqCount = (content.split(/frequently asked questions/i)[1] || "").split("\n").filter(l => /^###\s+/.test(l)).length;
    if (faqCount >= 3) add("PASS", "FAQ section", `${faqCount} FAQ items with structured answers`);
    else add("WARN", "FAQ section", `Only ${faqCount} FAQ item(s) — recommend 4 Q&As`);
  } else {
    add("WARN", "FAQ section", "No FAQ section found — add '## Frequently Asked Questions' for rich voice & AI search citations");
  }

  // 13. Images & Alt Text Audit (Strict Frontend & AEO Verification)
  const mdImages = [...content.matchAll(/!\[(.*?)\]\((.*?)\)/g)].map(m => ({ alt: m[1].trim(), src: m[2].trim() }));
  const htmlImages = [...content.matchAll(/<img\b([^>]*?)>/gi)].map(m => {
    const altMatch = m[1].match(/alt=["'](.*?)["']/i);
    const srcMatch = m[1].match(/src=["'](.*?)["']/i);
    return { alt: altMatch ? altMatch[1].trim() : "", src: srcMatch ? srcMatch[1].trim() : "" };
  });
  const allImages = [...mdImages, ...htmlImages];
  if (allImages.length > 0) {
    const genericAltPatterns = /^(image|screenshot|diagram|photo|graphic|pic|picture|img|illustration|unnamed|alt)$/i;
    const badAlts = allImages.filter(img => !img.alt || img.alt.length < 5 || genericAltPatterns.test(img.alt));
    if (badAlts.length > 0) {
      add("FAIL", "Image alt tags (Accessibility & AEO)", `${badAlts.length}/${allImages.length} image(s) have missing, empty, or generic alt text: ${badAlts.map(b => `"${b.alt || "(empty)"}"`).join(", ")}`);
    } else {
      add("PASS", "Image alt tags", `${allImages.length} image(s) verified with rich, contextual alt tags`);
    }
  } else {
    add("PASS", "Image audit", "Clean markup — no unverified image dependencies");
  }

  // 14. Anti-AI Fluff & Cliches
  const fluffHits = AI_FLUFF.filter(w => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(content));
  if (fluffHits.length > 0) {
    add("FAIL", "Anti-AI fluff (Human-written)", `Found ${fluffHits.length} blocklisted AI marker phrase(s): ${fluffHits.join(", ")}`);
  } else {
    add("PASS", "Anti-AI fluff (Human-written)", "Zero synthetic AI cliches detected — genuine human developer voice");
  }

  // 15. Markdown Leaks
  const fences = (content.match(/```/g) || []).length;
  if (fences % 2 !== 0) add("FAIL", "Code fences closed", "Unclosed ``` code fence");
  else if (codeBlocks > 0) add("PASS", "Code fences closed", "All code fences properly paired");

  const bolds = (content.match(/\*\*/g) || []).length;
  if (bolds % 2 !== 0) add("FAIL", "Bold formatting", "Unclosed ** bold marker");
}

// ─── execute audit ───────────────────────────────────────────────────────────
if (args.includes("--all-skills")) {
  const dir = resolve(process.cwd(), "data/library/skills");
  const files = readdirSync(dir).filter(f => f.endsWith(".php"));
  console.log(`Auditing all ${files.length} skill files in data/library/skills...\n`);
  for (const f of files) {
    console.log(`\n📄 Checking ${f}...`);
    auditSkillFile(join(dir, f));
  }
} else if (filePath) {
  auditSkillFile(filePath);
} else {
  // Check newest skill file
  const dir = resolve(process.cwd(), "data/library/skills");
  if (existsSync(dir)) {
    const files = readdirSync(dir).filter(f => f.endsWith(".php"));
    if (files.length > 0) {
      console.log(`Auditing newest skill: ${files[files.length - 1]}...\n`);
      auditSkillFile(join(dir, files[files.length - 1]));
    }
  }
}

// ─── summary report ─────────────────────────────────────────────────────────
const fails = results.filter(r => r.status === "FAIL");
const warns = results.filter(r => r.status === "WARN");
const passes = results.filter(r => r.status === "PASS");

console.log(`\n${"─".repeat(60)}`);
console.log(`  Results: ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL`);
for (const r of results) {
  const icon = r.status === "PASS" ? "✅" : r.status === "FAIL" ? "❌" : "⚠️";
  console.log(`  ${icon} [${r.status}] ${r.check}: ${r.detail}`);
}
console.log("─".repeat(60));

const verdict = fails.length === 0 ? "STATUS: AUDIT PASS" : "STATUS: AUDIT FAIL";
console.log(`\n  Final Verdict: ${verdict}\n`);

if (outPath) {
  const report = [
    `# 🏗️ Open-Source Library Content Audit Report`,
    ``,
    `**Date:** ${new Date().toISOString().slice(0, 10)} · **File:** \`${filePath || "all"}\` · **Verdict:** **${verdict}**`,
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
