<?php

namespace App\Support;

use NumberFormatter;

class Money
{
    /**
     * @return array<string, array{symbol:string,locale:string,minor:int,label:string}>
     */
    public static function currencies(): array
    {
        return config('store.currencies', []);
    }

    /**
     * @return list<string>
     */
    public static function supported(): array
    {
        return array_keys(static::currencies());
    }

    public static function supports(?string $currency): bool
    {
        return $currency !== null && array_key_exists(strtoupper($currency), static::currencies());
    }

    public static function default(): string
    {
        return strtoupper((string) config('store.default', 'INR'));
    }

    /**
     * @return array{symbol:string,locale:string,minor:int}
     */
    public static function config(string $currency): array
    {
        $currency = strtoupper($currency);

        return static::currencies()[$currency] ?? [
            'symbol' => $currency.' ',
            'locale' => 'en_US',
            'minor' => 0,
        ];
    }

    public static function symbol(?string $currency): string
    {
        return static::config((string) $currency)['symbol'];
    }

    /**
     * Format a whole-unit amount, e.g. ₹12,999 / $199. Falls back to
     * number_format when the intl extension is unavailable.
     */
    public static function format(int|float $amount, ?string $currency = null): string
    {
        $currency = strtoupper((string) ($currency ?: static::default()));
        $config = static::config($currency);
        $minor = (int) ($config['minor'] ?? 0);

        if (class_exists(NumberFormatter::class)) {
            $formatter = new NumberFormatter($config['locale'], NumberFormatter::CURRENCY);
            $formatter->setAttribute(NumberFormatter::MIN_FRACTION_DIGITS, $minor);
            $formatter->setAttribute(NumberFormatter::MAX_FRACTION_DIGITS, $minor);

            $formatted = $formatter->formatCurrency((float) $amount, $currency);

            if ($formatted !== false) {
                return $formatted;
            }
        }

        return $config['symbol'].number_format((float) $amount, $minor);
    }

    /**
     * A product's price in a currency, read from its `price_<code>` key.
     */
    public static function priceFor(array $product, string $currency): int
    {
        return (int) ($product['price_'.strtolower($currency)] ?? 0);
    }

    /**
     * A product's strike-through "compare at" price, from `compare_<code>`.
     */
    public static function compareFor(array $product, string $currency): int
    {
        return (int) ($product['compare_'.strtolower($currency)] ?? 0);
    }
}
