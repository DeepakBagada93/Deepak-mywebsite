<div class="tool-app tool-app--gst-calculator">
    <div class="tool-split-layout">
        <div class="tool-split-form">
            <div class="tool-input-group">
                <label for="gst-amount" class="mono tool-label">Amount (₹ INR)</label>
                <input type="number" id="gst-amount" class="tool-input" placeholder="e.g. 50000" value="10000" min="0" step="any">
            </div>

            <div class="tool-input-group">
                <label class="mono tool-label">GST Rate Slab</label>
                <div class="tool-pill-selector" id="gst-rate-selector">
                    <button type="button" class="pill-btn pill-btn--sm" data-rate="0">0% (Nil)</button>
                    <button type="button" class="pill-btn pill-btn--sm" data-rate="5">5%</button>
                    <button type="button" class="pill-btn pill-btn--sm" data-rate="12">12%</button>
                    <button type="button" class="pill-btn pill-btn--sm is-active" data-rate="18">18% (Standard)</button>
                    <button type="button" class="pill-btn pill-btn--sm" data-rate="28">28% (Luxury)</button>
                </div>
            </div>

            <div class="tool-input-group">
                <label class="mono tool-label">Tax Calculation Type</label>
                <div class="tool-radio-group">
                    <label class="tool-radio-label">
                        <input type="radio" name="gst_type" value="exclusive" checked>
                        <span>GST Exclusive (Add Tax on Top)</span>
                    </label>
                    <label class="tool-radio-label">
                        <input type="radio" name="gst_type" value="inclusive">
                        <span>GST Inclusive (Tax Included in Price)</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="tool-split-output">
            <div class="tool-ledger-card">
                <p class="mono tool-ledger-card__title">Tax Calculation Breakdown</p>
                
                <div class="tool-ledger-row">
                    <span class="tool-ledger-label">Net / Base Amount:</span>
                    <span class="tool-ledger-val mono" id="gst-net-amt">₹10,000.00</span>
                </div>
                <div class="tool-ledger-row">
                    <span class="tool-ledger-label">CGST (<span id="gst-cgst-rate">9</span>%):</span>
                    <span class="tool-ledger-val mono" id="gst-cgst-amt">₹900.00</span>
                </div>
                <div class="tool-ledger-row">
                    <span class="tool-ledger-label">SGST (<span id="gst-sgst-rate">9</span>%):</span>
                    <span class="tool-ledger-val mono" id="gst-sgst-amt">₹900.00</span>
                </div>
                <div class="tool-ledger-row tool-ledger-row--highlight">
                    <span class="tool-ledger-label">Total GST Tax:</span>
                    <span class="tool-ledger-val mono" id="gst-tax-amt">₹1,800.00</span>
                </div>
                <div class="tool-ledger-row tool-ledger-row--total">
                    <span class="tool-ledger-label">Total Final Amount:</span>
                    <span class="tool-ledger-val mono" id="gst-total-amt">₹11,800.00</span>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    const amountInput = document.getElementById('gst-amount');
    const rateBtns = document.querySelectorAll('#gst-rate-selector button');
    const typeRadios = document.querySelectorAll('input[name="gst_type"]');
    const netAmtEl = document.getElementById('gst-net-amt');
    const cgstRateEl = document.getElementById('gst-cgst-rate');
    const cgstAmtEl = document.getElementById('gst-cgst-amt');
    const sgstRateEl = document.getElementById('gst-sgst-rate');
    const sgstAmtEl = document.getElementById('gst-sgst-amt');
    const taxAmtEl = document.getElementById('gst-tax-amt');
    const totalAmtEl = document.getElementById('gst-total-amt');

    let currentRate = 18;

    const formatINR = (val) => {
        return '₹' + Number(val).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const calculate = () => {
        const amount = parseFloat(amountInput.value) || 0;
        const isInclusive = document.querySelector('input[name="gst_type"]:checked').value === 'inclusive';
        const rate = currentRate;
        const halfRate = (rate / 2).toFixed(1);

        cgstRateEl.textContent = halfRate;
        sgstRateEl.textContent = halfRate;

        let netAmount = 0;
        let totalTax = 0;
        let finalAmount = 0;

        if (isInclusive) {
            // Amount includes GST
            // Base = Amount * (100 / (100 + Rate))
            netAmount = amount * (100 / (100 + rate));
            totalTax = amount - netAmount;
            finalAmount = amount;
        } else {
            // Amount excludes GST
            netAmount = amount;
            totalTax = (amount * rate) / 100;
            finalAmount = amount + totalTax;
        }

        const halfTax = totalTax / 2;

        netAmtEl.textContent = formatINR(netAmount);
        cgstAmtEl.textContent = formatINR(halfTax);
        sgstAmtEl.textContent = formatINR(halfTax);
        taxAmtEl.textContent = formatINR(totalTax);
        totalAmtEl.textContent = formatINR(finalAmount);
    };

    amountInput.addEventListener('input', calculate);

    rateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            rateBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentRate = parseFloat(btn.getAttribute('data-rate'));
            calculate();
        });
    });

    typeRadios.forEach(radio => {
        radio.addEventListener('change', calculate);
    });

    calculate();
})();
</script>
