@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper($service->kicker) }}</span>
                <span class="article__date">{{ $site['location'] }}</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">{{ $service->title }}</h1>
            <p class="service__tagline">{{ $service->tagline }}</p>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>{{ $service->intro }}</p>

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
            </div>
            <div class="article__foot">
                <a class="btn btn--solid" href="/#contact" data-scroll>Start a project</a>
                <a class="btn btn--ghost" href="{{ route('services.index') }}">All services</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
