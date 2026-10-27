<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class RazorpayService
{
    public function isConfigured(): bool
    {
        return filled(config('services.razorpay.key_id'))
            && filled(config('services.razorpay.key_secret'));
    }

    public function getKeyId(): ?string
    {
        return config('services.razorpay.key_id');
    }

    protected function getKeySecret(): ?string
    {
        return config('services.razorpay.key_secret');
    }

    /**
     * Create a Razorpay Order for a checkout group.
     *
     * @param  array{name?:string,email?:string,phone?:?string}  $customer
     * @return array{id:string,amount:int,currency:string,receipt:string,status:string}|null
     */
    public function createOrder(string $receipt, int|float $amount, string $currency = 'INR', array $customer = []): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $currency = strtoupper(trim($currency ?: 'INR'));
        // Razorpay amounts are passed in the smallest currency unit (paise for INR, cents for USD)
        $amountInSubunits = (int) round($amount * 100);

        $payload = [
            'amount' => $amountInSubunits,
            'currency' => $currency,
            'receipt' => substr($receipt, 0, 40),
            'notes' => [
                'cart_reference' => $receipt,
                'customer_name' => substr((string) ($customer['name'] ?? ''), 0, 100),
                'customer_email' => substr((string) ($customer['email'] ?? ''), 0, 100),
                'customer_phone' => substr((string) ($customer['phone'] ?? ''), 0, 20),
            ],
        ];

        $response = $this->client()->post('/orders', $payload);

        if ($response->failed()) {
            report(new \RuntimeException('Razorpay order creation failed: '.$response->body()));

            return null;
        }

        return [
            'id' => (string) $response->json('id'),
            'amount' => (int) $response->json('amount'),
            'currency' => (string) $response->json('currency'),
            'receipt' => (string) $response->json('receipt'),
            'status' => (string) $response->json('status'),
        ];
    }

    /**
     * Create a Razorpay Hosted Payment Link for a dedicated, seamless checkout page.
     *
     * @param  array{name?:string,email?:string,phone?:?string}  $customer
     * @return array{id:string,short_url:string,amount:int,currency:string,status:string}|null
     */
    public function createPaymentLink(
        string $reference,
        int|float $amount,
        string $currency = 'USD',
        string $description = 'Digital Product Purchase',
        array $customer = []
    ): ?array {
        if (! $this->isConfigured()) {
            return null;
        }

        $currency = strtoupper(trim($currency ?: 'USD'));
        $amountInSubunits = (int) round($amount * 100);

        $contact = trim((string) ($customer['phone'] ?? ''));
        if ($contact && strlen($contact) === 10 && ! str_starts_with($contact, '+')) {
            $contact = '+91'.$contact;
        }

        $payload = [
            'amount' => $amountInSubunits,
            'currency' => $currency,
            'accept_partial' => false,
            'reference_id' => substr($reference, 0, 40),
            'description' => substr($description, 0, 200),
            'customer' => array_filter([
                'name' => substr((string) ($customer['name'] ?? ''), 0, 100),
                'email' => substr((string) ($customer['email'] ?? ''), 0, 100),
                'contact' => $contact ?: null,
            ]),
            'notify' => [
                'sms' => false,
                'email' => false,
            ],
            'reminder_enable' => false,
            'callback_url' => url('/products/return'),
            'callback_method' => 'get',
            'notes' => [
                'cart_reference' => $reference,
                'customer_name' => substr((string) ($customer['name'] ?? ''), 0, 100),
                'customer_email' => substr((string) ($customer['email'] ?? ''), 0, 100),
            ],
        ];

        $response = $this->client()->post('/payment_links', $payload);

        if ($response->failed()) {
            report(new \RuntimeException('Razorpay payment link creation failed: '.$response->body()));

            return null;
        }

        return [
            'id' => (string) $response->json('id'),
            'short_url' => (string) $response->json('short_url'),
            'amount' => (int) $response->json('amount'),
            'currency' => (string) $response->json('currency'),
            'status' => (string) $response->json('status'),
        ];
    }

    /**
     * Fetch the authoritative order status from Razorpay.
     */
    public function fetchOrder(string $orderId): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $response = $this->client()->get('/orders/'.$orderId);

        if ($response->failed()) {
            report(new \RuntimeException('Razorpay fetch order failed: '.$response->body()));

            return null;
        }

        return $response->json();
    }

    /**
     * Fetch payment details from Razorpay.
     */
    public function fetchPayment(string $paymentId): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $response = $this->client()->get('/payments/'.$paymentId);

        if ($response->failed()) {
            report(new \RuntimeException('Razorpay fetch payment failed: '.$response->body()));

            return null;
        }

        return $response->json();
    }

    /**
     * Verify payment checkout signature using HMAC-SHA256.
     * signature = hmac_sha256(order_id + "|" + payment_id, secret)
     */
    public function verifyPaymentSignature(string $orderId, string $paymentId, string $signature): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $expected = hash_hmac('sha256', $orderId.'|'.$paymentId, (string) $this->getKeySecret());

        return hash_equals($expected, $signature);
    }

    /**
     * Verify a Razorpay webhook signature (HMAC-SHA256 of raw body).
     */
    public function verifyWebhookSignature(string $rawBody, string $signature, ?string $secret = null): bool
    {
        $webhookSecret = $secret ?: config('services.razorpay.webhook_secret') ?: $this->getKeySecret();

        if (empty($webhookSecret)) {
            return false;
        }

        $expected = hash_hmac('sha256', $rawBody, $webhookSecret);

        return hash_equals($expected, $signature);
    }

    private function client(): PendingRequest
    {
        return Http::baseUrl('https://api.razorpay.com/v1')
            ->withBasicAuth((string) $this->getKeyId(), (string) $this->getKeySecret())
            ->acceptJson()
            ->timeout(20);
    }
}
