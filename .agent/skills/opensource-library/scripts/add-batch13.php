<?php
// Batch 13 — 10 new trending Sep 17-19 2026, via opensource-library skill v4.0
// Search: GitHub Trending daily Sep 17-18 + wangchujiang weekly + github-trending.today Sep 6 + popcafa weekly Sep 4
// Anti-duplication: checked vs memory.md 173 repos + CuratedRepo DB 173 — all 10 UNIQUE verified 2026-09-19
// Categories: Agent Frameworks, MCP & Tooling, RAG & Vector Search, Automation, LLM Tooling, Infrastructure

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$batch13 = [
    [
        'title' => 'koala73/worldmonitor',
        'url' => 'https://github.com/koala73/worldmonitor',
        'description' => 'WorldMonitor — real-time global intelligence dashboard. AI-powered news aggregation, geopolitical monitoring, infrastructure tracking in one situational awareness interface. TS, weekly #1 +12k Sep 18 2026 (76k stars).',
        'category' => 'Infrastructure',
        'tags' => ['intel-dashboard','news-aggregation','monitoring','typescript'],
        'why_great' => 'I scan AI news nightly for my journal from Junagadh, and hand-rolled aggregators rot within weeks. WorldMonitor fusing news plus geopolitical plus infra signals into one dashboard is the situational layer I want above my SearXNG scanner. I would self-host it on the Rs 6K VPS and point my research agents at its feed before any manual browsing.',
        'when_not' => 'When you need verified sources for client reports — aggregation surfaces fast, verification still needs human editors.',
        'stars' => 75986,
        'featured' => true,
    ],
    [
        'title' => 'ruvnet/ruflo',
        'url' => 'https://github.com/ruvnet/ruflo',
        'description' => 'Ruflo — the original agent meta-harness. Deploy multi-player swarms, coordinate autonomous workflows, conversational AI systems. Adaptive memory, self-learning, RAG, Claude Code / Codex / Hermes native. TS (71k stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['meta-harness','swarms','multi-agent','rag'],
        'why_great' => 'I run LangGraph plus CrewAI-pattern swarms behind one OPA gate in Junagadh, and cross-harness coordination is still manual glue. Ruflo as a meta-harness with adaptive memory plus RAG that speaks Claude Code, Codex and Hermes natively is the consolidation layer my multi-harness setup is missing. I would trial it against my LangGraph checkpoint rig on catalog QA first.',
        'when_not' => 'When your swarm is 2-4 roles on one framework — meta-harness overhead needs multi-harness pain to pay off.',
        'stars' => 70967,
        'featured' => true,
    ],
    [
        'title' => 'ruvnet/RuView',
        'url' => 'https://github.com/ruvnet/RuView',
        'description' => 'RuView — turns commodity WiFi signals into real-time spatial intelligence, vital-sign monitoring, presence detection. Zero video pixels. Rust, 87.3k stars, +5k week Sep 18 2026.',
        'category' => 'Infrastructure',
        'tags' => ['wifi-sensing','spatial-intel','rust','privacy'],
        'why_great' => 'I work with Gujarat retail shops where cameras trigger DPDP anxiety but footfall data drives staffing. RuView doing presence plus vital signs from WiFi with no video is the privacy-shaped sensor I would actually get permission to install. I would pair it with my WhatsApp footfall alerts on the Rs 6K VPS and keep every byte inside the shop network.',
        'when_not' => 'When you need identity or fine gesture detail — signal sensing gives presence, not faces; cameras still win there.',
        'stars' => 87316,
        'featured' => true,
    ],
    [
        'title' => 'bojieli/ai-agent-book',
        'url' => 'https://github.com/bojieli/ai-agent-book',
        'description' => 'AI Agent Book — full open book on agent design principles plus engineering practice: complete text, compiled PDF, per-chapter code. Python, +10.6k stars week Sep 18 2026 (24.7k total).',
        'category' => 'LLM Tooling',
        'tags' => ['book','agent-design','curriculum','python'],
        'why_great' => 'I point Junagadh interns at ai-engineering-from-scratch before touching client work, and this is the missing second textbook — design principles plus engineering practice with code per chapter. Rebuilding planners and handoffs by hand removes the magic that causes production surprises. Two of my interns would read this before their first MCP tool.',
        'when_not' => 'When you need 2026-framework specifics — books teach durable principles; pin LangGraph 41k plus MAF 1.0 docs for API truth.',
        'stars' => 24713,
        'featured' => false,
    ],
    [
        'title' => 'tirth8205/code-review-graph',
        'url' => 'https://github.com/tirth8205/code-review-graph',
        'description' => 'Code Review Graph — local-first code intelligence graph for MCP and CLI. Persistent codebase map so agents read only what matters, benchmarked context cuts on reviews and large repos. Python, +3k week (27.3k stars).',
        'category' => 'MCP & Tooling',
        'tags' => ['code-graph','mcp','code-review','context-optimization'],
        'why_great' => 'I measured 42 minutes of agent exploration per unfamiliar repo in my Junagadh lab before codebase-memory-mcp cut it to milliseconds. Code-review-graph doing the same local-first map with benchmarked context reductions, purpose-built for reviews, is the exact pre-filter I bolt in front of expensive reasoning calls. I would wire its MCP server into Cursor morning scans beside trace-mcp.',
        'when_not' => 'When the repo is under 1k LOC — plain file reads beat graph indexing overhead every time.',
        'stars' => 27347,
        'featured' => true,
    ],
    [
        'title' => 'every-app/open-seo',
        'url' => 'https://github.com/every-app/open-seo',
        'description' => 'Open SEO — open-source alternative to Semrush and Ahrefs. TS, weekly trending +2.3-2.8k Sep 2026 (15.8k stars).',
        'category' => 'LLM Tooling',
        'tags' => ['seo','aeo','keyword-research','self-hosted'],
        'why_great' => 'I run AEO plus SEO for Gujarat SMEs where Rs 8k monthly SaaS seats eat the retainer. A self-hosted Semrush-shaped alternative I can point at deepakbagada.in citations plus AI Overview tracking is the tool my 90-day ledger wants. I would trial it against my PAA-mapping workflow for one client quarter before moving spend.',
        'when_not' => 'When you need proprietary clickstream or backlink indexes — open tools track what you measure, not what vendors license.',
        'stars' => 15826,
        'featured' => false,
    ],
    [
        'title' => 'tashfeenahmed/freellmapi',
        'url' => 'https://github.com/tashfeenahmed/freellmapi',
        'description' => 'FreeLLMAPI — 7.4 billion tokens per month across 34 free LLM providers. TS, weekly trending +3.6k Sep 2026 (23.3k stars).',
        'category' => 'LLM Tooling',
        'tags' => ['free-tier','llm-gateway','routing','typescript'],
        'why_great' => 'I route bulk batches to Sol plus GLM Flash plus Kimi on rupee math from Junagadh, and free-tier aggregation is the missing bottom rung for eval replays. Thirty-four providers behind one gateway means nightly promptfoo runs stop touching paid quotas. I would sandbox it for eval traffic only — never client money paths — with per-provider caps logged to the ledger.',
        'when_not' => 'When uptime or DPDP matters — free tiers throttle and log unpredictably; paid APIs own production.',
        'stars' => 23374,
        'featured' => false,
    ],
    [
        'title' => '1jehuang/jcode',
        'url' => 'https://github.com/1jehuang/jcode',
        'description' => 'JCode — the most RAM-efficient harness. Rust, 12.8k stars, +2.5k week Sep 18 2026.',
        'category' => 'Agent Frameworks',
        'tags' => ['harness','rust','ram-efficient','coding-agent'],
        'why_great' => 'I test minimal harnesses on a Rs 6K VPS where every extra dependency breaks deploys, and RAM efficiency is the metric nobody benchmarks. JCode claiming the leanest harness in Rust is the exact shape I would run on Pi 5 edge agents at 62 tok/s beside GenericAgent. I would measure its context use against my 30K-context discipline before trusting the claim.',
        'when_not' => 'When you need rich framework features — lean harnesses skip checkpoints and evals you will rebuild yourself.',
        'stars' => 12875,
        'featured' => false,
    ],
    [
        'title' => 'CoreBunch/Instatic',
        'url' => 'https://github.com/CoreBunch/Instatic',
        'description' => 'Instatic — open-source alternative to Webflow, Framer and WordPress. Agentic self-hosted visual CMS outputting clean static pages: users, roles, plugins, content, database. TS, +2.8k week (6.4k stars).',
        'category' => 'Automation',
        'tags' => ['cms','static-sites','self-hosted','visual-builder'],
        'why_great' => 'I ship SME brochure sites from Junagadh at Rs 55-85K where clients then pay WordPress plugin ransom forever. An agentic visual CMS emitting clean static pages with users plus roles plus content built in is the handover shape my care plans want — 60ms TTFB cached, nothing to patch at 2am. I would trial it for brochure-only clients while Laravel keeps money logic.',
        'when_not' => 'When the site takes payments or GST logic — static CMS owns pages, Laravel owns transactions; never merge them.',
        'stars' => 6471,
        'featured' => false,
    ],
    [
        'title' => 'aipoch/open-science',
        'url' => 'https://github.com/aipoch/open-science',
        'description' => 'Open Science — open-source, local-first, model-agnostic AI research workbench for macOS, Windows, Linux. Scientific agents, Python/R notebooks, data connectors, reproducible provenance. TS (3.8k stars).',
        'category' => 'RAG & Vector Search',
        'tags' => ['research','notebooks','provenance','local-first'],
        'why_great' => 'I run RAG for client docs where plain vector search misses multi-hop answers, and provenance is the gap — which notebook cell plus which source produced this claim. Open-science wiring agents to Python/R notebooks with reproducible trails is the audit shape my 90-day ledger demands. I would trial it for Kimi-class research runs before trusting outputs in client reports.',
        'when_not' => 'When you need managed scale — local-first workbenches serve researchers, not production API traffic.',
        'stars' => 3834,
        'featured' => false,
    ],
];

