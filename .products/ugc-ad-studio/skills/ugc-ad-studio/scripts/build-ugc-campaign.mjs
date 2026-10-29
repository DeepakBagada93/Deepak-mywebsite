#!/usr/bin/env node
// UGC Ad Studio — deterministic campaign builder
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { buildCampaign } from './lib.mjs';

const HELP = `UGC Ad Studio — campaign builder

Usage:
  node scripts/build-ugc-campaign.mjs <brief.json> [options]

Options:
  --out <dir>          Output directory (default: ./ugc-campaign)
  --style <id>         ugc-testimonial | ugc-demo | cinematic-product | street-interview | founder-story | before-after
  --duration <sec>     15 | 30 | 45 (default: brief value or 30)
  --seed <n>           Lock a base seed for every scene (default: 0)
  --model <id>         veo-3.1-flow | kling-2.5 | runway-gen4 | hailuo-02 | luma-ray3 | pixverse-v5
  --image-model <id>   nano-banana-pro | midjourney-v7 | flux-1.1-pro | imagen-4
  --json               Print a machine-readable summary
  --help               Show this help

Reads a brief, writes campaign.json plus seven Markdown handoff files, and
leaves the pack ready for audit-ugc-pack.mjs. No network calls, no API keys.
`;

function parseArgs(argv) {
  const args = { flags: {}, brief: null };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--help' || item === '-h') { args.flags.help = true; continue; }
    if (item === '--json') { args.flags.json = true; continue; }
    if (!item.startsWith('--')) { if (!args.brief) args.brief = item; continue; }
    const key = item.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    args.flags[key] = value;
    i += 1;
  }
  return args;
}

function slugify(value) {
  return String(value || 'campaign').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'campaign';
}

function codeBlock(text) {
  return '```text\n' + text + '\n```';
}

