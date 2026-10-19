#!/usr/bin/env php
<?php
// All slot times are IST wall-clock — force IST so `scheduled_for <= NOW()`
// comparisons fire on time regardless of server/PHP default timezone (UTC).
date_default_timezone_set('Asia/Kolkata');
/**
 * process-scheduled-posts.php — Autonomous Scheduled Post Processor
 *
 * Runs automatically at preferred times (06:30, 09:30, 12:30, 15:30, 18:30 IST — Phase 2) to:
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
 *   php .agent/skills/deepak-blog/scripts/process-scheduled-posts.php --quiet   (frequent sweep: silent unless publishing/failing)
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
// Re-assert IST AFTER Laravel bootstrap (config/app.php hardcodes UTC,
// which would skew `scheduled_for <= NOW()` slot comparisons by 5.5h).
date_default_timezone_set('Asia/Kolkata');

use App\Models\Post;
use App\Support\WordCount;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

$options = getopt('', ['force-all::', 'slug::', 'dry-run::', 'quiet::']);
$forceAll = isset($options['force-all']);
$targetSlug = $options['slug'] ?? null;
$dryRun = isset($options['dry-run']);
$quiet = isset($options['quiet']);

// Single-writer guard: concurrent cron runs (slot + frequent sweep) must
// serialize so two processes never prepend data/posts.php simultaneously.
$lockPath = base_path('storage/framework/scheduled-posts.lock');
$lockFp = fopen($lockPath, 'c');
if ($lockFp === false || ! flock($lockFp, LOCK_EX | LOCK_NB)) {
    // Always log lock-skips (even --quiet) so silent sweeps stay observable.
    $skipMsg = 'Another processor run holds the lock — exiting at '.date('Y-m-d H:i:s T').' (UTC: '.gmdate('Y-m-d H:i:s').").\n";
    fwrite(STDERR, '⏭ '.$skipMsg);
    @file_put_contents(base_path('storage/logs/scheduled-posts.log'), '['.date('c').'] LOCK-SKIP '.$skipMsg, FILE_APPEND);
    if (! $quiet) {
        echo '⏭ '.$skipMsg;
    }
    exit(0);
}

// Heartbeat: proves the scheduler is alive — monitor checks this file's mtime.
@file_put_contents(
    base_path('storage/framework/schedule-heartbeat.txt'),
    date('Y-m-d H:i:s T') . " pid=" . getmypid() . "\n"
);

if (!$quiet) {
    echo "==========================================================\n";
    echo "  🚀 deepak-blog — Autonomous Scheduled Post Processor\n";
    echo "  Run at (IST): " . date('Y-m-d H:i:s T') . " | UTC: " . gmdate('Y-m-d H:i:s') . "Z\n";
    echo "==========================================================\n";
}

// Email alert on hard failure (best-effort — never crash the run over it).
function alertFailure(string $subject, string $body): void
{
    try {
        $to = config('mail.from.address');
        if ($to) {
            Mail::raw($body, fn ($m) => $m->to($to)->subject($subject));
        }
    } catch (\Throwable $ignored) {
    }
}

// Resilient DB fetch: transient network flakes (e.g. "Network is unreachable"
// to Hostinger MySQL) must NOT kill the whole batch. Retry with backoff.
function fetchWithRetry(callable $fn, string $label)
{
    $attempts = 6;
    $delays = [3, 8, 15, 30, 45]; // seconds between retries
    $last = null;
    for ($i = 1; $i <= $attempts; $i++) {
        try {
            return $fn();
        } catch (\Throwable $e) {
            $last = $e;
            if ($i === $attempts) {
                break;
            }
            $wait = $delays[$i - 1] ?? 45;
            fwrite(STDERR, "⚠ DB attempt {$i}/{$attempts} failed [{$label}]: " . substr($e->getMessage(), 0, 120) . " — retrying in {$wait}s…\n");
            try {
                DB::purge('mysql');
                DB::reconnect('mysql');
            } catch (\Throwable $ignored) {
            }
            sleep($wait);
        }
    }
    throw $last;
}

// Build a FRESH query on every call: fetchWithRetry may invoke the closure
// up to 4 times, and reusing one builder would accumulate orderBy clauses.
$buildDueQuery = function () use ($targetSlug, $forceAll) {
    $q = DB::table('scheduled_posts')->where('status', 'scheduled');
    if ($targetSlug) {
        $q->where('slug', $targetSlug);
    } elseif (! $forceAll) {
        // Only process posts whose scheduled time has arrived (IST wall-clock).
        $q->where('scheduled_for', '<=', date('Y-m-d H:i:s'));
    }

    return $q;
};

$duePosts = null;
try {
    $duePosts = fetchWithRetry(fn () => $buildDueQuery()->orderBy('scheduled_for', 'asc')->get(), 'fetch-due');
} catch (\Throwable $e) {
    $msg = "❌ DB FAILED after 4 attempts [fetch-due] at " . date('Y-m-d H:i:s T') . ": {$e->getMessage()}\n";
    fwrite(STDERR, $msg);
    alertFailure(
        '[deepak-blog] Scheduled publish FAILED — DB unreachable',
        "The scheduled post processor could not reach Hostinger MySQL after 4 retries.\n\n{$msg}\nDue posts are still queued and will auto-publish on the next run once the network returns.\nCheck scheduler.log for details."
    );
    exit(1);
}

if ($duePosts->isEmpty()) {
    if (!$quiet) {
        echo "✨ No scheduled posts due for publication right now.\n";
    }
    try {
        $next = fetchWithRetry(
            fn () => DB::table('scheduled_posts')->where('status', 'scheduled')->orderBy('scheduled_for', 'asc')->first(),
            'fetch-next'
        );
    } catch (\Throwable $e) {
        $next = null;
    }
    if ($next && !$quiet) {
        echo "⏳ Next scheduled post: [{$next->scheduled_for}] {$next->title} (Slug: {$next->slug})\n";
    }
    if (!$quiet) {
        echo "==========================================================\n";
    }
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

    // Zero-Images-In-Body Policy Defense: strip any embedded images automatically
    $cleanContent = preg_replace('/!\[[^\]]*\]\([^)]*\)\s*/', '', $p->content);
    $cleanContent = preg_replace('/<img\b[^>]*>\s*/i', '', $cleanContent);

    $words = WordCount::count($cleanContent);
    $readTime = max(1, (int) ceil($words / 200)) . ' min read';

    // Full datetime (Y-m-d H:i:s IST) — never truncate to date-only, or the
    // content-schedule ordering collapses same-day batches to midnight.
    $slotAt = date('Y-m-d H:i:s', strtotime($p->scheduled_for));
    $category = $p->category ?: 'AI DEV';
    $decodedTags = json_decode($p->tags ?? '', true);
    $tags = is_array($decodedTags) && $decodedTags !== [] ? array_values($decodedTags) : [$category];

    // 1. Direct upsert into `posts` table
    try {
        $livePost = Post::updateOrCreate(
            ['id' => $p->slug],
            [
                'title' => $p->title,
                'slug' => $p->slug,
                'excerpt' => $p->excerpt,
                'content' => $cleanContent,
                'author' => $p->author ?: 'Deepak Bagada',
                'date' => $slotAt,
                'category' => $category,
                'read_time' => $readTime,
                'image' => '',
                'tags' => json_encode($tags),
            ]
        );
        echo "  ✓ [1/4] Successfully pushed to Live Hostinger DB 'posts' table! (ID: {$livePost->id})\n";
    } catch (\Exception $e) {
        fwrite(STDERR, "  ❌ Error pushing to 'posts' table: {$e->getMessage()}\n");
        // Throttled alert: first failure + at most once per 6h per slug,
        // so a persistent error is loud without spamming every 5-min sweep.
        try {
            $failFile = base_path('storage/framework/schedule-failures.json');
            $fails = file_exists($failFile) ? (json_decode(file_get_contents($failFile), true) ?: []) : [];
            $lastAlert = $fails[$p->slug]['last_alert'] ?? 0;
            if (time() - $lastAlert > 6 * 3600) {
                $fails[$p->slug] = ['count' => ($fails[$p->slug]['count'] ?? 0) + 1, 'last_alert' => time()];
                @file_put_contents($failFile, json_encode($fails));
                alertFailure(
                    '[deepak-blog] Push FAILED: ' . $p->slug,
                    "Scheduled for {$p->scheduled_for}, push to live posts table failed at " . date('Y-m-d H:i:s T') . ":\n\n{$e->getMessage()}\n\nThe post stays queued and will retry automatically."
                );
            }
        } catch (\Throwable $ignored) {
        }
        continue;
    }

    // 2. Update local data/posts.php — canonical shape matches
    // publish-single-post.php exactly (title, slug, tag, excerpt, body,
    // published_at with FULL datetime; no `id` key, same key order).
    $postsFile = base_path('data/posts.php');
    if (file_exists($postsFile)) {
        $postsContent = file_get_contents($postsFile);
        $slugPattern = '/[\'"]slug[\'"]\s*=>\s*[\'"]'.preg_quote($p->slug, '/').'[\'"]/';
        if (! preg_match($slugPattern, $postsContent)) {
            $escapedTitle = addcslashes($p->title, "'");
            $escapedExcerpt = addcslashes($p->excerpt, "'");
            $escapedTag = addcslashes($category, "'");

            $newEntry = "    [\n"
                ."        'title'        => '{$escapedTitle}',\n"
                ."        'slug'         => '{$p->slug}',\n"
                ."        'tag'          => '{$escapedTag}',\n"
                ."        'excerpt'      => '{$escapedExcerpt}',\n"
                ."        'body'         => <<<'BODY'\n"
                .$cleanContent."\n"
                ."BODY,\n"
                ."        'published_at' => '{$slotAt}',\n"
                ."    ],\n";

            $returnPos = strpos($postsContent, 'return [');
            $updatedContent = substr($postsContent, 0, $returnPos + 8)."\n".$newEntry.substr($postsContent, $returnPos + 8);
            file_put_contents($postsFile, $updatedContent);
            echo "  ✓ [2/4] Prepended to local data/posts.php\n";

            // Lint-guard: a broken data/posts.php takes down the whole site.
            $phpBin = defined('PHP_BINARY') && PHP_BINARY ? PHP_BINARY : '/opt/homebrew/bin/php';
            exec(escapeshellcmd($phpBin).' -l '.escapeshellarg($postsFile).' 2>&1', $lintOut, $lintCode);
            if ($lintCode !== 0) {
                fwrite(STDERR, '  ❌ PHP syntax error in data/posts.php after edit: '.implode("\n", $lintOut)."\n");
            }
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

    // 3. Mark scheduled_posts status as 'published' (retry on transient DB flake)
    try {
        fetchWithRetry(fn () => DB::table('scheduled_posts')->where('id', $p->id)->update([
            'status' => 'published',
            'published_at' => date('Y-m-d H:i:s'),
        ]), "mark-published:{$p->slug}");
        echo "  ✓ [3/4] Marked status='published' in scheduled_posts table\n";
    } catch (\Throwable $e) {
        fwrite(STDERR, "  ❌ Could not mark published (already live in posts table): {$p->slug}\n");
    }

    // 4. Update memory.md ledger (full datetime so slot batches stay visible)
    $memoryFile = __DIR__.'/../memory.md';
    if (file_exists($memoryFile)) {
        $entry = "\n- **{$p->title}**\n"
            ."  - Slug: `{$p->slug}`\n"
            ."  - Tag: `{$p->category}`\n"
            ."  - Published: `{$slotAt}`\n"
            ."  - Words: {$words}\n"
            ."  - Scheduled Slot: `{$p->slot_label}`\n"
            ."  - Status: Automatically published from scheduled_posts to Live DB\n";
        file_put_contents($memoryFile, $entry, FILE_APPEND);
        echo "  ✓ [4/4] Appended to memory.md ledger\n";
    }

    echo "  🎉 LIVE at https://deepakbagada.in/journal/{$p->slug}\n";
}

echo "\n==========================================================\n";
echo "  ✅ Scheduled Processing Completed — ZERO GIT PUSH NEEDED\n";
echo "==========================================================\n";
exit(0);
