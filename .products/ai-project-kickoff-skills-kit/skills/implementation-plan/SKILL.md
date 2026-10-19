---
name: implementation-plan
description: Convert an accepted project brief into a staged build plan with evidence-based acceptance checks.
---
# Implementation plan

Use after a project brief has a defined customer, scope, exclusions, and acceptance criteria. Do not silently expand the brief or claim delivery occurred.

## Input

Read the accepted brief, assumptions, constraints, integrations, and acceptance criteria. If a safety, credential, or compliance decision blocks a milestone, preserve it as a blocker.

## Workflow

1. Map each acceptance criterion to a build artifact and a verification method.
2. Propose small milestones: foundation, core user flow, integration/error handling, quality/docs, and release review as applicable.
3. For each milestone, list outputs, dependencies, risks, and definition of done.
4. Separate automated tests, manual checks, and untested external-service checks.
5. End with a decision log and the next smallest action.

## Guardrails

Do not name unsupported libraries as fixed requirements, put secrets in examples, or call a plan production-ready. Never hide unreconciled scope changes. Keep the plan implementable by one developer unless the brief says otherwise.

## Expected output

Markdown headed `Implementation plan`, with a criterion-to-evidence table, milestone sections, test plan, risks, and decisions. See the included expected SaaS example for structure, not a script to copy.
