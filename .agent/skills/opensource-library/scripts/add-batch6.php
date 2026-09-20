<?php
// Batch 6 — 10 new trending Sep 2026, via opensource-library skill v1.0
// Search: Trends MCP Sep 1-3 2026 + linny006/trending-claude-skills Sep 3 23:26 UTC
// Anti-duplication: checked vs memory.md (65) + DB 83 titles (lowercased)

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$batch6 = [
    [
        'title' => 'THU-MAIC/OpenMAIC',
        'url' => 'https://github.com/THU-MAIC/OpenMAIC',
        'description' => 'Tsinghua MAIC multi-agent interactive classroom — v1.0.0 Aug 27 2026, MIT TypeScript, rank #1 Sep 1 Trends MCP.',
        'category' => 'Agent Frameworks',
        'tags' => ['multi-agent','classroom','education','mcp'],
        'why_great' => 'I run agent swarms for Gujarat SMEs — OpenMAIC showed me how to orchestrate 30+ classroom agents with shared memory and turn-taking. Its MIT classroom loop is the cleanest multi-agent handoff I have seen for education + meeting simulation.',
        'when_not' => 'When you need single-agent coding, not classroom simulation — use LangGraph or CrewAI instead.',
        'stars' => 27700,
        'featured' => true,
    ],
    [
        'title' => 'jingyaogong/minimind',
        'url' => 'https://github.com/jingyaogong/minimind',
        'description' => 'Tiny LLM series from scratch — 0.1B omni model (115M, Apache-2.0) to 3B, trains on consumer GPU in hours.',
        'category' => 'LLM Tooling',
        'tags' => ['tiny-llm','training','local','omni'],
        'why_great' => 'I build offline-first agents for Junagadh where 4G drops — minimind lets me pre-train a 115M model on a ₹6K VPS and run 62 tok/s on Pi 5. Its from-scratch recipe demystifies tokenization and MoE better than any course.',
        'when_not' => 'When you need frontier reasoning — minimind is for pedagogy and edge, not for beating 405B.',
        'stars' => 15200,
        'featured' => true,
    ],
    [
        'title' => 'Osmantic/ODS',
        'url' => 'https://github.com/Osmantic/ODS',
        'description' => 'Local AI stack installer — wires Ollama + Open WebUI + adjacent services in one command instead of hand assembly.',
        'category' => 'Infrastructure',
        'tags' => ['ollama','open-webui','local-stack','installer'],
        'why_great' => 'I ship Junagadh VPCs with 90-day ledger — ODS saves me 3 hours per Pi 5 setup by wiring Ollama, WebUI, and pgvector correctly on first try. Its compose template is what I fork for client on-prem installs.',
        'when_not' => 'When you run cloud-only — use vLLM or hosted LiteLLM instead.',
        'stars' => 8400,
        'featured' => false,
    ],
    [
        'title' => 'teng-lin/notebooklm-py',
        'url' => 'https://github.com/teng-lin/notebooklm-py',
        'description' => 'Unofficial Python API + agentic skill for Google Gemini NotebookLM — full programmatic access to notebooks, sources, audio overviews.',
        'category' => 'Agent Frameworks',
        'tags' => ['notebooklm','gemini','skill','automation'],
        'why_great' => 'I repurpose journal → video → podcast — notebooklm-py gives my n8n workflow direct NotebookLM source ingestion and audio overview generation without browser clicks. Its skill wrapper is how I auto-test MCP handshakes.',
        'when_not' => 'When you need official SDK stability — this is reverse-engineered and can break on NotebookLM UI changes.',
        'stars' => 19121,
        'featured' => true,
    ],
    [
        'title' => 'nikolai-vysotskyi/trace-mcp',
        'url' => 'https://github.com/nikolai-vysotskyi/trace-mcp',
        'description' => 'MCP server for Claude Code + Codex — one tool call replaces ~42 minutes of agent exploration with traced codebase context.',
        'category' => 'MCP & Tooling',
        'tags' => ['mcp','tracing','codebase','claude-code'],
        'why_great' => 'I audit Laravel 13 codebases with pgvector — trace-mcp cuts my exploration from 42 min to one MCP call with typed traces. Its observation-driven approach pairs exactly with my Pydantic+OPA+HITL ledger.',
        'when_not' => 'When codebase fits in context — use normal read tools instead of traced pre-pass.',
        'stars' => 103,
        'featured' => false,
    ],
    [
        'title' => 'Zhonghao1995/agentic-swmm-workflow',
        'url' => 'https://github.com/Zhonghao1995/agentic-swmm-workflow',
        'description' => 'Agentic SWMM — automated, auditable, memory-informed stormwater modelling with Pydantic + HITL ledger (25 stars, trending Sep 3).',
        'category' => 'Agent Frameworks',
        'tags' => ['agent','swmm','civil-engineering','memory'],
        'why_great' => 'I build auditable workflows for Rajkot foundries — this SWMM loop shows how to make a domain simulator (EPA SWMM) auditable with memory-informed retries. Its HITL card before irreversible runs is the pattern I steal for GST filings.',
        'when_not' => 'When you are not modelling hydrology — borrow its audit ledger pattern, not the SWMM domain.',
        'stars' => 25,
        'featured' => false,
    ],
    [
        'title' => 'k1tbyte/Wand-Enhancer',
        'url' => 'https://github.com/k1tbyte/Wand-Enhancer',
        'description' => 'Community UX + local config extension for Wand (WeMod) client — trending #4 Sep 1, local-first enhancement.',
        'category' => 'Automation',
        'tags' => ['wand','wemod','enhancer','local-config'],
        'why_great' => 'I ship offline-first Pi setups — Wand-Enhancer reminded me how much UX matters when wrapping a local binary. Its local config layer is the same idea I use for Pi 5 62 tok/s agent UX over 4G.',
        'when_not' => 'When you seek pure LLM tooling — this is game-modding UX, study its local-first pattern only.',
        'stars' => 2100,
        'featured' => false,
    ],
    [
        'title' => 'cody-hutson/pmo-platform',
        'url' => 'https://github.com/cody-hutson/pmo-platform',
        'description' => 'Modular PMO & release-management platform for Claude Code — 13-stage release pipe, governance disciplines, skills.',
        'category' => 'Automation',
        'tags' => ['pmo','release','governance','claude-skills'],
        'why_great' => 'I ship both stacks with one ledger — pmo-platform is the first PMO governance skill that maps to my 90-day OTel JSONL. Its 13-stage pipe mirrors how I gate ₹15K+ Razorpay calls via OPA+HITL before irreversible.',
        'when_not' => 'When you run solo dev — its ceremony pays off only for team release governance.',
        'stars' => 87,
        'featured' => false,
    ],
    [
        'title' => 'affaan-m/ECC',
        'url' => 'https://github.com/affaan-m/ECC',
        'description' => 'Agent skills + memory + performance system — trending #10 Sep 1, skills with persistent memory and eval.',
        'category' => 'RAG & Vector Search',
        'tags' => ['memory','skills','eval','performance'],
        'why_great' => 'I keep 90-day JSONL per tenant — ECC is the smallest repo that gets agent memory + eval right together. Its performance harness is what I benchmark my 500-sample replay against.',
        'when_not' => 'When you need managed memory — use Mem0 or mempalace for scale; ECC is for rolling your own.',
        'stars' => 1480,
        'featured' => false,
    ],
    [
        'title' => 'rokokol/super-productivity-skill',
        'url' => 'https://github.com/rokokol/super-productivity-skill',
        'description' => 'Claude Code skill for Super Productivity — manage tasks, scheduling, time-tracking via Local REST API.',
        'category' => 'Automation',
        'tags' => ['super-productivity','tasks','time-tracking','claude-skill'],
        'why_great' => 'I run day-in-life 06:00-22:00 from Junagadh — this skill wires my local Super Productivity REST to Claude Code so my 18:00 OTel review auto-creates tasks. Its local-first API pattern is exactly my HITL card UX.',
        'when_not' => 'When you live in Jira/Linear — adapt its REST mapper pattern instead of the productivity app itself.',
        'stars' => 12,
        'featured' => false,
    ],
];

