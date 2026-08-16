<header class="masthead" id="masthead">
    <div class="masthead__row">
        <a class="masthead__logo" href="#top" data-scroll><?= e($site['name']) ?></a>

        <nav class="masthead__nav" id="nav">
            <a href="#about" data-scroll>About</a>
            <a href="#skills" data-scroll>Skills</a>
            <a href="#projects" data-scroll>Work</a>
            <a href="#journal" data-scroll>Journal</a>
            <a href="#contact" data-scroll>Contact</a>
        </nav>

        <div class="masthead__meta">
            <span class="masthead__issue mono">Vol. 01 — 2026</span>
            <button class="masthead__burger mono" id="burger" aria-label="Open menu" aria-expanded="false">Menu</button>
        </div>
    </div>
</header>

<?php // Mobile menu ?>
<div class="mmenu" id="mmenu">
    <ul class="mmenu__list">
        <li><a href="#about" data-scroll><span class="mono mmenu__num">01</span>About</a></li>
        <li><a href="#skills" data-scroll><span class="mono mmenu__num">02</span>Skills</a></li>
        <li><a href="#projects" data-scroll><span class="mono mmenu__num">03</span>Work</a></li>
        <li><a href="#journal" data-scroll><span class="mono mmenu__num">04</span>Journal</a></li>
        <li><a href="#contact" data-scroll><span class="mono mmenu__num">05</span>Contact</a></li>
    </ul>
    <p class="mmenu__foot mono"><?= e($site['name']) ?> — Portfolio Vol. 01</p>
</div>
