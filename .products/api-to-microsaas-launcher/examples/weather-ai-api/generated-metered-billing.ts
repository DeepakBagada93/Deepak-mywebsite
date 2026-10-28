import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16' as any,
});

export async function reportMeteredUsage(subscriptionItemId: string, requestsCount: number) {
  try {
    const record = await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
      quantity: requestsCount,
      timestamp: Math.floor(Date.now() / 1000),
      action: 'increment',
    });
    return { success: true, recordId: record.id };
  } catch (err: any) {
    console.error(`[Metered Billing Error]: ${err.message}`);
    return { success: false, error: err.message };
  }
}
