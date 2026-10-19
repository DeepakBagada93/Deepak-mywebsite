<?php

namespace App\Http\Controllers;

use App\Models\ProductOrder;
use App\Services\CashfreeService;
use App\Services\OrderFulfiller;
use Illuminate\Http\Request;

class CashfreeWebhookController extends Controller
{
    public function __construct(
        private readonly CashfreeService $cashfree,
        private readonly OrderFulfiller $fulfiller,
    ) {}

    public function handle(Request $request)
    {
        $rawBody = $request->getContent();
        $signature = (string) $request->header('x-webhook-signature');
        $timestamp = (string) $request->header('x-webhook-timestamp');

        if (! $this->cashfree->verifyWebhookSignature($signature, $timestamp, $rawBody)) {
            return response()->json(['status' => 'invalid signature'], 401);
        }

        $payload = json_decode($rawBody, true) ?: [];
        $type = $payload['type'] ?? '';
        $orderData = $payload['data']['order'] ?? [];
        $orderReference = $orderData['order_id'] ?? ($payload['data']['order_id'] ?? null);

        if (! $orderReference) {
            return response()->json(['status' => 'ignored'], 200);
        }

        $orders = ProductOrder::group($orderReference);

        if ($orders->isEmpty()) {
            return response()->json(['status' => 'order not found'], 200);
        }

        if ($type === 'PAYMENT_SUCCESS_WEBHOOK') {
            $this->fulfiller->fulfillGroup($orderReference, $orderData['cf_order_id'] ?? null);
        } elseif (in_array($type, ['PAYMENT_FAILED_WEBHOOK', 'PAYMENT_USER_DROPPED_WEBHOOK'], true)) {
            ProductOrder::where('cart_reference', $orderReference)
                ->where('payment_status', '!=', ProductOrder::STATUS_SUCCESS)
                ->update(['payment_status' => ProductOrder::STATUS_FAILED]);
        }

        return response()->json(['status' => 'ok']);
    }
}
