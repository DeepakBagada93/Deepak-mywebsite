# UGC Ad Studio

**One brief in. A full UGC and cinematic ad pack out — audited before you spend.**

UGC Ad Studio is an agent skill that turns a product brief into six ad angles, timed scripts, shot lists, copy-paste video prompts for **Veo 3.1 / Google Flow / Kling / Runway / Hailuo / Luma / PixVerse**, **HeyGen** avatar scripts, **Nano Banana Pro / Midjourney / Flux** image prompts, platform captions, a claims ledger, and a deterministic 38-check audit.

Built for D2C brands, performance marketers, UGC agencies and solo founders who need a testable creative batch this week — not a folder of vague prompt fragments.

---

## The problem

You have a product, a price and a launch date. What you do not have is:

- six genuinely different angles, so the test means something
- prompts that keep the same creator and the same product label across every scene
- static and video creatives from one coherent art direction
- a script that fits the runtime instead of being rushed into 15 seconds
- a check that catches missing AI disclosure, price mismatches and blocked claims **before** spend

So the batch ships inconsistent, the label drifts, the hook arrives at second four, and the only conclusion is "AI ads do not work".

## The solution

One skill. Seven stages. One auditable pack.

| Stage | Output |
| --- | --- |
| Brief + claim safety | Sanitised brief, claims ledger, blocked-claim rewrites |
| Angles + hooks | 6 angles, each with a 3–14 word hook and a reason it works |
| Scripts + shot lists | 5 timed beats per angle, creator brief, one shootable action per scene |
| Video prompts | One complete prompt per scene, locked character/product/grade/craft blocks, negative prompt, seed, bridge note |
| Image prompts | 4 clean plates per angle (hook, hero, lifestyle, macro) + local edit prompts |
| Avatar + captions | HeyGen script, voice direction, disclosure, per-platform captions |
| Audit | 38 weighted checks, score /100, `PASS` / `FIX NEEDED` / `DO NOT SHIP` |

## Quickstart

```bash
cd skills/ugc-ad-studio

# 1. Build a 30s UGC pack from the sample brief
node scripts/build-ugc-campaign.mjs ../../examples/nara-brief.json --out ./my-campaign

# 2. Audit it
node scripts/audit-ugc-pack.mjs ./my-campaign/campaign.json --md=./my-campaign/audit.md
```

Expected: `score 100/100 · PASS`, exit code 0.

Try the deliberately broken pack:

```bash
node scripts/audit-ugc-pack.mjs ../../examples/broken-pack.json
```

Expected: `score 38/100 · DO NOT SHIP`, exit code 1, with critical findings for a placeholder, a non-vertical scene, a missing character block, baked-in text, missing disclosure and a blocked claim.

## What you get

```
skills/ugc-ad-studio/SKILL.md        The skill your agent loads
skills/ugc-ad-studio/scripts/        Builder + 38-check audit (zero dependencies)
examples/                            Brief, full campaign, broken pack, expected reports
docs/tutorial-guide.md               3-minute setup, 5 client installs, 5 prompt recipes
docs/store-listing.md                Ready-to-paste sales page
tests/                               Structural + functional tests
```

The pack itself contains `campaign.json`, `prompts-video.md`, `prompts-image.md`, `heygen-pack.md`, `scripts.md`, `captions.md`, `compliance.md` and `README.md`.

No API keys. No subscriptions. No network calls. Node.js 20+.

## Why the prompts hold together

Every prompt carries four verbatim blocks:

1. **Character** — name, age, build, face, hair, wardrobe, prop.
2. **Product** — brand, product, category, packaging, accent colours, label.
3. **Grade** — one film-stock/palette token per campaign.
4. **Craft** — camera body, lens, lighting philosophy, setting.

The builder injects them; the audit fails the pack if a single scene drops one. That is the difference between a coherent batch and six unrelated clips.

## The audit

38 weighted checks across structure, hooks, scripts, video prompts, image prompts, captions and compliance. Same input, same score.

It catches the expensive mistakes:

- a hook over 14 words or delivered after 3 seconds
- pacing above 3.5 words per second
- a missing character/product/grade block in any scene
- a non-vertical video or a 12-second scene
- a prompt that asks the model to bake in text
- more than five hashtags or a caption over the platform limit
- missing AI-generated / paid-partnership disclosure
- guaranteed, curative, instant, number-one or personal-attribute language
- a price in the copy that does not match the brief

Verdicts: `PASS` (≥85, no critical/high), `FIX NEEDED`, `DO NOT SHIP`.

## Verify it yourself

```bash
node --test tests/*.test.mjs
```

Expected: 18 tests passing, including determinism, 15s/30s/45s variants, cinematic mode, broken-pack failure and clean-pack 100/100.

## Pricing (India)

| Tier | Price | For |
| --- | --- | --- |
| Solo | ₹2,999 | One brand, one operator, unlimited personal campaigns |
| Pro | ₹6,999 | Small team or freelancer, 5 seats, client work |
| Agency | ₹14,999 | Unlimited client accounts, white-label hand-off |

Launch price ₹1,999 for the first 100 Solo buyers. GST invoice available. 30-day money-back guarantee: run it on your own brief; if the pack does not work as documented, email support@deepakbagada.in with your order ID.

The sample brand "Nara" and its proof numbers are fictional. Replace them with your own verified facts. The skill refuses to pretend otherwise.

## Compatibility

Plain Markdown plus Node scripts. Works in Claude Code, Cursor, Codex CLI, Google Antigravity and any agent that reads Markdown. See [COMPATIBILITY.md](COMPATIBILITY.md).

## Support

support@deepakbagada.in · [deepakbagada.in/products](https://deepakbagada.in/products)
