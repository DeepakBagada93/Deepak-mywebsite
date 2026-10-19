@extends('layouts.app')

@section('content')
@php
    $first = $orders->first();
    $paid = $first->payment_status === \App\Models\ProductOrder::STATUS_SUCCESS;
    $expired = $first->payment_status === \App\Models\ProductOrder::STATUS_FAILED;
    $downloadable = $orders->filter(fn ($o) => $o->isDownloadable());
@endphp
<article class="article article--page">
    <div class="container" style="max-width:640px">
        @if ($paid && $downloadable->isNotEmpty())
            <div style="text-align:center">
                <p style="font-size:3rem;line-height:1;margin-bottom:16px">🎉</p>
                <p class="mono article__tag">Payment successful</p>
                <h1 class="article__title">{{ $orders->count() > 1 ? 'Your downloads are ready' : 'Your download is ready' }}</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>Thanks, {{ $first->customer_name }}. Your purchase is confirmed and a copy of your download link{{ $orders->count() > 1 ? 's has' : ' has' }} been emailed to <strong>{{ $first->customer_email }}</strong>.</p>
                    <p class="mono" style="color:var(--muted)">Order {{ $first->cart_reference }} · {{ \App\Support\Money::format($orders->sum('amount'), $first->currency) }}</p>
                </div>
                <ul class="store-track__downloads" style="text-align:left">
                    @foreach ($orders as $order)
                        <li>
                            <span>{{ $order->product_title }}</span>
                            @if ($order->isDownloadable())
                                <a class="btn btn--primary btn--sm" href="{{ $order->download_url }}">⬇ Download</a>
                            @else
                                <span class="mono" style="color:var(--muted)">Link expired</span>
                            @endif
                        </li>
                    @endforeach
                </ul>
                <p class="mono" style="color:var(--muted);margin-top:18px">Links valid 48 hours · 5 downloads each · no account needed</p>
                <div class="article__foot" style="justify-content:center">
                    <a class="btn btn--ghost" href="{{ route('products.track') }}">Track / re-download →</a>
                </div>
            </div>
        @elseif ($paid)
            <div style="text-align:center">
                <p class="mono article__tag">Already fulfilled</p>
                <h1 class="article__title">This order is complete</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>Your download link for <strong>{{ $first->product_title }}</strong> has expired or reached its limit. Use order tracking or reply to your receipt email and I will resend it.</p>
                </div>
                <div class="article__foot" style="justify-content:center">
                    <a class="btn btn--primary" href="{{ route('products.track') }}">Track order →</a>
                    <a class="btn btn--ghost" href="{{ route('legal.contact') }}">Contact support</a>
                </div>
            </div>
        @elseif ($expired)
            <div style="text-align:center">
                <p class="mono article__tag">Payment incomplete</p>
                <h1 class="article__title">That payment didn't go through</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>The order <strong>{{ $first->cart_reference }}</strong> was not completed. No money was charged. You can try again safely.</p>
                </div>
                <div class="article__foot" style="justify-content:center">
                    <a class="btn btn--primary" href="{{ route('products.show', $first->product_slug) }}">Try again →</a>
                    <a class="btn btn--ghost" href="{{ route('products.index') }}">← Back to store</a>
                </div>
            </div>
        @else
            <div style="text-align:center">
                <p class="mono article__tag">Confirming payment</p>
                <h1 class="article__title">We're confirming your payment…</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>Your order <strong>{{ $first->cart_reference }}</strong> is still being confirmed. This usually takes a few seconds. Refresh in a moment — your download will appear once payment is verified.</p>
                </div>
                <div class="article__foot" style="justify-content:center">
                    <a class="btn btn--primary" href="{{ route('products.return') }}?order_id={{ $first->cart_reference }}">Refresh status →</a>
                    <a class="btn btn--ghost" href="{{ route('products.index') }}">← Back to store</a>
                </div>
            </div>
        @endif
    </div>
</article>
@endsection
