@php $toolsCount = count(config('tools')); @endphp
<header class="masthead" id="masthead">
    <div class="masthead__row">
        <a class="masthead__logo" href="/">{{ $site['name'] }}</a>

        <nav class="masthead__nav" id="nav">
            <a href="{{ route('services.index') }}">Services</a>
            <a href="/#about">About</a>
            <div class="masthead__nav-item" id="tools-nav-item">
                <button type="button" class="masthead__nav-trigger" id="tools-trigger" aria-expanded="false" aria-controls="tools-popover">
                    Tools <span class="masthead__nav-arrow" aria-hidden="true">▾</span>
                </button>

                {{-- Desktop Floating Popover Card (Anchored under Tools Nav Item) --}}
                <div class="tools-popover" id="tools-popover" role="region" aria-label="Tools Navigation">
                    <div class="tools-popover__head">
                        <div class="tools-popover__head-meta">
                            <span class="mono tools-popover__title">Free Developer &amp; Creator Tools</span>
                            <span class="tools-popover__badge mono">{{ $toolsCount }} Tools · 100% In-Browser</span>
                        </div>
                        <button type="button" class="tools-popover__close" id="tools-popover-close" aria-label="Close menu">✕</button>
                    </div>

                    <div class="tools-popover__body">
                        {{-- Popular Tools Column --}}
                        <div class="tools-popover__col">
                            <p class="mono tools-popover__section-title">Popular Tools</p>
                            <div class="tools-popover__items">
                                <a href="{{ route('tools.show', 'pdf-merge') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">📄</span>
                                    <div class="tools-popover__item-text">
                                        <strong>PDF Merge</strong>
                                        <small>Combine PDFs securely</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'image-compressor') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">🖼️</span>
                                    <div class="tools-popover__item-text">
                                        <strong>Image Compressor</strong>
                                        <small>Shrink PNG, JPG &amp; WebP</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'qr-code-generator') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">📱</span>
                                    <div class="tools-popover__item-text">
                                        <strong>QR Code Generator</strong>
                                        <small>URL, WiFi &amp; custom PNG</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'word-counter') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">📊</span>
                                    <div class="tools-popover__item-text">
                                        <strong>Word Counter</strong>
                                        <small>Words, reading time &amp; density</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'gst-calculator') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">💰</span>
                                    <div class="tools-popover__item-text">
                                        <strong>GST Calculator</strong>
                                        <small>All slabs &amp; ledger breakdown</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'json-formatter') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">⚙️</span>
                                    <div class="tools-popover__item-text">
                                        <strong>JSON Formatter</strong>
                                        <small>Format, minify &amp; validate</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'password-generator') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">🔑</span>
                                    <div class="tools-popover__item-text">
                                        <strong>Password Generator</strong>
                                        <small>CSPRNG secure random keys</small>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {{-- Categories Column --}}
                        <div class="tools-popover__col">
                            <p class="mono tools-popover__section-title">Browse By Category</p>
                            <div class="tools-popover__cats">
                                @php $toolCategories = collect(config('tools'))->groupBy('category'); @endphp
                                @foreach ($toolCategories as $categoryName => $categoryTools)
                                <a href="{{ route('tools.index') }}?category={{ $categoryTools->first()['category_slug'] }}" class="tools-popover__cat-card">
                                    <span class="tools-popover__cat-icon">{{ $categoryTools->first()['category_icon'] }}</span>
                                    <span class="tools-popover__cat-name">{{ $categoryName }}</span>
                                    <span class="mono tools-popover__cat-count">{{ $categoryTools->count() }}</span>
                                </a>
                                @endforeach
                            </div>
                        </div>
                    </div>

                    <div class="tools-popover__foot">
                        <span class="mono tools-popover__foot-text">🔒 100% Client-Side · Zero Server Uploads</span>
                        <a href="{{ route('tools.index') }}" class="tools-popover__foot-btn mono">All {{ $toolsCount }} Tools →</a>
                    </div>
                </div>
            </div>
            <a href="{{ route('library.index') }}">Library</a>
            <a href="{{ route('journal.index') }}">Journal</a>
            <a href="/#contact">Contact</a>
        </nav>

        <div class="masthead__meta">
            <button type="button" class="btn btn--sm btn--primary masthead__subscribe-btn mono" data-newsletter-trigger aria-haspopup="dialog" aria-controls="newsletter-modal">
                Subscribe
            </button>
            <span class="masthead__issue mono">Vol. 01 — 2026</span>
            <button class="masthead__burger mono" id="burger" aria-label="Open menu" aria-expanded="false">Menu</button>
        </div>
    </div>
</header>

