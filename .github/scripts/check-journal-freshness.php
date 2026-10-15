#!/usr/bin/env php
<?php

/**
 * CI guard: data/posts.php must be internally consistent and must not contain
 * posts dated beyond tomorrow.
 *
 * The tolerance uses the LATER of UTC / Asia/Kolkata "tomorrow" because
 * publishing happens on IST while CI runners run on UTC — a post dated
 * "today" in Junagadh must never trip the check on a UTC runner (or vice
 * versa). Today and tomorrow are echoed so any failure is self-explaining.
 */
date_default_timezone_set('UTC');

$postsFile = dirname(__DIR__, 2).'/data/posts.php';
$posts = require $postsFile;

$todayUtc = new DateTimeImmutable('today', new DateTimeZone('UTC'));
$todayIst = new DateTimeImmutable('today', new DateTimeZone('Asia/Kolkata'));
$maxAllowed = max(
    $todayUtc->modify('+1 day')->format('Y-m-d'),
    $todayIst->modify('+1 day')->format('Y-m-d')
);

echo 'today_utc='.$todayUtc->format('Y-m-d').' today_ist='.$todayIst->format('Y-m-d').' max_allowed='.$maxAllowed.PHP_EOL;

$slugs = array_column($posts, 'slug');
if (count($slugs) !== count(array_unique($slugs))) {
    fwrite(STDERR, "FAIL: duplicate slugs in data/posts.php\n");
    exit(1);
}

foreach ($posts as $post) {
    $raw = $post['published_at'] ?? '';
    // Accepts date-only (YYYY-MM-DD, legacy = midnight IST) or full slot
    // datetime (Y-m-d H:i:s IST); the freshness window compares the day part.
    $day = substr((string) $raw, 0, 10);
    if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $day)) {
        fwrite(STDERR, "FAIL: bad published_at '{$raw}' on ".($post['slug'] ?? '?')."\n");
        exit(1);
    }
    $time = substr((string) $raw, 11, 8);
    if ($time !== '' && ! preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $time)) {
        fwrite(STDERR, "FAIL: bad published_at time '{$raw}' on ".($post['slug'] ?? '?')."\n");
        exit(1);
    }
    if ($day > $maxAllowed) {
        fwrite(STDERR, "FAIL: future-dated post ".($post['slug'] ?? '?')." ({$day} > {$maxAllowed})\n");
        exit(1);
    }
}

$days = array_map(static fn ($p) => substr((string) ($p['published_at'] ?? ''), 0, 10), $posts);
rsort($days);

echo 'posts='.count($posts).' latest='.($days[0] ?? '?').' freshness=PASS'.PHP_EOL;
exit(0);
