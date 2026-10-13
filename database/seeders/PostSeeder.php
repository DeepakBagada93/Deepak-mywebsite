<?php

namespace Database\Seeders;

use App\Support\WordCount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class PostSeeder extends Seeder
{
    /**
     * Reads data/posts.php (the blog-creator skill's source of truth) and
     * syncs it into the `posts` table using the exact same shape as
     * publish_blog.py: id = slug, body in `content`, tag in `category`,
     * published date in `date`.
     *
     * NON-DESTRUCTIVE by design: upsert-only, never deletes. The blog
     * pipeline publishes directly to the live DB without a git commit, so
     * a deploy-time reseed must never wipe those newer live-only rows.
     * To remove a post, delete it explicitly (phpMyAdmin or a dedicated
     * command) — never via this seeder.
     */
    public function run(): void
    {
        $posts = require base_path('data/posts.php');

        // Upsert-only sync (no truncate, no delete): rows are matched by
        // id (= slug), so re-running is idempotent and safe on live.
        $rows = array_map(static function (array $item) {
            // WordCount mirrors the JS auditor (strip_tags undercounts code/tables).
            $words = WordCount::count($item['body'] ?? '');
            $mins = max(1, (int) ceil($words / 200));

            return [
                'id' => $item['slug'],
                'title' => $item['title'],
                'slug' => $item['slug'],
                'excerpt' => $item['excerpt'] ?? '',
                'content' => $item['body'] ?? '',
                'author' => 'Deepak Bagada',
                'date' => $item['published_at'] ?? $item['date'] ?? null,
                'category' => $item['tag'] ?? null,
                'read_time' => $mins.' min read',
                'image' => '',
                'tags' => json_encode($item['tags'] ?? []),
            ];
        }, $posts);

        DB::transaction(static function () use ($rows): void {
            // Upsert-only: never delete rows missing from data/posts.php.
            // Live posts published directly to the DB (zero-git-push flow)
            // are newer than the last committed file — deleting them here
            // is what made /journal lose its latest entries after deploys.
            DB::table('posts')->upsert(
                $rows,
                ['id'],
                ['title', 'slug', 'excerpt', 'content', 'author', 'date', 'category', 'read_time', 'image', 'tags'],
            );
        });

        // Keep rendered views in sync so fresh content shows immediately.
        Artisan::call('view:clear');

        $this->command?->info('Synced '.count($rows).' posts from data/posts.php (atomic upsert).');
    }
}
