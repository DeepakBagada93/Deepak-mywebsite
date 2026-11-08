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

                @if (! empty($product['image']) && file_exists(public_path(ltrim($product['image'], '/'))))
                <div class="store-detail__hero-visual" data-reveal style="margin:24px 0 28px 0;border:1px solid var(--hair);border-radius:8px;overflow:hidden;background:#0a0d14;box-shadow:0 12px 32px rgba(0,0,0,0.08);">
                    <div style="position:relative;">
                        <picture>
                            <source srcset="{{ preg_replace('/\.(png|jpg|jpeg)$/i', '.webp', $product['image']) }}" type="image/webp">
                            <img src="{{ $product['image'] }}" alt="{{ $product['title'] }} — Product Mockup & Architecture Dashboard" width="1200" height="675" style="width:100%;height:auto;display:block;object-fit:cover;" loading="eager" fetchpriority="high">
                        </picture>
                        <div style="padding:10px 16px;background:rgba(10,13,20,0.92);border-top:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:0.78rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                            <span class="mono" style="color:#38bdf8;">⚡ {{ $product['image_badge'] ?? (! empty($product['badge']) ? $product['badge'].' · Production Architecture' : 'Production-Ready Architecture · Verified Deliverables') }}</span>
                            <span class="mono" style="color:#10b981;">✓ Instant Private Download · Commercial License</span>
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
                <div class="store-detail__aeo store-detail__aeo--premium" data-reveal>
                    <div class="store-detail__aeo-label mono">
                        <span>⚡</span>
                        <span>DIRECT ANSWER &amp; ARCHITECTURE BLUEPRINT</span>
                    </div>
                    <p class="store-detail__aeo-definition"><strong>{{ $product['aeo_summary']['definition'] }}</strong></p>
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
                        <table class="store-comparison__table store-comparison__table--premium">
                            <thead>
                                <tr>
                                    <th class="store-comparison__th store-comparison__th--without">Without this skill (Manual &amp; Flawed)</th>
                                    <th class="store-comparison__th store-comparison__th--with">With this skill (Deterministic &amp; Gated)</th>
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
                    <h2 class="store-detail__h2">What's inside the download</h2>
                    @include('products.partials.file-explorer', ['product' => $product])
                </div>

                @if ($demoCommands->isNotEmpty())
                <div class="store-detail__block">
                    <h2 class="store-detail__h2">See what ships</h2>
                    <p class="store-preview__lede">Production-ready scripts and terminal blueprints included inside the package.</p>
                    @foreach ($demoCommands as $step)
                        @php
                            $cmdClean = str_replace('\"', '"', $step['command']);
                        @endphp
                        <div class="store-terminal">
                            <div class="store-terminal__bar">
                                <div class="store-terminal__dots">
                                    <span class="store-terminal__dot store-terminal__dot--red"></span>
                                    <span class="store-terminal__dot store-terminal__dot--yellow"></span>
                                    <span class="store-terminal__dot store-terminal__dot--green"></span>
                                </div>
                                <span class="store-terminal__title">terminal — {{ strtolower($step['title'] ?? 'preview') }}</span>
                                <button type="button" class="store-terminal__copy" data-copy-cmd="{{ e($cmdClean) }}">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                    <span>Copy</span>
                                </button>
                            </div>
                            <pre class="store-terminal__body"><code class="store-terminal__code">{{ $cmdClean }}</code></pre>
                        </div>
                    @endforeach
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
                                @php
                                    $stepCmdClean = str_replace('\"', '"', $step['command']);
                                @endphp
                                <div class="store-terminal">
                                    <div class="store-terminal__bar">
                                        <div class="store-terminal__dots">
                                            <span class="store-terminal__dot store-terminal__dot--red"></span>
                                            <span class="store-terminal__dot store-terminal__dot--yellow"></span>
                                            <span class="store-terminal__dot store-terminal__dot--green"></span>
                                        </div>
                                        <span class="store-terminal__title">bash — step {{ $step['step'] ?? $loop->iteration }}</span>
                                        <button type="button" class="store-terminal__copy" data-copy-cmd="{{ e($stepCmdClean) }}">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                    <pre class="store-terminal__body"><code class="store-terminal__code">{{ $stepCmdClean }}</code></pre>
                                </div>
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

                {{-- Captain America & Hulk Synergy Power Block --}}
                <div class="store-detail__block" data-reveal>
                    {{-- Hulk Gamma Power Meter --}}
                    <div class="gamma-power-meter" style="margin-bottom:24px;">
                        <div class="gamma-power-meter__label">
                            <span style="display:flex;align-items:center;gap:6px;">
                                <span style="color:#22c55e;">💥 HULK GAMMA CAPACITY</span>
                                <span>// SMASH MANUAL WORKLOADS</span>
                            </span>
                            <span style="color:#ffffff;background:#16a34a;padding:2px 8px;border-radius:3px;">100,000 REQS / HR</span>
                        </div>
                        <div class="gamma-power-meter__bar-track">
                            <div class="gamma-power-meter__bar-fill"></div>
                        </div>
                        <div style="font-size:0.75rem;color:#86efac;margin-top:8px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                            <span>✔ Pulverizes 20+ hours of manual boilerplate coding</span>
                            <span>✔ Zero system thermal spikes or brittle crashes</span>
                        </div>
                    </div>

                    {{-- Captain America Vibranium Shield Guarantee --}}
                    <div class="vibranium-guarantee-card">
                        <div class="vibranium-shield-icon" aria-hidden="true">
                            <div class="shield-ring-white">
                                <div class="shield-ring-red">
                                    <div class="shield-center-blue">★</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="font-comic" style="font-size:1.45rem;color:#ffffff;letter-spacing:0.04em;margin:0 0 6px 0;display:flex;align-items:center;gap:8px;">
                                <span>FIRST AVENGER VIBRANIUM SHIELD GUARANTEE</span>
                            </h3>
                            <p class="store-guarantee--luxury__desc" style="color:#cbd5e1;line-height:1.65;font-size:0.92rem;">
                                Deploy <strong>{{ $product['title'] }}</strong> in your local workspace or enterprise cluster. Engineered with defensive typing and RFC stability. If this toolkit fails to save your team at least 20 hours or crashes on your stack, email Deepak directly at <a href="mailto:ceo@saasnext.in" style="color:#38bdf8;text-decoration:underline;font-family:var(--hud-font);">ceo@saasnext.in</a> within 14 days for a prompt, 100% no-questions-asked refund.
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
                        <div data-cur="INR">
                            <p style="color:var(--muted);margin:0 0 8px 0;line-height:1.4;">
                                ⚡ Instant UPI (Google Pay, PhonePe, Paytm, QR) &amp; Cards · Secured by Razorpay
                            </p>
                            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">⚡ UPI</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Google Pay</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">PhonePe</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Paytm</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Cards</span>
                            </div>
                        </div>
                        <div data-cur="USD" style="display:none;">
                            <p style="color:var(--muted);margin:0 0 8px 0;line-height:1.4;">
                                🔒 International Credit &amp; Debit Cards (Visa, Mastercard, Amex) · Secured by Razorpay
                            </p>
                            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">💳 Visa</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Mastercard</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Amex</span>
                                <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">International Cards</span>
                            </div>
                        </div>
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

{{-- Universal Floating Conversion Dock (Desktop & Mobile) --}}
@include('products.partials.floating-dock', ['product' => $product])

<script>
document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-copy-cmd]');
    if (!btn) return;
    var cmd = btn.getAttribute('data-copy-cmd');
    if (!cmd) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmd).then(function() {
            var label = btn.querySelector('span');
            var prev = label ? label.textContent : '';
            btn.classList.add('copied');
            if (label) label.textContent = 'Copied! ✓';
            setTimeout(function() {
                btn.classList.remove('copied');
                if (label) label.textContent = prev || 'Copy';
            }, 2000);
        });
    }
});
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
