@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">05 — Open Source</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">Open-Source AI Skills &amp; Architecture Library</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>Production-tested AI agent skills, Model Context Protocol (MCP) server blueprints, multi-agent swarms, and autonomous automation pipelines built and open-sourced from <strong>Junagadh, Gujarat, India</strong>.</p>
            </div>

            @include('library.partials._category_filter')

            <div class="skills-grid" style="margin-top: 40px;">
                @if ($skills->isEmpty())
                    <p class="mono" style="padding: 40px 0;">No skills found in this category.</p>
                @else
                    @foreach ($skills as $skill)
                        @include('library.partials._card', ['skill' => $skill])
                    @endforeach
                @endif
            </div>

            @if ($skills->hasPages())
                <div class="pagination-wrapper" style="margin-top: 48px;">
                    {{ $skills->links() }}
                </div>
            @endif

            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('blueprints.index') }}">Architecture Blueprints →</a>
                <a class="btn btn--ghost" href="{{ route('repos.index') }}">Curated Repos →</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
