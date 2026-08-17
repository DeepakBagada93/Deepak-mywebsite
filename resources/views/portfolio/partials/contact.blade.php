<section class="section contact" id="contact">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">06 — Contact</p>
            <h2 class="section__title split-lines"><span>Get in touch</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="contact__grid">
            <div class="contact__info">
                <p class="contact__intro reveal" data-reveal>
                    Have an idea, a project, or a wild experiment? Write to me —
                    I usually reply within a day.
                </p>
                <ul class="contact__list mono reveal" data-reveal>
                    <li><span>Email</span><a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a></li>
                    @if (!empty($site['phone']))
                        <li><span>Phone</span><a href="tel:{{ preg_replace('/[^0-9+]/', '', $site['phone']) }}">{{ $site['phone'] }}</a></li>
                    @endif
                    <li><span>Base</span>{{ $site['location'] }}</li>
                </ul>
                <div class="contact__socials mono reveal" data-reveal>
                    @foreach ($site['socials'] as $label => $href)
                        <a href="{{ $href }}">{{ $label }}</a>
                    @endforeach
                </div>
            </div>

            <div class="contact__card reveal" data-reveal>
                <p class="contact__card-label mono">Say hello</p>
                <a class="contact__card-email" href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a>
                <p class="contact__card-note">Websites · AI systems · Automation — one inbox, all of it.</p>
            </div>
        </div>
    </div>
</section>
