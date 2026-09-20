<div class="tool-app tool-app--emi" id="emi-calculator-app">
    <div class="tool-split-layout">
        <div class="tool-config-card">
            <div class="tool-slider-group">
                <div class="tool-slider-header">
                    <label for="emi-amount" class="mono">LOAN AMOUNT (₹)</label>
                    <span class="mono tool-slider-val" id="emi-amount-display">₹10,00,000</span>
                </div>
                <input type="number" id="emi-amount" class="tool-input mono" value="1000000" min="10000" step="10000">
                <div class="tool-chip-group">
                    <button type="button" class="tool-chip" data-amount="100000">₹1 Lakh</button>
                    <button type="button" class="tool-chip" data-amount="500000">₹5 Lakh</button>
                    <button type="button" class="tool-chip tool-chip--active" data-amount="1000000">₹10 Lakh</button>
                    <button type="button" class="tool-chip" data-amount="2500000">₹25 Lakh</button>
                    <button type="button" class="tool-chip" data-amount="5000000">₹50 Lakh</button>
                </div>
            </div>

            <div class="tool-slider-group">
                <div class="tool-slider-header">
                    <label for="emi-rate" class="mono">ANNUAL INTEREST RATE (%)</label>
                    <span class="mono tool-slider-val" id="emi-rate-display">8.5%</span>
                </div>
                <input type="range" id="emi-rate" class="tool-slider" min="5" max="25" step="0.1" value="8.5">
            </div>

            <div class="tool-slider-group">
                <div class="tool-slider-header">
                    <label for="emi-tenure" class="mono">LOAN TENURE (YEARS)</label>
                    <span class="mono tool-slider-val" id="emi-tenure-display">5 Years (60 mos)</span>
                </div>
                <input type="range" id="emi-tenure" class="tool-slider" min="1" max="30" step="1" value="5">
            </div>
        </div>

        <div class="tool-ledger-card">
            <div class="tool-stat-card" style="background: transparent; border: none; padding: 0;">
                <span class="tool-stat-label">MONTHLY EMI</span>
                <span class="tool-stat-val" id="res-emi" style="color: #047857; font-size: 2.4rem;">₹20,517</span>
            </div>

            <div class="tool-slider-group" style="margin: 10px 0;">
                <div style="height: 10px; border-radius: 5px; background: #3b82f6; display: flex; overflow: hidden;">
                    <div id="bar-principal" style="background: #10b981; width: 70%;" title="Principal"></div>
                    <div id="bar-interest" style="background: #f59e0b; width: 30%;" title="Interest"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem;" class="mono text-muted">
                    <span><strong style="color: #047857;">■</strong> Principal: <span id="pct-principal">70%</span></span>
                    <span><strong style="color: #b45309;">■</strong> Interest: <span id="pct-interest">30%</span></span>
                </div>
            </div>

            <div class="tool-ledger-row">
                <span class="text-muted">Principal Loan Amount</span>
                <span class="mono" id="res-principal">₹10,00,000</span>
            </div>
            <div class="tool-ledger-row">
                <span class="text-muted">Total Interest Payable</span>
                <span class="mono" id="res-interest">₹2,30,992</span>
            </div>
            <div class="tool-ledger-row tool-ledger-row--total">
                <span>Total Amount Payable</span>
                <span class="mono" id="res-total">₹12,30,992</span>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const inputAmount = document.getElementById('emi-amount');
    const displayAmount = document.getElementById('emi-amount-display');
    const inputRate = document.getElementById('emi-rate');
    const displayRate = document.getElementById('emi-rate-display');
    const inputTenure = document.getElementById('emi-tenure');
    const displayTenure = document.getElementById('emi-tenure-display');

    const resEmi = document.getElementById('res-emi');
    const resPrincipal = document.getElementById('res-principal');
    const resInterest = document.getElementById('res-interest');
    const resTotal = document.getElementById('res-total');
    const barPrincipal = document.getElementById('bar-principal');
    const barInterest = document.getElementById('bar-interest');
    const pctPrincipal = document.getElementById('pct-principal');
    const pctInterest = document.getElementById('pct-interest');

    const chipBtns = document.querySelectorAll('.tool-chip[data-amount]');

    const inr = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });

    function calculate() {
        const P = parseFloat(inputAmount.value) || 0;
        const annualRate = parseFloat(inputRate.value) || 0;
        const years = parseInt(inputTenure.value, 10) || 1;

        displayAmount.textContent = inr.format(P);
        displayRate.textContent = `${annualRate.toFixed(1)}%`;
        displayTenure.textContent = `${years} ${years === 1 ? 'Year' : 'Years'} (${years * 12} mos)`;

        if (P <= 0 || annualRate <= 0 || years <= 0) {
            resEmi.textContent = '₹0';
            resPrincipal.textContent = inr.format(0);
            resInterest.textContent = inr.format(0);
            resTotal.textContent = inr.format(0);
            return;
        }

        const r = annualRate / 12 / 100;
        const n = years * 12;

        // EMI = [P x r x (1+r)^n]/[(1+r)^n-1]
        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emi * n;
        const totalInterest = totalPayable - P;

        resEmi.textContent = inr.format(Math.round(emi));
        resPrincipal.textContent = inr.format(Math.round(P));
        resInterest.textContent = inr.format(Math.round(totalInterest));
        resTotal.textContent = inr.format(Math.round(totalPayable));

        const pPct = Math.round((P / totalPayable) * 100);
        const iPct = 100 - pPct;

        barPrincipal.style.width = `${pPct}%`;
        barInterest.style.width = `${iPct}%`;
        pctPrincipal.textContent = `${pPct}%`;
        pctInterest.textContent = `${iPct}%`;
    }

    chipBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chipBtns.forEach(b => b.classList.remove('tool-chip--active'));
            btn.classList.add('tool-chip--active');
            inputAmount.value = btn.dataset.amount;
            calculate();
        });
    });

    inputAmount.addEventListener('input', function() {
        chipBtns.forEach(b => {
            b.classList.toggle('tool-chip--active', b.dataset.amount === inputAmount.value);
        });
        calculate();
    });

    inputRate.addEventListener('input', calculate);
    inputTenure.addEventListener('input', calculate);

    calculate();
});
</script>
