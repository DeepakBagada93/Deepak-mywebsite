<?php

namespace App\Support;

use Illuminate\Http\Request;

class StoreCurrency
{
    /**
     * The visitor's active storefront currency, remembered in a cookie so a
     * returning visitor renders in the right currency server-side.
     */
    public static function current(?Request $request = null): string
    {
        try {
            $request = $request ?: request();
            $candidate = $request
                ? strtoupper((string) $request->cookie(config('store.cookie', 'store_currency'), ''))
                : '';
        } catch (\Throwable) {
            $candidate = '';
        }

        return Money::supports($candidate) ? $candidate : Money::default();
    }
}
