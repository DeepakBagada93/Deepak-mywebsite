# AI Project Kickoff Skills Kit

Reusable planning skills for solo founders and AI developers who need to turn an idea into a testable implementation plan before they start coding.

## Included

- `skills/project-discovery/` — converts an idea into decisions, risks, and a scoped brief.
- `skills/implementation-plan/` — turns an accepted brief into a milestone plan with acceptance evidence.
- A realistic SaaS integration example, checklists, and customer templates.

## Prerequisites

An AI coding agent that can load Markdown instruction files manually. The skills use portable YAML-frontmatter `SKILL.md` files. No API key, network connection, or external paid service is required by this kit.

## Install

1. Unzip this package into a local folder.
2. Load `skills/project-discovery/SKILL.md` in your coding-agent session (or copy that folder to the client’s configured skill location).
3. Give it your product idea and constraints. Save the output using `examples/project-brief-template.md`.
4. After agreeing on scope, load `skills/implementation-plan/SKILL.md` and provide the completed brief.

## First successful run

Use the input in `examples/saas-integration-input.md`. The discovery skill should produce a concrete scope, unanswered essential decisions, assumptions, and risks. Pass that output to the implementation-plan skill. Compare the result with `examples/saas-integration-expected-plan.md`—wording will vary, but it must preserve staged milestones, acceptance tests, and explicit exclusions.

## Configuration and expected result

There is no runtime configuration. Your result is a Markdown project brief and implementation plan, not executable software. You remain responsible for reviewing assumptions, technical choices, costs, security, and legal requirements.

## Troubleshooting

- **My client does not auto-discover the skill:** Load the `SKILL.md` by path or copy its folder to the client’s documented skill directory.
- **The agent begins implementation too early:** State that the brief is not approved and require the discovery skill’s decision/risk output first.
- **A requirement is unclear:** Mark it as an essential decision rather than inventing a product commitment.

## Security, limitations, updates, and support

Do not put credentials, customer data, or proprietary source code in a brief. These skills provide planning guidance; they do not validate market demand, security, legal compliance, or implementation quality. See `COMPATIBILITY.md`, `docs/TESTING.md`, and `LICENSE.md`. For owner-approved support and updates, use the channel stated in the eventual store listing.

To uninstall, delete the extracted kit or remove its skill folders from your agent’s skill directory.
