<?php

namespace Tests\Feature;

use App\Http\Controllers\PostController;
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

    /**
     * @param  array<string, mixed>  $overrides
     */
    protected function makeProbePost(string $slug, string $content, array $overrides = []): Post
    {
        return Post::updateOrCreate(['id' => $slug], array_merge([
            'title' => 'Probe '.$slug,
            'slug' => $slug,
            'excerpt' => 'Probe excerpt.',
            'content' => $content,
            'author' => 'Deepak Bagada',
            'date' => date('Y-m-d', strtotime('-1 day')),
            'category' => 'PROBE',
            'read_time' => '8 min read',
            'image' => '',
            'tags' => json_encode([]),
        ], $overrides));
    }

    public function test_show_emits_faqpage_json_ld_when_post_has_faqs(): void
    {
        $longAnswer = str_repeat('Scalable answer sentence. ', 30); // >500 chars
        $this->assertGreaterThan(500, strlen($longAnswer));

        $this->makeProbePost('faq-guard-with-faqs', implode("\n\n", [
            '# Probe FAQs',
            'Intro paragraph with enough words to render.',
            '## Frequently Asked Questions',
            '### What is the first probe question?',
            'The first answer has **bold** text and a [link](https://example.com/docs) for stripping.',
            '### How does the second probe feature work?',
            $longAnswer,
            '## The Bottom Line',
            'Closing paragraph.',
        ]));

        $response = $this->get('/journal/faq-guard-with-faqs');
        $response->assertStatus(200);
        $response->assertSee('FAQPage', false);
        $response->assertSee('What is the first probe question?', false);
        $response->assertSee('The first answer has bold text and a link for stripping.', false);
        // Answers are capped at 500 chars in the schema.
        $response->assertSee(substr($longAnswer, 0, 500), false);
        $response->assertDontSee($longAnswer, false);
    }

    public function test_show_omits_faqpage_json_ld_when_post_has_no_faqs(): void
    {
        $this->makeProbePost('faq-guard-without-faqs', implode("\n\n", [
            '# Probe No FAQs',
            'Just a regular article body without any FAQ section.',
            '## Section One',
            'Some paragraph content here.',
        ]));

        $response = $this->get('/journal/faq-guard-without-faqs');
        $response->assertStatus(200);
        $response->assertSee('Article', false);
        $response->assertDontSee('FAQPage', false);
    }

    public function test_show_html_contains_no_literal_undefined(): void
    {
        // Four same-category probes so KEEP READING only links controlled titles.
        foreach (range(1, 4) as $i) {
            $this->makeProbePost('render-guard-clean-'.$i, implode("\n\n", [
                '# Clean Probe '.$i,
                'Plain engineering prose about latency budgets and retry queues.',
                '## Section One',
                'More paragraphs with digits 123 and symbols % & @ for coverage.',
            ]), ['category' => 'RENDER PROBE', 'title' => 'Clean Probe Title '.$i]);
        }

        $response = $this->get('/journal/render-guard-clean-1');
        $response->assertStatus(200);
        $response->assertDontSee('undefined', false);
    }

    public function test_off_topic_slugs_return_410_gone(): void
    {
        $response = $this->get('/journal/sarkari-yojana-2026-list');
        $response->assertStatus(410);

        $response = $this->get('/journal/womens-cricket-ipl-fantasy-2026');
        $response->assertStatus(410);
    }

    public function test_sitemap_excludes_off_topic_slugs_even_when_substantial(): void
    {
        // Belt-and-braces: fatten a gone slug past the <900-word filter and
        // prove the explicit exclusion still keeps it out of the sitemap.
        $this->makeProbePost(
            'sarkari-yojana-2026-list',
            str_repeat('Substantial probe content word. ', 400)
        );

        $this->get('/journal/sarkari-yojana-2026-list')->assertStatus(410);

        $response = $this->get('/sitemap.xml');
        $response->assertStatus(200);
        foreach (PostController::GONE_SLUGS as $slug) {
            $response->assertDontSee('/journal/'.$slug, false);
        }
    }

    public function test_variant_slug_301_redirects_to_published_base(): void
    {
        $this->makeProbePost('variant-guard-base-post', 'Base post body with enough words to render a page.');
        $this->makeProbePost('variant-guard-base-post-variant-3', 'Variant near-duplicate body.');

        $this->get('/journal/variant-guard-base-post')->assertStatus(200);

        $response = $this->get('/journal/variant-guard-base-post-variant-3');
        $response->assertStatus(301);
        $this->assertStringEndsWith(
            '/journal/variant-guard-base-post',
            (string) $response->headers->get('Location')
        );
    }

    public function test_variant_slug_without_base_returns_410_gone(): void
    {
        $this->makeProbePost('orphan-guard-post-variant-7', 'Orphan variant body without a base post.');

        $this->get('/journal/orphan-guard-post-variant-7')->assertStatus(410);
    }

    public function test_paginated_journal_self_canonicalises(): void
    {
        $response = $this->get('/journal?page=2');

        $response->assertStatus(200);
        $response->assertSee(
            '<link rel="canonical" href="https://deepakbagada.in/journal?page=2">',
            false
        );
    }

    public function test_page_one_redirects_to_clean_journal_url(): void
    {
        $this->get('/journal?page=1')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/journal');
    }
}
