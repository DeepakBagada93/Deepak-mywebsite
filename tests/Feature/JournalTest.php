<?php

namespace Tests\Feature;

use App\Models\Post;
use Database\Seeders\PostSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Guards the "live journal missing latest posts" incident.
 *
 * Root cause: PostSeeder used to DELETE every DB row absent from the
 * committed data/posts.php, while the blog pipeline publishes directly to
 * the live DB without a git commit. Each code deploy therefore wiped the
 * newest posts until data/posts.php was committed. The seeder is now
 * upsert-only, and these tests lock that behaviour in.
 */
class JournalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PostSeeder::class);
    }

    public function test_index_shows_latest_canonical_post_from_source_file(): void
    {
        $filePosts = collect(require base_path('data/posts.php'))
            ->reject(fn (array $p) => Post::isVariantSlug($p['slug'] ?? null))
            ->sortByDesc(fn (array $p) => $p['published_at'] ?? '')
            ->values();

        $this->assertNotEmpty($filePosts, 'data/posts.php must contain at least one canonical post');

        $latest = $filePosts->first();

        $response = $this->get('/journal');
        $response->assertStatus(200);
        $response->assertSee($latest['title']);
        $response->assertSee('/journal/'.$latest['slug']);
    }

    public function test_index_lists_posts_newest_first(): void
    {
        $response = $this->get('/journal');
        $response->assertStatus(200);

        $dates = Post::published()->canonical()
            ->take(15)->pluck('date')
            ->map(fn ($d) => (string) $d)
            ->all();

        $sorted = $dates;
        rsort($sorted);
        $this->assertEquals($sorted, $dates, 'Journal index must list posts newest-first');
        $this->assertNotEmpty($dates);
    }

    public function test_index_excludes_variant_slugs(): void
    {
        Post::updateOrCreate(['id' => 'journal-guard-variant-99'], [
            'title' => 'Journal Guard Variant Probe',
            'slug' => 'journal-guard-variant-99',
            'excerpt' => 'Probe excerpt.',
            'content' => str_repeat('Guard probe content word. ', 300),
            'author' => 'Deepak Bagada',
            'date' => '2099-01-01',
            'category' => 'AI DEV',
            'read_time' => '8 min read',
            'image' => '',
            'tags' => json_encode([]),
        ]);

        $response = $this->get('/journal');
        $response->assertStatus(200);
        $response->assertDontSee('Journal Guard Variant Probe');
    }

    public function test_show_renders_latest_post(): void
    {
        $latest = Post::published()->canonical()->first();
        $this->assertNotNull($latest);

        $response = $this->get('/journal/'.$latest->slug);
        $response->assertStatus(200);
        $response->assertSee($latest->title);
    }

    public function test_seeder_never_deletes_live_only_posts(): void
    {
        // Simulate a post published directly to the live DB (zero-git-push
        // flow) that is NOT present in the committed data/posts.php.
        Post::updateOrCreate(['id' => 'journal-guard-live-only-probe'], [
            'title' => 'Journal Guard Live-Only Probe',
            'slug' => 'journal-guard-live-only-probe',
            'excerpt' => 'Probe excerpt.',
            'content' => str_repeat('Guard probe content word. ', 300),
            'author' => 'Deepak Bagada',
            'date' => date('Y-m-d'),
            'category' => 'AI DEV',
            'read_time' => '8 min read',
            'image' => '',
            'tags' => json_encode([]),
        ]);

        // A deploy-time reseed must preserve it.
        $this->seed(PostSeeder::class);

        $this->assertDatabaseHas('posts', ['id' => 'journal-guard-live-only-probe']);

        $response = $this->get('/journal/journal-guard-live-only-probe');
        $response->assertStatus(200);
    }

    public function test_source_file_has_unique_slugs_and_no_far_future_dates(): void
    {
        $filePosts = require base_path('data/posts.php');
        $slugs = array_column($filePosts, 'slug');

        $this->assertCount(count(array_unique($slugs)), $slugs, 'Duplicate slugs in data/posts.php');

        $tomorrow = date('Y-m-d', strtotime('+1 day'));
        foreach ($filePosts as $post) {
            $this->assertLessThanOrEqual(
                $tomorrow,
                $post['published_at'] ?? '',
                "Post {$post['slug']} is dated in the future and would look stale/missing once listed."
            );
        }
    }
}
