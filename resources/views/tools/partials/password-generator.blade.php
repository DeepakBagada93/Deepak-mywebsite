<div class="tool-app tool-app--password" id="password-generator-app">
    <div class="password-display-card">
        <div class="password-display-box">
            <input type="text" id="pass-output" class="password-input mono" readonly placeholder="Generating password...">
            <div class="password-actions">
                <button type="button" class="btn btn--sm btn--primary" id="btn-copy-pass" title="Copy Password">📋 Copy</button>
                <button type="button" class="btn btn--sm btn--secondary" id="btn-regen-pass" title="Generate New">🔄 Refresh</button>
            </div>
        </div>

        <div class="password-strength-wrap">
            <div class="password-strength-bar">
                <div class="password-strength-fill" id="strength-fill" style="width: 0%;"></div>
            </div>
            <div class="password-strength-meta">
                <span class="mono text-muted">Strength: <strong id="strength-text" class="text-white">Calculating...</strong></span>
                <span class="mono text-muted" id="entropy-text">~0 bits entropy</span>
            </div>
        </div>
    </div>

    <div class="tool-config-grid">
        <div class="tool-config-card">
            <div class="tool-slider-group">
                <div class="tool-slider-header">
                    <label for="pass-length" class="mono">PASSWORD LENGTH</label>
                    <span class="mono tool-slider-val" id="pass-length-val">16</span>
                </div>
                <input type="range" id="pass-length" class="tool-slider" min="6" max="64" value="16">
            </div>

            <div class="password-presets">
                <span class="mono text-muted">Quick presets:</span>
                <button type="button" class="btn btn--xs btn--ghost pass-preset-btn" data-len="8">PIN (8)</button>
                <button type="button" class="btn btn--xs btn--ghost pass-preset-btn" data-len="16">Standard (16)</button>
                <button type="button" class="btn btn--xs btn--ghost pass-preset-btn" data-len="24">Strong (24)</button>
                <button type="button" class="btn btn--xs btn--ghost pass-preset-btn" data-len="32">Max (32)</button>
            </div>
        </div>

        <div class="tool-config-card">
            <p class="mono text-muted mb-sm">CHARACTER SETS</p>
            <div class="tool-checkbox-grid">
                <label class="tool-checkbox">
                    <input type="checkbox" id="chk-upper" checked>
                    <span>Uppercase (A-Z)</span>
                </label>
                <label class="tool-checkbox">
                    <input type="checkbox" id="chk-lower" checked>
                    <span>Lowercase (a-z)</span>
                </label>
                <label class="tool-checkbox">
                    <input type="checkbox" id="chk-digits" checked>
                    <span>Numbers (0-9)</span>
                </label>
                <label class="tool-checkbox">
                    <input type="checkbox" id="chk-symbols" checked>
                    <span>Symbols (!@#$%^&*)</span>
                </label>
                <label class="tool-checkbox">
                    <input type="checkbox" id="chk-avoid-ambig">
                    <span>Avoid Ambiguous (1, l, I, 0, O, o)</span>
                </label>
            </div>
        </div>
    </div>

    <div class="password-history-card">
        <div class="password-history-header">
            <span class="mono">RECENT PASSWORDS (SESSION ONLY)</span>
            <button type="button" class="btn btn--xs btn--ghost" id="btn-clear-history">Clear</button>
        </div>
        <div class="password-history-list" id="pass-history">
            <p class="text-muted mono" style="font-size: 0.85rem;">Generated passwords will show here for easy reference.</p>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const passOutput = document.getElementById('pass-output');
    const btnCopy = document.getElementById('btn-copy-pass');
    const btnRegen = document.getElementById('btn-regen-pass');
    const lengthSlider = document.getElementById('pass-length');
    const lengthVal = document.getElementById('pass-length-val');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    const entropyText = document.getElementById('entropy-text');
    const chkUpper = document.getElementById('chk-upper');
    const chkLower = document.getElementById('chk-lower');
    const chkDigits = document.getElementById('chk-digits');
    const chkSymbols = document.getElementById('chk-symbols');
    const chkAvoidAmbig = document.getElementById('chk-avoid-ambig');
    const presetBtns = document.querySelectorAll('.pass-preset-btn');
    const historyList = document.getElementById('pass-history');
    const btnClearHistory = document.getElementById('btn-clear-history');

    const history = [];

    const CHARS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        digits: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const AMBIGUOUS = /[1lI0Oo]/g;

    function getSecureRandomInt(max) {
        const arr = new Uint32Array(1);
        window.crypto.getRandomValues(arr);
        return arr[0] % max;
    }

    function generatePassword() {
        let pool = '';
        let requiredChars = [];

        let upper = CHARS.upper;
        let lower = CHARS.lower;
        let digits = CHARS.digits;
        let symbols = CHARS.symbols;

        if (chkAvoidAmbig.checked) {
            upper = upper.replace(AMBIGUOUS, '');
            lower = lower.replace(AMBIGUOUS, '');
            digits = digits.replace(AMBIGUOUS, '');
        }

        if (chkUpper.checked) {
            pool += upper;
            requiredChars.push(upper[getSecureRandomInt(upper.length)]);
        }
        if (chkLower.checked) {
            pool += lower;
            requiredChars.push(lower[getSecureRandomInt(lower.length)]);
        }
        if (chkDigits.checked) {
            pool += digits;
            requiredChars.push(digits[getSecureRandomInt(digits.length)]);
        }
        if (chkSymbols.checked) {
            pool += symbols;
            requiredChars.push(symbols[getSecureRandomInt(symbols.length)]);
        }

        if (!pool) {
            chkLower.checked = true;
            pool = lower;
            requiredChars.push(lower[getSecureRandomInt(lower.length)]);
        }

        const len = parseInt(lengthSlider.value, 10);
        const result = [...requiredChars];

        for (let i = result.length; i < len; i++) {
            result.push(pool[getSecureRandomInt(pool.length)]);
        }

        // Shuffle with Fisher-Yates
        for (let i = result.length - 1; i > 0; i--) {
            const j = getSecureRandomInt(i + 1);
            [result[i], result[j]] = [result[j], result[i]];
        }

        const password = result.join('');
        passOutput.value = password;

        evaluateStrength(password, pool.length);
        addToHistory(password);
    }

    function evaluateStrength(password, poolSize) {
        const len = password.length;
        const entropy = Math.round(len * Math.log2(poolSize || 1));
        entropyText.textContent = `~${entropy} bits entropy`;

        let pct = 0;
        let color = '#ef4444';
        let label = 'Very Weak';

        if (entropy >= 80) {
            pct = 100;
            color = '#10b981';
            label = 'Very Strong';
        } else if (entropy >= 60) {
            pct = 75;
            color = '#06b6d4';
            label = 'Strong';
        } else if (entropy >= 45) {
            pct = 50;
            color = '#f59e0b';
            label = 'Moderate';
        } else {
            pct = 25;
            color = '#ef4444';
            label = 'Weak';
        }

        strengthFill.style.width = `${pct}%`;
        strengthFill.style.backgroundColor = color;
        strengthText.textContent = label;
        strengthText.style.color = color;
    }

    function addToHistory(pass) {
        if (!pass || (history.length > 0 && history[0] === pass)) return;
        history.unshift(pass);
        if (history.length > 5) history.pop();

        historyList.innerHTML = '';
        history.forEach(item => {
            const row = document.createElement('div');
            row.className = 'password-history-item';
            row.innerHTML = `
                <span class="mono">${escapeHtml(item)}</span>
                <button type="button" class="btn btn--xs btn--ghost copy-hist-btn" data-val="${escapeHtml(item)}">Copy</button>
            `;
            historyList.appendChild(row);
        });

        historyList.querySelectorAll('.copy-hist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                copyText(btn.dataset.val, btn);
            });
        });
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function(m) {
            return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
        });
    }

    async function copyText(text, btn) {
        try {
            await navigator.clipboard.writeText(text);
            const orig = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => btn.textContent = orig, 1500);
        } catch {
            passOutput.select();
            document.execCommand('copy');
        }
    }

    lengthSlider.addEventListener('input', function() {
        lengthVal.textContent = this.value;
        generatePassword();
    });

    [chkUpper, chkLower, chkDigits, chkSymbols, chkAvoidAmbig].forEach(el => {
        el.addEventListener('change', generatePassword);
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lengthSlider.value = btn.dataset.len;
            lengthVal.textContent = btn.dataset.len;
            generatePassword();
        });
    });

    btnRegen.addEventListener('click', generatePassword);
    btnCopy.addEventListener('click', () => copyText(passOutput.value, btnCopy));

    btnClearHistory.addEventListener('click', () => {
        history.length = 0;
        historyList.innerHTML = '<p class="text-muted mono" style="font-size: 0.85rem;">History cleared.</p>';
    });

    // Initial generate
    generatePassword();
});
</script>
