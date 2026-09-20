#!/usr/bin/env php
<?php
/**
 * check-collision.php — Anti-Duplication Pre-Check for opensource-library
 *
 * Checks Hostinger Live DB (skills & curated_repos tables), data/library, and memory.md
 * to ensure zero collision before drafting.
 *
 * Usage:
 *   php .agent/skills/opensource-library/scripts/check-collision.php "<Repo URL or Skill Slug or Title>"
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Skill;
use App\Models\CuratedRepo;

$query = $argv[1] ?? '';
if (empty($query)) {
    echo "Usage: php check-collision.php <query>\n";
    exit(1);
}

$trimmed = trim($query);

// 1. Check numeric slug suffix (-2, -3, -v2 etc. Banned; years 2025-2030 allowed)
if (preg_match('/-(?!202[5-9]|203[0-9])[0-9]+$/', $trimmed) || preg_match('/-v[0-9]+$/', $trimmed)) {
    echo "COLLISION_ERROR: Slug '{$trimmed}' has a duplicate numeric suffix (-2, -3, -v2 etc), which is strictly banned.\n";
    exit(1);
}

// 2. Query CuratedRepo
$repoMatches = CuratedRepo::where('url', $trimmed)
    ->orWhere('title', 'LIKE', "%{$trimmed}%")
    ->select('id', 'title', 'url', 'stars')
    ->get();

if ($repoMatches->isNotEmpty()) {
    echo "COLLISION_FOUND in CuratedRepo Live DB:\n";
    foreach ($repoMatches as $r) {
        echo "  - [ID: {$r->id}] {$r->title} ({$r->url}, Stars: {$r->stars})\n";
    }
    exit(1);
}

// 3. Query Skill
$skillMatches = Skill::where('slug', $trimmed)
    ->orWhere('title', 'LIKE', "%{$trimmed}%")
    ->select('id', 'title', 'slug')
    ->get();

if ($skillMatches->isNotEmpty()) {
    echo "COLLISION_FOUND in Skill Live DB:\n";
    foreach ($skillMatches as $s) {
        echo "  - [ID: {$s->id}] {$s->title} (Slug: {$s->slug})\n";
    }
    exit(1);
}

// 4. Check memory.md
$memoryFile = __DIR__ . '/../memory.md';
if (file_exists($memoryFile)) {
    $memory = file_get_contents($memoryFile);
    if (stripos($memory, $trimmed) !== false) {
        echo "COLLISION_FOUND in memory.md for query: '{$trimmed}'\n";
        exit(1);
    }
}

echo "CLEAN: '{$trimmed}' is 100% unique in Live DB and memory.md.\n";
exit(0);
