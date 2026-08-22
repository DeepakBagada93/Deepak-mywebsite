<?php

use App\Http\Controllers\BlueprintController;
use App\Http\Controllers\CuratedRepoController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SkillController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortfolioController::class, 'index'])->name('home');

Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('/journal', [PostController::class, 'index'])->name('journal.index');
Route::get('/journal/{post:slug}', [PostController::class, 'show'])->name('journal.show');

Route::prefix('library')->group(function () {
    Route::get('/', [SkillController::class, 'index'])->name('library.index');
    Route::get('/category/{category:slug}', [SkillController::class, 'category'])->name('library.category');
    Route::get('/{skill:slug}', [SkillController::class, 'show'])->name('library.show');
});

Route::prefix('blueprints')->group(function () {
    Route::get('/', [BlueprintController::class, 'index'])->name('blueprints.index');
    Route::get('/{id}', [BlueprintController::class, 'show'])->name('blueprints.show');
});

Route::prefix('repos')->group(function () {
    Route::get('/', [CuratedRepoController::class, 'index'])->name('repos.index');
    Route::get('/category/{category}', [CuratedRepoController::class, 'category'])->name('repos.category');
});

Route::get('/stack', function () {
    $site = config('site');
    $url = rtrim($site['url'], '/');
    $head = [
        'title' => 'The Production AI Content & Media Stack — '.$site['name'],
        'description' => 'Architecture documentation for the autonomous content and video generation pipeline.',
        'canonical' => $url.'/stack',
    ];

    return view('stack.index', compact('site', 'head'));
})->name('stack.index');

Route::get('/sitemap.xml', [SitemapController::class, 'show'])->name('sitemap');
