<div class="tool-app tool-app--json" id="json-formatter-app">
    <div class="tool-toolbar">
        <div class="tool-toolbar__left">
            <label class="tool-select-label">
                <span>Indent:</span>
                <select id="json-indent" class="tool-select">
                    <option value="2">2 Spaces</option>
                    <option value="4" selected>4 Spaces</option>
                    <option value="tab">Tab</option>
                </select>
            </label>
            <button type="button" class="btn btn--sm btn--primary" id="btn-format">Beautify</button>
            <button type="button" class="btn btn--sm btn--secondary" id="btn-minify">Minify</button>
            <button type="button" class="btn btn--sm btn--secondary" id="btn-validate">Validate</button>
            <button type="button" class="btn btn--sm btn--ghost" id="btn-sample">Sample</button>
        </div>
        <div class="tool-toolbar__right">
            <button type="button" class="btn btn--sm btn--secondary" id="btn-copy">📋 Copy</button>
            <button type="button" class="btn btn--sm btn--ghost" id="btn-clear">✕ Clear</button>
        </div>
    </div>

    <div class="tool-status-bar" id="json-status" style="display: none;"></div>

    <div class="tool-split-editor">
        <div class="tool-editor-pane">
            <div class="tool-pane-header">
                <span class="mono">INPUT JSON</span>
                <span class="mono text-muted" id="input-stats">0 chars</span>
            </div>
            <textarea id="json-input" class="tool-textarea mono" placeholder="Paste your raw, minified, or unformatted JSON here..." spellcheck="false"></textarea>
        </div>
        <div class="tool-editor-pane">
            <div class="tool-pane-header">
                <span class="mono">FORMATTED OUTPUT</span>
                <span class="mono text-muted" id="output-stats">0 chars</span>
            </div>
            <textarea id="json-output" class="tool-textarea mono" placeholder="Formatted result will appear here..." readonly spellcheck="false"></textarea>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const indentSelect = document.getElementById('json-indent');
    const btnFormat = document.getElementById('btn-format');
    const btnMinify = document.getElementById('btn-minify');
    const btnValidate = document.getElementById('btn-validate');
    const btnSample = document.getElementById('btn-sample');
    const btnCopy = document.getElementById('btn-copy');
    const btnClear = document.getElementById('btn-clear');
    const statusBar = document.getElementById('json-status');
    const inputStats = document.getElementById('input-stats');
    const outputStats = document.getElementById('output-stats');

    const sampleJson = {
        "status": "success",
        "message": "Welcome to Deepak Bagada Dev Tools",
        "data": {
            "developer": "Deepak Bagada",
            "skills": ["Laravel", "Next.js", "AI Engineering", "Automation"],
            "metrics": {
                "active_tools": 34,
                "monthly_visitors": 250000,
                "rating": 4.98
            },
            "verified": true
        },
        "timestamp": new Date().toISOString()
    };

    function updateStats() {
        const inLen = input.value.length;
        const outLen = output.value.length;
        inputStats.textContent = inLen ? `${inLen.toLocaleString()} chars` : '0 chars';
        outputStats.textContent = outLen ? `${outLen.toLocaleString()} chars` : '0 chars';
    }

    function showStatus(msg, type = 'info') {
        statusBar.textContent = msg;
        statusBar.className = `tool-status-bar tool-status-bar--${type}`;
        statusBar.style.display = 'block';
    }

    function hideStatus() {
        statusBar.style.display = 'none';
    }

    function parseInput() {
        const val = input.value.trim();
        if (!val) {
            showStatus('Please paste or type some JSON first.', 'warning');
            return null;
        }
        try {
            return JSON.parse(val);
        } catch (err) {
            showStatus('❌ Invalid JSON: ' + err.message, 'error');
            return null;
        }
    }

    function getIndent() {
        const val = indentSelect.value;
        if (val === 'tab') return '\t';
        return parseInt(val, 10) || 4;
    }

    btnFormat.addEventListener('click', function() {
        const parsed = parseInput();
        if (parsed !== null) {
            output.value = JSON.stringify(parsed, null, getIndent());
            showStatus('✓ Valid JSON formatted successfully!', 'success');
            updateStats();
        }
    });

    btnMinify.addEventListener('click', function() {
        const parsed = parseInput();
        if (parsed !== null) {
            output.value = JSON.stringify(parsed);
            const origSize = input.value.length;
            const newSize = output.value.length;
            const saved = origSize > 0 ? Math.round(((origSize - newSize) / origSize) * 100) : 0;
            showStatus(`✓ Minified! Reduced size by ${saved}% (${origSize} → ${newSize} bytes).`, 'success');
            updateStats();
        }
    });

    btnValidate.addEventListener('click', function() {
        const parsed = parseInput();
        if (parsed !== null) {
            showStatus('✓ Valid JSON syntax! No errors detected.', 'success');
        }
    });

    btnSample.addEventListener('click', function() {
        input.value = JSON.stringify(sampleJson);
        output.value = JSON.stringify(sampleJson, null, 4);
        showStatus('✓ Sample JSON loaded and formatted.', 'info');
        updateStats();
    });

    btnCopy.addEventListener('click', async function() {
        const text = output.value || input.value;
        if (!text) {
            showStatus('Nothing to copy yet.', 'warning');
            return;
        }
        try {
            await navigator.clipboard.writeText(text);
            const prev = btnCopy.textContent;
            btnCopy.textContent = '✓ Copied!';
            setTimeout(() => btnCopy.textContent = prev, 1500);
        } catch {
            output.select();
            document.execCommand('copy');
            showStatus('Copied to clipboard!', 'success');
        }
    });

    btnClear.addEventListener('click', function() {
        input.value = '';
        output.value = '';
        hideStatus();
        updateStats();
    });

    input.addEventListener('input', updateStats);
});
</script>
