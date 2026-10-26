import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, config, fail, loadEnv, ok, parseArgs } from "./lib.mjs";

const args = parseArgs();
loadEnv();
const cfg = config();

function upsertEnv(values) {
  const file = path.join(REPO_ROOT, ".env");
  const lines = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/) : [];
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue;
    const index = lines.findIndex((line) => line.startsWith(`${key}=`));
    if (index >= 0) lines[index] = `${key}=${value}`;
    else lines.push(`${key}=${value}`);
  }
  fs.writeFileSync(file, `${lines.join("\n").replace(/\n+$/, "")}\n`);
  try {
    fs.chmodSync(file, 0o600);
  } catch {}
}

let code = args.code;
let redirectUri = args["redirect-uri"] || args.redirect_uri;
if (args.url) {
  const parsed = new URL(args.url);
  code = code || parsed.searchParams.get("code");
  redirectUri = redirectUri || `${parsed.origin}${parsed.pathname === "/" ? "/" : parsed.pathname}`;
  const error = parsed.searchParams.get("error");
  if (error) fail(`Google returned an error: ${error}`);
}
if (!code) fail("Pass --url=\"<full redirect url with ?code=...>\" or --code=... --redirect-uri=...");
if (!redirectUri) fail("Pass --redirect-uri=https://deepakbagada.in/ (must match the client's registered redirect URI exactly).");

const clientId = args["client-id"] || cfg.clientId;
const clientSecret = args["client-secret"] || cfg.clientSecret;
if (!clientId || !clientSecret) fail("Missing GOOGLE_ADS_CLIENT_ID / GOOGLE_ADS_CLIENT_SECRET.");

console.log(`\nExchanging code (redirect_uri=${redirectUri}) ...`);

const response = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  }),
});
const payload = await response.json();
if (!response.ok) fail(`Token exchange failed: ${payload.error_description || payload.error || response.status}`);

if (!payload.refresh_token) {
  fail(
    "Google returned no refresh token (a previous consent may have already granted one). " +
      "Revoke access at https://myaccount.google.com/permissions and retry the auth URL, or reuse an existing refresh token."
  );
}

upsertEnv({
  GOOGLE_ADS_CLIENT_ID: clientId,
  GOOGLE_ADS_CLIENT_SECRET: clientSecret,
  GOOGLE_ADS_REFRESH_TOKEN: payload.refresh_token,
});

console.log("Saved GOOGLE_ADS_REFRESH_TOKEN to .env (not printed).");
ok("OAuth complete");
console.log("\nNext: node .agent/skills/google-ads-products/scripts/account-check.mjs\n");
