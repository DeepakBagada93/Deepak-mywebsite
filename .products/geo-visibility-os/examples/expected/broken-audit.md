# GEO pack audit — Unknown brand

**Score: 3/100 · DO NOT SHIP**

Prompts: 0 · briefs: 6 · roadmap: 0 · checks: 1/40 passed

## Class weights

| Class | Weight |
| --- | ---: |
| structure | 8 |
| crawl | 16 |
| entity | 14 |
| content | 18 |
| citation | 12 |
| prompt | 12 |
| measurement | 10 |
| delivery | 10 |

## Findings

### CRITICAL (5)

- **structure.identity** — Brand, domain and market are present.
  - Fix: Add brand, domain and market to the brief.
- **structure.placeholders** — No placeholders or unreplaced tokens.
  - Fix: Replace every template token with a real value.
- **citation.ethics** — The citation plan rejects fake reviews, paid placement and spam.
  - Fix: Remove manipulative tactics and add disclosure rules.
- **delivery.report** — A white-label report with limits is present.
  - Fix: Generate the client report with a prepared-for block and a limits section.
- **delivery.limits** — The delivery states the limits and the no-guarantee rule.
  - Fix: Add the audit limits and a no-guarantee statement.

### HIGH (21)

- **structure.competitors** — At least two competitors are named.
  - Fix: Add two real competitors so comparison prompts are meaningful.
- **structure.platforms** — At least four AI platforms are covered.
  - Fix: Add ChatGPT, Perplexity, Google AI, Gemini, Copilot or Claude.
- **crawl.robots** — robots.txt is present.
  - Fix: Publish robots.txt and allow the AI search agents you want.
- **crawl.chatgptUser** — ChatGPT-User is allowed at the root.
  - Fix: Allow ChatGPT-User for user-initiated retrieval without enabling model training.
- **crawl.oaiSearch** — OAI-SearchBot is allowed at the root.
  - Fix: Allow OAI-SearchBot separately from GPTBot; blocking training does not have to block search.
- **crawl.perplexity** — PerplexityBot is allowed at the root.
  - Fix: Allow PerplexityBot if Perplexity matters for the category.
- **crawl.claude** — Claude-SearchBot is allowed at the root.
  - Fix: Allow Claude-SearchBot for Claude retrieval; ClaudeBot is a separate training decision.
- **crawl.renderable** — Critical content is present in the HTML.
  - Fix: Server-render the main copy; several AI fetchers do not execute JavaScript.
- **entity.organizationSchema** — Organization schema is present.
  - Fix: Add Organization JSON-LD with name, url, description, areaServed and sameAs.
- **entity.serviceSchema** — A Service, Product or business schema is present.
  - Fix: Add Service or Product JSON-LD that matches the visible offer.
- **entity.consistency** — Brand name and service description are consistent across the pack.
  - Fix: Use one brand name, one service description and one service area everywhere.
- **content.answerFirst** — Most priority pages have a 40+ word answer-first summary.
  - Fix: Add a 40–60 word answer under the H1 on every priority page.
- **content.evidence** — Pages carry dated evidence and every brief names its evidence.
  - Fix: Add one dated, verifiable fact per page and keep the evidence list in every brief.
- **citation.sourceMap** — The citation plan covers at least eight source types with actions.
  - Fix: Build a source map with a concrete action per source type.
- **prompt.funnel** — The prompt panel covers at least four funnel stages.
  - Fix: Add awareness, comparison, decision and objection prompts.
- **prompt.mix** — The panel mixes branded, non-branded and competitor prompts.
  - Fix: Add branded, non-branded and at least one competitor prompt.
- **prompt.coverage** — Every prompt is assigned to a platform and at least four platforms are covered.
  - Fix: Assign each prompt to a platform and cover the four engines that matter.
- **prompt.testPlan** — The panel has 30+ prompts, each with runs and a success signal.
  - Fix: Add 30 prompts, three runs each, and define what success means.
- **measurement.cadence** — Baseline, re-measure date and cadence are defined.
  - Fix: Set a baseline date, a 30-day re-measure and a reporting cadence.
- **measurement.honesty** — The measurement plan states variance and attribution limits.
  - Fix: Add the variance, undercount and modelled-number limits.
- **delivery.roadmap** — The roadmap has 20+ owned actions with verification.
  - Fix: Add a prioritized roadmap with owner, effort and verification.

### MEDIUM (13)

- **crawl.siteBasics** — At least three pages are scanned and canonicals are present where needed.
  - Fix: Add self-referencing canonicals and scan at least three priority pages.
- **crawl.sitemap** — An XML sitemap is present.
  - Fix: Publish a sitemap with canonical URLs and accurate lastmod dates.
- **entity.structuredData** — FAQPage and BreadcrumbList schema are present.
  - Fix: Add FAQPage and BreadcrumbList after the visible content exists.
- **entity.sameAs** — sameAs profile links are present.
  - Fix: Add verified sameAs links to profiles and directories.
- **entity.author** — A named author or reviewer is present.
  - Fix: Add a visible byline and credentials, and keep the schema author consistent.
- **content.questionHeadings** — At least half the pages use two question-form headings.
  - Fix: Rewrite two H2s per priority page as buyer questions.
