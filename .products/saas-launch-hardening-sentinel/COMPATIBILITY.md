# Compatibility Matrix: SaaS Launch Hardening Sentinel

**Version:** 1.0.0  
**Last Verified:** October 2026  

---

## 1. Supported AI Agent Environments

The Sentinel skills and prompt suites have been verified across the following autonomous coding agents:

| Environment | Supported Version | Setup Method | Verification Status |
| :--- | :--- | :--- | :--- |
| **Google Antigravity (AGY)** | 2.0+ | Copy `skills/launch-hardening-sentinel` to `.agent/skills/` | ✅ **Verified** |
| **Anthropic Claude Code** | CLI 1.0+ | Reference in `CLAUDE.md` or invoke in conversation | ✅ **Verified** |
| **Cursor IDE** | 0.40+ | Import into `.cursorrules` or `.cursor/rules/` | ✅ **Verified** |
| **OpenAI CLI / Codex** | CLI / API | System prompt injection | ✅ **Verified** |
| **Windsurf / Cascade** | 1.0+ | Import into `.windsurfrules` | ✅ **Verified** |

---

## 2. Runtime & Engine Compatibility

The deterministic pre-flight scanner (`scripts/launch-sentinel.mjs`) is zero-dependency pure ESM Node.js:

| Runtime | Versions Tested | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | 18.x, 20.x (LTS), 22.x (LTS), 25.x | ✅ **Supported** | Zero external dependencies required |
| **Bun** | 1.0+ | ✅ **Supported** | `bun run scripts/launch-sentinel.mjs` |
| **Deno** | 1.40+ | ✅ **Supported** | `deno run --allow-read --allow-write` |
| **Operating Systems** | macOS (Apple Silicon / Intel), Linux (Ubuntu, Debian, Alpine), Windows (WSL & Powershell) | ✅ **Supported** | Cross-platform path resolution verified |

---

## 3. Web Frameworks & Backend Stacks

| Framework / Tool | Compatibility | Hardening Coverage |
| :--- | :--- | :--- |
| **Next.js 14 / 15 (App Router)** | Full Support | Server Actions, Route Handlers, Metadata, Error Boundaries |
| **Next.js (Pages Router)** | Full Support | `pages/api/` route handlers, CORS, webhook parsing |
| **Remix / React Router v7** | Full Support | Action functions, loader authentication, session cookies |
| **Node.js / Express / Fastify** | Full Support | Express middleware, raw body webhook parsers, rate limiting |
| **Astro / SvelteKit** | Full Support | Endpoint handlers, secret isolation |

---

## 4. Payment & Database Integrations

| Integration | Supported Versions | Hardening Features |
| :--- | :--- | :--- |
| **Stripe API** | 2023-10-16 to latest | Signature verification, raw body buffering, event idempotency, dunning |
| **Supabase** | Client v2.x | Row Level Security (RLS) policies, session verification, anon key shield |
| **Prisma ORM** | v4.x, v5.x | Global connection pool singleton, transaction idempotency |
| **Drizzle ORM** | v0.29+ | Client singleton, connection pooling |
| **Upstash Redis** | `@upstash/ratelimit` v1.x | Sliding-window IP & token rate limiting |
