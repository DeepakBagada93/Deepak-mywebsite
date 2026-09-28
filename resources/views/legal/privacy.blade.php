@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">LEGAL</span>
                <span class="article__byline">Last updated: 28 Sep 2026</span>
            </div>
            <h1 class="article__title">Privacy Policy — deepakbagada.in</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>This Privacy Policy explains how Deepak Bagada ("I", "me") collects, uses and protects information on <strong>deepakbagada.in</strong>. Contact: <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a>, Junagadh, Gujarat, India.</p>
                <h2>1. Data I collect</h2>
                <ul>
                    <li><strong>Analytics:</strong> Google Analytics 4 (page views, device, approximate location). IP addresses are truncated/anonymised where supported.</li>
                    <li><strong>Newsletter:</strong> email address you submit voluntarily, plus subscription source and unsubscribe token.</li>
                    <li><strong>Contact emails:</strong> your email address and message content when you email me.</li>
                    <li><strong>Ads:</strong> Google AdSense may use cookies to personalise and measure ads. See Google's <a href="https://policies.google.com/technologies/ads" rel="noopener">Advertising Policy</a>.</li>
                </ul>
                <h2>2. How I use it</h2>
                <p>To operate the site, measure readership, send the newsletter you requested, reply to enquiries, prevent abuse, and comply with law. I never sell personal data.</p>
                <h2>3. Cookies</h2>
                <p>Essential cookies keep the site working. Analytics and advertising cookies (Google Analytics, AdSense) require your browser consent where applicable — you can block or delete cookies in browser settings; the site still works but newsletter/analytics features may degrade.</p>
                <h2>4. Sharing</h2>
                <p>Processors only: hosting provider (Hostinger), Google Analytics, Google AdSense, and email delivery for the newsletter. No other sharing except when required by Indian law.</p>
                <h2>5. Retention</h2>
                <p>Newsletter emails until you unsubscribe; analytics aggregates up to 26 months; contact emails up to 3 years for record-keeping.</p>
                <h2>6. Your rights (India DPDP Act 2023)</h2>
                <p>You may request access, correction, erasure, or withdrawal of consent by emailing <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a>. I respond within 30 days. Grievance contact is the same address.</p>
                <h2>7. Children</h2>
                <p>This site is for a general professional audience and is not directed at children under 13.</p>
                <h2>8. Changes</h2>
                <p>Material changes will be noted here with a new date. Continued use after changes means acceptance.</p>
            </div>
            <div class="article__foot">
                <a class="btn btn--ghost" href="{{ route('legal.terms') }}">Terms →</a>
                <a class="btn btn--ghost" href="{{ route('legal.disclaimer') }}">Disclaimer →</a>
            </div>
        </div>
    </article>
@endsection
