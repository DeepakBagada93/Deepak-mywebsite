<div class="store-pkg-explorer" data-reveal>
    <div class="store-pkg-explorer__header">
        <div class="store-pkg-explorer__title mono">
            <span>📦</span>
            <span>Package Contents &amp; Production Deliverables</span>
        </div>
        <div class="store-pkg-explorer__meta mono">
            <span class="store-pkg-explorer__badge">{{ $product['format'] }}</span>
            @if (! empty($product['file_size']))
                <span>💾 {{ $product['file_size'] }}</span>
            @endif
            <span style="color:#10b981;">✓ SHA-256 Verified</span>
        </div>
    </div>

    <div class="store-pkg-explorer__tree">
        @foreach ($product['deliverables'] as $item)
            @php
                $filename = $item;
                $desc = '';
                if (preg_match('/^([^\(]+)\s*\((.+)\)$/', $item, $m)) {
                    $filename = trim($m[1]);
                    $desc = trim($m[2]);
                }
                $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
                if (! in_array($ext, ['json', 'md', 'mjs', 'js', 'py', 'yml', 'yaml', 'sh'])) {
                    $ext = preg_match('/\.(json|md|mjs|js|py|yml|sh)/i', $filename, $em) ? strtolower($em[1]) : 'file';
                }
            @endphp
            <div class="store-pkg-explorer__item">
                <div class="store-pkg-explorer__file">
                    <span class="store-pkg-explorer__ext store-pkg-explorer__ext--{{ $ext }}">{{ $ext === 'file' ? 'DOC' : $ext }}</span>
                    <span style="font-weight:500;">{{ $filename }}</span>
                </div>
                @if ($desc)
                    <span class="store-pkg-explorer__desc">{{ $desc }}</span>
                @else
                    <span class="store-pkg-explorer__desc" style="color:#10b981;">✓ Included</span>
                @endif
            </div>
        @endforeach
    </div>

    <div style="padding:10px 18px;background:rgba(10,13,20,0.7);border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <span class="mono" style="font-size:0.74rem;color:#94a3b8;">
            ⚡ Commercial License Included · Zero Platform Lock-in · Run Offline in Your Workspace
        </span>
        <span class="mono" style="font-size:0.74rem;color:#38bdf8;">
            100% Unlocked Source
        </span>
    </div>
</div>
