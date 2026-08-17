<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Service;

class SitemapController extends Controller
{
    public function show()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $posts = Post::published()->get();
        $services = Service::orderBy('id')->get();

        return response()
            ->view('sitemap', compact('url', 'posts', 'services'))
            ->header('Content-Type', 'application/xml');
    }
}
