<?php

require __DIR__ . '/partials/functions.php';

$site = site();
$slug = trim((string) ($_GET['slug'] ?? ''));
$post = post_by_slug($slug);

if ($post === null) {
    http_response_code(404);
    $head = [
        'title'       => 'Story not found — ' . $site['name'],
        'description' => 'The story you are looking for does not exist.',
        'canonical'   => rtrim($site['url'], '/') . '/',
    ];
    require __DIR__ . '/partials/head.php';
    ?>
<body>
    <?php require __DIR__ . '/partials/masthead.php'; ?>
    <main>
        <section class="section article article--page">
            <div class="container">
                <div class="article__meta mono"><span class="article__tag">404</span></div>
                <h1 class="article__title">Story not found</h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <p>The story you are looking for does not exist — it may have been moved or renamed.</p>
                </div>
                <div class="article__foot">
                    <a class="btn btn--ghost" href="/#journal">← Back to the desk</a>
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

$canonical = rtrim($site['url'], '/') . '/journal/' . $post['slug'];

$head = [
    'title'       => $post['title'] . ' — ' . $site['name'] . ', Junagadh Gujarat',
    'description' => $post['excerpt'],
    'canonical'   => $canonical,
    'og_type'     => 'article',
    'json_ld'     => json_encode([
        '@context' => 'https://schema.org',
        '@graph'   => [
            [
                '@type'          => 'Article',
                'headline'       => $post['title'],
                'description'    => $post['excerpt'],
                'datePublished'  => $post['published_at'] ?? null,
                'dateModified'   => $post['published_at'] ?? null,
                'author'         => ['@type' => 'Person', 'name' => $site['name'], 'url' => rtrim($site['url'], '/') . '/', 'sameAs' => array_values($site['socials'])],
                'publisher'      => ['@type' => 'Person', 'name' => $site['name'], 'url' => rtrim($site['url'], '/') . '/', 'sameAs' => array_values($site['socials'])],
                'mainEntityOfPage' => $canonical,
                'image'          => rtrim($site['url'], '/') . '/images/about-portrait.png',
                'url'            => $canonical,
            ],
            [
                '@type'           => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => rtrim($site['url'], '/') . '/'],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Journal', 'item' => rtrim($site['url'], '/') . '/#journal'],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $post['title'], 'item' => $canonical],
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
                    <span class="article__tag"><?= e(strtoupper(($post['tag'] ?? '') ?: 'NEWS')) ?></span>
                    <span class="article__date"><?= e(fmt_date($post['published_at'] ?? null)) ?></span>
                    <span class="article__byline">By <?= e($site['name']) ?></span>
                </div>
                <h1 class="article__title"><?= e($post['title']) ?></h1>
                <div class="article__rule"></div>
                <div class="article__body">
                    <?= render_post_body((string) $post['body']) ?>
                </div>
                <div class="article__foot">
                    <a class="btn btn--ghost" href="/#journal">← Back to the desk</a>
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
