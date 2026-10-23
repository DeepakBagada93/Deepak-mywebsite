# Content Repurpose Engine

**One source asset. Thirty days of native content. Zero copy-paste.**

A Claude Code skill that turns an article, podcast, video or idea into a dated, platform-native content calendar — then audits every piece for limits, duplication and AI tells before you schedule it.

## The problem

You publish one good piece a month. The rest of the calendar is either empty or filled with the same post pasted to four platforms with different line breaks. Reach falls, and you conclude "content does not work for us".

The truth is simpler: a LinkedIn post is not an Instagram caption, and a thread is not a newsletter.

## What it does

| Stage | Output |
| --- | --- |
| Extract | Thesis, audience, 5–10 falsifiable insights, proof, gaps |
| Angle | 7 angle types mapped to pillars, no repeated cells |
| Plan | 30 dated pieces across 6 platforms with formats and CTAs |
| Write | Native copy per platform, not reformatted cross-posts |
| Audit | Limits, hooks, CTAs, hashtags, duplicate similarity, AI phrases |
| Review | Weekly rules for what to double and what to drop |

## Quickstart

```bash
cd skills/content-repurpose-engine

# 1. Build the calendar from one source
node scripts/build-content-plan.mjs my-source.json --days=30 --out=plan.json --md=plan.md

# 2. Audit the finished copy before scheduling
node scripts/audit-content-pack.mjs my-pack.json --md=audit.md --strict
```

Pure Node 20+, no dependencies, no API keys, no network calls.

## What's included

```
skills/content-repurpose-engine/SKILL.md    # the skill your agent loads
skills/content-repurpose-engine/scripts/    # planner + audit engine
examples/                                   # source brief, clean pack, flawed pack, expected reports
docs/tutorial-guide.md                      # setup + 4 prompt recipes
docs/store-listing.md                       # ready-to-paste sales page
tests/                                      # structural + functional tests
```

## Pricing (India)

| Tier | Price | For |
| --- | --- | --- |
| Solo | ₹1,299 | One creator or founder |
| Pro | ₹2,999 | 5 seats, small content team |
| Agency | ₹5,999 | Unlimited client accounts |

30-day money-back guarantee. Launch price ₹899 for the Solo tier.

## Verify it yourself

```bash
node --test tests/*.test.mjs
node skills/content-repurpose-engine/scripts/audit-content-pack.mjs examples/content-pack.clean.json --strict
```

Expected: all tests pass, clean pack 100/100, flawed pack 0/100.

## Support

support@deepakbagada.in · [deepakbagada.in/products](https://deepakbagada.in/products)
