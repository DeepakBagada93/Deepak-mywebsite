<div class="tool-app tool-app--jwt" id="jwt-app">
    <div class="tool-input-group">
        <label for="jwt-input" class="mono tool-label">Paste JWT (header.payload.signature)</label>
        <textarea id="jwt-input" class="tool-textarea mono" rows="4" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."></textarea>
    </div>
    <div class="tool-actions">
        <button type="button" class="btn btn--sm btn--primary" id="jwt-decode-btn">Decode</button>
        <button type="button" class="btn btn--sm btn--ghost" id="jwt-sample-btn">Sample</button>
        <button type="button" class="btn btn--sm btn--ghost" id="jwt-clear-btn">Clear</button>
        <span class="tool-actions__status mono" id="jwt-status"></span>
    </div>
    <div class="tool-split-editor" style="margin-top:16px;">
        <div class="tool-editor-pane">
            <div class="tool-pane-header"><span class="mono">HEADER</span></div>
            <textarea id="jwt-header" class="tool-textarea mono" readonly rows="6"></textarea>
        </div>
        <div class="tool-editor-pane">
            <div class="tool-pane-header"><span class="mono">PAYLOAD + CLAIMS</span></div>
            <textarea id="jwt-payload" class="tool-textarea mono" readonly rows="6"></textarea>
        </div>
    </div>
    <p class="mono text-muted" id="jwt-meta" style="font-size:0.8rem;margin-top:10px;"></p>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('jwt-input');
    const headerEl = document.getElementById('jwt-header');
    const payloadEl = document.getElementById('jwt-payload');
    const status = document.getElementById('jwt-status');
    const meta = document.getElementById('jwt-meta');
    function b64urlDecode(s) {
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        return JSON.parse(decodeURIComponent(escape(atob(s))));
    }
    function decode() {
        const val = input.value.trim();
        headerEl.value = ''; payloadEl.value = ''; meta.textContent = '';
        if (!val) { status.textContent = 'Paste a JWT first.'; return; }
        const parts = val.split('.');
        if (parts.length !== 3) { status.textContent = 'Invalid JWT — expected 3 dot-separated parts.'; return; }
        try {
            const header = b64urlDecode(parts[0]);
            const payload = b64urlDecode(parts[1]);
            headerEl.value = JSON.stringify(header, null, 4);
            payloadEl.value = JSON.stringify(payload, null, 4);
            const notes = [];
            if (payload.exp) {
                const exp = new Date(payload.exp * 1000);
                notes.push(exp > new Date() ? 'Token valid until ' + exp.toLocaleString() : 'EXPIRED since ' + exp.toLocaleString());
            }
            if (payload.iat) notes.push('Issued: ' + new Date(payload.iat * 1000).toLocaleString());
            if (payload.iss) notes.push('Issuer: ' + payload.iss);
            meta.textContent = notes.join(' · ') || 'Signature is NOT verified here — decoding only, never paste production secrets.';
            status.textContent = 'Decoded successfully. Signature not verified (browser-only).';
        } catch (e) { status.textContent = 'Decode error: ' + (e.message || 'malformed base64url'); }
    }
    document.getElementById('jwt-decode-btn').addEventListener('click', decode);
    document.getElementById('jwt-clear-btn').addEventListener('click', () => {
        input.value = ''; headerEl.value = ''; payloadEl.value = ''; meta.textContent = ''; status.textContent = '';
    });
    document.getElementById('jwt-sample-btn').addEventListener('click', () => {
        input.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRlZXBhayBCYWdhZGEiLCJpYXQiOjE3MjAwMDAwMDAsImV4cCI6MjA1MDAwMDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        decode();
    });
    input.addEventListener('input', decode);
});
</script>
