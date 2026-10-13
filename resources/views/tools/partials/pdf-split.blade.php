<div class="tool-app tool-app--pdf-split">
    <div class="tool-upload" id="split-dropzone">
        <input type="file" id="split-input" accept="application/pdf" style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">✂️</span>
            <p class="tool-upload__title">Select or drag &amp; drop a PDF</p>
            <p class="tool-upload__hint mono">Extract pages by range — 100% in your browser</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('split-input').click()">Choose PDF</button>
        </div>
    </div>
    <div id="split-controls" style="display:none;">
        <p class="mono" id="split-info" style="font-size:0.85rem;"></p>
        <div class="tool-input-group">
            <label for="split-range" class="mono tool-label">Pages to extract (e.g. 1-3, 5, 7-9)</label>
            <input type="text" id="split-range" class="tool-input mono" placeholder="1-3" value="1-3">
        </div>
        <div class="tool-actions">
            <button type="button" class="btn btn--solid tool-actions__btn" id="split-btn">Extract Pages →</button>
            <span class="tool-actions__status mono" id="split-status"></span>
        </div>
        <div class="tool-result" id="split-result" style="display:none;">
            <div class="tool-result__card">
                <span class="tool-result__icon">✅</span>
                <h3 class="tool-result__title">Pages Extracted!</h3>
                <p class="tool-result__desc mono" id="split-result-info"></p>
                <a href="#" id="split-download" class="btn btn--solid" download="split.pdf">Download Extracted PDF ↓</a>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
(function() {
    const dz = document.getElementById('split-dropzone');
    const input = document.getElementById('split-input');
    const controls = document.getElementById('split-controls');
    const info = document.getElementById('split-info');
    const rangeEl = document.getElementById('split-range');
    const btn = document.getElementById('split-btn');
    const status = document.getElementById('split-status');
    const result = document.getElementById('split-result');
    const resultInfo = document.getElementById('split-result-info');
    const dl = document.getElementById('split-download');
    let fileBytes = null, totalPages = 0, fileName = 'document';
    function parseRange(str, max) {
        const pages = new Set();
        str.split(',').forEach(part => {
            part = part.trim();
            if (!part) return;
            const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
            if (m) {
                let a = Math.max(1, parseInt(m[1], 10)), b = Math.min(max, parseInt(m[2], 10));
                if (a > b) { const t = a; a = b; b = t; }
                for (let i = a; i <= b; i++) pages.add(i - 1);
            } else if (/^\d+$/.test(part)) {
                const p = parseInt(part, 10);
                if (p >= 1 && p <= max) pages.add(p - 1);
            }
        });
        return [...pages].sort((a, b) => a - b);
    }
    async function handleFile(file) {
        if (!file) return;
        fileName = file.name.replace(/\.pdf$/i, '') || 'document';
        try {
            fileBytes = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(fileBytes);
            totalPages = pdf.getPageCount();
            info.textContent = file.name + ' · ' + totalPages + ' pages';
            rangeEl.value = '1-' + Math.min(3, totalPages);
            dz.style.display = 'none'; controls.style.display = 'block';
        } catch (e) { info.textContent = 'Could not read PDF: ' + (e.message || 'invalid file'); }
    }
    input.addEventListener('change', (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
    btn.addEventListener('click', async () => {
        if (!fileBytes) return;
        const idx = parseRange(rangeEl.value, totalPages);
        if (!idx.length) { status.textContent = 'No valid pages in range (1-' + totalPages + ').'; return; }
        try {
            btn.disabled = true; status.textContent = 'Extracting ' + idx.length + ' pages...';
            const src = await PDFLib.PDFDocument.load(fileBytes);
            const out = await PDFLib.PDFDocument.create();
            const copied = await out.copyPages(src, idx);
            copied.forEach(p => out.addPage(p));
            const bytes = await out.save();
            const blob = new Blob([bytes], { type: 'application/pdf' });
            dl.href = URL.createObjectURL(blob);
            dl.download = fileName + '-pages.pdf';
            resultInfo.textContent = idx.length + ' of ' + totalPages + ' pages · ' + (blob.size / 1024).toFixed(1) + ' KB';
            result.style.display = 'block'; status.textContent = '';
        } catch (e) { status.textContent = 'Error: ' + (e.message || 'extract failed'); }
        finally { btn.disabled = false; }
    });
})();
</script>
