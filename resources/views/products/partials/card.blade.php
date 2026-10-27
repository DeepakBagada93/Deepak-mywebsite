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
<article class="store-card {{ $product['is_featured'] ? 'store-card--featured' : '' }}" data-reveal>
    <div class="store-card__top">
        <span class="store-card__icon">{{ $product['icon'] }}</span>
        @if (! empty($product['badge']))
            <span class="mono store-card__badge {{ $isFree ? 'store-card__badge--free' : '' }}">{{ $product['badge'] }}</span>
        @endif
    </div>

    <p class="mono store-card__cat">{{ $product['category'] }}</p>
    <h2 class="store-card__title">
        <a href="{{ route('products.show', $product['slug']) }}">{{ $product['title'] }}</a>
    </h2>
    <p class="store-card__tagline">{{ $product['tagline'] }}</p>

    <ul class="store-card__tech">
        @foreach (array_slice($product['tech'], 0, 4) as $tech)
            <li class="mono">{{ $tech }}</li>
        @endforeach
    </ul>

    <div class="store-card__meta mono">
        <span>📦 {{ $product['format'] }}</span>
        @if (! empty($product['file_size']))<span>💾 {{ $product['file_size'] }}</span>@endif
        <span>★ {{ $product['rating'] }}</span>
    </div>

    <div class="store-card__foot">
        <div class="store__price">
            @include('products.partials.price', ['product' => $product])
        </div>
        @if ($discountUsd > 0)
            <span class="mono store-card__off" data-cur="USD">{{ $discountUsd }}% OFF</span>
        @endif
        @if ($discountInr > 0)
            <span class="mono store-card__off" data-cur="INR">{{ $discountInr }}% OFF</span>
        @endif
    </div>

    <div class="store-card__actions">
        <a href="{{ route('products.checkout.single', $product['slug']) }}" class="btn btn--primary btn--sm">
            {{ $isFree ? 'Download free →' : 'Buy now →' }}
        </a>
        <button type="button" class="btn btn--ghost btn--sm" data-add-cart="{{ $product['slug'] }}">+ Cart</button>
    </div>
    <a class="store-card__details mono" href="{{ route('products.show', $product['slug']) }}">View details →</a>
</article>
