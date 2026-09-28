<?php

namespace App\Support;

/**
 * Word counting that mirrors the JS auditor (audit-blog.mjs):
 * strips only real HTML tags (bare "<10ms" comparisons stay as text),
 * then splits on unicode whitespace. str_word_count() + strip_tags()
 * undercounts technical posts by up to 70% (tables, code, < comparisons).
 */
class WordCount
{
    public static function count(?string $html): int
    {
        $text = preg_replace('/<\/?[a-zA-Z][^<>]*>/', ' ', (string) $html);
        $text = trim((string) $text);
        if ($text === '') {
            return 0;
        }

        return count(preg_split('/\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY));
    }
}
