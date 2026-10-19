---
name: context-drift-guard
description: Keep a compiled .context system correct over time by detecting drift classes, triaging severity, patching surgically, re-verifying in CI, and appending a machine-readable drift log.
---

# Context Drift Guard

## 1. Identity and purpose

You maintain an existing `.context/` system produced by **Context Architect**. Context rots in predictable ways: scripts get renamed, adapters get hand-edited, budgets creep, new tools appear, and rules contradict each other again.

Your job is to **detect drift, classify it, patch it at the source, and prove the patch**. You are not a rewriter: you never regenerate the whole system to hide a one-line problem, and you never delete a rule to make a check pass.

### Activation triggers

- "My context verification is failing"
- "The agent is following an old command"
- "Check whether our CLAUDE.md drifted"
- "Add a CI gate for our AI context"
- "Update the context after we changed package managers / test runner"
- "Audit the context before a release"

### Preconditions

- `.context/manifest.json` exists. If not, stop and route to `context-architect` (compile mode).
- `package.json` (or language manifest) is readable.
- The user has not asked you to change product behavior — this skill only changes context files.

---

## 2. Drift classes

Classify every observation into exactly one class. The class determines the fix location.

| Class | Signal | Fix location | Auto-fix allowed |
| --- | --- | --- | --- |
| `stale-command` | Kernel command not in `package.json`, or verify reports unknown scripts | `package.json` or kernel facts | No — confirm the real command first |
| `budget-creep` | Layer exceeds its manifest budget | Source rules, then recompile | Only by removing duplicated or unenforceable lines |
| `stale-manifest` | Manifest sizes differ from disk by >10% | Recompile | Yes |
| `adapter-edit` | Adapter contains rules beyond the managed block | Adapter | Yes — restore pointer-only form after moving real rules to the kernel |
| `unmanaged-context` | A legacy rule file over budget still loads | Migrate into kernel, then delete with approval | No |
| `rule-conflict` | Two layers disagree (package manager, quotes, semicolons, indent, test runner) | Kernel or formatter config | No — requires adjudication |
| `probe-failure` | An agent answers a drift probe incorrectly | Kernel clarity, or adapter wiring | No — diagnose before editing |
| `stack-change` | Lockfile, framework, or test runner changed | Kernel facts | Yes — recompile |
| `missing-probe` | Fewer than 5 probes | `drift-probes.md` via recompile | Yes |

Severity: `critical` for `stale-command` and `rule-conflict` (they cause wrong actions), `high` for `unmanaged-context`, `adapter-edit`, `probe-failure`, `medium` for `budget-creep`, `stack-change`, `stale-manifest`, `low` for `missing-probe`.

---

## 3. Ordered pipeline

### Stage 1 — Baseline

```bash
node scripts/verify-context.mjs <repo> --json .context/verify-latest.json
node scripts/audit-context.mjs <repo> --json .context/audit-latest.json
```

Record in the drift report: verification status, exit code, kernel tokens, always-on tokens, number of probes, and `manifest.generatedAt`.

### Stage 2 — Detect

Run all of these; do not stop at the first failure.

1. **Verification** — read every failure line from `verify-latest.json`.
2. **Stack diff** — compare `manifest.stack` against the live stack in `audit-latest.json` (`packageManager`, `frameworks`, `testRunners`, `formatters`).
3. **Adapter inspection** — read each adapter listed in `manifest.adapters`. Any rule outside the managed block is `adapter-edit`.
4. **Legacy sweep** — list context files on disk that are not in `manifest.adapters` or `manifest.sources`. Any file over the kernel budget is `unmanaged-context`.
5. **Probe run** — execute the probes in `drift-probes.md` in a **fresh** session. A pass requires the exact command or fact; a hedge is a fail.

### Stage 3 — Triage

Produce a table sorted by severity:

| # | Class | Severity | Evidence (file:line or command output) | Fix location | Auto-fix |
| --- | --- | --- | --- | --- | --- |

Rules:

- One row per distinct cause, not per symptom. Ten stale commands from one renamed script are one row.
- If evidence cannot be quoted, the row does not exist.
- `critical` rows block the release; say so explicitly.

### Stage 4 — Patch

Apply fixes in this order, smallest first:

1. `stack-change` and `stale-manifest` → recompile, verify. Stop if clean.
2. `adapter-edit` → move any genuine new rule into the kernel, then restore the adapter to pointer-only form.
3. `budget-creep` → remove duplicated, stale, or unenforceable lines from the kernel; recompile; verify.
4. `rule-conflict` → apply the fixed precedence from `context-architect` Stage 2 (lockfile > formatter > script > newest explicit instruction) and record the adjudication.
5. `unmanaged-context` → migrate, verify, then request `Confirm delete` before removing the legacy file.
6. `probe-failure` → rewrite the ambiguous kernel line, recompile, re-run the probe in a fresh session.

Never patch `manifest.json` by hand. Never edit a generated playbook to change a command; change the script it points at.

### Stage 5 — Re-verify and record

```bash
node scripts/verify-context.mjs <repo> --json .context/verify-latest.json
```

Append one JSONL record to `.context/drift-log.jsonl`:

```json
{"at":"<ISO-8601>","class":"rule-conflict","severity":"critical","cause":"npm vs pnpm in legacy adapters","fix":"lockfile wins; kernel now uses pnpm","verified":true,"verifyExit":0,"kernelTokens":278}
```

Rules for the log: one record per fixed cause, `verified` is `true` only when `verifyExit` is 0, and probe results are recorded separately under `"probes":{"passed":n,"failed":n}`. Never log a fix you did not verify.

### Stage 6 — Report

Write `.context/drift-report.md`:

1. `## Status` — PASS / FAIL, with the verify exit code.
2. `## Findings` — the triage table.
3. `## Fixes applied` — file, change, reason.
4. `## Not fixed` — what you refused to guess about, and the decision needed.
5. `## Probe results` — pass/fail per probe.
6. `## Next check` — the date or trigger for the next run.

---

## 4. CI wiring

Recommend a single job. It must fail the build on context drift, not warn:

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
      - name: Verify compiled context
        run: node scripts/verify-context.mjs . --json context-verify.json
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: context-verify
          path: context-verify.json
```

Guidance to give the user:

- Run it on pull requests, not on a schedule; drift enters through edits.
- Keep the scripts inside `skills/context-architect/scripts/` or copy them to `scripts/` once, and reference that path.
- Do not add `continue-on-error`. A warning-only gate is not a gate.
- A red context check is fixed by recompiling and reviewing the diff, not by deleting the job.

---

## 5. Output specification

```
.context/
  drift-report.md     # Stage 6 report
  drift-log.jsonl     # append-only, one record per verified fix
  verify-latest.json  # machine-readable verification
  audit-latest.json   # machine-readable audit
```

---

## 6. Negative constraints

- ❌ Never mark `verified: true` without a zero exit code from `verify-context.mjs`.
- ❌ Never delete a rule, probe, or layer to silence a check.
- ❌ Never hand-edit `manifest.json`, generated playbooks, or adapter rule text.
- ❌ Never run the compile step with `--install` on a repository where the user has not approved adapter replacement.
- ❌ Never claim probe results you did not observe in a fresh session; if you cannot run probes, write `not executed` and say why.
- ❌ Never broaden this skill into product-code changes. Context repair is the entire scope.
