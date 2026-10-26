import path from "node:path";
import { SKILL_DIR, config, fail, inr, ok, parseArgs, readJson } from "./lib.mjs";
import { buildPlan } from "./plan-core.mjs";

const args = parseArgs();
const cfg = config();
const briefPath = path.resolve(args.brief || path.join(SKILL_DIR, "examples/n8n-1500-india.json"));
const brief = readJson(briefPath);
let research = null;
let researchPath = null;
if (args.keywords) {
  researchPath = path.resolve(args.keywords);
  research = readJson(researchPath);
}

const { plan, errors } = buildPlan({
  brief,
  briefPath,
  research,
  researchPath,
  cfg,
  overrides: {
    budget: args.budget,
    days: args.days,
    price: args.price,
    margin: args.margin,
    maxCpc: args["max-cpc"],
    cvr: args["conversion-rate"],
    closeRate: args["close-rate"],
    includeInformational: Boolean(args["include-informational"]),
  },
});
if (errors.length) fail(errors.join("\n"));

const slug = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const out = path.resolve(
  args.out || path.join(SKILL_DIR, "runs", `${slug(plan.offer.product)}-${plan.budget.total}-${slug(plan.currency)}-campaign.md`)
);

const assets = plan.assets || {};
const sitelinks = assets.sitelinks || [
  { text: "Free Kickoff Kit", description1: "Start before you build", description2: "Instant download", url: plan.offer.free_landing_page || plan.offer.landing_page },
  { text: "See the 12 Checks", description1: "Production checklist", description2: "No fluff", url: plan.offer.landing_page },
  { text: "Pricing ₹2,499", description1: "One-time purchase", description2: "Instant access", url: plan.offer.landing_page },
  { text: "About Deepak", description1: "Builder, not a guru", description2: "See the work", url: brief.assets?.about_url || plan.offer.landing_page },
];
const callouts = assets.callouts || ["Instant Download", "12-Point Audit", "Built for n8n", "₹2,499 One-Time", "Error Handling", "Backup Ready"];
const snippets = assets.structured_snippets || { header: "Types", values: "Error Handling, Backups, Monitoring, Alerts, Retries" };

const lines = [];
const push = (...text) => lines.push(...text);

push(`# Google Ads Search Campaign — ${plan.offer.product}`, "");
push(`**Brand:** ${plan.offer.brand || "—"}  `);
push(`**Product:** ${plan.offer.product || "—"} at ${inr(plan.offer.price)}  `);
push(`**Promise:** ${plan.offer.promise || "—"}  `);
push(`**Budget:** ${inr(plan.budget.total)} over ${plan.budget.days} days (${inr(plan.budget.daily)}/day) · ${plan.currency}  `);
push(`**Dates:** ${plan.budget.start_date} → ${plan.budget.end_date}  `);
push(`**Mode:** Manual creation (no API access required)  `);
push(`**Generated:** ${plan.generated_at}  `);
push(`**Source brief:** \`${path.relative(process.cwd(), briefPath)}\`  `);
push(``);
push(`> This file contains everything needed to build the campaign by hand in Google Ads or Google Ads Editor: research, budget math, campaign settings, keywords, RSA copy, negatives, extensions, conversion tracking and the review plan. Copy each block as-is.`);
push(``);

push(`## 0. How to use this file`, "");
push(`1. Read section 2 (budget) and section 4 (settings). If the math does not work for you, change the brief and regenerate — do not just spend more.`);
push(`2. Create the conversion action first (section 9).`);
push(`3. Create the campaign in Google Ads, PAUSED (section 10), or import the keyword sheet via Google Ads Editor (section 11).`);
push(`4. Paste the RSA copy from section 6 exactly; keep the character counts under the limits.`);
push(`5. Attach the negatives (section 7) and extensions (section 8).`);
push(`6. Enable only after the checklist passes, then follow section 12.`);
push(``);

