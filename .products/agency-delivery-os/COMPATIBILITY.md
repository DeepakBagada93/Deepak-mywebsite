# Compatibility Matrix — AI Agency Delivery OS 1.0.0

## Tooling

| Environment | Status | Evidence |
| --- | --- | --- |
| Node.js 25.9.0 on macOS | **Verified** | Init, audit, advance, verify executed; functional tests pass |
| Node.js 18 / 20 / 22 | **Untested** | Stable `node:fs` / `node:path` APIs only; no run performed |
| Windows | **Untested** | Paths use `node:path`; tutorial commands are POSIX |

## Workflow

| Item | Status | Notes |
| --- | --- | --- |
| Intake validation | **Verified** | Rejects missing budget, metric, deliverables, exclusions, constraints |
| Six-phase transitions | **Verified** | Full chain asserted in tests; history recorded |
| Placeholder guard | **Verified** | `TBD` blocks advancement and leaves state unchanged |
| Missing-artifact guard | **Verified** | Transition fails without changing state |
| QA metric linkage | **Verified** | Removing the metric from QA gates fails verification |
| CRM / invoicing / e-signature integration | **Not implemented** | Local files only |
| Multi-user concurrency | **Untested** | No locking; one operator per workspace |
| Client-facing portal | **Not implemented** | Deliver HTML/Markdown from the workspace yourself |

## Skill activation

| Client | Status | Notes |
| --- | --- | --- |
| Claude Code | **Untested** | Plain `SKILL.md`; load by path or copy to `.claude/skills/` |
| Cursor | **Untested** | Load by path or place under `.agent/skills/` |
| Antigravity | **Untested** | Copy to the documented skills directory |
| Codex / other CLI agents | **Untested** | Scripts run standalone; `SKILL.md` is plain Markdown |

**Verified** means the command ran and its output was inspected. Everything else is compatible by inspection only.
