# Compatibility

| Client/platform | Version | Status | Evidence | Notes |
|---|---:|---|---|---|
| Codex-style Markdown skill loader | Not version-pinned | Manually verified format | YAML frontmatter and manual-path instructions inspected | Auto-discovery from arbitrary folders is not asserted. |
| Claude Code | Unknown | Untested | None | Adaptation may be needed for its skill directory/configuration. |
| Gemini CLI | Unknown | Untested | None | Adaptation may be needed for its extension conventions. |

The kit is client-neutral Markdown, but behavior depends on the receiving model and client. Only the included structural checks were automated.
