import path from "node:path";
import {
  SKILL_DIR,
  accountSummary,
  assertBudget,
  campaignResource,
  config,
  conversionActionCount,
  fail,
  inr,
  micros,
  missingCreds,
  mutate,
  ok,
  parseArgs,
  readJson,
  search,
  slug,
  writeJson,
} from "./lib.mjs";

const args = parseArgs();
const cfg = config();
if (!args.plan) fail("Pass --plan=runs/campaign-plan-....json");
const planPath = path.resolve(args.plan);
const plan = readJson(planPath);
const execute = Boolean(args.execute);
const confirm = String(args.confirm || "");
const allowOverBudget = Boolean(args["allow-over-budget"]);
const allowNoConversion = Boolean(args["allow-no-conversion"]);

assertBudget(plan, cfg, { allowOverBudget });
if (execute && confirm !== "YES") fail("Execution requires --confirm=YES. Nothing was created.");
if (!execute) {
  console.log("\nDRY RUN — no API writes. Add --execute --confirm=YES to create the PAUSED campaign.");
}
if (execute) {
  const missing = missingCreds(cfg);
  if (missing.length) fail(`Missing credentials: ${missing.join(", ")}. See references/api-setup.md.`);
}

const campaignName = String(plan.campaign?.name || "").slice(0, 255);
const status = plan.campaign?.status || "PAUSED";
if (status !== "PAUSED") fail("Refusing to create an enabled campaign. Set campaign.status to PAUSED.");
const locationOps = (plan.targeting?.locations?.length ? [plan.targeting.geo] : [plan.targeting?.geo || "geoTargetConstants/2356"]).map(
  (geo) => ({ create: { campaign: "{{CAMPAIGN}}", location: { geoTargetConstant: geo } } })
);
const languageOps = [
  {
    create: {
      campaign: "{{CAMPAIGN}}",
      language: { languageConstant: plan.targeting?.language || "languageConstants/1000" },
    },
  },
];
const negativeOps = (plan.negative_keywords || []).map((keyword) => ({
  create: {
    campaign: "{{CAMPAIGN}}",
    negative: true,
    keyword: { text: keyword, matchType: "BROAD" },
  },
}));

const payload = {
  campaign_budget: {
    create: {
      name: `${campaignName} Budget`,
      amountMicros: String(micros(plan.budget.daily)),
      deliveryMethod: "STANDARD",
      explicitlyShared: false,
    },
  },
  campaign: {
    create: {
      name: campaignName,
      status: "PAUSED",
      advertisingChannelType: "SEARCH",
      campaignBudget: "{{BUDGET}}",
      manualCpc: { enhancedCpcEnabled: false },
      networkSettings: {
        targetGoogleSearch: true,
        targetSearchNetwork: false,
        targetContentNetwork: false,
        targetPartnerSearchNetwork: false,
      },
      geoTargetTypeSetting: { positiveGeoTargetType: "PRESENCE" },
      containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
      startDate: plan.budget.start_date,
      endDate: plan.budget.end_date,
    },
  },
  criteria: [...locationOps, ...languageOps, ...negativeOps],
  ad_groups: (plan.ad_groups || []).map((group) => ({
    create: {
      name: group.name,
      campaign: "{{CAMPAIGN}}",
      status: "ENABLED",
      type: "SEARCH_STANDARD",
      cpcBidMicros: String(micros(group.max_cpc)),
    },
  })),
  keywords: (plan.ad_groups || []).map((group) => ({
    ad_group: group.name,
    operations: (group.keywords || []).map((keyword) => ({
      create: {
        adGroup: "{{AD_GROUP}}",
        status: "ENABLED",
        keyword: { text: keyword.text, matchType: keyword.match_type },
      },
    })),
  })),
  ads: (plan.ad_groups || []).map((group) => ({
    ad_group: group.name,
    create: {
      adGroup: "{{AD_GROUP}}",
      status: "ENABLED",
      ad: {
        finalUrls: [group.landing_page || plan.offer?.landing_page],
        responsiveSearchAd: {
          headlines: (group.responsive_search_ad?.headlines || []).map((headline) => ({ text: headline })),
          descriptions: (group.responsive_search_ad?.descriptions || []).map((description) => ({ text: description })),
          ...(group.responsive_search_ad?.path1 ? { path1: group.responsive_search_ad.path1 } : {}),
          ...(group.responsive_search_ad?.path2 ? { path2: group.responsive_search_ad.path2 } : {}),
        },
      },
    },
  })),
};

