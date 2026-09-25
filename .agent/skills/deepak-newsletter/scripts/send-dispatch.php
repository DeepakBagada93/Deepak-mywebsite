<?php

/**
 * Send Dispatch Script for Deepak Bagada Newsletter & Technical Outreach
 * Sends personalized, CAN-SPAM compliant emails via Brevo SMTP.
 *
 * Usage:
 *   php send-dispatch.php --to="lead@company.com" --subject="Subject" --body-file="draft.html" --source="outreach_us"
 *   php send-dispatch.php --all-active --subject="Weekly Dispatch #12" --body-file="dispatch.html"
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

$options = getopt('', ['to:', 'all-active', 'subject:', 'body-file:', 'body:', 'source:', 'dry-run']);

$subject = $options['subject'] ?? null;
$bodyFile = $options['body-file'] ?? null;
$bodyText = $options['body'] ?? null;
$to = $options['to'] ?? null;
$allActive = isset($options['all-active']);
$source = $options['source'] ?? 'outreach';
$isDryRun = isset($options['dry-run']);

if (!$subject || (!$bodyFile && !$bodyText)) {
    echo "Error: --subject and (--body-file or --body) are required.\n";
    echo "Usage:\n";
    echo "  php send-dispatch.php --to=lead@domain.com --subject=\"Subject\" --body-file=dispatch.html\n";
    echo "  php send-dispatch.php --all-active --subject=\"Subject\" --body-file=dispatch.html\n";
    exit(1);
}

$rawHtml = $bodyFile ? file_get_contents($bodyFile) : $bodyText;

if (empty($rawHtml)) {
    echo "Error: Email body is empty.\n";
    exit(1);
}

$recipients = [];

if ($allActive) {
    $recipients = Subscriber::active()->get();
    echo "Loaded " . $recipients->count() . " active subscriber(s) from database.\n";
} elseif ($to) {
    $to = strtolower(trim($to));
    $subscriber = Subscriber::where('email', $to)->first();
    if (!$subscriber) {
        $subscriber = Subscriber::create([
            'email' => $to,
            'source' => $source,
            'status' => 'active',
            'subscribed_at' => now(),
        ]);
    }
    $recipients = collect([$subscriber]);
} else {
    echo "Error: Must specify either --to=<email> or --all-active.\n";
    exit(1);
}

if ($recipients->isEmpty()) {
    echo "No recipients to send to.\n";
    exit(0);
}

$site = config('site');
$fromAddress = config('mail.from.address', 'ceo@saasnext.in');
$fromName = config('mail.from.name', 'Deepak Bagada');

echo "--------------------------------------------------------\n";
echo "Dispatch Plan: " . count($recipients) . " recipient(s)\n";
echo "Subject: {$subject}\n";
echo "From: {$fromName} <{$fromAddress}>\n";
echo "Mode: " . ($isDryRun ? "DRY RUN (no emails will be sent)" : "LIVE SEND (via Brevo SMTP)") . "\n";
echo "--------------------------------------------------------\n";

$sentCount = 0;
$failCount = 0;

foreach ($recipients as $recipient) {
    $unsubscribeUrl = $recipient->getUnsubscribeUrl();
    
    // Personalize template
    $personalizedHtml = str_replace(
        ['{{UNSUBSCRIBE_URL}}', '{{EMAIL}}', '{{NAME}}', '{{SITE_NAME}}', '{{SITE_URL}}'],
        [$unsubscribeUrl, $recipient->email, $recipient->name ?: 'there', $site['name'], $site['url']],
        $rawHtml
    );

    if ($isDryRun) {
        echo "[DRY RUN] Would send to: {$recipient->email} (Unsub: {$unsubscribeUrl})\n";
        $sentCount++;
        continue;
    }

    try {
        Mail::html($personalizedHtml, function ($message) use ($recipient, $subject, $fromAddress, $fromName) {
            $message->to($recipient->email)
                ->from($fromAddress, $fromName)
                ->replyTo($fromAddress, $fromName)
                ->subject($subject);
        });

        echo "[✓ SENT] {$recipient->email}\n";
        $sentCount++;

        // Safety throttle between sends (2.5 seconds)
        if (count($recipients) > 1) {
            usleep(2500000);
        }
    } catch (\Throwable $e) {
        echo "[✗ FAILED] {$recipient->email}: " . $e->getMessage() . "\n";
        $failCount++;
    }
}

echo "--------------------------------------------------------\n";
echo "Summary: {$sentCount} sent, {$failCount} failed.\n";
exit($failCount > 0 ? 1 : 0);
