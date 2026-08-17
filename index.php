<?php

require __DIR__ . '/partials/functions.php';

$site     = site();
$posts    = posts();
$projects = projects();
$faqs     = faqs();
$services = services();
$url      = rtrim($site['url'], '/');

$faqEntities = array_map(static function ($faq) {
    return [
        '@type'          => 'Question',
        'name'           => $faq['question'],
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq['answer']],
    ];
}, $faqs);

$serviceOffers = array_map(static function ($service) use ($url) {
    return [
        '@type'     => 'Offer',
        'itemOffered' => [
            '@type'       => 'Service',
            'name'        => $service['title'],
            'serviceType' => $service['service_type'],
            'url'         => $url . '/services/' . $service['slug'],
        ],
    ];
}, $services);

$head = [
    'title'       => $site['name'] . ' — Best Website Developer, Digital Marketer & AI Expert in Junagadh, Gujarat | AI Agents, SEO & AEO',
    'description' => 'Deepak Bagada — website developer, digital marketer and AI expert in Junagadh, Gujarat. Fast Laravel websites, AI agents & automation, and SEO/AEO that ranks on Google and gets cited by AI. Serving Gujarat, India & remote.',
    'canonical'   => $url . '/',
    'json_ld'     => json_encode([
        '@context' => 'https://schema.org',
        '@graph'   => [
            [
                '@type'     => 'Person',
                '@id'       => $url . '/#person',
                'name'      => $site['name'],
                'jobTitle'  => 'AI Developer, Web Developer & SEO/AEO Expert',
                'url'       => $url . '/',
                'email'     => $site['email'],
                'address'   => [
                    '@type'           => 'PostalAddress',
                    'addressLocality' => 'Junagadh',
                    'addressRegion'   => 'Gujarat',
                    'addressCountry'  => 'IN',
                ],
                'sameAs'    => array_values($site['socials']),
                'knowsAbout' => [
                    'Web Development', 'Laravel', 'PHP', 'Digital Marketing', 'SEO', 'AEO',
                    'AI Development', 'AI Agents', 'Multi-Agent Systems', 'AI Automation', 'RAG',
                ],
            ],
            [
                '@type'          => 'ProfessionalService',
                'name'           => $site['name'],
                'description'    => 'AI developer, web developer and SEO/AEO expert based in Junagadh, Gujarat. Websites, AI systems, AI agents, multi-agent automation and high-ranking digital presence.',
                'email'          => $site['email'],
                'url'            => $url . '/',
                'areaServed'     => ['Junagadh', 'Gujarat', 'India', 'Remote'],
                'address'        => [
                    '@type'           => 'PostalAddress',
                    'addressLocality' => 'Junagadh',
                    'addressRegion'   => 'Gujarat',
                    'addressCountry'  => 'IN',
                ],
                'founder'        => ['@id' => $url . '/#person'],
                'knowsAbout'     => ['Web Development', 'Digital Marketing', 'SEO', 'AEO', 'AI Development', 'AI Agents', 'AI Automation'],
                'hasOfferCatalog' => [
                    '@type'          => 'OfferCatalog',
                    'name'           => 'Services',
                    'itemListElement' => $serviceOffers,
                ],
            ],
            [
                '@type'      => 'FAQPage',
                'mainEntity' => $faqEntities,
            ],
        ],
    ], JSON_UNESCAPED_SLASHES),
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

        <?php // FAQ ?>
        <?php require __DIR__ . '/partials/faq.php'; ?>

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
