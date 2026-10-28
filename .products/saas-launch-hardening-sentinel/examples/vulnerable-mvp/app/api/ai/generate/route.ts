// VULNERABLE PATTERN: Un-throttled expensive LLM generation endpoint
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Vulnerability: No rate-limiting. A loop script can drain thousands in OpenAI credits.
  // Vulnerability: No schema validation (Zod) on incoming prompt.
  const { prompt } = await req.json();

  return NextResponse.json({
    result: `Generated completion for: ${prompt}`
  });
}
