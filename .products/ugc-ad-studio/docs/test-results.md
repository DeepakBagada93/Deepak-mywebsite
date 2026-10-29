# Test results — UGC Ad Studio v1.0.0

Run date: 2026-10-29 · Runtime: macOS (darwin), Node v25.9.0 · Mode: offline, zero dependencies

## 1. Summary

| Gate | Result | Evidence |
| --- | --- | --- |
| Test suite | **18/18 passed** | `node --test tests/*.test.mjs` |
| Clean sample | **100/100 · PASS · exit 0** | 38/38 checks, 0 findings |
| Broken sample | **38/100 · DO NOT SHIP · exit 1** | 7 critical, 13 high, 3 medium, 1 low |
| 15s variant | **100/100 · PASS · exit 0** | 38/38 checks |
| 45s variant | **100/100 · PASS · exit 0** | 38/38 checks |
| Cinematic variant | **100/100 · PASS · exit 0** | 38/38 checks |
| Determinism | **Pass** | Two builds byte-identical |
| Product validation | **Pass** | `validate-product.mjs` exit 0 |
| Skill readiness | **Pass** | `validate-skill-readiness.mjs` exit 0 |
| Package audit | **Pass** | `audit-package.mjs` exit 0 |

## 2. Test suite output

```text
$ node --test tests/*.test.mjs

✔ product root contains the required commercial files
✔ skill frontmatter is valid and client-agnostic
✔ skill defines triggers, inputs, outputs and guardrails
✔ skill covers the advertised model surface
✔ customer documentation exists and contains a quickstart and prompt recipes
✔ store listing has price, deliverables, FAQ and guarantee
✔ required documentation set exists
✔ skill scripts ship and expose a help flag
✔ no placeholder markers ship in customer-facing skill or docs
✔ examples and expected reports exist
✔ builder produces a complete campaign pack
✔ clean pack scores 100/100 and exits 0
✔ broken pack fails loudly with critical findings
✔ --report-only exits 0 on a broken pack
✔ builder is deterministic for the same brief and seed
✔ 15s and cinematic variants also pass the audit
✔ builder rejects an incomplete brief with a named field
✔ scripts expose --help without touching the filesystem

ℹ tests 18
ℹ pass 18
ℹ fail 0
ℹ duration_ms ~950
```

## 3. Audit — clean sample

```text
$ node skills/ugc-ad-studio/scripts/audit-ugc-pack.mjs \
    examples/nara-campaign/campaign.json --md=/tmp/clean.md --json=/tmp/clean.json

Nara Vitamin C Face Serum — score 100/100 · PASS
  checks: 38/38 passed · findings: 0 critical, 0 high, 0 medium, 0 low
  Ready to spend. Keep the pack and the evidence with the campaign.
EXIT=0
```

All 38 checks passed, including:

- `structure.tokens` — character, product, grade and craft blocks present.
- `hooks.signals` — every hook has at least two signals, no duplicates.
- `scripts.pacing` — at or under 3.5 words per second.
- `scripts.hookWindow` — hook inside 3 seconds, ≤12 words.
- `video.character` / `video.product` / `video.grade` — verbatim in every prompt.
- `video.negative` / `video.seed` / `video.duration` / `video.aspect`.
- `video.noText` / `image.noText` — no baked-in text requests.
- `captions.limits` / `captions.cta` / `captions.hashtags` / `captions.disclosure`.
- `compliance.bannedClaims` / `compliance.fakeUrgency` / `compliance.personalAttributes` / `compliance.price`.

## 4. Audit — broken sample

```text
$ node skills/ugc-ad-studio/scripts/audit-ugc-pack.mjs examples/broken-pack.json

Nara Vitamin C Face Serum — score 38/100 · DO NOT SHIP
  checks: 14/38 passed · findings: 7 critical, 13 high, 3 medium, 1 low
  Fix critical and high findings before spending. Re-run with --md=audit.md for the full report.
EXIT=1
```

The failure is intentional and covers the highest-risk modes: banned claims, missing character block, missing negative prompt, wrong aspect, no disclosure, price mismatch, text baked into prompts, hook too long and pacing over the ceiling.

## 5. Variants

```text
15s   Nara Vitamin C Face Serum — 100/100 · PASS · 38/38 · exit 0
45s   Nara Vitamin C Face Serum — 100/100 · PASS · 38/38 · exit 0
cine  Nara Vitamin C Face Serum — 100/100 · PASS · 38/38 · exit 0
```

The 15s build compacts each beat to one spoken line and still keeps the hook inside the first three seconds.

## 6. Determinism

```text
$ build nara-brief.json --out /tmp/a
$ build nara-brief.json --out /tmp/b
$ cmp /tmp/a/campaign.json /tmp/b/campaign.json
(no output, exit 0)
```

Seeds derive from the brand, angle and scene index. No `Math.random()`, `Date.now()` or locale-dependent formatting is used in the output.

## 7. Bugs found and fixed during the build

| # | Bug | Fix |
| --- | --- | --- |
| 1 | The first beat duplicated the hook | Hook line now targets beat 1 only |
| 2 | Short pain phrases overflowed hooks | Added `shortPhrase()` with a 6-word cap |
| 3 | Several hook templates exceeded 14 words | Rewrote templates to ≤12 words |
| 4 | Hook signal detection missed "works", "watch", "only", "start here", "worth", "quotes" | Expanded `HOOK_SIGNALS` |
| 5 | 15s packs overflowed the runtime | Added 15s compaction with a 30-word ceiling |
| 6 | Cinematic CTA scenes reused the UGC hook | Angle-aware CTA hook |
| 7 | Product block was prose that drifted | Structured product block with packaging, accent, label |
| 8 | Image prompts repeated the subject | `person` flag controls the character block |
| 9 | Audio lines omitted SFX | `audioLine()` receives the beat SFX |
| 10 | Negative prompt and seed had trailing periods | Punctuation normalised |
| 11 | Captions were sentence fragments | Sentence-cased first letter |
| 12 | Proof line sounded like a testimonial when no proof existed | Rewritten to "Here is the part I checked before buying: …" |
| 13 | Vague "quick cut" visuals | Replaced with one shootable action per scene |
| 14 | `--md` / `--json` suppressed the console summary | Summary now always prints unless `--md=-` |

## 8. Intermediate runs (honest history)

- First run: 10/18 passed. Failures were missing docs, missing manifest, and missing SKILL sections.
- After SKILL/README/commercial files: 16/18 passed. Remaining failures: `product-manifest.json` and `docs/test-plan.md`.
- After manifest seed and test plan: 17/18. Remaining failure: `docs/test-results.md`.
- Final after the full docs set: 18/18.

## 9. Not tested

- Render quality on each model (account- and tool-dependent).
- Platform ad review or approval.
- Ad performance, CPA or ROAS.
- Legal sufficiency of claims or the license.
- Real-customer testimonial consent.

## 10. Verdict

All deterministic gates pass. The package is ready for owner review and packaging. The remaining risks are human and market risks, listed in the release report.
