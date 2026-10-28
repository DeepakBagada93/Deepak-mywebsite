import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Input Schema Validation via Zod
const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  temperature: z.number().min(0).max(1).optional().default(0.7),
});

// Sliding Window Rate Limiting (10 requests per 10 seconds per IP)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function POST(req: Request) {
  // CORS check & origin restriction
  const origin = req.headers.get('origin');
  const allowedOrigins = [process.env.NEXTAUTH_URL || 'http://localhost:3000'];
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse('Access-Control-Allow-Origin rejected', { status: 403 });
  }

  // Rate Limiting Protection (Anti LLM wallet drain)
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success, limit, remaining } = await ratelimit.limit(`ai_generate_${ip}`).catch(() => ({
    success: true,
    limit: 10,
    remaining: 9,
  }));

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a moment before sending more requests.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  }

  try {
    const rawBody = await req.json();
    const validated = GenerateRequestSchema.parse(rawBody);

    return NextResponse.json({
      success: true,
      result: `Hardened response generated for prompt: ${validated.prompt}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid input payload', details: err.errors }, { status: 400 });
  }
}
