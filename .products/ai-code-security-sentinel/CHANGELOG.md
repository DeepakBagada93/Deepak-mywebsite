# Changelog: AI Code Security Sentinel

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-03

### Added
- Initial commercial release of **AI Code Security Sentinel**.
- Portable multi-client agent skill specification (`skills/ai-code-security-sentinel/SKILL.md`) for Google Antigravity, Claude Code, Cursor, and OpenAI Codex.
- Zero-dependency local CLI scanner (`scripts/scan.mjs`) with support for `--json`, `--fail-on-high`, and path scanning.
- Detection engine covering:
  - AWS, OpenAI, Anthropic, Stripe, and GitHub secret tokens.
  - Private key blocks and hardcoded database connection credentials.
  - OWASP Top 10 for LLM Applications (LLM01 Prompt Injection, LLM02 Insecure Output Handling, eval/Function RCE, dangerouslySetInnerHTML).
  - Classical injection vectors (SQL string concatenation, shell command interpolation, path traversal).
  - Insecure CORS policies with credentials and wildcard origins.
- Customer tutorial guide (`docs/tutorial-guide.md`) featuring 3-minute quickstart, git pre-commit hook setup, and 3 prompt recipes.
- Commercial store listing (`docs/store-listing.md`) with value proposition, feature breakdown, tiered pricing, and 30-day guarantee.
- Comprehensive test suite (`tests/skill-structure.test.mjs`, `tests/security-sentinel.test.mjs`).
- Working code samples (`examples/vulnerable-code-sample.js`, `examples/secure-hardened-sample.js`, `examples/sample-scan-report.json`).
