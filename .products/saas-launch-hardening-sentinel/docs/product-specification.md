# Product Specification: SaaS Launch Hardening Sentinel

**Product Slug:** `saas-launch-hardening-sentinel`  
**Version:** 1.0.0  
**Category:** `ai-skill-bundle`  
**License:** Commercial EULA (Personal & Client Commercial Deployment Rights)  
**Author:** Deepak Bagada Systems  

---

## 1. System Vision & Architecture

The **SaaS Launch Hardening Sentinel** is a dual-engine production engineering suite built specifically for developers, founders, and dev agencies who build web applications and SaaS products using AI coding assistants.

It combines:
1. **Deterministic Pre-Flight Scanner Engine (`scripts/launch-sentinel.mjs`)**: An automated, standalone Node.js audit tool that inspects files without API costs, evaluates code against 12 critical SaaS launch vectors, and outputs a machine-readable JSON score plus a markdown report (`LAUNCH-AUDIT-REPORT.md`).
2. **Autonomous Hardening AI Agent Skill (`skills/launch-hardening-sentinel/SKILL.md`)**: A structured, multi-stage agent skill compatible with Google Antigravity, Anthropic Claude Code, Cursor (`.cursorrules`), and OpenAI CLI that guides the AI agent to systematically repair every detected vulnerability.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SaaS Launch Hardening Sentinel                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [Target Codebase] ──▶  Deterministic Scanner CLI (scripts/sentinel.mjs)   │
│                                    │                                        │
│                                    ▼                                        │
│                         Vulnerability Scorecard                             │
│                         (12 Critical Vectors)                               │
│                                    │                                        │
│                                    ▼                                        │
│   [AI Agent] ◀──  Autonomous Hardening Skill (skills/.../SKILL.md)          │
│   (AGY / Cursor / Claude Code)     │                                        │
│                                    ▼                                        │
│   [Hardened Deliverables]:                                                  │
│   ├── 1. Stripe Idempotent Webhook Suite (Zero duplicate charges/exploits)  │
│   ├── 2. Auth Session Guardrails (Next.js Server Actions & API Routes)      │
│   ├── 3. Secret Leak Shield (Strict .env validation & scanner)             │
│   ├── 4. Upstash Rate-Limiter (DDoS & LLM wallet drain defense)             │
│   ├── 5. Supabase RLS Policy Hardener (Zero public database leaks)          │
│   └── 6. Sentry / Error Boundary Instrumentation                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 12 Critical Launch Hardening Vectors

The Sentinel audits and resolves 12 mission-critical vectors that sink un-hardened SaaS launches:

| Vector | Name | High-Risk Failure Mode in AI-Built Apps | Sentinel Remediation |
| :--- | :--- | :--- | :--- |
| **V-01** | **Stripe Webhook Signature Verification** | Handlers parse raw JSON body without Stripe cryptographic signature verification, allowing spoofed upgrade events. | Enforces `stripe.webhooks.constructEvent()` with raw byte buffer verification. |
| **V-02** | **Billing Idempotency & Replay Protection** | Webhooks run duplicate database mutations on Stripe event retries, leading to double-provisioning or race conditions. | Injects transactional database idempotency checking against `event.id`. |
| **V-03** | **Subscription Lifecycle Reconciliation** | Handles `checkout.session.completed` but forgets `customer.subscription.deleted`, giving cancelled users infinite access. | Complete state-machine handler: checkout, renewal, cancellation, dunning, and refund. |
| **V-04** | **Server Action & Route Authentication** | Server actions assume client is logged in without verifying session token on the server. | Enforces server-side session resolution before executing any state change. |
| **V-05** | **Input Sanitization & Schema Validation** | User input is passed directly to database ORMs or external APIs without runtime validation. | Implements Zod schema validation on all public and authenticated endpoints. |
| **V-06** | **LLM Route Rate Limiting (Wallet Drain Defense)** | Un-throttled AI endpoints can be scraped in a curl loop, running up thousands of dollars in LLM API bills. | Drop-in sliding-window rate limiting (Upstash Redis or in-memory fallback). |
| **V-07** | **Supabase / PostgreSQL RLS Hardener** | Tables are created with Row Level Security disabled or permissive `true` policies. | Audits SQL migrations and generates strict per-user RLS policies. |
| **V-08** | **Environment Secret Exposure** | Client components import server-only secrets (e.g. `NEXT_PUBLIC_STRIPE_SECRET_KEY`). | Strict scanner detects server keys prefixed with client build variables. |
| **V-09** | **CORS & CSRF Defenses** | API routes allow wildcards (`*`) or lack origin verification on sensitive mutations. | Restricts allowed origins to production domains with explicit credential handling. |
| **V-10** | **Database Connection Pool Exhaustion** | Serverless functions instantiate new Prisma / DB clients per request, choking connection pools. | Implements global singleton pattern for Prisma / Drizzle / Supabase clients. |
| **V-11** | **Global Error Boundaries & Sentry Hooks** | Unhandled client exceptions display blank white screens of death to paying users. | Production React error boundary with fallback UI and error logging hooks. |
| **V-12** | **SEO, OpenGraph & Favicon Polish** | Missing social metadata causes ugly broken links when shared on X, LinkedIn, or Slack. | Complete meta tag generator with dynamic OG card templates. |

