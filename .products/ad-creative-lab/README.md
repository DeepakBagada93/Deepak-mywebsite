# Ad Creative Lab

**Audit your paid ads before you spend another rupee.**

Ad Creative Lab is a Claude Code skill that scores ad creative against 20+ deterministic checks, rewrites it with six proven angles, writes UGC scripts, and budgets the test with real break-even maths. Built for Indian D2C brands, agencies and solo founders running Meta and Google ads.

## The problem

Most ad accounts do not fail because of targeting. They fail because the first 125 characters are generic, the hook has no proof, the headline is over the limit, and the claim would be rejected in review. Founders then "test" with ₹5,000, get 40 clicks, and conclude ads do not work.

## What it does

| Stage | Output |
| --- | --- |
| Brief | Buyer, pain, promise, proof, offer, objections — in one screen |
| Audit | Score 0–100, findings by severity, exact fix per finding |
| Rebuild | 6 angles, 30 hooks, 6 static concepts, 3 UGC scripts (15/30/45s) |
| Compliance | India ASCI-style claim checks, Meta and Google limits |
| Budget | Angle × format test matrix, break-even CPA, kill/scale rules |
| Hand-off | JSON pack, Markdown report, launch checklist |

## Quickstart

```bash
cd skills/ad-creative-lab

# 1. Audit what you already run
node scripts/audit-creative-pack.mjs my-pack.json --md=audit.md --strict

# 2. Plan the spend
node scripts/plan-test-matrix.mjs my-brief.json --budget=30000 --days=21 --md=plan.md
```

Both scripts are pure Node 20+, no dependencies, no API keys, no network calls.

## What's in the package

```
skills/ad-creative-lab/SKILL.md        # the skill Claude Code loads
skills/ad-creative-lab/scripts/        # audit engine + test-matrix planner
examples/                              # clean pack, broken pack, brief, expected reports
docs/tutorial-guide.md                 # 3-minute setup + 3 prompt recipes
docs/store-listing.md                  # ready-to-paste sales page
tests/                                 # structural + functional tests
```

## Pricing (India)

| Tier | Price | For |
| --- | --- | --- |
| Solo | ₹1,499 | One founder, one brand |
| Pro | ₹3,499 | Freelancer or in-house team, 5 seats |
| Agency | ₹6,999 | Unlimited client accounts |

30-day money-back guarantee. GST invoice available on request. Launch price ₹999 for the Solo tier.

## Verify it yourself

```bash
node --test tests/
node skills/ad-creative-lab/scripts/audit-creative-pack.mjs examples/creative-pack.clean.json --strict
```

Expected: all tests pass, clean pack scores 100/100, broken pack scores 8/100.

## Compatibility

See [COMPATIBILITY.md](COMPATIBILITY.md). The skill is plain Markdown plus Node scripts; it runs anywhere Node 20+ runs.

## Support

support@deepakbagada.in · [deepakbagada.in/products](https://deepakbagada.in/products)
