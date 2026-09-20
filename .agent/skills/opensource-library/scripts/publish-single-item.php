#!/usr/bin/env php
<?php
/**
 * publish-single-item.php — Autonomous Single Library Item Publisher for opensource-library (v4.0)
 *
 * Pushes 1 item (skill, repo, or blueprint) directly to Hostinger Remote MySQL DB,
 * updates data/library files, clears cache, audits live URL, and updates memory.md.
 *
 * ZERO GIT PUSH NEEDED.
 *
 * Usage:
 *   php .agent/skills/opensource-library/scripts/publish-single-item.php --json=item.json
 *   php .agent/skills/opensource-library/scripts/publish-single-item.php --type=repo --title="owner/repo" --url="..." ...
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\SkillArchitecture;
use App\Models\CuratedRepo;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

$options = getopt('', [
    'json::',
    'type::', // skill | repo | blueprint
    'title::',
    'slug::',
    'summary::',
    'content-file::',
    'category::',
    'difficulty::',
    'github-url::',
    'stars::',
    'why-great::',
    'when-not::',
    'skip-live-audit::',
]);

$payload = [];
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
} else {
    $payload = [
        'type' => $options['type'] ?? 'skill',
        'title' => $options['title'] ?? '',
        'slug' => $options['slug'] ?? '',
        'summary' => $options['summary'] ?? '',
        'content' => '',
        'category' => $options['category'] ?? 'mcp',
        'difficulty' => $options['difficulty'] ?? 'intermediate',
        'github_url' => $options['github-url'] ?? '',
        'stars' => (int) ($options['stars'] ?? 0),
        'why_great' => $options['why-great'] ?? '',
        'when_not' => $options['when-not'] ?? '',
    ];
    if (!empty($options['content-file'])) {
        $cPath = realpath($options['content-file']) ?: $options['content-file'];
        if (file_exists($cPath)) {
            $payload['content'] = file_get_contents($cPath);
        }
    }
}

$type = $payload['type'] ?? 'skill';
$title = $payload['title'] ?? '';
$slug = $payload['slug'] ?? '';
$memoryFile = __DIR__ . '/../memory.md';

echo "==========================================================\n";
echo "  🏛️ opensource-library v4.0 — Live DB Item Publisher\n";
echo "==========================================================\n";
echo "Type:     {$type}\n";
echo "Title:    {$title}\n";
echo "Slug/URL: " . ($slug ?: ($payload['url'] ?? 'N/A')) . "\n";
echo "----------------------------------------------------------\n";

if ($type === 'skill') {
    $cleanSlug = trim(strtolower($slug));
    if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $cleanSlug)) {
        fwrite(STDERR, "❌ Invalid slug format: '{$slug}'. Must be clean lowercase-kebab-case.\n");
        exit(1);
    }
    if (preg_match('/-(?!202[5-9]|203[0-9])[0-9]+$/', $cleanSlug) || preg_match('/-v[0-9]+$/', $cleanSlug)) {
        fwrite(STDERR, "❌ BANNED: Slug '{$slug}' ends in duplicate numeric suffix (-2, -3, -v2 etc).\n");
        exit(1);
    }

    $summary = $payload['summary'] ?? '';
    $content = $payload['content'] ?? '';
    $categorySlug = $payload['category'] ?? 'mcp';
    $difficulty = $payload['difficulty'] ?? 'intermediate';
    $githubUrl = $payload['github_url'] ?? 'https://github.com/DeepakBagada93';
    $version = $payload['version'] ?? '1.0.0';
    $stars = (int) ($payload['stars'] ?? 0);

    // Validate Word Count (≥1,200 words)
    $words = str_word_count(strip_tags($content));
    if ($words < 1200) {
        fwrite(STDERR, "❌ Word count {$words} is below 1,200 words minimum.\n");
        exit(1);
    }

    // Validate Image Alt Tags
    if (preg_match_all('/!\[(.*?)\]\((.*?)\)/', $content, $imgMatches)) {
        foreach ($imgMatches[1] as $alt) {
            $trimmedAlt = trim($alt);
            if (empty($trimmedAlt) || str_word_count($trimmedAlt) < 3 || in_array(strtolower($trimmedAlt), ['image', 'screenshot', 'diagram', 'pic', 'photo', 'graphic'])) {
                fwrite(STDERR, "❌ Image Alt Tag FAIL: '{$alt}'. Must have descriptive alt text (≥3-5 words).\n");
                exit(1);
            }
        }
    }

    // Validate Anti-AI Slop & Fluff
    $bannedSlopPhrases = [
        "in today's fast-paced world", "in today's digital landscape", "in today's fast-paced digital world",
        "in today's modern world", "in the fast-evolving world of", "in the ever-evolving landscape",
        "in the realm of", "in this blog post", "in this article, we will", "let's dive in", "let's dive into",
        "have you ever wondered", "as an ai language model", "imagine a world where", "gone are the days when",
        "fast-forward to today", "without further ado", "it goes without saying", "needless to say",
        "first and foremost", "delve into", "delving into", "unlock the power", "unlock the potential",
        "game-changer", "game changer", "game-changing", "revolutionize", "revolutionizing", "skyrocket your",
        "tapestry", "rich tapestry", "nestled", "plethora", "embark on a journey", "cutting-edge solution",
        "cutting-edge", "leverage the power", "harness the power of", "harnessing the power", "testament to",
        "beacon of", "pivotal role", "navigating the landscape", "a double-edged sword", "brimming with",
        "treasure trove", "demystifying", "demystify", "look no further", "take a deep dive", "unleash the potential",
        "unleash the power", "holistic approach", "seamless integration", "seamlessly integrate", "seamlessly integrates",
        "paradigm shift", "supercharge", "unrivaled", "second to none", "groundbreaking solution", "unparalleled",
        "multifaceted", "at the forefront of innovation", "at the forefront", "state-of-the-art solution",
        "it's important to remember", "it is worth noting", "at its core", "in essence", "moreover,", "furthermore,",
        "in conclusion", "to sum up", "all in all", "to wrap things up", "in summary", "final thoughts", "with that being said"
    ];

    foreach ($bannedSlopPhrases as $phrase) {
        if (stripos($content, $phrase) !== false) {
            fwrite(STDERR, "❌ Anti-AI Slop FAIL: Found banned cliché '{$phrase}'. Replace with genuine human engineering facts, direct code, or real production metrics.\n");
            exit(1);
        }
    }

    // Category mapping
    $category = SkillCategory::where('slug', $categorySlug)->first();
    if (!$category) {
        $category = SkillCategory::firstOrCreate(
            ['slug' => $categorySlug],
            ['name' => ucwords(str_replace('-', ' ', $categorySlug)), 'sort_order' => 99]
        );
    }

    echo "⏳ [1/4] Upserting to Remote MySQL DB (skills table)...\n";
    $skill = Skill::updateOrCreate(
        ['slug' => $cleanSlug],
        [
            'title' => $title,
            'slug' => $cleanSlug,
            'summary' => $summary,
            'content' => $content,
            'category_id' => $category->id,
            'difficulty' => $difficulty,
            'github_url' => $githubUrl,
            'version' => $version,
            'stars' => $stars,
            'status' => 'published',
            'sort_order' => (int) Skill::max('sort_order') + 1,
            'published_at' => now(),
        ]
    );
    echo "  ✓ Skill stored in Live DB (ID: {$skill->id})\n";

    echo "⏳ [2/4] Writing local file data/library/skills/{$cleanSlug}.php...\n";
    $skillsDir = base_path('data/library/skills');
    if (!is_dir($skillsDir)) {
        mkdir($skillsDir, 0755, true);
    }
    $skillFilePath = "{$skillsDir}/{$cleanSlug}.php";
    $phpExport = "<?php\n\nreturn " . var_export([
        'title' => $title,
        'slug' => $cleanSlug,
        'summary' => $summary,
        'content' => $content,
        'category' => $categorySlug,
        'difficulty' => $difficulty,
        'github_url' => $githubUrl,
        'version' => $version,
        'stars' => $stars,
        'published_at' => date('Y-m-d'),
    ], true) . ";\n";
    file_put_contents($skillFilePath, $phpExport);
    echo "  ✓ Saved local skill file.\n";

    Artisan::call('view:clear');
    Artisan::call('cache:clear');

    $liveUrl = "https://deepakbagada.in/library/{$cleanSlug}";
    if (empty($options['skip-live-audit'])) {
        echo "⏳ [3/4] Auditing Live URL: {$liveUrl}...\n";
        $auditScript = __DIR__ . '/audit-live-library.mjs';
        $auditCmd = "node " . escapeshellarg($auditScript) . " --slug " . escapeshellarg($cleanSlug);
        passthru($auditCmd, $auditCode);
    }

    echo "⏳ [4/4] Logging to memory.md...\n";
    if (file_exists($memoryFile)) {
        $entry = "\n- **{$title}**\n  - Slug: `{$cleanSlug}`\n  - Type: `skill`\n  - Published: `" . date('Y-m-d') . "`\n  - Words: {$words}\n  - URL: {$liveUrl}\n";
        file_put_contents($memoryFile, $entry, FILE_APPEND);
        echo "  ✓ Added to memory.md\n";
    }

    echo "🎉 SUCCESS: Skill is LIVE at {$liveUrl}\n";
    echo "🔒 ZERO GIT PUSH: Changes live immediately via remote MySQL!\n";
    exit(0);

} elseif ($type === 'repo') {
    $url = $payload['url'] ?? '';
    if (empty($url)) {
        fwrite(STDERR, "❌ Repo URL is required.\n");
        exit(1);
    }
    $description = $payload['description'] ?? '';
    $category = $payload['category'] ?? 'Agent Frameworks';
    $whyGreat = $payload['why_great'] ?? '';
    $whenNot = $payload['when_not'] ?? '';
    $stars = (int) ($payload['stars'] ?? 0);
    $featured = !empty($payload['featured']);
    $tags = $payload['tags'] ?? [];

    echo "⏳ [1/3] Upserting to Remote MySQL DB (curated_repos table)...\n";
    $maxOrder = (int) CuratedRepo::max('sort_order') + 1;
    $repo = CuratedRepo::updateOrCreate(
        ['url' => $url],
        [
            'title' => $title,
            'url' => $url,
            'description' => $description,
            'category' => $category,
            'tags' => $tags,
            'why_great' => $whyGreat,
            'stars' => $stars,
            'featured' => $featured,
            'sort_order' => $maxOrder,
        ]
    );
    echo "  ✓ Repo stored in Live DB (ID: {$repo->id}, Total Repos: " . CuratedRepo::count() . ")\n";

    Artisan::call('view:clear');
    Artisan::call('cache:clear');

    $liveUrl = "https://deepakbagada.in/repos";
    if (empty($options['skip-live-audit'])) {
        echo "⏳ [2/3] Auditing Live Repos Page: {$liveUrl}...\n";
        $auditScript = __DIR__ . '/audit-live-library.mjs';
        $auditCmd = "node " . escapeshellarg($auditScript) . " --type repos";
        passthru($auditCmd, $auditCode);
    }

    echo "⏳ [3/3] Logging to memory.md...\n";
    if (file_exists($memoryFile)) {
        $entry = "\n- `{$title}` — {$category} — {$stars} stars — (" . date('Y-m-d') . ")\n  - URL: {$url}\n  - Why Great: {$whyGreat}\n";
        file_put_contents($memoryFile, $entry, FILE_APPEND);
        echo "  ✓ Added to memory.md\n";
    }

    echo "🎉 SUCCESS: Repo is LIVE in directory at {$liveUrl}\n";
    echo "🔒 ZERO GIT PUSH: Changes live immediately via remote MySQL!\n";
    exit(0);

} elseif ($type === 'blueprint') {
    $description = $payload['description'] ?? '';
    $diagramSvg = $payload['diagram_svg'] ?? '';
    $skillId = $payload['skill_id'] ?? null;
    $sortOrder = (int) SkillArchitecture::max('sort_order') + 1;

    echo "⏳ [1/3] Upserting to Remote MySQL DB (skill_architectures table)...\n";
    $arch = SkillArchitecture::updateOrCreate(
        ['title' => $title],
        [
            'skill_id' => $skillId,
            'description' => $description,
            'diagram_svg' => $diagramSvg,
            'sort_order' => $sortOrder,
        ]
    );
    echo "  ✓ Blueprint stored in Live DB (ID: {$arch->id})\n";

    Artisan::call('view:clear');
    Artisan::call('cache:clear');

    $liveUrl = "https://deepakbagada.in/blueprints/{$arch->id}";
    echo "⏳ [2/3] Live URL: {$liveUrl}\n";

    echo "⏳ [3/3] Logging to memory.md...\n";
    if (file_exists($memoryFile)) {
        $entry = "\n- **Blueprint: {$title}** (ID: {$arch->id})\n  - Published: " . date('Y-m-d') . "\n  - URL: {$liveUrl}\n";
        file_put_contents($memoryFile, $entry, FILE_APPEND);
        echo "  ✓ Added to memory.md\n";
    }

    echo "🎉 SUCCESS: Blueprint is LIVE at {$liveUrl}\n";
    echo "🔒 ZERO GIT PUSH: Changes live immediately via remote MySQL!\n";
    exit(0);
} else {
    fwrite(STDERR, "❌ Unsupported type: {$type}\n");
    exit(1);
}
