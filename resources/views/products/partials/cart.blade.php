{{-- Client-side cart (localStorage) — no account, no server session --}}
@php
    $cartCatalog = collect(config('products'))->mapWithKeys(fn ($p) => [
        $p['slug'] => [
            'slug' => $p['slug'],
            'title' => $p['title'],
            'price_inr' => \App\Support\Money::priceFor($p, 'INR'),
            'price_usd' => \App\Support\Money::priceFor($p, 'USD'),
            'icon' => $p['icon'],
        ],
    ]);
@endphp

<button type="button" class="cart-fab" id="cart-fab" aria-label="Open cart">
    <span class="cart-fab__icon">🛒</span>
    <span class="cart-fab__label mono">Cart</span>
    <span class="cart-fab__count mono" id="cart-count">0</span>
</button>

<div class="cart-drawer" id="cart-drawer" aria-hidden="true">
    <div class="cart-drawer__backdrop" data-cart-close></div>
    <aside class="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div class="cart-drawer__head">
            <span class="mono cart-drawer__title">Your Cart</span>
            <button type="button" class="cart-drawer__close" data-cart-close aria-label="Close cart">✕</button>
        </div>
        <ul class="cart-drawer__items" id="cart-items"></ul>
        <p class="cart-drawer__empty" id="cart-empty">Your cart is empty. Add a product to bundle and save.</p>
        <div class="cart-drawer__foot" id="cart-foot" style="display:none">
            <div class="cart-drawer__currency">@include('products.partials.currency-switch')</div>
            <div class="cart-drawer__subtotal">
                <span class="mono">Subtotal</span>
                <strong id="cart-subtotal">₹0</strong>
            </div>
            <button type="button" class="btn btn--primary cart-drawer__checkout" id="cart-checkout">Checkout →</button>
            <p class="mono cart-drawer__note">No account needed · Secure via Cashfree</p>
        </div>
    </aside>
</div>

<script>
(function () {
    var CATALOG = @json($cartCatalog);
    var META = @json(\App\Support\Money::currencies());
    var KEY = 'db_cart_v1';
    var fab = document.getElementById('cart-fab');
    var drawer = document.getElementById('cart-drawer');
    var listEl = document.getElementById('cart-items');
    var countEl = document.getElementById('cart-count');
    var emptyEl = document.getElementById('cart-empty');
    var footEl = document.getElementById('cart-foot');
    var subtotalEl = document.getElementById('cart-subtotal');

    function read() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
    }
    function write(items) {
        localStorage.setItem(KEY, JSON.stringify(items));
        render();
    }
    function currency() {
        return (window.DBStoreCurrency && window.DBStoreCurrency.get()) || 'INR';
    }
    function money(n) {
        var code = currency();
        var meta = META[code] || { symbol: '', locale: 'en-US', minor: 0 };
        try {
            return new Intl.NumberFormat(meta.locale.replace('_', '-'), {
                style: 'currency', currency: code,
                minimumFractionDigits: meta.minor, maximumFractionDigits: meta.minor,
            }).format(Number(n));
        } catch (e) {
            return meta.symbol + Number(n).toLocaleString();
        }
    }
    function priceOf(p) { return currency() === 'USD' ? p.price_usd : p.price_inr; }
    function items() {
        return read().map(function (slug) { return CATALOG[slug]; }).filter(Boolean);
    }

    function render() {
        var cart = items();
        countEl.textContent = cart.length;
        fab.classList.toggle('cart-fab--active', cart.length > 0);
        listEl.innerHTML = '';
        if (!cart.length) {
            emptyEl.style.display = 'block';
            footEl.style.display = 'none';
            return;
        }
        emptyEl.style.display = 'none';
        footEl.style.display = 'block';
        var total = 0;
        cart.forEach(function (p) {
            var price = priceOf(p);
            total += price;
            var li = document.createElement('li');
            li.className = 'cart-drawer__item';
            li.innerHTML =
                '<span class="cart-drawer__item-icon">' + p.icon + '</span>' +
                '<div class="cart-drawer__item-body"><strong>' + p.title + '</strong>' +
                '<span class="mono">' + (price > 0 ? money(price) : 'Free') + '</span></div>' +
                '<button type="button" class="cart-drawer__remove" data-remove="' + p.slug + '" aria-label="Remove">✕</button>';
            listEl.appendChild(li);
        });
        subtotalEl.textContent = total > 0 ? money(total) : 'Free';
    }

    function openDrawer() { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); }
    function closeDrawer() { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }

    function add(slug) {
        var cart = read();
        if (cart.indexOf(slug) === -1) cart.push(slug);
        write(cart);
        openDrawer();
    }
    function remove(slug) { write(read().filter(function (s) { return s !== slug; })); }
    function clear() { write([]); }

    document.addEventListener('click', function (e) {
        var addBtn = e.target.closest('[data-add-cart]');
        if (addBtn) { e.preventDefault(); add(addBtn.getAttribute('data-add-cart')); return; }
        var rm = e.target.closest('[data-remove]');
        if (rm) { e.preventDefault(); remove(rm.getAttribute('data-remove')); return; }
        if (e.target.closest('[data-cart-close]')) { closeDrawer(); }
    });

    fab.addEventListener('click', openDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

    // Re-price the drawer whenever the visitor flips currency.
    document.addEventListener('store:currency', render);

    document.getElementById('cart-checkout').addEventListener('click', function () {
        var cart = items();
        if (!cart.length) return;
        closeDrawer();
        var slugs = cart.map(function (i) { return i.slug; }).join(',');
        location.href = '{{ route('products.checkout.page') }}?items=' + encodeURIComponent(slugs);
    });

    window.DBCart = { add: add, remove: remove, clear: clear, items: items };

    // Update "Add to cart" buttons that are already in the cart.
    render();
})();
</script>