push(`## 1. Offer and objective`, "");
push(`| Field | Value |`);
push(`|---|---|`);
push(`| Product | ${plan.offer.product || "—"} |`);
push(`| Price | ${inr(plan.offer.price)} |`);
push(`| Gross margin | ${(plan.offer.margin * 100).toFixed(0)}% |`);
push(`| Break-even CPA | ${inr(plan.projections.break_even_cpa)} |`);
push(`| Landing page | ${plan.offer.landing_page || "—"} |`);
push(`| Free lead magnet | ${plan.offer.free_product || "—"}${plan.offer.free_landing_page ? ` — ${plan.offer.free_landing_page}` : ""} |`);
push(`| Conversion action | ${plan.campaign.conversion_action || "NOT SET — fix before launch"} |`);
push(`| Primary KPI | Sales (Purchase) at CPA ≤ ${inr(plan.projections.break_even_cpa)} |`);
push(``);

push(`## 2. Budget and projections`, "");
push(`| Line | Value |`);
push(`|---|---:|`);
push(`| Total budget | ${inr(plan.budget.total)} |`);
push(`| Duration | ${plan.budget.days} days |`);
push(`| Daily budget | ${inr(plan.budget.daily)} |`);
push(`| Account guardrail | ${inr(cfg.maxBudget)} |`);
push(`| Assumed CVR | ${(plan.assumptions.conversion_rate * 100).toFixed(1)}% |`);
push(`| Projected clicks | ${plan.projections.clicks} |`);
push(`| Projected sales | ${plan.projections.sales.toFixed(1)} |`);
push(`| Projected spend | ${inr(plan.projections.spend)} |`);
push(`| Projected revenue | ${inr(plan.projections.revenue)} |`);
push(`| Projected gross profit | ${inr(plan.projections.gross_profit)} |`);
push(`| Projected ROAS | ${plan.projections.roas}× |`);
push(`| Projected CPA | ${plan.projections.cpa === null ? "—" : inr(plan.projections.cpa)} |`);
push(`| Break-even CPA | ${inr(plan.projections.break_even_cpa)} |`);
push(``);
push(`> ${plan.projections.note}`);
for (const warning of plan.warnings) push(`> ⚠ ${warning}`);
push(``);
push(`| Ad group | Intent | Daily | Total | Max CPC | Clicks | Sales | CPA | ROAS |`);
push(`|---|---|---:|---:|---:|---:|---:|---:|---:|`);
for (const group of plan.ad_groups) {
  push(
    `| ${group.name} | ${group.intent} | ${inr(group.daily_allocation)} | ${inr(group.total_allocation)} | ${inr(group.max_cpc)} | ${group.projections.clicks} | ${group.projections.sales.toFixed(1)} | ${group.projections.cpa === null ? "—" : inr(group.projections.cpa)} | ${group.projections.roas}× |`
  );
}
push(``);

push(`## 3. Keyword research`, "");
if (research) {
  push(`Source: \`${args.keywords}\`${research.note ? ` — ${research.note}` : ""}`);
} else {
  push(`No live research file supplied; volumes/bids are brief estimates. Run \`research-keywords.mjs\` with API access for live numbers.`);
}
push(``);
for (const group of plan.ad_groups) {
  push(`### ${group.name}`, "");
  push(`| Keyword | Match type | Avg monthly searches | Top-of-page bid | Competition | Intent |`);
  push(`|---|---|---:|---:|---:|---|`);
  for (const keyword of group.keywords) {
    push(`| ${keyword.text} | ${keyword.match_type} | ${keyword.avg_monthly_searches} | ${inr(keyword.top_of_page_bid)} | ${keyword.competition_index}/100 | ${keyword.intent} |`);
  }
  push(``);
  push(`\`\`\``);
  for (const keyword of group.keywords) push(`${keyword.match_type === "EXACT" ? `[${keyword.text}]` : keyword.match_type === "PHRASE" ? `"${keyword.text}"` : keyword.text}`);
  push(`\`\`\``);
  push(``);
}
if (plan.filtered_keywords?.length) {
  push(`### Excluded by research filters`, "");
  push(`| Keyword | Reason |`);
  push(`|---|---|`);
  for (const item of plan.filtered_keywords) push(`| ${item.keyword} | ${item.reason} |`);
  push(``);
}

