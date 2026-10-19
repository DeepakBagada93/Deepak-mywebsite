# MCP server audit — Ops Server

- Generated: 2026-10-18T10:15:39.503Z
- Tools declared: 2
- Findings: 7 (1 critical, 4 high)
- Score: 38/100 — not-launch-ready

## [CRITICAL] A credential-shaped literal is embedded in source or used as an env fallback.

- Type: `security`
- Fix: Read the value from the environment and fail closed when it is missing.
- Evidence: `server.mjs`

## [HIGH] Server can execute shell or child processes.

- Type: `capability`
- Fix: Remove it, or document the allowlist, require confirmation, and sandbox the call.
- Evidence: `server.mjs`

## [HIGH] No test file found; protocol behavior is unverified.

- Type: `quality`
- Fix: Add a smoke test that initializes the server and lists tools.

## [HIGH] An environment secret is written to logs.

- Type: `security`
- Fix: Log a presence flag, never the value.
- Evidence: `server.mjs`

## [HIGH] Spec has 7 violation(s): name must be kebab-case, at least 3 characters. version must be semver (e.g. 0.1.0). description must be at least 20 characters. …

- Type: `spec`
- Fix: Fix every spec violation before scaffolding or publishing.
- Evidence: `mcp.spec.json`
- Evidence: `mcp.spec.json`
- Evidence: `mcp.spec.json`
- Evidence: `mcp.spec.json`

## [MEDIUM] No README; installers cannot tell what the server does.

- Type: `docs`
- Fix: Document run command, tools, and required environment variables.

## [LOW] Outbound fetch has no visible timeout.

- Type: `reliability`
- Fix: Pass an AbortSignal with a timeout.
- Evidence: `server.mjs`

