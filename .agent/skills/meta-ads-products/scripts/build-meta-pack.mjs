import path from "node:path";
import {
  bullets,
  fail,
  inr,
  num,
  ok,
  parseArgs,
  pct,
  readJson,
  slug,
  table,
  today,
  writeJson,
  writeText,
} from "./lib.mjs";
import { buildPlan, planSummary } from "./plan-core.mjs";
import {
  carouselPrompts,
  characterBlock,
  singleImagePrompts,
  ugcPrompts,
  veoNotes,
} from "./prompts.mjs";

const args = parseArgs();
if (!args.brief) fail("Usage: node build-meta-pack.mjs --brief=examples/n8n-10000-india.json [--out=...]");

const briefPath = path.resolve(args.brief);
const brief = readJson(briefPath);
const plan = buildPlan(brief, { allowOverBudget: Boolean(args["allow-over-budget"]) });
const images = singleImagePrompts(brief);
const carousel = carouselPrompts(brief);
const ugc = ugcPrompts(brief);
const notes = veoNotes();

function defaultCopy() {
  const tool = brief.creative?.tool ?? "n8n";
  const checks = brief.creative?.checks ?? "12-point production audit";
  const price = Number(brief.offer?.price ?? 0);
  return {
    primary_text: [
      `Your ${tool} workflow didn't fail. It failed silently. Run the 12 checks I use before every client handoff. ₹${price.toLocaleString("en-IN")}.`,
      `One silent error can kill a client's ${tool} workflow at 2AM. This ${checks} catches it first. Instant download.`,
      `Demo vs production is 12 checks. Error handling, retries, backups, alerts. Get the ${brief.offer?.product ?? "pack"}.`,
    ],
    headlines: [
      "12 Checks Before You Ship n8n",
      "Stop Silent n8n Failures",
      "The n8n Production Audit",
      "Ship n8n Without 2AM Calls",
      `₹${price.toLocaleString("en-IN")} · Instant Download`,
    ],
    descriptions: [
      "12-point production checklist",
      "Built from real client builds",
      "Instant access. No call.",
    ],
    cta: "Download",
    carousel: [
      { headline: "It didn't fail. It failed silently.", description: "Unseen failure." },
      { headline: "No retry. No alert. No backup.", description: "Silent killers." },
      { headline: "The 12-point production audit", description: "Before handoff." },
      { headline: "Built from real client builds", description: "Production-tested." },
      { headline: `Get the pack — ₹${price.toLocaleString("en-IN")}`, description: "Instant download." },
    ],
  };
}

const copy = { ...defaultCopy(), ...(brief.ad_copy ?? {}) };

function lengthTable(items, limit, label) {
  return table(
    [label, "Text", "Chars", "Limit", "Status"],
    items.map((text, index) => {
      const n = [...text].length;
      return [
        index + 1,
        text,
        n,
        limit,
        n <= limit ? "OK" : "OVER",
      ];
    }),
  );
}

function renderCampaigns(plan) {
  return table(
    ["Campaign", "Objective", "Budget", "Ad sets"],
    plan.structure.campaigns.map((c) => [c.name, c.objective, inr(c.budget), c.ad_sets.join(", ")]),
  );
}

function renderAdSets(plan) {
  return table(
    ["Ad set", "Audience", "Total", "Daily", "Creatives", "Sales", "CPA", "ROAS"],
    plan.ad_sets.map((a) => [
      a.name,
      a.type,
      inr(a.budget_total),
      inr(a.budget_daily),
      a.creatives.length,
      a.projection.conversions,
      a.projection.cpa ? inr(a.projection.cpa) : "—",
      `${a.projection.roas}×`,
    ]),
  );
}

