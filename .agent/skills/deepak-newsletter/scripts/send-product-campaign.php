<?php

/**
 * Metro product-sales campaign sender (deepak-newsletter v3.0).
 *
 * Defaults to DRY RUN. Pass --live to send. Sends a dark product email to a
 * scored, metro-only lead batch with throttling, unsubscribe handling and a
 * resumable sent log.
 *
 * Usage:
 *   php send-product-campaign.php --leads-file=research/leads-enriched.json \
 *     --product-file=products/agency-delivery-os.json --limit=10
 *
 *   php send-product-campaign.php ... --live --sleep=4 --source=metro_agency_oct
 */

require __DIR__ . '/../../../../vendor/autoload.php';
$app = require_once __DIR__ . '/../../../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Subscriber;
use Illuminate\Support\Facades\Mail;

$options = getopt('', [
    'leads-file:', 'product-file:', 'template:', 'subject:', 'source:', 'campaign:',
    'offset:', 'limit:', 'sleep:', 'log:', 'min-score:', 'save-dir:',
    'dry-run', 'live', 'require-metro', 'allow-non-metro', 'no-generic', 'allow-generic', 'allow-free', 'require-fit', 'allow-mx-fail',
]);

$leadsFile = $options['leads-file'] ?? null;
$productFile = $options['product-file'] ?? (__DIR__.'/../products/agency-delivery-os.json');
$templateFile = $options['template'] ?? (__DIR__.'/../templates/dark-product-sales.html');
$subjectOverride = $options['subject'] ?? null;
$offset = max(0, (int) ($options['offset'] ?? 0));
$limit = max(1, (int) ($options['limit'] ?? 25));
$sleep = max(0, (float) ($options['sleep'] ?? 4));
$minScore = max(0, (int) ($options['min-score'] ?? 65));
$saveDir = $options['save-dir'] ?? null;
$isLive = isset($options['live']) && ! isset($options['dry-run']);
$requireMetro = ! isset($options['allow-non-metro']);
$blockGeneric = ! isset($options['allow-generic']);
$allowFree = isset($options['allow-free']);

if (! $leadsFile) {
    fwrite(STDERR, "Error: --leads-file is required.\n");
    exit(1);
}
if (! file_exists($leadsFile)) {
    fwrite(STDERR, "Error: leads file not found: {$leadsFile}\n");
    exit(1);
}
if (! file_exists($productFile)) {
    fwrite(STDERR, "Error: product file not found: {$productFile}\n");
    exit(1);
}
if (! file_exists($templateFile)) {
    fwrite(STDERR, "Error: template not found: {$templateFile}\n");
    exit(1);
}

$product = json_decode(file_get_contents($productFile), true);
if (! is_array($product) || empty($product['name'])) {
    fwrite(STDERR, "Error: product JSON must contain at least a name.\n");
    exit(1);
}

$template = file_get_contents($templateFile);
if (! $template) {
    fwrite(STDERR, "Error: template is empty.\n");
    exit(1);
}

$rawLeads = json_decode(file_get_contents($leadsFile), true);
if (! is_array($rawLeads)) {
    fwrite(STDERR, "Error: leads file is not valid JSON.\n");
    exit(1);
}
$leads = isset($rawLeads['leads']) && is_array($rawLeads['leads']) ? $rawLeads['leads'] : $rawLeads;
if (! is_array($leads)) {
    fwrite(STDERR, "Error: leads must be an array or { leads: [...] }.\n");
    exit(1);
}

$slug = $product['slug'] ?? 'product';
$campaign = $options['campaign'] ?? ('metro-'.$slug.'-'.now()->format('Y-m'));
$source = $options['source'] ?? ('metro_product_'.$slug);
$defaultLog = __DIR__.'/../campaigns/'.now()->format('Y-m-d').'-'.$slug.'-sent.json';
$logFile = $options['log'] ?? $defaultLog;
if (! is_dir(dirname($logFile))) {
    mkdir(dirname($logFile), 0775, true);
}

