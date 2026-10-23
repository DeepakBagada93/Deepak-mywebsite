// Content Repurpose Engine — deterministic planner and audit rules.
// Pure Node, zero dependencies.

export const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
export const SEVERITY_WEIGHT = { critical: 20, high: 12, medium: 6, low: 2 };

export const PLATFORM_SPECS = {
  instagram: {
    label: 'Instagram',
    bodyMax: 2200,
    hookMax: 125,
    hashtagsMax: 8,
    weight: 8,
    formats: ['reel_9x16', 'carousel_4x5', 'static_4x5'],
    ctaStyle: 'save, share or comment'
  },
  linkedin: {
    label: 'LinkedIn',
    bodyMax: 3000,
    hookMax: 210,
    hashtagsMax: 5,
    weight: 6,
    formats: ['text', 'carousel_4x5', 'document'],
    ctaStyle: 'comment or repost'
  },
  x: {
    label: 'X',
    bodyMax: 280,
    hookMax: 280,
    hashtagsMax: 3,
    weight: 6,
    formats: ['post', 'thread'],
    ctaStyle: 'reply or bookmark'
  },
  youtube_shorts: {
    label: 'YouTube Shorts',
    bodyMax: 6000,
    hookMax: 100,
    hashtagsMax: 3,
    weight: 4,
    formats: ['short_9x16'],
    ctaStyle: 'subscribe or watch next'
  },
  newsletter: {
    label: 'Newsletter',
    bodyMax: 9000,
    hookMax: 50,
    hashtagsMax: 0,
    weight: 3,
    formats: ['email'],
    ctaStyle: 'one reply or click'
  },
  blog: {
    label: 'Blog',
    bodyMax: 18000,
    hookMax: 60,
    hashtagsMax: 0,
    weight: 3,
    formats: ['article'],
    ctaStyle: 'read the full piece'
  }
};

export const ANGLES = [
  { id: 'contrarian', label: 'Contrarian', pillar: 'opinion', formula: 'Unpopular take: {topic}.' },
  { id: 'mistake', label: 'Mistake', pillar: 'education', formula: 'The {audience} mistake: {topic}.' },
  { id: 'howto', label: 'How-to', pillar: 'education', formula: 'How to fix this: {topic}.' },
  { id: 'proof', label: 'Proof', pillar: 'proof', formula: 'Tested: {topic}.' },
  { id: 'story', label: 'Story', pillar: 'behind_the_scenes', formula: 'I learned this the hard way: {topic}.' },
  { id: 'teardown', label: 'Teardown', pillar: 'proof', formula: 'Teardown: {topic}.' },
  { id: 'listicle', label: 'Listicle', pillar: 'education', formula: '5 things about {topic}.' }
];

export const BANNED_PHRASES = [
  'in today\u2019s fast-paced world',
  "in today's fast-paced world",
  'delve into',
  'unlock the power',
  'game-changer',
  'game changer',
  'elevate your',
  'unleash',
  'tapestry',
  'navigate the landscape',
  'it is important to note',
  "it's important to note",
  'at the end of the day',
  'revolutionize',
  'supercharge',
  'skyrocket',
  'leverage synergies',
  'in conclusion',
  'needless to say'
];

export const CTA_MARKERS = [
  'comment', 'save this', 'share', 'bookmark', 'reply', 'download',
  'get the', 'read the', 'subscribe', 'join', 'dm ', 'link in bio', 'try '
];

const NORMALIZE = (text) => String(text || '')
  .toLowerCase()
  .replace(/[^a-z0-9\u0900-\u097F]+/g, ' ')
  .trim();

function words(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean);
}

export function charCount(text) {
  return [...String(text || '')].length;
}

