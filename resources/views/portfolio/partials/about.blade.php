<section class="section about" id="about">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">01 — The beginning</p>
            <h2 class="section__title split-lines"><span>My story so far</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="about__grid">
            <figure class="about__figure reveal" data-reveal>
                <img src="/images/about-portrait.png" 
                     alt="Deepak Bagada — Best Web Developer, AI Expert, Social Media Marketer & Automation Expert in Junagadh Gujarat" 
                     title="Deepak Bagada — Best Web Developer, AI Expert, Social Media Marketer & Automation Expert"
                     loading="eager"
                     fetchpriority="high"
                     width="1122" 
                     height="1402">
                <figcaption class="mono">Fig. 02 — Deepak Bagada on the job</figcaption>
            </figure>

            <div class="about__copy">
                <p class="about__pull reveal" data-reveal>
                    “I write high-performance code, drive viral growth marketing, and build autonomous AI systems.”
                </p>

                <p class="reveal" data-reveal>
                    My journey started with <strong>web development</strong>. I built my first website years ago and mastered 
                    <strong>Laravel, PHP, modern JavaScript, and high-speed web architecture</strong>. I believe great code is clean, 
                    resilient, and built to convert visitors into lifelong clients.
                </p>

                <p class="reveal" data-reveal>
                    Next came <strong>social media marketing and growth strategy</strong>. Great code is worthless if nobody sees it. 
                    I mastered organic content distribution, viral short-form scripting, technical SEO, and AEO (Answer Engine Optimization) 
                    to ensure websites rank #1 on Google and get cited as the top recommendation in AI Overviews.
                </p>

                <p class="reveal" data-reveal>
                    Then <strong>AI and automation</strong> changed the entire game. Today, as an <strong>AI Expert and Automation Engineer</strong>, 
                    I build custom <strong>AI agents, multi-agent pipelines, RAG knowledge bases, and end-to-end workflow automations</strong> 
                    that run businesses 24/7 without manual friction. Based in <strong>Junagadh, Gujarat</strong>, I help clients across India and globally scale faster.
                </p>

                <dl class="about__facts reveal" data-reveal>
                    <div class="about__fact"><dt>Name</dt><dd>{{ $site['name'] }}</dd></div>
                    <div class="about__fact"><dt>Expertise</dt><dd>Web · AI · Marketing · Automation</dd></div>
                    <div class="about__fact"><dt>Based</dt><dd>{{ $site['location'] }}</dd></div>
                    <div class="about__fact"><dt>Status</dt><dd>Open to high-impact projects</dd></div>
                </dl>
            </div>
        </div>

        <div class="about__stats">
            <div class="stat reveal" data-reveal>
                <p class="stat__num" data-count="5">0</p>
                <p class="mono stat__label">Years shipping</p>
            </div>
            <div class="stat reveal" data-reveal>
                <p class="stat__num" data-count="40">0</p>
                <p class="mono stat__label">Projects built</p>
            </div>
            <div class="stat reveal" data-reveal>
                <p class="stat__num" data-count="200">0</p>
                <p class="mono stat__label">Avg. growth %</p>
            </div>
            <div class="stat reveal" data-reveal>
                <p class="stat__num" data-count="999">0</p>
                <p class="mono stat__label">Coffees drank</p>
            </div>
        </div>

        {{-- Life story timeline --}}
        <div class="timeline">
            <p class="mono timeline__label reveal" data-reveal>Entry by entry</p>
            <ol class="timeline__list">
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2018</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Started Web Development</h3>
                        <p>Mastered core web fundamentals: HTML, CSS, JavaScript, and database architecture.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2020</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Social Media Marketing &amp; SEO</h3>
                        <p>Discovered performance marketing, SEO, and audience growth systems that scale businesses organically.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2021</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Full-Stack Laravel Engineering</h3>
                        <p>Delivered enterprise-grade web applications, custom CMS architectures, and high-traffic portals.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2023</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">AI Development &amp; LLM Engineering</h3>
                        <p>Engineered deep integrations with LLMs, RAG knowledge bases, and custom prompt optimization pipelines.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2024</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Launched Curro &amp; Multi-Agent AI</h3>
                        <p>Created Curro — an autonomous AI content studio combining high-end code, marketing intelligence, and AI agents.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2026</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Autonomous Workflow Automation</h3>
                        <p>Building full-stack web platforms, multi-agent AI ecosystems, and complete business workflow automations.</p>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</section>
