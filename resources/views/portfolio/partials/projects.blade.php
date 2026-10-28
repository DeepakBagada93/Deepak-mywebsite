<section class="section projects" id="projects">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">03 — The work</p>
            <h2 class="section__title split-lines"><span>Main projects</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <div class="projects__grid">
            @foreach ($projects as $index => $project)
                @php($link = ($project->link ?? '') ?: '#')
                <article class="work reveal" data-reveal>
                    <p class="work__index mono">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</p>
                    <div class="work__body">
                        <p class="mono work__meta">
                            <span>{{ ($project->tags ?? '') ?: 'Project' }}</span>
                        </p>
                        <h3 class="work__title">{{ $project->title }}</h3>
                        <p class="work__summary">{{ $project->summary }}</p>
                    </div>
                    <div class="work__detail">
                        <p class="work__desc">{{ $project->description }}</p>
                        <a class="work__link mono" href="{{ $link }}" target="{{ ($project->link ?? '') ? '_blank' : '_self' }}" rel="noopener">
                            Visit project →
                        </a>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</section>