export function shingles(text, size = 5) {
  const list = NORMALIZE(text).split(' ').filter(Boolean);
  if (list.length < size) return new Set(list);
  const out = new Set();
  for (let i = 0; i <= list.length - size; i += 1) out.add(list.slice(i, i + size).join(' '));
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

function largestRemainder(total, entries) {
  const sum = entries.reduce((acc, entry) => acc + entry.weight, 0);
  const raw = entries.map((entry) => ({ ...entry, exact: (entry.weight / sum) * total }));
  const counts = raw.map((entry) => ({ ...entry, count: Math.floor(entry.exact) }));
  let assigned = counts.reduce((acc, entry) => acc + entry.count, 0);
  const order = [...counts].sort((a, b) => (b.exact - b.count) - (a.exact - a.count));
  let index = 0;
  while (assigned < total && order.length) {
    order[index % order.length].count += 1;
    assigned += 1;
    index += 1;
  }
  return counts;
}

const STOP_TAIL = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'not',
  'in', 'on', 'at', 'to', 'of', 'for', 'with', 'without', 'that', 'when', 'from',
  'by', 'as', 'it', 'its', 'this', 'these', 'those', 'into', 'turn', 'turns', 'one'
]);

function trimTail(list) {
  const out = [...list];
  while (out.length > 1 && STOP_TAIL.has(out[out.length - 1].toLowerCase().replace(/[^a-z]/g, ''))) {
    out.pop();
  }
  return out;
}

export function shortTopic(text, max = 9) {
  return trimTail(words(text).slice(0, max)).join(' ').replace(/[.,;:]$/, '');
}

export function splitThread(body) {
  return String(body || '').split(/\n\n---\n\n/).map((part) => part.trim()).filter(Boolean);
}

