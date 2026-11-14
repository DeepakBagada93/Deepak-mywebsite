@php
    $toolsList = config('tools');
    $toolsCount = count($toolsList);
    $toolCategories = collect($toolsList)->groupBy('category');

    // Build comprehensive, instant client-side search index
    $searchIndex = [];
    foreach ($toolsList as $t) {
        $searchIndex[] = [
            'type' => 'tool',
            'badge' => 'Tool',
            'title' => $t['name'],
            'url' => route('tools.show', $t['slug']),
            'icon' => $t['icon'] ?? '⚙️',
            'category' => $t['category'] ?? 'Developer Tools',
            'desc' => $t['description'] ?? '',
            'keywords' => $t['keywords'] ?? '',
        ];
    }
    $searchIndex[] = [
        'type' => 'doc',
        'badge' => 'Docs',
        'title' => 'Services & Consulting',
        'url' => route('services.index'),
        'icon' => '⚡',
        'category' => 'Engineering',
        'desc' => 'Autonomous Multi-Agent AI systems, Custom RAG, and Web Apps.',
        'keywords' => 'services ai agents consulting fullstack web development',
    ];
    $searchIndex[] = [
        'type' => 'doc',
        'badge' => 'Docs',
        'title' => 'AI Architecture Library',
        'url' => route('library.index'),
        'icon' => '📚',
        'category' => 'Architecture',
        'desc' => 'Production agent frameworks, MCP servers, and system prompts.',
        'keywords' => 'library agents mcp prompts rag langgraph',
    ];
    $searchIndex[] = [
        'type' => 'doc',
        'badge' => 'Docs',
        'title' => 'Architecture Blueprints',
        'url' => route('blueprints.index'),
        'icon' => '📐',
        'category' => 'Architecture',
        'desc' => 'Visual system architecture and multi-agent interaction blueprints.',
        'keywords' => 'blueprints diagrams architecture flowcharts',
    ];
    $searchIndex[] = [
        'type' => 'doc',
        'badge' => 'Docs',
        'title' => 'Curated Open-Source Repos',
        'url' => route('repos.index'),
        'icon' => '🐙',
        'category' => 'Open Source',
        'desc' => 'Strictly vetted open-source AI repositories and local LLM engines.',
        'keywords' => 'repos github open source models llms',
    ];
    $searchIndex[] = [
        'type' => 'doc',
        'badge' => 'Docs',
        'title' => 'Production AI Stack',
        'url' => route('stack.index'),
        'icon' => '🏗️',
        'category' => 'Stack',
        'desc' => 'Autonomous content, research, and motion-render pipeline architecture.',
        'keywords' => 'stack pipeline architecture tools tech stack',
    ];
    $searchIndex[] = [
        'type' => 'product',
        'badge' => 'Armory',
        'title' => 'Armory — Digital Products',
        'url' => route('products.index'),
        'icon' => '🛒',
        'category' => 'Store',
        'desc' => 'Battle-tested AI developer toolkits, starter packs, and templates.',
        'keywords' => 'store products armory toolkits buy digital templates',
    ];
    $searchIndex[] = [
        'type' => 'product',
        'badge' => 'Armory',
        'title' => 'Track Product Order',
        'url' => route('products.track'),
        'icon' => '📦',
        'category' => 'Store',
        'desc' => 'Look up your digital product order and re-download purchased assets.',
        'keywords' => 'track order download purchase license',
    ];
    $searchIndex[] = [
        'type' => 'journal',
        'badge' => 'Journal',
        'title' => 'Journal & Field Notes',
        'url' => route('journal.index'),
        'icon' => '✍️',
        'category' => 'Writing',
        'desc' => 'Deep-dive technical articles, empirical benchmarks, and AI field notes.',
        'keywords' => 'journal blog articles tutorials engineering',
    ];
    $searchIndex[] = [
        'type' => 'company',
        'badge' => 'About',
        'title' => 'About Deepak Bagada',
        'url' => route('legal.about'),
        'icon' => '👤',
        'category' => 'Company',
        'desc' => 'AI Expert, Agent Architect, and Full-Stack Web Developer.',
        'keywords' => 'about deepak bagada bio experience contact',
    ];
    $searchIndex[] = [
        'type' => 'company',
        'badge' => 'Contact',
        'title' => 'Contact & Hire',
        'url' => route('legal.contact'),
        'icon' => '✉️',
        'category' => 'Company',
        'desc' => 'Direct inquiry for custom AI systems, consulting, or full-stack builds.',
        'keywords' => 'contact hire email inquiry message',
    ];
