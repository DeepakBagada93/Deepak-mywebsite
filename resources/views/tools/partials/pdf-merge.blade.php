<div class="tool-app tool-app--pdf-merge">
    <div class="tool-upload" id="pdf-dropzone">
        <input type="file" id="pdf-input" accept="application/pdf" multiple style="display:none;">
        <div class="tool-upload__content">
            <span class="tool-upload__icon">📄</span>
            <p class="tool-upload__title">Select or drag &amp; drop PDF files</p>
            <p class="tool-upload__hint mono">Add 2 or more PDFs to combine into a single document</p>
            <button type="button" class="btn btn--solid tool-upload__btn" onclick="document.getElementById('pdf-input').click()">Choose Files</button>
        </div>
    </div>

    <div class="tool-file-list" id="pdf-file-list" style="display:none;">
        <div class="tool-file-list__head">
            <span class="mono" id="pdf-selected-count">0 files selected</span>
            <button type="button" class="tool-btn-link mono" id="pdf-clear-btn">Clear All</button>
        </div>
        <ul class="tool-file-list__items" id="pdf-items"></ul>
        
        <div class="tool-actions">
            <button type="button" class="btn btn--solid tool-actions__btn" id="pdf-merge-btn">Merge PDFs →</button>
            <span class="tool-actions__status mono" id="pdf-status"></span>
        </div>
    </div>

    <div class="tool-result" id="pdf-result" style="display:none;">
        <div class="tool-result__card">
            <span class="tool-result__icon">✅</span>
            <h3 class="tool-result__title">PDFs Merged Successfully!</h3>
            <p class="tool-result__desc mono" id="pdf-result-info"></p>
            <a href="#" id="pdf-download-btn" class="btn btn--solid" download="merged.pdf">Download Merged PDF ↓</a>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script>
(function() {
    const dropzone = document.getElementById('pdf-dropzone');
    const input = document.getElementById('pdf-input');
    const fileList = document.getElementById('pdf-file-list');
    const itemsList = document.getElementById('pdf-items');
    const countEl = document.getElementById('pdf-selected-count');
    const mergeBtn = document.getElementById('pdf-merge-btn');
    const clearBtn = document.getElementById('pdf-clear-btn');
    const statusEl = document.getElementById('pdf-status');
    const resultEl = document.getElementById('pdf-result');
    const resultInfo = document.getElementById('pdf-result-info');
    const downloadBtn = document.getElementById('pdf-download-btn');

    let selectedFiles = [];

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderList = () => {
        if (selectedFiles.length === 0) {
            fileList.style.display = 'none';
            resultEl.style.display = 'none';
            return;
        }
        fileList.style.display = 'block';
        countEl.textContent = `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} ready`;
        itemsList.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'tool-file-item';
            li.innerHTML = `
                <span class="tool-file-item__order mono">${String(index + 1).padStart(2, '0')}</span>
                <span class="tool-file-item__name">${file.name}</span>
                <span class="tool-file-item__size mono">${formatBytes(file.size)}</span>
                <button type="button" class="tool-file-item__del" data-index="${index}" title="Remove file">×</button>
            `;
            itemsList.appendChild(li);
        });

        itemsList.querySelectorAll('.tool-file-item__del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'), 10);
                selectedFiles.splice(idx, 1);
                renderList();
            });
        });
    };

    const addFiles = (files) => {
        const valid = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
        if (valid.length === 0) return;
        selectedFiles = selectedFiles.concat(valid);
        renderList();
    };

    input.addEventListener('change', (e) => {
        addFiles(e.target.files);
        input.value = '';
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
        if (e.dataTransfer && e.dataTransfer.files) {
            addFiles(e.dataTransfer.files);
        }
    });

    clearBtn.addEventListener('click', () => {
        selectedFiles = [];
        renderList();
        statusEl.textContent = '';
    });

    mergeBtn.addEventListener('click', async () => {
        if (selectedFiles.length < 2) {
            statusEl.textContent = 'Please select at least 2 PDF files to merge.';
            return;
        }

        if (typeof PDFLib === 'undefined') {
            statusEl.textContent = 'Loading PDF library, please wait a moment...';
            return;
        }

        try {
            mergeBtn.disabled = true;
            statusEl.textContent = 'Merging PDFs in your browser...';

            const mergedPdf = await PDFLib.PDFDocument.create();

            for (const file of selectedFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            downloadBtn.href = blobUrl;
            downloadBtn.download = 'merged-document.pdf';
            resultInfo.textContent = `Total Size: ${formatBytes(blob.size)} · ${selectedFiles.length} files combined`;
            resultEl.style.display = 'block';
            statusEl.textContent = '';
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            console.error(err);
            statusEl.textContent = 'Error merging files: ' + (err.message || 'Invalid PDF structure');
        } finally {
            mergeBtn.disabled = false;
        }
    });
})();
</script>
