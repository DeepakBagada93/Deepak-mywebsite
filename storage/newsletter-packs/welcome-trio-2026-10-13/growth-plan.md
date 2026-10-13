# Growth plan — Welcome Trio (2026-10-13)

Audience: 106 active subscribers (US outreach_us_50_2026, AU/Dubai mcp_60_2026, website). Voice: Deepak Bagada field-notes. Engine: Laravel `newsletter:send` via Brevo SMTP + `Subscriber` model with unsubscribe guard.

## 1. Welcome sequence (first 5 emails)

| # | Email | Content + send command |
|---|---|---|
| 1 | **Welcome + origin story (THIS ISSUE)** | Subject: `Why 80% of AI swarms fail in prod`. Story: 11:40pm $217 burn → 9-day OPA+Pydantic+HITL fix, 87s median. CTA: reply with fallback setup. `php artisan newsletter:send --all-active --niche=agents --region=us --source=welcome_trio_2026 --body-file=storage/newsletter-packs/welcome-trio-2026-10-13/welcome-trio.html --force` |
| 2 | **Best-of / proof issue** | Send 3 days later: Rajkot 1,140 leads → 41 paid Rs 1,16,850 by day 22 + 87s vs 38min. Link trio blogs. Single ask: click the swarm teardown. Source tag `welcome_day3_proof`. |
| 3 | **How to read me** | Send day 6: every Tuesday, 3-min teardown + receipts, reply goes to Deepak directly, one-click unsubscribe in footer. Ask: reply with niche (agents/mcp/rag/web) for segmentation. |
| 4 | **Referral ask (first)** | Send day 10: forward to one founder wrestling with prod agents — what they get (3 teardowns, no fluff). Never pair with another referral ask. Track forwards per 100 opens. |
| 5 | **Personal stake** | Send day 14: why I write from Junagadh on Rs 6K VPS instead of agency retainers, what I am building (governed agent stack for SMEs). Most-forwarded type. Ask: reply with your hardest prod failure. |

Rules: one ask per email. Every email links back to https://deepakbagada.in/journal. Unsubscribed emails are auto-skipped by `NewsletterSendCommand`.

## 2. Referral loop

1. Plug lives in every issue footer (this pack): “Know one founder wrestling with agents in prod? Forward this welcome.”
2. Rewards after 500 subs: 1 referral → MCP schema checklist; 3 referrals → private swarm ledger template (90-day JSONL + OPA policy).
3. Thank public referrers with “forwarded by” shoutout in next issue.
4. Measure weekly: forwards/subscriber. Healthy ≥ 0.5 new subs per 100 opens from forwarding alone. Current base 106 active, 8 unsubscribed — watch unsubscribe rate < 0.5%/issue.

## 3. Cross-promos

- Swap with 2–3 same-audience newsletters (AI agents / MCP tooling, different angle): 1–2 issue swaps/month while <1,000 subs.
- Guest-write 1x/month on bigger AI infra newsletter — bio line → deepakbagada.in/journal.
- Repurpose this issue into X thread + LinkedIn post via x-threads-engagement / linkedin-personal-brand: hook = $217 overnight burn, payoff = 87s fix, link drives signups to `/newsletter/subscribe` (source=welcome_trio).

## 4. Analytics review (day-7/14/30)

| Metric | Healthy | Fix if weak |
|---|---|---|
| Open rate | 35–50% editorial | Subject formula wrong or promise overpromises — test Story tease variant |
| Click rate | >3% (trio links) | CTA unclear or value bullets lack links — trio URLs are in receipts |
| Reply rate | >0.3% (~1 reply per 300 sends) | Ask question in One ask — this issue asks fallback setup directly |
| New subs/issue | Positive trend from forwards | Referral plug + cross-promo cadence |
| Unsubscribe rate | <0.5%/issue (<1 per send at 106) | Promise drift — issue must match subject; 8 prior unsubs were outreach-cold, watch cold segment |

Review day 7 after welcome blast via `newsletter:subscribers --status=active` + Brevo opens. Kill what does not compound; double what does. Next issue tease: “next dispatch: the MCP schema compaction that saved 40% context.”
