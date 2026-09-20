<header class="masthead" id="masthead">
    <div class="masthead__row">
        <a class="masthead__logo" href="/">{{ $site['name'] }}</a>

        <nav class="masthead__nav" id="nav">
            <a href="{{ route('services.index') }}">Services</a>
            <a href="/#about">About</a>
            <div class="masthead__nav-item" id="tools-nav-item">
                <a href="{{ route('tools.index') }}" class="masthead__nav-trigger" id="tools-trigger" aria-expanded="false" aria-controls="tools-mega">
                    Tools <span class="masthead__nav-arrow" aria-hidden="true">▾</span>
                </a>
            </div>
            <a href="{{ route('library.index') }}">Library</a>
            <a href="{{ route('journal.index') }}">Journal</a>
            <a href="/#contact">Contact</a>
        </nav>

        <div class="masthead__meta">
            <span class="masthead__issue mono">Vol. 01 — 2026</span>
            <button class="masthead__burger mono" id="burger" aria-label="Open menu" aria-expanded="false">Menu</button>
        </div>
    </div>

    {{-- Desktop Mega Menu (Edge-to-Edge, Structured 6 Columns) --}}
    <div class="megamenu" id="tools-mega" aria-hidden="true">
        <div class="megamenu__inner">
            <div class="megamenu__grid">
                @php $toolCategories = collect(config('tools'))->groupBy('category'); @endphp
                @foreach ($toolCategories as $categoryName => $categoryTools)
                <div class="megamenu__col">
                    <p class="mono megamenu__cat">{{ $categoryTools->first()['category_icon'] }} {{ $categoryName }}</p>
                    <ul class="megamenu__list">
                        @foreach ($categoryTools->take(4) as $t)
                        <li><a href="{{ route('tools.show', $t['slug']) }}">{{ $t['icon'] }} {{ $t['name'] }}</a></li>
                        @endforeach
                    </ul>
                    <a href="{{ route('tools.index') }}?category={{ $categoryTools->first()['category_slug'] }}" class="megamenu__more mono">All {{ $categoryTools->count() }} →</a>
                </div>
                @endforeach
            </div>
            <div class="megamenu__bar">
                <div class="megamenu__bar-info mono">
                    <span>34 Free Tools</span>
                    <span class="megamenu__bar-dot">·</span>
                    <span>100% Browser-Based</span>
                    <span class="megamenu__bar-dot">·</span>
                    <span>Zero Server Uploads</span>
                </div>
                <a href="{{ route('tools.index') }}" class="btn btn--solid megamenu__bar-btn">Browse Hub →</a>
            </div>
        </div>
    </div>
</header>

{{-- Backdrop for Desktop Mega Menu --}}
<div class="megamenu-backdrop" id="megamenu-backdrop" aria-hidden="true"></div>

{{-- Mobile menu --}}
<div class="mmenu" id="mmenu">
    <ul class="mmenu__list">
        <li><a href="{{ route('services.index') }}"><span class="mono mmenu__num">01</span>Services</a></li>
        <li class="mmenu__expandable">
            <button class="mmenu__expand-btn" aria-expanded="false" type="button">
                <span class="mono mmenu__num">02</span>Tools <span class="mmenu__expand-icon">+</span>
            </button>
            <ul class="mmenu__sub">
                @php $mobileToolCats = collect(config('tools'))->groupBy('category'); @endphp
                @foreach ($mobileToolCats as $catName => $catTools)
                <li class="mmenu__sub-cat">
                    <span class="mono mmenu__sub-label">{{ $catTools->first()['category_icon'] }} {{ $catName }}</span>
                    <ul>
                        @foreach ($catTools->take(3) as $mt)
                        <li><a href="{{ route('tools.show', $mt['slug']) }}">{{ $mt['icon'] }} {{ $mt['name'] }}</a></li>
                        @endforeach
                        @if ($catTools->count() > 3)
                        <li><a href="{{ route('tools.index') }}?category={{ $catTools->first()['category_slug'] }}" class="mmenu__sub-more">All {{ $catName }} →</a></li>
                        @endif
                    </ul>
                </li>
                @endforeach
                <li class="mmenu__sub-all"><a href="{{ route('tools.index') }}">Browse All Tools →</a></li>
            </ul>
        </li>
        <li><a href="{{ route('library.index') }}"><span class="mono mmenu__num">03</span>AI Library</a></li>
        <li><a href="{{ route('blueprints.index') }}"><span class="mono mmenu__num">04</span>Blueprints</a></li>
        <li><a href="{{ route('repos.index') }}"><span class="mono mmenu__num">05</span>Repos</a></li>
        <li><a href="/#about"><span class="mono mmenu__num">06</span>About</a></li>
        <li><a href="/#projects"><span class="mono mmenu__num">07</span>Work</a></li>
        <li><a href="{{ route('journal.index') }}"><span class="mono mmenu__num">08</span>Journal</a></li>
        <li><a href="/#contact"><span class="mono mmenu__num">09</span>Contact</a></li>
    </ul>
    <p class="mmenu__foot mono">{{ $site['name'] }} — Portfolio Vol. 01</p>
</div>
