<footer class="footer">
    <div class="container">
        <div class="footer__top">
            <a class="footer__logo" href="#top" data-scroll>{{ $site['name'] }}</a>
            <p class="footer__tagline">AI developer · Web developer · SEO &amp; AEO expert — building websites, AI systems and automation from {{ $site['location'] }}.</p>
        </div>

        <div class="footer__grid">
            <div class="footer__col">
                <p class="mono footer__col-title">Explore</p>
                <ul class="footer__col-list">
                    <li><a href="{{ route('services.index') }}">Services — web, AI &amp; SEO/AEO</a></li>
                    <li><a href="#about" data-scroll>About — my story</a></li>
                    <li><a href="#skills" data-scroll>AI skills &amp; services</a></li>
                    <li><a href="#projects" data-scroll>Main projects</a></li>
                    <li><a href="#journal" data-scroll>The news &amp; journal</a></li>
                    <li><a href="#contact" data-scroll>Contact</a></li>
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
                <p class="mono footer__col-title">Contact</p>
                <ul class="footer__col-list">
                    <li><a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a></li>
                    <li>{{ $site['location'] }}</li>
                    <li><a href="#top" data-scroll>Back to top ↑</a></li>
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

        <div class="footer__rule" aria-hidden="true"></div>

        <div class="footer__bottom mono">
            <p>© 2026 {{ $site['name'] }} — {{ $site['location'] }}</p>
            <p>Powered by curious mind &amp; too much coffee ☕</p>
        </div>
    </div>
</footer>
