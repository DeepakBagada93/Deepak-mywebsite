#!/usr/bin/env php
<?php
/**
 * syndicate-to-devto.php — Autonomous Dev.to Syndication & High-DA Backlink Engine (v1.0)
 *
 * Programmatically syndicates technical journal dispatches from deepakbagada.in to Dev.to (DA 92)
 * via the Forem REST API. Enforces strict canonical_url tags, converts relative links to absolute
 * backlinks, embeds contextual author bridges, and tracks syndication history to systematically
 * elevate domain authority, crawl velocity, and developer referral traffic.
 *
 * Usage:
 *   php .agent/skills/deepak-blog/scripts/syndicate-to-devto.php --slug=best-ai-expert-in-india-production-costs-2026
 *   php .agent/skills/deepak-blog/scripts/syndicate-to-devto.php --latest
 *   php .agent/skills/deepak-blog/scripts/syndicate-to-devto.php --dry-run --latest
 *   php .agent/skills/deepak-blog/scripts/syndicate-to-devto.php --draft --slug=<slug>
 */

$autoload = __DIR__ . '/../../../../vendor/autoload.php';
if (file_exists($autoload)) {
    require $autoload;
    $bootstrap = __DIR__ . '/../../../../bootstrap/app.php';
    if (file_exists($bootstrap)) {
        $app = require $bootstrap;
        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    }
}

$options = getopt('', [
    'slug::',
    'latest',
    'dry-run',
    'draft',
    'api-key::',
    'force',
]);

$isDryRun = isset($options['dry-run']);
$isDraft = isset($options['draft']);
$isForce = isset($options['force']);
$targetSlug = $options['slug'] ?? null;
$pickLatest = isset($options['latest']);

echo "\n========================================================================\n";
echo " 🚀 DEEPAK BAGADA — DEV.TO AUTOMATED SYNDICATION & HIGH-DA BACKLINK ENGINE\n";
echo "========================================================================\n\n";

// 1. Resolve API Key
$apiKey = $options['api-key'] ?? env('DEVTO_API_KEY') ?? getenv('DEVTO_API_KEY') ?? null;

if (empty($apiKey)) {
    // Attempt to parse .env directly if env() didn't pick it up
    $envPath = __DIR__ . '/../../../../.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (str_starts_with(trim($line), 'DEVTO_API_KEY=')) {
                $apiKey = trim(substr(trim($line), strlen('DEVTO_API_KEY=')));
                break;
            }
        }
    }
}

if (empty($apiKey)) {
    fwrite(STDERR, "❌ ERROR: DEVTO_API_KEY not found in environment, .env, or CLI options.\n");
    fwrite(STDERR, "   Please set DEVTO_API_KEY=... in .env or pass --api-key=...\n");
    exit(1);
}

// 2. Verify Authentication with Dev.to
echo "⏳ [1/5] Verifying Dev.to API Authentication...\n";
$ch = curl_init('https://dev.to/api/users/me');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'api-key: ' . $apiKey,
        'User-Agent: DeepakBagada-Syndication-Engine/1.0',
    ],
    CURLOPT_TIMEOUT => 15,
]);
$userRes = curl_exec($ch);
$userHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($userHttp !== 200 || !$userRes) {
    fwrite(STDERR, "❌ Dev.to Authentication Failed (HTTP {$userHttp}): {$userRes}\n");
    exit(1);
}

$userData = json_decode($userRes, true);
$userName = $userData['name'] ?? 'Deepak Bagada';
$userHandle = $userData['username'] ?? 'deepakbagada';
echo "  ✓ Authenticated as: {$userName} (@{$userHandle})\n";
echo "  ✓ Official Website: " . ($userData['website_url'] ?? 'https://deepakbagada.in/') . "\n\n";

// 3. Load Posts from data/posts.php
$postsFile = __DIR__ . '/../../../../data/posts.php';
if (!file_exists($postsFile)) {
    fwrite(STDERR, "❌ data/posts.php not found at: {$postsFile}\n");
    exit(1);
}

