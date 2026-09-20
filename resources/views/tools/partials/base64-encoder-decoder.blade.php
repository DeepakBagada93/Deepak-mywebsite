<div class="tool-app tool-app--base64" id="base64-app">
    <div class="tool-toolbar">
        <div class="tool-toolbar__left">
            <div class="tool-segmented-control" id="base64-mode">
                <button type="button" class="tool-segmented-btn tool-segmented-btn--active" data-mode="encode">Encode</button>
                <button type="button" class="tool-segmented-btn" data-mode="decode">Decode</button>
            </div>
            <button type="button" class="btn btn--sm btn--primary" id="btn-process">Process</button>
            <button type="button" class="btn btn--sm btn--ghost" id="btn-swap">⇄ Swap</button>
        </div>
        <div class="tool-toolbar__right">
            <button type="button" class="btn btn--sm btn--secondary" id="btn-copy-b64">📋 Copy</button>
            <button type="button" class="btn btn--sm btn--ghost" id="btn-clear-b64">✕ Clear</button>
        </div>
    </div>

    <div class="tool-status-bar" id="b64-status" style="display: none;"></div>

    <div class="tool-split-editor">
        <div class="tool-editor-pane">
            <div class="tool-pane-header">
                <span class="mono" id="label-input">PLAIN TEXT INPUT</span>
                <span class="mono text-muted" id="b64-in-count">0 chars</span>
            </div>
            <textarea id="b64-input" class="tool-textarea mono" placeholder="Type or paste text to encode into Base64..."></textarea>
        </div>
        <div class="tool-editor-pane">
            <div class="tool-pane-header">
                <span class="mono" id="label-output">BASE64 OUTPUT</span>
                <span class="mono text-muted" id="b64-out-count">0 chars</span>
            </div>
            <textarea id="b64-output" class="tool-textarea mono" placeholder="Base64 result will appear here..." readonly></textarea>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    let mode = 'encode';
    const modeBtns = document.querySelectorAll('#base64-mode .tool-segmented-btn');
    const input = document.getElementById('b64-input');
    const output = document.getElementById('b64-output');
    const labelIn = document.getElementById('label-input');
    const labelOut = document.getElementById('label-output');
    const inCount = document.getElementById('b64-in-count');
    const outCount = document.getElementById('b64-out-count');
    const status = document.getElementById('b64-status');
    const btnProcess = document.getElementById('btn-process');
    const btnSwap = document.getElementById('btn-swap');
    const btnCopy = document.getElementById('btn-copy-b64');
    const btnClear = document.getElementById('btn-clear-b64');

    function showStatus(msg, type = 'info') {
        status.textContent = msg;
        status.className = `tool-status-bar tool-status-bar--${type}`;
        status.style.display = 'block';
    }

    function setMode(newMode) {
        mode = newMode;
        modeBtns.forEach(btn => {
            btn.classList.toggle('tool-segmented-btn--active', btn.dataset.mode === mode);
        });
        if (mode === 'encode') {
            labelIn.textContent = 'PLAIN TEXT INPUT';
            labelOut.textContent = 'BASE64 OUTPUT';
            input.placeholder = 'Type or paste text to encode into Base64...';
        } else {
            labelIn.textContent = 'BASE64 INPUT';
            labelOut.textContent = 'DECODED TEXT OUTPUT';
            input.placeholder = 'Paste Base64 string here to decode into plain text...';
        }
        process();
    }

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    function process() {
        const val = input.value;
        if (!val) {
            output.value = '';
            status.style.display = 'none';
            updateStats();
            return;
        }

        try {
            if (mode === 'encode') {
                // UTF-8 safe encode
                output.value = btoa(unescape(encodeURIComponent(val)));
                showStatus('✓ Encoded successfully to Base64', 'success');
            } else {
                // UTF-8 safe decode
                output.value = decodeURIComponent(escape(atob(val.trim())));
                showStatus('✓ Decoded successfully from Base64', 'success');
            }
        } catch (e) {
            output.value = '';
            showStatus('❌ Error: Invalid input for ' + (mode === 'decode' ? 'Base64 decoding' : 'encoding'), 'error');
        }
        updateStats();
    }

    function updateStats() {
        inCount.textContent = `${input.value.length.toLocaleString()} chars`;
        outCount.textContent = `${output.value.length.toLocaleString()} chars`;
    }

    btnProcess.addEventListener('click', process);
    input.addEventListener('input', process);

    btnSwap.addEventListener('click', function() {
        const outVal = output.value;
        setMode(mode === 'encode' ? 'decode' : 'encode');
        input.value = outVal;
        process();
    });

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
        input.value = '';
        output.value = '';
        status.style.display = 'none';
        updateStats();
    });
});
</script>
