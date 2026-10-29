# Changelog

All notable changes to UGC Ad Studio are recorded here.

## [1.0.0] — 2026-10-29

### Added

- `ugc-ad-studio` skill with a seven-stage production pipeline: brief, angles, scripts, video prompts, image prompts, avatar/captions, audit.
- Deterministic builder (`build-ugc-campaign.mjs`) producing `campaign.json` plus seven hand-off documents.
- Deterministic audit (`audit-ugc-pack.mjs`) with 38 weighted checks across 7 classes and three verdicts.
- Six UGC angles: cost of inaction, failed alternative, mechanism, proof, objection reversal, identity.
- Six cinematic angles: hero, ritual, proof, objection, identity, CTA.
- Six style presets: UGC testimonial, UGC demo, cinematic product, street interview, founder story, compliant before/after.
- Model routing for Veo 3.1 / Google Flow, Kling 2.5, Runway Gen-4, Hailuo 02, Luma Ray3, PixVerse V5, HeyGen, Nano Banana Pro, Midjourney v7, Flux 1.1 Pro and Imagen 4.
- Locked character, product, grade, craft and world blocks injected into every prompt and verified by the audit.
- 15s, 30s and 45s runtimes with automatic 15s compaction.
- Claims sanitisation and a claims ledger with source, status and required action.
- Platform captions with character limits, CTA enforcement, hash tag caps and AI/paid disclosure.
- Sample brief, full sample campaign, deliberately broken pack and expected audit reports.
- 18 structural and functional tests, including determinism and variant coverage.

### Notes

- The sample brand "Nara" and its proof numbers are fictional and exist only to demonstrate the pack.
- The audit checks deterministic failure modes. It does not verify that a claim is true and it is not legal advice.