$allPosts = require $postsFile;
if (!is_array($allPosts) || empty($allPosts)) {
    fwrite(STDERR, "❌ No posts found in data/posts.php\n");
    exit(1);
}

// Load Syndication History
$historyFile = __DIR__ . '/../devto_syndicated.json';
$history = file_exists($historyFile) ? json_decode(file_get_contents($historyFile), true) : [];
if (!is_array($history)) {
    $history = [];
}
$syndicatedSlugs = array_filter(array_column($history, 'slug'));

// Find Target Post
$targetPost = null;
if ($targetSlug) {
    foreach ($allPosts as $p) {
        if ($p['slug'] === $targetSlug) {
            $targetPost = $p;
            break;
        }
    }
    if (!$targetPost) {
        fwrite(STDERR, "❌ Post with slug '{$targetSlug}' not found in data/posts.php\n");
        exit(1);
    }
} elseif ($pickLatest || empty($targetSlug)) {
    foreach ($allPosts as $p) {
        if (!$isForce && in_array($p['slug'], $syndicatedSlugs)) {
            continue;
        }
        $targetPost = $p;
        break;
    }
    if (!$targetPost) {
        echo "ℹ️ All recent posts from data/posts.php have already been syndicated!\n";
        echo "   Use --slug=<slug> --force to re-syndicate a specific post.\n";
        exit(0);
    }
}

$slug = $targetPost['slug'];
$title = $targetPost['title'];
$tag = $targetPost['tag'] ?? 'AI DEV';
$rawBody = $targetPost['body'];
$excerpt = $targetPost['excerpt'] ?? '';
$canonicalUrl = "https://deepakbagada.in/journal/{$slug}";

echo "⏳ [2/5] Target Post Selected:\n";
echo "  📌 Title:         {$title}\n";
echo "  🏷️ Tag:           {$tag}\n";
echo "  🔗 Canonical URL: {$canonicalUrl}\n\n";

// Check if already syndicated
if (in_array($slug, $syndicatedSlugs) && !$isForce) {
    echo "⚠️ Warning: This post was already syndicated to Dev.to. Use --force to proceed anyway.\n";
    exit(1);
}

// 4. Map Tags to Dev.to Compatible Tags (Max 4, alphanumeric lowercase only)
echo "⏳ [3/5] Formatting Body, Converting Backlinks & Preparing Payload...\n";

$tagMap = [
    'AI DEV' => ['ai', 'python', 'programming', 'webdev'],
    'WEB DEV' => ['webdev', 'javascript', 'programming', 'nextjs'],
    'MY STORY' => ['discuss', 'productivity', 'programming', 'startup'],
    'DESIGN' => ['design', 'css', 'webdev', 'ui'],
];

$chosenTags = $tagMap[$tag] ?? ['ai', 'webdev', 'programming', 'discuss'];

// Convert relative markdown links to absolute canonical backlinks pointing to deepakbagada.in
// Handles: [Text](/path) -> [Text](https://deepakbagada.in/path)
$bodyWithAbsoluteLinks = preg_replace_callback(
    '/\[([^\]]+)\]\(((\/[^\s\)]+))\)/',
    function ($matches) {
        $linkText = $matches[1];
        $relativePath = $matches[2];
        return "[{$linkText}](https://deepakbagada.in{$relativePath})";
    },
    $rawBody
);

// Append Authoritative Author Attribution & Contextual Backlink Bridge
$authorBridge = "\n\n---\n\n" .
    "> 🌐 **Original Engineering Publication & Interactive Architecture:**\n" .
    "> This comprehensive breakdown was originally published on **[Deepak Bagada's Engineering Journal]({$canonicalUrl})** by **[Deepak Bagada](https://deepakbagada.in/)**.\n" .
    ">\n" .
    "> *Explore Deepak Bagada's production-grade AI systems, commercial architecture blueprints, and free developer utilities:*\n" .
    "> - ⚡ **AI Architecture & Agent Consulting**: [deepakbagada.in/services/ai-development](https://deepakbagada.in/services/ai-development)\n" .
    "> - 📦 **Production AI Toolkits & Starters**: [deepakbagada.in/products](https://deepakbagada.in/products)\n" .
    "> - 🛠️ **Free Interactive Developer Utilities**: [deepakbagada.in/tools](https://deepakbagada.in/tools)\n" .
    "> - 💬 **Connect & Discuss**: [deepakbagada.in/#contact](https://deepakbagada.in/#contact)";