function addDays(startDate, index) {
  const start = new Date(`${startDate}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() + index);
  return start.toISOString().slice(0, 10);
}

export function buildContentPlan(source, overrides = {}) {
  const days = Number(overrides.days ?? source.days ?? 30);
  const requested = Array.isArray(source.platforms) && source.platforms.length
    ? source.platforms.map((item) => String(item).toLowerCase())
    : Object.keys(PLATFORM_SPECS);
  const platforms = requested.filter((item) => PLATFORM_SPECS[item]);
  const insights = Array.isArray(source.insights) && source.insights.length
    ? source.insights.map((item, index) => (typeof item === 'string'
      ? { id: `I${index + 1}`, text: item }
      : { id: item.id || `I${index + 1}`, text: item.text, pillar: item.pillar }))
    : [{ id: 'I1', text: source.thesis || source.source?.title || 'The core idea' }];

  if (!platforms.length) throw new Error('No supported platforms selected.');

  const counts = largestRemainder(days, platforms.map((platform) => ({
    platform,
    weight: PLATFORM_SPECS[platform].weight
  })));
  const queue = [];
  for (const entry of counts) {
    for (let i = 0; i < entry.count; i += 1) queue.push(entry.platform);
  }
  const stride = 7;
  const schedule = queue.map((_, index) => queue[(index * stride) % queue.length]);

  const audience = source.audience || 'founders';
  const audienceShort = trimTail(words(audience).slice(0, 3)).join(' ');
  const currency = source.currency === 'INR' || !source.currency ? '₹1,499' : source.currency;
  const offer = source.offer || {};
  const languages = Array.isArray(source.languages) && source.languages.length ? source.languages : ['en'];
  const startDate = source.startDate || new Date().toISOString().slice(0, 10);

  const used = new Set();
  const items = [];

  for (let index = 0; index < days; index += 1) {
    const platform = schedule[index];
    const spec = PLATFORM_SPECS[platform];
    const insight = insights[index % insights.length];
    const topic = shortTopic(insight.text);

    let angle = ANGLES[(index + platforms.indexOf(platform)) % ANGLES.length];
    let guard = 0;
    while (used.has(`${platform}|${insight.id}|${angle.id}`) && guard < ANGLES.length) {
      angle = ANGLES[(ANGLES.indexOf(angle) + 1) % ANGLES.length];
      guard += 1;
    }
    used.add(`${platform}|${insight.id}|${angle.id}`);

    const format = spec.formats[index % spec.formats.length];
    const draftHook = angle.formula
      .replace('{topic}', topic)
      .replace('{audience}', audienceShort)
      .replace('{currency}', currency);
    const offerPrice = offer.price ? `₹${Number(offer.price).toLocaleString('en-IN')}` : currency;

    const ctaBase = platform === 'instagram' ? 'Save this for your next launch.'
      : platform === 'linkedin' ? 'Which of these is true for your team? Comment below.'
        : platform === 'x' ? 'Bookmark this for later.'
          : platform === 'youtube_shorts' ? 'Subscribe for the next teardown.'
            : platform === 'newsletter' ? 'Reply with your biggest blocker and I will answer it next week.'
              : 'Read the full breakdown on the blog.';

    items.push({
      day: index + 1,
      date: addDays(startDate, index),
      platform,
      format,
      insightId: insight.id,
      angleId: angle.id,
      angle: angle.label,
      pillar: insight.pillar || angle.pillar,
      language: languages[index % languages.length],
      draftHook,
      topic,
      cta: offer.name && index % 6 === 5
        ? `${ctaBase} ${offer.name} — ${offerPrice}.`
        : ctaBase,
      offerMention: index % 6 === 5
    });
  }

  const coverage = insights.map((insight) => ({
    insightId: insight.id,
    uses: items.filter((item) => item.insightId === insight.id).length
  }));

  const pillars = {};
  for (const item of items) pillars[item.pillar] = (pillars[item.pillar] || 0) + 1;

  const warnings = [];
  for (const entry of coverage) {
    if (entry.uses === 0) warnings.push(`${entry.insightId} is never used.`);
  }
  if (days < insights.length) warnings.push('Fewer days than insights; some insights cannot appear.');
  if (items.filter((item) => item.offerMention).length === 0) {
    warnings.push('No offer mention in the plan; add one CTA per week at minimum.');
  }

  return {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    source: {
      title: source.source?.title || source.title || 'Untitled source',
      thesis: source.thesis || '',
      url: source.source?.url || null
    },
    audience,
    goal: source.goal || 'audience',
    offer: offer.name ? offer : null,
    days,
    startDate,
    platforms,
    items,
    coverage,
    pillars,
    rules: [
      'One idea per piece. If a post needs a second idea, it becomes two posts.',
      'Hook goes in the first line; the platform preview cuts everything else.',
      'Every piece has exactly one CTA, matched to the platform.',
      'Do not paste the same text to two platforms. Rewrite for the format.',
      'Reply to every comment for the first 60 minutes after posting.',
      'Review weekly: double the format with the highest saves or replies, drop the lowest.'
    ],
    warnings
  };
}

function baseAudit(pack) {
  return {
    schemaVersion: '1.0',
    checkedAt: new Date().toISOString(),
    sourceTitle: pack.sourceTitle || null,
    findings: [],
    summary: {}
  };
}

export function auditContentPack(pack) {
  const result = baseAudit(pack);
  const findings = [];
  let counter = 0;
  const add = (finding) => {
    counter += 1;
    findings.push({ id: `F${String(counter).padStart(3, '0')}`, ...finding });
  };

  const pieces = Array.isArray(pack.pieces) ? pack.pieces : [];
  if (!pieces.length) {
    add({
      code: 'PACK_EMPTY',
      severity: 'critical',
      message: 'No content pieces supplied.',
      evidence: [],
      fix: 'Add at least one piece with platform, hook, body and cta.'
    });
  }

  const seenTriples = new Set();

  pieces.forEach((piece, index) => {
    const id = piece.id || `P${index + 1}`;
    const platform = String(piece.platform || '').toLowerCase();
    const spec = PLATFORM_SPECS[platform];

    if (!spec) {
      add({
        code: 'PIECE_PLATFORM',
        severity: 'high',
        message: `Unsupported platform "${piece.platform}".`,
        evidence: [id],
        fix: `Use one of: ${Object.keys(PLATFORM_SPECS).join(', ')}.`
      });
      return;
    }

    const hook = String(piece.hook || '');
    const body = String(piece.body || '');
    const cta = String(piece.cta || '');
    const hashtags = Array.isArray(piece.hashtags) ? piece.hashtags : [];
    const text = `${hook}\n${body}\n${cta}`;

    if (!hook.trim()) {
      add({
        code: 'PIECE_NO_HOOK',
        severity: 'high',
        message: 'Piece has no hook.',
        evidence: [id],
        fix: 'Write one line that works before the "see more" cut.'
      });
    } else if (charCount(hook) > spec.hookMax) {
      add({
        code: 'PIECE_HOOK_LENGTH',
        severity: 'medium',
        message: `Hook exceeds the ${spec.label} preview length.`,
        evidence: [id, `${charCount(hook)}/${spec.hookMax}`],
        fix: 'Shorten the first line; move the rest into the body.'
      });
    }

    const bodyLimit = spec.bodyMax;
    if (platform === 'x' && String(piece.format || '') === 'thread') {
      const segments = splitThread(body);
      if (segments.length < 2) {
        add({
          code: 'PIECE_THREAD_FORMAT',
          severity: 'medium',
          message: 'Thread format needs at least two segments separated by a blank line and ---.',
          evidence: [id],
          fix: 'Split the thread into segments of 280 characters or fewer.'
        });
      }
      segments.forEach((segment, segmentIndex) => {
        if (charCount(segment) > 280) {
          add({
            code: 'PIECE_SEGMENT_LENGTH',
            severity: 'high',
            message: `Thread segment ${segmentIndex + 1} exceeds 280 characters.`,
            evidence: [id, `${charCount(segment)}/280`],
            fix: 'Cut or merge the segment.'
          });
        }
      });
    } else if (charCount(body) > bodyLimit) {
      add({
        code: 'PIECE_BODY_LENGTH',
        severity: platform === 'x' ? 'high' : 'medium',
        message: `Body exceeds the ${spec.label} limit.`,
        evidence: [id, `${charCount(body)}/${bodyLimit}`],
        fix: 'Trim the piece or split it into a thread or carousel.'
      });
    }

    if (!cta.trim()) {
      add({
        code: 'PIECE_NO_CTA',
        severity: 'high',
        message: 'Piece has no call to action.',
        evidence: [id],
        fix: `End with one ${spec.ctaStyle} line.`
      });
    } else if (charCount(cta) > 140) {
      add({
        code: 'PIECE_CTA_LONG',
        severity: 'low',
        message: 'CTA is longer than a single instruction.',
        evidence: [id, `${charCount(cta)}/140`],
        fix: 'Keep one action; move the explanation into the body.'
      });
    }

    if (hashtags.length > spec.hashtagsMax) {
      add({
        code: 'PIECE_HASHTAGS',
        severity: 'low',
        message: 'Too many hashtags for this platform.',
        evidence: [id, `${hashtags.length}/${spec.hashtagsMax}`],
        fix: 'Use a small set of specific tags, or none.'
      });
    }

    const lower = text.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (lower.includes(phrase)) {
        add({
          code: 'PIECE_AI_PHRASE',
          severity: 'medium',
          message: `Contains the AI-tell phrase "${phrase}".`,
          evidence: [id],
          fix: 'Replace it with a plain sentence a person would say out loud.'
        });
      }
    }

    const links = (text.match(/https?:\/\//g) || []).length;
    if (links > 2) {
      add({
        code: 'PIECE_LINK_DUMP',
        severity: 'medium',
        message: 'More than two links in one piece.',
        evidence: [id, String(links)],
        fix: 'Keep one primary link and move the rest to a follow-up.'
      });
    }

    if (/[\u0900-\u097F]/.test(text) && !['hi', 'hi-en', 'hinglish'].includes(String(piece.language || '').toLowerCase())) {
      add({
        code: 'PIECE_LANGUAGE_UNDECLARED',
        severity: 'low',
        message: 'Devanagari copy is not labelled with a language.',
        evidence: [id],
        fix: 'Set language to "hi" or "hi-en".'
      });
    }

    if (piece.insightId && piece.angleId) {
      const triple = `${platform}|${piece.insightId}|${piece.angleId}`;
      if (seenTriples.has(triple)) {
        add({
          code: 'PIECE_DUPLICATE_CELL',
          severity: 'medium',
          message: 'Same platform, insight and angle repeated.',
          evidence: [id, triple],
          fix: 'Change the angle or the insight so the piece earns its slot.'
        });
      }
      seenTriples.add(triple);
    }

    if (platform === 'blog') {
      if (charCount(piece.seoTitle || '') > 60) {
        add({
          code: 'PIECE_SEO_TITLE',
          severity: 'medium',
          message: 'SEO title exceeds 60 characters.',
          evidence: [id, `${charCount(piece.seoTitle)}/60`],
          fix: 'Shorten the title; keep the keyword first.'
        });
      }
      if (charCount(piece.metaDescription || '') > 155) {
        add({
          code: 'PIECE_META_DESCRIPTION',
          severity: 'low',
          message: 'Meta description exceeds 155 characters.',
          evidence: [id, `${charCount(piece.metaDescription)}/155`],
          fix: 'Rewrite to 140-155 characters with the outcome and the keyword.'
        });
      }
    }
  });

  for (let i = 0; i < pieces.length; i += 1) {
    for (let j = i + 1; j < pieces.length; j += 1) {
      const a = pieces[i];
      const b = pieces[j];
      if (a.platform === b.platform && a.body === b.body && a.body) continue;
      const score = similarity(String(a.body || ''), String(b.body || ''));
      if (score >= 0.7) {
        add({
          code: 'PIECE_CROSS_POST_DUPLICATE',
          severity: 'high',
          message: 'Two pieces are near-identical across platforms.',
          evidence: [a.id || `P${i + 1}`, b.id || `P${j + 1}`, score.toFixed(2)],
          fix: 'Rewrite the second piece in that platform\'s native format; do not paste and reformat.'
        });
        break;
      }
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
    verdict: score >= 90 ? 'READY TO PUBLISH' : score >= 70 ? 'NEEDS FIXES' : 'DO NOT PUBLISH',
    critical: findings.filter((item) => item.severity === 'critical').length,
    high: findings.filter((item) => item.severity === 'high').length,
    medium: findings.filter((item) => item.severity === 'medium').length,
    low: findings.filter((item) => item.severity === 'low').length,
    pieces: pieces.length
  };
  return result;
}

export function renderAudit(result) {
  const lines = [
    `# Content Pack Audit — ${result.sourceTitle || 'Untitled'}`,
    '',
    `**Score:** ${result.summary.score}/100 · **Verdict:** ${result.summary.verdict}`,
    '',
    `Critical ${result.summary.critical} · High ${result.summary.high} · Medium ${result.summary.medium} · Low ${result.summary.low}`,
    '',
    '## Findings',
    ''
  ];
  if (!result.findings.length) {
    lines.push('No findings. Every piece passed the platform and originality checks.');
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
    '- Whether the idea is true, useful or interesting.',
    '- Brand voice, visual design and video execution.',
    '- Algorithmic reach, follower growth or revenue.'
  );
  return `${lines.join('\n')}\n`;
}

export function renderPlan(plan) {
  const lines = [
    `# ${plan.days}-Day Content Plan — ${plan.source.title}`,
    '',
    `Audience: ${plan.audience} · Goal: ${plan.goal} · Start: ${plan.startDate}`,
    '',
    '| Day | Date | Platform | Format | Angle | Insight | Draft hook |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...plan.items.map((item) => (
      `| ${item.day} | ${item.date} | ${item.platform} | ${item.format} | ${item.angle} | ${item.insightId} | ${item.draftHook} |`
    )),
    '',
    '## Pillars',
    '',
    ...Object.entries(plan.pillars).map(([pillar, count]) => `- ${pillar}: ${count}`),
    '',
    '## Coverage',
    '',
    ...plan.coverage.map((entry) => `- ${entry.insightId}: ${entry.uses} piece(s)`),
    '',
    '## Operating rules',
    '',
    ...plan.rules.map((rule) => `- ${rule}`),
    '',
    '## Warnings',
    '',
    ...(plan.warnings.length ? plan.warnings.map((warning) => `- ${warning}`) : ['- None.'])
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
