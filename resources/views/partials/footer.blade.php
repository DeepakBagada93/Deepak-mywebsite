<footer class="footer">
    <div class="container">
        <div class="footer__top">
            <a class="footer__logo" href="#top" data-scroll style="text-decoration:none;">
                <span class="marvel-logo-badge">{{ $site['name'] }}</span>
            </a>
            <p class="footer__tagline">AI developer · Web developer · SEO &amp; AEO expert — building websites, AI systems and automation from {{ $site['location'] }}.</p>
        </div>

        <div class="footer__newsletter">
            @include('partials.newsletter', [
                'theme' => 'dark',
                'source' => 'footer',
                'label' => '// THE WEEKLY DISPATCH',
                'title' => 'Stay Ahead of the Autonomous AI Frontier',
                'description' => 'Real-world agent architectures, MCP integrations, and web engineering field notes shipped weekly from Junagadh, Gujarat. Zero spam.',
            ])
        </div>

        <div class="footer__grid">
            <div class="footer__col">
                <p class="mono footer__col-title">Explore</p>
                <ul class="footer__col-list">
                    <li><a href="{{ route('products.index') }}">Products &amp; AI toolkits</a></li>
                    <li><a href="{{ route('services.index') }}">Services — web, AI &amp; SEO/AEO</a></li>
                    <li><a href="{{ route('stack.index') }}">Architecture &amp; AI stack</a></li>
                    <li><a href="{{ route('legal.about') }}">About — my story</a></li>
                    <li><a href="#skills" data-scroll>AI skills &amp; services</a></li>
                    <li><a href="#projects" data-scroll>Main projects</a></li>
                    <li><a href="{{ route('journal.index') }}">The news &amp; journal</a></li>
                    <li><a href="{{ route('legal.contact') }}">Contact</a></li>
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Projects</p>
                <ul class="footer__col-list">
                    @foreach ($projects as $project)
                        <li><a href="#projects" data-scroll>{{ $project->title }}</a></li>
                    @endforeach
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Sites</p>
                <ul class="footer__col-list">
                    <li><a href="https://dailyaiworld.com/" target="_blank" rel="noopener noreferrer">Daily AI World ↗</a></li>
                    <li><a href="https://curro.in/" target="_blank" rel="noopener noreferrer">Curro ↗</a></li>
                    <li><a href="https://saasnext.in/" target="_blank" rel="noopener noreferrer">SaaSNext ↗</a></li>
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Contact</p>
                <ul class="footer__col-list">
                    <li><a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a></li>
                    <li>{{ $site['location'] }}</li>
                    <li><a href="#top" data-scroll>Back to top ↑</a></li>
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Open Source</p>
                <ul class="footer__col-list">
                    <li><a href="{{ route('library.index') }}">Skills &amp; MCP library</a></li>
                    <li><a href="{{ route('blueprints.index') }}">Architecture blueprints</a></li>
                    <li><a href="{{ route('repos.index') }}">Curated AI repositories</a></li>
                    <li><a href="https://github.com/DeepakBagada93" target="_blank" rel="noopener noreferrer">GitHub profile ↗</a></li>
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Free Tools</p>
                <ul class="footer__col-list">
                    <li><a href="{{ route('tools.index') }}">All Tools</a></li>
                    <li><a href="{{ route('tools.category', ['category' => 'pdf-document']) }}">PDF Tools</a></li>
                    <li><a href="{{ route('tools.category', ['category' => 'image']) }}">Image Tools</a></li>
                    <li><a href="{{ route('tools.category', ['category' => 'developer']) }}">Developer Tools</a></li>
                    <li><a href="{{ route('tools.category', ['category' => 'calculator']) }}">Calculators</a></li>
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Legal</p>
                <ul class="footer__col-list">
                    <li><a href="{{ route('legal.about') }}">About</a></li>
                    <li><a href="{{ route('legal.contact') }}">Contact</a></li>
                    <li><a href="{{ route('legal.privacy') }}">Privacy Policy</a></li>
                    <li><a href="{{ route('legal.terms') }}">Terms of Service</a></li>
                    <li><a href="{{ route('legal.disclaimer') }}">Disclaimer &amp; Ads</a></li>
                </ul>
            </div>

            <div class="footer__col">
                <p class="mono footer__col-title">Follow</p>
                <ul class="footer__col-list footer__col-list--socials">
                    @foreach ($site['socials'] as $label => $href)
                        <li><a href="{{ $href }}">{{ $label }}</a></li>
                    @endforeach
                </ul>
            </div>
        </div>

        {{-- Marvel Post-Credits Teaser --}}
        <div class="comic-card comic-card--dark" style="margin:48px 0 28px 0;padding:24px 28px;border-color:var(--marvel-red);">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
                <div>
                    <span class="comic-issue-box" style="font-size:0.65rem;background:var(--marvel-red);">POST-CREDITS SCENE // CLASSIFIED</span>
                    <h3 class="font-comic" style="font-size:1.8rem;margin:8px 0 4px 0;color:#ffffff;letter-spacing:0.04em;">
                        DEEPAK BAGADA WILL RETURN IN <span class="text-stark-cyan">AUTONOMOUS MULTI-AGENT SWARMS VOL. 02</span>
                    </h3>
                    <p style="font-size:0.9rem;color:#94a3b8;margin:0;">
                        Building the future of agentic AI systems, enterprise MCP bridges, and zero-downtime automation from Junagadh, Gujarat.
                    </p>
                </div>
                <a href="#top" class="btn--stark" data-scroll style="font-size:0.8rem;padding:8px 16px;">
                    <span>Assemble To Top ↑</span>
                </a>
            </div>
        </div>

        <div class="footer__rule" aria-hidden="true"></div>

        <div class="footer__bottom mono">
            <p>© 2026 {{ $site['name'] }} — {{ $site['location'] }}</p>
            <p>Powered by curious mind &amp; too much coffee ☕</p>
        </div>
    </div>
</footer>
