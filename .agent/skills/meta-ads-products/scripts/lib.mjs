import fs from "node:fs";
import path from "node:path";

export function parseArgs(argv = process.argv.slice(2)) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      out[arg.slice(2, eq)] = arg.slice(eq + 1);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      out[key] = next;
      i++;
    } else {
      out[key] = true;
    }
  }
  return out;
}

export function readJson(file) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) fail(`File not found: ${abs}`);
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (err) {
    fail(`Invalid JSON in ${abs}: ${err.message}`);
  }
}

export function writeJson(file, value) {
  const abs = path.resolve(file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
  return abs;
}

export function writeText(file, value) {
  const abs = path.resolve(file);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, value.endsWith("\n") ? value : `${value}\n`);
  return abs;
}

export function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function inr(value, digits = 0) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function num(value, digits = 0) {
  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function pct(value, digits = 2) {
  return `${(Number(value) * 100).toFixed(digits)}%`;
}

export function table(headers, rows) {
  const clean = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const head = `| ${headers.map(clean).join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(clean).join(" | ")} |`).join("\n");
  return [head, sep, body].filter(Boolean).join("\n");
}

export function bullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function ok(message) {
  console.log(`✓ ${message}`);
}

export function warn(message) {
  console.log(`⚠ ${message}`);
}

export function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
