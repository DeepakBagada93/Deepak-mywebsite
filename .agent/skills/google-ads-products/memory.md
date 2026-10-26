# Google Ads Products — memory

Campaign ledger. Read this before planning; append after every launch and review.

## Account / guardrails

- API version: `v26` (override with `GOOGLE_ADS_API_VERSION`)
- Max budget: ₹3,000 (`GOOGLE_ADS_MAX_BUDGET`)
- Currency: INR only (account currency must match)
- Campaigns are always created `PAUSED`
- Conversion action required before execution
- Search-only; no Display, Search Partners or PMax on test budgets

## Campaigns

| Date | Product | Campaign | Budget | Status | Plan | 7-day result | Decision |
|---|---|---|---:|---|---|---|---|
| 2026-10-19 | n8n Production Hardening Pack | Search-IN-n8n-Hardening-Pack | ₹3,000 / 21 days (₹142/day) | PLANNED — dry run, not created | `runs/campaign-plan-search-in-n8n-hardening-pack-2026-10-19.json` | — | Awaiting API credentials + conversion action |
| 2026-10-19 | n8n Production Hardening Pack | Search-IN-n8n-Hardening-Pack-1500 | ₹1,500 / 10 days (₹150/day) | MANUAL BRIEF — no API needed | `runs/n8n-1500-india-campaign.md` | — | Build in Google Ads UI/Editor from the markdown; projected ~91 clicks / 0.9 sales (setup test) |

## Notes

- The plan projects ~180 clicks and 1.8 sales at a 1.0% CVR and ₹16–₹22 CPC; base-case ROAS 1.5×.
- Break-even CPA at ₹2,499 and 85% margin is ₹2,124.
- Three ad groups: audit/hardening (₹1,050), developers/agencies (₹1,050), templates/workflows (₹882) over 21 days.
- Before launch: configure `.env`, run `account-check.mjs`, confirm the `Purchase` conversion action is ENABLED, then `create-campaign.mjs --execute --confirm=YES`.

## Credentials

- 2026-10-19 — OAuth connected (Desktop client, project `saasnext-kpi`); refresh token saved to `.env` (chmod 600). Customer set to `3279968725`.
- Blocked: developer token is a **TEST token** → `CLOUD_PROJECT_NOT_APPROVED_FOR_PRODUCTION`. It cannot touch production account `3279968725`.
- Next: apply for Basic access in Google Ads → Tools → API Center, or point `GOOGLE_ADS_CUSTOMER_ID` at a Google Ads **test account** to dry-run the full create.
- Security: rotate the web-client secret shared in chat; desktop client secret lives only in `.env`.

- 2026-10-19 — Added no-API markdown path (`build-campaign-md.mjs` + `plan-core.mjs`). ₹1,500 brief generated at `runs/n8n-1500-india-campaign.md` with 27 keywords, 30 RSA headlines, 11 descriptions, negatives and Editor CSV.
