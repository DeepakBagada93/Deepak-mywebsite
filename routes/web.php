<?php

use App\Http\Controllers\BlueprintController;
use App\Http\Controllers\CashfreeWebhookController;
use App\Http\Controllers\CuratedRepoController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ToolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
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

Route::prefix('tools')->group(function () {
    Route::get('/', [ToolController::class, 'index'])->name('tools.index');
    Route::get('/{slug}', [ToolController::class, 'show'])->name('tools.show');
});

// Digital products storefront
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('products.index');
    Route::get('/return', [OrderController::class, 'returnFromPayment'])->name('products.return');
    Route::get('/track', [OrderController::class, 'track'])->name('products.track');
    Route::post('/track', [OrderController::class, 'track'])
        ->middleware('throttle:10,1')
        ->name('products.track.lookup');
    Route::get('/checkout/{slug?}', [OrderController::class, 'showCheckout'])->name('products.checkout.page');
    Route::post('/checkout', [OrderController::class, 'initiate'])
        ->middleware('throttle:20,1')
        ->name('products.checkout');
    Route::get('/{slug}/checkout', [OrderController::class, 'showCheckout'])->name('products.checkout.single');
    Route::get('/{slug}', [ProductController::class, 'show'])->name('products.show');
});

Route::get('/download/{token}', [DownloadController::class, 'show'])->name('products.download');

Route::post('/webhooks/cashfree', [CashfreeWebhookController::class, 'handle'])
    ->name('webhooks.cashfree');

Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])
    ->middleware('throttle:15,1')
    ->name('newsletter.subscribe');

Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribe'])
    ->name('newsletter.unsubscribe');

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

Route::get('/about', [LegalController::class, 'about'])->name('legal.about');
Route::get('/contact', [LegalController::class, 'contact'])->name('legal.contact');
Route::get('/privacy-policy', [LegalController::class, 'privacy'])->name('legal.privacy');
Route::get('/terms', [LegalController::class, 'terms'])->name('legal.terms');
Route::get('/disclaimer', [LegalController::class, 'disclaimer'])->name('legal.disclaimer');

Route::get('/sitemap.xml', [SitemapController::class, 'show'])->name('sitemap');

Route::get('/ads.txt', function () {
    return response("google.com, pub-4764950179214862, DIRECT, f08c47fec0942fa0\n", 200)
        ->header('Content-Type', 'text/plain; charset=utf-8');
});

// Autonomous scheduler webhook (for Hostinger Web Cron, UptimeRobot, or external pings)
Route::get('/cron/process-scheduled', function (Request $request) {
    $expected = env('CRON_TOKEN', substr(hash('sha256', config('app.key').'deepak-cron'), 0, 32));
    if ($request->query('token') !== $expected) {
        abort(403, 'Unauthorized');
    }

    $exitCode = Artisan::call('blog:process-scheduled');
    $output = Artisan::output();

    return response()->json([
        'status' => $exitCode === 0 ? 'success' : 'failed',
        'timestamp' => now()->toIso8601String(),
        'output' => trim($output),
    ]);
})->name('cron.process-scheduled');
