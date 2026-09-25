<?php

namespace App\Console\Commands;

use App\Models\Subscriber;
use Illuminate\Console\Command;

class ListSubscribersCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'newsletter:subscribers {--status=all : Filter by status: all, active, unsubscribed}';

    /**
     * The console command description.
     */
    protected $description = 'List all registered newsletter subscribers';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $status = strtolower((string) $this->option('status'));

        $query = Subscriber::query()->latest('id');

        if ($status === 'active') {
            $query->active();
        } elseif ($status === 'unsubscribed') {
            $query->unsubscribed();
        }

        $subscribers = $query->get(['id', 'email', 'status', 'source', 'subscribed_at', 'unsubscribed_at']);

        if ($subscribers->isEmpty()) {
            $this->info("No subscribers found (filter: {$status}).");
            return 0;
        }

        $this->info("Total subscribers: {$subscribers->count()} (Filter: {$status})");

        $this->table(
            ['ID', 'Email', 'Status', 'Source', 'Subscribed At', 'Unsubscribed At'],
            $subscribers->map(fn ($sub) => [
                $sub->id,
                $sub->email,
                $sub->status,
                $sub->source,
                $sub->subscribed_at?->toDateTimeString() ?? '-',
                $sub->unsubscribed_at?->toDateTimeString() ?? '-',
            ])->toArray()
        );

        return 0;
    }
}
