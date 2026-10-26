import { fail, inr, pct, slug, today } from "./lib.mjs";

const DEFAULT_ASSUMPTIONS = {
  cpm: 250,
  ctr: 0.013,
  cvr: 0.012,
};

const AUDIENCE_MODIFIERS = {
  broad: { cpm: 1.0, cvr: 1.0 },
  interest: { cpm: 1.1, cvr: 1.15 },
  lookalike: { cpm: 1.15, cvr: 1.1 },
  retargeting: { cpm: 0.9, cvr: 2.0 },
};

const TIERS = [
  {
    id: "smoke",
    label: "Smoke test",
    max: 3000,
    campaigns: 1,
    adSets: 1,
    note: "One broad ad set. Enough to verify pixel, creative and checkout — not enough to judge the offer.",
  },
  {
    id: "validation",
    label: "Validation",
    max: 7000,
    campaigns: 1,
    adSets: 1,
    note: "One broad ad set. Read hook rate and CTR; treat purchases as directional only.",
  },
  {
    id: "test",
    label: "Creative test",
    max: 15000,
    campaigns: 1,
    adSets: 2,
    note: "Broad plus one interest ad set. Tests audience angle and 4–6 creatives without splitting data too thin.",
  },
  {
    id: "scale-read",
    label: "Scale read",
    max: 40000,
    campaigns: 1,
    adSets: 3,
    note: "Broad, interest and retargeting. Enough to compare cold and warm demand.",
  },
  {
    id: "scale",
    label: "Scale",
    max: Infinity,
    campaigns: 2,
    adSets: 4,
    note: "Prospecting and retargeting campaigns separated so each gets its own budget and reporting.",
  },
];

function tierFor(total, daily) {
  if (total < 3000 || daily < 300) return TIERS[0];
  if (daily < 600) return TIERS[1];
  return TIERS.find((tier) => total < tier.max) ?? TIERS[TIERS.length - 1];
}

function splitBudget(total, shares) {
  const entries = Object.entries(shares);
  let assigned = 0;
  return entries.map(([key, share], index) => {
    const amount =
      index === entries.length - 1
        ? total - assigned
        : Math.round(total * share);
    assigned += amount;
    return { key, share, amount };
  });
}

function project(spend, audience, assumptions, price) {
  const mod = AUDIENCE_MODIFIERS[audience] ?? AUDIENCE_MODIFIERS.broad;
  const cpm = assumptions.cpm * mod.cpm;
  const cvr = assumptions.cvr * mod.cvr;
  const impressions = (spend / cpm) * 1000;
  const clicks = impressions * assumptions.ctr;
  const conversions = clicks * cvr;
  const revenue = conversions * price;
  return {
    spend: Math.round(spend),
    cpm: Math.round(cpm),
    impressions: Math.round(impressions),
    clicks: Math.round(clicks),
    conversions: Number(conversions.toFixed(2)),
    revenue: Math.round(revenue),
    cpa: conversions > 0 ? Math.round(spend / conversions) : null,
    roas: spend > 0 ? Number((revenue / spend).toFixed(2)) : 0,
  };
}

function audienceDefinition(kind, brief) {
  const t = brief.targeting ?? {};
  const interests = t.interests ?? [
    "Business owners",
    "Software developers",
    "Automation",
    "SaaS",
    "Digital marketing",
    "No-code",
    "Make.com",
    "Zapier",
    "AI tools",
  ];
  const common = {
    countries: t.countries ?? ["IN"],
    age_min: t.age_min ?? 25,
    age_max: t.age_max ?? 50,
    genders: t.genders ?? "ALL",
    languages: t.languages ?? ["English", "Hindi"],
  };

  if (kind === "broad") {
    return {
      name: "AS-Broad",
      type: "Advantage+ audience (broad)",
      detail: `${common.countries.join(", ")} · age ${common.age_min}–${common.age_max} · all genders · no interest targeting · Advantage+ audience on`,
      ...common,
      interests: [],
      exclusions: ["Purchasers 180d", "Existing customer list"],
    };
  }
  if (kind === "interest") {
    return {
      name: "AS-Interest",
      type: "Interest stack",
      detail: `Interests: ${interests.join(", ")} · age ${common.age_min}–${common.age_max} · ${common.countries.join(", ")}`,
      ...common,
      interests,
      exclusions: ["Purchasers 180d", "Existing customer list"],
    };
  }
  if (kind === "lookalike") {
    return {
      name: "AS-Lookalike-1pct",
      type: "Lookalike 1%",
      detail: "1% lookalike of purchasers (minimum 1,000 source users) · same country · age 25–50",
      ...common,
      interests: [],
      exclusions: ["Purchasers 180d", "Existing customer list"],
    };
  }
  return {
    name: "AS-Retargeting-30d",
    type: "Retargeting",
    detail: "Website visitors 30d · video viewers 50% · Instagram/Facebook engagers 90d · cart abandoners 7d",
    ...common,
    interests: [],
    exclusions: ["Purchasers 180d", "Existing customer list"],
  };
}

