<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Project;

class PortfolioController extends Controller
{
    public function index()
    {
        $posts = Post::published()->take(10)->get();
        $projects = Project::orderBy('sort_order')->get();

        return view('portfolio.index', [
            'posts' => $posts,
            'projects' => $projects,
        ]);
    }
}
