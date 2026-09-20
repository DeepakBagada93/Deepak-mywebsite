<?php
require __DIR__ . '/../../../../vendor/autoload.php';
$app = require __DIR__ . '/../../../../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\CuratedRepo;

$repos = [
  [
    'title' => 'zhaoxuya520/reverse-skill',
    'url' => 'https://github.com/zhaoxuya520/reverse-skill',
    'description' => 'AI skill-routing pack for reverse engineering, CTF and authorized pen-testing — routes to Claude Code, Cursor, Cline with shared skill context.',
    'category' => 'Agent Frameworks',
    'tags' => ['agent-skills', 'reverse-engineering', 'ctf', 'claude-code', 'security'],
    'why_great' => 'I use it to unify security tooling across agents — one skill pack replaces per-agent glue for RE, pentest and CTF; the routing + memory design is why it topped GitHub Trending Aug 1 over openwork and chatwoot.',
    'stars' => 8920,
    'featured' => true,
    'sort_order' => 66,
    'rating' => 4.6,
    'when_not' => 'Avoid on production customer data — it is built for authorized lab/CTF scopes, not for compliance-bound pen-tests without isolated VPC.',
  ],
  [
    'title' => 'different-ai/openwork',
    'url' => 'https://github.com/different-ai/openwork',
    'description' => 'Open-source desktop cowork for sharing AI workflows, skills and MCP connections across macOS, Windows, Linux — team skill sync.',
    'category' => 'Automation',
    'tags' => ['openwork', 'cowork', 'mcp', 'workflow-sharing', 'desktop'],
    'why_great' => 'My teams waste hours re-wiring MCP servers per laptop. Openwork solves that — sync workflows/skills in one desktop cowork, which is why it jumped #4→#2 on GitHub Trending Aug 1 alongside reverse-skill.',
    'stars' => 7450,
    'featured' => true,
    'sort_order' => 67,
    'rating' => 4.4,
    'when_not' => 'Skip if you need browser-only collaboration — Openwork is desktop-first and shines for local skill/MCP sharing, not pure cloud docs.',
  ],
  [
    'title' => 'msitarzewski/agency-agents',
    'url' => 'https://github.com/msitarzewski/agency-agents',
    'description' => 'Complete AI agency catalog of specialized agent personas for Claude Code, Cursor and Codex — frontend wizards, community managers, reality checkers.',
    'category' => 'Agent Frameworks',
    'tags' => ['agency-agents', 'personas', 'claude-code', 'cursor', 'team-of-agents'],
    'why_great' => 'I curate it over generic agent lists because it gives you a real org chart — frontend, community, reality-checker — each pre-prompted for Claude/Cursor/Codex. The 143k-star flip past semantica on Aug 12 proves the persona model stuck.',
    'stars' => 143953,
    'featured' => true,
    'sort_order' => 68,
    'rating' => 4.8,
    'when_not' => 'Not for single-agent loops — overhead is real until you actually run a team-of-agents with shared MCP state.',
  ],
  [
    'title' => 'semantica-agi/semantica',
    'url' => 'https://github.com/semantica-agi/semantica',
    'description' => 'Graph-native infrastructure for context and accountable AI — provenance-aware memory and routing for agent teams.',
    'category' => 'RAG & Vector Search',
    'tags' => ['graph-native', 'context', 'provenance', 'memory', 'semantica'],
    'why_great' => 'Most RAG is vector-only and forgets why an answer exists. Semantica adds graph-native provenance so an audit can trace context lineage — that is why it held #1 on Aug 11 before agency-agents reclaimed it.',
    'stars' => 5229,
    'featured' => false,
    'sort_order' => 69,
    'rating' => 4.3,
    'when_not' => 'Skip for tiny single-doc Q&A — graph provenance pays off at team scale and compliance audits, not at “answer this PDF”.',
  ],
  [
    'title' => 'addyosmani/agent-skills',
    'url' => 'https://github.com/addyosmani/agent-skills',
    'description' => 'Production-grade engineering skills pack installable into AI coding agents via skills CLI — battle-tested workflows.',
    'category' => 'Agent Frameworks',
    'tags' => ['agent-skills', 'skills-cli', 'engineering', 'workflows'],
    'why_great' => 'Unlike toy skill demos, Addy’s pack is production-grade — installable via skills CLI into Claude/Cursor with tests. That is why it held steady #4 on Aug 12 while paperclip and orca churned.',
    'stars' => 86386,
    'featured' => true,
    'sort_order' => 70,
    'rating' => 4.7,
    'when_not' => 'Not if you want pure prompt tricks — these are opinionated engineering workflows with guardrails, not one-liner hacks.',
  ],
  [
    'title' => 'vitali87/code-graph-rag',
    'url' => 'https://github.com/vitali87/code-graph-rag',
    'description' => 'Graph-based code RAG using Tree-sitter and Memgraph to query multi-language monorepos — structural code retrieval.',
    'category' => 'RAG & Vector Search',
    'tags' => ['code-rag', 'graph-rag', 'tree-sitter', 'memgraph', 'monorepo'],
    'why_great' => 'Code search that actually understands imports, call graphs and cross-file edges — Tree-sitter + Memgraph beats chunk-embedding alone for refactoring. The +7 rank rebound #13→#6 on Aug 12 tracks real dev pain.',
    'stars' => 3251,
    'featured' => false,
    'sort_order' => 71,
    'rating' => 4.5,
    'when_not' => 'Overkill for single-file scripts — gains show at multi-language monorepo scale where structure matters.',
  ],
  [
    'title' => 'github/copilot-sdk',
    'url' => 'https://github.com/github/copilot-sdk',
    'description' => 'GitHub Copilot SDK to embed Copilot agent workflows into apps across TypeScript, Python, Go, .NET and Java.',
    'category' => 'LLM Tooling',
    'tags' => ['copilot', 'sdk', 'agent-workflows', 'github'],
    'why_great' => 'Instead of copying agent prompts, you embed Copilot’s own agentic workflow SDK — April public preview kept it trending Aug 1 at #6 because it turns any app into a Copilot-native agent host.',
    'stars' => 21400,
    'featured' => true,
    'sort_order' => 72,
    'rating' => 4.6,
    'when_not' => 'Avoid if you require 100% open-weight inference — the SDK is Copilot-coupled and assumes GitHub-hosted model routing.',
  ],
  [
    'title' => 'harveyai/harvey-labs',
    'url' => 'https://github.com/harveyai/harvey-labs',
    'description' => 'Benchmark built to evaluate and improve agent capabilities for legal work — tasks, eval harness and grading.',
    'category' => 'Agent Frameworks',
    'tags' => ['benchmark', 'legal-ai', 'evals', 'harvey'],
    'why_great' => 'Legal is the hardest agent eval — Harvey Labs gives you real legal tasks + grading harness instead of toy MMLU. At ~1.1k stars it is early but the only domain-specific agent skill benchmark I trust.',
    'stars' => 1137,
    'featured' => false,
    'sort_order' => 73,
    'rating' => 4.2,
    'when_not' => 'Not for general coding evals — use SWE-bench; Harvey is narrowly tuned for legal reasoning and contract tasks.',
  ],
  [
    'title' => 'calesthio/OpenMontage',
    'url' => 'https://github.com/calesthio/OpenMontage',
    'description' => 'Open-source agentic video production system with 12 pipelines and 700+ agent skill files — plan → direct → generate.',
    'category' => 'Video & Media',
    'tags' => ['video', 'agentic-video', 'pipelines', 'skills', 'generation'],
    'why_great' => 'Video is moving from single-model prompts to 12-pipeline agent teams. OpenMontage packages 700+ skills so a “trailer” spins planner, director and renderer agents — the Aug 12 debut alongside orca makes it the team to watch.',
    'stars' => 4870,
    'featured' => true,
    'sort_order' => 74,
    'rating' => 4.5,
    'when_not' => 'Not for quick single-clip Veo calls — OpenMontage pays off for multi-scene, multi-role productions where single prompts fail.',
  ],
  [
    'title' => 'chatwoot/chatwoot',
    'url' => 'https://github.com/chatwoot/chatwoot',
    'description' => 'Open-source omnichannel customer support platform — self-hosted Intercom/Zendesk alternative for Gujarat SMEs.',
    'category' => 'Automation',
    'tags' => ['support', 'omnichannel', 'customer-success', 'self-hosted'],
    'why_great' => 'I pair Chatwoot with n8n + WhatsApp WABA for SME support automation at ₹27K/mo — full self-hosted control vs Intercom seat tax, which is why it re-trended #7 on Aug 1 amid agent-skill hype.',
    'stars' => 38500,
    'featured' => true,
    'sort_order' => 75,
    'rating' => 4.7,
    'when_not' => 'Skip if you need AI-agent-native inbox first — Chatwoot shines for human-led support with automation hooks, not fully autonomous swarms.',
  ],
];

foreach ($repos as $r) {
  // map rating/when_not into description? CuratedRepo table has no rating/when_not columns, fold into why_great + description
  $why = $r['why_great'] . " Rating: {$r['rating']}/5. When NOT to use: {$r['when_not']}";
  try {
    CuratedRepo::updateOrCreate(
      ['url' => $r['url']],
      [
        'title' => $r['title'],
        'description' => $r['description'],
        'category' => $r['category'],
        'tags' => $r['tags'],
        'why_great' => $why,
        'stars' => $r['stars'],
        'featured' => $r['featured'],
        'sort_order' => $r['sort_order'],
      ]
    );
    echo "✓ Synced {$r['title']} ({$r['stars']}★) — {$r['category']}\n";
  } catch (Exception $e) {
    echo "✗ Failed {$r['title']}: ".$e->getMessage()."\n";
  }
}
echo "Done. Total repos now: ".CuratedRepo::count()."\n";
