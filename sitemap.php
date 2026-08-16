<?php

require __DIR__ . '/partials/functions.php';

header('Content-Type: application/xml; charset=UTF-8');

$site  = site();
$url   = rtrim($site['url'], '/');
$posts = posts();
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc><?= $url ?>/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <?php foreach ($posts as $post): ?>
    <url>
        <loc><?= $url ?>/journal/<?= e($post['slug']) ?></loc>
        <lastmod><?= e($post['published_at'] ?? '') ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <?php endforeach; ?>
</urlset>
