@if ($featuredProducts->isNotEmpty())
<section class="section home-products" id="products">
    <div class="container">
        <div class="section__head" data-reveal>
            <p class="mono section__label">Shop AI Toolkits · India</p>
            <h2 class="section__title"><span class="split-lines">Buy the system. Skip the rebuild.</span></h2>
            <p class="store__lede">Production AI toolkits I use in client builds — agent delivery systems, MCP servers, context kernels and n8n hardening packs. Instant download, commercial license, 30-day guarantee.</p>
        </div>

        <div class="store__grid">
            @foreach ($featuredProducts as $product)
                @include('products.partials.card', ['product' => $product])
            @endforeach
        </div>

        <div class="home-products__foot" data-reveal>
            <a class="btn btn--solid" href="{{ route('products.index') }}">Browse all AI toolkits</a>
            <span class="mono">Instant download · Commercial license · 30-day guarantee</span>
        </div>
    </div>
</section>
@endif
