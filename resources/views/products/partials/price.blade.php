{{-- Dual-currency price block (USD default, INR option). Expects $product. --}}
@php
    $pFree = ! empty($product['is_free']);
    $pInr = \App\Support\Money::priceFor($product, 'INR');
    $pUsd = \App\Support\Money::priceFor($product, 'USD');
    $pCompareInr = \App\Support\Money::compareFor($product, 'INR');
    $pCompareUsd = \App\Support\Money::compareFor($product, 'USD');
@endphp
@if ($pFree)
    <span class="store__price-now">Free</span>
@else
    <span class="store__price-now">
        <span data-cur="USD">{{ \App\Support\Money::format($pUsd, 'USD') }} <small class="mono store__cur-tag" style="font-size:0.7em;color:var(--text-muted);font-weight:400;">USD</small></span>
        <span data-cur="INR">{{ \App\Support\Money::format($pInr, 'INR') }} <small class="mono store__cur-tag" style="font-size:0.7em;color:var(--text-muted);font-weight:400;">INR</small></span>
    </span>
    @if ($pCompareInr > 0 && $pCompareUsd > 0)
        <span class="store__price-was">
            <span data-cur="USD">{{ \App\Support\Money::format($pCompareUsd, 'USD') }}</span>
            <span data-cur="INR">{{ \App\Support\Money::format($pCompareInr, 'INR') }}</span>
        </span>
    @endif
@endif
