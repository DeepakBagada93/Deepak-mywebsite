<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function index(Request $request)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $tools = config('tools');
        
        // Group tools by category
        $categories = collect($tools)->groupBy('category');
        
        // Filter by category if query param exists
        $activeCategory = $request->query('category');
        if ($activeCategory) {
            $filteredTools = collect($tools)->where('category_slug', $activeCategory)->values()->all();
        } else {
            $filteredTools = $tools;
        }
        
        $head = [
            'title' => 'Free Online Tools — No Sign-Up, 100% Browser-Based | ' . $site['name'],
            'description' => '25+ free online tools — PDF merge, image compressor, QR generator, JSON formatter, GST calculator & more. 100% browser-based, your data never leaves your device. Built by Deepak Bagada.',
            'canonical' => $url . '/tools',
        ];

        return view('tools.index', compact('site', 'head', 'tools', 'categories', 'filteredTools', 'activeCategory'));
    }

    public function show(string $slug)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $tools = config('tools');
        
        $tool = collect($tools)->firstWhere('slug', $slug);
        
        if (!$tool) {
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
            'title' => $tool['name'] . ' — Free Online Tool | No Sign-Up | ' . $site['name'],
            'description' => $tool['description'],
            'canonical' => $url . '/tools/' . $slug,
            'og_title' => $tool['name'] . ' — Free Online | ' . $site['name'],
        ];

        return view('tools.show', compact('site', 'head', 'tool', 'relatedTools', 'tools'));
    }
}
