@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">04 — The news</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">Journal & Field Notes</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>Architectural breakdowns, AI agent systems, Model Context Protocol (MCP) servers, web engineering, and authentic founder notes published from <strong>Junagadh, Gujarat, India</strong>.</p>
            </div>

            <div class="journal__list" style="margin-top: 40px;">
                @if (count($posts) === 0)
                    <p class="mono">No journal entries yet.</p>
                @else
                    @foreach ($posts as $post)
                        <a class="entry reveal" data-reveal href="{{ route('journal.show', $post->slug) }}">
                            <div class="entry__meta mono">
                                <span class="entry__tag">{{ strtoupper(($post->category ?? '') ?: 'AI DEV') }}</span>
                                <span class="entry__date">{{ $post->date?->format('d M Y') ?? '' }}</span>
                            </div>
                            <div class="entry__main">
                                <h2 class="entry__title">{{ $post->title }}</h2>
                                <p class="entry__excerpt">{{ $post->excerpt }}</p>
                                <span class="entry__read mono">Read the story →</span>
                            </div>
                        </a>
                    @endforeach
                @endif
            </div>

            <div class="article__foot">
                <a class="btn btn--ghost" href="/#contact">Get in touch →</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
