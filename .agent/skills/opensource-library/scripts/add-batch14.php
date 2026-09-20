<?php
// Batch 14 — 10 new trending Sep 17-19 2026, via opensource-library skill v4.0
// Search: GitHub Trending daily Sep 17-18 + wangchujiang weekly + github-trending.today + MCP Radar + Agent Skills Hub Sep 18
// Anti-duplication: checked vs memory.md 183 repos + CuratedRepo DB 183 — all 10 UNIQUE verified 2026-09-19
// Note: freestylefly/awesome-gpt-image-2 rejected by numeric-suffix ban (-2); replaced with 1Panel-dev/1Panel (verified via GitHub API)
// Categories: Agent Frameworks, RAG & Vector Search, Automation, LLM Tooling, Infrastructure, Content

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$batch14 = [
    [
        'title' => '1Panel-dev/1Panel',
        'url' => 'https://github.com/1Panel-dev/1Panel',
        'description' => '1Panel — modern open-source Linux server management panel and lightweight AI management platform. Go, 37k stars (verified via API Sep 19 2026).',
        'category' => 'Infrastructure',
        'tags' => ['server-panel','self-hosted','devops','ai-management'],
        'why_great' => 'I run client workloads on a Rs 6K VPS from Junagadh where every deploy is SSH plus memory. 1Panel giving that box a panel plus AI management without cloud rent is the ops layer my Gujarat SME fleet wants. I would trial it beside my current hardened Ubuntu image and keep whichever survives a monsoon patch cycle.',
        'when_not' => 'When you already run immutable infra-as-code — panels add mutable drift; keep Terraform where it works.',
        'stars' => 36975,
        'featured' => true,
    ],
    [
        'title' => 'shiyu-coder/Kronos',
        'url' => 'https://github.com/shiyu-coder/Kronos',
        'description' => 'Kronos — foundation model for the language of financial markets. Python, 34.8k stars, +2.5k week Sep 18 2026.',
        'category' => 'LLM Tooling',
        'tags' => ['finance','foundation-model','forecasting','python'],
        'why_great' => 'I ran paper-trading research summaries for a Surat client with TradingAgents capped at end-of-day reports. Kronos as a market-native foundation model is the forecasting backbone I would eval next for that desk — language of markets instead of general chat bolted onto prices. I would keep it read-only research, never live execution, same gate as before.',
        'when_not' => 'When anyone suggests live trading — research models inform analysts; order buttons stay human.',
        'stars' => 34847,
        'featured' => true,
    ],
    [
        'title' => 'AprilNEA/OpenLogi',
        'url' => 'https://github.com/AprilNEA/OpenLogi',
        'description' => 'OpenLogi — native, local-first alternative stack. Rust, 18.2k stars, +2.5k week Sep 18 2026.',
        'category' => 'Infrastructure',
        'tags' => ['local-first','rust','self-hosted','alternative-stack'],
        'why_great' => 'I prefer local-first for Gujarat client demos on patchy 4G, and my Pi 5 harness at 62 tok/s proves small plus local wins attention. OpenLogi packaging that philosophy natively in Rust is the install shape I would hand a Rajkot engineering client tired of cloud bills. I would benchmark it against my VPS parity rig before recommending the switch.',
        'when_not' => 'When the team needs managed collaboration — local-first serves owners, not fifty-seat shared workspaces.',
        'stars' => 18209,
        'featured' => false,
    ],
    [
        'title' => 'ConardLi/garden-skills',
        'url' => 'https://github.com/ConardLi/garden-skills',
        'description' => 'Garden Skills — open-source skills collection: web design, knowledge retrieval, image generation and more. 12.5k stars (verified via API Sep 19 2026).',
        'category' => 'Agent Frameworks',
        'tags' => ['skills','web-design','retrieval','image-generation'],
        'why_great' => 'I maintain a 41-skill Junagadh catalog where each entry earns its place through client revenue. Garden-skills spanning design plus retrieval plus image generation is the cross-domain shelf I would audit skill by skill — keep the retrieval entries that beat my pgvector 42ms baseline, drop the rest. I install with tight approvals after the broad-permission audit, same gate as every skill.',
        'when_not' => 'When you need depth in one domain — collections sample widely; specialists like code-review-graph win their lane.',
        'stars' => 12515,
        'featured' => false,
    ],
    [
        'title' => 'OpenWhispr/openwhispr',
        'url' => 'https://github.com/OpenWhispr/openwhispr',
        'description' => 'OpenWhispr — voice-to-text dictation app with local Parakeet/Whisper plus cloud BYOK. Privacy-first, cross-platform. JS, 7.3k stars.',
        'category' => 'Automation',
        'tags' => ['voice','dictation','whisper','local-first','privacy'],
        'why_great' => 'I run client calls where DPDP forbids cloud recording, and meetily already covers meetings locally. OpenWhispr adding everyday dictation with local models plus BYOK fallback is the desk companion I would give founders who think faster than they type. I would keep it on-device only for clientnamed work and log consent the same way as voice notes.',
        'when_not' => 'When you need diarized multi-speaker meetings — dictation serves one voice; meetily owns the room.',
        'stars' => 7315,
        'featured' => false,
    ],
    [
        'title' => 'cursor/plugins',
        'url' => 'https://github.com/cursor/plugins',
        'description' => 'Cursor plugins — official plugin specification plus plugins. TS, 6.3k stars, +1.4k week Sep 18 2026.',
        'category' => 'Agent Frameworks',
        'tags' => ['cursor','plugins','spec','ide'],
        'why_great' => 'I wire Cursor seats for Gujarat SME pilots where repeatable deploys beat hand-rolled prompts. The official plugin spec is what I would pin every Cursor setup to — read the spec, ship one verified plugin per seat, refuse the rest. I test new entries against my Rs 6K VPS harness before they touch client repos.',
        'when_not' => 'When the team standardizes on Claude Code or OpenCode — plugin ecosystems do not travel; pick one harness per team.',
        'stars' => 6396,
        'featured' => false,
    ],
    [
        'title' => 'likec4/likec4',
        'url' => 'https://github.com/likec4/likec4',
        'description' => 'LikeC4 — architecture diagrams as code. TS, 5.2k stars, +1.2k week Sep 18 2026.',
        'category' => 'Content',
        'tags' => ['diagrams','architecture-as-code','documentation','typescript'],
        'why_great' => 'I publish architecture blueprints where Mermaid slop embarrasses the engineering. LikeC4 doing diagrams as reviewable code sits exactly between my hand-drawn SVGs and generated galleries — diffable, versioned, honest. I would trial it for the next three blueprint pages and keep whichever renders cleaner at mobile widths.',
        'when_not' => 'When diagrams need motion or narrative — code diagrams document structure; video still owns the story.',
        'stars' => 5239,
        'featured' => false,
    ],
    [
        'title' => 'asciimoo/hister',
        'url' => 'https://github.com/asciimoo/hister',
        'description' => 'Hister — your own search engine. Go, 3.4k stars, trending Sep 18 2026.',
        'category' => 'RAG & Vector Search',
        'tags' => ['search-engine','self-hosted','go','privacy'],
        'why_great' => 'I self-host SearXNG so client queries never leak, and hister as a personal engine in Go is the lighter sibling I would test for single-seat research. One binary, own index, zero third parties — the shape my DPDP-sensitive briefs want. I would run it beside SearXNG for a month and keep the one with better Gujarati recall.',
        'when_not' => 'When you need web-scale coverage — personal engines index what you feed them; Google still owns the open web.',
        'stars' => 3459,
        'featured' => false,
    ],
    [
        'title' => 'agegr/pi-web',
        'url' => 'https://github.com/agegr/pi-web',
        'description' => 'Pi-Web — web UI for the pi coding agent. TS, 3.1k stars, +1.4k week Sep 18 2026.',
        'category' => 'Automation',
        'tags' => ['web-ui','pi-agent','coding-agent','typescript'],
        'why_great' => 'I run pi-family harnesses where TUI-only keeps non-technical co-founders locked out. Pi-web putting the pi agent behind a browser UI is the delegation surface my Rajkot clients could actually tap — approve, steer, watch. I would trial it on staging with the same HITL queue as my terminal runs before any owner touches it.',
        'when_not' => 'When operators live in terminals — web UIs add attack surface; TUI stays for engineers.',
        'stars' => 3126,
        'featured' => false,
    ],
    [
        'title' => 'humanlayer/skills',
        'url' => 'https://github.com/humanlayer/skills',
        'description' => 'HumanLayer skills — approval workflows for AI agents. TS, 3.1k stars, trending Sep 2026.',
        'category' => 'Agent Frameworks',
        'tags' => ['hitl','approvals','human-in-the-loop','agents'],
        'why_great' => 'I gate every money action behind a two-tap owner queue in Junagadh — the deny-by-default pattern that closes deals. HumanLayer productizing that exact approval layer as skills is the upstream I would track closest; if their contact-grant flow beats my n8n wait-node, I adopt it. My staging once fired duplicate reversals without a gate — never again, any vendor.',
        'when_not' => 'When flows are read-only — approvals tax every action; caps plus ledger suffice for lookups.',
        'stars' => 3113,
        'featured' => false,
    ],
];

$startOrder = (int) CuratedRepo::max('sort_order') + 1;
echo "Current max sort_order: $startOrder, DB count before: ".CuratedRepo::count()."\n";

$pushed = 0;
foreach ($batch14 as $i => $repo) {
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
$append = "\n## Curated Repositories — Batch 14 (10 New, Trending Sep 17-19 2026 — LIVE sync via opensource-library)\n\n";
foreach ($batch14 as $idx => $r) {
    $n = 184 + $idx;
    $append .= $n.". `{$r['title']}` — {$r['category']} — {$r['stars']} stars — Trending Sep 17-19 2026 ({$r['description']})\n";
}
$append .= "\nPublished: $today via opensource-library skill, live at https://deepakbagada.in/repos — DB now ".CuratedRepo::count()." repos (183→".CuratedRepo::count().") — verified via CuratedRepo::count()\n";
file_put_contents($memoryFile, $append, FILE_APPEND);
echo "✓ memory.md appended batch 14 — pushed $pushed repos\n";
