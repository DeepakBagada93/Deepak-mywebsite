#!/usr/bin/env node
// generate-oct-15-21.mjs — Audit & schedule Oct 15–21, 2026 (35 dispatches, Phase 2)
// 5/day at 06:30 / 09:30 / 12:30 / 15:30 / 18:30 IST. v10.1 GSC protocol.

import { writeFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const BRAND = "═".repeat(68);
console.log(`\n${BRAND}\n  🚀 Auditing & Scheduling 35 Dispatches (Oct 15–21, 2026 · Phase 2)\n${BRAND}\n`);

const auditScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/audit-blog.mjs");
const saveScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/save-scheduled-posts.php");

import { getDispatchesOct1517 } from "./oct15-17-data-generator.mjs";
import { getDispatchesOct1821 } from "./oct18-21-data-generator.mjs";

const groups = [
  { name: "Oct 15–17", items: getDispatchesOct1517(), queue: "queue-2026-10-15-to-17.json", period: "2026-10-15 to 2026-10-17" },
  { name: "Oct 18–21", items: getDispatchesOct1821(), queue: "queue-2026-10-18-to-21.json", period: "2026-10-18 to 2026-10-21" },
];

let total = 0;
for (const g of groups) {
  console.log(`\n── ${g.name} (${g.items.length} dispatches) ──`);
  for (let i = 0; i < g.items.length; i++) {
    const item = g.items[i];
    console.log(`\n[${i + 1}/${g.items.length}] "${item.title}" (${item.date} ${item.slot_time})`);

    const tmpDraft = `/tmp/audit-oct1521-${item.slug}.md`;
    writeFileSync(tmpDraft, item.content, "utf8");
    const auditRes = spawnSync("node", [auditScript, "--body", tmpDraft,
      "--title", item.title, "--excerpt", item.excerpt, "--tag", item.tag, "--slug", item.slug],
      { encoding: "utf8" });
    try { unlinkSync(tmpDraft); } catch (e) {}
    if (auditRes.status !== 0) {
      console.error(`  ❌ Audit FAIL for ${item.slug}:`);
      console.log(auditRes.stdout);
      process.exit(1);
    }
    console.log(`  ✅ Audit PASS`);

    const tmpPayload = `/tmp/payload-oct1521-${item.slug}.json`;
    writeFileSync(tmpPayload, JSON.stringify({
      title: item.title, slug: item.slug, excerpt: item.excerpt,
      content: item.content, tag: item.tag,
      scheduled_for: `${item.date} ${item.slot_time}`, slot_label: item.slot_label
    }, null, 2), "utf8");
    const dbRes = spawnSync("php", [saveScript, tmpPayload], { encoding: "utf8" });
    try { unlinkSync(tmpPayload); } catch (e) {}
    if (!(dbRes.status === 0 && dbRes.stdout.includes("DB_SAVED"))) {
      console.error(`  ❌ DB insert failed for ${item.slug}:`, dbRes.stderr || dbRes.stdout);
      process.exit(1);
    }
    console.log(`  ✓ Scheduled`);
    total++;
  }

  const queueData = {
    schedule_version: "2.0",
    generated_at: new Date().toISOString(),
    target_period: g.period,
    total_dispatches: g.items.length,
    phase_breakdown: { [g.period]: "Phase 2: 5 dispatches/day at 06:30, 09:30, 12:30, 15:30, 18:30 IST" },
    gsc_indexing_protocol: "v10.1 — sitemap lastmod=publish date, URL Inspection + Request Indexing ≤5/day, monitor Discovered/Crawled-not-indexed",
    dispatches: g.items.map(d => ({ date: d.date, slot: d.slot_label, slot_time: d.slot_time, pillar: d.pillar, tag: d.tag, keyword: d.keyword, title: d.title, slug: d.slug, excerpt: d.excerpt }))
  };
  writeFileSync(resolve(process.cwd(), ".agent/skills/deepak-blog/schedule", g.queue), JSON.stringify(queueData, null, 2), "utf8");
  console.log(`\n  📋 Queue written: ${g.queue}`);
}

console.log(`\n${BRAND}\n  🎉 All ${total} Dispatches Audited, Scheduled & Queued!\n${BRAND}\n`);
