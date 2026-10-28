@extends('layouts.app')

@section('content')
<section class="section store" id="store">
    <div class="container">
        {{-- Hero --}}
        <div class="section__head store__head" data-reveal>
            <p class="mono section__label">AI Toolkits · Digital Products · India</p>
            <h1 class="section__title"><span class="split-lines">AI Toolkits &amp; Digital Products India</span></h1>
            <p class="store__lede">Buy once, own forever. Production AI toolkits, n8n automation systems, performance marketing kits and business engines for Indian founders, developers and agencies. Instant download, commercial license, 30-day guarantee.</p>
            <div class="store__hero-bar">
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
                            <span data-cur="USD">{{ \App\Support\Money::format($spUsd, 'USD') }}</span>
                            <span data-cur="INR">{{ \App\Support\Money::format($spInr, 'INR') }}</span>
                        </span>
                        @if ($spCompareInr > 0 && $spCompareUsd > 0)
                            <span class="store__price-was">
                                <span data-cur="USD">{{ \App\Support\Money::format($spCompareUsd, 'USD') }}</span>
                                <span data-cur="INR">{{ \App\Support\Money::format($spCompareInr, 'INR') }}</span>
                            </span>
                            <span class="mono store__price-save">
                                <span data-cur="USD">Save {{ \App\Support\Money::format($spCompareUsd - $spUsd, 'USD') }}</span>
                                <span data-cur="INR">Save {{ \App\Support\Money::format($spCompareInr - $spInr, 'INR') }}</span>
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

        {{-- Who this is for --}}
        <div class="store__split" data-reveal>
            <div class="store__split-col">
                <p class="mono section__label">Who this is for</p>
                <ul class="store__split-list">
                    <li>Founders and agencies shipping AI agents, automation, or growth systems in India.</li>
                    <li>Developers who want production-tested artifacts instead of a blank-page build.</li>
                    <li>Teams that need a commercial license without another monthly subscription.</li>
                </ul>
            </div>
            <div class="store__split-col">
                <p class="mono section__label">Not for you if</p>
                <ul class="store__split-list store__split-list--muted">
                    <li>You want a done-for-you custom build — use the contact page instead.</li>
                    <li>You are looking for a free tutorial; start with the free kickoff kit.</li>
                </ul>
            </div>
        </div>

        {{-- Bundle comparison --}}
        @if ($spotlight && $spotlight['is_bundle'])
        @php $single = $paid->where('is_bundle', false)->sortBy('price_inr')->first(); @endphp
        <div class="store__compare" data-reveal>
            <div class="store__compare-head">
                <p class="mono section__label">Buy separate vs bundle vs custom</p>
                <h2 class="store__compare-title">The bundle is the cheapest path to the full stack.</h2>
            </div>
            <div class="store__compare-scroll">
                <table class="store__compare-table">
                    <thead>
                        <tr>
                            <th scope="col">Option</th>
                            <th scope="col">Best for</th>
                            <th scope="col">Price</th>
                            <th scope="col">Time to deploy</th>
                            <th scope="col">Ownership</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">One toolkit</th>
                            <td>One specific bottleneck</td>
                            <td>{{ $single ? \App\Support\Money::format(\App\Support\Money::priceFor($single, 'INR'), 'INR') : 'From '.\App\Support\Money::format(\App\Support\Money::priceFor($spotlight, 'INR'), 'INR') }}</td>
                            <td>Same day</td>
                            <td>Commercial license</td>
                        </tr>
                        <tr class="is-highlight">
                            <th scope="row">The bundle</th>
                            <td>The full production stack</td>
                            <td>{{ \App\Support\Money::format(\App\Support\Money::priceFor($spotlight, 'INR'), 'INR') }} <s>{{ \App\Support\Money::format(\App\Support\Money::compareFor($spotlight, 'INR'), 'INR') }}</s></td>
                            <td>Same day</td>
                            <td>Commercial license + 12 months updates</td>
                        </tr>
                        <tr>
                            <th scope="row">Custom build</th>
                            <td>Your exact stack and workflow</td>
                            <td>Scoped per project</td>
                            <td>2-6 weeks</td>
                            <td>Your codebase</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="store__compare-foot">
                <a class="btn btn--primary" href="{{ route('products.checkout.single', $spotlight['slug']) }}">Get the bundle →</a>
                <a class="mono" href="{{ route('legal.contact') }}">Or scope a custom build →</a>
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
            <div class="store__trust-item"><span>🔒</span><div><strong>Secure payments</strong><small>Razorpay · International cards, UPI & netbanking</small></div></div>
            <div class="store__trust-item"><span>⚡</span><div><strong>Instant email delivery</strong><small>Download link emailed right after payment — no account</small></div></div>
            <div class="store__trust-item"><span>♻️</span><div><strong>Lifetime updates</strong><small>Free major-version upgrades</small></div></div>
            <div class="store__trust-item"><span>🛠️</span><div><strong>Commercial license</strong><small>Unlimited client & personal use</small></div></div>
        </div>

        {{-- Store FAQ --}}
        <div class="store__faq" data-reveal>
            <div class="store__faq-head">
                <p class="mono section__label">Store FAQ</p>
                <h2 class="store__faq-title">Delivery, license, refunds and support.</h2>
            </div>
            <div class="store__faq-list">
                @foreach ($storeFaqs as $question => $answer)
                    <details class="store__faq-item">
                        <summary>{{ $question }}</summary>
                        <p>{{ $answer }}</p>
                    </details>
                @endforeach
            </div>
        </div>

        {{-- FAQ schema --}}
        <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => collect($storeFaqs)->map(static fn (string $answer, string $question) => [
                '@type' => 'Question',
                'name' => $question,
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $answer],
            ])->values()->all(),
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
        </script>

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

@php
    $analyticsItems = collect($filtered)->map(static fn (array $p) => [
        'item_id' => $p['slug'],
        'item_name' => $p['title'],
        'price' => \App\Support\Money::priceFor($p, $storeCurrency),
        'currency' => $storeCurrency,
        'quantity' => 1,
    ])->values();
@endphp
<script>
(function () {
    var items = @json($analyticsItems);
    if (!items.length) return;
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'view_item_list', {
            item_list_id: 'store',
            item_list_name: 'AI Toolkits & Digital Products',
            items: items
        });
    }
    if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
            content_ids: items.map(function (i) { return i.item_id; }),
            content_type: 'product',
            currency: items[0].currency,
            value: items.reduce(function (sum, i) { return sum + i.price; }, 0)
        });
    }
})();
</script>

@include('products.partials.checkout-modal')
@endsection
