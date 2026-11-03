# Product Specification: AI Code Security Sentinel

**Product Slug:** `ai-code-security-sentinel`  
**Version:** `1.0.0`  
**Category:** `ai-skill-bundle`  
**Author:** Deepak Bagada Systems  

---

## 1. Product Overview & Architecture

**AI Code Security Sentinel** is an enterprise-grade, zero-dependency autonomous security auditing and hardening engine designed for modern AI-assisted software workflows (Google Antigravity, Anthropic Claude Code, Cursor IDE, GitHub Copilot CLI, OpenAI Codex).

The product operates as a **dual-engine architecture**:
1. **Agent Skill Engine (`skills/ai-code-security-sentinel/SKILL.md`):** A deterministic, portable agent instruction set that activates automatically when writing, refactoring, or reviewing code. It instructs the LLM to inspect AST patterns, flag unsafe APIs, sanitize secret tokens, enforce strict input validation schemas, and reject insecure defaults.
2. **Deterministic CLI Scanner (`scripts/scan.mjs`):** A lightning-fast, zero-dependency Node.js script that scans git diffs, staging areas, or full repositories offline in `<2 seconds`. It outputs machine-readable JSON or human-readable terminal alerts with exact file lines, CVE/OWASP references, and auto-fix recommendations.

---

## 2. Security Rules & Detection Scope

The Sentinel scans for 6 distinct threat classes with 30+ deterministic rules:

### Class 1: Hardcoded Secrets & Token Leaks (CRITICAL)
- OpenAI, Anthropic, Google Gemini API keys
- AWS Access Key ID (`AKIA...`) and Secret Keys
- Stripe live/secret keys (`sk_live_...`, `rk_live_...`)
- GitHub Personal Access Tokens (`ghp_...`, `github_pat_...`)
- Supabase / Firebase service role keys and JWT tokens
- Generic private keys (PEM private key blocks)
- Database connection strings containing embedded credentials (`postgres://user:pass@host/db`)

### Class 2: OWASP Top 10 for LLM Applications (CRITICAL / HIGH)
- **LLM01 - Prompt Injection:** Raw user input concatenated into system prompts without delimiter escaping or type isolation.
- **LLM02 - Insecure Output Handling:** Direct execution of LLM output via `eval()`, `Function()`, `child_process.exec()`, or unescaped HTML insertion (`dangerouslySetInnerHTML`).
- **LLM07 - System Prompt Leakage:** Client-exposed endpoints serving raw internal prompt engineering logic.
- **LLM08 - Vector & Tool SSRF:** Untrusted LLM-generated URLs fetched via `fetch()` or `axios()` without private IP (RFC 1918) filtering.

### Class 3: Classical Injection & Execution Flaws (HIGH)
- SQL Injection via string interpolation into queries (`query("SELECT * WHERE id = " + id)`).
- Command Injection via unescaped shell execution (`child_process.exec`, `execSync`).
- Path Traversal via unvalidated path joining with user input (`path.join(__dirname, req.params.file)`).

### Class 4: Authentication, Authorization & Session Flaws (HIGH)
- Permissive CORS wildcards combined with credentials (`Access-Control-Allow-Origin: *` with credentials).
- Hardcoded JWT secrets or weak static fallback keys (`process.env.JWT_SECRET || 'secret123'`).
- Missing authentication middleware on mutating routes (`POST`, `PUT`, `DELETE`).

### Class 5: Input Validation & Deserialization (MEDIUM)
- Unvalidated request bodies missing Zod / Yup / Joi schema parsing.
- Unsafe YAML/JSON deserialization (`yaml.load()` without safe schema).
- Direct object prototype pollution via unconstrained recursive merge.

### Class 6: AI Dependency Hallucinations & Risky Packages (HIGH)
- Flagging known vulnerable or squatted package patterns in `package.json` / `requirements.txt`.
- Flagging unpinned dependency versions (`*` or `latest`) in production configs.

---

## 3. Technical Deliverables & Package Layout

```
products/ai-code-security-sentinel/
├── README.md                           # Customer master guide & quickstart
├── LICENSE.md                          # Commercial EULA
├── CHANGELOG.md                        # Version release history
├── COMPATIBILITY.md                    # Verified runtimes & client instructions
├── package.json                        # Node script definitions & test runner
├── product-manifest.json               # Cryptographic SHA-256 integrity manifest
├── progress.json                       # Internal development state record
├── skills/
│   └── ai-code-security-sentinel/
│       └── SKILL.md                    # Multi-client portable agent instruction file
├── scripts/
│   └── scan.mjs                        # Zero-dependency local CLI scanner
├── docs/
│   ├── research-dossier.md             # Commercial market validation report
│   ├── product-specification.md        # Technical architecture spec
│   ├── tutorial-guide.md               # 3-minute customer walkthrough & prompt recipes
│   ├── store-listing.md                # High-converting sales page copy
│   ├── test-plan.md                    # Verification test matrix
│   ├── test-results.md                 # Test execution logs
│   └── release-report.md               # Independent audit verification report
├── examples/
│   ├── vulnerable-code-sample.js       # Fixture containing common AI vulnerabilities
│   ├── secure-hardened-sample.js       # Fixture showing hardened production code
│   └── sample-scan-report.json         # Example JSON scan output
└── tests/
    ├── skill-structure.test.mjs        # Frontmatter & structure verification
    └── security-sentinel.test.mjs      # Functional scanner verification test suite
```

---

## 4. Acceptance Criteria & Pass Requirements

1. **Zero-Dependency Guarantee:** The CLI scanner runs on vanilla Node.js `>= 18.0.0` with zero external `npm install` packages required.
2. **Deterministic Execution:** Scanning the exact same codebase twice produces identical JSON hashes and exit codes.
3. **Multi-Client Portability:** The `SKILL.md` file operates identically across Google Antigravity, Anthropic Claude Code, Cursor IDE, and OpenAI Codex.
4. **Safety & Privacy:** The scanner never transmits code, filenames, or tokens over the network. 100% offline.
5. **Exit Codes:**
   - `0`: Scan clean or only informational warnings.
   - `1`: High or Critical security findings detected (blocks commit or CI).
   - `2`: Malformed inputs or internal execution failure.
