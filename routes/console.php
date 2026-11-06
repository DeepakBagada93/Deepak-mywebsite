<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Autonomous blog scheduler (server-side — no laptop cron needed).
// Hostinger cron or the scheduled-posts GHA workflow should hit
// `php artisan schedule:run` every 5 minutes; the frequent quiet sweep
// publishes due slots while slot-time log lines stay in the log file.
// Times are IST wall-clock (config/app.php timezone Asia/Kolkata).
Schedule::command('blog:process-scheduled --quiet')
    ->everyMinute()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduled-posts.log'));

// 100% Google Guideline-Compliant rotating indexing engine.
// Executes daily at 08:15 AM IST (via Hostinger artisan schedule:run cron).
// Paces requests with 300ms sleep, enforces preflight HTTP 200 gate,
// and respects safe daily quota (max 180).
Schedule::command('google:index-compliant')
    ->dailyAt('08:15')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/google_indexing_cron.log'));

