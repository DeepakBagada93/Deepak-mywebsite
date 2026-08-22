<?php

namespace Database\Seeders;

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
     */
    public function run(): void
    {
        $posts = require base_path('data/posts.php');

        // Atomic sync: upsert every post and delete only rows that no longer
        // exist in data/posts.php. Never truncate — a truncate leaves the posts
        // table empty for the duration of the insert, which makes the live
        // journal briefly show stale/missing posts until the next refresh.
        $rows = array_map(static function (array $item) {
            return [
                'id' => $item['slug'],
                'title' => $item['title'],
                'slug' => $item['slug'],
                'excerpt' => $item['excerpt'] ?? '',
                'content' => $item['body'] ?? '',
                'author' => 'Deepak Bagada',
                'date' => $item['published_at'] ?? null,
                'category' => $item['tag'] ?? null,
                'read_time' => '4 min read',
                'image' => '',
                'tags' => json_encode($item['tags'] ?? []),
            ];
        }, $posts);

        DB::transaction(static function () use ($rows): void {
            $keepIds = array_column($rows, 'id');

            DB::table('posts')
                ->whereNotIn('id', $keepIds)
                ->delete();

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
