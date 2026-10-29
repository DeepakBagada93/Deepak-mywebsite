# Test plan — UGC Ad Studio v1.0.0

Date: 2026-10-29 · Author: Deepak Bagada Systems · Environment: macOS (darwin), Node 25.x, zero dependencies

## 1. Objectives

Prove that the shipped skill:

1. parses and loads as a skill in the advertised clients;
2. produces a complete, deterministic campaign pack from a brief;
3. keeps creator, product, grade and craft consistent across every prompt;
4. catches unsafe or broken packs with a deterministic score and exit code;
5. ships the commercial files, docs and examples the listing promises;
6. contains no placeholders, secrets, symlinks or network calls.

## 2. Test levels

| Level | What it covers | Method |
| --- | --- | --- |
| L1 structure | Frontmatter, headings, model coverage, required files | `tests/skill-structure.test.mjs` |
| L2 functional | Build, variants, determinism, validation, help | `tests/ugc-ad-studio.test.mjs` |
| L3 audit | Clean pass, broken fail, report files, `--min`, `--report-only` | Node test + manual CLI runs |
| L4 package | Manifest hashes, ZIP contents, no secrets, size | `.agent/scripts/audit-package.mjs` |
| L5 manual | Read a generated pack as a buyer would; check prompt quality | Human review of the Nara sample |

## 3. Test cases

### L1 — structure

| ID | Case | Expected |
| --- | --- | --- |
| S-01 | Required commercial files exist | README, LICENSE, CHANGELOG, COMPATIBILITY, manifest present |
| S-02 | Frontmatter parses | `name: ugc-ad-studio`, description >80 chars, body >9,000 chars |
| S-03 | Required headings | Activation triggers, Input contract, Ordered pipeline, Output specification, Negative constraints |
| S-04 | Model surface | Veo 3.1, Google Flow, HeyGen, Kling, Runway, Nano Banana, Midjourney, Flux, UGC, cinematic |
| S-05 | Tutorial | Quickstart, prompt recipe, troubleshoot, >4,000 chars |
| S-06 | Store listing | Pricing, what's included, FAQ, guarantee, ₹ |
| S-07 | Docs set | Research, spec, test plan, test results, release report, listing, tutorial |
| S-08 | Scripts are real | Each script >1,000 chars |
| S-09 | No placeholders | No `{{token}}`, TODO, TBD, lorem ipsum in SKILL, README, tutorial |
| S-10 | Examples exist | Brief, campaign, broken pack, expected reports |

### L2 — functional

| ID | Case | Expected |
| --- | --- | --- |
| F-01 | Build sample brief | 6 angles, 30 video prompts, 24 image prompts, 30s |
| F-02 | Determinism | Two builds byte-identical |
| F-03 | 15s variant | Passes audit, beat total = 15 |
| F-04 | 45s variant | Passes audit, beat total = 45 |
| F-05 | Cinematic variant | Passes audit, cinematic angles present |
| F-06 | Incomplete brief | Exit 1, names the missing field |
| F-07 | Bad duration | Exit 1, names the allowed values |
| F-08 | `--help` | Exit 0, no files written |
| F-09 | JSON output | `campaign.json` parses, `meta` present |
| F-10 | Claim sanitiser | Guarantee/cure/instant patterns removed and recorded |

### L3 — audit

| ID | Case | Expected |
| --- | --- | --- |
| A-01 | Clean sample | Score 100/100, verdict PASS, exit 0 |
| A-02 | Broken sample | Score <60, verdict DO NOT SHIP, ≥5 critical, exit 1 |
| A-03 | `--md` | Markdown report written, starts with `# UGC pack audit` |
| A-04 | `--json` | Valid JSON with `score`, `verdict`, `findings` |
| A-05 | `--report-only` | Exit 0 even when failing |
| A-06 | `--min` | Exit 1 when score is below the requested minimum |
| A-07 | Every finding | Has id, class, severity, message, fix |

### L4 — package

| ID | Case | Expected |
| --- | --- | --- |
| P-01 | Manifest version | `1.0.0` matches ZIP name |
| P-02 | Hashes | Every manifest entry matches the file on disk |
| P-03 | ZIP contents | No `.agent`, `dist/`, `node_modules`, `.env`, keys or symlinks |
| P-04 | Size | Under the package limit; no vendored dependencies |
| P-05 | Docs present | All docs and examples inside the ZIP |

### L5 — manual

| ID | Case | Expected |
| --- | --- | --- |
| M-01 | Read `scripts.md` | Hooks sound spoken, beats fit the runtime, actions are shootable |
| M-02 | Read `prompts-video.md` | Blocks are verbatim, negative prompt present, no baked text |
| M-03 | Read `captions.md` | Inside limits, one CTA, disclosure present |
| M-04 | Read `compliance.md` | Claims ledger is honest, no invented proof |
| M-05 | Read `heygen-pack.md` | AI-presenter policy warning is unmissable |

## 4. Commands

```bash
node --test tests/*.test.mjs

node skills/ugc-ad-studio/scripts/build-ugc-campaign.mjs \
  examples/nara-brief.json --out /tmp/ugc-test

node skills/ugc-ad-studio/scripts/audit-ugc-pack.mjs \
  examples/nara-campaign/campaign.json --md=/tmp/clean.md --json=/tmp/clean.json

node skills/ugc-ad-studio/scripts/audit-ugc-pack.mjs examples/broken-pack.json

node skills/ugc-ad-studio/scripts/build-ugc-campaign.mjs \
  examples/nara-brief.json --out /tmp/ugc-15 --duration 15
node skills/ugc-ad-studio/scripts/build-ugc-campaign.mjs \
  examples/nara-brief.json --out /tmp/ugc-45 --duration 45
node skills/ugc-ad-studio/scripts/build-ugc-campaign.mjs \
  examples/nara-brief.json --out /tmp/ugc-cine --style cinematic-product

node .agent/scripts/generate-manifest.mjs products/ugc-ad-studio
node .agent/scripts/validate-product.mjs products/ugc-ad-studio
node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/ugc-ad-studio
node .agent/skills/ai-skill-engineering/scripts/package-skill-product.mjs products/ugc-ad-studio
node .agent/scripts/audit-package.mjs products/ugc-ad-studio
```

## 5. Environment matrix

| Client / runtime | Check | Status |
| --- | --- | --- |
| Node 20 | Scripts use only stable ESM APIs | Expected pass |
| Node 22 | Same | Expected pass |
| Node 25 | Actual build and test runtime | Pass |
| Claude Code | Skill folder + frontmatter | Manual install check |
| Cursor | `.cursor/skills` + rule | Manual install check |
| Codex CLI | `~/.codex/skills` | Manual install check |
| Antigravity | `.agent/skills` | Manual install check |
| Offline | No network imports | Pass |

## 6. Pass criteria

- 18/18 tests pass.
- Clean sample 100/100, exit 0.
- Broken sample below 60, `DO NOT SHIP`, exit 1, ≥5 critical.
- 15s, 30s, 45s and cinematic variants each 100/100.
- `validate-product.mjs` and `audit-package.mjs` exit 0.
- No critical or high findings in the release audit.

## 7. Out of test scope

- Real render quality on each model (human, tool- and account-dependent).
- Platform ad approval.
- Ad performance or ROAS.
- Legal sufficiency of the license or claims.
- Pricing acceptance in the market.

## 8. Regression policy

Every bug fix gets a failing assertion first where practical. The broken-pack fixture is the regression anchor for unsafe claims, missing disclosure, price mismatch and broken consistency blocks. The clean fixture is the anchor for the happy path.
