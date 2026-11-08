@php
    $isFree = $product['is_free'];
    $priceInr = \App\Support\Money::priceFor($product, 'INR');
    $priceUsd = \App\Support\Money::priceFor($product, 'USD');
    $compareInr = \App\Support\Money::compareFor($product, 'INR');
    $compareUsd = \App\Support\Money::compareFor($product, 'USD');
    $discountInr = $compareInr > $priceInr && $compareInr > 0
        ? (int) round((1 - $priceInr / $compareInr) * 100)
        : 0;
    $discountUsd = $compareUsd > $priceUsd && $compareUsd > 0
        ? (int) round((1 - $priceUsd / $compareUsd) * 100)
        : 0;
@endphp
<article class="store-card comic-card hud-target-card {{ $product['is_featured'] ? 'store-card--featured' : '' }}" data-reveal style="padding:22px;">
    <span class="hud-target-card__scanline"></span>
    <div class="store-card__top">
        <span class="store-card__icon" style="font-size:1.8rem;">{{ $product['icon'] }}</span>
        <div style="display:flex;align-items:center;gap:8px;">
            @if (! empty($product['rating']))
                <span class="mono" style="font-size:0.75rem;color:#eab308;display:inline-flex;align-items:center;gap:3px;" title="{{ $product['rating'] }} rating">
                    ★ <strong style="color:var(--ink);">{{ number_format($product['rating'], 1) }}</strong>
                </span>
            @endif
            @if (! empty($product['badge']))
                <span class="comic-issue-box" style="font-size:0.62rem;padding:2px 7px;">{{ $product['badge'] }}</span>
            @endif
        </div>
    </div>

    <p class="font-hud store-card__cat" style="color:var(--marvel-red);font-weight:700;letter-spacing:0.08em;margin-top:10px;">PROTOCOL // {{ strtoupper($product['category']) }}</p>
    <h2 class="store-card__title font-comic" style="font-size:1.6rem;letter-spacing:0.03em;line-height:1.1;margin:6px 0 8px 0;">
        <a href="{{ route('products.show', $product['slug']) }}">{{ $product['title'] }}</a>
    </h2>
    <p class="store-card__tagline" style="font-size:0.92rem;line-height:1.5;color:#475569;margin-bottom:14px;">{{ $product['tagline'] }}</p>

    {{-- Value Stack Checklist for Maximum CRO --}}
    <ul class="font-hud" style="list-style:none;padding:0;margin:0 0 16px 0;display:grid;gap:6px;font-size:0.75rem;color:#334155;">
        <li style="display:flex;align-items:center;gap:6px;">
            <span style="color:#10b981;font-weight:900;">✔</span>
            <span>100% Production-Ready Code &amp; JSON</span>
        </li>
        <li style="display:flex;align-items:center;gap:6px;">
            <span style="color:#10b981;font-weight:900;">✔</span>
            <span>Architecture Walkthrough &amp; Schematics</span>
        </li>
        <li style="display:flex;align-items:center;gap:6px;">
            <span style="color:#10b981;font-weight:900;">✔</span>
            <span>Zero Subscription · Commercial License</span>
        </li>
    </ul>

    <ul class="store-card__tech">
        @foreach (array_slice($product['tech'], 0, 4) as $tech)
            <li class="mono">{{ $tech }}</li>
        @endforeach
    </ul>

    <div class="store-card__meta mono" style="font-size:0.75rem;border-top:1px dashed #cbd5e1;padding-top:10px;margin-top:10px;">
        <span>📦 {{ $product['format'] }}</span>
        @if (! empty($product['file_size']))<span>💾 {{ $product['file_size'] }}</span>@endif
        <span>Commercial license</span>
    </div>

    <div class="store-card__foot" style="margin-top:14px;border-top:2px solid #000;padding-top:12px;">
        <div class="store__price font-comic" style="font-size:1.8rem;line-height:1;">
            @include('products.partials.price', ['product' => $product])
        </div>
        @if ($discountUsd > 0)
            <span class="comic-issue-box" data-cur="USD" style="font-size:0.62rem;padding:2px 6px;background:var(--marvel-red);">SAVE {{ $discountUsd }}%</span>
        @endif
        @if ($discountInr > 0)
            <span class="comic-issue-box" data-cur="INR" style="font-size:0.62rem;padding:2px 6px;background:var(--marvel-red);">SAVE {{ $discountInr }}%</span>
        @endif
    </div>

    <div class="store-card__actions" style="margin-top:14px;display:flex;gap:8px;">
        <a href="{{ route('products.checkout.single', $product['slug']) }}" class="btn--marvel" style="font-size:1.05rem;padding:8px 16px;flex:1;text-align:center;">
            {{ $isFree ? '⚡ Download Free' : '⚡ Unlock Protocol' }}
        </a>
        <button type="button" class="btn--stark" data-add-cart="{{ $product['slug'] }}" style="padding:8px 14px;font-size:0.75rem;">+ Cart</button>
    </div>
    <a class="store-card__details mono" href="{{ route('products.show', $product['slug']) }}" style="display:inline-block;margin-top:10px;font-weight:600;color:var(--ink);">Inspect Schematics →</a>
</article>
