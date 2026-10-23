# Tutorial Guide — Content Repurpose Engine

## 3-minute quickstart

1. Copy `skills/content-repurpose-engine/` into your agent's skills directory.
2. Open a terminal in `skills/content-repurpose-engine/`.
3. Build a calendar from the sample source:

```bash
node scripts/build-content-plan.mjs ../../examples/source.asset.json --days=30 --out=plan.json --md=plan.md
```

You should see 30 pieces, 6 platforms, and `Warnings: None`.

4. Audit the sample pack:

```bash
node scripts/audit-content-pack.mjs ../../examples/content-pack.clean.json --strict
```

You should see `Score: 100/100 · READY TO PUBLISH` and exit code 0.

5. Ask your agent: *"Use Content Repurpose Engine on this article. Build the extraction, then the 30-day plan."*

## Install per client

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -R skills/content-repurpose-engine ~/.claude/skills/
```

Restart Claude Code and confirm with `/skills`.

### Cursor

```bash
mkdir -p .cursor/skills
cp -R skills/content-repurpose-engine .cursor/skills/
```

Add to `.cursorrules`: `For content planning, follow .cursor/skills/content-repurpose-engine/SKILL.md.`

### Codex CLI

```bash
mkdir -p ~/.codex/skills
cp -R skills/content-repurpose-engine ~/.codex/skills/
```

Start a new session and reference the skill by name.

### Google Antigravity

Copy the folder into the project skills directory and attach `SKILL.md` to the agent context. Run scripts from the integrated terminal.

## Your first source file

Create `my-source.json`:

```json
{
  "source": { "title": "My article", "url": "https://example.com/article" },
  "thesis": "One sentence claim the article supports.",
  "audience": "D2C founders in India doing ₹10–50L/month",
  "goal": "leads",
  "currency": "INR",
  "languages": ["en"],
  "startDate": "2026-11-01",
  "days": 30,
  "platforms": ["instagram", "linkedin", "x", "newsletter"],
  "offer": { "name": "My Lead Magnet", "price": 0, "url": "https://example.com/lead" },
  "insights": [
    { "id": "I1", "text": "A specific, falsifiable claim from the source." },
    { "id": "I2", "text": "A second claim with a number or example." },
    { "id": "I3", "text": "A common mistake the source corrects." }
  ]
}
```

Run:

```bash
node scripts/build-content-plan.mjs my-source.json --out=plan.json --md=plan.md
```

Then write the pieces using the plan's angles and rewrite every draft hook.

## Prompt recipes

### Recipe 1 — Full 30-day pipeline

> Load Content Repurpose Engine. Here is my source: [paste or attach]. Audience: [audience]. Goal: [goal]. Build the extraction with 7 insights, choose angles, run the planner for 30 days across Instagram, LinkedIn and X, then write the final copy. Rewrite every hook; do not reuse the draft hooks. Audit the pack and fix every critical and high finding.

### Recipe 2 — One source, five pieces (express)

> Load Content Repurpose Engine. Turn this article into five pieces: one Instagram carousel, one LinkedIn post, one X thread, one newsletter section and one Shorts script. Each must open differently and make a different point. Audit before you show me.

### Recipe 3 — Audit only

> Load Content Repurpose Engine. Audit this content pack. List the five findings that would cost the most reach or trust, give the exact rewrite for each, and tell me which pieces are near-duplicates.

### Recipe 4 — Hinglish adaptation

> Load Content Repurpose Engine. Rewrite these three posts in natural Hinglish for an Indian D2C audience. Label language as hi-en. Keep the numbers and the claims unchanged. Do not translate word-for-word; write how a founder actually talks.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Using the planner's draft hooks as final copy | Rewrite them; they are angle scaffolding |
| Writing all 30 pieces before auditing | Audit in batches of 5 so fixes are cheap |
| Reusing the same insight every week | The planner rotates; check `coverage` |
| Pasting the blog into LinkedIn | Rewrite from the insight, not from the paragraph |
| Adding three CTAs "just in case" | One CTA per piece |
| Scheduling 30 posts in one hour | Spread by platform and peak time |

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `Usage: node build-content-plan.mjs <source.json>` | No file argument | Pass the source path |
| `No supported platforms selected` | Typo in a platform name | Use instagram, linkedin, x, youtube_shorts, newsletter, blog |
| `Warnings: I4 is never used` | Fewer days than insights | Increase days or merge insights |
| Audit score 98 | Usually a low-severity length or SEO field | Fix the listed field |
| `PIECE_CROSS_POST_DUPLICATE` | Same body reused | Rewrite the second piece natively |
| Thread flagged | Segments not separated | Separate with a blank line and `---` |
| Skill not discovered | Folder copied incompletely | Copy the whole directory, not just SKILL.md |

## FAQ

**Is this just a prompt pack?** No. The planner and audit are runnable Node scripts with tests; the prompt orchestrates them.

**Does it post for me?** No. It produces the plan and the copy; you schedule.

**Can it write in Hindi?** It supports `hi` and `hi-en` labels and audits Devanagari copy. The writing quality depends on the model you use; label the language.

**Can I use it for clients?** Yes on Pro and Agency tiers. You may not resell the raw files.

**How many platforms are supported?** Instagram, LinkedIn, X, YouTube Shorts, newsletter and blog.

**Will 30 posts guarantee growth?** No. It guarantees a consistent, native, audited calendar; growth depends on the ideas and the offer.

**What if I only have one insight?** Get more source material. One idea cannot honestly become 30 distinct pieces.
