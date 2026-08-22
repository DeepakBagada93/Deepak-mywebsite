@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">07 — Great Repos</span>
                <span class="article__byline">Curated by {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">Curated Open-Source AI Repositories</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>A strictly vetted directory of open-source artificial intelligence repositories, local LLM engines, multi-agent frameworks, and vector search tooling. Annotated with personal engineering takes from production builds.</p>
            </div>

            <div class="category-filter" style="margin-top: 32px;">
                <a href="{{ route('repos.index') }}" class="pill-btn {{ empty($category) ? 'is-active' : '' }}">
                    All Categories
                </a>
                @foreach ($categories as $cat)
                    <a href="{{ route('repos.index', ['category' => $cat]) }}"
                       class="pill-btn {{ $category === $cat ? 'is-active' : '' }}">
                        {{ $cat }}
                    </a>
                @endforeach
            </div>

            <div class="repos-list" style="margin-top: 40px;">
                @if ($repos->isEmpty())
                    <p class="mono">No repositories listed for this filter.</p>
                @else
                    @foreach ($repos as $repo)
                        <div class="repo-card reveal" data-reveal>
                            <div class="repo-card__header">
                                <div>
                                    <div class="repo-card__category mono">{{ strtoupper($repo->category ?? 'AI TOOL') }}</div>
                                    <h3 class="repo-card__title">
                                        <a href="{{ $repo->url }}" target="_blank" rel="noopener noreferrer" data-event="repo-link-click" data-event-label="{{ $repo->title }}">
                                            {{ $repo->title }} ↗
                                        </a>
                                    </h3>
                                </div>
                                <div class="repo-card__stars mono">
                                    ★ {{ number_format($repo->stars) }}
                                </div>
                            </div>

                            <p class="repo-card__desc">{{ $repo->description }}</p>

                            @if ($repo->why_great)
                                <div class="repo-card__take">
                                    <span class="mono repo-card__take-label">Why It's Essential:</span>
                                    <p class="repo-card__take-text">“{{ $repo->why_great }}”</p>
                                </div>
                            @endif

                            @if (!empty($repo->tags))
                                <div class="repo-card__tags mono">
                                    @foreach ($repo->tags as $t)
                                        <span class="repo-tag">#{{ $t }}</span>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    @endforeach
                @endif
            </div>

            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('library.index') }}">← AI Skills Library</a>
                <a class="btn btn--ghost" href="{{ route('blueprints.index') }}">Architecture Blueprints →</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
