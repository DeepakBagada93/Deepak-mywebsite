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
                <input type="tel" name="phone" id="store-modal-phone" autocomplete="tel" placeholder="+91 98765 43210">
            </label>

            <p class="store-modal__error" id="store-modal-error" style="display:none"></p>

            <button type="submit" class="btn btn--primary store-modal__submit" id="store-modal-submit">
                <span class="store-modal__submit-label">Pay & get download →</span>
                <span class="store-modal__spinner" aria-hidden="true"></span>
            </button>
            <div class="store-modal__badges" id="store-modal-badges" style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin:4px 0 2px;">
                <div data-cur="INR" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;">
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">⚡ UPI</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Google Pay</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">PhonePe</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Paytm</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Cards</span>
                </div>
                <div data-cur="USD" style="display:none;gap:4px;flex-wrap:wrap;justify-content:center;">
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">💳 Visa</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Mastercard</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">Amex</span>
                    <span class="pay-badge" style="font-size:0.62rem;padding:3px 7px;">International Cards</span>
                </div>
            </div>
            <p class="store-modal__note mono" id="store-modal-trust">⚡ Instant UPI (Google Pay, PhonePe, Paytm, QR) &amp; Cards · Secured by Razorpay</p>
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
        var cur = currency();

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

        var trustEl = document.getElementById('store-modal-trust');
        var badgesInr = modal.querySelector('.store-modal__badges [data-cur="INR"]');
        var badgesUsd = modal.querySelector('.store-modal__badges [data-cur="USD"]');

        if (badgesInr && badgesUsd) {
            if (cur === 'INR') {
                badgesInr.style.display = total > 0 ? 'flex' : 'none';
                badgesUsd.style.display = 'none';
            } else {
                badgesInr.style.display = 'none';
                badgesUsd.style.display = total > 0 ? 'flex' : 'none';
            }
        }

        if (total > 0) {
            if (cur === 'INR') {
                submitLabel.textContent = 'Pay ' + money(total) + ' via UPI / Cards →';
                if (trustEl) {
                    trustEl.textContent = '⚡ Instant UPI (Google Pay, PhonePe, Paytm, QR) & Cards · Secured by Razorpay';
                }
            } else {
                submitLabel.textContent = 'Pay ' + money(total) + ' with Card →';
                if (trustEl) {
                    trustEl.textContent = '🔒 International Credit & Debit Cards (Visa, Mastercard, Amex) · Secured by Razorpay';
                }
            }
        } else {
            submitLabel.textContent = 'Get download →';
            if (trustEl) {
                trustEl.textContent = '🎁 Free download · Instant access link emailed to you';
            }
        }
    }

    document.addEventListener('store:currency', function () {
        if (activeItems.length > 0) render();
    });

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

        // GA4 & Meta organic e-commerce: begin_checkout
        try {
            var cur = currency();
            var totalVal = items.reduce(function (sum, i) { return sum + Number(priceOf(i)); }, 0);
            var eventItems = items.map(function (i) {
                return {
                    item_id: i.slug,
                    item_name: i.title,
                    price: priceOf(i),
                    currency: cur,
                    quantity: 1
                };
            });
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'begin_checkout', {
                    currency: cur,
                    value: totalVal,
                    items: eventItems
                });
            }
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'InitiateCheckout', {
                    content_ids: items.map(function (i) { return i.slug; }),
                    content_type: 'product',
                    currency: cur,
                    value: totalVal,
                    num_items: items.length
                });
            }
        } catch (e) {}
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

    var phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) {
        function checkPhoneForEmail(val) {
            if (!val) return false;
            if (val.indexOf('@') !== -1 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) {
                phoneInput.value = '';
                showError('Please enter a valid phone number, not an email address.');
                return true;
            }
            return false;
        }

        phoneInput.addEventListener('paste', function (e) {
            var pasted = '';
            if (e.clipboardData && e.clipboardData.getData) {
                pasted = e.clipboardData.getData('text');
            } else if (window.clipboardData && window.clipboardData.getData) {
                pasted = window.clipboardData.getData('Text');
            }
            if (pasted && (pasted.indexOf('@') !== -1 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pasted.trim()))) {
                e.preventDefault();
                phoneInput.value = '';
                showError('Please enter a valid phone number, not an email address.');
            }
        });

        phoneInput.addEventListener('input', function () {
            checkPhoneForEmail(this.value);
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (submit.classList.contains('is-loading')) return;

        var name = form.name.value.trim();
        var email = form.email.value.trim();
        var phone = form.phone.value.trim();
        if (!name || !email) { showError('Name and email are required.'); return; }
        if (phone && (phone.indexOf('@') !== -1 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phone))) {
            form.phone.value = '';
            showError('Please enter a valid phone number, not an email address.');
            return;
        }

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

            // GA4 organic e-commerce: add_payment_info
            try {
                var cur = currency();
                var totalVal = activeItems.reduce(function (sum, i) { return sum + Number(priceOf(i)); }, 0);
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'add_payment_info', {
                        currency: cur,
                        value: totalVal,
                        payment_type: cur === 'INR' ? 'UPI / Netbanking / Cards' : 'International Card',
                        items: activeItems.map(function (i) {
                            return {
                                item_id: i.slug,
                                item_name: i.title,
                                price: priceOf(i),
                                currency: cur,
                                quantity: 1
                            };
                        })
                    });
                }
            } catch (e) {}

            if (res.data.status === 'fulfilled') {
                if (window.DBCart) window.DBCart.clear();
                showSuccess(res.data);
            } else if (res.data.status === 'checkout') {
                if (res.data.payment_url) {
                    if (window.DBCart) window.DBCart.clear();
                    window.location.href = res.data.payment_url;
                    return;
                }
                openRazorpayModal(res.data);
            }
        })
        .catch(function () { showError('Network error. Please try again.'); });
    });

    function openRazorpayModal(orderData) {
        ensureRazorpay(function (Razorpay) {
            if (!Razorpay) {
                showError('Could not initialize secure Razorpay payment window. Please check your network and refresh.');
                return;
            }

            var options = {
                key: orderData.razorpay_key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Deepak Bagada',
                description: 'Order ' + orderData.order_reference,
                order_id: orderData.razorpay_order_id,
                prefill: {
                    name: orderData.customer.name,
                    email: orderData.customer.email,
                    contact: orderData.customer.phone || ''
                },
                theme: {
                    color: '#0a0a0a'
                },
                modal: {
                    ondismiss: function () {
                        showError('Payment window was closed. You can retry whenever you are ready.');
                    }
                },
                handler: function (response) {
                    fetch('{{ route('products.verify') }}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': csrf ? csrf.content : ''
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_reference: orderData.order_reference
                        })
                    })
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (data.status === 'success') {
                            if (window.DBCart) window.DBCart.clear();
                            window.location.href = data.redirect_url || ('{{ route('products.return') }}?order_id=' + encodeURIComponent(orderData.order_reference));
                        } else {
                            showError(data.message || 'Payment verification failed. Please contact support.');
                        }
                    })
                    .catch(function () {
                        window.location.href = '{{ route('products.return') }}?order_id=' + encodeURIComponent(orderData.order_reference) +
                            '&razorpay_payment_id=' + encodeURIComponent(response.razorpay_payment_id) +
                            '&razorpay_order_id=' + encodeURIComponent(response.razorpay_order_id) +
                            '&razorpay_signature=' + encodeURIComponent(response.razorpay_signature);
                    });
                }
            };

            try {
                var rzp = new Razorpay(options);
                rzp.on('payment.failed', function (resp) {
                    console.warn('Razorpay payment failed:', resp.error);
                    showError((resp.error && resp.error.description) || 'Payment was unsuccessful. Please try again.');
                });
                rzp.open();
            } catch (err) {
                console.error('Razorpay modal open error:', err);
                showError('Could not open payment window. Please refresh and try again.');
            }
        });
    }

    function ensureRazorpay(cb) {
        if (window.Razorpay) {
            cb(window.Razorpay);
            return;
        }
        var s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.async = true;
        s.onload = function () { cb(window.Razorpay); };
        s.onerror = function () { cb(null); };
        document.head.appendChild(s);
    }
})();
</script>
