#!/usr/bin/env node
// generate-nov-05.mjs — Autonomous Content Generation, Audit & Live DB Scheduling
// For Deepak Bagada (deepakbagada.in/journal) — November 5, 2026 (5 Dispatches, Phase 2)
// Data-backed by live Google Search Console queries, product monetization, and tool recirculation.
// Phase 2 slots: 06:30, 09:30, 12:30, 15:30, 18:30 IST

import { writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const BRAND = "═".repeat(68);
console.log(`\n${BRAND}\n  🚀 Generating, Auditing & Scheduling 5 Dispatches (Nov 05, 2026 · Phase 2)\n  Targeting Live GSC Queries, Products & Utility Tools\n${BRAND}\n`);

const auditScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/audit-blog.mjs");
const saveScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/save-scheduled-posts.php");
const queueOutPath = resolve(process.cwd(), ".agent/skills/deepak-blog/schedule/queue-2026-11-05.json");

import { getDispatches } from "./nov05-data-generator.mjs";

const dispatches = getDispatches();
console.log(`Loaded ${dispatches.length} dispatch definitions for November 5, 2026.`);

let passCount = 0;

for (let i = 0; i < dispatches.length; i++) {
  const item = dispatches[i];
  const scheduledFor = `${item.date} ${item.slot_time}`;
  console.log(`\n[${i + 1}/${dispatches.length}] Processing: "${item.title}"`);
  console.log(`      Slug: ${item.slug}`);
  console.log(`      Slot: ${scheduledFor} | ${item.slot_label}`);

  const tmpDraft = `/tmp/audit-nov05-${item.slug}.md`;
  writeFileSync(tmpDraft, item.content, "utf8");

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
    process.exit(1);
  } else {
    console.log(`  ✅ Audit 100% PASS`);
  }

  const tmpPayload = `/tmp/payload-nov05-${item.slug}.json`;
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
    console.log(`  ✓ Scheduled in MySQL scheduled_posts table!`);
    passCount++;
  } else {
    console.error(`  ❌ Failed DB insert for ${item.slug}:`, dbRes.stderr || dbRes.stdout);
    process.exit(1);
  }
}

const queueData = {
  schedule_version: "2.0",
  generated_at: new Date().toISOString(),
  target_period: "2026-11-05",
  total_dispatches: dispatches.length,
  phase_breakdown: {
    "2026-11-05": "Phase 2: 5 dispatches at 06:30, 09:30, 12:30, 15:30, 18:30 IST"
  },
  gsc_basis: "Data-backed by live Search Console queries, product monetization bridges, and utility tools recirculation",
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
console.log(`\n${BRAND}\n  🎉 All ${passCount} Nov-05 Dispatches Audited, Scheduled & Queued in Live MySQL!\n${BRAND}\n`);
