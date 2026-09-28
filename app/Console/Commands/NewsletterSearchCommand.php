<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class NewsletterSearchCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'newsletter:search
                            {--region=us : Target region: us, australia, dubai}
                            {--niche=agents : Niche: agents, mcp, rag, web}';

    /**
     * The console command description.
     */
    protected $description = 'Generate targeted search queries to discover high-value tech leads in US, Australia, and Dubai';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $region = strtolower((string) $this->option('region'));
        $niche = strtolower((string) $this->option('niche'));

        $regions = [
            'us' => [
                'name' => 'United States',
                'cities' => ['San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Chicago'],
                'market_focus' => 'Slashing token burn rate, eliminating hallucination loops, deterministic OPA guardrails.',
                'roles' => ['"Founder" OR "Co-Founder"', '"Chief Technology Officer" OR "CTO"', '"Head of AI" OR "VP of Engineering"'],
            ],
            'australia' => [
                'name' => 'Australia',
                'cities' => ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
                'market_focus' => 'Operations automation for fast-growing scaleups, high engineering arbitrage, data sovereignty.',
                'roles' => ['"Founder" OR "Managing Director"', '"CTO" OR "Head of Technology"', '"Digital Agency Founder"'],
            ],
            'dubai' => [
                'name' => 'Dubai & UAE',
                'cities' => ['Dubai', 'Abu Dhabi', 'DIFC'],
                'market_focus' => 'Dubai AI Strategy 2031, luxury brand customer journey automation, bilingual English/Arabic RAG.',
                'roles' => ['"Managing Director" OR "CEO"', '"Head of Digital Transformation"', '"CTO" OR "Tech Founder"'],
            ],
        ];

        $niches = [
            'agents' => [
                'label' => 'Autonomous Multi-Agent AI Systems',
                'keywords' => ['"autonomous agents" OR "multi-agent"', '"LangGraph" OR "CrewAI"', '"agent workflows"'],
            ],
            'mcp' => [
                'label' => 'Model Context Protocol (MCP) Tooling',
                'keywords' => ['"Model Context Protocol" OR "MCP"', '"LLM tools" OR "FastAPI MCP"', '"Claude tools"'],
            ],
            'rag' => [
                'label' => 'Enterprise RAG & Hybrid Vector Search',
                'keywords' => ['"enterprise RAG" OR "hybrid search"', '"pgvector" OR "semantic search"', '"vector database"'],
            ],
            'web' => [
                'label' => 'High-Performance Web Engineering',
                'keywords' => ['"Next.js" OR "Laravel"', '"custom software agency"', '"high-performance web"'],
            ],
        ];

        $selectedRegion = $regions[$region] ?? $regions['us'];
        $selectedNiche = $niches[$niche] ?? $niches['agents'];

        $this->line('============================================================');
        $this->info("🎯 Lead Discovery Matrix: {$selectedRegion['name']} — {$selectedNiche['label']}");
        $this->line("Angle: {$selectedRegion['market_focus']}");
        $this->line('============================================================');

        $this->newLine();
        $this->comment('🔍 1. LinkedIn Lead Discovery (Google X-Ray Dorks):');
        $this->line('Copy & paste any query into Google to find matching executive profiles:');

        $topicStr = implode(' OR ', $selectedNiche['keywords']);

        foreach ($selectedRegion['cities'] as $city) {
            foreach ($selectedRegion['roles'] as $role) {
                $query = "site:linkedin.com/in ({$role}) \"{$city}\" ({$topicStr})";
                $searchUrl = 'https://www.google.com/search?q='.urlencode($query);
                $this->line("  • {$query}");
            }
        }

        $this->newLine();
        $this->comment('🐦 2. Twitter / X Real-Time Builder Search Queries:');
        foreach ($selectedNiche['keywords'] as $keyword) {
            $xQuery = "({$keyword}) (".implode(' OR ', $selectedRegion['cities']).') ("founder" OR "building" OR "shipping")';
            $this->line("  • {$xQuery}");
        }

        $this->newLine();
        $this->comment('⚡ 3. Direct Send Action:');
        $this->line('Once you discover a qualified email, send your personalized technical dispatch:');
        $this->info("  php artisan newsletter:send lead@company.com --niche={$niche} --region={$region} --source=outreach_{$region}");

        $this->newLine();
        $this->line('Or test with dry-run first:');
        $this->line("  php artisan newsletter:send lead@company.com --niche={$niche} --region={$region} --dry-run");
        $this->line('============================================================');

        return 0;
    }
}
