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
            'description' => 'Production-ready digital products by Deepak Bagada: the Agent Skills Master Bundle, FastMCP production server suite, SaaS Next AI boilerplate, HyperFrames reel engine and a free agent skills starter kit. Instant download, commercial license.',
            'canonical' => $url.'/products',
            'og_type' => 'website',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@type' => 'ItemList',
                'name' => 'Digital Products by '.$site['name'],
                'numberOfItems' => $products->count(),
                'itemListElement' => $products->values()->map(static fn (array $product, int $index) => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'item' => [
                        '@type' => 'Product',
                        'name' => $product['title'],
                        'description' => $product['tagline'],
                        'url' => $url.'/products/'.$product['slug'],
                        'offers' => self::offers($product, $url.'/products/'.$product['slug']),
                    ],
                ])->all(),
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('products.index', compact('site', 'head', 'products', 'categories', 'filtered', 'activeCategory', 'featured', 'paid'));
    }

    public function show(string $slug)
    {
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

        $head = [
            'title' => $product['title'].' — '.($product['is_free'] ? 'Free Download' : '₹'.number_format($product['price_inr'])).' | '.$site['name'],
            'description' => $product['tagline'].' '.$product['description'],
            'canonical' => $url.'/products/'.$slug,
            'og_title' => $product['title'].' | '.$site['name'],
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
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
                    ],
                    [
                        '@type' => 'FAQPage',
                        'mainEntity' => $faqJson,
                    ],
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Products', 'item' => $url.'/products'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $product['title'], 'item' => $url.'/products/'.$slug],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('products.show', compact('site', 'head', 'product', 'related'));
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
