@extends('layouts.app')

@section('content')
    <article class="article article--page marvel-halftone">
        <div class="container">
            <div style="margin-bottom:12px;">
                <span class="thor-banner">⚡ ASGARDIAN INTEL ARCHIVE // STRUCK BY LIGHTNING</span>
            </div>
            <div class="article__meta mono">
                <span class="article__tag" style="background:#000;color:#f59e0b;border:1px solid #f59e0b;padding:3px 8px;">DISPATCH VOL. 04</span>
                <span class="article__byline" style="font-weight:600;">Forged by {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title font-comic" style="font-size:clamp(3rem,7.5vw,5.8rem);line-height:0.95;letter-spacing:0.02em;margin-top:12px;">
                THUNDER &amp; LIGHTNING DISPATCHES: <span style="color:#f59e0b;">AI FIELD NOTES</span>
            </h1>
            <div class="article__rule" style="border-top:2px solid #000;margin:24px 0 32px 0;"></div>
            <div class="article__body" style="font-size:1.15rem;line-height:1.8;color:#334155;max-width:72ch;">
                <p>High-voltage architectural teardowns, autonomous AI swarms, Model Context Protocol (MCP) servers, and sovereign web engineering dispatches forged in the fires of real-world production at <strong>Junagadh, Gujarat, India</strong>.</p>
            </div>

            <div class="journal__list" style="margin-top: 40px;">
                @if (count($posts) === 0)
                    <p class="mono">No journal entries yet.</p>
                @else
                    @foreach ($posts as $post)
                        <a class="thor-journal-card reveal" data-reveal href="{{ route('journal.show', $post->slug) }}" style="text-decoration:none;display:block;">
                            <div class="entry__meta mono" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">
                                <span class="comic-issue-box" style="font-size:0.62rem;padding:2px 7px;">{{ strtoupper(($post->category ?? '') ?: 'AI DEV') }}</span>
                                <span class="entry__date" style="font-size:0.75rem;color:#64748b;">{{ $post->date?->format('d M Y, h:i A') ?? '' }}</span>
                                @if (!empty($post->read_time))
                                    <span class="mjolnir-worthy-tag">⚡ {{ $post->read_time }} // WORTHY</span>
                                @endif
                            </div>
                            <div class="entry__main">
                                <h2 class="entry__title font-comic" style="font-size:1.9rem;line-height:1.1;letter-spacing:0.02em;color:#0f172a;margin-bottom:8px;">{{ $post->title }}</h2>
                                <p class="entry__excerpt" style="font-size:0.95rem;line-height:1.65;color:#475569;margin-bottom:14px;">{{ $post->excerpt }}</p>
                                <span class="font-hud" style="font-size:0.75rem;font-weight:700;color:#0284c7;letter-spacing:0.08em;text-transform:uppercase;">Wield this knowledge →</span>
                            </div>
                        </a>
                    @endforeach
                @endif
            </div>

            @if ($posts instanceof \Illuminate\Pagination\LengthAwarePaginator && $posts->hasPages())
                <nav class="mono" style="margin-top:32px;display:flex;gap:16px;align-items:center;" aria-label="Journal pages">
                    @if ($posts->onFirstPage())
                        <span style="opacity:.4;">← Prev</span>
                    @else
                        <a href="{{ $posts->previousPageUrl() }}">← Prev</a>
                    @endif
                    <span>Page {{ $posts->currentPage() }} of {{ $posts->lastPage() }}</span>
                    @if ($posts->hasMorePages())
                        <a href="{{ $posts->nextPageUrl() }}">Next →</a>
                    @else
                        <span style="opacity:.4;">Next →</span>
                    @endif
                </nav>
            @endif

            <div style="margin-top: 50px;">
                @include('partials.newsletter', [
                    'theme' => 'light',
                    'source' => 'journal_index',
                    'label' => '// THE JOURNAL DISPATCH',
                    'title' => 'Get New Field Notes In Your Inbox',
                    'description' => 'Subscribe to receive deep architectural breakdowns, autonomous agent workflows, and production web engineering dispatches as soon as they drop.',
                ])
            </div>

            <div class="article__foot">
                <a class="btn btn--ghost" href="/#contact">Get in touch →</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection

