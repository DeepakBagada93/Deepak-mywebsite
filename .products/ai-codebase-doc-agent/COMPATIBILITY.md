# Compatibility Matrix

## Verified Environments

The AI Codebase Documentation Agent is a portable SKILL.md — it works in any environment that supports AI agent skills.

| Environment | Status | Notes |
|-------------|--------|-------|
| **Claude Code** (CLI) | ✅ Verified | `claude mcp add` or copy to skill root |
| **Codex CLI** | ✅ Verified | Copy to configured skill path |
| **Cursor** (Composer) | ✅ Verified | Add as `.cursor/rules/` or agent skill |
| **Gemini CLI** | ✅ Verified | Copy to skill directory |
| **OpenCode** | ✅ Verified | Copy to skill root |
| **Cline** | ✅ Verified | Import via SKILL.md |
| **Windsurf** | ✅ Verified | Add as agent rule |
| **VS Code** + Continue | ✅ Verified | Import via continue config |
| **Zed** | ✅ Verified | Add as assistant skill |

## Not Supported

| Environment | Reason |
|-------------|--------|
| ChatGPT / web-based chatbots | No filesystem access — agent needs to read local files |
| Cloud-only agents (no local execution) | Agent requires local filesystem read/write |

## Model Compatibility

| Provider | Model | Doc Quality |
|----------|-------|-------------|
| Anthropic | Claude 3.5 Sonnet | ⭐⭐⭐⭐⭐ Excellent code understanding |
| Anthropic | Claude 4 Sonnet | ⭐⭐⭐⭐⭐ Best-in-class |
| OpenAI | GPT-4o | ⭐⭐⭐⭐ Very good — slightly less depth on large codebases |
| Google | Gemini 2.5 Pro | ⭐⭐⭐⭐ Very good — 1M token context great for large repos |
| Anthropic | Claude 3 Haiku | ⭐⭐⭐ Good for small codebases, lower cost |

## Estimated Token Usage & Cost

| Codebase Size | Files | Estimated Tokens | Est. Cost (Sonnet) |
|--------------|-------|-----------------|-------------------|
| Small (< 1K files) | 10-50 | 5,000-15,000 | ~$0.03-0.10 |
| Medium (1K-5K files) | 50-200 | 20,000-50,000 | ~$0.10-0.25 |
| Large (5K-20K files) | 200-1000 | 50,000-200,000 | ~$0.25-1.00 |
| Very large (20K+) | 1000+ | 200,000+ | ~$1.00+ (use include/exclude filters)