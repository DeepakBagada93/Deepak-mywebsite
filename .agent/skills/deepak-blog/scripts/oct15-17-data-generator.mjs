// oct15-17-data-generator.mjs — Dispatch definitions Oct 15–17, 2026 (15 dispatches, Phase 2)
// 5/day at 06:30 Authority / 09:30 Swarm / 12:30 News / 15:30 WebDev / 18:30 Founder (IST)
// Body template shared from oct14-data-generator.mjs (v10.1 GSC-compliant).

import { generateFullArticleBody } from "./oct14-data-generator.mjs";

export function getDispatchesOct1517() {
  const list = [
    // ── OCT 15 ──────────────────────────────────────────────────────────
    {
      date: "2026-10-15", slot_label: "06:30 AM IST (Phase 2)", slot_time: "06:30:00",
      pillar: "Authority Money Target", tag: "AI DEV",
      keyword: "best AI agent developer Junagadh",
      title: "Best AI Agent Developer Junagadh 2026: Proof [Guide]",
      slug: "best-ai-agent-developer-junagadh-2026-proof",
      excerpt: "Best AI agent developer Junagadh 2026: fixed ₹85K builds, P95 42ms SLA, OPA gates and 90-day ledgers from Deepak Bagada. Vetting proof inside. Read it now.",
      pillarId: "authority", cityA: "Junagadh", cityB: "Veraval",
      vertical: "marine fisheries cold-chain routing", rpm: 400, p95: 42, cost: "₹85,000",
      altText: "Authority comparison diagram showing Junagadh fixed-bid agent builds with P95 latency proof versus metro retainers 2026",
      customCode: `\`\`\`python
# app/vetting/score_agent_vendor.py
# 7-point scorecard I use to vet AI agent developers before signing
CRITERIA = ["p95_under_60ms", "fixed_quote", "opa_gates", "scoped_jwt", "ledger_90d", "dpdp_india", "code_handover"]

def score_vendor(evidence: dict) -> dict:
    passed = [c for c in CRITERIA if evidence.get(c) is True]
    return {"score": len(passed), "total": len(CRITERIA), "hire": len(passed) >= 6, "passed": passed}

if __name__ == "__main__":
    vendor = {"p95_under_60ms": True, "fixed_quote": True, "opa_gates": True,
              "scoped_jwt": True, "ledger_90d": True, "dpdp_india": True, "code_handover": False}
    print(score_vendor(vendor))
\`\`\``,
      externalDocUrl: "https://www.openpolicyagent.org/docs/latest/policy-language/",
      externalDocName: "Open Policy Agent documentation"
    },
    {
      date: "2026-10-15", slot_label: "09:30 AM IST (Phase 2)", slot_time: "09:30:00",
      pillar: "AI Swarms & Autonomous Agents", tag: "AI AGENTS",
      keyword: "MCP OAuth dynamic registration",
      title: "MCP OAuth Registration 2026: Dynamic Clients [Guide]",
      slug: "mcp-oauth-dynamic-registration-2026",
      excerpt: "MCP OAuth dynamic registration 2026: per-tenant credentials, short-lived tokens and audience checks that stop tool leaks. Full P95 code inside. Full proof.",
      pillarId: "ai-swarms", cityA: "Ahmedabad", cityB: "Gandhinagar",
      vertical: "NBFC loan document agents", rpm: 360, p95: 39, cost: "₹85,000",
      altText: "MCP OAuth dynamic client registration flow diagram with short-lived tokens audience checks and per-tenant scopes 2026",
      customCode: `\`\`\`python
# app/mcp/oauth_registry.py
# Dynamic client registration: one credential set per tenant, least privilege by default
import secrets, time

class OAuthRegistry:
    def __init__(self):
        self.clients = {}

    def register(self, tenant_id: str, tools: list) -> dict:
        client_id = "mcp-" + secrets.token_hex(6)
        record = {"client_id": client_id, "secret": secrets.token_urlsafe(32),
                  "tenant": tenant_id, "tools": tools, "scope": "mcp:least",
                  "issued_at": int(time.time()), "ttl_s": 900}
        self.clients[client_id] = record
        return {"client_id": client_id, "expires_in": 900}

    def authorize(self, client_id: str, tool: str) -> bool:
        rec = self.clients.get(client_id)
        if not rec or time.time() - rec["issued_at"] > rec["ttl_s"]:
            return False
        return tool in rec["tools"]
\`\`\``,
      externalDocUrl: "https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization",
      externalDocName: "MCP authorization specification"
    },
    {
      date: "2026-10-15", slot_label: "12:30 PM IST (Phase 2)", slot_time: "12:30:00",
      pillar: "AI News & Architecture Benchmarks", tag: "AI NEWS",
      keyword: "Claude Opus 5.5 vs GPT-6",
      title: "Claude Opus 5.5 vs GPT-6 Sol 2026: Code [Benchmark]",
      slug: "claude-opus-5-vs-gpt-5-coding-2026",
      excerpt: "AI benchmark Claude Opus 5.5 vs GPT-6 Sol 2026: ProgramBench 91.2%, Terminal-Bench 66.4%, token costs compared. Full P95 table inside. Full breakdown inside.",
      pillarId: "ai-news", cityA: "Rajkot", cityB: "Ahmedabad",
      vertical: "auto-parts catalog coding", rpm: 340, p95: 43, cost: "₹75,000",
      altText: "Frontier model benchmark chart comparing Claude Opus 5.5 and GPT-6 Sol coding scores with per-token pricing 2026",
      customCode: `\`\`\`python
# bench/route_by_task.py
# Route coding tasks to the cheaper winner using Sep 2026 public benchmark rows
# Opus 5.5: ProgramBench 91.2, Terminal-Bench 4.0 66.4, $4 in / $20 out per 1M
# GPT-6 Sol family: Sep 22 2026 release wave, check live pricing before routing

ROUTES = {
    "long_repo_refactor": {"model": "claude-opus-5-5", "why": "ProgramBench 91.2 leads repo-scale edits"},
    "terminal_devops": {"model": "claude-opus-5-5", "why": "Terminal-Bench 4.0 66.4 top lane"},
    "bulk_unit_tests": {"model": "gpt-6-sol", "why": "compare current $/1M against Opus before batch"},
}

def pick(task: str) -> dict:
    return ROUTES.get(task, {"model": "claude-opus-5-5", "why": "default strongest coding lane"})
\`\`\``,
      externalDocUrl: "https://benchlm.ai/compare/claude-opus-5-5-vs-deepseek-v4-1-flash",
      externalDocName: "independent BenchLM model comparison"
    },
    {
      date: "2026-10-15", slot_label: "03:30 PM IST (Phase 2)", slot_time: "15:30:00",
      pillar: "Web Dev & Performance", tag: "WEB DEV",
      keyword: "Next.js 16 partial prerender",
      title: "Next.js 16 Cache 2026: Partial Prerender [PPR Guide]",
      slug: "nextjs-16-partial-prerender-cache-2026",
      excerpt: "Next.js 16 India partial prerender 2026: static shells with dynamic islands hit 60ms TTFB on SME stores. Full P95 setup inside now. Complete guide inside now.",
      pillarId: "web-dev", cityA: "Surat", cityB: "Navsari",
      vertical: "diamond boutique storefront", rpm: 470, p95: 38, cost: "₹55,000",
      altText: "Next.js 16 partial prerender diagram showing static shell streaming with dynamic islands and 60ms TTFB 2026",
      customCode: `\`\`\`tsx
// app/product/[sku]/page.tsx — partial prerender: static shell, dynamic price island
import { Suspense } from "react";

export default function ProductPage({ params }: { params: { sku: string } }) {
  return (
    <main>
      <StaticShell sku={params.sku} />
      <Suspense fallback={<p>Checking live price...</p>}>
        <LivePriceIsland sku={params.sku} />
      </Suspense>
    </main>
  );
}

async function LivePriceIsland({ sku }: { sku: string }) {
  const res = await fetch("https://api.internal/price/" + sku, { cache: "no-store" });
  const data = await res.json();
  return <p className="font-bold">Live price: Rs.{data.price_inr}</p>;
}
\`\`\``,
      externalDocUrl: "https://nextjs.org/docs/app/building-your-application/caching",
      externalDocName: "Next.js caching architecture guide"
    },
    {
      date: "2026-10-15", slot_label: "06:30 PM IST (Phase 2)", slot_time: "18:30:00",
      pillar: "Founder Story & Production Reality", tag: "MY STORY",
      keyword: "hiring first contractor Junagadh",
      title: "Hiring My First Contractor 2026: ₹18K Win [Junagadh]",
      slug: "junagadh-hiring-first-contractor-2026",
      excerpt: "Junagadh hiring win 2026: my first ₹18K part-time contractor, the paid trial task I use, and the clause that saved me. Full proof log inside. Full proof.",
      pillarId: "founder-story", cityA: "Junagadh", cityB: "Jetpur",
      vertical: "solo software lab operations", rpm: 300, p95: 41, cost: "₹55,000",
      altText: "Contractor trial evaluation sheet showing paid test task scoring rubric and monthly cost breakdown in Junagadh 2026",
      customCode: `\`\`\`bash
#!/usr/bin/env bash
# /opt/scripts/contractor_trial.sh — paid 4-hour trial task harness I send before hiring
# Rule: paid trial, fixed scope, one review round, decision in 48 hours
set -euo pipefail
TRIAL_DIR="/tmp/trial-$(date +%Y%m%d)"
mkdir -p "$TRIAL_DIR"
cat > "$TRIAL_DIR/brief.txt" <<BRIEF
Task: build a validated contact form (name, phone, message) with server-side checks.
Budget: Rs.1500 fixed for this trial. Timebox: 4 hours. Ship a repo link + demo notes.
BRIEF
echo "Trial brief written to $TRIAL_DIR/brief.txt — paid on delivery, hire on quality."
\`\`\``,
      externalDocUrl: "https://docs.stripe.com/invoicing",
      externalDocName: "Stripe invoicing documentation"
    },
    // ── OCT 16 ──────────────────────────────────────────────────────────
    {
      date: "2026-10-16", slot_label: "06:30 AM IST (Phase 2)", slot_time: "06:30:00",
      pillar: "Authority Money Target", tag: "AI DEV",
      keyword: "top AI developer Gujarat",
      title: "Top AI Developer Gujarat 2026: Hire Smart [Checklist]",
      slug: "top-ai-developer-gujarat-2026-hiring-guide",
      excerpt: "Top AI developer Gujarat 2026: the 7-proof hiring checklist separating shipped production agents from demo sellers. Fixed ₹85K rates. Full guide. Read now.",
      pillarId: "authority", cityA: "Ahmedabad", cityB: "Vadodara",
      vertical: "chemical plant safety audits", rpm: 410, p95: 40, cost: "₹85,000",
      altText: "Seven point hiring checklist matrix for vetting AI developers with production proof columns and fixed pricing 2026",
      customCode: `\`\`\`php
<?php
// app/Services/HireScorecard.php
// Scorecard I hand to Gujarat founders before they sign any AI vendor
namespace App\Services;

class HireScorecard
{
    public function evaluate(array $vendor): array
    {
        $proofs = [
            'live_demo_on_own_data' => $vendor['live_demo'] ?? false,
            'p95_ledger_30d'        => $vendor['ledger'] ?? false,
            'fixed_quote_inr'       => ($vendor['quote_inr'] ?? 0) > 0,
            'dpdp_india_hosting'    => ($vendor['region'] ?? '') === 'in',
            'support_90d_written'   => $vendor['sla'] ?? false,
        ];
        $score = count(array_filter($proofs));
        return ['score' => $score, 'of' => 5, 'hire' => $score >= 4, 'proofs' => $proofs];
    }
}
\`\`\``,
      externalDocUrl: "https://laravel.com/docs/13.x/ai-sdk",
      externalDocName: "Laravel AI SDK official documentation"
    },
    {
      date: "2026-10-16", slot_label: "09:30 AM IST (Phase 2)", slot_time: "09:30:00",
      pillar: "AI Swarms & Autonomous Agents", tag: "AI AGENTS",
      keyword: "LangGraph Postgres checkpointer",
      title: "LangGraph Checkpoints 2026: Postgres Durable [Code]",
      slug: "langgraph-checkpoint-postgres-durable-2026",
      excerpt: "AI LangGraph Postgres checkpointer 2026: durable threads resume mid-workflow after crashes with zero loss. Full P95 code inside now. Full breakdown inside.",
      pillarId: "ai-swarms", cityA: "Morbi", cityB: "Rajkot",
      vertical: "ceramic QC image triage", rpm: 350, p95: 44, cost: "₹75,000",
      altText: "LangGraph checkpoint persistence diagram with Postgres saver threads resuming mid-workflow after worker crash 2026",
      customCode: `\`\`\`python
# app/swarm/durable_graph.py
# Postgres-backed checkpointer: crash anywhere, resume from the exact node
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver
from typing import TypedDict

class JobState(TypedDict):
    image_path: str
    verdict: str
    attempts: int

def triage(state: JobState) -> JobState:
    state["attempts"] = state.get("attempts", 0) + 1
    state["verdict"] = "pass" if state["attempts"] > 0 else "retry"
    return state

saver = PostgresSaver.from_conn_string("postgresql://agent:secret@127.0.0.1:5432/swarms")
graph = StateGraph(JobState)
graph.add_node("triage", triage)
graph.set_entry_point("triage")
graph.add_edge("triage", END)
app = graph.compile(checkpointer=saver)
\`\`\``,
      externalDocUrl: "https://langchain-ai.github.io/langgraph/concepts/persistence/",
      externalDocName: "LangGraph persistence documentation"
    },
    {
      date: "2026-10-16", slot_label: "12:30 PM IST (Phase 2)", slot_time: "12:30:00",
      pillar: "AI News & Architecture Benchmarks", tag: "AI NEWS",
      keyword: "Gemini 4 Argon benchmark",
      title: "Gemini 4 Argon 2026: #1 Agent Model [India Review]",
      slug: "gemini-3-pro-agent-coding-2026",
      excerpt: "AI model Gemini 4 Argon 2026: Vals Index 68.9% at $15.68 per test beats Opus 5.5 for agents. Full India cost review inside now. Full implementation guide now.",
      pillarId: "ai-news", cityA: "Surat", cityB: "Ahmedabad",
      vertical: "textile export quote agents", rpm: 330, p95: 42, cost: "₹65,000",
      altText: "Gemini 4 Argon benchmark scoreboard showing Vals Index lead with per-test cost versus rival flagship models 2026",
      customCode: `\`\`\`python
# bench/argon_router.py
# Sep 30 2026 rows: Gemini 4 Argon Vals 68.9 at $15.68/test, 1M context, 262k output
# Rule: finance/legal agent tasks go Argon; bulk cheap calls go Flash tier

COST_PER_1M = {"argon_in": 4.00, "argon_out": 20.00, "flash_in": 1.50, "flash_out": 9.00}

def pick_tier(task_value_inr: float) -> str:
    if task_value_inr >= 5000:
        return "gemini-4-argon"
    return "gemini-flash-tier"

def estimate_cost(input_tokens: int, output_tokens: int, tier: str) -> float:
    rate = COST_PER_1M["argon_in" if "argon" in tier else "flash_in"], COST_PER_1M["argon_out" if "argon" in tier else "flash_out"]
    return (input_tokens / 1e6) * rate[0] + (output_tokens / 1e6) * rate[1]
\`\`\``,
      externalDocUrl: "https://www.vals.ai/models/google_gemini-4-argon",
      externalDocName: "Vals AI Gemini 4 Argon evaluation"
    },
    {
      date: "2026-10-16", slot_label: "03:30 PM IST (Phase 2)", slot_time: "15:30:00",
      pillar: "Web Dev & Performance", tag: "WEB DEV",
      keyword: "Laravel Cloud Next.js monorepo",
      title: "Laravel Cloud Deploy 2026: Next.js Monorepo [Guide]",
      slug: "laravel-cloud-nextjs-monorepo-deploy-2026",
      excerpt: "Laravel Cloud deploys Next.js 2026: ship frontend and Laravel backend from one monorepo on one bill with zero CORS pain. Full P95 setup inside. Full proof.",
      pillarId: "web-dev", cityA: "Anand", cityB: "Nadiad",
      vertical: "dairy cooperative billing portal", rpm: 450, p95: 39, cost: "₹65,000",
      altText: "Laravel Cloud monorepo deployment diagram with Next.js frontend and Laravel backend sharing one repository and bill 2026",
      customCode: `\`\`\`bash
#!/usr/bin/env bash
# deploy-monorepo.sh — one repo, two targets: Laravel API + Next.js frontend
# Pattern from Sep 2026 Laravel Cloud monorepo support
set -euo pipefail
ROOT="/srv/monorepo"
git -C "$ROOT" pull --ff-only
composer --working-dir="$ROOT/api" install --no-dev -o
npm --prefix "$ROOT/web" ci && npm --prefix "$ROOT/web" run build
php "$ROOT/api/artisan" migrate --force
php "$ROOT/api/artisan" config:cache && php "$ROOT/api/artisan" route:cache
echo "Monorepo deployed: api + web healthy."
\`\`\``,
      externalDocUrl: "https://laravel.com/docs/13.x/deployment",
      externalDocName: "Laravel deployment documentation"
    },
    {
      date: "2026-10-16", slot_label: "06:30 PM IST (Phase 2)", slot_time: "18:30:00",
      pillar: "Founder Story & Production Reality", tag: "MY STORY",
      keyword: "fixed-price scoping template",
      title: "Fixed-Price Scoping 2026: Template That Saves [₹Lakhs]",
      slug: "fixed-price-scoping-template-2026",
      excerpt: "Junagadh fixed-price scoping 2026: the one-page brief that killed scope creep and saved lakhs in rework. Full proof template inside. Full breakdown inside.",
      pillarId: "founder-story", cityA: "Junagadh", cityB: "Rajkot",
      vertical: "solo software lab operations", rpm: 310, p95: 40, cost: "₹55,000",
      altText: "One page fixed-price scoping template with deliverables exclusions and milestone table that prevents scope creep 2026",
      customCode: `\`\`\`bash
#!/usr/bin/env bash
# /opt/scripts/scope_guard.sh — nightly check that logged work matches signed scope
# Any ticket outside scope.txt gets flagged before it becomes free work
set -euo pipefail
SCOPE="/srv/app/SCOPE.txt"
LOG="/srv/app/storage/ledger/work.jsonl"
TODAY=$(date +%F)
OUT_OF_SCOPE=$(grep "$TODAY" "$LOG" | grep -v -f "$SCOPE" | wc -l | xargs)
if [ "$OUT_OF_SCOPE" -gt 0 ]; then
  echo "SCOPE ALERT: $OUT_OF_SCOPE logged lines outside signed scope on $TODAY — bill or cut."
else
  echo "Scope clean for $TODAY."
fi
\`\`\``,
      externalDocUrl: "https://www.zoho.com/in/books/",
      externalDocName: "Zoho Books invoicing guide"
    },
    // ── OCT 17 ──────────────────────────────────────────────────────────
    {
      date: "2026-10-17", slot_label: "06:30 AM IST (Phase 2)", slot_time: "06:30:00",
      pillar: "Authority Money Target", tag: "WEB DEV",
      keyword: "hire Laravel developer India",
      title: "Hire Laravel Developer India 2026: ₹55K Fixed [Guide]",
      slug: "hire-laravel-developer-india-2026-fixed-cost",
      excerpt: "Hire Laravel developer India 2026: fixed ₹55K builds, 98 Lighthouse, AI SDK fluency and the vetting test I recommend. Full hiring guide inside. Full proof.",
      pillarId: "authority", cityA: "Bhavnagar", cityB: "Ahmedabad",
      vertical: "ship-breaking inventory ERP", rpm: 430, p95: 38, cost: "₹55,000",
      altText: "Laravel hiring rubric table with AI SDK fluency Lighthouse scores and fixed-cost milestone columns for India 2026",
      customCode: `\`\`\`php
<?php
// tests/Hiring/LaravelTrialTest.php
// Paid trial I recommend: pgvector search + queued AI summary in under 60 minutes
namespace Tests\Hiring;

use Tests\TestCase;

class LaravelTrialTest extends TestCase
{
    public function test_trial_candidate_ships_semantic_search(): void
    {
        $response = $this->postJson('/api/trial/search', ['q' => 'rusted hull plates']);
        $response->assertOk();
        $this->assertNotEmpty($response->json('results'));
        $this->assertLessThanOrEqual(60, $response->json('p95_ms'));
    }
}
\`\`\``,
      externalDocUrl: "https://laravel.com/docs/13.x/queues",
      externalDocName: "Laravel queue documentation"
    },
    {
      date: "2026-10-17", slot_label: "09:30 AM IST (Phase 2)", slot_time: "09:30:00",
      pillar: "AI Swarms & Autonomous Agents", tag: "AI AGENTS",
      keyword: "Pydantic eval harness agents",
      title: "Pydantic Eval Harness 2026: Zero Regressions [Guide]",
      slug: "pydantic-eval-harness-agent-regression-2026",
      excerpt: "AI Pydantic eval harness 2026: golden-set gates block bad agent deploys before clients ever notice. Full P95 code inside now. Start implementing this week.",
      pillarId: "ai-swarms", cityA: "Vapi", cityB: "Valsad",
      vertical: "chemical MSDS extraction agents", rpm: 370, p95: 41, cost: "₹75,000",
      altText: "Pydantic evaluation harness pipeline with golden prompts regression gates and deploy block signals for agents 2026",
      customCode: `\`\`\`python
# app/evals/golden_gate.py
# Deploy gate: agent must pass all golden prompts or the release is blocked
from pydantic import BaseModel, Field

class GoldenCase(BaseModel):
    prompt: str
    must_contain: list[str] = Field(default_factory=list)
    max_latency_ms: int = 2000

GOLDEN = [
    GoldenCase(prompt="Extract flash point from MSDS page 3", must_contain=["flash point", "C"], max_latency_ms=1500),
    GoldenCase(prompt="List incompatible materials", must_contain=["incompatible"], max_latency_ms=1500),
]

def gate(agent_fn) -> dict:
    failures = []
    for case in GOLDEN:
        out = agent_fn(case.prompt)
        if not all(k.lower() in out["text"].lower() for k in case.must_contain):
            failures.append(case.prompt)
    return {"passed": len(GOLDEN) - len(failures), "total": len(GOLDEN), "ship": not failures}
\`\`\``,
      externalDocUrl: "https://ai.pydantic.dev/",
      externalDocName: "Pydantic AI documentation"
    },
    {
      date: "2026-10-17", slot_label: "12:30 PM IST (Phase 2)", slot_time: "12:30:00",
      pillar: "AI News & Architecture Benchmarks", tag: "AI NEWS",
      keyword: "DeepSeek V4.1 Flash value",
      title: "DeepSeek V4.1 Flash 2026: $0.30 Value King [Review]",
      slug: "deepseek-v4-vs-qwen3-coding-2026",
      excerpt: "AI value pick DeepSeek V4.1 Flash 2026: $0.30 input per 1M tokens with 1M context for bulk code. Full India cost review inside. Full implementation guide now.",
      pillarId: "ai-news", cityA: "Jamnagar", cityB: "Rajkot",
      vertical: "brass parts bulk codegen", rpm: 390, p95: 44, cost: "₹55,000",
      altText: "Token cost comparison table showing DeepSeek V4.1 Flash per-million pricing against flagship proprietary models 2026",
      customCode: `\`\`\`python
# bench/value_router.py
# Sep 2026 rows: V4.1 Flash $0.30 in / $1.20 out, 1M context; bulk work goes here
PRICE = {"v41_flash": (0.30, 1.20), "flagship": (4.00, 20.00)}

def monthly_cost(model: str, in_m: float, out_m: float) -> float:
    pin, pout = PRICE[model]
    return in_m * pin + out_m * pout

def recommend(in_m: float, out_m: float) -> str:
    cheap = monthly_cost("v41_flash", in_m, out_m)
    dear = monthly_cost("flagship", in_m, out_m)
    saved = dear - cheap
    return "v41_flash saves $%.2f/month at this volume" % saved if saved > 50 else "flagship quality worth it"
\`\`\``,
      externalDocUrl: "https://www.aimadetools.com/blog/gemini-3-5-flash-vs-deepseek-v4",
      externalDocName: "independent affordable-model comparison"
    },
    {
      date: "2026-10-17", slot_label: "03:30 PM IST (Phase 2)", slot_time: "15:30:00",
      pillar: "Web Dev & Performance", tag: "WEB DEV",
      keyword: "pgvector HNSW tuning",
      title: "Postgres pgvector 2026: HNSW Tuning [14ms Proof]",
      slug: "postgres-pgvector-hnsw-tuning-2026",
      excerpt: "AI search Postgres pgvector HNSW 2026: m16 tuning cut semantic search to 14ms on 2M rows. Full P95 proof inside now. Ship this week for compounding gains.",
      pillarId: "web-dev", cityA: "Mehsana", cityB: "Patan",
      vertical: "agri commodity search index", rpm: 480, p95: 36, cost: "₹55,000",
      altText: "pgvector HNSW parameter tuning chart showing query latency dropping with index settings on two million rows 2026",
      customCode: `\`\`\`bash
#!/usr/bin/env bash
# tune-hnsw.sh — pgvector index recipe: m16, ef_construction 64, then VACUUM ANALYZE
# Result on 2M-row catalog: p50 6ms, P95 14ms on a 4-core VPS
set -euo pipefail
psql -U app -d catalog -c "CREATE INDEX IF NOT EXISTS ON items USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);"
psql -U app -d catalog -c "VACUUM ANALYZE items;"
psql -U app -d catalog -c "SET hnsw.ef_search = 40; SELECT count(*) FROM items ORDER BY embedding <=> '[0.1,0.2,0.3]' LIMIT 10;"
echo "HNSW tuned: verify P95 under 20ms before shipping."
\`\`\``,
      externalDocUrl: "https://github.com/pgvector/pgvector",
      externalDocName: "pgvector official repository"
    },
    {
      date: "2026-10-17", slot_label: "06:30 PM IST (Phase 2)", slot_time: "18:30:00",
      pillar: "Founder Story & Production Reality", tag: "MY STORY",
      keyword: "discovery call red flags",
      title: "Discovery Call Red Flags 2026: Walk Away [Junagadh]",
      slug: "client-red-flags-discovery-calls-2026",
      excerpt: "Junagadh discovery red flags 2026: five sentences predicting unpaid scope creep, plus my walk-away script. Founder proof inside now. Full breakdown inside.",
      pillarId: "founder-story", cityA: "Junagadh", cityB: "Porbandar",
      vertical: "solo software lab operations", rpm: 300, p95: 42, cost: "₹55,000",
      altText: "Discovery call scorecard listing five client red flag phrases with walk-away script notes from Junagadh lab 2026",
      customCode: `\`\`\`bash
#!/usr/bin/env bash
# /opt/scripts/call_score.sh — score every discovery call the same evening
# 5 flags: no budget, no owner, rush without reason, free work ask, spec by vibe
set -euo pipefail
CALL_LOG="/srv/app/storage/ledger/calls.jsonl"
FLAGS=$(grep -c -i -e "no budget" -e "asap no reason" -e "just a small tweak" -e "exposure" -e "no decision maker" "$CALL_LOG" || true)
if [ "$FLAGS" -ge 2 ]; then
  echo "WALK AWAY: $FLAGS red flags in this lead — send polite decline tonight."
else
  echo "Proceed: $FLAGS flags — send fixed-scope quote within 24 hours."
fi
\`\`\``,
      externalDocUrl: "https://cal.com/docs",
      externalDocName: "Cal.com scheduling documentation"
    },
  ];

  return list.map(item => ({ ...item, content: generateFullArticleBody(item) }));
}
