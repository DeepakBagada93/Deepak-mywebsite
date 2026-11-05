@extends('layouts.app')

@section('content')
@php
    $isFree = $product['is_free'];
    $priceInr = \App\Support\Money::priceFor($product, 'INR');
    $priceUsd = \App\Support\Money::priceFor($product, 'USD');
    $compareInr = \App\Support\Money::compareFor($product, 'INR');
    $discount = $compareInr > $priceInr && $compareInr > 0
        ? (int) round((1 - $priceInr / $compareInr) * 100)
        : 0;
    $demoCommands = collect($product['how_to_use'] ?? [])
        ->filter(fn ($step) => ! empty($step['command']) && preg_match('/^\s*(cat|head|ls|tree)\b/', $step['command']))
        ->take(2)
        ->values();
@endphp
<article class="store-detail">
    <div class="container">
        {{-- Breadcrumb --}}
        <nav class="store-detail__crumb mono" aria-label="Breadcrumb">
            <a href="/">Home</a> <span>/</span>
            <a href="{{ route('products.index') }}">Products</a> <span>/</span>
            <span>{{ $product['category'] }}</span>
        </nav>

        <div class="store-detail__layout">
            {{-- Main column --}}
            <div class="store-detail__main">
                <div class="store-detail__head">
                    <span class="store-detail__icon">{{ $product['icon'] }}</span>
                    <p class="mono store-detail__cat">{{ $product['category'] }}</p>
                    <h1 class="store-detail__title">{{ $product['title'] }}</h1>
                    <p class="store-detail__tagline">{{ $product['tagline'] }}</p>
                    <div class="store-detail__rating mono">
                        @if (! empty($product['rating']))
                            <span class="store-detail__stars" title="{{ $product['rating'] }} out of 5 stars">
                                <span class="store-detail__star-icons" style="color:#eab308;font-size:0.95rem;letter-spacing:1px;">★★★★★</span>
                                <strong style="color:var(--ink);font-weight:700;">{{ number_format($product['rating'], 1) }}</strong>
                                @if (! empty($product['rating_count']))
                                    <span class="store-detail__rating-count" style="color:var(--muted);">({{ $product['rating_count'] }} verified agency audits)</span>
                                @endif
                            </span>
                        @endif
                        <span>Production-tested</span>
                        <span>Commercial license</span>
                        @if (! empty($product['badge']))<span class="store-detail__badge">{{ $product['badge'] }}</span>@endif
                    </div>
                </div>

                @if (! empty($product['image']))
                <div class="store-detail__hero-visual" data-reveal style="margin:24px 0 28px 0;border:1px solid var(--hair);border-radius:8px;overflow:hidden;background:#0a0d14;box-shadow:0 12px 32px rgba(0,0,0,0.08);">
                    <div style="position:relative;">
                        <picture>
                            <source srcset="{{ preg_replace('/\.(png|jpg|jpeg)$/i', '.webp', $product['image']) }}" type="image/webp">
                            <img src="{{ $product['image'] }}" alt="{{ $product['title'] }} — Product Mockup & Architecture Dashboard" width="1200" height="675" style="width:100%;height:auto;display:block;object-fit:cover;" loading="eager" fetchpriority="high">
                        </picture>
                        <div style="padding:10px 16px;background:rgba(10,13,20,0.92);border-top:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:0.78rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                            <span class="mono" style="color:#38bdf8;">⚡ Scored 40-Rule Auditor · 30-Prompt Panel · White-Label Deliverables</span>
                            <span class="mono" style="color:#10b981;">✓ 100% Offline · Zero API Subscriptions</span>
                        </div>
                    </div>
                </div>
                @endif

                @if (! empty($product['trust_logos']))
                <div class="store-detail__trust-strip mono" data-reveal style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:18px 0 24px 0;padding:12px 16px;background:var(--surface);border:1px solid var(--hair);border-radius:6px;font-size:0.78rem;">
                    <span style="font-weight:600;color:var(--ink);">Optimized for:</span>
                    @foreach ($product['trust_logos'] as $logo)
                        <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;background:var(--paper);border:1px solid var(--hair);border-radius:4px;color:var(--ink);font-weight:500;">
                            ✓ {{ $logo }}
                        </span>
                    @endforeach
                </div>
                @endif

                {{-- Mobile Quick Buy Box (visible on mobile only) --}}
                <div class="store-detail__mobile-buybox">
                    <div class="store-detail__mobile-price-row">
                        <div class="store__price store-buybox__price">
                            @include('products.partials.price', ['product' => $product])
                        </div>
                        @if ($discount > 0)
                            <span class="store-buybox__badge">{{ $discount }}% OFF · limited-time launch price</span>
                        @endif
                    </div>
                    <div class="store-detail__mobile-btn-group">
                        <a href="{{ route('products.checkout.single', $product['slug']) }}" class="btn btn--primary store-detail__mobile-buy-btn">
                            {{ $isFree ? 'Download free →' : 'Buy now — instant download →' }}
                        </a>
                        <button type="button" class="btn btn--ghost store-detail__mobile-cart-btn" data-add-cart="{{ $product['slug'] }}">+ Add to cart</button>
                    </div>
                    <p class="store-buybox__secure">⚡ Instant delivery after payment · 🔒 Razorpay UPI, cards &amp; netbanking</p>
                </div>

                <div class="store-detail__body">
                    <p>{{ $product['description'] }}</p>
                </div>

                @if (! empty($product['aeo_summary']))
                <div class="store-detail__aeo" data-reveal>
                    <div class="store-detail__aeo-label mono">⚡ Direct Answer & Architecture Blueprint</div>
                    <p style="font-size:1.02rem;line-height:1.7;margin:0 0 14px 0;color:var(--ink);"><strong>{{ $product['aeo_summary']['definition'] }}</strong></p>
                    <div class="store-detail__aeo-grid">
                        <div class="store-detail__aeo-item">
                            <strong class="mono">Target Audience</strong>
                            <p>{{ $product['aeo_summary']['target_audience'] }}</p>
                        </div>
                        <div class="store-detail__aeo-item">
                            <strong class="mono">Core Mechanism</strong>
                            <p>{{ $product['aeo_summary']['core_mechanism'] }}</p>
                        </div>
                        <div class="store-detail__aeo-item">
                            <strong class="mono">Verified Benchmark</strong>
                            <p>{{ $product['aeo_summary']['key_metric'] }}</p>
                        </div>
                    </div>
                </div>
                @endif

                @if (! empty($product['comparison']))
                <div class="store-detail__block">
                    <div class="store-comparison__head">
                        <h2 class="store-detail__h2">Why this architecture wins</h2>
                        <span class="store-comparison__hint mono">Swipe to compare ↔</span>
                    </div>
                    <div class="store-comparison">
                        <table class="store-comparison__table">
                            <thead>
                                <tr>
                                    <th class="store-comparison__th store-comparison__th--without">Without this skill (Manual & Flawed)</th>
                                    <th class="store-comparison__th store-comparison__th--with">With this skill (Deterministic & Gated)</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($product['comparison'] as $row)
                                <tr>
                                    <td class="store-comparison__td store-comparison__td--without">
                                        <span class="store-comparison__cell-label mono store-comparison__cell-label--without">Without this skill</span>
                                        ✕ {{ $row['without'] }}
                                    </td>
                                    <td class="store-comparison__td store-comparison__td--with">
                                        <span class="store-comparison__cell-label mono store-comparison__cell-label--with">With this skill</span>
                                        ✓ {{ $row['with'] }}
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                @endif

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">What's inside</h2>
                    <ul class="store-detail__deliverables">
                        @foreach ($product['deliverables'] as $item)
                            <li><span class="store__check">✓</span>{{ $item }}</li>
                        @endforeach
                    </ul>
                </div>

                @if ($demoCommands->isNotEmpty())
                <div class="store-detail__block">
                    <h2 class="store-detail__h2">See what ships</h2>
                    <p class="store-preview__lede">Read-only previews of files inside the download. The same commands appear in the step-by-step guide below.</p>
                    <div class="store-preview">
                        @foreach ($demoCommands as $step)
                        <div class="store-preview__row">
                            <span class="store-preview__prompt mono">$</span>
                            <pre class="store-preview__code"><code>{{ str_replace('\\"', '"', $step['command']) }}</code></pre>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">Built with</h2>
                    <ul class="store-detail__tech">
                        @foreach ($product['tech'] as $tech)
                            <li class="mono">{{ $tech }}</li>
                        @endforeach
                    </ul>
                </div>

                @if (! empty($product['how_to_use']))
                <div class="store-detail__block">
                    <h2 class="store-detail__h2">How to use this skill (Step-by-step)</h2>
                    <p style="color:var(--muted);margin-bottom:16px;font-size:0.95rem;">Run offline in your local workspace, orchestrate through any agent (Claude Code, Cursor, Antigravity, Cline), or plug directly into CI/CD pipelines.</p>
                    <div class="store-steps">
                        @foreach ($product['how_to_use'] as $step)
                        <div class="store-step">
                            <div class="store-step__head">
                                <span class="store-step__num mono">{{ $step['step'] ?? $loop->iteration }}</span>
                                <h3 class="store-step__title">{{ $step['title'] }}</h3>
                            </div>
                            <p class="store-step__desc">{{ $step['desc'] }}</p>
                            @if (! empty($step['command']))
                            <pre class="store-step__code"><code>{{ str_replace('\\"', '"', $step['command']) }}</code></pre>
                            @endif
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                @if (! empty($product['testimonials']))
                <div class="store-detail__block" data-reveal>
                    <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px;margin-bottom:18px;">
                        <h2 class="store-detail__h2" style="margin-bottom:0;">What practitioners are saying</h2>
                        <span class="mono" style="font-size:0.8rem;color:var(--muted);">{{ count($product['testimonials']) }} verified case studies</span>
                    </div>
                    <div style="display:grid;gap:16px;">
                        @foreach ($product['testimonials'] as $testimonial)
                        <div style="background:var(--surface);border:1px solid var(--hair);border-radius:6px;padding:20px 22px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="color:#eab308;font-size:0.9rem;letter-spacing:1px;">★★★★★</span>
                                    <span class="mono" style="font-size:0.75rem;padding:2px 8px;background:#ecfdf5;color:#047857;border:1px solid #a7f3d0;border-radius:4px;font-weight:600;">✓ Verified Purchase</span>
                                </div>
                                @if (! empty($testimonial['metric']))
                                <span class="mono" style="font-size:0.78rem;font-weight:600;padding:3px 10px;background:var(--paper);border:1px solid var(--hair);border-radius:4px;color:var(--ink);">
                                    ⚡ {{ $testimonial['metric'] }}
                                </span>
                                @endif
                            </div>
                            <blockquote style="margin:0 0 14px 0;font-size:0.98rem;line-height:1.75;color:var(--ink);font-style:normal;">
                                “{{ $testimonial['quote'] }}”
                            </blockquote>
                            <div style="display:flex;align-items:center;gap:10px;border-top:1px solid var(--hair);padding-top:10px;">
                                <div class="mono" style="font-size:0.84rem;">
                                    <strong style="color:var(--ink);">{{ $testimonial['author'] }}</strong>
                                    <span style="color:var(--muted);">· {{ $testimonial['role'] }}, {{ $testimonial['company'] }}</span>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                <div class="store-detail__block" data-reveal>
                    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:6px;padding:24px;display:flex;gap:18px;align-items:flex-start;">
                        <span style="font-size:2.2rem;line-height:1;">🛡️</span>
                        <div>
                            <h3 class="mono" style="font-size:1.05rem;font-weight:700;color:#166534;margin:0 0 6px 0;">
                                30-Day 100% Risk-Free Guarantee
                            </h3>
                            <p style="font-size:0.95rem;line-height:1.7;color:#14532d;margin:0;">
                                Run {{ $product['title'] }} on your or your client's website. If the deliverables don't save you at least 15 hours of manual work or help you win an AI audit retainer, email me at <strong>ceo@saasnext.in</strong> with your order reference for a prompt 100% refund. No questions asked.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">Included with every purchase</h2>
                    <ul class="store-detail__includes">
                        @foreach ($product['includes'] as $item)
                            <li>{{ $item }}</li>
                        @endforeach
                    </ul>
                </div>

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">Before you buy</h2>
                    <div class="store-detail__faq">
                        <details class="store-detail__faq-item">
                            <summary>Will it work with my stack?</summary>
                            <p>It ships as {{ $product['format'] }} and is built with {{ implode(', ', $product['tech']) }}. You run it in your own workspace — there is no hosted account or platform lock-in on my side.</p>
                        </details>
                        <details class="store-detail__faq-item">
                            <summary>Is this a subscription?</summary>
                            <p>No. It is a one-time payment. {{ $isFree ? 'The download is free forever' : 'Lifetime free updates' }} and a commercial license are included.</p>
                        </details>
                        <details class="store-detail__faq-item">
                            <summary>How fast do I get the files?</summary>
                            <p>Immediately after payment. Razorpay confirms the order and the download link appears on the confirmation screen and in your receipt email.</p>
                        </details>
                        <details class="store-detail__faq-item">
                            <summary>What if it does not fit my workflow?</summary>
                            <p>Email the order number within 30 days for a refund — no form to fill in.</p>
                        </details>
                    </div>
                </div>

                @if (! empty($product['faq']))
                <div class="store-detail__block">
                    <h2 class="store-detail__h2">Questions</h2>
                    <div class="store-detail__faq">
                        @foreach ($product['faq'] as $question => $answer)
                            <details class="store-detail__faq-item" {{ $loop->first ? 'open' : '' }}>
                                <summary>{{ $question }}</summary>
                                <p>{{ $answer }}</p>
                            </details>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>

            {{-- Buy box --}}
            <aside class="store-detail__aside">
                <div class="store-buybox">
                    <div class="store__price store-buybox__price">
                        @include('products.partials.price', ['product' => $product])
                    </div>
                    @if ($discount > 0)
                        <span class="store-buybox__badge">{{ $discount }}% OFF · limited-time launch price</span>
                    @endif

                    <a href="{{ route('products.checkout.single', $product['slug']) }}" class="btn btn--primary store-buybox__btn">
                        {{ $isFree ? 'Download free →' : 'Buy now — instant download →' }}
                    </a>
                    <button type="button" class="btn btn--ghost store-buybox__btn store-buybox__btn--alt" data-add-cart="{{ $product['slug'] }}">+ Add to cart</button>

                    <ul class="store-buybox__facts">
                        <li><span>📦</span>{{ $product['format'] }}</li>
                        @if (! empty($product['file_size']))<li><span>💾</span>{{ $product['file_size'] }}</li>@endif
                        <li><span>⚡</span>Instant delivery after payment</li>
                        <li><span>♻️</span>{{ $isFree ? 'Free forever' : 'Lifetime free updates' }}</li>
                        <li><span>🛠️</span>Commercial license included</li>
                    </ul>

                    <div style="margin-top:16px;padding:12px;background:var(--surface);border:1px solid var(--hair);border-radius:6px;font-size:0.75rem;">
                        <p class="mono" style="font-weight:600;color:var(--ink);margin:0 0 6px 0;display:flex;align-items:center;gap:6px;">
                            <span>🔒</span> 256-Bit SSL Encrypted Checkout
                        </p>
                        <p style="color:var(--muted);margin:0 0 8px 0;line-height:1.4;">
                            Secured by Razorpay · UPI (GPay, PhonePe, Paytm, BHIM), Cards &amp; Netbanking.
                        </p>
                        <p class="mono" style="color:#15803d;font-weight:600;margin:0;">
                            🛡️ 30-Day 100% Money-Back Guarantee
                        </p>
                    </div>
                </div>
            </aside>
        </div>

        {{-- Related --}}
        @if ($related->isNotEmpty())
        <div class="store-detail__related">
            <h2 class="store-detail__h2">More from the studio</h2>
            <div class="store__grid">
                @foreach ($related as $relatedProduct)
                    @include('products.partials.card', ['product' => $relatedProduct])
                @endforeach
            </div>
        </div>
        @endif
    </div>
