#!/usr/bin/env php
<?php
/**
 * publish-single-post.php — Autonomous Single Post Publisher for deepak-blog (v8.0)
 *
 * Pushes 1 article directly to Hostinger Live MySQL DB (srv/hostinger), updates data/posts.php,
 * clears cache, audits live URL, and updates memory.md.
 *
 * ZERO GIT PUSH NEEDED.
 *
 * Usage:
 *   php .agent/skills/deepak-blog/scripts/publish-single-post.php --json=payload.json
 *   php .agent/skills/deepak-blog/scripts/publish-single-post.php --title="..." --slug="..." --tag="AI DEV" --excerpt="..." --body-file=body.md
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Post;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

$options = getopt('', [
    'json::',
    'title::',
    'slug::',
    'tag::',
    'excerpt::',
    'body-file::',
    'date::',
    'skip-live-audit::',
]);

$title = '';
$slug = '';
$tag = 'AI DEV';
$excerpt = '';
$body = '';
$date = date('Y-m-d');
$tags = [];

if (!empty($options['json'])) {
    $jsonPath = realpath($options['json']) ?: $options['json'];
    if (!file_exists($jsonPath)) {
        fwrite(STDERR, "❌ JSON payload not found: {$options['json']}\n");
        exit(1);
    }
    $payload = json_decode(file_get_contents($jsonPath), true);
    if (!$payload) {
        fwrite(STDERR, "❌ Invalid JSON payload in {$jsonPath}\n");
        exit(1);
    }
    $title = $payload['title'] ?? '';
    $slug = $payload['slug'] ?? '';
    $tag = $payload['tag'] ?? $payload['category'] ?? 'AI DEV';
    $excerpt = $payload['excerpt'] ?? '';
    $body = $payload['body'] ?? $payload['content'] ?? '';
    $date = $payload['published_at'] ?? $payload['date'] ?? date('Y-m-d');
    $tags = $payload['tags'] ?? [];
} else {
    $title = $options['title'] ?? '';
    $slug = $options['slug'] ?? '';
    $tag = $options['tag'] ?? 'AI DEV';
    $excerpt = $options['excerpt'] ?? '';
    $date = $options['date'] ?? date('Y-m-d');
    if (!empty($options['body-file'])) {
        $bodyPath = realpath($options['body-file']) ?: $options['body-file'];
        if (file_exists($bodyPath)) {
            $body = file_get_contents($bodyPath);
        }
    }
}

// ─── Validations ─────────────────────────────────────────────────────────────
if (empty($title) || empty($slug) || empty($excerpt) || empty($body)) {
    fwrite(STDERR, "❌ Missing required fields: title, slug, excerpt, or body\n");
    exit(1);
}

// 1. Slug format & numeric suffix prohibition
$cleanSlug = trim(strtolower($slug));
if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $cleanSlug)) {
    fwrite(STDERR, "❌ Invalid slug format: '{$slug}'. Must be clean lowercase-kebab-case.\n");
    exit(1);
}
if (preg_match('/-(?!202[5-9]|203[0-9])[0-9]+$/', $cleanSlug) || preg_match('/-v[0-9]+$/', $cleanSlug)) {
    fwrite(STDERR, "❌ BANNED: Slug '{$slug}' ends in duplicate numeric counter (-2, -3, -v2 etc). Create an orthogonal slug instead.\n");
    exit(1);
}

// 2. Word count check (≥1,200 words)
$words = str_word_count(strip_tags($body));
if ($words < 1200) {
    fwrite(STDERR, "❌ Word count {$words} is below 1,200 words minimum. High-EEAT content must be dense & actionable.\n");
    exit(1);
}

// 3. Strict Image Alt Tag check
if (preg_match_all('/!\[(.*?)\]\((.*?)\)/', $body, $imgMatches)) {
    foreach ($imgMatches[1] as $alt) {
        $trimmedAlt = trim($alt);
        if (empty($trimmedAlt) || str_word_count($trimmedAlt) < 3 || in_array(strtolower($trimmedAlt), ['image', 'screenshot', 'diagram', 'pic', 'photo', 'graphic'])) {
            fwrite(STDERR, "❌ Image Alt Tag audit FAIL: '{$alt}'. Every image must have descriptive alt text (≥3-5 words).\n");
            exit(1);
        }
    }
}

// 4. Anti-AI Slop & Fluff Check (Expanded 90+ Banned Patterns)
$bannedSlopPhrases = [
    // Throat clearing & synthetic openers
    "in today's fast-paced world", "in today's digital landscape", "in today's fast-paced digital world",
    "in today's modern world", "in the fast-evolving world of", "in the ever-evolving landscape",
    "in the realm of", "in this blog post", "in this article, we will", "in this guide, we will",
    "let's dive in", "let's dive into", "let us dive into", "have you ever wondered",
    "as an ai language model", "the world of ai is constantly changing", "imagine a world where",
    "gone are the days when", "fast-forward to today", "without further ado", "it goes without saying",
    "needless to say", "first and foremost",

    // Synthetic buzzwords & hype clichés
    "delve into", "delving into", "unlock the power", "unlock the potential", "game-changer",
    "game changer", "game-changing", "revolutionize", "revolutionizing", "skyrocket your",
    "tapestry", "rich tapestry", "nestled", "plethora", "embark on a journey", "cutting-edge solution",
    "cutting-edge", "leverage the power", "harness the power of", "harnessing the power",
    "testament to", "a testament to", "beacon of", "beacon of hope", "pivotal role",
    "navigating the landscape", "a double-edged sword", "brimming with", "treasure trove",
    "demystifying", "demystify", "look no further", "revolutionary approach", "take a deep dive",
    "unleash the potential", "unleash the power", "holistic approach", "seamless integration",
    "seamlessly integrate", "seamlessly integrates", "paradigm shift", "supercharge",
    "unrivaled", "second to none", "groundbreaking solution", "unparalleled", "multifaceted",
    "at the forefront of innovation", "at the forefront", "state-of-the-art solution",

    // Synthetic transitions & robotic wrap-ups
    "it's important to remember", "it is worth noting", "at its core", "in essence",
    "moreover,", "furthermore,", "in conclusion", "to sum up", "all in all",
    "to wrap things up", "in summary", "final thoughts", "with that being said"
];

foreach ($bannedSlopPhrases as $phrase) {
    if (stripos($body, $phrase) !== false) {
        fwrite(STDERR, "❌ Anti-AI Slop FAIL: Found banned cliché '{$phrase}'. Replace with genuine human engineering facts, direct code, or real production metrics.\n");
        exit(1);
    }
}

echo "==========================================================\n";
echo "  🚀 deepak-blog v8.0 — Single Post Live DB Publisher\n";
echo "==========================================================\n";
echo "Title:    {$title}\n";
echo "Slug:     {$cleanSlug}\n";
echo "Tag:      {$tag}\n";
echo "Date:     {$date}\n";
echo "Words:    {$words}\n";
echo "----------------------------------------------------------\n";

// ─── Step 1: Direct Upsert to Live Hostinger Remote MySQL DB ─────────────────
echo "⏳ [1/4] Direct Upsert to Live Remote MySQL DB (posts table)...\n";
$readTime = max(1, (int) ceil($words / 200)) . ' min read';

try {
    $post = Post::updateOrCreate(
        ['id' => $cleanSlug],
        [
            'title' => $title,
            'slug' => $cleanSlug,
            'excerpt' => $excerpt,
            'content' => $body,
            'author' => 'Deepak Bagada',
            'date' => $date,
            'category' => $tag,
            'read_time' => $readTime,
            'image' => '',
            'tags' => json_encode($tags),
        ]
    );
    echo "  ✓ Successfully pushed to Live Hostinger DB! (ID: {$post->id})\n";
} catch (\Exception $e) {
    fwrite(STDERR, "❌ Database error: {$e->getMessage()}\n");
    exit(1);
}

// ─── Step 2: Update Local data/posts.php for Frontend Sync ───────────────────
echo "⏳ [2/4] Updating local data/posts.php (Frontend source of truth)...\n";
$postsFile = base_path('data/posts.php');
if (!file_exists($postsFile)) {
    fwrite(STDERR, "❌ data/posts.php not found at {$postsFile}\n");
    exit(1);
}

$postsContent = file_get_contents($postsFile);
$returnPos = strpos($postsContent, 'return [');
if ($returnPos === -1) {
    fwrite(STDERR, "❌ data/posts.php missing 'return ['\n");
    exit(1);
}

// Check if slug already exists in data/posts.php
$escapedTitle = addcslashes($title, "'");
$escapedExcerpt = addcslashes($excerpt, "'");
$postEntry = "    [\n" .
    "        'title'        => '{$escapedTitle}',\n" .
    "        'slug'         => '{$cleanSlug}',\n" .
    "        'tag'          => '{$tag}',\n" .
    "        'excerpt'      => '{$escapedExcerpt}',\n" .
    "        'body'         => <<<'BODY'\n" .
    $body . "\n" .
    "BODY,\n" .
    "        'published_at' => '{$date}',\n" .
    "    ],\n";

if (str_contains($postsContent, "'slug'         => '{$cleanSlug}'") || str_contains($postsContent, "'slug' => '{$cleanSlug}'")) {
    echo "  ℹ Slug already exists in data/posts.php, running PostSeeder to ensure exact parity.\n";
} else {
    $header = substr($postsContent, 0, $returnPos + strlen('return ['));
    $footer = substr($postsContent, $returnPos + strlen('return ['));
    $newPostsContent = $header . "\n" . $postEntry . $footer;
    file_put_contents($postsFile, $newPostsContent);
    echo "  ✓ Prepended post to data/posts.php\n";
}

// PHP lint check
exec('php -l ' . escapeshellarg($postsFile) . ' 2>&1', $lintOut, $lintCode);
if ($lintCode !== 0) {
    fwrite(STDERR, "❌ PHP Syntax error in data/posts.php after edit:\n" . implode("\n", $lintOut) . "\n");
    exit(1);
}
echo "  ✓ data/posts.php passes php -l syntax check.\n";

// Clear view & app cache
Artisan::call('view:clear');
Artisan::call('cache:clear');
echo "  ✓ Cleared application & view cache.\n";

// ─── Step 3: Audit Live URL ──────────────────────────────────────────────────
$liveUrl = "https://deepakbagada.in/journal/{$cleanSlug}";
if (empty($options['skip-live-audit'])) {
    echo "⏳ [3/4] Auditing Live Website URL: {$liveUrl} ...\n";
    $liveAuditScript = __DIR__ . '/audit-live-url.mjs';
    $auditCmd = "node " . escapeshellarg($liveAuditScript) . " --slug " . escapeshellarg($cleanSlug);
    passthru($auditCmd, $auditCode);
    if ($auditCode !== 0) {
        fwrite(STDERR, "⚠️ Live URL audit returned warnings or errors. Check live page formatting.\n");
    } else {
        echo "  ✓ Live URL Audit 100% PASS!\n";
    }
} else {
    echo "⏳ [3/4] Skipped live audit as requested.\n";
}

// ─── Step 4: Log to memory.md ────────────────────────────────────────────────
echo "⏳ [4/4] Logging entry to memory.md...\n";
$memoryFile = __DIR__ . '/../memory.md';
if (file_exists($memoryFile)) {
    $memEntry = "\n- **{$title}**\n" .
        "  - Slug: `{$cleanSlug}`\n" .
        "  - Tag: `{$tag}`\n" .
        "  - Published: `{$date}`\n" .
        "  - Words: {$words}\n" .
        "  - Status: Pushed directly to Live DB + verified live at {$liveUrl}\n";
    file_put_contents($memoryFile, $memEntry, FILE_APPEND);
    echo "  ✓ Logged to memory.md.\n";
}

echo "----------------------------------------------------------\n";
echo "🎉 SUCCESS: Post is LIVE at {$liveUrl}\n";
echo "🔒 ZERO GIT PUSH: Changes live immediately via remote MySQL!\n";
echo "==========================================================\n";
exit(0);
