// India Offer & Pricing Kit — deterministic pricing and offer audit engine.
// Pure Node, zero dependencies. Rates are configuration, not hidden assumptions.

export const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
export const SEVERITY_WEIGHT = { critical: 20, high: 12, medium: 6, low: 2 };

export const PSYCH_POINTS = [
  99, 149, 199, 249, 299, 399, 499, 599, 699, 799, 899, 999,
  1199, 1299, 1499, 1699, 1899, 1999, 2199, 2499, 2799, 2999,
  3499, 3999, 4499, 4999, 5499, 5999, 6999, 7499, 7999, 8999,
  9999, 11999, 12999, 14999, 16999, 19999, 24999, 29999, 34999,
  39999, 49999, 59999, 69999, 79999, 99999
];

export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/;

export const CLAIM_RULES = [
  {
    code: 'CLAIM_GUARANTEE',
    severity: 'critical',
    re: /\b(guarantee[ds]?|100%\s+(?:results|success|safe|money\s*back)|risk[-\s]?free|assured\s+returns?)\b/i,
    message: 'Absolute guarantee or risk-free claim.',
    fix: 'State the condition and the remedy: "7-day refund if the audit finds nothing", not a blanket guarantee.'
  },
  {
    code: 'CLAIM_INCOME',
    severity: 'critical',
    re: /\b(get\s+rich|double\s+your\s+(?:income|money)|earn\s+₹?\s?\d+[kK]?\s+(?:per|a|every)\s+(?:day|week)|guaranteed\s+(?:income|profit|returns?))\b/i,
    message: 'Income, profit or return promise.',
    fix: 'Remove the money promise. Show the mechanism and the range actually observed.'
  },
  {
    code: 'CLAIM_HEALTH',
    severity: 'critical',
    re: /\b(cures?|treats?|heals?|clinically\s+proven)\b/i,
    message: 'Health cure or treatment claim.',
    fix: 'Remove the claim; regulated categories need qualified review and substantiation.'
  },
  {
    code: 'DARK_FALSE_URGENCY',
    severity: 'high',
    re: /\b(only\s+\d+\s+(?:seats|spots|copies|left)|last\s+chance|expires\s+(?:today|tonight|in\s+\d+\s+(?:minutes|hours))|countdown)\b/i,
    message: 'False urgency pattern (CCPA dark-pattern guidance).',
    fix: 'Use a real, dated deadline that applies to every buyer, or remove it.'
  },
  {
    code: 'DARK_DRIP_PRICING',
    severity: 'high',
    re: /\b(plus\s+gst|gst\s+extra|taxes\s+extra|gst\s+additional|exclusive\s+of\s+gst)\b/i,
    message: 'Price excludes GST and adds it later (drip pricing).',
    fix: 'Display the final GST-inclusive price on the page. Show the GST breakup, not a surprise at checkout.'
  },
  {
    code: 'SUPERLATIVE',
    severity: 'medium',
    re: /\b(#1|number\s+one|world'?s\s+best|best\s+in\s+india|unbeatable|ultimate|guaranteed\s+best)\b/i,
    message: 'Unsubstantiated superlative (ASCI).',
    fix: 'Name the comparison, the measure and the date.'
  },
  {
    code: 'SUBSCRIPTION_UNDISCLOSED',
    severity: 'high',
    re: /\b(auto[-\s]?renew|recurring\s+(?:payment|charge)|subscription\s+renews)\b/i,
    message: 'Recurring charge needs explicit consent and cancellation disclosure.',
    fix: 'Disclose the amount, interval, cancellation path and RBI e-mandate terms before payment.'
  }
];

export const PAYMENT_METHODS = ['upi', 'cards', 'netbanking', 'wallets', 'emi'];

export function nextPsychPrice(value) {
  const target = Math.max(0, Number(value) || 0);
  const match = PSYCH_POINTS.find((point) => point >= target);
  if (match) return match;
  return Math.ceil(target / 1000) * 1000 - 1;
}

export function previousPsychPrice(value) {
  const target = Math.max(0, Number(value) || 0);
  const below = PSYCH_POINTS.filter((point) => point <= target);
  return below.length ? below[below.length - 1] : PSYCH_POINTS[0];
}

export function effectiveGatewayPercent(gatewayFeePct, feeGstPercent = 18) {
  return Number(gatewayFeePct) * (1 + Number(feeGstPercent) / 100);
}

export function netFactor(gstRate = 18, gatewayFeePct = 2, feeGstPercent = 18) {
  const gateway = effectiveGatewayPercent(gatewayFeePct, feeGstPercent) / 100;
  return (1 / (1 + Number(gstRate) / 100)) * (1 - gateway);
}

export function priceBreakdown(price, options = {}) {
  const gstRate = Number(options.gstRate ?? 18);
  const gatewayFeePct = Number(options.gatewayFeePct ?? 2);
  const feeGstPercent = Number(options.feeGstPercent ?? 18);
  const base = Number(price) / (1 + gstRate / 100);
  const gst = Number(price) - base;
  const gatewayFee = base * (effectiveGatewayPercent(gatewayFeePct, feeGstPercent) / 100);
  const net = base - gatewayFee;
  return {
    price: Number(price),
    base,
    gst: Math.round(gst * 100) / 100,
    gatewayFee: Math.round(gatewayFee * 100) / 100,
    netRevenue: Math.round(net * 100) / 100,
    marginPct: Number(price) > 0 ? Math.round((net / Number(price)) * 1000) / 10 : 0
  };
}

function tier(label, price, role, options) {
  const breakdown = priceBreakdown(price, options);
  return { name: label, price, role, ...breakdown };
}

export function priceOffer(input) {
  const gstRate = Number(input.gstRate ?? 18);
  const gatewayFeePct = Number(input.gatewayFeePct ?? 2);
  const feeGstPercent = Number(input.gatewayGstOnFee ?? 18);
  const options = { gstRate, gatewayFeePct, feeGstPercent };
  const factor = netFactor(gstRate, gatewayFeePct, feeGstPercent);
  const floorNet = Number(input.floorNet ?? 700);
  const adSpend = Number(input.adSpend ?? 0);
  const cpc = Number(input.cpc ?? 18);
  const cvr = Number(input.cvr ?? 0.02);
  const anchorValue = Number(input.anchorValue ?? 0);

  const minimumPrice = nextPsychPrice(floorNet / factor);
  const requestedBase = Number(input.basePrice ?? 0);
  const proTarget = requestedBase ? Math.max(minimumPrice, requestedBase) : minimumPrice * 1.25;
  const proPrice = nextPsychPrice(proTarget);
  const starterPrice = Math.max(minimumPrice, previousPsychPrice(proPrice * 0.75));
  const agencyPrice = nextPsychPrice(proPrice * 2.2);

  const explicit = Array.isArray(input.tierPrices) && input.tierPrices.length === 3
    ? input.tierPrices.map(Number).sort((a, b) => a - b)
    : null;
  const tierPrices = explicit || [starterPrice, proPrice, agencyPrice];

  const tiers = [
    tier('Solo', tierPrices[0], 'Entry offer for first-time buyers', options),
    tier('Pro', tierPrices[1], 'Main offer: the one most buyers should choose', options),
    tier('Agency', tierPrices[2], 'Unlimited client use and priority support', options)
  ];

  const advertisedPrice = Number(input.economicsPrice || tiers[1].price);
  const advertised = tiers.find((item) => item.price === advertisedPrice) || tiers[1];
  const pro = advertised;
  const launchPrice = nextPsychPrice(tiers[0].price * 0.65);
  const anchorPrice = anchorValue ? nextPsychPrice(Math.max(anchorValue, tiers[2].price)) : nextPsychPrice(tiers[2].price * 1.4);

  const clicks = cpc > 0 ? Math.round(adSpend / cpc) : 0;
  const sales = Math.round(clicks * cvr * 10) / 10;
  const revenue = Math.round(sales * pro.price);
  const netRevenue = Math.round(sales * pro.netRevenue);
  const roas = adSpend > 0 ? Math.round((revenue / adSpend) * 100) / 100 : 0;
  const profit = Math.round(netRevenue - adSpend);
  const breakEvenROAS = Math.round((1 / factor) * 100) / 100;

  let verdict = 'NO AD DATA';
  if (adSpend > 0) {
    if (netRevenue >= adSpend * 1.2) verdict = 'PROFITABLE TEST';
    else if (netRevenue >= adSpend) verdict = 'MARGINAL';
    else verdict = 'LOSS AT CURRENT ASSUMPTIONS';
  }

  const warnings = [];
  if (input.priceIncludesGst === false) {
    warnings.push('GST is added later. Indian consumer pricing should be displayed GST-inclusive; add it before the page goes live.');
  }
  if (effectiveGatewayPercent(gatewayFeePct, feeGstPercent) > 3) {
    warnings.push(`Effective gateway fee is ${effectiveGatewayPercent(gatewayFeePct, feeGstPercent).toFixed(2)}%; negotiate or absorb it.`);
  }
  if (anchorValue && anchorValue > tiers[0].price * 3) {
    warnings.push('Reference price is more than 3× the entry price. That reads as a false anchor and risks a dark-pattern complaint.');
  }
  if (tiers[0].price > 9999) {
    warnings.push('Above ₹9,999 a self-serve download needs a call, invoice or payment plan to convert.');
  }
  if (tiers[0].price < 499) {
    warnings.push('Below ₹499, payment fees and support cost per sale eat most of the margin.');
  }
  if (adSpend > 0 && roas < 1) {
    warnings.push(`Projected ROAS is ${roas}× at ${(cvr * 100).toFixed(1)}% CVR. Treat this as a learning test, not a scale plan.`);
  }
  if (gstRate !== 18) {
    warnings.push('Digital services in India are normally 18% GST. Confirm the rate with your CA before publishing.');
  }
  if (tiers[0].netRevenue < floorNet) {
    warnings.push('The Solo tier nets below your floor. Raise it or remove it.');
  }

  let bundlePrice = null;
  let bundleSaving = null;
  if (Array.isArray(input.bundlePrices) && input.bundlePrices.length > 1) {
    const sum = input.bundlePrices.reduce((acc, value) => acc + Number(value), 0);
    bundlePrice = previousPsychPrice(sum * 0.85);
    bundleSaving = Math.round(((sum - bundlePrice) / sum) * 100);
  }

  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    product: input.product || 'Untitled product',
    audience: input.audience || null,
    currency: 'INR',
    assumptions: {
      gstRate,
      gatewayFeePct,
      feeGstPercent,
      effectiveGatewayPct: Math.round(effectiveGatewayPercent(gatewayFeePct, feeGstPercent) * 100) / 100,
      netFactor: Math.round(factor * 10000) / 10000,
      floorNet,
      cpc,
      cvr
    },
    tiers,
    recommendedTier: advertised.name,
    minimumViablePrice: minimumPrice,
    launchPrice,
    anchorPrice,
    bundlePrice,
    bundleSavingPct: bundleSaving,
    economics: {
      adSpend,
      clicks,
      sales,
      revenue,
      netRevenue,
      roas,
      profit,
      breakEvenCPA: pro.netRevenue,
      breakEvenROAS,
      verdict
    },
    paymentNotes: [
      'UPI is the default expectation in India; a page without it loses buyers.',
      'Cards and netbanking should be visible before checkout, not hidden behind "more options".',
      'Recurring charges need explicit consent, a cancellation path and RBI e-mandate handling.'
    ],
    warnings
  };
}

