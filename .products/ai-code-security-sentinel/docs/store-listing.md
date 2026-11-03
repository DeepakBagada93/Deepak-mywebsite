# AI Code Security Sentinel: Autonomous Pre-Commit & OWASP Hardening Suite
## Stop Shipping AI-Generated Vulnerabilities. Catch Secret Leaks, Prompt Injections, and OWASP Flaws in Under 2 Seconds — 100% Offline.

> **"Cursor and Claude Code accelerated your shipping velocity by 5x. But who is auditing the code they write before you push to GitHub?"**

---

## The Silent AI Security Crisis

If you are building software with **Cursor, Anthropic Claude Code, Google Antigravity, GitHub Copilot, or OpenAI Codex**, your output has never been faster.

**But your attack surface has never been wider.**

Recent developer telemetry reveals a terrifying truth about AI-assisted engineering:
- **AI loves hardcoding active secrets:** Prompt an AI to build a payment webhook or Claude API wrapper, and it routinely pastes live `sk-proj-...`, `sk-ant-...`, `AKIA...`, and `sk_live_...` tokens directly into test fixtures, client wrappers, or staging configs.
- **AI ignores OWASP LLM Top 10 vulnerabilities:** LLM-generated code frequently concatenates raw user strings into system prompts (OWASP LLM01 - Prompt Injection), executes dynamic strings via `eval()` or `child_process.exec()`, and fetches untrusted URLs without private IP filtering (SSRF against AWS IMDS `169.254.169.254`).
- **AI hallucinates dangerous dependencies:** Models hallucinate package names that hackers typo-squat on npm and PyPI, infecting production builds with backdoor malware.
- **Enterprise scanners are slow, bloated, and intrusive:** Tools like Snyk and SonarQube charge **$99 to $499/seat/month**, take 5 to 15 minutes to run, and upload your proprietary intellectual property to remote cloud servers.

**One leaked Stripe secret or database credential can drain your company's bank account or destroy your client relationships overnight.**

---

## The Solution: AI Code Security Sentinel

**AI Code Security Sentinel** is a dual-engine security system engineered specifically for developers and technical agencies building with AI assistants:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      AI CODE SECURITY SENTINEL                         │
├───────────────────────────────────┬────────────────────────────────────┤
│     ENGINE 1: THE AGENT SKILL     │      ENGINE 2: THE CLI SCANNER     │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Works natively in Claude Code,  │ • Blazing-fast Node.js scanner     │
│   Cursor, Antigravity, & Codex    │ • Scans 500 files in <2 seconds    │
│ • Intercepts flaws at prompt-time │ • 100% offline — ZERO cloud leaks  │
│ • Guides AI to write secure code  │ • Drops directly into git hooks    │
│ • Auto-fixes unsafe AST patterns  │ • Generates client audit reports   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 1. The Multi-Client Agent Skill (`SKILL.md`)
A portable, battle-tested AI agent instruction set that lives directly in your IDE (`.cursor/rules/`, `.claude/skills/`, or `~/.gemini/config/skills/`). It intercepts dangerous patterns *while the code is being written*, teaching the model to sanitize inputs, enforce parameterized SQL queries, isolate user prompts, and reject unsafe defaults before files are ever saved.

### 2. The Zero-Dependency Local CLI Scanner (`scripts/scan.mjs`)
A lightning-fast, zero-dependency Node.js CLI script that audits your staging area, git diff, or entire codebase in **under 2 seconds**. It runs 100% offline with zero `npm install` requirements. If a critical secret or injection risk is found, it blocks the git commit and outputs the exact file line, severity rating, and drop-in remediation patch.

---

## 30+ Deterministic Security Rules Across 6 Threat Classes

AI Code Security Sentinel scans your code across 6 comprehensive security vectors:

### 1. Production Secrets & Token Leaks (CRITICAL)
- **AWS Access Keys:** Identifies active AWS IAM credentials (`AKIA[0-9A-Z]{16}`).
- **AI Vendor Keys:** Detects exposed OpenAI (`sk-proj-...`, `sk-...`), Anthropic (`sk-ant-...`), and Google Gemini API keys.
- **Payment Keys:** Catches live and restricted Stripe keys (`sk_live_...`, `rk_live_...`).
- **Source Control Tokens:** Detects GitHub Personal Access Tokens (`ghp_...`, `github_pat_...`).
- **Databases & Private Keys:** Identifies inline DB connection credentials (`postgres://user:pass@host`) and RSA/EC private key blocks.

