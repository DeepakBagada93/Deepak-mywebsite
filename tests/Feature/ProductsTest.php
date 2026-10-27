<?php

namespace Tests\Feature;

use App\Mail\AdminPurchaseMail;
use App\Mail\ProductDeliveryMail;
use App\Models\ProductOrder;
use App\Models\Subscriber;
use App\Services\RazorpayService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ProductsTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_index_returns_success(): void
    {
        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertSee('The AI Systems Master Bundle');
        $response->assertSee('AI Agency Delivery OS');
        $response->assertSee('MCP Server Launch Kit');
        $response->assertSee('n8n Production Hardening Pack');
        $response->assertSee('AI Project Kickoff Skills Kit');
        $response->assertSee('Ad Creative Lab');
        $response->assertSee('Content Repurpose Engine');
        $response->assertSee('GST Invoice & HSN Compliance Kit');
        $response->assertSee('India Offer & Pricing Kit');
        $response->assertSee('ITC Recovery Desk');
        $response->assertSee('Agency Email Template Pack');
        $response->assertSee('Email Marketing &amp; Cold Outreach Engine', false);
        $response->assertSee('AI Email Automation for Agencies');
    }

    public function test_ads_creative_hub_alias_redirects_to_ad_creative_lab(): void
    {
        $response = $this->get('/products/ads-creative-hub');
        $response->assertRedirect('/products/ad-creative-lab');
        $response->assertStatus(301);

        $response = $this->get('/products/ads-creative-hub/checkout');
        $response->assertRedirect('/products/ad-creative-lab/checkout');
        $response->assertStatus(301);
    }

    public function test_store_page_renders_both_currencies(): void
    {
        $response = $this->get('/products');

        $response->assertStatus(200);
        $response->assertSee('data-store-currency', false);
        $response->assertSee('data-currency-set="USD"', false);
        // MCP Server Launch Kit is ₹3,499 / $49.
        $response->assertSee('$49');
    }

    public function test_usd_checkout_prices_in_us_dollars(): void
    {
        Mail::fake();
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret']);
        Http::fake(['*/orders' => Http::response(['id' => 'order_usd', 'amount' => 4900, 'currency' => 'USD', 'receipt' => 'rec_usd', 'status' => 'created'], 200)]);

        $response = $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'USD',
            'name' => 'US Buyer',
            'email' => 'us@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'checkout')
            ->assertJsonPath('currency', 'USD')
            ->assertJsonPath('amount', 4900)
            ->assertJsonPath('razorpay_order_id', 'order_usd');

        $order = ProductOrder::where('customer_email', 'us@example.com')->first();
        $this->assertNotNull($order);
        $this->assertSame('USD', $order->currency);
        $this->assertSame(49, (int) $order->amount);
    }

    public function test_unsupported_currency_is_rejected(): void
    {
        $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'EUR',
            'name' => 'X',
            'email' => 'x@example.com',
        ])->assertStatus(422)->assertJsonValidationErrors(['currency']);
    }

    public function test_checkout_sends_selected_currency_to_razorpay(): void
    {
        Mail::fake();
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret']);

        Http::fake([
            '*/orders' => Http::response(['id' => 'order_1', 'amount' => 4900, 'currency' => 'USD', 'receipt' => 'rec_1', 'status' => 'created'], 200),
        ]);

        $response = $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'USD',
            'name' => 'US Buyer',
            'email' => 'us2@example.com',
        ]);

        $response->assertStatus(200)->assertJsonPath('status', 'checkout');

        Http::assertSent(function ($request) {
            return str_contains($request->url(), '/orders')
                && ($request['currency'] ?? null) === 'USD'
                && (int) ($request['amount'] ?? 0) === 4900;
        });
    }

    public function test_every_product_detail_page_renders(): void
    {
        foreach (config('products') as $product) {
            $response = $this->get('/products/'.$product['slug']);
            $response->assertStatus(200);
            $response->assertSee($product['title']);
            $response->assertSee("What's inside", false);
        }
    }

    public function test_checkout_page_renders_for_every_product(): void
    {
        foreach (config('products') as $product) {
            $response = $this->get('/products/'.$product['slug'].'/checkout');
            $response->assertStatus(200);
            $response->assertSee($product['title']);
            $response->assertSee('Customer Details');
            $response->assertSee('Order Summary');
        }
    }

    public function test_checkout_page_renders_for_cart_with_multiple_items(): void
    {
        $response = $this->get('/products/checkout?items=mcp-server-launch-kit,agent-context-architect');
        $response->assertStatus(200);
        $response->assertSee('MCP Server Launch Kit');
        $response->assertSee('Agent Context Architect');
        $response->assertSee('Customer Details');
    }

    public function test_checkout_page_returns_404_for_unknown_product(): void
    {
        $this->get('/products/this-product-does-not-exist/checkout')->assertStatus(404);
    }

    public function test_non_existent_product_returns_404(): void
    {
        $this->get('/products/does-not-exist')->assertStatus(404);
    }

    public function test_free_product_checkout_fulfills_instantly(): void
    {
        Mail::fake();

        $response = $this->postJson('/products/checkout', [
            'product_slug' => 'ai-project-kickoff-skills-kit',
            'name' => 'Free Buyer',
            'email' => 'free@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'fulfilled')
            ->assertJsonPath('test_mode', false);

        $this->assertNotEmpty($response->json('download_url'));
        $this->assertDatabaseHas('product_orders', [
            'customer_email' => 'free@example.com',
            'payment_status' => ProductOrder::STATUS_SUCCESS,
        ]);

        Mail::assertSent(ProductDeliveryMail::class, fn ($mail) => $mail->hasTo('free@example.com'));
    }

    public function test_paid_product_checkout_with_razorpay_and_download(): void
    {
        Mail::fake();
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret']);

        Http::fake([
            '*/orders' => Http::response(['id' => 'order_paid', 'amount' => 249900, 'currency' => 'INR', 'receipt' => 'rec_paid', 'status' => 'created'], 200),
        ]);

        $response = $this->postJson('/products/checkout', [
            'product_slug' => 'n8n-hardening-pack',
            'currency' => 'INR',
            'name' => 'Paid Tester',
            'email' => 'paidtest@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'checkout')
            ->assertJsonPath('razorpay_order_id', 'order_paid')
            ->assertJsonPath('amount', 249900)
            ->assertJsonPath('currency', 'INR');

        $order = ProductOrder::where('customer_email', 'paidtest@example.com')->first();
        $this->assertNotNull($order);
        $this->assertSame(2499, (int) $order->amount);
        $this->assertSame('INR', $order->currency);

        // Fulfill the order and verify download token streams the actual zip file
        $order->markPaid('order_paid', 'pay_123');
        $downloadResponse = $this->get('/download/'.$order->download_token);
        $downloadResponse->assertStatus(200);
        $downloadResponse->assertHeader('Content-Type', 'application/zip');
    }

    public function test_paid_product_checkout_fails_safely_when_gateway_unconfigured(): void
    {
        config(['services.razorpay.key_id' => null, 'services.razorpay.key_secret' => null]);

        $response = $this->postJson('/products/checkout', [
            'product_slug' => 'mcp-server-launch-kit',
            'name' => 'Paid Buyer',
            'email' => 'paid@example.com',
        ]);

        $response->assertStatus(503)
            ->assertJsonPath('status', 'error');

        $this->assertDatabaseMissing('product_orders', [
            'customer_email' => 'paid@example.com',
            'payment_status' => ProductOrder::STATUS_SUCCESS,
        ]);
    }

    public function test_no_account_is_created_on_purchase(): void
    {
        Mail::fake();

        $this->postJson('/products/checkout', [
            'product_slug' => 'ai-project-kickoff-skills-kit',
            'name' => 'Guest Buyer',
            'email' => 'guest@example.com',
        ])->assertStatus(200);

        // Guest checkout — no user/login record is ever created.
        $this->assertDatabaseCount('users', 0);
    }

    public function test_multi_item_cart_checkout_groups_items_under_one_reference(): void
    {
        Mail::fake();
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret']);
        Http::fake(['*/orders' => Http::response(['id' => 'order_cart', 'amount' => 249900, 'currency' => 'INR', 'receipt' => 'rec_cart', 'status' => 'created'], 200)]);

        $response = $this->postJson('/products/checkout', [
            'items' => ['ai-project-kickoff-skills-kit', 'n8n-hardening-pack'],
            'name' => 'Cart Buyer',
            'email' => 'cart@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'checkout')
            ->assertJsonPath('razorpay_order_id', 'order_cart');

        $reference = $response->json('order_reference');
        $lines = ProductOrder::where('cart_reference', $reference)->get();

        $this->assertCount(2, $lines);
        $this->assertSame(2499, $lines->sum('amount'));
    }

    public function test_admin_receives_instant_purchase_email(): void
    {
        Mail::fake();

        $this->postJson('/products/checkout', [
            'items' => ['ai-project-kickoff-skills-kit'],
            'name' => 'Admin Alert Buyer',
            'email' => 'notify@example.com',
        ])->assertStatus(200);

        Mail::assertSent(AdminPurchaseMail::class, function ($mail) {
            return $mail->hasTo(config('site.email'));
        });
    }

    public function test_unknown_item_in_cart_is_rejected(): void
    {
        $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit', 'not-a-product'],
            'name' => 'X',
            'email' => 'x@example.com',
        ])->assertStatus(422);
    }

    public function test_track_page_renders(): void
    {
        $this->get('/products/track')->assertStatus(200)->assertSee('Find your downloads');
    }

    public function test_track_lookup_requires_matching_email_and_reference(): void
    {
        Mail::fake();

        $reference = $this->postJson('/products/checkout', [
            'items' => ['ai-project-kickoff-skills-kit'],
            'name' => 'Track Buyer',
            'email' => 'track@example.com',
        ])->json('order_reference');

        // Correct email + reference shows the download.
        $this->post('/products/track', ['email' => 'track@example.com', 'reference' => $reference])
            ->assertStatus(200)
            ->assertSee('AI Project Kickoff Skills Kit');

        // Wrong email finds nothing.
        $this->post('/products/track', ['email' => 'wrong@example.com', 'reference' => $reference])
            ->assertStatus(200)
            ->assertSee('No order found');
    }

    public function test_grouped_webhook_fulfills_every_line_and_alerts_admin(): void
    {
        Mail::fake();
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret', 'services.razorpay.webhook_secret' => 'test_secret']);

        $reference = ProductOrder::generateReference();
        foreach (['mcp-server-launch-kit', 'agent-context-architect'] as $slug) {
            $product = collect(config('products'))->firstWhere('slug', $slug);
            ProductOrder::create([
                'order_reference' => ProductOrder::generateReference(),
                'cart_reference' => $reference,
                'product_slug' => $slug,
                'product_title' => $product['title'],
                'customer_name' => 'Webhook Buyer',
                'customer_email' => 'wh@example.com',
                'amount' => $product['price_inr'],
                'payment_status' => ProductOrder::STATUS_PENDING,
            ]);
        }

        $body = json_encode([
            'event' => 'order.paid',
            'payload' => [
                'order' => [
                    'entity' => [
                        'id' => 'order_123',
                        'receipt' => $reference,
                    ],
                ],
                'payment' => [
                    'entity' => [
                        'id' => 'pay_123',
                    ],
                ],
            ],
        ]);
        $signature = hash_hmac('sha256', $body, 'test_secret');

        $this->call('POST', '/webhooks/razorpay', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_RAZORPAY_SIGNATURE' => $signature,
        ], $body)->assertStatus(200);

        $lines = ProductOrder::group($reference);
        $this->assertTrue($lines->every(fn ($o) => $o->payment_status === ProductOrder::STATUS_SUCCESS));
        $this->assertTrue($lines->every(fn ($o) => $o->download_token !== null));
        Mail::assertSent(ProductDeliveryMail::class);
        Mail::assertSent(AdminPurchaseMail::class);
    }

    public function test_webhook_rejects_bad_signature(): void
    {
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret']);

        $this->call('POST', '/webhooks/razorpay', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_RAZORPAY_SIGNATURE' => 'nonsense',
        ], '{"event":"order.paid"}')->assertStatus(401);
    }

    public function test_checkout_requires_valid_input(): void
    {
        $this->postJson('/products/checkout', ['product_slug' => 'mcp-server-launch-kit'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email']);

        $this->postJson('/products/checkout', [
            'product_slug' => 'not-a-real-product',
            'name' => 'X',
            'email' => 'x@example.com',
        ])->assertStatus(422);
    }

    public function test_invalid_download_token_is_forbidden(): void
    {
        $this->get('/download/this-token-does-not-exist')->assertStatus(403);
    }

    public function test_valid_download_token_streams_when_fulfilled(): void
    {
        $order = ProductOrder::create([
            'order_reference' => ProductOrder::generateReference(),
            'product_slug' => 'ai-project-kickoff-skills-kit',
            'product_title' => 'AI Project Kickoff Skills Kit',
            'customer_name' => 'Buyer',
            'customer_email' => 'buyer@example.com',
            'amount' => 0,
            'payment_status' => ProductOrder::STATUS_PENDING,
        ]);
        $order->markPaid();

        $response = $this->get('/download/'.$order->download_token);
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/zip');
        $this->assertSame(1, $order->fresh()->download_count);
    }

    public function test_store_inr_only_mode_hides_currency_switcher_and_rejects_usd(): void
    {
        config(['store.currencies' => [
            'INR' => [
                'symbol' => '₹',
                'locale' => 'en_IN',
                'minor' => 0,
                'label' => 'INR — Indian Rupee',
            ],
        ]]);

        $response = $this->get('/products');
        $response->assertStatus(200);
        $response->assertDontSee('data-currency-set="USD"', false);
        $response->assertSee('₹');

        // USD checkout must be rejected when store is locked to INR
        $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'USD',
            'name' => 'Buyer',
            'email' => 'buyer@example.com',
        ])->assertStatus(422)->assertJsonValidationErrors(['currency']);

        // INR checkout succeeds
        config(['services.razorpay.key_id' => 'test_key', 'services.razorpay.key_secret' => 'test_secret']);
        Http::fake(['*/orders' => Http::response(['id' => 'order_inr', 'amount' => 349900, 'currency' => 'INR', 'receipt' => 'rec_inr', 'status' => 'created'], 200)]);

        $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'INR',
            'name' => 'Buyer',
            'email' => 'inr-buyer@example.com',
        ])->assertStatus(200)->assertJsonPath('status', 'checkout');
    }

    public function test_razorpay_service_is_configured_with_credentials(): void
    {
        $razorpay = app(RazorpayService::class);
        config([
            'services.razorpay.key_id' => 'rzp_live_test123',
            'services.razorpay.key_secret' => 'test_secret_123',
        ]);

        $this->assertTrue($razorpay->isConfigured());
        $this->assertSame('rzp_live_test123', $razorpay->getKeyId());
    }

    public function test_verify_payment_endpoint_validates_signature_and_fulfills(): void
    {
        Mail::fake();
        config([
            'services.razorpay.key_id' => 'test_key',
            'services.razorpay.key_secret' => 'test_secret',
        ]);

        $reference = ProductOrder::generateReference();
        ProductOrder::create([
            'order_reference' => ProductOrder::generateReference(),
            'cart_reference' => $reference,
            'razorpay_order_id' => 'order_test_1',
            'product_slug' => 'n8n-hardening-pack',
            'product_title' => 'n8n Production Hardening Pack',
            'customer_name' => 'Verify User',
            'customer_email' => 'verify@example.com',
            'amount' => 2499,
            'payment_status' => ProductOrder::STATUS_PENDING,
        ]);

        $orderId = 'order_test_1';
        $paymentId = 'pay_test_999';
        $signature = hash_hmac('sha256', $orderId.'|'.$paymentId, 'test_secret');

        $response = $this->postJson('/products/verify', [
            'razorpay_order_id' => $orderId,
            'razorpay_payment_id' => $paymentId,
            'razorpay_signature' => $signature,
            'order_reference' => $reference,
        ]);

        $response->assertStatus(200)->assertJsonPath('status', 'success');

        $order = ProductOrder::where('cart_reference', $reference)->first();
        $this->assertSame(ProductOrder::STATUS_SUCCESS, $order->payment_status);
        $this->assertSame($paymentId, $order->razorpay_payment_id);
        $this->assertTrue($order->isDownloadable());
    }

    public function test_return_from_payment_reconciles_order_using_merchant_reference(): void
    {
        Mail::fake();
        config([
            'services.razorpay.key_id' => 'test_key',
            'services.razorpay.key_secret' => 'test_secret',
        ]);

        $reference = ProductOrder::generateReference();
        ProductOrder::create([
            'order_reference' => ProductOrder::generateReference(),
            'cart_reference' => $reference,
            'razorpay_order_id' => 'order_paid_sync',
            'product_slug' => 'n8n-hardening-pack',
            'product_title' => 'n8n Production Hardening Pack',
            'customer_name' => 'Paid User',
            'customer_email' => 'paiduser@example.com',
            'amount' => 2499,
            'payment_status' => ProductOrder::STATUS_PENDING,
        ]);

        Http::fake([
            '*/orders/order_paid_sync' => Http::response(['id' => 'order_paid_sync', 'status' => 'paid'], 200),
        ]);

        $response = $this->get('/products/return?order_id='.$reference);
        $response->assertStatus(200);

        $order = ProductOrder::where('cart_reference', $reference)->first();
        $this->assertSame(ProductOrder::STATUS_SUCCESS, $order->payment_status);
        $this->assertTrue($order->isDownloadable());
    }

    public function test_purchasing_customer_is_automatically_subscribed_to_newsletter(): void
    {
        Mail::fake();

        // 1. New subscriber created on free checkout
        $this->postJson('/products/checkout', [
            'product_slug' => 'ai-project-kickoff-skills-kit',
            'name' => 'Auto Subscriber',
            'email' => 'auto-sub@example.com',
        ])->assertStatus(200);

        $this->assertDatabaseHas('subscribers', [
            'email' => 'auto-sub@example.com',
            'name' => 'Auto Subscriber',
            'status' => 'active',
            'source' => 'product_checkout',
        ]);

        // 2. Reactivate unsubscribed subscriber on paid order return/fulfillment
        config([
            'services.razorpay.key_id' => 'test_key',
            'services.razorpay.key_secret' => 'test_secret',
        ]);

        $inactiveSubscriber = Subscriber::create([
            'email' => 'returning@example.com',
            'name' => 'Old Name',
            'status' => 'unsubscribed',
            'source' => 'website',
        ]);

        $reference = ProductOrder::generateReference();
        ProductOrder::create([
            'order_reference' => ProductOrder::generateReference(),
            'cart_reference' => $reference,
            'razorpay_order_id' => 'order_return_sub',
            'product_slug' => 'n8n-hardening-pack',
            'product_title' => 'n8n Production Hardening Pack',
            'customer_name' => 'Returning Customer',
            'customer_email' => 'returning@example.com',
            'amount' => 2499,
            'payment_status' => ProductOrder::STATUS_PENDING,
        ]);

        Http::fake([
            '*/orders/order_return_sub' => Http::response(['id' => 'order_return_sub', 'status' => 'paid'], 200),
        ]);

        $this->get('/products/return?order_id='.$reference)->assertStatus(200);

        $inactiveSubscriber->refresh();
        $this->assertSame('active', $inactiveSubscriber->status);
    }
}
