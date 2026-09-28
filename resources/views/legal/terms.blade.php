@extends('layouts.app')

@section('content')
    <article class="article article--page">
        <div class="container">
            <div class="article__meta mono">
                <span class="article__tag">LEGAL</span>
                <span class="article__byline">Last updated: 28 Sep 2026</span>
            </div>
            <h1 class="article__title">Terms of Service — deepakbagada.in</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                <h2>1. Who I am</h2>
                <p>deepakbagada.in is the personal portfolio and journal of Deepak Bagada, Junagadh, Gujarat, India. Contact: <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a>.</p>
                <h2>2. Acceptable use</h2>
                <p>You may read, link to and quote content with attribution. You may not scrape at abusive rates, bypass rate limits, submit spam via the newsletter form, or misrepresent my work as your own.</p>
                <h2>3. Intellectual property</h2>
                <p>All articles, code samples, designs and images are © 2026 Deepak Bagada unless credited otherwise. Code snippets may be reused in your own projects with attribution; republication of full articles requires written permission.</p>
                <h2>4. Services</h2>
                <p>Project scope, pricing, timelines and warranties for client work are agreed in writing per engagement — nothing on this site is a binding quote. Typical builds: fixed scope, 14–21 day delivery, staging review.</p>
                <h2>5. No warranties</h2>
                <p>The site is provided "as is". I aim for accuracy but do not warrant uninterrupted availability or fitness for any purpose. See the <a href="{{ route('legal.disclaimer') }}">Disclaimer</a>.</p>
                <h2>6. Liability</h2>
                <p>To the maximum extent permitted by Indian law, I am not liable for indirect or consequential loss arising from use of this site or its code samples. Direct liability is limited to ₹10,000.</p>
                <h2>7. Governing law</h2>
                <p>These terms are governed by the laws of India, with exclusive jurisdiction of the courts at Junagadh, Gujarat.</p>
            </div>
            <div class="article__foot">
                <a class="btn btn--ghost" href="{{ route('legal.privacy') }}">Privacy →</a>
                <a class="btn btn--ghost" href="{{ route('legal.disclaimer') }}">Disclaimer →</a>
            </div>
        </div>
    </article>
@endsection
