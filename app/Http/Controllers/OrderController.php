<?php

namespace App\Http\Controllers;

use App\Models\ProductOrder;
use App\Services\OrderFulfiller;
use App\Services\RazorpayService;
use App\Support\Money;
use App\Support\StoreCurrency;
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
        if ($request->filled('phone')) {
            $rawPhone = trim((string) $request->input('phone'));
            if (str_contains($rawPhone, '@') || filter_var($rawPhone, FILTER_VALIDATE_EMAIL)) {
                throw ValidationException::withMessages([
                    'phone' => 'Please provide a valid phone number. An email address cannot be used as a phone number.',
                ]);
            }
        }

        $data = $request->validate([
            'items' => ['nullable', 'array', 'min:1', 'max:12'],
            'items.*' => ['required', 'string'],
            'product_slug' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'max:8'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:25', 'regex:/^[0-9+\s()\-]{7,25}$/'],
        ], [
            'phone.regex' => 'Please enter a valid phone number (digits, +, hyphens, or parentheses only).',
        ]);

        // Resolve and validate the checkout currency (defaults to StoreCurrency::current($request)).
        $currency = strtoupper((string) (! empty($data['currency']) ? $data['currency'] : StoreCurrency::current($request)));
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

        $description = $products->pluck('title')->implode(', ');
        $paymentLink = $this->razorpay->createPaymentLink(
            $cartReference,
            $total,
            $currency,
            $description,
            [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
            ]
        );

        $orderId = $paymentLink['id'] ?? null;
        $paymentUrl = $paymentLink['short_url'] ?? null;

        // Fallback to standard order if payment link creation is not supported
        if (! $orderId) {
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

            $orderId = $order['id'];
        }

        ProductOrder::where('cart_reference', $cartReference)
            ->update([
                'razorpay_order_id' => $orderId,
                'cf_order_id' => $orderId,
            ]);

        return response()->json([
            'status' => 'checkout',
            'payment_url' => $paymentUrl,
            'razorpay_order_id' => $orderId,
            'razorpay_key' => $this->razorpay->getKeyId(),
            'amount' => (int) round($total * 100),
            'currency' => $currency,
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

        $orderId = trim($data['razorpay_order_id']);
        $paymentId = trim($data['razorpay_payment_id']);
        $signature = trim($data['razorpay_signature']);
        $reference = isset($data['order_reference']) ? trim($data['order_reference']) : null;

        // 1. Verify HMAC-SHA256 signature
        if (! $this->razorpay->verifyPaymentSignature($orderId, $paymentId, $signature)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment verification failed. Invalid signature.',
            ], 400);
        }

        // 2. Anti-Replay Gate: Ensure this payment hasn't already been redeemed for any other checkout
        $alreadyUsed = ProductOrder::where('razorpay_payment_id', $paymentId)
            ->when($reference, fn ($q) => $q->where('cart_reference', '!=', $reference))
            ->where('payment_status', ProductOrder::STATUS_SUCCESS)
            ->exists();

        if ($alreadyUsed) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment already redeemed.',
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

        $first = $orders->first();
        $cartReference = $first->cart_reference;

        // 3. Strict Order ID binding: Must match registered gateway order
        if ($first->razorpay_order_id && $first->razorpay_order_id !== $orderId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order mismatch. Payment does not belong to this checkout.',
            ], 400);
        }

        // 4. Authoritative Gateway Verification: Validate status, amount, and currency via Razorpay API if available
        $payment = $this->razorpay->fetchPayment($paymentId);
        if ($payment) {
            if (! in_array($payment['status'] ?? '', ['captured', 'authorized'], true)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment has not been captured.',
                ], 400);
            }

            $expectedSubunits = (int) round($orders->sum('amount') * 100);
            $expectedCurrency = strtoupper((string) $first->currency);
            $paidSubunits = (int) ($payment['amount'] ?? 0);
            $paidCurrency = strtoupper((string) ($payment['currency'] ?? ''));

            if (($paidSubunits > 0 && $paidSubunits < $expectedSubunits) || ($paidCurrency && $paidCurrency !== $expectedCurrency)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment amount or currency mismatch.',
                ], 400);
            }

            // 5. Notes reference binding check if present
            $noteRef = $payment['notes']['cart_reference'] ?? null;
            if ($noteRef && $noteRef !== $cartReference) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment reference mismatch.',
                ], 400);
            }
        }

        $this->fulfiller->fulfillGroup($cartReference, $orderId, $paymentId, $signature);

        return response()->json([
            'status' => 'success',
            'redirect_url' => route('products.return', ['order_id' => $cartReference]),
        ]);
    }

    /**
     * Razorpay redirects or user returns here after checkout.
     * We reconcile the authoritative order status synchronously with strict anti-bypass gates.
     */
    public function returnFromPayment(Request $request)
    {
        $reference = (string) (
            $request->query('order_id')
            ?: $request->query('razorpay_payment_link_reference_id')
            ?: $request->query('razorpay_order_id')
        );
        $orders = ProductOrder::group($reference);

        if ($orders->isEmpty()) {
            $plinkId = (string) $request->query('razorpay_payment_link_id');
            $orders = ProductOrder::where('razorpay_order_id', $reference)
                ->orWhere('cf_order_id', $reference)
                ->when($plinkId, fn ($q) => $q->orWhere('razorpay_order_id', $plinkId))
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
            $rzpPlinkStatus = (string) $request->query('razorpay_payment_link_status');
            $rzpPlinkId = (string) $request->query('razorpay_payment_link_id');

            $expectedSubunits = (int) round($orders->sum('amount') * 100);
            $expectedCurrency = strtoupper((string) $first->currency);

            // 1. If returning from Payment Link with captured payment
            if ($rzpPaymentId && ($rzpPlinkStatus === 'paid' || $rzpPlinkId)) {
                // Anti-Replay check: Ensure this payment hasn't already been used in another order
                $alreadyUsed = ProductOrder::where('razorpay_payment_id', $rzpPaymentId)
                    ->where('cart_reference', '!=', $cartReference)
                    ->where('payment_status', ProductOrder::STATUS_SUCCESS)
                    ->exists();

                if (! $alreadyUsed) {
                    $payment = $this->razorpay->fetchPayment($rzpPaymentId);

                    if ($payment && in_array($payment['status'] ?? '', ['captured', 'authorized'], true)) {
                        $paidSubunits = (int) ($payment['amount'] ?? 0);
                        $paidCurrency = strtoupper((string) ($payment['currency'] ?? ''));
                        $noteRef = (string) ($payment['notes']['cart_reference'] ?? '');

                        // Must verify amount & currency
                        $amountValid = ($paidSubunits >= $expectedSubunits) && ($paidCurrency === $expectedCurrency);

                        // Must verify reference binding:
                        // notes.cart_reference matches OR payment order_id matches registered order id
                        // OR payment link reference matches cart_reference
                        $linkValid = false;
                        if ($noteRef === $cartReference) {
                            $linkValid = true;
                        } elseif (! empty($payment['order_id']) && $payment['order_id'] === $first->razorpay_order_id) {
                            $linkValid = true;
                        } elseif ($rzpPlinkId || str_starts_with((string) $first->razorpay_order_id, 'plink_')) {
                            $checkPlinkId = $rzpPlinkId ?: $first->razorpay_order_id;
                            $plink = $this->razorpay->fetchPaymentLink($checkPlinkId);
                            if ($plink && ($plink['reference_id'] ?? null) === $cartReference) {
                                $linkValid = true;
                            }
                        }

                        if ($amountValid && $linkValid) {
                            $this->fulfiller->fulfillGroup($cartReference, $rzpPlinkId ?: $rzpOrderId, $rzpPaymentId, $rzpSignature);
                            $orders = ProductOrder::group($cartReference);
                        }
                    }
                }
            }
            // 2. Standard modal signature verification
            elseif ($rzpPaymentId && $rzpOrderId && $rzpSignature) {
                // Anti-Replay check
                $alreadyUsed = ProductOrder::where('razorpay_payment_id', $rzpPaymentId)
                    ->where('cart_reference', '!=', $cartReference)
                    ->where('payment_status', ProductOrder::STATUS_SUCCESS)
                    ->exists();

                // Order binding check
                $orderMatches = empty($first->razorpay_order_id) || $first->razorpay_order_id === $rzpOrderId;

                if (! $alreadyUsed && $orderMatches && $this->razorpay->verifyPaymentSignature($rzpOrderId, $rzpPaymentId, $rzpSignature)) {
                    $payment = $this->razorpay->fetchPayment($rzpPaymentId);
                    if ($payment && in_array($payment['status'] ?? '', ['captured', 'authorized'], true)) {
                        $paidSubunits = (int) ($payment['amount'] ?? 0);
                        $paidCurrency = strtoupper((string) ($payment['currency'] ?? ''));

                        if ($paidSubunits >= $expectedSubunits && $paidCurrency === $expectedCurrency) {
                            $this->fulfiller->fulfillGroup($cartReference, $rzpOrderId, $rzpPaymentId, $rzpSignature);
                            $orders = ProductOrder::group($cartReference);
                        }
                    }
                }
            } else {
                // 3. Fallback: authoritative check via gateway API
                $lookupOrderId = $first->razorpay_order_id ?: $first->cf_order_id;
                if ($lookupOrderId) {
                    if (str_starts_with($lookupOrderId, 'plink_')) {
                        $plink = $this->razorpay->fetchPaymentLink($lookupOrderId);
                        if ($plink && in_array($plink['status'] ?? '', ['paid', 'partially_paid'], true)) {
                            $paidSubunits = (int) ($plink['amount_paid'] ?? 0);
                            $plinkRef = (string) ($plink['reference_id'] ?? ($plink['notes']['cart_reference'] ?? ''));

                            if ($paidSubunits >= $expectedSubunits && $plinkRef === $cartReference) {
                                $latestPaymentId = null;
                                if (! empty($plink['payments']) && is_array($plink['payments'])) {
                                    $latestPaymentId = end($plink['payments'])['payment_id'] ?? null;
                                }

                                if (! $latestPaymentId || ! ProductOrder::where('razorpay_payment_id', $latestPaymentId)->where('cart_reference', '!=', $cartReference)->where('payment_status', ProductOrder::STATUS_SUCCESS)->exists()) {
                                    $this->fulfiller->fulfillGroup($cartReference, $lookupOrderId, $latestPaymentId);
                                    $orders = ProductOrder::group($cartReference);
                                }
                            }
                        }
                    } else {
                        $rzpOrder = $this->razorpay->fetchOrder($lookupOrderId);
                        if ($rzpOrder && ($rzpOrder['status'] ?? null) === 'paid') {
                            $paidSubunits = (int) ($rzpOrder['amount_paid'] ?? ($rzpOrder['amount'] ?? 0));
                            $orderReceipt = (string) ($rzpOrder['receipt'] ?? ($rzpOrder['notes']['cart_reference'] ?? ''));

                            $receiptMatches = ! $orderReceipt || $orderReceipt === $cartReference || str_starts_with($cartReference, $orderReceipt);
                            $amountMatches = $paidSubunits === 0 || $paidSubunits >= $expectedSubunits;

                            if ($receiptMatches && $amountMatches) {
                                $this->fulfiller->fulfillGroup($cartReference, $lookupOrderId);
                                $orders = ProductOrder::group($cartReference);
                            }
                        } elseif ($rzpOrder && ($rzpOrder['status'] ?? null) === 'attempted' && (int) ($rzpOrder['attempts'] ?? 0) > 3) {
                            ProductOrder::where('cart_reference', $cartReference)
                                ->update(['payment_status' => ProductOrder::STATUS_FAILED]);
                            $orders = ProductOrder::group($cartReference);
                        }
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
        $currency = StoreCurrency::current($request);
        $storeCurrency = $currency;

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

        return view('products.checkout', compact('site', 'head', 'products', 'product', 'catalog', 'currency', 'storeCurrency'));
    }
}
