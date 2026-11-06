<?php

namespace App\Console\Commands;

use App\Services\GoogleIndexingService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleIndexingCompliantCommand extends Command
{
    protected $signature = 'google:index-compliant 
                            {--dry-run : Simulate without calling Google Indexing API}
                            {--batch=80 : Maximum URLs to process in this rotation}
                            {--cooldown=4 : Minimum days before re-submitting an unchanged URL}';

    protected $description = '100% Google Guideline-Compliant rotating indexing dispatcher with anti-spam and quota guards';

    public function handle(): int
    {
        $isDryRun = (bool) $this->option('dry-run');
        $batchSize = (int) $this->option('batch');
        $cooldownDays = (int) $this->option('cooldown');

        $this->info('=========================================================================');
        $this->info('🌐 DEEPAK BAGADA — GOOGLE COMPLIANT INDEXING ENGINE (v2.0)');
        $this->info('Mode: '.($isDryRun ? 'DRY-RUN (Simulated)' : 'LIVE EXECUTION'));
        $this->info("Batch Size: {$batchSize} | Cooldown: {$cooldownDays} days | Pacing: 300ms");
        $this->info('=========================================================================');

        // 1. Quota Check
        $quotaUsed = GoogleIndexingService::getDailyQuotaUsed();
        $remainingQuota = max(0, GoogleIndexingService::MAX_DAILY_QUOTA - $quotaUsed);

        $this->info("📊 Daily Quota Status: {$quotaUsed} / ".GoogleIndexingService::MAX_DAILY_QUOTA." used ({$remainingQuota} remaining)");

        if ($remainingQuota <= 0) {
            $this->warn('✅ Daily quota ceiling reached ('.GoogleIndexingService::MAX_DAILY_QUOTA.'/'.GoogleIndexingService::MAX_DAILY_QUOTA.'). Exiting cleanly to protect API reputation.');

            return Command::SUCCESS;
        }

        $effectiveBatch = min($batchSize, $remainingQuota);

        // 2. Ping Sitemap in Search Console
        if (! $isDryRun) {
            $this->info('📡 Pinging Google Search Console Sitemap...');
            $pingSuccess = GoogleIndexingService::pingSitemap();
            $this->line($pingSuccess ? '  ✓ Sitemap ping successful' : '  ⚠️ Sitemap ping returned non-200 (continuing)');
        }

        // 3. Fetch Live Sitemap URLs
        $this->info('🔍 Reading live sitemap URLs...');
        $allUrls = $this->fetchSitemapUrls();
        $this->info('  ✓ Found '.count($allUrls).' total URLs in sitemap.xml');

        if (empty($allUrls)) {
            $this->error('No URLs found in sitemap.xml. Aborting.');

            return Command::FAILURE;
        }

        // 4. Build Anti-Spam Rotating Queue
        $history = GoogleIndexingService::loadHistory();
        $queue = $this->buildRotatingQueue($allUrls, $history, $effectiveBatch, $cooldownDays);
        $this->info('📋 Selected '.count($queue).' URLs for compliant rotation queue.');

        if (empty($queue)) {
            $this->info('✅ All URLs are within cooldown window or already submitted today. Nothing to dispatch.');

            return Command::SUCCESS;
        }

        // 5. Dispatch Loop with Pacing & Preflight Gate
        $successCount = 0;
        $skippedCount = 0;
        $nowIso = Carbon::now('UTC')->toIso8601String();

        foreach ($queue as $i => $url) {
            $idx = $i + 1;
            $total = count($queue);

            // Preflight HTTP 200 gate
            if (! GoogleIndexingService::verifyHttp200($url)) {
                $this->warn("  [{$idx}/{$total}] ⚠️ Preflight Failed (Non-200 status): {$url} — Skipped");
                $skippedCount++;

                continue;
            }

            if ($isDryRun) {
                $this->line("  [{$idx}/{$total}] [SIMULATED] ✓ {$url}");
                $successCount++;

                continue;
            }

            try {
                $res = GoogleIndexingService::publish($url, 'URL_UPDATED');

                if ($res['status'] === 429) {
                    $this->error("  [{$idx}/{$total}] 🛑 Google 429 Rate Limit Encountered. Halting gracefully.");
                    GoogleIndexingService::recordQuotaUsed(GoogleIndexingService::MAX_DAILY_QUOTA);
                    break;
                }

                if ($res['success']) {
                    $this->info("  [{$idx}/{$total}] ✓ {$url}");
                    $successCount++;
                    GoogleIndexingService::recordQuotaUsed(1);

                    $prev = $history[$url] ?? [];
                    $history[$url] = [
                        'last_submitted' => $nowIso,
                        'status' => 200,
                        'submission_count' => ($prev['submission_count'] ?? 0) + 1,
                    ];

                    usleep(300000); // 300ms anti-burst pacing
                } else {
                    $this->error("  [{$idx}/{$total}] ✗ {$url} -> HTTP {$res['status']}");
                }
            } catch (\Throwable $e) {
                $this->error("  [{$idx}/{$total}] ✗ {$url} -> ".$e->getMessage());
            }
        }

        // 6. Save updated history
        if (! $isDryRun && $successCount > 0) {
            GoogleIndexingService::saveHistory($history);
        }

        $this->info('=========================================================================');
        $this->info("🎉 Batch Complete: {$successCount} submitted, {$skippedCount} skipped.");
        $this->info('📈 Total Daily Quota Now: '.GoogleIndexingService::getDailyQuotaUsed().' / '.GoogleIndexingService::MAX_DAILY_QUOTA);
        $this->info('=========================================================================');

        return Command::SUCCESS;
    }

    protected function fetchSitemapUrls(): array
    {
        try {
            $response = Http::timeout(12)->get(GoogleIndexingService::SITEMAP_URL);
            if (! $response->successful()) {
                return [];
            }
            $xml = simplexml_load_string($response->body());
            $urls = [];
            foreach ($xml->url as $entry) {
                $loc = trim((string) $entry->loc);
                if (! empty($loc)) {
                    $urls[] = $loc;
                }
            }

            return $urls;
        } catch (\Throwable $e) {
            $this->error('Failed to parse sitemap: '.$e->getMessage());

            return [];
        }
    }

    protected function buildRotatingQueue(array $allUrls, array $history, int $limit, int $cooldownDays): array
    {
        $todayStr = Carbon::now('UTC')->format('Y-m-d');
        $cooldownCutoff = Carbon::now('UTC')->subDays($cooldownDays);

        $neverSubmitted = [];
        $eligibleUrls = [];

        foreach ($allUrls as $u) {
            $meta = $history[$u] ?? null;
            if (! $meta || empty($meta['last_submitted'])) {
                $neverSubmitted[] = $u;

                continue;
            }

            try {
                $lastSub = Carbon::parse($meta['last_submitted']);
            } catch (\Throwable $e) {
                $neverSubmitted[] = $u;

                continue;
            }

            // Exclude already submitted today
            if ($lastSub->format('Y-m-d') === $todayStr) {
                continue;
            }

            // Must be older than cooldown window
            if ($lastSub->lte($cooldownCutoff)) {
                $eligibleUrls[] = ['url' => $u, 'date' => $lastSub];
            }
        }

        // Circular fair queue: oldest submitted first
        usort($eligibleUrls, fn ($a, $b) => $a['date']->timestamp <=> $b['date']->timestamp);

        $corePrefixes = ['/products', '/services', '/library', '/tools'];
        $tierCore = [];
        $tierArchive = [];

        foreach ($eligibleUrls as $item) {
            $u = $item['url'];
            $path = str_replace(GoogleIndexingService::SITE_URL, '', $u);
            if ($u === GoogleIndexingService::SITE_URL.'/' || Str::startsWith($path, $corePrefixes)) {
                $tierCore[] = $u;
            } else {
                $tierArchive[] = $u;
            }
        }

        $queue = [];
        foreach ($neverSubmitted as $u) {
            if (! in_array($u, $queue, true)) {
                $queue[] = $u;
            }
        }

        foreach (array_slice($tierCore, 0, 15) as $u) {
            if (! in_array($u, $queue, true)) {
                $queue[] = $u;
            }
        }

        foreach ($tierArchive as $u) {
            if (count($queue) >= $limit) {
                break;
            }
            if (! in_array($u, $queue, true)) {
                $queue[] = $u;
            }
        }

        return array_slice($queue, 0, $limit);
    }
}
