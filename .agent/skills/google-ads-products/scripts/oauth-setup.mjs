import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { exec } from "node:child_process";
import { REPO_ROOT, config, loadEnv, parseArgs, fail, ok } from "./lib.mjs";

const args = parseArgs();
loadEnv();
const cfg = config();
const port = Number(args.port || 8085);
const redirectUri = `http://localhost:${port}/oauth2callback`;
const clientId = args["client-id"] || cfg.clientId;
const clientSecret = args["client-secret"] || cfg.clientSecret;

if (!clientId || !clientSecret) {
  fail(
    "Missing OAuth client. Create a Desktop OAuth client in Google Cloud Console, then run:\n" +
      "node .agent/skills/google-ads-products/scripts/oauth-setup.mjs --client-id=... --client-secret=...\n" +
      "Or set GOOGLE_ADS_CLIENT_ID and GOOGLE_ADS_CLIENT_SECRET in .env"
  );
}

function upsertEnv(values) {
  const file = path.join(REPO_ROOT, ".env");
  const lines = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/) : [];
  for (const [key, value] of Object.entries(values)) {
    if (!value) continue;
    const index = lines.findIndex((line) => line.startsWith(`${key}=`));
    if (index >= 0) lines[index] = `${key}=${value}`;
    else lines.push(`${key}=${value}`);
  }
  fs.writeFileSync(file, `${lines.filter((line, index) => line || index < lines.length - 1).join("\n").replace(/\n+$/, "")}\n`);
  try {
    fs.chmodSync(file, 0o600);
  } catch {}
}

const state = crypto.randomBytes(16).toString("hex");
const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/adwords",
    access_type: "offline",
    prompt: "consent",
    state,
  }).toString();

console.log("\nGoogle Ads OAuth setup");
console.log("1. Sign in with the Google account that can access the Ads account.");
console.log("2. Approve the adwords scope.\n");
console.log(authUrl);
console.log(`\nWaiting for the callback on ${redirectUri} ...\n`);

if (args.open) exec(`open "${authUrl}"`);

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, redirectUri);
  if (url.pathname !== "/oauth2callback") {
    response.writeHead(404).end("Not found");
    return;
  }
  const error = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  if (error || !code || returnedState !== state) {
    response.writeHead(400, { "content-type": "text/plain" }).end(`OAuth failed: ${error || "missing code or state"}`);
    server.close();
    fail(`OAuth failed: ${error || "invalid callback"}`);
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
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
    const payload = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(payload.error_description || payload.error || "token exchange failed");
    response.writeHead(200, { "content-type": "text/html" }).end(
      "<html><body style='font-family:system-ui;padding:40px'><h2>Google Ads connected.</h2><p>Refresh token printed in your terminal. You can close this tab.</p></body></html>"
    );
    if (args.save) {
      upsertEnv({
        GOOGLE_ADS_CLIENT_ID: clientId,
        GOOGLE_ADS_CLIENT_SECRET: clientSecret,
        GOOGLE_ADS_REFRESH_TOKEN: payload.refresh_token,
      });
      if (!payload.refresh_token) console.log("⚠ No refresh token returned. Revoke access at https://myaccount.google.com/permissions and re-run with --save.");
      console.log("\nSaved credentials to .env (client id, client secret, refresh token; file chmod 600).");
      console.log("Secrets were not printed. Add the developer token and customer ID separately.");
      ok("OAuth complete — .env updated");
    } else {
      console.log("\nAdd these to .env:\n");
      console.log(`GOOGLE_ADS_CLIENT_ID=${clientId}`);
      console.log(`GOOGLE_ADS_CLIENT_SECRET=${clientSecret}`);
      console.log(`GOOGLE_ADS_REFRESH_TOKEN=${payload.refresh_token || "(no refresh token returned; re-run with prompt=consent)"}`);
      console.log("GOOGLE_ADS_CUSTOMER_ID=1234567890");
      console.log("GOOGLE_ADS_LOGIN_CUSTOMER_ID=1234567890");
      console.log("GOOGLE_ADS_API_VERSION=v26");
      console.log("GOOGLE_ADS_MAX_BUDGET=3000");
      ok("OAuth complete");
    }
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain" }).end(String(error));
    fail(String(error));
  } finally {
    setTimeout(() => server.close(), 250);
  }
});

server.listen(port, "127.0.0.1");