@endphp

{{-- Global Search Data Payload for Instant 0ms Command Palette --}}
<script id="doc-search-data" type="application/json">{!! json_encode($searchIndex, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

<header class="masthead doc-masthead" id="masthead">
    <div class="masthead__row">
        {{-- Brand / Logo & Documentation Edition Badge --}}
        <div class="masthead__brand-container">
            <a class="masthead__logo" href="/" aria-label="{{ $site['name'] }} — Home">
                <span class="marvel-logo-badge">{{ $site['name'] }}</span>
            </a>
            <span class="doc-brand-divider" aria-hidden="true">/</span>
            <a href="{{ route('stack.index') }}" class="doc-edition-badge font-hud" title="View Production Stack Documentation">
                <span class="arc-reactor-dot" aria-hidden="true"></span>
                <span class="doc-edition-text">DOCS // v2026</span>
            </a>
        </div>

        {{-- Desktop Navigation Tabs (Doc Style) --}}
        <nav class="masthead__nav" id="nav" aria-label="Documentation Navigation">
            <a href="{{ route('services.index') }}" class="masthead__nav-link {{ request()->routeIs('services.*') ? 'is-active' : '' }}">
                Services
            </a>

            {{-- Tools Nav Item with Mega-Menu Popover --}}
            <div class="masthead__nav-item" id="tools-nav-item">
                <button type="button" class="masthead__nav-trigger {{ request()->routeIs('tools.*') ? 'is-active' : '' }}" id="tools-trigger" aria-expanded="false" aria-controls="tools-popover">
                    <span>Tools</span>
                    <svg class="doc-nav-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                {{-- Desktop Floating Mega-Menu Popover Card --}}
                <div class="tools-popover doc-tools-popover" id="tools-popover" role="region" aria-label="Developer Tools Toolkit">
                    <div class="tools-popover__head">
                        <div class="tools-popover__head-meta">
                            <span class="mono tools-popover__title">Developer Toolkit</span>
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
                                        <small>Combine PDFs securely in browser</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'image-compressor') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">🖼️</span>
                                    <div class="tools-popover__item-text">
                                        <strong>Image Compressor</strong>
                                        <small>Shrink PNG, JPG &amp; WebP losslessly</small>
                                    </div>
                                </a>
                                <a href="{{ route('tools.show', 'qr-code-generator') }}" class="tools-popover__item">
                                    <span class="tools-popover__item-icon">📱</span>
                                    <div class="tools-popover__item-text">
                                        <strong>QR Code Generator</strong>
                                        <small>Instant URL, WiFi &amp; custom PNGs</small>
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
                                        <small>Beautify, minify &amp; validate</small>
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
                                @foreach ($toolCategories as $categoryName => $categoryTools)
                                <a href="{{ route('tools.category', ['category' => $categoryTools->first()['category_slug'] ?? Str::slug($categoryName)]) }}" class="tools-popover__cat-card">
                                    <span class="tools-popover__cat-icon">{{ $categoryTools->first()['category_icon'] ?? '🔧' }}</span>
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

            <a href="{{ route('library.index') }}" class="masthead__nav-link {{ request()->routeIs('library.*') ? 'is-active' : '' }}">
                Library
            </a>

            <a href="{{ route('blueprints.index') }}" class="masthead__nav-link {{ request()->routeIs('blueprints.*') ? 'is-active' : '' }}">
                Blueprints
            </a>

            <a href="{{ route('repos.index') }}" class="masthead__nav-link {{ request()->routeIs('repos.*') ? 'is-active' : '' }}">
                Repos
            </a>

            <a href="{{ route('products.index') }}" class="masthead__nav-link masthead__nav-link--armory {{ request()->routeIs('products.*') ? 'is-active' : '' }}">
                <span>Armory</span>
                <span class="doc-pro-pill">PRO</span>
            </a>

            <a href="{{ route('journal.index') }}" class="masthead__nav-link {{ request()->routeIs('journal.*') ? 'is-active' : '' }}">
                Journal
            </a>

            <a href="{{ route('stack.index') }}" class="masthead__nav-link {{ request()->routeIs('stack.index') ? 'is-active' : '' }}">
                Stack
            </a>
        </nav>

        {{-- Doc Header Actions (Search, Cart, Contact, Burger) --}}
        <div class="masthead__meta">
            {{-- Desktop Doc Search Trigger Bar (Command Palette ⌘K) --}}
            <button type="button" class="doc-search-trigger" id="doc-search-trigger" aria-label="Search documentation, tools, architectures (Press ⌘K or /)">
                <svg class="doc-search-trigger__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span class="doc-search-trigger__placeholder">Search docs, tools...</span>
                <kbd class="doc-search-trigger__kbd"><abbr title="Command">⌘</abbr>K</kbd>
            </button>

            {{-- Mobile & Tablet Quick Search Icon Button --}}
            <button type="button" class="doc-search-trigger-mobile" id="doc-search-trigger-mobile" aria-label="Search documentation and tools">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>

            {{-- Shopping Cart Button with Dynamic Badge --}}
            <button type="button" class="masthead__cart-btn doc-cart-btn" data-open-cart aria-label="Open Shopping Cart">
                <svg class="doc-cart-btn__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span class="doc-cart-btn__text">Cart</span>
                <span class="masthead__cart-badge doc-cart-badge" id="masthead-cart-count" style="display:none">0</span>
            </button>

            {{-- Desktop Primary Action (Contact / Hire) --}}
            <a href="{{ route('legal.contact') }}" class="doc-cta-btn mono">
                <span>Hire</span>
            </a>

            {{-- Mobile Animated Hamburger Toggle --}}
            <button class="masthead__burger doc-burger" id="burger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mmenu">
                <span class="doc-burger__bar"></span>
                <span class="doc-burger__bar"></span>
                <span class="doc-burger__bar"></span>
            </button>
        </div>
    </div>
</header>

{{-- Documentation Command Palette & Search Modal (⌘K / / / Click) --}}
<div class="doc-search-modal" id="doc-search-modal" role="dialog" aria-modal="true" aria-label="Search documentation, tools and library" style="display: none;">
    <div class="doc-search-backdrop" id="doc-search-backdrop"></div>
    <div class="doc-search-window">
        <div class="doc-search-header">
            <svg class="doc-search-header__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="doc-search-input" id="doc-search-input" placeholder="Search docs, 28 tools, architecture, products..." autocomplete="off" spellcheck="false">
            <button type="button" class="doc-search-close-btn" id="doc-search-close" aria-label="Close search">ESC</button>
        </div>

        {{-- Category Quick Filter Chips --}}
        <div class="doc-search-filters" role="tablist" aria-label="Search Filter">
            <button type="button" class="doc-search-filter-btn is-active" data-filter="all">All</button>
            <button type="button" class="doc-search-filter-btn" data-filter="tool">Tools ({{ $toolsCount }})</button>
            <button type="button" class="doc-search-filter-btn" data-filter="doc">Docs &amp; Stack</button>
            <button type="button" class="doc-search-filter-btn" data-filter="product">Armory (Store)</button>
            <button type="button" class="doc-search-filter-btn" data-filter="journal">Journal</button>
        </div>

        {{-- Live Search Results List --}}
        <div class="doc-search-results" id="doc-search-results" role="listbox">
            {{-- Results dynamically rendered by main.js --}}
        </div>

        {{-- Footer Keyboard Navigation Hints --}}
        <div class="doc-search-footer">
            <div class="doc-search-shortcuts">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
            </div>
            <span class="mono doc-search-count-label" id="doc-search-count">{{ count($searchIndex) }} items indexed</span>
        </div>
    </div>
</div>

{{-- Mobile Menu Drawer (Doc Style) --}}
<div class="mmenu doc-mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="mmenu__top">
        <div class="mmenu__brand-group">
            <span class="marvel-logo-badge" style="font-size:1.15rem;padding:2px 8px;">{{ $site['name'] }}</span>
            <span class="doc-edition-badge font-hud" style="font-size:0.6rem;padding:2px 6px;">
                <span class="arc-reactor-dot"></span>
                <span>DOCS</span>
            </span>
        </div>
        <button type="button" class="mmenu__close doc-mmenu-close" id="mmenu-close" aria-label="Close menu">
            <span>✕ Close</span>
        </button>
    </div>

    {{-- Fast Search Box inside Mobile Drawer --}}
    <div class="mmenu__search-container">
        <button type="button" class="mmenu__search-btn" id="mmenu-search-trigger">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search docs, tools, library...</span>
            <kbd class="mono">⌘K</kbd>
        </button>
    </div>

    <div class="mmenu__scroll-content">
        {{-- Section 01: Core Platform & Documentation --}}
        <div class="mmenu__section">
            <p class="mono mmenu__section-label">// CORE PLATFORM &amp; DOCS</p>
            <ul class="mmenu__links-list">
                <li><a href="{{ route('services.index') }}"><span class="mmenu__item-icon">⚡</span><span>Services &amp; Consulting</span></a></li>
                <li><a href="{{ route('library.index') }}"><span class="mmenu__item-icon">📚</span><span>AI Architecture Library</span></a></li>
                <li><a href="{{ route('blueprints.index') }}"><span class="mmenu__item-icon">📐</span><span>System Blueprints</span></a></li>
                <li><a href="{{ route('repos.index') }}"><span class="mmenu__item-icon">🐙</span><span>Curated Repos</span></a></li>
                <li><a href="{{ route('stack.index') }}"><span class="mmenu__item-icon">🏗️</span><span>Production AI Stack</span></a></li>
            </ul>
        </div>

        {{-- Section 02: Developer Toolkit (Expandable Accordion) --}}
        <div class="mmenu__section">
            <p class="mono mmenu__section-label">// DEVELOPER SUITE</p>
            <div class="mmenu__expandable" data-open="false">
                <button class="mmenu__expand-btn" aria-expanded="false" type="button">
                    <span class="mmenu__item-icon">🛠️</span>
                    <span class="mmenu__expand-text">Developer Tools <span class="doc-badge-pill mono">{{ $toolsCount }} Free</span></span>
                    <span class="mmenu__expand-icon" aria-hidden="true">+</span>
                </button>
                <div class="mmenu__sub">
                    <div class="mmenu__sub-quick">
                        <a href="{{ route('tools.show', 'pdf-merge') }}" class="mmenu__sub-quick-link">📄 PDF Merge</a>
                        <a href="{{ route('tools.show', 'pdf-split') }}" class="mmenu__sub-quick-link">✂️ PDF Split</a>
                        <a href="{{ route('tools.show', 'image-compressor') }}" class="mmenu__sub-quick-link">🖼️ Image Compressor</a>
                        <a href="{{ route('tools.show', 'qr-code-generator') }}" class="mmenu__sub-quick-link">📱 QR Code</a>
                        <a href="{{ route('tools.show', 'gst-calculator') }}" class="mmenu__sub-quick-link">💰 GST Calculator</a>
                        <a href="{{ route('tools.show', 'json-formatter') }}" class="mmenu__sub-quick-link">⚙️ JSON Formatter</a>
                        <a href="{{ route('tools.show', 'password-generator') }}" class="mmenu__sub-quick-link">🔑 Password Gen</a>
                        <a href="{{ route('tools.show', 'emi-calculator') }}" class="mmenu__sub-quick-link">🏦 EMI Calculator</a>
                        <a href="{{ route('tools.show', 'base64-encoder-decoder') }}" class="mmenu__sub-quick-link">🔤 Base64 Tool</a>
                        <a href="{{ route('tools.show', 'word-counter') }}" class="mmenu__sub-quick-link">📊 Word Counter</a>
                        <a href="{{ route('tools.show', 'age-calculator') }}" class="mmenu__sub-quick-link">🎂 Age Calculator</a>
                        <a href="{{ route('tools.show', 'percentage-calculator') }}" class="mmenu__sub-quick-link">🔢 Percentage</a>
                    </div>
                    <div class="mmenu__sub-all">
                        <a href="{{ route('tools.index') }}" class="btn btn--sm btn--primary" style="width:100%;text-align:center;">Browse All {{ $toolsCount }} Tools →</a>
                    </div>
                </div>
            </div>
        </div>

        {{-- Section 03: Armory & Commercial Products --}}
        <div class="mmenu__section">
            <p class="mono mmenu__section-label">// ARMORY &amp; PRODUCTS</p>
            <ul class="mmenu__links-list">
                <li>
                    <a href="{{ route('products.index') }}" class="mmenu__link-armory">
                        <span class="mmenu__item-icon">🛒</span>
                        <span>Digital Products Store</span>
                        <span class="doc-pro-pill" style="margin-left:auto;">PRO</span>
                    </a>
                </li>
                <li>
                    <button type="button" class="mmenu__cart-btn" data-open-cart>
                        <span class="mmenu__item-icon">🛍️</span>
                        <span>View Cart</span>
                        <span class="doc-cart-badge mmenu-cart-count" style="display:none;margin-left:auto;">0</span>
                    </button>
                </li>
                <li><a href="{{ route('products.track') }}"><span class="mmenu__item-icon">📦</span><span>Track Order</span></a></li>
            </ul>
        </div>

        {{-- Section 04: Journal & Company --}}
        <div class="mmenu__section">
            <p class="mono mmenu__section-label">// DISPATCHES &amp; COMPANY</p>
            <ul class="mmenu__links-list">
                <li><a href="{{ route('journal.index') }}"><span class="mmenu__item-icon">✍️</span><span>Technical Journal</span></a></li>
                <li><a href="{{ route('legal.about') }}"><span class="mmenu__item-icon">👤</span><span>About Deepak Bagada</span></a></li>
                <li><a href="{{ route('legal.contact') }}"><span class="mmenu__item-icon">✉️</span><span>Contact / Hire Me</span></a></li>
            </ul>
        </div>

        {{-- Mobile Drawer Action Buttons --}}
        <div class="mmenu__action-group">
            <button type="button" class="btn btn--primary mmenu__subscribe-trigger mono" data-newsletter-trigger style="width:100%;margin-bottom:10px;">
                ⚡ Subscribe to Dispatch
            </button>
            <a href="{{ route('legal.contact') }}" class="btn btn--sm mono" style="display:block;text-align:center;border-color:var(--hair);">
                Initiate Mission →
            </a>
        </div>

        {{-- Social links row --}}
        <div class="mmenu__socials">
            <a href="{{ $site['socials']['GitHub'] ?? 'https://github.com/DeepakBagada93' }}" target="_blank" rel="noopener noreferrer" class="mmenu__social-link mono">GitHub</a>
            <a href="{{ $site['socials']['LinkedIn'] ?? '#' }}" target="_blank" rel="noopener noreferrer" class="mmenu__social-link mono">LinkedIn</a>
            <a href="{{ $site['socials']['X'] ?? '#' }}" target="_blank" rel="noopener noreferrer" class="mmenu__social-link mono">X (Twitter)</a>
            <a href="{{ $site['socials']['Instagram'] ?? '#' }}" target="_blank" rel="noopener noreferrer" class="mmenu__social-link mono">Instagram</a>
        </div>

        <p class="mmenu__foot mono">{{ $site['name'] }} · Junagadh, Gujarat, India · 100% Autonomous</p>
    </div>
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
