# Context kernel — acme-storefront

Read this file before any task. Load deeper layers only when the task needs them.
Layers: `.context/repo-map.md` (paths), `.context/playbooks/` (task steps), `.context/drift-probes.md` (verification).

## Commands
- install: `pnpm install`
- build: `pnpm run build`
- test: `pnpm run test`
- lint: `pnpm run lint`
- typecheck: `pnpm run typecheck`

## Facts
- Language: TypeScript; framework: Next.js
- Package manager: pnpm
- Formatter/linter: prettier
- Test runner: vitest
- Node: >=20

## Boundaries
- Never commit secrets or `.env` files.
- Do not modify the database schema without a migration.
- Do not add new dependencies without asking.
- Do not rewrite unrelated code while fixing a bug.
- Do not delete tests to make the suite pass.
- Avoid touching the billing integration unless the task explicitly requires it.
- Do not change the package manager or its lockfile policy without an explicit instruction.
- Do not run destructive git commands (`reset --hard`, `push --force`, branch deletion) unprompted.

Sources: CLAUDE.md, AGENTS.md, .cursor/rules/style.mdc
