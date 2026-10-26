import path from "node:path";
import { SKILL_DIR, config, fail, inr, ok, parseArgs, search, writeJson } from "./lib.mjs";

const args = parseArgs();
const cfg = config();
const days = Math.max(1, Number(args.days || 7));
const until = args.until || new Date().toISOString().slice(0, 10);
const sinceDate = new Date(`${until}T00:00:00Z`);
sinceDate.setUTCDate(sinceDate.getUTCDate() - (days - 1));
const since = args.since || sinceDate.toISOString().slice(0, 10);
const targetCpa = Number(args["target-cpa"] || args["break-even-cpa"] || 1999);

let campaignFilter = "";
if (args["campaign-id"]) {
  campaignFilter = `campaign.id = ${Number(args["campaign-id"])}`;
} else if (args["campaign-name"]) {
  campaignFilter = `campaign.name = '${String(args["campaign-name"]).replace(/'/g, "\\'")}'`;
} else {
  fail("Pass --campaign-id=123456789 or --campaign-name=\"Search-IN-...\"");
}

const range = `segments.date BETWEEN '${since}' AND '${until}'`;
const metricsSql = "metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value, metrics.ctr, metrics.average_cpc";

function num(value) {
  return Number(value || 0);
}

function summarize(row) {
  const spend = num(row.metrics?.cost_micros) / 1_000_000;
  const conversions = num(row.metrics?.conversions);
  const revenue = num(row.metrics?.conversions_value);
  return {
    spend,
    clicks: num(row.metrics?.clicks),
    impressions: num(row.metrics?.impressions),
    conversions,
    revenue,
    ctr: num(row.metrics?.ctr) * 100,
    cpc: num(row.metrics?.average_cpc) / 1_000_000,
    cpa: conversions > 0 ? spend / conversions : null,
    cvr: num(row.metrics?.clicks) > 0 ? (conversions / num(row.metrics?.clicks)) * 100 : 0,
    roas: spend > 0 ? revenue / spend : 0,
  };
}

console.log(`\nPerformance ${since} → ${until} (${days} days) · ${campaignFilter}`);

const campaignRows = await search(
  `SELECT campaign.id, campaign.name, campaign.status, campaign_budget.amount_micros, ${metricsSql} FROM campaign WHERE ${campaignFilter} AND ${range}`,
  { cfg }
);
if (!campaignRows.length) fail("No campaign metrics found for that range. Check the campaign ID/name and that the account has spend in the window.");
const campaign = campaignRows[0];
const totals = summarize(campaign);

const adGroupRows = await search(
  `SELECT ad_group.id, ad_group.name, ${metricsSql} FROM ad_group WHERE ${campaignFilter} AND ${range}`,
  { cfg }
);
const keywordRows = await search(
  `SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group.id, ${metricsSql} FROM keyword_view WHERE ${campaignFilter} AND ${range}`,
  { cfg }
);
const termRows = await search(
  `SELECT search_term_view.search_term, ${metricsSql} FROM search_term_view WHERE ${campaignFilter} AND ${range}`,
  { cfg }
);

const adGroups = adGroupRows.map((row) => ({ name: row.adGroup?.name || row.ad_group?.name, ...summarize(row) })).sort((a, b) => b.spend - a.spend);
const keywords = keywordRows
  .map((row) => ({
    keyword: row.adGroupCriterion?.keyword?.text || row.ad_group_criterion?.keyword?.text,
    matchType: row.adGroupCriterion?.keyword?.matchType || row.ad_group_criterion?.keyword?.matchType,
    ...summarize(row),
  }))
  .sort((a, b) => b.spend - a.spend);
const terms = termRows
  .map((row) => ({ term: row.searchTermView?.searchTerm || row.search_term_view?.search_term, ...summarize(row) }))
  .sort((a, b) => b.spend - a.spend);

