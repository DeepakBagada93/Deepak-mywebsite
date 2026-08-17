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

function services(): array
{
    static $services = null;
    if ($services === null) {
        $services = require __DIR__ . '/../data/services.php';
    }

    return $services;
}

function service_by_slug(string $slug): ?array
{
    foreach (services() as $service) {
        if (($service['slug'] ?? null) === $slug) {
            return $service;
        }
    }

    return null;
}

function service_url(string $slug): string
{
    return '/services/' . $slug;
}

function faqs(): array
{
    static $faqs = null;
    if ($faqs === null) {
        $faqs = require __DIR__ . '/../data/faq.php';
    }

    return $faqs;
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

function render_post_body(string $body): string
{
    $paras = preg_split('/\n\n+/', trim($body));
    $html = '';

    foreach ($paras as $para) {
        $para = trim($para);
        if ($para === '') continue;

        // Convert ## and ### Headings
        if (preg_match('/^#{1,4}\s+(.+)$/', $para, $m)) {
            $html .= '<h3>' . e($m[1]) . '</h3>' . "\n";
            continue;
        }

        // Convert Markdown links [text](url) -> HTML <a href="url">text</a>
        $para = preg_replace_callback('/\[([^\]]+)\]\(([^)]+)\)/', static function ($m) {
            return '<a href="' . e($m[2]) . '">' . e($m[1]) . '</a>';
        }, $para);

        // Convert Bold **text** -> <strong>text</strong>
        $para = preg_replace_callback('/\*\*([^*]+)\*\*/', static function ($m) {
            return '<strong>' . e($m[1]) . '</strong>';
        }, $para);

        // Convert Italic *text* -> <em>text</em>
        $para = preg_replace_callback('/\*([^*]+)\*/', static function ($m) {
            return '<em>' . e($m[1]) . '</em>';
        }, $para);

        // Convert bullet lists (- or *)
        if (preg_match('/^(?:[-*]\s+.+(?:\n|$))+/', $para)) {
            $items = preg_split('/\n/', $para);
            $list_html = '<ul style="margin: 16px 0; padding-left: 24px;">' . "\n";
            foreach ($items as $item) {
                $item = trim($item);
                if (preg_match('/^[-*]\s+(.+)$/', $item, $im)) {
                    $list_html .= '  <li>' . $im[1] . '</li>' . "\n";
                }
            }
            $list_html .= '</ul>' . "\n";
            $html .= $list_html;
            continue;
        }

        $html .= '<p>' . nl2br($para) . '</p>' . "\n";
    }

    return $html;
}

