@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <nav class="mono article__crumbs" aria-label="Breadcrumb" style="margin-bottom:16px;font-size:12px;">
                <a href="/">Home</a> / <a href="{{ route('services.index') }}">Services</a> / {{ $service->title }}
            </nav>
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper($service->kicker) }}</span>
                <span class="article__date">{{ $site['location'] }}</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">{{ $service->title }}</h1>
            <p class="service__tagline">{{ $service->tagline }}</p>
            <div class="article__rule"></div>
            <div class="article__body">
                @foreach (preg_split("/\r?\n\r?\n/", trim($service->intro)) as $para)
                    <p>{{ $para }}</p>
                @endforeach

                <h2 class="service__h2">What's included</h2>
                <ul class="service__list">
                    @foreach ($service->offerings as $name => $desc)
                        <li><strong>{{ $name }}.</strong> {{ $desc }}</li>
                    @endforeach
                </ul>

                <h2 class="service__h2">Questions, answered</h2>
                <div class="faq">
                    @foreach ($service->faq as $question => $answer)
                        <details class="faq__item">
                            <summary class="faq__q">{{ $question }}</summary>
                            <p class="faq__a">{{ $answer }}</p>
                        </details>
                    @endforeach
                </div>

                @if (!empty($services) && count($services) > 1)
                    <h2 class="service__h2">Related services</h2>
                    <ul class="service__list">
                        @foreach ($services as $rel)
                            @if ($rel->slug !== $service->slug)
                                <li><a href="{{ route('services.show', $rel->slug) }}">{{ $rel->title }}</a> — {{ $rel->tagline }}</li>
                            @endif
                        @endforeach
                    </ul>
                @endif

                <h2 class="service__h2">Engineering Architecture & Field Notes</h2>
                <ul class="service__list">
                    @if ($service->slug === 'ai-development')
                        <li><a href="/journal/langchain-mcpadapter-elicitation-cache-2026">LangChain MCPAdapter: Elicitation and Cache Guide 2026</a> — Unified tool calling gateway for Next.js 15 and Laravel 13 with sub-40ms P95 latency.</li>
                        <li><a href="/journal/mcp-auth-cimd-oauth-guide-2026">MCP Auth Guide 2026: CIMD vs DCR for Agent Architectures</a> — Client ID Metadata Documents replacing DCR for enterprise agent security.</li>
                        <li><a href="/journal/pydantic-ai-vs-langgraph-5-benchmark-showdowns-2026">PydanticAI vs LangGraph: 5 Real Production Showdowns 2026</a> — 10,000-run empirical benchmark comparing schema validation and cyclic state graphs.</li>
                        <li><a href="/journal/slm-vs-llm-small-language-models-gujarat-sme-cost-2026">SLM vs LLM: Small Language Models Cost Guide for Indian SMEs</a> — Deploying private, low-latency 7B models on 4-core VPS nodes without cloud API bleed.</li>
                        <li><a href="/journal/ai-tools-india-2026">AI Tools in India 2026: Complete Cost & Model Tiering Blueprint</a> — Practical pricing guide for models, agents, and vernacular workflows across India.</li>
                    @elseif ($service->slug === 'web-development')
                        <li><a href="/journal/laravel-pulse-5-slow-queries">Laravel Pulse 2026: 5 Slow Queries Killing P95 Latency</a> — Five MySQL query anti-patterns, composite indexing fixes, and before-after benchmarks.</li>
                        <li><a href="/journal/laravel-ai-sdk-v1-mcp-tools-production-2026">Laravel AI SDK v1: FastMCP Tools and Vector Search 2026</a> — Provider-agnostic LLM agents and pgvector HNSW similarity search on PHP 8.3.</li>
                        <li><a href="/journal/mysql-json-vs-mariadb-json-search">MySQL JSON vs MariaDB JSON Search: 3x Faster 2026</a> — Virtual generated columns and B-tree optimization for high-throughput JSON queries.</li>
                        <li><a href="/journal/laravel-livewire-3-emi-calculator-math">Laravel Livewire 3 EMI Calculator: Sub-5ms Math in 2026</a> — High-performance reactive amortization calculation engines.</li>
                    @elseif ($service->slug === 'automation-expert')
                        <li><a href="/journal/langchain-mcpadapter-elicitation-cache-2026">LangChain MCPAdapter: Elicitation and Cache Guide 2026</a> — FastMCP tool execution pipelines integrated with n8n workflow orchestrations.</li>
                        <li><a href="/journal/slm-vs-llm-small-language-models-gujarat-sme-cost-2026">SLM vs LLM: Small Language Models Cost Guide for Indian SMEs</a> — Hybrid routing architectures saving 70% on autonomous background queue workflows.</li>
                        <li><a href="/journal/agent-handoff-failures-7-debug-traces">Agent Handoff Failures: 7 Production Debug Traces</a> — Eliminating state loss and API loop desync in multi-agent handoffs.</li>
                    @else
                        <li><a href="/journal/ai-tools-india-2026">AI Tools in India 2026: Complete Cost & Model Tiering Blueprint</a> — Practical pricing and deployment benchmarks for enterprise growth.</li>
                        <li><a href="/journal/best-ai-expert-in-india-production-costs-2026">Best AI Expert in India: Production Costs & Architecture Ledger</a> — Production proof and case studies for enterprise software scaling.</li>
                    @endif
                </ul>
            </div>
            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('legal.contact') }}">Start a project</a>
                <a class="btn btn--ghost" href="{{ route('services.index') }}">All services</a>
                <a class="btn btn--ghost" href="/">← Back home</a>
            </div>
        </div>
    </article>
@endsection
