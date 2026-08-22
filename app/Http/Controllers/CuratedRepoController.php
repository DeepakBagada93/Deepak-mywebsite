<?php

namespace App\Http\Controllers;

use App\Models\CuratedRepo;
use Illuminate\Http\Request;

class CuratedRepoController extends Controller
{
    public function index(Request $request)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/repos';

        $category = $request->query('category');
        $query = CuratedRepo::orderBy('featured', 'desc')->orderBy('sort_order', 'asc');

        if ($category) {
            $query->where('category', $category);
        }

        $repos = $query->get();
        $categories = CuratedRepo::select('category')->distinct()->whereNotNull('category')->pluck('category');

        $head = [
            'title' => 'Curated Open-Source AI Repositories & Tools — '.$site['name'],
            'description' => 'A vetted directory of top open-source AI frameworks, LLM libraries, multi-agent tools, and media generation pipelines with engineering commentary.',
            'canonical' => $canonical,
            'og_type' => 'website',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'CollectionPage',
                        'name' => 'Curated Open-Source AI Repositories',
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
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Repos', 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('repos.index', compact('site', 'repos', 'categories', 'category', 'head'));
    }

    public function category($category)
    {
        return redirect()->route('repos.index', ['category' => $category]);
    }
}