function renderAudiences(plan) {
  return plan.ad_sets
    .map(
      (a) => `### ${a.name}

- **Audience:** ${a.detail}
- **Budget:** ${inr(a.budget_total)} total · ${inr(a.budget_daily)}/day (${pct(a.budget_share)})
- **Optimization event:** ${a.optimization_event}
- **Bid strategy:** ${a.bid_strategy}
- **Placements:** ${a.placements}
- **Exclusions:** ${a.exclusions.join(", ")}
- **Creatives:** ${a.creatives.join(", ")}
- **Projection:** ${a.projection.clicks} clicks · ${a.projection.conversions} sales · CPA ${a.projection.cpa ? inr(a.projection.cpa) : "—"} · ROAS ${a.projection.roas}×`,
    )
    .join("\n\n");
}

function renderImage(p) {
  return `### ${p.id} — ${p.title}

**Format:** ${p.ratio} · **Use:** ${p.use}

**On-image copy (add in Canva/Figma, not in the prompt):** "${p.overlay}"

\`\`\`text
${p.prompt}
\`\`\`

**Negative prompt:** ${p.negative}`;
}

function renderCarousel(p) {
  return `#### ${p.id} — ${p.title}

**Format:** ${p.ratio}

**On-image copy:** "${p.overlay}"

\`\`\`text
${p.prompt}
\`\`\`

**Negative prompt:** ${p.negative}`;
}

function renderUgc(p) {
  return `### ${p.id} — ${p.title}

**Angle:** ${p.angle} · **Duration:** ${p.duration}

**Dialogue (verbatim):** "${p.dialogue}"

**Beats:**
${bullets(p.beats)}

**On-screen text (add in edit):** ${p.on_screen_text.map((t) => `\`${t}\``).join(" · ")}

**Caption:** ${p.caption}

**Veo prompt:**
\`\`\`text
${p.prompt}
\`\`\`

**Negative prompt:** ${p.negative}`;
}

const budgetTiers = table(
  ["Total budget", "Days", "Daily", "Campaigns", "Ad sets", "What it answers"],
  [
    ["< ₹3,000", "7", "< ₹430", "1", "1 broad", "Pixel, checkout and creative render. Not an offer verdict."],
    ["₹3,000–₹7,000", "10–14", "₹300–₹700", "1", "1 broad", "Hook rate and CTR. Purchases are directional."],
    ["₹7,000–₹15,000", "10–14", "₹600–₹1,070", "1", "2 (broad + interest)", "Which audience angle and which 3–4 creatives deserve budget."],
    ["₹15,000–₹40,000", "14–21", "₹700–₹2,800", "1", "3 (broad + interest + retargeting)", "Cold vs warm demand, first stable CPA signal."],
    ["₹40,000+", "21–30", "₹1,300+", "2 (prospecting + retargeting)", "3 + 1", "Scale winners and isolate retargeting economics."],
  ],
);

