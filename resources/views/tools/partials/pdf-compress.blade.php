<div class="tool-app tool-app--pdf-compress">
    <div class="tool-upload" id="pc-dropzone">
        <input type="file" id="pc-input" accept="application/pdf" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">🗜️</span>
            <p class="tool-upload__title">Select or drag &amp; drop a PDF</p>
            <p class="tool-upload__hint mono">Re-saves with object streams — 100% in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('pc-input').click()">Choose PDF</button>
        </div>
    </div>
    <div id="pc-controls" style="display:none;">
        <p class="mono" id="pc-info" style="font-size:0.85rem;"></p>
        <div class="tool-actions">
            <button type="button" class="btn btn--solid tool-actions__btn" id="pc-btn">Compress PDF →</button>
            <span class="tool-actions__status mono" id="pc-status"></span>
        </div>
        <div class="tool-result" id="pc-result" style="display:none;">
            <div class="tool-result__card">
                <span class="tool-result__icon">✅</span>
                <h3 class="tool-result__title">PDF Re-saved!</h3>
                <p class="tool-result__desc mono" id="pc-result-info"></p>
                <a href="#" id="pc-download" class="btn btn--solid" download="compressed.pdf">Download Compressed PDF ↓</a>
                <p class="mono text-muted" style="font-size:0.75rem;margin-top:10px;">Note: browser compression re-saves structure. For scanned PDFs, compress images first with the Image Compressor.</p>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
(function() {
    const dz = document.getElementById('pc-dropzone');
    const input = document.getElementById('pc-input');
    const controls = document.getElementById('pc-controls');
    const info = document.getElementById('pc-info');
    const btn = document.getElementById('pc-btn');
    const status = document.getElementById('pc-status');
    const result = document.getElementById('pc-result');
    const resultInfo = document.getElementById('pc-result-info');
    const dl = document.getElementById('pc-download');
    let fileBytes = null, origSize = 0, fileName = 'document';
    async function handleFile(file) {
        if (!file) return;
        fileName = file.name.replace(/\.pdf$/i, '') || 'document';
        origSize = file.size;
        fileBytes = await file.arrayBuffer();
        info.textContent = file.name + ' · ' + (file.size / 1024).toFixed(1) + ' KB';
        dz.style.display = 'none'; controls.style.display = 'block';
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    btn.addEventListener('click', async () => {
        if (!fileBytes) return;
        try {
            btn.disabled = true; status.textContent = 'Compressing in your browser...';
            const pdf = await PDFLib.PDFDocument.load(fileBytes);
            const bytes = await pdf.save({ useObjectStreams: true });
            const blob = new Blob([bytes], { type: 'application/pdf' });
            dl.href = URL.createObjectURL(blob);
            dl.download = fileName + '-compressed.pdf';
            const saved = origSize - blob.size;
            const pct = origSize > 0 ? Math.round(saved / origSize * 100) : 0;
            resultInfo.textContent = (origSize / 1024).toFixed(1) + ' KB → ' + (blob.size / 1024).toFixed(1) + ' KB' + (saved > 0 ? ' (-' + pct + '%)' : ' (already compact)');
            result.style.display = 'block'; status.textContent = '';
        } catch (e) { status.textContent = 'Error: ' + (e.message || 'compress failed'); }
        finally { btn.disabled = false; }
    });
})();
</script>
