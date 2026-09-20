<div class="tool-app tool-app--qr-generator">
    <div class="tool-split-layout">
        <div class="tool-split-form">
            <div class="tool-input-group">
                <label for="qr-text" class="mono tool-label">URL or Text to Encode</label>
                <textarea id="qr-text" class="tool-textarea" rows="4" placeholder="https://yourwebsite.com or any text, UPI, phone number...">https://deepakbagada.in</textarea>
            </div>

            <div class="tool-controls-row">
                <div class="tool-control-group">
                    <label for="qr-size" class="mono tool-label">Size (px)</label>
                    <select id="qr-size" class="tool-select">
                        <option value="180">Small (180px)</option>
                        <option value="256" selected>Medium (256px)</option>
                        <option value="380">Large (380px)</option>
                        <option value="512">HD (512px)</option>
                    </select>
                </div>
                <div class="tool-control-group">
                    <label for="qr-correction" class="mono tool-label">Error Correction</label>
                    <select id="qr-correction" class="tool-select">
                        <option value="L">Low (7%)</option>
                        <option value="M" selected>Medium (15%)</option>
                        <option value="Q">Quartile (25%)</option>
                        <option value="H">High (30%)</option>
                    </select>
                </div>
            </div>

            <div class="tool-quick-presets">
                <span class="mono tool-presets-label">Quick Templates:</span>
                <button type="button" class="pill-btn pill-btn--sm" data-preset="url">Website URL</button>
                <button type="button" class="pill-btn pill-btn--sm" data-preset="upi">UPI Payment</button>
                <button type="button" class="pill-btn pill-btn--sm" data-preset="wifi">WiFi Network</button>
            </div>
        </div>

        <div class="tool-split-output">
            <div class="tool-qr-display" id="qr-container">
                <div id="qr-output"></div>
            </div>
            <div class="tool-actions" style="margin-top: 20px; justify-content: center;">
                <button type="button" id="qr-download-btn" class="btn btn--solid">Download QR Code (PNG) ↓</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
(function() {
    const textInput = document.getElementById('qr-text');
    const sizeSelect = document.getElementById('qr-size');
    const corrSelect = document.getElementById('qr-correction');
    const output = document.getElementById('qr-output');
    const downloadBtn = document.getElementById('qr-download-btn');
    let qr = null;

    const generateQR = () => {
        const text = textInput.value.trim() || 'https://deepakbagada.in';
        const size = parseInt(sizeSelect.value, 10) || 256;
        const level = corrSelect.value || 'M';

        output.innerHTML = '';
        if (typeof QRCode === 'undefined') return;

        qr = new QRCode(output, {
            text: text,
            width: size,
            height: size,
            colorDark: "#161616",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel[level]
        });
    };

    textInput.addEventListener('input', generateQR);
    sizeSelect.addEventListener('change', generateQR);
    corrSelect.addEventListener('change', generateQR);

    document.querySelectorAll('[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            if (preset === 'url') textInput.value = 'https://deepakbagada.in';
            else if (preset === 'upi') textInput.value = 'upi://pay?pa=ceo@saasnext.in&pn=Deepak%20Bagada&cu=INR';
            else if (preset === 'wifi') textInput.value = 'WIFI:S:MyHomeWiFi;T:WPA;P:Password123;;';
            generateQR();
        });
    });

    downloadBtn.addEventListener('click', () => {
        const img = output.querySelector('img');
        const canvas = output.querySelector('canvas');
        let dataUrl = '';
        if (img && img.src && !img.src.startsWith('blob:')) {
            dataUrl = img.src;
        } else if (canvas) {
            dataUrl = canvas.toDataURL("image/png");
        }
        if (!dataUrl) return;

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'qrcode.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Initial render
    setTimeout(generateQR, 100);
})();
</script>
