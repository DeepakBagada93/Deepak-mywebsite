---
name: project-discovery
description: Turn a software or automation idea into a bounded project brief before implementation begins.
---
# Project discovery

Use when a founder or developer has an idea but not an implementation-ready scope. Ask only for missing information that changes customer, outcome, technology, budget, integration, security, or release risk. Do not write production code in this step.

## Input

Accept a prose idea or a filled brief. Extract target user, painful job, desired measurable outcome, constraints, integrations, timeline, budget, and non-goals.

## Workflow

1. Restate the problem in one sentence and identify the primary user.
2. Produce an MVP scope with explicit inclusions and exclusions.
3. List assumptions, dependencies, risks, and essential unanswered decisions.
4. Define 3–7 observable acceptance criteria and a smallest validation experiment.
5. Return a Markdown brief using `examples/project-brief-template.md` headings.

## Guardrails

Do not invent market evidence, APIs, credentials, legal claims, budgets, or deadlines. Mark uncertain claims as assumptions. Flag personal data, payments, authentication, external APIs, and production deployment for focused review.

## Example behavior

For the included SaaS integration idea, the output should limit the MVP to a manual CSV import and a review screen, exclude automatic billing writes, and call out data retention and OAuth as unresolved decisions.

## Escalation

Pause for a decision only when two viable choices materially alter cost, security, or customer promise. Otherwise proceed with a labeled conservative assumption.
