<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class ProcessScheduledPostsCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'blog:process-scheduled
                            {--force-all : Publish all scheduled posts regardless of slot time}
                            {--slug= : Publish only the given slug}
                            {--dry-run : List due posts without writing}';

    /**
     * The console command description.
     */
    protected $description = 'Publish due scheduled blog posts (wraps the autonomous processor script)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $script = base_path('.agent/skills/deepak-blog/scripts/process-scheduled-posts.php');

        $phpBinary = PHP_BINARY ?: 'php';
        $args = [$phpBinary, $script];
        foreach (['force-all', 'dry-run'] as $flag) {
            if ($this->option($flag)) {
                $args[] = '--'.$flag;
            }
        }
        if ($this->option('quiet')) {
            $args[] = '--quiet';
        }
        if ($slug = $this->option('slug')) {
            $args[] = '--slug='.$slug;
        }

        $result = Process::run($args);

        $this->line($result->output());
        if ($result->errorOutput() !== '') {
            $this->line($result->errorOutput());
        }

        return $result->successful() ? 0 : 1;
    }
}