---

## 3. Product Directory Layout

```
products/saas-launch-hardening-sentinel/
├── README.md                      # Customer entry point and quick overview
├── LICENSE.md                     # Commercial software license (Personal & Client rights)
├── CHANGELOG.md                   # Version release notes
├── COMPATIBILITY.md               # Verified execution matrix across AI tools & Node versions
├── product-manifest.json          # Factory manifest with file sha256 checksums
├── progress.json                  # Factory stage tracking state
├── scripts/
│   └── launch-sentinel.mjs        # Standalone zero-dependency Node.js vulnerability scanner CLI
├── skills/
│   └── launch-hardening-sentinel/
│       └── SKILL.md               # Multi-client AI Agent Skill instruction handbook
├── docs/
│   ├── research-dossier.md        # Stage 1: Market research and competitive analysis
│   ├── product-specification.md   # Stage 2: Technical architecture and vector matrix
│   ├── tutorial-guide.md          # Stage 4: Comprehensive customer tutorial & prompt recipes
│   ├── store-listing.md           # Stage 5: Commercial copy, tiers, FAQ, and refund terms
│   ├── test-plan.md               # Stage 6: Quality assurance & test methodology
│   ├── test-results.md            # Stage 6: Verified automated test execution logs
│   ├── validation-report.json     # Factory validation report
│   ├── package-audit-report.json  # Package safety audit report
│   └── release-report.md          # Stage 7: Final release verification audit
├── examples/
│   ├── vulnerable-mvp/            # Un-hardened realistic Next.js 15 + Stripe SaaS project
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── app/
│   │       ├── api/stripe/webhook/route.ts
│   │       ├── api/ai/generate/route.ts
│   │       └── actions/user.ts
│   └── hardened-mvp/              # Fully remediated benchmark project with hardened patterns
│       ├── package.json
│       ├── .env.example
│       └── app/
│           ├── api/stripe/webhook/route.ts
│           ├── api/ai/generate/route.ts
│           ├── actions/user.ts
│           └── lib/
│               ├── rate-limit.ts
│               ├── stripe.ts
│               └── db.ts
├── tests/
│   ├── skill-structure.test.mjs   # Structural compliance and schema tests
│   └── sentinel-scanner.test.mjs  # Functional test of the scanner against vulnerable vs hardened
└── dist/
    └── saas-launch-hardening-sentinel-1.0.0.zip # Final distribution archive
```

---

## 4. Tiered Pricing Model & Distribution Strategy

* **Tier 1: Solo Developer License ($79)**
  - Full Sentinel AI Agent Skill (`SKILL.md`) for Cursor, Claude Code, Antigravity.
  - Standalone Node.js Pre-Flight Scanner CLI (`launch-sentinel.mjs`).
  - Hardened code blueprints (Stripe webhook, rate-limiting, RLS, auth guards).
  - Use on unlimited personal projects.
  - 30-Day Money-Back Guarantee.

* **Tier 2: Agency & Studio Commercial License ($149)**
  - Everything in Tier 1.
  - Permitted use across unlimited client projects and commercial deliverables.
  - White-label markdown audit report generation for client handoffs.
  - Priority support and updates.

* **Distribution Channels:**
  - Lemon Squeezy / Gumroad digital storefronts.
  - Developer community distribution (X/Twitter launch thread, Product Hunt, GitHub release).
