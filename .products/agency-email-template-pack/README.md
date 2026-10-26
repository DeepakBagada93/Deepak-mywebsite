# Agency Email Template Pack

**Commercial email template product v1.0.0 | Deepak Bagada Systems**

Eight production-ready email templates and matching copy sheets for agencies, consultancies, and service businesses. Built for the moments that actually decide revenue: the first cold touch, the discovery recap, the proposal nudge, the kickoff, the proof broadcast, the win-back, the newsletter, and the referral ask.

## What is included

- **8 HTML templates** — self-contained, responsive, dark-mode aware, 600px container, no scripts or external stylesheets.
- **8 copy sheets** — subject lines, preview text, body blocks, merge tags, and QA notes.
- **Subject line vault** — 20+ tested subject and preview pairings.
- **Reference campaign** — a complete agency campaign from ICP research to production QA.
- **Builder** — one command regenerates every template from a single accessible shell.
- **Validator** — checks rendering, spam risk, compliance links, secrets, and the reference campaign.
- **Commercial docs** — tutorial, specification, research dossier, store listing, test plan, and release report.

## Quick start

```bash
# Inspect the templates
open templates/html/01-cold-outreach.html

# Regenerate after editing the copy data
node scripts/build-templates.mjs

# Run the full audit
node scripts/validate-template-pack.mjs

# Run the test suite
node tests/template-pack.test.mjs
```

## Folder map

```
agency-email-template-pack/
├── templates/html/         # 8 responsive email templates
├── templates/copy/         # Editable copy + merge tags per template
├── templates/manifest.json # Machine-readable asset map
├── examples/agency-campaign/
├── scripts/                # Builder + validator
├── tests/                  # Zero-dependency test suite
├── skill/SKILL.md          # Agent usage instructions
├── docs/                   # Commercial and technical documentation
└── dist/                   # Clean distribution ZIP
```

## Related product

Need the automation layer? Pair this pack with `../ai-email-automation-agency` — an ai-draft, human-approve, auto-follow-up system for agency outbound.

## License

Commercial license. Use the templates for your own agency and for client work. You may not resell, redistribute, or repackage the templates as a competing template product. See `LICENSE.md`.
