@php
    $isFree = $product['is_free'];
    $priceInr = \App\Support\Money::priceFor($product, 'INR');
    $compareInr = \App\Support\Money::compareFor($product, 'INR');
    $discount = $compareInr > $priceInr && $compareInr > 0
        ? (int) round((1 - $priceInr / $compareInr) * 100)
        : 0;
@endphp

<div class="store-dock" id="storeFloatingDock" role="region" aria-label="Quick Purchase Floating Bar">
    <div class="store-dock__inner">
        <div class="store-dock__product">
            <span class="store-dock__icon">{{ $product['icon'] }}</span>
            <div class="store-dock__meta">
                <span class="store-dock__title">{{ $product['title'] }}</span>
                <div class="store-dock__sub mono">
                    @if (! empty($product['rating']))
                        <span class="store-dock__stars">★★★★★</span>
                        <span>{{ number_format($product['rating'], 1) }}</span>
                    @endif
                    <span>·</span>
                    <span style="color:#10b981;">⚡ Instant Download</span>
                    <span>·</span>
                    <span>Commercial License</span>
                </div>
            </div>
        </div>

        <div class="store-dock__pricing">
            <div class="store__price">
                @include('products.partials.price', ['product' => $product])
            </div>
            @if ($discount > 0)
                <span class="store-dock__discount mono">{{ $discount }}% OFF</span>
            @endif
        </div>

        <div class="store-dock__actions">
            <a href="{{ route('products.checkout.single', $product['slug']) }}" class="store-dock__btn-buy">
                @if ($isFree)
                    <span>Download Free →</span>
                @else
                    <span data-cur="INR">⚡ Pay UPI / Card →</span>
                    <span data-cur="USD" style="display:none;">⚡ Buy Now →</span>
                @endif
            </a>
            <button type="button" class="store-dock__btn-cart" data-add-cart="{{ $product['slug'] }}" aria-label="Add to cart">
                + Cart
            </button>
        </div>
    </div>
</div>

<script>
(function() {
    var dock = document.getElementById('storeFloatingDock');
    if (!dock) return;
    var ticking = false;

    function handleDockVisibility() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        // Trigger after scrolling past the hero area (320px)
        if (scrollY > 320) {
            dock.classList.add('is-active');
        } else {
            dock.classList.remove('is-active');
        }
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleDockVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    handleDockVisibility();
})();
</script>
