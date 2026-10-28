{{-- Global client-side cart drawer (localStorage) — no account, instant drawer --}}
@php
    $cartCatalog = collect(config('products'))->mapWithKeys(fn ($p) => [
        $p['slug'] => [
            'slug' => $p['slug'],
            'title' => $p['title'],
            'price_inr' => \App\Support\Money::priceFor($p, 'INR'),
            'price_usd' => \App\Support\Money::priceFor($p, 'USD'),
            'icon' => $p['icon'] ?? '📦',
            'format' => $p['format'] ?? 'ZIP',
        ],
    ]);
@endphp

{{-- Floating Cart Action Button (FAB) --}}
<button type="button" class="cart-fab" id="cart-fab" data-open-cart aria-label="Open Shopping Cart" style="display:none">
    <span class="cart-fab__icon">🛒</span>
    <span class="cart-fab__label mono">Cart</span>
    <span class="cart-fab__count mono" id="cart-count">0</span>
</button>

{{-- Slide-Over Cart Drawer --}}
<div class="cart-drawer" id="cart-drawer" aria-hidden="true">
    <div class="cart-drawer__backdrop" data-cart-close></div>
    <aside class="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {{-- Drawer Head --}}
        <div class="cart-drawer__head">
            <div class="cart-drawer__head-info">
                <p class="mono cart-drawer__kicker">Instant Digital Store</p>
                <h2 class="cart-drawer__title">Your Cart</h2>
            </div>
            <div class="cart-drawer__head-actions">
                <span class="mono cart-drawer__badge" id="cart-panel-count">0 items</span>
                <button type="button" class="cart-drawer__close" data-cart-close aria-label="Close cart">✕</button>
            </div>
        </div>

        {{-- Items List --}}
        <ul class="cart-drawer__items" id="cart-items"></ul>

        {{-- Empty State --}}
        <div class="cart-drawer__empty" id="cart-empty">
            <div class="cart-drawer__empty-icon">🛒</div>
            <h3 class="cart-drawer__empty-title">Your cart is empty</h3>
            <p class="cart-drawer__empty-text">Add production AI toolkits, boilerplates, or automation packs to start shipping immediately.</p>
            <a href="{{ route('products.index') }}" class="btn btn--ghost btn--sm cart-drawer__empty-btn" data-cart-close>Browse Toolkits →</a>
        </div>

        {{-- Drawer Footer --}}
        <div class="cart-drawer__foot" id="cart-foot" style="display:none">
            <div class="cart-drawer__subtotal">
                <div class="cart-drawer__subtotal-meta">
                    <span class="mono cart-drawer__subtotal-label">Subtotal</span>
                    <small class="mono cart-drawer__subtotal-tax">Taxes included · Lifetime access</small>
                </div>
                <strong class="cart-drawer__subtotal-val" id="cart-subtotal">$0</strong>
            </div>

            <button type="button" class="btn btn--primary cart-drawer__checkout" id="cart-checkout">
                <span>Proceed to Checkout →</span>
            </button>

            <div class="cart-drawer__trust mono">
                <span>🔒 Razorpay PG · 256-Bit SSL</span>
                <span>⚡ Instant Download</span>
            </div>
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
    var panelCountEl = document.getElementById('cart-panel-count');
    var emptyEl = document.getElementById('cart-empty');
    var footEl = document.getElementById('cart-foot');
    var subtotalEl = document.getElementById('cart-subtotal');

    function read() {
        try {
            var raw = localStorage.getItem(KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(function (slug) { return Boolean(CATALOG[slug]); });
        } catch (e) {
            return [];
        }
    }

    function write(items) {
        var clean = Array.isArray(items) ? items.filter(function (slug) { return Boolean(CATALOG[slug]); }) : [];
        try {
            localStorage.setItem(KEY, JSON.stringify(clean));
        } catch (e) {}
        render();
    }

    function currency() {
        var stored = null;
        try { stored = localStorage.getItem('db_currency'); } catch (e) {}
        return (stored && ['USD', 'INR'].indexOf(stored.toUpperCase()) !== -1 ? stored.toUpperCase() : null)
            || (window.DBStoreCurrency && window.DBStoreCurrency.get())
            || document.documentElement.getAttribute('data-store-currency')
            || 'USD';
    }

    function money(n) {
        var code = currency();
        var meta = META[code] || { symbol: '$', locale: 'en-US', minor: 0 };
        try {
            return new Intl.NumberFormat(meta.locale.replace('_', '-'), {
                style: 'currency', currency: code,
                minimumFractionDigits: meta.minor, maximumFractionDigits: meta.minor,
            }).format(Number(n));
        } catch (e) {
            return (meta.symbol || '₹') + Number(n).toLocaleString();
        }
    }

    function priceOf(p) {
        if (!p) return 0;
        var val = currency() === 'USD' ? p.price_usd : p.price_inr;
        return Number(val) || 0;
    }

    function items() {
        return read().map(function (slug) { return CATALOG[slug]; }).filter(Boolean);
    }

    function trackCommerce(event, params, metaEvent, metaParams) {
        try {
            if (typeof window.gtag === 'function') window.gtag('event', event, params);
        } catch (e) {}
        try {
            if (typeof window.fbq === 'function') window.fbq('track', metaEvent, metaParams);
        } catch (e) {}
    }

    function itemPayload(p) {
        return {
            item_id: p.slug,
            item_name: p.title,
            price: priceOf(p),
            currency: currency(),
            quantity: 1
        };
    }

    function updateNavBadges(count) {
        document.querySelectorAll('#masthead-cart-count, .mmenu-cart-count').forEach(function (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        });
        if (panelCountEl) {
            panelCountEl.textContent = count === 1 ? '1 item' : count + ' items';
        }
    }

    function render() {
        var cart = items();
        var count = cart.length;

        if (countEl) countEl.textContent = count;
        updateNavBadges(count);

        if (fab) {
            if (count > 0) {
                fab.style.display = 'inline-flex';
                fab.classList.add('cart-fab--active');
            } else {
                fab.classList.remove('cart-fab--active');
                fab.style.display = 'none';
            }
        }

        if (listEl) listEl.innerHTML = '';

        if (!count) {
            if (emptyEl) emptyEl.style.display = 'flex';
            if (footEl) footEl.style.display = 'none';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';
        if (footEl) footEl.style.display = 'block';

        var total = 0;
        cart.forEach(function (p) {
            var price = priceOf(p);
            total += price;

            var li = document.createElement('li');
            li.className = 'cart-drawer__item';
            li.innerHTML =
                '<div class="cart-drawer__item-icon-box">' + (p.icon || '📦') + '</div>' +
                '<div class="cart-drawer__item-info">' +
                    '<h4 class="cart-drawer__item-title">' + p.title + '</h4>' +
                    '<div class="cart-drawer__item-meta">' +
                        '<span class="cart-drawer__item-price mono">' + (price > 0 ? money(price) : 'Free') + '</span>' +
                        '<span class="cart-drawer__item-format mono">' + (p.format || 'ZIP') + '</span>' +
                    '</div>' +
                '</div>' +
                '<button type="button" class="cart-drawer__item-remove" data-remove="' + p.slug + '" aria-label="Remove ' + p.title + '">✕</button>';
            listEl.appendChild(li);
        });

        if (subtotalEl) {
            subtotalEl.textContent = total > 0 ? money(total) : 'Free';
        }
    }

    function openDrawer() {
        if (!drawer) return;
        render();
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    function add(slug, triggerBtn) {
        if (!slug || !CATALOG[slug]) return;
        var cart = read();
        var isNew = cart.indexOf(slug) === -1;
        if (isNew) {
            cart.push(slug);
            write(cart);
        }

        if (isNew) {
            var product = CATALOG[slug];
            trackCommerce('add_to_cart', {
                currency: currency(),
                value: priceOf(product),
                items: [itemPayload(product)]
            }, 'AddToCart', {
                content_ids: [slug],
                content_type: 'product',
                value: priceOf(product),
                currency: currency()
            });
        }

        // Button feedback
        if (triggerBtn) {
            var origHtml = triggerBtn.innerHTML;
            triggerBtn.classList.add('btn--added');
            triggerBtn.innerHTML = '✓ Added!';
            setTimeout(function () {
                triggerBtn.innerHTML = origHtml;
                triggerBtn.classList.remove('btn--added');
            }, 1200);
        }

        openDrawer();
    }

    function remove(slug) {
        var cart = read().filter(function (s) { return s !== slug; });
        write(cart);
    }

    function clear() {
        write([]);
    }

    document.addEventListener('click', function (e) {
        var buyLink = e.target.closest('a[href*="/checkout"]');
        if (buyLink) {
            var match = buyLink.getAttribute('href').match(/\/products\/([^\/?#]+)\/checkout/);
            var direct = match && CATALOG[match[1]] ? CATALOG[match[1]] : null;
            if (direct) {
                trackCommerce('begin_checkout', {
                    currency: currency(),
                    value: priceOf(direct),
                    items: [itemPayload(direct)]
                }, 'InitiateCheckout', {
                    content_ids: [direct.slug],
                    content_type: 'product',
                    value: priceOf(direct),
                    currency: currency(),
                    num_items: 1
                });
            }
        }

        var addBtn = e.target.closest('[data-add-cart]');
        if (addBtn) {
            e.preventDefault();
            add(addBtn.getAttribute('data-add-cart'), addBtn);
            return;
        }

        var openBtn = e.target.closest('[data-open-cart]');
        if (openBtn) {
            e.preventDefault();
            openDrawer();
            return;
        }

        var rmBtn = e.target.closest('[data-remove]');
        if (rmBtn) {
            e.preventDefault();
            remove(rmBtn.getAttribute('data-remove'));
            return;
        }

        if (e.target.closest('[data-cart-close]')) {
            closeDrawer();
        }
    });

    if (fab) {
        fab.addEventListener('click', function (e) {
            e.preventDefault();
            openDrawer();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });

    document.addEventListener('store:currency', render);

    var checkoutBtn = document.getElementById('cart-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            var cart = items();
            if (!cart.length) return;
            var total = cart.reduce(function (sum, i) { return sum + priceOf(i); }, 0);
            trackCommerce('begin_checkout', {
                currency: currency(),
                value: total,
                items: cart.map(itemPayload)
            }, 'InitiateCheckout', {
                content_ids: cart.map(function (i) { return i.slug; }),
                content_type: 'product',
                value: total,
                currency: currency(),
                num_items: cart.length
            });
            closeDrawer();
            var slugs = cart.map(function (i) { return i.slug; }).join(',');
            window.location.href = '{{ route('products.checkout.page') }}?items=' + encodeURIComponent(slugs);
        });
    }

    window.DBCart = {
        add: add,
        remove: remove,
        clear: clear,
        items: items,
        open: openDrawer,
        close: closeDrawer,
        count: function () { return items().length; }
    };

    render();
})();
</script>