function renderVideoDoc(pack) {
  const lines = [
    `# Video prompt pack — ${pack.meta.brand} ${pack.meta.product}`,
    '',
    `Model: **${pack.meta.videoModel}** · Aspect: **9:16** · Runtime target: **${pack.meta.duration}s** · Angles: **${pack.meta.angleCount}** · Prompts: **${pack.meta.totalVideoPrompts}**`,
    '',
    '## Read this before generating',
    '',
    '1. Generate one clean reference still of the creator and upload it as an ingredient / reference image in your tool.',
    '2. Paste the **character block**, **product block** and **grade block** into every prompt exactly as written. Do not paraphrase them.',
    '3. Generate scenes in order. Use the previous scene’s last frame as the next scene’s start frame when the bridge note says so.',
    '4. Keep the seed when your tool exposes one. Change the action, not the identity tokens.',
    '5. Add captions, CTA and text overlays in the edit, never inside the generated frame.',
    '',
    '## Locked consistency blocks',
    '',
    codeBlock(['CHARACTER', pack.consistency.characterBlock, '', 'PRODUCT', pack.consistency.productBlock, '', 'GRADE', pack.consistency.gradeBlock, '', 'WORLD', pack.consistency.worldBlock].join('\n')),
    ''
  ];
  for (const angle of pack.angles) {
    lines.push(`## Angle: ${angle.title} (\`${angle.id}\`)`, '');
    lines.push(`Hook: **${angle.hook}**`, '');
    lines.push(`Why it works: ${angle.whyItWorks}`, '');
    for (const scene of angle.scenes) {
      lines.push(`### Scene ${scene.index} · ${scene.duration}s · ${scene.modelLabel} · seed ${scene.seed}`, '');
      lines.push(codeBlock(scene.prompt));
      lines.push('');
      lines.push(`- Negative prompt (paste into the negative field when supported): \`${scene.negativePrompt}\``);
      lines.push(`- Bridge: ${scene.bridge}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

function renderImageDoc(pack) {
  const lines = [
    `# Image ad prompt pack — ${pack.meta.brand} ${pack.meta.product}`,
    '',
    `Model: **${pack.meta.imageModel}** · Prompts: **${pack.meta.totalImagePrompts}**`,
    '',
    'Generate the clean plates here, then add hook text, price and CTA in your editor (Figma, Canva, CapCut, Photoshop). Text baked into an image model is the fastest way to get a misspelled label.',
    '',
    '## Locked consistency blocks',
    '',
    codeBlock(['CHARACTER', pack.consistency.characterBlock, '', 'PRODUCT', pack.consistency.productBlock, '', 'GRADE', pack.consistency.gradeBlock, '', 'CRAFT', pack.consistency.craftBlock].join('\n')),
    ''
  ];
  for (const angle of pack.angles) {
    lines.push(`## Angle: ${angle.title} (\`${angle.id}\`)`, '');
    for (const image of angle.images) {
      lines.push(`### ${image.id} · ${image.aspect} · ${image.model} · seed ${image.seed}`, '');
      lines.push(`Purpose: ${image.purpose}`, '');
      lines.push(codeBlock(image.prompt));
      lines.push('');
      lines.push(`- Edit / inpaint prompt: ${image.editPrompt}`);
      lines.push(`- Negative: \`${image.negativePrompt}\``);
      lines.push('');
    }
  }
  return lines.join('\n');
}

function renderHeyGenDoc(pack) {
  const lines = [
    `# HeyGen avatar pack — ${pack.meta.brand} ${pack.meta.product}`,
    '',
    'Use this when you want a synthetic presenter instead of generating a creator from scratch. HeyGen consumes a script, an avatar and a voice, not an image prompt.',
    '',
    '## Setup checklist',
    '',
    '- [ ] Pick or clone an avatar and confirm you have the rights to use its likeness.',
    '- [ ] Pick a voice and audition it on the first line only.',
    '- [ ] Upload or select the background described below.',
    '- [ ] Turn on word-level captions and keep them inside the bottom safe zone.',
    '- [ ] Add the AI-generated label and the paid-partnership disclosure before publishing.',
    '',
    `## Output target`,
    '',
    `${pack.meta.duration}s · 9:16 · 1080x1920 · 30fps`,
    ''
  ];
  for (const angle of pack.angles) {
    const h = angle.heygen;
    lines.push(`## Angle: ${angle.title} (\`${angle.id}\`)`, '');
    lines.push(`- Avatar: ${h.avatarDescription}`);
    lines.push(`- Background: ${h.background}`);
    lines.push(`- Voice direction: ${h.voiceDirection}`);
    lines.push(`- Captions: ${h.captions.style}`);
    lines.push(`- Disclosure: ${h.disclosure}`);
    lines.push(`- Configure before render: ${h.configureBeforeRender.map((x) => '`' + x + '`').join(', ')}`);
    lines.push('');
    lines.push('Script:');
    lines.push('');
    lines.push(codeBlock(h.script || angle.hook));
    lines.push('');
  }
  return lines.join('\n');
}

function renderScriptsDoc(pack) {
  const lines = [
    `# Scripts, shot lists and creator briefs — ${pack.meta.brand} ${pack.meta.product}`,
    '',
    `Style: **${pack.meta.styleLabel}** · Runtime: **${pack.meta.duration}s** · Angles: **${pack.meta.angleCount}**`,
    '',
    '## The brief this pack was built from',
    '',
    `- Buyer: ${pack.brief.buyer}`,
    `- Pain: ${pack.brief.pain}`,
    `- Promise: ${pack.brief.promise}`,
    `- Proof: ${pack.brief.hasProof ? pack.brief.proof : 'none supplied — every angle uses mechanism language instead of results'}`,
    `- Offer: ${pack.brief.offer} at ${pack.brief.priceLabel}`,
    `- Objections: ${pack.brief.objections.join(' / ')}`,
    ''
  ];
  for (const angle of pack.angles) {
    lines.push(`## ${angle.title} (\`${angle.id}\`)`, '');
    lines.push(`Hook (${angle.hookWordCount} words, ${angle.hookSignals} hook signals): **${angle.hook}**`, '');
    lines.push(`Why it works: ${angle.whyItWorks}`, '');
    lines.push('| # | Time | Beat | Spoken | On-screen text | Visual |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    for (const beat of angle.beats) {
      lines.push(`| ${beat.index} | ${beat.start}–${beat.end}s | ${beat.beat} | ${beat.spoken || '—'} | ${beat.onScreen || '—'} | ${beat.visual} |`);
    }
    lines.push('');
    lines.push('Creator brief:');
    lines.push('');
    lines.push(`- Cast: ${pack.consistency.characterBlock}`);
    lines.push(`- Wardrobe continuity: keep the same outfit, hair and jewellery in every scene.`);
    lines.push(`- Product handling: label square to camera in the first and last scene; no extra props on the label.`);
    lines.push(`- Performance: talk to one person, not to a crowd. Keep energy below 6/10. No pointing at imaginary text.`);
    lines.push(`- Do not say: guaranteed, cure, instant, 100%, or any result the product page cannot prove.`);
    lines.push('');
  }
  return lines.join('\n');
}

function renderCaptionsDoc(pack) {
  const lines = [
    `# Caption pack — ${pack.meta.brand} ${pack.meta.product}`,
    '',
    'One caption per angle per platform. Post the caption text as-is, or trim the middle sentence — do not trim the disclosure.',
    ''
  ];
  for (const angle of pack.angles) {
    lines.push(`## ${angle.title} (\`${angle.id}\`)`, '');
    lines.push('### Instagram', '', codeBlock(angle.captions.instagram.text), '');
    lines.push('### TikTok', '', codeBlock(angle.captions.tiktok.text), '');
    lines.push('### YouTube Shorts', '');
    lines.push(`Title: ${angle.captions.youtubeShorts.title}`);
    lines.push('');
    lines.push(codeBlock(angle.captions.youtubeShorts.description));
    lines.push('');
  }
  return lines.join('\n');
}

function renderComplianceDoc(pack) {
  const lines = [
    `# Compliance and claims — ${pack.meta.brand} ${pack.meta.product}`,
    '',
    'This is a production checklist, not legal advice. A human signs off before publishing.',
    '',
    '## Disclosure',
    '',
    `- Required for this style: **${pack.compliance.disclosureRequired ? 'yes' : 'no'}**`,
    `- Caption disclosure: ${pack.compliance.disclosure}`,
    '- Label realistic AI-generated presenters as AI-generated on the platform, not only in the caption.',
    '- Turn on the paid-partnership / branded-content toggle when money or product changed hands.',
    '',
    '## Claims ledger',
    '',
    '| Claim | Type | Source | Status | Action |',
    '| --- | --- | --- | --- | --- |'
  ];
  for (const entry of pack.claimsLedger) {
    lines.push(`| ${entry.claim} | ${entry.type} | ${entry.source} | ${entry.status} | ${entry.action} |`);
  }
  lines.push('', '## Rules enforced by this pack', '');
  for (const rule of pack.compliance.rules) lines.push(`- ${rule}`);
  lines.push('', '## Claims rewritten during the build', '');
  if (pack.compliance.claimRewrites.length) {
    for (const change of pack.compliance.claimRewrites) lines.push(`- Rewrote a claim matching \`${change}\` into neutral mechanism language. Check the final copy still says what you mean.`);
  } else {
    lines.push('- None. The brief did not contain blocked claim patterns.');
  }
  lines.push('', '## Before you publish', '');
  lines.push('- [ ] Every claim on the landing page matches a claim in the ad.');
  lines.push('- [ ] The price in the ad matches the checkout.');
  lines.push('- [ ] Someone with the product has watched the final cut.');
  lines.push('- [ ] Music is licensed for commercial use.');
  lines.push('- [ ] The AI-generated and paid-partnership disclosures are visible.');
  return lines.join('\n');
}

function renderReadme(pack) {
  return [
    `# ${pack.meta.brand} ${pack.meta.product} — UGC ad pack`,
    '',
    `Built by UGC Ad Studio · ${pack.meta.angleCount} angles · ${pack.meta.totalVideoPrompts} video prompts · ${pack.meta.totalImagePrompts} image prompts · ${pack.meta.duration}s runtime`,
    '',
    '## What is in this folder',
    '',
    '| File | Use |',
    '| --- | --- |',
    '| `campaign.json` | The machine-readable pack. Feed this to `audit-ugc-pack.mjs`. |',
    '| `prompts-video.md` | One copy-paste video prompt per scene, with negative and seed. |',
    '| `prompts-image.md` | Static image prompts plus local edit prompts. |',
    '| `heygen-pack.md` | Avatar scripts, voice direction and disclosure. |',
    '| `scripts.md` | Hooks, beat sheets, shot lists and creator briefs. |',
    '| `captions.md` | Platform-native captions per angle. |',
    '| `compliance.md` | Claims ledger and publishing checklist. |',
    '',
    '## Order of work',
    '',
    '1. Read `scripts.md` and pick the two angles you will actually produce.',
    '2. Generate the creator reference still, then the video scenes in `prompts-video.md`.',
    '3. Generate clean plates in `prompts-image.md` and add text in the editor.',
    '4. Record or render the avatar cut from `heygen-pack.md` if you want a second format.',
    '5. Audit the pack: `node scripts/audit-ugc-pack.mjs campaign.json --md=audit.md`.',
    '6. Fix every critical and high finding before spending money.',
    ''
  ].join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.flags.help) { process.stdout.write(HELP); return; }
  if (!args.brief) { process.stderr.write('Error: brief JSON path is required.\n\n' + HELP); process.exit(1); }

  const briefPath = path.resolve(args.brief);
  let raw;
  try {
    raw = JSON.parse(await fs.readFile(briefPath, 'utf8'));
  } catch (error) {
    process.stderr.write(`Error: cannot read brief at ${briefPath}: ${error.message}\n`);
    process.exit(1);
  }

  let pack;
  try {
    pack = buildCampaign(raw, {
      style: args.flags.style,
      duration: args.flags.duration ? Number(args.flags.duration) : undefined,
      seed: args.flags.seed ? Number(args.flags.seed) : 0,
      model: args.flags.model,
      imageModel: args.flags['image-model']
    });
  } catch (error) {
    process.stderr.write(`Error: ${error.message}\n`);
    process.exit(1);
  }

  const outDir = path.resolve(args.flags.out || `ugc-campaign-${slugify(pack.meta.brand + '-' + pack.meta.product)}`);
  await fs.mkdir(outDir, { recursive: true });

  const files = {
    'campaign.json': JSON.stringify(pack, null, 2) + '\n',
    'prompts-video.md': renderVideoDoc(pack),
    'prompts-image.md': renderImageDoc(pack),
    'heygen-pack.md': renderHeyGenDoc(pack),
    'scripts.md': renderScriptsDoc(pack),
    'captions.md': renderCaptionsDoc(pack),
    'compliance.md': renderComplianceDoc(pack),
    'README.md': renderReadme(pack)
  };
  for (const [name, content] of Object.entries(files)) {
    await fs.writeFile(path.join(outDir, name), content);
  }

  if (args.flags.json) {
    process.stdout.write(JSON.stringify({
      outDir,
      campaign: path.join(outDir, 'campaign.json'),
      angles: pack.meta.angleCount,
      videoPrompts: pack.meta.totalVideoPrompts,
      imagePrompts: pack.meta.totalImagePrompts,
      duration: pack.meta.duration,
      style: pack.meta.style,
      files: Object.keys(files)
    }, null, 2) + '\n');
    return;
  }

  process.stdout.write([
    `Built ${pack.meta.angleCount} angles for ${pack.meta.brand} ${pack.meta.product}.`,
    `  video prompts : ${pack.meta.totalVideoPrompts}`,
    `  image prompts : ${pack.meta.totalImagePrompts}`,
    `  runtime       : ${pack.meta.duration}s`,
    `  style         : ${pack.meta.styleLabel}`,
    `  output        : ${outDir}`,
    '',
    `Next: node scripts/audit-ugc-pack.mjs "${path.join(outDir, 'campaign.json')}" --md="${path.join(outDir, 'audit.md')}"`,
    ''
  ].join('\n'));
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});
