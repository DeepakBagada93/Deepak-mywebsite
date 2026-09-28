<?php

namespace App\Console\Commands;

use App\Models\Subscriber;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NewsletterSendCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'newsletter:send
                            {email? : Recipient email address}
                            {--all-active : Send to all active subscribers in the database}
                            {--file= : Path to JSON or text file containing list of emails}
                            {--niche=agents : Niche template: agents, mcp, rag, web}
                            {--region=us : Target region: us, australia, dubai}
                            {--subject= : Custom email subject line}
                            {--body-file= : Path to custom HTML or Markdown file}
                            {--source=outreach : Tracking source tag}
                            {--force : Force sending without interactive confirmation}
                            {--dry-run : Simulate sending without actually delivering}';

    /**
     * The console command description.
     */
    protected $description = 'Send technical dispatches & outreach emails via Brevo SMTP directly from the CLI';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');
        $allActive = (bool) $this->option('all-active');
        $niche = strtolower((string) $this->option('niche'));
        $region = strtolower((string) $this->option('region'));
        $customSubject = $this->option('subject');
        $bodyFile = $this->option('body-file');
        $source = (string) $this->option('source');
        $isDryRun = (bool) $this->option('dry-run');

        $filePath = $this->option('file');

        if (! $email && ! $allActive && ! $filePath) {
            $email = $this->ask('Enter recipient email address (or type "all" for all active subscribers)');
            if (strtolower(trim((string) $email)) === 'all') {
                $allActive = true;
                $email = null;
            }
        }

        $recipients = collect();

        if ($filePath = $this->option('file')) {
            if (! file_exists($filePath)) {
                $this->error("File not found: {$filePath}");

                return 1;
            }

            $content = file_get_contents($filePath);
            $parsed = json_decode($content, true);
            $emailsList = is_array($parsed) ? $parsed : preg_split('/\r\n|\r|\n/', trim($content));

            foreach ($emailsList as $item) {
                $targetEmail = is_array($item) ? ($item['email'] ?? null) : trim((string) $item);
                $targetName = is_array($item) ? ($item['name'] ?? null) : null;
                if (! $targetEmail || ! filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
                    continue;
                }

                $clean = strtolower($targetEmail);
                $sub = Subscriber::where('email', $clean)->first();
                if ($sub && $sub->status === 'unsubscribed') {
                    continue;
                }

                if (! $sub) {
                    $sub = Subscriber::create([
                        'email' => $clean,
                        'name' => $targetName,
                        'source' => $source,
                        'status' => 'active',
                        'subscribed_at' => now(),
                    ]);
                }
                $recipients->push($sub);
            }
            $this->info("Loaded {$recipients->count()} recipient(s) from {$filePath}.");
        } elseif ($allActive) {
            $recipients = Subscriber::active()->get();
            if ($recipients->isEmpty()) {
                $this->warn('No active subscribers found in database.');

                return 0;
            }
            $this->info("Loaded {$recipients->count()} active subscriber(s) from database.");
        } elseif ($email) {
            $cleanEmail = strtolower(trim((string) $email));
            if (! filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
                $this->error("Invalid email address: {$cleanEmail}");

                return 1;
            }

            $subscriber = Subscriber::where('email', $cleanEmail)->first();
            if ($subscriber && $subscriber->status === 'unsubscribed') {
                $this->error("Cannot send: {$cleanEmail} has previously unsubscribed.");

                return 1;
            }

            if (! $subscriber) {
                $subscriber = Subscriber::create([
                    'email' => $cleanEmail,
                    'source' => $source,
                    'status' => 'active',
                    'subscribed_at' => now(),
                ]);
            }

            $recipients->push($subscriber);
        }

        $template = $this->resolveTemplate($niche, $region, $customSubject, $bodyFile);
        $site = config('site');
        $fromAddress = config('mail.from.address', 'ceo@saasnext.in');
        $fromName = config('mail.from.name', 'Deepak Bagada');

        $this->line('------------------------------------------------------------');
        $this->info('Deepak Bagada — Newsletter & Outreach CLI Engine');
        $this->line("From:      {$fromName} <{$fromAddress}>");
        $this->line("Subject:   {$template['subject']}");
        $this->line("Niche:     {$niche} | Region: {$region}");
        $this->line("Count:     {$recipients->count()} recipient(s)");
        $this->line('Mode:      '.($isDryRun ? 'DRY RUN (Simulation)' : 'LIVE SEND (via Brevo SMTP)'));
        $this->line('------------------------------------------------------------');

        $force = (bool) $this->option('force');

        if (! $isDryRun && ! $force && ! $this->confirm('Proceed with dispatch?', true)) {
            $this->warn('Dispatch cancelled by user.');

            return 0;
        }

        $sent = 0;
        $failed = 0;

        foreach ($recipients as $recipient) {
            $unsubUrl = $recipient->getUnsubscribeUrl();
            $body = str_replace(
                ['{{NAME}}', '{{EMAIL}}', '{{UNSUBSCRIBE_URL}}', '{{SITE_URL}}'],
                [$recipient->name ?: 'there', $recipient->email, $unsubUrl, $site['url']],
                $template['body']
            );

            if ($isDryRun) {
                $this->line("[DRY RUN] Would send to: {$recipient->email}");
                $this->line("          Unsubscribe URL: {$unsubUrl}");
                $sent++;

                continue;
            }

            try {
                Mail::html($body, function ($msg) use ($recipient, $template, $fromAddress, $fromName) {
                    $msg->to($recipient->email)
                        ->from($fromAddress, $fromName)
                        ->replyTo($fromAddress, $fromName)
                        ->subject($template['subject']);
                });

                $this->info("[✓ SENT] {$recipient->email}");
                $sent++;

                if ($recipients->count() > 1) {
                    usleep(2500000); // 2.5s rate-limit delay
                }
            } catch (\Throwable $e) {
                $this->error("[✗ FAILED] {$recipient->email}: ".$e->getMessage());
                $failed++;
            }
        }

        $this->line('------------------------------------------------------------');
        $this->info("Completed: {$sent} sent, {$failed} failed.");

        return $failed > 0 ? 1 : 0;
    }

    /**
     * Resolve email subject and body template.
     */
    protected function resolveTemplate(string $niche, string $region, ?string $customSubject, ?string $bodyFile): array
    {
        if ($bodyFile && file_exists($bodyFile)) {
            return [
                'subject' => $customSubject ?: '// [Field Notes] Technical Breakdown — Deepak Bagada',
                'body' => file_get_contents($bodyFile),
            ];
        }

        $site = config('site');
        $siteUrl = rtrim($site['url'], '/');

        $regionalHook = match ($region) {
            'dubai' => 'Building autonomous systems under the Dubai AI Strategy 2031 roadmap requires avoiding brittle prompt chains.',
            'australia' => 'For tech teams in Sydney and Melbourne, building reliable autonomous operations without blowing out engineering headcount is the top priority.',
            default => 'Across high-velocity tech teams in the US, the biggest bottleneck with multi-agent systems is production reliability and cloud token burn.',
        };

        $templates = [
            'agents' => [
                'subject' => $customSubject ?: '// [Blueprint] Why 80% of Multi-Agent Swarms Fail in Prod',
                'headline' => 'The Governed Agent Stack: OPA + Pydantic + HITL',
                'summary' => "{$regionalHook} Most agent frameworks look great in local Jupyter notebooks but crash when real API timeouts, rate limits, or hallucinations occur.",
                'bullet1' => 'Typed Pydantic tool schemas with strict parameter bounds',
                'bullet2' => 'Open Policy Agent (OPA) tenant isolation & guardrails',
                'bullet3' => 'Human-in-the-Loop (HITL) checkpoints before any irreversible state mutation',
                'bullet4' => 'P95 latency benchmark: 42ms HNSW retrieval on ₹6K/mo dedicated infrastructure',
                'cta_text' => 'Read Full Multi-Agent Architecture Guide →',
                'cta_url' => "{$siteUrl}/journal/top-ai-agent-developer-gujarat-roi-2026",
            ],
            'mcp' => [
                'subject' => $customSubject ?: '[MCP Teardown] 60% Faster Tool Execution for Claude & GPT',
                'headline' => 'Model Context Protocol: Industrial Tool Design',
                'summary' => "{$regionalHook} Model Context Protocol (MCP) is becoming the standard connector for LLM tools, but unoptimized JSON schemas waste 40% of context windows.",
                'bullet1' => 'FastAPI & TypeScript MCP servers with sub-10ms tool registration',
                'bullet2' => 'Schema compaction: shrinking tool definitions to save context tokens',
                'bullet3' => 'STDIO vs Server-Sent Events (SSE) streaming benchmarks',
                'bullet4' => 'Real-world ERP, Postgres, and vector database connectors',
                'cta_text' => 'Explore Open-Source MCP Library →',
                'cta_url' => "{$siteUrl}/library",
            ],
            'rag' => [
                'subject' => $customSubject ?: 'Slashing $40K AI Token Bills with 42ms Local RAG',
                'headline' => 'Enterprise Hybrid Retrieval Without Cloud Lock-in',
                'summary' => "{$regionalHook} Blindly vector-searching everything into hosted API endpoints creates unpredictable bills and latency spikes.",
                'bullet1' => 'Hybrid BM25 + pgvector indexing with reciprocal rank fusion (RRF)',
                'bullet2' => 'Semantic caching to serve 35% of repetitive queries at 0 token cost',
                'bullet3' => 'Cross-encoder re-ranking for ultra-high precision answers',
                'bullet4' => 'On-premise / private cloud data sovereignty compliance',
                'cta_text' => 'View Production Architecture Blueprint →',
                'cta_url' => "{$siteUrl}/blueprints",
            ],
            'web' => [
                'subject' => $customSubject ?: 'High-Performance Web Engineering: Sub-50ms TTFB & AEO',
                'headline' => 'Building Fast, Converting Websites in the AI Search Era',
                'summary' => "{$regionalHook} With zero-click search exceeding 58%, modern websites must be optimized for both human conversion and LLM citation indexing.",
                'bullet1' => 'Laravel 11/12 high-throughput backend with Redis & micro-caching',
                'bullet2' => 'Lighthouse 99+ mobile performance & sub-50ms TTFB',
                'bullet3' => 'Answer Engine Optimization (AEO) structured schema markup',
                'bullet4' => 'Interactive client-side tools with zero server processing latency',
                'cta_text' => 'Inspect Interactive Free Tools Hub →',
                'cta_url' => "{$siteUrl}/tools",
            ],
        ];

        $data = $templates[$niche] ?? $templates['agents'];
        if ($customSubject) {
            $data['subject'] = $customSubject;
        }

        $html = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$data['subject']}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f6f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #161616; line-height: 1.65;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f6f2; padding: 36px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e0dfdb; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 34px 36px 20px; border-bottom: 2px solid #161616;">
                            <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #737373; margin-bottom: 8px;">
                                // THE PRIVATE DISPATCH · DEEPAK BAGADA
                            </div>
                            <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: normal; color: #161616; line-height: 1.3;">
                                {$data['headline']}
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 36px;">
                            <p style="font-size: 15px; margin: 0 0 16px 0; color: #161616;">
                                Hello {{NAME}},
                            </p>

                            <p style="font-size: 15px; margin: 0 0 20px 0; color: #333333; line-height: 1.7;">
                                {$data['summary']}
                            </p>

                            <div style="background-color: #faf8f5; border-left: 3px solid #161616; padding: 18px 22px; margin: 24px 0;">
                                <p style="margin: 0; font-size: 13px; font-family: 'Courier New', monospace; font-weight: bold; color: #161616; text-transform: uppercase; letter-spacing: 0.08em;">
                                    Key Architectural Takeaways:
                                </p>
                                <ul style="margin: 12px 0 0 0; padding-left: 18px; font-size: 14px; color: #383838; line-height: 1.65;">
                                    <li style="margin-bottom: 6px;">{$data['bullet1']}</li>
                                    <li style="margin-bottom: 6px;">{$data['bullet2']}</li>
                                    <li style="margin-bottom: 6px;">{$data['bullet3']}</li>
                                    <li>{$data['bullet4']}</li>
                                </ul>
                            </div>

                            <p style="font-size: 15px; margin: 0 0 24px 0; color: #333333; line-height: 1.7;">
                                The code pattern and full engineering breakdown is documented live in my journal:
                            </p>

                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td style="border-radius: 2px; background-color: #161616;">
                                        <a href="{$data['cta_url']}" target="_blank" style="display: inline-block; padding: 13px 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.06em; text-transform: uppercase;">
                                            {$data['cta_text']}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 15px; color: #222222; margin: 0 0 24px 0; line-height: 1.7;">
                                <strong>Quick question for you:</strong> How are you currently architecting tool fallbacks and hallucination guardrails in your stack? Just hit <em>Reply</em> — I read and answer every message directly.
                            </p>

                            <p style="font-size: 14px; color: #555555; margin: 0; line-height: 1.6;">
                                Best,<br>
                                <strong>Deepak Bagada</strong><br>
                                <span style="font-size: 12px; color: #777777;">AI Expert & Agent Architect · Gujarat, India</span><br>
                                <a href="{$siteUrl}" style="font-size: 12px; color: #161616; text-decoration: underline;">deepakbagada.in</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 22px 36px; background-color: #fafafa; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888; line-height: 1.6;">
                            <p style="margin: 0 0 8px 0;">
                                You are receiving this because you subscribed or connected with Deepak Bagada ({$site['name']}, Junagadh, Gujarat 362001, India).
                            </p>
                            <p style="margin: 0;">
                                Prefer not to receive these field notes? <a href="{{UNSUBSCRIBE_URL}}" style="color: #555555; text-decoration: underline;">One-click unsubscribe</a>.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;

        return [
            'subject' => $data['subject'],
            'body' => $html,
        ];
    }
}
