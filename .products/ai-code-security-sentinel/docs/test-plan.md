# Test Plan: AI Code Security Sentinel

**Product:** `ai-code-security-sentinel`  
**Version:** `1.0.0`  
**Date:** `2026-11-03`  

---

## 1. Test Objectives

Ensure that AI Code Security Sentinel:
1. Conforms to the standard portable skill specification with valid frontmatter and comprehensive instructions.
2. Correctly flags all known critical and high-severity security vulnerabilities in test fixtures without false negatives.
3. Yields zero false positives when scanning properly hardened production code.
4. Operates offline without external network or npm dependencies.
5. Accurately reports exit codes (`0` for clean, `1` for critical/high violations, `2` for runtime errors).

---

## 2. Test Matrix & Execution Scope

| Test Suite | File | Focus | Expected Result |
| :--- | :--- | :--- | :--- |
| **Skill Structure** | `tests/skill-structure.test.mjs` | SKILL.md YAML frontmatter, instruction length, required docs | All assertions pass (exit 0) |
| **Vulnerability Detection** | `tests/security-sentinel.test.mjs` | Detection of AWS keys, Anthropic keys, OpenAI keys, Stripe keys, SQL injection, eval(), CORS wildcard | Flags 5+ findings on fixture (exit 0) |
| **False Positive Check** | `tests/security-sentinel.test.mjs` | Scans `secure-hardened-sample.js` | 0 findings reported (exit 0) |
| **Unit Regex Rules** | `tests/security-sentinel.test.mjs` | Isolated token strings | Exact match and rule attribution (exit 0) |

---

## 3. Execution Command
```bash
node --test tests/*.test.mjs
```
