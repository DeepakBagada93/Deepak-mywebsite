# Tutorial Guide — Ad Creative Lab

## 3-minute quickstart

1. Copy `skills/ad-creative-lab/` into your agent's skills directory.
2. Open a terminal in `skills/ad-creative-lab/`.
3. Run the audit on the sample pack:

```bash
node scripts/audit-creative-pack.mjs ../../examples/creative-pack.clean.json --strict
```

You should see `Score: 100/100 · READY TO LAUNCH` and exit code 0.

4. Run the same command on the broken pack:

```bash
node scripts/audit-creative-pack.mjs ../../examples/creative-pack.fixture.json
```

You should see `Score: 8/100 · DO NOT SPEND`, with a critical guarantee finding.

5. Ask your agent: *"Use Ad Creative Lab to audit my current ads and rebuild the pack."*

## Install per client

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -R skills/ad-creative-lab ~/.claude/skills/
```

Restart Claude Code, then type `/skills` to confirm it appears. Invoke with: *"Load ad-creative-lab and audit this pack."*

### Cursor

```bash
mkdir -p .cursor/skills
cp -R skills/ad-creative-lab .cursor/skills/
```

Add to `.cursorrules`: `When the task is paid ads, follow .cursor/skills/ad-creative-lab/SKILL.md.`

### Codex CLI

```bash
mkdir -p ~/.codex/skills
cp -R skills/ad-creative-lab ~/.codex/skills/
```

Start a new session and reference the skill by name.

### Google Antigravity

Copy the folder into your project's skills directory, then attach `SKILL.md` to the agent context. Run the scripts from the integrated terminal.

## Your first real audit

Create `my-pack.json`:

```json
{
  "brand": "Your Brand",
  "product": "Your Product",
  "price": 1499,
  "currency": "INR",
  "landingPage": "https://yourstore.in/products/your-product",
  "platforms": ["meta"],
  "creatives": [
    {
      "id": "M1",
      "platform": "meta",
      "format": "static_4x5",
      "language": "en",
      "hooks": ["Your first line here."],
      "primaryText": "Your primary text.",
      "headline": "Your headline",
      "description": "Your description",
      "cta": "Download"
    }
  ]
}
```

Run:

```bash
node scripts/audit-creative-pack.mjs my-pack.json --md=audit.md --json=audit.json
```

Read findings top-down. Fix every critical and high before touching medium and low.

## Prompt recipes

### Recipe 1 — Full rebuild

> Load the Ad Creative Lab skill. My product is [product] at ₹[price]. The buyer is [buyer] and the promise is [promise]. Here are my current ads: [paste]. Audit them, then rebuild the pack with 6 angles, 30 hooks, 6 static concepts and 3 UGC scripts. Enforce the character limits and India claim rules. Do not invent proof.

### Recipe 2 — Diagnosis only

> Load Ad Creative Lab. Audit this creative pack for claims, limits, hook strength and price consistency. Give me the score, the five findings that cost the most money, and the exact rewrite for each. Do not generate new concepts yet.

### Recipe 3 — Budget a test

> Load Ad Creative Lab. I have ₹30,000 and 21 days for [product] at ₹[price], 90% margin, India only. Build the angle × format test matrix, state break-even CPA and projected ROAS, and tell me whether this budget can produce a readable result.

### Recipe 4 — UGC only

> Load Ad Creative Lab. Write three UGC scripts (15s, 30s, 45s) for [product] using this buyer language: [paste]. Each needs a two-second spoken hook, 3–5 beats, one demo moment, one CTA and a shot list. No claims we cannot prove.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Auditing a screenshot instead of a pack | Transcribe the copy into JSON first; the audit needs exact characters |
| Leaving `price` out of the pack | Price consistency and break-even CPA both need it |
| Fixing only the critical finding | High findings still block a READY verdict |
| Generating 30 hooks before fixing the offer | Fix the promise first; hooks amplify a weak offer |
| Treating projected ROAS as a promise | It is arithmetic from assumed CPC and CVR |

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Usage: node audit-creative-pack.mjs <creative-pack.json>` | No file argument | Pass the JSON path |
| `Invalid JSON` | Trailing comma or smart quotes | Validate the file |
| Score stuck at 76 | Medium findings remain | Fix the visible-text length and weakest hook |
| `Allocation error` from the planner | Budget below the number of cells | Reduce formats or raise budget |
| Scripts not found by the agent | Skill folder not in the skills path | Copy the whole folder, not just SKILL.md |
| Emoji counts look wrong | Audit counts characters, not grapheme clusters | Avoid emoji in headlines |

## FAQ

**Do I need an API key?** No. Everything is local and deterministic.

**Does it post ads for me?** No. It produces the pack and the plan; you upload.

**Will it guarantee approval?** No. It catches common rejection causes; a human still reviews.

**Can I use it for clients?** Yes on Pro and Agency tiers. You may not resell the raw files.

**Does it work for Google Search?** Yes. Supply `platform: "google"` and `format: "search_rsa"`; the 30/90 character limits apply.

**Does it support Hindi or Hinglish?** Yes. Set `language` to `hi` or `hi-en`; the audit checks Devanagari copy is labelled and scans claims in both scripts.

**What if my product has no proof yet?** Write mechanism-led copy ("12 checks") and state that outcome claims are unavailable. Do not invent testimonials.
