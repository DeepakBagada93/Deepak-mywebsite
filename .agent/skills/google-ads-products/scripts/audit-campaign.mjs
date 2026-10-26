import path from "node:path";
import { SKILL_DIR, config, fail, inr, ok, parseArgs, readJson } from "./lib.mjs";

const args = parseArgs();
const cfg = config();
const planPath = path.resolve(args.plan || "");
if (!args.plan) fail("Pass --plan=runs/campaign-plan-....json");
const plan = readJson(planPath);

const errors = [];
const warnings = [];
const addError = (message) => errors.push(message);
const addWarning = (message) => warnings.push(message);
const text = (value) => String(value || "");

const budget = plan.budget || {};
const total = Number(budget.total || 0);
const daily = Number(budget.daily || 0);
const days = Number(budget.days || 0);
const currency = text(plan.currency || "INR").toUpperCase();
const maxCpc = Number(plan.budget?.max_cpc || plan.ad_groups?.[0]?.max_cpc || 0);

if (plan.schema !== "google-ads-products/plan@1") addError("Unknown plan schema.");
if (currency !== "INR") addError(`Plan currency is ${currency}. This skill budgets in INR; convert deliberately before launch.`);
if (!total) addError("Budget total is missing.");
if (total > cfg.maxBudget) addError(`Total ${inr(total)} exceeds GOOGLE_ADS_MAX_BUDGET ${inr(cfg.maxBudget)}.`);
if (daily < 100) addError(`Daily budget ${inr(daily)} is below ₹100 — delivery will be too thin to learn.`);
if (days < 7) addError("Test window is under 7 days — too short to read CPC or CVR.");
if (days > 90) addWarning("Test window is over 90 days; review and re-plan every 30 days.");
if (daily * days > total + daily) addError(`Daily ${inr(daily)} × ${days} days exceeds total ${inr(total)} by more than one day.`);
if (total < 1500) addWarning("Under ₹1,500: smoke test only, not enough data for a conversion verdict.");

