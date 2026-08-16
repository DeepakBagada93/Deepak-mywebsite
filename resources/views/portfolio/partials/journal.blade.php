<section class="section journal" id="journal">
    <div class="container">
        <header class="section__head reveal" data-reveal>
            <p class="mono section__label">04 — The news</p>
            <h2 class="section__title split-lines"><span>From the desk</span></h2>
            <div class="section__rule" aria-hidden="true"></div>
        </header>

        <p class="journal__lede reveal" data-reveal>
            News and notes from the desk of Deepak Bagada — shipped projects, industry
            analysis, and the occasional personal entry. Click any story — it opens in
            a new tab.
        </p>

        <div class="journal__list">
            @forelse ($posts as $post)
                <a class="entry reveal" data-reveal href="{{ route('journal.show', $post->slug) }}" target="_blank" rel="noopener">
                    <div class="entry__meta mono">
                        <span class="entry__tag">{{ strtoupper($post->tag ?? 'NEWS') }}</span>
                        <span class="entry__date">{{ $post->published_at?->format('d M Y') }}</span>
                    </div>
                    <div class="entry__main">
                        <h3 class="entry__title">{{ $post->title }}</h3>
                        <p class="entry__excerpt">{{ $post->excerpt }}</p>
                        <span class="entry__read mono">Read the story →</span>
                    </div>
                </a>
            @empty
                <p class="mono">No entries yet. Add posts via phpMyAdmin → the <code>posts</code> table.</p>
            @endforelse
        </div>

        <p class="journal__footnote mono reveal" data-reveal>
            New stories land here — add your own in phpMyAdmin → <code>posts</code>
        </p>
    </div>
</section>
