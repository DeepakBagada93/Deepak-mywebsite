<?php

namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    public function show(Post $post)
    {
        abort_unless($post->published_at, 404);

        return view('portfolio.post', ['post' => $post]);
    }
}
