// VULNERABLE PATTERN: Insecure Server Action trusting client userId
'use server';

export async function deleteUserAccount(clientPassedUserId: string) {
  // Vulnerability: No server session check! Anyone can pass any userId to delete an account!
  console.log('Deleting account:', clientPassedUserId);
  return { success: true };
}
