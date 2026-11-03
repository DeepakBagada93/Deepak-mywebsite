# AI Code Security Sentinel

**Autonomous Pre-Commit, Pull Request & Prompt-Time Security Hardening Suite for AI-Assisted Codebases**

[![Engine](https://img.shields.io/badge/runtime-Node.js%2018%2B-green.svg)](COMPATIBILITY.md)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](package.json)
[![Security Standard](https://img.shields.io/badge/standard-OWASP%20LLM%20Top%2010-blue.svg)](docs/product-specification.md)
[![License](https://img.shields.io/badge/license-Commercial%20EULA-orange.svg)](LICENSE.md)

---

## What is AI Code Security Sentinel?

When coding with **Cursor, Claude Code, GitHub Copilot, or Antigravity**, AI models write functional code at incredible speed—but routinely leak API keys, introduce prompt injection risks, and overlook fundamental OWASP protections.

**AI Code Security Sentinel** is a dual-engine security system:
1. **The Multi-Client Agent Skill (`skills/ai-code-security-sentinel/SKILL.md`):** Portable agent instructions that intercept vulnerable patterns in real-time as your AI assistant writes code.
2. **The Zero-Dependency Local CLI Scanner (`scripts/scan.mjs`):** A blazing-fast, 100% offline security scanner that audits your code in `<2 seconds` before commits or pull requests.

---

## Instant 3-Minute Quickstart

### 1. Run a Scan Immediately
```bash
# Scan a file or directory with zero npm installs:
node scripts/scan.mjs ./examples/vulnerable-code-sample.js
```

### 2. Enforce in Git Pre-Commit
```bash
# Add this one-liner to .git/hooks/pre-commit to block vulnerable commits:
node scripts/scan.mjs . --fail-on-high
```

### 3. Install in Your AI IDE
- **Claude Code:** Copy `skills/ai-code-security-sentinel/SKILL.md` to `.claude/skills/`
- **Cursor IDE:** Copy `skills/ai-code-security-sentinel/SKILL.md` to `.cursor/rules/`
- **Google Antigravity:** Add folder to `~/.gemini/config/skills/`

For detailed setup instructions, see the [Customer Tutorial Guide](docs/tutorial-guide.md).

---

## Detection Capabilities (30+ Rules Across 6 Threat Classes)

- **Cloud & AI Secrets:** AWS IAM, OpenAI, Anthropic, Gemini, Stripe, GitHub PATs, and DB URIs.
- **OWASP LLM Top 10:** Prompt injection isolation (LLM01), dynamic code execution (`eval`, `Function`), SSRF outbound filtering (LLM08), unescaped HTML.
- **Web Vulnerabilities:** SQL injection string concatenation, command injection shell templates, path traversal, permissive CORS wildcards.
- **Authentication Hygiene:** Fallback JWT secrets, missing route authorization middleware.
- **AI Hallucinations:** Typo-squatted dependencies and unpinned versions.

---

## Directory Overview

- [`skills/`](skills/): Portable AI agent instruction files.
- [`scripts/`](scripts/): Zero-dependency local CLI scanner.
- [`docs/`](docs/): Comprehensive product documentation, tutorials, and store assets.
  - [Store Listing Copy](docs/store-listing.md)
  - [Master Pricing & Buyer Strategy](../../AI-CODE-SECURITY-SENTINEL-PRICING.md)
  - [Customer Tutorial Guide](docs/tutorial-guide.md)
  - [Technical Specification](docs/product-specification.md)
  - [Research Dossier](docs/research-dossier.md)
- [`examples/`](examples/): Vulnerable vs. secure hardened code comparisons.
- [`tests/`](tests/): Automated test suite.

---

## Commercial License & Support

Commercial license granted by **Deepak Bagada Systems**. See [LICENSE.md](LICENSE.md) for full terms.
