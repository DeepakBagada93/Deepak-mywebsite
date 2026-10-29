# UGC pack audit — Nara Vitamin C Face Serum

**Score: 100/100 · PASS**

Angles: 6 · video prompts: 30 · image prompts: 24 · checks: 38/38 passed

## Findings

No findings. Every deterministic check passed.

## All checks

| Check | Weight | Status | Detail |
| --- | ---: | --- | --- |
| structure.meta | 2 | PASS | Brand, product and price are present. |
| structure.platforms | 2 | PASS | At least one publishing platform is declared. |
| structure.angles | 2 | PASS | 6 angles built (minimum 4). |
| structure.tokens | 2 | PASS | All four consistency blocks are present. |
| structure.placeholders | 2 | PASS | No placeholders or unreplaced tokens. |
| hooks.length | 4 | PASS | Every hook is 3–14 words. |
| hooks.signals | 4 | PASS | Every hook carries at least 2 hook signal(s). |
| hooks.unique | 3 | PASS | No two angles open with the same three words. |
| hooks.fluff | 4 | PASS | No fluff language in hooks. |
| scripts.pacing | 4 | PASS | Pacing is at or below 3.5 words/second. |
| scripts.hookWindow | 3 | PASS | Hook lands inside the first 3 seconds in every angle. |
| scripts.cta | 3 | PASS | Every angle has one clear CTA. |
| scripts.disclosure | 3 | PASS | Every angle carries an AI/paid disclosure. |
| scripts.beats | 2 | PASS | Beat timings are contiguous and match the runtime. |
| video.model | 3 | PASS | Every scene uses a supported video model. |
| video.aspect | 3 | PASS | Every video scene is 9:16. |
| video.character | 4 | PASS | Character block is verbatim in every scene prompt. |
| video.product | 3 | PASS | Product block is verbatim in every scene prompt. |
| video.grade | 2 | PASS | Grade block is in every scene prompt. |
| video.negative | 2 | PASS | Every scene has a negative prompt. |
| video.seed | 2 | PASS | Every scene has a locked integer seed. |
| video.duration | 2 | PASS | Every scene is between 2 and 8 seconds. |
| video.noText | 2 | PASS | No scene asks the model to bake in text. |
| video.length | 2 | PASS | Every scene prompt is at least 90 words. |
| image.model | 2 | PASS | Every image uses a supported model. |
| image.aspect | 2 | PASS | Every image aspect is valid. |
| image.product | 3 | PASS | Product block is verbatim in every image prompt. |
| image.grade | 2 | PASS | Grade block is in every image prompt. |
| image.craft | 2 | PASS | Craft block is in every image prompt. |
| image.noText | 4 | PASS | Every image prompt forbids baked-in text and watermarks. |
| captions.limit | 3 | PASS | Captions are inside every platform limit. |
| captions.cta | 2 | PASS | Every Instagram caption has a CTA. |
| captions.disclosure | 3 | PASS | Every caption carries the disclosure. |
| captions.hashtags | 2 | PASS | Every caption uses 1–5 hashtags. |
| compliance.bannedClaims | 4 | PASS | No blocked claim language in ad copy. |
| compliance.urgency | 2 | PASS | No fake urgency or countdown language. |
| compliance.personalAttributes | 2 | PASS | No personal-attribute phrasing. |
| compliance.price | 2 | PASS | Every price in the copy matches the brief. |

## What this audit does not do

- It does not verify that the product claims are true. Attach evidence and get human sign-off.
- It does not replace a platform policy review or legal review.
- It does not guarantee performance. It removes the deterministic failure modes before you spend.
