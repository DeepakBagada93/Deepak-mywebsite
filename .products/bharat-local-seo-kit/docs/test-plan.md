# Test Plan: Bharat Local SEO Kit

## 1. Scope & Objectives
Validate that `bharat-local-seo-kit` conforms strictly to the Deepak Bagada Systems digital product engineering quality gates:
- Verify presence of all required root directories and documentation.
- Validate JSON-LD schema example against Schema.org specification.
- Validate `SKILL.md` frontmatter and structured execution stages.
- Verify zero syntax errors and clean packaging.

## 2. Test Cases

| Test ID | Test Category | Target | Success Criteria |
|---|---|---|---|
| TC-01 | File System Structure | Product root | All 9 required paths exist |
| TC-02 | Skill Contract | `skills/.../SKILL.md` | Valid YAML frontmatter, includes 5 execution stages |
| TC-03 | Schema Validation | `examples/local-business-schema.json` | Valid JSON-LD parsing cleanly |
| TC-04 | Manifest Integrity | `product-manifest.json` | Semver 1.0.0, valid sha256 |
| TC-05 | Package Audit | `dist/*.zip` | Clean archive with 0 forbidden paths |
