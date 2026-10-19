# Agent Context Architect — Customer Guide

This guide takes you from unzipping the package to a verified, budgeted context system in about 10 minutes. The 3-minute quickstart runs on the included fixture so you see the result before touching your own repository.

---

## 1. What's in your download

```
agent-context-architect/
├── skills/
│   ├── context-architect/
│   │   ├── SKILL.md                  # audit → compile → install → verify pipeline
│   │   └── scripts/
│   │       ├── lib.mjs               # shared detection logic
│   │       ├── audit-context.mjs     # read-only analysis
│   │       ├── compile-context.mjs   # writes .context/ (+ optional adapters)
│   │       └── verify-context.mjs    # CI gate
│   └── context-drift-guard/SKILL.md  # maintenance + CI protocol
├── examples/
│   ├── messy-repo/                   # conflicting CLAUDE.md / AGENTS.md / Cursor rules
│   ├── expected/audit-report.{json,md}
│   └── compiled-example/             # real compiler output + adapter files
├── docs/
│   ├── tutorial-guide.md             # this file
│   ├── research-dossier.md           # pricing and demand evidence, with limits
│   ├── product-specification.md      # interfaces and acceptance criteria
│   ├── test-plan.md
│   ├── test-results.md
│   └── store-listing.md
├── tests/                            # runnable structural + functional tests
├── COMPATIBILITY.md                  # what is verified vs untested
├── CHANGELOG.md
├── LICENSE.md
├── README.md
└── product-manifest.json
```

Nothing phones home. No API key, no account, no network call.

---

## 2. Three-minute quickstart (fixture)

**Requirement:** Node.js 18 or newer. Check with `node --version`.

From the folder that contains this guide's parent directory:

```bash
cd agent-context-architect

# 1) Audit the messy fixture (read-only)
node skills/context-architect/scripts/audit-context.mjs examples/messy-repo --md /tmp/audit.md

# 2) Copy the fixture so the bundled example stays untouched
cp -R examples/messy-repo /tmp/context-demo

# 3) Compile and install pointer-only adapters
node skills/context-architect/scripts/compile-context.mjs /tmp/context-demo \
  --out /tmp/context-demo/.context --install

# 4) Verify
node skills/context-architect/scripts/verify-context.mjs /tmp/context-demo

# 5) Read the kernel
cat /tmp/context-demo/.context/kernel.md
```

What you should see:

- Step 1: `11 finding(s)`, score `15/100`, including a **critical** npm-vs-pnpm conflict and a **critical** 815-token `CLAUDE.md`.
- Step 3: `kernel ~278 tokens`, `Budget check: PASS`, adapters installed, originals backed up.
- Step 4: `Context verification: PASS`, exit code 0.
- Step 5: one small kernel with real commands (`pnpm run build`), real facts, and boundaries carried over from the legacy files.

That last point is the product: the compiler did **not** invent a new style. It took the lockfile as authority, deleted style rules because Prettier exists, and carried forward domain boundaries like "do not modify the database schema without a migration".

---

## 3. Install the skill in your client

The skill is a plain `SKILL.md` with YAML frontmatter. Every client below can load it; only the path differs. **Client activation was not behavior-tested during build** — see `COMPATIBILITY.md`.

### Claude Code

```bash
mkdir -p .claude/skills/context-architect
cp -R /path/to/agent-context-architect/skills/context-architect/* .claude/skills/context-architect/
```

Then in Claude Code, ask: `Use the context-architect skill on this repository. Start with an audit only.`

If auto-discovery does not pick it up, load it explicitly:

```
Read .claude/skills/context-architect/SKILL.md and follow it exactly. Audit this repository first.
```

### Cursor / VS Code Composer

```bash
mkdir -p .agent/skills
cp -R /path/to/agent-context-architect/skills/context-architect .agent/skills/
```

Composer prompt:

```
Use the skill at .agent/skills/context-architect/SKILL.md.
Run Stage 1 and Stage 2 only. Do not write files yet.
```

Cursor's own project rules live in `.cursor/rules/`. The compiler writes `000-context.mdc` there when you pass `--install`.

### Google Antigravity

```bash
mkdir -p ~/.gemini/antigravity-cli/skills
cp -R /path/to/agent-context-architect/skills/context-architect ~/.gemini/antigravity-cli/skills/
```

Or keep it inside the workspace under `.agent/skills/`. Ask: `Confirm context-architect is loaded, then audit this repo.`

### OpenAI Codex / CLI agents

Codex reads repository instructions from `AGENTS.md`. Two options:

1. Load the skill by path in the session: `Follow skills/context-architect/SKILL.md.`
2. Run the scripts yourself and paste `SKILL.md` as system instructions for the session.

