#!/usr/bin/env node

/**
 * AI Code Security Sentinel - Zero-Dependency Local CLI Scanner
 * Scans codebases and diffs for secrets, OWASP vulnerabilities, and LLM-specific flaws.
 * 100% Offline | Zero Cloud Leak | Deterministic Execution
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Define Security Rule Definitions
export const RULES = [
  // Class 1: Secrets & Tokens (Active everywhere, including comments)
  {
    id: 'SEC-001',
    name: 'AWS Access Key Exposure',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    description: 'Hardcoded AWS Access Key ID detected. Exposing IAM credentials can lead to cloud account compromise.',
    remediation: 'Move credentials to environment variables or use IAM Roles / AWS Secrets Manager.'
  },
  {
    id: 'SEC-002',
    name: 'Anthropic API Key Exposure',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /\bsk-ant-[a-zA-Z0-9_\-]{20,}\b/g,
    description: 'Hardcoded Anthropic API Key detected. Can result in automated token exhaustion and model abuse.',
    remediation: 'Load via process.env.ANTHROPIC_API_KEY and configure budget caps.'
  },
  {
    id: 'SEC-003',
    name: 'OpenAI API Key Exposure',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /\bsk-[a-zA-Z0-9]{20,T3BlbkFJ[a-zA-Z0-9]{20,}\b|\bsk-proj-[a-zA-Z0-9_\-]{40,}\b/g,
    description: 'Hardcoded OpenAI Project or Legacy Secret Key detected.',
    remediation: 'Store in environment variables or cloud secrets management; rotate immediately if exposed.'
  },
  {
    id: 'SEC-004',
    name: 'Stripe Secret or Restricted Key Exposure',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /\b(?:sk|rk)_(?:live|test)_[0-9a-zA-Z]{24,}\b/g,
    description: 'Hardcoded Stripe Secret or Restricted API key detected. Risks customer financial data and unauthorized transactions.',
    remediation: 'Move Stripe secret keys to secure server-side environment variables.'
  },
  {
    id: 'SEC-005',
    name: 'GitHub Personal Access Token Exposure',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{36}\b|\bgithub_pat_[a-zA-Z0-9_]{22,}\b/g,
    description: 'Hardcoded GitHub Personal Access Token detected.',
    remediation: 'Revoke the token and inject via GitHub Actions secrets or local .env file (gitignored).'
  },
  {
    id: 'SEC-006',
    name: 'Private Cryptographic Key Block',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
    description: 'Raw private key embedded in source file.',
    remediation: 'Store private keys in protected files outside source control with 0600 permissions.'
  },
  {
    id: 'SEC-007',
    name: 'Embedded Database Connection Credentials',
    severity: 'CRITICAL',
    category: 'secrets',
    pattern: /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s:@/]+:[^\s:@/]+@[^\s/]+/g,
    description: 'Database connection URI contains hardcoded username and password.',
    remediation: 'Inject database connection URI from environment variable (e.g. DATABASE_URL).'
  },
  {
    id: 'SEC-008',
    name: 'Weak Fallback / Hardcoded JWT Secret',
    severity: 'HIGH',
    category: 'auth',
    pattern: /process\.env\.[A-Z_]*(?:SECRET|KEY|TOKEN)\s*\|\|\s*['"][^'"]{1,32}['"]/g,
    description: 'Cryptographic secret falls back to a weak static string if environment variable is missing.',
    remediation: 'Throw a startup configuration error if required secret environment variable is undefined.'
  },

  // Class 2: OWASP Top 10 for LLM Applications
  {
    id: 'LLM-001',
    name: 'Unescaped User Input in LLM System Prompt',
    severity: 'HIGH',
    category: 'prompt-injection',
    codeOnly: true,
    pattern: /(?:system|prompt)\s*:\s*`[^`]*\$\{(?:req\.body|req\.query|user_input|input|prompt)[^}]*\}[^`]*`/g,
    description: 'Raw user input interpolated directly into LLM system prompt without boundary tagging or sanitization (OWASP LLM01 Prompt Injection).',
    remediation: 'Isolate user inputs using XML/markdown tags (<user_input>...</user_input>) and validate schemas prior to prompt assembly.'
  },
  {
    id: 'LLM-002',
    name: 'Direct Execution of Dynamic Code (Eval / Function)',
    severity: 'CRITICAL',
    category: 'rce',
    codeOnly: true,
    pattern: /\beval\s*\(|new\s+Function\s*\(/g,
    description: 'Dynamic code execution detected (eval / Function constructor). If used with LLM outputs or user input, enables arbitrary Remote Code Execution.',
    remediation: 'Replace eval() with structured parser (JSON.parse), safe AST evaluators, or dedicated sandbox.'
  },
  {
    id: 'LLM-003',
    name: 'Unsanitized Shell Command Execution',
    severity: 'CRITICAL',
    category: 'rce',
    codeOnly: true,
    pattern: /(?:child_process|exec|execSync)\s*\(\s*`[^`]*\$\{/g,
    description: 'Shell command executed via template interpolation with dynamic parameters. Enables command injection.',
    remediation: 'Use execFile() or spawn() with explicit array arguments rather than shell string interpolation.'
  },
  {
    id: 'LLM-004',
    name: 'Direct HTML Injection (dangerouslySetInnerHTML)',
    severity: 'HIGH',
    category: 'xss',
    codeOnly: true,
    pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*__html\s*:\s*(?!DOMPurify)[^}]+\}/g,
    description: 'React dangerouslySetInnerHTML rendered without explicit DOMPurify sanitization. Enables Cross-Site Scripting (XSS).',
    remediation: 'Wrap dynamic HTML content in DOMPurify.sanitize(content) or use standard React text nodes.'
  },
  {
    id: 'LLM-005',
    name: 'Unvalidated Outbound Fetch (Potential SSRF)',
    severity: 'HIGH',
    category: 'ssrf',
    codeOnly: true,
    pattern: /fetch\s*\(\s*(?:req\.body\.[a-zA-Z_]+|req\.query\.[a-zA-Z_]+|targetUrl|userUrl)\b/g,
    description: 'Dynamic URL fetched without private IP/loopback address validation (OWASP SSRF / LLM08).',
    remediation: 'Validate destination hostname against an allowlist and reject loopback/RFC-1918 private IP addresses.'
  },

  // Class 3: Classical Injection & Web Vulnerabilities
  {
    id: 'INJ-001',
    name: 'SQL Query String Interpolation',
    severity: 'CRITICAL',
    category: 'injection',
    codeOnly: true,
    pattern: /(?:['"][^'"]*(?:SELECT|INSERT|UPDATE|DELETE)[^'"]*['"]\s*\+|\b\.(?:query|execute)\s*\(\s*['"][^'"]*(?:SELECT|INSERT|UPDATE|DELETE)[^'"]*['"]\s*\+)/gi,
    description: 'SQL statement constructed via string concatenation instead of parameterized placeholders.',
    remediation: 'Use parameterized queries ($1, ?), prepared statements, or a verified ORM query builder.'
  },
  {
    id: 'INJ-002',
    name: 'Template Literal SQL Query Interpolation',
    severity: 'HIGH',
    category: 'injection',
    codeOnly: true,
    pattern: /\.(?:query|execute)\s*\(\s*`[^`]*(?:SELECT|INSERT|UPDATE|DELETE)[^`]*\$\{/gi,
    description: 'SQL statement constructed with template literal interpolation without parameterized driver tags (e.g. sql`...`).',
    remediation: 'Use parameterized driver tags (such as prisma.$queryRaw, sql`...`) instead of raw template strings.'
  },
  {
    id: 'INJ-003',
    name: 'Path Traversal via Dynamic File Path Resolution',
    severity: 'HIGH',
    category: 'path-traversal',
    codeOnly: true,
    pattern: /path\.(?:join|resolve)\s*\([^)]*(?:req\.query|req\.params|req\.body)[^)]*\)/g,
    description: 'File path constructed directly from unvalidated request parameters. Allows directory traversal attacks (../).',
    remediation: 'Sanitize path segments using path.basename() or verify target is strictly contained within safe directory.'
  },
  {
    id: 'INJ-004',
    name: 'Permissive CORS with Credentials Wildcard',
    severity: 'HIGH',
    category: 'cors',
    codeOnly: true,
    pattern: /origin\s*:\s*(?:true|['"]\*['"])\s*,\s*credentials\s*:\s*true/g,
    description: 'CORS policy enables wildcard origin alongside credentials: true, exposing user sessions to cross-origin abuse.',
    remediation: 'Specify explicit, trusted origins in the CORS configuration rather than wildcard or boolean true.'
  }
];

// Ignored files and directories
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.agent',
  'dist',
  'build',
  '.next',
  '.turbo',
  'coverage'
]);

const IGNORED_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'progress.json',
  'product-manifest.json'
]);

/**
 * Scans a single text content against all rules
 */
