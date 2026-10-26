# Test Plan: Email Marketing & Cold Outreach Engine

**Product**: Email Marketing & Cold Outreach Engine  
**Version**: 1.0.0  
**Target Environment**: Node.js 18 / 20 / 22+ (macOS, Linux, Windows)

---

## 1. Scope of Testing

The test suite validates:
1. **Structural Integrity**: All required product files, skills, documentation, licenses, and examples are present without missing links or broken paths.
2. **Skill Frontmatter & Content**: The AI skill declares valid YAML frontmatter (`name:`, `description:`), contains substantive guidance (>3,000 chars), and is free from developer placeholder artifacts (`TODO`, `TBD`, `[Insert`).
3. **Validation CLI Execution**: The campaign audit script runs cleanly with zero external npm dependencies on Node.js.
4. **Reference Example Validity**: Both the B2B SaaS and D2C E-commerce reference campaigns pass all 11/11 deliverability and quality checks.
5. **Customer Security & Clean Distribution**: Zero forbidden artifacts, no embedded private API keys or SSH keys, no internal developer home paths, and clean ZIP packaging.

---

## 2. Test Cases Matrix

| Test ID | Test Category | Target Component | Expected Outcome |
| :--- | :--- | :--- | :--- |
| `TC-STR-01` | Structure | Product root & docs | All root files and documentation files exist |
| `TC-STR-02` | Structure | Skill frontmatter | `skills/email-marketing/SKILL.md` has valid YAML |
| `TC-STR-03` | Structure | License & Terms | Commercial license permits client work & bans raw resale |
| `TC-SEC-01` | Security | Path leak audit | No developer machine home paths in shipped artifacts |
| `TC-SEC-02` | Security | Secret audit | No private keys or tokens embedded in code |
| `TC-FNC-01` | Tooling | `validate-email-campaign.mjs` | Runs with code 0 on valid campaigns |
| `TC-FNC-02` | Tooling | Example campaign audit | Reference campaigns pass all checks |
| `TC-FNC-03` | Tooling | Spam word detection | Script catches high-risk spam phrases |

---

## 3. Execution Commands

```bash
# Run structural test
node tests/skill-structure.test.mjs

# Run functional tooling test
node tests/email-tooling.test.mjs

# Run product factory validation
node .agent/scripts/validate-product.mjs products/email-marketing-engine

# Run package release audit
node .agent/scripts/audit-package.mjs products/email-marketing-engine
```
