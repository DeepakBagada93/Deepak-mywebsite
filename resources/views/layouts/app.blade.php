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
    $robots = $head['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    $cssFile = public_path('css/app.css');
    $jsFile = public_path('js/main.js');
    $cssVersion = file_exists($cssFile) ? substr(md5_file($cssFile), 0, 10) : '1';
    $jsVersion = file_exists($jsFile) ? substr(md5_file($jsFile), 0, 10) : '1';
@endphp
<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#" data-store-currency="{{ $storeCurrency ?? \App\Support\Money::default() }}">
<head>
    <!-- Google AdSense -->
    <meta name="google-adsense-account" content="ca-pub-4764950179214862">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4764950179214862"
     crossorigin="anonymous"></script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HJB2ZSDHW9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-HJB2ZSDHW9');
    </script>

    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1812868493215953');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1812868493215953&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $desc }}">
    <meta name="keywords" content="AI developer Gujarat, AI expert Junagadh, AI agent development India, enterprise AI automation, Deepak Bagada">
    <meta name="robots" content="{{ $robots }}">
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
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset('css/app.css') }}?v={{ $cssVersion }}">
</head>
<body>

    @if (request()->is('/'))
        @include('partials.preloader')
    @endif

    @include('partials.masthead')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')

    @if (request()->routeIs('products.index', 'products.show'))
        @include('products.partials.currency-switch', ['floating' => true])
    @endif

    @include('products.partials.cart')

    <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script defer src="{{ asset('js/main.js') }}?v={{ $jsVersion }}"></script>
</body>
</html>
