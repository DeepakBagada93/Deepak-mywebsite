@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper(($post->category ?? '') ?: 'AI DEV') }}</span>
                <span class="article__date">{{ $post->date?->format('d M Y') ?? '' }}</span>
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

