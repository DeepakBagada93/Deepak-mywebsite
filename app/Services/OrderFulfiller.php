<?php

namespace App\Services;

use App\Mail\AdminPurchaseMail;
use App\Mail\ProductDeliveryMail;
use App\Models\ProductOrder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

class OrderFulfiller
{
    /**
     * Mark every line in a checkout paid (idempotently) and email the buyer
     * their download links plus alert the store admin.
     */
    public function fulfillGroup(string $cartReference, ?string $cfOrderId = null): void
    {
        $orders = ProductOrder::group($cartReference);

        if ($orders->isEmpty()) {
            return;
        }

        $pending = $orders->where('payment_status', '!=', ProductOrder::STATUS_SUCCESS);

        if ($pending->isEmpty()) {
            return; // Already fulfilled — never double-send.
        }

        foreach ($pending as $order) {
            $order->markPaid($cfOrderId);
        }

        $this->sendNotifications(ProductOrder::group($cartReference));
    }

    public function fulfill(ProductOrder $order): void
    {
        $this->fulfillGroup($order->cart_reference ?: $order->order_reference);
    }

    /**
     * @param  Collection<int, ProductOrder>  $orders
     */
    public function sendNotifications(Collection $orders): void
    {
        $orders = $orders->values();
        $buyer = $orders->first()->customer_email;
        $admin = config('site.store_admin_email');

        try {
            Mail::to($buyer)->send(new ProductDeliveryMail($orders));
        } catch (\Throwable $e) {
            report($e);
        }

        try {
            Mail::to($admin)->send(new AdminPurchaseMail($orders));
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
