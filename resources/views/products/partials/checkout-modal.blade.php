{{-- Shared checkout modal for the digital products storefront (supports single or cart) --}}
<div class="store-modal" id="store-modal" role="dialog" aria-modal="true" aria-label="Product checkout" style="display:none">
    <div class="store-modal__backdrop" data-store-close></div>
    <div class="store-modal__dialog">
        <button type="button" class="store-modal__close" data-store-close aria-label="Close checkout">✕</button>

        <div class="store-modal__head">
            <p class="mono store-modal__kicker">Secure Checkout</p>
            <h2 class="store-modal__title" id="store-modal-title">Complete your purchase</h2>
            <p class="store-modal__price" id="store-modal-price"></p>
        </div>

        <ul class="store-modal__items" id="store-modal-items"></ul>

        <form class="store-modal__form" id="store-checkout-form" novalidate>
            <label class="store-field">
                <span class="mono">Full name</span>
                <input type="text" name="name" required autocomplete="name" placeholder="Your name">
            </label>
            <label class="store-field">
                <span class="mono">Email address</span>
                <input type="email" name="email" required autocomplete="email" placeholder="you@email.com">
            </label>
            <label class="store-field">
                <span class="mono">Phone (optional)</span>
                <input type="tel" name="phone" autocomplete="tel" placeholder="+91 98765 43210">
            </label>

            <p class="store-modal__error" id="store-modal-error" style="display:none"></p>

            <button type="submit" class="btn btn--primary store-modal__submit" id="store-modal-submit">
                <span class="store-modal__submit-label">Pay & get download →</span>
                <span class="store-modal__spinner" aria-hidden="true"></span>
            </button>
            <p class="store-modal__note mono">🔒 Secured by Cashfree · No account needed · Download link emailed to you instantly</p>
        </form>

        <div class="store-modal__success" id="store-success" style="display:none">
            <p class="store-modal__success-icon">🎉</p>
            <h3 class="store-modal__success-title">You're all set!</h3>
            <p class="store-modal__success-msg" id="store-success-msg"></p>
            <div class="store-modal__success-links" id="store-success-links"></div>
            <a href="#" class="btn btn--primary" id="store-success-download" style="display:none">⬇ Download now</a>
            <button type="button" class="btn btn--ghost btn--sm" data-store-close>Close</button>
        </div>
    </div>
</div>

