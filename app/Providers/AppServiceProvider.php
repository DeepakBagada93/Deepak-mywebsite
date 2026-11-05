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

        // Active storefront currency (INR/USD), shared globally with every view
        // so layouts and product pages render the detected currency.
        View::composer('*', static function ($view): void {
            if (! array_key_exists('storeCurrency', $view->getData())) {
                $view->with('storeCurrency', StoreCurrency::current());
            }
        });

        View::share('storeCurrency', StoreCurrency::current());

        // The footer lists projects on every page, so provide them via a composer.
        View::composer('partials.footer', static function ($view) {
            $view->with('projects', Project::orderBy('sort_order')->get());
        });
    }
}