export function scanContent(content, filepath = 'inline') {
  const findings = [];
  const lines = content.split('\n');

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let match;

    while ((match = rule.pattern.exec(content)) !== null) {
      // Find line number and column
      const charIndex = match.index;
      let lineNum = 1;
      let colNum = 1;
      let currentOffset = 0;

      for (let i = 0; i < lines.length; i++) {
        const lineLen = lines[i].length + 1; // including \n
        if (currentOffset + lineLen > charIndex) {
          lineNum = i + 1;
          colNum = charIndex - currentOffset + 1;
          break;
        }
        currentOffset += lineLen;
      }

      const rawLine = lines[lineNum - 1] || '';
      const trimmedLine = rawLine.trim();

      // If rule is codeOnly, ignore comments and documentation lines
      if (rule.codeOnly && (trimmedLine.startsWith('//') || trimmedLine.startsWith('*') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('#'))) {
        continue;
      }

      findings.push({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        category: rule.category,
        file: filepath,
        line: lineNum,
        column: colNum,
        matchSnippet: trimmedLine.slice(0, 120),
        description: rule.description,
        remediation: rule.remediation
      });

      // Avoid infinite loop on zero-width match
      if (rule.pattern.lastIndex === match.index) {
        rule.pattern.lastIndex++;
      }
    }
  }

  return findings;
}

