// Ad Creative Lab — deterministic rules engine.
// Pure Node, zero dependencies. Every rule below is a documented check, not a guess.

export const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
export const SEVERITY_WEIGHT = { critical: 20, high: 12, medium: 6, low: 2 };

export const PLATFORM_LIMITS = {
  meta: { primaryText: 125, primaryTextMax: 2200, headline: 40, description: 30 },
  google: { headline: 30, description: 90, primaryText: 0, primaryTextMax: 0 },
  linkedin: { primaryText: 3000, primaryTextMax: 3000, headline: 200, description: 300 },
  youtube: { primaryText: 5000, primaryTextMax: 5000, headline: 100, description: 5000 }
};

export const META_CTAS = [
  'Download', 'Shop Now', 'Learn More', 'Sign Up', 'Get Offer',
  'Book Now', 'Contact Us', 'Send Message', 'Apply Now', 'Subscribe'
];

export const CLAIM_RULES = [
  {
    code: 'CLAIM_GUARANTEE',
    severity: 'critical',
    re: /\b(guarantee[ds]?|100%\s+(?:safe|effective|results|money\s*back|success)|risk[-\s]?free|assured\s+(?:results|income))\b/i,
    message: 'Absolute guarantee or risk-free claim.',
    fix: 'Replace with the concrete proof instead: "12 checks, tested on 40 workflows", "7-day refund as per policy".'
  },
  {
    code: 'CLAIM_CURE',
    severity: 'critical',
    re: /\b(cures?|treats?|heals?|clinically\s+proven|diagnoses)\b/i,
    message: 'Health cure or treatment claim.',
    fix: 'Remove medical claims. Use "supports" only with substantiation and a qualified reviewer.'
  },
  {
    code: 'CLAIM_INCOME',
    severity: 'critical',
    re: /\b(get\s+rich|double\s+your\s+(?:income|money)|earn\s+₹?\s?\d+[kK]?\s+(?:per|a|every)\s+(?:day|week)|passive\s+income\s+guaranteed)\b/i,
    message: 'Income or get-rich claim.',
    fix: 'State the mechanism and the range actually observed, or remove the money promise entirely.'
  },
  {
    code: 'CLAIM_FAKE_URGENCY',
    severity: 'high',
    re: /\b(only\s+\d+\s+(?:seats|spots|copies)\s+left|last\s+chance|expires\s+(?:today|tonight|in\s+\d+\s+hours))\b/i,
    message: 'Countdown or scarcity claim that usually cannot be verified.',
    fix: 'Use a real, dated deadline that applies to everyone, or drop the urgency line.'
  },
  {
    code: 'CLAIM_SUPERLATIVE',
    severity: 'medium',
    re: /\b(#1|number\s+one|world'?s\s+best|best\s+in\s+india|unbeatable|ultimate)\b/i,
    message: 'Unsubstantiated superlative.',
    fix: 'Name the comparison and the date: "scored 92/100 in our October 2026 audit".'
  },
  {
    code: 'CLAIM_BEFORE_AFTER',
    severity: 'medium',
    re: /\b(before\s*\/\s*after|before\s+and\s+after)\b/i,
    message: 'Before/after framing needs a documented, typical result.',
    fix: 'Add the baseline, the sample size and the timeframe next to the claim.'
  },
  {
    code: 'CLAIM_INSTANT',
    severity: 'low',
    re: /\b(instantly|overnight|in\s+seconds)\b/i,
    message: 'Speed claim that may overstate the outcome.',
    fix: 'Say what actually happens instantly (the download) versus what takes time (the result).'
  }
];

export const HOOK_PATTERNS = [
  { id: 'number', label: 'Specific number', weight: 2, re: /\d/ },
  { id: 'pain', label: 'Named pain', weight: 2, re: /\b(stop|wast(?:e|ing)|leak(?:s|ing)?|los(?:e|ing)|fail(?:s|ed|ing)?|broken|silent(?:ly)?|expensive|slow|chaos|nightmare|stuck)\b/i },
  { id: 'curiosity', label: 'Open loop', weight: 1, re: /\b(nobody|why|what|how|truth|mistake|nobody\s+tells|most\s+people|nobody\s+warns)\b/i },
  { id: 'time', label: 'Time or price specificity', weight: 1, re: /\b(in\s+\d+\s+(?:minutes?|hours?|days?)|₹\s?\d[\d,]*|\d+\s*-?\s*(?:point|step|check))/i },
  { id: 'audience', label: 'Audience callout', weight: 1, re: /\b(for\s+(?:founders|agencies|marketers|creators|developers|d2c|smbs?)|if\s+you(?:'re|\s+are)?)\b/i },
  { id: 'proof', label: 'Proof or demo', weight: 1, re: /\b(tested|audit(?:ed)?|checklist|case\s+study|screenshot|benchmark|verified|before\s+you)\b/i }
];

const WORDS = (text) => String(text || '').trim().split(/\s+/).filter(Boolean);
const NORMALIZE = (text) => String(text || '')
  .toLowerCase()
  .replace(/[^a-z0-9\u0900-\u097F]+/g, ' ')
  .trim();

export function charCount(text) {
  return [...String(text || '')].length;
}

export function shingles(text, size = 5) {
  const words = NORMALIZE(text).split(' ').filter(Boolean);
  if (words.length < size) return new Set(words);
  const out = new Set();
  for (let i = 0; i <= words.length - size; i += 1) out.add(words.slice(i, i + size).join(' '));
  return out;
}

export function similarity(a, b) {
  const A = shingles(a);
  const B = shingles(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const item of A) if (B.has(item)) shared += 1;
  return shared / Math.min(A.size, B.size);
}

export function analyzeHook(hook) {
  const text = String(hook || '');
  const matched = HOOK_PATTERNS.filter((pattern) => pattern.re.test(text));
  const score = matched.reduce((sum, pattern) => sum + pattern.weight, 0);
  const words = WORDS(text).length;
  const notes = [];
  if (!text.trim()) notes.push('Hook is empty.');
  if (words > 22) notes.push(`Hook is ${words} words; tighten to 6-14 words for a first line.`);
  if (/^in today'?s/i.test(text)) notes.push('Opens with the most common AI cliché.');
  if (/!{2,}/.test(text)) notes.push('Multiple exclamation marks.');
  return {
    score: Math.min(score, 7),
    patterns: matched.map((pattern) => pattern.id),
    words,
    notes
  };
}

export function scanClaims(text) {
  const findings = [];
  for (const rule of CLAIM_RULES) {
    if (rule.re.test(text)) {
      findings.push({
        code: rule.code,
        severity: rule.severity,
        message: rule.message,
        evidence: [String(text).slice(0, 220)],
        fix: rule.fix
      });
    }
  }
  return findings;
}

export function priceMentions(text) {
  const amounts = [];
  const re = /(?:₹|rs\.?\s*|inr\s*)(\d[\d,]*)/gi;
  let match;
  while ((match = re.exec(String(text))) !== null) {
    amounts.push(Number(match[1].replace(/,/g, '')));
  }
  return amounts;
}

export function hasDevanagari(text) {
  return /[\u0900-\u097F]/.test(String(text || ''));
}

export function verdictFor(score) {
  if (score >= 90) return 'READY TO LAUNCH';
  if (score >= 70) return 'NEEDS FIXES';
  return 'DO NOT SPEND';
}

export function scoreFindings(findings) {
  const penalty = findings.reduce((sum, finding) => sum + (SEVERITY_WEIGHT[finding.severity] || 0), 0);
  return Math.max(0, Math.min(100, 100 - penalty));
}

function baseResult(pack) {
  return {
    schemaVersion: '1.0',
    checkedAt: new Date().toISOString(),
    brand: pack.brand || null,
    product: pack.product || null,
    platforms: Array.isArray(pack.platforms) ? pack.platforms : [],
    findings: [],
    summary: {}
  };
}

export function auditPack(pack) {
  const result = baseResult(pack);
  const findings = [];
  let counter = 0;
  const add = (finding) => {
    counter += 1;
    findings.push({ id: `F${String(counter).padStart(3, '0')}`, ...finding });
  };

  if (!Array.isArray(pack.creatives) || pack.creatives.length === 0) {
    add({
      code: 'PACK_EMPTY',
      severity: 'critical',
      message: 'No creatives supplied.',
      evidence: [],
      fix: 'Add at least one creative object with platform, hook and primaryText.'
    });
  }

  if (!pack.landingPage || !/^https?:\/\//i.test(String(pack.landingPage))) {
    add({
      code: 'PACK_NO_LANDING_PAGE',
      severity: 'high',
      message: 'Campaign has no valid landing page URL.',
      evidence: [String(pack.landingPage || '')],
      fix: 'Point every ad at the product page that can take payment, not a homepage.'
    });
  }

  if (Array.isArray(pack.platforms) && pack.platforms.includes('meta') &&
      (!Array.isArray(pack.ugcScripts) || pack.ugcScripts.length === 0)) {
    add({
      code: 'PACK_NO_UGC',
      severity: 'low',
      message: 'Meta plan has no UGC video script; static-only accounts fatigue faster.',
      evidence: [],
      fix: 'Add at least one 9:16 UGC script with a hook in the first 2 seconds.'
    });
  }

  const seenPrimary = [];
  const seenHeadlines = [];

  (pack.creatives || []).forEach((creative, index) => {
    const id = creative.id || `C${index + 1}`;
    const platform = String(creative.platform || '').toLowerCase();
    const limits = PLATFORM_LIMITS[platform];

    if (!limits) {
      add({
        code: 'CREATIVE_PLATFORM',
        severity: 'high',
        message: `Unsupported platform "${creative.platform}".`,
        evidence: [id],
        fix: 'Use one of: meta, google, linkedin, youtube.'
      });
      return;
    }

    const primary = String(creative.primaryText || '');
    const headline = String(creative.headline || '');
    const description = String(creative.description || '');
    const hooks = Array.isArray(creative.hooks) ? creative.hooks : [];
    const cta = String(creative.cta || '');
    const allText = [primary, headline, description, ...hooks, cta].join('\n');
    const hook = hooks[0] || primary.split(/[.!?\n]/)[0] || '';

    const primaryLength = charCount(primary);
    if (limits.primaryTextMax && primaryLength > limits.primaryTextMax) {
      add({
        code: 'CREATIVE_PRIMARY_MAX',
        severity: 'high',
        message: `Primary text exceeds the ${platform} hard cap.`,
        evidence: [id, `${primaryLength}/${limits.primaryTextMax}`],
        fix: 'Cut the body copy. Put the long version on the landing page.'
      });
    } else if (limits.primaryText && primaryLength > limits.primaryText) {
      add({
        code: 'CREATIVE_PRIMARY_RECOMMENDED',
        severity: 'medium',
        message: `Primary text is longer than the ${platform} visible-before-more limit.`,
        evidence: [id, `${primaryLength}/${limits.primaryText}`],
        fix: 'Keep the first 125 characters as a complete, standalone hook.'
      });
    }

    if (limits.headline && charCount(headline) > limits.headline) {
      add({
        code: 'CREATIVE_HEADLINE_LENGTH',
        severity: platform === 'google' ? 'high' : 'medium',
        message: `Headline exceeds the ${platform} limit.`,
        evidence: [id, `${charCount(headline)}/${limits.headline}`],
        fix: 'Shorten the headline; move the qualifier into the description.'
      });
    }

    if (limits.description && charCount(description) > limits.description) {
      add({
        code: 'CREATIVE_DESCRIPTION_LENGTH',
        severity: platform === 'google' ? 'high' : 'low',
        message: `Description exceeds the ${platform} limit.`,
        evidence: [id, `${charCount(description)}/${limits.description}`],
        fix: 'Rewrite to fit; do not let the platform truncate mid-offer.'
      });
    }

    if (!headline.trim()) {
      add({
        code: 'CREATIVE_NO_HEADLINE',
        severity: 'high',
        message: 'Creative has no headline.',
        evidence: [id],
        fix: 'Add one 30-40 character headline that names the outcome.'
      });
    }

    const capsWords = WORDS(allText).filter((word) => /^[A-Z]{3,}$/.test(word.replace(/[^A-Za-z]/g, '')));
    if (capsWords.length > 1) {
      add({
        code: 'CREATIVE_ALL_CAPS',
        severity: 'high',
        message: 'More than one all-caps word.',
        evidence: [id, capsWords.slice(0, 6).join(', ')],
        fix: 'Use sentence case. Emphasise with one accent, never shouting.'
      });
    }

    if ((allText.match(/!/g) || []).length > 1) {
      add({
        code: 'CREATIVE_EXCLAMATION',
        severity: 'medium',
        message: 'Multiple exclamation marks.',
        evidence: [id],
        fix: 'Keep at most one exclamation mark in the whole creative.'
      });
    }

    for (const finding of scanClaims(allText)) {
      add({ ...finding, evidence: [id, ...finding.evidence] });
    }

    const hookAnalysis = analyzeHook(hook);
    if (hookAnalysis.score < 2) {
      add({
        code: 'CREATIVE_WEAK_HOOK',
        severity: 'medium',
        message: 'Hook carries fewer than two of the six hook signals.',
        evidence: [id, hook.slice(0, 120), `score ${hookAnalysis.score}/7`],
        fix: 'Add a specific number, a named pain, or an audience callout in the first line.'
      });
    }
    if (hookAnalysis.words > 22) {
      add({
        code: 'CREATIVE_HOOK_LONG',
        severity: 'low',
        message: 'Hook is too long for a first line.',
        evidence: [id, `${hookAnalysis.words} words`],
        fix: 'Compress to 6-14 words.'
      });
    }

    if (platform === 'meta') {
      if (!cta.trim()) {
        add({
          code: 'CREATIVE_NO_CTA',
          severity: 'high',
          message: 'Meta creative has no CTA.',
          evidence: [id],
          fix: `Choose one: ${META_CTAS.slice(0, 5).join(', ')}.`
        });
      } else if (!META_CTAS.map((item) => item.toLowerCase()).includes(cta.toLowerCase())) {
        add({
          code: 'CREATIVE_CTA_UNKNOWN',
          severity: 'low',
          message: 'CTA is not a supported Meta button label.',
          evidence: [id, cta],
          fix: `Use a native label such as "${META_CTAS[0]}" so the button renders.`
        });
      }
    }

    if (Number.isFinite(Number(pack.price))) {
      const catalogPrice = Number(pack.price);
      const mismatched = priceMentions(allText).filter((amount) => (
        amount !== catalogPrice && amount >= catalogPrice * 0.5 && amount <= catalogPrice * 5
      ));
      if (mismatched.length) {
        add({
          code: 'CREATIVE_PRICE_MISMATCH',
          severity: 'medium',
          message: 'Creative quotes a price that differs from the catalog price.',
          evidence: [id, `catalog ₹${Number(pack.price).toLocaleString('en-IN')}`, `ads ${mismatched.join(', ')}`],
          fix: 'Match the landing page exactly, or label a crossed-out anchor price explicitly.'
        });
      }
    }

    if (hasDevanagari(allText) && !['hi', 'hi-en', 'hinglish'].includes(String(creative.language || '').toLowerCase())) {
      add({
        code: 'CREATIVE_LANGUAGE_UNDECLARED',
        severity: 'low',
        message: 'Devanagari copy is not labelled with a language.',
        evidence: [id],
        fix: 'Set language to "hi" or "hi-en" so reviewers can check the translation.'
      });
    }

    const normalizedPrimary = NORMALIZE(primary);
    if (normalizedPrimary && seenPrimary.includes(normalizedPrimary)) {
      add({
        code: 'CREATIVE_DUPLICATE_PRIMARY',
        severity: 'medium',
        message: 'Duplicate primary text across creatives.',
        evidence: [id],
        fix: 'Give each test cell a distinct angle; duplicates waste budget.'
      });
    }
    if (normalizedPrimary) seenPrimary.push(normalizedPrimary);

    const normalizedHeadline = NORMALIZE(headline);
    if (normalizedHeadline && seenHeadlines.includes(normalizedHeadline)) {
      add({
        code: 'CREATIVE_DUPLICATE_HEADLINE',
        severity: 'low',
        message: 'Duplicate headline across creatives.',
        evidence: [id],
        fix: 'Vary the promise, not just the punctuation.'
      });
    }
    if (normalizedHeadline) seenHeadlines.push(normalizedHeadline);
  });

  (pack.ugcScripts || []).forEach((script, index) => {
    const id = script.id || `U${index + 1}`;
    const dialogue = String(script.dialogue || '');
    const duration = Number(script.durationSeconds || 0);
    const words = WORDS(dialogue).length;

    if (duration > 60) {
      add({
        code: 'UGC_TOO_LONG',
        severity: 'medium',
        message: 'UGC script runs longer than 60 seconds.',
        evidence: [id, `${duration}s`],
        fix: 'Cut to 15-45 seconds; keep one idea and one CTA.'
      });
    }
    if (duration > 0 && words / duration > 3.5) {
      add({
        code: 'UGC_TOO_FAST',
        severity: 'medium',
        message: 'Dialogue is too dense for the runtime.',
        evidence: [id, `${words} words in ${duration}s`],
        fix: 'Target 2.5-3 words per second so the voiceover sounds human.'
      });
    }
    if (!String(script.hook || '').trim()) {
      add({
        code: 'UGC_NO_HOOK',
        severity: 'high',
        message: 'UGC script has no hook line.',
        evidence: [id],
        fix: 'Add a spoken hook in the first two seconds.'
      });
    }
    if (!String(script.cta || '').trim()) {
      add({
        code: 'UGC_NO_CTA',
        severity: 'high',
        message: 'UGC script has no CTA.',
        evidence: [id],
        fix: 'End with one action the viewer can take immediately.'
      });
    }
    for (const finding of scanClaims([script.hook, dialogue, script.cta].join('\n'))) {
      add({ ...finding, evidence: [id, ...finding.evidence] });
    }
  });

  findings.sort((a, b) => {
    const bySeverity = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return bySeverity !== 0 ? bySeverity : a.id.localeCompare(b.id);
  });

  const score = scoreFindings(findings);
  result.findings = findings;
  result.summary = {
    score,
    verdict: verdictFor(score),
    critical: findings.filter((item) => item.severity === 'critical').length,
    high: findings.filter((item) => item.severity === 'high').length,
    medium: findings.filter((item) => item.severity === 'medium').length,
    low: findings.filter((item) => item.severity === 'low').length,
    creatives: (pack.creatives || []).length,
    ugcScripts: (pack.ugcScripts || []).length
  };
  return result;
}

export function renderMarkdown(result) {
  const lines = [
    `# Ad Creative Audit — ${result.product || result.brand || 'Untitled'}`,
    '',
    `**Score:** ${result.summary.score}/100 · **Verdict:** ${result.summary.verdict}`,
    '',
    `Critical ${result.summary.critical} · High ${result.summary.high} · Medium ${result.summary.medium} · Low ${result.summary.low}`,
    '',
    '## Findings',
    ''
  ];
  if (!result.findings.length) {
    lines.push('No findings. Copy passed every deterministic check.');
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
    '- Platform policy review is automated text matching, not a legal opinion.',
    '- Landing page speed, tracking accuracy and real CPA are out of scope.',
    '- Claims about health, finance or medical outcomes need a human reviewer.'
  );
  return `${lines.join('\n')}\n`;
}

const FORMAT_PLATFORMS = {
  ugc_9x16: ['meta'],
  static_4x5: ['meta'],
  carousel_4x5: ['meta'],
  video_9x16: ['meta', 'google'],
  search_rsa: ['google'],
  demand_gen: ['google']
};

function round100(value) {
  return Math.max(0, Math.round(value / 100) * 100);
}

export function planTestMatrix(brief, overrides = {}) {
  const budget = Number(overrides.budget ?? brief.budget ?? 30000);
  const days = Number(overrides.days ?? brief.days ?? 21);
  const platforms = (Array.isArray(brief.platforms) && brief.platforms.length ? brief.platforms : ['meta'])
    .map((item) => String(item).toLowerCase());
  const angles = Array.isArray(brief.angles) && brief.angles.length
    ? brief.angles
    : [{ id: 'A1', name: 'Core promise', hypothesis: 'Lead with the outcome.' }];
  const formats = Array.isArray(brief.formats) && brief.formats.length
    ? brief.formats
    : ['ugc_9x16', 'static_4x5'];
  const price = Number(brief.price || 0);
  const margin = Number(brief.margin ?? 0.9);
  const cpc = Number(brief.cpc ?? 18);
  const cvr = Number(brief.cvr ?? 0.02);

  const platformWeight = platforms.length === 1
    ? { [platforms[0]]: 1 }
    : platforms.reduce((acc, platform, index) => {
      acc[platform] = platform === 'meta' ? 0.65 : 1 - (platforms.includes('meta') ? 0.65 : 0);
      if (platforms.length > 2) acc[platform] = 1 / platforms.length;
      return acc;
    }, {});

  const cells = [];
  for (const platform of platforms) {
    const applicable = formats.filter((format) => (FORMAT_PLATFORMS[format] || ['meta']).includes(platform));
    const usableFormats = applicable.length ? applicable : ['static_4x5'];
    const share = platformWeight[platform] || 1 / platforms.length;
    const perCell = (budget * share) / (angles.length * usableFormats.length);
    for (const angle of angles) {
      for (const format of usableFormats) {
        cells.push({
          platform,
          angleId: angle.id,
          angle: angle.name,
          hypothesis: angle.hypothesis || '',
          format,
          budget: round100(perCell)
        });
      }
    }
  }

  const allocated = cells.reduce((sum, cell) => sum + cell.budget, 0);
  const remainder = Math.round(budget - allocated);
  if (cells.length) cells[0].budget += remainder;

  const breakEvenCPA = Number((price * margin).toFixed(2));
  const projectedClicks = cpc > 0 ? Math.round(budget / cpc) : 0;
  const projectedSales = Math.round(projectedClicks * cvr * 10) / 10;
  const projectedRevenue = Math.round(projectedSales * price);
  const roas = budget > 0 ? Math.round((projectedRevenue / budget) * 100) / 100 : 0;

  const warnings = [];
  const smallestCell = Math.min(...cells.map((cell) => cell.budget));
  if (smallestCell < cpc * 30) {
    warnings.push(`Smallest cell is ₹${smallestCell}; under 30 clicks it cannot produce a read. Reduce variants or raise budget.`);
  }
  if (roas < 1) {
    warnings.push(`Projected ROAS is ${roas}× at ${(cvr * 100).toFixed(1)}% CVR. This is a learning test, not a scale budget.`);
  }
  if (days < 14) warnings.push('Fewer than 14 days will not clear the learning phase on Meta.');
  if (margin < 0.5) warnings.push('Margin below 50% leaves almost no room for paid acquisition.');
  if (!price) warnings.push('No price supplied, so break-even CPA cannot be computed.');

  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    product: brief.product || null,
    budget,
    days,
    daily: Math.round(budget / Math.max(1, days)),
    price,
    margin,
    breakEvenCPA,
    assumptions: { cpc, cvr },
    projected: {
      clicks: projectedClicks,
      sales: projectedSales,
      revenue: projectedRevenue,
      roas
    },
    cells,
    decisionRules: [
      'Days 0-3: do not edit. Only add negative keywords or exclude junk placements.',
      'Kill a cell after 1,000 impressions and CTR below 0.8%, or spend above 1.5× break-even CPA with zero sales.',
      'Scale a winning cell by 20% every 3 days, never by doubling overnight.',
      'Judge creative on hook rate (3-second views ÷ impressions), not on likes.',
      'Replace a fatigued ad when frequency passes 2.5 in 7 days or CTR drops 30% week over week.'
    ],
    warnings
  };
}

export function renderPlan(plan) {
  const lines = [
    `# Creative Test Matrix — ${plan.product || 'Untitled'}`,
    '',
    `Budget ₹${plan.budget.toLocaleString('en-IN')} · ${plan.days} days · ₹${plan.daily.toLocaleString('en-IN')}/day`,
    `Break-even CPA ₹${plan.breakEvenCPA.toLocaleString('en-IN')} · Projected ROAS ${plan.projected.roas}×`,
    '',
    '| Platform | Angle | Format | Budget |',
    '| --- | --- | --- | --- |',
    ...plan.cells.map((cell) => `| ${cell.platform} | ${cell.angle} | ${cell.format} | ₹${cell.budget.toLocaleString('en-IN')} |`),
    '',
    '## Decision rules',
    '',
    ...plan.decisionRules.map((rule) => `- ${rule}`),
    '',
    '## Warnings',
    '',
    ...(plan.warnings.length ? plan.warnings.map((warning) => `- ${warning}`) : ['- None.']),
    '',
    '## Assumptions',
    '',
    `CPC ₹${plan.assumptions.cpc} and CVR ${(plan.assumptions.cvr * 100).toFixed(1)}% are planning inputs, not measured results. Replace them after 7 days of real data.`
  ];
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
