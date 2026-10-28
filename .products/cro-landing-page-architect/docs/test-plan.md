# Test Plan: CRO Landing Page Architect

**Version:** 1.0.0  
**Status:** Approved  
**Author:** Deepak Bagada Systems  

---

## 1. Scope & Matrix

| Test Suite | File Location | Command |
| :--- | :--- | :--- |
| **Structural Compliance** | `tests/skill-structure.test.mjs` | `node --test tests/skill-structure.test.mjs` |
| **Functional CRO Scanner** | `tests/cro-audit.test.mjs` | `node --test tests/cro-audit.test.mjs` |
| **Factory Product Validation** | `.agent/scripts/validate-product.mjs` | `node .agent/scripts/validate-product.mjs products/cro-landing-page-architect` |
| **Skill Commercial Readiness** | `.agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs` | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/cro-landing-page-architect` |

---

## 2. Acceptance Criteria
- 100% test pass on Node 18/20/22/25.
- Accurate detection of low-converting (20%) vs high-converting (100%) landing pages.
- Clean distribution ZIP package with 0 forbidden paths.
