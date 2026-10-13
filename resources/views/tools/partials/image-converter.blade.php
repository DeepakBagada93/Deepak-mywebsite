<div class="tool-app tool-app--image-converter">
    <div class="tool-upload" id="cv-dropzone">
        <input type="file" id="cv-input" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🔄</span>
            <p class="tool-upload__title">Select or drag &amp; drop an image</p>
            <p class="tool-upload__hint mono">Convert between JPG · PNG · WebP — in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('cv-input').click()">Choose Image</button>
        </div>
    </div>
    <div id="cv-controls" style="display:none;">
        <div class="tool-controls-row">
            <div class="tool-control-group">
                <label for="cv-format" class="mono tool-label">Output Format</label>
                <select id="cv-format" class="tool-select">
                    <option value="image/png">PNG (.png)</option>
                    <option value="image/jpeg" selected>JPEG (.jpg)</option>
                    <option value="image/webp">WebP (.webp)</option>
                </select>
            </div>
            <div class="tool-control-group">
                <label for="cv-quality" class="mono tool-label">Quality: <strong id="cv-quality-val">90%</strong></label>
                <input type="range" id="cv-quality" min="10" max="100" value="90" class="tool-slider">
            </div>
        </div>
        <div class="tool-preview-comparison">
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Original: <span id="cv-orig-size">—</span></p>
                <div class="tool-preview-img-wrap"><img id="cv-orig-preview" alt="Original preview"></div>
            </div>
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Converted: <span id="cv-out-size">—</span></p>
                <div class="tool-preview-img-wrap"><img id="cv-out-preview" alt="Converted preview"></div>
            </div>
        </div>
        <div class="tool-actions">
            <a href="#" id="cv-download" class="btn btn--solid tool-actions__btn" download="converted.jpg">Download Converted ↓</a>
            <button type="button" class="tool-btn-link mono" id="cv-reset">Choose Another</button>
        </div>
    </div>
</div>
<script>
(function() {
    const dz = document.getElementById('cv-dropzone');
    const input = document.getElementById('cv-input');
    const controls = document.getElementById('cv-controls');
    const fmt = document.getElementById('cv-format');
    const q = document.getElementById('cv-quality');
    const qVal = document.getElementById('cv-quality-val');
    const origPreview = document.getElementById('cv-orig-preview');
    const outPreview = document.getElementById('cv-out-preview');
    const origSize = document.getElementById('cv-orig-size');
    const outSize = document.getElementById('cv-out-size');
    const dl = document.getElementById('cv-download');
    let img = null, baseName = 'image';
    const kb = (b) => (b / 1024).toFixed(1) + ' KB';
    function convert() {
        if (!img) return;
        const format = fmt.value;
        const ext = format === 'image/png' ? 'png' : (format === 'image/webp' ? 'webp' : 'jpg');
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (format === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(img, 0, 0);
        const quality = format === 'image/png' ? undefined : (parseInt(q.value, 10) / 100);
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            outPreview.src = url;
            outSize.textContent = kb(blob.size) + ' · ' + ext.toUpperCase();
            dl.href = url;
            dl.download = baseName + '-converted.' + ext;
        }, format, quality);
    }
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
        origSize.textContent = kb(file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
            const im = new Image();
            im.onload = () => {
                img = im; origPreview.src = e.target.result;
                dz.style.display = 'none'; controls.style.display = 'block';
                convert();
            };
            im.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    fmt.addEventListener('change', convert);
    q.addEventListener('input', () => { qVal.textContent = q.value + '%'; convert(); });
    document.getElementById('cv-reset').addEventListener('click', () => {
        img = null; input.value = ''; controls.style.display = 'none'; dz.style.display = 'block';
    });
})();
</script>
