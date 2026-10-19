# n8n Production Hardening Pack — Customer Guide

From unzip to a verified, hardened workflow in under 10 minutes. The 3-minute quickstart runs on the included fixtures.

---

## 1. What's in your download

```
n8n-hardening-pack/
├── skills/workflow-hardener/
│   ├── SKILL.md
│   └── scripts/{lib,audit-workflow,harden-workflow,verify-workflow}.mjs
├── examples/
│   ├── lead-intake.workflow.json        # unsafe: 12 findings, 21/100
│   ├── orders-sync.workflow.json        # half-hardened: 85/100
│   ├── lead-intake-clean.workflow.json  # hardened reference: 100/100
│   └── expected/                        # real outputs from the scripts
├── tests/workflow-hardener.test.mjs
├── docs/ (this guide, research, spec, listing, test plan/results, release report)
├── COMPATIBILITY.md · CHANGELOG.md · LICENSE.md · README.md
└── product-manifest.json
```

Requirement: Node.js 18+. No n8n instance, account, or network call.

---

## 2. Three-minute quickstart

```bash
cd n8n-hardening-pack

# 1) Audit the unsafe fixture
node skills/workflow-hardener/scripts/audit-workflow.mjs \
  examples/lead-intake.workflow.json --md /tmp/audit.md

# 2) Watch it refuse to touch an inline secret
node skills/workflow-hardener/scripts/harden-workflow.mjs \
  examples/lead-intake.workflow.json --out /tmp/nope.json
# expected: exit 1, "Refusing to harden", nothing written

# 3) Harden the half-hardened workflow
node skills/workflow-hardener/scripts/harden-workflow.mjs \
  examples/orders-sync.workflow.json --out /tmp/orders.hardened.json
# expected: 3 patches, score 85 → 100

# 4) Gate it strictly
node skills/workflow-hardener/scripts/verify-workflow.mjs /tmp/orders.hardened.json --strict
# expected: VERDICT: PASS, exit 0
```

Expected results: step 1 reports **12 findings, score 21/100**; step 3 reports **Fetch Orders: retry**, **Fetch Orders: HTTP timeout**, **Upsert Orders: retry**, and `Score: 85 → 100`; step 4 prints `VERDICT: PASS`.

---

## 3. Install the skill in your client

The pipeline is a plain `SKILL.md`; the scripts run standalone in any terminal. Client activation is **untested** (see `COMPATIBILITY.md`).

### Claude Code

```bash
mkdir -p .claude/skills/workflow-hardener
cp -R /path/to/n8n-hardening-pack/skills/workflow-hardener/* .claude/skills/workflow-hardener/
```

Prompt: `Use workflow-hardener on exports/order-sync.json. Audit only; do not harden yet.`

### Cursor

```bash
mkdir -p .agent/skills
cp -R /path/to/n8n-hardening-pack/skills/workflow-hardener .agent/skills/
```

Prompt: `Follow .agent/skills/workflow-hardener/SKILL.md. Run Stage 1 and 2 and stop.`

### Antigravity

```bash
mkdir -p ~/.gemini/antigravity-cli/skills
cp -R /path/to/n8n-hardening-pack/skills/workflow-hardener ~/.gemini/antigravity-cli/skills/
```

### Codex / other CLI agents

Load `SKILL.md` by path, or run the three scripts directly and paste `SKILL.md` as session instructions. Codex can read the audit JSON without the skill loaded.

---

## 4. Use it on your own workflow

### Step 1 — Export the workflow

In n8n: open the workflow → **⋯ menu → Download**. You get a `.json` file. Do not paste a screenshot; the tool needs `nodes[]`.

### Step 2 — Audit

```bash
node skills/workflow-hardener/scripts/audit-workflow.mjs workflow.json --json audit.json --md audit.md
```

Read `audit.md`. Findings are ordered critical → low.

### Step 3 — Decide

| Bucket | What goes here | Who fixes it |
| --- | --- | --- |
| Auto-fixable | retries, HTTP timeout, execution order, pinned data | The hardener |
| Human decision | error workflow, webhook auth, duplicate guard, disabled nodes | You |
| Blocks everything | inline secrets, embedded credential data | You, before hardening |

### Step 4 — Harden

```bash
node skills/workflow-hardener/scripts/harden-workflow.mjs workflow.json --out workflow.hardened.json
```

If it exits 1 with "Refusing to harden", move the value into an n8n credential, attach it to the node, re-export, and rerun. The tool will not mask the secret for you.

