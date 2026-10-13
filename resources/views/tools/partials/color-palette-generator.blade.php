<div class="tool-app tool-app--palette" id="palette-app">
    <div class="tool-actions" style="margin-bottom:16px;">
        <button type="button" class="btn btn--sm btn--primary" id="pal-generate">Generate Palette</button>
        <span class="mono text-muted" style="font-size:0.8rem;">Click any color to copy HEX</span>
    </div>
    <div id="pal-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;"></div>
    <p class="mono text-muted" id="pal-hint" style="font-size:0.8rem;margin-top:12px;"></p>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('pal-grid');
    const hint = document.getElementById('pal-hint');
    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const k = (n) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const to = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
        return ('#' + to(f(0)) + to(f(8)) + to(f(4))).toUpperCase();
    }
    function generate() {
        const base = Math.floor(Math.random() * 360);
        const mode = Math.floor(Math.random() * 3);
        const colors = [];
        for (let i = 0; i < 5; i++) {
            let h;
            if (mode === 0) h = (base + i * 24) % 360;
            else if (mode === 1) h = (base + (i % 2 === 0 ? 0 : 180) + i * 8) % 360;
            else h = (base + i * 72) % 360;
            colors.push(hslToHex(h, 55 + Math.random() * 25, 35 + Math.random() * 30));
        }
        grid.innerHTML = '';
        colors.forEach(hex => {
            const card = document.createElement('button');
            card.type = 'button';
            card.style.cssText = 'background:' + hex + ';border:1px solid #e5e5e5;border-radius:8px;height:110px;cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding:8px;';
            card.innerHTML = '<span class="mono" style="background:rgba(255,255,255,0.92);padding:2px 8px;border-radius:4px;font-size:0.75rem;">' + hex + '</span>';
            card.addEventListener('click', async () => {
                try { await navigator.clipboard.writeText(hex); hint.textContent = hex + ' copied to clipboard.'; }
                catch { hint.textContent = hex; }
            });
            grid.appendChild(card);
        });
        hint.textContent = 'Palette ready — click a swatch to copy.';
    }
    document.getElementById('pal-generate').addEventListener('click', generate);
    generate();
});
</script>
