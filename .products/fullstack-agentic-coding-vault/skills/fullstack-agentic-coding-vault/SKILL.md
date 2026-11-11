---
name: fullstack-agentic-coding-vault
description: Commercial AI coding agent guardrail system for Cursor, Claude Code, and Antigravity. Strictly prevents hallucinated imports, unrequested mass refactors, broken Next.js SSR boundaries, and destructive DB migrations.
---

# Full-Stack Agentic Coding Vault

## 1. Operating Contract & Guardrails
When developing or modifying codebases in modern full-stack web environments (Next.js, React, Node.js, TypeScript, PostgreSQL), AI coding agents must strictly adhere to the following 5 Golden Guardrails:

1. **Anti-Hallucination & Scope Bounding:**
   - Never refactor, rename, or reformat files that are outside the explicit user prompt.
   - Never invent NPM packages or third-party APIs. Only use verified dependencies present in `package.json`.

2. **Next.js 14/15 App Router & React Server Components (RSC):**
   - By default, all components are React Server Components unless client state, event listeners (`onClick`), or hooks (`useState`, `useEffect`) are strictly necessary.
   - Never add `'use client'` to the top of an entire page just to satisfy a child button. Push client boundaries down to the leaf node.
   - Always validate server action inputs using Zod or equivalent type schema.

3. **Database Migration & Safety Protocol:**
   - Destructive operations (`DROP TABLE`, `DROP COLUMN`, `ALTER TABLE ... DROP`) are STRICTLY FORBIDDEN unless accompanied by an explicit confirmation token from the user.
   - Always generate dual migrations: up (apply) and down (rollback).

4. **Test-Driven Verification (TDD):**
   - Every bug fix or feature addition must include a runnable unit or integration test before reporting task completion.
   - Verify tests run clean (`npm test` or `node --test`) with zero failures.

5. **Security & Secrets Hygiene:**
   - Never output or commit `.env` values, API tokens, or hardcoded cryptographic keys into source code or test fixtures.
