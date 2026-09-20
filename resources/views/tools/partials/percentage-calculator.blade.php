<div class="tool-app tool-app--percentage" id="percentage-calculator-app">
    <div class="tool-config-grid">
        {{-- Card 1: What is X% of Y? --}}
        <div class="tool-config-card">
            <p class="mono text-muted">CALCULATION 1</p>
            <h3 style="font-size: 1.1rem;">What is <span class="text-white">X%</span> of <span class="text-white">Y</span>?</h3>
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="p1-x" class="tool-input mono" placeholder="X (%)" value="18" style="width: 110px;">
                <span class="mono">% of</span>
                <input type="number" id="p1-y" class="tool-input mono" placeholder="Total (Y)" value="5000">
            </div>
            <div class="tool-ledger-row tool-ledger-row--total" style="margin-top: 10px;">
                <span>Result:</span>
                <span class="mono" id="p1-res" style="color: #047857;">900</span>
            </div>
        </div>

        {{-- Card 2: X is what percent of Y? --}}
        <div class="tool-config-card">
            <p class="mono text-muted">CALCULATION 2</p>
            <h3 style="font-size: 1.1rem;"><span class="text-white">X</span> is what percent of <span class="text-white">Y</span>?</h3>
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="p2-x" class="tool-input mono" placeholder="X" value="250" style="width: 110px;">
                <span class="mono">is what % of</span>
                <input type="number" id="p2-y" class="tool-input mono" placeholder="Y" value="1000">
            </div>
            <div class="tool-ledger-row tool-ledger-row--total" style="margin-top: 10px;">
                <span>Result:</span>
                <span class="mono" id="p2-res" style="color: #047857;">25%</span>
            </div>
        </div>

        {{-- Card 3: % Increase or Decrease --}}
        <div class="tool-config-card">
            <p class="mono text-muted">CALCULATION 3</p>
            <h3 style="font-size: 1.1rem;">Percentage Change from <span class="text-white">X</span> to <span class="text-white">Y</span></h3>
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="p3-x" class="tool-input mono" placeholder="From (X)" value="80">
                <span class="mono">→</span>
                <input type="number" id="p3-y" class="tool-input mono" placeholder="To (Y)" value="120">
            </div>
            <div class="tool-ledger-row tool-ledger-row--total" style="margin-top: 10px;">
                <span>Result:</span>
                <span class="mono" id="p3-res" style="color: #047857;">+50.00% (Increase)</span>
            </div>
        </div>

        {{-- Card 4: Add / Subtract Percentage --}}
        <div class="tool-config-card">
            <p class="mono text-muted">CALCULATION 4</p>
            <h3 style="font-size: 1.1rem;">Add / Subtract <span class="text-white">X%</span> to/from <span class="text-white">Y</span></h3>
            <div style="display: flex; align-items: center; gap: 8px;">
                <input type="number" id="p4-y" class="tool-input mono" placeholder="Base (Y)" value="1500">
                <select id="p4-op" class="tool-select mono" style="width: 80px; padding-right: 25px;">
                    <option value="add">+</option>
                    <option value="sub">-</option>
                </select>
                <input type="number" id="p4-x" class="tool-input mono" placeholder="X (%)" value="10" style="width: 100px;">
                <span class="mono">%</span>
            </div>
            <div class="tool-ledger-row tool-ledger-row--total" style="margin-top: 10px;">
                <span>Result:</span>
                <span class="mono" id="p4-res" style="color: #047857;">1,650</span>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 1
    const p1X = document.getElementById('p1-x');
    const p1Y = document.getElementById('p1-y');
    const p1Res = document.getElementById('p1-res');

    function calc1() {
        const x = parseFloat(p1X.value) || 0;
        const y = parseFloat(p1Y.value) || 0;
        const res = (x / 100) * y;
        p1Res.textContent = Number.isInteger(res) ? res.toLocaleString() : res.toFixed(2);
    }
    p1X.addEventListener('input', calc1);
    p1Y.addEventListener('input', calc1);

    // 2
    const p2X = document.getElementById('p2-x');
    const p2Y = document.getElementById('p2-y');
    const p2Res = document.getElementById('p2-res');

    function calc2() {
        const x = parseFloat(p2X.value) || 0;
        const y = parseFloat(p2Y.value) || 0;
        if (y === 0) {
            p2Res.textContent = '0%';
            return;
        }
        const res = (x / y) * 100;
        p2Res.textContent = `${res.toFixed(2)}%`;
    }
    p2X.addEventListener('input', calc2);
    p2Y.addEventListener('input', calc2);

    // 3
    const p3X = document.getElementById('p3-x');
    const p3Y = document.getElementById('p3-y');
    const p3Res = document.getElementById('p3-res');

    function calc3() {
        const x = parseFloat(p3X.value) || 0;
        const y = parseFloat(p3Y.value) || 0;
        if (x === 0) {
            p3Res.textContent = '0%';
            return;
        }
        const diff = y - x;
        const pct = (diff / Math.abs(x)) * 100;
        const sign = pct >= 0 ? '+' : '';
        const label = pct >= 0 ? 'Increase' : 'Decrease';
        const color = pct >= 0 ? '#047857' : '#b91c1c';
        p3Res.textContent = `${sign}${pct.toFixed(2)}% (${label})`;
        p3Res.style.color = color;
    }
    p3X.addEventListener('input', calc3);
    p3Y.addEventListener('input', calc3);

    // 4
    const p4Y = document.getElementById('p4-y');
    const p4Op = document.getElementById('p4-op');
    const p4X = document.getElementById('p4-x');
    const p4Res = document.getElementById('p4-res');

    function calc4() {
        const y = parseFloat(p4Y.value) || 0;
        const x = parseFloat(p4X.value) || 0;
        const op = p4Op.value;
        const amount = (x / 100) * y;
        const final = op === 'add' ? y + amount : y - amount;
        p4Res.textContent = Number.isInteger(final) ? final.toLocaleString() : final.toFixed(2);
    }
    p4Y.addEventListener('input', calc4);
    p4Op.addEventListener('change', calc4);
    p4X.addEventListener('input', calc4);

    calc1();
    calc2();
    calc3();
    calc4();
});
</script>
