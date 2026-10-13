#!/usr/bin/env node
// generate-oct-08-to-13.mjs — Autonomous Content Generation, Audit & Live DB Population
// For Deepak Bagada (deepakbagada.in/journal) — October 8 to 13, 2026 (22 Dispatches)
// Phase 1 (Oct 8-11: 3/day) + Phase 2 (Oct 12-13: 5/day)

import { writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const BRAND = "═".repeat(68);
console.log(`\n${BRAND}\n  🚀 Generating, Auditing & Scheduling 22 Dispatches (Oct 8 - 13, 2026)\n${BRAND}\n`);

const auditScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/audit-blog.mjs");
const saveScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/save-scheduled-posts.php");
const queueOutPath = resolve(process.cwd(), ".agent/skills/deepak-blog/schedule/queue-2026-10-08-to-13.json");

// Import the post data generator
import { getDispatches } from "./oct-data-generator.mjs";

const dispatches = getDispatches();
console.log(`Loaded ${dispatches.length} dispatch definitions.`);

let passCount = 0;
let failCount = 0;

for (let i = 0; i < dispatches.length; i++) {
  const item = dispatches[i];
  const scheduledFor = `${item.date} ${item.slot_time}`;
  console.log(`\n[${i + 1}/${dispatches.length}] Processing: "${item.title}"`);
  console.log(`      Slug: ${item.slug}`);
  console.log(`      Slot: ${scheduledFor} | ${item.slot_label}`);

  // Write temporary draft file for audit
  const tmpDraft = `/tmp/audit-sched-${item.slug}.md`;
  writeFileSync(tmpDraft, item.content, "utf8");

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

  if (auditRes.status !== 0) {
    console.error(`  ❌ Audit FAIL for ${item.slug}:`);
    console.log(auditRes.stdout);
    failCount++;
    process.exit(1);
  } else {
    console.log(`  ✅ Audit 100% PASS`);
  }

  // Save to DB via save-scheduled-posts.php
  const tmpPayload = `/tmp/payload-${item.slug}.json`;
  writeFileSync(tmpPayload, JSON.stringify({
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: item.content,
    tag: item.tag,
    scheduled_for: scheduledFor,
    slot_label: item.slot_label
  }, null, 2), "utf8");

  const dbRes = spawnSync("php", [saveScript, tmpPayload], { encoding: "utf8" });
  try { unlinkSync(tmpPayload); } catch (e) {}

  if (dbRes.status === 0 && dbRes.stdout.includes("DB_SAVED")) {
    console.log(`  ✓ Inserted into MySQL scheduled_posts table!`);
    passCount++;
  } else {
    console.error(`  ❌ Failed DB insert for ${item.slug}:`, dbRes.stderr || dbRes.stdout);
    failCount++;
    process.exit(1);
  }
}

// Write the queue JSON file
const queueData = {
  schedule_version: "2.0",
  generated_at: new Date().toISOString(),
  target_period: "2026-10-08 to 2026-10-13",
  total_dispatches: dispatches.length,
  phase_breakdown: {
    "2026-10-08 to 2026-10-11": "Phase 1: 3 dispatches/day at 06:30, 09:30, 18:30 IST (12 total)",
    "2026-10-12 to 2026-10-13": "Phase 2: 5 dispatches/day at 06:30, 09:30, 12:30, 15:30, 18:30 IST (10 total)"
  },
  dispatches: dispatches.map(d => ({
    date: d.date,
    slot: d.slot_label,
    slot_time: d.slot_time,
    pillar: d.pillar,
    tag: d.tag,
    keyword: d.keyword,
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt
  }))
};

writeFileSync(queueOutPath, JSON.stringify(queueData, null, 2), "utf8");
console.log(`\n${BRAND}\n  🎉 All 22 Dispatches Successfully Audited, Saved to DB & Written to JSON!\n${BRAND}\n`);
