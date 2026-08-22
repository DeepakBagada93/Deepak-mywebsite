<a class="skill-card reveal" data-reveal data-event="library-skill-view" data-event-label="{{ $skill->slug }}" href="{{ route('library.show', $skill->slug) }}">
    <div class="skill-card__header">
        <span class="mono skill-card__badge">{{ strtoupper($skill->category?->name ?? 'GENERAL') }}</span>
        <span class="mono skill-card__diff skill-card__diff--{{ $skill->difficulty }}">
            {{ $skill->difficulty }}
        </span>
    </div>
    
    <h3 class="skill-card__title">{{ $skill->title }}</h3>
    
    <p class="skill-card__summary">{{ $skill->summary }}</p>
    
    <div class="skill-card__footer mono">
        <span class="skill-card__stars">★ {{ number_format($skill->stars) }} stars</span>
        <span class="skill-card__arrow">Inspect Blueprint →</span>
    </div>
</a>