The compiler's `--install` writes an `AGENTS.md` adapter that points at `.context/kernel.md`, so Codex sessions start from the small kernel instead of a wall of rules.

---

## 4. Run it on your repository

### Step 1 — Audit only (safe)

```bash
node skills/context-architect/scripts/audit-context.mjs . \
  --json .context/audit.json --md .context/audit.md
```

This writes nothing outside `.context/`. Read `audit.md`. The score is a rough health signal, not a grade:

| Score | Verdict | Meaning |
| --- | --- | --- |
| 80–100 | `ready` | Small, consistent, no critical conflicts |
| 60–79 | `needs-cleanup` | Fixable duplication or budget creep |
| 0–59 | `needs-rework` | Conflicting instructions or an oversize file |

### Step 2 — Compile

```bash
node skills/context-architect/scripts/compile-context.mjs . --out .context
```

Output:

- `.context/kernel.md` — always-on rules and commands, trimmed to the budget
- `.context/repo-map.md` — generated path map
- `.context/playbooks/*.md` — one file per real package script
- `.context/drift-probes.md` — at least 5 questions with expected answers
- `.context/manifest.json` — sizes, budgets, sources

Read the kernel before continuing. If a carried-forward boundary is wrong for your team, edit the kernel **and** re-run the compiler (or update the manifest sizes), then verify.

### Step 3 — Install adapters (optional, replaces files)

```bash
node skills/context-architect/scripts/compile-context.mjs . --out .context --install
```

This writes:

| File | Purpose |
| --- | --- |
| `CLAUDE.md` | Pointer-only adapter for Claude Code |
| `AGENTS.md` | Pointer-only adapter for Codex and generic agents |
| `.cursor/rules/000-context.mdc` | Always-apply Cursor rule pointing at the kernel |

If any of those files already exist **without** a `context-architect:managed` marker, the original is copied to `.context/backup/` first. The new adapter contains no rules — only a pointer and the canonical package manager.

### Step 4 — Verify

```bash
node skills/context-architect/scripts/verify-context.mjs .
```

Exit code 0 means: every layer is within budget, the manifest is fresh, adapters point at the kernel, kernel commands exist in `package.json`, at least 5 probes exist, and no critical conflict remains.

If you skipped Step 3, verification will fail with `Unmanaged legacy context CLAUDE.md still loads ~815 tokens`. That is intentional: a new kernel sitting next to the old rules file is not a working context system, because the agent still loads both. Install the adapters (Step 3) or delete the legacy file (Step 5), then re-verify.

### Step 5 — Clean up legacy files (only after verification)

Delete the old rules files **only** when their content is fully represented in the kernel, and only after the agent passes the drift probes. The skill requires you to type `Confirm delete`; the scripts never delete anything themselves.

Keep `.context/backup/` until you are satisfied.

---

## 5. Prompt recipes

### Recipe 1 — Standard audit + compile

```markdown
Use the context-architect skill at skills/context-architect/SKILL.md.

Repository: this project.
Mode: compile (no adapter installation).
Budget: kernel 300, repoMap 800, playbook 400.

Run Stages 1–3 and 5–6. Show me the adjudication table before writing the handoff.
Do not invent any command that is not in package.json.
```

### Recipe 2 — Deep conflict audit (no writes)

```markdown
Use the context-architect skill.

Mode: audit only. Do not write or modify any file.
Run audit-context.mjs with --json and --md, then explain every critical and high finding
with the file and line that proves it.

For each conflict, state the evidence precedence you would apply (lockfile > formatter >
package script > newest confirmed instruction) and what you would need from me to resolve it.
Mark anything you cannot decide as Unresolved. Do not guess.
```

### Recipe 3 — Express: one-command health check

```markdown
Run this and summarize it in five lines:

node skills/context-architect/scripts/verify-context.mjs . --json /tmp/ctx.json
```

If it fails, paste the failing lines and ask for the smallest fix — not a full rewrite.

### Recipe 4 — Migration with adapters

```markdown
Use the context-architect skill in migrate mode.

1. Audit the repo.
2. Show me the adjudications.
3. Compile to .context and install adapters for Claude Code and Cursor only.
4. Verify.
5. List every file you replaced and where the backup is.
Do not delete any legacy file; I will confirm separately.
```

### Recipe 5 — Multi-client setup

```markdown
Use the context-architect skill.

I use Claude Code and Codex. Compile one kernel and two adapters (CLAUDE.md, AGENTS.md).
After installing, run the drift probes against the kernel and show me a pass/fail table.
If any probe fails, fix the kernel, not the probe.
```

---

## 6. Put it in CI

Add one job that fails the build when context drifts:

