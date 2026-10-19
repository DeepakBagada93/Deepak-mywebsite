<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class CashfreeService
{
    public function isConfigured(): bool
    {
        return filled(config('services.cashfree.app_id'))
            && filled(config('services.cashfree.secret_key'));
    }

    /**
     * Create a Cashfree PG order for a checkout group.
     *
     * @param  array{name:string,email:string,phone:?string}  $customer
     * @return array{payment_session_id:string,cf_order_id:string}|null
     */
    public function createPaymentSession(string $orderReference, int $amount, string $currency = 'INR', array $customer = []): ?array
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $baseUrl = rtrim(config('site.url') ?: config('app.url') ?: 'https://deepakbagada.in', '/');
        if (str_starts_with($baseUrl, 'http://')) {
            $baseUrl = 'https://'.substr($baseUrl, 7);
        } elseif (! str_starts_with($baseUrl, 'https://')) {
            $baseUrl = 'https://'.$baseUrl;
        }

        $response = $this->client()->post('/orders', [
            'order_id' => $orderReference,
            'order_amount' => (float) $amount,
            'order_currency' => strtoupper($currency) ?: 'INR',
            'customer_details' => [
                'customer_id' => 'cust_'.substr(md5($customer['email']), 0, 12),
                'customer_name' => $customer['name'],
                'customer_email' => $customer['email'],
                'customer_phone' => $customer['phone'] ?: '9999999999',
            ],
            'order_meta' => [
                'return_url' => $baseUrl.'/products/return?order_id={order_id}',
                'notify_url' => $baseUrl.'/webhooks/cashfree',
            ],
        ]);

        if ($response->failed()) {
            report(new \RuntimeException('Cashfree order creation failed: '.$response->body()));

            return null;
        }

        return [
            'payment_session_id' => (string) $response->json('payment_session_id'),
            'cf_order_id' => (string) $response->json('cf_order_id'),
        ];
    }

    /**
     * Fetch the authoritative order status (webhook fallback).
     * Cashfree PG API expects the merchant's order_id.
     */
    public function fetchOrderStatus(string $orderId): ?string
    {
        if (! $this->isConfigured()) {
            return null;
        }

        $response = $this->client()->get('/orders/'.$orderId);

        if ($response->failed()) {
            report(new \RuntimeException('Cashfree status fetch failed: '.$response->body()));

            return null;
        }

        return $response->json('order_status');
    }

    /**
     * Verify a Cashfree webhook signature (HMAC-SHA256 of timestamp + body).
     */
    public function verifyWebhookSignature(string $signature, string $timestamp, string $rawBody): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        $expected = base64_encode(hash_hmac('sha256', $timestamp.$rawBody, config('services.cashfree.secret_key'), true));

        return hash_equals($expected, $signature);
    }

    private function client(): PendingRequest
    {
        return Http::baseUrl(rtrim(config('services.cashfree.base_url'), '/'))
            ->withHeaders([
                'x-client-id' => config('services.cashfree.app_id'),
                'x-client-secret' => config('services.cashfree.secret_key'),
                'x-api-version' => config('services.cashfree.api_version'),
                'Content-Type' => 'application/json',
            ])
            ->acceptJson()
            ->timeout(20);
    }
}