### Step 5 — Verify

```bash
node skills/workflow-hardener/scripts/verify-workflow.mjs workflow.hardened.json --strict
```

Exit 0 is the only pass. Anything else is a manual fix from the report — not a reason to loosen the gate.

### Step 6 — Re-import

Import `workflow.hardened.json` into n8n, reattach credentials, run a manual execution, and only then activate it. **Do not activate a hardened file you have not executed once** — the tool only proves the definition changed, not that the workflow runs.

---

## 5. Prompt recipes

### Recipe 1 — Standard audit

```markdown
Use the workflow-hardener skill at skills/workflow-hardener/SKILL.md.

File: exports/order-sync.json
Mode: audit only. Do not write any file.

Group findings into: safe auto-fix, human decision, blocks-hardening.
For each critical or high finding, give the exact change and the n8n screen it happens on.
```

### Recipe 2 — Deep pre-client review

```markdown
Use workflow-hardener on exports/client-billing.json.

Run the audit, then for every finding tell me:
1. What breaks in production, in one sentence.
2. Whether the hardener can fix it safely.
3. The precise manual fix.

Finish with a go / no-go recommendation for a client production launch.
Do not say "production-ready" if any critical or high finding remains.
```

### Recipe 3 — Express gate

```bash
node skills/workflow-hardener/scripts/verify-workflow.mjs exports/ --strict --json /tmp/verify.json
```

```markdown
Read /tmp/verify.json and list only the blocking findings, grouped by workflow.
```

### Recipe 4 — Batch triage

```markdown
Use workflow-hardener on the whole exports/ folder.

Audit every workflow, then rank them by score ascending.
For the three worst, give me a one-paragraph fix plan each.
Do not modify any file.
```

---

## 6. Put it in CI

```yaml
name: n8n-workflow-check
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node skills/workflow-hardener/scripts/verify-workflow.mjs workflows/ --strict
```

Keep exported workflows in `workflows/` so the gate has something to check. Do not add `continue-on-error`.

---

## 7. Worked example

| Stage | Unsafe fixture | Half-hardened fixture |
| --- | --- | --- |
| Findings | 12 (1 critical, 3 high, 6 medium, 2 low) | 3 (all medium) |
| Score | 21/100 | 85/100 → 100/100 |
| Hardener | Refuses (inline secret) | Applies 3 patches |
| Verify `--strict` | Fails | Passes after hardening |

The unsafe fixture's critical finding is a Bearer token in a header parameter. The hardener refuses until it becomes a credential — which is the correct behavior, because a "hardened" file with a masked key would still contain the key.

---

## 8. Troubleshooting

**"Not an n8n workflow export: missing nodes[]"**
You passed a screenshot, a partial copy, or a different tool's JSON. Export from n8n: ⋯ → Download.

**Hardener exits 1 with "Refusing to harden"**
Inline secrets were found. Create the credential in n8n, reference it from the node, re-export, rerun. This is intentional.

**Score is 100 but the workflow still feels risky**
The score only covers the 12 rule classes. Business logic, rate limits, and data modeling are out of scope.

**Verify fails on a workflow I did not change**
Check whether the export includes pinned data or a disabled node. Both are findings even if you did not edit them.

**“Unreachable node(s)” on a node I use**
The node is not connected to any trigger path. Either connect it or delete it; n8n will never run it as-is.

**The hardened file fails to import**
The tool preserves the node set and schema, but import was not tested in this build. Compare with the original export; if a field was rejected, restore it and re-run the audit.

**My node types are from a community package**
The audit checks structure and common parameters only. Plugin-specific behavior is untested.

---

## 9. FAQ

**Does this execute my workflow?**
No. It parses JSON. Execution and import were not performed in this build.

**Does it store or send my workflow?**
No network code exists in the package.

**Can it fix everything automatically?**
No, and it should not. Four transform classes are automated; credentials, auth, error workflows, and duplicate guards require your decision because a wrong guess changes production behavior.

**Can I use it for client work?**
Yes on all tiers; see `LICENSE.md`.

**What is `--strict`?**
Blocks medium findings too. Use it for client handoff; standard mode blocks only critical and high.

**How do updates work?**
1.x updates are free for 12 months through the same download.

---

## 10. Support

- Email: support@deepakbagada.in
- Include: Node version, command, exit code, and the finding ids from `audit.json`. Never paste live credentials.
- 30-day money-back guarantee: see `docs/store-listing.md`.
