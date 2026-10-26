import { accountSummary, config, conversionActionCount, inr, missingCreds, ok, parseArgs, search } from "./lib.mjs";

const args = parseArgs();
const cfg = config();
const missing = missingCreds(cfg);

console.log("\nGoogle Ads preflight");
console.log(`  API version: ${cfg.apiVersion}`);
console.log(`  Customer ID: ${cfg.customerId || "(missing)"}`);
console.log(`  Login customer ID: ${cfg.loginCustomerId || "(none)"}`);
console.log(`  Budget guardrail: ${inr(cfg.maxBudget)}`);

if (missing.length) {
  console.log(`\n✗ Missing: ${missing.join(", ")}`);
  console.log("  Run scripts/oauth-setup.mjs and add the values to .env.");
  console.log("  See references/api-setup.md.\n");
  process.exit(1);
}

function hint(message) {
  if (message.includes("only approved for use with test accounts") || message.includes("CLOUD_PROJECT_NOT_APPROVED_FOR_PRODUCTION")) {
    return "Your developer token is a TEST token. It only works with Google Ads test accounts.\n  Apply for Basic access (Google Ads → Tools → API Center → Basic access) to use account " + cfg.customerId + ", or point GOOGLE_ADS_CUSTOMER_ID at a test account.";
  }
  if (message.includes("DEVELOPER_TOKEN_NOT_APPROVED")) {
    return "The developer token is not approved for production. Apply for Basic/Standard access in API Center.";
  }
  if (message.includes("DEVELOPER_TOKEN_INVALID")) {
    return "The developer token is invalid. Re-copy it from Google Ads → Tools → API Center.";
  }
  if (message.includes("USER_PERMISSION_DENIED") || message.includes("does not have permission")) {
    return "The signed-in Google account cannot access customer " + cfg.customerId + ". Grant access in Google Ads → Admin → Access and security, and add the account as an OAuth test user.";
  }
  if (message.includes("CUSTOMER_NOT_FOUND")) {
    return "Customer " + cfg.customerId + " was not found. Check the ID, and set GOOGLE_ADS_LOGIN_CUSTOMER_ID if you access it through a manager account.";
  }
  return "See references/api-setup.md → Troubleshooting.";
}

let account;
try {
  account = await accountSummary(cfg);
} catch (error) {
  console.log(`\n✗ ${error.message.split("\n")[0]}`);
  console.log(`  → ${hint(String(error.message))}\n`);
  process.exit(1);
}
if (!account) {
  console.log("\n✗ Could not read the account. Check access and customer ID.\n");
  process.exit(1);
}

const campaigns = await search(
  "SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros FROM campaign WHERE campaign.status != 'REMOVED' ORDER BY campaign.id DESC LIMIT 20",
  { cfg, quiet: true }
);
const conversions = await search(
  "SELECT conversion_action.id, conversion_action.name, conversion_action.status FROM conversion_action WHERE conversion_action.status = 'ENABLED'",
  { cfg, quiet: true }
);

console.log(`\n✓ Account: ${account.descriptive_name} (${account.id})`);
console.log(`  Currency: ${account.currency_code} · Time zone: ${account.time_zone} · Manager: ${account.manager}`);
if (account.currency_code !== cfg.currency && account.currency_code !== "INR") {
  console.log(`  ⚠ Account currency is ${account.currency_code}; plans must use the same currency.`);
}
console.log(`  Test account: ${account.test_account}`);

console.log(`\nEnabled conversion actions: ${conversions.length}`);
for (const row of conversions.slice(0, 10)) {
  console.log(`  · ${row.conversionAction?.name || row.conversion_action?.name} (${row.conversionAction?.id || row.conversion_action?.id})`);
}
if (!conversions.length) console.log("  ✗ None. Create a Purchase conversion action before launching.");

console.log(`\nRecent campaigns: ${campaigns.length}`);
for (const row of campaigns.slice(0, 10)) {
  const campaign = row.campaign || {};
  const budget = Number(row.campaignBudget?.amountMicros || row.campaign_budget?.amount_micros || 0) / 1_000_000;
  console.log(`  · ${campaign.status} · ${campaign.name} · ${inr(budget)}/day · id ${campaign.id}`);
}

console.log(args.plan ? "\nReady to create with scripts/create-campaign.mjs.\n" : "\nPreflight complete.\n");
ok("Account reachable");
