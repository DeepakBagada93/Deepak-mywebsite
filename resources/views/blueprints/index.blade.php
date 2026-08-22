@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">06 — Blueprints</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">AI Architecture Blueprints &amp; System Diagrams</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>Visual system topologies, multi-agent communication swarms, and protocol contracts. These diagrams illustrate the actual structural wiring powering production AI workflows.</p>
            </div>

            <div class="blueprints-gallery" style="margin-top: 40px;">
                @if ($architectures->isEmpty())
                    <p class="mono">No blueprints available.</p>
                @else
                    <div class="blueprints-grid">
                        @foreach ($architectures as $arch)
                            <div class="blueprint-card reveal" data-reveal>
                                <div class="blueprint-card__meta mono">
                                    <span>{{ strtoupper($arch->skill?->category?->name ?? 'ARCHITECTURE') }}</span>
                                    @if ($arch->skill)
                                        <span>Skill: <a href="{{ route('library.show', $arch->skill->slug) }}" style="text-decoration: underline;">{{ $arch->skill->title }}</a></span>
                                    @endif
                                </div>
                                <h2 class="blueprint-card__title">
                                    <a href="{{ route('blueprints.show', $arch->id) }}">{{ $arch->title }}</a>
                                </h2>
                                @if ($arch->description)
                                    <p class="blueprint-card__desc">{{ $arch->description }}</p>
                                @endif
                                <div class="blueprint-svg-box" style="margin-top: 20px;">
                                    <a href="{{ route('blueprints.show', $arch->id) }}" data-event="blueprint-expand" data-event-label="{{ $arch->title }}">
                                        {!! $arch->diagram_svg !!}
                                    </a>
                                </div>
                                <div class="blueprint-card__foot mono" style="margin-top: 16px;">
                                    <a href="{{ route('blueprints.show', $arch->id) }}" class="mono" style="font-size: 0.72rem; letter-spacing: 0.12em;">
                                        Expand Full Diagram &amp; Notes →
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('library.index') }}">← Browse Skills Library</a>
                <a class="btn btn--ghost" href="{{ route('repos.index') }}">Curated Repos →</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
