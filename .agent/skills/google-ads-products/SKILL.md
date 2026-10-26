---
name: google-ads-products
description: >
  Research, budget and launch Google Search campaigns for digital products through the Google Ads API.
  Uses live KeywordPlanIdeaService research, a ₹3,000 (or custom) budget model with break-even CPA/ROAS math,
  RSA copy and negative-keyword construction, a hard audit gate, and a PAUSED campaign create with spend
  guardrails. Includes an OAuth helper, account preflight, and a 72-hour/7-day performance review loop.
  Never enables a campaign automatically; never spends without conversion tracking.
---

# Google Ads Products (`google-ads-products` v1.0)

Cold-start a profitable Google Search test for a digital product — with research, budget math, an audited plan, and a real Google Ads API create. Built for the ₹3,000 example budget (21 days at ₹142/day), and scales the same model to any budget.

## The quality bar (non-negotiable)

| Rail | Rule |
|---|---|
| **Research before spend** | Keywords come from `KeywordPlanIdeaService` (India geo `2356`, English `1000`) or a labelled research file. No guessed head terms. DIY/informational queries are excluded. |
| **Budget is a system, not a number** | Total → daily → ad-group allocation → max CPC → projected clicks → projected sales → break-even CPA. If the math cannot return the spend, say so before launch. |
| **Every campaign is created PAUSED** | `create-campaign.mjs` refuses any other status. A human reviews the RSA, landing page and conversion action before enabling. |
| **Conversion tracking is mandatory** | No named, ENABLED conversion action → no execution (unless explicitly overridden for a test account). |
| **Hard spend guardrail** | `GOOGLE_ADS_MAX_BUDGET` (default ₹3,000). A plan above it fails the audit and the create. |
| **One currency** | Account currency must equal plan currency. Mismatched currency is a hard stop — micros would be wrong. |
| **Search only** | Google Search. No Display expansion, no Search Partners, no PMax on a test budget. |
| **No duplicate campaigns** | The create checks for an existing campaign with the same name and refuses to duplicate it. |
| **Idempotent state** | Every create writes a payload + state file to `runs/` after each step, so a failed run is inspectable and resumable manually. |
| **Optimize on data, not vibes** | No edits before 72 hours; no CVR verdict before 100 clicks; stop rules are pre-committed. |

## When to use

- "Run Google Ads for my product / SaaS / digital pack"
- "I have ₹3,000 — where do I spend it and what result should I expect?"
- "Research keywords, build the campaign, and create it in Google Ads"
- "Audit my Google Ads plan / lower my CPA / find wasted search terms"
- "Create a Search campaign from this product page"
- "Give me a markdown file with every keyword, headline, description and setting so I can build the campaign by hand"
- "I don't have Google Ads API access — plan it and write it up"

Not for: Meta ads (`paid-ads-studio`), organic keyword strategy (`deepak-blog`), or conversion-tracking implementation.

## Files

```
.agent/skills/google-ads-products/
├── SKILL.md
├── memory.md                      # campaign ledger — append every launch/review
├── examples/
│   ├── n8n-3000-india.json        # ₹3,000 brief for the n8n Hardening Pack
│   ├── n8n-1500-india.json        # ₹1,500 manual-test brief
│   └── keyword-research-india.json# offline research sample
├── references/
│   ├── api-setup.md               # developer token, OAuth, customer IDs
│   └── budget-playbook.md         # ₹1k/3k/5k/10k math + stop rules
├── scripts/
│   ├── oauth-setup.mjs            # one-time refresh token
│   ├── account-check.mjs          # preflight: account, currency, conversions
│   ├── oauth-exchange.mjs         # exchange a pasted redirect URL for a refresh token
│   ├── research-keywords.mjs      # live keyword ideas + bids
│   ├── plan-core.mjs              # shared budget/allocation engine
│   ├── plan-campaign.mjs          # brief + research → campaign plan
│   ├── build-campaign-md.mjs      # brief + research → full manual campaign markdown
│   ├── audit-campaign.mjs         # hard gate before any API write
│   ├── create-campaign.mjs        # PAUSED Search campaign create
│   ├── report-performance.mjs     # spend/CPA/ROAS + recommendations
│   └── lib.mjs                    # API client, env loader, money helpers
└── runs/                          # plans, payloads, state, reports
```

