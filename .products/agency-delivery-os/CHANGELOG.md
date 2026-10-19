# Changelog

## [1.0.0] — 2026-10-18

### Added

- `engagement-os` skill: intake contract, six-phase machine, permissions boundary, audit gates, handoff rules.
- `init-engagement.mjs`: strict intake validation and generation of ten client artifacts.
- `audit-engagement.mjs`: phase-aware audit of artifacts, placeholders, exclusions, approval boundary, budget restatement, and QA-metric linkage.
- `advance-engagement.mjs`: guarded transitions with an append-only history; nothing changes on failure.
- `verify-engagement.mjs`: delivery gate with `--strict`.
- Examples: complete intake, rejected intake, generated workspace.
- Functional tests: initialization, rejection, placeholder guard, full phase chain, missing artifact, metric gate, overwrite protection.

### Known limitations

- Process and document system only; no CRM, invoicing, or e-signature.
- Proposal terms are templates, not professional advice.
- Client activation in AI coding tools is untested.
