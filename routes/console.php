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
