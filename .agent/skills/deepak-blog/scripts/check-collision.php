#!/usr/bin/env php
<?php
/**
 * check-collision.php — Anti-Duplication & Database Collision Pre-Check for deepak-blog
 *
 * Checks Hostinger Remote Live DB (posts table), data/posts.php, and memory.md
 * to ensure zero topic/slug collision before drafting.
 *
 * Usage:
 *   php .agent/skills/deepak-blog/scripts/check-collision.php "<Keyword or Slug or Title>"
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Post;

$query = $argv[1] ?? '';
if (empty($query)) {
    echo "Usage: php check-collision.php <keyword|slug|title>\n";
    exit(1);
}

$trimmed = trim($query);

// 1. Check numeric slug suffix (-2, -3, -v2 etc. Banned; years 2025-2030 allowed)
if (preg_match('/-(?!202[5-9]|203[0-9])[0-9]+$/', $trimmed) || preg_match('/-v[0-9]+$/', $trimmed)) {
    echo "COLLISION_ERROR: Slug '{$trimmed}' has a duplicate numeric suffix (-2, -3, -v2 etc), which is strictly banned.\n";
    exit(1);
}

// 2. Query Live MySQL Database
$matches = Post::where('slug', $trimmed)
    ->orWhere('title', 'LIKE', "%{$trimmed}%")
    ->orWhere('slug', 'LIKE', "%{$trimmed}%")
    ->select('id', 'title', 'slug', 'date')
    ->get();

if ($matches->isNotEmpty()) {
    echo "COLLISION_FOUND in Live Database:\n";
    foreach ($matches as $m) {
        echo "  - [ID: {$m->id}] {$m->title} (Slug: {$m->slug}, Date: {$m->date})\n";
    }
    exit(1);
}

// 3. Check memory.md
$memoryFile = __DIR__ . '/../memory.md';
if (file_exists($memoryFile)) {
    $memory = file_get_contents($memoryFile);
    if (stripos($memory, "`{$trimmed}`") !== false || stripos($memory, $trimmed) !== false) {
        echo "COLLISION_FOUND in memory.md for query: '{$trimmed}'\n";
        exit(1);
    }
}

echo "CLEAN: '{$trimmed}' is 100% unique across Live DB, data/posts.php, and memory.md.\n";
exit(0);