## Two ways to launch

| Path | Needs | Output |
|---|---|---|
| **API** | OAuth + a developer token approved for production (Basic access) | A PAUSED Search campaign created by `create-campaign.mjs` |
| **Manual (no API)** | Nothing beyond the repo | One markdown file from `build-campaign-md.mjs`: research, budget math, campaign settings, ad groups, keywords with match types, RSA headlines + descriptions with character counts, negatives, extensions, conversion tracking, step-by-step build and an Editor CSV |

The manual path is the default when the developer token is a test token or you simply want to review and paste. Both paths use the same `plan-core.mjs` engine, so the budget math and audit rules are identical.

## The mandatory workflow

### Stage 0 — Offer economics (5 minutes)

Do not run ads to "see what happens". Establish:

- **Price** and **gross margin** (digital product: usually 80–95%).
- **Break-even CPA** = price × margin. For the n8n pack: ₹2,499 × 0.85 = **₹2,124**.
- **Landing page** that matches the ad promise and can take payment.
- **Conversion action** (Purchase) that fires on the thank-you page.
- **One sentence promise** the ad can prove.

If the promise is vague ("grow your business"), stop. Rewrite it as a concrete outcome ("12 checks before your n8n workflow goes live").

### Stage 1 — Live keyword research

```bash
node .agent/skills/google-ads-products/scripts/research-keywords.mjs \
  --seeds="n8n workflow audit,n8n security,hire n8n developer,n8n templates" \
  --geo=2356 --language=1000 --min-volume=10 \
  --out=runs/keyword-research-india.json
```

Read the output like a buyer, not a keyword tool:

- **Keep:** audit, security, deploy, monitor, error handling, backup, hire, agency, consultant, expert, template.
- **Drop:** free, jobs, salary, course, tutorial, download, crack, pdf, "what is", "vs", "pricing" (unless you sell a pricing comparison page).
- **Prioritize:** commercial/transactional intent, competition index < 60, top-of-page bid ≤ your max CPC.
- **Group by intent**, not by volume. 3–12 keywords per ad group; phrase or exact match only.
- **Add negatives at campaign level** before launch: free, jobs, salary, course, tutorial, crack, torrent, internship, pdf, "what is n8n", "n8n vs zapier", "n8n pricing", "n8n download".

If the API is not configured yet, use `examples/keyword-research-india.json` for planning, but label it as an estimate and replace it before spending.

### Stage 2 — Budget math (the ₹3,000 example)

The model in `plan-campaign.mjs`:

```
daily budget      = floor(total ÷ days)
ad-group budget   = daily × group score ÷ total score
max CPC           = min(group cap, avg top-of-page bid × 1.1)
clicks            = group spend ÷ max CPC
conversions       = clicks × assumed CVR × close rate
revenue           = conversions × price
break-even CPA    = price × margin
```

For ₹3,000 over 21 days at ₹142/day:

| Line | Value |
|---|---|
| Total / daily / days | ₹3,000 / ₹142 / 21 |
| Max CPC | ₹12–₹22 by ad group |
| Expected clicks | 165–190 (at ₹16–₹20 CPC) |
| Assumed CVR | 1.0% (replace with real data) |
| Expected sales | 1.5–1.9 |
| Revenue at ₹2,499 | ₹3,700–₹4,700 |
| ROAS | 1.2–1.6× |
| Break-even CPA | ₹2,124 |
| Verdict | A **learning test**, not a scale budget. One sale can return the spend; zero sales after 100 clicks means fix the offer, not the bid. |

