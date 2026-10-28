# Test Plan: Codebase Context Engine

**Version:** 1.0.0  
**Status:** Approved  
**Author:** Deepak Bagada Systems  

---

## 1. Scope & Matrix

| Test Suite | File Location | Command |
| :--- | :--- | :--- |
| **Structural Compliance** | `tests/skill-structure.test.mjs` | `node --test tests/skill-structure.test.mjs` |
| **Functional Context Builder** | `tests/context-builder.test.mjs` | `node --test tests/context-builder.test.mjs` |
| **Factory Product Validation** | `.agent/scripts/validate-product.mjs` | `node .agent/scripts/validate-product.mjs products/codebase-context-engine` |
| **Skill Commercial Readiness** | `.agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs` | `node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/codebase-context-engine` |

---

## 2. Acceptance Criteria
- 100% test pass on Node 18/20/22/25.
- Accurate framework version detection.
- Clean distribution ZIP archive with 0 forbidden paths.
