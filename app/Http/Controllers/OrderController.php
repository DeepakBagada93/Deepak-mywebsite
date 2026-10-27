<?php

namespace App\Http\Controllers;

use App\Models\ProductOrder;
use App\Services\OrderFulfiller;
use App\Services\RazorpayService;
use App\Support\Money;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(
        private readonly RazorpayService $razorpay,
        private readonly OrderFulfiller $fulfiller,
    ) {}

    public function initiate(Request $request)
    {
        $data = $request->validate([
            'items' => ['nullable', 'array', 'min:1', 'max:12'],
            'items.*' => ['required', 'string'],
            'product_slug' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:8'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        // Resolve and validate the checkout currency (INR default, USD for international).
        $currency = strtoupper((string) ($data['currency'] ?? Money::default()));
        if (! Money::supports($currency)) {
            throw ValidationException::withMessages([
                'currency' => 'Unsupported currency.',
            ]);
        }

        // Backwards compatibility with single-product "Buy now".
        if (empty($data['items']) && ! empty($data['product_slug'])) {
            $data['items'] = [$data['product_slug']];
        }

        if (empty($data['items'])) {
            throw ValidationException::withMessages(['items' => 'Please choose at least one product.']);
        }

        $catalog = collect(config('products'));
        $slugs = collect($data['items'])->unique()->values();

        $unknown = $slugs->reject(fn (string $slug) => $catalog->contains('slug', $slug));
        if ($unknown->isNotEmpty()) {
            throw ValidationException::withMessages(['items' => 'Unknown product: '.$unknown->first()]);
        }

        $products = $slugs->map(fn (string $slug) => $catalog->firstWhere('slug', $slug));
        $cartReference = ProductOrder::generateReference();

        $orders = $products->map(fn (array $product) => ProductOrder::create([
            'order_reference' => ProductOrder::generateReference(),
            'cart_reference' => $cartReference,
            'product_slug' => $product['slug'],
            'product_title' => $product['title'],
            'customer_name' => $data['name'],
            'customer_email' => $data['email'],
            'customer_phone' => $data['phone'] ?? null,
            'amount' => Money::priceFor($product, $currency),
            'currency' => $currency,
            'payment_status' => ProductOrder::STATUS_PENDING,
        ]));

        $total = $products->sum(fn (array $product) => Money::priceFor($product, $currency));
        $allFree = $products->every(fn (array $product) => $product['is_free']);

        // 100% Free downloads are fulfilled instantly (zero payment needed)
        if ($allFree) {
            $this->fulfiller->fulfillGroup($cartReference);

            return response()->json([
                'status' => 'fulfilled',
                'test_mode' => false,
                'message' => 'Enjoy your download'.($products->count() > 1 ? 's' : '').'.',
                'order_reference' => $cartReference,
                'downloads' => ProductOrder::group($cartReference)->map(fn (ProductOrder $order) => [
                    'title' => $order->product_title,
                    'url' => $order->download_url,
                ])->all(),
                'download_url' => ProductOrder::group($cartReference)->first()->download_url,
            ]);
        }

        // Paid products strictly go through Razorpay
        if (! $this->razorpay->isConfigured()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment gateway is currently unavailable. Please try again shortly or contact '.config('site.email').'.',
            ], 503);
        }

        $order = $this->razorpay->createOrder($cartReference, $total, $currency, [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        if (! $order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not start checkout. Please try again or email '.config('site.email').'.',
            ], 502);
        }

        ProductOrder::where('cart_reference', $cartReference)
            ->update([
                'razorpay_order_id' => $order['id'],
                'cf_order_id' => $order['id'],
            ]);

        return response()->json([
            'status' => 'checkout',
            'razorpay_order_id' => $order['id'],
            'razorpay_key' => $this->razorpay->getKeyId(),
            'amount' => $order['amount'],
            'currency' => $order['currency'],
            'order_reference' => $cartReference,
            'customer' => [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? '',
            ],
        ]);
    }

    /**
     * Synchronous payment verification endpoint called by client JS upon Razorpay checkout completion.
     */
    public function verifyPayment(Request $request)
    {
        $data = $request->validate([
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
            'order_reference' => ['nullable', 'string'],
        ]);

        $orderId = $data['razorpay_order_id'];
        $paymentId = $data['razorpay_payment_id'];
        $signature = $data['razorpay_signature'];
        $reference = $data['order_reference'] ?? null;

        if (! $this->razorpay->verifyPaymentSignature($orderId, $paymentId, $signature)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment verification failed. Please contact support.',
            ], 400);
        }

        $orders = null;
        if ($reference) {
            $orders = ProductOrder::group($reference);
        }
        if (! $orders || $orders->isEmpty()) {
            $orders = ProductOrder::where('razorpay_order_id', $orderId)
                ->orWhere('cf_order_id', $orderId)
                ->get();
        }

        if (! $orders || $orders->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found.',
            ], 404);
        }

        $cartReference = $orders->first()->cart_reference;
        $this->fulfiller->fulfillGroup($cartReference, $orderId, $paymentId, $signature);

        return response()->json([
            'status' => 'success',
            'redirect_url' => route('products.return', ['order_id' => $cartReference]),
        ]);
    }

    /**
     * Razorpay redirects or user returns here after checkout.
     * We reconcile the authoritative order status synchronously.
     */
    public function returnFromPayment(Request $request)
    {
        $reference = (string) ($request->query('order_id') ?: $request->query('razorpay_order_id'));
        $orders = ProductOrder::group($reference);

        if ($orders->isEmpty()) {
            $orders = ProductOrder::where('razorpay_order_id', $reference)
                ->orWhere('cf_order_id', $reference)
                ->get();
        }

        if ($orders->isEmpty()) {
            return redirect()->route('products.index');
        }

        $first = $orders->first();
        $cartReference = $first->cart_reference;

        if ($first->payment_status === ProductOrder::STATUS_PENDING && $this->razorpay->isConfigured()) {
            $rzpPaymentId = (string) $request->query('razorpay_payment_id');
            $rzpOrderId = (string) $request->query('razorpay_order_id');
            $rzpSignature = (string) $request->query('razorpay_signature');

            // 1. If payment verification params are present, verify signature
            if ($rzpPaymentId && $rzpOrderId && $rzpSignature) {
                if ($this->razorpay->verifyPaymentSignature($rzpOrderId, $rzpPaymentId, $rzpSignature)) {
                    $this->fulfiller->fulfillGroup($cartReference, $rzpOrderId, $rzpPaymentId, $rzpSignature);
                    $orders = ProductOrder::group($cartReference);
                }
            } else {
                // 2. Otherwise fetch order status from Razorpay API
                $lookupOrderId = $first->razorpay_order_id ?: $first->cf_order_id;
                if ($lookupOrderId) {
                    $rzpOrder = $this->razorpay->fetchOrder($lookupOrderId);
                    if ($rzpOrder && ($rzpOrder['status'] ?? null) === 'paid') {
                        $this->fulfiller->fulfillGroup($cartReference, $lookupOrderId);
                        $orders = ProductOrder::group($cartReference);
                    } elseif ($rzpOrder && ($rzpOrder['status'] ?? null) === 'attempted' && (int) ($rzpOrder['attempts'] ?? 0) > 3) {
                        ProductOrder::where('cart_reference', $cartReference)
                            ->update(['payment_status' => ProductOrder::STATUS_FAILED]);
                        $orders = ProductOrder::group($cartReference);
                    }
                }
            }
        }

        return view('products.return', [
            'orders' => $orders,
            'order' => $orders->first(),
        ]);
    }

    /**
     * Guest order tracking — no account needed, just email + order reference.
     */
    public function track(Request $request)
    {
        $orders = null;
        $searched = false;

        if ($request->isMethod('post')) {
            $searched = true;
            $data = $request->validate([
                'email' => ['required', 'email'],
                'reference' => ['required', 'string'],
            ]);

            $orders = ProductOrder::where('cart_reference', trim($data['reference']))
                ->where('customer_email', $data['email'])
                ->orderBy('id')
                ->get();

            if ($orders->isEmpty()) {
                $orders = null;
            }
        }

        $site = config('site');
        $head = [
            'title' => 'Track your order — Digital Store | '.$site['name'],
            'description' => 'Look up your digital product order and re-open your secure download links with your email and order reference. No account needed.',
            'canonical' => rtrim($site['url'], '/').'/products/track',
            'robots' => 'noindex, follow',
        ];

        return view('products.track', compact('site', 'head', 'orders', 'searched'));
    }

    /**
     * Dedicated, responsive checkout page for single products and multi-item carts.
     */
    public function showCheckout(Request $request, ?string $slug = null)
    {
        $aliases = [
            'ads-creative-hub' => 'ad-creative-lab',
            'ad-creative-hub' => 'ad-creative-lab',
            'ads-creative-lab' => 'ad-creative-lab',
            'ai-systems-master-bundle' => 'agent-skills-master-bundle',
        ];

        if ($slug && isset($aliases[$slug])) {
            return redirect()->route('products.checkout.single', $aliases[$slug], 301);
        }

        $catalog = collect(config('products'));
        $site = config('site');

        $slugParam = $slug ?: $request->query('product');
        $itemsParam = $request->query('items');

        $selectedSlugs = collect();
        if ($slugParam) {
            $selectedSlugs->push($slugParam);
        } elseif ($itemsParam) {
            $selectedSlugs = collect(explode(',', (string) $itemsParam))
                ->map(fn ($s) => trim($s))
                ->filter();
        }

        // If no product is chosen, fallback to first product
        if ($selectedSlugs->isEmpty()) {
            $selectedSlugs->push($catalog->first()['slug']);
        }

        $products = $selectedSlugs->map(fn ($s) => $catalog->firstWhere('slug', $s))->filter()->values();
        if ($products->isEmpty()) {
            abort(404, 'Product not found.');
        }

        $product = $products->first();
        $currency = Money::default();

        $head = [
            'title' => $products->count() === 1
                ? 'Checkout: '.$product['title'].' — '.$site['name']
                : 'Checkout ('.$products->count().' items) — '.$site['name'],
            'description' => 'Secure checkout for '.($products->count() === 1 ? $product['title'] : 'selected engineering toolkits').'. Instant digital delivery via Razorpay.',
            'canonical' => $products->count() === 1
                ? route('products.checkout.single', $product['slug'])
                : route('products.checkout.page'),
            'robots' => 'noindex, nofollow',
        ];

        return view('products.checkout', compact('site', 'head', 'products', 'product', 'catalog', 'currency'));
    }
}
