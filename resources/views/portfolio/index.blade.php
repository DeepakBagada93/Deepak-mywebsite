<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Deepak Bagada — the best AI developer in Junagadh, Gujarat. Premium AI development, AI agents, multi-agent automation, web development and SEO/AEO. Building websites, AI systems and automation from Junagadh, Gujarat.">
    <meta name="keywords" content="best AI developer Junagadh, AI development Gujarat, AI agents Junagadh, multi-agent AI, AI automation Gujarat, SEO expert Junagadh, AEO expert, premium web developer Gujarat, Deepak Bagada, SaaS Next">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Deepak Bagada">
    <meta name="theme-color" content="#ffffff">
    <link rel="canonical" href="https://saasnext.in/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Deepak Bagada — Best AI Developer in Junagadh, Gujarat | AI Agents, Automation & SEO">
    <meta property="og:description" content="Premium AI development, AI agents, multi-agent automation and SEO/AEO — from Junagadh, Gujarat. Websites, AI systems and automation.">
    <meta property="og:url" content="https://saasnext.in/">
    <meta property="og:image" content="https://saasnext.in/images/about-portrait.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Deepak Bagada — Best AI Developer in Junagadh, Gujarat">
    <meta name="twitter:description" content="AI systems, AI agents & automation — plus SEO & AEO to make them rank. Junagadh, Gujarat.">
    <title>Deepak Bagada — Best AI Developer in Junagadh, Gujarat | AI Agents, Automation & SEO</title>

    @verbatim
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Deepak Bagada",
        "description": "AI developer, web developer and SEO/AEO expert based in Junagadh, Gujarat. AI systems, AI agents, multi-agent automation and high-ranking websites.",
        "email": "ceo@saasnext.in",
        "url": "https://saasnext.in/",
        "areaServed": ["Junagadh", "Gujarat", "India", "Remote"],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Junagadh",
            "addressRegion": "Gujarat",
            "addressCountry": "IN"
        },
        "sameAs": ["https://github.com/", "https://www.linkedin.com/", "https://x.com/"],
        "knowsAbout": ["AI Development", "AI Agents", "Multi-Agent Systems", "AI Automation", "Web Development", "Laravel", "SEO", "AEO"]
    }
    </script>
    @endverbatim

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/css/app.css">
</head>
<body>

    {{-- Preloader --}}
    <div class="preloader" id="preloader" aria-hidden="true">
        <div class="preloader__inner">
            <p class="preloader__label mono">Portfolio — Vol. 01</p>
            <h1 class="preloader__name">Deepak Bagada</h1>
            <div class="preloader__line"><span id="preloader-fill"></span></div>
            <p class="preloader__count mono" id="preloader-count">000</p>
        </div>
    </div>

    {{-- Masthead --}}
    @include('portfolio.partials.masthead')

    <main>
        {{-- Hero --}}
        @include('portfolio.partials.hero')

        {{-- About --}}
        @include('portfolio.partials.about')

        {{-- Skills --}}
        @include('portfolio.partials.skills')

        {{-- Projects --}}
        @include('portfolio.partials.projects', ['projects' => $projects])

        {{-- Journal --}}
        @include('portfolio.partials.journal', ['posts' => $posts])

        {{-- Contact --}}
        @include('portfolio.partials.contact')
    </main>

    {{-- Footer --}}
    @include('portfolio.partials.footer')

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
