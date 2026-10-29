# UGC Ad Studio

**Your ads are not failing because of targeting. They are failing before you spend.**

One brief in. Six audited ad angles out — timed scripts, shot lists, Veo 3.1 / Google Flow / Kling / Runway video prompts, HeyGen avatar scripts, Nano Banana / Midjourney / Flux image prompts, platform captions, a claims ledger and a 38-check pre-spend audit.

Built for D2C brands, performance marketers, UGC agencies and founders who need a testable creative batch this week.

---

## The problem

You have a product, a price and a launch date. You do not have:

- six genuinely different angles, so the test tells you nothing
- prompts that keep the same creator and the same product label across every scene
- video and static ads from one coherent art direction
- a script that fits the runtime instead of being rushed into 15 seconds
- a check that catches missing AI disclosure, price mismatches and blocked claims **before** spend

So the batch ships inconsistent, the label drifts, the hook arrives at second four, and the conclusion is "AI ads do not work".

## The solution

UGC Ad Studio is the production spec and the pre-spend audit in one pack.

| You get | What it does |
| --- | --- |
| **Six angles** | Cost of inaction, failed alternative, mechanism, proof, objection reversal, identity. Each with a reason it works. |
| **Hooks** | 3–14 words, at least two hook signals, no two angles opening the same way. |
| **Timed scripts** | Five beats per angle, a creator brief, and one shootable action per scene. |
| **Video prompts** | 30 prompts for a 30s pack. Locked character, product, grade and craft blocks in every prompt, plus negative prompt, seed, bridge note and native-audio line. |
| **Image prompts** | 24 clean plates (hook, hero, lifestyle, macro) plus local edit/inpaint prompts. Text goes in your editor, not the model. |
| **Avatar pack** | HeyGen script, voice direction, background, caption config and disclosure. |
| **Captions** | Instagram, TikTok and YouTube Shorts, inside platform limits, one CTA, 1–5 hashtags. |
| **Claims ledger** | Every claim with source, status and required action. Blocked claim patterns rewritten to mechanism language. |
| **38-check audit** | Deterministic score /100 and a verdict: `PASS`, `FIX NEEDED` or `DO NOT SHIP`. |

## What makes it hold together

Every prompt repeats four verbatim blocks:

1. **Character** — name, age, build, face, hair, wardrobe, prop.
2. **Product** — brand, product, category, packaging, accent colours, label.
3. **Grade** — one film-stock/palette token per campaign.
4. **Craft** — camera body, lens, lighting philosophy, setting.

The builder injects them. The audit fails the pack if a single scene drops one. That is the difference between a coherent batch and six unrelated clips.

## What's included

```
skills/ugc-ad-studio/SKILL.md        The seven-stage production skill
skills/ugc-ad-studio/scripts/        Builder + 38-check audit (zero dependencies)
examples/nara-brief.json             Complete sample brief
examples/nara-campaign/              Full sample pack (8 files)
examples/broken-pack.json            Deliberately unsafe pack
examples/expected/                   Expected audit reports
docs/tutorial-guide.md               3-minute quickstart, 5 client installs, 5 prompt recipes
docs/research-dossier.md             Market and tool research with sources
docs/product-specification.md        Scope, requirements, acceptance criteria
tests/                               18 structural and functional tests
```

Generated pack:

```
campaign.json · prompts-video.md · prompts-image.md · heygen-pack.md
scripts.md · captions.md · compliance.md · README.md
```

No API keys. No subscriptions. No network calls. Node.js 20+.

## Proof it works

Run these before you buy.

- Clean sample pack: **100/100, PASS**, exit 0
- Deliberately broken pack: **38/100, DO NOT SHIP**, 7 critical findings, exit 1
- 15s, 30s, 45s and cinematic variants: each **100/100**
- Determinism test: two builds produce byte-identical `campaign.json`
- Test suite: **18/18 passing**

```bash
node --test tests/*.test.mjs
node skills/ugc-ad-studio/scripts/audit-ugc-pack.mjs examples/broken-pack.json
```

The sample brand "Nara" and its proof numbers are fictional and labelled as a demo. The skill does not invent proof for your brand: leave `proof` out and it builds mechanism angles instead.

## Who it is for

- D2C founders spending ₹50,000–₹5,00,000 per month on ads
- Performance marketers who need angle variance before a test
- UGC and creative agencies that want a repeatable junior-proof spec
- SaaS founders who want founder-led or avatar ads without a shoot
- Solo creators productising ad creative as a service

