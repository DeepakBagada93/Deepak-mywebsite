@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper($skill->category?->name ?? 'SKILL') }}</span>
                <span class="article__date">v{{ $skill->version }}</span>
                <span class="article__readtime">★ {{ number_format($skill->stars) }} stars</span>
                <span class="article__byline">· By {{ $site['name'] }}</span>
            </div>
            
            <h1 class="article__title">{{ $skill->title }}</h1>
            
            <div class="skill-hero-meta mono">
                <span class="skill-pill skill-pill--{{ $skill->difficulty }}">Difficulty: {{ $skill->difficulty }}</span>
                @if ($skill->github_url)
                    <a href="{{ $skill->github_url }}" target="_blank" rel="noopener noreferrer" class="skill-pill skill-pill--link">
                        GitHub Repo ↗
                    </a>
                @endif
                <a href="#blueprints" class="skill-pill skill-pill--link">Architecture Blueprints ↓</a>
            </div>

            <div class="article__rule"></div>

            <div class="article__body">
                @if ($skill->summary)
                    <p class="article__lead" style="font-size: 1.2rem; color: var(--muted); margin-bottom: 2rem;">
                        {{ $skill->summary }}
                    </p>
                @endif

                @markdown($skill->content)

                @if ($skill->architectures->isNotEmpty())
                    <div id="blueprints" style="margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--hair);">
                        <div class="mono" style="margin-bottom: 12px; color: var(--muted);">Architecture &amp; System Diagrams</div>
                        <h2 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 24px;">Visual Blueprints</h2>
                        
                        <div class="blueprints-grid">
                            @foreach ($skill->architectures as $arch)
                                <div class="blueprint-card">
                                    <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 12px;">{{ $arch->title }}</h3>
                                    @if ($arch->description)
                                        <p style="color: var(--muted); font-size: 0.95rem; margin-bottom: 20px;">{{ $arch->description }}</p>
                                    @endif
                                    <div class="blueprint-svg-box">
                                        {!! $arch->diagram_svg !!}
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>

            @if ($relatedSkills->isNotEmpty())
                <div class="related-skills-section" style="margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--hair);">
                    <h3 class="mono" style="margin-bottom: 24px;">Related Skills &amp; Protocols</h3>
                    <div class="skills-grid">
                        @foreach ($relatedSkills as $rel)
                            @include('library.partials._card', ['skill' => $rel])
                        @endforeach
                    </div>
                </div>
            @endif

            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('library.index') }}">← All Open-Source Skills</a>
                <a class="btn btn--ghost" href="{{ route('blueprints.index') }}">All Architecture Blueprints →</a>
                <a class="btn btn--ghost" href="/#contact">Discuss Custom Architecture →</a>
            </div>
        </div>
    </article>
@endsection
