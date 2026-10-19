@extends('layouts.app')

@section('content')
<section class="section store store--track">
    <div class="container" style="max-width:720px">
        <div class="section__head" data-reveal>
            <p class="mono section__label">Order Tracking</p>
            <h1 class="section__title"><span class="split-lines">Find your downloads</span></h1>
            <p class="store__lede">No account needed — just enter the email you used and your order reference from the receipt email.</p>
            <div class="section__rule" aria-hidden="true"></div>
        </div>

        <form action="{{ route('products.track.lookup') }}" method="POST" class="store-track__form" data-reveal>
            @csrf
            <label class="store-field">
                <span class="mono">Email address</span>
                <input type="email" name="email" value="{{ old('email') }}" required placeholder="you@email.com">
                @error('email')<span class="store-modal__error" style="display:block">{{ $message }}</span>@enderror
            </label>
            <label class="store-field">
                <span class="mono">Order reference</span>
                <input type="text" name="reference" value="{{ old('reference') }}" required placeholder="DB-261018-XXXXXXXX">
                @error('reference')<span class="store-modal__error" style="display:block">{{ $message }}</span>@enderror
            </label>
            <button type="submit" class="btn btn--primary">Look up order →</button>
        </form>

        @if ($searched)
            @if ($orders && $orders->isNotEmpty())
                <div class="store-track__result" data-reveal>
                    <p class="mono store-track__meta">Order {{ $orders->first()->cart_reference }} · {{ optional($orders->first()->paid_at)->format('d M Y') ?? 'pending' }} · {{ \App\Support\Money::format($orders->sum('amount'), $orders->first()->currency) }}</p>
                    <ul class="store-track__downloads">
                        @foreach ($orders as $order)
                            <li>
                                <div>
                                    <strong>{{ $order->product_title }}</strong>
                                    <span class="mono" style="color:var(--muted)">
                                        @if ($order->payment_status !== \App\Models\ProductOrder::STATUS_SUCCESS)
                                            Payment pending
                                        @elseif (! $order->isDownloadable())
                                            Link expired or limit reached
                                        @else
                                            {{ $order->download_max_limit - $order->download_count }} downloads left
                                        @endif
                                    </span>
                                </div>
                                @if ($order->isDownloadable())
                                    <a class="btn btn--primary btn--sm" href="{{ $order->download_url }}">⬇ Download</a>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                    <p class="mono" style="color:var(--muted);margin-top:16px">Link expired? Email <a href="mailto:{{ config('site.email') }}">{{ config('site.email') }}</a> and I'll resend it.</p>
                </div>
            @else
                <div class="store-track__empty" data-reveal>
                    <p>No order found for that email and reference. Double-check the reference from your receipt email, or <a href="{{ route('legal.contact') }}">contact support</a>.</p>
                </div>
            @endif
        @endif

        <div class="article__foot" style="margin-top:44px">
            <a class="btn btn--ghost" href="{{ route('products.index') }}">← Back to store</a>
        </div>
    </div>
</section>
@endsection
