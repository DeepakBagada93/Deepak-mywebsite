<div class="tool-app tool-app--pdf-to-image">
    <div class="tool-upload" id="p2i-dropzone">
        <input type="file" id="p2i-input" accept="application/pdf" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🖼️</span>
            <p class="tool-upload__title">Select or drag &amp; drop a PDF</p>
            <p class="tool-upload__hint mono">Each page → high-quality PNG — in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('p2i-input').click()">Choose PDF</button>
        </div>
    </div>
    <div id="p2i-controls" style="display:none;">
        <div class="tool-controls-row">
            <div class="tool-control-group">
                <label for="p2i-scale" class="mono tool-label">Render Scale</label>
                <select id="p2i-scale" class="tool-select">
                    <option value="1.5">Standard (1.5x)</option>
                    <option value="2" selected>High (2x)</option>
                    <option value="3">Ultra (3x)</option>
                </select>
            </div>
            <div class="tool-actions">
                <button type="button" class="btn btn--solid tool-actions__btn" id="p2i-btn">Convert to Images →</button>
                <span class="tool-actions__status mono" id="p2i-status"></span>
            </div>
        </div>
        <div id="p2i-gallery" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;margin-top:20px;"></div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
(function() {
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const dz = document.getElementById('p2i-dropzone');
    const input = document.getElementById('p2i-input');
    const controls = document.getElementById('p2i-controls');
    const scaleEl = document.getElementById('p2i-scale');
    const btn = document.getElementById('p2i-btn');
    const status = document.getElementById('p2i-status');
    const gallery = document.getElementById('p2i-gallery');
    let fileBytes = null, fileName = 'document';
    async function handleFile(file) {
        if (!file) return;
        fileName = file.name.replace(/\.pdf$/i, '') || 'document';
        fileBytes = await file.arrayBuffer();
        gallery.innerHTML = '';
        dz.style.display = 'none'; controls.style.display = 'block';
        status.textContent = file.name + ' loaded — pick a scale and convert.';
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    btn.addEventListener('click', async () => {
        if (!fileBytes) return;
        if (typeof pdfjsLib === 'undefined') { status.textContent = 'PDF engine still loading — wait a moment and retry.'; return; }
        try {
            btn.disabled = true; gallery.innerHTML = '';
            status.textContent = 'Rendering pages...';
            const pdf = await pdfjsLib.getDocument({ data: fileBytes.slice(0) }).promise;
            const scale = parseFloat(scaleEl.value) || 2;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width; canvas.height = viewport.height;
                await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
                const url = canvas.toDataURL('image/png');
                const card = document.createElement('div');
                card.innerHTML = '<img src="' + url + '" style="width:100%;border:1px solid #e5e5e5;border-radius:4px;" alt="Page ' + i + '">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;"><span class="mono" style="font-size:0.75rem;">Page ' + i + '</span>' +
                    '<a href="' + url + '" download="' + fileName + '-page-' + i + '.png" class="btn btn--xs btn--secondary">PNG ↓</a></div>';
                gallery.appendChild(card);
                status.textContent = 'Rendered ' + i + ' / ' + pdf.numPages + ' pages...';
            }
            status.textContent = 'Done — ' + pdf.numPages + ' pages converted.';
        } catch (e) { status.textContent = 'Error: ' + (e.message || 'render failed'); }
        finally { btn.disabled = false; }
    });
})();
</script>
