# SaaS Launch Hardening Sentinel
### Pre-Flight Security, Payment Idempotency & Production Hardening Suite for AI-Built Apps

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Commercial_EULA-green.svg)](LICENSE.md)
[![Launch Readiness](https://img.shields.io/badge/pre--flight_readiness-100%25-brightgreen.svg)](docs/test-results.md)
[![Clients](https://img.shields.io/badge/supported_agents-Antigravity_|_Claude_Code_|_Cursor_|_Codex-blueviolet.svg)](COMPATIBILITY.md)

---

## 🚀 Overview

Did you build your SaaS application using **Cursor, Claude Code, or Google Antigravity**? 

While AI coding agents are incredible at scaffolding full-stack apps in 48 hours, they routinely generate critical production vulnerabilities:
- **Insecure Stripe Webhooks**: Missing cryptographic signature verification and idempotency handling (allowing users to spoof subscriptions or cause double-charging).
- **Unauthenticated Server Actions**: Client-callable endpoints executing mutations without server session verification.
- **LLM Wallet Drain**: Public AI routes exposed without sliding-window rate limiting, allowing malicious scrapers to burn through thousands of dollars in OpenAI credits.
- **Supabase / PostgreSQL Leaks**: Permissive RLS rules and database connection pool exhaustion in serverless runtimes.

The **SaaS Launch Hardening Sentinel** is your automated defense shield. It provides a **deterministic pre-flight scanner CLI** alongside an **autonomous multi-client AI agent skill** that audits your codebase in seconds and systematically repairs every launch-blocking vulnerability.

---

## ⚡ 3-Minute Quickstart

Run the pre-flight scanner directly on your project root:

```bash
node scripts/launch-sentinel.mjs .
```

The scanner will audit 12 mission-critical vectors, output your **Launch Readiness Score (0–100%)**, and generate a comprehensive `LAUNCH-AUDIT-REPORT.md` remediation roadmap.

To have your AI agent automatically repair every issue, consult our [Customer Tutorial Guide](docs/tutorial-guide.md).

---

## 📦 What's Included in the Box

```
saas-launch-hardening-sentinel/
├── scripts/
│   └── launch-sentinel.mjs        # Standalone zero-dependency Node.js vulnerability scanner CLI
├── skills/
│   └── launch-hardening-sentinel/
│       └── SKILL.md               # Multi-client AI Agent Skill for Antigravity, Claude, Cursor
├── docs/
│   ├── tutorial-guide.md          # 3-minute quickstart, prompt recipes & deep-dive tutorials
│   ├── store-listing.md           # Commercial sales copy & pricing breakdown
│   ├── product-specification.md   # Architectural breakdown of the 12 launch vectors
│   ├── research-dossier.md        # Market research & post-AI vulnerability analysis
│   └── test-results.md            # Verified test execution benchmarks
├── examples/
│   ├── vulnerable-mvp/            # Un-hardened realistic Next.js 15 SaaS (30% readiness score)
│   └── hardened-mvp/              # Fully remediated reference benchmark (100% green pass)
├── tests/
│   ├── skill-structure.test.mjs   # Structural compliance test suite
│   └── sentinel-scanner.test.mjs  # Functional scanner test suite
├── COMPATIBILITY.md               # Environment support matrix (AGY, Claude Code, Cursor, Node)
├── LICENSE.md                     # Commercial EULA (Personal & Client Rights)
└── CHANGELOG.md                   # Semantic version history
```

---

## 🛡️ The 12 Critical Launch Vectors Audited

1. **V-01: Stripe Webhook Signature Verification** — Enforces raw text buffer verification via `stripe.webhooks.constructEvent`.
2. **V-02: Billing Idempotency & Replay Protection** — Prevents duplicate credit provisioning on Stripe retry storms.
3. **V-03: Full Subscription Lifecycle Handling** — Reconciles checkout, renewal, cancellation, and dunning.
4. **V-04: Server-Side Route & Action Auth** — Guarantees session checks on all Next.js Server Actions and API routes.
5. **V-05: Input Schema Validation** — Validates incoming payloads using strict Zod schemas.
6. **V-06: LLM Endpoint Rate Limiting** — Protects costly AI endpoints using Upstash sliding-window limiting.
7. **V-07: Database Connection Pool Singleton** — Eliminates socket exhaustion in serverless Prisma/Drizzle runtimes.
8. **V-08: Secret Leakage Shield** — Prevents server secrets from leaking into client-side build bundles.
9. **V-09: Production CORS Lockdown** — Restricts origin access to verified production domains.
10. **V-10: React Error Boundary & Sentry Hooks** — Eliminates blank white screens on runtime exceptions.
11. **V-11: Environment Isolation & .gitignore** — Protects `.env` files from accidental Git pushes.
12. **V-12: Social Card & Metadata Polish** — Generates complete OpenGraph and Twitter card previews.

---

## 💰 Dual-Currency Pricing (US & India Ready-to-Buy)

| Tier | US & Global (USD) | India (INR via UPI) | Commercial Rights |
| :--- | :---: | :---: | :--- |
| **Solo Developer** | **$69** | **₹1,499** | Unlimited Personal SaaS apps |
| **Agency Pro** | **$149** | **₹3,999** | Client Commercial Deliverables (up to 10 clients) |
| **Agency Unlimited** | **$249** | **₹7,999** | Unlimited Clients + White-Label Reports + GST Invoice |

---

## 📖 Documentation & Guides

- [Customer Tutorial & Prompt Recipes](docs/tutorial-guide.md)
- [Compatibility Matrix](docs/COMPATIBILITY.md)
- [Commercial Store Listing](docs/store-listing.md)
- [Commercial EULA License](docs/LICENSE.md)

---

## ⚖️ License

Commercial End-User License Agreement (EULA). Permitted for personal projects and commercial client deliverables. Raw source file redistribution or resale is prohibited. See [LICENSE.md](LICENSE.md) for full terms.

Copyright © 2026 Deepak Bagada Systems. All rights reserved.
