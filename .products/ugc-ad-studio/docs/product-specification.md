# Product specification — UGC Ad Studio v1.0.0

Status: READY FOR OWNER APPROVAL · Date: 2026-10-29 · Owner: Deepak Bagada Systems

## 1. Transformation promise

**From** "I have a product and a blank page" **to** "I have six audited ad angles, timed scripts, shot lists, model-ready video and image prompts, an avatar pack, captions and a compliance ledger" in one build.

The customer does not need an API key or a render account to use the pack. They need a brief and a generation tool they already pay for.

## 2. Buyer

| Persona | Core pain | What they buy |
| --- | --- | --- |
| D2C founder | Creative fatigue; no time to write six scripts | A batch they can render this week |
| Performance marketer | Needs angle variance to trust a test | Six distinct angles and a pre-spend audit |
| UGC / creative agency | Delivery is inconsistent between juniors | A repeatable spec with a score |
| SaaS founder | Wants founder-led or avatar ads without a shoot | HeyGen script + video prompt pack |
| Solo creator | Wants to sell ad creative as a service | A productised deliverable |

## 3. Scope

### In scope

- One brief → six angles (UGC or cinematic).
- Hooks, timed scripts, shot lists and creator briefs.
- One copy-paste video prompt per scene, with locked character/product/grade/craft blocks, negative prompt, seed and bridge note.
- Four image prompts per angle plus local edit/inpaint prompts.
- HeyGen avatar script, voice direction, caption config and disclosure.
- Platform captions for Instagram, TikTok and YouTube Shorts.
- Claims sanitisation and a claims ledger.
- Deterministic 38-check audit with score and verdict.
- 15s, 30s and 45s runtimes.
- Six style presets.

### Out of scope

- Rendering the videos or images.
- Calling model APIs.
- Creating or optimising ad campaigns.
- Landing pages.
- Legal review or guarantee of platform approval.
- Verifying that buyer-provided proof is true.
- Buying media or managing budgets.

## 4. Functional requirements

| ID | Requirement | Acceptance |
| --- | --- | --- |
| FR-1 | Accept a JSON brief with brand, product, buyer, pain, promise, price | Builder exits 1 and names missing fields when required input is absent |
| FR-2 | Sanitise blocked claim patterns | Sanitised text contains no blocked pattern; rewrites recorded |
| FR-3 | Build six angles | `meta.angleCount === 6` (or documented unavailability) |
| FR-4 | Produce hooks of 3–14 words with ≥2 signals | Audit `hooks.length` and `hooks.signals` pass |
| FR-5 | Produce timed beats that sum to runtime | Audit `scripts.beats` passes for 15/30/45 |
| FR-6 | Enforce ≤3.5 words/second | Audit `scripts.pacing` passes |
| FR-7 | Deliver hook inside 3s and ≤12 words | Audit `scripts.hookWindow` passes |
| FR-8 | Inject character/product/grade/craft blocks into every prompt | Audit `video.character`, `video.product`, `video.grade`, `image.*` pass |
| FR-9 | Every scene has a negative prompt, positive seed, 2–8s duration and 9:16 aspect | Audit `video.negative`, `video.seed`, `video.duration`, `video.aspect` pass |
| FR-10 | Never request baked-in text | Audit `video.noText` and `image.noText` pass |
| FR-11 | Produce caption text inside platform limits with CTA, disclosure and 1–5 hashtags | Audit `captions.*` passes |
| FR-12 | Flag blocked claims, fake urgency, personal attributes and price mismatch | Audit `compliance.*` passes on a clean pack and fails on the broken pack |
| FR-13 | Produce a Markdown and JSON audit report | `--md=` and `--json=` write valid files |
| FR-14 | Be deterministic | Two builds of the same brief produce byte-identical `campaign.json` |
| FR-15 | Support 15/30/45 and UGC/cinematic variants | Each variant scores 100/100 |
| FR-16 | Reject invalid duration and incomplete brief | Exit 1 with a specific message |
| FR-17 | Work with zero dependencies and no network | Tests pass offline with Node 20+ |

## 5. Non-functional requirements

- **Portability:** plain Markdown + Node ESM; no npm install.
- **Safety:** no secrets, no network, no telemetry, no hidden file access.
- **Determinism:** stable hashing for seeds and hook selection; no `Math.random()`.
- **Readability:** prompts are 90–220 words, plain text, one block per concern.
- **Auditability:** every failed check has an ID, severity, location and fix.
- **Performance:** a full pack builds in under 1 second; audit under 200ms on the sample.
- **Licensing:** commercial EULA; outputs may be sold; raw files may not be resold.

## 6. Output contract

```
campaign.json
prompts-video.md
prompts-image.md
heygen-pack.md
scripts.md
captions.md
compliance.md
README.md
```

`campaign.json` is the single source of truth for the audit. Markdown files are hand-off views generated from it.

## 7. Quality gates

1. Skill frontmatter parses; body contains triggers, inputs, pipeline, outputs and guardrails.
2. All required docs exist: research, spec, tutorial, store listing, test plan, test results, release report.
3. Clean sample scores 100/100, exit 0.
4. Broken sample scores below 60, verdict `DO NOT SHIP`, exit 1, at least 5 critical findings.
5. 15s, 30s, 45s and cinematic variants score 100/100.
6. 18 tests pass.
7. `validate-product.mjs` exits 0.
8. `audit-package.mjs` exits 0; the ZIP contains no `.agent`, secrets, `node_modules` or `dist`.
9. Manifest version matches the ZIP filename.

## 8. Pricing hypothesis

| Tier | Price | Seats | Buyer |
| --- | --- | --- | --- |
| Solo | ₹2,999 | 1 | One brand, one operator |
| Pro | ₹6,999 | 5 | Freelancer or in-house team |
| Agency | ₹14,999 | Unlimited | Client accounts, white-label hand-off |

Launch: ₹1,999 for the first 100 Solo buyers. 30-day money-back guarantee. Prices are a hypothesis; the first 100 sales decide.

## 9. Risks

| Risk | Owner action |
| --- | --- |
| Claims are false even after sanitisation | Human review + evidence in the claims ledger |
| AI presenter presented as a real customer | Follow the HeyGen disclosure guidance; label AI-generated |
| Tool pricing changes | Re-check before quoting in the listing |
| Model deprecation | Prompts are plain text; swap the model in the brief |
| Buyer expects rendered video | Listing states clearly that the pack produces prompts, scripts and specs, not renders |

## 10. Definition of done

The package is done when the release report says `READY FOR OWNER APPROVAL`, the ZIP is audited, the clean sample passes 100/100, the broken sample fails loudly, and every advertised feature has a working artifact and a test or manual evidence.