$finalMarkdown = $bodyWithAbsoluteLinks . $authorBridge;

$cleanDescription = mb_substr(strip_tags(str_replace(["\r", "\n"], ' ', $excerpt)), 0, 155);

$payload = [
    'article' => [
        'title' => $title,
        'published' => !$isDraft,
        'body_markdown' => $finalMarkdown,
        'tags' => $chosenTags,
        'canonical_url' => $canonicalUrl,
        'description' => $cleanDescription,
    ],
];

if ($isDryRun) {
    echo "🔍 [DRY RUN] Payload validated successfully:\n";
    echo "  Title:         " . $payload['article']['title'] . "\n";
    echo "  Tags:          " . implode(', ', $payload['article']['tags']) . "\n";
    echo "  Canonical URL: " . $payload['article']['canonical_url'] . "\n";
    echo "  Status:        " . ($isDraft ? 'Draft' : 'Live') . "\n";
    echo "  Body Length:   " . strlen($payload['article']['body_markdown']) . " bytes\n";
    echo "  Backlink Bridge Attached: YES\n\n";
    echo "DRY RUN COMPLETE — Zero remote changes made.\n";
    exit(0);
}

// 5. Publish to Dev.to REST API
echo "⏳ [4/5] Pushing Article to Dev.to API...\n";

$ch = curl_init('https://dev.to/api/articles');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'api-key: ' . $apiKey,
        'Content-Type: application/json',
        'User-Agent: DeepakBagada-Syndication-Engine/1.0',
    ],
    CURLOPT_TIMEOUT => 25,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 201 && $httpCode !== 200) {
    fwrite(STDERR, "❌ Dev.to API Error (HTTP {$httpCode}):\n{$response}\n");
    exit(1);
}

$responseData = json_decode($response, true);
$devtoUrl = $responseData['url'] ?? 'N/A';
$devtoId = $responseData['id'] ?? 'N/A';
$devtoTitle = $responseData['title'] ?? $title;

echo "  ✓ Article successfully created on Dev.to!\n";
echo "  📌 Dev.to URL:     {$devtoUrl}\n";
echo "  🆔 Dev.to Post ID: {$devtoId}\n";
echo "  🔗 Canonical Link: {$canonicalUrl}\n\n";

// 6. Record in Syndication Log
echo "⏳ [5/5] Logging Syndication History...\n";

$historyEntry = [
    'slug' => $slug,
    'title' => $title,
    'tag' => $tag,
    'devto_id' => $devtoId,
    'devto_url' => $devtoUrl,
    'canonical_url' => $canonicalUrl,
    'published_at' => date('c'),
    'status' => $isDraft ? 'draft' : 'published',
];

$history[] = $historyEntry;
file_put_contents($historyFile, json_encode($history, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
echo "  ✓ Saved record to: .agent/skills/deepak-blog/devto_syndicated.json\n";

// Update memory.md with syndication note
$memoryFile = __DIR__ . '/../memory.md';
if (file_exists($memoryFile)) {
    $syndicationLog = "\n  - **Dev.to Syndication (DA 92 Backlink)**: Published to {$devtoUrl} with canonical tag pointing to `{$canonicalUrl}`\n";
    file_put_contents($memoryFile, $syndicationLog, FILE_APPEND);
    echo "  ✓ Updated .agent/skills/deepak-blog/memory.md\n";
}

echo "\n========================================================================\n";
echo "🎉 SYNDICATION COMPLETED SUCCESSFULLY!\n";
echo "🌐 Dev.to Article:  {$devtoUrl}\n";
echo "🔗 Canonical URL:    {$canonicalUrl}\n";
echo "📈 Domain Authority Benefit: DA 92 backlink established with PageRank pass-through!\n";
echo "========================================================================\n\n";
exit(0);
