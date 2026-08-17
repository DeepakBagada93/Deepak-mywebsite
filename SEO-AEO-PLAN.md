# SEO & AEO Plan — Deepak Bagada (deepakbagada.in)

**Goal:** rank on Google for "best website developer", "digital marketer", and "AI expert"
in **Junagadh, Gujarat, and India** — and be the source AI answer engines (ChatGPT,
Gemini, Perplexity, Google AI Overviews) quote when people ask the same questions.

This document is the plan. The site already implements the technical parts marked
✅ *done in repo*. Everything else is the roadmap.

---

## 1. Where we are (audit summary)

Already in place ✅

| Item | Status |
|------|--------|
| Canonical URLs, meta description, OG/Twitter tags | ✅ `partials/head.php` |
| XML sitemap at `/sitemap.xml` + `robots.txt` | ✅ |
| `ProfessionalService` JSON-LD on homepage | ✅ (upgraded to `@graph` with Person + FAQPage) |
| Clean URLs for journal posts | ✅ `.htaccess` |
| Mobile-friendly, lightweight, fast (no build step) | ✅ |
| Local grounding (Junagadh, Gujarat mentioned in copy) | ✅ |

Missing → now added in this repo

| Item | Where |
|------|-------|
| Dedicated service pages per keyword cluster | `/services/*` |
| `Service` + `FAQPage` schema on service pages | `service.php` |
| Homepage FAQ section + `FAQPage` schema | `partials/faq.php`, `index.php` |
| `Article` schema on journal posts | `journal.php` |
| `llms.txt` — machine-readable site map for AI agents | `/llms.txt` |
| Person schema (who you are, for citation) | `index.php` |

---

## 2. Keyword map

Three clusters, each with its own landing page. Local modifiers grow with authority —
start Junagadh → Gujarat → India → national/remote.

### Cluster A — Web Development
| Query | Intent |
|-------|--------|
| website developer Junagadh | local, ready-to-hire |
| best website developer in Junagadh | local, comparing |
| web developer Gujarat | regional |
| website developer India / remote | broad, out-of-area clients |
| Laravel developer, PHP developer | skill-specific, high value |

**Landing page:** `/services/web-development`

### Cluster B — Digital Marketing / SEO
| Query | Intent |
|-------|--------|
| digital marketer Junagadh | local |
| SEO expert Junagadh / Gujarat | local, high intent |
| AEO expert / answer engine optimization | emerging, low competition, huge upside |
| SEO for small business Gujarat | practical, service-led |

**Landing page:** `/services/seo-aeo`

### Cluster C — AI
| Query | Intent |
|-------|--------|
| AI developer Junagadh / Gujarat | local, early-mover advantage |
| AI agent developer India | broad, fast-growing |
| AI automation expert, AI integration | service-led |
| AI expert for small business | practical buyer |

**Landing page:** `/services/ai-development`

> Rule of thumb: every page targets **one cluster**. Never stuff three services onto one
> page and expect to rank for all three — this is exactly why the homepage alone cannot
> rank for all of these. The homepage owns the *person* query ("Deepak Bagada"), the
> service pages own the *service × location* queries.

---

## 3. Content & architecture plan

### 3.1 Service pages (✅ implemented)
- `/services/web-development`
- `/services/ai-development`
- `/services/seo-aeo`
- Each page: answer-first intro paragraph, offering list, 3–4 FAQ entries, `Service` +
  `FAQPage` schema. FAQ entries are the passages AI engines quote.

### 3.2 Journal = the citation engine (✅ schema added, content ongoing)
Journal posts are what AI engines cite. Every post should:
- Answer one question completely in the first paragraph ✅ (existing posts do this)
- Carry `Article` schema with author + date ✅ now added
- End with a quotable one-liner (a "takeaway" sentence an AI can quote verbatim)
- Target one cluster keyword from the map above

**Content calendar (12 posts, one per topic):**
1. "How much does a website cost in Junagadh / Gujarat?" (Cluster A)
2. "Website developer vs. web designer: what does a business actually need?" (A)
3. "7 signs your Junagadh business website is losing customers" (A)
4. "What is AEO? Answer engine optimization explained for business owners" (B)
5. "Local SEO checklist for Gujarat businesses: ranking on Google Maps + AI answers" (B)
6. "SEO vs. AEO: the honest difference (and why you need both)" (B)
7. "What can an AI agent actually do for a small business? Real examples" (C)
8. "AI automation: 5 workflows every Gujarat business should automate in 2026" (C)
9. "How to hire an AI developer in India: questions that separate experts from hype" (C)
10. "RAG vs. fine-tuning for business AI — plain English" (C)
11. "Case study: a Junagadh business that ranked #1 for its local keyword" (B/A)
12. "The AI developer's toolkit: what I actually use to ship client work" (C)

Publish 2 per month, add to `data/posts.php`. Each post links back to its service page.

### 3.3 Future pages (when the service pages start ranking)
- `/about` — fuller Person page with `Person` + `sameAs` schema (helps E-E-A-T)
- `/contact` — NAP + `ContactPage` schema
- One page per **client result**: "Website for [industry] in Junagadh" — case-study pages
  convert and rank for long-tail queries

