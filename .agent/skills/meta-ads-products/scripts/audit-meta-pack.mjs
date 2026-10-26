import fs from "node:fs";
import path from "node:path";
import { fail, inr, ok, parseArgs, readJson } from "./lib.mjs";

const args = parseArgs();
if (!args.pack) fail("Usage: node audit-meta-pack.mjs --pack=runs/...json [--md=runs/...md]");

const pack = readJson(args.pack);
const errors = [];
const warnings = [];

function error(message) {
  errors.push(message);
}
function warning(message) {
  warnings.push(message);
}
function check(condition, message) {
  if (!condition) error(message);
}

const plan = pack.plan;
const copy = pack.copy;

if (!plan) fail("Pack JSON has no plan.");
if (!copy) fail("Pack JSON has no copy.");

const daily = plan.budget.total / plan.budget.days;
const expectedAdSets =
  plan.budget.total < 3000 || daily < 300
    ? 1
    : plan.budget.total < 7000
      ? 1
      : plan.budget.total < 15000
        ? 2
        : plan.budget.total < 40000
          ? 3
          : 4;

check(plan.budget.total > 0, "Budget must be positive.");
check(plan.budget.days > 0, "Days must be positive.");
check(plan.budget.total <= plan.budget.max, `Budget ${inr(plan.budget.total)} exceeds max ${inr(plan.budget.max)}.`);
check(plan.structure.ad_set_count === plan.ad_sets.length, "structure.ad_set_count does not match ad_sets.length.");
check(
  plan.structure.ad_set_count <= expectedAdSets,
  `Structure has ${plan.structure.ad_set_count} ad sets; budget tier supports at most ${expectedAdSets}.`,
);

const budgetSum = plan.ad_sets.reduce((sum, a) => sum + a.budget_total, 0);
check(Math.abs(budgetSum - plan.budget.total) <= 1, `Ad set budgets sum to ${inr(budgetSum)}, expected ${inr(plan.budget.total)}.`);

for (const adSet of plan.ad_sets) {
  check(adSet.budget_daily >= 100, `${adSet.name} is below Meta's practical minimum (${inr(adSet.budget_daily)}/day).`);
  if (adSet.budget_daily < 300 && adSet.name !== "AS-Retargeting-30d") {
    warning(`${adSet.name} is at ${inr(adSet.budget_daily)}/day, below the ${inr(300)}/day learning floor.`);
  }
  check(adSet.creatives.length >= 3, `${adSet.name} has ${adSet.creatives.length} creatives; use at least 3.`);
  check(adSet.exclusions.some((x) => /purchaser/i.test(x)), `${adSet.name} does not exclude purchasers.`);
  check(adSet.optimization_event, `${adSet.name} has no optimization event.`);
  if (adSet.name.startsWith("AS-Interest")) {
    check(adSet.interests.length > 0, `${adSet.name} has no interests.`);
  }
  if (adSet.name.startsWith("AS-Broad")) {
    check(adSet.interests.length === 0, `${adSet.name} should not stack interests.`);
  }
}

check(plan.targeting.excluded_placements.includes("Audience Network"), "Audience Network is not excluded.");
check(plan.conversion.event, "No conversion event set.");
check(plan.conversion.attribution === "7-day click, 1-day view", "Unexpected attribution window.");

const fluff = [
  "unlock",
  "game-changer",
  "game changer",
  "revolutionary",
  "guaranteed",
  "secret",
  "skyrocket",
  "insane",
  "hack",
  "100%",
  "best ever",
  "amazing",
];

function scanCopy(label, text, limit, hardLimit = limit) {
  const length = [...text].length;
  if (length > hardLimit) error(`${label} is ${length} chars (hard limit ${hardLimit}): "${text}"`);
  else if (length > limit) warning(`${label} is ${length} chars (recommended ≤${limit}): "${text}"`);
  const lower = text.toLowerCase();
  for (const word of fluff) {
    if (lower.includes(word)) error(`${label} contains fluff phrase "${word}": "${text}"`);
  }
}

copy.primary_text.forEach((text, i) => scanCopy(`primary_text[${i + 1}]`, text, 125, 250));
copy.headlines.forEach((text, i) => scanCopy(`headline[${i + 1}]`, text, 40, 40));
copy.descriptions.forEach((text, i) => scanCopy(`description[${i + 1}]`, text, 30, 30));
copy.carousel.forEach((card, i) => {
  scanCopy(`carousel[${i + 1}].headline`, card.headline, 40, 40);
  scanCopy(`carousel[${i + 1}].description`, card.description, 20, 20);
});

