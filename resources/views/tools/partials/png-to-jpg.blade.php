<div class="tool-app tool-app--png-to-jpg">
    <div class="tool-upload" id="p2j-dropzone">
        <input type="file" id="p2j-input" accept="image/png" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🔁</span>
            <p class="tool-upload__title">Select or drag &amp; drop a PNG</p>
            <p class="tool-upload__hint mono">Transparency is flattened on white — 100% in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('p2j-input').click()">Choose PNG</button>
        </div>
    </div>
    <div id="p2j-controls" style="display:none;">
        <div class="tool-control-group" style="max-width:340px;">
            <label for="p2j-quality" class="mono tool-label">JPEG Quality: <strong id="p2j-quality-val">92%</strong></label>
            <input type="range" id="p2j-quality" min="10" max="100" value="92" class="tool-slider">
        </div>
        <div class="tool-preview-comparison">
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">PNG original</p>
                <div class="tool-preview-img-wrap"><img id="p2j-orig-preview" alt="PNG preview"></div>
            </div>
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">JPG: <span id="p2j-out-size">—</span></p>
                <div class="tool-preview-img-wrap"><img id="p2j-out-preview" alt="JPG preview"></div>
            </div>
        </div>
        <div class="tool-actions">
            <a href="#" id="p2j-download" class="btn btn--solid tool-actions__btn" download="converted.jpg">Download JPG ↓</a>
            <button type="button" class="tool-btn-link mono" id="p2j-reset">Choose Another</button>
        </div>
    </div>
</div>
<script>
(function() {
    const dz = document.getElementById('p2j-dropzone');
    const input = document.getElementById('p2j-input');
    const controls = document.getElementById('p2j-controls');
    const q = document.getElementById('p2j-quality');
    const qVal = document.getElementById('p2j-quality-val');
    const origPreview = document.getElementById('p2j-orig-preview');
    const outPreview = document.getElementById('p2j-out-preview');
    const outSize = document.getElementById('p2j-out-size');
    const dl = document.getElementById('p2j-download');
    let img = null, baseName = 'image';
    function convert() {
        if (!img) return;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            outPreview.src = url;
            outSize.textContent = (blob.size / 1024).toFixed(1) + ' KB';
            dl.href = url; dl.download = baseName + '.jpg';
        }, 'image/jpeg', parseInt(q.value, 10) / 100);
    }
    function handleFile(file) {
        if (!file) return;
        baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
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
    document.getElementById('p2j-reset').addEventListener('click', () => {
        img = null; input.value = ''; controls.style.display = 'none'; dz.style.display = 'block';
    });
})();
</script>
