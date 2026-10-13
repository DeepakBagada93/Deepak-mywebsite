<div class="tool-app tool-app--schema" id="schema-app">
    <div class="tool-controls-row">
        <div class="tool-control-group">
            <label for="schema-type" class="mono tool-label">Schema Type</label>
            <select id="schema-type" class="tool-select">
                <option value="Article" selected>Article</option>
                <option value="FAQPage">FAQ Page</option>
                <option value="Product">Product</option>
                <option value="LocalBusiness">Local Business</option>
            </select>
        </div>
        <div class="tool-control-group">
            <label for="schema-name" class="mono tool-label">Title / Name</label>
            <input type="text" id="schema-name" class="tool-input" placeholder="e.g. My guide title" value="Production AI Agents Guide 2026">
        </div>
    </div>
    <div class="tool-input-group">
        <label for="schema-desc" class="mono tool-label">Description</label>
        <textarea id="schema-desc" class="tool-textarea" rows="2">Field-tested multi-agent architecture with OPA guardrails and 42ms retrieval.</textarea>
    </div>
    <div class="tool-input-group">
        <label for="schema-url" class="mono tool-label">Page URL</label>
        <input type="text" id="schema-url" class="tool-input mono" value="https://deepakbagada.in/journal/example">
    </div>
    <div class="tool-input-group" id="schema-faq-wrap" style="display:none;">
        <label for="schema-faq" class="mono tool-label">FAQs (one per line: Question | Answer)</label>
        <textarea id="schema-faq" class="tool-textarea" rows="3">What is MCP? | Model Context Protocol connects LLMs to tools.
What does it cost? | Fixed-price builds from Rs 55K.</textarea>
    </div>
    <div class="tool-actions">
        <button type="button" class="btn btn--sm btn--primary" id="schema-gen">Generate JSON-LD</button>
        <button type="button" class="btn btn--sm btn--secondary" id="schema-copy">Copy</button>
    </div>
    <div class="tool-editor-pane" style="margin-top:16px;">
        <div class="tool-pane-header"><span class="mono">JSON-LD OUTPUT</span></div>
        <textarea id="schema-output" class="tool-textarea mono" readonly rows="10"></textarea>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const type = document.getElementById('schema-type');
    const name = document.getElementById('schema-name');
    const desc = document.getElementById('schema-desc');
    const url = document.getElementById('schema-url');
    const faqWrap = document.getElementById('schema-faq-wrap');
    const faq = document.getElementById('schema-faq');
    const output = document.getElementById('schema-output');
    function generate() {
        const t = type.value;
        const AT = '@';
        let obj = { [AT + 'context']: 'https://schema.org', [AT + 'type']: t };
        if (t === 'FAQPage') {
            const entities = faq.value.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
                const parts = line.split('|');
                return { [AT + 'type']: 'Question', 'name': (parts[0] || '').trim(), 'acceptedAnswer': { [AT + 'type']: 'Answer', 'text': (parts[1] || '').trim() } };
            }).filter(q => q.name);
            obj.mainEntity = entities;
        } else if (t === 'Product') {
            obj.name = name.value; obj.description = desc.value;
            obj.offers = { [AT + 'type']: 'Offer', 'price': '55000', 'priceCurrency': 'INR', 'availability': 'https://schema.org/InStock' };
        } else if (t === 'LocalBusiness') {
            obj.name = name.value || 'Deepak Bagada'; obj.description = desc.value;
            obj.url = url.value; obj.address = { [AT + 'type']: 'PostalAddress', 'addressLocality': 'Junagadh', 'addressRegion': 'Gujarat', 'postalCode': '362001', 'addressCountry': 'IN' };
        } else {
            obj.headline = name.value; obj.description = desc.value; obj.url = url.value;
            obj.author = { [AT + 'type']: 'Person', 'name': 'Deepak Bagada', 'url': 'https://deepakbagada.in' };
            obj.datePublished = new Date().toISOString().slice(0, 10);
        }
        output.value = JSON.stringify(obj, null, 4);
    }
    type.addEventListener('change', () => { faqWrap.style.display = type.value === 'FAQPage' ? 'block' : 'none'; generate(); });
    [name, desc, url, faq].forEach(el => el.addEventListener('input', generate));
    document.getElementById('schema-gen').addEventListener('click', generate);
    document.getElementById('schema-copy').addEventListener('click', async function() {
        try { await navigator.clipboard.writeText(output.value); this.textContent = 'Copied!'; setTimeout(() => this.textContent = 'Copy', 1500); }
        catch { output.select(); document.execCommand('copy'); }
    });
    generate();
});
</script>
