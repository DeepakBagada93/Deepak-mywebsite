<?php

/**
 * Batched lead campaign sender for Deepak Bagada outreach.
 * Sends a personalized minimal dispatch from a leads JSON file with throttling,
 * unsubscribe handling and a resumable sent-log.
 *
 * Usage:
 *   php send-campaign.php --leads-file=leads-100-india.json --subject="..." --body-file=dispatch.html \
 *     --source=india_products_100 --offset=0 --limit=20 --sleep=3
 *   php send-campaign.php ... --dry-run
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;

$options = getopt('', ['leads-file:', 'subject:', 'body-file:', 'source:', 'offset:', 'limit:', 'sleep:', 'dry-run', 'log:']);

$leadsFile = $options['leads-file'] ?? null;
$subject = $options['subject'] ?? null;
$bodyFile = $options['body-file'] ?? null;
$source = $options['source'] ?? 'outreach_india_products';
$offset = max(0, (int) ($options['offset'] ?? 0));
$limit = max(1, (int) ($options['limit'] ?? 20));
$sleep = max(0, (float) ($options['sleep'] ?? 3));
$isDryRun = isset($options['dry-run']);
$logFile = $options['log'] ?? (__DIR__.'/../india-100-sent.json');

if (! $leadsFile || ! $subject || ! $bodyFile) {
    fwrite(STDERR, "Error: --leads-file, --subject and --body-file are required.\n");
    exit(1);
}

$leads = json_decode(file_get_contents($leadsFile), true);
if (! is_array($leads)) {
    fwrite(STDERR, "Error: leads file is not valid JSON.\n");
    exit(1);
}

$rawHtml = file_get_contents($bodyFile);
if (! $rawHtml) {
    fwrite(STDERR, "Error: body file is empty.\n");
    exit(1);
}

$batch = array_slice($leads, $offset, $limit);
$site = config('site');
$fromAddress = config('mail.from.address', 'ceo@saasnext.in');
$fromName = config('mail.from.name', 'Deepak Bagada');

$log = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
if (! is_array($log)) $log = [];
$already = [];
foreach ($log as $row) {
    if (($row['status'] ?? '') === 'sent') $already[strtolower($row['email'])] = true;
}

$sent = 0;
$skipped = 0;
$failed = 0;

echo str_repeat('-', 60)."\n";
echo 'Batch: '.($offset + 1).'–'.($offset + count($batch)).' of '.count($leads)."\n";
echo 'Subject: '.$subject."\n";
echo 'Mode: '.($isDryRun ? 'DRY RUN' : 'LIVE via '.config('mail.mailers.smtp.host'))."\n";
echo str_repeat('-', 60)."\n";

foreach ($batch as $lead) {
    $email = strtolower(trim($lead['email'] ?? ''));
    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "[SKIP invalid] {$email}\n";
        $skipped++;
        continue;
    }
    if (isset($already[$email])) {
        echo "[SKIP sent] {$email}\n";
        $skipped++;
        continue;
    }

    $subscriber = Subscriber::where('email', $email)->first();
    if ($subscriber && $subscriber->status === 'unsubscribed') {
        echo "[SKIP unsub] {$email}\n";
        $skipped++;
        continue;
    }

    $firstName = null;
    if (! empty($lead['name'])) {
        $firstName = preg_split('/\s+/', trim($lead['name']))[0];
    }

    if (! $subscriber) {
        $subscriber = Subscriber::create([
            'email' => $email,
            'name' => $lead['name'] ?? null,
            'source' => $source,
            'status' => 'active',
            'subscribed_at' => now(),
        ]);
    } else {
        if ($firstName && ! $subscriber->name) {
            $subscriber->name = $lead['name'];
        }
        $subscriber->source = $source;
        $subscriber->save();
    }

    $html = str_replace(
        ['{{UNSUBSCRIBE_URL}}', '{{EMAIL}}', '{{NAME}}', '{{SITE_NAME}}', '{{SITE_URL}}'],
        [$subscriber->getUnsubscribeUrl(), $subscriber->email, $firstName ?: 'there', $site['name'], $site['url']],
        $rawHtml
    );

    if ($isDryRun) {
        echo "[DRY RUN] {$email}".($firstName ? " ({$firstName})" : '')."\n";
        $sent++;
        continue;
    }

    try {
        Mail::html($html, function ($message) use ($subscriber, $subject, $fromAddress, $fromName) {
            $message->to($subscriber->email)
                ->from($fromAddress, $fromName)
                ->replyTo($fromAddress, $fromName)
                ->subject($subject);
        });

        $log[] = [
            'email' => $email,
            'company' => $lead['company'] ?? null,
            'city' => $lead['city'] ?? null,
            'status' => 'sent',
            'source' => $source,
            'sent_at' => now()->toIso8601String(),
        ];
        file_put_contents($logFile, json_encode($log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        echo "[SENT] {$email}\n";
        $sent++;
        if ($sleep > 0 && count($batch) > 1) usleep((int) ($sleep * 1000000));
    } catch (\Throwable $e) {
        $log[] = [
            'email' => $email,
            'company' => $lead['company'] ?? null,
            'city' => $lead['city'] ?? null,
            'status' => 'failed',
            'error' => $e->getMessage(),
            'source' => $source,
            'sent_at' => now()->toIso8601String(),
        ];
        file_put_contents($logFile, json_encode($log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        echo "[FAILED] {$email}: {$e->getMessage()}\n";
        $failed++;
    }
}

echo str_repeat('-', 60)."\n";
echo "Summary: {$sent} sent, {$skipped} skipped, {$failed} failed.\n";
exit($failed > 0 ? 1 : 0);
