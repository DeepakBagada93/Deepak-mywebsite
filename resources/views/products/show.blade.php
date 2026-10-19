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
                        <span>★ {{ $product['rating'] }}</span>
                        <span>{{ number_format($product['rating_count']) }} developers</span>
                        @if (! empty($product['badge']))<span class="store-detail__badge">{{ $product['badge'] }}</span>@endif
                    </div>
                </div>

                <div class="store-detail__body">
                    <p>{{ $product['description'] }}</p>
                </div>

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">What's inside</h2>
                    <ul class="store-detail__deliverables">
                        @foreach ($product['deliverables'] as $item)
                            <li><span class="store__check">✓</span>{{ $item }}</li>
                        @endforeach
                    </ul>
                </div>

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">Built with</h2>
                    <ul class="store-detail__tech">
                        @foreach ($product['tech'] as $tech)
                            <li class="mono">{{ $tech }}</li>
                        @endforeach
                    </ul>
                </div>

                <div class="store-detail__block">
                    <h2 class="store-detail__h2">Included with every purchase</h2>
                    <ul class="store-detail__includes">
                        @foreach ($product['includes'] as $item)
                            <li>{{ $item }}</li>
                        @endforeach
                    </ul>
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
                    @include('products.partials.currency-switch', ['variant' => 'buybox'])
                    <div class="store__price store-buybox__price">
                        @include('products.partials.price', ['product' => $product])
                    </div>
                    @if ($discount > 0)
                        <span class="mono store-buybox__off">{{ $discount }}% OFF · limited-time launch price</span>
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

                    <p class="store-buybox__secure mono">🔒 Secure checkout via Cashfree — UPI, cards & international cards</p>
                </div>
            </aside>
        </div>

        {{-- Related --}}
        @if ($related->isNotEmpty())
        <div class="store-detail__related">
            <h2 class="store-detail__h2">More from the studio</h2>
            <div class="store__grid">
                @foreach ($related as $product)
                    @include('products.partials.card', ['product' => $product])
                @endforeach
            </div>
        </div>
        @endif
    </div>
</article>

@include('products.partials.checkout-modal')
@endsection
