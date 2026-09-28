@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">CONTACT</span>
                <span class="article__byline">Replies within 2 business days</span>
            </div>
            <h1 class="article__title">Contact Deepak Bagada — Junagadh, Gujarat, India</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <p>For AI agent builds, web development, automation or SEO/AEO engagements, email me directly. I reply personally — no sales team, no spam.</p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a></li>
                    <li><strong>Location:</strong> Junagadh, Gujarat 362001, India (serving Ahmedabad, Surat, Rajkot, Vadodara, Mumbai, Bangalore, Delhi NCR and remote worldwide)</li>
                    <li><strong>Hours:</strong> Monday–Saturday, 10:00–19:00 IST</li>
                    <li><strong>Response SLA:</strong> within 2 business days</li>
                </ul>
                <h2>What to include</h2>
                <p>Your goal, current stack, timeline and budget range. For AI work, note your data sources and privacy requirements (DPDP / on-premise). For web work, share your current URL and Core Web Vitals pain points.</p>
                <h2>Elsewhere</h2>
                <p><a href="{{ $site['socials']['LinkedIn'] }}">LinkedIn</a> · <a href="{{ $site['socials']['GitHub'] }}">GitHub</a> · <a href="{{ $site['socials']['X'] }}">X</a> · <a href="{{ $site['socials']['Instagram'] }}">Instagram</a></p>
            </div>
            <div class="article__foot">
                <a class="btn btn--solid" href="mailto:{{ $site['email'] }}">Email {{ $site['email'] }} →</a>
                <a class="btn btn--ghost" href="{{ route('services.index') }}">View services</a>
            </div>
        </div>
    </article>
@endsection