## Who it is not for

- Buyers who want a rendered MP4 out of the box. This pack produces prompts, scripts and specs; you render in your tool.
- Buyers who want campaign creation, bidding or media buying.
- Buyers who need a legal opinion. The audit flags deterministic risk; a human signs off.
- Buyers who want to run unsubstantiated health, finance or income claims.

## Requirements

- Node.js 20 or newer.
- A JSON brief.
- A generation tool to render: Google Flow / Veo 3.1, Kling, Runway, Hailuo, Luma, PixVerse, HeyGen, Nano Banana Pro, Midjourney or Flux.
- A human to review claims and platform policy before publishing.

## Compatibility

Claude Code, Cursor, Codex CLI, Google Antigravity, or any agent that reads Markdown. Full detail in `COMPATIBILITY.md`.

## Pricing

| Tier | Price | Seats | Best for |
| --- | --- | --- | --- |
| **Solo** | **₹2,999** | 1 | One brand, one operator |
| **Pro** | **₹6,999** | 5 | Freelancer or in-house team |
| **Agency** | **₹14,999** | Unlimited | Client accounts and white-label hand-off |

**Launch offer:** ₹1,999 for the first 100 Solo buyers.

All tiers include the full skill, builder, audit, examples, tests, tutorial and updates within v1.x. GST invoice available. Prices are GST-inclusive.

### Why this price

A single 30-second AI UGC ad costs roughly $1–$12 in tool credits in 2026, and AI UGC tools charge $29–$110 per month. The expensive part is not the render. It is deciding six angles, keeping the creator and label stable, writing a script that fits the runtime, and catching unsafe claims before spend. This pack is a one-time system that works with the tools you already pay for.

The sample pack is 6 angles, 30 video prompts and 24 image prompts. A custom brief from an agency usually costs more than the Solo tier and does not come with a deterministic audit.

## 30-day money-back guarantee

Install it, run it on your own brief. If the pack does not work as documented, email support@deepakbagada.in within 30 days with your order ID and get a full refund. No interrogation.

## FAQ

**Do I need an API key or a paid generation plan?**
No to build and audit. Yes to render. The prompts are copy-paste and work on consumer plans.

**Which model should I use?**
Veo 3.1 / Google Flow first for native dialogue and prompt adherence. Kling for stylised motion. Runway for controlled, edit-friendly footage. HeyGen if you want a presenter without a shoot. The skill documents the routing.

**Can I use this for client work?**
Yes. Solo is one seat; Pro is five; Agency is unlimited client accounts. You may deliver the outputs to clients. You may not resell the raw skill files.

**Does the audit guarantee ad approval or sales?**
No. It removes deterministic failure modes: missing consistency blocks, unsafe claims, missing AI/paid disclosure, wrong aspect, over-limit captions and pacing that is too fast. Platform review and performance remain human and market questions.

**What if I have no proof or testimonials?**
Leave `proof` out. The pack builds mechanism angles and the claims ledger marks the promise as "evidence required". It does not invent a number or a review.

**Can I use a real creator instead of an AI creator?**
Yes. Use the character block as a casting brief, give it to the creator, and use `scripts.md` as the shot list. The pack is tool-agnostic.

**Is this safe for HeyGen?**
The pack includes a warning based on HeyGen's 2026 policy: do not present an AI actor as a real customer describing a real experience. Use the avatar as a spokesperson and label it AI-generated.

**Will it work for my category?**
It ships with UGC testimonial, UGC demo, cinematic product, street interview, founder story and compliant before/after presets. Regulated categories (health, finance, education) need extra human review; the pack flags claims but does not clear them.

**What about updates?**
v1.x updates are included. New major versions may be priced separately.

## Limitations

- The pack does not render video or images.
- The audit does not verify that a claim is true.
- The audit is not legal advice and does not guarantee platform approval.
- Model capabilities and prices change; re-check before quoting them in a proposal.
- The sample brand and proof are fictional; replace them with your own verified facts.

---

**SEO title (≤60):** UGC Ad Studio — AI UGC ad packs, audited before spend
**Meta description (≤155):** One brief to six audited UGC ad angles: scripts, Veo 3.1/Flow prompts, HeyGen avatars, image ads, captions and a 38-check pre-spend audit.
**Slug:** `ugc-ad-studio`
**Version:** 1.0.0
**CTA:** Get UGC Ad Studio — ₹2,999 (launch ₹1,999)
**Update policy:** v1.x included; breaking changes ship as a new major version.
