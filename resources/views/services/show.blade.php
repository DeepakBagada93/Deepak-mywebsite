@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <nav class="mono article__crumbs" aria-label="Breadcrumb" style="margin-bottom:16px;font-size:12px;">
                <a href="/">Home</a> / <a href="{{ route('services.index') }}">Services</a> / {{ $service->title }}
            </nav>
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper($service->kicker) }}</span>
                <span class="article__date">{{ $site['location'] }}</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">{{ $service->title }}</h1>
            <p class="service__tagline">{{ $service->tagline }}</p>
            <div class="article__rule"></div>
            <div class="article__body">
                @foreach (preg_split("/\r?\n\r?\n/", trim($service->intro)) as $para)
                    <p>{{ $para }}</p>
                @endforeach

                <h2 class="service__h2">What's included</h2>
                <ul class="service__list">
                    @foreach ($service->offerings as $name => $desc)
                        <li><strong>{{ $name }}.</strong> {{ $desc }}</li>
                    @endforeach
                </ul>

                <h2 class="service__h2">Questions, answered</h2>
                <div class="faq">
                    @foreach ($service->faq as $question => $answer)
                        <details class="faq__item">
                            <summary class="faq__q">{{ $question }}</summary>
                            <p class="faq__a">{{ $answer }}</p>
                        </details>
                    @endforeach
                </div>

                @if (!empty($services) && count($services) > 1)
                    <h2 class="service__h2">Related services</h2>
                    <ul class="service__list">
                        @foreach ($services as $rel)
                            @if ($rel->slug !== $service->slug)
                                <li><a href="{{ route('services.show', $rel->slug) }}">{{ $rel->title }}</a> — {{ $rel->tagline }}</li>
                            @endif
                        @endforeach
                    </ul>
                @endif
            </div>
            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('legal.contact') }}">Start a project</a>
                <a class="btn btn--ghost" href="{{ route('services.index') }}">All services</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