function chooseAudienceKinds(tier, brief) {
  const availability = brief.targeting?.audience_availability ?? {};
  const retargeting = availability.retargeting ?? false;
  const lookalike = availability.lookalike ?? false;

  if (tier.adSets === 1) return ["broad"];
  if (tier.adSets === 2) return ["broad", "interest"];
  if (tier.adSets === 3) {
    const kinds = ["broad", "interest"];
    if (retargeting) kinds.push("retargeting");
    else if (lookalike) kinds.push("lookalike");
    return kinds;
  }
  const kinds = ["broad", "interest"];
  if (lookalike) kinds.push("lookalike");
  if (retargeting) kinds.push("retargeting");
  return kinds;
}

function sharesFor(kinds) {
  if (kinds.length === 1) return { broad: 1 };
  if (kinds.length === 2) return { broad: 0.55, interest: 0.45 };
  if (kinds.length === 3) {
    return { broad: 0.35, interest: 0.35, [kinds[2]]: 0.3 };
  }
  return {
    broad: 0.3,
    interest: 0.275,
    [kinds[2]]: 0.175,
    [kinds[3]]: 0.25,
  };
}

function creativeMatrix(kinds) {
  const matrix = {
    broad: ["IMG-1-Silent-Failure", "IMG-3-Founder", "VID-1-Confession", "VID-3-12-Checks"],
    interest: ["IMG-2-Checklist", "CAROUSEL-5", "VID-2-Client-Story", "IMG-1-Silent-Failure"],
    lookalike: ["IMG-2-Checklist", "CAROUSEL-5", "VID-3-12-Checks", "IMG-1-Silent-Failure"],
    retargeting: ["IMG-3-Founder", "CAROUSEL-5", "VID-2-Client-Story", "IMG-2-Checklist"],
  };
  return Object.fromEntries(kinds.map((kind) => [kind, matrix[kind] ?? matrix.broad]));
}

