# CLAUDE.md

This file gives Claude context about the Acme Storefront codebase. Please read it carefully before starting any work.

## General guidance

You are a helpful senior full-stack engineer. Write clean code. Be careful when editing files. Follow best practices at all times. Use good judgment when something is ambiguous. Try to keep changes focused and make sure to test your work where appropriate.

We care a lot about code quality here. Our team has been building this storefront for about two years and we have a lot of accumulated wisdom. Please respect the conventions that have grown organically in the codebase, and when in doubt, look at nearby files to see how things are done.

## Setup

Install dependencies with npm:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

## Build and test

- Build: `npm run build`
- Test: `npm run test`
- Type check: `npm run typecheck`
- Lint: `npm run lint`

Please always run the build and tests before you say a task is complete.

## Code style

- Use double quotes for all strings.
- Always use semicolons.
- Indent with 2 spaces.
- Prefer named exports over default exports.
- Keep components small and focused.
- Name files in kebab-case.
- Sort imports alphabetically.

Formatting is handled by Prettier but please still follow the rules above manually.

## Architecture notes

The storefront is a Next.js App Router application. Pages live in `src/app`. Shared code lives in `src/lib`. The database client is created once in `src/lib/db.ts` and reused everywhere.

The checkout flow lives in `src/server/api.ts` and talks to Stripe. If you need to change the checkout behaviour, that file is the place to start. It is a large file, so read it fully before editing.

We used to use Redux for state but migrated away in 2024. Do not add Redux back. We also removed the old `src/store` directory; do not resurrect it.

## Testing

Tests use Vitest and live next to the files they test. When you add a component, add a test. When you fix a bug, add a regression test. Do not lower coverage thresholds.

## Boundaries

- Never commit secrets or `.env` files.
- Do not modify the database schema without a migration.
- Do not add new dependencies without asking.
- Do not rewrite unrelated code while fixing a bug.
- Do not delete tests to make the suite pass.
- Avoid touching the billing integration unless the task explicitly requires it.

## Communication

When you finish a task, summarise what changed, what you verified, and anything you could not verify. Keep the summary short.

## Historical notes

In 2023 we tried a monorepo and reverted it. In early 2024 we moved from Pages Router to App Router. In mid-2024 we adopted Prettier. In 2025 we started splitting the storefront into smaller route groups. None of this history should affect your work, but it explains why some files look old.

## More style rules

- Use async/await instead of promise chains.
- Prefer early returns over nested conditionals.
- Do not use `any` in TypeScript.
- Use the `cn` helper from `src/lib/format.ts` for conditional class names.
- Keep comments meaningful; do not narrate obvious code.
- Use descriptive variable names.
- Avoid magic numbers; extract named constants.