function baseAudit(offer) {
  return {
    schemaVersion: '1.0',
    checkedAt: new Date().toISOString(),
    product: offer.product || null,
    url: offer.url || null,
    findings: [],
    summary: {}
  };
}

export function auditOfferPage(offer) {
  const result = baseAudit(offer);
  const findings = [];
  let counter = 0;
  const add = (finding) => {
    counter += 1;
    findings.push({ id: `F${String(counter).padStart(3, '0')}`, ...finding });
  };

  const price = Number(offer.price);
  if (!Number.isFinite(price) || price <= 0) {
    add({
      code: 'OFFER_NO_PRICE',
      severity: 'critical',
      message: 'No valid price on the page.',
      evidence: [String(offer.price)],
      fix: 'Show one clear GST-inclusive price in INR.'
    });
  }

  if (offer.currency && String(offer.currency).toUpperCase() !== 'INR') {
    add({
      code: 'OFFER_CURRENCY',
      severity: 'high',
      message: 'Currency is not INR on an India-targeted page.',
      evidence: [String(offer.currency)],
      fix: 'Show INR. If you also accept USD, show both with the exchange basis.'
    });
  }

  if (offer.priceIncludesGst === false) {
    add({
      code: 'OFFER_GST_EXCLUSIVE',
      severity: 'high',
      message: 'Displayed price excludes GST.',
      evidence: [String(offer.price)],
      fix: 'Make the displayed price GST-inclusive and show the breakup.'
    });
  }

  if (!String(offer.gstNumber || '').trim()) {
    add({
      code: 'OFFER_NO_GSTIN',
      severity: 'medium',
      message: 'No GSTIN shown.',
      evidence: [],
      fix: 'If you are GST-registered, show the GSTIN in the footer and on the invoice.'
    });
  } else if (!GSTIN_PATTERN.test(String(offer.gstNumber).trim().toUpperCase())) {
    add({
      code: 'OFFER_GSTIN_INVALID',
      severity: 'medium',
      message: 'GSTIN does not match the 15-character format.',
      evidence: [String(offer.gstNumber)],
      fix: 'Recheck the GSTIN on the GST portal before publishing.'
    });
  }

  if (!String(offer.refundPolicy || '').trim()) {
    add({
      code: 'OFFER_NO_REFUND',
      severity: 'high',
      message: 'No refund policy.',
      evidence: [],
      fix: 'State the window (for example 7 or 30 days), the condition and how to claim.'
    });
  } else if (!/\b\d+\s*[- ]?\s*days?\b/i.test(String(offer.refundPolicy))) {
    add({
      code: 'OFFER_REFUND_VAGUE',
      severity: 'medium',
      message: 'Refund policy has no explicit window.',
      evidence: [String(offer.refundPolicy).slice(0, 120)],
      fix: 'Name the number of days and the process.'
    });
  }

  if (!String(offer.deliveryTime || '').trim()) {
    add({
      code: 'OFFER_NO_DELIVERY',
      severity: 'medium',
      message: 'Delivery time is not stated.',
      evidence: [],
      fix: 'Say "instant download" or the exact turnaround.'
    });
  }

  const contact = offer.contact || {};
  if (!String(contact.email || '').trim() && !String(contact.whatsapp || '').trim()) {
    add({
      code: 'OFFER_NO_CONTACT',
      severity: 'high',
      message: 'No email or WhatsApp contact.',
      evidence: [],
      fix: 'Add a monitored email and, for India, a WhatsApp link.'
    });
  } else if (!String(contact.whatsapp || '').trim()) {
    add({
      code: 'OFFER_NO_WHATSAPP',
      severity: 'low',
      message: 'No WhatsApp contact.',
      evidence: [String(contact.email || '')],
      fix: 'Add a WhatsApp click-to-chat link; it is the default support channel for Indian buyers.'
    });
  }

  const methods = Array.isArray(offer.paymentMethods) ? offer.paymentMethods.map((item) => String(item).toLowerCase()) : [];
  if (!methods.includes('upi')) {
    add({
      code: 'OFFER_NO_UPI',
      severity: 'medium',
      message: 'UPI is not listed as a payment method.',
      evidence: [methods.join(', ')],
      fix: 'Enable UPI and show it at checkout; it is the dominant consumer payment rail in India.'
    });
  }

  if (!String(offer.headline || '').trim()) {
    add({
      code: 'OFFER_NO_HEADLINE',
      severity: 'high',
      message: 'No headline stating the outcome.',
      evidence: [],
      fix: 'Write one sentence naming the buyer, the outcome and the timeframe.'
    });
  } else if (String(offer.headline).length > 120) {
    add({
      code: 'OFFER_HEADLINE_LONG',
      severity: 'low',
      message: 'Headline is longer than 120 characters.',
      evidence: [`${String(offer.headline).length}/120`],
      fix: 'Cut it to one promise; move the qualifier into the subhead.'
    });
  }

  if (!String(offer.cta || '').trim()) {
    add({
      code: 'OFFER_NO_CTA',
      severity: 'high',
      message: 'No call to action.',
      evidence: [],
      fix: 'Add one primary button with the price and what happens next.'
    });
  }

  const testimonials = Array.isArray(offer.testimonials) ? offer.testimonials : [];
  testimonials.forEach((testimonial, index) => {
    if (!String(testimonial.name || '').trim()) {
      add({
        code: 'OFFER_UNNAMED_TESTIMONIAL',
        severity: 'medium',
        message: 'Testimonial has no name.',
        evidence: [`T${index + 1}`],
        fix: 'Use a real, attributable quote with permission, or remove it.'
      });
    }
    if (!String(testimonial.result || '').trim()) {
      add({
        code: 'OFFER_VAGUE_TESTIMONIAL',
        severity: 'low',
        message: 'Testimonial has no specific result.',
        evidence: [`T${index + 1}`],
        fix: 'Add the before/after or the number the buyer reported.'
      });
    }
  });

  if (!String(offer.termsUrl || '').trim() || !String(offer.privacyUrl || '').trim()) {
    add({
      code: 'OFFER_NO_LEGAL_LINKS',
      severity: 'medium',
      message: 'Terms or privacy page is missing.',
      evidence: [],
      fix: 'Link both in the footer; digital sales need terms, refund and privacy pages.'
    });
  }

  const claims = Array.isArray(offer.claims) ? offer.claims : [];
  const rawText = [offer.headline, offer.cta, offer.refundPolicy, ...claims].join('\n');
  const claimText = rawText.replace(/money[-\s]?back\s+guarantee/gi, 'refund policy');
  for (const rule of CLAIM_RULES) {
    if (rule.re.test(claimText)) {
      add({
        code: rule.code,
        severity: rule.severity,
        message: rule.message,
        evidence: [String(rule.re.exec(claimText)[0]).slice(0, 120)],
        fix: rule.fix
      });
    }
  }

  findings.sort((a, b) => {
    const bySeverity = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return bySeverity !== 0 ? bySeverity : a.id.localeCompare(b.id);
  });

  const score = Math.max(0, Math.min(100, 100 - findings.reduce((sum, finding) => (
    sum + (SEVERITY_WEIGHT[finding.severity] || 0)
  ), 0)));

  result.findings = findings;
  result.summary = {
    score,
    verdict: score >= 90 ? 'READY TO SELL' : score >= 70 ? 'NEEDS FIXES' : 'DO NOT LAUNCH',
    critical: findings.filter((item) => item.severity === 'critical').length,
    high: findings.filter((item) => item.severity === 'high').length,
    medium: findings.filter((item) => item.severity === 'medium').length,
    low: findings.filter((item) => item.severity === 'low').length
  };
  return result;
}

