<?php

namespace App\Http\Controllers;

use App\Models\CuratedRepo;
use App\Models\Post;
use App\Models\Service;
use App\Models\Skill;
use App\Models\SkillArchitecture;
use App\Models\SkillCategory;
use App\Support\WordCount;
use Illuminate\Support\Str;

class SitemapController extends Controller
{
    public function show()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        // Exclude thin posts (<900 words, auditor-consistent count) so Google
        // focuses crawl budget on substantial pages (AdSense low-value fix).
        // Also exclude duplicate-variant slugs (canonical consolidation) and
        // off-topic 410 slugs (belt-and-braces: they 410 in PostController@show
        // but must never be offered for crawling either).
        $posts = Post::published()->canonical()->get()
            ->reject(fn (Post $p) => Post::isVariantSlug($p->slug))
            ->reject(fn (Post $p) => in_array($p->slug, PostController::GONE_SLUGS, true))
            ->reject(fn (Post $p) => WordCount::count($p->content) < 900)
            ->values();
        $services = Service::orderBy('id')->get();
        $skills = Skill::published()->get();
        $skillCategories = SkillCategory::orderBy('sort_order', 'asc')->get();
        $blueprints = SkillArchitecture::orderBy('sort_order', 'asc')->get();
        $tools = config('tools');
        $toolCategories = collect($tools)->pluck('category_slug')->unique()->values();
        $repoCategories = CuratedRepo::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category')
            ->map(static fn (string $category) => Str::slug($category))
            ->values();
        $products = config('products');

        return response()
            ->view('sitemap', compact(
                'url',
                'posts',
                'services',
                'skills',
                'skillCategories',
                'blueprints',
                'tools',
                'toolCategories',
                'repoCategories',
                'products',
            ))
            ->header('Content-Type', 'application/xml');
    }
}
