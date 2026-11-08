@if ($featuredProducts->isNotEmpty())
<section class="section home-products marvel-halftone" id="products">
    <div class="container">
        <div class="section__head" data-reveal>
            <div class="comic-issue-box" style="margin-bottom:12px;">
                <span>STARK TECH ARMORY</span> · <span>PRODUCTION PROTOCOLS</span> · <span>ISSUE #01</span>
            </div>
            <h2 class="section__title font-comic" style="font-size:clamp(2.8rem,6.5vw,4.8rem);line-height:0.95;margin-top:8px;">
                DEPLOY THE SYSTEM. <span class="text-marvel-red">SKIP 6 MONTHS OF BUILD.</span>
            </h2>
            <p class="store__lede" style="font-size:1.1rem;line-height:1.75;color:#334155;max-width:68ch;margin-top:12px;">
                Battle-tested, production-hardened AI toolkits engineered in our Junagadh AI Command Lab — autonomous agent swarms, MCP servers, context kernels and self-healing n8n pipelines. Instant GitHub repo invite, commercial license, and 14-day Tony Stark zero-risk guarantee.
            </p>
        </div>

        <div class="store__grid" style="margin-top:36px;">
            @foreach ($featuredProducts as $product)
                @include('products.partials.card', ['product' => $product])
            @endforeach
        </div>

        <div class="home-products__foot" data-reveal style="margin-top:48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;">
            <a class="btn--marvel" href="{{ route('products.index') }}">
                <span>⚡ Access All Armory Toolkits →</span>
            </a>
            <div class="font-hud" style="font-size:0.75rem;color:#64748b;font-weight:600;display:flex;gap:14px;flex-wrap:wrap;">
                <span>✔ 1-Click Cashfree UPI &amp; Cards</span>
                <span>✔ 100% Commercial License</span>
                <span>✔ Lifetime Repo Updates</span>
            </div>
        </div>
    </div>
</section>
@endif
