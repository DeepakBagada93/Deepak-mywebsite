@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">08 — System Architecture</span>
                <span class="article__byline">By {{ $site['name'] }}</span>
            </div>
            <h1 class="article__title">The Production AI Content &amp; Media Stack</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>An inside look into the complete end-to-end multi-agent pipeline used by Deepak Bagada to autonomously research, draft, code-verify, motion-render, and distribute technical journals and short-form video reels from <strong>Junagadh, Gujarat, India</strong>.</p>

                <div class="blueprint-viewer" style="margin: 36px 0; background: #161616; padding: 28px; border-radius: 8px; border: 1px solid var(--hair);">
                    <svg viewBox="0 0 840 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:monospace;">
                        <!-- Node 1: Ideation & Trigger -->
                        <rect x="20" y="40" width="180" height="90" rx="8" fill="#222" stroke="#555" stroke-width="2"/>
                        <text x="110" y="75" fill="#fff" text-anchor="middle" font-size="13" font-weight="bold">1. TREND SCANNER</text>
                        <text x="110" y="98" fill="#888" text-anchor="middle" font-size="10">SearXNG + Perplexity</text>
                        <text x="110" y="114" fill="#888" text-anchor="middle" font-size="9">Autonomous Daily Cron</text>

                        <!-- Connector 1 -> 2 -->
                        <line x1="200" y1="85" x2="260" y2="85" stroke="#fff" stroke-width="2"/>

                        <!-- Node 2: Long-form Generator -->
                        <rect x="260" y="40" width="200" height="90" rx="8" fill="#1c1c1c" stroke="#666" stroke-width="2"/>
                        <text x="360" y="75" fill="#fff" text-anchor="middle" font-size="13" font-weight="bold">2. JOURNAL ENGINE</text>
                        <text x="360" y="98" fill="#aaa" text-anchor="middle" font-size="10">Gemini 1.5 Pro / Claude 3.5</text>
                        <text x="360" y="114" fill="#666" text-anchor="middle" font-size="9">1200+ Words &amp; Schema</text>

                        <!-- Connector 2 -> 3 -->
                        <line x1="460" y1="85" x2="520" y2="85" stroke="#fff" stroke-width="2"/>

                        <!-- Node 3: Quality Audit Gate -->
                        <rect x="520" y="40" width="200" height="90" rx="8" fill="#222" stroke="#22c55e" stroke-width="2"/>
                        <text x="620" y="75" fill="#22c55e" text-anchor="middle" font-size="13" font-weight="bold">3. CQ/CI QUALITY AUDIT</text>
                        <text x="620" y="98" fill="#fff" text-anchor="middle" font-size="10">Subagent Fact-Check</text>
                        <text x="620" y="114" fill="#888" text-anchor="middle" font-size="9">Zero-Duplication Memory</text>

                        <!-- Downward Connector to Distribution Swarm -->
                        <line x1="620" y1="130" x2="620" y2="200" stroke="#fff" stroke-width="2"/>

                        <!-- Node 4: Omni-Channel Syndication Swarm -->
                        <rect x="100" y="200" width="640" height="140" rx="8" fill="#1a1a1a" stroke="#888" stroke-width="2"/>
                        <text x="420" y="235" fill="#fff" text-anchor="middle" font-size="14" font-weight="bold">4. OMNI-CHANNEL AGENT DISTRIBUTION SWARM</text>

                        <!-- Sub-boxes -->
                        <rect x="120" y="255" width="135" height="65" rx="6" fill="#262626" stroke="#444"/>
                        <text x="187" y="282" fill="#fff" text-anchor="middle" font-size="11" font-weight="bold">MySQL / Live</text>
                        <text x="187" y="302" fill="#888" text-anchor="middle" font-size="9">deepakbagada.in</text>

                        <rect x="270" y="255" width="135" height="65" rx="6" fill="#262626" stroke="#444"/>
                        <text x="337" y="282" fill="#fff" text-anchor="middle" font-size="11" font-weight="bold">X Threads</text>
                        <text x="337" y="302" fill="#888" text-anchor="middle" font-size="9">6-8 Post Hooks</text>

                        <rect x="420" y="255" width="135" height="65" rx="6" fill="#262626" stroke="#444"/>
                        <text x="487" y="282" fill="#fff" text-anchor="middle" font-size="11" font-weight="bold">LinkedIn</text>
                        <text x="487" y="302" fill="#888" text-anchor="middle" font-size="9">Authority Post</text>

                        <rect x="570" y="255" width="150" height="65" rx="6" fill="#262626" stroke="#444"/>
                        <text x="645" y="282" fill="#fff" text-anchor="middle" font-size="11" font-weight="bold">Remotion 9:16</text>
                        <text x="645" y="302" fill="#888" text-anchor="middle" font-size="9">Viral Video Reel</text>
                    </svg>
                </div>

                <h2>Pipeline Stages &amp; Execution Specifications</h2>

                <div class="timeline" style="margin-top: 32px;">
                    <div class="timeline__entry">
                        <div class="timeline__year mono">STEP 01</div>
                        <div class="timeline__content">
                            <h3 class="timeline__role">Topical Discovery &amp; Search Grounding</h3>
                            <p>SearXNG metasearch agent and Perplexity API scan breaking updates across AI agent swarms, MCP servers, and web architectures, filtering against <code>memory.md</code> to prevent any duplication.</p>
                        </div>
                    </div>

                    <div class="timeline__entry">
                        <div class="timeline__year mono">STEP 02</div>
                        <div class="timeline__content">
                            <h3 class="timeline__role">Long-Form Deep Article Synthesis</h3>
                            <p>Drafts in-depth 1,200+ word journal articles with answer-first AEO summaries, code snippets, internal link grounding, and structured JSON-LD schemas.</p>
                        </div>
                    </div>

                    <div class="timeline__entry">
                        <div class="timeline__year mono">STEP 03</div>
                        <div class="timeline__content">
                            <h3 class="timeline__role">Autonomous Code &amp; Content Audit</h3>
                            <p>An independent auditor subagent executes PHP syntax validation (<code>php -l</code>), checks Pint style conformity, verifies canonical links, and validates CommonMark markup.</p>
                        </div>
                    </div>

                    <div class="timeline__entry">
                        <div class="timeline__year mono">STEP 04</div>
                        <div class="timeline__content">
                            <h3 class="timeline__role">Omni-Channel Distribution Swarm</h3>
                            <p>Publishes synchronously to production Hostinger MySQL and generates adapted assets: X thread series, LinkedIn post, and Remotion 9:16 motion graphics reels.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('library.index') }}">← Explore Open-Source Skills</a>
                <a class="btn btn--ghost" href="{{ route('blueprints.index') }}">Architecture Blueprints →</a>
            </div>
        </div>
    </article>
@endsection
