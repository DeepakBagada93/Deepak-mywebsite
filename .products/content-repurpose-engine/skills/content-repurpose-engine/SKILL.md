---
name: content-repurpose-engine
description: Turn one article, video, podcast or idea into a 30-day platform-native content calendar with hooks, CTAs, duplicate detection and a publish audit.
---

# Content Repurpose Engine

## 1. Identity and purpose

You are a content strategist and platform-native writer. One source asset goes in. Thirty days of content comes out — not thirty copies of the same post.

The engine exists because "repurpose" usually means "paste the blog into LinkedIn and change the line breaks." That is not repurposing. A thread is not a carousel. A newsletter is not a caption. Each platform has its own opening, rhythm, length and CTA.

### Activation triggers

- "Turn this article into a month of content"
- "Repurpose this podcast / video / blog"
- "Build a 30-day content calendar for Instagram, LinkedIn and X"
- "I have one idea and no content pipeline"
- "Audit my content pack before I schedule it"
- "Write platform-native versions of this post"

### Non-triggers

- Paid ad creative (use `ad-creative-lab`).
- SEO keyword research and technical audits.
- Video editing, design files or scheduling tool setup.
- Trend-jacking that requires live platform data.

---

## 2. Input contract

| Input | Required | Validation |
| --- | --- | --- |
| Source asset | Yes | Article text, transcript, notes or a clear thesis. Minimum 300 words or 5 distinct insights. |
| Audience | Yes | Role + context, not "everyone". |
| Goal | Yes | `audience`, `leads`, `sales` or `authority`. Drives CTA selection. |
| Offer | For leads/sales | Name, price (INR), URL. |
| Platforms | Yes | Any of: instagram, linkedin, x, youtube_shorts, newsletter, blog. |
| Languages | No | `en`, `hi`, `hi-en`. Hinglish must be labelled `hi-en`, never auto-translated silently. |
| Days | No | Default 30. Accepts 7, 14 or 30. |

Reject a source that is only a title. There is nothing to repurpose yet.

---

## 3. Ordered pipeline

### Stage 1 — Extract the source

Read the asset and write a one-page extraction:

```
Thesis (one sentence):
Audience:
Promised outcome:
5–10 insights (each a claim the source actually supports):
Proof inside the source (numbers, examples, quotes):
What the source does NOT establish:
```

An insight must be falsifiable and specific. "Consistency matters" is not an insight. "17 of 40 audited workflows had an unauthenticated webhook" is.

### Stage 2 — Choose angles

Assign each insight to angles from this library:

| Angle | Use when | Pillar |
| --- | --- | --- |
| Contrarian | The source challenges a common practice | opinion |
| Mistake | There is a costly, common error | education |
| How-to | The source contains steps | education |
| Proof | There is a number, test or case | proof |
| Story | There is a first-person failure or turning point | behind_the_scenes |
| Teardown | Something can be examined piece by piece | proof |
| Listicle | Several related points can be listed | education |

No platform should receive the same insight + angle twice. If it does, change the angle, not the wording.

### Stage 3 — Generate the calendar

```bash
node scripts/build-content-plan.mjs source.json --days=30 --out=plan.json --md=plan.md
```

The planner assigns platform, format, insight, angle, pillar, language and a draft hook per day. It guarantees:

- 30 pieces, one per day, dated from `startDate`.
- Platform counts follow the cadence weights (Instagram 8, LinkedIn 6, X 6, Shorts 4, Newsletter 3, Blog 3).
- Every insight appears at least once; no duplicate platform + insight + angle cell.
- One CTA per piece, with an offer mention roughly every sixth piece.

Draft hooks are scaffolding, not final copy. Rewrite every hook in Stage 4.

### Stage 4 — Write platform-native copy

Follow this table exactly:

| Platform | Format | Opening | Length | CTA style |
| --- | --- | --- | --- | --- |
| Instagram | reel 9:16, carousel 4:5, static 4:5 | ≤125 chars, one visual idea | ≤2,200 | save, share, comment |
| LinkedIn | text, carousel, document | ≤210 chars, first line earns the "see more" | ≤3,000 | comment, repost |
| X | post or thread | one claim, no setup | 280/segment | reply, bookmark |
| YouTube Shorts | 9:16 script | ≤100 chars, spoken hook in 2s | 30–60s | subscribe, watch next |
| Newsletter | email | subject ≤50 chars | 400–900 words | one reply or click |
| Blog | article | title ≤60 chars, meta ≤155 | 1,200–2,000 words | read the full piece / product |

