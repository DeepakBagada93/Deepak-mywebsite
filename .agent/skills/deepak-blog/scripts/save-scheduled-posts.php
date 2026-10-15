<?php
/**
 * save-scheduled-posts.php — Upserts scheduled dispatches directly to Live MySQL DB
 *
 * All slot times are IST wall-clock — force IST so `scheduled_for`
 * comparisons stay consistent with config/app.php (Asia/Kolkata) and the
 * tz-naive MySQL DATETIME columns.
 */
date_default_timezone_set('Asia/Kolkata');

require __DIR__.'/../../../../vendor/autoload.php';
$app = require __DIR__.'/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$jsonFile = $argv[1] ?? '';
if (empty($jsonFile) || !file_exists($jsonFile)) {
    fwrite(STDERR, "Usage: php save-scheduled-posts.php <payload.json>\n");
    exit(1);
}

$payload = json_decode(file_get_contents($jsonFile), true);
if (!$payload) {
    fwrite(STDERR, "Invalid JSON payload\n");
    exit(1);
}

$slug = $payload['slug'];
$tags = $payload['tags'] ?? (isset($payload['tag']) ? [$payload['tag']] : []);
DB::table('scheduled_posts')->updateOrInsert(
    ['id' => $slug],
    [
        'id' => $slug,
        'title' => $payload['title'],
        'slug' => $slug,
        'excerpt' => $payload['excerpt'],
        'content' => $payload['content'],
        'author' => 'Deepak Bagada',
        'category' => $payload['tag'] ?? 'AI DEV',
        'tag' => $payload['tag'] ?? 'AI DEV',
        'tags' => json_encode(array_values($tags)),
        'scheduled_for' => $payload['scheduled_for'],
        'slot_label' => $payload['slot_label'] ?? '',
        'status' => 'scheduled',
    ]
);

echo 'DB_SAVED: '.$slug."\n";
exit(0);
