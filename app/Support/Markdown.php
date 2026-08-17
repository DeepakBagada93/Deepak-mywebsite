<?php

namespace App\Support;

/**
 * Lightweight markdown renderer ported verbatim from the pure-PHP
 * `render_post_body()` helper so journal post bodies render identically.
 */
class Markdown
{
    public static function render(string $body): string
    {
        $paras = preg_split('/\n\n+/', trim($body));
        $html = '';

        foreach ($paras as $para) {
            $para = trim($para);
            if ($para === '') {
                continue;
            }

            // Convert ## and ### Headings
            if (preg_match('/^#{1,4}\s+(.+)$/', $para, $m)) {
                $html .= '<h3>' . self::e($m[1]) . '</h3>' . "\n";
                continue;
            }

            // Convert Markdown links [text](url) -> HTML <a href="url">text</a>
            $para = preg_replace_callback('/\[([^\]]+)\]\(([^)]+)\)/', static function ($m) {
                return '<a href="' . self::e($m[2]) . '">' . self::e($m[1]) . '</a>';
            }, $para);

            // Convert Bold **text** -> <strong>text</strong>
            $para = preg_replace_callback('/\*\*([^*]+)\*\*/', static function ($m) {
                return '<strong>' . self::e($m[1]) . '</strong>';
            }, $para);

            // Convert Italic *text* -> <em>text</em>
            $para = preg_replace_callback('/\*([^*]+)\*/', static function ($m) {
                return '<em>' . self::e($m[1]) . '</em>';
            }, $para);

            // Convert bullet lists (- or *)
            if (preg_match('/^(?:[-*]\s+.+(?:\n|$))+/', $para)) {
                $items = preg_split('/\n/', $para);
                $list_html = '<ul style="margin: 16px 0; padding-left: 24px;">' . "\n";
                foreach ($items as $item) {
                    $item = trim($item);
                    if (preg_match('/^[-*]\s+(.+)$/', $item, $im)) {
                        $list_html .= '  <li>' . $im[1] . '</li>' . "\n";
                    }
                }
                $list_html .= '</ul>' . "\n";
                $html .= $list_html;
                continue;
            }

            $html .= '<p>' . nl2br($para) . '</p>' . "\n";
        }

        return $html;
    }

    private static function e(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