export function renderPricing(pricing) {
  const lines = [
    `# Pricing Recommendation — ${pricing.product}`,
    '',
    `Assumptions: GST ${pricing.assumptions.gstRate}% · gateway ${pricing.assumptions.effectiveGatewayPct}% effective · net factor ${pricing.assumptions.netFactor}`,
    '',
    '| Tier | Price | GST | Gateway | Net | Margin | Role |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...pricing.tiers.map((item) => (
      `| ${item.name} | ₹${item.price.toLocaleString('en-IN')} | ₹${item.gst.toFixed(2)} | ₹${item.gatewayFee.toFixed(2)} | ₹${item.netRevenue.toFixed(2)} | ${item.marginPct}% | ${item.role} |`
    )),
    '',
    `Launch price ₹${pricing.launchPrice.toLocaleString('en-IN')} · Anchor ₹${pricing.anchorPrice.toLocaleString('en-IN')}${pricing.bundlePrice ? ` · Bundle ₹${pricing.bundlePrice.toLocaleString('en-IN')} (${pricing.bundleSavingPct}% off)` : ''}`,
    '',
    '## Ad economics',
    '',
    `Spend ₹${pricing.economics.adSpend.toLocaleString('en-IN')} · ${pricing.economics.clicks} clicks · ${pricing.economics.sales} sales`,
    `Break-even CPA ₹${pricing.economics.breakEvenCPA.toLocaleString('en-IN')} · break-even ROAS ${pricing.economics.breakEvenROAS}× · projected ROAS ${pricing.economics.roas}×`,
    `Verdict: **${pricing.economics.verdict}**`,
    '',
    '## Payments',
    '',
    ...pricing.paymentNotes.map((note) => `- ${note}`),
    '',
    '## Warnings',
    '',
    ...(pricing.warnings.length ? pricing.warnings.map((warning) => `- ${warning}`) : ['- None.'])
  ];
  return `${lines.join('\n')}\n`;
}

