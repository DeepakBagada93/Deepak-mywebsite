# API to Micro-SaaS Launcher
## Customer Tutorial & Implementation Guide

Welcome to the **API to Micro-SaaS Launcher**! This guide takes you step-by-step through turning any raw Python script, FastAPI service, or Node.js endpoint into a monetized micro-SaaS with Stripe usage-based metered billing.

---

## 1. 3-Minute Quickstart

### Step 1: Run the Standalone Blueprint Generator
Run the generator against your OpenAPI spec or endpoint file:

```bash
node scripts/schema-to-saas.mjs examples/weather-ai-api/openapi-spec.json
```

This immediately synthesizes production-ready API key hashing middleware and Stripe usage-reporting functions.

### Step 2: Activate the AI Agent Skill
Copy `skills/microsaas-launcher/` into `.agent/skills/` (for Antigravity) or append to `CLAUDE.md` / `.cursorrules`.

Prompt your agent:
> *"Act as the API to Micro-SaaS Launcher. Ingest my FastAPI service and generate a full Next.js 15 App Router developer dashboard with API key generation and Stripe metered billing."*

---

## 2. Setting Up Stripe Metered Billing

1. In your **Stripe Dashboard**, navigate to **Products > Add Product**.
2. Under pricing model, select **Recurring > Usage-based billing (Metered)**.
3. Choose your aggregation mode (e.g. "Sum of usage over the month").
4. Copy your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` into `.env.local`.

---

## 3. High-Converting Prompt Recipes

### Recipe 1: Turn FastAPI into Full-Stack Portal
```
Here is my FastAPI backend endpoint code: [insert code].
1. Generate Next.js 15 server routes that proxy requests to this backend.
2. Verify API keys in incoming Bearer tokens using SHA-256 hash lookup.
3. Automatically record 1 usage unit to Stripe upon every 200 HTTP response.
```

### Recipe 2: Interactive Sandbox Component
```
Create a modern Tailwind React client sandbox where developers can paste their API key, configure parameters, and see live JSON responses with copy-paste curl code snippets.
```

---

## 4. Troubleshooting & FAQs

#### Q: Where should API key hashes be stored?
**A:** Store `key_hash` (SHA-256 string) in PostgreSQL or Supabase. Never store raw keys.

#### Q: How do I prevent slow API latency from Stripe calls?
**A:** Never make synchronous Stripe API calls in the critical request-response path. Use asynchronous background promises or push events to an Upstash Redis queue.
