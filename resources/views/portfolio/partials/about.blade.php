<section class="section about" id="about">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">01 — The beginning</p>
            <h2 class="section__title split-lines"><span>My story so far</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="about__grid">
            <figure class="about__figure reveal" data-reveal>
                <img src="/images/about-portrait.png" alt="Portrait of Deepak Bagada" width="1122" height="1402">
                <figcaption class="mono">Fig. 02 — On the job</figcaption>
            </figure>

            <div class="about__copy">
                <p class="about__pull reveal" data-reveal>
                    “I started with code, learned marketing, and let AI change the game.”
                </p>

                <p class="reveal" data-reveal>
                    My story starts with <strong>code</strong>. I built my first website
                    years ago — ugly, slow, and entirely mine. I fell in love with the
                    feeling of making something that worked, and I've been shipping
                    ever since: HTML, CSS, JavaScript, then <strong>Laravel</strong>.
                </p>

                <p class="reveal" data-reveal>
                    Then I learned <strong>marketing</strong> — and realised great code means
                    nothing if nobody sees it. SEO, content, growth: the skills that turn a
                    build into a business. That combination became my edge: I don't just
                    make things, I make sure they work in the real world.
                </p>

                <p class="reveal" data-reveal>
                    Then <strong>AI</strong> changed everything. Today I build wonderful
                    websites, <strong>AI systems</strong>, <strong>AI agents</strong> and
                    <strong>automation</strong> — products that think, write, and work while
                    you sleep. Based in <strong>Junagadh, Gujarat</strong>, I work with clients
                    everywhere, and I optimise everything I build to rank on Google and in AI
                    answers. One person who can code it, market it, and put an AI inside it.
                    The chapters below are the honest record of how I got here.
                </p>

                <dl class="about__facts reveal" data-reveal>
                    <div class="about__fact"><dt>Name</dt><dd>{{ $site['name'] }}</dd></div>
                    <div class="about__fact"><dt>Role</dt><dd>AI · Web · Marketing</dd></div>
                    <div class="about__fact"><dt>Based</dt><dd>{{ $site['location'] }}</dd></div>
                    <div class="about__fact"><dt>Status</dt><dd>Open to work</dd></div>
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
                        <h3 class="timeline__title">Started coding</h3>
                        <p>Bought my first domain, built my first website. HTML, CSS, JavaScript — ugly, slow, and mine.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2020</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Discovered marketing</h3>
                        <p>Learned that great code means nothing if nobody sees it. Fell for SEO, content, and growth.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2021</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">First real website</h3>
                        <p>Shipped a paid Laravel build. Someone I'd never met used something I made. That feeling stuck.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2023</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Met AI</h3>
                        <p>First experiments with large language models. Knew instantly this was the next decade of my career.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2024</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Launched Curro</h3>
                        <p>My first product with an LLM under the hood — an AI content studio. Code + marketing + AI finally clicked.</p>
                    </div>
                </li>
                <li class="timeline__entry reveal" data-reveal>
                    <p class="timeline__year">2026</p>
                    <div class="timeline__body">
                        <h3 class="timeline__title">Today</h3>
                        <p>Building wonderful websites, AI systems, and automation — end to end. The story keeps going.</p>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</section>
