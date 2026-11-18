<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function index(Request $request)
    {
        // Legacy ?category= URLs duplicate the clean category paths below.
        if ($request->filled('category')) {
            return redirect()->route('tools.category', ['category' => $request->query('category')], 301);
        }

        // The tools hub is not paginated, so any ?page= URL is a duplicate.
        if ($request->has('page')) {
            return redirect()->route('tools.index', [], 301);
        }

        return $this->renderIndex(null);
    }

    public function category(string $category)
    {
        $exists = collect(config('tools'))
            ->contains(static fn (array $tool) => $tool['category_slug'] === $category);

        abort_unless($exists, 404);

        // Category pages are not paginated either; collapse ?page= duplicates.
        if (request()->has('page')) {
            return redirect()->route('tools.category', ['category' => $category], 301);
        }

        return $this->renderIndex($category);
    }

    public function show(string $slug)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $tools = config('tools');

        $tool = collect($tools)->firstWhere('slug', $slug);

        if (! $tool) {
            abort(404);
        }

        // Get related tools from same category
        $relatedTools = collect($tools)
            ->where('category_slug', $tool['category_slug'])
            ->where('slug', '!=', $slug)
            ->take(4)
            ->values()
            ->all();

        $canonical = $url.'/tools/'.$slug;

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'WebApplication',
                    'name' => $tool['name'].' — Free Online Tool',
                    'url' => $canonical,
                    'description' => $tool['description'],
                    'applicationCategory' => 'UtilityApplication',
                    'operatingSystem' => 'All',
                    'browserRequirements' => 'Requires JavaScript. Requires HTML5.',
                    'offers' => [
                        '@type' => 'Offer',
                        'price' => '0',
                        'priceCurrency' => 'USD',
                    ],
                    'provider' => [
                        '@type' => 'Person',
                        '@id' => $url.'/#person',
                        'name' => $site['name'],
                        'url' => $url.'/',
                        'sameAs' => array_values($site['socials']),
                    ],
                ],
                [
                    '@type' => 'HowTo',
                    'name' => 'How to use '.$tool['name'].' Online',
                    'description' => 'Fast 3-step guide to use '.$tool['name'].' free in your web browser without installation.',
                    'step' => [
                        [
                            '@type' => 'HowToStep',
                            'position' => 1,
                            'name' => 'Select or input your data',
                            'text' => 'Choose your file or paste your input into '.$tool['name'].'.',
                        ],
                        [
                            '@type' => 'HowToStep',
                            'position' => 2,
                            'name' => 'Instant client-side processing',
                            'text' => 'The tool processes your data entirely within your local browser memory. No data is sent to external servers.',
                        ],
                        [
                            '@type' => 'HowToStep',
                            'position' => 3,
                            'name' => 'Download or copy output',
                            'text' => 'Save your processed file or copy the generated output directly to your clipboard.',
                        ],
                    ],
                ],
                [
                    '@type' => 'FAQPage',
                    'mainEntity' => [
                        [
                            '@type' => 'Question',
                            'name' => 'Is '.$tool['name'].' completely free to use?',
                            'acceptedAnswer' => [
                                '@type' => 'Answer',
                                'text' => 'Yes, '.$tool['name'].' is 100% free with no sign-up, no subscriptions, and no hidden usage limits.',
                            ],
                        ],
                        [
                            '@type' => 'Question',
                            'name' => 'Are my files and data secure?',
                            'acceptedAnswer' => [
                                '@type' => 'Answer',
                                'text' => 'Yes, this tool executes 100% client-side in your web browser. Your files and data never touch our servers.',
                            ],
                        ],
                        [
                            '@type' => 'Question',
                            'name' => 'Does this tool work on mobile devices?',
                            'acceptedAnswer' => [
                                '@type' => 'Answer',
                                'text' => 'Yes, '.$tool['name'].' is fully responsive and works seamlessly across iOS, Android, macOS, Windows, and Linux browsers.',
                            ],
                        ],
                    ],
                ],
                [
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => [
                        ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                        ['@type' => 'ListItem', 'position' => 2, 'name' => 'Free Tools', 'item' => $url.'/tools'],
                        ['@type' => 'ListItem', 'position' => 3, 'name' => $tool['name'], 'item' => $canonical],
                    ],
                ],
            ],
        ];

        $head = [
            'title' => $tool['name'].' — Free Online Tool | No Sign-Up | '.$site['name'],
            'description' => $tool['description'],
            'canonical' => $canonical,
            'og_title' => $tool['name'].' — Free Online | '.$site['name'],
            'json_ld' => json_encode($jsonLd, JSON_UNESCAPED_SLASHES),
        ];

        return view('tools.show', compact('site', 'head', 'tool', 'relatedTools', 'tools'));
    }

    private function renderIndex(?string $activeCategory)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $tools = config('tools');
        $categories = collect($tools)->groupBy('category');

        $categoryName = null;
        if ($activeCategory !== null) {
            $categoryTool = collect($tools)->firstWhere('category_slug', $activeCategory);
            $categoryName = $categoryTool['category'] ?? null;
        }

        $filteredTools = $activeCategory !== null
            ? collect($tools)->where('category_slug', $activeCategory)->values()->all()
            : $tools;

        $canonical = $activeCategory !== null
            ? $url.'/tools/category/'.$activeCategory
            : $url.'/tools';

        $indexJsonLd = [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'CollectionPage',
                    'name' => $categoryName !== null ? $categoryName.' — Free Online Tools' : 'Free Online Developer & Utility Tools',
                    'description' => $headDescription = ($categoryName !== null
                        ? 'Free '.$categoryName.' that run entirely in your browser — no sign-up, no uploads. Built by Deepak Bagada.'
                        : 'Suite of 30+ free browser-based online tools by Deepak Bagada: PDF merge, image conversion, GST calculator, token counter, and JSON formatters.'),
                    'url' => $canonical,
                    'mainEntity' => [
                        '@type' => 'ItemList',
                        'numberOfItems' => count($filteredTools),
                        'itemListElement' => collect($filteredTools)->values()->map(static fn (array $t, int $i) => [
                            '@type' => 'ListItem',
                            'position' => $i + 1,
                            'name' => $t['name'],
                            'url' => $url.'/tools/'.$t['slug'],
                        ])->all(),
                    ],
                ],
                [
                    '@type' => 'BreadcrumbList',
                    'itemListElement' => array_values(array_filter([
                        ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                        ['@type' => 'ListItem', 'position' => 2, 'name' => 'Tools', 'item' => $url.'/tools'],
                        $categoryName !== null ? ['@type' => 'ListItem', 'position' => 3, 'name' => $categoryName, 'item' => $canonical] : null,
                    ])),
                ],
            ],
        ];

        $head = [
            'title' => $categoryName !== null
                ? $categoryName.' — Free Online Tools | '.$site['name']
                : 'Free Online Tools — No Sign-Up, 100% Browser-Based | '.$site['name'],
            'description' => $categoryName !== null
                ? 'Free '.$categoryName.' that run entirely in your browser — no sign-up, no uploads, your data never leaves your device. Built by Deepak Bagada.'
                : '25+ free online tools — PDF merge, image compressor, QR generator, JSON formatter, GST calculator & more. 100% browser-based, your data never leaves your device. Built by Deepak Bagada.',
            'canonical' => $canonical,
            'json_ld' => json_encode($indexJsonLd, JSON_UNESCAPED_SLASHES),
        ];

        return view('tools.index', compact('site', 'head', 'tools', 'categories', 'filteredTools', 'activeCategory'));
    }
}
