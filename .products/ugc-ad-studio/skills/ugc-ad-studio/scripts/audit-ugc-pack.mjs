#!/usr/bin/env node
// UGC Ad Studio — deterministic pack audit
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  AUDIT_RULES,
  VIDEO_MODELS,
  IMAGE_MODELS,
  ASPECTS,
  wordCount
} from './lib.mjs';

const { BANNED_CLAIMS, FAKE_URGENCY, PERSONAL_ATTRIBUTES, FLUFF, PLACEHOLDER } = AUDIT_RULES;

const HELP = `UGC Ad Studio — pack audit

Usage:
  node scripts/audit-ugc-pack.mjs <campaign.json> [options]

Options:
  --md[=file]       Write a Markdown report (prints it when no file is given)
  --json[=file]     Write a JSON report (prints it when no file is given)
  --min <n>         Minimum score to pass (default: 85)
  --report-only     Always exit 0, even when the pack fails
  --help            Show this help

Exit codes: 0 = PASS, 1 = FIX NEEDED or DO NOT SHIP, 2 = bad input.
`;

function parseArgs(argv) {
  const out = { input: null, md: null, json: null, min: 85, reportOnly: false, help: false };
  for (const item of argv) {
    if (item === '--help' || item === '-h') out.help = true;
    else if (item === '--report-only') out.reportOnly = true;
    else if (item === '--md') out.md = '-';
    else if (item.startsWith('--md=')) out.md = item.slice(5);
    else if (item === '--json') out.json = '-';
    else if (item.startsWith('--json=')) out.json = item.slice(7);
    else if (item === '--min') out.min = null;
    else if (item.startsWith('--min=')) out.min = Number(item.slice(6));
    else if (!item.startsWith('--') && !out.input) out.input = item;
  }
  if (out.min === null) out.min = 85;
  return out;
}

function normalizePrice(value) {
  return String(value || '').replace(/[\s,]/g, '');
}

function severityForBanned(label) {
  if (/cure|cancer|medical|regulatory|fda|guarantee|100/i.test(label)) return 'critical';
  return 'high';
}

function testAll(patterns, text) {
  return patterns.filter((rx) => {
    rx.lastIndex = 0;
    return rx.test(text);
  });
}

function flattenAngles(pack) {
  return Array.isArray(pack.angles) ? pack.angles : [];
}

function collectClaimText(pack) {
  const parts = [];
  for (const angle of flattenAngles(pack)) {
    parts.push(angle.hook, angle.cta, angle.disclosure);
    for (const beat of angle.beats || []) parts.push(beat.spoken, beat.onScreen);
    for (const key of Object.keys(angle.captions || {})) {
      const caption = angle.captions[key];
      if (typeof caption === 'string') parts.push(caption);
      else if (caption && typeof caption === 'object') parts.push(caption.text, caption.title, caption.description);
    }
    if (angle.heygen?.script) parts.push(angle.heygen.script);
  }
  return parts.filter(Boolean).join('\n');
}

function collectAllStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectAllStrings(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectAllStrings(item, out));
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { process.stdout.write(HELP); return; }
  if (!args.input) { process.stderr.write('Error: campaign.json path is required.\n\n' + HELP); process.exit(2); }

  let pack;
  try {
    pack = JSON.parse(await fs.readFile(path.resolve(args.input), 'utf8'));
  } catch (error) {
    process.stderr.write(`Error: cannot read pack: ${error.message}\n`);
    process.exit(2);
  }

  const checks = [];
  const findings = [];
  const check = (id, weight, severity, passed, message, where, fix) => {
    checks.push({ id, weight, severity, passed, message, where: where || null });
    if (!passed) findings.push({ id, severity, message, where: where || null, fix: fix || null });
  };

  const angles = flattenAngles(pack);
  const scenes = angles.flatMap((angle) => angle.scenes || []);
  const images = angles.flatMap((angle) => angle.images || []);
  const tokens = pack.consistency || {};
  const isCinematic = pack.meta?.mode === 'cinematic';

  // ---------- Structure (10) ----------
  const brandOk = Boolean(pack.meta?.brand && pack.meta?.product && pack.brief?.price?.label);
  check('structure.meta', 2, 'high', brandOk, 'Brand, product and price are present.', 'meta', 'Add brand, product and a numeric price to the brief.');
  const platformsOk = Array.isArray(pack.meta?.platforms) && pack.meta.platforms.length > 0;
  check('structure.platforms', 2, 'medium', platformsOk, 'At least one publishing platform is declared.', 'meta.platforms', 'Add platforms such as instagram, tiktok or youtube-shorts.');
  const anglesOk = angles.length >= 4;
  check('structure.angles', 2, 'high', anglesOk, `${angles.length} angles built (minimum 4).`, 'angles', 'Build at least 4 angles so the test matrix has real variance.');
  const tokensOk = Boolean(tokens.characterBlock && tokens.productBlock && tokens.gradeBlock && tokens.craftBlock);
  check('structure.tokens', 2, 'critical', tokensOk, 'All four consistency blocks are present.', 'consistency', 'Rebuild the pack with the builder so the locked blocks exist.');
  const placeholderHits = collectAllStrings(pack).filter((text) => PLACEHOLDER.test(text));
  check('structure.placeholders', 2, 'critical', placeholderHits.length === 0, placeholderHits.length ? `${placeholderHits.length} placeholder string(s) found.` : 'No placeholders or unreplaced tokens.', placeholderHits[0] || 'pack', 'Replace every TODO, {{token}} or [insert] with real content.');

  // ---------- Hooks (15) ----------
  const hookLengthOk = angles.every((angle) => wordCount(angle.hook) >= 3 && wordCount(angle.hook) <= 14);
  const badHook = angles.find((angle) => wordCount(angle.hook) < 3 || wordCount(angle.hook) > 14);
  check('hooks.length', 4, 'high', hookLengthOk, 'Every hook is 3–14 words.', badHook ? badHook.hook : 'hooks', 'Cut the hook to one idea and 14 words or fewer.');
  const minSignals = isCinematic ? 1 : 2;
  const signalsOk = angles.every((angle) => (angle.hookSignals ?? 0) >= minSignals);
  const weakHook = angles.find((angle) => (angle.hookSignals ?? 0) < minSignals);
  check('hooks.signals', 4, 'high', signalsOk, `Every hook carries at least ${minSignals} hook signal(s).`, weakHook ? weakHook.hook : 'hooks', 'Use a specific number, name the pain, or open a curiosity gap.');
  const firstWords = angles.map((angle) => String(angle.hook || '').toLowerCase().split(/\s+/).slice(0, 3).join(' '));
  const uniqueHooks = new Set(firstWords).size === firstWords.length;
  check('hooks.unique', 3, 'medium', uniqueHooks, 'No two angles open with the same three words.', 'hooks', 'Rewrite duplicate openings so each angle starts differently.');
  const fluffHits = angles.flatMap((angle) => testAll(FLUFF, angle.hook || '').map((rx) => ({ hook: angle.hook, pattern: rx.source })));
  check('hooks.fluff', 4, 'high', fluffHits.length === 0, fluffHits.length ? `Fluff language in ${fluffHits.length} hook(s).` : 'No fluff language in hooks.', fluffHits[0]?.hook || 'hooks', 'Replace game-changer / unlock / 10x language with the specific claim.');

  // ---------- Scripts (15) ----------
  const pacingFailures = angles.filter((angle) => {
    const spoken = (angle.beats || []).map((beat) => beat.spoken || '').join(' ');
    const seconds = Number(angle.totalDuration) || 0;
    return seconds > 0 && wordCount(spoken) / seconds > 3.5;
  });
  check('scripts.pacing', 4, 'high', pacingFailures.length === 0, pacingFailures.length ? `Pacing exceeds 3.5 words/second in ${pacingFailures.length} angle(s).` : 'Pacing is at or below 3.5 words/second.', pacingFailures[0]?.id || 'angles', 'Cut words or lengthen the runtime; rushed UGC reads as an ad.');
  const hookWindowFailures = angles.filter((angle) => {
    const first = angle.beats?.[0];
    return !first || Number(first.end) > 3 || wordCount(first.spoken) > 12;
  });
  check('scripts.hookWindow', 3, 'high', hookWindowFailures.length === 0, hookWindowFailures.length ? `Hook is not delivered inside 3 seconds in ${hookWindowFailures.length} angle(s).` : 'Hook lands inside the first 3 seconds in every angle.', hookWindowFailures[0]?.id || 'angles', 'Move the hook to beat 1, cut it to 12 words, and make sure it ends by 3s.');
  const ctaFailures = angles.filter((angle) => !/link|tap|shop|bio|see\b/i.test(angle.cta || ''));
  check('scripts.cta', 3, 'high', ctaFailures.length === 0, ctaFailures.length ? `Missing a clear CTA in ${ctaFailures.length} angle(s).` : 'Every angle has one clear CTA.', ctaFailures[0]?.id || 'angles', 'End on one action: tap the link, check the price, see the routine.');
  const disclosureRequired = Boolean(pack.compliance?.disclosureRequired);
  const disclosureFailures = disclosureRequired
    ? angles.filter((angle) => !angle.disclosure || !/(#ad|\bad\b|paid|ai-generated|ai generated)/i.test(angle.disclosure))
    : [];
  check('scripts.disclosure', 3, 'critical', disclosureFailures.length === 0, disclosureFailures.length ? `Missing AI/paid disclosure in ${disclosureFailures.length} angle(s).` : (disclosureRequired ? 'Every angle carries an AI/paid disclosure.' : 'No disclosure required for this style.'), disclosureFailures[0]?.id || 'compliance', 'Add an explicit paid-partnership and AI-generated disclosure.');
  const beatFailures = angles.filter((angle) => {
    let cursor = 0;
    for (const beat of angle.beats || []) {
      if (Number(beat.start) !== cursor) return true;
      if (Number(beat.end) <= Number(beat.start)) return true;
      cursor = Number(beat.end);
    }
    return cursor !== Number(angle.totalDuration) || Number(angle.totalDuration) !== Number(pack.meta?.duration);
  });
  check('scripts.beats', 2, 'high', beatFailures.length === 0, beatFailures.length ? `${beatFailures.length} angle(s) have broken timing or runtime.` : 'Beat timings are contiguous and match the runtime.', beatFailures[0]?.id || 'angles', 'Rebuild the pack; do not hand-edit timecodes.');

  // ---------- Video prompts (25) ----------
  const badModel = scenes.find((scene) => !VIDEO_MODELS[scene.model]);
  check('video.model', 3, 'high', !badModel, badModel ? `Unknown video model: ${badModel.model}.` : 'Every scene uses a supported video model.', badModel?.id || 'scenes', 'Use a model listed in the skill (veo-3.1-flow, kling-2.5, runway-gen4, …).');
  const badAspect = scenes.find((scene) => scene.aspect !== '9:16');
  check('video.aspect', 3, 'critical', !badAspect, badAspect ? `Scene ${badAspect.id} is ${badAspect.aspect}, not 9:16.` : 'Every video scene is 9:16.', badAspect?.id || 'scenes', 'Vertical 9:16 is the delivery format; regenerate this scene.');
  const missingCharacter = scenes.find((scene) => !String(scene.prompt || '').includes(tokens.characterBlock));
  check('video.character', 4, 'critical', !missingCharacter, missingCharacter ? `Character block missing from scene ${missingCharacter.id}.` : 'Character block is verbatim in every scene prompt.', missingCharacter?.id || 'scenes', 'Paste the full character block verbatim; do not paraphrase it.');
  const missingProduct = scenes.find((scene) => !String(scene.prompt || '').includes(tokens.productBlock));
  check('video.product', 3, 'high', !missingProduct, missingProduct ? `Product block missing from scene ${missingProduct.id}.` : 'Product block is verbatim in every scene prompt.', missingProduct?.id || 'scenes', 'Paste the full product block verbatim into every prompt.');
  const missingGrade = scenes.find((scene) => !String(scene.prompt || '').includes(tokens.gradeBlock));
  check('video.grade', 2, 'high', !missingGrade, missingGrade ? `Grade block missing from scene ${missingGrade.id}.` : 'Grade block is in every scene prompt.', missingGrade?.id || 'scenes', 'Use one grade block for the whole campaign.');
  const missingNegative = scenes.find((scene) => !scene.negativePrompt || !/Negative prompt:/i.test(scene.prompt || ''));
  check('video.negative', 2, 'high', !missingNegative, missingNegative ? `Negative prompt missing from scene ${missingNegative.id}.` : 'Every scene has a negative prompt.', missingNegative?.id || 'scenes', 'Add the labeled negative prompt line.');
  const badSeed = scenes.find((scene) => !Number.isInteger(scene.seed) || scene.seed <= 0);
  check('video.seed', 2, 'medium', !badSeed, badSeed ? `Scene ${badSeed.id} has no locked seed.` : 'Every scene has a locked integer seed.', badSeed?.id || 'scenes', 'Lock a positive integer seed per scene.');
  const badDuration = scenes.find((scene) => Number(scene.duration) < 2 || Number(scene.duration) > 8);
  check('video.duration', 2, 'high', !badDuration, badDuration ? `Scene ${badDuration.id} is ${badDuration.duration}s (allowed 2–8s).` : 'Every scene is between 2 and 8 seconds.', badDuration?.id || 'scenes', 'Split the scene or trim it into the 2–8s window.');
  const badText = scenes.find((scene) => !/no on-screen text/i.test(scene.prompt || '') || /(add|include|write)\s+(bold\s+)?(text overlay|headline text)/i.test(scene.prompt || ''));
  check('video.noText', 2, 'high', !badText, badText ? `Scene ${badText.id} requests baked-in text or is missing the no-text guard.` : 'No scene asks the model to bake in text.', badText?.id || 'scenes', 'Generate a clean plate; add text in the edit.');
  const shortPrompt = scenes.find((scene) => wordCount(scene.prompt) < 90);
  check('video.length', 2, 'medium', !shortPrompt, shortPrompt ? `Scene ${shortPrompt.id} prompt is only ${wordCount(shortPrompt.prompt)} words.` : 'Every scene prompt is at least 90 words.', shortPrompt?.id || 'scenes', 'Restore the full consistency blocks and camera detail.');

  // ---------- Image prompts (15) ----------
  const badImageModel = images.find((image) => !IMAGE_MODELS.includes(image.model));
  check('image.model', 2, 'high', !badImageModel, badImageModel ? `Unknown image model: ${badImageModel.model}.` : 'Every image uses a supported model.', badImageModel?.id || 'images', 'Use nano-banana-pro, midjourney-v7, flux-1.1-pro or imagen-4.');
  const badImageAspect = images.find((image) => !ASPECTS.includes(image.aspect));
  check('image.aspect', 2, 'high', !badImageAspect, badImageAspect ? `Image ${badImageAspect.id} has an invalid aspect.` : 'Every image aspect is valid.', badImageAspect?.id || 'images', 'Use 4:5, 1:1, 9:16 or 16:9.');
  const missingImageProduct = images.find((image) => !String(image.prompt || '').includes(tokens.productBlock));
  check('image.product', 3, 'high', !missingImageProduct, missingImageProduct ? `Product block missing from image ${missingImageProduct.id}.` : 'Product block is verbatim in every image prompt.', missingImageProduct?.id || 'images', 'Paste the full product block verbatim.');
  const missingImageGrade = images.find((image) => !String(image.prompt || '').includes(tokens.gradeBlock));
  check('image.grade', 2, 'high', !missingImageGrade, missingImageGrade ? `Grade block missing from image ${missingImageGrade.id}.` : 'Grade block is in every image prompt.', missingImageGrade?.id || 'images', 'Use the same grade block as the video.');
  const missingCraft = images.find((image) => !String(image.prompt || '').includes(tokens.craftBlock));
  check('image.craft', 2, 'high', !missingCraft, missingCraft ? `Craft block missing from image ${missingCraft.id}.` : 'Craft block is in every image prompt.', missingCraft?.id || 'images', 'Keep the camera/lens/lighting craft block.');
  const badImageText = images.find((image) => !/no text/i.test(image.prompt || '') || !/no watermark/i.test(image.prompt || ''));
  check('image.noText', 4, 'critical', !badImageText, badImageText ? `Image ${badImageText.id} is missing the no-text/no-watermark guard.` : 'Every image prompt forbids baked-in text and watermarks.', badImageText?.id || 'images', 'Generate clean plates; add copy in the editor.');

  // ---------- Captions (10) ----------
  const captionLimitFailures = [];
  for (const angle of angles) {
    const ig = angle.captions?.instagram;
    const tt = angle.captions?.tiktok;
    const yt = angle.captions?.youtubeShorts;
    if (!ig || String(ig.text || '').length > 2200) captionLimitFailures.push(`${angle.id}:instagram`);
    if (!tt || String(tt.text || '').length > 2200) captionLimitFailures.push(`${angle.id}:tiktok`);
    if (!yt || String(yt.title || '').length > 100) captionLimitFailures.push(`${angle.id}:youtube-title`);
    if (!yt || String(yt.description || '').length > 5000) captionLimitFailures.push(`${angle.id}:youtube-description`);
  }
  check('captions.limit', 3, 'high', captionLimitFailures.length === 0, captionLimitFailures.length ? `Caption length violations: ${captionLimitFailures.join(', ')}.` : 'Captions are inside every platform limit.', 'captions', 'Trim the caption; never trim the disclosure.');
  const captionCtaFailures = angles.filter((angle) => !/link|tap|shop|see\b/i.test(angle.captions?.instagram?.text || ''));
  check('captions.cta', 2, 'medium', captionCtaFailures.length === 0, captionCtaFailures.length ? `Missing CTA in ${captionCtaFailures.length} Instagram caption(s).` : 'Every Instagram caption has a CTA.', captionCtaFailures[0]?.id || 'captions', 'Add one CTA line above the hashtags.');
  const captionDisclosureFailures = disclosureRequired
    ? angles.filter((angle) => !/(#ad|\bad\b|paid|ai-generated|ai generated)/i.test(angle.captions?.instagram?.text || ''))
    : [];
  check('captions.disclosure', 3, 'critical', captionDisclosureFailures.length === 0, captionDisclosureFailures.length ? `Disclosure missing from ${captionDisclosureFailures.length} caption(s).` : (disclosureRequired ? 'Every caption carries the disclosure.' : 'No disclosure required for this style.'), captionDisclosureFailures[0]?.id || 'captions', 'Add #ad and the AI-generated disclosure.');
  const hashtagFailures = angles.filter((angle) => {
    const tags = angle.captions?.instagram?.hashtags;
    return !Array.isArray(tags) || tags.length === 0 || tags.length > 5;
  });
  check('captions.hashtags', 2, 'low', hashtagFailures.length === 0, hashtagFailures.length ? `${hashtagFailures.length} caption(s) have 0 or more than 5 hashtags.` : 'Every caption uses 1–5 hashtags.', hashtagFailures[0]?.id || 'captions', 'Use 1–5 specific hashtags instead of a wall of tags.');

  // ---------- Compliance (10) ----------
  const claimText = collectClaimText(pack);
  const bannedHits = [];
  for (const rule of BANNED_CLAIMS) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(claimText)) bannedHits.push(rule.label);
  }
  check('compliance.bannedClaims', 4, 'critical', bannedHits.length === 0, bannedHits.length ? `Blocked claim language: ${[...new Set(bannedHits)].join(', ')}.` : 'No blocked claim language in ad copy.', 'claims', 'Rewrite the claim as mechanism language or attach evidence and get human approval.');
  const urgencyHits = testAll(FAKE_URGENCY, claimText);
  check('compliance.urgency', 2, 'high', urgencyHits.length === 0, urgencyHits.length ? 'Fake urgency or countdown language found.' : 'No fake urgency or countdown language.', 'claims', 'Remove countdowns and false scarcity.');
  const personalHits = testAll(PERSONAL_ATTRIBUTES, claimText);
  check('compliance.personalAttributes', 2, 'critical', personalHits.length === 0, personalHits.length ? 'Personal-attribute phrasing found (Meta policy risk).' : 'No personal-attribute phrasing.', 'claims', 'Describe the product, not the viewer’s body, debt or identity.');
  const priceMatches = [...claimText.matchAll(/[₹$€£]\s?\d[\d,]*/g)].map((match) => normalizePrice(match[0]));
  const expectedPrice = normalizePrice(pack.brief?.price?.label);
  const priceFailures = priceMatches.filter((value) => value !== expectedPrice);
  check('compliance.price', 2, 'high', priceFailures.length === 0, priceFailures.length ? `Price mismatch: ${priceFailures.join(', ')} vs ${pack.brief?.price?.label}.` : 'Every price in the copy matches the brief.', 'price', 'Use one price everywhere; re-check the checkout before publishing.');

  // ---------- Score ----------
  const totalWeight = checks.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = checks.filter((item) => item.passed).reduce((sum, item) => sum + item.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);
  const critical = findings.some((item) => item.severity === 'critical');
  const high = findings.some((item) => item.severity === 'high');
  const verdict = critical || score < 60 ? 'DO NOT SHIP' : (score >= args.min && !high ? 'PASS' : 'FIX NEEDED');

  const report = {
    schemaVersion: pack.schemaVersion || null,
    campaign: `${pack.meta?.brand || 'Unknown'} ${pack.meta?.product || ''}`.trim(),
    checkedAt: new Date().toISOString(),
    score,
    minScore: args.min,
    verdict,
    stats: {
      angles: angles.length,
      videoScenes: scenes.length,
      imagePrompts: images.length,
      checks: checks.length,
      passed: checks.filter((item) => item.passed).length,
      failed: findings.length,
      critical: findings.filter((item) => item.severity === 'critical').length,
      high: findings.filter((item) => item.severity === 'high').length,
      medium: findings.filter((item) => item.severity === 'medium').length,
      low: findings.filter((item) => item.severity === 'low').length
    },
    findings,
    checks
  };

  const md = renderMarkdown(report);
  if (args.json) {
    const output = JSON.stringify(report, null, 2) + '\n';
    if (args.json === '-') process.stdout.write(output);
    else await fs.writeFile(path.resolve(args.json), output);
  }
  if (args.md) {
    if (args.md === '-') process.stdout.write(md);
    else await fs.writeFile(path.resolve(args.md), md);
  }
  if (args.md !== '-' && args.json !== '-') {
    process.stdout.write([
      `${report.campaign} — score ${score}/100 · ${verdict}`,
      `  checks: ${report.stats.passed}/${report.stats.checks} passed · findings: ${report.stats.critical} critical, ${report.stats.high} high, ${report.stats.medium} medium, ${report.stats.low} low`,
      verdict === 'PASS' ? '  Ready to spend. Keep the pack and the evidence with the campaign.' : '  Fix critical and high findings before spending. Re-run with --md=audit.md for the full report.',
      ''
    ].join('\n'));
  }

  if (args.reportOnly) return;
  process.exitCode = verdict === 'PASS' ? 0 : 1;
}

function renderMarkdown(report) {
  const lines = [
    `# UGC pack audit — ${report.campaign}`,
    '',
    `**Score: ${report.score}/100 · ${report.verdict}**`,
    '',
    `Angles: ${report.stats.angles} · video prompts: ${report.stats.videoScenes} · image prompts: ${report.stats.imagePrompts} · checks: ${report.stats.passed}/${report.stats.checks} passed`,
    '',
    '## Findings',
    ''
  ];
  if (!report.findings.length) {
    lines.push('No findings. Every deterministic check passed.', '');
  } else {
    const order = ['critical', 'high', 'medium', 'low'];
    for (const severity of order) {
      const items = report.findings.filter((item) => item.severity === severity);
      if (!items.length) continue;
      lines.push(`### ${severity.toUpperCase()} (${items.length})`, '');
      for (const item of items) {
        lines.push(`- **${item.id}** — ${item.message}${item.where ? ` _(${item.where})_` : ''}`);
        if (item.fix) lines.push(`  - Fix: ${item.fix}`);
      }
      lines.push('');
    }
  }
  lines.push('## All checks', '', '| Check | Weight | Status | Detail |', '| --- | ---: | --- | --- |');
  for (const item of report.checks) {
    lines.push(`| ${item.id} | ${item.weight} | ${item.passed ? 'PASS' : 'FAIL'} | ${String(item.message).replace(/\|/g, '\\|')} |`);
  }
  lines.push('', '## What this audit does not do', '');
  lines.push('- It does not verify that the product claims are true. Attach evidence and get human sign-off.');
  lines.push('- It does not replace a platform policy review or legal review.');
  lines.push('- It does not guarantee performance. It removes the deterministic failure modes before you spend.');
  return lines.join('\n') + '\n';
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(2);
});
