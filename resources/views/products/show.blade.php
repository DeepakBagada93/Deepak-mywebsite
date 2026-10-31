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
                        <span>Production-tested</span>
                        <span>Commercial license</span>
                        @if (! empty($product['badge']))<span class="store-detail__badge">{{ $product['badge'] }}</span>@endif
                    </div>
                </div>

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

                    <p class="store-buybox__secure">🔒 Secure checkout via Razorpay — cards, international cards &amp; UPI</p>
                    <p class="store-buybox__guarantee">♻️ 30-day guarantee — if it does not fit your workflow, email the order number for a refund.</p>
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
