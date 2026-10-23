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

        if ((string) $request->query('page') === '1') {
            return redirect()->route('tools.index', [], 301);
        }

        return $this->renderIndex(null);
    }

    public function category(string $category)
    {
        $exists = collect(config('tools'))
            ->contains(static fn (array $tool) => $tool['category_slug'] === $category);

        abort_unless($exists, 404);

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

        $head = [
            'title' => $tool['name'].' — Free Online Tool | No Sign-Up | '.$site['name'],
            'description' => $tool['description'],
            'canonical' => $url.'/tools/'.$slug,
            'og_title' => $tool['name'].' — Free Online | '.$site['name'],
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

        $head = [
            'title' => $categoryName !== null
                ? $categoryName.' — Free Online Tools | '.$site['name']
                : 'Free Online Tools — No Sign-Up, 100% Browser-Based | '.$site['name'],
            'description' => $categoryName !== null
                ? 'Free '.$categoryName.' that run entirely in your browser — no sign-up, no uploads, your data never leaves your device. Built by Deepak Bagada.'
                : '25+ free online tools — PDF merge, image compressor, QR generator, JSON formatter, GST calculator & more. 100% browser-based, your data never leaves your device. Built by Deepak Bagada.',
            'canonical' => $canonical,
        ];

        return view('tools.index', compact('site', 'head', 'tools', 'categories', 'filteredTools', 'activeCategory'));
    }
}