### 2. OWASP Top 10 for LLM Applications (CRITICAL / HIGH)
- **LLM01 Prompt Injection:** Detects unescaped user inputs concatenated into system prompts without delimiter boundaries.
- **LLM02 Insecure Output Handling:** Intercepts dynamic evaluation via `eval()`, `new Function()`, and unescaped HTML (`dangerouslySetInnerHTML`).
- **LLM03 Command Injection:** Flags raw shell commands executed via `child_process.exec` or `execSync` with variable templates.
- **LLM08 Tool SSRF:** Detects outbound HTTP requests (`fetch`, `axios`) that fail to block RFC 1918 private subnets and AWS metadata services (`169.254.169.254`).

### 3. Classical Web & Database Vulnerabilities (HIGH)
- **SQL Injection:** Detects raw string concatenations inside database query methods (`query("SELECT * WHERE id = " + id)`).
- **Path Traversal:** Flags untrusted path joins (`path.join(__dirname, req.params.file)`) that expose sensitive server files.
- **Permissive CORS with Credentials:** Intercepts dangerous `Access-Control-Allow-Origin: *` configurations paired with credentials.

### 4. Authentication & Authorization Hygiene (HIGH)
- Hardcoded fallback JWT secrets (`process.env.JWT_SECRET || 'secret123'`).
- Missing authorization middleware on mutating endpoints (`POST`, `PUT`, `DELETE`).
- Exposed internal administrative and debug routes.

### 5. Input Validation & Schema Integrity (MEDIUM)
- Unvalidated request bodies lacking Zod, Yup, or Joi validation schemas.
- Unsafe YAML/JSON deserialization prone to prototype pollution.

### 6. AI Dependency Hallucinations (HIGH)
- Scans `package.json` for known typo-squatted, unpinned (`*` or `latest`), or hallucinated package imports.

---

## Before vs. After: The Sentinel Transformation

| Without AI Code Security Sentinel | With AI Code Security Sentinel |
| :--- | :--- |
| **Silent Secret Leaks:** Cursor or Claude generates a helper file with your live Stripe or OpenAI key; it gets pushed to a public GitHub repo and drained in 90 seconds. | **Pre-Commit Shield:** The pre-commit hook scans your diff in 80ms, halts the commit, and displays the exact line and replacement code. |
| **Prompt Injection Backdoors:** User input is fed directly into your agent prompt; malicious actors bypass system guardrails and extract proprietary system prompts. | **Boundary Isolation:** The agent automatically enforces strict `<user_input>` XML delimiters and schema validation on every prompt. |
| **Expensive $100+/mo SaaS Scanners:** Snyk or SonarQube charges recurring monthly fees per seat, runs for 10 minutes in the cloud, and uploads your private IP. | **One-Time ₹1,999 / $69 Lifetime Ownership:** 100% offline scanner runs locally in <2 seconds with zero network calls and zero telemetry. |
| **Stressful Client Handoffs:** Agencies pray the client's internal security team doesn't find unparameterized SQL or unauthenticated endpoints during delivery. | **Audit Certificate Included:** Generate clean, white-label Markdown security reports proving the codebase is OWASP-compliant. |

---

## 3-Minute Quickstart

### Step 1: Instant Local Scan
Run the zero-dependency scanner against any file or folder—no npm installs needed:
```bash
node scripts/scan.mjs ./src
```

### Step 2: Enforce in Git Pre-Commit
Block vulnerable code from ever reaching GitHub with a one-line hook:
```bash
# Add to .git/hooks/pre-commit:
node scripts/scan.mjs . --fail-on-high
```

### Step 3: Install in Your AI IDE
- **Claude Code:** Copy `skills/ai-code-security-sentinel/SKILL.md` to `.claude/skills/`
- **Cursor IDE:** Copy `skills/ai-code-security-sentinel/SKILL.md` to `.cursor/rules/`
- **Google Antigravity:** Add folder to `~/.gemini/config/skills/`

---

## What's in the Box (Downloadable ZIP Contents)

When you purchase AI Code Security Sentinel, you instantly download `ai-code-security-sentinel-1.0.0.zip` containing:

