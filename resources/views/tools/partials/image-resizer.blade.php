<div class="tool-app tool-app--image-resizer">
    <div class="tool-upload" id="rs-dropzone">
        <input type="file" id="rs-input" accept="image/jpeg,image/png,image/webp" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">📏</span>
            <p class="tool-upload__title">Select or drag &amp; drop an image</p>
            <p class="tool-upload__hint mono">Resize by pixels or percentage — 100% in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('rs-input').click()">Choose Image</button>
        </div>
    </div>
    <div id="rs-controls" style="display:none;">
        <div class="tool-controls-row">
            <div class="tool-control-group">
                <label for="rs-width" class="mono tool-label">Width (px)</label>
                <input type="number" id="rs-width" class="tool-input mono" min="1" max="8000">
            </div>
            <div class="tool-control-group">
                <label for="rs-height" class="mono tool-label">Height (px)</label>
                <input type="number" id="rs-height" class="tool-input mono" min="1" max="8000">
            </div>
            <div class="tool-control-group">
                <label for="rs-scale" class="mono tool-label">Scale (%)</label>
                <input type="number" id="rs-scale" class="tool-input mono" value="100" min="1" max="500">
            </div>
        </div>
        <label class="tool-checkbox" style="margin:12px 0;">
            <input type="checkbox" id="rs-lock" checked>
            <span class="mono" style="font-size:0.8rem;">Lock aspect ratio</span>
        </label>
        <p class="mono text-muted" id="rs-orig-label" style="font-size:0.8rem;"></p>
        <div class="tool-preview-comparison">
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Original</p>
                <div class="tool-preview-img-wrap"><img id="rs-orig-preview" alt="Original preview"></div>
            </div>
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Resized: <span id="rs-out-label">—</span></p>
                <div class="tool-preview-img-wrap"><img id="rs-out-preview" alt="Resized preview"></div>
            </div>
        </div>
        <div class="tool-actions">
            <a href="#" id="rs-download" class="btn btn--solid tool-actions__btn" download="resized.png">Download Resized ↓</a>
            <button type="button" class="tool-btn-link mono" id="rs-reset">Choose Another</button>
        </div>
    </div>
</div>
<script>
(function() {
    const dz = document.getElementById('rs-dropzone');
    const input = document.getElementById('rs-input');
    const controls = document.getElementById('rs-controls');
    const wEl = document.getElementById('rs-width');
    const hEl = document.getElementById('rs-height');
    const scaleEl = document.getElementById('rs-scale');
    const lockEl = document.getElementById('rs-lock');
    const origPreview = document.getElementById('rs-orig-preview');
    const outPreview = document.getElementById('rs-out-preview');
    const outLabel = document.getElementById('rs-out-label');
    const origLabel = document.getElementById('rs-orig-label');
    const dl = document.getElementById('rs-download');
    let img = null, origW = 0, origH = 0, baseName = 'image', syncing = false;

    function render() {
        if (!img || syncing) return;
        const w = Math.max(1, parseInt(wEl.value, 10) || 1);
        const h = Math.max(1, parseInt(hEl.value, 10) || 1);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const url = canvas.toDataURL('image/png');
        outPreview.src = url;
        outLabel.textContent = w + ' × ' + h + ' px';
        dl.href = url;
        dl.download = baseName + '-' + w + 'x' + h + '.png';
    }
    function fromScale() {
        if (!img) return;
        syncing = true;
        const s = Math.min(500, Math.max(1, parseFloat(scaleEl.value) || 100));
        wEl.value = Math.round(origW * s / 100);
        hEl.value = Math.round(origH * s / 100);
        syncing = false;
        render();
    }
    wEl.addEventListener('input', () => {
        if (!img || syncing) return;
        if (lockEl.checked) {
            syncing = true;
            const w = parseInt(wEl.value, 10) || origW;
            hEl.value = Math.round(w * origH / origW);
            scaleEl.value = Math.round(w / origW * 100);
            syncing = false;
        } else { syncing = true; scaleEl.value = ''; syncing = false; }
        render();
    });
    hEl.addEventListener('input', () => {
        if (!img || syncing) return;
        if (lockEl.checked) {
            syncing = true;
            const h = parseInt(hEl.value, 10) || origH;
            wEl.value = Math.round(h * origW / origH);
            scaleEl.value = Math.round(h / origH * 100);
            syncing = false;
        } else { syncing = true; scaleEl.value = ''; syncing = false; }
        render();
    });
    scaleEl.addEventListener('input', fromScale);
    document.getElementById('rs-reset').addEventListener('click', () => {
        img = null; input.value = '';
        controls.style.display = 'none'; dz.style.display = 'block';
    });
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
        const reader = new FileReader();
        reader.onload = (e) => {
            const im = new Image();
            im.onload = () => {
                img = im; origW = im.naturalWidth; origH = im.naturalHeight;
                origPreview.src = e.target.result;
                origLabel.textContent = 'Original: ' + origW + ' × ' + origH + ' px';
                wEl.value = origW; hEl.value = origH; scaleEl.value = 100;
                dz.style.display = 'none'; controls.style.display = 'block';
                render();
            };
            im.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
})();
</script>
