@php
    $site = config('site');
    $url = rtrim($site['url'], '/');
    $title = $head['title'] ?? $site['name'];
    $desc = $head['description'] ?? $site['tagline'];
    $canon = $head['canonical'] ?? $url . '/';
    $ogType = $head['og_type'] ?? 'website';
    $ogTitle = $head['og_title'] ?? $title;
    $ogImg = $url . ($head['og_image'] ?? '/images/about-portrait.png');
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{ $desc }}">
    <meta name="keywords" content="best AI developer Junagadh, AI development Gujarat, AI agents Junagadh, multi-agent AI, AI automation Gujarat, SEO expert Junagadh, AEO expert, premium web developer Gujarat, Deepak Bagada, SaaS Next">
    <meta name="robots" content="index, follow">
    <meta name="author" content="{{ $site['name'] }}">
    <meta name="theme-color" content="#ffffff">
    <link rel="canonical" href="{{ $canon }}">
    <link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $desc }}">
    <meta property="og:url" content="{{ $canon }}">
    <meta property="og:image" content="{{ $ogImg }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $ogTitle }}">
    <meta name="twitter:description" content="{{ $desc }}">
    <title>{{ $title }}</title>

    @if (!empty($head['json_ld']))
    <script type="application/ld+json">{!! $head['json_ld'] !!}</script>
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/css/app.css">
</head>
<body>

    @include('partials.preloader')

    @include('partials.masthead')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