const runSlug = slug(`${campaignName}-${Date.now()}`);
const payloadPath = path.join(SKILL_DIR, "runs", `${runSlug}-payload.json`);
const statePath = path.join(SKILL_DIR, "runs", `${runSlug}-state.json`);
writeJson(payloadPath, payload);

console.log(`\nCampaign: ${campaignName}`);
console.log(`Budget: ${inr(plan.budget.daily)}/day · ${inr(plan.budget.total)} over ${plan.budget.days} days (PAUSED until you enable it)`);
console.log(`Ad groups: ${plan.ad_groups.length} · keywords: ${plan.ad_groups.reduce((sum, group) => sum + (group.keywords?.length || 0), 0)} · negatives: ${negativeOps.length}`);
console.log(`Payload: ${payloadPath}`);

if (!execute) {
  console.log("\nDry run complete. Validate with:");
  console.log(`  node .agent/skills/google-ads-products/scripts/audit-campaign.mjs --plan=${path.relative(process.cwd(), planPath)} --check-urls`);
  console.log(`  node .agent/skills/google-ads-products/scripts/create-campaign.mjs --plan=${path.relative(process.cwd(), planPath)} --execute --confirm=YES\n`);
  process.exit(0);
}

const account = await accountSummary(cfg);
if (!account) fail("Could not read the Google Ads account. Check GOOGLE_ADS_CUSTOMER_ID and access.");
const accountCurrency = String(account.currency_code || "").toUpperCase();
if (accountCurrency !== String(plan.currency).toUpperCase()) {
  fail(`Account currency is ${accountCurrency}, but the plan is in ${plan.currency}. Budget micros would be wrong. Convert the plan or use the right account.`);
}
console.log(`\nAccount: ${account.descriptive_name} (${account.id}) · ${accountCurrency} · ${account.time_zone}`);
if (account.time_zone && account.time_zone !== "Asia/Kolkata") {
  console.log(`⚠ Account time zone is ${account.time_zone}; the plan's IST schedule is a suggestion, not enforced.`);
}

const duplicates = await search(
  `SELECT campaign.id, campaign.name, campaign.status FROM campaign WHERE campaign.name = '${campaignName.replace(/'/g, "\\'")}'`,
  { cfg }
);
if (duplicates.length) {
  fail(`A campaign named "${campaignName}" already exists (id ${duplicates[0].campaign.id}). Refusing to create a duplicate. Change campaign.name or remove the old campaign.`);
}

if (!allowNoConversion) {
  const conversionName = plan.campaign?.conversion_action;
  if (!conversionName) fail("Plan has no conversion action. Add it or pass --allow-no-conversion (not recommended).");
  const conversions = await search(
    `SELECT conversion_action.id, conversion_action.name, conversion_action.status FROM conversion_action WHERE conversion_action.name = '${String(conversionName).replace(/'/g, "\\'")}' AND conversion_action.status = 'ENABLED'`,
    { cfg }
  );
  if (!conversions.length) {
    const total = await conversionActionCount(cfg);
    fail(`Conversion action "${conversionName}" was not found (${total} enabled actions on the account). Fix the name before spending money.`);
  }
  console.log(`✓ Conversion action found: ${conversionName}`);
}

const state = { campaign: campaignName, plan: planPath, created_at: new Date().toISOString(), steps: {} };
writeJson(statePath, state);

console.log("\nCreating budget ...");
const budgetResponse = await mutate("campaignBudgets", [payload.campaign_budget]);
const budgetResource = budgetResponse.results?.[0]?.resourceName;
if (!budgetResource) fail("Budget created but no resource name returned. Stop and inspect the account.");
state.steps.budget = budgetResource;
writeJson(statePath, state);
ok(budgetResource);