const recommendations = [];
for (const keyword of keywords) {
  if (keyword.spend >= targetCpa * 1.5 && keyword.conversions === 0) {
    recommendations.push({ action: "PAUSE_KEYWORD", target: keyword.keyword, reason: `${inr(keyword.spend)} spent, 0 conversions (1.5× target CPA).` });
  } else if (keyword.conversions > 0 && keyword.cpa !== null && keyword.cpa <= targetCpa * 0.8) {
    recommendations.push({ action: "RAISE_BID_15", target: keyword.keyword, reason: `CPA ${inr(keyword.cpa)} is under target ${inr(targetCpa)} — buy more of this.` });
  }
}
for (const term of terms) {
  if (term.clicks >= 8 && term.conversions === 0) {
    recommendations.push({ action: "ADD_NEGATIVE", target: term.term, reason: `${term.clicks} clicks, ${inr(term.spend)} spent, 0 conversions. Add as a negative keyword.` });
  }
}
for (const group of adGroups) {
  if (group.impressions >= 200 && group.ctr < 1) {
    recommendations.push({ action: "REWRITE_RSA", target: group.name, reason: `CTR ${group.ctr.toFixed(2)}% — headline offer is not landing.` });
  }
}
if (totals.spend > 0 && totals.conversions === 0 && totals.clicks >= 30) {
  recommendations.push({ action: "STOP_AND_FIX", target: campaign.campaign?.name, reason: `${totals.clicks} clicks and 0 conversions. Pause and fix tracking or the landing page before adding budget.` });
}
if (totals.roas > 0 && totals.roas < 1) {
  recommendations.push({ action: "REVIEW_OFFER", target: campaign.campaign?.name, reason: `ROAS ${totals.roas.toFixed(2)}x is below 1. Raise AOV or tighten keywords before scaling.` });
}

const report = {
  generated_at: new Date().toISOString(),
  campaign: {
    id: campaign.campaign?.id,
    name: campaign.campaign?.name,
    status: campaign.campaign?.status,
    daily_budget: num(campaign.campaignBudget?.amountMicros || campaign.campaign_budget?.amount_micros) / 1_000_000,
  },
  window: { since, until, days },
  totals,
  target_cpa: targetCpa,
  ad_groups: adGroups,
  keywords,
  search_terms: terms,
  recommendations,
};

const out = path.resolve(args.out || path.join(SKILL_DIR, "runs", `performance-${campaign.campaign?.id || "campaign"}-${until}.json`));
writeJson(out, report);

console.log(`\nSpend ${inr(totals.spend)} · ${totals.clicks} clicks · ${totals.conversions.toFixed(2)} conversions · CPA ${totals.cpa === null ? "—" : inr(totals.cpa)} · ROAS ${totals.roas.toFixed(2)}x`);
console.log(`CTR ${totals.ctr.toFixed(2)}% · CPC ${inr(totals.cpc)} · CVR ${totals.cvr.toFixed(2)}%`);
console.log(`\nAd groups:`);
for (const group of adGroups) {
  console.log(`  ${String(group.name).padEnd(28)} ${inr(group.spend).padStart(9)}  ${String(group.clicks).padStart(4)} clicks  ${group.conversions.toFixed(1).padStart(5)} conv  CPA ${group.cpa === null ? "—" : inr(group.cpa)}`);
}
if (keywords.length) {
  console.log(`\nTop keywords by spend:`);
  for (const keyword of keywords.slice(0, 10)) {
    console.log(`  ${String(keyword.keyword).padEnd(34)} ${keyword.matchType.padEnd(6)} ${inr(keyword.spend).padStart(8)}  ${String(keyword.clicks).padStart(4)} clicks  ${keyword.conversions.toFixed(1).padStart(5)} conv`);
  }
}
if (terms.length) {
  console.log(`\nSearch terms to review:`);
  for (const term of terms.slice(0, 10)) {
    console.log(`  ${String(term.term).padEnd(40)} ${inr(term.spend).padStart(8)}  ${String(term.clicks).padStart(4)} clicks  ${term.conversions.toFixed(1).padStart(5)} conv`);
  }
}
console.log(`\nRecommendations:`);
if (!recommendations.length) console.log("  None — keep collecting data.");
for (const recommendation of recommendations) console.log(`  ${recommendation.action.padEnd(14)} ${recommendation.target} — ${recommendation.reason}`);
ok(`Report saved to ${out}`);
