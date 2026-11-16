// nov15-data-generator.mjs — Dispatch payload generator for November 15, 2026 (Phase 3: 7 slots)
// 100% compliant with Deepak Bagada EEAT standards, GSC insights, product monetization & tool recirculation.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getDispatches() {
  const jsonPath = resolve(__dirname, "nov15-dispatches.json");
  const raw = readFileSync(jsonPath, "utf8");
  return JSON.parse(raw);
}
