<?php
// Expects a $head array: title, description, canonical, og_type, og_title, og_image, json_ld (optional).
$site    = site();
$url     = rtrim($site['url'], '/');
$title   = $head['title'] ?? $site['name'];
$desc    = $head['description'] ?? $site['tagline'];
$canon   = $head['canonical'] ?? $url . '/';
$ogType  = $head['og_type'] ?? 'website';
$ogTitle = $head['og_title'] ?? $title;
$ogImg   = $url . ($head['og_image'] ?? '/images/about-portrait.png');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="<?= e($desc) ?>">
    <meta name="keywords" content="best AI developer Junagadh, AI development Gujarat, AI agents Junagadh, multi-agent AI, AI automation Gujarat, SEO expert Junagadh, AEO expert, premium web developer Gujarat, Deepak Bagada, SaaS Next">
    <meta name="robots" content="index, follow">
    <meta name="author" content="<?= e($site['name']) ?>">
    <meta name="theme-color" content="#ffffff">
    <link rel="canonical" href="<?= e($canon) ?>">
    <link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt">
    <meta property="og:type" content="<?= e($ogType) ?>">
    <meta property="og:title" content="<?= e($ogTitle) ?>">
    <meta property="og:description" content="<?= e($desc) ?>">
    <meta property="og:url" content="<?= e($canon) ?>">
    <meta property="og:image" content="<?= e($ogImg) ?>">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($ogTitle) ?>">
    <meta name="twitter:description" content="<?= e($desc) ?>">
    <title><?= e($title) ?></title>

    <?php if (!empty($head['json_ld'])): ?>
    <script type="application/ld+json"><?= $head['json_ld'] ?></script>
    <?php endif; ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/css/app.css">
</head>
