<section class="section journal" id="journal">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">04 — The news</p>
            <h2 class="section__title split-lines"><span>From the desk</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <p class="journal__lede reveal" data-reveal>
            News, architectural breakdowns, and field notes from Deepak Bagada — shipped AI agents,
            web engineering, and founder stories.
        </p>

        <div class="journal__list">
            @if (count($posts) === 0)
                <p class="mono">No entries yet. Add posts in <code>data/posts.php</code>.</p>
            @else
                @foreach ($posts as $post)
                    <a class="entry reveal" data-reveal href="{{ route('journal.show', $post->slug) }}">
                        <div class="entry__meta mono">
                            <span class="entry__tag">{{ strtoupper(($post->category ?? '') ?: 'AI DEV') }}</span>
                            <span class="entry__date">{{ $post->date?->format('d M Y') ?? '' }}</span>
                            @if (!empty($post->read_time))
                                <span class="entry__readtime" style="color: var(--muted); font-size: 0.64rem;">{{ $post->read_time }}</span>
                            @endif
                        </div>
                        <div class="entry__main">
                            <h3 class="entry__title">{{ $post->title }}</h3>
                            <p class="entry__excerpt">{{ $post->excerpt }}</p>
                            <span class="entry__read mono">Read the story →</span>
                        </div>
                    </a>
                @endforeach
            @endif
        </div>

        <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 20px;">
            <a class="btn btn--ghost" href="{{ route('journal.index') }}">View all {{ count($posts) }} journal articles →</a>
            <p class="journal__footnote mono reveal" data-reveal style="margin-top: 0;">
                Continuous insights published weekly from Junagadh, Gujarat.
            </p>
        </div>
    </div>
</section>

