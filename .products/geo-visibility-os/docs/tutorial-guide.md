# GEO Visibility OS — customer tutorial

This guide takes you from a blank page to a delivered AI-search audit. It assumes you have Node.js 20 or newer and a client whose site you are allowed to audit.

## Quickstart (10 minutes)

### 1. Unzip and open the folder

```bash
unzip geo-visibility-os-1.1.0.zip -d geo-visibility-os
cd geo-visibility-os
```

There is nothing to install. The scripts use only the Node standard library.

### 2. Create the client brief

Copy `examples/pulse-dental-brief.json` and replace every value with real client facts. Only four fields are required:

- `brand` — the exact business name used on the site
- `domain` — the canonical domain, without `https://`
- `category` — the service or product category a buyer would ask about
- `buyer` — one sentence describing who is buying

Add `competitors`, `differentiators`, `proof`, `serviceArea`, `agencyName` and `primaryPages` for a usable pack. If you cannot verify a proof point, leave it out. The audit will flag weak evidence, and that is better than shipping a fabricated number.

### 3. Capture the site

For a saved snapshot:

```bash
node skills/geo-visibility-os/scripts/scan-site.mjs \
  --dir ./client-site \
  --domain client.example \
  --out ./snapshot.json
```

For a live public site:

```bash
node skills/geo-visibility-os/scripts/scan-site.mjs \
  --url https://client.example \
  --max-pages 5 \
  --out ./snapshot.json
```

URL scans block localhost, private, link-local and cloud-metadata addresses by default. They cap responses at 5 MB, time out after 15 seconds, follow at most five redirects and reject HTTPS-to-HTTP downgrades. For a trusted staging server, add `--allow-private`; never expose that mode as a public fetcher.

Read the console summary. If readiness is low, open `snapshot.json` and check whether the pages are JavaScript-rendered. A low word count with many script tags means the scanner cannot see the real copy; fix rendering before you sell the audit.

### 4. Build the pack

```bash
node skills/geo-visibility-os/scripts/build-geo-pack.mjs \
  --brief ./client-brief.json \
  --snapshot ./snapshot.json \
  --out ./client-pack \
  --agency "Your Agency"
```

The builder writes eleven files. The two you will read first are `client-report.md` and `fix-roadmap.csv`.

### 5. Audit before delivery

```bash
node skills/geo-visibility-os/scripts/audit-geo-pack.mjs ./client-pack/pack.json \
  --md=./client-pack/audit.md \
  --json=./client-pack/audit.json
```

Do not deliver a pack that is not `PASS`. Fix the brief or the pack, rebuild, and audit again. The audit exits `0` only on `PASS`, so it works in CI or a delivery checklist.

## First client engagement: a safe order of work

1. **Scope the audit.** Agree on the domain, the service category, the buyer, the two real competitors and the priority pages. Do not audit a whole site in the first engagement.
2. **Scan, then verify.** The scan is evidence, not truth. Open the pages yourself. Confirm the address, phone, credentials, service area and prices before they appear in a deliverable.
3. **Fix the brief, not the score.** If the audit fails `entity.consistency`, correct the brand or city in the brief. Never hand-edit `pack.json` to raise a score.
4. **Deliver the diagnosis and the first two fixes.** Send the report, the P0 roadmap and the two highest-intent content briefs. A 100-page dump does not get implemented.
5. **Install schema only after the visible content exists.** FAQPage schema without a visible FAQ is a risk. Validate with a schema validator or the Rich Results Test.
6. **Start the prompt panel the same week.** A baseline recorded after the site changes is not a baseline.
7. **Re-measure at the planned date.** Report movement and limits, not a single triumphant screenshot.

## How to read the score

The score is a weighted diagnostic of observed signals. It is not a forecast.

- **Crawl access (16 points).** Can the retrieval agents fetch the page? Blocking `GPTBot` or `ClaudeBot` is a training decision; `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot` and `Claude-SearchBot` are separate retrieval paths. Treat them separately.
- **Entity (14 points).** Does the site state, in machine-readable form, who the business is, what it offers, where it works and how it relates to verified profiles?
- **Content (18 points).** Can an answer engine extract a direct answer, follow question-shaped headings, find dated evidence and compare options without guessing?
- **Citation (12 points).** Are there third-party sources that corroborate the entity, with ethical outreach actions?
- **Prompt coverage (12 points).** Does the measurement panel cover the whole buying journey, including branded and competitor questions?
- **Measurement (10 points).** Is there a baseline, a re-measure date and an honest attribution model?
- **Delivery (10 points).** Is the report usable, the roadmap owned, and the limits stated?
- **Structure (8 points).** Are the inputs complete and free of placeholders?

A `DO NOT SHIP` result is not a judgement about the business. It means the pack is not safe or complete enough to hand to a client.

## Prompt recipe

A good prompt panel mirrors how a buyer actually talks. Build it in five layers:

### Layer 1 — Awareness (six prompts)

Use category plus location or use case, without the brand:

