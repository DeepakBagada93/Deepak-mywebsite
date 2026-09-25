<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'mail:test {email : The recipient email address}';

    /**
     * The console command description.
     */
    protected $description = 'Send a test email via configured Brevo SMTP credentials';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $recipient = (string) $this->argument('email');
        $site = config('site');

        $this->info("Sending test email to: {$recipient} using host ".config('mail.mailers.smtp.host')."...");

        try {
            Mail::raw("Hello!\n\nThis is a test email sent from {$site['name']} ({$site['url']}) via Brevo SMTP.\n\nYour email system is configured and working perfectly.", function ($message) use ($recipient, $site) {
                $message->to($recipient)
                    ->subject("Brevo SMTP Test — {$site['name']}");
            });

            $this->info("✓ Test email sent successfully to {$recipient}!");
            return 0;
        } catch (\Throwable $e) {
            $this->error("✗ Failed to send email: ".$e->getMessage());
            return 1;
        }
    }
}
