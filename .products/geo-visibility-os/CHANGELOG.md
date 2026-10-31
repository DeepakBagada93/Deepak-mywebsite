# Changelog

All notable changes to GEO Visibility OS are recorded here.

## [1.1.0] — 2026-11-01

### Added

- Brief validation before scanning: required strings, bare public domain, supported platforms, vertical, dates, arrays and FAQ shape.
- Pack validation before audit: malformed or truncated packs exit 2 with an actionable error instead of crashing.
- URL-scan safety: localhost/private/link-local/metadata blocklist, DNS resolution checks, 5 MB response cap, 15-second timeout, five-redirect limit and HTTPS-to-HTTP downgrade rejection.
- `--allow-private` for trusted local staging only.
- URL scans now start at the requested path, follow absolute same-origin links and include same-origin sitemap URLs.
- `--version` on all three CLIs and stricter flag parsing.
- `package.json` with `npm test` and sample commands.
- `docs/security-and-privacy.md` and `docs/production-readiness.md`.
- Regression tests for URL safety, robots wildcards/allow ties, brief validation, local HTTP scanning and CLI failure modes.

### Changed

- Crawl scoring now checks retrieval bots (`ChatGPT-User`, `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`) instead of treating a GPTBot/ClaudeBot training block as a retrieval failure.
- Roadmap separates retrieval-bot unblocks from training-bot decisions.
- Audit output directories are created automatically; `--min` accepts a separated value and validates its range.
- `--json=-` and `--md=-` cannot be combined, so stdout stays parseable.
- Version bumped to 1.1.0; tests now cover 27 cases.

### Fixed

- Robots rules now honour `*` wildcards, `$` end anchors and allow-wins-on-equal-specificity.
- `scan-site` and `build-geo-pack` reject unknown flags and missing values instead of silently ignoring them.
- `build-geo-pack` no longer mutates the caller's brief.

## [1.0.0] — 2026-10-29

### Added

- `geo-visibility-os` skill with a four-stage pipeline: capture, build, audit, deliver.
- Offline scanner (`scan-site.mjs`) for local HTML snapshots and public URLs.
- Deterministic builder (`build-geo-pack.mjs`) producing `pack.json` plus ten hand-off documents.
- Deterministic audit (`audit-geo-pack.mjs`) with 40 weighted checks across 8 classes and three verdicts.
- AI bot access reporting for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended and CCBot.
- 30-prompt buyer panel across awareness, comparison, decision, objection and branded stages.
- Six answer-first content briefs with evidence requirements, extraction rules and a "do not" list.
- Five JSON-LD blocks: Organization, Service, FAQPage, BreadcrumbList, Article.
- Citation-source map for four verticals with ethical outreach actions.
- 25+ action fix roadmap with priority, owner, effort, impact and verification.
- Measurement plan using Search Console generative AI reporting, Bing citation share, GA4 AI referrals and a manual prompt panel.
- White-label client report with a limits section and an explicit no-guarantee statement.
- Sample brief, fictional dental site, full sample pack, deliberately broken pack and expected audit reports.
- 20 structural and functional tests, including determinism, exit codes and CLI output behavior.

### Notes

- The sample brand "Pulse Dental Studio", its proof numbers and its competitors are fictional and exist only to demonstrate the pack.
- The audit checks deterministic failure modes. It does not verify that a claim is true and it is not legal advice.
- `llms.txt` is documented as optional agent readability, not as a visibility lever.
