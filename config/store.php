<?php

/*
|--------------------------------------------------------------------------
| Store currency configuration
|--------------------------------------------------------------------------
| Products are priced in more than one currency so the storefront can sell
| to Indian (INR) and international/US (USD) buyers. Every currency here
| must define a matching `price_<code>` key on each product in
| config/products.php.
|
| `minor` is the number of decimal places used when displaying amounts.
| Both supported currencies are whole-unit priced (₹ and $), so minor = 0.
*/

$enabled = array_filter(array_map('trim', explode(',', env('STORE_ENABLED_CURRENCIES', 'USD,INR'))));

$allCurrencies = [
    'USD' => [
        'symbol' => '$',
        'locale' => 'en_US',
        'minor' => 0,
        'label' => 'USD — US Dollar',
    ],
    'INR' => [
        'symbol' => '₹',
        'locale' => 'en_IN',
        'minor' => 0,
        'label' => 'INR — Indian Rupee',
    ],
];

$currencies = [];
$enabledUpper = array_map('strtoupper', $enabled);
foreach ($allCurrencies as $code => $meta) {
    if (empty($enabledUpper) || in_array($code, $enabledUpper, true)) {
        $currencies[$code] = $meta;
    }
}
if (empty($currencies)) {
    $currencies = $allCurrencies;
}

return [

    // Fallback currency when a visitor has not chosen one (primary is USD).
    'default' => 'USD',

    // Cookie (and localStorage) key used to remember the visitor's choice.
    'cookie' => 'store_currency',

    'currencies' => $currencies,

    // Country/timezone hints used to auto-select a currency for new visitors.
    'auto_detect' => count($currencies) > 1 ? [
        'USD' => ['America/', 'en_US', 'en-US', 'en_CA', 'en-CA'],
    ] : [],

];
