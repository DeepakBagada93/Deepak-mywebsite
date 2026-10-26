import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const SKILL_DIR = path.resolve(SCRIPT_DIR, "..");
export const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../../..");

export function loadEnv() {
  const candidates = [path.join(REPO_ROOT, ".env"), path.join(SKILL_DIR, ".env")];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
  }
}

export function config() {
  loadEnv();
  const customerId = String(process.env.GOOGLE_ADS_CUSTOMER_ID || "").replace(/[^0-9]/g, "");
  const loginCustomerId = String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "").replace(/[^0-9]/g, "");
  return {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
    clientId: process.env.GOOGLE_ADS_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN || "",
    customerId,
    loginCustomerId,
    apiVersion: process.env.GOOGLE_ADS_API_VERSION || "v26",
    currency: (process.env.GOOGLE_ADS_CURRENCY || "INR").toUpperCase(),
    maxBudget: Number(process.env.GOOGLE_ADS_MAX_BUDGET || 3000),
  };
}

export function missingCreds(cfg = config()) {
  const required = {
    GOOGLE_ADS_DEVELOPER_TOKEN: cfg.developerToken,
    GOOGLE_ADS_CLIENT_ID: cfg.clientId,
    GOOGLE_ADS_CLIENT_SECRET: cfg.clientSecret,
    GOOGLE_ADS_REFRESH_TOKEN: cfg.refreshToken,
    GOOGLE_ADS_CUSTOMER_ID: cfg.customerId,
  };
  return Object.entries(required).filter(([, value]) => !value).map(([key]) => key);
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const body = token.slice(2);
    if (body.includes("=")) {
      const index = body.indexOf("=");
      args[body.slice(0, index)] = body.slice(index + 1);
    } else if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
      args[body] = argv[i + 1];
      i += 1;
    } else {
      args[body] = true;
    }
  }
  return args;
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function fail(message, code = 1) {
  console.error(`\n✗ ${message}\n`);
  process.exit(code);
}

export function ok(message) {
  console.log(`✓ ${message}`);
}

export function micros(amount) {
  return Math.round(Number(amount) * 1_000_000);
}

export function fromMicros(value) {
  return Number(value || 0) / 1_000_000;
}

export function inr(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

let cachedToken = null;

export async function accessToken(cfg = config()) {
  const missing = missingCreds(cfg);
  if (missing.length) {
    fail(
      `Missing Google Ads credentials: ${missing.join(", ")}.\n` +
        `Add them to .env (see .agent/skills/google-ads-products/references/api-setup.md) ` +
        `or run: node .agent/skills/google-ads-products/scripts/oauth-setup.mjs`
    );
  }
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    refresh_token: cfg.refreshToken,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) fail(`OAuth refresh failed: ${payload.error_description || payload.error || response.status}`);
  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Number(payload.expires_in || 3600) * 1000,
  };
  return cachedToken.value;
}

export async function adsFetch(route, { method = "POST", body, cfg = config(), quiet = false } = {}) {
  loadEnv();
  const token = await accessToken(cfg);
  const url = `https://googleads.googleapis.com/${cfg.apiVersion}/customers/${cfg.customerId}${route}`;
  const headers = {
    authorization: `Bearer ${token}`,
    "developer-token": cfg.developerToken,
    "content-type": "application/json",
  };
  if (cfg.loginCustomerId) headers["login-customer-id"] = cfg.loginCustomerId;
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    const containers = Array.isArray(payload) ? payload : [payload];
    const details = containers.flatMap((item) => item?.error?.details || []);
    const messages = details
      .flatMap((detail) => detail.errors || [])
      .map((item) => item.message || Object.keys(item.errorCode || {}).join(""))
      .filter(Boolean);
    const reason = messages.length
      ? messages.join(" | ")
      : containers.map((item) => item?.error?.message).filter(Boolean).join(" | ") || text;
    const error = new Error(`Google Ads API ${response.status}: ${reason}`);
    error.payload = payload;
    throw error;
  }
  if (!quiet) {
    const count = Array.isArray(payload) ? payload.length : payload?.results?.length ?? 0;
    if (count) console.log(`  · ${route.replace(/^\//, "")} → ${count} result(s)`);
  }
  return payload;
}

export async function search(query, { cfg = config(), quiet = false } = {}) {
  const chunks = await adsFetch("/googleAds:searchStream", { body: { query }, cfg, quiet });
  const rows = [];
  for (const chunk of Array.isArray(chunks) ? chunks : [chunks]) {
    for (const result of chunk.results || []) rows.push(result);
  }
  return rows;
}

export async function mutate(resource, operations, { cfg = config(), validateOnly = false, quiet = false } = {}) {
  const route = `/${resource}:mutate`;
  return adsFetch(route, { body: { operations, validateOnly }, cfg, quiet });
}

export function campaignResource(cfg, id) {
  return `customers/${cfg.customerId}/campaigns/${id}`;
}

export function assertBudget(plan, cfg = config(), { allowOverBudget = false } = {}) {
  const total = Number(plan?.budget?.total || 0);
  const daily = Number(plan?.budget?.daily || 0);
  const days = Number(plan?.budget?.days || 0);
  if (!allowOverBudget && total > cfg.maxBudget) {
    fail(`Plan total ${inr(total)} exceeds GOOGLE_ADS_MAX_BUDGET ${inr(cfg.maxBudget)}. Set GOOGLE_ADS_MAX_BUDGET deliberately or pass --allow-over-budget.`);
  }
  if (daily * days > total + days) {
    fail(`Daily ${inr(daily)} × ${days} days overshoots total ${inr(total)} by more than one day of budget.`);
  }
  return { total, daily, days };
}

export async function accountSummary(cfg = config()) {
  const rows = await search(
    "SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone, customer.manager, customer.test_account FROM customer LIMIT 1",
    { cfg, quiet: true }
  );
  return rows[0]?.customer || null;
}

export async function conversionActionCount(cfg = config()) {
  const rows = await search(
    "SELECT conversion_action.id, conversion_action.name, conversion_action.status, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'",
    { cfg, quiet: true }
  );
  return rows.length;
}
