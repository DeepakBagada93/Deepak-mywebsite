<?php

namespace Tests\Feature;

use App\Http\Middleware\RedirectPublicPrefix;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class CanonicalSeoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_public_prefixed_paths_redirect_to_canonical_urls(): void
    {
        $this->get('/public/journal')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/journal');

        $this->get('/public/journal/some-post?page=2')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/journal/some-post?page=2');

        $this->get('/public')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in');

        $this->get('/public/')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in');
    }

    public function test_public_prefix_redirect_uses_raw_request_uri(): void
    {
        $request = Request::create('/public/journal/some-post?page=2', 'GET', [], [], [], [
            'SCRIPT_NAME' => '/public/index.php',
            'SCRIPT_FILENAME' => public_path('index.php'),
            'PHP_SELF' => '/public/index.php',
            'REQUEST_URI' => '/public/journal/some-post?page=2',
        ]);

        $response = (new RedirectPublicPrefix)->handle($request, fn () => response('ok'));

        $this->assertSame(301, $response->getStatusCode());
        $this->assertSame(
            'https://deepakbagada.in/journal/some-post?page=2',
            $response->headers->get('Location')
        );
    }

    public function test_page_one_redirects_to_clean_listing_urls(): void
    {
        $this->get('/library?page=1')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/library');

        $this->get('/repos?page=1')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/repos');
    }

    public function test_category_filter_redirects_drop_page_one(): void
    {
        $this->get('/repos?category=Automation&page=1')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/repos/category/automation');

        $this->get('/library?category=agent-architecture&page=1')
            ->assertStatus(301)
            ->assertRedirect('https://deepakbagada.in/library/category/agent-architecture');
    }

    public function test_paginated_listings_self_canonicalise(): void
    {
        $this->get('/repos?page=2')
            ->assertStatus(200)
            ->assertSee('<link rel="canonical" href="https://deepakbagada.in/repos?page=2">', false);

        $this->get('/library?page=2')
            ->assertStatus(200)
            ->assertSee('<link rel="canonical" href="https://deepakbagada.in/library?page=2">', false);
    }
}