const md = `# Meta Ads Pack — ${plan.offer.product}

Generated ${today()} · Budget ${inr(plan.budget.total)} over ${plan.budget.days} days · ${plan.structure.label}

> This is a complete manual build pack: campaign structure, audience targeting, image prompts, carousel prompts, three UGC video prompts with dialogue, and ad copy. Nothing here requires the Meta API.

## 0. How to use this file

1. Read section 1 for the shape of the campaign and the honest projection.
2. Build the campaign in Ads Manager from sections 2–3.
3. Generate the stills from section 4 and the carousel from section 5.
4. Generate the three UGC clips from section 6 with Veo 3.1 / Flow.
5. Add on-image text and captions in Canva / CapCut — never trust AI-rendered text.
6. Use section 7 for primary text, headlines and descriptions.
7. Run the launch checklist in section 8 before publishing.
8. Judge with section 9, not with day-one CPA.

## 1. Snapshot

| Item | Value |
| --- | --- |
| Offer | ${plan.offer.product} at ${inr(plan.offer.price)} |
| Landing page | ${plan.offer.landing_page || "—"} |
| Objective | ${plan.objective} |
| Optimization event | ${plan.conversion.optimization_event} |
| Total budget | ${inr(plan.budget.total)} |
| Daily budget | ${inr(plan.budget.daily)}/day for ${plan.budget.days} days |
| Structure | ${plan.structure.ad_set_count} ad set${plan.structure.ad_set_count === 1 ? "" : "s"} in ${plan.structure.campaigns.length} campaign${plan.structure.campaigns.length === 1 ? "" : "s"} |
| Projected clicks | ${num(plan.projections.clicks)} |
| Projected sales | ${plan.projections.conversions} |
| Projected revenue | ${inr(plan.projections.revenue)} |
| Projected ROAS | ${plan.projections.roas}× |
| Projected CPA | ${plan.projections.cpa ? inr(plan.projections.cpa) : "—"} |
| Break-even CPA | ${inr(plan.economics.break_even_cpa)} |
| Target CPA | ${inr(plan.economics.target_cpa)} |

**Why this structure:** ${plan.structure.note}

**The honest read:** ${plan.warnings.length ? plan.warnings.join(" ") : "The budget supports the structure without starving any ad set."}

## 2. Campaign structure by budget

${budgetTiers}

For **this** budget (${inr(plan.budget.total)} / ${plan.budget.days} days = ${inr(plan.budget.daily)}/day), the skill chose **${plan.structure.ad_set_count} ad set${plan.structure.ad_set_count === 1 ? "" : "s"}**:

${renderCampaigns(plan)}

${renderAdSets(plan)}

### Rules that decide the ad-set count

- **One ad set until ₹7,000.** Splitting a small budget creates two learning-limited ad sets instead of one.
- **Two ad sets from ₹7,000.** Broad plus one interest stack; enough to compare an audience angle without starving either.
- **Three ad sets from ₹15,000.** Add retargeting only when the pixel has an audience (site visitors / video viewers / engagers).
- **Four ad sets from ₹40,000.** Separate prospecting and retargeting campaigns so warm spend is not hidden inside cold CPA.
- **Practical floor:** ₹300/day per ad set. Below that, delivery is unstable; consolidate.
- **Learning phase:** each ad set wants ~50 optimization events per week. At this budget you will not get there — that is expected. Judge hook rate, CTR, cost per add-to-cart and lead quality first.

## 3. Audience targeting, placements and bidding

${renderAudiences(plan)}

### Targeting logic

- **Broad is the default.** Meta's delivery system finds buyers faster than a stack of guesses, especially with Advantage+ audience on.
- **The interest ad set is a test, not a permanent home.** If it loses to broad by more than 30% on cost per add-to-cart after 7 days, turn it off.
- **Retargeting needs a real audience.** Do not build it until you have at least 1,000 site visitors or 1,000 video viewers in the last 30 days.
- **Lookalike needs source volume.** 1% purchasers needs 1,000+ purchasers or leads; otherwise use a 1% add-to-cart / lead lookalike.
- **Exclude purchasers 180d** from prospecting so you do not pay to re-acquire a customer.
- **Languages:** English + Hindi casts a wider net in India; remove Hindi if the landing page is English-only and bounce rate is high.

### Placements

- Start with **Advantage+ placements**.
- **Exclude Audience Network** for a ₹2,499 digital product: low-intent inventory and accidental clicks.
- Keep Facebook Feed, Instagram Feed, Reels, Stories and Explore.
- Do not manually restrict to Feed-only until you have data; it raises CPM.

### Bidding and optimization

- **Bid strategy:** Highest volume (lowest cost) for the first 7 days. Do not set a cost cap before you know your real CPA.
- **Optimization event:** ${plan.conversion.optimization_event}. If the pixel has fewer than 50 purchases in the last 30 days, optimize for **Add to Cart** first, then switch to Purchase after 50 add-to-carts.
- **Attribution:** 7-day click, 1-day view.
- **Budget optimization:** campaign-level (CBO) when there are 2+ ad sets; ad-set-level only when you deliberately want to cap a test.

### Naming

${plan.structure.campaigns.map((c) => `- Campaign: \`${c.name}\``).join("\n")}
- Ad set: \`AS-Broad\`, \`AS-Interest\`, \`AS-Retargeting-30d\`
- Creative: \`CR-IMG-1-Silent-Failure\`, \`CR-VID-1-Confession\`
- Always append the date: \`2026-10-19\`

### Pixel and conversion setup

- Meta Pixel + Conversions API (CAPI) on the landing page.
- Events: \`PageView\`, \`ViewContent\`, \`AddToCart\`, \`InitiateCheckout\`, \`Purchase\`.
- Send \`value\` and \`currency: INR\` on Purchase; without value, ROAS is blind.
- Verify with **Test Events** before launching.
- Domain verification in Business Manager; Aggregated Event Measurement configured for the domain.

## 4. Single-image creative prompts

Three concepts, each with a different psychological job: loss aversion, specificity, and trust. Generate at **4:5 (1080×1350)**. Keep the prompt's negative space for the headline and add the copy in Canva.

${images.map(renderImage).join("\n\n")}

### Image production notes

- Generate 4 variations per prompt, pick the one with clean hands, readable screens and real skin.
- Add the headline in a bold grotesk (Inter Tight / Söhne / General Sans), 72–96px, max 6 words.
- Keep text inside the top 60% safe area; Reels/Stories crop the bottom.
- Export PNG at 1080×1350, sRGB, under 2 MB.
- File names: \`CR-IMG-1-Silent-Failure-v1.png\`.

## 5. Carousel creative prompts

A five-card carousel: hook → problem → mechanism → proof → offer. **1:1 (1080×1080)**. Same grade across all five cards so the carousel feels like one object.

${carousel.map(renderCarousel).join("\n\n")}

### Carousel notes

- Card 1 must work as a standalone ad in feed — it is the only card most people see.
- Keep the same charcoal/emerald grade and the same type size on every card.
- Add a small progress marker (1/5 … 5/5) in the corner.
- Card 5 is the only card with the price and CTA.

## 6. UGC video ads — three Veo prompts

Three 10-second vertical UGC ads, same creator across all three. Use the character block verbatim in every prompt. The dialogue is written for natural mouth movement and a real hook, not a corporate script.

### Shared character block

\`\`\`text
${characterBlock(brief)}
\`\`\`

${ugc.map(renderUgc).join("\n\n")}

### Veo / Flow production notes

${bullets(notes)}

### Assembly (optional 30s cut)

- 0–10s: VID-1 (confession hook)
- 10–20s: VID-2 (client story / proof)
- 20–30s: VID-3 (12 checks + offer)
- Add captions in CapCut, loudness-normalize to −14 LUFS, and end on a 2-second product card with the price.

## 7. Ad copy bank

### Primary text (≤125 characters for feed)

${lengthTable(copy.primary_text, 125, "#")}

### Headlines (≤40 characters)

${lengthTable(copy.headlines, 40, "#")}

### Descriptions (≤30 characters)

${lengthTable(copy.descriptions, 30, "#")}

**CTA button:** ${copy.cta}

### Carousel card copy

${table(
  ["Card", "Headline", "Chars", "Description", "Chars"],
  copy.carousel.map((c, i) => [
    i + 1,
    c.headline,
    [...c.headline].length,
    c.description,
    [...c.description].length,
  ]),
)}

### Copy rules

- One idea per ad. The hook is the first six words.
- Specific beats clever: "12 checks", "2AM", "₹2,499" outperform "supercharge your workflow".
- No guarantees, no income claims, no fake urgency.
- Every ad gets one CTA, not three.
- Keep "you" in the copy and "we" out of it.

## 8. Launch checklist

- [ ] Pixel fires PageView, ViewContent, AddToCart, InitiateCheckout, Purchase (test with Meta Test Events).
- [ ] Purchase event sends \`value\` and \`currency: INR\`.
- [ ] Domain verified; Aggregated Event Measurement configured.
- [ ] Landing page loads in under 2.5s on 4G; checkout works on mobile.
- [ ] Campaign objective is Sales; optimization event is ${plan.conversion.optimization_event}.
- [ ] Budget is ${inr(plan.budget.daily)}/day for ${plan.budget.days} days.
- [ ] ${plan.structure.ad_set_count} ad set(s), each with at least 3 creatives.
- [ ] Broad ad set has Advantage+ audience on; no interest stacking.
- [ ] Purchasers 180d excluded from prospecting.
- [ ] Audience Network excluded.
- [ ] UTM parameters on every URL: \`?utm_source=meta&utm_medium=paid&utm_campaign=...&utm_content=...\`.
- [ ] All creative variants named with the \`CR-\` convention.
- [ ] Ad copy passes the character limits above.
- [ ] No before/after claims that imply guaranteed income.
- [ ] Launch with 3–4 creatives per ad set, not 15.

## 9. Measurement and stop/scale rules

### Read at 72 hours

- **Hook rate** (3-second video views ÷ impressions): below 20% → replace the hook, not the whole ad.
- **CTR (link):** below 0.8% → new creative. 1.2–2.5% is healthy for this category.
- **CPM:** ₹150–₹450 in India. Above ₹450 → audience too narrow or creative fatigue.
- **Cost per add-to-cart:** use this as the early signal before purchases arrive.

### Read at 7 days

- **CPA vs ${inr(plan.economics.target_cpa)} target:** within 30% → keep; 30–50% over → new angle; 2× over → kill the ad set.
- **ROAS:** below 1.0× at day 7 with no add-to-cart trend → stop and rebuild the offer page, not just the ads.
- **Creative:** any ad with 2× the CPA of the best ad and fewer than 3 purchases → pause.

### Read at 14 days

- **Scale:** increase budget 20% every 3 days while CPA stays within 20% of target. Never double overnight.
- **Consolidate:** if one ad set owns 80% of conversions, move budget to it and keep one test ad set alive.
- **Retargeting:** only judge it after 1,000+ site visitors; expect a 2–4× higher CVR and a smaller reachable audience.
- **Stop:** two consecutive weeks above break-even CPA (${inr(plan.economics.break_even_cpa)}) with no improving trend.

### What not to do

- Do not judge a ₹10,000 test on day 2.
- Do not change creative and audience at the same time.
- Do not scale a winner before the pixel has 50 purchases.
- Do not optimize for Purchase with fewer than 50 purchases in 30 days; use Add to Cart first.

## 10. Assumptions and disclaimers

- Projection assumptions: CPM ${inr(plan.assumptions.cpm)}, CTR ${pct(plan.assumptions.ctr)}, purchase CVR ${pct(plan.assumptions.cvr)}. These are planning defaults, not guarantees.
- Projections are directional and assume the pixel is accurate and the landing page converts.
- Meta's ad set minimums and learning rules change; confirm in Ads Manager before launch.
- This pack does not create campaigns through the API. It is a manual build document.
- Prices are in INR. Do not run this plan on a non-INR ad account without recalculating.

---

*Generated by \`.agent/skills/meta-ads-products\`.*
`;

const out =
  args.out ??
  path.join("runs", `${slug(`${plan.offer.product}-${plan.budget.total}-meta`)}-${today()}.md`);
const jsonOut =
  args.json ??
  path.join("runs", `${slug(`${plan.offer.product}-${plan.budget.total}-meta`)}-${today()}.json`);

const mdAbs = writeText(out, md);
const jsonAbs = writeJson(jsonOut, {
  generated_at: today(),
  skill: "meta-ads-products",
  brief: briefPath,
  plan,
  copy,
  single_images: images,
  carousel,
  ugc,
  veo_notes: notes,
});

console.log(planSummary(plan));
console.log(`\nMarkdown: ${mdAbs}`);
console.log(`JSON: ${jsonAbs}`);
ok("Meta pack generated.");