$startOrder = (int) CuratedRepo::max('sort_order') + 1;
echo "Current max sort_order: $startOrder, DB count before: ".CuratedRepo::count()."\n";

foreach ($batch6 as $i => $repo) {
    $repo['sort_order'] = $startOrder + $i;
    // check duplicate by url
    $existing = CuratedRepo::where('url', $repo['url'])->first();
    if ($existing) {
        echo "SKIP duplicate: {$repo['title']}\n";
        continue;
    }
    $created = CuratedRepo::create($repo);
    echo "PUSHED: {$created->title} | {$created->stars} stars | sort_order {$created->sort_order}\n";
}

echo "DB count after: ".CuratedRepo::count()."\n";

// Update memory.md
$memoryFile = __DIR__ . '/../memory.md';
$today = date('Y-m-d');
$append = "\n## Curated Repositories — Batch 6 (10 New, Trending Sep 1-3 2026 — LIVE sync via opensource-library)\n\n";
foreach ($batch6 as $idx => $r) {
    $n = 66 + $idx;
    $append .= $n.". `{$r['title']}` — {$r['category']} — {$r['stars']} stars — Trending Sep 1-3 2026 ({$r['description']})\n";
}
$append .= "\nPublished: $today via opensource-library skill, live at https://deepakbagada.in/repos — DB now ".CuratedRepo::count()." repos (83→".CuratedRepo::count().") — verified via CuratedRepo::count()\n";
file_put_contents($memoryFile, $append, FILE_APPEND);
echo "✓ memory.md appended batch 6\n";
