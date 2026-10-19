@extends('layouts.app')

@section('content')
<article class="article article--page">
    <div class="container" style="text-align:center">
        <p class="mono article__tag">Download unavailable</p>
        <h1 class="article__title">This download link has expired</h1>
        <div class="article__rule"></div>
        <div class="article__body">
            <p>{{ $reason ?? 'Download links are valid for 48 hours and allow up to 5 downloads. If your link has expired or hit its limit, just reply to your receipt email and I will resend it.' }}</p>
            <p>Need help? Email <a href="mailto:{{ config('site.email') }}">{{ config('site.email') }}</a> with your order reference.</p>
        </div>
        <div class="article__foot" style="justify-content:center">
            <a class="btn btn--ghost" href="{{ route('products.index') }}">← Back to store</a>
            <a class="btn btn--primary" href="{{ route('legal.contact') }}">Contact support →</a>
        </div>
    </div>
</article>
@endsection
