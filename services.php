<?php

require __DIR__ . '/partials/functions.php';

$site     = site();
$services = services();
$url      = rtrim($site['url'], '/');

$head = [
    'title'       => 'Services — Website Development, AI Development & SEO/AEO | ' . $site['name'] . ', Junagadh Gujarat',
    'description' => 'Services by Deepak Bagada, Junagadh Gujarat: website development (Laravel/PHP), AI development & AI agents, and SEO/AEO for Google and AI answers. India & remote.',
    'canonical'   => $url . '/services',
    'json_ld'     => json_encode([
        '@context' => 'https://schema.org',
        '@type'    => 'ItemList',
        'name'     => 'Services by ' . $site['name'],
        'itemListElement' => array_map(static function ($service, $index) use ($url) {
            return [
                '@type'    => 'ListItem',
                'position' => $index + 1,
                'name'     => $service['title'],
                'url'      => $url . '/services/' . $service['slug'],
            ];
        }, $services, array_keys($services)),
    ], JSON_UNESCAPED_SLASHES),
];

require __DIR__ . '/partials/head.php';
?>
<body>
    <?php require __DIR__ . '/partials/masthead.php'; ?>

    <main>
        <article class="article article--page">
            <div class="container">
                <div class="article__meta mono"><span class="article__tag">Services</span></div>
                <h1 class="article__title">What I do — and where</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>Three disciplines, one person, based in <strong>Junagadh, Gujarat</strong> and
                    working across India and remotely: websites, AI systems, and the SEO/AEO work that
                    makes both visible. Each service has its own page — pick the one you need.</p>
                </div>

                <div class="journal__list" style="margin-top:40px">
                    <?php foreach ($services as $service): ?>
                        <a class="entry reveal" data-reveal href="<?= e(service_url($service['slug'])) ?>">
                            <div class="entry__meta mono">
                                <span class="entry__tag"><?= e(strtoupper($service['kicker'])) ?></span>
                            </div>
                            <div class="entry__main">
                                <h2 class="entry__title"><?= e($service['title']) ?></h2>
                                <p class="entry__excerpt"><?= e($service['tagline']) ?></p>
                                <span class="entry__read mono">View service →</span>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>

                <div class="article__foot">
                    <a class="btn btn--ghost" href="/#contact">Get in touch →</a>
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
