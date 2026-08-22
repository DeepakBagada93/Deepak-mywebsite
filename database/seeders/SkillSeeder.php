<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillArchitecture;
use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $mcpCat = SkillCategory::where('slug', 'mcp')->first();
        $contentCat = SkillCategory::where('slug', 'content-creation')->first();
        $videoCat = SkillCategory::where('slug', 'ai-ads')->first();
        $autoCat = SkillCategory::where('slug', 'automation')->first();
        $agentCat = SkillCategory::where('slug', 'agent-architecture')->first();

        // Skill 1: MCP Agent Builder
        $skill1 = Skill::updateOrCreate(
            ['slug' => 'mcp-agent-builder'],
            [
                'title' => 'MCP Agent Builder & Protocol Server Pipeline',
                'summary' => 'Full lifecycle pipeline for Model Context Protocol (MCP) servers: schema contracts, FastAPI endpoints, tool discovery, and verification audits.',
                'content' => <<<'MARKDOWN'
# MCP Agent Builder & Server Framework

An end-to-end framework for scaffolding, verifying, and deploying high-performance **Model Context Protocol (MCP)** servers in Python (FastAPI/AnyIO) and Node.js.

## Core Capabilities
- **Schema Autodiscovery**: Automated translation of standard Python type hints and Pydantic models into valid JSON-RPC 2.0 tool definitions.
- **Resource Streaming**: High-throughput file and database record streaming across standard input/output (stdio) and Server-Sent Events (SSE).
- **Zero-Latency Tool Dispatch**: Async concurrency handlers with input sanitization and execution sandboxing.

```python
# Example MCP Tool Scaffold
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("production-agent-gateway")

@mcp.tool()
async def search_database(query: str, limit: int = 10) -> str:
    """Execute high-speed vector and semantic search across knowledge records."""
    results = await db_service.vector_search(query=query, top_k=limit)
    return results.to_json()
```

## Architecture Flow
1. **Client Handshake**: Host LLM agent initiates connection over stdio / SSE.
2. **Contract Registration**: Capabilities negotiation and schema validation.
3. **Execution Guardrails**: Rate limits, telemetry logging, and output parsing.
MARKDOWN,
                'category_id' => $mcpCat?->id,
                'difficulty' => 'advanced',
                'github_url' => 'https://github.com/DeepakBagada93',
                'version' => '1.2.0',
                'stars' => 42,
                'status' => 'published',
                'sort_order' => 1,
                'published_at' => now(),
            ]
        );

        SkillArchitecture::updateOrCreate(
            ['title' => 'Model Context Protocol (MCP) Server Architecture'],
            [
                'skill_id' => $skill1->id,
                'description' => 'FastAPI / AsyncIO MCP Server connecting Host LLMs with local databases, shell tools, and remote APIs via JSON-RPC 2.0.',
                'diagram_svg' => '<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:monospace;background:#161616;padding:24px;border-radius:6px;"><rect x="40" y="80" width="180" height="120" rx="8" fill="#222" stroke="#444" stroke-width="2"/><text x="130" y="130" fill="#fff" text-anchor="middle" font-size="14" font-weight="bold">HOST LLM AGENT</text><text x="130" y="155" fill="#888" text-anchor="middle" font-size="11">Claude / Gemini / Antigravity</text><line x1="220" y1="140" x2="330" y2="140" stroke="#fff" stroke-width="2" stroke-dasharray="4"/><text x="275" y="130" fill="#aaa" text-anchor="middle" font-size="11">JSON-RPC / stdio</text><rect x="330" y="60" width="220" height="160" rx="8" fill="#1c1c1c" stroke="#666" stroke-width="2"/><text x="440" y="100" fill="#fff" text-anchor="middle" font-size="14" font-weight="bold">MCP PROTOCOL GATEWAY</text><text x="440" y="125" fill="#aaa" text-anchor="middle" font-size="11">FastMCP / Python 3.12</text><text x="440" y="150" fill="#666" text-anchor="middle" font-size="10">• Tool Registry &amp; Schemas</text><text x="440" y="170" fill="#666" text-anchor="middle" font-size="10">• Input Sandbox &amp; Guardrails</text><line x1="550" y1="100" x2="620" y2="60" stroke="#fff" stroke-width="1.5"/><rect x="620" y="30" width="140" height="60" rx="6" fill="#222" stroke="#444"/><text x="690" y="65" fill="#fff" text-anchor="middle" font-size="11">Database / RAG</text><line x1="550" y1="180" x2="620" y2="220" stroke="#fff" stroke-width="1.5"/><rect x="620" y="190" width="140" height="60" rx="6" fill="#222" stroke="#444"/><text x="690" y="225" fill="#fff" text-anchor="middle" font-size="11">External APIs</text></svg>',
                'sort_order' => 1,
            ]
        );

        // Skill 2: Content Repurposing Hub
        $skill2 = Skill::updateOrCreate(
            ['slug' => 'content-repurposing-hub'],
            [
                'title' => 'Content Repurposing Hub & Multi-Platform Syndication',
                'summary' => 'Autonomous engine that takes 1 canonical long-form article or transcript and compiles it into 5 high-converting formats: X threads, LinkedIn carousels, newsletter briefs, and short video scripts.',
                'content' => <<<'MARKDOWN'
# Content Repurposing Hub

Transform singular long-form insights into omni-channel distribution assets with deterministic formatting rules and voice preservation.

## Output Matrix
1. **X (Twitter) Thread**: 6-8 punchy posts with hook, body bullet points, metrics, and call-to-action.
2. **LinkedIn Narrative**: Authority-building story format with white space formatting and engagement prompt.
3. **Weekly Newsletter**: 250-word curated digest summary with actionable takeaways.
4. **Short-Form Video Script**: 45-second 3-beat script (Hook -> Agitation/Insight -> Resolution) with on-screen visual prompts.

## Contract & Handoff
```json
{
  "source_url": "https://deepakbagada.in/journal/multi-agent-system-architecture",
  "audience": "Engineers & Founders",
  "tone": "Direct, Technical, Minimalist",
  "outputs": ["x_thread", "linkedin_post", "newsletter_summary", "reel_script"]
}
```
MARKDOWN,
                'category_id' => $contentCat?->id,
                'difficulty' => 'intermediate',
                'github_url' => 'https://github.com/DeepakBagada93',
                'version' => '2.0.1',
                'stars' => 38,
                'status' => 'published',
                'sort_order' => 2,
                'published_at' => now(),
            ]
        );

        // Skill 3: Video Product Pipeline
        $skill3 = Skill::updateOrCreate(
            ['slug' => 'video-product-pipeline'],
            [
                'title' => 'Video Product Pipeline & Motion Graphic Synthesizer',
                'summary' => 'End-to-end autonomous video creation: trend discovery, 3-hook scripting, Remotion / Canvas visual generation, and automated viral scorecard audit.',
                'content' => <<<'MARKDOWN'
# Video Product Pipeline

A production-grade pipeline for generating high-CTR technical and product reels in vertical 9:16 format with programmatic motion typography.

## Quality & Viral Scoring Gates
- **0-3s Hook Retention**: Visual motion burst and bold keyword overlay.
- **Pacing**: Maximum 2.5 seconds per visual shift or typography scene.
- **Audio Synchronization**: Sub-millisecond subtitle alignment and punch sound cues.
MARKDOWN,
                'category_id' => $videoCat?->id,
                'difficulty' => 'advanced',
                'github_url' => 'https://github.com/DeepakBagada93',
                'version' => '1.1.0',
                'stars' => 29,
                'status' => 'published',
                'sort_order' => 3,
                'published_at' => now(),
            ]
        );

        // Skill 4: Paid Ads Studio
        $skill4 = Skill::updateOrCreate(
            ['slug' => 'paid-ads-studio'],
            [
                'title' => 'Paid Ads Studio & Generative Creative Matrix',
                'summary' => 'Generative paid advertising blueprint: prompt matrices for Veo 3.1 & Midjourney, Meta/Google ad copy variants, and audience psychographic clustering.',
                'content' => <<<'MARKDOWN'
# Paid Ads Studio

Architect and deploy multi-variant high-ROAS creative matrices for Meta Ads, Google Performance Max, and YouTube Shorts.

## Features
- **Hook Variations**: Generates 5 distinct psychological angles (Loss Aversion, Direct Benefit, Contrarian, Social Proof, Curiosity Gap).
- **Prompt Consistency**: Seed-locked generative image and video parameters for brand cohesion.
MARKDOWN,
                'category_id' => $videoCat?->id,
                'difficulty' => 'intermediate',
                'github_url' => 'https://github.com/DeepakBagada93',
                'version' => '1.0.0',
                'stars' => 19,
                'status' => 'published',
                'sort_order' => 4,
                'published_at' => now(),
            ]
        );

        // Skill 5: AI Automation
        $skill5 = Skill::updateOrCreate(
            ['slug' => 'ai-automation-workflows'],
            [
                'title' => 'Enterprise AI Automation & Webhook Orchestrator',
                'summary' => 'Robust workflow design for automating high-friction business operations: async triage, CRM data enrichment, invoice intelligence, and self-healing task queues.',
                'content' => <<<'MARKDOWN'
# Enterprise AI Automation

Deterministic workflow design that merges LLM reasoning with strict programmatic assertions, webhook gateways, and error recovery fallbacks.

## Execution Principles
1. **Idempotency**: All webhook consumers must safely tolerate duplicate deliveries.
2. **Structured JSON Enforcement**: Zero free-form markdown when invoking downstream transactional APIs.
3. **Human-in-the-Loop Triggers**: High-stakes operations automatically route to review channels before mutation.
MARKDOWN,
                'category_id' => $autoCat?->id,
                'difficulty' => 'intermediate',
                'github_url' => 'https://github.com/DeepakBagada93',
                'version' => '1.3.0',
                'stars' => 54,
                'status' => 'published',
                'sort_order' => 5,
                'published_at' => now(),
            ]
        );

        // Blueprints 1 & 2
        SkillArchitecture::updateOrCreate(
            ['title' => 'Multi-Agent System Architecture & Handoff Protocol'],
            [
                'skill_id' => $skill5->id,
                'description' => 'Autonomous swarm architecture: Supervisor Planner, Specialized Subagents (Researcher, Coder, Auditor), Shared Memory State, and Verification Gates.',
                'diagram_svg' => '<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:monospace;background:#161616;padding:24px;border-radius:6px;"><rect x="40" y="110" width="160" height="90" rx="8" fill="#222" stroke="#555" stroke-width="2"/><text x="120" y="150" fill="#fff" text-anchor="middle" font-size="13" font-weight="bold">SUPERVISOR</text><text x="120" y="170" fill="#888" text-anchor="middle" font-size="10">Planning &amp; Routing</text><line x1="200" y1="130" x2="320" y2="60" stroke="#fff" stroke-width="2"/><line x1="200" y1="155" x2="320" y2="155" stroke="#fff" stroke-width="2"/><line x1="200" y1="180" x2="320" y2="250" stroke="#fff" stroke-width="2"/><rect x="320" y="30" width="180" height="60" rx="6" fill="#1c1c1c" stroke="#444"/><text x="410" y="65" fill="#fff" text-anchor="middle" font-size="12">Agent 1: Research</text><rect x="320" y="125" width="180" height="60" rx="6" fill="#1c1c1c" stroke="#444"/><text x="410" y="160" fill="#fff" text-anchor="middle" font-size="12">Agent 2: Code Gen</text><rect x="320" y="220" width="180" height="60" rx="6" fill="#1c1c1c" stroke="#444"/><text x="410" y="255" fill="#fff" text-anchor="middle" font-size="12">Agent 3: Quality Audit</text><line x1="500" y1="155" x2="600" y2="155" stroke="#fff" stroke-width="2"/><rect x="600" y="110" width="160" height="90" rx="8" fill="#222" stroke="#555" stroke-width="2"/><text x="680" y="150" fill="#fff" text-anchor="middle" font-size="13" font-weight="bold">FINAL ARTIFACT</text><text x="680" y="170" fill="#888" text-anchor="middle" font-size="10">Validated Production Asset</text></svg>',
                'sort_order' => 2,
            ]
        );

        SkillArchitecture::updateOrCreate(
            ['title' => 'Omni-Channel Content Creation Pipeline'],
            [
                'skill_id' => $skill2->id,
                'description' => 'Content workflow: Idea & Research -> Canonical Article -> Subagent Repurposing Matrix (X, LinkedIn, Video, Email) -> Autonomous Distribution.',
                'diagram_svg' => '<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:monospace;background:#161616;padding:24px;border-radius:6px;"><rect x="30" y="100" width="150" height="80" rx="8" fill="#222" stroke="#555"/><text x="105" y="135" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">CORE ESSAY</text><text x="105" y="155" fill="#888" text-anchor="middle" font-size="10">Canonical 1200w</text><line x1="180" y1="140" x2="270" y2="140" stroke="#fff" stroke-width="2"/><rect x="270" y="70" width="180" height="140" rx="8" fill="#1a1a1a" stroke="#666"/><text x="360" y="105" fill="#fff" text-anchor="middle" font-size="12" font-weight="bold">REPURPOSE ENGINE</text><text x="360" y="130" fill="#888" text-anchor="middle" font-size="10">• Hook Synthesizer</text><text x="360" y="150" fill="#888" text-anchor="middle" font-size="10">• Tone Preserver</text><text x="360" y="170" fill="#888" text-anchor="middle" font-size="10">• Format Adapters</text><line x1="450" y1="100" x2="550" y2="40" stroke="#fff" stroke-width="1.5"/><rect x="550" y="20" width="200" height="40" rx="6" fill="#222" stroke="#444"/><text x="650" y="45" fill="#fff" text-anchor="middle" font-size="11">X / Twitter Thread</text><line x1="450" y1="120" x2="550" y2="90" stroke="#fff" stroke-width="1.5"/><rect x="550" y="70" width="200" height="40" rx="6" fill="#222" stroke="#444"/><text x="650" y="95" fill="#fff" text-anchor="middle" font-size="11">LinkedIn Carousel</text><line x1="450" y1="160" x2="550" y2="140" stroke="#fff" stroke-width="1.5"/><rect x="550" y="120" width="200" height="40" rx="6" fill="#222" stroke="#444"/><text x="650" y="145" fill="#fff" text-anchor="middle" font-size="11">Weekly Newsletter</text><line x1="450" y1="180" x2="550" y2="190" stroke="#fff" stroke-width="1.5"/><rect x="550" y="170" width="200" height="40" rx="6" fill="#222" stroke="#444"/><text x="650" y="195" fill="#fff" text-anchor="middle" font-size="11">9:16 Video Reel Script</text></svg>',
                'sort_order' => 3,
            ]
        );
    }
}