Budget reality check:

- **₹1,000** — 7 days at ₹142. 50–70 clicks. Only 0.5–0.7 sales. Smoke test, no verdict.
- **₹3,000** — 21 days. 150–190 clicks. 1.5–2 sales. Enough to read CTR/CPC, barely enough for CVR.
- **₹5,000** — 21 days at ₹238. 250–300 clicks. 2.5–3 sales. First usable CVR read.
- **₹10,000** — 30 days at ₹333. 500–600 clicks. 5–6 sales. Enough for a confident scale/stop call.

If the base case ROAS is below 1, the plan is a paid experiment. Say that out loud before launching.

### Stage 3 — Build the plan

Copy the example brief, edit the offer, price, margin, landing page, conversion action and ad groups:

```bash
cp .agent/skills/google-ads-products/examples/n8n-3000-india.json \
   .agent/skills/google-ads-products/runs/my-product-brief.json

node .agent/skills/google-ads-products/scripts/plan-campaign.mjs \
  --brief=.agent/skills/google-ads-products/runs/my-product-brief.json \
  --keywords=.agent/skills/google-ads-products/runs/keyword-research-india.json \
  --budget=3000 --days=21 --price=2499 --margin=0.85 --max-cpc=22
```

For a no-API campaign file (recommended when you will build in the Google Ads UI or Editor):

```bash
node .agent/skills/google-ads-products/scripts/build-campaign-md.mjs \
  --brief=.agent/skills/google-ads-products/examples/n8n-1500-india.json \
  --keywords=.agent/skills/google-ads-products/examples/keyword-research-india.json \
  --out=.agent/skills/google-ads-products/runs/n8n-1500-india-campaign.md
```

The generated file includes every keyword (with match type, volume, bid, intent), the full RSA copy with character counts, negatives, sitelinks/callouts, campaign settings, conversion-tracking steps, a manual build checklist, a Google Ads Editor CSV and the measurement plan. Nothing is created in Google Ads — you paste it.

The plan contains:

- Campaign name, dates, PAUSED status, India geo, English, Search-only.
- Daily and total budget, manual CPC (no automated bidding on a tiny test; Enhanced CPC is deprecated).
- Ad groups with keyword match types, max CPC, RSA headlines/descriptions, final URLs.
- Negative keywords.
- Projected clicks, conversions, sales, revenue, CPA, ROAS, break-even CPA.
- Explicit warnings when the budget cannot produce a verdict.

RSA rules enforced by the audit: 3–15 headlines ≤30 chars, 2–4 descriptions ≤90 chars, no ALL CAPS, no "guaranteed/100%/best/secret", no duplicate keywords, 3–12 keywords per group.

### Stage 4 — Audit (hard gate)

```bash
node .agent/skills/google-ads-products/scripts/audit-campaign.mjs \
  --plan=.agent/skills/google-ads-products/runs/campaign-plan-....json \
  --check-urls
```

The audit fails on: budget above the guardrail, missing conversion action, enabled campaign, non-Search channel, wrong currency, URL failure, RSA length violations, invalid match types, duplicate/DIY keywords, or ad-group allocations that do not sum to the daily budget. **Do not create a campaign with errors.**

### Stage 5 — Preflight and create (PAUSED)

```bash
node .agent/skills/google-ads-products/scripts/account-check.mjs

node .agent/skills/google-ads-products/scripts/create-campaign.mjs \
  --plan=.agent/skills/google-ads-products/runs/campaign-plan-....json \
  --execute --confirm=YES
```

The create:

1. Re-checks the budget guardrail, credentials, account currency and time zone.
2. Refuses a duplicate campaign name.
3. Verifies the named conversion action is ENABLED.
4. Creates the campaign budget.
5. Creates the campaign **PAUSED**.
6. Adds locations, language and negative keywords.
7. Creates ad groups, keywords and responsive search ads.
8. Re-reads the campaign and prints its status and daily budget.
9. Writes `runs/<slug>-payload.json` and `runs/<slug>-state.json`.

