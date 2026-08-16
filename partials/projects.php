<?php // Expects $projects ?>
<section class="section projects" id="projects">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">03 — The work</p>
            <h2 class="section__title split-lines"><span>Main projects</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="projects__grid">
            <?php foreach ($projects as $index => $project): ?>
                <article class="work reveal" data-reveal>
                    <?php $link = ($project['link'] ?? '') ?: '#'; ?>
                    <a class="work__media" href="<?= e($link) ?>" target="<?= ($project['link'] ?? '') ? '_blank' : '_self' ?>" rel="noopener" aria-label="<?= e($project['title']) ?>">
                        <img src="<?= e(($project['image'] ?? '') ?: '/images/projects/project-1.png') ?>"
                             alt="<?= e($project['title']) ?> — project preview"
                             loading="lazy" width="1122" height="1402">
                    </a>
                    <div class="work__body">
                        <p class="mono work__meta">
                            <span>Project <?= str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) ?></span>
                            <span><?= e(($project['tags'] ?? '') ?: 'Project') ?></span>
                        </p>
                        <h3 class="work__title"><?= e($project['title']) ?></h3>
                        <p class="work__summary"><?= e($project['summary']) ?></p>
                        <p class="work__desc"><?= e($project['description']) ?></p>
                        <a class="work__link mono" href="<?= e($link) ?>" target="<?= ($project['link'] ?? '') ? '_blank' : '_self' ?>" rel="noopener">
                            Visit project →
                        </a>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
