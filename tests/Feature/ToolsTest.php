<?php

namespace Tests\Feature;

use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToolsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_tools_index_returns_success(): void
    {
        $response = $this->get('/tools');

        $response->assertStatus(200);
        $response->assertSee('Free Tools Hub');
        $response->assertSee('PDF Merge');
    }

    public function test_individual_tools_render_successfully(): void
    {
        $slugs = [
            'pdf-merge',
            'image-compressor',
            'qr-code-generator',
            'word-counter',
            'gst-calculator',
            'json-formatter',
            'password-generator',
            'base64-encoder-decoder',
            'emi-calculator',
            'age-calculator',
            'lorem-ipsum-generator',
            'percentage-calculator',
        ];

        foreach ($slugs as $slug) {
            $response = $this->get("/tools/{$slug}");
            $response->assertStatus(200);
            $response->assertDontSee('Coming Soon');
        }
    }

    public function test_removed_ai_content_tools_are_no_longer_available(): void
    {
        $removedSlugs = [
            'career-roadmap-generator',
            'ai-prompt-builder',
            'markdown-editor',
            'fancy-text-generator',
            'instagram-bio-generator',
            'hashtag-generator',
        ];

        foreach ($removedSlugs as $slug) {
            $this->get("/tools/{$slug}")->assertStatus(404);
        }

        $this->get('/tools')
            ->assertStatus(200)
            ->assertDontSee('Career Roadmap')
            ->assertDontSee('AI & Content Tools');
    }

    public function test_non_existent_tool_returns_404(): void
    {
        $response = $this->get('/tools/non-existent-tool-slug');

        $response->assertStatus(404);
    }
}
