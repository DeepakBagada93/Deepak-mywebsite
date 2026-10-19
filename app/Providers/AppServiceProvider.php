<?php

namespace App\Providers;

use App\Models\Project;
use App\Support\StoreCurrency;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Blade::directive('markdown', static fn (string $expression) => "<?php echo \App\Support\Markdown::render($expression); ?>");

        // Active storefront currency (INR/USD), shared with every view so the
        // layout and product pages can render the correct default instantly.
        View::share('storeCurrency', StoreCurrency::current());

        // The footer lists projects on every page, so provide them via a composer.
        View::composer('partials.footer', static function ($view) {
            $view->with('projects', Project::orderBy('sort_order')->get());
        });
    }
}
