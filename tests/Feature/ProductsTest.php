<?php

namespace Tests\Feature;

use App\Mail\AdminPurchaseMail;
use App\Mail\ProductDeliveryMail;
use App\Models\ProductOrder;
use App\Services\CashfreeService;
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
        $response->assertSee('Live Payment Verification Test Pack');
        $response->assertSee('AI Project Kickoff Skills Kit');
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

        $response = $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'USD',
            'name' => 'US Buyer',
            'email' => 'us@example.com',
        ]);

        $response->assertStatus(200)->assertJsonPath('status', 'fulfilled');

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

    public function test_checkout_sends_selected_currency_to_cashfree(): void
    {
        Mail::fake();
        config(['services.cashfree.app_id' => 'test_app', 'services.cashfree.secret_key' => 'test_secret']);

        Http::fake([
            '*/orders' => Http::response(['payment_session_id' => 'ps_1', 'cf_order_id' => 'cf_1'], 200),
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
                && ($request['order_currency'] ?? null) === 'USD'
                && (float) ($request['order_amount'] ?? 0) === 49.0;
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

    public function test_demo_five_rupee_product_checkout_and_download(): void
    {
        Mail::fake();

        $response = $this->postJson('/products/checkout', [
            'product_slug' => 'live-payment-verification-kit',
            'currency' => 'INR',
            'name' => 'Five Rupee Tester',
            'email' => 'test5@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'fulfilled')
            ->assertJsonPath('test_mode', true);

        $order = ProductOrder::where('customer_email', 'test5@example.com')->first();
        $this->assertNotNull($order);
        $this->assertSame(5, (int) $order->amount);
        $this->assertSame('INR', $order->currency);
        $this->assertTrue($order->isDownloadable());

        // Verify download token streams the actual zip file
        $downloadResponse = $this->get('/download/'.$order->download_token);
        $downloadResponse->assertStatus(200);
        $downloadResponse->assertHeader('Content-Type', 'application/zip');
    }

    public function test_paid_product_checkout_fulfills_in_test_mode_when_gateway_unconfigured(): void
    {
        Mail::fake();

        $response = $this->postJson('/products/checkout', [
            'product_slug' => 'mcp-server-launch-kit',
            'name' => 'Paid Buyer',
            'email' => 'paid@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'fulfilled')
            ->assertJsonPath('test_mode', true);

        $order = ProductOrder::where('customer_email', 'paid@example.com')->first();
        $this->assertNotNull($order);
        $this->assertSame(3499, $order->amount);
        $this->assertTrue($order->isDownloadable());

        Mail::assertSent(ProductDeliveryMail::class, fn ($mail) => $mail->hasTo('paid@example.com'));
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

        $response = $this->postJson('/products/checkout', [
            'items' => ['ai-project-kickoff-skills-kit', 'n8n-hardening-pack'],
            'name' => 'Cart Buyer',
            'email' => 'cart@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'fulfilled')
            ->assertJsonCount(2, 'downloads');

        $reference = $response->json('order_reference');
        $lines = ProductOrder::where('cart_reference', $reference)->get();

        $this->assertCount(2, $lines);
        $this->assertTrue($lines->every(fn ($o) => $o->payment_status === ProductOrder::STATUS_SUCCESS));
        $this->assertSame(2499, $lines->sum('amount'));

        Mail::assertSent(ProductDeliveryMail::class, fn ($mail) => $mail->hasTo('cart@example.com') && $mail->orders->count() === 2);
    }

    public function test_admin_receives_instant_purchase_email(): void
    {
        Mail::fake();

        $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'name' => 'Admin Alert Buyer',
            'email' => 'notify@example.com',
        ])->assertStatus(200);

        Mail::assertSent(AdminPurchaseMail::class, function ($mail) {
            return $mail->hasTo(config('site.email')) && $mail->orders->sum('amount') === 3499;
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
        config(['services.cashfree.app_id' => 'test_app', 'services.cashfree.secret_key' => 'test_secret']);

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
            'type' => 'PAYMENT_SUCCESS_WEBHOOK',
            'data' => ['order' => ['order_id' => $reference, 'cf_order_id' => 'cf_123']],
        ]);
        $timestamp = (string) time();
        $signature = base64_encode(hash_hmac('sha256', $timestamp.$body, 'test_secret', true));

        $this->call('POST', '/webhooks/cashfree', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_WEBHOOK_SIGNATURE' => $signature,
            'HTTP_X_WEBHOOK_TIMESTAMP' => $timestamp,
        ], $body)->assertStatus(200);

        $lines = ProductOrder::group($reference);
        $this->assertTrue($lines->every(fn ($o) => $o->payment_status === ProductOrder::STATUS_SUCCESS));
        $this->assertTrue($lines->every(fn ($o) => $o->download_token !== null));
        Mail::assertSent(ProductDeliveryMail::class);
        Mail::assertSent(AdminPurchaseMail::class);
    }

    public function test_webhook_rejects_bad_signature(): void
    {
        config(['services.cashfree.app_id' => 'test_app', 'services.cashfree.secret_key' => 'test_secret']);

        $this->call('POST', '/webhooks/cashfree', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_WEBHOOK_SIGNATURE' => 'nonsense',
            'HTTP_X_WEBHOOK_TIMESTAMP' => (string) time(),
        ], '{"type":"PAYMENT_SUCCESS_WEBHOOK"}')->assertStatus(401);
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
        $this->postJson('/products/checkout', [
            'items' => ['mcp-server-launch-kit'],
            'currency' => 'INR',
            'name' => 'Buyer',
            'email' => 'inr-buyer@example.com',
        ])->assertStatus(200);
    }

    public function test_cashfree_service_is_configured_with_live_credentials(): void
    {
        $cashfree = app(CashfreeService::class);
        // Under testing environment, verify service reads config
        config([
            'services.cashfree.app_id' => 'test_app_id_mock',
            'services.cashfree.secret_key' => 'test_secret_key_mock',
            'services.cashfree.env' => 'production',
            'services.cashfree.base_url' => 'https://api.cashfree.com/pg',
        ]);

        $this->assertTrue($cashfree->isConfigured());
        $this->assertSame('production', config('services.cashfree.env'));
        $this->assertSame('https://api.cashfree.com/pg', config('services.cashfree.base_url'));
    }

    public function test_cashfree_order_meta_urls_always_use_https(): void
    {
        config([
            'services.cashfree.app_id' => 'test_app',
            'services.cashfree.secret_key' => 'test_secret',
            'site.url' => 'http://127.0.0.1:8000',
        ]);

        Http::fake([
            '*/orders' => Http::response(['payment_session_id' => 'ps_https', 'cf_order_id' => 'cf_https'], 200),
        ]);

        $cashfree = app(CashfreeService::class);
        $res = $cashfree->createPaymentSession('REF-123', 5, 'INR', [
            'name' => 'Tester',
            'email' => 't@example.com',
            'phone' => '9999999999',
        ]);

        $this->assertNotNull($res);
        $this->assertSame('ps_https', $res['payment_session_id']);

        Http::assertSent(function ($request) {
            $returnUrl = (string) ($request['order_meta']['return_url'] ?? '');
            $notifyUrl = (string) ($request['order_meta']['notify_url'] ?? '');

            return str_starts_with($returnUrl, 'https://') && str_starts_with($notifyUrl, 'https://');
        });
    }

    public function test_return_from_payment_reconciles_order_using_merchant_reference(): void
    {
        Mail::fake();
        config([
            'services.cashfree.app_id' => 'test_app',
            'services.cashfree.secret_key' => 'test_secret',
        ]);

        $reference = ProductOrder::generateReference();
        ProductOrder::create([
            'order_reference' => ProductOrder::generateReference(),
            'cart_reference' => $reference,
            'product_slug' => 'live-payment-verification-kit',
            'product_title' => 'Live Payment Verification Test Pack',
            'customer_name' => 'Paid User',
            'customer_email' => 'paiduser@example.com',
            'amount' => 5,
            'payment_status' => ProductOrder::STATUS_PENDING,
        ]);

        Http::fake([
            '*/orders/'.$reference => Http::response(['order_status' => 'PAID'], 200),
        ]);

        $response = $this->get('/products/return?order_id='.$reference);
        $response->assertStatus(200);

        $order = ProductOrder::where('cart_reference', $reference)->first();
        $this->assertSame(ProductOrder::STATUS_SUCCESS, $order->payment_status);
        $this->assertTrue($order->isDownloadable());
    }
}