$fromAddress = config('mail.from.address', 'ceo@saasnext.in');
$fromName = config('mail.from.name', 'Deepak Bagada');
$siteName = config('site.name', 'SaaS Next');

$metros = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad'];
$genericLocalparts = ['info', 'contact', 'hello', 'hi', 'sales', 'support', 'admin', 'office', 'enquiry', 'enquiries', 'inquiry', 'help', 'care', 'hr', 'jobs', 'marketing', 'billing', 'accounts', 'no-reply', 'noreply', 'webmaster', 'press', 'media'];
$freeDomains = ['gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com', 'live.com', 'rediffmail.com', 'icloud.com', 'protonmail.com', 'aol.com', 'mail.com', 'zoho.com'];

$log = [];
if (file_exists($logFile)) {
    $decoded = json_decode(file_get_contents($logFile), true);
    if (is_array($decoded)) $log = $decoded;
}
$already = [];
foreach ($log as $row) {
    if (($row['status'] ?? '') === 'sent') $already[strtolower($row['email'] ?? '')] = true;
}

$batch = array_slice($leads, $offset, $limit);
$price = $product['price_label'] ?? format_inr($product['price_inr'] ?? 0);
$compare = $product['compare_label'] ?? (! empty($product['compare_inr']) ? format_inr($product['compare_inr']) : '');
$ctaUrl = $product['cta_url'] ?? ('https://deepakbagada.in/products/'.$slug);
$ctaLabel = fill_subject($product['cta_label'] ?? ('Get '.$product['name'].' — '.$price), $product, $batch[0] ?? [], $price);
$subject = $subjectOverride ?: first_subject($product, $batch[0] ?? [], $price);
$subject = trim_subject(fill_subject($subject, $product, $batch[0] ?? [], $price));

echo str_repeat('-', 66)."\n";
echo "Product: {$product['name']} · {$price}\n";
echo 'Campaign: '.$campaign."\n";
echo 'Subject: '.$subject."\n";
echo 'Batch: '.($offset + 1).'–'.($offset + count($batch)).' of '.count($leads)."\n";
echo 'Rules: metro '.($requireMetro ? 'required' : 'optional').' · min score '.$minScore.' · generic inboxes '.($blockGeneric ? 'blocked' : 'allowed').' · free email '.($allowFree ? 'allowed' : 'warn')."\n";
echo 'Mode: '.($isLive ? 'LIVE via '.config('mail.mailers.smtp.host') : 'DRY RUN')."\n";
echo str_repeat('-', 66)."\n";

$sent = 0;
$skipped = 0;
$failed = 0;
$seen = [];

