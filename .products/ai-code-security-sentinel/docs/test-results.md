# Test Results: AI Code Security Sentinel

**Product:** `ai-code-security-sentinel`  
**Version:** `1.0.0`  
**Test Date:** `2026-11-03T22:02:37+05:30`  
**Node.js Runtime:** `v25.9.0` (darwin)  

---

## 1. Automated Test Suite Execution

Execution Command:
```bash
node --test products/ai-code-security-sentinel/tests/*.test.mjs
```

### Result: 5/5 PASSED (0 Failed, 0 Skipped)

```
✔ Security Sentinel: Detects vulnerabilities in vulnerable code sample (9.12ms)
✔ Security Sentinel: Clean scan on secure hardened sample (4.73ms)
✔ Security Sentinel: Correctly scans isolated inline string tokens (0.13ms)
✔ Skill Structure: SKILL.md exists with valid YAML frontmatter (7.14ms)
✔ Skill Structure: Required customer-facing documentation exists (1.32ms)

ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 74.37
```

---

## 2. CLI Functional Verification

### Vulnerable Sample Scan (`examples/vulnerable-code-sample.js`)
- **Exit Code:** `1` (PASS - correctly blocked insecure execution)
- **Files Scanned:** 1
- **Findings Detected:** 6 (5 Critical, 1 High)
  - `SEC-003`: OpenAI API Key Exposure (Critical)
  - `SEC-007`: Embedded Database Connection Credentials (Critical)
  - `LLM-002`: Direct Execution of Dynamic Code (Eval / Function) (Critical)
  - `LLM-003`: Unsanitized Shell Command Execution (Critical)
  - `INJ-001`: SQL Query String Interpolation (Critical)
  - `INJ-004`: Permissive CORS with Credentials Wildcard (High)

### Hardened Sample Scan (`examples/secure-hardened-sample.js`)
- **Exit Code:** `0` (PASS - clean verification)
- **Files Scanned:** 1
- **Findings Detected:** 0 (Critical: 0, High: 0)
- **Status:** All checks passed.