- **content.depth** — Priority pages have at least 400 words.
  - Fix: Expand thin pages to cover the decision, cost, risks and next step.
- **content.maintenance** — Freshness, internal links and image alt coverage are present.
  - Fix: Show an updated date, add three contextual internal links and write useful alt text.
- **citation.thirdParty** — Review and community sources are included.
  - Fix: Add the review platforms and communities buyers actually use.
- **citation.pr** — Earned media and expert sources are included.
  - Fix: Add publications, podcasts or associations where an expert contribution is credible.
- **measurement.gsc** — Search Console generative AI reporting is in the plan.
  - Fix: Add the GSC generative AI performance report to the measurement plan.
- **measurement.analytics** — Bing citation share and GA4 AI referrals are in the plan.
  - Fix: Add Bing Webmaster Tools and a GA4 AI referral segment.
- **delivery.schemaInstall** — Schema install instructions are present.
  - Fix: Add placement and validation instructions for every schema block.

## All checks

| Check | Class | Weight | Status | Detail |
| --- | --- | ---: | --- | --- |
| structure.identity | structure | 3 | FAIL | Brand, domain and market are present. |
| structure.competitors | structure | 2 | FAIL | At least two competitors are named. |
| structure.platforms | structure | 2 | FAIL | At least four AI platforms are covered. |
| structure.placeholders | structure | 1 | FAIL | No placeholders or unreplaced tokens. |
| crawl.robots | crawl | 2 | FAIL | robots.txt is present. |
| crawl.chatgptUser | crawl | 2 | FAIL | ChatGPT-User is allowed at the root. |
| crawl.oaiSearch | crawl | 2 | FAIL | OAI-SearchBot is allowed at the root. |
| crawl.perplexity | crawl | 2 | FAIL | PerplexityBot is allowed at the root. |
| crawl.claude | crawl | 2 | FAIL | Claude-SearchBot is allowed at the root. |
| crawl.renderable | crawl | 2 | FAIL | Critical content is present in the HTML. |
| crawl.siteBasics | crawl | 2 | FAIL | At least three pages are scanned and canonicals are present where needed. |
| crawl.sitemap | crawl | 2 | FAIL | An XML sitemap is present. |
| entity.organizationSchema | entity | 3 | FAIL | Organization schema is present. |
| entity.serviceSchema | entity | 3 | FAIL | A Service, Product or business schema is present. |
| entity.structuredData | entity | 2 | FAIL | FAQPage and BreadcrumbList schema are present. |
| entity.sameAs | entity | 2 | FAIL | sameAs profile links are present. |
| entity.consistency | entity | 2 | FAIL | Brand name and service description are consistent across the pack. |
| entity.author | entity | 2 | FAIL | A named author or reviewer is present. |
| content.answerFirst | content | 3 | FAIL | Most priority pages have a 40+ word answer-first summary. |
| content.questionHeadings | content | 3 | FAIL | At least half the pages use two question-form headings. |
| content.depth | content | 3 | FAIL | Priority pages have at least 400 words. |
| content.evidence | content | 3 | FAIL | Pages carry dated evidence and every brief names its evidence. |
| content.comparison | content | 3 | PASS | A comparison page or table is planned. |
| content.maintenance | content | 3 | FAIL | Freshness, internal links and image alt coverage are present. |
| citation.sourceMap | citation | 4 | FAIL | The citation plan covers at least eight source types with actions. |
| citation.thirdParty | citation | 3 | FAIL | Review and community sources are included. |
| citation.pr | citation | 2 | FAIL | Earned media and expert sources are included. |
| citation.ethics | citation | 3 | FAIL | The citation plan rejects fake reviews, paid placement and spam. |
| prompt.funnel | prompt | 3 | FAIL | The prompt panel covers at least four funnel stages. |
| prompt.mix | prompt | 3 | FAIL | The panel mixes branded, non-branded and competitor prompts. |
| prompt.coverage | prompt | 3 | FAIL | Every prompt is assigned to a platform and at least four platforms are covered. |
| prompt.testPlan | prompt | 3 | FAIL | The panel has 30+ prompts, each with runs and a success signal. |
| measurement.gsc | measurement | 3 | FAIL | Search Console generative AI reporting is in the plan. |
| measurement.analytics | measurement | 2 | FAIL | Bing citation share and GA4 AI referrals are in the plan. |
| measurement.cadence | measurement | 3 | FAIL | Baseline, re-measure date and cadence are defined. |
| measurement.honesty | measurement | 2 | FAIL | The measurement plan states variance and attribution limits. |
| delivery.report | delivery | 3 | FAIL | A white-label report with limits is present. |
| delivery.roadmap | delivery | 3 | FAIL | The roadmap has 20+ owned actions with verification. |
| delivery.schemaInstall | delivery | 2 | FAIL | Schema install instructions are present. |
| delivery.limits | delivery | 2 | FAIL | The delivery states the limits and the no-guarantee rule. |

## What this audit does not do

- It does not verify that the business claims are true. Attach evidence and get human sign-off.
- It does not query live AI engines or predict citations, rankings or revenue.
- It does not replace a platform policy review or legal review.
