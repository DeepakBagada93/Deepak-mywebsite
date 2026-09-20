@extends('layouts.app')

@section('content')
<section class="section tool-page" id="tool">
    <div class="container">
        {{-- Breadcrumb --}}
        <nav class="tool-page__breadcrumb mono" data-reveal>
            <a href="{{ route('tools.index') }}">Tools</a>
            <span>/</span>
            <a href="{{ route('tools.index') }}?category={{ $tool['category_slug'] }}">{{ $tool['category'] }}</a>
            <span>/</span>
            <span>{{ $tool['name'] }}</span>
        </nav>

        {{-- Hero --}}
        <div class="section__head" data-reveal>
            <p class="mono section__label">{{ $tool['category_icon'] }} {{ $tool['category'] }}</p>
            <h1 class="section__title">
                <span class="split-lines">{{ $tool['icon'] }} {{ $tool['name'] }}</span>
            </h1>
            <p class="tool-page__desc">{{ $tool['description'] }}</p>
            <div class="section__rule" aria-hidden="true"></div>
        </div>

        {{-- Tool Area --}}
        <div class="tool-page__workspace" data-reveal>
            <div class="tool-page__workspace-inner" id="tool-workspace">
                @if (view()->exists('tools.partials.' . $tool['slug']))
                    @include('tools.partials.' . $tool['slug'])
                @else
                    <div class="tool-page__coming-soon">
                        <p class="tool-page__coming-icon">🚧</p>
                        <h2 class="tool-page__coming-title">Coming Soon</h2>
                        <p class="tool-page__coming-desc">This tool is under development. Check back soon!</p>
                    </div>
                @endif
            </div>
        </div>

        {{-- How to Use --}}
        <div class="tool-page__howto" data-reveal>
            <h2 class="tool-page__h2">How to Use {{ $tool['name'] }}</h2>
            <div class="tool-page__steps">
                <div class="tool-page__step">
                    <span class="mono tool-page__step-num">01</span>
                    <div>
                        <h3 class="tool-page__step-title">Open the Tool</h3>
                        <p class="tool-page__step-desc">Click or tap on the tool above — no sign-up, no download required.</p>
                    </div>
                </div>
                <div class="tool-page__step">
                    <span class="mono tool-page__step-num">02</span>
                    <div>
                        <h3 class="tool-page__step-title">Enter Your Data</h3>
                        <p class="tool-page__step-desc">Paste, upload, or type your input. Everything processes instantly in your browser.</p>
                    </div>
                </div>
                <div class="tool-page__step">
                    <span class="mono tool-page__step-num">03</span>
                    <div>
                        <h3 class="tool-page__step-title">Get Your Result</h3>
                        <p class="tool-page__step-desc">Copy, download, or share your output. No watermarks, no limits.</p>
                    </div>
                </div>
            </div>
        </div>

        {{-- Why Use --}}
        <div class="tool-page__why" data-reveal>
            <h2 class="tool-page__h2">Why Use Our {{ $tool['name'] }}?</h2>
            <div class="tool-page__features">
                <div class="tool-page__feature">
                    <span class="tool-page__feature-icon">🔒</span>
                    <h3>100% Private</h3>
                    <p>Your data never leaves your browser. Zero server uploads.</p>
                </div>
                <div class="tool-page__feature">
                    <span class="tool-page__feature-icon">⚡</span>
                    <h3>Lightning Fast</h3>
                    <p>Instant processing — no waiting for server responses.</p>
                </div>
                <div class="tool-page__feature">
                    <span class="tool-page__feature-icon">🆓</span>
                    <h3>100% Free</h3>
                    <p>No sign-up, no subscription, no hidden limits. Free forever.</p>
                </div>
                <div class="tool-page__feature">
                    <span class="tool-page__feature-icon">📱</span>
                    <h3>Works Everywhere</h3>
                    <p>Desktop, tablet, phone — works on any device with a browser.</p>
                </div>
            </div>
        </div>

        {{-- Related Tools --}}
        @if (count($relatedTools) > 0)
        <div class="tool-page__related" data-reveal>
            <h2 class="tool-page__h2">Related Tools</h2>
            <div class="tools-hub__grid tools-hub__grid--sm">
                @foreach ($relatedTools as $rt)
                <a href="{{ route('tools.show', $rt['slug']) }}" class="tool-card">
                    <div class="tool-card__icon">{{ $rt['icon'] }}</div>
                    <div class="tool-card__body">
                        <h3 class="tool-card__title">{{ $rt['name'] }}</h3>
                        <p class="tool-card__desc">{{ $rt['description'] }}</p>
                    </div>
                    <div class="tool-card__foot">
                        <span class="mono tool-card__cat">{{ $rt['category_icon'] }} {{ $rt['category'] }}</span>
                        <span class="mono tool-card__arrow">Open →</span>
                    </div>
                </a>
                @endforeach
            </div>
        </div>
        @endif

        {{-- Schema Markup --}}
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "{{ $tool['name'] }}",
            "url": "{{ config('site.url') }}/tools/{{ $tool['slug'] }}",
            "applicationCategory": "Utility",
            "operatingSystem": "Web Browser",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            },
            "author": {
                "@type": "Person",
                "name": "Deepak Bagada",
                "url": "https://deepakbagada.in"
            }
        }
        </script>
    </div>
</section>
@endsection
