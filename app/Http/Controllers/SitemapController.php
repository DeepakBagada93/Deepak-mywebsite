<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Service;
use App\Models\Skill;
use App\Models\SkillArchitecture;
use App\Support\WordCount;

class SitemapController extends Controller
{
    public function show()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        // Exclude thin posts (<900 words, auditor-consistent count) so Google
        // focuses crawl budget on substantial pages (AdSense low-value fix).
        // Also exclude duplicate-variant slugs (canonical consolidation).
        $posts = Post::published()->canonical()->get()
            ->reject(fn (Post $p) => Post::isVariantSlug($p->slug))
            ->reject(fn (Post $p) => WordCount::count($p->content) < 900)
            ->values();
        $services = Service::orderBy('id')->get();
        $skills = Skill::published()->get();
        $blueprints = SkillArchitecture::orderBy('sort_order', 'asc')->get();
        $tools = config('tools');

        return response()
            ->view('sitemap', compact('url', 'posts', 'services', 'skills', 'blueprints', 'tools'))
            ->header('Content-Type', 'application/xml');
    }
}
