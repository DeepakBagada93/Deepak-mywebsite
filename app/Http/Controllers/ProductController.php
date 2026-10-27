<?php

namespace App\Http\Controllers;

use App\Support\Money;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $products = collect(config('products'));

        $categories = $products->groupBy('category');

        $activeCategory = $request->query('category');
        $filtered = $activeCategory
            ? $products->where('category_slug', $activeCategory)->values()
            : $products;

        $featured = $products->where('is_featured', true)->sortBy('sort_order')->values();
        $paid = $products->where('is_free', false);

        $head = [
            'title' => 'Digital Products & AI Toolkits — Buy Once, Own Forever | '.$site['name'],
            'description' => 'Buy once, own forever — AI agent toolkits, n8n workflow automation systems, performance marketing kits, and business growth engines for Indian founders, developers, and agencies. Instant download, commercial license, 30-day guarantee.',
            'canonical' => $url.'/products',
            'og_type' => 'website',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'ItemList',
                'name' => 'Digital Products by '.$site['name'],
                'description' => 'Buy once, own forever. AI agent toolkits, automation workflows, and business kits with commercial license — instant download after payment.',
                'numberOfItems' => $products->count(),
                'itemListElement' => $products->values()->map(static fn (array $product, int $index) => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'item' => [
                        '@type' => 'Product',
                        'name' => $product['title'],
                        'description' => $product['tagline'],
                        'url' => $url.'/products/'.$product['slug'],
                        'category' => $product['category'],
                        'brand' => ['@type' => 'Person', 'name' => $site['name']],
                        'aggregateRating' => $product['is_free'] ? null : [
                            '@type' => 'AggregateRating',
                            'ratingValue' => (string) $product['rating'],
                            'reviewCount' => (string) $product['rating_count'],
                        ],
                        'offers' => self::offers($product, $url.'/products/'.$product['slug']),
                    ],
                ])->all(),
            ], JSON_UNESCAPED_SLASHES),
        ];

        $cookieCurrency = $request->cookie(config('store.cookie', 'store_currency'));
        $queryCurrency = $request->query('currency');
        $storeCurrency = strtoupper((string) ($queryCurrency ?: $cookieCurrency ?: Money::default()));
        if (! Money::supports($storeCurrency)) {
            $storeCurrency = Money::default();
        }

        return view('products.index', compact('site', 'head', 'products', 'categories', 'filtered', 'activeCategory', 'featured', 'paid', 'storeCurrency'));
    }

    public function show(Request $request, string $slug)
    {
        $aliases = [
            'ads-creative-hub' => 'ad-creative-lab',
            'ad-creative-hub' => 'ad-creative-lab',
            'ads-creative-lab' => 'ad-creative-lab',
            'ai-systems-master-bundle' => 'agent-skills-master-bundle',
        ];

        if (isset($aliases[$slug])) {
            return redirect()->route('products.show', $aliases[$slug], 301);
        }

        $site = config('site');
        $url = rtrim($site['url'], '/');
        $products = collect(config('products'));

        $product = $products->firstWhere('slug', $slug);

        if (! $product) {
            abort(404);
        }

        $related = $products
            ->where('slug', '!=', $slug)
            ->where('is_free', false)
            ->sortBy('sort_order')
            ->take(3)
            ->values();

        $faqJson = collect($product['faq'] ?? [])->map(static fn (string $answer, string $question) => [
            '@type' => 'Question',
            'name' => $question,
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text' => $answer,
            ],
        ])->values()->all();

        $checkoutUrl = $url.'/products/'.$slug.'/checkout';

        $graph = [
            [
                '@type' => 'Product',
                'name' => $product['title'],
                'description' => $product['description'],
                'url' => $url.'/products/'.$slug,
                'category' => $product['category'],
                'brand' => ['@type' => 'Person', 'name' => $site['name']],
                'aggregateRating' => [
                    '@type' => 'AggregateRating',
                    'ratingValue' => (string) $product['rating'],
                    'reviewCount' => (string) $product['rating_count'],
                ],
                'offers' => self::offers($product, $url.'/products/'.$slug),
                'hasMerchantReturnPolicy' => [
                    '@type' => 'MerchantReturnPolicy',
                    'applicableCountry' => 'IN',
                    'returnPolicyCategory' => 'https://schema.org/MerchantReturnFiniteReturnWindow',
                    'merchantReturnDays' => 30,
                    'returnMethod' => 'https://schema.org/ReturnByMail',
                    'returnFees' => 'https://schema.org/FreeReturn',
                ],
                'shippingDetails' => [
                    '@type' => 'OfferShippingDetails',
                    'shippingDestination' => ['@type' => 'DefinedRegion', 'addressCountry' => 'IN'],
                    'deliveryTime' => ['@type' => 'ShippingDeliveryTime', 'handlingTime' => ['@type' => 'QuantitativeValue', 'minValue' => 0, 'maxValue' => 0], 'transitTime' => ['@type' => 'QuantitativeValue', 'minValue' => 0, 'maxValue' => 0]],
                    'shippingRate' => ['@type' => 'MonetaryAmount', 'value' => 0, 'currency' => 'INR'],
                ],
                'potentialAction' => [
                    '@type' => 'BuyAction',
                    'target' => ['@type' => 'EntryPoint', 'url' => $checkoutUrl, 'actionPlatform' => 'http://schema.org/DesktopWebPlatform'],
                    'priceSpecification' => self::offers($product, $url.'/products/'.$slug),
                ],
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id' => $url.'/products/'.$slug,
                ],
            ],
            [
                '@type' => 'WebPage',
                '@id' => $url.'/products/'.$slug,
                'url' => $url.'/products/'.$slug,
                'name' => $product['seo_title'] ?? $product['title'],
                'description' => $product['seo_description'] ?? $product['tagline'],
                'speakable' => ['@type' => 'SpeakableSpecification', 'cssSelector' => ['.store-detail__head', '.store-detail__body', '.store-detail__aeo']],
            ],
            [
                '@type' => 'FAQPage',
                'mainEntity' => $faqJson,
                'speakable' => ['@type' => 'SpeakableSpecification', 'cssSelector' => ['.store-detail__faq']],
            ],
            [
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Products', 'item' => $url.'/products'],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $product['title'], 'item' => $url.'/products/'.$slug],
                ],
            ],
        ];

        if (! empty($product['how_to_use']) && is_array($product['how_to_use'])) {
            $graph[] = [
                '@type' => 'HowTo',
                'name' => 'How to use '.$product['title'],
                'description' => 'Step-by-step instructions for installing and running '.$product['title'].' with your AI agent or CLI.',
                'step' => collect($product['how_to_use'])->map(static fn (array $s, int $i) => [
                    '@type' => 'HowToStep',
                    'position' => $i + 1,
                    'name' => $s['title'] ?? 'Step '.($i + 1),
                    'text' => $s['desc'] ?? '',
                ])->all(),
            ];
        }

        $seoTitle = $product['seo_title'] ?? ($product['title'].' — '.($product['is_free'] ? 'Free Download' : '₹'.number_format($product['price_inr'])).' | '.$site['name']);
        $seoDescription = $product['seo_description'] ?? ($product['tagline'].' '.$product['description']);

        $head = [
            'title' => $seoTitle,
            'description' => $seoDescription,
            'canonical' => $url.'/products/'.$slug,
            'og_title' => $product['title'].' | '.$site['name'],
            'og_description' => $seoDescription,
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => $graph,
            ], JSON_UNESCAPED_SLASHES),
        ];

        $cookieCurrency = $request->cookie(config('store.cookie', 'store_currency'));
        $queryCurrency = $request->query('currency');
        $storeCurrency = strtoupper((string) ($queryCurrency ?: $cookieCurrency ?: Money::default()));
        if (! Money::supports($storeCurrency)) {
            $storeCurrency = Money::default();
        }

        return view('products.show', compact('site', 'head', 'product', 'related', 'storeCurrency'));
    }

    /**
     * Schema.org offers for a product, one per supported currency.
     *
     * @return list<array<string, string>>
     */
    private static function offers(array $product, string $url): array
    {
        $offers = collect(Money::supported())->map(static fn (string $currency) => [
            '@type' => 'Offer',
            'price' => (string) Money::priceFor($product, $currency),
            'priceCurrency' => $currency,
            'availability' => 'https://schema.org/InStock',
            'url' => $url,
        ])->values()->all();

        return count($offers) === 1 ? $offers[0] : $offers;
    }
}
