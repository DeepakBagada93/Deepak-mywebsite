import path from "node:path";
import { SKILL_DIR, config, fail, inr, ok, parseArgs, readJson, writeJson } from "./lib.mjs";
import { buildPlan } from "./plan-core.mjs";

const args = parseArgs();
const cfg = config();
const briefPath = path.resolve(args.brief || path.join(SKILL_DIR, "examples/n8n-3000-india.json"));
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
if (plan.currency !== cfg.currency) {
  fail(`Plan currency ${plan.currency} does not match account currency ${cfg.currency}.`);
}

const iso = plan.budget.start_date;
const out = path.resolve(
  args.out || path.join(SKILL_DIR, "runs", `campaign-plan-${plan.campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${iso}.json`)
);
writeJson(out, plan);

console.log(`\nCampaign plan: ${plan.campaign.name}`);
console.log(`Budget: ${inr(plan.budget.total)} over ${plan.budget.days} days (${inr(plan.budget.daily)}/day) · ${plan.currency}`);
console.log(`Offer: ${plan.offer.product} at ${inr(plan.offer.price)} · assumed CVR ${(plan.assumptions.conversion_rate * 100).toFixed(1)}%\n`);
for (const group of plan.ad_groups) {
  console.log(
    `  ${group.name.padEnd(28)} ${inr(group.total_allocation).padStart(8)}  ${String(group.projections.clicks).padStart(4)} clicks  ${String(group.projections.sales).padStart(4)} sales  ROAS ${group.projections.roas}x  max CPC ${inr(group.max_cpc)}`
  );
}
console.log(
  `\nProjected: ${plan.projections.clicks} clicks · ${plan.projections.sales.toFixed(1)} sales · ${inr(plan.projections.revenue)} revenue · ROAS ${plan.projections.roas}x · break-even CPA ${inr(plan.projections.break_even_cpa)}`
);
for (const warning of plan.warnings) console.log(`⚠ ${warning}`);
ok(`Plan saved to ${out}`);
console.log(`\nNext:`);
console.log(`  node .agent/skills/google-ads-products/scripts/audit-campaign.mjs --plan=${path.relative(process.cwd(), out)}`);
console.log(`  node .agent/skills/google-ads-products/scripts/build-campaign-md.mjs --brief=${path.relative(process.cwd(), briefPath)}${args.keywords ? ` --keywords=${path.relative(process.cwd(), path.resolve(args.keywords))}` : ""} --budget=${plan.budget.total} --days=${plan.budget.days}`);
