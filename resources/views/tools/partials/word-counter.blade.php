<div class="tool-app tool-app--word-counter">
    <div class="tool-stats-bar">
        <div class="tool-stat-card">
            <span class="tool-stat-card__val" id="wc-words">0</span>
            <span class="tool-stat-card__label mono">Words</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-card__val" id="wc-chars">0</span>
            <span class="tool-stat-card__label mono">Characters</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-card__val" id="wc-chars-nospace">0</span>
            <span class="tool-stat-card__label mono">No Spaces</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-card__val" id="wc-sentences">0</span>
            <span class="tool-stat-card__label mono">Sentences</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-card__val" id="wc-paragraphs">0</span>
            <span class="tool-stat-card__label mono">Paragraphs</span>
        </div>
        <div class="tool-stat-card">
            <span class="tool-stat-card__val" id="wc-reading-time">0m</span>
            <span class="tool-stat-card__label mono">Reading Time</span>
        </div>
    </div>

    <div class="tool-editor-wrap">
        <textarea id="wc-textarea" class="tool-textarea tool-textarea--tall" placeholder="Type or paste your text here to analyze words, characters, and reading time in real-time..."></textarea>
    </div>

    <div class="tool-actions" style="justify-content: space-between;">
        <div class="tool-editor-tools">
            <button type="button" class="btn btn--outline" id="wc-copy-btn">Copy Text</button>
            <button type="button" class="btn btn--outline" id="wc-clear-btn">Clear</button>
        </div>
        <span class="mono" id="wc-speaking-time" style="color: var(--muted); font-size: 0.78rem;">Speaking Time: 0 sec</span>
    </div>

    <div class="tool-keyword-density" id="wc-density-wrap" style="display:none; margin-top: 32px;">
        <h3 class="mono" style="font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; color: var(--muted);">Top Keyword Density</h3>
        <div class="tool-density-pills" id="wc-density-pills"></div>
    </div>
</div>

<script>
(function() {
    const textarea = document.getElementById('wc-textarea');
    const wordsEl = document.getElementById('wc-words');
    const charsEl = document.getElementById('wc-chars');
    const charsNoSpaceEl = document.getElementById('wc-chars-nospace');
    const sentencesEl = document.getElementById('wc-sentences');
    const paragraphsEl = document.getElementById('wc-paragraphs');
    const readTimeEl = document.getElementById('wc-reading-time');
    const speakTimeEl = document.getElementById('wc-speaking-time');
    const copyBtn = document.getElementById('wc-copy-btn');
    const clearBtn = document.getElementById('wc-clear-btn');
    const densityWrap = document.getElementById('wc-density-wrap');
    const densityPills = document.getElementById('wc-density-pills');

    const stopWords = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me']);

    const updateStats = () => {
        const text = textarea.value;
        const trimmed = text.trim();

        const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
        const numWords = words.length;
        const numChars = text.length;
        const numCharsNoSpace = text.replace(/\s/g, '').length;
        const numSentences = trimmed ? (trimmed.match(/[.!?]+(?:\s|$)/g) || []).length || (numWords > 0 ? 1 : 0) : 0;
        const numParagraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;

        // 225 WPM average reading speed
        const readMins = Math.ceil(numWords / 225);
        // 130 WPM average speaking speed
        const speakSecs = Math.round((numWords / 130) * 60);

        wordsEl.textContent = numWords.toLocaleString();
        charsEl.textContent = numChars.toLocaleString();
        charsNoSpaceEl.textContent = numCharsNoSpace.toLocaleString();
        sentencesEl.textContent = numSentences;
        paragraphsEl.textContent = numParagraphs;
        readTimeEl.textContent = numWords > 0 ? `${readMins}m` : '0m';
        speakTimeEl.textContent = `Speaking Time: ~${speakSecs > 60 ? Math.ceil(speakSecs / 60) + ' min' : speakSecs + ' sec'}`;

        // Top keywords
        if (numWords >= 10) {
            const freq = {};
            words.forEach(w => {
                const cleaned = w.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (cleaned.length > 2 && !stopWords.has(cleaned)) {
                    freq[cleaned] = (freq[cleaned] || 0) + 1;
                }
            });

            const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
            if (sorted.length > 0) {
                densityPills.innerHTML = sorted.map(([k, count]) => {
                    const pct = Math.round((count / numWords) * 100);
                    return `<span class="tool-density-pill mono">${k} <strong>(${count} · ${pct}%)</strong></span>`;
                }).join('');
                densityWrap.style.display = 'block';
            } else {
                densityWrap.style.display = 'none';
            }
        } else {
            densityWrap.style.display = 'none';
        }
    };

    textarea.addEventListener('input', updateStats);

    copyBtn.addEventListener('click', () => {
        if (!textarea.value) return;
        navigator.clipboard.writeText(textarea.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = originalText, 1500);
        });
    });

    clearBtn.addEventListener('click', () => {
        textarea.value = '';
        updateStats();
        textarea.focus();
    });
})();
</script>
