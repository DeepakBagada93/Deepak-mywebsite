<section class="hero" id="top">
    <div class="container">
        <p class="hero__kicker mono reveal" data-reveal>
            <span>{{ $site['name'] }}</span>
            <span>Best AI Expert in Gujarat · AI Consultant in Gujarat</span>
        </p>
        <h1 class="hero__title">
            <span class="split-lines"><span>AI systems,</span></span>
            <span class="split-lines"><span>built to <span class="accent">ship.</span></span></span>
        </h1>
        <p class="hero__roles reveal" data-reveal>AI Agent Developer India · Enterprise AI Automation India · Web Developer Junagadh</p>

        <div class="hero__rule" aria-hidden="true"></div>

        <div class="hero__grid">
            <div class="hero__copy">
                <p class="hero__lede reveal" data-reveal>
                    I architect <strong>autonomous AI agents</strong>, <strong>multi-agent systems</strong>, and
                    <strong>custom AI agent development India</strong>-wide that runs 24/7.
                    Based in <strong>Junagadh, Gujarat</strong>, I help teams across India ship production AI
                    systems — not demos.
                </p>
                <div class="hero__cta reveal" data-reveal>
                    <a class="btn btn--solid" href="#contact" data-scroll>Hire AI consultant India-wide</a>
                    <a class="btn btn--ghost" href="{{ route('products.index') }}">Shop AI toolkits</a>
                </div>
            </div>
            <aside class="hero__status" aria-label="Current availability">
                <p class="mono hero__status-label">Currently</p>
                <p class="hero__status-title">Open for AI architecture &amp; consulting.</p>
                <dl class="hero__status-list">
                    <div class="hero__status-row"><dt>Based in</dt><dd>Junagadh, Gujarat · India</dd></div>
                    <div class="hero__status-row"><dt>Focus</dt><dd>Agents · Automation · AEO</dd></div>
                    <div class="hero__status-row"><dt>Stack</dt><dd>Laravel · Python · n8n · MCP</dd></div>
                </dl>
                <a class="mono hero__status-link" href="#contact" data-scroll>Start a project →</a>
            </aside>
        </div>

        @include('portfolio.partials.capabilities')
    </div>

    <div class="hero__scroll mono" data-scroll-hint>
        <span>Scroll</span>
        <span class="hero__scroll-line" aria-hidden="true"></span>
    </div>
</section>
