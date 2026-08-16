<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');

Route::get('/journal/{post:slug}', [PostController::class, 'show'])->name('journal.show');

Route::get('/sitemap.xml', function () {
    $posts = \App\Models\Post::published()->get();

    return response()
        ->view('sitemap', ['posts' => $posts])
        ->header('Content-Type', 'application/xml');
});
