# Drift probes — acme-storefront

Ask an agent these probes in a fresh session. Answers must come from `.context/kernel.md`, not guesswork.
A wrong or hedged answer means the context drifted or the agent never loaded it. Fix the context, then re-run.

## Probe 1

Which package manager is canonical here, and what exact install command should be used?

Expected: pnpm; `pnpm install`

## Probe 2

What exact command runs the test step?

Expected: `pnpm run test`

## Probe 3

What exact command runs the build step?

Expected: `pnpm run build`

## Probe 4

What exact command runs the lint step?

Expected: `pnpm run lint`

## Probe 5

Where do task-specific procedures live, and when should they be loaded?

Expected: `.context/playbooks/` — load only when the task matches the playbook.

## Probe 6

Name one action the agent must never take unprompted in this repository.

Expected: One of the kernel boundaries (secrets, package-manager change, destructive git).

## Probe 7

What is the runtime language and framework?

Expected: TypeScript; Next.js
