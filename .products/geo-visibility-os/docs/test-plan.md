# Test plan — GEO Visibility OS v1.1.0

## Objective

Verify that the shipped product can scan a site, build a complete pack deterministically, audit it correctly, fail unsafe packs loudly and survive the commercial packaging gates — offline, with zero dependencies.

## Environment

- macOS (Darwin), Node.js 25.9.0
- No network access required for the test suite
- Test runner: built-in `node:test`
- Working directory: product root (`products/geo-visibility-os`)

## Commands

```bash
node --test tests/*.test.mjs
node .agent/scripts/validate-product.mjs products/geo-visibility-os
node .agent/skills/ai-skill-engineering/scripts/validate-skill-readiness.mjs products/geo-visibility-os
node .agent/skills/ai-skill-engineering/scripts/package-skill-product.mjs products/geo-visibility-os
node .agent/scripts/audit-package.mjs products/geo-visibility-os
```

## Structural tests (12)

| # | Test | Pass condition |
| ---: | --- | --- |
| 1 | Required commercial files | README, LICENSE, CHANGELOG, COMPATIBILITY, manifest and progress file exist |
| 2 | Skill frontmatter | Valid YAML, correct skill name, description >80 chars, body >9,000 chars |
| 3 | Required SKILL.md sections | Activation triggers, input contract, ordered pipeline, output specification, negative constraints |
| 4 | Engine and GEO coverage | GEO, AEO, AI search, ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot, Claude, schema, llms.txt, robots.txt |
| 5 | Customer tutorial | Quickstart, prompt recipe, troubleshooting, >4,000 chars |
| 6 | Store listing | Pricing, what's included, FAQ, guarantee, $149/$299/$599 |
| 7 | Documentation set | Spec, research, test plan, test results, release report, listing, tutorial, security and production-readiness records |
| 8 | Package metadata | `package.json` has the right name/version, ESM mode and `npm test` |
| 9 | Scripts | Four scripts >1,000 chars; three CLIs expose `--help` |
| 10 | No placeholders | No `{{token}}`, TODO, TBD or lorem ipsum in customer-facing files |
| 11 | Examples | Brief, fixture, clean pack, broken pack and four expected reports exist |
| 12 | Manifest integrity | Name, slug, version, category; every listed file hash and size matches disk |

## Functional tests (15)

| # | Test | Pass condition |
| ---: | --- | --- |
| 13 | Local scan | Three pages, robots and sitemap detected, no blocked bots, readiness 100, every page has depth, question headings, answer-first copy and a canonical |
| 14 | Robots parser | Wildcard block denies; named allow overrides; unrelated bot inherits wildcard |
| 15 | Deterministic build | Two builds are byte-identical; 30 prompts; all five stages; branded, non-branded and competitor prompts; platform and success signal on every prompt |
| 16 | Deliverables | Six briefs with evidence and sections; five schema blocks; 25+ roadmap actions with P0 and verification; 8+ citation sources; GSC in measurement; llms.txt described as optional |
| 17 | Clean audit | 100/100 PASS, 40/40 checks, zero findings |
| 18 | Broken audit | Below 60, DO NOT SHIP, at least five critical findings including identity, placeholders, citation ethics, report and limits |
| 19 | Missing limits | Removing limits forces DO NOT SHIP with a critical `delivery.limits` finding |
| 20 | CLI behavior | Exit 0 on PASS, 1 on failure; summary printed when writing JSON/Markdown to a file; JSON-only stdout with `--json=-` |
| 21 | CLI round-trip | Scan → build → audit produces all eleven files and a 100/100 PASS |
| 22 | Robots wildcards | `*`, `$` and allow-wins-on-tie behave correctly |
| 23 | URL safety | `file:`, `ftp:`, localhost, loopback, private, link-local and metadata targets are rejected; `--allow-private` is explicit |
| 24 | Brief validation | Missing fields, bad domain, unsupported platforms, bad vertical and bad dates fail with clear errors |
| 25 | URL coverage | Local HTTP fixture verifies start path, absolute same-origin links, sitemap URLs and external-link exclusion |
| 26 | Fetch limits | Non-text content and a response over 5 MB are rejected |
| 27 | CLI failure modes | `--min` range, stdout conflict, nested output directories and malformed pack exit codes |

## Negative and safety coverage

- Placeholder pack: critical failure.
- Blocked AI crawlers: high-severity failure per bot.
- JavaScript-only page: high-severity failure.
- Missing limits: critical failure.
- Manipulative citation tactics: critical failure.
- Missing measurement plan: multiple failures.
- Thin report: critical failure.

## Exit criteria

- 27/27 tests pass.
- Clean sample is 100/100 PASS; broken sample is below 60 with five or more critical findings.
- Validation, readiness, packaging and package audit pass.
- ZIP contains no secrets, symlinks or forbidden paths.
- URL scans reject private/local targets by default and enforce the response/time/redirect caps.
- Manifest hashes match on disk and inside the archive.