- `best {category} in {city}`
- `how to choose {category} in {city}`
- `{category} near me`
- `what should {buyer} know before {category}`
- `is {category} worth it for {buyer}`
- `{category} options in {city}`

### Layer 2 — Comparison (six prompts)

Name the brand and the two real competitors:

- `{brand} vs {competitor1}`
- `best {category} providers in {city}`
- `{brand} alternatives`
- `{competitor1} vs {competitor2} for {buyer}`
- `top rated {category} in {city}`
- `which {category} is best for {buyer}`

### Layer 3 — Decision (six prompts)

Test whether the engine can answer basic commercial questions correctly:

- `{brand} reviews`
- `{brand} pricing`
- `is {brand} legit`
- `{brand} consultation`
- `{brand} near {city}`
- `book {category} in {city}`

### Layer 4 — Objection (six prompts)

Test whether the answer handles fear and cost honestly:

- `does {category} hurt`
- `how long does {category} take`
- `{category} cost without insurance in {city}`
- `is {brand} worth the price`
- `risks of {category}`
- `{category} before and after`

### Layer 5 — Branded (six prompts)

Check entity accuracy and official citations:

- `{brand}`
- `{brand} {city}`
- `{brand} services`
- `{brand} reviews {city}`
- `{brand} vs {competitor1}`
- `{brand} appointment`

Run each prompt three times per engine on the same day. Log the engine, date, whether the brand was mentioned, whether the official domain was cited, the position in the answer and the sentiment. A single run is an anecdote. Three runs start to show a distribution.

## How to use each deliverable

### Client report

Send the Markdown or convert it to PDF with your own branding. Keep the limits section. It protects both you and the client.

### Content briefs

Give the writer the brief, the evidence list and the target prompt. The answer block is the first 40–60 words of the page, not a meta description. Replace the target prompt with a real one from the panel when you have search or sales data.

### Schema pack

Paste one block at a time. Match the visible content exactly. Do not add ratings, reviews, prices or credentials that the page does not show. Validate every block before deploy.

### Citation plan

Pick three sources per month, not all ten at once. For each source, find the three most relevant pages, check whether the brand is already mentioned, and pitch a factual correction or expert contribution where the rules allow. Never buy reviews or paid editorial placement. Disclose any relationship.

### Measurement plan

Use Google Search Console's generative AI reporting, Bing Webmaster Tools citation share, a GA4 AI referral segment and the manual prompt panel. Expect undercounting. Label modelled numbers as modelled.

### Fix roadmap

Work top-down. P0 items are the conditions that make everything else ineffective: crawler access, canonical URLs, core entity schema, answer-first content and a baseline. P1 items build the content and citation surface. P2 items are maintenance and expansion.

## Troubleshooting

### `No HTML pages found in directory`

Point `--dir` at the folder that contains `index.html`, not its parent. The scanner walks subfolders but needs at least one HTML file.

### The scan sees very little text

The page is probably client-rendered. Check the `jsOnly` flag and the word count in `snapshot.json`. Recommend server-side rendering or pre-rendering for the priority pages. Do not claim the site has thin content when the scanner simply cannot see it.

### All AI bots show as blocked

Look for `User-agent: *` followed by `Disallow: /`. Add explicit groups for the retrieval bots the client wants, for example:

```txt
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: GPTBot
Allow: /
```

Explain the trade-off: blocking a training bot is a business decision, but blocking a retrieval bot removes a citation path.

### Audit fails `citation.ethics`

The plan contains language that looks like manipulation, such as buying reviews, paid links or astroturfing. Remove the tactic and replace it with a factual contribution action.

### Audit fails `delivery.roadmap`

The roadmap has fewer than 20 actions or is missing owners or verification. Regenerate the pack. Do not trim the roadmap by hand; every action exists for a reason.

### `Refusing to scan localhost` or a private address

The URL resolves to a local, private or link-local target. Use a public URL, or `--allow-private` only for a trusted staging server. Do not expose the scanner as a public service.

### `Brief field ... must be`

The builder validates the brief before scanning. Fix the named field: a bare `domain`, at least four supported `platforms`, a valid `vertical`, a real `YYYY-MM-DD` date and non-empty required strings.

### The score changes between runs

The brief, the snapshot or the site changed. Keep one snapshot per engagement and record the date. Re-scan deliberately, not accidentally.

### A client asks for a guarantee

Say no. The pack states that no citation, ranking or revenue outcome is guaranteed. Offer a measurement plan and a review cadence instead. That is the honest, defensible position.

## Delivery checklist

- [ ] Brief uses verified client facts and two real competitors.
- [ ] Snapshot is from the agreed date and includes at least three priority pages.
- [ ] Audit is `PASS` with no critical or high findings.
- [ ] Client report has the correct agency name and no placeholder text.
- [ ] Evidence lines are replaced with verified facts and dates.
- [ ] Schema matches visible content and validates.
- [ ] Citation actions follow each community's rules.
- [ ] Prompt panel baseline is scheduled.
- [ ] Limits section is included and explained.
- [ ] Next review date is in the client's calendar.
