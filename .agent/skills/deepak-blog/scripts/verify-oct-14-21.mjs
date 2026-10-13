#!/usr/bin/env node
// verify-oct-14-21.mjs — Independent quality verification of all 40 scheduled dispatches.
// 1) Re-runs audit-blog.mjs harness per article (fresh temp draft, temp report).
// 2) Lints every fenced code block (php -l, python py_compile, bash -n, json parse).
// 3) Reports per-item verdict table. Exit 1 on any FAIL.

import { writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

import { getDispatches } from "./oct14-data-generator.mjs";
import { getDispatchesOct1517 } from "./oct15-17-data-generator.mjs";
import { getDispatchesOct1821 } from "./oct18-21-data-generator.mjs";

const items = [...getDispatches(), ...getDispatchesOct1517(), ...getDispatchesOct1821()];
console.log(`Verifying ${items.length} dispatches...\n`);

const auditScript = resolve(process.cwd(), ".agent/skills/deepak-blog/scripts/audit-blog.mjs");
let auditFails = 0, lintFails = 0;

function lintBlocks(slug, content) {
  const errors = [];
  const blocks = [...content.matchAll(/```(\w+)\n([\s\S]*?)```/g)];
  let bi = 0;
  for (const m of blocks) {
    const lang = m[1].toLowerCase(), code = m[2];
    bi++;
    const tmp = `/tmp/verify-${slug}-${bi}.${lang === "python" ? "py" : lang === "php" ? "php" : lang === "bash" ? "sh" : "txt"}`;
    if (lang === "php") {
      writeFileSync(tmp, code, "utf8");
      const r = spawnSync("php", ["-l", tmp], { encoding: "utf8" });
      if (r.status !== 0) errors.push(`php#${bi}: ${(r.stdout + r.stderr).split("\n")[0]}`);
    } else if (lang === "python") {
      writeFileSync(tmp, code, "utf8");
      const r = spawnSync("python3", ["-m", "py_compile", tmp], { encoding: "utf8" });
      if (r.status !== 0) errors.push(`python#${bi}: ${(r.stderr || "").split("\n").slice(-3).join(" ")}`);
    } else if (lang === "bash" || lang === "sh") {
      writeFileSync(tmp, code, "utf8");
      const r = spawnSync("bash", ["-n", tmp], { encoding: "utf8" });
      if (r.status !== 0) errors.push(`bash#${bi}: ${(r.stderr || "").split("\n")[0]}`);
    } else if (lang === "json") {
      try { JSON.parse(code.replace(/\/\/.*$/gm, "")); }
      catch (e) { errors.push(`json#${bi}: ${e.message}`); }
    }
  }
  return { blocks: blocks.length, errors };
}

for (const item of items) {
  const draft = `/tmp/verify-${item.slug}.md`;
  const report = `/tmp/verify-${item.slug}-audit.md`;
  writeFileSync(draft, item.content, "utf8");
  const r = spawnSync("node", [auditScript, "--body", draft, "--title", item.title,
    "--excerpt", item.excerpt, "--tag", item.tag, "--slug", item.slug, "--out", report],
    { encoding: "utf8" });
  const failLines = (r.stdout || "").split("\n").filter(l => l.includes("FAIL"));
  const warns = (r.stdout || "").split("\n").filter(l => l.includes("WARN"));
  const { blocks, errors } = lintBlocks(item.slug, item.content);
  const words = item.content.split(/\s+/).filter(Boolean).length;
  const ok = r.status === 0 && errors.length === 0;
  if (!ok) { auditFails += r.status === 0 ? 0 : 1; lintFails += errors.length ? 1 : 0; }
  console.log(`${ok ? "✅" : "❌"} ${item.date} ${item.slug} | audit:${r.status === 0 ? "PASS" : "FAIL"} ` +
    `warns:${warns.length} | code:${blocks}blocks${errors.length ? " LINT-ERR:" + errors.join(";") : ""} | words:${words} | title:${item.title.length} | excerpt:${item.excerpt.length}`);
  for (const f of failLines) console.log(`     ${f.trim()}`);
}

console.log(`\n── SUMMARY: ${items.length} checked · audit FAILs: ${auditFails} · lint FAILs: ${lintFails} ──`);
process.exit(auditFails + lintFails ? 1 : 0);
