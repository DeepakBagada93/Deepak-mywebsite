{{-- INR / USD currency switcher. Safe to include more than once per page. --}}
@php $activeCurrency = $storeCurrency ?? \App\Support\Money::default(); @endphp
<div class="currency-switch" role="group" aria-label="Choose currency">
    @foreach (\App\Support\Money::currencies() as $code => $meta)
        <button type="button" class="currency-switch__btn {{ $activeCurrency === $code ? 'is-active' : '' }}"
            data-currency-set="{{ $code }}"
            aria-pressed="{{ $activeCurrency === $code ? 'true' : 'false' }}">
            <span class="currency-switch__symbol" aria-hidden="true">{{ $meta['symbol'] }}</span>{{ $code }}
        </button>
    @endforeach
</div>

@once
<script>
(function () {
    if (window.DBStoreCurrency) return;

    var KEY = 'db_currency';
    var COOKIE = '{{ config('store.cookie', 'store_currency') }}';
    var DEFAULT = '{{ \App\Support\Money::default() }}';
    var VALID = @json(\App\Support\Money::supported());
    var HINTS = @json(config('store.auto_detect.USD', []));
    var META = @json(\App\Support\Money::currencies());

    function root() { return document.documentElement; }

    function get() {
        var c = (root().getAttribute('data-store-currency') || DEFAULT).toUpperCase();
        return VALID.indexOf(c) !== -1 ? c : DEFAULT;
    }

    function sync() {
        var c = get();
        document.querySelectorAll('[data-currency-set]').forEach(function (btn) {
            var on = btn.getAttribute('data-currency-set') === c;
            btn.classList.toggle('is-active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function set(next, silent) {
        next = String(next || '').toUpperCase();
        if (VALID.indexOf(next) === -1) { sync(); return; }
        try { localStorage.setItem(KEY, next); } catch (e) {}
        document.cookie = COOKIE + '=' + next + ';path=/;max-age=31536000;SameSite=Lax';
        root().setAttribute('data-store-currency', next);
        sync();
        document.dispatchEvent(new CustomEvent('store:currency', { detail: { currency: next } }));
    }

    function detect() {
        var lang = (navigator.language || '').replace('_', '-').toLowerCase();
        var tz = '';
        try { tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase(); } catch (e) {}
        for (var i = 0; i < HINTS.length; i++) {
            var h = String(HINTS[i]).replace('_', '-').toLowerCase();
            if (h.slice(-1) === '/') { if (tz.indexOf(h) === 0) return 'USD'; }
            else if (lang === h) { return 'USD'; }
        }
        return DEFAULT;
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-currency-set]');
        if (btn) { e.preventDefault(); set(btn.getAttribute('data-currency-set')); }
    });

    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored && VALID.indexOf(stored.toUpperCase()) !== -1) {
        set(stored);
    } else {
        var cookieMatch = document.cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
        if (cookieMatch && VALID.indexOf(cookieMatch[1].toUpperCase()) !== -1) {
            set(cookieMatch[1]);
        } else {
            var detected = detect();
            if (detected && detected !== DEFAULT) {
                set(detected);
            } else {
                sync();
            }
        }
    }
    sync();

    window.DBStoreCurrency = {
        get: get,
        set: set,
        supported: VALID,
        symbol: function (c) {
            var code = (c || get()).toUpperCase();
            return (META[code] && META[code].symbol) || '';
        }
    };
})();
</script>
@endonce
