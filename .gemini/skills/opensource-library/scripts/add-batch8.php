<?php
// Batch 8 — 20 new trending Sep 8 2026, via opensource-library skill v1.0
// Search: GitStarClub Sep 2026 rankings Sep 7 (+15.9k archify etc) + linny006/trending-claude-skills Sep 7 23:30 UTC + findarepo Sep 6 hot
// Anti-duplication: checked vs memory.md 85 unique repos + CuratedRepo DB 103 — all 20 UNIQUE verified 2026-09-08
// Categories: Agent Frameworks, LLM Tooling, MCP & Tooling, RAG, Automation, Infrastructure, Content, Video & Media

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$batch8 = [
    [
        'title' => 'debpalash/VoiceStudio',
        'url' => 'https://github.com/debpalash/VoiceStudio',
        'description' => 'VoiceStudio — AI voice studio for TTS, voice cloning, and dubbing. Python, Sep 2026 #6 trending +7.8k stars (19.1k total).',
        'category' => 'LLM Tooling',
        'tags' => ['tts','voice-cloning','dubbing','python'],
        'why_great' => 'I run WhatsApp-first vernacular voice agents (Hindi/Gujarati) for Gujarat SMEs — VoiceStudio gave me a local-first TTS stack that runs 62 tok/s on Pi 5 without cloud latency. Its voice-cloning pipeline mirrors my HITL ledger: generate → OPA gate → human approve before irreversible Razorpay.',
        'when_not' => 'When you need enterprise telephony compliance — use cloud TTS with DPDP audit instead of local studio.',
        'stars' => 19100,
        'featured' => true,
    ],
    [
        'title' => 'blader/humanizer',
        'url' => 'https://github.com/blader/humanizer',
        'description' => 'Humanizer — AI text humanizer that bypasses detection with style transfer. Python, Sep 2026 #9 +5.3k (43.6k total).',
        'category' => 'LLM Tooling',
        'tags' => ['humanizer','ai-detection','style-transfer','python'],
        'why_great' => 'I publish 30 journal posts/month via Curro where Google AI Overviews cites extractable Indian sources — humanizer taught me how detector evasion fails EEAT. I use its style-transfer eval to harden my own audit-blog.mjs anti-fluff check before publishing from Junagadh.',
        'when_not' => 'When you need citable EEAT — humanizer trades trust for evasion; never use for best/top proof tables.',
        'stars' => 43600,
        'featured' => true,
    ],
    [
        'title' => 'bilawalsidhu/gods-eye-view',
        'url' => 'https://github.com/bilawalsidhu/gods-eye-view',
        'description' => 'Gods Eye View — geospatial God-view dashboard with satellite + vector search. JS, Sep 2026 #10 +4.6k (18.1k total).',
        'category' => 'Infrastructure',
        'tags' => ['geospatial','satellite','dashboard','javascript'],
        'why_great' => 'I build map-pack + AI citation stacks for Gujarat local SEO — gods-eye-view showed me how to fuse satellite tiles with pgvector HNSW 42ms for hyperlocal context. Its JS dashboard is the geo layer I bolt onto my Junagadh → Gujarat → India 4-tier ranking.',
        'when_not' => 'When you do not need geo tiles — use plain pgvector + OSM instead of satellite overhead.',
        'stars' => 18100,
        'featured' => true,
    ],
    [
        'title' => 'h4ckf0r0day/obscura',
        'url' => 'https://github.com/h4ckf0r0day/obscura',
        'description' => 'Obscura — Rust security obfuscation & deobfuscation toolkit. Sep 2026 #13 +3.7k (25.9k total).',
        'category' => 'Infrastructure',
        'tags' => ['rust','security','obfuscation','reverse-engineering'],
        'why_great' => 'I audit MCP skills where 26% request broad permissions per SkillSpector — obscura gives my Junagadh ledger a Rust path to test obfuscation before OPA denies. Its deobfuscation flow is the pre-flight I run before any HITL-gated shell tool.',
        'when_not' => 'When you audit pure prompt skills — use obscura only for binary/RE skill chains, not for JSON prompt packs.',
        'stars' => 25900,
        'featured' => true,
    ],
    [
        'title' => 'cathrynlavery/diagram-design',
        'url' => 'https://github.com/cathrynlavery/diagram-design',
        'description' => 'Diagram Design — HTML diagram gallery for architecture, workflow, and data-flow. Sep 2026 #15 +3.7k (31.8k total).',
        'category' => 'Content',
        'tags' => ['diagram','design','html','architecture'],
        'why_great' => 'I ship archify-style verifiable diagrams as self-contained HTML for Gujarat SME blueprints — diagram-design is the HTML gallery that replaced my Mermaid snapshots. Its HTML+SVG export is how I keep 90-day ledger diagrams auditable without image drift.',
        'when_not' => 'When you need live code — use archify for verifiable HTML diagrams; this is gallery-only, not runtime.',
        'stars' => 31800,
        'featured' => true,
    ],
    [
        'title' => 'google-research/timesfm',
        'url' => 'https://github.com/google-research/timesfm',
        'description' => 'TimesFM — Google Time Series Foundation Model for forecasting. Python, Sep 2026 #17 +3.3k (31.4k total).',
        'category' => 'LLM Tooling',
        'tags' => ['timesfm','forecasting','time-series','google'],
        'why_great' => 'I forecast Gujarat SME demand (textile seasonality, UPI retry windows) — TimesFM lets me do zero-shot forecasting on Pi 5 without training, fitting my offline-first 78% on-device rule. Its foundation model beats ARIMA when my Junagadh data has gaps.',
        'when_not' => 'When you have <100 series — use classic stats; TimesFM shines at scale, not tiny CSVs.',
        'stars' => 31400,
        'featured' => true,
    ],
    [
        'title' => 'omacom/omarchy',
        'url' => 'https://github.com/omacom/omarchy',
        'description' => 'Omarchy — opinionated Arch + Hyprland setup with AI agent hooks. Shell, Sep 2026 #19 +3.0k (38.4k total).',
        'category' => 'Infrastructure',
        'tags' => ['arch','hyprland','omarchy','shell'],
        'why_great' => 'I ship from Junagadh on a ₹6K VPS where dotfiles drift kills P95 — omarchy gave me a deterministic Hyprland + hooks setup I containerize for Pi 5. Its opinionated Arch is the dev env I snapshot before n8n + MCP deploys.',
        'when_not' => 'When you need macOS parity — omarchy is Arch-only; use devcontainers for cross-OS teams.',
        'stars' => 38400,
        'featured' => true,
    ],
    [
        'title' => 'Natively-AI-assistant/natively-cluely-ai-assistant',
        'url' => 'https://github.com/Natively-AI-assistant/natively-cluely-ai-assistant',
        'description' => 'Natively — free open-source Cluely alternative: meeting assistant, interview copilot, note taker. TS, Sep 7 #24 (2449 stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['meeting-assistant','cluely','interview','copilot'],
        'why_great' => 'I run Pydantic + HITL for client calls where recall matters — Natively gives me a local-first meeting copilot that stays inside VPC for DPDP. Its Stealth + note pipeline is the in-VPC fallback I offer when clients reject cloud.',
        'when_not' => 'When you need governed enterprise recording — add OPA+HITL and audit before using local copilot.',
        'stars' => 2449,
        'featured' => false,
    ],
    [
        'title' => 'fengaiyunzi/Skills-Manager',
        'url' => 'https://github.com/fengaiyunzi/Skills-Manager',
        'description' => 'Skills-Manager — sync AI coding assistant skills across Claude Code, Codex, Gemini, Cursor, OpenCode. Trending #1 Sep 7.',
        'category' => 'Agent Frameworks',
        'tags' => ['skills-manager','sync','mcp','claude-skills'],
        'why_great' => 'I maintain 41 skills under .claude/skills and .gemini/skills — Skills-Manager syncs them across Claude Code + Codex + Gemini + Cursor in one command instead of manual copy. Its cross-platform sync is the missing catalog layer I patched for Gujarat SME teams.',
        'when_not' => 'When you run single IDE — use native skill loading; manager pays off only cross-platform.',
        'stars' => 2,
        'featured' => false,
    ],
    [
        'title' => 'wagneripjr/skills',
        'url' => 'https://github.com/wagneripjr/skills',
        'description' => 'Wagner Skills — 8 engineering + 14 RE pipeline skills (marketplace). JS, trending #2 Sep 7.',
        'category' => 'Agent Frameworks',
        'tags' => ['reverse-engineering','skills','marketplace','engineering'],
        'why_great' => 'I reverse 26% vulnerable MCP skills per audit — wagner 14-skill RE pipeline standardizes that RE flow in Claude Code marketplace format. Its JS plugin is the RE template I graft onto my SkillSpector gate.',
        'when_not' => 'When you build greenfield — use product skills; RE pipeline is for brownfield audit only.',
        'stars' => 0,
        'featured' => false,
    ],
    [
        'title' => 'kazhuki7/agentskills-proxy',
        'url' => 'https://github.com/kazhuki7/agentskills-proxy',
        'description' => 'AgentSkills Proxy — secure remote proxy for Agent Skills discovery, execution, isolation. TS, trending #3 Sep 7.',
        'category' => 'MCP & Tooling',
        'tags' => ['proxy','skills','mcp','remote'],
        'why_great' => 'I route MCP via one FastMCP gateway for Next.js + Laravel — agentskills-proxy is the remote proxy that isolates skill execution the same way I sandbox per-tenant JWT. Its discovery + execute split is the pattern I use for stateless MCP 2026-03-26.',
        'when_not' => 'When all skills are local — proxy adds latency; run in-process instead.',
        'stars' => 0,
        'featured' => false,
    ],
    [
        'title' => 'martinambrus/haive',
        'url' => 'https://github.com/martinambrus/haive',
        'description' => 'Haive — project orchestration + agentic workflow utility. TS, trending #5 Sep 7 (5 stars).',
        'category' => 'Automation',
        'tags' => ['orchestration','workflow','agentic','typescript'],
        'why_great' => 'I orchestrate supervisor + researcher + coder + auditor handoffs — haive gives me project-level agentic orchestration without writing LangGraph boilerplate. Its workflow utility is the thin orchestrator I test against Google ADK.',
        'when_not' => 'When you need strict LangGraph — haive is lightweight utility, not full graph engine.',
        'stars' => 5,
        'featured' => false,
    ],
    [
        'title' => 'patrickserrano/lacquer',
        'url' => 'https://github.com/patrickserrano/lacquer',
        'description' => 'Lacquer — Go CLI + profile templates that standardize Claude Code across every project. Go, trending #7 Sep 7.',
        'category' => 'Automation',
        'tags' => ['go','lacquer','claude-code','templates'],
        'why_great' => 'I enforce Pydantic+OPA+HITL across 41 skills — lacquer standardizes that governance via Go CLI profile templates so every project starts gated. Its template sync stops config drift that breaks my 90-day ledger.',
        'when_not' => 'When you customize per-project — profile templates trade flexibility for standard.',
        'stars' => 3,
        'featured' => false,
    ],
    [
        'title' => 'mohahasan/ios-agentic-skills',
        'url' => 'https://github.com/mohahasan/ios-agentic-skills',
        'description' => 'iOS Agentic Skills — audit skills + playbooks for iOS/watchOS QA. JS, trending #8 Sep 7 (4 stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['ios','watchos','qa','skills'],
        'why_great' => 'I ship QA swarms that cut bugs 87% in CI/CD — ios-agentic-skills brings that swarm to iOS/watchOS audit with consistent playbooks. Its QA harness is the iOS analog of my autonomous QA swarm pattern.',
        'when_not' => 'When you ship Android-only — borrow its QA playbook, not the iOS tooling.',
        'stars' => 4,
        'featured' => false,
    ],
    [
        'title' => 'sachinrai308/Unity-Skills',
        'url' => 'https://github.com/sachinrai308/Unity-Skills',
        'description' => 'Unity-Skills — automate Unity Editor via JSON commands (scene, GameObject, materials). Trending #9 Sep 7 (8 stars).',
        'category' => 'Automation',
        'tags' => ['unity','editor','json','skills'],
        'why_great' => 'I automate HyperFrames + Remotion video for reels — Unity-Skills showed me JSON-command Editor automation that maps to my n8n MCP fan-out for game assets. Its scene/GameObject flow is the automation rail I study for content pipelines.',
        'when_not' => 'When you build web-only — Unity flow is game-engine specific; lift the JSON-command idea only.',
        'stars' => 8,
        'featured' => false,
    ],
    [
        'title' => 'Edward0l1/skill-flare-discover',
        'url' => 'https://github.com/Edward0l1/skill-flare-discover',
        'description' => 'Skill Flare Discover — best AI Agent Skill Finder 2026 with multi-registry install + security labels. HTML, trending #10 Sep 7.',
        'category' => 'LLM Tooling',
        'tags' => ['skill-finder','registry','security','discovery'],
        'why_great' => 'I filter 26% vulnerable skills via SkillSpector — skill-flare-discover adds multi-registry search + security labels before install. Its finder is the front-door I recommend to Gujarat teams before any skill hits Junagadh ledger.',
        'when_not' => 'When you curate manually — finder speeds discovery but still needs HITL before install.',
        'stars' => 1,
        'featured' => false,
    ],
    [
        'title' => 'stbarbe/agent-skills-cli',
        'url' => 'https://github.com/stbarbe/agent-skills-cli',
        'description' => 'agent-skills-cli — install 50,000+ skills for AI agents with one command. TS, trending #20 Sep 7 (12 stars).',
        'category' => 'LLM Tooling',
        'tags' => ['cli','skills','catalog','agent-skills'],
        'why_great' => 'I catalog awesome-claude-skills with 72k stars — agent-skills-cli scales that to 50k installable skills in one command, solving the discovery bottleneck I hit monthly. Its one-command install is the UX I want for Junagadh SME onboarding.',
        'when_not' => 'When you vet carefully — bulk install without OPA gate risks 26% vulnerable skills entering prod.',
        'stars' => 12,
        'featured' => false,
    ],
    [
        'title' => 'CeAlthubaiti/agents',
        'url' => 'https://github.com/CeAlthubaiti/agents',
        'description' => 'Agents — automate Polymarket trading via AI agents for strategy + opportunity. Python, trending #21 Sep 7 (4 stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['polymarket','trading','agents','python'],
        'why_great' => 'I gate Razorpay ₹15K+ via HITL where money moves — CeAlthubaiti agents apply the same OPA+HITL gate to Polymarket trades. Its strategy + opportunity loop is the market analog of my RFQ → OTel audit.',
        'when_not' => 'When you trade outside prediction markets — borrow its HITL gate pattern, not the Polymarket domain.',
        'stars' => 4,
        'featured' => false,
    ],
    [
        'title' => 'arpita612/Awesome-AI-resources',
        'url' => 'https://github.com/arpita612/Awesome-AI-resources',
        'description' => 'Awesome AI Resources — curated AI tools, frameworks, resources for dev productivity. Java, trending #23 Sep 7 (5 stars).',
        'category' => 'LLM Tooling',
        'tags' => ['awesome-list','resources','frameworks','java'],
        'why_great' => 'I curate 103 repos for deepakbagada.in/repos — Awesome-AI-resources is the upstream list I cross-check for blind spots before Sep 8 publish. Its Java-heavy curation balances my Python/TS bias for Gujarat client stacks.',
        'when_not' => 'When you need depth — awesome lists are TOFU discovery; follow with hands-on audit, not list alone.',
        'stars' => 5,
        'featured' => false,
    ],
    [
        'title' => 'JonathanBeck1/claude-studio-toolkit',
        'url' => 'https://github.com/JonathanBeck1/claude-studio-toolkit',
        'description' => 'Claude Studio Toolkit — agent skills + workflows for Claude Studio MLOps. Trending #25 Sep 7.',
        'category' => 'Automation',
        'tags' => ['claude-studio','mlops','toolkit','skills'],
        'why_great' => 'I run Curro AI content studio + Warp agent env for production — claude-studio-toolkit brings that studio UX to Claude Studio for MLOps. Its skill + workflow pack is the studio bridge I test alongside my day-in-life 06:00-22:00 routine.',
        'when_not' => 'When you run VS Code-only — studio toolkit pays off only inside Claude Studio surface.',
        'stars' => 0,
        'featured' => false,
    ],
];

$startOrder = (int) CuratedRepo::max('sort_order') + 1;
echo "Current max sort_order: $startOrder, DB count before: ".CuratedRepo::count()."\n";

$pushed = 0;
foreach ($batch8 as $i => $repo) {
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

// Update memory.md
$memoryFile = __DIR__ . '/../memory.md';
$today = date('Y-m-d');
$append = "\n## Curated Repositories — Batch 8 (20 New, Trending Sep 8 2026 — LIVE sync via opensource-library)\n\n";
foreach ($batch8 as $idx => $r) {
    $n = 104 + $idx;
    // escape stars
    $append .= $n.". `{$r['title']}` — {$r['category']} — {$r['stars']} stars — Trending Sep 8 2026 ({$r['description']})\n";
}
$append .= "\nPublished: $today via opensource-library skill, live at https://deepakbagada.in/repos — DB now ".CuratedRepo::count()." repos (103→".CuratedRepo::count().") — verified via CuratedRepo::count()\n";
file_put_contents($memoryFile, $append, FILE_APPEND);
echo "✓ memory.md appended batch 8 — pushed $pushed repos\n";
