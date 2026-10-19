# Store listing — Agent Context Architect

**Price:** $49 Solo / $129 Team / $249 Agency
**Format:** instant download, `agent-context-architect-1.0.0.zip`
**Category:** AI developer tooling — agent context engineering

---

## Headline

> **Your agent is not ignoring your rules. It is drowning in them.**
>
> Compile your CLAUDE.md, AGENTS.md, and Cursor rules into one budgeted context system — and gate it in CI so it never drifts again.

**Subhead:** On the included test repo: 1,011 estimated tokens of contradictory rules become a 278-token kernel, four conflict classes disappear, and verification passes. No API key, no account, no network calls.

---

## The problem

If you use an AI coding agent on a real repository, you already have context debt:

- `CLAUDE.md` says npm; `AGENTS.md` says pnpm; the lockfile says pnpm. The agent follows whichever it read last.
- One file says "always use semicolons", another says "never use semicolons". Both load on every request.
- A rule points at `src/server/api.ts` — a file you deleted two months ago.
- Your always-on rules file is now 1,000+ tokens, so it competes with actual code for the context window.
- A teammate adds a third rule file for a new client, and now you maintain four copies of the same five rules.

The usual advice is "write a better CLAUDE.md". That does not scale: better prose still duplicates, still contradicts, and still has no budget or verification.

## The solution

**Agent Context Architect** treats context like code — measured, layered, tested.

1. **Audit** — one command finds oversize files, duplicated rules, contradictions across five families (package manager, quotes, semicolons, indentation, test runner), stale paths, and unenforceable instructions like "write clean code".
2. **Adjudicate** — a fixed evidence hierarchy resolves conflicts: lockfile beats prose, formatter config beats style rules, `package.json` beats Markdown. Genuine business conflicts are reported as `Unresolved`, never guessed.
3. **Compile** — output is four layers: a ≤300-token kernel, a generated repo map, one playbook per real package script, and drift probes. Domain boundaries from your old files are carried forward, not thrown away.
4. **Wire** — pointer-only adapters for Claude Code, Codex/generic agents, and Cursor. Every adapter points at one kernel. Existing files are backed up before replacement.
5. **Verify** — a CI gate checks budgets, manifest freshness, adapter wiring, stale commands, probe coverage, and unresolved conflicts. Exit code 1 blocks the merge.

## What's included

| Item | What it does |
| --- | --- |
| `skills/context-architect/SKILL.md` | Full audit → adjudicate → compile → install → verify pipeline, with failure handling and negative constraints |
| `skills/context-drift-guard/SKILL.md` | Maintenance protocol: drift classes, severity triage, surgical patching, CI wiring, append-only drift log |
| `audit-context.mjs` | Read-only analysis with JSON + Markdown reports and a deterministic finding order |
| `compile-context.mjs` | Budgeted layered output, optional adapters, backups, manifest |
| `verify-context.mjs` | CI gate with machine-readable output |
| `examples/messy-repo/` | A realistic Next.js repo with npm/pnpm, quote, semicolon, and indentation conflicts |
| `examples/expected/` | The exact audit output for that repo (not hand-written) |
| `examples/compiled-example/` | The real compiled system and adapter files |
| `docs/tutorial-guide.md` | 3-minute quickstart, per-client setup, 5 prompt recipes, troubleshooting, FAQ |
| `tests/` | Runnable structural + functional tests |

## Measured results (included fixture)

| Metric | Before | After |
| --- | --- | --- |
| Always-on context | ~1,011 estimated tokens / 3 files | 278 tokens / 1 kernel (596 with all three adapters) |
| Critical findings | 2 (package-manager conflict, oversize context) | 0 |
| High findings | 2 (quote style, semicolon policy) | 0 |
| Stale path references | 1 | 0 |
| Duplicated rules | 4 | 0 |
| CI gate | none | `verify-context.mjs` exit 0 |

Run it yourself in the first two minutes — the commands are in `README.md` and `docs/tutorial-guide.md`.

## Who it's for