{{-- Mobile Menu Drawer --}}
<div class="mmenu" id="mmenu">
    <div class="mmenu__top">
        <span class="mono mmenu__brand">{{ $site['name'] }}</span>
        <button type="button" class="mmenu__close mono" id="mmenu-close" aria-label="Close menu">✕ Close</button>
    </div>
    <ul class="mmenu__list">
        <li><a href="{{ route('services.index') }}"><span class="mono mmenu__num">01</span>Services</a></li>
        <li class="mmenu__expandable" data-open="false">
            <button class="mmenu__expand-btn" aria-expanded="false" type="button">
                <span class="mono mmenu__num">02</span>Tools <span class="mmenu__expand-icon">+</span>
            </button>
            <div class="mmenu__sub">
                <div class="mmenu__sub-quick">
                    <a href="{{ route('tools.show', 'pdf-merge') }}" class="mmenu__sub-quick-link">📄 PDF Merge</a>
                    <a href="{{ route('tools.show', 'image-compressor') }}" class="mmenu__sub-quick-link">🖼️ Image Compressor</a>
                    <a href="{{ route('tools.show', 'qr-code-generator') }}" class="mmenu__sub-quick-link">📱 QR Code</a>
                    <a href="{{ route('tools.show', 'word-counter') }}" class="mmenu__sub-quick-link">📊 Word Counter</a>
                    <a href="{{ route('tools.show', 'gst-calculator') }}" class="mmenu__sub-quick-link">💰 GST Calculator</a>
                    <a href="{{ route('tools.show', 'json-formatter') }}" class="mmenu__sub-quick-link">⚙️ JSON Formatter</a>
                    <a href="{{ route('tools.show', 'password-generator') }}" class="mmenu__sub-quick-link">🔑 Password Gen</a>
                    <a href="{{ route('tools.show', 'emi-calculator') }}" class="mmenu__sub-quick-link">🏦 EMI Calculator</a>
                    <a href="{{ route('tools.show', 'base64-encoder-decoder') }}" class="mmenu__sub-quick-link">🔤 Base64 Tool</a>
                    <a href="{{ route('tools.show', 'age-calculator') }}" class="mmenu__sub-quick-link">🎂 Age Calculator</a>
                    <a href="{{ route('tools.show', 'percentage-calculator') }}" class="mmenu__sub-quick-link">🔢 Percentage</a>
                    <a href="{{ route('tools.show', 'lorem-ipsum-generator') }}" class="mmenu__sub-quick-link">📝 Lorem Ipsum</a>
                </div>
                <div class="mmenu__sub-all">
                    <a href="{{ route('tools.index') }}" class="btn btn--sm btn--primary">Browse All {{ $toolsCount }} Tools →</a>
                </div>
            </div>
        </li>
        <li><a href="{{ route('library.index') }}"><span class="mono mmenu__num">03</span>AI Library</a></li>
        <li><a href="{{ route('blueprints.index') }}"><span class="mono mmenu__num">04</span>Blueprints</a></li>
        <li><a href="{{ route('repos.index') }}"><span class="mono mmenu__num">05</span>Repos</a></li>
        <li><a href="/#about"><span class="mono mmenu__num">06</span>About</a></li>
        <li><a href="/#projects"><span class="mono mmenu__num">07</span>Work</a></li>
        <li><a href="{{ route('journal.index') }}"><span class="mono mmenu__num">08</span>Journal</a></li>
        <li><a href="/#contact"><span class="mono mmenu__num">09</span>Contact</a></li>
        <li>
            <button type="button" class="mmenu__subscribe-trigger mono" data-newsletter-trigger>
                <span class="mono mmenu__num">10</span>Subscribe to Dispatch →
            </button>
        </li>
    </ul>
    <p class="mmenu__foot mono">{{ $site['name'] }} — Portfolio Vol. 01</p>
</div>

{{-- Newsletter Subscription Modal --}}
<div class="newsletter-modal" id="newsletter-modal" role="dialog" aria-modal="true" aria-label="Newsletter Subscription" style="display: none;">
    <div class="newsletter-modal__backdrop" data-newsletter-close></div>
    <div class="newsletter-modal__dialog">
        <button type="button" class="newsletter-modal__close" data-newsletter-close aria-label="Close modal">✕</button>
        
        <div class="newsletter-modal__content">
            @include('partials.newsletter', [
                'theme' => 'light',
                'source' => 'navbar_modal',
                'label' => '// THE PRIVATE DISPATCH',
                'title' => 'Stay Ahead of the Autonomous AI Frontier',
                'description' => 'Real-world agent architectures, MCP integrations, and web engineering field notes shipped weekly from Junagadh, Gujarat. Zero spam.',
            ])
        </div>
    </div>
</div>
