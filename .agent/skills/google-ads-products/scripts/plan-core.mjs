import { config, inr, slug } from "./lib.mjs";

export function buildPlan({ brief, briefPath = null, research = null, researchPath = null, overrides = {}, cfg = config() }) {
  const totalBudget = Number(overrides.budget ?? brief.budget?.total ?? 3000);
  const days = Number(overrides.days ?? brief.budget?.days ?? 21);
  const price = Number(overrides.price ?? brief.offer?.price ?? 2499);
  const margin = Number(overrides.margin ?? brief.offer?.margin ?? 0.8);
  const maxCpc = Number(overrides.maxCpc ?? brief.budget?.max_cpc ?? 25);
  const cvr = Number(overrides.cvr ?? brief.assumptions?.conversion_rate ?? 0.015);
  const closeRate = Number(overrides.closeRate ?? brief.assumptions?.close_rate ?? 1);
  const currency = String(brief.budget?.currency || cfg.currency || "INR").toUpperCase();
  const includeInformational = Boolean(overrides.includeInformational);

  const errors = [];
  if (!Array.isArray(brief.ad_groups) || !brief.ad_groups.length) errors.push("Brief has no ad_groups.");
  if (totalBudget <= 0 || days <= 0) errors.push("Budget and days must be positive.");
  if (price <= 0) errors.push("Product price must be positive.");
  if (errors.length) return { errors, plan: null };

  const dailyBudget = Math.floor(totalBudget / days);
  const start = new Date();
  const end = new Date(start.getTime() + (days - 1) * 86_400_000);
  const iso = (date) => date.toISOString().slice(0, 10);

  if (research && (research.account?.currency || currency) !== currency) {
    errors.push(`Research currency ${research.account?.currency || "unknown"} does not match plan currency ${currency}.`);
  }

  const intentMultiplier = { transactional: 1.4, commercial: 1.2, informational: 0.4 };
  const negativeTerms = (brief.negative_keywords || []).map((item) => String(item).toLowerCase());
  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const conflictsWithNegative = (text) =>
    negativeTerms.some((term) =>
      term.includes(" ") ? text.includes(term) : new RegExp(`\\b${escapeRegex(term)}\\b`).test(text)
    );
  const filteredKeywords = [];
  const filteredSeen = new Set();
  const researchIndex = new Map((research?.ideas || []).map((idea) => [idea.keyword.toLowerCase(), idea]));
  const seen = new Set();

  const groups = brief.ad_groups.map((group) => {
    const own = (group.keywords || []).map((keyword) => {
      const text = typeof keyword === "string" ? keyword : keyword.text || keyword.keyword;
      const enriched = researchIndex.get(String(text || "").toLowerCase());
      return typeof keyword === "string"
        ? {
            text,
            match_type: enriched?.recommendedMatchType || "PHRASE",
            avg_monthly_searches: Number(enriched?.avgMonthlySearches ?? 30),
            top_of_page_bid: Number(enriched?.highTopOfPageBid ?? maxCpc * 0.7),
            competition_index: Number(enriched?.competitionIndex ?? 50),
            intent: enriched?.intent || group.intent || "commercial",
          }
        : {
            text: keyword.text || keyword.keyword,
            match_type: keyword.match_type || keyword.recommendedMatchType || "PHRASE",
            avg_monthly_searches: Number(keyword.avg_monthly_searches ?? keyword.avgMonthlySearches ?? enriched?.avgMonthlySearches ?? 30),
            top_of_page_bid: Number(keyword.top_of_page_bid ?? keyword.highTopOfPageBid ?? enriched?.highTopOfPageBid ?? maxCpc * 0.7),
            competition_index: Number(keyword.competition_index ?? keyword.competitionIndex ?? enriched?.competitionIndex ?? 50),
            intent: keyword.intent || enriched?.intent || group.intent || "commercial",
          };
    });
    const terms = (group.match_terms || []).map((term) => term.toLowerCase());
    const assigned = [];
    for (const idea of research?.ideas || []) {
      if (seen.has(idea.keyword.toLowerCase())) continue;
      const text = idea.keyword.toLowerCase();
      if (conflictsWithNegative(text)) {
        if (!filteredSeen.has(text)) filteredKeywords.push({ keyword: idea.keyword, reason: "matches a campaign negative keyword" });
        filteredSeen.add(text);
        continue;
      }
      if (idea.intent === "informational" && !includeInformational) {
        if (!filteredSeen.has(text)) filteredKeywords.push({ keyword: idea.keyword, reason: "informational intent; not a buyer query" });
        filteredSeen.add(text);
        continue;
      }
      if (!terms.length || terms.some((term) => text.includes(term))) {
        seen.add(text);
        assigned.push({
          text: idea.keyword,
          match_type: idea.recommendedMatchType || "PHRASE",
          avg_monthly_searches: Number(idea.avgMonthlySearches || 0),
          top_of_page_bid: Number(idea.highTopOfPageBid || 0),
          competition_index: Number(idea.competitionIndex || 0),
          intent: idea.intent || group.intent || "commercial",
        });
      }
    }
    const byText = new Map();
    for (const keyword of [...own, ...assigned]) {
      if (!keyword.text) continue;
      const key = keyword.text.toLowerCase();
      if (byText.has(key)) continue;
      if (conflictsWithNegative(key)) {
        if (!filteredSeen.has(key)) filteredKeywords.push({ keyword: keyword.text, reason: "matches a campaign negative keyword" });
        filteredSeen.add(key);
        continue;
      }
      byText.set(key, {
        ...keyword,
        match_type: String(keyword.match_type || "PHRASE").toUpperCase(),
        projected_monthly_searches: Math.round(keyword.avg_monthly_searches * (group.share_of_volume ?? 1)),
      });
    }
    const keywords = [...byText.values()]
      .sort((a, b) => b.avg_monthly_searches - a.avg_monthly_searches)
      .slice(0, Number(group.max_keywords || 12));
    const volume = keywords.reduce(
      (sum, keyword) => sum + Math.sqrt(Math.max(1, Math.min(keyword.avg_monthly_searches, 200))),
      0
    );
    const score = Number(group.weight || 1) * (1 + volume) * (intentMultiplier[group.intent || "commercial"] || 1);
    return { ...group, keywords, score };
  });

  const scoredTotal = groups.reduce((sum, group) => sum + group.score, 0);
  const minGroupBudget = dailyBudget >= groups.length * 100 ? 100 : 0;
  let remaining = dailyBudget;
  for (const [index, group] of groups.entries()) {
    const share = group.score / scoredTotal;
    let allocation = Math.round((dailyBudget * share) / 10) * 10;
    if (index === groups.length - 1) allocation = remaining;
    allocation = Math.min(allocation, remaining);
    if (minGroupBudget && allocation < minGroupBudget && index !== groups.length - 1) allocation = minGroupBudget;
    group.daily_allocation = Math.max(0, allocation);
    remaining -= group.daily_allocation;
  }

  const planned = groups.map((group) => {
    const avgTopBid = group.keywords.length
      ? group.keywords.reduce((sum, keyword) => sum + Math.max(keyword.top_of_page_bid || 0, 1), 0) / group.keywords.length
      : maxCpc * 0.7;
    const maxGroupCpc = Number(group.max_cpc || maxCpc);
    const cpc = Math.min(maxGroupCpc, Math.max(5, avgTopBid * 1.1));
    const allocation = group.daily_allocation * days;
    const clicks = Math.round(allocation / cpc);
    const conversions = clicks * cvr * closeRate;
    const sales = conversions;
    const revenue = sales * price;
    const grossProfit = revenue * margin;
    const cpa = sales > 0 ? allocation / sales : null;
    const roas = allocation > 0 ? revenue / allocation : 0;
    return {
      name: group.name,
      intent: group.intent || "commercial",
      daily_allocation: group.daily_allocation,
      total_allocation: allocation,
      max_cpc: Number(cpc.toFixed(2)),
      keywords: group.keywords.map((keyword) => ({
        text: keyword.text,
        match_type: keyword.match_type,
        avg_monthly_searches: keyword.avg_monthly_searches,
        top_of_page_bid: Number(Number(keyword.top_of_page_bid || cpc).toFixed(2)),
        competition_index: keyword.competition_index,
        intent: keyword.intent,
      })),
      responsive_search_ad: {
        headlines: group.headlines || [],
        descriptions: group.descriptions || [],
        path1: group.path1 || "",
        path2: group.path2 || "",
      },
      landing_page: group.landing_page || brief.offer?.landing_page,
      projections: {
        clicks,
        conversions: Number(conversions.toFixed(2)),
        sales: Number(sales.toFixed(2)),
        revenue: Math.round(revenue),
        gross_profit: Math.round(grossProfit),
        cpa: cpa === null ? null : Math.round(cpa),
        roas: Number(roas.toFixed(2)),
      },
    };
  });

  const totals = planned.reduce(
    (sum, group) => ({
      clicks: sum.clicks + group.projections.clicks,
      conversions: sum.conversions + group.projections.conversions,
      sales: sum.sales + group.projections.sales,
      revenue: sum.revenue + group.projections.revenue,
      gross_profit: sum.gross_profit + group.projections.gross_profit,
    }),
    { clicks: 0, conversions: 0, sales: 0, revenue: 0, gross_profit: 0 }
  );
  const breakEvenCpa = price * margin;
  const warnings = [];
  if (currency !== "INR") warnings.push(`Plan currency is ${currency}. Match the Google Ads account currency before launching.`);
  if (totalBudget < 1500) warnings.push("Under ₹1,500 is a smoke test, not a campaign: expect fewer than 80 clicks and no statistical significance.");
  if (totals.conversions < 1) warnings.push("Projected conversions < 1. Do not judge the offer on this budget; fix conversion tracking and landing-page CVR first.");
  if (Math.max(...planned.map((group) => group.max_cpc)) > price * 0.25) warnings.push("Max CPC is above 25% of product price. Tighten match types or raise AOV before launch.");
  if (!brief.conversion_tracking?.action_name) warnings.push("No conversion action named in the brief. Add one before spending; otherwise Google cannot optimize or report sales.");
  if (totals.revenue > 0 && totals.revenue < totalBudget) warnings.push("Base case does not return the ad spend. Budget this as a learning test, not as a profit engine.");
  if (dailyBudget < groups.length * 100) warnings.push(`Daily budget ${inr(dailyBudget)} is thin for ${groups.length} ad groups; expect slow delivery.`);
  for (const group of planned) {
    if (group.daily_allocation < 30) {
      warnings.push(`${group.name}: ${inr(group.daily_allocation)}/day is below ₹30 — too thin to gather data. Merge or drop this ad group.`);
    }
  }

  const plan = {
    schema: "google-ads-products/plan@1",
    generated_at: new Date().toISOString(),
    source_brief: briefPath,
    source_research: researchPath,
    currency,
    offer: {
      brand: brief.offer?.brand,
      product: brief.offer?.product,
      price,
      margin,
      landing_page: brief.offer?.landing_page,
      free_product: brief.offer?.free_product || null,
      free_landing_page: brief.offer?.free_landing_page || null,
      promise: brief.offer?.promise || null,
    },
    budget: {
      total: totalBudget,
      daily: dailyBudget,
      days,
      max_cpc: maxCpc,
      start_date: iso(start),
      end_date: iso(end),
      note: `Google may spend up to 2× the daily budget on a given day, but averages to ${inr(dailyBudget)}/day over the month. Hard account guardrail: ${inr(cfg.maxBudget)}.`,
    },
    targeting: {
      geo: brief.targeting?.geo || "geoTargetConstants/2356",
      language: brief.targeting?.language || "languageConstants/1000",
      locations: brief.targeting?.locations || ["India"],
      schedule: brief.targeting?.schedule || "Mon–Sun 08:00–22:00 IST (observe after 7 days)",
      networks: { google_search: true, search_partners: false, display: false },
    },
    bidding: {
      strategy: "MANUAL_CPC",
      enhanced_cpc: false,
      reason:
        "A small test budget is too small for automated bidding to learn; manual CPC caps waste while collecting conversion data. Enhanced CPC is deprecated and behaves as manual CPC.",
    },
    campaign: {
      name: brief.campaign_name || `Search-IN-${slug(brief.offer?.product || "product")}-${iso(start)}`,
      status: "PAUSED",
      channel: "SEARCH",
      contains_eu_political_advertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
      conversion_action: brief.conversion_tracking?.action_name || null,
      tracking_url_template: brief.conversion_tracking?.tracking_url_template || null,
    },
    negative_keywords: brief.negative_keywords || [],
    filtered_keywords: filteredKeywords,
    assets: brief.assets || null,
    assumptions: {
      conversion_rate: cvr,
      close_rate: closeRate,
      source: "Brief assumptions; replace with the account's last 30 days or the first 14 days of this test.",
    },
    projections: {
      ...totals,
      spend: totalBudget,
      cpa: totals.sales > 0 ? Math.round(totalBudget / totals.sales) : null,
      roas: Number((totals.revenue / totalBudget).toFixed(2)),
      break_even_cpa: Math.round(breakEvenCpa),
      note: "Directional only. CTR, CPC and CVR are assumptions until the first 7 days of spend.",
    },
    warnings,
    ad_groups: planned,
  };

  return { plan, warnings, errors: [] };
}
