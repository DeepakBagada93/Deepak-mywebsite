<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Robust Markdown & Content Renderer for Deepak Bagada Journal.
 * Uses CommonMark parser to properly support headings, code blocks,
 * numbered/bullet lists, blockquotes, tables, and internal links.
 */
class Markdown
{
    public static function render(string $body): string
    {
        $text = trim($body);
        if ($text === '') {
            return '';
        }

        // Standardize line endings
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        // Render using Laravel CommonMark engine with raw HTML allowance
        return Str::markdown($text, [
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
        ]);
    }
}

