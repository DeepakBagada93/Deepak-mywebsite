# UGC Ad Studio — customer guide and tutorial

This guide takes you from the download to your first audited ad pack. You need Node.js 20+ and a product brief. No API key, no account, no npm install.

---

## 1. What is in your download

```
skills/ugc-ad-studio/SKILL.md          The skill your agent loads
skills/ugc-ad-studio/scripts/          Builder + audit (zero dependencies)
examples/nara-brief.json               A complete sample brief
examples/nara-campaign/                A full sample pack
examples/broken-pack.json              A deliberately unsafe pack
examples/expected/                     Expected audit reports
docs/                                  This guide, the listing, the spec, the research
tests/                                 18 structural and functional tests
LICENSE.md                             Commercial license
COMPATIBILITY.md                       Client install notes and prompt portability
```

---

## 2. Three-minute quickstart

1. Unzip the package anywhere you keep tools.

2. Install the skill for your client (section 3), or run the scripts directly from the package.

3. Run the builder on the sample brief:

```bash
cd skills/ugc-ad-studio
node scripts/build-ugc-campaign.mjs ../../examples/nara-brief.json --out ./my-campaign
```

You should see:

```
Built 6 angles for Nara Vitamin C Face Serum.
  video prompts : 30
  image prompts : 24
  runtime       : 30s
  style         : UGC testimonial · front-camera
```

4. Audit the pack:

```bash
node scripts/audit-ugc-pack.mjs ./my-campaign/campaign.json --md=./my-campaign/audit.md
```

You should see `score 100/100 · PASS` and exit code 0.

5. Run the broken pack to see a failure:

```bash
node scripts/audit-ugc-pack.mjs ../../examples/broken-pack.json
```

You should see `score 38/100 · DO NOT SHIP` and exit code 1.

6. Open `my-campaign/scripts.md`, pick two angles, then generate the scenes in `prompts-video.md`.

---

## 3. Install per client

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -R skills/ugc-ad-studio ~/.claude/skills/
```

Restart Claude Code and run `/skills` to confirm it appears. Invoke with: *"Load ugc-ad-studio and build a 30-second UGC pack from this brief."*

### Cursor

```bash
mkdir -p .cursor/skills
cp -R skills/ugc-ad-studio .cursor/skills/
```

Add to `.cursorrules`: `When the task is ad creative, follow .cursor/skills/ugc-ad-studio/SKILL.md.`

### Codex CLI

```bash
mkdir -p ~/.codex/skills
cp -R skills/ugc-ad-studio ~/.codex/skills/
```

Start a new session and reference the skill by name.

### Google Antigravity

Copy the folder into your project's skills directory (for example `.agent/skills/`), attach `SKILL.md` to the agent context, and run the scripts from the integrated terminal.

### Any other agent

Paste `SKILL.md` as system context. The scripts are plain Node; run them in any terminal with filesystem access.

---

## 4. Write your first real brief

Copy `examples/nara-brief.json` and replace the values. The minimum viable brief:

```json
{
  "brand": "Your Brand",
  "product": "Your Product",
  "category": "your category",
  "buyer": "who exactly, with context",
  "pain": "the problem in the buyer's words",
  "promise": "the honest outcome and how it happens",
  "mechanism": "how the product works",
  "price": { "amount": 1499, "currency": "INR" },
  "style": "ugc-testimonial",
  "duration": 30
}
```

Rules that save you a rebuild:

- `promise` is an outcome plus a mechanism. "Brighter-looking finish in your existing morning routine" works. "Cures dull skin" does not.
- `pain` is the buyer's sentence, not category jargon.
- `proof` is optional. If you do not have a verifiable number, leave it out. The pack will use mechanism angles instead.
- `creator` is optional. If you omit it, the builder creates a casting description that fits the buyer. Change it if you have a real creator or avatar.

Then build:

```bash
node scripts/build-ugc-campaign.mjs my-brief.json --out ./my-campaign --json
```

### Runtime and style flags

```bash
# 15-second cutdown for Reels / Shorts / TikTok
node scripts/build-ugc-campaign.mjs my-brief.json --out ./campaign-15 --duration 15

# 45-second founder story
node scripts/build-ugc-campaign.mjs my-brief.json --out ./campaign-45 --duration 45 --style founder-story

# Cinematic product film
node scripts/build-ugc-campaign.mjs my-brief.json --out ./campaign-cine --style cinematic-product