export function renderOfferAudit(result) {
  const lines = [
    `# Offer Page Audit — ${result.product || result.url || 'Untitled'}`,
    '',
    `**Score:** ${result.summary.score}/100 · **Verdict:** ${result.summary.verdict}`,
    '',
    `Critical ${result.summary.critical} · High ${result.summary.high} · Medium ${result.summary.medium} · Low ${result.summary.low}`,
    '',
    '## Findings',
    ''
  ];
  if (!result.findings.length) {
    lines.push('No findings. The page passed every trust and compliance check.');
  } else {
    lines.push('| ID | Severity | Code | Finding | Fix |', '| --- | --- | --- | --- | --- |');
    for (const finding of result.findings) {
      const evidence = finding.evidence.length ? ` (${finding.evidence.join(' · ')})` : '';
      lines.push(`| ${finding.id} | ${finding.severity} | ${finding.code} | ${finding.message}${evidence} | ${finding.fix} |`);
    }
  }
  lines.push(
    '',
    '## What this audit does not check',
    '',
    '- Whether the price is right for the market (run `price-offer.mjs` for that).',
    '- GST filing correctness or legal advice.',
    '- Page speed, checkout reliability and payment success rate.'
  );
  return `${lines.join('\n')}\n`;
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, ...rest] = arg.slice(2).split('=');
      args[key] = rest.length ? rest.join('=') : true;
    } else {
      args._.push(arg);
    }
  }
  return args;
}
