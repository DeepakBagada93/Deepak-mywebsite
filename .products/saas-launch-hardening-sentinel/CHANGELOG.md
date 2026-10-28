# Changelog: SaaS Launch Hardening Sentinel

All notable changes to this commercial AI skill product will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-28

### Added
- **Deterministic Pre-Flight Scanner (`scripts/launch-sentinel.mjs`)**:
  - Zero-dependency Node.js CLI tool evaluating codebases against 12 critical launch vectors.
  - Automated calculation of Launch Readiness Score (0–100%) and generation of `LAUNCH-AUDIT-REPORT.md`.
- **Autonomous Hardening AI Agent Skill (`skills/launch-hardening-sentinel/SKILL.md`)**:
  - Complete 6-phase engineering protocol for Antigravity, Claude Code, Cursor, and Codex.
  - Production blueprints for Stripe signature verification and transactional database idempotency.
  - Drop-in Next.js Server Action authentication guardrails.
  - Sliding-window Upstash rate limiting patterns for anti-wallet-drain defense.
  - Database connection pool singleton pattern.
- **Reference Examples**:
  - `examples/vulnerable-mvp/`: Demonstrates typical vibe-coded failure modes with a 30% baseline score.
  - `examples/hardened-mvp/`: Production-hardened implementation achieving a 100% green launch score.
- **Customer Documentation**:
  - `docs/tutorial-guide.md`: 3-minute quickstart, multi-client installation guides, and prompt recipes.
  - `docs/store-listing.md`: Commercial storefront copy, feature matrix, pricing tiers, and FAQ.
  - `docs/research-dossier.md`: Evidence-backed market research on post-AI developer vulnerability trends.
  - `docs/product-specification.md`: Full architectural specification of the 12 launch vectors.
