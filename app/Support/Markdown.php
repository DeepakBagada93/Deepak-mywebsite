<?php

namespace App\Support;

/**
 * Robust Markdown & Content Renderer for Deepak Bagada Journal.
 * Parses standard markdown (headings, bold, italics, links, lists, blockquotes)
 * and preserves valid HTML tags without leaking raw markdown symbols like ## or **.
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

        // Pre-process headings on standalone lines (# Heading, ## Heading, ### Heading, #### Heading)
        $text = preg_replace_callback('/^(#{1,6})\s+(.+)$/m', static function ($m) {
            $headingText = trim($m[2]);
            return "\n\n<h3>" . self::inlineFormat($headingText) . "</h3>\n\n";
        }, $text);

        // Split into block sections by two or more newlines
        $blocks = preg_split('/\n\n+/', trim($text));
        $output = '';

        foreach ($blocks as $block) {
            $block = trim($block);
            if ($block === '') {
                continue;
            }

            // If block is already a clean HTML heading, preserve it
            if (preg_match('/^<h[1-6]>.*<\/h[1-6]>$/is', $block)) {
                $output .= $block . "\n";
                continue;
            }

            // If block is a blockquote
            if (preg_match('/^>(.+)$/s', $block)) {
                $quoteContent = preg_replace('/^>\s*/m', '', $block);
                $output .= '<blockquote><p>' . self::inlineFormat(trim($quoteContent)) . '</p></blockquote>' . "\n";
                continue;
            }

            // If block is an unordered list (- item or * item)
            if (preg_match('/^(?:[-*]\s+.+(?:\n|$))+/m', $block)) {
                $lines = explode("\n", $block);
                $listHtml = '<ul style="margin: 16px 0; padding-left: 24px;">' . "\n";
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (preg_match('/^[-*]\s+(.+)$/', $line, $lm)) {
                        $listHtml .= '  <li>' . self::inlineFormat($lm[1]) . '</li>' . "\n";
                    }
                }
                $listHtml .= '</ul>' . "\n";
                $output .= $listHtml;
                continue;
            }

            // If block is an ordered list (1. item, 2. item)
            if (preg_match('/^(?:\d+\.\s+.+(?:\n|$))+/m', $block)) {
                $lines = explode("\n", $block);
                $listHtml = '<ol style="margin: 16px 0; padding-left: 24px;">' . "\n";
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (preg_match('/^\d+\.\s+(.+)$/', $line, $lm)) {
                        $listHtml .= '  <li>' . self::inlineFormat($lm[1]) . '</li>' . "\n";
                    }
                }
                $listHtml .= '</ol>' . "\n";
                $output .= $listHtml;
                continue;
            }

            // Format inline elements and wrap in <p> tag
            $formatted = self::inlineFormat($block);
            $output .= '<p>' . nl2br($formatted) . '</p>' . "\n";
        }

        return $output;
    }

    /**
     * Parse inline markdown tokens: bold (** or __), italic (* or _), links [text](url), inline code.
     */
    private static function inlineFormat(string $text): string
    {
        // Convert Markdown links: [text](url) -> <a href="url">text</a>
        $text = preg_replace_callback('/\[([^\]]+)\]\(([^)]+)\)/', static function ($m) {
            $label = self::stripMarkdown($m[1]);
            $url = htmlspecialchars($m[2], ENT_QUOTES, 'UTF-8');
            return '<a href="' . $url . '">' . $label . '</a>';
        }, $text);

        // Convert Bold: **text** or __text__ -> <strong>text</strong>
        $text = preg_replace('/(\*\*|__)(.*?)\1/s', '<strong>$2</strong>', $text);

        // Convert Italic: *text* or _text_ -> <em>text</em>
        $text = preg_replace('/(\*|_)(.*?)\1/s', '<em>$2</em>', $text);

        // Convert Inline code: `code` -> <code>code</code>
        $text = preg_replace('/`([^`]+)`/', '<code>$1</code>', $text);

        // Strip any accidental dangling/escaped markdown symbols at start/end of lines
        $text = preg_replace('/^#{1,6}\s*/m', '', $text);

        return $text;
    }

    /**
     * Strips residual markdown formatting markers from text.
     */
    private static function stripMarkdown(string $text): string
    {
        return str_replace(['**', '__', '`', '#'], '', $text);
    }
}
