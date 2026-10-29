# Release report — UGC Ad Studio v1.0.0

Prepared: 2026-10-29 · Prepared by: Deepak Bagada Systems · Status: **READY FOR OWNER APPROVAL**

## 1. Release identity

| Field | Value |
| --- | --- |
| Product | UGC Ad Studio |
| Slug | `ugc-ad-studio` |
| Version | `1.0.0` |
| Category | `ai-skill-bundle` |
| License | Commercial single-seat / team / agency EULA |
| Runtime | Node.js 20+, zero dependencies, offline |
| Package | `dist/ugc-ad-studio-1.0.0.zip` |
| Launch price | ₹1,999 (Solo, first 100 buyers) |
| Standard price | ₹2,999 Solo / ₹6,999 Pro / ₹14,999 Agency |

## 2. What ships

| Area | Count / file |
| --- | --- |
| Skill contract | `skills/ugc-ad-studio/SKILL.md` |
| Engine | `scripts/lib.mjs` |
| Builder CLI | `scripts/build-ugc-campaign.mjs` |
| Audit CLI | `scripts/audit-ugc-pack.mjs` |
| Styles | 6 |
| Angles per style | 6 |
| Video models | 5 (Veo 3.1/Flow, Kling, Runway, Hailuo, Luma, PixVerse) |
| Image models | 4 (Nano Banana Pro, Midjourney v7, Flux 1.1 Pro, Imagen 4) |
| Runtimes | 15s / 30s / 45s |
| Sample pack | 6 angles, 30 video prompts, 24 image prompts |
| Audit checks | 38 weighted checks, 7 classes |
| Tests | 18 |
| Docs | 7 customer/engineering docs plus this report |

## 3. Gate results

| Gate | Command | Result |
| --- | --- | --- |
| Test suite | `node --test tests/*.test.mjs` | **18/18 pass** |
| Clean sample | `audit-ugc-pack.mjs examples/nara-campaign/campaign.json` | **100/100 PASS**, exit 0 |
| Broken sample | `audit-ugc-pack.mjs examples/broken-pack.json` | **38/100 DO NOT SHIP**, exit 1, 7 critical |
| 15s variant | build + audit | **100/100 PASS** |
| 45s variant | build + audit | **100/100 PASS** |
| Cinematic variant | build + audit | **100/100 PASS** |
| Manifest | `generate-manifest.mjs` | 32 shipped files hashed (33 on disk including the generated audit report) |
| Product validation | `validate-product.mjs` | **Pass**, exit 0 |
| Skill readiness | `validate-skill-readiness.mjs` | **Pass**, exit 0 |
| Package audit | `audit-package.mjs` | **Pass**, exit 0 |

The exact console output is in `docs/test-results.md` and `docs/validation-report.json`; the archive audit runs at the end of the packaging command and prints its own JSON.

## 4. Quality evidence

- **Consistency:** every prompt carries verbatim character, product, grade and craft blocks; the audit fails a pack that drops any one.
- **Safety:** blocked claim patterns are sanitised and ledgered; fake urgency, personal attributes and price mismatches fail the audit.
- **Disclosure:** UGC caption packs require an AI/paid disclosure; the HeyGen pack warns against presenting an AI actor as a real customer, per HeyGen's 2026 guidance.
- **Determinism:** two builds of the same brief are byte-identical.
- **Honesty:** the sample brand and proof are fictional and labelled; the skill never invents a testimonial or a number.

## 5. Known limitations

1. The pack does not render video or images; the buyer renders in their own tool.
2. The audit does not verify that a claim is true, and it is not legal advice.
3. Platform approval and ad performance are not guaranteed.
4. Model prices and capabilities are dated references; re-check before quoting.
5. The HeyGen policy guidance is a 2026 snapshot and may change.
6. A real-brand render was not produced during this build; quality on each model remains a human check.
7. Live ad-library and competitor-sales data were not collected; the research dossier says so.

## 6. Owner actions before publishing

- [ ] Approve the license, pricing and launch offer.
- [ ] Run one real brief end-to-end in the owner's Veo/Flow or HeyGen account and record cost and render time.
- [ ] Confirm GST treatment and refund terms with a CA.
- [ ] Re-check HeyGen, Google and platform AI-disclosure policies on the publish date.
- [ ] Approve or replace the fictional "Nara" sample.
- [ ] Publish the ZIP and the store listing; set the launch coupon.
- [ ] File the GST invoice template and the support mailbox auto-reply.

## 7. Rollback plan

If a buyer reports a broken build:

1. Reproduce with the shipped tests and the clean fixture.
2. If the engine is at fault, ship a v1.0.x patch with a regression test.
3. If the docs are at fault, correct the doc and regenerate the manifest and ZIP.
4. If the claim is about performance, point to the limitations and the 30-day guarantee; do not promise results.

## 8. Go / no-go

**Go for owner approval.** All deterministic gates pass. No critical or high release-audit findings remain in the shipped files. The remaining items are commercial and human-review decisions, listed above.

**No-go for unsupervised publication.** The owner must approve pricing, license and the HeyGen/platform disclosure language before the listing goes live.
