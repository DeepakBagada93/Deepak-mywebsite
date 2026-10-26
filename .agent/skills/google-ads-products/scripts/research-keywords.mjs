import path from "node:path";
import {
  SKILL_DIR,
  adsFetch,
  accountSummary,
  config,
  fail,
  inr,
  ok,
  parseArgs,
  writeJson,
} from "./lib.mjs";

const args = parseArgs();
const cfg = config();

function split(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function constant(kind, value, fallback) {
  const raw = String(value || fallback);
  return raw.includes("/") ? raw : `${kind}/${raw}`;
}

function classify(keyword) {
  const text = keyword.toLowerCase();
  if (/(hire|agency|consultant|expert|developer|service|done for you|freelance)/.test(text)) return "transactional";
  if (/(audit|security|deploy|production|monitor|error|backup|scale|hardening|best practices|template|workflow)/.test(text)) return "commercial";
  if (/(what is|how to|tutorial|course|learn|guide|free|vs|meaning)/.test(text)) return "informational";
  return "commercial";
}

function matchType(intent, competitionIndex, keyword) {
  if (intent === "transactional") return "PHRASE";
  if (competitionIndex >= 60 && keyword.split(/\s+/).length <= 4) return "EXACT";
  return "PHRASE";
}

const seeds = split(args.seeds || args.seed);
const urlSeed = args.url || args["url-seed"];
if (!seeds.length && !urlSeed) {
  fail('Provide --seeds="n8n workflow audit,n8n security" or --url=https://example.com/product');
}

const geo = constant("geoTargetConstants", args.geo, "2356");
const language = constant("languageConstants", args.language, "1000");
const limit = Math.min(Number(args.limit || 100), 1000);
const minVolume = Number(args["min-volume"] || 0);
const out = path.resolve(args.out || path.join(SKILL_DIR, "runs", `keyword-research-${new Date().toISOString().slice(0, 10)}.json`));

const request = {
  language,
  geoTargetConstants: [geo],
  includeAdultKeywords: false,
  pageSize: limit,
};
if (seeds.length) request.keywordSeed = { keywords: seeds };
if (urlSeed) request.urlSeed = { url: urlSeed };

console.log(`\nResearching keywords in ${geo} / ${language}${urlSeed ? ` from ${urlSeed}` : ""} ...`);

const response = await adsFetch("/keywordPlanIdeaService:generateKeywordIdeas", { body: request, cfg });
const account = await accountSummary(cfg).catch(() => null);
const currency = account?.currency_code || cfg.currency;

const ideas = (response.results || [])
  .map((result) => {
    const metrics = result.keywordIdeaMetrics || {};
    const keyword = result.text || "";
    const intent = classify(keyword);
    return {
      keyword,
      avgMonthlySearches: Number(metrics.avgMonthlySearches || 0),
      competition: metrics.competition || "UNSPECIFIED",
      competitionIndex: Number(metrics.competitionIndex || 0),
      lowTopOfPageBid: Number(metrics.lowTopOfPageBidMicros || 0) / 1_000_000,
      highTopOfPageBid: Number(metrics.highTopOfPageBidMicros || 0) / 1_000_000,
      intent,
      recommendedMatchType: matchType(intent, Number(metrics.competitionIndex || 0), keyword),
    };
  })
  .filter((idea) => idea.avgMonthlySearches >= minVolume)
  .sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches)
  .slice(0, limit);

if (!ideas.length) fail("No keyword ideas returned. Try broader seeds, a different geo/language, or remove --min-volume.");

const report = {
  generated_at: new Date().toISOString(),
  account: account ? { id: account.id, name: account.descriptive_name, currency: account.currency_code } : null,
  geo,
  language,
  seeds,
  url_seed: urlSeed || null,
  totals: {
    ideas: ideas.length,
    monthly_searches: ideas.reduce((sum, idea) => sum + idea.avgMonthlySearches, 0),
    median_top_of_page_bid:
      [...ideas].sort((a, b) => a.highTopOfPageBid - b.highTopOfPageBid)[Math.floor(ideas.length / 2)]?.highTopOfPageBid || 0,
  },
  ideas,
};
writeJson(out, report);

if (currency !== "INR") {
  console.log(`⚠ Account currency is ${currency}, not INR. All bid/budget numbers below are in ${currency}. Plans in INR must match the account currency.`);
}

console.log(`\n${ideas.length} keyword ideas · ~${report.totals.monthly_searches.toLocaleString("en-IN")} monthly searches`);
for (const idea of ideas.slice(0, 15)) {
  console.log(
    `  ${String(idea.avgMonthlySearches).padStart(6)}/mo  ${idea.keyword}  [${idea.intent}, ${idea.competition}, bid ${idea.lowTopOfPageBid}–${idea.highTopOfPageBid}]`
  );
}
if (currency === "INR") {
  console.log(`\nMedian top-of-page bid: ${inr(report.totals.median_top_of_page_bid)}`);
}
ok(`Research saved to ${out}`);
console.log(`\nNext: plan the campaign\n  node .agent/skills/google-ads-products/scripts/plan-campaign.mjs --brief=examples/n8n-3000-india.json --keywords=${path.relative(process.cwd(), out)}`);
