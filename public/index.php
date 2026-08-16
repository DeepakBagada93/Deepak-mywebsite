<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

/**
 * Laravel front controller — deploy-safe for cPanel shared hosting.
 *
 * This file locates the Laravel application root automatically, so it works:
 *   1. normally, from Laravel's own public/ folder (php artisan serve), or
 *   2. when copied into public_html/ with the app in a sibling folder
 *      (e.g. ~/domains/YOURDOMAIN.COM/portfolio/) — no path editing needed.
 */

define('LARAVEL_START', microtime(true));

function is_laravel_root(string $dir): bool
{
    return is_dir($dir)
        && file_exists($dir.'/vendor/autoload.php')
        && file_exists($dir.'/bootstrap/app.php');
}

function find_laravel_root(string $start): ?string
{
    $dir = $start;
    for ($i = 0; $i < 5; $i++) {
        if (is_laravel_root($dir)) {
            return $dir;
        }
        // cPanel layout: the app often sits in a sibling folder of the web root.
        foreach (glob($dir.'/*', GLOB_ONLYDIR) ?: [] as $candidate) {
            if (is_laravel_root($candidate)) {
                return $candidate;
            }
        }
        $parent = dirname($dir);
        if ($parent === $dir) {
            break;
        }
        $dir = $parent;
    }

    return null;
}

$appRoot = find_laravel_root(__DIR__);

if ($appRoot === null) {
    http_response_code(500);
    echo 'Laravel application root not found. Upload the project next to public_html '
        .'(see DEPLOYMENT.md → "cPanel file manager" section).';
    exit(1);
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $appRoot.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $appRoot.'/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $appRoot.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
