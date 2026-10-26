# Test Plan: Global Client Hunter OS

## 1. Scope & Objectives
Verify that the `global-client-hunter-os` product meets all structural, linguistic, and operational standards set by Deepak Bagada Systems:
- Zero syntax errors or missing required paths.
- Valid YAML frontmatter in `SKILL.md`.
- Deterministic behavior across multi-stage prompt executions.
- Zero AI buzzwords ("delve", "paradigm shift", "plethora", "game-changer") and 0% generic boilerplate.
- Valid JSON in all data and configuration files.

## 2. Test Cases

| Test ID | Test Category | Description | Success Criteria |
|---|---|---|---|
| TC-01 | Structure | Validate presence of required product paths | All 9 paths present |
| TC-02 | Manifest | Check `product-manifest.json` schema & sha256 | Valid semver & correct file hashes |
| TC-03 | Skill Contract | Validate `SKILL.md` frontmatter & instructions | Matches regex and contains 4 stages |
| TC-04 | Examples | Validate JSON and markdown format of examples | Parses cleanly without errors |
| TC-05 | Anti-Fluff | Scan prompts and copy for forbidden fluff terms | Zero hits |
| TC-06 | Packaging | Audit ZIP archive with `audit-package.mjs` | 0 forbidden paths, safe entries |
