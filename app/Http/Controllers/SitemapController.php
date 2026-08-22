<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Service;
use App\Models\Skill;
use App\Models\SkillArchitecture;

class SitemapController extends Controller
{
    public function show()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $posts = Post::published()->get();
        $services = Service::orderBy('id')->get();
        $skills = Skill::published()->get();
        $blueprints = SkillArchitecture::orderBy('sort_order', 'asc')->get();

        return response()
            ->view('sitemap', compact('url', 'posts', 'services', 'skills', 'blueprints'))
            ->header('Content-Type', 'application/xml');
    }
}
