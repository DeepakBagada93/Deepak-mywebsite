<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
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

        DB::table('posts')->truncate();

        $rows = array_map(static function (array $item) {
            return [
                'id'         => $item['slug'],
                'title'      => $item['title'],
                'slug'       => $item['slug'],
                'excerpt'    => $item['excerpt'] ?? '',
                'content'    => $item['body'] ?? '',
                'author'     => 'Deepak Bagada',
                'date'       => $item['published_at'] ?? null,
                'category'   => $item['tag'] ?? null,
                'read_time'  => '4 min read',
                'image'      => '',
                'tags'       => json_encode($item['tags'] ?? []),
            ];
        }, $posts);

        DB::table('posts')->insert($rows);

        $this->command?->info('Synced '.count($rows).' posts from data/posts.php.');
    }
}
