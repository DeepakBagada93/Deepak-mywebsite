#!/usr/bin/env node
/**
 * Codebase Context Builder CLI
 * Standalone zero-dependency Node.js tool.
 *
 * Inspects a repository's package.json and file structure,
 * extracts exact framework versions, and synthesizes token-dense
 * .cursorrules and CLAUDE.md files.
 *
 * Usage:
 *   node scripts/context-builder.mjs [path-to-repo]
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const targetDir = process.argv[2] || '.';
const root = path.resolve(targetDir);

async function inspectRepo() {
  let pkg = {};
  try {
    const raw = await fs.readFile(path.join(root, 'package.json'), 'utf8');
    pkg = JSON.parse(raw);
  } catch {
    console.error(`Warning: No package.json found at ${root}. Using standard modern defaults.`);
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  // Detect Frameworks & Versions
  const isNext = !!deps['next'];
  const nextVer = deps['next'] || '';
  const isReact19 = deps['react']?.includes('19') || false;
  const isTailwind = !!deps['tailwindcss'];
  const isTailwindV4 = deps['tailwindcss']?.includes('4') || false;
  const isPrisma = !!deps['@prisma/client'] || !!deps['prisma'];
  const isDrizzle = !!deps['drizzle-orm'];
  const isSupabase = !!deps['@supabase/supabase-js'];
  const isZod = !!deps['zod'];
  const isTypeScript = !!deps['typescript'];

  // Synthesize Context Rules
  let rules = `# PROJECT ARCHITECTURAL CONTEXT & AGENT RULES\n`;
  rules += `## Environment & Framework Stack\n`;
  rules += `- Language: ${isTypeScript ? 'TypeScript (Strict mode, explicit types)' : 'Modern JavaScript (ESM)'}\n`;
  if (isNext) rules += `- Framework: Next.js (${nextVer || 'Latest App Router'}) - Always use Server Components by default; add 'use client' only when hooks/interactivity are needed.\n`;
  if (isReact19) rules += `- React: React 19 - Use useActionState and Server Actions. Do not use deprecated React patterns.\n`;
  if (isTailwind) rules += `- Styling: Tailwind CSS (${isTailwindV4 ? 'v4 CSS-first theme' : 'v3 utility classes'})\n`;
  if (isPrisma) rules += `- ORM: Prisma - Ensure singleton client connection in serverless routes.\n`;
  if (isDrizzle) rules += `- ORM: Drizzle - Type-safe SQL queries with schema relations.\n`;
  if (isSupabase) rules += `- Database: Supabase - Verify Row Level Security (RLS) on all user tables.\n`;
  if (isZod) rules += `- Validation: Zod - Always validate incoming API payloads and server action parameters.\n`;

  rules += `\n## Strict Negative Constraints for AI Agent\n`;
  rules += `1. NEVER suggest deprecated Next.js Pages router APIs (getServerSideProps, getStaticProps).\n`;
  rules += `2. NEVER omit server-side auth validation in Server Actions.\n`;
  rules += `3. NEVER write un-typed 'any' in TypeScript definitions.\n`;
  rules += `4. Keep code concise, production-ready, and free of synthetic placeholder comments.\n`;

  // Output summary
  console.error(`\n======================================================`);
  console.error(` Codebase Context Builder - Inspection Complete`);
  console.error(`======================================================`);
  console.error(` Target: ${root}`);
  console.error(` Detected Stack: Next.js=${isNext}, TS=${isTypeScript}, Tailwind=${isTailwind}, Prisma=${isPrisma}`);
  console.error(`======================================================\n`);

  return {
    stack: { isNext, isTypeScript, isTailwind, isTailwindV4, isPrisma, isDrizzle, isSupabase, isZod },
    rulesContent: rules
  };
}

if (process.argv[1] && process.argv[1].endsWith('context-builder.mjs')) {
  inspectRepo().then(res => {
    console.log(res.rulesContent);
  }).catch(err => {
    console.error('Error building context:', err);
    process.exit(1);
  });
}

export { inspectRepo };
