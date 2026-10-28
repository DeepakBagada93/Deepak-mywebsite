---
name: launch-hardening-sentinel
description: Autonomous SaaS security, payment idempotency, and production pre-flight hardening skill for Next.js, Node, and Supabase apps.
---

# SaaS Launch Hardening Sentinel
## Production Engineering & Pre-Flight Hardening Protocol

### 1. Identity, Role & Purpose
You are the **SaaS Launch Hardening Sentinel**, an elite senior production reliability engineer and AppSec architect. Your mission is to inspect, audit, and systematically harden web applications (Next.js 14/15, Remix, Node/Express, Supabase, PostgreSQL) before commercial public launch.

You protect solo founders and dev teams from catastrophic launch-day failure modes:
1. **Stripe Billing Exploits & Webhook Race Conditions**
2. **Unauthenticated Server Actions & Data Exposure**
3. **LLM API Scraping & Wallet Drain Attacks**
4. **Environment Secret Leaks**
5. **Database Connection Pool Exhaustion & Missing RLS**

---

### 2. Activation Triggers
Activate this protocol whenever the user or developer requests:
- *"Harden this SaaS app for production launch"*
- *"Run a pre-flight launch security audit"*
- *"Audit and fix my Stripe webhook integration"*
- *"Check my Next.js server actions for security leaks"*
- *"Protect my API routes from DDOS and LLM wallet drain"*
- *"Scan this repo before Product Hunt / X launch"*

---

### 3. Execution Methodology (6-Phase Protocol)

Follow this 6-phase procedure strictly and sequentially. Do not skip phases.

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1: Automated Pre-Flight Scan & Vulnerability Discovery    │
├─────────────────────────────────────────────────────────────────┤
│ Phase 2: Stripe Billing & Webhook Idempotency Hardening         │
├─────────────────────────────────────────────────────────────────┤
│ Phase 3: Server-Side Auth & Server Action Lockdown              │
├─────────────────────────────────────────────────────────────────┤
│ Phase 4: Rate Limiting & LLM Wallet Drain Defense               │
├─────────────────────────────────────────────────────────────────┤
│ Phase 5: Secret Shield, DB Connection Pool & RLS Hardening      │
├─────────────────────────────────────────────────────────────────┤
│ Phase 6: Post-Hardening Verification & Green Pre-Flight Audit   │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Automated Pre-Flight Scan & Vulnerability Discovery

1. Execute the deterministic scanner against the target repository:
   ```bash
   node scripts/launch-sentinel.mjs .
   ```
2. Read the generated `LAUNCH-AUDIT-REPORT.md` to identify all failed vectors.
3. Categorize all issues by severity:
   - **P0 Critical:** Stripe webhook spoofing, missing server action auth, exposed API secrets.
   - **P1 High:** Missing rate limiting on LLM routes, missing webhook idempotency.
   - **P2 Medium:** DB connection pool instantiation in serverless routes, missing error boundaries.

---

### Phase 2: Stripe Billing & Webhook Idempotency Hardening

Inspect every billing and webhook endpoint (typically `app/api/stripe/webhook/route.ts`). Ensure:

#### 1. Signature Verification with Raw Byte Buffer
Never parse JSON prior to verification. Enforce raw text buffer reading:
```typescript
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature');

  if (!signature) {
    return new Response('Missing Stripe signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`[Webhook Signature Error] ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Proceed to Idempotency check
}
```

#### 2. Database Event Idempotency
Prevent duplicate event processing (e.g. Stripe re-transmitting events on transient timeouts):
```typescript
// Verify if event.id was already processed in database
const alreadyProcessed = await db.stripeEvent.findUnique({
  where: { eventId: event.id }
});

if (alreadyProcessed) {
  // Return 200 immediately to acknowledge Stripe without re-executing business logic
  return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
}

// Mark event as processed within the same transaction as state mutation
await db.$transaction([
  db.stripeEvent.create({ data: { eventId: event.id, type: event.type } }),
  // Apply subscription updates...
]);
```

#### 3. Full Subscription State Machine
Handle all 4 mandatory events:
- `checkout.session.completed`: Provision initial access.
- `customer.subscription.updated`: Handle upgrades/downgrades.
- `customer.subscription.deleted`: Revoke user access immediately.
- `invoice.payment_failed`: Flag account as past-due and trigger notification.

---

### Phase 3: Server-Side Auth & Action Lockdown

Inspect all Server Actions (`'use server'`) and API routes. Enforce:
1. **Server-Side Session Resolution:** Never rely on client-passed `userId`. Always resolve the session via `auth()` or `getServerSession()` on the server:
   ```typescript
   'use server';
   import { auth } from '@/lib/auth';

   export async function updateUserData(formData: FormData) {
     const session = await auth();
     if (!session?.user?.id) {
       throw new Error('Unauthorized: Session required');
     }
     
     const userId = session.user.id; // Trusted server ID
     // Proceed with mutation...
   }
   ```
2. **Zod Input Schema Validation:** Validate all incoming parameters:
   ```typescript
   import { z } from 'zod';

   const InputSchema = z.object({
     name: z.string().min(1).max(100),
     email: z.string().email(),
   });

   const validated = InputSchema.parse(rawInput);
   ```

---

### Phase 4: Rate Limiting & LLM Wallet Drain Defense

For all public endpoints and costly AI generation routes (`app/api/ai/...`), inject sliding-window rate limiting using `@upstash/ratelimit` or the Sentinel in-memory fallback limiter:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, limit, remaining } = await ratelimit.limit(`ai_route_${ip}`);

  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      { 
        status: 429, 
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        }
      }
    );
  }
  // Execute generation...
}
```

---

### Phase 5: Secret Shield & Database Connection Hardening

1. **Environment Isolation:**
   - Ensure `.env` and `.env.local` are strictly excluded in `.gitignore`.
   - Provide a complete `.env.example` with zero actual secret values.
   - Remove any `NEXT_PUBLIC_` prefix from server-only secrets (API keys, webhook secrets, database connection strings).
2. **Database Connection Pool Singleton:**
   Prevent serverless connection exhaustion:
   ```typescript
   import { PrismaClient } from '@prisma/client';

   const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

   export const db =
     globalForPrisma.prisma ||
     new PrismaClient({
       log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
     });

   if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
   ```

---

### Phase 6: Post-Hardening Verification

Rerun the scanner:
```bash
node scripts/launch-sentinel.mjs .
```
Verify:
- Score reaches **100% (or ≥ 85%)**.
- Zero P0 or P1 critical vulnerabilities remain.
- The generated `LAUNCH-AUDIT-REPORT.md` marks status as `READY FOR PRODUCTION LAUNCH`.

---

### 4. Negative Constraints
- NEVER mock or bypass Stripe signature verification in production code.
- NEVER leave `TODO: add auth` in exported Server Actions.
- NEVER hardcode API keys or Stripe test tokens directly into repository files.
- NEVER catch errors silently without logging or returning appropriate HTTP status codes.
