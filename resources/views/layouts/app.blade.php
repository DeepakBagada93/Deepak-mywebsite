@php
    $site = config('site');
    $url = rtrim($site['url'], '/');
    $title = $head['title'] ?? $site['name'] . ' — ' . $site['tagline'];
    $desc = $head['description'] ?? $site['description'];
    $canon = $head['canonical'] ?? $url . '/';
    $ogType = $head['og_type'] ?? 'website';
    $ogTitle = $head['og_title'] ?? $title;
    $ogImg = $url . ($head['og_image'] ?? '/images/about-portrait.png');
    $ogImgAlt = $head['og_image_alt'] ?? 'Deepak Bagada — Best AI Expert & AI Developer in Junagadh, Gujarat, India';
@endphp
<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $desc }}">
    <meta name="keywords" content="best AI developer in Junagadh, AI expert Gujarat, AI developer India, best AI agent developer Gujarat, multi-agent AI systems India, AI automation Junagadh, AI consultant Gujarat, top AI expert India, RAG AI developer India, generative AI expert Gujarat, Deepak Bagada AI, AI agency Junagadh, AI solutions Gujarat">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="{{ $site['name'] }}">
    <meta name="publisher" content="{{ $site['name'] }}">
    <meta name="theme-color" content="#ffffff">
    <meta name="geo.region" content="IN-GJ">
    <meta name="geo.placename" content="Junagadh, Gujarat, India">
    <meta name="geo.position" content="21.5222;70.4579">
    <meta name="ICBM" content="21.5222, 70.4579">

    {{-- Canonical & Discovery --}}
    <link rel="canonical" href="{{ $canon }}">
    <link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt (AI Grounding Context)">
    <link rel="author" href="{{ $url }}/#person">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">

    {{-- Open Graph / Facebook (Multi-Modal Image Rich for AI Snippets) --}}
    <meta property="og:site_name" content="{{ $site['name'] }} — AI Expert & Developer">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $desc }}">
    <meta property="og:url" content="{{ $canon }}">
    <meta property="og:image" content="{{ $ogImg }}">
    <meta property="og:image:secure_url" content="{{ $ogImg }}">
    <meta property="og:image:alt" content="{{ $ogImgAlt }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/png">
    <meta property="og:locale" content="en_US">

    {{-- Twitter / X Cards --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@deeepakbagada">
    <meta name="twitter:creator" content="@deeepakbagada">
    <meta name="twitter:title" content="{{ $ogTitle }}">
    <meta name="twitter:description" content="{{ $desc }}">
    <meta name="twitter:image" content="{{ $ogImg }}">
    <meta name="twitter:image:alt" content="{{ $ogImgAlt }}">

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