check(copy.primary_text.length >= 3, "Need at least 3 primary text variants.");
check(copy.headlines.length >= 5, "Need at least 5 headlines.");
check(copy.descriptions.length >= 3, "Need at least 3 descriptions.");
check(copy.carousel.length === 5, "Carousel must have exactly 5 cards.");
check(Boolean(copy.cta), "No CTA button set.");

check((pack.single_images ?? []).length === 3, "Need exactly 3 single-image prompts.");

for (const image of pack.single_images ?? []) {
  const prompt = image.prompt ?? "";
  check(/4:5|1:1|9:16/.test(prompt), `${image.id}: prompt is missing an aspect ratio.`);
  check(/(light|lens|camera|mm|f\/)/i.test(prompt), `${image.id}: prompt is missing camera/lighting direction.`);
  check(/(negative space|clean space|clean area)/i.test(prompt), `${image.id}: prompt has no negative space for the headline.`);
  check(/no text|no logos|no logo/i.test(prompt), `${image.id}: prompt should forbid rendered text/logos.`);
  check(Boolean(image.negative), `${image.id}: missing negative prompt.`);
  check([...image.overlay].length <= 70, `${image.id}: overlay is too long for a feed image (${[...image.overlay].length} chars).`);
}

for (const card of pack.carousel ?? []) {
  const prompt = card.prompt ?? "";
  check(/1:1|4:5|1080/.test(prompt), `${card.id}: prompt is missing the square format.`);
  check(/(negative space|clean dark area|clean negative space)/i.test(prompt), `${card.id}: prompt has no text safe area.`);
  check(/no text|no logos/i.test(prompt), `${card.id}: prompt should forbid rendered text/logos.`);
  check(Boolean(card.negative), `${card.id}: missing negative prompt.`);
}

for (const video of pack.ugc ?? []) {
  const prompt = video.prompt ?? "";
  check(/9:16/.test(prompt), `${video.id}: prompt is missing 9:16.`);
  check(/1080×1920|1080x1920/.test(prompt), `${video.id}: prompt is missing 1080×1920.`);
  check(/10 seconds|8 seconds|12 seconds/.test(prompt), `${video.id}: prompt is missing duration.`);
  check(/UGC/i.test(prompt), `${video.id}: prompt is missing the UGC direction.`);
  check(/CHARACTER \(keep identical/i.test(prompt), `${video.id}: prompt is missing the shared character block.`);
  check(/no on-screen text|no captions/i.test(prompt), `${video.id}: prompt should forbid burned-in text.`);
  check(prompt.includes(video.dialogue), `${video.id}: dialogue is not verbatim inside the prompt.`);
  check(/Negative:/i.test(prompt), `${video.id}: prompt is missing an inline negative clause.`);
  check(Boolean(video.negative), `${video.id}: missing negative prompt field.`);
  const words = video.dialogue.split(/\s+/).length;
  if (words > 34) warning(`${video.id}: dialogue is ${words} words; likely too long for 10 seconds.`);
  check(video.on_screen_text.length > 0, `${video.id}: no on-screen text plan.`);
  check(Boolean(video.caption), `${video.id}: no caption.`);
}

check((pack.ugc ?? []).length === 3, "Need exactly 3 UGC video prompts.");

if (args.md) {
  const mdPath = path.resolve(args.md);
  if (!fs.existsSync(mdPath)) error(`Markdown file not found: ${mdPath}`);
  else {
    const md = fs.readFileSync(mdPath, "utf8");
    for (const section of [
      "## 2. Campaign structure by budget",
      "## 3. Audience targeting",
      "## 4. Single-image creative prompts",
      "## 5. Carousel creative prompts",
      "## 6. UGC video ads",
      "## 7. Ad copy bank",
      "## 8. Launch checklist",
      "## 9. Measurement",
    ]) {
      check(md.includes(section), `Markdown is missing section: ${section}`);
    }
    check(md.includes("₹"), "Markdown does not contain INR pricing.");
  }
}

console.log(`Meta pack audit: ${plan.offer.product} · ${inr(plan.budget.total)} / ${plan.budget.days} days`);
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s)`);
  warnings.forEach((w) => console.log(`  - ${w}`));
}
if (errors.length) {
  console.log(`\n✗ ${errors.length} error(s)`);
  errors.forEach((e) => console.log(`  - ${e}`));
  process.exit(1);
}
ok("PASS — campaign plan, copy and creative prompts are ready.");
