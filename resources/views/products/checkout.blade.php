@extends('layouts.app')

@section('content')
{{-- Preload Razorpay Checkout SDK --}}
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
@php
    $currencies = \App\Support\Money::currencies();
    $totalInr = $products->sum(fn ($p) => \App\Support\Money::priceFor($p, 'INR'));
    $totalUsd = $products->sum(fn ($p) => \App\Support\Money::priceFor($p, 'USD'));
    $compareTotalInr = $products->sum(fn ($p) => \App\Support\Money::compareFor($p, 'INR'));
    $compareTotalUsd = $products->sum(fn ($p) => \App\Support\Money::compareFor($p, 'USD'));
    $isAllFree = $products->every(fn ($p) => $p['is_free']);
    $savingsInr = $compareTotalInr > $totalInr ? ($compareTotalInr - $totalInr) : 0;
    $savingsUsd = $compareTotalUsd > $totalUsd ? ($compareTotalUsd - $totalUsd) : 0;
@endphp

<section class="checkout-page">
    <div class="checkout-page__container">

        {{-- Top Navigation & Trust Bar --}}
        <div class="checkout-nav" data-reveal style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <a href="{{ $products->count() === 1 ? route('products.show', $product['slug']) : route('products.index') }}" class="checkout-nav__back mono">
                ← Back to {{ $products->count() === 1 ? 'Product Details' : 'Store' }}
            </a>
            <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
                @include('products.partials.currency-switch')
                <div class="checkout-nav__badge mono">
                    <span class="checkout-nav__dot"></span> 256-Bit SSL Encrypted Checkout
                </div>
            </div>
        </div>

        <div class="checkout-layout">

            {{-- LEFT COLUMN: Checkout Form --}}
            <div class="checkout-main" data-reveal>
                <div class="checkout-card checkout-form-card" id="checkout-form-panel">
                    <div class="checkout-card__head">
                        <p class="mono checkout-kicker">Digital Products Store · Instant Delivery</p>
                        <h1 class="checkout-title">
                            {{ $products->count() === 1 ? 'Checkout: ' . $product['title'] : 'Complete Your Order (' . $products->count() . ' items)' }}
                        </h1>
                        <p class="checkout-subtitle">
                            Enter your details below to get immediate access to your downloadable package and lifetime license.
                        </p>
                    </div>

                    {{-- Live Error Alert --}}
                    <div class="checkout-alert checkout-alert--error" id="checkout-error" style="display:none" role="alert"></div>

                    <form id="checkout-form" class="checkout-form" novalidate>
                        @csrf
                        <div class="checkout-form__section">
                            <h2 class="checkout-form__heading mono">1. Customer Details</h2>

                            <div class="checkout-form__fields">
                                <label class="store-field">
                                    <span class="mono">Full name <strong class="checkout-required">*</strong></span>
                                    <input type="text" name="name" required autocomplete="name" placeholder="e.g. Deepak Bagada" class="checkout-input">
                                </label>

                                <label class="store-field">
                                    <span class="mono">Email address <strong class="checkout-required">*</strong></span>
                                    <input type="email" name="email" required autocomplete="email" placeholder="e.g. you@example.com" class="checkout-input">
                                    <small class="checkout-field-hint mono">✓ Includes receipt, instant ZIP delivery & future product update dispatches.</small>
                                </label>

                                <label class="store-field">
                                    <span class="mono">Phone number <span class="checkout-opt">(Optional)</span></span>
                                    <input type="tel" name="phone" autocomplete="tel" placeholder="+91 98765 43210" class="checkout-input">
                                    <small class="checkout-field-hint mono">Used solely for payment and dispatch alerts.</small>
                                </label>
                            </div>
                        </div>

                        <div class="checkout-form__section">
                            <h2 class="checkout-form__heading mono">2. Payment & Verification</h2>

                            @if ($isAllFree)
                                <div class="checkout-free-banner">
                                    <span class="checkout-free-banner__icon">🎁</span>
                                    <div>
                                        <strong>100% Free Download</strong>
                                        <p>No credit card or payment required. Immediate download unlocks upon form submission.</p>
                                    </div>
                                </div>
                            @else
                                <div class="checkout-methods-banner">
                                    <div class="checkout-methods-banner__head">
                                        <span class="mono">Secured by Razorpay Payments</span>
                                        <span class="checkout-methods-banner__ssl mono">🔒 RBI Authorized</span>
                                    </div>
                                    <div class="checkout-methods-banner__icons">
                                        <span class="pay-badge">⚡ UPI (GPay / PhonePe / Paytm / BHIM)</span>
                                        <span class="pay-badge">💳 Credit & Debit Cards (Visa / MC / RuPay)</span>
                                        <span class="pay-badge">🏦 Net Banking (50+ Banks)</span>
                                        <span class="pay-badge">🌐 International Cards</span>
                                    </div>
                                </div>
                            @endif
                        </div>

                        {{-- Hidden inputs for selected items and currency --}}
                        <input type="hidden" name="currency" id="checkout-currency-input" value="{{ $currency }}">

                        {{-- Submit Button --}}
                        <button type="submit" class="btn btn--primary checkout-submit-btn" id="checkout-submit">
                            <span class="checkout-submit-label">
                                @if ($isAllFree)
                                    Get Free Download →
                                @else
                                    <span data-cur="INR">Pay {{ \App\Support\Money::format($totalInr, 'INR') }} & Download →</span>
                                    <span data-cur="USD" style="display:none">Pay {{ \App\Support\Money::format($totalUsd, 'USD') }} & Download →</span>
                                @endif
                            </span>
                            <span class="checkout-spinner" aria-hidden="true" style="display:none"></span>
                        </button>

                        <div class="checkout-trust-points mono">
                            <span>🔒 100% Secure Checkout</span>
                            <span>⚡ Instant Delivery</span>
                            <span>🛠️ Commercial License Included</span>
                            <span>🤝 30-Day Guarantee</span>
                        </div>
                    </form>
                </div>

                {{-- Success Panel (Revealed dynamically upon completion) --}}
                <div class="checkout-card checkout-success-card" id="checkout-success-panel" style="display:none" data-reveal>
                    <div class="checkout-success__icon">🎉</div>
                    <p class="mono checkout-kicker">Order Confirmed</p>
                    <h2 class="checkout-title">You're all set!</h2>
                    <p class="checkout-subtitle" id="checkout-success-msg">
                        Your download link has been sent to your email address, and you're enrolled to receive future product release updates.
                    </p>

                    <div class="checkout-success__reference mono" id="checkout-success-ref"></div>

                    <div class="checkout-success__downloads" id="checkout-success-downloads"></div>

                    <a href="#" class="btn btn--primary checkout-success__dl-btn" id="checkout-success-single-dl" style="display:none">
                        ⬇ Download Archive Now
                    </a>

                    <div class="checkout-success__actions">
                        <a href="{{ route('products.index') }}" class="btn btn--ghost btn--sm">← Browse More Toolkits</a>
                        <a href="{{ route('products.track') }}" class="btn btn--ghost btn--sm">Track Order</a>
                    </div>
                </div>
            </div>

            {{-- RIGHT COLUMN: Order Summary & Package Details --}}
            <aside class="checkout-sidebar" data-reveal>
                <div class="checkout-card checkout-summary-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <h2 class="checkout-summary__title mono" style="margin-bottom:0;">Order Summary</h2>
                        @include('products.partials.currency-switch')
                    </div>

                    {{-- Products List --}}
                    <div class="checkout-items-list">
                        @foreach ($products as $item)
                            @php
                                $itemInr = \App\Support\Money::priceFor($item, 'INR');
                                $itemUsd = \App\Support\Money::priceFor($item, 'USD');
                            @endphp
                            <div class="checkout-item">
                                <div class="checkout-item__icon">{{ $item['icon'] ?? '📦' }}</div>
                                <div class="checkout-item__info">
                                    <h3 class="checkout-item__title">{{ $item['title'] }}</h3>
                                    <p class="checkout-item__tagline">{{ $item['tagline'] }}</p>
                                    <div class="checkout-item__meta mono">
                                        <span>{{ $item['format'] }}</span>
                                        @if (! empty($item['file_size']))
                                            <span>💾 {{ $item['file_size'] }}</span>
                                        @endif
                                    </div>
                                </div>
                                <div class="checkout-item__price mono">
                                    @if ($item['is_free'])
                                        <span class="checkout-badge--free">Free</span>
                                    @else
                                        <span data-cur="INR">{{ \App\Support\Money::format($itemInr, 'INR') }}</span>
                                        <span data-cur="USD">{{ \App\Support\Money::format($itemUsd, 'USD') }}</span>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>

                    {{-- Price Breakdown --}}
                    <div class="checkout-totals">
                        @if (! $isAllFree && ($savingsInr > 0 || $savingsUsd > 0))
                            <div class="checkout-totals__row checkout-totals__row--strike mono">
                                <span>Regular Price</span>
                                <span data-cur="INR">{{ \App\Support\Money::format($compareTotalInr, 'INR') }}</span>
                                <span data-cur="USD">{{ \App\Support\Money::format($compareTotalUsd, 'USD') }}</span>
                            </div>
                            <div class="checkout-totals__row checkout-totals__row--discount mono">
                                <span>Limited-Time Savings</span>
                                <span data-cur="INR">-{{ \App\Support\Money::format($savingsInr, 'INR') }}</span>
                                <span data-cur="USD">-{{ \App\Support\Money::format($savingsUsd, 'USD') }}</span>
                            </div>
                        @endif

                        <div class="checkout-totals__row checkout-totals__row--total">
                            <strong>Total Due Today</strong>
                            <strong class="checkout-total-price">
                                @if ($isAllFree)
                                    Free
                                @else
                                    <span data-cur="INR">{{ \App\Support\Money::format($totalInr, 'INR') }}</span>
                                    <span data-cur="USD">{{ \App\Support\Money::format($totalUsd, 'USD') }}</span>
                                @endif
                            </strong>
                        </div>
                    </div>

                    {{-- What's Included --}}
                    <div class="checkout-included">
                        <h4 class="checkout-included__heading mono">What's Included:</h4>
                        <ul class="checkout-included__list">
                            <li><span class="checkout-check">✓</span> Instant private ZIP archive (no public cloud leakage)</li>
                            <li><span class="checkout-check">✓</span> Complete unminified code & scripts</li>
                            <li><span class="checkout-check">✓</span> Automated test suites with runnable verification gates</li>
                            <li><span class="checkout-check">✓</span> Commercial license for client & commercial work</li>
                            <li><span class="checkout-check">✓</span> Free updates for all 1.x minor releases</li>
                        </ul>
                    </div>

                    {{-- Builder Signature Card --}}
                    <div class="checkout-author-note">
                        <div class="checkout-author-note__avatar">
                            <img src="/images/about-portrait.png" alt="Deepak Bagada" width="44" height="44" class="checkout-avatar-img">
                        </div>
                        <div class="checkout-author-note__text">
                            <p class="checkout-author-note__quote">
                                “Every toolkit in my store is extracted from real client engagements and engineering builds. Zero synthetic fluff, fully tested.”
                            </p>
                            <p class="mono checkout-author-note__sig">— Deepak Bagada, AI Systems Engineer</p>
                        </div>
                    </div>

                    {{-- Guarantee Card --}}
                    <div class="checkout-guarantee mono">
                        <span class="checkout-guarantee__shield">🛡️</span>
                        <div>
                            <strong>30-Day Money-Back Guarantee</strong>
                            <p>Run the test fixtures. If any command or gate fails to behave as documented, email me for a full refund.</p>
                        </div>
                    </div>

                </div>
            </aside>

        </div>
    </div>
</section>

{{-- Client-side checkout handler --}}
<script>
(function () {
    var form = document.getElementById('checkout-form');
    var submit = document.getElementById('checkout-submit');
    var submitLabel = submit ? submit.querySelector('.checkout-submit-label') : null;
    var spinner = submit ? submit.querySelector('.checkout-spinner') : null;
    var errorEl = document.getElementById('checkout-error');
    var formPanel = document.getElementById('checkout-form-panel');
    var successPanel = document.getElementById('checkout-success-panel');
    var successMsg = document.getElementById('checkout-success-msg');
    var successRef = document.getElementById('checkout-success-ref');
    var successDownloads = document.getElementById('checkout-success-downloads');
    var successSingleDl = document.getElementById('checkout-success-single-dl');
    var currencyInput = document.getElementById('checkout-currency-input');

    var items = @json($products->pluck('slug')->all());
    var csrf = document.querySelector('meta[name="csrf-token"]');

    function currentCurrency() {
        return (window.DBStoreCurrency && window.DBStoreCurrency.get()) || document.documentElement.getAttribute('data-store-currency') || 'INR';
    }

    function syncCurrency() {
        var cur = currentCurrency();
        if (currencyInput) currencyInput.value = cur;
        document.documentElement.setAttribute('data-store-currency', cur);
        document.querySelectorAll('[data-cur]').forEach(function (el) {
            el.style.display = el.getAttribute('data-cur') === cur ? '' : 'none';
        });
    }

    syncCurrency();
    document.addEventListener('store:currency', function (e) {
        syncCurrency();
    });

    function showError(msg) {
        if (!errorEl) return;
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
        if (submit) {
            submit.classList.remove('is-loading');
            submit.disabled = false;
        }
        if (spinner) spinner.style.display = 'none';
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showSuccess(data) {
        if (formPanel) formPanel.style.display = 'none';
        if (successPanel) successPanel.style.display = 'block';

        if (data.message && successMsg) {
            successMsg.textContent = data.message;
        }
        if (data.order_reference && successRef) {
            successRef.textContent = 'Order Reference: ' + data.order_reference;
        }

        if (successDownloads) {
            successDownloads.innerHTML = '';
            if (data.downloads && data.downloads.length > 1) {
                data.downloads.forEach(function (d) {
                    var a = document.createElement('a');
                    a.href = d.url;
                    a.textContent = '⬇ Download ' + d.title;
                    a.className = 'btn btn--primary btn--sm checkout-dl-item';
                    successDownloads.appendChild(a);
                });
                if (successSingleDl) successSingleDl.style.display = 'none';
            } else if (data.download_url && successSingleDl) {
                successSingleDl.href = data.download_url;
                successSingleDl.style.display = 'inline-block';
            }
        }
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (submit.classList.contains('is-loading')) return;

            var name = form.name.value.trim();
            var email = form.email.value.trim();
            if (!name || !email) {
                showError('Please provide your name and email address to proceed.');
                return;
            }

            submit.classList.add('is-loading');
            submit.disabled = true;
            if (spinner) spinner.style.display = 'inline-block';
            if (errorEl) errorEl.style.display = 'none';

            fetch('{{ route('products.checkout') }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrf ? csrf.content : '',
                },
                body: JSON.stringify({
                    items: items,
                    currency: currentCurrency(),
                    name: name,
                    email: email,
                    phone: form.phone.value.trim(),
                }),
            })
            .then(function (r) {
                return r.json().then(function (d) { return { ok: r.ok, data: d }; });
            })
            .then(function (res) {
                if (!res.ok) {
                    var msg = (res.data && (res.data.message || (res.data.errors && Object.values(res.data.errors)[0][0]))) || 'Could not initiate checkout. Please try again.';
                    showError(msg);
                    return;
                }

                if (res.data.status === 'fulfilled') {
                    if (window.DBCart) window.DBCart.clear();
                    showSuccess(res.data);
                } else if (res.data.status === 'checkout') {
                    openRazorpay(res.data);
                }
            })
            .catch(function () {
                showError('A network error occurred while connecting to checkout. Please try again.');
            });
        });
    }

    function openRazorpay(orderData) {
        ensureRazorpay(function (Razorpay) {
            if (!Razorpay) {
                showError('Could not initialize secure Razorpay payment window. Please check your network and refresh the page.');
                return;
            }

            var options = {
                key: orderData.razorpay_key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Deepak Bagada',
                description: 'Order ' + orderData.order_reference,
                order_id: orderData.razorpay_order_id,
                prefill: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    contact: orderData.customer.phone || ''
                },
                theme: {
                    color: '#0a0a0a'
                },
                modal: {
                    ondismiss: function () {
                        if (submit) {
                            submit.classList.remove('is-loading');
                            submit.disabled = false;
                        }
                        if (spinner) spinner.style.display = 'none';
                        showError('Payment window was closed. You can retry whenever you are ready.');
                    }
                },
                handler: function (response) {
                    fetch('{{ route('products.verify') }}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': csrf ? csrf.content : ''
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_reference: orderData.order_reference
                        })
                    })
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (data.status === 'success') {
                            if (window.DBCart) window.DBCart.clear();
                            window.location.href = data.redirect_url || ('{{ route('products.return') }}?order_id=' + encodeURIComponent(orderData.order_reference));
                        } else {
                            showError(data.message || 'Payment verification failed. Please contact support.');
                        }
                    })
                    .catch(function () {
                        window.location.href = '{{ route('products.return') }}?order_id=' + encodeURIComponent(orderData.order_reference) +
                            '&razorpay_payment_id=' + encodeURIComponent(response.razorpay_payment_id) +
                            '&razorpay_order_id=' + encodeURIComponent(response.razorpay_order_id) +
                            '&razorpay_signature=' + encodeURIComponent(response.razorpay_signature);
                    });
                }
            };

            try {
                var rzp = new Razorpay(options);
                rzp.on('payment.failed', function (resp) {
                    console.warn('Razorpay payment failed:', resp.error);
                    showError((resp.error && resp.error.description) || 'Payment was unsuccessful. Please try again.');
                });
                rzp.open();
            } catch (err) {
                console.error('Razorpay checkout open error:', err);
                showError('Unable to open payment modal. Please refresh the page and try again.');
            }
        });
    }

    function ensureRazorpay(cb) {
        if (window.Razorpay) {
            cb(window.Razorpay);
            return;
        }
        var s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.async = true;
        s.onload = function () { cb(window.Razorpay); };
        s.onerror = function () { cb(null); };
        document.head.appendChild(s);
    }
})();
</script>
@endsection
