# PROJECT ARCHITECTURAL CONTEXT & AGENT RULES
## Environment & Framework Stack
- Language: TypeScript (Strict mode, explicit types)
- Framework: Next.js (^15.0.0) - Always use Server Components by default; add 'use client' only when hooks/interactivity are needed.
- React: React 19 - Use useActionState and Server Actions. Do not use deprecated React patterns.
- Styling: Tailwind CSS (v4 CSS-first theme)
- ORM: Prisma - Ensure singleton client connection in serverless routes.
- Validation: Zod - Always validate incoming API payloads and server action parameters.

## Strict Negative Constraints for AI Agent
1. NEVER suggest deprecated Next.js Pages router APIs (getServerSideProps, getStaticProps).
2. NEVER omit server-side auth validation in Server Actions.
3. NEVER write un-typed 'any' in TypeScript definitions.
4. Keep code concise, production-ready, and free of synthetic placeholder comments.

