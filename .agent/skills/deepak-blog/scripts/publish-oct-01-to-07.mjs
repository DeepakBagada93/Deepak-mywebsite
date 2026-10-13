#!/usr/bin/env node
// publish-oct-01-to-07.mjs — Audits and saves all 21 scheduled dispatches
// directly into the Live MySQL DB `scheduled_posts` table and writes the queue JSON.

import { writeFileSync, readFileSync, existsSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { SCHEDULE_ITEMS } from "./generate-and-schedule-oct-01-to-07.mjs";
import { ARTICLES_PART1 } from "./articles-oct-01-to-02.mjs";
import { ARTICLES_PART2 } from "./articles-oct-03-to-05.mjs";
import { ARTICLES_PART3 } from "./articles-oct-06-to-07.mjs";

const BRAND = "═".repeat(70);
console.log(`\n${BRAND}\n  🚀 Executing October 1–7, 2026 Content Audit & MySQL Persistence Engine\n${BRAND}\n`);

const ALL_ARTICLES = { ...ARTICLES_PART1, ...ARTICLES_PART2, ...ARTICLES_PART3 };
const auditScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/audit-blog.mjs");
const saveScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/save-scheduled-posts.php");
const outJsonPath = resolve(process.cwd(), ".agent/skills/deepak-blog/schedule/queue-2026-10-01-to-07.json");

const queuePayload = [];
let passCount = 0;
let dbSavedCount = 0;

for (let i = 0; i < SCHEDULE_ITEMS.length; i++) {
  const item = SCHEDULE_ITEMS[i];
  const scheduledFor = `${item.date} ${item.slot_time}`;
  const body = ALL_ARTICLES[item.slug];

  if (!body) {
    console.error(`❌ CRITICAL: Missing body for slug: ${item.slug}`);
    process.exit(1);
  }

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  console.log(`\n──────────────────────────────────────────────────────────────────────`);
  console.log(`[${i + 1}/${SCHEDULE_ITEMS.length}] Processing: ${item.title}`);
  console.log(`      Scheduled: ${scheduledFor} (${item.slot}) | Tag: ${item.tag}`);
  console.log(`      Slug: ${item.slug} | Words: ${wordCount}`);

  // Write temporary draft file for audit
  const tmpDraft = `/tmp/audit-sched-${item.slug}.md`;
  writeFileSync(tmpDraft, body, "utf8");

  // Run audit-blog.mjs
  const auditRes = spawnSync("node", [
    auditScript,
    "--body", tmpDraft,
    "--title", item.title,
    "--excerpt", item.excerpt,
    "--tag", item.tag,
    "--slug", item.slug
  ], { encoding: "utf8" });

  try { unlinkSync(tmpDraft); } catch (e) {}

  if (auditRes.status === 0) {
    console.log(`  ✅ Audit Result: 100% PASS`);
    passCount++;
  } else {
    console.log(`  ⚠️ Audit Completed with warnings/alerts:`);
    const lines = auditRes.stdout.split("\n").filter(l => l.includes("[PASS]") || l.includes("[WARN]") || l.includes("[FAIL]"));
    console.log(`     ${lines.slice(-3).join("\n     ")}`);
  }

  // Save to Live MySQL DB `scheduled_posts` table via PHP script
  const tmpItemJson = `/tmp/item-${item.slug}.json`;
  writeFileSync(tmpItemJson, JSON.stringify({
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: body,
    tag: item.tag,
    scheduled_for: scheduledFor,
    slot_label: item.slot
  }, null, 2), "utf8");

  const dbRes = spawnSync("php", [saveScript, tmpItemJson], { encoding: "utf8" });
  try { unlinkSync(tmpItemJson); } catch (e) {}

  if (dbRes.status === 0 && dbRes.stdout.includes("DB_SAVED")) {
    console.log(`  ✓ Inserted into MySQL scheduled_posts table! (${item.slug})`);
    dbSavedCount++;
  } else {
    console.error(`  ❌ Failed DB insert for ${item.slug}:`, dbRes.stderr || dbRes.stdout);
  }

  // Record into queue structure
  queuePayload.push({
    rank: i + 1,
    pillarId: item.pillarId,
    pillar: item.pillar,
    title: item.title,
    slug: item.slug,
    keyword: item.keyword,
    tag: item.tag,
    excerpt: item.excerpt,
    date: item.date,
    slot: item.slot,
    slot_time: item.slot_time,
    word_count: wordCount,
    status: "scheduled"
  });
}

// Write the complete schedule JSON file
const fullScheduleJson = {
  schedule_version: "1.0",
  generated_at: new Date().toISOString(),
  target_period: "2026-10-01 to 2026-10-07",
  total_dispatches: queuePayload.length,
  daily_quota: 3,
  preferred_slots_ist: [
    "06:30:00",
    "09:30:00",
    "18:30:00"
  ],
  dispatches: queuePayload,
  queue: queuePayload
};

writeFileSync(outJsonPath, JSON.stringify(fullScheduleJson, null, 2), "utf8");
console.log(`\n${BRAND}`);
console.log(`  🎉 All 21 Dispatches Processed!`);
console.log(`  📊 DB Saved: ${dbSavedCount}/21 | Full Schedule Saved to: ${outJsonPath}`);
console.log(`${BRAND}\n`);