push(`## 4. Campaign settings (click-for-click)`, "");
push(`| Setting | Value |`);
push(`|---|---|`);
push(`| Campaign name | ${plan.campaign.name} |`);
push(`| Campaign type | Search |`);
push(`| Goal | Sales (Purchase conversion) |`);
push(`| Networks | Google Search only — uncheck Search Partners and Display |`);
push(`| Locations | ${plan.targeting.locations.join(", ")} (${plan.targeting.geo}) |`);
push(`| Location option | Presence: people in the targeted locations |`);
push(`| Languages | ${plan.targeting.language === "languageConstants/1000" ? "English" : plan.targeting.language} |`);
push(`| Bidding | Manual CPC (Enhanced CPC is deprecated; leave it off) |`);
push(`| Daily budget | ${inr(plan.budget.daily)} |`);
push(`| Start date | ${plan.budget.start_date} |`);
push(`| End date | ${plan.budget.end_date} |`);
push(`| Ad schedule | ${plan.targeting.schedule} |`);
push(`| Devices | All; review mobile after 7 days |`);
push(`| Campaign status | PAUSED until the checklist passes |`);
push(`| EU political ads | Does not contain EU political advertising |`);
push(`| Tracking template | ${plan.campaign.tracking_url_template || "none (use UTM in final URL if needed)"} |`);
push(``);

push(`## 5. Ad groups and keywords`, "");
for (const group of plan.ad_groups) {
  push(`### ${group.name}`, "");
  push(`- Intent: **${group.intent}** · daily allocation **${inr(group.daily_allocation)}** · max CPC **${inr(group.max_cpc)}**`);
  push(`- Final URL: ${group.landing_page}`);
  push(`- Keywords: ${group.keywords.length}`);
  push(``);
}

push(`## 6. Ad copy (Google Search RSA)`, "");
push(`Limits: headline ≤ 30 characters, description ≤ 90. Descriptions are Google Search's body copy (the equivalent of primary text); headlines are the 30-character assets. Create one RSA per ad group. Optionally pin one headline to Position 1.`, "");
for (const group of plan.ad_groups) {
  push(`### ${group.name}`, "");
  push(`**Final URL:** ${group.landing_page}  `);
  push(`**Display path:** /${group.responsive_search_ad.path1 || ""}${group.responsive_search_ad.path2 ? `/${group.responsive_search_ad.path2}` : ""}`);
  push(``);
  push(`**Headlines (${group.responsive_search_ad.headlines.length}/15)**`, "");
  push(`| # | Headline | Chars |`);
  push(`|---:|---|---:|`);
  group.responsive_search_ad.headlines.forEach((headline, index) => {
    push(`| ${index + 1} | ${headline} | ${headline.length} |`);
  });
  push(``);
  push(`\`\`\``);
  group.responsive_search_ad.headlines.forEach((headline) => push(headline));
  push(`\`\`\``);
  push(``);
  push(`**Descriptions (${group.responsive_search_ad.descriptions.length}/4)**`, "");
  push(`| # | Description | Chars |`);
  push(`|---:|---|---:|`);
  group.responsive_search_ad.descriptions.forEach((description, index) => {
    push(`| ${index + 1} | ${description} | ${description.length} |`);
  });
  push(``);
  push(`\`\`\``);
  group.responsive_search_ad.descriptions.forEach((description) => push(description));
  push(`\`\`\``);
  push(``);
}

push(`## 7. Negative keywords (campaign level)`, "");
push(`\`\`\``);
for (const negative of plan.negative_keywords) push(negative);
push(`\`\`\``);
push(``);

push(`## 8. Ad extensions (assets)`, "");
push(`### Sitelinks`, "");
push(`| Sitelink text | Description 1 | Description 2 | URL |`);
push(`|---|---|---|---|`);
for (const sitelink of sitelinks) {
  push(`| ${sitelink.text} | ${sitelink.description1 || ""} | ${sitelink.description2 || ""} | ${sitelink.url} |`);
}
push(``);
push(`### Callouts`, "");
push(`\`\`\``);
push(callouts.join("\n"));
push(`\`\`\``);
push(``);
push(`### Structured snippet`, "");
push(`- Header: ${snippets.header}`);
push(`- Values: ${snippets.values}`);
push(``);

