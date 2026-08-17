<?php // Expects $faqs (from faqs()) ?>
<section class="section faq" id="faq">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">05 — Straight answers</p>
            <h2 class="section__title split-lines"><span>Questions, answered</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="faq__grid">
            <?php foreach ($faqs as $faq): ?>
                <details class="faq__item reveal" data-reveal>
                    <summary class="faq__q"><?= e($faq['question']) ?></summary>
                    <p class="faq__a"><?= e($faq['answer']) ?></p>
                </details>
            <?php endforeach; ?>
        </div>
    </div>
</section>
