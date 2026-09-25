#!/usr/bin/env node
// schedule-runner.mjs — Autonomous Content Scheduler & Publisher for deepak-blog
// Orchestrates next week's 21 dispatches across the 3 preferred slots:
//  - 06:30 AM IST (Morning Crawl Slot)
//  - 09:30 AM IST (Business Hours Slot)
//  - 06:30 PM IST (Evening Deep Dive Slot)
//
// Usage:
//   node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --status
//   node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --day 2026-09-24 --yes
//   node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --publish-next --yes
//   node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --auto-due --yes
//   node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --dry-run

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { spawnSync } from "node:child_process";

const BRAND = "═".repeat(64);
console.log(`\n${BRAND}\n  📅 deepak-blog — Next-Week Content Scheduler & Runner\n  3 Daily Slots: 06:30 AM · 09:30 AM · 06:30 PM IST (Sep 24–30)\n${BRAND}\n`);

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const has = (name) => args.includes(`--${name}`);

const queueFile = opt("queue", ".agent/skills/deepak-blog/schedule/queue-2026-09-24-to-30.json");
const queuePath = resolve(process.cwd(), queueFile);

if (!existsSync(queuePath)) {
  console.error(`❌ Queue file not found: ${queuePath}`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(queuePath, "utf8"));
const queue = data.queue || [];
const postsPath = resolve(process.cwd(), "data/posts.php");
const memoryPath = resolve(process.cwd(), ".agent/skills/deepak-blog/memory.md");
const postsContent = existsSync(postsPath) ? readFileSync(postsPath, "utf8") : "";
const memoryContent = existsSync(memoryPath) ? readFileSync(memoryPath, "utf8") : "";

// Update status of each item by checking live files
queue.forEach(item => {
  const inPhp = postsContent.includes(`'${item.slug}'`);
  const inMem = memoryContent.includes(`\`${item.slug}\``);
  item.is_live = inPhp || inMem;
  item.status = item.is_live ? "LIVE" : "SCHEDULED";
});

// ─── Status mode ─────────────────────────────────────────────────────────────
if (has("status") || args.length === 0) {
  console.log(`📋 Total Scheduled Dispatches: ${queue.length} across 7 days (Sep 24 to Sep 30, 2026)\n`);
  console.log(`| # | Date | Slot (IST) | Pillar | Title | Status |`);
  console.log(`|---|---|---|---|---|---|`);
  queue.forEach(item => {
    const statusIcon = item.is_live ? "🟢 LIVE" : "⏳ SCHEDULED";
    console.log(`| ${String(item.rank).padStart(2, " ")} | ${item.date} | ${item.slot} | ${item.pillarId} | ${item.title.slice(0, 48)}... | ${statusIcon} |`);
  });
  const liveCount = queue.filter(q => q.is_live).length;
  console.log(`\n  Summary: ${liveCount} published, ${queue.length - liveCount} pending.`);
  console.log(`\n  Commands:`);
  console.log(`   • Publish today's due dispatches: node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --auto-due --yes`);
  console.log(`   • Publish specific date:          node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --day 2026-09-24 --yes`);
  console.log(`   • Publish next pending:           node .agent/skills/deepak-blog/scripts/schedule-runner.mjs --publish-next --yes`);
  process.exit(0);
}

const targetDay = opt("day", "");
const publishNext = has("publish-next");
const autoDue = has("auto-due");
const dryRun = has("dry-run");
const yes = has("yes");

// Filter target items
let targets = [];
if (targetDay) {
  targets = queue.filter(q => q.date === targetDay && !q.is_live);
} else if (publishNext) {
  const next = queue.find(q => !q.is_live);
  if (next) targets = [next];
} else if (autoDue) {
  const now = new Date();
  const currentDate = now.toISOString().slice(0, 10);
  const currentTime = now.toTimeString().slice(0, 8);
  targets = queue.filter(q => !q.is_live && (q.date < currentDate || (q.date === currentDate && q.slot_time <= currentTime)));
}

if (targets.length === 0) {
  console.log(`✨ No pending dispatches due for execution.`);
  process.exit(0);
}

console.log(`🎯 Identified ${targets.length} dispatch(es) for execution:`);
targets.forEach(t => console.log(`   • [${t.date} ${t.slot}] ${t.title} (${t.slug})`));

if (!yes && !dryRun) {
  console.log(`\n⚠️  Execution requires --yes flag to confirm push to Live Hostinger DB.`);
  process.exit(0);
}

// Execute publish using publish-queue runner or publish-single-post
const publishQueueScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/publish-queue.mjs");
const tmpQueueFile = `/tmp/temp-queue-${Date.now()}.json`;

writeFileSync(tmpQueueFile, JSON.stringify({ queue: targets }, null, 2), "utf8");

const runArgs = [publishQueueScript, `--json=${tmpQueueFile}`];
if (dryRun) runArgs.push("--dry-run");
if (yes) runArgs.push("--yes");

console.log(`\n🚀 Launching sequential execution...\n`);
const result = spawnSync("node", runArgs, { stdio: "inherit" });

try { spawnSync("rm", ["-f", tmpQueueFile]); } catch (e) {}

process.exit(result.status || 0);
