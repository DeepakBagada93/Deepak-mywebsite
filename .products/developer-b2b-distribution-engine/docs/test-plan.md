# Test Plan: Developer B2B Distribution Engine

**Version:** 1.0.0  
**Status:** Approved  
**Author:** Deepak Bagada Systems  

---

## 1. Scope & Matrix

| Test Suite | File Location | Command |
| :--- | :--- | :--- |
| **Structural Compliance** | `tests/skill-structure.test.mjs` | `node --test tests/skill-structure.test.mjs` |
| **Functional Intent Scorer** | `tests/intent-scraper.test.mjs` | `node --test tests/intent-scraper.test.mjs` |
| **Factory Product Validation** | `.agent/scripts/validate-product.mjs` | `node .agent/scripts/validate-product.mjs products/developer-b2b-distribution-engine` |
| **Skill Commercial Readiness** | `.agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs` | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/developer-b2b-distribution-engine` |

---

## 2. Acceptance Criteria
- 100% test pass on Node 18/20/22/25.
- Scored lead JSON validates strictly as parseable JSON.
- Clean ZIP package with 0 forbidden paths.
