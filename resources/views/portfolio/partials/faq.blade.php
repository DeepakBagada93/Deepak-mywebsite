<section class="section faq" id="faq">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">05 — Straight answers</p>
            <h2 class="section__title split-lines"><span>Questions, answered</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="faq__grid">
            @foreach ($faqs as $faq)
                <details class="faq__item reveal" data-reveal>
                    <summary class="faq__q">{{ $faq->question }}</summary>
                    <p class="faq__a">{{ $faq->answer }}</p>
                </details>
            @endforeach
        </div>
    </div>
</section>
