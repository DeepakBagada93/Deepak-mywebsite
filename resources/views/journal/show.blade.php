@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper(($post->category ?? '') ?: 'NEWS') }}</span>
                <span class="article__date">{{ $post->date?->format('d M Y') ?? '' }}</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">{{ $post->title }}</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                @markdown($post->content)
            </div>
            <div class="article__foot">
                <a class="btn btn--ghost" href="/#journal">← Back to the desk</a>
            </div>
        </div>
    </article>
@endsection
