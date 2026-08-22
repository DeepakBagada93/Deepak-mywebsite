<?php

namespace Database\Seeders;

use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Agent Architecture',
                'slug'        => 'agent-architecture',
                'description' => 'Multi-agent orchestration, swarm communication protocols, handoffs, and deterministic loops.',
                'icon'        => 'cpu',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'Model Context Protocol',
                'slug'        => 'mcp',
                'description' => 'FastAPI & Python MCP servers, tool definition contracts, SQLite/PostgreSQL connectors.',
                'icon'        => 'server',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'Content Creation',
                'slug'        => 'content-creation',
                'description' => 'Autonomous blog publishing, viral reels creation, social distribution, and multi-format repurposing.',
                'icon'        => 'edit',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'AI Ads & Video',
                'slug'        => 'ai-ads',
                'description' => 'Veo 3.1 prompts, paid ads creative generation, short-form video synthesis, and viral scoring.',
                'icon'        => 'video',
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Automation & Workflow',
                'slug'        => 'automation',
                'description' => 'High-friction business process automation, CRM enrichment, data ingestion, and webhook handlers.',
                'icon'        => 'zap',
                'sort_order'  => 5,
            ],
            [
                'name'        => 'SEO & AEO Engine',
                'slug'        => 'seo-aeo',
                'description' => 'Answer Engine Optimization, schema markup pipelines, LLM knowledge graph grounding, and semantic siloing.',
                'icon'        => 'search',
                'sort_order'  => 6,
            ],
        ];

        foreach ($categories as $cat) {
            SkillCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
