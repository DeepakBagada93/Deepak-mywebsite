<?php

// Small helpers used by the pure-PHP pages. No database — content lives in data/*.php.

function site(): array
{
    static $site = null;
    if ($site === null) {
        $site = require __DIR__ . '/../data/site.php';
    }

    return $site;
}

function posts(): array
{
    static $posts = null;
    if ($posts === null) {
        $posts = require __DIR__ . '/../data/posts.php';
        usort($posts, static fn ($a, $b) => strcmp((string) ($b['published_at'] ?? ''), (string) ($a['published_at'] ?? '')));
    }

    return $posts;
}

function post_by_slug(string $slug): ?array
{
    foreach (posts() as $post) {
        if (($post['slug'] ?? null) === $slug) {
            return $post;
        }
    }

    return null;
}

function projects(): array
{
    static $projects = null;
    if ($projects === null) {
        $projects = require __DIR__ . '/../data/projects.php';
        usort($projects, static fn ($a, $b) => (int) ($a['sort_order'] ?? 0) <=> (int) ($b['sort_order'] ?? 0));
    }

    return $projects;
}

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function fmt_date(?string $date, string $format = 'd M Y'): string
{
    if (!$date) {
        return '';
    }
    $ts = strtotime($date);

    return $ts ? date($format, $ts) : $date;
}

function post_url(string $slug): string
{
    return '/journal/' . $slug;
}
