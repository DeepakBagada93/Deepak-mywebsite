<?php

namespace App\Http\Controllers;

use App\Models\CuratedRepo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CuratedRepoController extends Controller
{
    public function index(Request $request)
    {
        if ($request->filled('category')) {
            $name = $this->resolveCategoryName((string) $request->query('category'));
            abort_if($name === null, 404);

            $parameters = ['category' => Str::slug($name)];
            if ((string) $request->query('page') !== '' && (string) $request->query('page') !== '1') {
                $parameters['page'] = $request->query('page');
            }

            return redirect()->route('repos.category', $parameters, 301);
        }

        if ((string) $request->query('page') === '1') {
            return redirect()->route('repos.index', [], 301);
        }

        return $this->renderIndex(null);
    }

    public function category(Request $request, string $category)
    {
        $name = $this->resolveCategoryName($category);
        abort_if($name === null, 404);

        if ((string) $request->query('page') === '1') {
            return redirect()->route('repos.category', ['category' => Str::slug($name)], 301);
        }

        return $this->renderIndex($name);
    }

    private function renderIndex(?string $categoryName)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');

        $query = CuratedRepo::orderBy('featured', 'desc')->orderBy('sort_order', 'asc');

        if ($categoryName !== null) {
            $query->where('category', $categoryName);
        }

        $repos = $query->paginate(16);
        $categories = CuratedRepo::select('category')->distinct()->whereNotNull('category')->orderBy('category')->pluck('category');

        $canonical = $categoryName !== null
            ? $url.'/repos/category/'.Str::slug($categoryName)
            : $url.'/repos';
        if ($repos->currentPage() > 1) {
            $canonical .= '?page='.$repos->currentPage();
        }

        $head = [
            'title' => $categoryName !== null
                ? $categoryName.' AI Repositories — Curated Open Source | '.$site['name']
                : 'Curated Open-Source AI Repositories & Tools — '.$site['name'],
            'description' => $categoryName !== null
                ? 'A vetted directory of open-source '.$categoryName.' repositories and tools, annotated with production engineering notes by Deepak Bagada.'
                : 'A vetted directory of top open-source AI frameworks, LLM libraries, multi-agent tools, and media generation pipelines with engineering commentary.',
            'canonical' => $canonical,
            'og_type' => 'website',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'CollectionPage',
                        'name' => $categoryName !== null
                            ? $categoryName.' Open-Source AI Repositories'
                            : 'Curated Open-Source AI Repositories',
                        'description' => 'Vetted AI repos, agent frameworks, and developer tools curated by Deepak Bagada.',
                        'url' => $canonical,
                        'mainEntity' => [
                            '@type' => 'ItemList',
                            'itemListElement' => $repos->map(static fn (CuratedRepo $repo, int $index) => [
                                '@type' => 'ListItem',
                                'position' => $index + 1,
                                'name' => $repo->title,
                                'url' => $repo->url,
                            ])->values()->all(),
                        ],
                    ],
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => array_values(array_filter([
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Repos', 'item' => $url.'/repos'],
                            $categoryName !== null
                                ? ['@type' => 'ListItem', 'position' => 3, 'name' => $categoryName, 'item' => $url.'/repos/category/'.Str::slug($categoryName)]
                                : null,
                        ])),
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('repos.index', compact('site', 'repos', 'categories', 'categoryName', 'head'));
    }

    /**
     * Resolve either a raw category name ("Data & Storage") or a clean slug
     * ("data-storage") back to the value stored on the row.
     */
    private function resolveCategoryName(string $value): ?string
    {
        $normalized = Str::slug($value);

        return CuratedRepo::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->first(static fn (string $name) => Str::slug($name) === $normalized);
    }
}
