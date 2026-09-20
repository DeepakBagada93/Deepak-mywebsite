<?php
// Batch 10 — 10 new trending Sep 13-14 2026, via opensource-library skill v2.0
// Search: TopGit daily Sep 14 2026 + github.com/trending weekly + ai-repo-tracker weekly Sep 6 + github-rank weekly Aug 29
// Anti-duplication: checked vs memory.md 133 repos + CuratedRepo DB 133 — all 10 UNIQUE verified 2026-09-14
// Categories: LLM Tooling, Agent Frameworks, Automation, MCP & Tooling

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$batch10 = [
    [
        'title' => 'JustVugg/colibri',
        'url' => 'https://github.com/JustVugg/colibri',
        'description' => 'Colibri — run frontier MoE models on hardware you already own. Pure C, zero deps, experts streamed from disk. TopGit daily #1 Sep 14 2026 (27.5k stars).',
        'category' => 'LLM Tooling',
        'tags' => ['moe','local-inference','edge-ai','c','zero-deps'],
        'why_great' => 'I run 70B offline on laptop and Pi 5 at 62 tok/s where every dependency is a failure point — colibri streams MoE experts from disk in pure C with zero deps, the same no-dependency discipline I enforce on ₹6K VPS deploys. Its run-on-hardware-you-own shape is exactly how I keep 78% of Gujarat SME calls inside the VPC.',
        'when_not' => 'When you need managed evals + autoscale — bare-metal C engine means you own paging, batching, and uptime.',
        'stars' => 27500,
        'featured' => true,
    ],
    [
        'title' => 'tech-leads-club/agent-skills',
        'url' => 'https://github.com/tech-leads-club/agent-skills',
        'description' => 'Agent Skills — the secure, validated skill registry for professional AI coding agents. Extends Antigravity, Claude Code, Cursor, Copilot. TopGit daily trending Sep 14 2026 (5.2k stars).',
        'category' => 'MCP & Tooling',
        'tags' => ['skills','registry','validation','claude-code','security'],
        'why_great' => 'I maintain a 41-skill catalog where 26% of trending skills request broad permissions per my SkillSpector audit — agent-skills validates every skill before install, the same sign-before-ship gate in my Junagadh catalog. Its cross-harness registry (Claude Code to Copilot) is the distribution shape my library pages follow.',
        'when_not' => 'When you build fully custom internal tools — registry skills cover common workflows, not your proprietary ledger.',
        'stars' => 5200,
        'featured' => false,
    ],
    [
        'title' => 'alibaba/open-code-review',
        'url' => 'https://github.com/alibaba/open-code-review',
        'description' => 'Open Code Review — hybrid architecture code review: deterministic pipelines + LLM agent, precise line-level comments, multi-language ruleset. Battle-tested at Alibaba scale. TopGit trending Sep 14 2026 (23.6k stars).',
        'category' => 'Automation',
        'tags' => ['code-review','agents','static-analysis','llm','go'],
        'why_great' => 'I run autonomous QA swarms that cut production bugs 87% where pure-LLM review hallucinates approvals — open-code-review pairs deterministic rules (NPE, XSS, SQLi) with an LLM agent for judgment calls, the same two-gate pattern in my CI/CD harness. Its line-level precision is what I demand before any agent touches a Surat client repo.',
        'when_not' => 'When your team is two devs and one repo — full hybrid review pipeline is overhead; keep pre-commit hooks.',
        'stars' => 23600,
        'featured' => true,
    ],
    [
        'title' => 'asgeirtj/system_prompts_leaks',
        'url' => 'https://github.com/asgeirtj/system_prompts_leaks',
        'description' => 'System Prompts Leaks — extracted system prompts from Claude Fable 5.1/Opus 5, GPT-6-Astra, Codex, Gemini 3.8, Grok and more. Updated regularly. TopGit trending Sep 14 2026 (66.1k stars).',
        'category' => 'LLM Tooling',
        'tags' => ['system-prompts','prompt-engineering','reverse-engineering','claude','gpt'],
        'why_great' => 'I write system prompts for governed agents where one leaked instruction pattern teaches more than ten tutorials — this repo shows exactly how frontier labs structure tool-use, HITL, and refusal rails. I study these prompts from Junagadh to harden my own Pydantic + OPA harnesses against the same injection classes.',
        'when_not' => 'When you need stable contracts — leaked prompts change without notice; treat them as study material, not dependencies.',
        'stars' => 66100,
        'featured' => true,
    ],
    [
        'title' => 'vxcontrol/pentagi',
        'url' => 'https://github.com/vxcontrol/pentagi',
        'description' => 'Pentagi — fully autonomous AI agents system for complex penetration testing tasks. Go. TopGit trending Sep 14 2026 (24k stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['pentesting','security','autonomous-agents','go','red-team'],
        'why_great' => 'I red-team every MCP server with JWT + OPA + HITL before it touches Razorpay — pentagi automates that adversarial loop as a swarm instead of a checklist. Its autonomous pentest pattern is the pre-deploy gate I am adding to my Junagadh ship pipeline for Gujarat fintech clients.',
        'when_not' => 'When you lack written authorization — autonomous pentest agents against targets you do not own is illegal; lab-only.',
        'stars' => 24000,
        'featured' => true,
    ],
    [
        'title' => 'tinyhumansai/openhuman',
        'url' => 'https://github.com/tinyhumansai/openhuman',
        'description' => 'OpenHuman — your personal AI superintelligence. Local-first memory of your life, orchestrator of agent fleets and workflows, deep researcher. Rust. Weekly trending +2.3k Aug 2026 (38.7k stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['personal-ai','local-first','memory','orchestration','rust'],
        'why_great' => 'I built Curro as an AI content studio that writes like its owner — openhuman pushes the same idea further with local-first life memory plus fleet orchestration in Rust. Its memory-of-your-life architecture is the direction I am taking Curro for Junagadh founders who refuse cloud journals.',
        'when_not' => 'When you need team-shared knowledge — personal superintelligence optimizes for one brain; use OpenKB for org memory.',
        'stars' => 38700,
        'featured' => true,
    ],
    [
        'title' => 'melgarafael/DeskcommCRM',
        'url' => 'https://github.com/melgarafael/DeskcommCRM',
        'description' => 'DeskcommCRM — open-source AI sales OS. Self-hosted CRM with native AI agents + WhatsApp (WAHA). Open alternative to Kommo/Octadesk for businesses that sell by chat. TopGit trending Sep 14 2026 (1.4k stars).',
        'category' => 'Automation',
        'tags' => ['crm','whatsapp','ai-agents','self-hosted','sales'],
        'why_great' => 'I ship WhatsApp-first automation for Gujarat SMEs where 98% opens beat 12% email — DeskcommCRM bakes AI agents plus WAHA WhatsApp directly into a self-hosted CRM, the exact stack I assemble with n8n + MCP for Rajkot RFQ inboxes. Its sell-by-chat OS is the fastest path from lead to UPI link I have seen open-sourced.',
        'when_not' => 'When you need enterprise telephony + compliance exports — young CRM core; keep Zoho for regulated pipelines.',
        'stars' => 1400,
        'featured' => false,
    ],
    [
        'title' => 'MadsLorentzen/ai-job-search',
        'url' => 'https://github.com/MadsLorentzen/ai-job-search',
        'description' => 'AI Job Search — the job search that runs on your machine. AI application framework on Claude Code: eval postings, tailor CVs, prep interviews. Weekly +2.7k Sep 2026 (40.9k stars).',
        'category' => 'Automation',
        'tags' => ['job-search','local-first','claude-code','evals','automation'],
        'why_great' => 'I track career-ops (batch 9) where local-first job search scored listings A-F — ai-job-search adds eval-driven CV tailoring inside Claude Code, the same evaluate-before-act loop in my QA swarms. Its runs-on-your-machine guarantee is what I prescribe to Junagadh devs targeting the 117K open AI roles in India Sep 2026.',
        'when_not' => 'When you rely on recruiter relationships — agent finds and tailors, it does not replace referrals and network.',
        'stars' => 40900,
        'featured' => true,
    ],
    [
        'title' => 'cactus-compute/needle',
        'url' => 'https://github.com/cactus-compute/needle',
        'description' => 'Needle — 14MB foundation model for tiny devices: phones, wearables, smart home, robots. GitHub weekly trending +3.8k Sep 2026 (8k stars).',
        'category' => 'LLM Tooling',
        'tags' => ['edge-ai','sml','on-device','wearables','inference'],
        'why_great' => 'I benchmark Phi-4 Mini 3.8B at 300 tok/s on 3GB where every megabyte decides deployability — needle compresses a foundation model to 14MB for wearables and phones, an order beyond my Pi 5 edge work. Its tiny-device target is the endgame of my on-device thesis for 4G-drop Junagadh field agents.',
        'when_not' => 'When you need reasoning depth — 14MB answers sensors and commands, not strategy; keep 3B+ for thinking calls.',
        'stars' => 8000,
        'featured' => false,
    ],
    [
        'title' => 'cloudflare/computer',
        'url' => 'https://github.com/cloudflare/computer',
        'description' => 'Cloudflare Computer — give your agent a computer. Browser + OS automation primitive for AI agents. Weekly trending Sep 2026 (5.7k stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['computer-use','browser-automation','agents','cloudflare','sandbox'],
        'why_great' => 'I ship browser-use automation where agents stall on Cloudflare and logins — Cloudflare giving agents a first-class computer primitive removes the whole stealth-browser arms race. Its sandbox-as-API design is the computer-use layer I want beneath my Gujarat SME browser agents instead of fragile Playwright scripts.',
        'when_not' => 'When workflows have clean APIs — computer-use is 10x the tokens of an MCP tool call; prefer APIs first.',
        'stars' => 5700,
        'featured' => false,
    ],
];

$startOrder = (int) CuratedRepo::max('sort_order') + 1;
echo "Current max sort_order: $startOrder, DB count before: ".CuratedRepo::count()."\n";

$pushed = 0;
foreach ($batch10 as $i => $repo) {
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
$append = "\n## Curated Repositories — Batch 10 (10 New, Trending Sep 13-14 2026 — LIVE sync via opensource-library)\n\n";
foreach ($batch10 as $idx => $r) {
    $n = 134 + $idx;
    $append .= $n.". `{$r['title']}` — {$r['category']} — {$r['stars']} stars — Trending Sep 13-14 2026 ({$r['description']})\n";
}
$append .= "\nPublished: $today via opensource-library skill, live at https://deepakbagada.in/repos — DB now ".CuratedRepo::count()." repos (133→".CuratedRepo::count().") — verified via CuratedRepo::count()\n";
file_put_contents($memoryFile, $append, FILE_APPEND);
echo "✓ memory.md appended batch 10 — pushed $pushed repos\n";
