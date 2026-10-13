<div class="tool-app tool-app--image-to-pdf">
    <div class="tool-upload" id="i2p-dropzone">
        <input type="file" id="i2p-input" accept="image/jpeg,image/png" multiple style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">📑</span>
            <p class="tool-upload__title">Select or drag &amp; drop images</p>
            <p class="tool-upload__hint mono">JPG / PNG → single PDF, one page per image — no watermark</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('i2p-input').click()">Choose Images</button>
        </div>
    </div>
    <div id="i2p-controls" style="display:none;">
        <p class="mono" id="i2p-count" style="font-size:0.85rem;"></p>
        <ul class="tool-file-list__items" id="i2p-items"></ul>
        <div class="tool-actions">
            <button type="button" class="btn btn--solid tool-actions__btn" id="i2p-btn">Create PDF →</button>
            <button type="button" class="tool-btn-link mono" id="i2p-clear">Clear All</button>
            <span class="tool-actions__status mono" id="i2p-status"></span>
        </div>
        <div class="tool-result" id="i2p-result" style="display:none;">
            <div class="tool-result__card">
                <span class="tool-result__icon">✅</span>
                <h3 class="tool-result__title">PDF Created!</h3>
                <p class="tool-result__desc mono" id="i2p-result-info"></p>
                <a href="#" id="i2p-download" class="btn btn--solid" download="images.pdf">Download PDF ↓</a>
            </div>
        </div>
    </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
(function() {
    const dz = document.getElementById('i2p-dropzone');
    const input = document.getElementById('i2p-input');
    const controls = document.getElementById('i2p-controls');
    const items = document.getElementById('i2p-items');
    const count = document.getElementById('i2p-count');
    const btn = document.getElementById('i2p-btn');
    const status = document.getElementById('i2p-status');
    const result = document.getElementById('i2p-result');
    const resultInfo = document.getElementById('i2p-result-info');
    const dl = document.getElementById('i2p-download');
    let files = [];
    function escapeHtml(s) { return s.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
    function render() {
        if (!files.length) { controls.style.display = 'none'; return; }
        controls.style.display = 'block';
        count.textContent = files.length + ' image' + (files.length > 1 ? 's' : '') + ' ready';
        items.innerHTML = '';
        files.forEach((f, i) => {
            const li = document.createElement('li');
            li.className = 'tool-file-item';
            li.innerHTML = '<span class="tool-file-item__order mono">' + String(i + 1).padStart(2, '0') + '</span>' +
                '<span class="tool-file-item__name">' + escapeHtml(f.name) + '</span>' +
                '<button type="button" class="tool-file-item__del" data-i="' + i + '">×</button>';
            items.appendChild(li);
        });
        items.querySelectorAll('.tool-file-item__del').forEach(b => {
            b.addEventListener('click', (e) => { files.splice(parseInt(e.target.dataset.i, 10), 1); render(); });
        });
    }
    function addFiles(list) {
        const valid = [...list].filter(f => f.type === 'image/jpeg' || f.type === 'image/png');
        if (valid.length) { files = files.concat(valid); render(); }
    }
    input.addEventListener('change', (e) => { addFiles(e.target.files); input.value = ''; });
    ['dragenter','dragover'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); }));
    ['dragleave','drop'].forEach(n => dz.addEventListener(n, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); }));
    dz.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files); });
    document.getElementById('i2p-clear').addEventListener('click', () => { files = []; result.style.display = 'none'; render(); });
    btn.addEventListener('click', async () => {
        if (!files.length) return;
        try {
            btn.disabled = true; status.textContent = 'Building PDF in your browser...';
            const pdf = await PDFLib.PDFDocument.create();
            for (const file of files) {
                const bytes = new Uint8Array(await file.arrayBuffer());
                let embedded;
                if (file.type === 'image/png') embedded = await pdf.embedPng(bytes);
                else embedded = await pdf.embedJpg(bytes);
                const page = pdf.addPage([embedded.width, embedded.height]);
                page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
            }
            const out = await pdf.save();
            const blob = new Blob([out], { type: 'application/pdf' });
            dl.href = URL.createObjectURL(blob);
            resultInfo.textContent = files.length + ' images · ' + (blob.size / 1024).toFixed(1) + ' KB';
            result.style.display = 'block'; status.textContent = '';
        } catch (e) { status.textContent = 'Error: ' + (e.message || 'build failed'); }
        finally { btn.disabled = false; }
    });
})();
</script>