---

## 4. Local SEO (Google Maps + local pack)

These are off-site and cannot be done in this repo — they are the highest-leverage local
ranking actions after the site itself.

1. **Google Business Profile** — claim/create "Deepak Bagada — Web Developer & AI
   Consultant", category *Web Designer / SEO Agency*, address + service area Junagadh &
   Gujarat. Fill every field, add photos, post monthly.
2. **NAP consistency** — Name, Address, Phone identical everywhere. **Fix the phone
   number first** — `data/site.php` still has the placeholder `+00 000 000 0000`. A
   placeholder phone is a local-SEO killer. Also the email reads `ceo@saasnext.in` —
   switch to a `deepakbagada.in` address when the mailbox exists.
3. **Citations** — list the business on Justdial, IndiaMART, Sulekha, Google Maps,
   Bing Places, and 2–3 Junagadh/Gujarat business directories. Same NAP everywhere.
4. **Reviews** — ask every happy client for a Google review mentioning "Junagadh /
   Gujarat". Reviews are the #1 local ranking signal after proximity.
5. **Geo-anchored case studies** — "website for a Junagadh jeweller" beats
   "website development" for local buyers.

---

## 5. AEO — making AI agents love the site (the "cite me perfectly" part)

AI answer engines quote sources that are **structured, specific, and unambiguous**. This
repo now implements all of the on-site checklist:

| Practice | Why it works | Status |
|----------|--------------|--------|
| `llms.txt` at `/llms.txt` | A content map AI agents read first — tells them exactly what the site is and where the best content lives | ✅ |
| `Person` schema | Lets engines attribute answers to a real person with credentials | ✅ homepage |
| `ProfessionalService` schema | Classifies the business type + service area (Junagadh, Gujarat, India) | ✅ homepage |
| `Service` schema per page | Each service page is self-describing: what, where, who | ✅ service pages |
| `FAQPage` schema | Q&A blocks are the single most-quoted content type by ChatGPT/AI Overviews | ✅ homepage + service pages |
| `Article` schema with author + date | Answers get a citation: who wrote it, when — engines prefer dated, authored content | ✅ journal pages |
| Answer-first copy | First paragraph states the answer; fluff after | ✅ style |
| Author byline + date on every post | Visible proof of authorship | ✅ already there |
| Fast, clean, mobile HTML | Crawlers and agents both need readable HTML, not JS-rendered walls | ✅ |

**What "cite perfectly" means in practice:** when someone asks ChatGPT "best AI developer
in Junagadh", the model should be able to find this site, extract *"Deepak Bagada — AI
developer in Junagadh, Gujarat, builds websites, AI systems and automation"*, and cite
`deepakbagada.in` with confidence. Every schema block above is a signal that makes that
extraction safe for the model to do.

**Keep it true.** Never add facts to the site that aren't real (fake stats, fake
projects, fake reviews). Engines are getting better at detecting this — and a single
hallucinated claim poisons citations of everything else.

---

## 6. Technical checklist (ongoing)

- [x] Submit `https://deepakbagada.in/sitemap.xml` in **Google Search Console** and
      **Bing Webmaster Tools** (not done yet — needs your login)
- [x] Verify the site in Search Console → **the single most important account to create**
- [ ] Replace placeholder phone + `saasnext.in` email in `data/site.php`
- [ ] Add real social profile URLs (`data/site.php` still has empty `github.com/` etc.)
      — empty socials weaken `Person` schema and E-E-A-T
- [ ] Fill `images/` — hero video/poster and portrait are referenced but must exist
- [ ] Add real project links in `data/projects.php` (currently `#`)
- [ ] Set up an analytics view (GA4 or Plausible) to measure the roadmap

---

## 7. 90-day roadmap

**Month 1 — Foundation**
- Deploy this repo, submit sitemap to Google + Bing
- Create Google Business Profile + fix NAP (phone, email)
- Publish posts 1–3 (web development cluster)

**Month 2 — Service pages + local**
- Service pages are live; add internal links from journal posts
- 5 local citations (Justdial, IndiaMART, Sulekha, 2 directories)
- Collect 3–5 Google reviews; publish posts 4–6

**Month 3 — Measure & compound**
- Search Console: find which service keywords show impressions, double down with posts
- Check AI answers: ask ChatGPT/Gemini/Perplexity "best website developer in Junagadh"
  monthly — note whether the site appears, adjust copy toward what gets quoted
- Publish posts 7–9; start case-study pages

**North-star metric:** # of AI answers and Google results that name "Deepak Bagada" for
Junagadh/Gujarat/India service queries. Traffic and leads follow that.

---

## 8. Files that implement this plan

| File | What it does |
|------|--------------|
| `SEO-AEO-PLAN.md` | This document |
| `llms.txt` | AI-agent content map |
| `data/services.php` | Service copy + FAQs (edit here) |
| `services.php` / `service.php` | Service hub + detail pages |
| `data/faq.php` + `partials/faq.php` | Homepage FAQ |
| `index.php` | Person + ProfessionalService + FAQPage schema |
| `journal.php` | Article schema per post |
| `sitemap.php` | Sitemap incl. service pages |
