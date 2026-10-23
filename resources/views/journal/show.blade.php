@extends('layouts.app')

@section('content')
    <div id="reading-progress-bar" class="read-progress-bar" aria-hidden="true"></div>

    <article class="article article--page">
        <div class="container">
            <nav class="mono article__crumbs" aria-label="Breadcrumb" style="margin-bottom:16px;font-size:12px;">
                <a href="/">Home</a> / <a href="{{ route('journal.index') }}">Journal</a> / {{ $post->title }}
            </nav>
            <div class="article__meta mono">
                <span class="article__tag">{{ strtoupper(($post->category ?? '') ?: 'AI DEV') }}</span>
                <span class="article__date">{{ $post->date?->format('d M Y, h:i A T') ?? '' }}</span>
                @if (!empty($post->read_time))
                    <span class="article__readtime">· {{ $post->read_time }}</span>
                @endif
                <span class="article__byline">· By {{ $post->author ?? $site['name'] }}</span>
            </div>
            <h1 class="article__title">{{ $post->title }}</h1>
            <div class="article__rule"></div>
            <div class="article__body">
                @markdown($post->content)
            </div>

            {{-- Interactive Developer Suite Callout (Reduces Bounce Rate & Boosts Dwell Time) --}}
            <div class="journal-tools-callout" style="margin-top:40px;padding:24px;border:1px solid var(--hair);border-left:3px solid var(--accent);border-radius:8px;background:var(--surface,#fcfbf9);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;">
                <div>
                    <span class="mono" style="font-size:11px;letter-spacing:0.08em;color:var(--muted);text-transform:uppercase;">// FREE DEVELOPER WORKBENCH</span>
                    <h3 style="margin:4px 0 6px;font-size:18px;">Build, format, or test your architecture in real time</h3>
                    <p style="margin:0;font-size:14px;color:var(--muted);max-width:580px;">Need to test schemas, regex, tokens, or JWTs? Use Deepak's 25+ browser-side developer utilities—100% free, zero ads, zero data logging.</p>
                </div>
                <a href="{{ route('tools.index') }}" class="btn btn--outline" style="white-space:nowrap;">Open Developer Tools →</a>
            </div>

            <aside class="author-box" style="margin-top:36px;padding:24px;border:1px solid var(--hair);border-radius:8px;display:flex;gap:16px;align-items:flex-start;">
                <img src="/images/about-portrait.png" alt="Deepak Bagada — AI Developer in Junagadh, Gujarat" width="72" height="90" style="border-radius:6px;object-fit:cover;" loading="lazy">
                <div>
                    <p class="mono" style="font-size:12px;margin:0 0 6px;">WRITTEN BY</p>
                    <p style="margin:0 0 6px;"><strong>Deepak Bagada</strong> — AI developer, web developer &amp; automation expert, Junagadh, Gujarat, India. Founder of SaaS Next, creator of Curro. 5+ years, 40+ production builds.</p>
                    <p style="margin:0;font-size:14px;"><a href="{{ route('legal.about') }}">About me</a> · <a href="{{ $site['socials']['LinkedIn'] }}">LinkedIn</a> · <a href="{{ $site['socials']['GitHub'] }}">GitHub</a> · <a href="mailto:{{ $site['email'] }}">{{ $site['email'] }}</a></p>
                </div>
            </aside>

            @if (!empty($related) && $related->count())
                <section style="margin-top:36px;">
                    <h2 class="mono" style="font-size:13px;">KEEP READING</h2>
                    <ul>
                        @foreach ($related as $rel)
                            <li><a href="{{ route('journal.show', $rel->slug) }}">{{ $rel->title }}</a></li>
                        @endforeach
                    </ul>
                </section>
            @endif

            <div style="margin-top: 50px;">
                @include('partials.newsletter', [
                    'theme' => 'light',
                    'source' => 'journal_post',
                    'label' => '// NEVER MISS A BREAKDOWN',
                    'title' => 'Enjoyed this engineering dispatch?',
                    'description' => 'Join the private subscriber list. Weekly unvarnished analyses on AI architectures, multi-agent systems, and scalable web engineering.',
                ])
            </div>

            <div class="article__foot">
                <a class="btn btn--ghost" href="{{ route('journal.index') }}">← All journal articles</a>
                <a class="btn btn--ghost" href="/#contact">Get in touch →</a>
            </div>
        </div>
    </article>

    {{-- Visual Architecture, TOC, Progress Bar & 1-Click Code Copy Script --}}
    <script>
    (function() {
        const articleBody = document.querySelector('.article__body');
        if (!articleBody) return;

        // 1. Reading Progress Bar
        const bar = document.getElementById('reading-progress-bar');
        if (bar) {
            window.addEventListener('scroll', () => {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
                bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
            }, { passive: true });
        }

        // 2. Table of Contents (TOC) Generator
        const headings = Array.from(articleBody.querySelectorAll('h2, h3')).filter(h => {
            const txt = h.textContent.trim().toLowerCase();
            return !txt.includes('frequently asked questions');
        });

        if (headings.length >= 3) {
            const toc = document.createElement('div');
            toc.className = 'article-toc';
            toc.innerHTML = `
                <div class="article-toc__head mono">
                    <span>// TABLE OF CONTENTS</span>
                    <span class="article-toc__toggle" style="cursor:pointer;">[hide]</span>
                </div>
                <ul class="article-toc__list" id="article-toc-list"></ul>
            `;

            const list = toc.querySelector('#article-toc-list');
            headings.forEach((h, idx) => {
                let id = h.getAttribute('id');
                if (!id) {
                    id = 'section-' + (idx + 1) + '-' + h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);
                    h.setAttribute('id', id);
                }
                const li = document.createElement('li');
                li.className = h.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2';
                li.innerHTML = `<a href="#${id}">${h.textContent.trim()}</a>`;
                list.appendChild(li);
            });

            // Toggle collapse
            const toggleBtn = toc.querySelector('.article-toc__toggle');
            toggleBtn.addEventListener('click', () => {
                const isHidden = list.style.display === 'none';
                list.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ? '[hide]' : '[show]';
            });

            // Insert before the first H2 or after the first 2 paragraphs
            const firstH2 = articleBody.querySelector('h2');
            if (firstH2) {
                firstH2.parentNode.insertBefore(toc, firstH2);
            } else {
                articleBody.prepend(toc);
            }
        }

        // 3. 1-Click Code Copy Buttons
        const preBlocks = articleBody.querySelectorAll('pre');
        preBlocks.forEach(pre => {
            if (pre.closest('.mermaid') || pre.classList.contains('mermaid')) return;

            const wrap = document.createElement('div');
            wrap.className = 'code-wrap';
            pre.parentNode.insertBefore(wrap, pre);
            wrap.appendChild(pre);

            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'code-copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

            copyBtn.addEventListener('click', async () => {
                const codeText = pre.querySelector('code')?.innerText || pre.innerText;
                try {
                    await navigator.clipboard.writeText(codeText);
                    copyBtn.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    copyBtn.textContent = 'Failed';
                }
            });

            wrap.appendChild(copyBtn);
        });

        // 4. Dynamic Mermaid Architecture Diagrams
        const mermaidCodes = articleBody.querySelectorAll('code.language-mermaid');
        if (mermaidCodes.length > 0) {
            mermaidCodes.forEach(codeEl => {
                const pre = codeEl.closest('pre');
                const diagramCode = codeEl.textContent.trim();
                const container = document.createElement('div');
                container.className = 'mermaid-wrap';
                container.innerHTML = `<pre class="mermaid">${diagramCode}</pre>`;
                if (pre) {
                    pre.parentNode.replaceChild(container, pre);
                }
            });

            // Load Mermaid from CDN
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            script.onload = () => {
                window.mermaid?.initialize({ startOnLoad: true, theme: 'neutral' });
                window.mermaid?.run();
            };
            document.head.appendChild(script);
        }
    })();
    </script>
@endsection