- **`skills/ai-code-security-sentinel/SKILL.md`**: Multi-client portable agent instruction file compatible with Antigravity, Claude Code, Cursor, and Codex CLI.
- **`scripts/scan.mjs`**: Zero-dependency local CLI security scanner executable (`node scripts/scan.mjs`).
- **`docs/tutorial-guide.md`**: Complete step-by-step setup guide with CI/CD recipes, IDE shortcuts, and prompt patterns.
- **`docs/product-specification.md`**: In-depth architectural blueprint and threat taxonomy.
- **`docs/research-dossier.md`**: Commercial analysis and OWASP LLM Top 10 breakdown.
- **`examples/`**: Real-world vulnerable vs. hardened code fixtures (`vulnerable-code-sample.js` vs. `secure-hardened-sample.js`) and sample JSON audit reports.
- **`tests/`**: Automated structural and functional test suite verifying detection accuracy with 100% test coverage.
- **`COMPATIBILITY.md`**: Verified runtime environments (Node.js 18+, macOS, Linux, Windows WSL).
- **Commercial License (EULA)**: Perpetual commercial usage rights for personal and client projects.

---

## Dual-Market Commercial Pricing Matrix

| Feature / Entitlement | Solo Developer | Agency Pro | Agency Unlimited |
| :--- | :---: | :---: | :---: |
| **India Price (UPI Instant)** | **₹1,999** *(Reg. ₹2,999)* | **₹3,999** *(Reg. ₹5,999)* | **₹7,999** *(Reg. ₹14,999)* |
| **US & Global Price (Stripe)** | **$69** *(Reg. $99)* | **$149** *(Reg. $199)* | **$299** *(Reg. $499)* |
| **Full SKILL.md Agent Instructions** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Zero-Dependency CLI Scanner** | ✅ Yes | ✅ Yes | ✅ Yes |
| **All 30+ Security & OWASP Rules** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Git Pre-Commit Hook Integration** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Repository License** | Unlimited Personal | Up to 10 Client Projects | Unlimited Client & Enterprise |
| **White-Label Client Audit Reports** | ❌ No | ✅ Yes (Billable to clients) | ✅ Yes (Unlimited) |
| **GitHub Actions CI/CD Pipeline Blueprint** | ❌ No | ✅ Yes | ✅ Yes |
| **GST Tax Invoice (18% ITC Claimable)** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Updates & New Threat Signatures** | Lifetime Minor | 1 Year Priority | Lifetime Access |

---

## Risk-Reversal Guarantees

### 🛡️ 100% Offline Zero-Data-Leak Guarantee
The CLI scanner runs entirely on your local workstation. It does not open network sockets, does not send telemetry, and does not upload your source code to external servers. Your intellectual property stays on your machine.

### 💰 30-Day Money-Back Guarantee
Use AI Code Security Sentinel in your projects for 30 full days. Run it across your AI-generated code, git diffs, and staging environments. If it doesn't give you complete confidence in the security of your code before shipping, simply email us your order reference for an immediate 100% refund—no questions asked.

---

## Frequently Asked Questions

**Does the scanner send my code to any cloud servers?**  
No. AI Code Security Sentinel is 100% offline. Zero network calls, zero telemetry, zero analytics, zero data leaks.

**Does it require npm install or external dependencies?**  
No. The scanner is written in pure vanilla Node.js using native ES modules. It runs instantly on any machine with Node.js 18+ installed without running `npm install`.

**How fast is the scan?**  
A full scan of a typical 500-file repository completes in under 2 seconds. A single git diff or pre-commit check completes in under 100 milliseconds.

**Which AI coding tools are supported?**  
The `SKILL.md` agent skill works natively with Anthropic Claude Code, Cursor IDE, Google Antigravity, GitHub Copilot CLI, and OpenAI Codex. The CLI scanner works with any editor or git workflow on macOS, Linux, and Windows WSL.

**Can I bill client security audits using this tool?**  
Yes. With the Agency Pro and Agency Unlimited licenses, you are authorized to generate and re-brand the Markdown security audit reports and deliver them to your paying clients as a billable security service.

**Is the Indian Rupee price GST inclusive?**  
Yes. The ₹1,999 (Solo) and ₹3,999 (Agency Pro) prices are GST-inclusive with instant UPI QR checkout (PhonePe, Google Pay, Paytm, CRED) and automated GST tax invoices for business expense ITC claims.