if (!plan.offer?.price || Number(plan.offer.price) <= 0) addError("Offer price is missing.");
if (!/^https:\/\//.test(text(plan.offer?.landing_page))) addError("Landing page must be an https:// URL.");
if (plan.campaign?.status !== "PAUSED") addError("Campaign must be created PAUSED. Never auto-launch a cold account.");
if (plan.campaign?.channel !== "SEARCH") addError("This skill only creates Search campaigns.");
if (plan.bidding?.strategy !== "MANUAL_CPC") addWarning("Non-manual bidding on a small test budget can burn spend without learning.");
if (!plan.campaign?.conversion_action && !args["allow-no-conversion"]) {
  addError("No conversion action named. Add conversion tracking before spending money (or pass --allow-no-conversion to audit only).");
}

if (!Array.isArray(plan.ad_groups) || !plan.ad_groups.length) addError("No ad groups.");
const seenKeywords = new Map();
let allocationSum = 0;
for (const group of plan.ad_groups || []) {
  const name = text(group.name || "unnamed");
  allocationSum += Number(group.daily_allocation || 0);
  if (!text(group.name)) addError("Ad group without a name.");
  if (!/^https:\/\//.test(text(group.landing_page))) addError(`${name}: landing page must be https://.`);
  if (Number(group.total_allocation || 0) <= 0) addError(`${name}: zero budget allocation.`);
  if (Number(group.max_cpc || 0) <= 0) addError(`${name}: max CPC must be positive.`);
  if (Number(group.max_cpc || 0) > maxCpc * 1.05) {
    addWarning(`${name}: max CPC ${group.max_cpc} is above the campaign cap ${maxCpc}.`);
  }
  const keywords = group.keywords || [];
  if (keywords.length < 3) addError(`${name}: ${keywords.length} keyword(s). Use 3–12 per ad group.`);
  if (keywords.length > 20) addError(`${name}: ${keywords.length} keywords. Tight intent beats volume; keep ≤20.`);
  for (const keyword of keywords) {
    const keywordText = text(keyword.text).trim();
    if (!keywordText) addError(`${name}: empty keyword.`);
    if (keywordText.length > 80) addError(`${name}: keyword over 80 characters (${keywordText}).`);
    if (!["BROAD", "PHRASE", "EXACT"].includes(text(keyword.match_type))) addError(`${name}: ${keywordText} has invalid match type ${keyword.match_type}.`);
    if (["free", "jobs", "salary", "course", "tutorial", "download", "crack", "torrent", "internship", "pdf"].includes(keywordText.toLowerCase())) {
      addError(`${name}: "${keywordText}" is a research/DIY query, not buyer intent.`);
    }
    const key = keywordText.toLowerCase();
    if (seenKeywords.has(key)) addWarning(`Duplicate keyword "${keywordText}" in ${name} and ${seenKeywords.get(key)}.`);
    seenKeywords.set(key, name);
  }
  const rsa = group.responsive_search_ad || {};
  const headlines = (rsa.headlines || []).map(text).filter(Boolean);
  const descriptions = (rsa.descriptions || []).map(text).filter(Boolean);
  if (headlines.length < 3) addError(`${name}: RSA needs at least 3 headlines.`);
  if (headlines.length > 15) addError(`${name}: RSA supports at most 15 headlines.`);
  if (descriptions.length < 2) addError(`${name}: RSA needs at least 2 descriptions.`);
  if (descriptions.length > 4) addError(`${name}: RSA supports at most 4 descriptions.`);
  for (const headline of headlines) {
    if (headline.length > 30) addError(`${name}: headline over 30 chars: "${headline}" (${headline.length}).`);
    if (/\b(best|guaranteed|100%|instantly|magic|secret)\b/i.test(headline)) addWarning(`${name}: unverifiable claim in headline "${headline}".`);
    if (headline === headline.toUpperCase() && /[A-Z]{4,}/.test(headline)) addError(`${name}: ALL CAPS headline "${headline}".`);
    if ((headline.match(/!/g) || []).length > 1) addWarning(`${name}: more than one exclamation mark in "${headline}".`);
  }
  for (const description of descriptions) {
    if (description.length > 90) addError(`${name}: description over 90 chars: "${description}" (${description.length}).`);
    if (/\b(best|guaranteed|100%|instantly|magic|secret)\b/i.test(description)) addWarning(`${name}: unverifiable claim in description "${description}".`);
  }
}

if (Math.abs(allocationSum - daily) > 1) addError(`Ad group daily allocations sum to ${inr(allocationSum)}, but daily budget is ${inr(daily)}.`);
if (!Array.isArray(plan.negative_keywords) || plan.negative_keywords.length < 8) {
  addWarning("Fewer than 8 negative keywords. Add free, jobs, salary, course, tutorial, download, crack, torrent, internship, pdf.");
}
if (!["geoTargetConstants/2356", "geoTargetConstants/1000"].includes(text(plan.targeting?.geo))) {
  addWarning(`Geo ${plan.targeting?.geo} is not the standard India target; confirm it is intentional.`);
}
if (plan.targeting?.networks?.search_partners || plan.targeting?.networks?.display) {
  addWarning("Search Partners or Display expansion enabled — small budgets should stay on Google Search only.");
}
if (plan.projections?.roas !== undefined && Number(plan.projections.roas) < 1) {
  addWarning(`Base-case ROAS ${plan.projections.roas}x is below 1 — this is a learning test, not a profitable campaign.`);
}

if (args["check-urls"]) {
  const urls = new Set(
    [plan.offer?.landing_page, plan.offer?.free_landing_page, ...(plan.ad_groups || []).map((group) => group.landing_page)]
      .filter(Boolean)
  );
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(10_000) });
      if (!response.ok) addError(`URL ${url} returned HTTP ${response.status}.`);
      else console.log(`  · URL ${response.status} ${url}`);
    } catch (error) {
      addError(`URL ${url} failed: ${error.message}`);
    }
  }
}

console.log(`\nAudit: ${path.basename(planPath)}`);
console.log(`Budget ${inr(total)} / ${days} days · ${plan.ad_groups?.length || 0} ad groups · ${seenKeywords.size} keywords`);
for (const warning of warnings) console.log(`⚠ ${warning}`);
for (const error of errors) console.log(`✗ ${error}`);

if (errors.length && !args["allow-errors"]) {
  console.log(`\n✗ FAIL — ${errors.length} error(s), ${warnings.length} warning(s). Fix errors before creating the campaign.\n`);
  process.exit(1);
}
console.log(`\n✓ PASS — ${warnings.length} warning(s). Plan is ready for a PAUSED campaign create.\n`);
