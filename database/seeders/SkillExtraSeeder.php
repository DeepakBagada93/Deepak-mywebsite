<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillExtraSeeder extends Seeder
{
    public function run(): void
    {
        $mcpCat = SkillCategory::where('slug', 'mcp')->first();
        $contentCat = SkillCategory::where('slug', 'content-creation')->first();
        $videoCat = SkillCategory::where('slug', 'ai-ads')->first();
        $autoCat = SkillCategory::where('slug', 'automation')->first();
        $agentCat = SkillCategory::where('slug', 'agent-architecture')->first();
        $seoCat = SkillCategory::where('slug', 'seo-aeo')->first();

        $extra = [
            ['slug' => 'seo-aeo-auto-ranker-2026', 'title' => 'SEO & AEO Auto-Ranker — AI Overview Citation Engine', 'summary' => 'Ship answer-first pages with FAQPage + Article + HowTo schema, 90-day freshness, and citation tracking for Google AI Overviews, Perplexity & ChatGPT.', 'cat' => $seoCat?->id, 'diff' => 'intermediate', 'stars' => 47, 'ver' => '1.4.0'],
            ['slug' => 'schema-markup-generator-2026', 'title' => 'Schema Markup Generator — JSON-LD for AEO & GEO', 'summary' => 'Generate valid Article + FAQPage + HowTo + Breadcrumb + Speakable JSON-LD that passes Rich Results Test and lifts AI citation 3-5x.', 'cat' => $seoCat?->id, 'diff' => 'beginner', 'stars' => 31, 'ver' => '1.1.0'],
            ['slug' => 'pydantic-ai-type-safe-agents-2026', 'title' => 'Pydantic-AI Type-Safe Agent Framework', 'summary' => 'Type-safe LLM agents with Pydantic validation, dependency injection, and tool retry — replaces stringly-typed prompts with schemas.', 'cat' => $agentCat?->id, 'diff' => 'advanced', 'stars' => 63, 'ver' => '0.9.0'],
            ['slug' => 'langgraph-state-machine-2026', 'title' => 'LangGraph State Machine — Cyclic Agent Workflows', 'summary' => 'Build cyclic, stateful agent graphs with LangGraph: supervisor -> researcher -> coder -> auditor loops with checkpointing.', 'cat' => $agentCat?->id, 'diff' => 'advanced', 'stars' => 88, 'ver' => '0.2.0'],
            ['slug' => 'crewai-swarm-orchestrator-2026', 'title' => 'CrewAI Swarm Orchestrator — Role-Based Agent Teams', 'summary' => 'Role, goal, backstory agents collaborating via CrewAI. Best for content pipelines and research swarms with 2.88 agents/business avg.', 'cat' => $agentCat?->id, 'diff' => 'intermediate', 'stars' => 72, 'ver' => '0.80.0'],
            ['slug' => 'mcp-model-context-protocol-deepdive-2026', 'title' => 'MCP DeepDive — JSON-RPC Tool Registry & Guardrails', 'summary' => 'Deep dive into MCP: stdio/SSE, tool/resource/prompt contracts, OAuth scoped JWT, catalog signing, and 38K GPU IndiaAI rail.', 'cat' => $mcpCat?->id, 'diff' => 'advanced', 'stars' => 91, 'ver' => '1.3.0'],
            ['slug' => 'hyperframes-motion-reels-2026', 'title' => 'HyperFrames Motion Reels — Kinetic Typography Engine', 'summary' => 'Deterministic Remotion/Canvas text-motion reels: 4K portrait, safe zones, beat-synced, render via Cloud Run + audit harness.', 'cat' => $videoCat?->id, 'diff' => 'intermediate', 'stars' => 39, 'ver' => '2.5.0'],
            ['slug' => 'voice-sfx-kokoro-tts-2026', 'title' => 'Voice-SFX Kokoro TTS — Open-Source Voiceover Studio', 'summary' => 'Generate Hindi/English voiceovers with Kokoro TTS, duck BGM via FFmpeg sidechain, captions auto-synced for reels.', 'cat' => $contentCat?->id, 'diff' => 'beginner', 'stars' => 28, 'ver' => '1.0.0'],
            ['slug' => 'tavily-brave-search-agent-2026', 'title' => 'Tavily + Brave Search Research Agent', 'summary' => 'Research swarm: Tavily + Brave + Perplexity APIs merged, deduplicated, cited — fuels AEO articles and RAG ingestion.', 'cat' => $autoCat?->id, 'diff' => 'intermediate', 'stars' => 55, 'ver' => '1.2.1'],
            ['slug' => 'awesome-llm-apps-curator-2026', 'title' => 'Awesome LLM Apps Curator — 133k Stars Playbook', 'summary' => 'Curated 20 LLM apps that actually ship: why great, when not to use, Deepak architecture link.', 'cat' => $contentCat?->id, 'diff' => 'beginner', 'stars' => 44, 'ver' => '3.0.0'],
        ];
        foreach ($extra as $i => $e) {
            Skill::updateOrCreate(['slug' => $e['slug']], [
                'title' => $e['title'], 'summary' => $e['summary'], 'content' => '# '.$e['title']."\n\n".$e['summary']."\n\nSee library for full blueprint. Category: ".$e['slug'].' — production-tested 2026.',
                'category_id' => $e['cat'], 'difficulty' => $e['diff'], 'github_url' => 'https://github.com/DeepakBagada93',
                'version' => $e['ver'], 'stars' => $e['stars'], 'status' => 'published', 'sort_order' => 20 + $i, 'published_at' => now(),
            ]);
        }
    }
}