/**
 * Recursively scans a target directory or file
 */
export async function scanTarget(targetPath) {
  const allFindings = [];
  let filesScanned = 0;

  async function walk(current) {
    const stat = await fs.stat(current);

    if (stat.isFile()) {
      const base = path.basename(current);
      if (!IGNORED_FILES.has(base)) {
        try {
          const content = await fs.readFile(current, 'utf8');
          const findings = scanContent(content, current);
          allFindings.push(...findings);
          filesScanned++;
        } catch {
          // Skip binary or unreadable files
        }
      }
      return;
    }

    if (stat.isDirectory()) {
      const base = path.basename(current);
      if (IGNORED_DIRS.has(base)) return;

      const entries = await fs.readdir(current, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(current, entry.name);
        if (entry.isSymbolicLink()) continue; // Skip symlinks for security
        await walk(full);
      }
    }
  }

  await walk(path.resolve(targetPath));

  return {
    target: targetPath,
    scannedAt: new Date().toISOString(),
    filesScanned,
    summary: {
      total: allFindings.length,
      critical: allFindings.filter(f => f.severity === 'CRITICAL').length,
      high: allFindings.filter(f => f.severity === 'HIGH').length,
      medium: allFindings.filter(f => f.severity === 'MEDIUM').length
    },
    findings: allFindings
  };
}

// CLI Execution Handler
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)) {
  const args = process.argv.slice(2);
  const jsonMode = args.includes('--json');
  const failOnHigh = args.includes('--fail-on-high') || args.includes('--fail-on=high');
  const target = args.find(a => !a.startsWith('--')) || '.';

  try {
    const result = await scanTarget(target);

    if (jsonMode) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`\n🛡️  AI Code Security Sentinel Scanner`);
      console.log(`========================================`);
      console.log(`Target:         ${result.target}`);
      console.log(`Files Scanned:  ${result.filesScanned}`);
      console.log(`Total Findings: ${result.summary.total} (Critical: ${result.summary.critical}, High: ${result.summary.high})\n`);

      if (result.findings.length === 0) {
        console.log(`✅ All checks passed! No security vulnerabilities detected.\n`);
      } else {
        for (const finding of result.findings) {
          const color = finding.severity === 'CRITICAL' ? '\x1b[31m' : '\x1b[33m';
          const reset = '\x1b[0m';
          console.log(`${color}[${finding.severity}] ${finding.ruleId}: ${finding.ruleName}${reset}`);
          console.log(`  File:   ${finding.file}:${finding.line}:${finding.column}`);
          console.log(`  Code:   ${finding.matchSnippet}`);
          console.log(`  Fix:    ${finding.remediation}\n`);
        }
      }
    }

    if (result.summary.critical > 0 || (failOnHigh && result.summary.high > 0)) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error(`Error during security scan: ${err.message}`);
    process.exit(2);
  }
}
