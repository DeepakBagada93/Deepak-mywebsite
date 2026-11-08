<?php

namespace App\Http\Controllers;

use App\Models\ProductOrder;
use App\Services\OrderFulfiller;
use App\Services\RazorpayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RazorpayWebhookController extends Controller
{
    public function __construct(
        private readonly RazorpayService $razorpay,
        private readonly OrderFulfiller $fulfiller,
    ) {}

    public function handle(Request $request)
    {
        $rawBody = $request->getContent();
        $signature = (string) $request->header('x-razorpay-signature');

        if (! $this->razorpay->verifyWebhookSignature($rawBody, $signature)) {
            return response()->json(['status' => 'invalid signature'], 401);
        }

        $payload = json_decode($rawBody, true) ?: [];
        $event = $payload['event'] ?? '';

        $orderEntity = $payload['payload']['order']['entity'] ?? [];
        $paymentEntity = $payload['payload']['payment']['entity'] ?? [];
        $paymentLinkEntity = $payload['payload']['payment_link']['entity'] ?? [];

        $orderId = $orderEntity['id'] ?? ($paymentEntity['order_id'] ?? ($paymentLinkEntity['id'] ?? null));
        $paymentId = $paymentEntity['id'] ?? null;
        $receipt = $orderEntity['receipt'] ?? ($orderEntity['notes']['cart_reference'] ?? ($paymentEntity['notes']['cart_reference'] ?? ($paymentLinkEntity['reference_id'] ?? null)));

        // Find orders by cart_reference or razorpay_order_id
        $orders = null;
        if ($receipt) {
            $orders = ProductOrder::group($receipt);
        }
        if ((! $orders || $orders->isEmpty()) && $orderId) {
            $orders = ProductOrder::where('razorpay_order_id', $orderId)
                ->orWhere('cf_order_id', $orderId)
                ->get();
        }

        if (! $orders || $orders->isEmpty()) {
            return response()->json(['status' => 'order not found'], 200);
        }

        $cartReference = $orders->first()->cart_reference;

        if (in_array($event, ['order.paid', 'payment.captured', 'payment_link.paid'], true)) {
            // Amount & currency verification gate
            $expectedSubunits = (int) round($orders->sum('amount') * 100);
            $eventAmount = (int) ($paymentEntity['amount'] ?? ($orderEntity['amount_paid'] ?? ($paymentLinkEntity['amount_paid'] ?? 0)));

            if ($eventAmount > 0 && $eventAmount < $expectedSubunits) {
                Log::warning('Razorpay Webhook: Amount underpayment detected, fulfillment aborted', [
                    'expected' => $expectedSubunits,
                    'received' => $eventAmount,
                    'cart_reference' => $cartReference,
                ]);

                return response()->json(['status' => 'amount mismatch'], 400);
            }

            $this->fulfiller->fulfillGroup($cartReference, $orderId, $paymentId);
        } elseif ($event === 'payment.failed') {
            ProductOrder::where('cart_reference', $cartReference)
                ->where('payment_status', '!=', ProductOrder::STATUS_SUCCESS)
                ->update(['payment_status' => ProductOrder::STATUS_FAILED]);
        }

        return response()->json(['status' => 'ok']);
    }
}
