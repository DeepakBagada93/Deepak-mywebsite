<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Robust Markdown & Content Renderer for Deepak Bagada Journal & Library.
 * Uses CommonMark parser to properly support headings, code blocks,
 * numbered/bullet lists, blockquotes, tables, and internal links.
 * Enforces web performance and accessibility (lazy-loading, decoding async).
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
        $html = Str::markdown($text, [
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
        ]);

        // Inject loading="lazy" and decoding="async" into images if not already present
        return preg_replace_callback('/<img\b([^>]*?)>/i', static function ($matches) {
            $attrs = $matches[1];
            if (!str_contains($attrs, 'loading=')) {
                $attrs .= ' loading="lazy"';
            }
            if (!str_contains($attrs, 'decoding=')) {
                $attrs .= ' decoding="async"';
            }
            return '<img' . $attrs . '>';
        }, $html);
    }
}
