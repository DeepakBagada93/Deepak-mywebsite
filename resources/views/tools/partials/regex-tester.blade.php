<div class="tool-app tool-app--regex" id="regex-app">
    <div class="tool-input-group">
        <label for="regex-pattern" class="mono tool-label">Regular Expression</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <input type="text" id="regex-pattern" class="tool-input mono" placeholder="(\w+)@(\w+\.\w+)" value="(\w+)@(\w+\.\w+)" style="flex:1;min-width:220px;">
            <input type="text" id="regex-flags" class="tool-input mono" placeholder="flags" value="gi" style="width:90px;">
        </div>
    </div>
    <div class="tool-input-group">
        <label for="regex-test" class="mono tool-label">Test String</label>
        <textarea id="regex-test" class="tool-textarea" rows="5">Contact ceo@saasnext.in or hello@deepakbagada.in for AI work. Invalid: not-an-email@</textarea>
    </div>
    <p class="mono" id="regex-status" style="font-size:0.85rem;"></p>
    <div class="tool-editor-pane">
        <div class="tool-pane-header"><span class="mono">MATCHES (<span id="regex-count">0</span>)</span></div>
        <div id="regex-output" class="tool-textarea" style="min-height:120px;white-space:pre-wrap;"></div>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const patEl = document.getElementById('regex-pattern');
    const flagsEl = document.getElementById('regex-flags');
    const testEl = document.getElementById('regex-test');
    const status = document.getElementById('regex-status');
    const output = document.getElementById('regex-output');
    const count = document.getElementById('regex-count');
    function escapeHtml(s) { return s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
    function run() {
        const pat = patEl.value;
        const flags = flagsEl.value.replace(/[^gimsuy]/g, '');
        if (!pat) { status.textContent = 'Enter a pattern.'; output.innerHTML = ''; count.textContent = '0'; return; }
        let re;
        try { re = new RegExp(pat, flags.includes('g') ? flags : flags + 'g'); }
        catch (e) { status.textContent = 'Invalid regex: ' + e.message; output.innerHTML = ''; count.textContent = '0'; return; }
        const text = testEl.value;
        const matches = [...text.matchAll(re)];
        count.textContent = String(matches.length);
        status.textContent = matches.length ? matches.length + ' match' + (matches.length > 1 ? 'es' : '') + ' found.' : 'No matches.';
        status.style.color = matches.length ? '#047857' : '#b91c1c';
        if (!matches.length) { output.innerHTML = '<span class="text-muted">No matches — adjust your pattern.</span>'; return; }
        output.innerHTML = matches.map((m, i) => {
            const groups = m.slice(1).map((g, gi) => '  $' + (gi + 1) + ' = ' + (g === undefined ? '(undefined)' : escapeHtml(String(g)))).join('\n');
            return '<div style="margin-bottom:8px;"><strong class="mono">#' + (i + 1) + ' "' + escapeHtml(m[0]) + '"</strong> <span class="mono text-muted">at index ' + m.index + '</span>' + (groups ? '<pre class="mono" style="margin:4px 0 0;font-size:0.78rem;">' + groups + '</pre>' : '') + '</div>';
        }).join('');
    }
    patEl.addEventListener('input', run);
    flagsEl.addEventListener('input', run);
    testEl.addEventListener('input', run);
    run();
});
</script>
