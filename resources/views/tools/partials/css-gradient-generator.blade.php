<div class="tool-app tool-app--gradient" id="gradient-app">
    <div class="tool-controls-row">
        <div class="tool-control-group">
            <label for="grad-c1" class="mono tool-label">Color 1</label>
            <input type="color" id="grad-c1" value="#161616" style="width:100%;height:44px;border:1px solid #e5e5e5;border-radius:4px;cursor:pointer;">
        </div>
        <div class="tool-control-group">
            <label for="grad-c2" class="mono tool-label">Color 2</label>
            <input type="color" id="grad-c2" value="#3b82f6" style="width:100%;height:44px;border:1px solid #e5e5e5;border-radius:4px;cursor:pointer;">
        </div>
        <div class="tool-control-group">
            <label for="grad-type" class="mono tool-label">Type</label>
            <select id="grad-type" class="tool-select">
                <option value="linear" selected>Linear</option>
                <option value="radial">Radial</option>
            </select>
        </div>
        <div class="tool-control-group">
            <label for="grad-angle" class="mono tool-label">Angle: <strong id="grad-angle-val">135deg</strong></label>
            <input type="range" id="grad-angle" min="0" max="360" value="135" class="tool-slider">
        </div>
    </div>
    <div id="grad-preview" style="height:180px;border-radius:8px;border:1px solid #e5e5e5;margin:20px 0;"></div>
    <div class="tool-editor-pane">
        <div class="tool-pane-header"><span class="mono">CSS OUTPUT</span>
            <button type="button" class="btn btn--xs btn--secondary" id="grad-copy">Copy CSS</button>
        </div>
        <textarea id="grad-output" class="tool-textarea mono" readonly rows="3"></textarea>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const c1 = document.getElementById('grad-c1');
    const c2 = document.getElementById('grad-c2');
    const type = document.getElementById('grad-type');
    const angle = document.getElementById('grad-angle');
    const angleVal = document.getElementById('grad-angle-val');
    const preview = document.getElementById('grad-preview');
    const output = document.getElementById('grad-output');
    function render() {
        const a = angle.value + 'deg';
        angleVal.textContent = a;
        const css = type.value === 'radial'
            ? 'radial-gradient(circle, ' + c1.value + ', ' + c2.value + ')'
            : 'linear-gradient(' + a + ', ' + c1.value + ', ' + c2.value + ')';
        preview.style.background = css;
        output.value = 'background: ' + css + ';';
    }
    [c1, c2, type, angle].forEach(el => el.addEventListener('input', render));
    document.getElementById('grad-copy').addEventListener('click', async function() {
        try { await navigator.clipboard.writeText(output.value); this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy CSS', 1500); }
        catch { output.select(); document.execCommand('copy'); }
    });
    render();
});
</script>