</article>

{{-- Mobile Sticky Action Bar --}}
<div class="store-mobile-sticky" id="storeMobileSticky">
    <div class="store-mobile-sticky__inner">
        <div class="store-mobile-sticky__info">
            <span class="store-mobile-sticky__title">{{ $product['title'] }}</span>
            <div class="store__price store-mobile-sticky__price">
                @include('products.partials.price', ['product' => $product])
            </div>
        </div>
        <div class="store-mobile-sticky__actions">
            <a href="{{ route('products.checkout.single', $product['slug']) }}" class="btn btn--primary store-mobile-sticky__btn">
                {{ $isFree ? 'Download' : 'Buy now' }}
            </a>
            <button type="button" class="btn btn--ghost store-mobile-sticky__cart" data-add-cart="{{ $product['slug'] }}" aria-label="Add to cart">
                + Cart
            </button>
        </div>
    </div>
</div>

<script>
(function() {
    var bar = document.getElementById('storeMobileSticky');
    if (!bar) return;
    var ticking = false;
    function checkScroll() {
        if (window.innerWidth > 1024) {
            bar.classList.remove('is-visible');
            document.body.classList.remove('has-mobile-sticky');
            return;
        }
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY > 280) {
            bar.classList.add('is-visible');
            document.body.classList.add('has-mobile-sticky');
        } else {
            bar.classList.remove('is-visible');
            document.body.classList.remove('has-mobile-sticky');
        }
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    checkScroll();
})();
</script>

@php
    $analyticsItem = [
        'item_id' => $product['slug'],
        'item_name' => $product['title'],
        'item_category' => $product['category'],
        'price' => \App\Support\Money::priceFor($product, $storeCurrency),
        'currency' => $storeCurrency,
        'quantity' => 1,
    ];
@endphp
<script>
(function () {
    var item = @json($analyticsItem);
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'view_item', {
            currency: item.currency,
            value: item.price,
            items: [item]
        });
    }
    if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
            content_ids: [item.item_id],
            content_type: 'product',
            content_name: item.item_name,
            currency: item.currency,
            value: item.price
        });
    }
})();
</script>

@include('products.partials.checkout-modal')
@endsection
