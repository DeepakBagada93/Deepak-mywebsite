<?php

require __DIR__ . '/partials/functions.php';

$site = site();
$url  = rtrim($site['url'], '/');
$slug = trim((string) ($_GET['slug'] ?? ''));
$service = service_by_slug($slug);

if ($service === null) {
    http_response_code(404);
    $head = [
        'title'       => 'Service not found — ' . $site['name'],
        'description' => 'The service you are looking for does not exist.',
        'canonical'   => $url . '/services',
    ];
    require __DIR__ . '/partials/head.php';
    ?>
<body>
    <?php require __DIR__ . '/partials/masthead.php'; ?>
    <main>
        <section class="section article article--page">
            <div class="container">
                <div class="article__meta mono"><span class="article__tag">404</span></div>
                <h1 class="article__title">Service not found</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>The service you are looking for does not exist — it may have been moved or renamed.</p>
                </div>
                <div class="article__foot">
                    <a class="btn btn--ghost" href="/services">← All services</a>
                </div>
            </div>
        </section>
    </main>
    <?php require __DIR__ . '/partials/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
    <?php
    exit;
}

$canonical = $url . '/services/' . $service['slug'];
$faqJson = array_map(static function ($question, $answer) {
    return [
        '@type'            => 'Question',
        'name'             => $question,
        'acceptedAnswer'   => [
            '@type' => 'Answer',
            'text'  => $answer,
        ],
    ];
}, array_keys($service['faq']), array_values($service['faq']));

$head = [
    'title'       => $service['title'] . ' in ' . $site['location'] . ' | ' . $site['name'],
    'description' => $service['meta_description'],
    'canonical'   => $canonical,
    'json_ld'     => json_encode([
        '@context' => 'https://schema.org',
        '@graph'   => [
            [
                '@type'         => 'Service',
                'name'          => $service['title'],
                'serviceType'   => $service['service_type'],
                'description'   => $service['intro'],
                'url'           => $canonical,
                'areaServed'    => $service['area_served'],
                'provider'      => [
                    '@type'       => 'Person',
                    'name'        => $site['name'],
                    'jobTitle'    => 'AI Developer, Web Developer & SEO/AEO Expert',
                    'url'         => $url . '/',
                    'email'       => $site['email'],
                    'address'     => [
                        '@type'           => 'PostalAddress',
                        'addressLocality' => 'Junagadh',
                        'addressRegion'   => 'Gujarat',
                        'addressCountry'  => 'IN',
                    ],
                ],
            ],
            [
                '@type'       => 'FAQPage',
                'mainEntity'  => $faqJson,
            ],
            [
                '@type'            => 'BreadcrumbList',
                'itemListElement'  => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url . '/'],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Services', 'item' => $url . '/services'],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $service['title'], 'item' => $canonical],
                ],
            ],
        ],
    ], JSON_UNESCAPED_SLASHES),
];

require __DIR__ . '/partials/head.php';
?>
<body>
    <?php require __DIR__ . '/partials/masthead.php'; ?>

    <main>
        <article class="article article--page">
            <div class="container">
                <div class="article__meta mono">
                    <span class="article__tag"><?= e(strtoupper($service['kicker'])) ?></span>
                    <span class="article__date"><?= e($site['location']) ?></span>
                    <span class="article__byline">By <?= e($site['name']) ?></span>
                </div>
                <h1 class="article__title"><?= e($service['title']) ?></h1>
                <p class="service__tagline"><?= e($service['tagline']) ?></p>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p><?= e($service['intro']) ?></p>

                    <h2 class="service__h2">What's included</h2>
                    <ul class="service__list">
                        <?php foreach ($service['offerings'] as $name => $desc): ?>
                            <li><strong><?= e($name) ?>.</strong> <?= e($desc) ?></li>
                        <?php endforeach; ?>
                    </ul>

                    <h2 class="service__h2">Questions, answered</h2>
                    <div class="faq">
                        <?php foreach ($service['faq'] as $question => $answer): ?>
                            <details class="faq__item">
                                <summary class="faq__q"><?= e($question) ?></summary>
                                <p class="faq__a"><?= e($answer) ?></p>
                            </details>
                        <?php endforeach; ?>
                    </div>
                </div>
                <div class="article__foot">
                    <a class="btn btn--solid" href="/#contact" data-scroll>Start a project</a>
                    <a class="btn btn--ghost" href="/services">All services</a>
                    <a class="btn btn--ghost" href="/">← Back home</a>
                </div>
            </div>
        </article>
    </main>

    <?php require __DIR__ . '/partials/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