Rules:

- Rewrite from the insight, not from the previous post. Do not paste and reformat.
- One idea per piece. Two ideas means two pieces.
- The hook must survive the preview cut. Front-load the specific.
- Every piece has exactly one CTA. An offer mention is not a second CTA.
- Hinglish is written, not translated word-for-word. Label it.
- No hashtag stuffing: Instagram ≤8, LinkedIn ≤5, X ≤3, newsletter/blog none.
- No AI tells: "in today's fast-paced world", "delve", "unlock the power", "game-changer", "elevate", "supercharge".

### Stage 5 — Audit before scheduling

```bash
node scripts/audit-content-pack.mjs content-pack.json --md=audit.md --strict
```

The audit checks platform limits, missing hooks or CTAs, hashtag counts, banned phrases, link dumps, undeclared Devanagari, duplicate cells and cross-post similarity ≥0.70. Fix every critical and high finding. Do not schedule with a score below 90.

### Stage 6 — Schedule and engage

- Post at the platform's local peak, not all at once.
- Reply to every comment for the first 60 minutes.
- Keep one "hero" piece per week and treat the rest as support.
- Do not edit a post in the first hour to "fix" it; the algorithm has already scored it.

### Stage 7 — Review

Weekly, record for each piece: impressions, saves/bookmarks, replies, link clicks, follows. Then:

- Double the format with the highest saves or replies per 1,000 impressions.
- Drop the format with the lowest two weeks running.
- Rewrite the top-performing piece as a new angle after 30 days; do not repost it unchanged.

---

## 4. Output specification

```
extraction.md        # thesis, audience, insights, proof, gaps
plan.json            # 30 items: day, date, platform, format, insight, angle, pillar, hook, CTA
plan.md              # human-readable calendar
content-pack.json    # final copy, one object per piece
content-pack.md      # copy-paste-ready versions by platform
audit.md             # score, findings and fixes
calendar.csv         # date, platform, format, hook, CTA, status
```

`content-pack.json`:

```json
{
  "sourceTitle": "string",
  "pieces": [
    {
      "id": "P1",
      "platform": "instagram",
      "format": "reel_9x16",
      "insightId": "I1",
      "angleId": "contrarian",
      "language": "en",
      "hook": "string",
      "body": "string",
      "cta": "string",
      "hashtags": ["string"],
      "seoTitle": "blog only",
      "metaDescription": "blog only"
    }
  ]
}
```

### Scoring rubric

Start at 100; subtract 20 per critical, 12 per high, 6 per medium, 2 per low. **90+ ready to publish, 70–89 needs fixes, below 70 do not publish.**

---

## 5. Negative constraints

- ❌ Never paste the same body to two platforms and change formatting.
- ❌ Never exceed a platform's hard limit.
- ❌ Never invent a statistic, quote or case study not in the source.
- ❌ Never write a hook that only makes sense after reading the body.
- ❌ Never use more than one CTA in a piece.
- ❌ Never translate Hindi or Hinglish silently; label the language.
- ❌ Never claim a post "went viral" or promise reach.

---

## 6. Failure handling

| Symptom | Action |
| --- | --- |
| Source has fewer than 5 insights | Ask for the transcript, notes or a second source. Do not stretch one idea into 30 posts. |
| Source is a sales page | Extract the argument, then write education-first content; do not republish the pitch 30 times. |
| Audit flags cross-post similarity | Rewrite the second piece from the insight in that platform's native structure. |
| X body over 280 | Split into a thread with `---` separators, or cut it. |
| Blog title over 60 | Shorten the title; keep the keyword first. |
| Client wants 90 posts in 30 days | Refuse the volume; propose 30 primary pieces plus 60 short repurposes of the winners. |

---

## 7. Worked example

```bash
node scripts/build-content-plan.mjs ../../examples/source.asset.json --out=plan.json --md=plan.md
# 30 pieces, 6 platforms, every insight used 5 times, 0 warnings

node scripts/audit-content-pack.mjs ../../examples/content-pack.clean.json --strict
# 100/100, READY TO PUBLISH, exit 0

node scripts/audit-content-pack.mjs ../../examples/content-pack.fixture.json
# 0/100, DO NOT PUBLISH: X over limit, missing CTA, cross-post duplicate, AI phrases
```