# Different model family
node scripts/build-ugc-campaign.mjs my-brief.json --out ./campaign-kling --model kling-2.5 --image-model flux-1.1-pro
```

Supported styles: `ugc-testimonial`, `ugc-demo`, `cinematic-product`, `street-interview`, `founder-story`, `before-after`.

Supported video models: `veo-3.1-flow`, `kling-2.5`, `runway-gen4`, `hailuo-02`, `luma-ray3`, `pixverse-v5`.

Supported image models: `nano-banana-pro`, `midjourney-v7`, `flux-1.1-pro`, `imagen-4`.

---

## 5. Produce the pack, step by step

### Step 1 — Read `scripts.md`

Each angle has a hook, a reason it works, a timed beat table and a creator brief. Pick the **two** angles you will produce first. Six angles is a test plan, not a same-day shoot.

### Step 2 — Generate the reference still

Use `prompts-image.md` → `product-hero` and `hook-frame`. Generate one clean still of the creator and one of the product. Upload them as reference images / ingredients in your video tool.

### Step 3 — Generate the video scenes

Open `prompts-video.md`. For each scene:

1. Copy the prompt exactly. Do not paraphrase the character, product or grade block.
2. Paste the negative prompt into the negative field when your tool has one.
3. Keep the seed if your tool exposes it.
4. Generate the scenes in order. When the bridge note says so, use the previous scene's last frame as the next scene's start frame.
5. If a scene fails, change only the action or camera. Never change the identity blocks.

### Step 4 — Generate the image plates

Open `prompts-image.md`. Generate the four clean plates per angle. Add headline, price and CTA in Figma, Canva, CapCut or Photoshop. Never ask the image model to write the text.

### Step 5 — Record or render the avatar variant

Open `heygen-pack.md`. Configure the avatar, voice and background, paste the script, turn on word-level captions, and add the AI-generated label.

**Important:** HeyGen's 2026 policy guidance bans presenting an AI actor as a real customer describing a real experience. Use the avatar as a brand spokesperson and label it AI-generated. If you need a real testimonial, use a real customer with consent.

### Step 6 — Add captions and disclosure

Open `captions.md`. Post the caption for the angle and platform. Keep the disclosure even when trimming. Turn on the platform's paid-partnership toggle when money or product changed hands.

### Step 7 — Audit before spending

```bash
node scripts/audit-ugc-pack.mjs ./my-campaign/campaign.json \
  --md=./my-campaign/audit.md \
  --json=./my-campaign/audit.json
```

Read the findings top-down: critical, then high, then medium. Fix the pack, rebuild, re-run. Do not lower `--min` to force a pass.

---

## 6. Prompt recipes for your agent

### Recipe 1 — Full UGC pack

> Load ugc-ad-studio. My product is [product] at [price]. The buyer is [buyer], the pain is [pain], the promise is [promise], and the mechanism is [mechanism]. Build a 30-second UGC testimonial pack with six angles, then audit it. Do not invent proof. Show me the score and the critical/high findings only.

### Recipe 2 — Static-only week

> Load ugc-ad-studio. Build a 30-second pack for [product], but I only want the image ads this week. Give me the four clean plates per angle, the edit prompts, and the caption pack. Skip the video generation instructions.

### Recipe 3 — Cinematic launch film

> Load ugc-ad-studio. Build a 45-second cinematic product film for [product] at [price]. Use the cinematic angle set, one grade, no first-person testimonial. I want the hero, ritual, proof, objection, identity and CTA angles, and a clean end card.

### Recipe 4 — Avatar cut for a founder

> Load ugc-ad-studio with style founder-story. Build a 30-second pack for [product]. I will render the presenter in HeyGen. Give me the avatar script, voice direction, background, caption config, disclosure and the six video prompts for B-roll. Flag any claim HeyGen policy would reject.

### Recipe 5 — Audit an existing pack

> Load ugc-ad-studio. Audit this campaign.json before I spend. Give me the score, the verdict, and every critical and high finding with the exact fix. Do not rewrite the whole pack unless I ask.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Error: Brief is missing required fields: buyer, pain` | Required field absent | Add the named field; do not use defaults for these |
| `duration must be 15, 30 or 45 seconds` | Unsupported runtime | Pick one of the three |
| Audit says `video.character` failed | A prompt was hand-edited and lost the character block | Rebuild the pack; paste the block verbatim |
| Audit says `video.aspect` failed | A scene is not 9:16 | Regenerate the scene vertical; do not crop a 16:9 render |
| Audit says `video.noText` failed | The prompt asks the model to write text | Generate a clean plate; add text in the edit |
| Audit says `scripts.pacing` failed | Too many words for the runtime | Cut words or use a longer runtime |
| Audit says `compliance.bannedClaims` failed | Guarantee, 100%, cure, instant, #1 or similar | Rewrite as mechanism language and attach evidence |
| The product label drifts between scenes | Reference image missing or weak | Upload the product hero still as an ingredient; keep the product block verbatim |
| The creator's face changes | Reference image not reused, or the character block paraphrased | Reuse the same ingredient and the exact block |
| The avatar looks like a fake customer | Wrong framing | Use the avatar as a spokesperson and label it AI-generated |
| Captions cut off | Caption over the platform limit | Trim the middle sentence, keep the disclosure |
| The audit passes but the ad feels generic | The brief's pain and promise are generic | Rewrite the brief in the buyer's words, then rebuild |

---

## 8. FAQ

**Do I need a paid generation account?**
No to build and audit the pack. Yes to render. The prompts work on consumer plans and API plans.

**Which model should I use first?**
Veo 3.1 / Flow for native dialogue and the best prompt adherence. Kling for stylised motion. Runway for controlled, edit-friendly footage. HeyGen if you want a presenter without a shoot.

**Can I sell the ads I make?**
Yes. The license lets you deliver outputs to clients. You may not resell the raw skill files.

**Does the audit guarantee my ad will be approved or profitable?**
No. It removes deterministic failure modes: missing consistency blocks, unsafe claims, missing disclosure, wrong aspect, over-limit captions. Platform review and performance remain human and market questions.

**What if I have no proof?**
Leave `proof` out. The pack builds mechanism angles and the claims ledger marks the promise as "evidence required". Do not invent a number.

**Can I edit `campaign.json` by hand?**
You can, but the audit will catch broken timing, missing blocks and inconsistent prices. Prefer editing the brief and rebuilding.

**Is my data sent anywhere?**
No. The scripts read and write local files. No network, no telemetry, no API keys.

---

## 9. Support

Email support@deepakbagada.in with your Node version, the command you ran, and the exit code. For a broken pack, attach `audit.json`.
