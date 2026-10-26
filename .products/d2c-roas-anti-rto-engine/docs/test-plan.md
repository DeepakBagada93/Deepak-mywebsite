# Test Plan: Indian D2C ROAS & Anti-RTO Engine

## 1. Scope & Objectives
Validate that `d2c-roas-anti-rto-engine` satisfies all technical, structural, and linguistic requirements:
- Valid folder structure and mandatory root files.
- `SKILL.md` contains compliant YAML frontmatter and 5 execution phases.
- Valid JSON in `examples/sample-d2c-order.json` and `examples/rto-risk-scoring-matrix.json`.
- Zero forbidden terms or synthetic filler words.
- Pass package audit with safe entries and no leaked credentials.

## 2. Test Cases

| Test ID | Test Category | Target | Success Criteria |
|---|---|---|---|
| TC-01 | File System Structure | Product root | All 9 required paths exist |
| TC-02 | Skill Contract | `skills/.../SKILL.md` | Valid YAML frontmatter: `name: d2c-roas-anti-rto-engine` |
| TC-03 | Structured Data | `examples/*.json` | JSON parses cleanly without syntax errors |
| TC-04 | Manifest Integrity | `product-manifest.json` | Semver 1.0.0, valid sha256 checksums |
| TC-05 | Package Audit | `dist/*.zip` | Verified 0 forbidden paths via `audit-package.mjs` |
