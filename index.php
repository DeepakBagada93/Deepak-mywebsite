<?php

require __DIR__ . '/partials/functions.php';

$site     = site();
$posts    = posts();
$projects = projects();

$head = [
    'title'       => $site['name'] . ' — Best AI Developer in Junagadh, Gujarat | AI Agents, Automation & SEO',
    'description' => 'Premium AI development, AI agents, multi-agent automation and SEO/AEO — from Junagadh, Gujarat. Websites, AI systems and automation.',
    'canonical'   => rtrim($site['url'], '/') . '/',
    'json_ld'     => '{
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "' . $site['name'] . '",
    "description": "AI developer, web developer and SEO/AEO expert based in Junagadh, Gujarat. AI systems, AI agents, multi-agent automation and high-ranking websites.",
    "email": "' . $site['email'] . '",
    "url": "' . rtrim($site['url'], '/') . '/",
    "areaServed": ["Junagadh", "Gujarat", "India", "Remote"],
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Junagadh",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
    },
    "sameAs": ["https://github.com/", "https://www.linkedin.com/", "https://x.com/"],
    "knowsAbout": ["AI Development", "AI Agents", "Multi-Agent Systems", "AI Automation", "Web Development", "Laravel", "SEO", "AEO"]
}',
];

require __DIR__ . '/partials/head.php';
?>
<body>

    <?php // Preloader ?>
    <div class="preloader" id="preloader" aria-hidden="true">
        <div class="preloader__inner">
            <p class="preloader__label mono">Portfolio — Vol. 01</p>
            <h1 class="preloader__name"><?= e($site['name']) ?></h1>
            <div class="preloader__line"><span id="preloader-fill"></span></div>
            <p class="preloader__count mono" id="preloader-count">000</p>
        </div>
    </div>

    <?php // Masthead ?>
    <?php require __DIR__ . '/partials/masthead.php'; ?>

    <main>
        <?php // Hero ?>
        <?php require __DIR__ . '/partials/hero.php'; ?>

        <?php // About ?>
        <?php require __DIR__ . '/partials/about.php'; ?>

        <?php // Skills ?>
        <?php require __DIR__ . '/partials/skills.php'; ?>

        <?php // Projects ?>
        <?php require __DIR__ . '/partials/projects.php'; ?>

        <?php // Journal ?>
        <?php require __DIR__ . '/partials/journal.php'; ?>

        <?php // Contact ?>
        <?php require __DIR__ . '/partials/contact.php'; ?>
    </main>

    <?php // Footer ?>
    <?php require __DIR__ . '/partials/footer.php'; ?>

    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