foreach ($batch as $lead) {
    $email = strtolower(trim((string) ($lead['email'] ?? '')));
    $company = trim((string) ($lead['company'] ?? ''));
    $label = $company !== '' ? $company : $email;

    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "[SKIP invalid] {$email}\n";
        $skipped++;
        continue;
    }
    if (isset($seen[$email])) {
        echo "[SKIP duplicate] {$email}\n";
        $skipped++;
        continue;
    }
    $seen[$email] = true;

    if (isset($already[$email])) {
        echo "[SKIP sent] {$email}\n";
        $skipped++;
        continue;
    }

    $score = (int) ($lead['research_score'] ?? 0);
    if ($score < $minScore) {
        echo "[SKIP score {$score}] {$label}\n";
        $skipped++;
        continue;
    }
    if ($requireMetro && ! in_array($lead['city'] ?? '', $metros, true)) {
        echo '[SKIP non-metro '.($lead['city'] ?? 'unknown').'] '.$label."\n";
        $skipped++;
        continue;
    }
    if (($lead['email_status'] ?? '') === 'invalid') {
        echo "[SKIP email_status] {$email}\n";
        $skipped++;
        continue;
    }
    if (($lead['mx'] ?? null) === false && ! isset($options['allow-mx-fail'])) {
        echo "[SKIP mx missing] {$email}\n";
        $skipped++;
        continue;
    }
    if ($blockGeneric) {
        $local = explode('@', $email)[0];
        if (in_array($local, $genericLocalparts, true)) {
            echo "[SKIP generic inbox] {$email}\n";
            $skipped++;
            continue;
        }
    }
    if (! $allowFree) {
        $domain = explode('@', $email)[1] ?? '';
        if (in_array($domain, $freeDomains, true)) {
            echo "[WARN free email] {$email}\n";
        }
    }
    if (! empty($lead['product_fit']) && stripos((string) $lead['product_fit'], (string) $product['name']) === false) {
        if (isset($options['require-fit'])) {
            echo '[SKIP fit '.$lead['product_fit'].'] '.$label."\n";
            $skipped++;
            continue;
        }
        echo '[WARN fit '.$lead['product_fit'].'] '.$label."\n";
    }

    $subscriber = Subscriber::where('email', $email)->first();
    if ($subscriber && $subscriber->status === 'unsubscribed') {
        echo "[SKIP unsub] {$email}\n";
        $skipped++;
        continue;
    }

    $firstName = '';
    if (! empty($lead['name'])) {
        $firstName = preg_split('/\s+/', trim((string) $lead['name']))[0];
    }
    $variants = is_array($product['subject_variants'] ?? null) ? $product['subject_variants'] : [];
    $variant = $variants ? $variants[($offset + $sent) % count($variants)] : null;
    $leadSubject = $subjectOverride ?: trim_subject(fill_subject($variant ?: first_subject($product, $lead, $price), $product, $lead, $price));

    if (! $subscriber) {
        if ($isLive) {
            $subscriber = Subscriber::create([
                'email' => $email,
                'name' => $lead['name'] ?? null,
                'source' => $source,
                'status' => 'active',
                'subscribed_at' => now(),
            ]);
        } else {
            $subscriber = new Subscriber([
                'email' => $email,
                'name' => $lead['name'] ?? null,
                'source' => $source,
                'status' => 'active',
            ]);
            $subscriber->unsubscribe_token = 'preview-'.substr(hash('sha256', $email), 0, 24);
            $subscriber->subscribed_at = now();
        }
    } elseif ($isLive) {
        if ($firstName && ! $subscriber->name) {
            $subscriber->name = $lead['name'];
        }
        $subscriber->source = $source;
        $subscriber->save();
    }

    $html = render_product_email($template, $product, $lead, $subscriber, [
        'subject' => $leadSubject,
        'price' => $price,
        'compare' => $compare,
        'cta_url' => $ctaUrl,
        'cta_label' => $ctaLabel,
        'first_name' => $firstName,
        'source' => $source,
        'site_name' => $siteName,
    ]);

    $unresolved = [];
    if (preg_match_all('/\{\{[A-Z_]+\}\}/', $html, $matches)) {
        $unresolved = array_values(array_unique($matches[0]));
    }
    if ($unresolved) {
        echo "[FAILED render] {$email}: unresolved ".implode(', ', $unresolved)."\n";
        $failed++;
        continue;
    }

    if ($saveDir) {
        if (! is_dir($saveDir)) mkdir($saveDir, 0775, true);
        $safe = preg_replace('/[^a-z0-9._-]+/i', '_', $email);
        file_put_contents(rtrim($saveDir, '/').'/'.sprintf('%03d', $sent + 1).'-'.$safe.'.html', $html);
    }

    if (! $isLive) {
        echo "[DRY RUN] {$email}".($firstName ? " ({$firstName})" : '').' · '.$score.'/'.$lead['tier'].' · '.($lead['city'] ?? '?').' · '.$leadSubject."\n";
        $sent++;
        continue;
    }

    try {
        Mail::html($html, function ($message) use ($subscriber, $leadSubject, $fromAddress, $fromName, $ctaUrl) {
            $message->to($subscriber->email)
                ->from($fromAddress, $fromName)
                ->replyTo($fromAddress, $fromName)
                ->subject($leadSubject);

            $headers = $message->getHeaders();
            $headers->addTextHeader('List-Unsubscribe', '<'.$subscriber->getUnsubscribeUrl().'>');
            $headers->addTextHeader('List-Unsubscribe-Post', 'List-Unsubscribe=One-Click');
            $headers->addTextHeader('X-Campaign', 'deepak-newsletter-v3-product');
        });

        $log[] = [
            'email' => $email,
            'company' => $lead['company'] ?? null,
            'name' => $lead['name'] ?? null,
            'city' => $lead['city'] ?? null,
            'tier' => $lead['tier'] ?? null,
            'research_score' => $score,
            'subject' => $leadSubject,
            'product' => $slug,
            'campaign' => $campaign,
            'status' => 'sent',
            'source' => $source,
            'sent_at' => now()->toIso8601String(),
        ];
        file_put_contents($logFile, json_encode($log, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        echo "[SENT] {$email}\n";
        $sent++;
        if ($sleep > 0 && count($batch) > 1) {
            usleep((int) ($sleep * 1000000));
        }
    } catch (\Throwable $e) {
        $log[] = [
            'email' => $email,
            'company' => $lead['company'] ?? null,
            'city' => $lead['city'] ?? null,
            'subject' => $leadSubject,
            'product' => $slug,
            'campaign' => $campaign,
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

echo str_repeat('-', 66)."\n";
echo "Summary: {$sent} ".($isLive ? 'sent' : 'would send').", {$skipped} skipped, {$failed} failed.\n";
echo 'Log: '.$logFile."\n";
if (! $isLive) {
    echo "Dry run only. Re-run with --live to send.\n";
}
exit($failed > 0 ? 1 : 0);

function format_inr($amount): string
{
    $amount = (float) $amount;
    if (class_exists('NumberFormatter')) {
        $fmt = new NumberFormatter('en_IN', NumberFormatter::DECIMAL);
        $fmt->setAttribute(NumberFormatter::GROUPING_USED, 1);
        $fmt->setAttribute(NumberFormatter::FRACTION_DIGITS, 0);

        return '₹'.$fmt->format($amount);
    }

    return '₹'.number_format($amount, 0, '.', ',');
}

function trim_subject(string $subject): string
{
    $subject = trim(preg_replace('/\s+/', ' ', $subject));
    if (mb_strlen($subject) <= 65) {
        return $subject;
    }

    return rtrim(mb_substr($subject, 0, 62), " \t\n\r\0\x0B,;:.-");
}

function fill_subject(string $subject, array $product, array $lead, string $price): string
{
    $first = $lead['first_name'] ?? '';
    if ($first === '' && ! empty($lead['name'])) {
        $first = preg_split('/\s+/', trim((string) $lead['name']))[0];
    }
    if ($first === '' && ! empty($lead['company'])) {
        $first = preg_split('/\s+/', trim((string) $lead['company']))[0];
    }

    return strtr($subject, [
        '{{FIRST_NAME}}' => $first ?: 'there',
        '{{COMPANY}}' => $lead['company'] ?? 'your team',
        '{{COMPANY_SHORT}}' => (! empty($lead['company']) && mb_strlen((string) $lead['company']) > 28) ? preg_split('/\s+/', trim((string) $lead['company']))[0] : ($lead['company'] ?? 'your team'),
        '{{CITY}}' => $lead['city'] ?? 'India',
        '{{PRODUCT_NAME}}' => $product['name'] ?? '',
        '{{PRICE}}' => $price,
    ]);
}

function first_subject(array $product, array $lead, string $price): string
{
    $variants = $product['subject_variants'] ?? [];
    if (is_array($variants) && count($variants) > 0) {
        return fill_subject((string) $variants[0], $product, $lead, $price);
    }

    $first = $lead['first_name'] ?? (isset($lead['name']) ? preg_split('/\s+/', trim((string) $lead['name']))[0] : (! empty($lead['company']) ? preg_split('/\s+/', trim((string) $lead['company']))[0] : 'there'));

    return $first.', '.($product['outcome_short'] ?? $product['outcome'] ?? 'ship AI without the delivery mess').' ('.$price.')';
}

function h($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function render_product_email(string $template, array $product, array $lead, Subscriber $subscriber, array $ctx): string
{
    $hook = $lead['personalization_hook'] ?? $lead['hook'] ?? '';
    if ($hook === '') {
        $hook = 'Saw '.($lead['company'] ?? 'your team').' is building in '.($lead['city'] ?? 'India').'.';
    }
    $pain = $lead['pain_hypothesis'] ?? $lead['pain'] ?? ($product['pain_points'][0] ?? 'The delivery gap is widening faster than the team can patch it.');
    $outcome = $product['outcome'] ?? $product['tagline'] ?? '';
    $proof = '';
    foreach (($product['proof_bullets'] ?? []) as $item) {
        $proof .= '<li style="margin:0 0 6px 0;">'.h($item).'</li>'."\n                ";
    }
    $rows = '';
    foreach (($product['features'] ?? []) as $row) {
        $rows .= '<tr>'
            .'<td style="padding:12px 0;border-bottom:1px solid #1f2630;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#7d8590;width:42%;">'.h($row['label'] ?? '').'</td>'
            .'<td style="padding:12px 0;border-bottom:1px solid #1f2630;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:19px;color:#c9d1d9;text-align:right;">'.h($row['value'] ?? '').'</td>'
            .'</tr>'."\n                ";
    }
    $bonus = ! empty($product['bonus'])
        ? '<strong style="color:#c9d1d9;">Included:</strong> '.h($product['bonus'])
        : 'Includes free updates and direct email support.';
    $guarantee = $product['guarantee'] ?? 'If the first artifact does not save you an hour, reply and I will refund the purchase.';
    $ps = $product['ps'] ?? 'Reply with your current delivery workflow and I will tell you which artifact to run first.';
    $preheader = $product['preheader'] ?? ($product['name'].' for '.($lead['company'] ?? 'your team').' — '.$ctx['price'].'. '.$outcome);

    $map = [
        '{{SUBJECT}}' => $ctx['subject'],
        '{{PREHEADER}}' => h($preheader),
        '{{HOOK}}' => h($hook),
        '{{PAIN}}' => h($pain),
        '{{OUTCOME}}' => h($outcome),
        '{{PRODUCT_NAME}}' => h($product['name'] ?? ''),
        '{{PRODUCT_TAGLINE}}' => h($product['tagline'] ?? ''),
        '{{PRICE}}' => h($ctx['price']),
        '{{COMPARE_PRICE}}' => h($ctx['compare']),
        '{{PRICE_NOTE}}' => h($product['price_note'] ?? 'One-time · commercial license'),
        '{{PROOF_BULLETS}}' => $proof,
        '{{FEATURE_ROWS}}' => $rows,
        '{{BONUS_BLOCK}}' => $bonus,
        '{{GUARANTEE}}' => h($guarantee),
        '{{CTA_URL}}' => h($ctx['cta_url']),
        '{{CTA_LABEL}}' => h($ctx['cta_label']),
        '{{PS}}' => h($ps),
        '{{UNSUBSCRIBE_URL}}' => h($subscriber->getUnsubscribeUrl()),
        '{{EMAIL}}' => h($subscriber->email),
        '{{REGION}}' => h($lead['city'] ?? ($product['audience_cities'][0] ?? 'India')),
        '{{YEAR}}' => now()->format('Y'),
        '{{SITE_NAME}}' => h($ctx['site_name']),
    ];

    return strtr($template, $map);
}
