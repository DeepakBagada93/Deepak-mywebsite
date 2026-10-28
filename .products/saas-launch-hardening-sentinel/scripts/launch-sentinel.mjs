#!/usr/bin/env node
/**
 * SaaS Launch Hardening Sentinel - Pre-Flight Security & Readiness Scanner
 * Standalone zero-dependency Node.js CLI tool.
 *
 * Scans web applications (Next.js, Remix, Node/Express, Supabase, etc.)
 * against 12 critical SaaS launch vectors.
 *
 * Usage:
 *   node scripts/launch-sentinel.mjs [path-to-repo]
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const targetDir = process.argv[2] || '.';
const root = path.resolve(targetDir);

const VECTORS = {
  V01: { id: 'V-01', name: 'Stripe Webhook Signature Verification', weight: 15 },
  V02: { id: 'V-02', name: 'Billing Idempotency & Replay Protection', weight: 10 },
  V03: { id: 'V-03', name: 'Subscription Lifecycle Handling', weight: 10 },
  V04: { id: 'V-04', name: 'Server-Side Route & Action Authentication', weight: 15 },
  V05: { id: 'V-05', name: 'Input Schema Validation (Zod/Typebox)', weight: 10 },
  V06: { id: 'V-06', name: 'LLM & Expensive Endpoint Rate Limiting', weight: 10 },
  V07: { id: 'V-07', name: 'Database Connection Pool Singleton', weight: 5 },
  V08: { id: 'V-08', name: 'Environment Secret Leakage Shield', weight: 10 },
  V09: { id: 'V-09', name: 'Production CORS & Origin Lockdown', weight: 5 },
  V10: { id: 'V-10', name: 'Error Boundary & Monitoring Hooks', weight: 5 },
  V11: { id: 'V-11', name: 'Strict .gitignore & .env Isolation', weight: 3 },
  V12: { id: 'V-12', name: 'Metadata & Social Preview Polish', weight: 2 }
};

const results = {
  scannedAt: new Date().toISOString(),
  target: root,
  score: 0,
  maxScore: 100,
  passedVectors: [],
  failedVectors: [],
  findings: []
};

// Recursive file scanner (skips node_modules, .git, dist, .next)
async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    if (['node_modules', '.git', '.next', 'dist', 'build', '.agent'].includes(dirent.name)) {
      return [];
    }
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

async function runAudit() {
  const allFiles = await getFiles(root);
  const relativeFiles = allFiles.map(f => path.relative(root, f));

  // 1. Audit .gitignore and environment isolation (V-11 & V-08)
  let gitignoreContent = '';
  try {
    gitignoreContent = await fs.readFile(path.join(root, '.gitignore'), 'utf8');
  } catch {}

  const envFilesOnDisk = relativeFiles.filter(f => /^\.env(?:\..+)?$/i.test(path.basename(f)));
  const hasEnvExample = relativeFiles.some(f => path.basename(f) === '.env.example');

  // Check for hardcoded secrets or leaked keys in client files
  let leakedSecrets = [];
  let foundPublicSecretLeak = false;

  for (const rel of relativeFiles) {
    if (!/\.(js|jsx|ts|tsx|json|mjs|cjs)$/i.test(rel)) continue;
    const content = await fs.readFile(path.join(root, rel), 'utf8').catch(() => '');

    // Check for NEXT_PUBLIC_ with secret/private keywords
    if (/NEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|PRIVATE|KEY_LIVE|PASS)/i.test(content)) {
      foundPublicSecretLeak = true;
      leakedSecrets.push({ file: rel, issue: 'Exposed secret under NEXT_PUBLIC_ prefix' });
    }

    // Check for raw test/live keys committed in code
    if (/(?:sk_live_|sk_test_|ghp_[A-Za-z0-9_]{20,}|whsec_[A-Za-z0-9_]{20,})/.test(content)) {
      leakedSecrets.push({ file: rel, issue: 'Hardcoded API secret token found in source code' });
    }
  }

  // Vector V-08 Evaluation
  if (!foundPublicSecretLeak && leakedSecrets.length === 0) {
    results.passedVectors.push(VECTORS.V08);
  } else {
    results.failedVectors.push({ ...VECTORS.V08, details: leakedSecrets });
  }

  // Vector V-11 Evaluation
  if (gitignoreContent.includes('.env') && hasEnvExample) {
    results.passedVectors.push(VECTORS.V11);
  } else {
    results.failedVectors.push({
      ...VECTORS.V11,
      details: 'Missing .env exclusion in .gitignore or missing .env.example template'
    });
  }

  // 2. Audit Stripe Webhook Handlers (V-01, V-02, V-03)
  const webhookFiles = relativeFiles.filter(f => /webhook|stripe/i.test(f) && /\.(js|ts)$/i.test(f));
  let hasWebhookSignature = false;
  let hasIdempotency = false;
  let handlesLifecycle = false;

  for (const wf of webhookFiles) {
    const code = await fs.readFile(path.join(root, wf), 'utf8').catch(() => '');
    if (code.includes('constructEvent') || code.includes('stripe.webhooks.constructEvent')) {
      hasWebhookSignature = true;
    }
    if (code.includes('idempotency') || code.includes('event.id') || code.includes('processedEvents') || code.includes('stripe_events')) {
      hasIdempotency = true;
    }
    if (code.includes('customer.subscription.deleted') || code.includes('invoice.payment_failed')) {
      handlesLifecycle = true;
    }
  }

  if (hasWebhookSignature) {
    results.passedVectors.push(VECTORS.V01);
  } else {
    results.failedVectors.push({
      ...VECTORS.V01,
      details: 'No Stripe webhook signature verification (`stripe.webhooks.constructEvent`) detected.'
    });
  }

  if (hasIdempotency) {
    results.passedVectors.push(VECTORS.V02);
  } else {
    results.failedVectors.push({
      ...VECTORS.V02,
      details: 'Missing idempotency protection on billing webhooks. Duplicate events could trigger double-credits.'
    });
  }

  if (handlesLifecycle) {
    results.passedVectors.push(VECTORS.V03);
  } else {
    results.failedVectors.push({
      ...VECTORS.V03,
      details: 'Incomplete subscription lifecycle handling (missing customer.subscription.deleted / dunning).'
    });
  }

  // 3. Audit Server-Side Route & Action Auth (V-04)
  const actionFiles = relativeFiles.filter(f => /action|route|api/i.test(f) && /\.(js|ts)$/i.test(f) && !/webhook/i.test(f));
  let hasAuthChecks = false;
  for (const af of actionFiles) {
    const code = await fs.readFile(path.join(root, af), 'utf8').catch(() => '');
    if (code.includes('auth()') || code.includes('getServerSession') || code.includes('getUser()') || code.includes('getSession') || code.includes('req.headers.authorization')) {
      hasAuthChecks = true;
      break;
    }
  }

  if (hasAuthChecks) {
    results.passedVectors.push(VECTORS.V04);
  } else {
    results.failedVectors.push({
      ...VECTORS.V04,
      details: 'No server-side auth verification detected across API route handlers or server actions.'
    });
  }

  // 4. Audit Schema Validation (V-05)
  let hasSchemaValidation = false;
  for (const f of relativeFiles) {
    if (!/\.(js|ts)$/i.test(f)) continue;
    const code = await fs.readFile(path.join(root, f), 'utf8').catch(() => '');
    if (code.includes('zod') || code.includes('z.object') || code.includes('typebox') || code.includes('yup')) {
      hasSchemaValidation = true;
      break;
    }
  }

  if (hasSchemaValidation) {
    results.passedVectors.push(VECTORS.V05);
  } else {
    results.failedVectors.push({
      ...VECTORS.V05,
      details: 'No runtime schema validation (Zod, Typebox, Yup) found on incoming request inputs.'
    });
  }

  // 5. Audit Rate Limiting (V-06)
  let hasRateLimiting = false;
  for (const f of relativeFiles) {
    if (!/\.(js|ts)$/i.test(f)) continue;
    const code = await fs.readFile(path.join(root, f), 'utf8').catch(() => '');
    if (code.includes('@upstash/ratelimit') || code.includes('rateLimit') || code.includes('ratelimit') || code.includes('limiter')) {
      hasRateLimiting = true;
      break;
    }
  }

  if (hasRateLimiting) {
    results.passedVectors.push(VECTORS.V06);
  } else {
    results.failedVectors.push({
      ...VECTORS.V06,
      details: 'No rate limiting detected on API routes or expensive LLM generation endpoints.'
    });
  }

  // 6. Audit Database Connection Pool Singleton (V-07)
  let hasDbSingleton = false;
  for (const f of relativeFiles) {
    if (!/\.(js|ts)$/i.test(f)) continue;
    const code = await fs.readFile(path.join(root, f), 'utf8').catch(() => '');
    if (code.includes('globalThis.prisma') || code.includes('globalForPrisma') || code.includes('global.prisma') || code.includes('createClient') || code.includes('drizzle(')) {
      hasDbSingleton = true;
      break;
    }
  }

  if (hasDbSingleton) {
    results.passedVectors.push(VECTORS.V07);
  } else {
    results.failedVectors.push({
      ...VECTORS.V07,
      details: 'Missing database connection pool singleton. Risk of socket exhaustion on serverless.'
    });
  }

  // 7. Audit CORS & Origin (V-09)
  let hasCorsLockdown = false;
  for (const f of relativeFiles) {
    if (!/\.(js|ts|json)$/i.test(f)) continue;
    const code = await fs.readFile(path.join(root, f), 'utf8').catch(() => '');
    if (code.includes('Access-Control-Allow-Origin') || code.includes('cors(') || code.includes('allowedOrigins')) {
      hasCorsLockdown = true;
      break;
    }
  }

  if (hasCorsLockdown) {
    results.passedVectors.push(VECTORS.V09);
  } else {
    results.failedVectors.push({
      ...VECTORS.V09,
      details: 'No explicit CORS origin constraints detected.'
    });
  }

  // 8. Audit Error Boundary & Monitoring (V-10)
  let hasErrorBoundary = false;
  for (const f of relativeFiles) {
    if (/error\.(tsx|jsx|js|ts)$/i.test(f) || /sentry/i.test(f)) {
      hasErrorBoundary = true;
      break;
    }
  }

  if (hasErrorBoundary) {
    results.passedVectors.push(VECTORS.V10);
  } else {
    results.failedVectors.push({
      ...VECTORS.V10,
      details: 'Missing React Error Boundary (`app/error.tsx`) or Sentry monitoring instrumentation.'
    });
  }

  // 9. Audit Metadata & Social Preview (V-12)
  let hasMetadata = false;
  for (const f of relativeFiles) {
    if (!/\.(js|ts|tsx|jsx)$/i.test(f)) continue;
    const code = await fs.readFile(path.join(root, f), 'utf8').catch(() => '');
    if (code.includes('openGraph') || code.includes('twitter:') || code.includes('metadataBase')) {
      hasMetadata = true;
      break;
    }
  }

  if (hasMetadata) {
    results.passedVectors.push(VECTORS.V12);
  } else {
    results.failedVectors.push({
      ...VECTORS.V12,
      details: 'Incomplete OpenGraph / Twitter Card metadata. Social link previews will be degraded.'
    });
  }

  // Calculate final weighted score
  const totalWeight = Object.values(VECTORS).reduce((acc, v) => acc + v.weight, 0);
  const earnedWeight = results.passedVectors.reduce((acc, v) => acc + v.weight, 0);
  results.score = Math.round((earnedWeight / totalWeight) * 100);

  // Generate Human-Readable Markdown Report
  let mdReport = `# SaaS Launch Readiness Audit Report\n\n`;
  mdReport += `**Audited Path:** \`${root}\`  \n`;
  mdReport += `**Timestamp:** ${results.scannedAt}  \n`;
  mdReport += `**Launch Readiness Score:** **${results.score}% / 100%**  \n`;
  mdReport += `**Status:** ${results.score >= 85 ? '✅ READY FOR PRODUCTION LAUNCH' : '⚠️ HIGH RISK - REMEDIATION REQUIRED'}\n\n`;

  mdReport += `## Vector Breakdown\n\n`;
  mdReport += `| Vector ID | Hardening Dimension | Weight | Status |\n`;
  mdReport += `| :--- | :--- | :--- | :--- |\n`;

  for (const [key, v] of Object.entries(VECTORS)) {
    const passed = results.passedVectors.some(pv => pv.id === v.id);
    mdReport += `| **${v.id}** | ${v.name} | ${v.weight} pts | ${passed ? '✅ PASSED' : '❌ FAILED'} |\n`;
  }

  if (results.failedVectors.length > 0) {
    mdReport += `\n## Critical Remediation Actions Required\n\n`;
    for (const fv of results.failedVectors) {
      mdReport += `### ❌ [${fv.id}] ${fv.name}\n`;
      mdReport += `- **Issue:** ${typeof fv.details === 'string' ? fv.details : JSON.stringify(fv.details)}\n`;
      mdReport += `- **Remediation Action:** Consult \`skills/launch-hardening-sentinel/SKILL.md\` for drop-in hardened implementation.\n\n`;
    }
  } else {
    mdReport += `\n## 🎉 Congratulations!\nAll 12 critical launch vectors passed. This repository is production-ready.\n`;
  }

  // Save report to disk
  const reportPath = path.join(root, 'LAUNCH-AUDIT-REPORT.md');
  await fs.writeFile(reportPath, mdReport, 'utf8');

  console.log(`\n======================================================`);
  console.log(` SaaS Launch Hardening Sentinel - Audit Complete`);
  console.log(`======================================================`);
  console.log(` Target Path: ${root}`);
  console.log(` Launch Readiness Score: ${results.score}% / 100%`);
  console.log(` Passed Vectors: ${results.passedVectors.length} / 12`);
  console.log(` Failed Vectors: ${results.failedVectors.length} / 12`);
  console.log(` Generated Report: ${reportPath}`);
  console.log(`======================================================\n`);

  return results;
}

runAudit().catch(err => {
  console.error('Audit Error:', err);
  process.exit(1);
});
