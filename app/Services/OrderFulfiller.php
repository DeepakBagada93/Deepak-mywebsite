<?php

namespace App\Services;

use App\Mail\AdminPurchaseMail;
use App\Mail\ProductDeliveryMail;
use App\Models\ProductOrder;
use App\Models\Subscriber;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

class OrderFulfiller
{
    /**
     * Mark every line in a checkout paid (idempotently) and email the buyer
     * their download links plus alert the store admin.
     */
    public function fulfillGroup(string $cartReference, ?string $orderId = null, ?string $paymentId = null, ?string $signature = null): void
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
            $order->markPaid($orderId, $paymentId, $signature);
        }

        $allOrders = ProductOrder::group($cartReference);

        $this->subscribeCustomerToNewsletter($allOrders);
        $this->sendNotifications($allOrders);
    }

    public function fulfill(ProductOrder $order): void
    {
        $this->fulfillGroup($order->cart_reference ?: $order->order_reference);
    }

    /**
     * Automatically enroll buyers in the newsletter for future product announcements
     * and engineering updates (idempotent; reactivates inactive subscribers).
     *
     * @param  Collection<int, ProductOrder>  $orders
     */
    public function subscribeCustomerToNewsletter(Collection $orders): void
    {
        $first = $orders->first();
        if (! $first || empty($first->customer_email)) {
            return;
        }

        $email = strtolower(trim((string) $first->customer_email));
        $name = trim((string) ($first->customer_name ?: ''));

        try {
            $subscriber = Subscriber::where('email', $email)->first();

            if (! $subscriber) {
                Subscriber::create([
                    'email' => $email,
                    'name' => $name ?: null,
                    'status' => 'active',
                    'source' => 'product_checkout',
                ]);
            } elseif (! $subscriber->isActive()) {
                $subscriber->resubscribe();
                if ($name && empty($subscriber->name)) {
                    $subscriber->update(['name' => $name]);
                }
            }
        } catch (\Throwable $e) {
            report($e);
        }
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
