# Compatibility Matrix: AI Code Security Sentinel

**Product Version:** `1.0.0`  
**Verification Date:** `2026-11-03`  

---

## 1. Verified Agent Harnesses & IDE Environments

| Environment | Compatibility Level | Installation Target | Verification Notes |
| :--- | :---: | :--- | :--- |
| **Google Antigravity** | Tier 1 (Native) | `~/.gemini/config/skills/` | Verified with built-in skill discovery & slash commands. |
| **Anthropic Claude Code** | Tier 1 (Native) | `.claude/skills/` or `CLAUDE.md` | Verified via terminal agent tool calls & pre-commit checks. |
| **Cursor IDE (Composer / Chat)** | Tier 1 (Native) | `.cursor/rules/` or `.cursorrules` | Verified with automated rule prompting during code edits. |
| **GitHub Copilot CLI** | Tier 1 (Native) | Root project instructions | Executable via terminal command prompts. |
| **OpenAI Codex / CLI** | Tier 1 (Native) | System instruction prompts | Verified via JSON schema and structured markdown. |

---

## 2. Operating System & Runtime Environments

| Runtime / OS | Supported Versions | Dependencies |
| :--- | :---: | :--- |
| **macOS (Darwin)** | macOS 12+ (Apple Silicon & Intel) | Zero external dependencies (Vanilla Node.js 18+) |
| **Linux (Ubuntu/Debian/Alpine)** | All modern distributions | Zero external dependencies (Vanilla Node.js 18+) |
| **Windows WSL / PowerShell** | Windows 10/11 with Node 18+ | Zero external dependencies |
| **Node.js Engines** | `>= 18.0.0` (Tested on Node v20, v22, v25) | Built-in `node:fs`, `node:path`, `node:crypto` only |

---

## 3. Network & Security Isolation Guarantee

- **Network Requests:** 0 (Scanner never opens sockets or performs HTTP requests).
- **Telemetry:** None.
- **Third-Party Subprocessors:** None.
- **Execution:** 100% deterministic local runtime.
