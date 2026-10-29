// UGC Ad Studio — shared engine (zero dependencies, Node 20+)

export const SCHEMA_VERSION = '1.0.0';

export const VIDEO_MODELS = {
  'veo-3.1-flow': { label: 'Google Flow / Veo 3.1', maxClip: 8, nativeAudio: true, supportsNegative: true, supportsSeed: true },
  'kling-2.5': { label: 'Kling 2.5', maxClip: 10, nativeAudio: true, supportsNegative: true, supportsSeed: true },
  'runway-gen4': { label: 'Runway Gen-4', maxClip: 10, nativeAudio: false, supportsNegative: true, supportsSeed: true },
  'hailuo-02': { label: 'Hailuo 02', maxClip: 10, nativeAudio: false, supportsNegative: true, supportsSeed: true },
  'luma-ray3': { label: 'Luma Ray3', maxClip: 10, nativeAudio: false, supportsNegative: true, supportsSeed: true },
  'pixverse-v5': { label: 'PixVerse V5', maxClip: 8, nativeAudio: true, supportsNegative: true, supportsSeed: true }
};

export const IMAGE_MODELS = [
  'nano-banana-pro',
  'midjourney-v7',
  'flux-1.1-pro',
  'imagen-4'
];

export const ASPECTS = ['9:16', '4:5', '1:1', '16:9'];

export const STYLES = {
  'ugc-testimonial': {
    id: 'ugc-testimonial',
    label: 'UGC testimonial · front-camera',
    mode: 'ugc',
    promptLead: 'Authentic vertical UGC testimonial shot on a phone, front-camera selfie realism',
    imageLead: 'Authentic UGC-style photograph, candid phone-camera realism',
    setting: 'a lived-in apartment bedroom with a made bed, a plant and soft window light',
    lighting: 'soft natural window light from the left, no studio setup, gentle shadow falloff',
    camera: "handheld front-camera selfie at arm's length, 24mm phone lens, gentle natural sway, eye-level",
    grade: 'Grade: natural unedited phone-camera color, true-to-life skin tones, soft contrast, subtle sensor noise.',
    craft: 'Craft: shot on a modern flagship phone rear camera, 26mm equivalent, f/1.8, natural available light, realistic skin texture with visible pores, no beauty filter, no studio gloss.',
    realism: 'Authentic user-generated look: real home, imperfect framing, available light, phone-camera depth of field, no set dressing, no actors-in-a-studio feel.',
    disclosureRequired: true
  },
  'ugc-demo': {
    id: 'ugc-demo',
    label: 'UGC demo · hands-only',
    mode: 'ugc',
    promptLead: 'Authentic vertical UGC product demo shot on a phone, hands-only close-up realism',
    imageLead: 'Authentic UGC-style product photograph, hands-on phone-camera realism',
    setting: 'a bright kitchen counter with a cutting board, a glass of water and morning light',
    lighting: 'soft diffused morning window light, clean but not studio-perfect',
    camera: 'handheld phone camera, 26mm rear lens, close focus on hands and product, slight natural micro-shake',
    grade: 'Grade: natural phone-camera color, clean whites, true-to-life product color, subtle sensor noise.',
    craft: 'Craft: shot on a modern flagship phone rear camera, 26mm equivalent, f/1.8, available light, realistic skin texture and product surface detail, no beauty filter.',
    realism: 'Authentic user-generated look: real counter, small imperfections, hands entering frame naturally, no studio gloss.',
    disclosureRequired: true
  },
  'cinematic-product': {
    id: 'cinematic-product',
    label: 'Cinematic product film',
    mode: 'cinematic',
    promptLead: 'Premium cinematic vertical product film, large-format commercial quality',
    imageLead: 'Premium cinematic product photograph, large-format commercial quality',
    setting: 'a minimal concrete studio with a single stone plinth and a controlled fall-off background',
    lighting: 'one large soft key from the left with a warm rim light, deep controlled shadows',
    camera: 'slow dolly-in on a stabilized gimbal, 50mm anamorphic-style lens, shallow depth of field, deliberate tempo',
    grade: 'Grade: cinematic teal-and-orange, cool shadows, warm product highlights, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain.',
    craft: 'Craft: shot on a large-format digital cinema camera, 50mm anamorphic-style lens, f/2.0, controlled studio lighting, rich dynamic range, premium film grain, no warping.',
    realism: 'Premium commercial look: deliberate camera motion, controlled reflections, clean surfaces, no visual artifacts.',
    disclosureRequired: false
  },
  'street-interview': {
    id: 'street-interview',
    label: 'Street interview',
    mode: 'ugc',
    promptLead: 'Authentic vertical street-interview clip, documentary phone-camera realism',
    imageLead: 'Authentic documentary street-interview photograph, phone-camera realism',
    setting: 'a busy city pavement at golden hour with soft background pedestrians and storefronts',
    lighting: 'warm low golden-hour side light with gentle ambient fill from the street',
    camera: 'handheld phone camera at chest height, 26mm lens, subject framed mid-shot, natural crowd movement behind',
    grade: 'Grade: warm golden documentary color, soft highlights, natural skin tones, light grain.',
    craft: 'Craft: shot on a modern flagship phone, 26mm equivalent, f/1.8, available golden-hour light, realistic skin texture, no beauty filter.',
    realism: 'Authentic documentary look: real street, imperfect framing, background motion, no staged studio feel.',
    disclosureRequired: true
  },
  'founder-story': {
    id: 'founder-story',
    label: 'Founder story · talking head',
    mode: 'ugc',
    promptLead: 'Authentic vertical founder-story video, office talking-head realism',
    imageLead: 'Authentic founder portrait, natural office light, phone-camera realism',
    setting: 'a small founder office with a whiteboard, a laptop and a shelf of product samples',
    lighting: 'soft window key from the side with a warm desk lamp fill, natural shadows',
    camera: 'handheld phone camera at eye level, 35mm lens, medium shot, subtle natural sway',
    grade: 'Grade: natural warm office color, true-to-life skin tones, soft contrast, subtle grain.',
    craft: 'Craft: shot on a modern flagship phone, 35mm equivalent, f/1.8, mixed available light, realistic skin texture, no beauty filter.',
    realism: 'Authentic founder-video look: real office, imperfect framing, natural gestures, no teleprompter stiffness.',
    disclosureRequired: true
  },
  'before-after': {
    id: 'before-after',
    label: 'Before / after · compliant',
    mode: 'ugc',
    promptLead: 'Authentic vertical before-and-after UGC clip, identical phone-camera setup in both states',
    imageLead: 'Authentic before-and-after style photograph, identical lighting and framing',
    setting: 'the same bathroom counter with the same window light for both states',
    lighting: 'identical soft window light in both states, same time of day, same camera position',
    camera: 'locked-off phone camera on a small tripod, 26mm lens, identical framing and distance',
    grade: 'Grade: natural phone-camera color, identical grade in both states, true-to-life skin tones.',
    craft: 'Craft: shot on a modern flagship phone on a tripod, 26mm equivalent, f/1.8, identical available light, realistic skin texture, no retouching.',
    realism: 'Compliant comparison look: identical light, identical framing, no retouching, no exaggerated change.',
    disclosureRequired: true
  }
};

