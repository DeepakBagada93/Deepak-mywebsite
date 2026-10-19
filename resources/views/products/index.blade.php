@extends('layouts.app')

@section('content')
<section class="section store" id="store">
    <div class="container">
        {{-- Hero --}}
        <div class="section__head store__head" data-reveal>
            <p class="mono section__label">Digital Products</p>
            <h1 class="section__title"><span class="split-lines">Buy once. Own forever. Ship today.</span></h1>
            <p class="store__lede">Battle-tested AI toolkits, boilerplates and automation engines I build with every day — packaged as instant downloads. No subscriptions, no lock-in, commercial license included.</p>
            <div class="store__hero-bar">
                @include('products.partials.currency-switch')
                <a href="{{ route('products.track') }}" class="mono store__track-link">Already bought? Track your order →</a>
            </div>
            <div class="section__rule" aria-hidden="true"></div>
        </div>

        {{-- Featured bundle spotlight --}}
        @php
            $spotlight = $featured->firstWhere('is_bundle', true) ?? $featured->first();
            $spInr = $spotlight ? \App\Support\Money::priceFor($spotlight, 'INR') : 0;
            $spUsd = $spotlight ? \App\Support\Money::priceFor($spotlight, 'USD') : 0;
            $spCompareInr = $spotlight ? \App\Support\Money::compareFor($spotlight, 'INR') : 0;
            $spCompareUsd = $spotlight ? \App\Support\Money::compareFor($spotlight, 'USD') : 0;
        @endphp
        @if ($spotlight)
        <div class="store__spotlight" data-reveal>
            <div class="store__spotlight-media">
                <span class="store__spotlight-icon">{{ $spotlight['icon'] }}</span>
                <span class="mono store__spotlight-tag">{{ $spotlight['badge'] }}</span>
            </div>
            <div class="store__spotlight-body">
                <p class="mono store__spotlight-kicker">Featured · {{ $spotlight['category'] }}</p>
                <h2 class="store__spotlight-title">{{ $spotlight['title'] }}</h2>
                <p class="store__spotlight-desc">{{ $spotlight['tagline'] }}</p>
                <ul class="store__spotlight-list">
                    @foreach (array_slice($spotlight['deliverables'], 0, 4) as $item)
                        <li><span class="store__check" aria-hidden="true">✓</span>{{ $item }}</li>
                    @endforeach
                </ul>
                <div class="store__spotlight-foot">
                    <div class="store__price">
                        <span class="store__price-now">
                            <span data-cur="INR">{{ \App\Support\Money::format($spInr, 'INR') }}</span>
                            <span data-cur="USD">{{ \App\Support\Money::format($spUsd, 'USD') }}</span>
                        </span>
                        @if ($spCompareInr > 0 && $spCompareUsd > 0)
                            <span class="store__price-was">
                                <span data-cur="INR">{{ \App\Support\Money::format($spCompareInr, 'INR') }}</span>
                                <span data-cur="USD">{{ \App\Support\Money::format($spCompareUsd, 'USD') }}</span>
                            </span>
                            <span class="mono store__price-save">
                                <span data-cur="INR">Save {{ \App\Support\Money::format($spCompareInr - $spInr, 'INR') }}</span>
                                <span data-cur="USD">Save {{ \App\Support\Money::format($spCompareUsd - $spUsd, 'USD') }}</span>
                            </span>
                        @endif
                    </div>
                    <div class="store__actions">
                        <a class="btn btn--primary" href="{{ route('products.checkout.single', $spotlight['slug']) }}">Buy now →</a>
                        <a class="btn btn--ghost" href="{{ route('products.show', $spotlight['slug']) }}">Details</a>
                    </div>
                </div>
            </div>
        </div>
        @endif

        {{-- Category filter --}}
        <div class="store__filters" data-reveal>
            <a href="{{ route('products.index') }}" class="pill-btn {{ ! $activeCategory ? 'is-active' : '' }}">All Products</a>
            @foreach ($categories as $catName => $catProducts)
                <a href="{{ route('products.index') }}?category={{ $catProducts->first()['category_slug'] }}"
                   class="pill-btn {{ $activeCategory === $catProducts->first()['category_slug'] ? 'is-active' : '' }}">
                    {{ $catProducts->first()['icon'] }} {{ $catName }}
                    <span class="store__pill-count">{{ $catProducts->count() }}</span>
                </a>
            @endforeach
        </div>

        {{-- Product grid --}}
        <div class="store__grid">
            @foreach ($filtered as $product)
                @include('products.partials.card', ['product' => $product])
            @endforeach
        </div>

        {{-- Guarantee strip --}}
        <div class="store__trust" data-reveal>
            <div class="store__trust-item"><span>🔒</span><div><strong>Secure payments</strong><small>Cashfree · UPI, cards, international cards & netbanking</small></div></div>
            <div class="store__trust-item"><span>⚡</span><div><strong>Instant email delivery</strong><small>Download link emailed right after payment — no account</small></div></div>
            <div class="store__trust-item"><span>♻️</span><div><strong>Lifetime updates</strong><small>Free major-version upgrades</small></div></div>
            <div class="store__trust-item"><span>🛠️</span><div><strong>Commercial license</strong><small>Unlimited client & personal use</small></div></div>
        </div>

        {{-- FAQ teaser / contact --}}
        <div class="store__cta" data-reveal>
            <div>
                <h3 class="store__cta-title">Need a custom build instead?</h3>
                <p class="store__cta-desc">These products are the same systems I deliver in client engagements. Want one tailored to your stack? Let's talk.</p>
            </div>
            <a class="btn btn--primary" href="{{ route('legal.contact') }}">Start a project →</a>
        </div>
    </div>
</section>

@include('products.partials.checkout-modal')
@include('products.partials.cart')
@endsection
