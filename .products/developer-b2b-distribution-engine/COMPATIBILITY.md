# Compatibility Matrix: Developer B2B Distribution Engine

**Version:** 1.0.0  
**Last Verified:** October 2026  

---

## 1. Supported AI Agent Environments

| Environment | Supported Version | Setup Method | Status |
| :--- | :--- | :--- | :--- |
| **Google Antigravity (AGY)** | 2.0+ | Copy `skills/b2b-distribution-engine` to `.agent/skills/` | ✅ **Verified** |
| **Anthropic Claude Code** | CLI 1.0+ | Append to `CLAUDE.md` | ✅ **Verified** |
| **Cursor IDE** | 0.40+ | Import into `.cursorrules` | ✅ **Verified** |
| **OpenAI CLI / Codex** | CLI / API | System context injection | ✅ **Verified** |

---

## 2. Runtime & Engine Compatibility

The intent scraper CLI (`scripts/intent-scraper.mjs`) is zero-dependency pure ESM Node.js:
- **Node.js**: 18.x, 20.x (LTS), 22.x (LTS), 25.x (Tested & verified)
- **Bun**: 1.0+
- **Operating Systems**: macOS, Linux, Windows (WSL/cmd)
