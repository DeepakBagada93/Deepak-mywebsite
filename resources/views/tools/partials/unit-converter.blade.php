<div class="tool-app tool-app--unit" id="unit-app">
    <div class="tool-controls-row">
        <div class="tool-control-group">
            <label for="unit-cat" class="mono tool-label">Category</label>
            <select id="unit-cat" class="tool-select">
                <option value="length" selected>Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
                <option value="volume">Volume</option>
            </select>
        </div>
        <div class="tool-control-group">
            <label for="unit-val" class="mono tool-label">Value</label>
            <input type="number" id="unit-val" class="tool-input mono" value="100" step="any">
        </div>
        <div class="tool-control-group">
            <label for="unit-from" class="mono tool-label">From</label>
            <select id="unit-from" class="tool-select"></select>
        </div>
        <div class="tool-control-group">
            <label for="unit-to" class="mono tool-label">To</label>
            <select id="unit-to" class="tool-select"></select>
        </div>
    </div>
    <div class="tool-ledger-card" style="margin-top:20px;">
        <div class="tool-ledger-row tool-ledger-row--total">
            <span>Result:</span>
            <span class="mono" id="unit-result" style="color:#047857;font-size:1.3rem;">—</span>
        </div>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const cat = document.getElementById('unit-cat');
    const val = document.getElementById('unit-val');
    const from = document.getElementById('unit-from');
    const to = document.getElementById('unit-to');
    const result = document.getElementById('unit-result');
    const UNITS = {
        length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344 },
        weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000 },
        volume: { l: 1, ml: 0.001, gal: 3.78541, cup: 0.24, floz: 0.0295735 },
        temperature: { C: 1, F: 1, K: 1 }
    };
    function fillUnits() {
        const keys = Object.keys(UNITS[cat.value]);
        from.innerHTML = keys.map(k => '<option value="' + k + '">' + k + '</option>').join('');
        to.innerHTML = keys.map(k => '<option value="' + k + '">' + k + '</option>').join('');
        from.selectedIndex = 0; to.selectedIndex = Math.min(1, keys.length - 1);
    }
    function tempConvert(v, f, t) {
        let c = f === 'C' ? v : (f === 'F' ? (v - 32) * 5 / 9 : v - 273.15);
        return t === 'C' ? c : (t === 'F' ? c * 9 / 5 + 32 : c + 273.15);
    }
    function convert() {
        const v = parseFloat(val.value);
        if (isNaN(v)) { result.textContent = '—'; return; }
        let out;
        if (cat.value === 'temperature') out = tempConvert(v, from.value, to.value);
        else out = v * UNITS[cat.value][from.value] / UNITS[cat.value][to.value];
        result.textContent = Number.isInteger(out) ? out.toLocaleString() + ' ' + to.value : (+out.toFixed(4)).toLocaleString() + ' ' + to.value;
    }
    cat.addEventListener('change', () => { fillUnits(); convert(); });
    [val, from, to].forEach(el => el.addEventListener('input', convert));
    from.addEventListener('change', convert); to.addEventListener('change', convert);
    fillUnits(); convert();
});
</script>
