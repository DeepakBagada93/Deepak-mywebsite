'use server';

import { z } from 'zod';

// Mock server auth resolver representing NextAuth / Supabase Auth
async function auth() {
  // In production, resolves from cookies/headers on the server
  return { user: { id: 'usr_secure_123', email: 'founder@example.com' } };
}

const DeleteAccountSchema = z.object({
  confirmation: z.literal('DELETE'),
});

export async function deleteUserAccount(rawPayload: unknown) {
  // 1. Mandatory Server Session Check
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized: Valid session required');
  }

  // 2. Strict Input Validation
  const validated = DeleteAccountSchema.parse(rawPayload);

  // 3. Trusted Server-Side Mutation using session.user.id
  console.log(`Safely deleting account for authenticated user: ${session.user.id}`);

  return { success: true, deletedUserId: session.user.id };
}