export function buildPlan(brief, { allowOverBudget = false } = {}) {
  const offer = brief.offer ?? {};
  const product = offer.product ?? "Product";
  const price = Number(offer.price ?? 0);
  if (!Number.isFinite(price) || price <= 0) fail("brief.offer.price must be a positive number.");

  const budget = brief.budget ?? {};
  const total = Number(budget.total ?? 0);
  const days = Number(budget.days ?? 0);
  if (!Number.isFinite(total) || total <= 0) fail("brief.budget.total must be a positive number.");
  if (!Number.isFinite(days) || days <= 0) fail("brief.budget.days must be a positive number.");

  const currency = budget.currency ?? "INR";
  if (currency !== "INR") fail("This skill currently supports INR accounts only.");
  const maxBudget = Number(brief.budget.max ?? process.env.META_MAX_BUDGET ?? 50000);
  if (total > maxBudget && !allowOverBudget) {
    fail(`Budget ${inr(total)} exceeds the ${inr(maxBudget)} guardrail. Pass --allow-over-budget to override.`);
  }

  const margin = Number(offer.margin ?? 0.85);
  const daily = total / days;
  const tier = tierFor(total, daily);
  const assumptions = { ...DEFAULT_ASSUMPTIONS, ...(brief.assumptions ?? {}) };
  let kinds = chooseAudienceKinds(tier, brief);
  const warnings = [];

  let allocations = splitBudget(total, sharesFor(kinds));
  while (kinds.length > 1) {
    const thin = allocations.filter(
      (a) => a.key !== "retargeting" && a.amount / days < 300,
    );
    if (thin.length === 0) break;
    warnings.push(
      `${kinds.length} ad sets would leave ${thin
        .map((a) => `${a.key} at ${inr(a.amount / days)}/day`)
        .join(", ")} — below the ${inr(300)}/day practical floor. Reducing to ${kinds.length - 1}.`,
    );
    kinds = kinds.slice(0, kinds.length - 1);
    allocations = splitBudget(total, sharesFor(kinds));
  }
  if (allocations.length === 1 && allocations[0].amount / days < 300) {
    warnings.push(
      `One ad set at ${inr(allocations[0].amount / days)}/day is below the ${inr(300)}/day practical floor. Delivery will be slow; this is a smoke test, not a scale plan.`,
    );
  }
  const adSets = allocations.map(({ key, share, amount }) => {
    const audience = audienceDefinition(key, brief);
    const adSetDaily = amount / days;
    const projection = project(amount, key, assumptions, price);
    const eventsPerWeek = (projection.conversions / days) * 7;
    if (amount / days < 300) {
      warnings.push(`${audience.name} gets ${inr(adSetDaily)}/day — below the practical learning floor.`);
    }
    if (eventsPerWeek < 50) {
      warnings.push(
        `${audience.name} projects ~${eventsPerWeek.toFixed(1)} purchases/week; Meta needs ~50/week to exit learning. Keep it, but judge on CTR/hook rate and cost per add-to-cart, not stable CPA.`,
      );
    }
    return {
      name: audience.name,
      type: audience.type,
      detail: audience.detail,
      countries: audience.countries,
      age_min: audience.age_min,
      age_max: audience.age_max,
      genders: audience.genders,
      languages: audience.languages,
      interests: audience.interests,
      exclusions: audience.exclusions,
      budget_share: share,
      budget_total: amount,
      budget_daily: Number(adSetDaily.toFixed(2)),
      optimization_event: brief.conversion?.optimization_event ?? brief.conversion?.event ?? "PURCHASE",
      bid_strategy: "Highest volume (lowest cost), then cost cap after 50 events",
      placements: "Advantage+ placements; exclude Audience Network",
      creatives: creativeMatrix(kinds)[key],
      projection,
      events_per_week: Number(eventsPerWeek.toFixed(2)),
    };
  });

  const totals = adSets.reduce(
    (acc, adSet) => {
      acc.spend += adSet.projection.spend;
      acc.impressions += adSet.projection.impressions;
      acc.clicks += adSet.projection.clicks;
      acc.conversions += adSet.projection.conversions;
      acc.revenue += adSet.projection.revenue;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
  );
  totals.conversions = Number(totals.conversions.toFixed(2));
  totals.cpa = totals.conversions > 0 ? Math.round(totals.spend / totals.conversions) : null;
  totals.roas = totals.spend > 0 ? Number((totals.revenue / totals.spend).toFixed(2)) : 0;

  const breakEvenCpa = Math.round(price * margin);
  const targetCpa = Math.round(breakEvenCpa * 0.7);
  const requiredDailyForLearning = Math.round((targetCpa * 50) / 7);
  if (daily < requiredDailyForLearning) {
    warnings.push(
      `Meta wants ~${inr(requiredDailyForLearning)}/day to reach 50 events/week at a ${inr(targetCpa)} target CPA. At ${inr(daily)}/day this is a learning-constrained test — normal for this budget.`,
    );
  }

  const campaigns =
    tier.campaigns === 2
      ? [
          {
            name: `META-IN-${slug(product)}-Sales-Prospecting`,
            objective: "SALES",
            budget: Math.round(total * 0.75),
            ad_sets: adSets.filter((a) => a.name !== "AS-Retargeting-30d").map((a) => a.name),
          },
          {
            name: `META-IN-${slug(product)}-Sales-Retargeting`,
            objective: "SALES",
            budget: Math.round(total * 0.25),
            ad_sets: adSets.filter((a) => a.name === "AS-Retargeting-30d").map((a) => a.name),
          },
        ]
      : [
          {
            name: `META-IN-${slug(product)}-Sales`,
            objective: "SALES",
            budget: total,
            ad_sets: adSets.map((a) => a.name),
          },
        ];

  return {
    generated_at: today(),
    skill: "meta-ads-products",
    offer: {
      product,
      price,
      margin,
      promise: offer.promise ?? "",
      landing_page: offer.landing_page ?? "",
      free_product: offer.free_product ?? null,
      free_landing_page: offer.free_landing_page ?? null,
      proof: offer.proof ?? [],
    },
    budget: {
      total,
      days,
      daily: Number(daily.toFixed(2)),
      currency,
      max: maxBudget,
    },
    objective: brief.objective ?? "SALES",
    conversion: {
      event: brief.conversion?.event ?? "PURCHASE",
      optimization_event: brief.conversion?.optimization_event ?? "PURCHASE",
      pixel_id: brief.conversion?.pixel_id ?? null,
      value: price,
      attribution: "7-day click, 1-day view",
    },
    structure: {
      tier: tier.id,
      label: tier.label,
      note:
        kinds.length < tier.adSets
          ? `Consolidated to ${kinds.length} ad set${kinds.length === 1 ? "" : "s"} because the budget cannot fund ${tier.adSets} without starving each one. ${tier.note}`
          : tier.note,
      campaigns,
      ad_sets: adSets.map((a) => a.name),
      ad_set_count: adSets.length,
    },
    targeting: {
      countries: brief.targeting?.countries ?? ["IN"],
      age_min: brief.targeting?.age_min ?? 25,
      age_max: brief.targeting?.age_max ?? 50,
      genders: brief.targeting?.genders ?? "ALL",
      languages: brief.targeting?.languages ?? ["English", "Hindi"],
      placements: brief.placements?.mode ?? "ADVANTAGE_PLUS",
      excluded_placements: brief.placements?.exclude ?? ["Audience Network"],
      exclusions: ["Purchasers 180d", "Existing customer list"],
    },
    ad_sets: adSets,
    projections: totals,
    economics: {
      break_even_cpa: breakEvenCpa,
      target_cpa: targetCpa,
      required_daily_for_learning: requiredDailyForLearning,
    },
    assumptions: {
      ...assumptions,
      note: "Directional only. Replace with your account's last-30-day CPM, CTR and purchase CVR.",
    },
    warnings,
  };
}

export function planSummary(plan) {
  return [
    `Campaign plan: ${plan.offer.product}`,
    `Budget: ${inr(plan.budget.total)} over ${plan.budget.days} days (${inr(plan.budget.daily)}/day) · ${plan.budget.currency}`,
    `Structure: ${plan.structure.ad_set_count} ad set${plan.structure.ad_set_count === 1 ? "" : "s"} · ${plan.structure.campaigns.length} campaign${plan.structure.campaigns.length === 1 ? "" : "s"} · ${plan.structure.label}`,
    `Projected: ${plan.projections.clicks} clicks · ${plan.projections.conversions} sales · ${inr(plan.projections.revenue)} revenue · ROAS ${plan.projections.roas}× · CPA ${inr(plan.projections.cpa ?? 0)}`,
    `Break-even CPA ${inr(plan.economics.break_even_cpa)} · target CPA ${inr(plan.economics.target_cpa)}`,
    `Learning threshold: ~${inr(plan.economics.required_daily_for_learning)}/day for 50 events/week at target CPA`,
  ].join("\n");
}

export function formatPlanTable(plan) {
  return plan.ad_sets
    .map(
      (a) =>
        `${a.name}: ${inr(a.budget_total)} total / ${inr(a.budget_daily)} per day · ${a.projection.clicks} clicks · ${a.projection.conversions} sales · ROAS ${a.projection.roas}×`,
    )
    .join("\n");
}

export function audienceLine(a) {
  return `${a.type} — ${a.detail}`;
}

export function pctLabel(value) {
  return pct(value);
}
