<header class="masthead" id="masthead">
    <div class="masthead__row">
        <a class="masthead__logo" href="/">{{ $site['name'] }}</a>

        <nav class="masthead__nav" id="nav">
            <a href="{{ route('services.index') }}">Services</a>
            <a href="/#about">About</a>
            <a href="/#skills">Skills</a>
            <a href="/#projects">Work</a>
            <a href="{{ route('journal.index') }}">Journal</a>
            <a href="/#contact">Contact</a>
        </nav>

        <div class="masthead__meta">
            <span class="masthead__issue mono">Vol. 01 — 2026</span>
            <button class="masthead__burger mono" id="burger" aria-label="Open menu" aria-expanded="false">Menu</button>
        </div>
    </div>
</header>

{{-- Mobile menu --}}
<div class="mmenu" id="mmenu">
    <ul class="mmenu__list">
        <li><a href="{{ route('services.index') }}"><span class="mono mmenu__num">01</span>Services</a></li>
        <li><a href="/#about"><span class="mono mmenu__num">02</span>About</a></li>
        <li><a href="/#skills"><span class="mono mmenu__num">03</span>Skills</a></li>
        <li><a href="/#projects"><span class="mono mmenu__num">04</span>Work</a></li>
        <li><a href="{{ route('journal.index') }}"><span class="mono mmenu__num">05</span>Journal</a></li>
        <li><a href="/#contact"><span class="mono mmenu__num">06</span>Contact</a></li>
    </ul>
    <p class="mmenu__foot mono">{{ $site['name'] }} — Portfolio Vol. 01</p>
</div>
