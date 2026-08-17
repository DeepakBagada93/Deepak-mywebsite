@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono"><span class="article__tag">Services</span></div>
            <h1 class="article__title">What I do — and where</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>Three disciplines, one person, based in <strong>Junagadh, Gujarat</strong> and
                working across India and remotely: websites, AI systems, and the SEO/AEO work that
                makes both visible. Each service has its own page — pick the one you need.</p>
            </div>

            <div class="journal__list" style="margin-top:40px">
                @foreach ($services as $service)
                    <a class="entry reveal" data-reveal href="{{ route('services.show', $service->slug) }}">
                        <div class="entry__meta mono">
                            <span class="entry__tag">{{ strtoupper($service->kicker) }}</span>
                        </div>
                        <div class="entry__main">
                            <h2 class="entry__title">{{ $service->title }}</h2>
                            <p class="entry__excerpt">{{ $service->tagline }}</p>
                            <span class="entry__read mono">View service →</span>
                        </div>
                    </a>
                @endforeach
            </div>

            <div class="article__foot">
                <a class="btn btn--ghost" href="/#contact">Get in touch →</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
