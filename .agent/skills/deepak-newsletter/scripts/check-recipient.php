<?php

/**
 * Pre-check an email recipient against the live subscribers table and suppression list.
 *
 * Usage: php check-recipient.php user@example.com
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Subscriber;

if ($argc < 2) {
    echo "Usage: php check-recipient.php <email>\n";
    exit(1);
}

$email = strtolower(trim($argv[1]));

$existing = Subscriber::where('email', $email)->first();

if ($existing) {
    echo json_encode([
        'exists' => true,
        'email' => $email,
        'status' => $existing->status,
        'source' => $existing->source,
        'subscribed_at' => $existing->subscribed_at?->toIso8601String(),
        'unsubscribed_at' => $existing->unsubscribed_at?->toIso8601String(),
    ], JSON_PRETTY_PRINT) . "\n";
    exit(0);
}

echo json_encode([
    'exists' => false,
    'email' => $email,
    'eligible' => true,
], JSON_PRETTY_PRINT) . "\n";
exit(0);