const BANNED_CLAIMS = [
  { pattern: /\b100\s?%/i, label: 'absolute claim (100%)' },
  { pattern: /\bguarantee(d|s)?\b/i, label: 'guarantee language' },
  { pattern: /\bcures?\b/i, label: 'cure claim' },
  { pattern: /\binstantly\b/i, label: 'instant-result claim' },
  { pattern: /\b#1\b/, label: 'number-one claim' },
  { pattern: /\bclinically proven\b/i, label: 'clinical-proof claim' },
  { pattern: /\bfda[- ]approved\b/i, label: 'regulatory claim' },
  { pattern: /\bmiracle\b/i, label: 'miracle claim' },
  { pattern: /\brisk[- ]free\b/i, label: 'risk-free claim' },
  { pattern: /\bdoctors? recommend\b/i, label: 'medical endorsement claim' },
  { pattern: /\bpermanent(ly)?\b/i, label: 'permanence claim' }
];

const FAKE_URGENCY = [
  /\bonly \d+ (left|remaining)\b/i,
  /\bends (today|tonight|in \d+ hours?)\b/i,
  /\blast chance\b/i,
  /\bcountdown\b/i
];

const PERSONAL_ATTRIBUTES = [
  /\b(are|is) you (overweight|bald|fat|ugly|poor)\b/i,
  /\byour (debt|acne|belly fat|hair loss)\b/i,
  /\bpeople like you\b/i
];

const FLUFF = [
  /\bgame[- ]changer\b/i,
  /\bunlock\b/i,
  /\b10x\b/i,
  /\bnext[- ]level\b/i,
  /\bsecret sauce\b/i,
  /\btransform your life\b/i,
  /\belevate\b/i,
  /\bdelve\b/i,
  /\bin today's fast[- ]paced world\b/i
];

const PLACEHOLDER = /\b(TODO|TBD|lorem ipsum|insert here|replace me)\b|\{\{|\}\}|\[\[|\]\]/i;

const HOOK_SIGNALS = [
  /\b(i|we|my|our)\b/i,
  /\b(tried|tested|stopped|switched|wasted|kept|changed|works|worked)\b/i,
  /\b(nobody|everyone|most|if you)\b/i,
  /\b\d+\b/,
  /\b(before|after|until|then)\b/i,
  /\b(why|how|what|watch)\b/i,
  /\b(only|number|here is|this is|same here|start here)\b/i,
  /["“”]/,
  /\b(worth|for)\b/i
];

const SUBSTITUTIONS = [
  { pattern: /\b100\s?%/gi, replacement: 'consistently' },
  { pattern: /\bguarantee(d|s)?\b/gi, replacement: 'designed to help' },
  { pattern: /\bcures?\b/gi, replacement: 'helps with' },
  { pattern: /\binstantly\b/gi, replacement: 'over time' },
  { pattern: /\b#1\b/g, replacement: 'a leading' },
  { pattern: /\bclinically proven\b/gi, replacement: 'formulated for' },
  { pattern: /\bfda[- ]approved\b/gi, replacement: 'made to documented standards' },
  { pattern: /\bmiracle\b/gi, replacement: 'noticeable' },
  { pattern: /\brisk[- ]free\b/gi, replacement: 'refund-eligible' },
  { pattern: /\bdoctors? recommend\b/gi, replacement: 'many routines use' },
  { pattern: /\bpermanent(ly)?\b/gi, replacement: 'longer-lasting' }
];

export function hash(input) {
  let h = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function seedFor(...parts) {
  return 100000 + (hash(parts.join('::')) % 900000);
}

export function wordCount(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

export function clipWords(text, max) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  return words.length <= max ? words.join(' ') : words.slice(0, max).join(' ');
}

export function clipChars(text, max) {
  const value = String(text || '');
  return value.length <= max ? value : value.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

export function firstClause(text, maxWords = 14) {
  const raw = String(text || '').trim();
  const cut = raw.split(/[.;\n]/)[0] || raw;
  return clipWords(cut.replace(/^(the|a|an)\s+/i, ''), maxWords);
}

export function shortPhrase(text, max = 5) {
  const base = String(text || '').split(/[.;\n]/)[0] || '';
  const withoutClause = base.replace(/\b(that|which|who|because|so that)\b.*$/i, '').trim();
  return clipWords(withoutClause.replace(/[,\s]+$/, ''), max);
}

export function lowerFirst(text) {
  const value = String(text || '').trim();
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}

export function compactLine(text, maxWords) {
  const value = String(text || '').trim();
  if (!value) return '';
  if (wordCount(value) <= maxWords) return value;
  const chunks = value.split(/(?<=[,;:])\s+|\s+(?=and\b|but\b|because\b|so\b)/i).filter(Boolean);
  let out = '';
  for (const chunk of chunks) {
    const next = out ? `${out} ${chunk}` : chunk;
    if (wordCount(next) > maxWords) break;
    out = next;
  }
  if (out) return out.replace(/[,;:]$/, '') + '.';
  return clipWords(value, maxWords) + '.';
}

export function sentence(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  return /[.!?]$/.test(value) ? value : value + '.';
}

export function sanitize(text) {
  let output = String(text || '');
  const changes = [];
  for (const rule of SUBSTITUTIONS) {
    if (rule.pattern.test(output)) {
      changes.push(rule.pattern.source);
      output = output.replace(rule.pattern, rule.replacement);
    }
    rule.pattern.lastIndex = 0;
  }
  return { text: output.replace(/\s+/g, ' ').trim(), changes };
}

export function clean(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function detectGender(buyer) {
  const text = String(buyer || '').toLowerCase();
  if (/\b(men|male|guy|father|dad)\b/.test(text) && !/\bwomen\b/.test(text)) return 'man';
  return 'woman';
}

function defaultCreator(buyer) {
  const gender = detectGender(buyer);
  return gender === 'man'
    ? {
        name: 'Arjun',
        age: 31,
        gender: 'man',
        build: 'lean build',
        face: 'warm medium-brown skin, square jaw, short dark stubble, friendly dark eyes',
        hair: 'short black hair with a clean side part',
        wardrobe: 'a washed olive cotton t-shirt and a thin silver chain',
        prop: 'the product held at chest height'
      }
    : {
        name: 'Maya',
        age: 29,
        gender: 'woman',
        build: 'slim build',
        face: 'warm medium skin, round face, faint freckles, expressive dark eyes',
        hair: 'dark shoulder-length hair with a centre part',
        wardrobe: 'an oversized cream cotton shirt and small gold hoops',
        prop: 'the product held at chest height'
      };
}

export function normalizeBrief(raw = {}, options = {}) {
  if (!raw || typeof raw !== 'object') throw new Error('Brief must be a JSON object.');
  const brand = clean(raw.brand);
  const product = clean(raw.product);
  const buyer = clean(raw.buyer);
  const pain = clean(raw.pain);
  const promise = clean(raw.promise);
  const missing = [];
  if (!brand) missing.push('brand');
  if (!product) missing.push('product');
  if (!buyer) missing.push('buyer');
  if (!pain) missing.push('pain');
  if (!promise) missing.push('promise');
  if (missing.length) throw new Error(`Brief is missing required fields: ${missing.join(', ')}`);

  const styleId = options.style && STYLES[options.style]
    ? options.style
    : (STYLES[raw.style] ? raw.style : 'ugc-testimonial');
  const style = STYLES[styleId];
  const duration = Number(options.duration || raw.duration || 30);
  if (![15, 30, 45].includes(duration)) throw new Error('duration must be 15, 30 or 45 seconds.');

  const creator = { ...defaultCreator(buyer), ...(raw.creator && typeof raw.creator === 'object' ? raw.creator : {}) };
  const price = raw.price && typeof raw.price === 'object' ? raw.price : {};
  const currency = clean(price.currency) || clean(raw.currency) || 'INR';
  const amount = Number(price.amount || raw.priceAmount || 0);
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '';
  const priceLabel = amount > 0 ? `${symbol}${amount.toLocaleString('en-IN')}` : 'the listed price';

  const sanitizedPain = sanitize(pain);
  const sanitizedPromise = sanitize(promise);
  const sanitizedMechanism = sanitize(clean(raw.mechanism) || `a focused routine built around ${product}, not around guesswork`);
  const sanitizedProof = sanitize(clean(raw.proof));

  const features = Array.isArray(raw.features) ? raw.features.map(clean).filter(Boolean) : [];
  const objections = Array.isArray(raw.objections) ? raw.objections.map(clean).filter(Boolean) : [];
  const defaultObjections = [
    'It costs more than I want to spend on this',
    'I have tried products like this before and nothing changed'
  ];
  const resolvedObjections = [...objections, ...defaultObjections].slice(0, 2);

  const hashtags = Array.isArray(raw.hashtags) && raw.hashtags.length
    ? raw.hashtags.map((h) => clean(h)).filter(Boolean).map((h) => (h.startsWith('#') ? h : '#' + h)).slice(0, 5)
    : ['#ugc', '#ad', '#' + brand.replace(/[^a-z0-9]/gi, ''), '#' + product.replace(/[^a-z0-9]/gi, '')];

  const hasProof = Boolean(sanitizedProof.text);
  const painShort = lowerFirst(shortPhrase(sanitizedPain.text, 6));
  const promiseShort = lowerFirst(shortPhrase(sanitizedPromise.text, 8));

  const brief = {
    schemaVersion: SCHEMA_VERSION,
    brand,
    product,
    category: clean(raw.category) || 'product',
    productShort: clean(raw.productShort) || clipWords(product, 3),
    buyer,
    buyerShort: clean(raw.buyerShort) || shortPhrase(buyer, 7),
    pain: sanitizedPain.text,
    painShort,
    painAction: clean(raw.painAction) || 'the same routine, the same result',
    promise: sanitizedPromise.text,
    promiseShort,
    mechanism: sanitizedMechanism.text,
    mechanismShort: sentence(clipWords(sanitizedMechanism.text.split(/[.;]/)[0], 18)),
    proof: sanitizedProof.text,
    proofShort: sentence(clipWords(sanitizedProof.text, 22)),
    hasProof,
    offer: sanitize(clean(raw.offer)).text || 'the starter option',
    offerShort: clipWords(sanitize(clean(raw.offer)).text || 'the starter option', 8),
    price: { amount, currency, label: priceLabel },
    priceLabel,
    differentiator: sanitize(clean(raw.differentiator)).text || 'it fits into the routine you already have',
    failedAlt: sanitize(clean(raw.failedAlt)).text || 'quick fixes',
    flaw: sanitize(clean(raw.flaw)).text || 'mask the problem instead of changing the routine',
    badThing: sanitize(clean(raw.badThing)).text || 'harsh scrubbing',
    badThing2: sanitize(clean(raw.badThing2)).text || 'a ten-step routine',
    comparison: sanitize(clean(raw.comparison)).text || 'one weekend takeaway order',
    wasteTime: clean(raw.wasteTime) || 'two years',
    demoTime: clean(raw.demoTime) || 'thirty seconds',
    demoAction: clean(raw.demoAction) || 'a pea-sized amount, worked in for twenty seconds',
    visibleChange: clean(raw.visibleChange) || 'the finish',
    unit: clean(raw.unit) || 'pump',
    bodyPart: clean(raw.bodyPart) || 'skin',
    packaging: clean(raw.packaging) || 'a matte glass bottle with a pump',
    accent: clean(raw.accent) || 'soft sage green',
    labelStyle: clean(raw.labelStyle) || 'a clean sans-serif wordmark',
    features: features.length ? features : ['a short, repeatable routine', 'a formula designed for daily use', 'a size that lasts the stated period'],
    objections: resolvedObjections,
    creator,
    style: style.id,
    duration,
    platforms: Array.isArray(raw.platforms) && raw.platforms.length ? raw.platforms.map(clean).filter(Boolean) : ['instagram', 'tiktok', 'youtube-shorts'],
    hashtags,
    disclosure: clean(raw.disclosure) || 'Ad · AI-generated creator, real product.',
    verifiedProof: Boolean(raw.verifiedProof),
    claimRewrites: [...sanitizedPain.changes, ...sanitizedPromise.changes, ...sanitizedMechanism.changes, ...sanitizedProof.changes],
    model: VIDEO_MODELS[options.model] ? options.model : (VIDEO_MODELS[raw.model] ? raw.model : 'veo-3.1-flow'),
    imageModel: IMAGE_MODELS.includes(options.imageModel) ? options.imageModel : (IMAGE_MODELS.includes(raw.imageModel) ? raw.imageModel : 'nano-banana-pro'),
    heygen: raw.heygen && typeof raw.heygen === 'object' ? raw.heygen : {}
  };

  if (brief.model === 'veo-3.1-flow' && style.mode === 'ugc') brief.model = 'veo-3.1-flow';
  if (brief.duration > 45) throw new Error('duration must be 15, 30 or 45 seconds.');

  return brief;
}

export function consistencyTokens(brief, style) {
  const c = brief.creator;
  const characterBlock = `the same creator in every shot: ${c.name}, a ${c.age}-year-old ${c.gender}, ${c.build}, ${c.face}, ${c.hair}, wearing ${c.wardrobe}, with ${c.prop}.`;
  const productBlock = `the exact product: ${brief.brand} ${brief.product}; category: ${brief.category}; packaging: ${brief.packaging}; accent colors: ${brief.accent}; label: ${brief.labelStyle}, reading "${brief.brand}"; the product shape, cap and label must not change between shots.`;
  const gradeBlock = style.grade;
  const craftBlock = style.craft;
  const worldBlock = `World: ${style.setting}; lighting stays ${style.lighting}.`;
  return { characterBlock, productBlock, gradeBlock, craftBlock, worldBlock };
}

export function sceneCount(duration) {
  if (duration <= 15) return 4;
  if (duration <= 30) return 5;
  return 7;
}

export function sceneDurations(duration) {
  const count = sceneCount(duration);
  const hook = 3;
  const cta = 3;
  const middleCount = count - 2;
  const remaining = duration - hook - cta;
  const base = Math.floor(remaining / middleCount);
  const extra = remaining - base * middleCount;
  const middle = Array.from({ length: middleCount }, (_, i) => Math.min(8, base + (i < extra ? 1 : 0)));
  return [hook, ...middle, cta];
}

function beatPlan(brief, style) {
  const mode = style.mode;
  const features = brief.features;
  if (mode === 'cinematic') {
    return {
      'cinematic-hero': {
        title: 'Cinematic hero',
        whyItWorks: 'Product-first reveal with a premium frame; sells the object before the claim.',
        hook: `${brief.product} — the ${brief.category} worth slowing down for.`,
        beats: [
          { beat: 'Hook', spoken: '', onScreen: brief.brand, visual: `slow push-in on ${brief.product} on a stone plinth, label catching the key light` },
          { beat: 'Reveal', spoken: '', onScreen: brief.promiseShort, visual: `the product rotates slowly as the rim light traces the ${brief.accent} accent` },
          { beat: 'Craft', spoken: '', onScreen: features[0], visual: `macro detail of the ${brief.packaging}, texture and label sharp` },
          { beat: 'Payoff', spoken: '', onScreen: features[1] || brief.differentiator, visual: `product settles into a clean hero frame with negative space for the end card` },
          { beat: 'CTA', spoken: '', onScreen: `${brief.brand} · ${brief.priceLabel}`, visual: `locked-off hero frame, bottom third clear for CTA and caption` }
        ]
      },
      'cinematic-ritual': {
        title: 'Cinematic ritual',
        whyItWorks: 'Shows the product inside a desirable daily ritual, which sells consistency.',
        hook: `The thirty seconds that changed my ${brief.category} routine.`,
        beats: [
          { beat: 'Hook', spoken: '', onScreen: brief.productShort, visual: `hands enter frame in warm morning light and reach for ${brief.product}` },
          { beat: 'Ritual', spoken: '', onScreen: brief.demoAction, visual: `close-up of the product being used exactly as ${brief.demoAction}` },
          { beat: 'Texture', spoken: '', onScreen: brief.visibleChange, visual: `macro shot of the product texture and finish, controlled reflections` },
          { beat: 'Payoff', spoken: '', onScreen: brief.promiseShort, visual: `the finished routine in a calm, sunlit frame with the product in focus` },
          { beat: 'CTA', spoken: '', onScreen: `${brief.brand} · ${brief.priceLabel}`, visual: `product beside a folded towel, bottom third clear for the end card` }
        ]
      },
      'cinematic-proof': {
        title: 'Cinematic proof',
        whyItWorks: brief.hasProof ? 'Leads with the strongest verified number instead of adjectives.' : 'Leads with a mechanism detail that can be shown on camera.',
        hook: `The ${brief.category} number I actually track.`,
        beats: [
          { beat: 'Hook', spoken: '', onScreen: brief.hasProof ? brief.proofShort : brief.features[0], visual: `tight shot of the product label and the feature that carries the claim` },
          { beat: 'Detail', spoken: '', onScreen: brief.features[0], visual: `slow macro move across the product surface, label readable` },
          { beat: 'Mechanism', spoken: '', onScreen: brief.mechanismShort, visual: `product in use, clean demonstration of ${brief.demoAction}` },
          { beat: 'Payoff', spoken: '', onScreen: brief.promiseShort, visual: `hero shot with controlled highlight on the ${brief.accent} accent` },
          { beat: 'CTA', spoken: '', onScreen: `${brief.brand} · ${brief.priceLabel}`, visual: `product centered, bottom third clear for CTA` }
        ]
      },
      'cinematic-objection': {
        title: 'Cinematic objection',
        whyItWorks: 'Answers the price objection visually by showing build quality and size.',
        hook: `What you actually get for ${brief.priceLabel}.`,
        beats: [
          { beat: 'Hook', spoken: '', onScreen: brief.priceLabel, visual: `product next to its packaging, scale readable in one frame` },
          { beat: 'Build', spoken: '', onScreen: brief.packaging, visual: `macro move over the cap, pump and label edges` },
          { beat: 'Use', spoken: '', onScreen: brief.demoAction, visual: `product used once, clean and controlled` },
          { beat: 'Value', spoken: '', onScreen: brief.differentiator, visual: `product back on the plinth, premium and simple` },
          { beat: 'CTA', spoken: '', onScreen: `${brief.brand} · link below`, visual: `locked-off hero frame with bottom third clear` }
        ]
      },
      'cinematic-identity': {
        title: 'Cinematic identity',
        whyItWorks: 'Casts the buyer as the kind of person who already owns this standard.',
        hook: `For ${clipWords(brief.buyerShort, 4)}, ${clipWords(brief.product, 3)} is the whole routine.`,
        beats: [
          { beat: 'Hook', spoken: '', onScreen: brief.buyerShort, visual: `product on a stone surface beside a notebook and keys, life-in-frame` },
          { beat: 'World', spoken: '', onScreen: brief.category, visual: `wide establishing shot of the minimal studio with the product small in frame` },
          { beat: 'Detail', spoken: '', onScreen: brief.features[1] || brief.differentiator, visual: `push-in to the label and the ${brief.accent} accent` },
          { beat: 'Payoff', spoken: '', onScreen: brief.promiseShort, visual: `product lifted into a clean hero frame, shallow depth of field` },
          { beat: 'CTA', spoken: '', onScreen: `${brief.brand} · ${brief.priceLabel}`, visual: `product centered, bottom third clear for the end card` }
        ]
      },
      'cinematic-cta': {
        title: 'Cinematic CTA',
        whyItWorks: 'A short, loopable end-card film built to be reused across placements.',
        hook: `${brief.priceLabel} for ${brief.product}, built for ${clipWords(brief.promiseShort, 5)}.`,
        beats: [
          { beat: 'Hook', spoken: '', onScreen: brief.brand, visual: `bold single-product frame, label dead center and sharp` },
          { beat: 'Detail', spoken: '', onScreen: brief.features[2] || brief.features[0], visual: `slow orbit around the product, controlled reflections` },
          { beat: 'Payoff', spoken: '', onScreen: brief.promiseShort, visual: `product settles into a wide hero frame with negative space` },
          { beat: 'Offer', spoken: '', onScreen: brief.offerShort, visual: `product with its packaging, price card added in the edit, not generated` },
          { beat: 'CTA', spoken: '', onScreen: 'Link below', visual: `locked-off product frame, bottom third clear for the CTA` }
        ]
      }
    };
  }

  const objection1 = brief.objections[0];
  return {
    'pain-agitate': {
      title: 'Cost of inaction',
      whyItWorks: 'Names the daily cost of the problem before the product appears, so the product feels like relief.',
      hook: [
        `I wasted ${brief.wasteTime} on ${brief.painShort} before this.`,
        `Nobody warns you how much ${brief.painShort} costs you.`,
        `If ${brief.painShort} is your normal, watch this.`
      ][hash(brief.product + 'pain') % 3],
      beats: [
        { beat: 'Hook', spoken: '', onScreen: brief.painShort, visual: 'creator leans into the front camera mid-sentence, product still out of frame' },
        { beat: 'Agitate', spoken: `Every morning it was the same: ${brief.painAction}. I tried ${brief.failedAlt} and nothing stuck.`, onScreen: 'same routine, same result', visual: 'creator glances at a makeup brush on the counter, then back to the camera, small frustrated exhale' },
        { beat: 'Mechanism', spoken: `Then I switched to ${brief.brand} ${brief.product}. ${brief.mechanismShort}`, onScreen: 'the switch', visual: 'product enters frame label-first, one clean demonstration, no jump cuts' },
        { beat: 'Payoff', spoken: brief.hasProof ? `Here is the part I checked before buying: ${brief.proofShort}` : `I am not promising a miracle. I just stopped ${brief.painShort} being the first thing I think about.`, onScreen: 'the difference', visual: 'creator looks at the product with a small genuine reaction, no exaggerated smile' },
        { beat: 'CTA', spoken: `Tap the link and check the full routine at ${brief.priceLabel}.`, onScreen: 'link below', visual: 'product held beside the face, bottom third clear for the caption and CTA' }
      ]
    },
    'failed-alternative': {
      title: 'Failed alternative',
      whyItWorks: 'Borrows credibility from what the buyer already wasted money on, then positions the product as the last stop.',
      hook: `I tried ${clipWords(brief.failedAlt, 6)}. Same result.`,
      beats: [
        { beat: 'Hook', spoken: '', onScreen: brief.failedAlt, visual: 'creator holds up an imaginary list, then drops it, direct to camera' },
        { beat: 'Agitate', spoken: `Three months, more money than I want to admit, and zero change.`, onScreen: 'three months, zero change', visual: 'creator sets a crowded tray of bottles down and pushes it out of frame' },
        { beat: 'Mechanism', spoken: `${brief.brand} ${brief.product} is different: ${brief.mechanismShort}`, onScreen: 'the difference', visual: 'product enters frame, label square to camera, one clean demonstration' },
        { beat: 'Payoff', spoken: `No ${brief.badThing}. No ${brief.badThing2}. Just ${brief.differentiator}.`, onScreen: brief.differentiator, visual: 'hands setting the product down, calm and unhurried, natural light' },
        { beat: 'CTA', spoken: `Link in the caption. Check the price before you decide.`, onScreen: 'link in caption', visual: 'product held beside the face, bottom third clear' }
      ]
    },
    mechanism: {
      title: 'Mechanism',
      whyItWorks: 'Explains why this works when other options did not, which converts skeptical buyers.',
      hook: `Why ${clipWords(brief.product, 4)} works when the rest did not.`,
      beats: [
        { beat: 'Hook', spoken: '', onScreen: brief.product, visual: 'creator holds the product with the label readable, deadpan to camera' },
        { beat: 'Problem', spoken: `Most options ${brief.flaw}.`, onScreen: brief.flaw, visual: 'creator sets a cluttered tray aside and holds the single product in the centre of the frame' },
        { beat: 'Mechanism', spoken: brief.mechanismShort, onScreen: brief.mechanismShort, visual: 'clear demonstration of the product in use, hands and product only' },
        { beat: 'Payoff', spoken: `No ${brief.badThing}, no ${brief.badThing2}.`, onScreen: 'no fuss', visual: 'product set down, creator shrugs naturally, no exaggerated reaction' },
        { beat: 'CTA', spoken: `See it on your own ${brief.bodyPart}. Link below.`, onScreen: 'link below', visual: 'product beside face, bottom third clear for caption' }
      ]
    },
    proof: {
      title: 'Proof',
      whyItWorks: 'Leads with the strongest available evidence instead of adjectives.',
      hook: `The only ${brief.category} number I actually track.`,
      beats: [
        { beat: 'Hook', spoken: '', onScreen: 'the number I track', visual: 'creator holds up the product, then taps the label twice' },
        { beat: 'Proof', spoken: brief.proofShort || `I cannot give you a fake before-and-after. What I can tell you is what changed in my routine.`, onScreen: brief.hasProof ? 'verified by the buyer' : 'no fake before-and-after', visual: 'creator talks directly to camera, same framing, no cutaways' },
        { beat: 'Mechanism', spoken: `That is ${brief.brand} ${brief.product}. ${brief.mechanismShort}`, onScreen: brief.mechanismShort, visual: 'product demonstration, labels readable, natural light' },
        { beat: 'Payoff', spoken: `Same routine, tracked over time, no ${brief.badThing}.`, onScreen: 'same routine, tracked', visual: 'product on the counter beside a notebook, calm frame' },
        { beat: 'CTA', spoken: `Link is below if you want the same setup.`, onScreen: 'link below', visual: 'product held beside face, bottom third clear' }
      ]
    },
    'objection-reversal': {
      title: 'Objection reversal',
      whyItWorks: 'Says the objection out loud, then answers it with specifics instead of reassurance.',
      hook: `"${clipWords(objection1, 9)}" — same here.`,
      beats: [
        { beat: 'Hook', spoken: '', onScreen: objection1, visual: 'creator raises an eyebrow at the camera, product in hand' },
        { beat: 'Answer', spoken: `Then I read the label and did the maths: ${brief.priceLabel} for ${brief.unit}.`, onScreen: brief.priceLabel, visual: 'close-up of the label and pump, product detail sharp' },
        { beat: 'Mechanism', spoken: brief.mechanismShort, onScreen: brief.mechanismShort, visual: 'one clean demonstration, hands and product only' },
        { beat: 'Payoff', spoken: `If it is not for you, check the terms on the page before you buy.`, onScreen: 'read the terms first', visual: 'creator sets the product down, calm and direct' },
        { beat: 'CTA', spoken: `Link below. Read it properly, then decide.`, onScreen: 'link below', visual: 'product beside face, bottom third clear' }
      ]
    },
    identity: {
      title: 'Identity',
      whyItWorks: 'Calls out the buyer by role, so the right person stops scrolling.',
      hook: `If you are ${brief.buyerShort}, start here.`,
      beats: [
        { beat: 'Hook', spoken: '', onScreen: brief.buyerShort, visual: 'creator points at the camera, product in the other hand' },
        { beat: 'Contrast', spoken: `You do not need ${brief.failedAlt}. You need a routine that is built for ${brief.promiseShort}.`, onScreen: 'built for you', visual: 'creator slides a crowded tray aside and places the single product in the centre of the frame' },
        { beat: 'Mechanism', spoken: brief.mechanismShort, onScreen: brief.mechanismShort, visual: 'product demonstration, label readable, no studio gloss' },
        { beat: 'Payoff', spoken: brief.differentiator, onScreen: brief.differentiator, visual: 'creator uses the product once, natural reaction' },
        { beat: 'CTA', spoken: `Link in bio. Start with the ${brief.productShort}.`, onScreen: 'link in bio', visual: 'product held beside face, bottom third clear' }
      ]
    },
    demo: {
      title: 'Demo',
      whyItWorks: 'Shows the product doing the job in one unbroken shot, which removes doubt.',
      hook: `Watch what ${brief.product} does in ${brief.demoTime}.`,
      beats: [
        { beat: 'Hook', spoken: '', onScreen: 'watch this', visual: 'hands enter frame with the product, label readable' },
        { beat: 'Demo', spoken: `One ${brief.unit}, ${brief.demoAction}.`, onScreen: brief.demoAction, visual: 'hands-only demonstration, one unbroken take, no cuts' },
        { beat: 'Mechanism', spoken: brief.mechanismShort, onScreen: brief.mechanismShort, visual: 'close-up of the product texture and finish, natural light' },
        { beat: 'Payoff', spoken: `Look at the ${brief.visibleChange}. That is the whole trick.`, onScreen: brief.visibleChange, visual: 'final look at the result, honest framing, no exaggerated reaction' },
        { beat: 'CTA', spoken: `Link below for the exact one I use.`, onScreen: 'link below', visual: 'product centered on the counter, bottom third clear' }
      ]
    }
  };
}

export function blueprintsFor(brief, style) {
  const all = beatPlan(brief, style);
  if (style.mode === 'cinematic') {
    return ['cinematic-hero', 'cinematic-ritual', 'cinematic-proof', 'cinematic-objection', 'cinematic-identity', 'cinematic-cta'].map((id) => ({ id, ...all[id] }));
  }
  const order = ['pain-agitate', 'failed-alternative', 'mechanism', 'proof', 'objection-reversal', 'identity', 'demo'];
  return order
    .map((id) => ({ id, ...all[id] }))
    .filter((angle) => (angle.id === 'proof' ? brief.hasProof : true))
    .slice(0, 6)
    .map((angle) => {
      if (angle.id === 'proof' && !brief.hasProof) return { id: 'demo', ...all.demo };
      return angle;
    });
}

function expandBeats(beats, count) {
  const cta = beats[4];
  if (count <= 4) {
    return [beats[0], beats[1], beats[2], {
      ...beats[3],
      spoken: `${beats[3].spoken} ${cta.spoken}`.trim(),
      visual: `${beats[3].visual}; then hold the product beside the face with the bottom third clear for the CTA`,
      onScreen: 'link below'
    }];
  }
  if (count === 5) return beats;
  return [
    beats[0],
    beats[1],
    beats[2],
    {
      beat: 'Detail',
      spoken: '',
      onScreen: beats[2].onScreen,
      visual: `macro detail while the creator keeps talking: ${beats[2].visual}`
    },
    beats[3],
    {
      beat: 'Reaction',
      spoken: '',
      onScreen: beats[3].onScreen,
      visual: `a second angle on the same moment: ${beats[3].visual}`
    },
    cta
  ];
}

function audioLine(brief, style, scene) {
  const line = scene.spoken ? scene.spoken.replace(/"/g, '') : '';
  if (style.mode === 'cinematic') {
    return `Native audio: no voiceover, no music with lyrics; ambient ${scene.sfx} and a low restrained score bed that resolves on the final frame.`;
  }
  if (!line) {
    return `Native audio: quiet room tone and ${scene.sfx}, no added music, no voiceover in this shot.`;
  }
  return `Native audio: the creator says, "${line}" in a calm conversational voice at a natural pace, close to the phone mic; SFX: ${scene.sfx || 'natural room tone'}.`;
}

export function buildCampaign(rawBrief, options = {}) {
  const brief = normalizeBrief(rawBrief, options);
  const style = STYLES[brief.style];
  const tokens = consistencyTokens(brief, style);
  const blueprints = blueprintsFor(brief, style);
  const durations = sceneDurations(brief.duration);
  const model = VIDEO_MODELS[brief.model];
  const allScenes = [];

  const angles = blueprints.map((blueprint, angleIndex) => {
    const seededBeats = blueprint.beats.map((beat, index) => (
      index === 0 && style.mode === 'ugc' ? { ...beat, spoken: blueprint.hook } : beat
    ));
    const expanded = expandBeats(seededBeats, durations.length);
    if (brief.duration <= 15 && style.mode === 'ugc') {
      const budgets = [12, 10, 12, 8];
      for (let i = 1; i < expanded.length; i += 1) {
        expanded[i] = { ...expanded[i], spoken: compactLine(expanded[i].spoken, budgets[Math.min(i, budgets.length - 1)]) };
      }
    }
    const beats = expanded.map((beat, index) => ({
      index: index + 1,
      beat: beat.beat,
      spoken: beat.spoken,
      onScreen: beat.onScreen,
      visual: beat.visual,
      start: durations.slice(0, index).reduce((a, b) => a + b, 0),
      end: durations.slice(0, index + 1).reduce((a, b) => a + b, 0)
    }));

    const scenes = beats.map((beat, index) => {
      const duration = durations[index];
      const seed = seedFor(brief.product, blueprint.id, 'video', index + 1, options.seed || 0);
      const negative = 'warped hands, extra fingers, face morphing, plastic skin, beauty filter, text artifacts, watermark, logo distortion, jump cuts, camera shake, oversaturated colors, studio backdrop, fake product label, duplicate product, subtitles baked in';
      const aspect = '9:16';
      const action = beat.visual;
      const sfx = ['quiet room tone', 'fabric movement and a quiet room', 'product cap click and soft room tone', 'natural room tone', 'hand brushing fabric'][Math.min(index, 4)];
      const setting = style.setting;
      const camera = index === 0 ? style.camera : index === beats.length - 1 ? `${style.camera}, locked-off final beat` : `${style.camera}, slight push-in on the product`;
      const prompt = [
        `${aspect} ${style.promptLead}.`,
        `${action}.`,
        `Subject: ${tokens.characterBlock}`,
        `Product: ${tokens.productBlock}`,
        `Setting: ${setting}.`,
        `Camera: ${camera}.`,
        `Lighting: ${style.lighting}.`,
        tokens.gradeBlock,
        `${style.realism}`,
        audioLine(brief, style, { ...beat, sfx }),
        'Framing: vertical 9:16, product label readable and square to camera in at least one frame, bottom 20% clear for captions and CTA, no on-screen text, no watermark, no fake UI.',
        `Negative prompt: ${negative}.`,
        `Seed: ${seed}.`,
        `Duration: ${duration} seconds.`
      ].join(' ');
      const scene = {
        id: `A${angleIndex + 1}-S${index + 1}`,
        index: index + 1,
        model: brief.model,
        modelLabel: model.label,
        aspect,
        duration,
        seed,
        bridge: index > 0 ? 'Use the previous scene’s last frame as this scene’s start frame for a seamless cut.' : 'Generate the reference still first, then this scene.',
        action,
        setting,
        camera,
        lighting: style.lighting,
        dialogue: beat.spoken || null,
        sfx,
        prompt,
        negativePrompt: negative
      };
      allScenes.push(scene);
      return scene;
    });

    const imageSeeds = {
      hook: seedFor(brief.product, blueprint.id, 'image', 'hook', options.seed || 0),
      hero: seedFor(brief.product, blueprint.id, 'image', 'hero', options.seed || 0),
      lifestyle: seedFor(brief.product, blueprint.id, 'image', 'lifestyle', options.seed || 0),
      detail: seedFor(brief.product, blueprint.id, 'image', 'detail', options.seed || 0)
    };
    const imageNegative = 'deformed hands, extra fingers, distorted face, plastic skin, airbrushed, text overlay, watermark, misspelled label, duplicate product, clutter, HDR halos, stock-photo smile';
    const imageSpecs = [
      {
        id: 'hook-frame',
        purpose: 'Scroll-stopping first frame / thumbnail',
        aspect: '4:5',
        seed: imageSeeds.hook,
        person: true,
        subject: `the creator mid-expression, holding ${brief.product} label-first beside the face`,
        composition: 'eye-level medium close-up, face and product both readable at thumbnail size, clean negative space on the right for the hook text added in the edit',
        model: brief.imageModel
      },
      {
        id: 'product-hero',
        purpose: 'Product hero for the landing page and catalog',
        aspect: '1:1',
        seed: imageSeeds.hero,
        person: false,
        subject: `a clean hero photograph of ${brief.brand} ${brief.product} alone on a simple surface`,
        composition: 'centered product, label square to camera, soft contact shadow, generous negative space',
        model: brief.imageModel
      },
      {
        id: 'lifestyle',
        purpose: 'In-use lifestyle frame for Stories and Shorts covers',
        aspect: '9:16',
        seed: imageSeeds.lifestyle,
        person: true,
        subject: `the creator applying ${brief.product} — ${brief.demoAction} — candid and mid-motion`,
        composition: 'vertical framing, hands and product in the lower two-thirds, face partially in frame, room for caption at the top',
        model: brief.imageModel
      },
      {
        id: 'detail-macro',
        purpose: 'Texture and label proof frame for the proof slide',
        aspect: '9:16',
        seed: imageSeeds.detail,
        person: false,
        subject: `an extreme macro photograph of the ${brief.packaging}, label and ${brief.accent} accent`,
        composition: 'fill the frame with texture, label edge sharp, shallow depth of field',
        model: brief.imageModel
      }
    ];
    const images = imageSpecs.map((spec) => {
      const prompt = [
        `${spec.aspect} ${style.imageLead}.`,
        `${spec.subject}.`,
        ...(spec.person ? [`Subject: ${tokens.characterBlock}`] : []),
        `Product: ${tokens.productBlock}`,
        `Composition: ${spec.composition}.`,
        `Lighting: ${style.lighting}.`,
        tokens.gradeBlock,
        tokens.craftBlock,
        style.realism,
        'Realistic texture, natural imperfections, correct product label, no text, no watermark, no fake UI, no extra logos.',
        `Negative: ${imageNegative}.`,
        `Seed: ${spec.seed}.`
      ].join(' ');
      return {
        id: spec.id,
        purpose: spec.purpose,
        model: spec.model,
        aspect: spec.aspect,
        seed: spec.seed,
        prompt,
        negativePrompt: imageNegative,
        editPrompt: spec.id === 'product-hero'
          ? 'Keep the product and label exactly as they are; replace only the background with a warm off-white seamless surface and add a soft contact shadow.'
          : spec.id === 'lifestyle'
            ? 'Keep the creator, hands and product exactly as they are; replace only the background with a brighter window-lit room and lift exposure by a third of a stop.'
            : 'Keep the subject and product exactly as they are; change only the background tone to match the brand palette, and do not alter the label.'
      };
    });

    const heygenScript = beats.map((beat) => beat.spoken).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
    const heygen = {
      mode: 'avatar-talking-head',
      configureBeforeRender: ['avatarId', 'voiceId', 'backgroundAsset'],
      avatarDescription: tokens.characterBlock,
      script: heygenScript,
      voiceDirection: style.mode === 'cinematic'
        ? 'Warm, measured, low-energy commercial read. No hype. Pause 200ms before the product name.'
        : 'Conversational, slightly imperfect, like a voice note to a friend. No announcer voice, no upward inflection at the end of every line.',
      background: style.setting,
      captions: { enabled: true, style: 'word-by-word, high contrast, bottom safe zone', language: 'en' },
      disclosure: style.disclosureRequired ? 'Label the video as AI-generated and keep the paid-partnership disclosure in the caption.' : 'No AI-avatar disclosure needed if no synthetic presenter is used.',
      output: `${brief.duration}s vertical 9:16, 1080x1920, 30fps`
    };

    const capitalize = (value) => value ? value[0].toUpperCase() + value.slice(1) : value;
    const captionBody = style.mode === 'cinematic'
      ? `${capitalize(sentence(brief.promise))} ${capitalize(sentence(brief.mechanism))}`
      : `${capitalize(sentence(brief.promise))} ${capitalize(sentence(brief.differentiator))}`;
    const cta = `Tap the link to see ${brief.product} at ${brief.priceLabel}.`;
    const disclosure = style.disclosureRequired ? brief.disclosure : '';
    const hashtags = brief.hashtags.join(' ');
    const igText = [blueprint.hook, captionBody, cta, disclosure, hashtags].filter(Boolean).join('\n\n');
    const captions = {
      instagram: {
        text: clipChars(igText, 2200),
        hashtags: brief.hashtags,
        limit: 2200
      },
      tiktok: {
        text: clipChars([blueprint.hook, captionBody, cta, disclosure, hashtags].filter(Boolean).join('\n\n'), 2200),
        hashtags: brief.hashtags,
        limit: 2200
      },
      youtubeShorts: {
        title: clipChars(blueprint.hook, 100),
        description: clipChars([captionBody, cta, disclosure, hashtags].filter(Boolean).join('\n\n'), 5000),
        hashtags: brief.hashtags,
        limit: 5000
      }
    };

    return {
      id: blueprint.id,
      title: blueprint.title,
      whyItWorks: blueprint.whyItWorks,
      hook: blueprint.hook,
      hookWordCount: wordCount(blueprint.hook),
      hookSignals: HOOK_SIGNALS.filter((rx) => rx.test(blueprint.hook)).length,
      beats,
      totalDuration: beats[beats.length - 1].end,
      scenes,
      images,
      heygen,
      captions,
      cta,
      disclosure
    };
  });

  const claimsLedger = [
    {
      claim: brief.promise,
      type: 'promise',
      source: 'buyer brief',
      status: brief.verifiedProof ? 'buyer-verified' : 'evidence required before publishing',
      action: 'Keep only if the landing page can substantiate it.'
    },
    ...(brief.hasProof ? [{
      claim: brief.proof,
      type: 'proof',
      source: 'buyer brief',
      status: brief.verifiedProof ? 'buyer-verified' : 'buyer-provided, not independently verified',
      action: 'Attach the source (test report, order data, review count) to the product page.'
    }] : []),
    {
      claim: brief.mechanism,
      type: 'mechanism',
      source: 'buyer brief',
      status: 'mechanism language, not an outcome claim',
      action: 'Safe if it describes how the product works, not what it cures.'
    },
    {
      claim: brief.priceLabel,
      type: 'price',
      source: 'buyer brief',
      status: 'must match the checkout',
      action: 'Re-check the live price before publishing.'
    }
  ];

  return {
    schemaVersion: SCHEMA_VERSION,
    meta: {
      brand: brief.brand,
      product: brief.product,
      category: brief.category,
      style: brief.style,
      styleLabel: style.label,
      mode: style.mode,
      duration: brief.duration,
      platforms: brief.platforms,
      seed: Number(options.seed || 0),
      videoModel: brief.model,
      imageModel: brief.imageModel,
      angleCount: angles.length,
      sceneCount: allScenes.length,
      totalVideoPrompts: allScenes.length,
      totalImagePrompts: angles.reduce((sum, angle) => sum + angle.images.length, 0)
    },
    brief,
    consistency: tokens,
    angles,
    claimsLedger,
    compliance: {
      disclosureRequired: style.disclosureRequired,
      disclosure: brief.disclosure,
      rules: [
        'Use the exact character, product and grade blocks in every prompt; drift is the main cause of unusable ads.',
        'Disclose AI-generated presenters and paid partnerships on every platform that requires it.',
        'Do not imply results that the buyer cannot substantiate on the landing page.',
        'Keep before-and-after frames under identical lighting, framing and grade; do not retouch the result.',
        'Use licensed music only; platform libraries are the safe default.',
        'Never invent reviews, testimonials, user counts, certifications or medical claims.'
      ],
      claimRewrites: [...new Set(brief.claimRewrites)]
    }
  };
}

export function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, out));
  return out;
}

export const AUDIT_RULES = {
  BANNED_CLAIMS,
  FAKE_URGENCY,
  PERSONAL_ATTRIBUTES,
  FLUFF,
  PLACEHOLDER,
  HOOK_SIGNALS
};
