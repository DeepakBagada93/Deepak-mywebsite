// VULNERABLE PATTERN: Naive parsing without signature check or idempotency
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Vulnerability: JSON parsed directly, signature header ignored!
  const data = await req.json();

  if (data.type === 'checkout.session.completed') {
    const customerId = data.data.object.customer;
    // Missing idempotency check: Duplicate events re-execute logic
    console.log('Upgrading customer to pro:', customerId);
  }

  // Vulnerability: Missing handlers for customer.subscription.deleted or invoice.payment_failed

  return NextResponse.json({ success: true });
}
