@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container" style="max-width: 720px; text-align: center; padding: 80px 20px;">
            <div class="article__meta mono" style="justify-content: center; margin-bottom: 24px;">
                <span class="article__tag">// SUBSCRIPTION PREFERENCES</span>
            </div>

            <h1 class="article__title" style="font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 20px;">
                @if ($status === 'success')
                    Unsubscribed Successfully
                @elseif ($status === 'already_unsubscribed')
                    Already Unsubscribed
                @else
                    Link Expired or Invalid
                @endif
            </h1>

            <div class="article__rule" style="margin: 24px auto; max-width: 200px;"></div>

            <p class="article__body" style="font-size: 1.15rem; color: var(--muted); line-height: 1.8; margin-bottom: 40px;">
                {{ $message }}
            </p>

            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <a class="btn btn--solid" href="{{ route('home') }}">Return to Homepage</a>
                <a class="btn btn--ghost" href="{{ route('journal.index') }}">Browse Journal</a>
            </div>
        </div>
    </article>
@endsection
