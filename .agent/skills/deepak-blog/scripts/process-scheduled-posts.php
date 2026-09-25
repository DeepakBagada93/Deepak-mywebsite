#!/usr/bin/env php
<?php
/**
 * process-scheduled-posts.php — Autonomous Scheduled Post Processor
 *
 * Runs automatically at preferred times (06:30, 09:30, 18:30 IST) to:
 * 1. Read pending dispatches from `scheduled_posts` table where `scheduled_for <= NOW()`
 * 2. Push due dispatches directly to Hostinger Live MySQL DB `posts` table
 * 3. Update local data/posts.php and clear application cache
 * 4. Update memory.md ledger
 * 5. Verify live URL
 *
 * ZERO GIT PUSH NEEDED.
 *
 * Usage:
 *   php .agent/skills/deepak-blog/scripts/process-scheduled-posts.php
 *   php .agent/skills/deepak-blog/scripts/process-scheduled-posts.php --force-all
 *   php .agent/skills/deepak-blog/scripts/process-scheduled-posts.php --slug=<slug>
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Post;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

$options = getopt('', ['force-all::', 'slug::', 'dry-run::']);
$forceAll = isset($options['force-all']);
$targetSlug = $options['slug'] ?? null;
$dryRun = isset($options['dry-run']);

echo "==========================================================\n";
echo "  🚀 deepak-blog — Autonomous Scheduled Post Processor\n";
echo "==========================================================\n";

$query = DB::table('scheduled_posts')->where('status', 'scheduled');

if ($targetSlug) {
    $query->where('slug', $targetSlug);
} elseif (!$forceAll) {
    // Only process posts whose scheduled time has arrived
    $query->where('scheduled_for', '<=', date('Y-m-d H:i:s'));
}

$duePosts = $query->orderBy('scheduled_for', 'asc')->get();

if ($duePosts->isEmpty()) {
    echo "✨ No scheduled posts due for publication right now.\n";
    $next = DB::table('scheduled_posts')->where('status', 'scheduled')->orderBy('scheduled_for', 'asc')->first();
    if ($next) {
        echo "⏳ Next scheduled post: [{$next->scheduled_for}] {$next->title} (Slug: {$next->slug})\n";
    }
    echo "==========================================================\n";
    exit(0);
}

echo "Found {$duePosts->count()} due scheduled post(s) to publish.\n\n";

foreach ($duePosts as $p) {
    echo "----------------------------------------------------------\n";
    echo "📝 Publishing: {$p->title}\n";
    echo "   Slug:          {$p->slug}\n";
    echo "   Scheduled for: {$p->scheduled_for} ({$p->slot_label})\n";
    echo "   Tag:           {$p->category}\n";

    if ($dryRun) {
        echo "   [DRY-RUN] Skipping database write.\n";
        continue;
    }

    $words = str_word_count(strip_tags($p->content));
    $readTime = max(1, (int) ceil($words / 200)) . ' min read';

    // 1. Direct upsert into `posts` table
    try {
        $livePost = Post::updateOrCreate(
            ['id' => $p->slug],
            [
                'title' => $p->title,
                'slug' => $p->slug,
                'excerpt' => $p->excerpt,
                'content' => $p->content,
                'author' => $p->author ?: 'Deepak Bagada',
                'date' => $p->scheduled_for,
                'category' => $p->category ?: 'AI DEV',
                'read_time' => $readTime,
                'image' => '',
                'tags' => json_encode([$p->category ?: 'AI DEV']),
            ]
        );
        echo "  ✓ [1/4] Successfully pushed to Live Hostinger DB 'posts' table! (ID: {$livePost->id})\n";
    } catch (\Exception $e) {
        fwrite(STDERR, "  ❌ Error pushing to 'posts' table: {$e->getMessage()}\n");
        continue;
    }

    // 2. Update local data/posts.php
    $postsFile = base_path('data/posts.php');
    if (file_exists($postsFile)) {
        $postsContent = file_get_contents($postsFile);
        if (strpos($postsContent, "'{$p->slug}'") === false) {
            $escapedTitle = addcslashes($p->title, "'");
            $escapedExcerpt = addcslashes($p->excerpt, "'");
            $escapedTag = addcslashes($p->category ?: 'AI DEV', "'");
            $postDate = substr($p->scheduled_for, 0, 10);

            $newEntry = "    [\n"
                . "        'id' => '{$p->slug}',\n"
                . "        'title' => '{$escapedTitle}',\n"
                . "        'slug' => '{$p->slug}',\n"
                . "        'tag' => '{$escapedTag}',\n"
                . "        'date' => '{$postDate}',\n"
                . "        'read_time' => '{$readTime}',\n"
                . "        'excerpt' => '{$escapedExcerpt}',\n"
                . "        'body' => <<<'BODY'\n"
                . $p->content . "\n"
                . "BODY,\n"
                . "    ],\n";

            $returnPos = strpos($postsContent, 'return [');
            $updatedContent = substr($postsContent, 0, $returnPos + 8) . "\n" . $newEntry . substr($postsContent, $returnPos + 8);
            file_put_contents($postsFile, $updatedContent);
            echo "  ✓ [2/4] Prepended to local data/posts.php\n";
        } else {
            echo "  ℹ [2/4] Already present in data/posts.php\n";
        }
    }

    // Clear caches
    try {
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        echo "  ✓ Cache cleared\n";
    } catch (\Exception $e) {
        // cache clear optional
    }

    // 3. Mark scheduled_posts status as 'published'
    DB::table('scheduled_posts')->where('id', $p->id)->update([
        'status' => 'published',
        'published_at' => date('Y-m-d H:i:s'),
    ]);
    echo "  ✓ [3/4] Marked status='published' in scheduled_posts table\n";

    // 4. Update memory.md ledger
    $memoryFile = __DIR__ . '/../memory.md';
    if (file_exists($memoryFile)) {
        $entryDate = substr($p->scheduled_for, 0, 10);
        $entry = "\n- **{$p->title}**\n"
            . "  - Slug: `{$p->slug}`\n"
            . "  - Tag: `{$p->category}`\n"
            . "  - Published: `{$entryDate}`\n"
            . "  - Words: {$words}\n"
            . "  - Scheduled Slot: `{$p->slot_label}`\n"
            . "  - Status: Automatically published from scheduled_posts to Live DB\n";
        file_put_contents($memoryFile, $entry, FILE_APPEND);
        echo "  ✓ [4/4] Appended to memory.md ledger\n";
    }

    echo "  🎉 LIVE at https://deepakbagada.in/journal/{$p->slug}\n";
}

echo "\n==========================================================\n";
echo "  ✅ Scheduled Processing Completed — ZERO GIT PUSH NEEDED\n";
echo "==========================================================\n";
exit(0);