Dry run is the default — no API write until `--execute --confirm=YES`.

### Stage 6 — Human launch checklist

Before enabling in Google Ads:

- [ ] Campaign status is PAUSED and the name is correct.
- [ ] Daily budget is ₹142 (or the approved amount), not ₹1,420.
- [ ] India-only location; Search-only; no partners/display.
- [ ] Conversion action fires on a test purchase.
- [ ] Final URLs load in incognito on mobile.
- [ ] Ad copy matches the landing-page promise and price.
- [ ] Negative keywords are attached.
- [ ] Billing is active and the account is not a test account.

Only then enable the campaign. This skill never enables it for you.

### Stage 7 — 72-hour and 7-day review

```bash
node .agent/skills/google-ads-products/scripts/report-performance.mjs \
  --campaign-id=1234567890 --days=3 --target-cpa=2124
```

Rules:

- **0–72 hours:** change nothing. Add negatives only for obvious junk search terms. Check that impressions and clicks are flowing.
- **Day 4–7:** pause keywords with spend ≥ 1.5× target CPA and 0 conversions. Raise bids 15% on keywords with CPA ≤ 0.8× target. Rewrite the RSA if CTR < 1% after 200 impressions.
- **Day 8–14:** shift budget from the worst ad group to the best, keeping the daily total fixed. Keep adding negatives.
- **Day 15–21:** decide — **scale** (CPA below break-even, at least 2 sales), **iterate** (clicks but no sales → offer/landing page), or **stop** (no sales after 100 clicks).
- Never judge CVR before 100 clicks. Never scale a campaign with 0 conversions.

### Stage 8 — Log it

Append to `memory.md`: date, product, campaign name/id, budget, keywords count, plan path, status, 7-day result, decision. Future campaigns start by reading this file.

## API setup (one-time)

See `references/api-setup.md`. Summary:

1. Google Ads → Tools → API Center → developer token.
2. Google Cloud project → enable Google Ads API → OAuth consent screen → Desktop OAuth client.
3. `node .agent/skills/google-ads-products/scripts/oauth-setup.mjs --client-id=... --client-secret=...`
4. Add to `.env`:

```bash
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_LOGIN_CUSTOMER_ID=1234567890
GOOGLE_ADS_API_VERSION=v26
GOOGLE_ADS_CURRENCY=INR
GOOGLE_ADS_MAX_BUDGET=3000
```

5. `node .agent/skills/google-ads-products/scripts/account-check.mjs`

Use a test account or a manager account (MCC) first. The developer token must be approved for production; a test token only works with test accounts.

## Budget guardrails (hard-coded)

- `GOOGLE_ADS_MAX_BUDGET` — default ₹3,000. Plans above it fail audit/create.
- `--execute` requires `--confirm=YES`.
- Campaign status must be `PAUSED`.
- Account currency must equal plan currency.
- Conversion action must exist and be ENABLED.
- Duplicate campaign names are refused.
- Search-only, no display/partners.
- One campaign per plan; no automatic scaling.

## Google Ads policy notes

- No "guaranteed", "100%", "best", "secret", "instantly" claims without proof.
- No ALL CAPS or repeated exclamation marks.
- Price in the ad must match the landing page.
- The landing page must be the product being advertised, not a generic homepage.
- "Free" offers must be genuinely free (no forced payment).
- Do not target trademarked competitor terms without legal review.
- Conversion tracking must respect consent requirements in the target market.

## What this skill does not do

- It does not create conversion actions, billing setups, or payment profiles.
- It does not enable campaigns, scale budgets, or change bids automatically.
- It does not guarantee sales, ROAS, or Google's ad approval.
- It does not run Display, Performance Max, Shopping, or YouTube campaigns.
- It does not replace a human review of the offer, landing page and claims.
