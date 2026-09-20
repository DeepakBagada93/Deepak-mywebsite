@extends('layouts.app')

@section('content')
<section class="section tools-hub" id="tools">
    <div class="container">
        {{-- Hero --}}
        <div class="section__head" data-reveal>
            <p class="mono section__label">Free Online Tools</p>
            <h1 class="section__title">
                <span class="split-lines">Free Tools Hub</span>
            </h1>
            <p class="tools-hub__lede">25+ free, browser-based tools — PDF, image, developer, calculator & more. No sign-up, no upload to server. Your data never leaves your device.</p>
            <div class="section__rule" aria-hidden="true"></div>
        </div>

        {{-- Search --}}
        <div class="tools-hub__search" data-reveal>
            <input type="text" id="tools-search" class="tools-hub__search-input" placeholder="Search tools… (e.g. PDF, JSON, QR)" autocomplete="off">
        </div>

        {{-- Category Filter Pills --}}
        <div class="tools-hub__filters" data-reveal>
            <a href="{{ route('tools.index') }}" class="pill-btn {{ !$activeCategory ? 'is-active' : '' }}">All Tools</a>
            @foreach ($categories as $catName => $catTools)
                <a href="{{ route('tools.index') }}?category={{ $catTools->first()['category_slug'] }}" 
                   class="pill-btn {{ $activeCategory === $catTools->first()['category_slug'] ? 'is-active' : '' }}">
                    {{ $catTools->first()['category_icon'] }} {{ $catName }}
                </a>
            @endforeach
        </div>

        {{-- Tool count --}}
        <p class="tools-hub__count mono" data-reveal>
            <span id="tools-count">{{ count($filteredTools) }}</span> tools available
            @if ($activeCategory)
                in <strong>{{ $categories->keys()->first(fn($k) => collect($categories[$k])->first()['category_slug'] === $activeCategory) }}</strong>
            @endif
        </p>

        {{-- Tools Grid --}}
        <div class="tools-hub__grid" id="tools-grid">
            @foreach ($filteredTools as $tool)
            <a href="{{ route('tools.show', $tool['slug']) }}" class="tool-card" data-reveal data-name="{{ strtolower($tool['name']) }}" data-keywords="{{ strtolower($tool['keywords']) }}">
                <div class="tool-card__icon">{{ $tool['icon'] }}</div>
                <div class="tool-card__body">
                    <h2 class="tool-card__title">{{ $tool['name'] }}</h2>
                    <p class="tool-card__desc">{{ $tool['description'] }}</p>
                </div>
                <div class="tool-card__foot">
                    <span class="mono tool-card__cat">{{ $tool['category_icon'] }} {{ $tool['category'] }}</span>
                    <span class="mono tool-card__arrow">Open →</span>
                </div>
            </a>
            @endforeach
        </div>

        {{-- No results --}}
        <div class="tools-hub__empty" id="tools-empty" style="display:none;">
            <p class="tools-hub__empty-icon">🔍</p>
            <p class="tools-hub__empty-text">No tools found. Try a different search term.</p>
        </div>

        {{-- Privacy note --}}
        <div class="tools-hub__privacy" data-reveal>
            <div class="tools-hub__privacy-card">
                <p class="tools-hub__privacy-icon">🔒</p>
                <div>
                    <p class="tools-hub__privacy-title">100% Privacy — Your Data Never Leaves Your Device</p>
                    <p class="tools-hub__privacy-desc">Every tool on this page runs entirely in your browser. No files are uploaded to any server. No data is stored. No accounts needed.</p>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- Client-side search --}}
<script>
document.addEventListener('DOMContentLoaded', function() {
    const search = document.getElementById('tools-search');
    const grid = document.getElementById('tools-grid');
    const empty = document.getElementById('tools-empty');
    const count = document.getElementById('tools-count');
    if (!search || !grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.tool-card'));
    
    search.addEventListener('input', function() {
        const q = this.value.toLowerCase().trim();
        let visible = 0;
        
        cards.forEach(function(card) {
            const name = card.getAttribute('data-name') || '';
            const keywords = card.getAttribute('data-keywords') || '';
            const match = !q || name.includes(q) || keywords.includes(q);
            card.style.display = match ? '' : 'none';
            if (match) visible++;
        });
        
        if (count) count.textContent = visible;
        if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
    });
});
</script>
@endsection
