@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">ABOUT</span>
                <span class="article__byline">By {{ $site['name'] }} · Junagadh, Gujarat, India</span>
            </div>
            <h1 class="article__title">About Deepak Bagada — AI Developer, Web Developer &amp; Automation Expert</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>I am <strong>Deepak Bagada</strong>, an AI developer, web developer and marketing engineer based in <strong>Junagadh, Gujarat, India</strong>. My path runs code → marketing → AI: I started building websites, learned how traffic and conversions actually work, then moved into autonomous AI agents and enterprise automation.</p>
                <p>Over the last <strong>5+ years</strong> I have shipped <strong>40+ production builds</strong> including Curro, SaaS Next and DailyAIWorld — custom Laravel applications, multi-agent LLM pipelines, RAG knowledge bases over pgvector, and n8n/Python workflow automations for clients in Junagadh, Rajkot, Ahmedabad, Surat and remotely worldwide.</p>
                <h2>What I do now</h2>
                <ul>
                    <li><strong>AI agents &amp; multi-agent systems</strong> — goal-driven agents with Pydantic validation, OPA policy gates and 90-day verification ledgers. See <a href="{{ route('services.show', 'ai-development') }}">AI development services</a>.</li>
                    <li><strong>Web development</strong> — fast Laravel builds with sub-second Core Web Vitals, schema-first SEO. See <a href="{{ route('services.show', 'web-development') }}">web development services</a>.</li>
                    <li><strong>Automation</strong> — CRM, lead, publishing and document pipelines. See <a href="{{ route('services.show', 'automation-expert') }}">automation services</a>.</li>
                    <li><strong>SEO &amp; AEO</strong> — ranking in Google and being cited in AI Overviews, ChatGPT and Perplexity. See <a href="{{ route('services.show', 'seo-aeo') }}">SEO &amp; AEO services</a>.</li>
                </ul>
                <h2>How I work</h2>
                <p>Fixed-scope builds (typically ₹55,000–₹85,000), 14–21 day delivery, staging reviews, and documented handover. Hosting on Indian VPS infrastructure for DPDP-aligned data residency. Every claim in my <a href="{{ route('journal.index') }}">journal</a> comes from builds I ran in my Junagadh lab — with latency numbers, cost tables and code I actually shipped.</p>
                <h2>Proof &amp; contact</h2>
                <p>Browse <a href="/#projects">main projects</a>, read the <a href="{{ route('journal.index') }}">engineering journal</a>, or <a href="{{ route('legal.contact') }}">contact me directly</a>. Email: <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a>. Find me on <a href="{{ $site['socials']['LinkedIn'] }}">LinkedIn</a>, <a href="{{ $site['socials']['GitHub'] }}">GitHub</a> and <a href="{{ $site['socials']['X'] }}">X</a>.</p>
            </div>
            <div class="article__foot">
                <a class="btn btn--solid" href="{{ route('legal.contact') }}">Work with me →</a>
                <a class="btn btn--ghost" href="{{ route('journal.index') }}">Read the journal</a>
            </div>
        </div>
    </article>
@endsection
