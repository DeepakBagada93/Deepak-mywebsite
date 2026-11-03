# Customer Tutorial Guide: AI Code Security Sentinel

**Welcome to AI Code Security Sentinel!**  
This comprehensive guide walks you through setting up, configuring, and deploying your autonomous security auditor across Google Antigravity, Anthropic Claude Code, Cursor IDE, and Git pre-commit hooks in under 3 minutes.

---

## 1. Three-Minute Quickstart

AI Code Security Sentinel operates as both an **AI agent skill** and a **zero-dependency local CLI scanner**.

### Step 1: Unzip Your Package
```bash
unzip ai-code-security-sentinel-1.0.0.zip -d ./security-sentinel
cd security-sentinel
```

### Step 2: Run Your First Offline Security Scan
Scan any directory or file with zero installation:
```bash
node scripts/scan.mjs ./examples/vulnerable-code-sample.js
```
You will immediately see the detected vulnerabilities, secret exposures, and instant remediation diffs printed to your terminal.

### Step 3: Run Against Your Real Project
```bash
node scripts/scan.mjs /path/to/your/project --fail-on-high
```
- If all checks pass, it exits with code `0`.
- If critical or high vulnerabilities are detected, it exits with code `1`, preventing unsafe commits.

---

## 2. Multi-Client Installation Guide

### Option A: Anthropic Claude Code (Terminal Assistant)
1. Copy the skill into your project's agent skills directory:
   ```bash
   mkdir -p .claude/skills
   cp skills/ai-code-security-sentinel/SKILL.md .claude/skills/
   ```
2. Add the Sentinel enforcement to your project's `CLAUDE.md`:
   ```markdown
   ## Security Audit Policy
   Before submitting any code changes or git commits, invoke the `ai-code-security-sentinel` skill
   to audit all modified files for secret leaks and OWASP vulnerabilities.
   ```
3. In Claude Code, run:
   > *"Sentinel, audit the API routes I just wrote for security vulnerabilities and secret leaks."*

### Option B: Cursor IDE (Composer & Chat)
1. Copy `skills/ai-code-security-sentinel/SKILL.md` into your `.cursor/rules/` directory or root `.cursorrules`:
   ```bash
   cp skills/ai-code-security-sentinel/SKILL.md .cursor/rules/ai-code-security-sentinel.md
   ```
2. Cursor Composer will now automatically reference these negative constraints when generating code, refusing to write hardcoded tokens, insecure CORS headers, or unescaped prompt templates.

### Option C: Google Antigravity IDE
1. Copy the skill to your Antigravity skills repository:
   ```bash
   cp -r skills/ai-code-security-sentinel ~/.gemini/config/skills/
   ```
2. The skill is immediately available globally across all Antigravity projects.

### Option D: Git Pre-Commit Hook (Automated Defense)
Prevent anyone on your team from committing secrets to GitHub:
```bash
# In your project root:
mkdir -p .git/hooks
cat << 'EOF' > .git/hooks/pre-commit
#!/bin/sh
echo "🛡️ Running AI Code Security Sentinel pre-commit scan..."
node scripts/scan.mjs . --fail-on-high
if [ $? -ne 0 ]; then
  echo "❌ Commit rejected: Critical security vulnerabilities detected."
  exit 1
fi
echo "✅ Security checks passed."
EOF
chmod +x .git/hooks/pre-commit
```

---

## 3. High-Converting Prompt Recipes

Use these exact prompt templates with your AI coding assistant:

### Recipe 1: Pre-Commit Express Hardening
```
@ai-code-security-sentinel Perform an express pre-commit security audit on all staged git changes. Focus specifically on:
1. Hardcoded API keys, database credentials, or secret tokens.
2. Insecure shell exec or dynamic eval statements.
3. SQL/NoSQL query interpolation without parameters.
If any are found, provide immediate drop-in replacement fixes.
```

### Recipe 2: Deep OWASP LLM Application Audit
```
@ai-code-security-sentinel Audit this LLM agent orchestration file against the OWASP Top 10 for LLM Applications (2025/2026).
Specifically check:
- LLM01: Prompt injection risks where user input is passed without delimiter boundaries.
- LLM02: Insecure output handling (passing LLM responses directly to eval, shell, or innerHTML).
- LLM08: SSRF vectors in tools that fetch external URLs without private IP filtering.
Generate the formal Sentinel Security Audit Report.
```

### Recipe 3: Client Deliverable Security Certificate
```
@ai-code-security-sentinel Scan the entire repository and produce a client-facing Markdown Security Audit Certificate summarizing total files scanned, zero-defect verification, OWASP compliance, and safe dependency status for client delivery.
```

---

## 4. Frequently Asked Questions (FAQ)

#### Q: Does this scanner transmit my code to the cloud?
**A:** Never. AI Code Security Sentinel runs 100% locally and offline using standard Node.js runtime libraries. Not a single byte of your code, file paths, or repository data ever leaves your computer.

#### Q: Does it require installing large npm dependencies?
**A:** No. The scanner is completely zero-dependency (`0` npm packages). It uses native `node:fs`, `node:path`, and native regex engines for instant execution.

#### Q: Can I run this in GitHub Actions CI/CD?
**A:** Yes! Simply add a step in `.github/workflows/ci.yml`:
```yaml
- name: AI Security Audit
  run: node scripts/scan.mjs . --fail-on-high
```

#### Q: How do I handle intentional mock keys in tests?
**A:** The scanner automatically ignores files in `test/`, `tests/`, and files ending in `.test.js` or `.spec.ts` when configured with `--ignore-tests`, or you can add `// sentinel-ignore-next-line` above any intentional mock string.
