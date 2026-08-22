<div class="category-filter">
    <a href="{{ route('library.index') }}" class="pill-btn {{ empty($selectedCategorySlug) ? 'is-active' : '' }}">
        All Skills
    </a>
    @foreach ($categories as $cat)
        <a href="{{ route('library.index', ['category' => $cat->slug]) }}"
           class="pill-btn {{ ($selectedCategorySlug ?? '') === $cat->slug ? 'is-active' : '' }}">
            {{ $cat->name }}
        </a>
    @endforeach
</div>
