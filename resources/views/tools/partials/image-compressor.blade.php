<div class="tool-app tool-app--image-compressor">
    <div class="tool-upload" id="img-dropzone">
        <input type="file" id="img-input" accept="image/jpeg,image/png,image/webp" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🖼️</span>
            <p class="tool-upload__title">Select or drag &amp; drop an image</p>
            <p class="tool-upload__hint mono">Supports JPG, PNG, and WebP — processed 100% in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('img-input').click()">Choose Image</button>
        </div>
    </div>

    <div class="tool-workspace-controls" id="img-controls" style="display:none;">
        <div class="tool-controls-row">
            <div class="tool-control-group">
                <label for="img-quality-slider" class="mono tool-label">Compression Quality: <strong id="img-quality-val">75%</strong></label>
                <input type="range" id="img-quality-slider" min="10" max="95" value="75" class="tool-slider">
            </div>
            <div class="tool-control-group">
                <label for="img-format-select" class="mono tool-label">Output Format</label>
                <select id="img-format-select" class="tool-select">
                    <option value="image/jpeg">JPEG (.jpg)</option>
                    <option value="image/webp">WebP (.webp)</option>
                </select>
            </div>
        </div>

        <div class="tool-preview-comparison">
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Original: <span id="img-orig-size">0 KB</span></p>
                <div class="tool-preview-img-wrap">
                    <img id="img-orig-preview" alt="Original preview">
                </div>
            </div>
            <div class="tool-preview-box">
                <p class="mono tool-preview-tag">Compressed: <span id="img-comp-size">0 KB</span> <span id="img-savings" class="tool-savings mono"></span></p>
                <div class="tool-preview-img-wrap">
                    <img id="img-comp-preview" alt="Compressed preview">
                </div>
            </div>
        </div>

        <div class="tool-actions">
            <a href="#" id="img-download-btn" class="btn btn--solid tool-actions__btn" download="compressed-image.jpg">Download Compressed Image ↓</a>
            <button type="button" class="tool-btn-link mono" id="img-reset-btn">Choose Another Image</button>
        </div>
    </div>
</div>

<script>
(function() {
    const dropzone = document.getElementById('img-dropzone');
    const input = document.getElementById('img-input');
    const controls = document.getElementById('img-controls');
    const slider = document.getElementById('img-quality-slider');
    const qualityVal = document.getElementById('img-quality-val');
    const formatSelect = document.getElementById('img-format-select');
    const origPreview = document.getElementById('img-orig-preview');
    const compPreview = document.getElementById('img-comp-preview');
    const origSizeEl = document.getElementById('img-orig-size');
    const compSizeEl = document.getElementById('img-comp-size');
    const savingsEl = document.getElementById('img-savings');
    const downloadBtn = document.getElementById('img-download-btn');
    const resetBtn = document.getElementById('img-reset-btn');

    let loadedImage = null;
    let originalFileSize = 0;
    let originalFileName = '';

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        return (bytes / k).toFixed(1) + ' KB';
    };

    const compress = () => {
        if (!loadedImage) return;
        const quality = parseInt(slider.value, 10) / 100;
        const format = formatSelect.value;
        const ext = format === 'image/webp' ? 'webp' : 'jpg';

        const canvas = document.createElement('canvas');
        canvas.width = loadedImage.naturalWidth;
        canvas.height = loadedImage.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(loadedImage, 0, 0);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            compPreview.src = url;
            compSizeEl.textContent = formatBytes(blob.size);

            const saved = originalFileSize - blob.size;
            if (saved > 0) {
                const pct = Math.round((saved / originalFileSize) * 100);
                savingsEl.textContent = `(-${pct}%)`;
                savingsEl.style.color = '#047857';
            } else {
                savingsEl.textContent = '(0%)';
                savingsEl.style.color = 'var(--muted)';
            }

            const baseName = originalFileName.replace(/\.[^/.]+$/, "");
            downloadBtn.href = url;
            downloadBtn.download = `${baseName}-compressed.${ext}`;
        }, format, quality);
    };

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        originalFileSize = file.size;
        originalFileName = file.name;
        origSizeEl.textContent = formatBytes(file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                loadedImage = img;
                origPreview.src = e.target.result;
                dropzone.style.display = 'none';
                controls.style.display = 'block';
                compress();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    input.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    });

    ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            dropzone.classList.add('is-dragover');
        });
    });

    ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            dropzone.classList.remove('is-dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    slider.addEventListener('input', () => {
        qualityVal.textContent = slider.value + '%';
        compress();
    });

    formatSelect.addEventListener('change', compress);

    resetBtn.addEventListener('click', () => {
        loadedImage = null;
        input.value = '';
        controls.style.display = 'none';
        dropzone.style.display = 'block';
    });
})();
</script>