console.log("Creating PAUSED campaign ...");
const campaignResponse = await mutate("campaigns", [
  { create: { ...payload.campaign.create, campaignBudget: budgetResource } },
]);
const campaignResourceName = campaignResponse.results?.[0]?.resourceName;
if (!campaignResourceName) fail("Campaign create returned no resource name. Inspect Ads UI before retrying.");
const campaignId = campaignResourceName.split("/").pop();
state.steps.campaign = campaignResourceName;
state.steps.campaign_id = campaignId;
writeJson(statePath, state);
ok(`${campaignResourceName} (PAUSED)`);

console.log("Adding locations, language and negative keywords ...");
const criteria = payload.criteria.map((operation) => ({
  create: {
    ...operation.create,
    campaign: campaignResourceName,
  },
}));
if (criteria.length) {
  const response = await mutate("campaignCriteria", criteria);
  state.steps.criteria = response.results?.length || 0;
  writeJson(statePath, state);
  ok(`${state.steps.criteria} criteria`);
}

console.log("Creating ad groups ...");
const adGroupOperations = payload.ad_groups.map((operation) => ({
  create: { ...operation.create, campaign: campaignResourceName },
}));
const adGroupResponse = await mutate("adGroups", adGroupOperations);
const adGroupResources = (adGroupResponse.results || []).map((result) => result.resourceName);
if (adGroupResources.length !== adGroupOperations.length) {
  fail(`Expected ${adGroupOperations.length} ad groups, created ${adGroupResources.length}. Inspect the account before retrying.`);
}
const adGroupByName = new Map();
for (const [index, group] of plan.ad_groups.entries()) {
  adGroupByName.set(group.name, adGroupResources[index]);
}
state.steps.ad_groups = adGroupResources;
writeJson(statePath, state);
ok(`${adGroupResources.length} ad groups`);

console.log("Adding keywords ...");
const keywordOperations = [];
for (const group of plan.ad_groups) {
  const adGroupResource = adGroupByName.get(group.name);
  for (const keyword of group.keywords || []) {
    keywordOperations.push({
      create: {
        adGroup: adGroupResource,
        status: "ENABLED",
        keyword: { text: keyword.text, matchType: keyword.match_type },
      },
    });
  }
}
if (keywordOperations.length) {
  const response = await mutate("adGroupCriteria", keywordOperations);
  state.steps.keywords = response.results?.length || 0;
  writeJson(statePath, state);
  ok(`${state.steps.keywords} keywords`);
}

console.log("Creating responsive search ads ...");
const adOperations = [];
for (const group of plan.ad_groups) {
  const adGroupResource = adGroupByName.get(group.name);
  adOperations.push({
    create: {
      adGroup: adGroupResource,
      status: "ENABLED",
      ad: {
        finalUrls: [group.landing_page || plan.offer.landing_page],
        responsiveSearchAd: {
          headlines: (group.responsive_search_ad?.headlines || []).map((headline) => ({ text: headline })),
          descriptions: (group.responsive_search_ad?.descriptions || []).map((description) => ({ text: description })),
          ...(group.responsive_search_ad?.path1 ? { path1: group.responsive_search_ad.path1 } : {}),
          ...(group.responsive_search_ad?.path2 ? { path2: group.responsive_search_ad.path2 } : {}),
        },
      },
    },
  });
}
if (adOperations.length) {
  const response = await mutate("adGroupAds", adOperations);
  state.steps.ads = response.results?.length || 0;
  writeJson(statePath, state);
  ok(`${state.steps.ads} responsive search ads`);
}

const verification = await search(
  `SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros FROM campaign WHERE campaign.id = ${campaignId}`,
  { cfg }
);
const verified = verification[0] || {};
console.log("\nCreated:");
console.log(`  Campaign ${verified.campaign?.name || campaignName} · id ${campaignId} · ${verified.campaign?.status || "PAUSED"}`);
console.log(`  Daily budget ${inr(Number(verified.campaign_budget?.amount_micros || 0) / 1_000_000)}`);
console.log(`  Ad groups ${adGroupResources.length} · keywords ${state.steps.keywords || 0} · ads ${state.steps.ads || 0}`);
console.log(`  State: ${statePath}`);
console.log("\nThe campaign is PAUSED. Review the ads and landing page, confirm conversion tracking fires, then enable it in Google Ads (or with a campaign status mutate).");
console.log(`\nNext: after 72 hours, run\n  node .agent/skills/google-ads-products/scripts/report-performance.mjs --campaign-id=${campaignId} --days=3\n`);