$startOrder = (int) CuratedRepo::max('sort_order') + 1;
echo "Current max sort_order: $startOrder, DB count before: ".CuratedRepo::count()."\n";

$pushed = 0;
foreach ($batch13 as $i => $repo) {
    $repo['sort_order'] = $startOrder + $i;
    $existing = CuratedRepo::where('url', $repo['url'])->first();
    if ($existing) {
        echo "SKIP duplicate: {$repo['title']}\n";
        continue;
    }
    $created = CuratedRepo::create($repo);
    echo "PUSHED: {$created->title} | {$created->stars} stars | sort_order {$created->sort_order}\n";
    $pushed++;
}

echo "DB count after: ".CuratedRepo::count()."\n";

$memoryFile = __DIR__ . '/../memory.md';
$today = date('Y-m-d');
$append = "\n## Curated Repositories — Batch 13 (10 New, Trending Sep 17-19 2026 — LIVE sync via opensource-library)\n\n";
foreach ($batch13 as $idx => $r) {
    $n = 174 + $idx;
    $append .= $n.". `{$r['title']}` — {$r['category']} — {$r['stars']} stars — Trending Sep 17-19 2026 ({$r['description']})\n";
}
$append .= "\nPublished: $today via opensource-library skill, live at https://deepakbagada.in/repos — DB now ".CuratedRepo::count()." repos (173→".CuratedRepo::count().") — verified via CuratedRepo::count()\n";
file_put_contents($memoryFile, $append, FILE_APPEND);
echo "✓ memory.md appended batch 13 — pushed $pushed repos\n";
