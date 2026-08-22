@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper($blueprint->skill?->category?->name ?? 'BLUEPRINT') }}</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            
            <h1 class="article__title">{{ $blueprint->title }}</h1>
            
            <div class="article__rule"></div>

            <div class="article__body">
                @if ($blueprint->description)
                    <p class="article__lead" style="font-size: 1.15rem; color: var(--muted); margin-bottom: 2rem;">
                        {{ $blueprint->description }}
                    </p>
                @endif

                <div class="blueprint-viewer" style="margin: 32px 0; background: #161616; padding: 28px; border-radius: 8px; border: 1px solid var(--hair);">
                    {!! $blueprint->diagram_svg !!}
                </div>

                @if ($blueprint->skill)
                    <div class="blueprint-skill-callout" style="margin-top: 40px; padding: 24px; border: 1px solid var(--hair); background: rgba(0,0,0,0.02);">
                        <div class="mono" style="font-size: 0.68rem; color: var(--muted); margin-bottom: 8px;">Associated Implementation Skill</div>
                        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 8px;">{{ $blueprint->skill->title }}</h3>
                        <p style="color: var(--muted); font-size: 0.95rem; margin-bottom: 16px;">{{ $blueprint->skill->summary }}</p>
                        <a href="{{ route('library.show', $blueprint->skill->slug) }}" class="btn btn--solid" style="padding: 10px 20px; font-size: 0.68rem;">
                            View Full Skill &amp; Code Specs →
                        </a>
                    </div>
                @endif
            </div>

            @if ($relatedBlueprints->isNotEmpty())
                <div class="related-blueprints-section" style="margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--hair);">
                    <h3 class="mono" style="margin-bottom: 24px;">Other Architecture Diagrams</h3>
                    <div class="blueprints-grid">
                        @foreach ($relatedBlueprints as $rel)
                            <div class="blueprint-card">
                                <h4 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 12px;">
                                    <a href="{{ route('blueprints.show', $rel->id) }}">{{ $rel->title }}</a>
                                </h4>
                                <div class="blueprint-svg-box">
                                    <a href="{{ route('blueprints.show', $rel->id) }}">
                                        {!! $rel->diagram_svg !!}
                                    </a>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <div class="article__foot">
                <a class="btn btn--ghost" href="{{ route('blueprints.index') }}">← All Blueprints</a>
                <a class="btn btn--solid" href="{{ route('library.index') }}">Browse Skills Library →</a>
            </div>
        </div>
    </article>
@endsection
