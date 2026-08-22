#!/usr/bin/env php
<?php
/**
 * opensource-library — Sync helper for publishing content
 *
 * Validates PHP syntax, checks memory.md for duplicates,
 * prints structured output for the subagent audit.
 */

$memoryFile = __DIR__ . '/../memory.md';
$contentDir  = __DIR__ . '/../../../../data';  // project data dir

$command = $argv[1] ?? 'help';

switch ($command) {
    case 'validate':
        $file = $argv[2] ?? null;
        if (!$file) {
            echo "Usage: php sync.php validate <file.php>\n";
            exit(1);
        }
        $fullPath = realpath($file);
        if (!$fullPath) {
            echo "ERROR: File not found: $file\n";
            exit(1);
        }
        exec("php -l " . escapeshellarg($fullPath) . " 2>&1", $output, $code);
        echo implode("\n", $output) . "\n";
        exit($code);

    case 'check-duplicate':
        $slug = $argv[2] ?? null;
        if (!$slug) {
            echo "Usage: php sync.php check-duplicate <slug>\n";
            exit(1);
        }
        if (!file_exists($memoryFile)) {
            echo "NO_MEMORY_FILE\n";
            exit(0);
        }
        $memory = file_get_contents($memoryFile);
        if (str_contains($memory, "Slug: `$slug`")) {
            echo "DUPLICATE: Slug '$slug' already exists in memory.md\n";
            exit(1);
        }
        echo "UNIQUE: Slug '$slug' is available\n";
        exit(0);

    case 'memory-add':
        $title  = $argv[2] ?? '';
        $slug   = $argv[3] ?? '';
        $type   = $argv[4] ?? 'skill';  // skill, blueprint, repo, stack
        $words  = $argv[5] ?? '0';
        $date   = date('Y-m-d');
        $entry  = "\n- **$title**\n  - Slug: `$slug`\n  - Type: `$type`\n  - Published: `$date`\n  - Words: $words\n";
        file_put_contents($memoryFile, $entry, FILE_APPEND);
        echo "✓ Added to memory.md: $title\n";
        break;

    default:
        echo "opensource-library sync helper\n";
        echo "Usage:\n";
        echo "  php sync.php validate <file>    — PHP syntax check\n";
        echo "  php sync.php check-duplicate <slug> — Duplicate check vs memory.md\n";
        echo "  php sync.php memory-add <title> <slug> <type> <words> — Add to memory.md\n";
        break;
}