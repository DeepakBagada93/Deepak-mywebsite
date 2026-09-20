<div class="tool-app tool-app--lorem" id="lorem-generator-app">
    <div class="tool-toolbar">
        <div class="tool-toolbar__left">
            <label class="tool-select-label">
                <span>Generate:</span>
                <select id="lorem-type" class="tool-select">
                    <option value="paragraphs" selected>Paragraphs</option>
                    <option value="sentences">Sentences</option>
                    <option value="words">Words</option>
                </select>
            </label>
            <label class="tool-select-label">
                <span>Count:</span>
                <input type="number" id="lorem-count" class="tool-input mono" value="3" min="1" max="100" style="width: 75px; padding: 6px 10px;">
            </label>
            <label class="tool-checkbox">
                <input type="checkbox" id="lorem-start-classic" checked>
                <span class="mono" style="font-size: 0.8rem;">Start with "Lorem ipsum"</span>
            </label>
            <label class="tool-checkbox">
                <input type="checkbox" id="lorem-html-tags">
                <span class="mono" style="font-size: 0.8rem;">Include &lt;p&gt; tags</span>
            </label>
            <button type="button" class="btn btn--sm btn--primary" id="btn-gen-lorem">Generate</button>
        </div>
        <div class="tool-toolbar__right">
            <button type="button" class="btn btn--sm btn--secondary" id="btn-copy-lorem">📋 Copy</button>
            <button type="button" class="btn btn--sm btn--ghost" id="btn-clear-lorem">✕ Clear</button>
        </div>
    </div>

    <div class="tool-editor-pane">
        <div class="tool-pane-header">
            <span class="mono">GENERATED TEXT</span>
            <span class="mono text-muted" id="lorem-stats">0 words · 0 chars</span>
        </div>
        <textarea id="lorem-output" class="tool-textarea" readonly placeholder="Click Generate to produce Lorem Ipsum placeholder text..."></textarea>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const typeSelect = document.getElementById('lorem-type');
    const countInput = document.getElementById('lorem-count');
    const startClassic = document.getElementById('lorem-start-classic');
    const htmlTags = document.getElementById('lorem-html-tags');
    const output = document.getElementById('lorem-output');
    const stats = document.getElementById('lorem-stats');
    const btnGen = document.getElementById('btn-gen-lorem');
    const btnCopy = document.getElementById('btn-copy-lorem');
    const btnClear = document.getElementById('btn-clear-lorem');

    const WORDS = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur',
        'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
        'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis',
        'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
        'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed',
        'eu', 'molestie', 'lacus', 'quisque', 'porttitor', 'ligula', 'dapibus', 'habitant',
        'morbi', 'tristique', 'senectus', 'et', 'netus', 'malesuada', 'fames', 'ac', 'turpis',
        'egestas', 'integer', 'suscipit', 'vehicula', 'vulputate', 'aliquam', 'pulvinar', 'faucibus'
    ];

    function getRandomWord() {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    function generateSentence(isFirst = false) {
        const len = Math.floor(Math.random() * 8) + 8; // 8 to 15 words
        let sentenceWords = [];

        if (isFirst && startClassic.checked) {
            sentenceWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit.'];
        } else {
            for (let i = 0; i < len; i++) {
                sentenceWords.push(getRandomWord());
            }
            sentenceWords[0] = sentenceWords[0].charAt(0).toUpperCase() + sentenceWords[0].slice(1);
            return sentenceWords.join(' ') + '.';
        }
        return sentenceWords.join(' ');
    }

    function generateParagraph(isFirst = false) {
        const sentenceCount = Math.floor(Math.random() * 3) + 4; // 4 to 6 sentences
        const sentences = [];
        for (let i = 0; i < sentenceCount; i++) {
            sentences.push(generateSentence(isFirst && i === 0));
        }
        return sentences.join(' ');
    }

    function generate() {
        const type = typeSelect.value;
        const count = Math.min(Math.max(parseInt(countInput.value, 10) || 1, 1), 100);
        const withHtml = htmlTags.checked;
        let result = '';

        if (type === 'words') {
            const list = [];
            if (startClassic.checked && count >= 5) {
                list.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
                for (let i = 5; i < count; i++) list.push(getRandomWord());
            } else {
                for (let i = 0; i < count; i++) list.push(getRandomWord());
                list[0] = list[0].charAt(0).toUpperCase() + list[0].slice(1);
            }
            result = list.join(' ');
        } else if (type === 'sentences') {
            const list = [];
            for (let i = 0; i < count; i++) {
                list.push(generateSentence(i === 0));
            }
            result = list.join(' ');
        } else {
            const paragraphs = [];
            for (let i = 0; i < count; i++) {
                const p = generateParagraph(i === 0);
                paragraphs.push(withHtml ? `<p>${p}</p>` : p);
            }
            result = paragraphs.join(withHtml ? '\n\n' : '\n\n');
        }

        output.value = result;
        updateStats();
    }

    function updateStats() {
        const val = output.value.trim();
        const chars = val.length;
        const words = val ? val.split(/\s+/).length : 0;
        stats.textContent = `${words.toLocaleString()} words · ${chars.toLocaleString()} chars`;
    }

    btnGen.addEventListener('click', generate);
    typeSelect.addEventListener('change', generate);
    countInput.addEventListener('change', generate);
    startClassic.addEventListener('change', generate);
    htmlTags.addEventListener('change', generate);

    btnCopy.addEventListener('click', async function() {
        if (!output.value) return;
        try {
            await navigator.clipboard.writeText(output.value);
            const orig = btnCopy.textContent;
            btnCopy.textContent = '✓ Copied!';
            setTimeout(() => btnCopy.textContent = orig, 1500);
        } catch {
            output.select();
            document.execCommand('copy');
        }
    });

    btnClear.addEventListener('click', function() {
        output.value = '';
        updateStats();
    });

    generate();
});
</script>
