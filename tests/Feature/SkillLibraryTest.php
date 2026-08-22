<?php

namespace Tests\Feature;

use Database\Seeders\CuratedRepoSeeder;
use Database\Seeders\ProjectSeeder;
use Database\Seeders\SkillCategorySeeder;
use Database\Seeders\SkillSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillLibraryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([
            ProjectSeeder::class,
            SkillCategorySeeder::class,
            SkillSeeder::class,
            CuratedRepoSeeder::class,
        ]);
    }

    public function test_library_page_loads(): void
    {
        $response = $this->get('/library');
        $response->assertStatus(200);
        $response->assertSee('Open-Source AI Skills');
    }

    public function test_blueprints_page_loads(): void
    {
        $response = $this->get('/blueprints');
        $response->assertStatus(200);
        $response->assertSee('AI Architecture Blueprints');
    }

    public function test_repos_page_loads(): void
    {
        $response = $this->get('/repos');
        $response->assertStatus(200);
        $response->assertSee('Curated Open-Source AI Repositories');
    }

    public function test_skill_show_page_loads(): void
    {
        $response = $this->get('/library/mcp-agent-builder');
        $response->assertStatus(200);
        $response->assertSee('MCP Agent Builder');
    }

    public function test_stack_page_loads(): void
    {
        $response = $this->get('/stack');
        $response->assertStatus(200);
        $response->assertSee('The Production AI Content & Media Stack');
    }
}
