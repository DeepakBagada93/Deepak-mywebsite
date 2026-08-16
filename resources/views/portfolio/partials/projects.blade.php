<section class="section projects" id="projects">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">03 — The work</p>
            <h2 class="section__title split-lines"><span>Main projects</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="projects__grid">
            @foreach ($projects as $index => $project)
                <article class="work reveal" data-reveal>
                    <a class="work__media" href="{{ $project->link ?: '#' }}" target="{{ $project->link ? '_blank' : '_self' }}" rel="noopener" aria-label="{{ $project->title }}">
                        <img src="{{ $project->image ?: '/images/projects/project-1.png' }}"
                             alt="{{ $project->title }} — project preview"
                             loading="lazy" width="1122" height="1402">
                    </a>
                    <div class="work__body">
                        <p class="mono work__meta">
                            <span>Project {{ str_pad($index + 1, 2, '0', STR_PAD_LEFT) }}</span>
                            <span>{{ $project->tags ?: 'Project' }}</span>
                        </p>
                        <h3 class="work__title">{{ $project->title }}</h3>
                        <p class="work__summary">{{ $project->summary }}</p>
                        <p class="work__desc">{{ $project->description }}</p>
                        <a class="work__link mono" href="{{ $project->link ?: '#' }}" target="{{ $project->link ? '_blank' : '_self' }}" rel="noopener">
                            Visit project →
                        </a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
