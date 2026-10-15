@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <nav class="mono article__crumbs" aria-label="Breadcrumb" style="margin-bottom:16px;font-size:12px;">
                <a href="/">Home</a> / <a href="{{ route('journal.index') }}">Journal</a> / {{ $post->title }}
            </nav>
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper(($post->category ?? '') ?: 'AI DEV') }}</span>
                <span class="article__date">{{ $post->date?->format('d M Y, h:i A T') ?? '' }}</span>
                @if (!empty($post->read_time))
                    <span class="article__readtime">· {{ $post->read_time }}</span>
                @endif
                <span class="article__byline">· By {{ $post->author ?? $site['name'] }}</span>
            </div>
            <h1 class="article__title">{{ $post->title }}</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                @markdown($post->content)
            </div>

            <aside class="author-box" style="margin-top:36px;padding:24px;border:1px solid var(--hair);border-radius:8px;display:flex;gap:16px;align-items:flex-start;">
                <img src="/images/about-portrait.png" alt="Deepak Bagada — AI Developer in Junagadh, Gujarat" width="72" height="90" style="border-radius:6px;object-fit:cover;" loading="lazy">
                <div>
                    <p class="mono" style="font-size:12px;margin:0 0 6px;">WRITTEN BY</p>
                    <p style="margin:0 0 6px;"><strong>Deepak Bagada</strong> — AI developer, web developer &amp; automation expert, Junagadh, Gujarat, India. Founder of SaaS Next, creator of Curro. 5+ years, 40+ production builds.</p>
                    <p style="margin:0;font-size:14px;"><a href="{{ route('legal.about') }}">About me</a> · <a href="{{ $site['socials']['LinkedIn'] }}">LinkedIn</a> · <a href="{{ $site['socials']['GitHub'] }}">GitHub</a> · <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a></p>
                </div>
            </aside>

            @if (!empty($related) && $related->count())
                <section style="margin-top:36px;">
                    <h2 class="mono" style="font-size:13px;">KEEP READING</h2>
                    <ul>
                        @foreach ($related as $rel)
                            <li><a href="{{ route('journal.show', $rel->slug) }}">{{ $rel->title }}</a></li>
                        @endforeach
                    </ul>
                </section>
            @endif

            <div style="margin-top: 50px;">
                @include('partials.newsletter', [
                    'theme' => 'light',
                    'source' => 'journal_post',
                    'label' => '// NEVER MISS A BREAKDOWN',
                    'title' => 'Enjoyed this engineering dispatch?',
                    'description' => 'Join the private subscriber list. Weekly unvarnished analyses on AI architectures, multi-agent systems, and scalable web engineering.',
                ])
            </div>

            <div class="article__foot">
                <a class="btn btn--ghost" href="{{ route('journal.index') }}">← All journal articles</a>
                <a class="btn btn--ghost" href="/#contact">Get in touch →</a>
            </div>
        </div>
    </article>
@endsection

