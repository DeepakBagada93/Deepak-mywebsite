# UGC pack audit — Nara Vitamin C Face Serum

**Score: 38/100 · DO NOT SHIP**

Angles: 6 · video prompts: 30 · image prompts: 24 · checks: 14/38 passed

## Findings

### CRITICAL (7)

- **structure.placeholders** — 1 placeholder string(s) found. _({{INSERT_HOOK}})_
  - Fix: Replace every TODO, {{token}} or [insert] with real content.
- **video.aspect** — Scene A2-S1 is 16:9, not 9:16. _(A2-S1)_
  - Fix: Vertical 9:16 is the delivery format; regenerate this scene.
- **video.character** — Character block missing from scene A1-S2. _(A1-S2)_
  - Fix: Paste the full character block verbatim; do not paraphrase it.
- **image.noText** — Image hook-frame is missing the no-text/no-watermark guard. _(hook-frame)_
  - Fix: Generate clean plates; add copy in the editor.
- **captions.disclosure** — Disclosure missing from 1 caption(s). _(proof)_
  - Fix: Add #ad and the AI-generated disclosure.
- **compliance.bannedClaims** — Blocked claim language: absolute claim (100%), guarantee language. _(claims)_
  - Fix: Rewrite the claim as mechanism language or attach evidence and get human approval.
- **compliance.personalAttributes** — Personal-attribute phrasing found (Meta policy risk). _(claims)_
  - Fix: Describe the product, not the viewer’s body, debt or identity.

### HIGH (13)

- **hooks.length** — Every hook is 3–14 words. _({{INSERT_HOOK}})_
  - Fix: Cut the hook to one idea and 14 words or fewer.
- **scripts.hookWindow** — Hook is not delivered inside 3 seconds in 1 angle(s). _(pain-agitate)_
  - Fix: Move the hook to beat 1, cut it to 12 words, and make sure it ends by 3s.
- **scripts.cta** — Missing a clear CTA in 1 angle(s). _(identity)_
  - Fix: End on one action: tap the link, check the price, see the routine.
- **video.model** — Unknown video model: sora-3. _(A6-S2)_
  - Fix: Use a model listed in the skill (veo-3.1-flow, kling-2.5, runway-gen4, …).
- **video.product** — Product block missing from scene A6-S1. _(A6-S1)_
  - Fix: Paste the full product block verbatim into every prompt.
- **video.grade** — Grade block missing from scene A6-S1. _(A6-S1)_
  - Fix: Use one grade block for the whole campaign.
- **video.negative** — Negative prompt missing from scene A3-S1. _(A3-S1)_
  - Fix: Add the labeled negative prompt line.
- **video.duration** — Scene A4-S3 is 12s (allowed 2–8s). _(A4-S3)_
  - Fix: Split the scene or trim it into the 2–8s window.
- **video.noText** — Scene A6-S1 requests baked-in text or is missing the no-text guard. _(A6-S1)_
  - Fix: Generate a clean plate; add text in the edit.
- **image.model** — Unknown image model: dalle-3. _(hook-frame)_
  - Fix: Use nano-banana-pro, midjourney-v7, flux-1.1-pro or imagen-4.
- **image.grade** — Grade block missing from image product-hero. _(product-hero)_
  - Fix: Use the same grade block as the video.
- **compliance.urgency** — Fake urgency or countdown language found. _(claims)_
  - Fix: Remove countdowns and false scarcity.
- **compliance.price** — Price mismatch: ₹999 vs ₹799. _(price)_
  - Fix: Use one price everywhere; re-check the checkout before publishing.

### MEDIUM (3)

- **video.seed** — Scene A3-S1 has no locked seed. _(A3-S1)_
  - Fix: Lock a positive integer seed per scene.
- **video.length** — Scene A6-S1 prompt is only 9 words. _(A6-S1)_
  - Fix: Restore the full consistency blocks and camera detail.
- **captions.cta** — Missing CTA in 1 Instagram caption(s). _(proof)_
  - Fix: Add one CTA line above the hashtags.

### LOW (1)

- **captions.hashtags** — 1 caption(s) have 0 or more than 5 hashtags. _(proof)_
  - Fix: Use 1–5 specific hashtags instead of a wall of tags.

## All checks

| Check | Weight | Status | Detail |
| --- | ---: | --- | --- |
| structure.meta | 2 | PASS | Brand, product and price are present. |
| structure.platforms | 2 | PASS | At least one publishing platform is declared. |
| structure.angles | 2 | PASS | 6 angles built (minimum 4). |
| structure.tokens | 2 | PASS | All four consistency blocks are present. |
| structure.placeholders | 2 | FAIL | 1 placeholder string(s) found. |
| hooks.length | 4 | FAIL | Every hook is 3–14 words. |
| hooks.signals | 4 | PASS | Every hook carries at least 2 hook signal(s). |
| hooks.unique | 3 | PASS | No two angles open with the same three words. |
| hooks.fluff | 4 | PASS | No fluff language in hooks. |
| scripts.pacing | 4 | PASS | Pacing is at or below 3.5 words/second. |
| scripts.hookWindow | 3 | FAIL | Hook is not delivered inside 3 seconds in 1 angle(s). |
| scripts.cta | 3 | FAIL | Missing a clear CTA in 1 angle(s). |
| scripts.disclosure | 3 | PASS | Every angle carries an AI/paid disclosure. |
| scripts.beats | 2 | PASS | Beat timings are contiguous and match the runtime. |
| video.model | 3 | FAIL | Unknown video model: sora-3. |
| video.aspect | 3 | FAIL | Scene A2-S1 is 16:9, not 9:16. |
| video.character | 4 | FAIL | Character block missing from scene A1-S2. |
| video.product | 3 | FAIL | Product block missing from scene A6-S1. |
| video.grade | 2 | FAIL | Grade block missing from scene A6-S1. |
| video.negative | 2 | FAIL | Negative prompt missing from scene A3-S1. |
| video.seed | 2 | FAIL | Scene A3-S1 has no locked seed. |
| video.duration | 2 | FAIL | Scene A4-S3 is 12s (allowed 2–8s). |
| video.noText | 2 | FAIL | Scene A6-S1 requests baked-in text or is missing the no-text guard. |
| video.length | 2 | FAIL | Scene A6-S1 prompt is only 9 words. |
| image.model | 2 | FAIL | Unknown image model: dalle-3. |
| image.aspect | 2 | PASS | Every image aspect is valid. |
| image.product | 3 | PASS | Product block is verbatim in every image prompt. |
| image.grade | 2 | FAIL | Grade block missing from image product-hero. |
| image.craft | 2 | PASS | Craft block is in every image prompt. |
| image.noText | 4 | FAIL | Image hook-frame is missing the no-text/no-watermark guard. |
| captions.limit | 3 | PASS | Captions are inside every platform limit. |
| captions.cta | 2 | FAIL | Missing CTA in 1 Instagram caption(s). |
| captions.disclosure | 3 | FAIL | Disclosure missing from 1 caption(s). |
| captions.hashtags | 2 | FAIL | 1 caption(s) have 0 or more than 5 hashtags. |
| compliance.bannedClaims | 4 | FAIL | Blocked claim language: absolute claim (100%), guarantee language. |
| compliance.urgency | 2 | FAIL | Fake urgency or countdown language found. |
| compliance.personalAttributes | 2 | FAIL | Personal-attribute phrasing found (Meta policy risk). |
| compliance.price | 2 | FAIL | Price mismatch: ₹999 vs ₹799. |

## What this audit does not do

- It does not verify that the product claims are true. Attach evidence and get human sign-off.
- It does not replace a platform policy review or legal review.
- It does not guarantee performance. It removes the deterministic failure modes before you spend.
