# Measurement plan

Baseline: **2026-10-29** · Re-measure: **2026-11-28**

Baseline, then weekly checks for the first month, then monthly for 90 days.

## KPIs

| KPI | Definition | Target |
| --- | --- | --- |
| Mention rate | Share of tracked prompts where the brand is named | Up and to the right; no fixed guarantee |
| Citation rate | Share of tracked prompts where the official domain is cited | Track the delta, not a single run |
| Share of voice | Brand mentions divided by all brand and competitor mentions | Compare against the two named competitors |
| AI referral sessions | Sessions from ChatGPT, Perplexity, Gemini, Copilot and Claude referrers | Track weekly; expect undercounting |
| Assisted conversions | Conversions where an AI referral or branded-search touch appears in the path | Report as modelled, not causal |

## Sources

- **Google Search Console** — Open the Generative AI performance report and export impressions by page and country. _AI Overviews and AI Mode clicks are not cleanly separable from organic._
- **Bing Webmaster Tools** — Review citation share, cited pages and grounding queries for Microsoft AI experiences. _Citation presence is not traffic share._
- **GA4** — Create a custom channel group for chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com and claude.ai. _Some AI clients strip the referrer; direct traffic may hide AI visits._
- **Manual prompt panel** — Run all 30 prompts three times per engine on the same day and log mention, citation, position and sentiment. _AI answers vary by user, location and model; report a distribution._

## Reporting rules

- Show the baseline and the current run side by side.
- Label every modelled number as modelled.
- Do not claim causality from a visibility change alone.
- Include what did not move and what you could not measure.