push(`## 9. Conversion tracking (do this first)`, "");
push(`1. Google Ads → Goals → Conversions → New conversion action → Website.`);
push(`2. Name it exactly **${plan.campaign.conversion_action || "Purchase"}**.`);
push(`3. Set the value to ${inr(plan.offer.price)} so ROAS is reported.`);
push(`4. Install the tag or import the purchase event from GA4.`);
push(`5. Confirm it fires on the thank-you page with Google Tag Assistant before enabling ads.`);
push(``);

push(`## 10. Manual creation steps (Google Ads UI)`, "");
push(`1. Create the conversion action (section 9).`);
push(`2. Campaigns → + → Create campaign → **Sales** → **Search**.`);
push(`3. Set the daily budget to ${inr(plan.budget.daily)} and bidding to **Manual CPC** (leave Enhanced CPC off).`);
push(`4. Uncheck Search Partners and Display; set locations to ${plan.targeting.locations.join(", ")} and language to English.`);
push(`5. Name the campaign \`${plan.campaign.name}\`; set start/end dates.`);
push(`6. Create each ad group from section 5; set its max CPC to the listed value.`);
push(`7. Paste the keyword block for that ad group; use the listed match types.`);
push(`8. Create the RSA from section 6; verify every headline/description fits.`);
push(`9. Add the negative keywords (section 7) at campaign level.`);
push(`10. Add sitelinks, callouts and the structured snippet (section 8).`);
push(`11. Keep the campaign PAUSED, review on mobile and desktop, then enable.`);
push(``);

push(`## 11. Google Ads Editor / bulk sheet`, "");
push(`Paste this into a spreadsheet and import via Google Ads Editor if you prefer bulk upload. One row per keyword.`, "");
push(`\`\`\`csv`);
push(`Campaign,Ad group,Keyword,Match type,Max CPC,Final URL`);
for (const group of plan.ad_groups) {
  for (const keyword of group.keywords) {
    push(`${plan.campaign.name},${group.name},${keyword.text},${keyword.match_type},${keyword.top_of_page_bid},${group.landing_page}`);
  }
}
push(`\`\`\``);
push(``);
push(`Add the RSA copy manually after import (Editor imports keywords reliably; RSA copy is fastest to paste in the UI).`);
push(``);

push(`## 12. Measurement plan and stop rules`, "");
push(`| Window | Do | Decide |`);
push(`|---|---|---|`);
push(`| 0–72 hours | No edits. Add negatives only for obvious junk search terms. | — |`);
push(`| Day 4–7 | Pause keywords with spend ≥ 1.5× CPA and 0 conversions. Raise bids 15% on keywords with CPA ≤ 0.8× target. | Keep / adjust |`);
push(`| Day 8–${Math.min(plan.budget.days, 14)} | Shift budget to the best ad group, keep the daily total fixed. | Scale / hold |`);
push(`| End (day ${plan.budget.days}) | ${plan.projections.clicks} clicks / ${plan.projections.sales.toFixed(1)} projected sales. | Scale, fix offer, or stop |`);
push(``);
push(`**Stop or fix the offer:** 100 clicks and 0 sales · 1.5× break-even CPA after 2 sales · ROAS < 1 after 14 days with no improving trend.  `);
push(`**Scale:** CPA ≤ ${inr(plan.projections.break_even_cpa)} with 2+ sales → raise budget 20–30% per week, never double.  `);
push(`**Never judge CVR before 100 clicks.**`);
push(``);

push(`## 13. Assumptions and disclaimers`, "");
push(`- Keyword volumes and bids ${research ? "come from the supplied research file" : "are brief estimates"} and are directional, not guarantees.`);
push(`- CTR, CPC and CVR are assumptions until the first 7 days of real spend.`);
push(`- Google may spend up to 2× the daily budget on a single day; the monthly total averages to ${inr(plan.budget.total)}.`);
push(`- Ads amplify an offer that already converts. Fix the landing page and tracking before increasing budget.`);
push(`- No claim of guaranteed sales or ROAS.`);

const markdown = `${lines.join("\n").replace(/\n+$/, "")}\n`;
const fs = await import("node:fs");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, markdown);

ok(`Campaign markdown written to ${out}`);
console.log(`\n${markdown.split("\n").slice(0, 40).join("\n")}\n...`);
console.log(`\nFull file: ${out}`);
