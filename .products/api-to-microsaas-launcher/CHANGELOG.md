# Changelog: API to Micro-SaaS Launcher

All notable changes to this commercial AI skill product will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-28

### Added
- **API to SaaS Generator CLI (`scripts/schema-to-saas.mjs`)**:
  - Standalone Node.js tool to parse OpenAPI / JSON specs and generate Next.js API key middleware and Stripe billing.
- **Autonomous Micro-SaaS AI Agent Skill (`skills/microsaas-launcher/SKILL.md`)**:
  - 4-Phase protocol covering schema ingestion, hashed key lifecycle, Stripe metered billing, and dashboard UI.
- **Reference Example (`examples/weather-ai-api/`)**:
  - Real-world OpenAPI schema, generated Next.js dashboard route, and Stripe usage metering handler.
- **Documentation & Storefront**:
  - `docs/tutorial-guide.md`: Quickstart, Stripe metered billing setup, and prompt recipes.
  - `docs/store-listing.md`: Direct-response storefront copy with dual pricing ($89/₹1,799 Solo; $179/₹4,499 Commercial).
