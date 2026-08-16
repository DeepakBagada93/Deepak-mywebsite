<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{ $post->excerpt }}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Deepak Bagada">
    <meta name="theme-color" content="#ffffff">
    <link rel="canonical" href="https://saasnext.in/journal/{{ $post->slug }}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="{{ $post->title }} — Deepak Bagada">
    <meta property="og:description" content="{{ $post->excerpt }}">
    <meta property="og:url" content="https://saasnext.in/journal/{{ $post->slug }}">
    <meta property="og:image" content="https://saasnext.in/images/about-portrait.png">
    <meta name="twitter:card" content="summary_large_image">
    <title>{{ $post->title }} — Deepak Bagada, Junagadh Gujarat</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/css/app.css">
</head>
<body>

    @include('portfolio.partials.masthead')

    <main>
        <article class="article article--page">
            <div class="container">
                <div class="article__meta mono">
                    <span class="article__tag">{{ strtoupper($post->tag ?? 'NEWS') }}</span>
                    <span class="article__date">{{ $post->published_at?->format('d M Y') }}</span>
                    <span class="article__byline">By Deepak Bagada</span>
                </div>
                <h1 class="article__title">{{ $post->title }}</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    @foreach (preg_split('/\n\n+/', $post->body) as $para)
                        <p>{!! nl2br(e($para)) !!}</p>
                    @endforeach
                </div>
                <div class="article__foot">
                    <a class="btn btn--ghost" href="{{ route('home') }}#journal">← Back to the desk</a>
                </div>
            </div>
        </article>
    </main>

    @include('portfolio.partials.footer')

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
