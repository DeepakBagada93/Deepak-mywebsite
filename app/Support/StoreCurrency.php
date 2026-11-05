<?php

namespace App\Support;

use Illuminate\Http\Request;

class StoreCurrency
{
    /**
     * ISO country codes for international traffic that map to USD.
     *
     * @var list<string>
     */
    private const USD_COUNTRIES = [
        'US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'SG', 'AE', 'DE', 'FR', 'NL',
        'CH', 'SE', 'NO', 'DK', 'FI', 'ES', 'IT', 'JP', 'KR', 'ZA', 'BR',
        'MX', 'HK', 'TW', 'IL', 'AT', 'BE', 'PL', 'PT',
    ];

    /**
     * The visitor's active storefront currency, remembered in a cookie or
     * geo-detected server-side from Cloudflare/proxy headers and Accept-Language.
     */
    public static function current(?Request $request = null): string
    {
        try {
            $request = $request ?: request();
        } catch (\Throwable) {
            $request = null;
        }

        if (! $request instanceof Request) {
            return Money::default();
        }

        // Step 1: Check explicit cookie `store_currency`. If valid ('INR' or 'USD'), return it.
        $cookieName = (string) config('store.cookie', 'store_currency');
        $cookie = strtoupper(trim((string) (
            $request->cookie($cookieName)
            ?: $request->cookies->get($cookieName, '')
        )));

        if ($cookie === '' && $request->hasHeader('Cookie')) {
            $cookieHeader = (string) $request->header('Cookie');
            if (preg_match('/(?:^|;\s*)'.preg_quote($cookieName, '/').'=([^;]+)/', $cookieHeader, $matches)) {
                $cookie = strtoupper(trim(urldecode($matches[1])));
            }
        }

        if (Money::supports($cookie)) {
            return $cookie;
        }

        // Step 2: Check query parameter `?currency=...`. If valid, return it.
        $query = strtoupper(trim((string) $request->query('currency', '')));
        if (Money::supports($query)) {
            return $query;
        }

        // Step 3: Geo-Detection:
        // 3a. Cloudflare and Proxy Country Headers
        $country = strtoupper(trim((string) (
            $request->header('CF-IPCountry')
            ?: $request->header('X-Country-Code')
            ?: $request->header('GeoIP-Country-Code')
            ?: ''
        )));

        if ($country === 'IN') {
            return 'INR';
        }

        if (in_array($country, self::USD_COUNTRIES, true) || ($country !== '' && ! in_array($country, ['XX', 'T1'], true))) {
            return 'USD';
        }

        // 3b. Accept-Language header (e.g. en-IN, hi-IN, hi, ta, te, bn, mr, gu)
        $acceptLanguage = strtolower(trim((string) $request->header('Accept-Language', '')));
        if ($acceptLanguage !== '') {
            if (preg_match('/\b(en[-_]in|hi[-_]in|hi|ta|te|bn|mr|gu)\b/i', $acceptLanguage)) {
                return 'INR';
            }
        }

        // Fallback to Money::default() (or USD).
        return Money::default();
    }
}
