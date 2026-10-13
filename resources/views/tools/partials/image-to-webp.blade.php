<div class="tool-app tool-app--image-to-webp">
    <div class="tool-upload" id="webp-dropzone">
        <input type="file" id="webp-input" accept="image/jpeg,image/png,image/gif" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🌐</span>
            <p class="tool-upload__title">Select or drag &amp; drop an image</p>
            <p class="tool-upload__hint mono">JPG / PNG / GIF → next-gen WebP — in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('webp-input').click()">Choose Image</button>
        </div>
    </div>
    <div id="webp-controls" style="display:none;">
        <div class="tool-control-group" style="max-width:340px;">
            <label for="webp-quality" class="mono tool-label">WebP Quality: <strong id="webp-quality-val">85%</strong></label>
            <input type="range" id="webp-quality" min="10" max="100" value="85" class="tool-slider">
        </div>
        <div class="tool-preview-comparison">
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Original: <span id="webp-orig-size">—</span></p>
                <div class="tool-preview-img-wrap"><img id="webp-orig-preview" alt="Original preview"></div>
            </div>
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">WebP: <span id="webp-out-size">—</span> <span id="webp-savings" class="tool-savings mono"></span></p>
                <div class="tool-preview-img-wrap"><img id="webp-out-preview" alt="WebP preview"></div>
            </div>
        </div>
        <div class="tool-actions">
            <a href="#" id="webp-download" class="btn btn--solid tool-actions__btn" download="converted.webp">Download WebP ↓</a>
            <button type="button" class="tool-btn-link mono" id="webp-reset">Choose Another</button>
        </div>
    </div>
</div>
<script>
(function() {
    const dz = document.getElementById('webp-dropzone');
    const input = document.getElementById('webp-input');
    const controls = document.getElementById('webp-controls');
    const q = document.getElementById('webp-quality');
    const qVal = document.getElementById('webp-quality-val');
    const origPreview = document.getElementById('webp-orig-preview');
    const outPreview = document.getElementById('webp-out-preview');
    const origSize = document.getElementById('webp-orig-size');
    const outSize = document.getElementById('webp-out-size');
    const savings = document.getElementById('webp-savings');
    const dl = document.getElementById('webp-download');
    let img = null, origBytes = 0, baseName = 'image';
    const kb = (b) => (b / 1024).toFixed(1) + ' KB';
    function convert() {
        if (!img) return;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) { outSize.textContent = 'WebP not supported in this browser'; return; }
            const url = URL.createObjectURL(blob);
            outPreview.src = url;
            outSize.textContent = kb(blob.size);
            const saved = origBytes - blob.size;
            if (saved > 0) {
                const pct = Math.round(saved / origBytes * 100);
                savings.textContent = '(-' + pct + '%)'; savings.style.color = '#047857';
            } else { savings.textContent = ''; }
            dl.href = url; dl.download = baseName + '.webp';
        }, 'image/webp', parseInt(q.value, 10) / 100);
    }
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
        origBytes = file.size; origSize.textContent = kb(file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
            const im = new Image();
            im.onload = () => { img = im; origPreview.src = e.target.result; dz.style.display = 'none'; controls.style.display = 'block'; convert(); };
            im.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    q.addEventListener('input', () => { qVal.textContent = q.value + '%'; convert(); });
    document.getElementById('webp-reset').addEventListener('click', () => {
        img = null; input.value = ''; controls.style.display = 'none'; dz.style.display = 'block';
    });
})();
</script>
