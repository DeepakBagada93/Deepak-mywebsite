<?php

namespace App\Http\Controllers;

use App\Models\ProductOrder;
use App\Services\OrderFulfiller;
use App\Services\RazorpayService;
use Illuminate\Http\Request;

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

        $orderId = $orderEntity['id'] ?? ($paymentEntity['order_id'] ?? null);
        $paymentId = $paymentEntity['id'] ?? null;
        $receipt = $orderEntity['receipt'] ?? ($orderEntity['notes']['cart_reference'] ?? ($paymentEntity['notes']['cart_reference'] ?? null));

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

        if (in_array($event, ['order.paid', 'payment.captured'], true)) {
            $this->fulfiller->fulfillGroup($cartReference, $orderId, $paymentId);
        } elseif ($event === 'payment.failed') {
            ProductOrder::where('cart_reference', $cartReference)
                ->where('payment_status', '!=', ProductOrder::STATUS_SUCCESS)
                ->update(['payment_status' => ProductOrder::STATUS_FAILED]);
        }

        return response()->json(['status' => 'ok']);
    }
}