<script>
(function () {
    var modal = document.getElementById('store-modal');
    if (!modal) return;

    var csrf = document.querySelector('meta[name="csrf-token"]');
    var form = document.getElementById('store-checkout-form');
    var titleEl = document.getElementById('store-modal-title');
    var priceEl = document.getElementById('store-modal-price');
    var itemsEl = document.getElementById('store-modal-items');
    var errorEl = document.getElementById('store-modal-error');
    var successEl = document.getElementById('store-success');
    var submit = document.getElementById('store-modal-submit');
    var spinner = submit.querySelector('.store-modal__spinner');
    var submitLabel = submit.querySelector('.store-modal__submit-label');
    var activeItems = [];
    var META = @json(\App\Support\Money::currencies());
    var cashfreeMode = '{{ config('services.cashfree.env') }}';

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
    function priceOf(i) { return currency() === 'USD' ? (i.price_usd || 0) : (i.price_inr || 0); }

    function render() {
        var items = activeItems;
        var total = items.reduce(function (sum, i) { return sum + Number(priceOf(i)); }, 0);

        titleEl.textContent = items.length > 1 ? ('Checkout · ' + items.length + ' items') : items[0].title;
        priceEl.innerHTML = total > 0
            ? '<span class="mono">Total</span> <strong>' + money(total) + '</strong>'
            : '<strong>Free download</strong>';

        itemsEl.innerHTML = '';
        items.forEach(function (i) {
            var price = priceOf(i);
            var li = document.createElement('li');
            li.innerHTML = '<span>' + i.title + '</span><span class="mono">' + (price > 0 ? money(price) : 'Free') + '</span>';
            itemsEl.appendChild(li);
        });
        itemsEl.style.display = items.length > 1 ? '' : 'none';

        submitLabel.textContent = total > 0 ? ('Pay ' + money(total) + ' →') : 'Get download →';
    }

    function open(items) {
        activeItems = items;
        render();
        form.style.display = '';
        successEl.style.display = 'none';
        errorEl.style.display = 'none';
        submit.classList.remove('is-loading');
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
        var first = form.querySelector('input[name="name"]');
        if (first) setTimeout(function () { first.focus(); }, 60);
    }

    document.addEventListener('store:currency', function () {
        if (modal.style.display === 'flex' && successEl.style.display === 'none') render();
    });

    function close() {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }

    window.StoreCheckout = { open: open, close: close };

    document.querySelectorAll('[data-checkout]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            open([{
                slug: btn.getAttribute('data-slug'),
                title: btn.getAttribute('data-title'),
                price_inr: parseInt(btn.getAttribute('data-price-inr'), 10) || 0,
                price_usd: parseInt(btn.getAttribute('data-price-usd'), 10) || 0,
            }]);
        });
    });

    modal.querySelectorAll('[data-store-close]').forEach(function (el) { el.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') close();
    });

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
        submit.classList.remove('is-loading');
        spinner.style.display = 'none';
    }

    function showSuccess(data) {
        form.style.display = 'none';
        successEl.style.display = 'block';
        document.getElementById('store-success-msg').textContent = data.message || 'Your download is ready.';
        if (data.test_mode) {
            document.getElementById('store-success-msg').textContent += ' (Test mode — payment gateway keys not set yet.)';
        }
        var links = document.getElementById('store-success-links');
        var single = document.getElementById('store-success-download');
        links.innerHTML = '';
        if (data.downloads && data.downloads.length > 1) {
            data.downloads.forEach(function (d) {
                var a = document.createElement('a');
                a.className = 'btn btn--primary btn--sm store-modal__dl';
                a.href = d.url || '#';
                a.textContent = '⬇ ' + d.title;
                links.appendChild(a);
            });
            single.style.display = 'none';
        } else if (data.download_url) {
            single.href = data.download_url;
            single.style.display = '';
        } else {
            single.style.display = 'none';
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submit.classList.contains('is-loading')) return;

        var name = form.name.value.trim();
        var email = form.email.value.trim();
        if (!name || !email) { showError('Name and email are required.'); return; }

        submit.classList.add('is-loading');
        submitLabel.textContent = 'Processing…';
        spinner.style.display = 'inline-block';
        errorEl.style.display = 'none';

        fetch('{{ route('products.checkout') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrf.content,
            },
            body: JSON.stringify({
                items: activeItems.map(function (i) { return i.slug; }),
                currency: currency(),
                name: name,
                email: email,
                phone: form.phone.value.trim(),
            }),
        })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
            if (!res.ok) {
                var msg = (res.data && (res.data.message || (res.data.errors && Object.values(res.data.errors)[0][0]))) || 'Something went wrong.';
                showError(msg);
                return;
            }
            submit.classList.remove('is-loading');
            spinner.style.display = 'none';

            if (res.data.status === 'fulfilled') {
                if (window.DBCart) window.DBCart.clear();
                showSuccess(res.data);
            } else if (res.data.status === 'checkout') {
                loadCashfree(function (ok) {
                    if (!ok) { showError('Could not load the payment window. Please refresh and try again.'); return; }
                    var cashfree = window.Cashfree({ mode: cashfreeMode === 'production' ? 'production' : 'sandbox' });
                    cashfree.checkout({ paymentSessionId: res.data.payment_session_id, redirectTarget: '_self' });
                });
            }
        })
        .catch(function () { showError('Network error. Please try again.'); });
    });

    function loadCashfree(cb) {
        if (window.Cashfree) { cb(true); return; }
        var s = document.createElement('script');
        s.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        s.onload = function () { cb(true); };
        s.onerror = function () { cb(false); };
        document.head.appendChild(s);
    }
})();
</script>
