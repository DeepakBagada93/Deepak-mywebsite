# SaaS Launch Hardening Sentinel
## Complete Customer Tutorial & Implementation Guide

Welcome to the **SaaS Launch Hardening Sentinel**! This guide takes you step-by-step from an unvetted, newly built MVP to a hardened, attack-resistant, production-grade application ready for public launch on Product Hunt, X, Hacker News, or client delivery.

---

## Table of Contents
1. [3-Minute Quickstart](#1-3-minute-quickstart)
2. [Multi-Client Installation (AGY, Claude Code, Cursor, Codex)](#2-multi-client-installation)
3. [The 6-Phase Hardening Walkthrough](#3-the-6-phase-hardening-walkthrough)
4. [Battle-Tested Prompt Recipes](#4-battle-tested-prompt-recipes)
5. [Stripe Webhook Hardening Deep-Dive](#5-stripe-webhook-hardening-deep-dive)
6. [Preventing LLM Wallet Drain (Rate Limiting)](#6-preventing-llm-wallet-drain-rate-limiting)
7. [Troubleshooting & Frequently Asked Questions](#7-troubleshooting--frequently-asked-questions)

---

## 1. 3-Minute Quickstart

The Sentinel includes a standalone, zero-dependency Node.js scanner tool that runs locally without requiring API keys or third-party accounts.

### Step 1: Unzip the Package
Unzip `saas-launch-hardening-sentinel-1.0.0.zip` into your development environment or copy the `scripts/` and `skills/` folders into your SaaS repository.

### Step 2: Run the Pre-Flight Scanner
Open your terminal in the root of your application repository and execute:

```bash
node path/to/scripts/launch-sentinel.mjs .
```

### Step 3: Review Your Launch Score
The scanner audits your repository against 12 critical launch vectors and outputs:
- Your **Launch Readiness Score (0–100%)**.
- A detailed breakdown of passed and failed dimensions.
- A comprehensive markdown report generated at `LAUNCH-AUDIT-REPORT.md`.

---

## 2. Multi-Client Installation

You can use the Sentinel with any AI coding environment you prefer.

### Option A: Google Antigravity (AGY)
To make the Sentinel available to Antigravity CLI and IDE:
1. Copy the skill folder to your `.agent/skills/` directory:
   ```bash
   cp -r skills/launch-hardening-sentinel/ /path/to/your/project/.agent/skills/launch-hardening-sentinel/
   ```
2. Antigravity will automatically discover the skill. Activate it by prompting:
   > *"Run the launch hardening sentinel on this codebase and fix all critical vectors."*

### Option B: Anthropic Claude Code
1. Place `skills/launch-hardening-sentinel/SKILL.md` inside your repository as `CLAUDE.md` or append its contents to your existing `CLAUDE.md`.
2. Run Claude Code in your terminal:
   ```bash
   claude
   ```
3. Type:
   > *"Read CLAUDE.md. Execute Phase 1 of the launch hardening sentinel protocol and report all vulnerabilities."*

### Option C: Cursor IDE
1. Copy `skills/launch-hardening-sentinel/SKILL.md` into your project root as `.cursorrules` or place it in `.cursor/rules/launch-sentinel.mdc`.
2. In Cursor Composer (`Cmd+I` or `Ctrl+I`), select **Agent** mode and prompt:
   > *"Execute the launch hardening protocol on app/api and actions/. Ensure Stripe webhook idempotency and rate limiting are properly implemented."*

### Option D: OpenAI CLI & Codex
1. In your CLI prompt, supply the content of `skills/launch-hardening-sentinel/SKILL.md` as the system context.
2. Prompt the agent to inspect specific route files and generate hardened replacements.

---

## 3. The 6-Phase Hardening Walkthrough

Here is the exact workflow to take a newly vibe-coded app from a failing score (e.g. 30%) to a 100% green launch pass:

### Phase 1: Automated Discovery
Run `node scripts/launch-sentinel.mjs .` to inspect your repository. Read `LAUNCH-AUDIT-REPORT.md`. Focus first on **P0 issues** (Stripe webhook signature bypass, missing server action auth, or exposed secrets).

### Phase 2: Stripe Webhook Hardening
Common vibe-coded mistake:
```typescript
// ❌ DANGEROUS: Parsing JSON directly without signature check
export async function POST(req: Request) {
  const data = await req.json(); // Spoofable!
}
```

Hardened replacement using raw byte buffer verification:
```typescript
// ✅ HARDENED: Raw body text buffer verified against secret
export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature');
  const event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
}
```

### Phase 3: Idempotency Protection
Prevent double-charging or duplicate provisioning when Stripe retries transient timeouts:
```typescript
// Check if event was already handled in database
const exists = await db.stripeEvent.findUnique({ where: { eventId: event.id } });
if (exists) return NextResponse.json({ received: true });
```

### Phase 4: Server Action Session Lockdown
Never trust a client-supplied `userId`:
```typescript
// ❌ DANGEROUS: Trusting client parameter
export async function deleteProject(userId: string, projectId: string) { ... }

// ✅ HARDENED: Server-side authenticated session
export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  const userId = session.user.id;
  // Proceed with deletion where ownerId === userId
}
```

### Phase 5: Rate Limiting Expensive AI Routes
Inject sliding window rate limiting on all LLM generation routes to prevent automated scrapers from running up massive API bills:
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

### Phase 6: Green Pre-Flight Audit
Re-run the scanner:
```bash
node scripts/launch-sentinel.mjs .
```
Verify that the score reaches **100%** and the report confirms:
`✅ READY FOR PRODUCTION LAUNCH`.

---

## 4. Battle-Tested Prompt Recipes

Copy and paste these exact prompts into your AI agent (Antigravity, Cursor, or Claude Code) for instant execution:

### Recipe 1: Full Automated Pre-Flight Hardening
```
Act as the SaaS Launch Hardening Sentinel. 
1. Run the launch-sentinel script or inspect this repository against the 12 launch vectors.
2. Identify all missing auth checks, insecure Stripe webhook handlers, and un-throttled API routes.
3. Refactor each failing file to match the hardened production blueprints in the Sentinel skill.
4. Re-run the audit and confirm a 100% green pass.
```

### Recipe 2: Bulletproof Stripe Billing & Webhook Integration
```
Inspect our Stripe webhook handler (app/api/stripe/webhook/route.ts). 
Implement the complete production hardening suite:
1. Verify raw text buffer signature with stripe.webhooks.constructEvent.
2. Implement database event idempotency using event.id to prevent duplicate execution on retries.
3. Handle the complete subscription lifecycle: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, and invoice.payment_failed.
4. Do not leave any TODO placeholders or silent error swallows.
```

### Recipe 3: Anti-Wallet Drain Rate Limiting & Schema Validation
```
Inspect all public API routes and AI generation routes in app/api/. 
1. Implement sliding-window rate limiting (10 requests per 10 seconds per IP) using Upstash Redis with a fallback for local testing.
2. Wrap all input payloads in strict Zod schemas with character length bounds.
3. Reject any unauthorized origins and return standard 429 and 400 JSON error responses.
```

---

## 5. Stripe Webhook Hardening Deep-Dive

When selling subscriptions via Stripe, Stripe's delivery guarantee is **at-least-once**. This means Stripe WILL send the same webhook event multiple times if your server takes longer than 3 seconds to return a 200 HTTP code.

Without the Sentinel's idempotency pattern:
1. A user buys a monthly subscription.
2. Your server updates your database, but a network hiccup delays the HTTP 200 return by 4 seconds.
3. Stripe immediately retries the event.
4. Your server runs the subscription logic again, creating duplicate database records, sending two welcome emails, or miscalculating credits.

**The Solution Provided in `examples/hardened-mvp`:**
A transactional check against `event.id` stored in your database ensures that retried events return `200 OK` instantly without re-running any business logic.

---

## 6. Preventing LLM Wallet Drain (Rate Limiting)

If your SaaS provides an AI feature (e.g. OpenAI prompt generation, text completion, embeddings), an automated bot can execute 500 requests per minute to your `/api/ai` endpoint. Within 30 minutes, your OpenAI monthly limit will be drained.

**The Solution Provided in `examples/hardened-mvp`:**
The Sentinel implements an IP-based sliding window rate limiter. When a bot exceeds 10 requests in 10 seconds, the server rejects subsequent requests at the edge with HTTP `429 Too Many Requests`, before invoking any costly upstream LLM API.

---

## 7. Troubleshooting & Frequently Asked Questions

#### Q: Does `launch-sentinel.mjs` send my code or secrets to external servers?
**A:** No. The scanner is 100% local, zero-dependency Node.js code. It makes zero HTTP requests and reads files strictly on your local disk.

#### Q: Can I use this on non-Next.js projects (e.g. Remix, Node/Express, Supabase)?
**A:** Yes. The principles (signature verification, idempotency, rate limiting, connection pooling, and session auth) apply universally. See `COMPATIBILITY.md` for specific framework examples.

#### Q: What if my database does not have a `stripeEvent` table?
**A:** You can create a simple key-value table:
```sql
CREATE TABLE stripe_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
Alternatively, in serverless environments, store `event.id` in Upstash Redis with a 48-hour TTL.

#### Q: How do I test Stripe webhooks locally?
**A:** Use the official Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook signing secret printed by the CLI (`whsec_...`) into your `.env.local`.