- **Solo developers** running Claude Code, Cursor, Codex, or Antigravity on one or more repos.
- **Small teams** where everyone edits the same rules file and it drifts every sprint.
- **Agencies** that onboard client repositories repeatedly and need a repeatable context setup with a CI check.

## Who it's not for

- Teams looking for runtime agent memory, vector search, or a hosted service. This is local, static context tooling.
- Anyone who wants a prompt collection. This is a measurement and restructuring pipeline.
- Repositories with no instruction files at all and no desire to create them.

## Pricing

| Tier | Price | Seats | Includes |
| --- | --- | --- | --- |
| **Solo** | **$49** | 1 developer | Full kit, scripts, fixtures, tutorial, 30-day guarantee |
| **Team** | **$129** | Up to 5 developers | Everything in Solo + team license + drift-guard CI protocol + priority email |
| **Agency** | **$249** | Unlimited | Everything in Team + client-repository use + unlimited repos |

One-time payment. No subscription, no seat metering, no upsell to a hosted plan.

**Why $49:** individual outcome-specific developer skills are listed around $29–$79; list bundles have collapsed to $15–$19. This is a tested tool with fixtures and a CI gate, priced inside the credible band and outside the commodity bin. Pricing evidence and its limits are documented in `docs/research-dossier.md`.

## 30-day money-back guarantee

Run the quickstart on the included fixture. If the commands do not run, or the output does not match the documented results, email support within 30 days for a full refund. No questions, no forms.

## FAQ

**Which AI clients does this support?**
The skill is a plain `SKILL.md` with YAML frontmatter and loads in any agent that reads Markdown instructions. Setup paths are documented for Claude Code, Cursor, Antigravity, and Codex. **Client activation was not behavior-tested during build** — `COMPATIBILITY.md` marks those rows `untested` and explains exactly what that means.

**Does it send my code to a server?**
No. The scripts read and write local files only. There is no network code and no telemetry.

**Are token counts exact?**
No. They are estimates at ~4 characters per token, labeled as estimates everywhere. Use them for budgeting, not billing.

**Will it delete my existing rules?**
No. The audit is read-only. `--install` backs up existing adapters before replacing them. Deleting legacy files requires a separate explicit confirmation, and no script performs deletion.

**My repo is Python/Go/Rust — does it work?**
The audit works. Command detection is JavaScript/TypeScript only, so you will add build/test commands to the kernel manually. This limitation is stated in the README, the spec, and the tutorial.

**What if my rules genuinely conflict and both matter?**
You get an explicit `Unresolved` entry with the evidence for both sides. The tool refuses to invent a compromise. That is a feature: silent compromises are how context debt starts.

**Do I need Node.js?**
Yes — Node 18 or newer. No npm install step, no dependencies.

**Can I use it for client work?**
Yes, on every tier. Only reselling the raw skill files as a competing product is prohibited. See `LICENSE.md`.

**How do updates work?**
Minor versions (1.x) are free for 12 months after purchase through the same download link. The changelog is in `CHANGELOG.md`. Major versions may be a paid upgrade; you will never be forced to upgrade to keep using what you bought.

## Requirements

- Node.js 18+
- macOS, Linux, or Windows (POSIX shell commands in the tutorial; Windows was not tested)
- A repository with `package.json` for automatic command detection
- An AI coding agent that can read Markdown instructions (optional — the scripts work standalone)

## What this product does not claim

- It does not verify ad performance, sales volume, or demand. No paid-ad longevity claim is made; the Ad Library was inaccessible to automated checks (documented in `docs/research-dossier.md`).
- It does not guarantee that any model will follow the kernel. It guarantees the context is budgeted, internally consistent, traceable, and verified by the shipped checks.
- It does not improve your codebase, tests, or architecture.

## Call to action

**Buy Agent Context Architect — $49.** Unzip, run three commands on the included fixture, then point it at your repository. Your next session starts with 278 tokens of truth instead of 1,011 tokens of contradiction.

Support: support@deepakbagada.in · https://deepakbagada.in
