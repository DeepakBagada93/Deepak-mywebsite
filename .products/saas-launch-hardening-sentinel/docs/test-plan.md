# Test Plan: SaaS Launch Hardening Sentinel

**Version:** 1.0.0  
**Status:** Approved  
**Author:** Deepak Bagada Systems  

---

## 1. Scope & Objectives

This test plan defines the automated and manual verification procedures for the **SaaS Launch Hardening Sentinel** commercial product suite.

Objectives:
1. Verify structural compliance with Deepak Bagada Systems factory standards.
2. Verify deterministic execution and scoring precision of `scripts/launch-sentinel.mjs`.
3. Verify that vulnerable reference code triggers expected failing vectors and low score.
4. Verify that hardened reference code satisfies all 12 vectors and achieves a 100% green pass.
5. Verify package isolation, zero secret leakage, and clean customer ZIP creation.

---

## 2. Test Matrix

| Test Suite | File Location | Execution Command | Target Coverage |
| :--- | :--- | :--- | :--- |
| **Structural Test** | `tests/skill-structure.test.mjs` | `node --test tests/skill-structure.test.mjs` | File existence, YAML frontmatter, documentation paths |
| **Functional Scanner Test** | `tests/sentinel-scanner.test.mjs` | `node --test tests/sentinel-scanner.test.mjs` | Vulnerable MVP score (30%), Hardened MVP score (100%), markdown report generation |
| **Product Validation** | `.agent/scripts/validate-product.mjs` | `node .agent/scripts/validate-product.mjs products/saas-launch-hardening-sentinel` | Semantic versioning, secret scan, structured schema validation |
| **Commercial Readiness** | `.agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs` | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/saas-launch-hardening-sentinel` | Sales elements, tutorial guide, packaging readiness |
| **Archive Audit** | `.agent/scripts/audit-package.mjs` | `node .agent/scripts/audit-package.mjs products/saas-launch-hardening-sentinel` | Clean ZIP archive in `dist/` without secret/git leaks |

---

## 3. Acceptance Criteria

- All Node.js built-in tests (`node --test tests/*.test.mjs`) pass with 0 failures.
- `launch-sentinel.mjs` runs in under 1 second and produces valid markdown report.
- Factory validation exits with code 0.
- Distribution ZIP contains all required customer deliverables and 0 forbidden paths.
