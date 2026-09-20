<?php
// Batch 9 — 10 new trending Sep 9-13 2026, via opensource-library skill v2.0
// Search: GitHub Trending daily/weekly Sep 2026 + Trendshift weekly/monthly + awesome-model-routing Sep 5 + startupcorners Aug 8 digest
// Anti-duplication: checked vs memory.md 123 repos + CuratedRepo DB 123 — all 10 UNIQUE verified 2026-09-13
// Categories: Agent Frameworks, MCP & Tooling, RAG & Vector Search, Automation, LLM Tooling

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$batch9 = [
    [
        'title' => 'chopratejas/headroom',
        'url' => 'https://github.com/chopratejas/headroom',
        'description' => 'Headroom — compress tool outputs, logs, files and RAG chunks before they reach the LLM. 60-95% fewer tokens, same answers. Weekly #2 trending Sep 2026 (15.4k stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['context-compression','token-optimization','rag','claude-code'],
        'why_great' => 'I run Pydantic + OmniRoute pipelines where 22% thinking calls eat token budgets — headroom compresses tool output 60-95% before it hits the LLM, the same quota discipline I enforce from Junagadh on Pi 5 62 tok/s. Its compress-before-LLM rail is the pre-filter I bolt in front of my 90-day OTel ledger.',
        'when_not' => 'When you need byte-exact logs for audit — compression trades fidelity for tokens; keep raw spans in Tempo.',
        'stars' => 15400,
        'featured' => true,
    ],
    [
        'title' => 'DeusData/codebase-memory-mcp',
        'url' => 'https://github.com/DeusData/codebase-memory-mcp',
        'description' => 'Codebase Memory MCP — high-performance code intelligence MCP server. Indexes codebases into persistent knowledge graph in milliseconds. 158 languages, sub-ms queries, 99% fewer tokens. Weekly #3 trending (6.3k stars).',
        'category' => 'MCP & Tooling',
        'tags' => ['mcp','code-intelligence','knowledge-graph','static-binary'],
        'why_great' => 'I serve Next.js + Laravel from one FastMCP gateway where codebase context costs 42 min of agent exploration — codebase-memory-mcp replaces that with a traced knowledge graph in milliseconds. Its single static binary with zero deps is the deploy shape I ship on ₹6K VPS.',
        'when_not' => 'When your repo is <1k LOC — plain file read beats graph indexing overhead.',
        'stars' => 6300,
        'featured' => true,
    ],
    [
        'title' => 'santifer/career-ops',
        'url' => 'https://github.com/santifer/career-ops',
        'description' => 'Career Ops — open-source AI job search: scan portals, score listings A-F rubric, tailor CV, track applications. Runs locally in Claude Code, Codex, OpenCode. Daily trending 816 stars today (66.6k total).',
        'category' => 'Automation',
        'tags' => ['job-search','local-first','claude-code','opencode'],
        'why_great' => 'I built Curro to write in my own voice — career-ops applies the same local-first agent harness to job search, scoring listings with a structured rubric instead of cloud SaaS. Its runs-in-your-CLI design is the pattern I recommend to Junagadh devs who distrust cloud resume tools.',
        'when_not' => 'When you need recruiter network effects — local agent finds listings, it does not replace referrals.',
        'stars' => 66689,
        'featured' => true,
    ],
    [
        'title' => 'volcengine/OpenViking',
        'url' => 'https://github.com/volcengine/OpenViking',
        'description' => 'OpenViking — self-evolving context database for AI agents. Unifies agent memory, knowledge RAG and skills in one store. Python, daily trending (31k stars).',
        'category' => 'RAG & Vector Search',
        'tags' => ['agent-memory','rag','skills','context-database'],
        'why_great' => 'I split memory (MemPalace), RAG (pgvector HNSW 42ms) and skills (catalog) across three systems — OpenViking unifies all three into one self-evolving store. Its memory+RAG+skills convergence is the architecture I am migrating my Junagadh ledger toward for Gujarat SME agents.',
        'when_not' => 'When you need proven pgvector semantics today — unified stores are young; keep HNSW as source of truth.',
        'stars' => 31000,
        'featured' => true,
    ],
    [
        'title' => 'langchain-ai/openwiki',
        'url' => 'https://github.com/langchain-ai/openwiki',
        'description' => 'OpenWiki — CLI from LangChain that writes and maintains agent-readable documentation for your codebase. Monthly trending +915 (12.9k stars).',
        'category' => 'LLM Tooling',
        'tags' => ['documentation','agents','cli','langchain'],
        'why_great' => 'I maintain 41 skills where docs rot kills agent accuracy — openwiki auto-generates AI-consumable docs so my MCP tools stay discoverable. Its agent-first docs format is what I enforce before any skill enters my Junagadh catalog.',
        'when_not' => 'When docs need human narrative — openwiki writes for agents, not readers; keep hand-written guides for clients.',
        'stars' => 12900,
        'featured' => false,
    ],
    [
        'title' => 'Zackriya-Solutions/meetily',
        'url' => 'https://github.com/Zackriya-Solutions/meetily',
        'description' => 'Meetily — privacy-first AI meeting assistant, 4x faster Parakeet/Whisper live transcription + speaker diarization + Ollama summaries. 100% local, Rust. Monthly trending +1.4k (13.3k stars).',
        'category' => 'Automation',
        'tags' => ['meeting-assistant','whisper','ollama','local-first','rust'],
        'why_great' => 'I run client calls where DPDP forbids cloud recording — meetily transcribes 4x faster locally with Ollama summaries, staying inside VPC. Its Rust + Parakeet stack is the in-VPC meeting layer I deploy for Rajkot/Surat SMEs.',
        'when_not' => 'When you need cloud collaboration features — local-first means no shared workspace; pair with CRM sync.',
        'stars' => 13300,
        'featured' => false,
    ],
    [
        'title' => 'iOfficeAI/OfficeCLI',
        'url' => 'https://github.com/iOfficeAI/OfficeCLI',
        'description' => 'OfficeCLI — first Office suite purpose-built for AI agents: read, edit, automate Word, Excel, PowerPoint. Free, single binary, no Office install. Monthly trending +816 (12.7k stars).',
        'category' => 'Automation',
        'tags' => ['office','word','excel','agents','mcp'],
        'why_great' => 'I automate Gujarat SME paperwork (GST sheets, RFQ docs) where agents choke on binary Office formats — OfficeCLI gives agents a single-binary Word/Excel/PPT interface with no Office license. Its agent-native document API is the missing tool in my n8n + MCP fan-out.',
        'when_not' => 'When you need pixel-perfect rendering — agent editing trades layout fidelity for automation; verify before client send.',
        'stars' => 12700,
        'featured' => false,
    ],
    [
        'title' => 'openai/codex-plugin-cc',
        'url' => 'https://github.com/openai/codex-plugin-cc',
        'description' => 'Codex Plugin CC — use Codex from Claude Code to review code or delegate tasks. Monthly trending +679 (7.9k stars).',
        'category' => 'Agent Frameworks',
        'tags' => ['codex','claude-code','delegation','review'],
        'why_great' => 'I run Claude Code + Codex + OpenCode harnesses where cross-harness delegation is manual — codex-plugin-cc lets Claude Code delegate review tasks to Codex natively. Its harness-bridge pattern is the interop layer my Junagadh multi-harness setup needed.',
        'when_not' => 'When you standardize on one harness — bridge plugins add latency; use native subagents instead.',
        'stars' => 7900,
        'featured' => false,
    ],
    [
        'title' => 'chaitanyagiri/munder-difflin',
        'url' => 'https://github.com/chaitanyagiri/munder-difflin',
        'description' => 'Munder Difflin — local multi-agent harness in TypeScript. Daily trending 507 stars today (3.1k total).',
        'category' => 'Agent Frameworks',
        'tags' => ['multi-agent','local','harness','typescript'],
        'why_great' => 'I test Google ADK vs LangGraph vs CrewAI for Gujarat subagents — munder-difflin is the local-first multi-agent harness that runs the same supervisor pattern without cloud lock-in. Its TS harness is the lightweight alternative I benchmark against ADK from Junagadh.',
        'when_not' => 'When you need enterprise eval + deploy — local harness prototypes fast but lacks Vertex/Cloud Run rails.',
        'stars' => 3133,
        'featured' => false,
    ],
    [
        'title' => 'agent-substrate/substrate',
        'url' => 'https://github.com/agent-substrate/substrate',
        'description' => 'Substrate — agent substrate core system in Go. Daily trending 252 stars today (1.4k total).',
        'category' => 'Agent Frameworks',
        'tags' => ['agent-runtime','go','substrate','core-system'],
        'why_great' => 'I gate every tool via OPA + HITL at the runtime layer — substrate builds that substrate as a Go core system instead of Python glue. Its systems-level agent runtime is the foundation pattern I study for Pi 5 edge agents at 62 tok/s.',
        'when_not' => 'When you ship Python-first — Go substrate needs cgo/FFI bridges; stay in Python unless latency demands it.',
        'stars' => 1397,
        'featured' => false,
    ],
];

$startOrder = (int) CuratedRepo::max('sort_order') + 1;
echo "Current max sort_order: $startOrder, DB count before: ".CuratedRepo::count()."\n";

$pushed = 0;
foreach ($batch9 as $i => $repo) {
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
$append = "\n## Curated Repositories — Batch 9 (10 New, Trending Sep 9-13 2026 — LIVE sync via opensource-library)\n\n";
foreach ($batch9 as $idx => $r) {
    $n = 124 + $idx;
    $append .= $n.". `{$r['title']}` — {$r['category']} — {$r['stars']} stars — Trending Sep 9-13 2026 ({$r['description']})\n";
}
$append .= "\nPublished: $today via opensource-library skill, live at https://deepakbagada.in/repos — DB now ".CuratedRepo::count()." repos (123→".CuratedRepo::count().") — verified via CuratedRepo::count()\n";
file_put_contents($memoryFile, $append, FILE_APPEND);
echo "✓ memory.md appended batch 9 — pushed $pushed repos\n";
