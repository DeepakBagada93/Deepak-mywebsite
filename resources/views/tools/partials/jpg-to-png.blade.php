<div class="tool-app tool-app--jpg-to-png">
    <div class="tool-upload" id="j2p-dropzone">
        <input type="file" id="j2p-input" accept="image/jpeg" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🔃</span>
            <p class="tool-upload__title">Select or drag &amp; drop a JPG</p>
            <p class="tool-upload__hint mono">Lossless PNG conversion — 100% in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('j2p-input').click()">Choose JPG</button>
        </div>
    </div>
    <div id="j2p-controls" style="display:none;">
        <div class="tool-preview-comparison">
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">JPG original</p>
                <div class="tool-preview-img-wrap"><img id="j2p-orig-preview" alt="JPG preview"></div>
            </div>
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">PNG: <span id="j2p-out-size">—</span></p>
                <div class="tool-preview-img-wrap"><img id="j2p-out-preview" alt="PNG preview"></div>
            </div>
        </div>
        <div class="tool-actions">
            <a href="#" id="j2p-download" class="btn btn--solid tool-actions__btn" download="converted.png">Download PNG ↓</a>
            <button type="button" class="tool-btn-link mono" id="j2p-reset">Choose Another</button>
        </div>
    </div>
</div>
<script>
(function() {
    const dz = document.getElementById('j2p-dropzone');
    const input = document.getElementById('j2p-input');
    const controls = document.getElementById('j2p-controls');
    const origPreview = document.getElementById('j2p-orig-preview');
    const outPreview = document.getElementById('j2p-out-preview');
    const outSize = document.getElementById('j2p-out-size');
    const dl = document.getElementById('j2p-download');
    let baseName = 'image';
    function handleFile(file) {
        if (!file) return;
        baseName = file.name.replace(/\.[^/.]+$/, '') || 'image';
        const reader = new FileReader();
        reader.onload = (e) => {
            const im = new Image();
            im.onload = () => {
                origPreview.src = e.target.result;
                const canvas = document.createElement('canvas');
                canvas.width = im.naturalWidth; canvas.height = im.naturalHeight;
                canvas.getContext('2d').drawImage(im, 0, 0);
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    outPreview.src = url;
                    outSize.textContent = (blob.size / 1024).toFixed(1) + ' KB';
                    dl.href = url; dl.download = baseName + '.png';
                }, 'image/png');
                dz.style.display = 'none'; controls.style.display = 'block';
            };
            im.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    document.getElementById('j2p-reset').addEventListener('click', () => {
        input.value = ''; controls.style.display = 'none'; dz.style.display = 'block';
    });
})();
</script>