```yaml
name: context-check
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node skills/context-architect/scripts/verify-context.mjs . --json context-verify.json
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: context-verify
          path: context-verify.json
```

Do not add `continue-on-error`. A warning-only gate is not a gate.

---

## 7. Worked example: what changes on a real repo

Fixture: `examples/messy-repo` — Next.js, `CLAUDE.md` 815 tokens, `AGENTS.md` 143, one Cursor rule 53.

| Finding | Before | After |
| --- | --- | --- |
| Package manager | npm in `CLAUDE.md`, pnpm in `AGENTS.md`, pnpm lockfile | pnpm, once, in the kernel |
| Quote style | double quotes vs single quotes | removed; Prettier owns it |
| Semicolons | always vs never | removed; Prettier owns it |
| Indentation | 2 spaces vs tabs | removed; Prettier owns it |
| Stale reference | `src/server/api.ts` does not exist | dropped |
| Duplicated rules | 4 lines repeated across files | single kernel entries |
| Unenforceable rules | 7 ("write clean code", "as needed") | replaced with boundaries or dropped |
| Domain boundaries | buried in 815 tokens | carried forward into the kernel |
| Always-on tokens | ~1,011 across 3 files | 278 in the kernel (596 with all three adapters) |

The full before/after artifacts are in `examples/expected/` and `examples/compiled-example/`.

---

## 8. Troubleshooting

### The agent says it cannot find the skill

Load `SKILL.md` by path in the prompt. Auto-discovery varies by client and version; the path always works.

### `compile-context.mjs` exits 1 with a kernel budget error

Your repo exposes more facts than 300 tokens allow. Create `budget.json`:

```json
{ "kernel": 400, "repoMap": 800, "playbook": 400, "adapter": 120, "total": 1200 }
```

```bash
node skills/context-architect/scripts/compile-context.mjs . --out .context --budget budget.json
```

Raising the budget is a trade-off, not a fix: every extra kernel token is paid on every request.

### `verify-context.mjs` says the manifest is stale

Re-run the compiler. Never edit `manifest.json` by hand — the sizes are recomputed from disk.

### `verify-context.mjs` lists unknown scripts

The kernel names a script that `package.json` no longer defines. Rename it in the source of truth (the script or the kernel fact) and recompile.

### The agent still ignores the kernel

Run the drift probes in a **fresh** session. If it cannot answer "which package manager is canonical", the adapter is not loading. Fix the path first; do not add more rules.

### `--install` replaced my `CLAUDE.md` and I want it back

Originals are in `.context/backup/CLAUDE.md` and `.context/backup/AGENTS.md`. Copy them back and re-run the compiler without `--install`.

### Token counts look lower than my provider's meter

They are estimates at ~4 characters per token. Provider tokenizers differ, especially for code. Use the estimate for budgeting, not billing.

### My repo is Python / Go / Rust

The audit works. The compiler will not detect build commands; add them to the kernel manually and set `packageManager` expectations accordingly. Treat Stage 3 as semi-manual.

### I hit my model's context limit mid-pipeline

Run the scripts directly in the terminal, then ask the agent to interpret one artifact at a time. The pipeline is designed so each stage has a file artifact — you never need the whole stream in context.

---

## 9. FAQ

**Does this send my code anywhere?**
No. The scripts only read and write local files. There is no network code in the package.

**Will it delete my rules?**
Not on its own. The audit is read-only, the compiler only writes `.context/` and (with `--install`) the three adapter paths, and deletion requires a separate explicit confirmation that no script performs.

**Can I use it on client repositories?**
Yes. All tiers include client work; see `LICENSE.md`. Only reselling the raw skill files is prohibited.

**Does it work with multiple AI clients at once?**
One kernel, multiple adapters. That is the point of the pointer-only design: `CLAUDE.md`, `AGENTS.md`, and `000-context.mdc` all reference the same `.context/kernel.md`.

**What if two rules genuinely conflict and both matter?**
The tool reports them as `Unresolved` and stops. Business rules are yours to decide; invented compromises are worse than an explicit open question.

**Is the score a quality rating of my project?**
No. It is a context-health signal. A well-run project with a 1,200-token `CLAUDE.md` will score badly, correctly, because the cost is real.

**Do I need to keep `.context/` in version control?**
Recommended. It is small, reviewable, and the CI gate depends on it. Commit `.context/kernel.md`, `repo-map.md`, playbooks, probes, and `manifest.json`. Backups can stay local.

---

## 10. Support

- Email: support@deepakbagada.in
- Website: https://deepakbagada.in
- Include: your Node version, the command you ran, the exit code, and the relevant lines from `audit.json` or `verify.json`. Never paste secrets or full private source files.

30-day money-back guarantee: see `docs/store-listing.md`.
