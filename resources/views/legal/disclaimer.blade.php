@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">LEGAL</span>
                <span class="article__byline">Last updated: 28 Sep 2026</span>
            </div>
            <h1 class="article__title">Disclaimer &amp; Ad Disclosure — deepakbagada.in</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <h2>1. Educational content only</h2>
                <p>Journal articles document my own engineering experience from Junagadh, Gujarat. They are not legal, financial or medical advice. Benchmarks (latency, cost, timelines) reflect my lab setups — your results will vary. Test code samples before production use.</p>
                <h2>2. Accuracy</h2>
                <p>I update posts when stacks change, but APIs, pricing and frameworks move fast. Check official docs and verify before relying on any guide. Report errors to <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a> and I will correct them.</p>
                <h2>3. Advertising disclosure (Google AdSense)</h2>
                <p>This site shows ads served by <strong>Google AdSense (pub-4764950179214862)</strong>. Google may use cookies (including the DoubleClick cookie) to personalise ads based on your visits here and elsewhere. You can opt out of personalised advertising at <a href="https://www.google.com/settings/ads" rel="noopener">Google Ads Settings</a>. Ads do not constitute endorsement of advertised products.</p>
                <h2>4. Affiliate &amp; external links</h2>
                <p>Some outbound links go to third-party docs, tools or platforms. I am not responsible for their content, privacy practices or availability.</p>
                <h2>5. Views</h2>
                <p>Opinions are my own and not those of clients, employers or vendors mentioned.</p>
            </div>
            <div class="article__foot">
                <a class="btn btn--ghost" href="{{ route('legal.privacy') }}">Privacy →</a>
                <a class="btn btn--ghost" href="{{ route('legal.terms') }}">Terms →</a>
            </div>
        </div>
    </article>
@endsection
