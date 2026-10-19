<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\WordCount;

class PostController extends Controller
{
    /**
     * Off-topic slugs that dilute topical authority. They return HTTP 410
     * Gone (stronger de-queue signal than 404) and are excluded from the
     * sitemap — never soft-404 them.
     */
    public const GONE_SLUGS = [
        'sarkari-yojana-2026-list',
        'womens-cricket-ipl-fantasy-2026',
        'senior-iphone-tech-fitness-india-2026',
        'bhajan-clubbing-coffee-rave-india-2026',
        'sip-mutual-fund-credit-card-india-2026',
        'phu-quoc-dupe-hidden-islands-india-2026',
        'science-backed-beauty-protein-india-2026',
        'job-hugging-micro-retirement-burnout-india-2026',
        'quick-commerce-10-minute-delivery-vs-kirana-2026',
        'parental-control-safe-internet-gen-alpha-india-2026',
    ];

    public function index()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/journal';
        $portraitUrl = $url.'/images/about-portrait.png';

        $posts = Post::published()->canonical()->paginate(15);
        // Safety net: strip any residual variant slugs the DB-level filter
        // could not express (e.g. `-vN` on SQLite, which lacks REGEXP).
        $listed = $posts->getCollection()
            ->reject(fn (Post $p) => Post::isVariantSlug($p->slug))
            ->values();

        $head = [
            'title' => 'Journal & AI Engineering Articles — '.$site['name'].' | Junagadh, Gujarat',
            'description' => 'Explore the journal of Deepak Bagada: production AI agents, FastAPI MCP servers, Laravel architectures, local search AEO, and engineering field notes from Junagadh, Gujarat, India.',
            'canonical' => $canonical,
            'og_type' => 'website',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'CollectionPage',
                        'name' => 'Journal & Field Notes by '.$site['name'],
                        'description' => 'Technical journal, AI agent architecture guides, web engineering field notes, and founder stories by Deepak Bagada.',
                        'url' => $canonical,
                        'mainEntity' => [
                            '@type' => 'ItemList',
                            'itemListElement' => $listed->map(static fn (Post $post, int $index) => [
                                '@type' => 'ListItem',
                                'position' => $index + 1,
                                'name' => $post->title,
                                'url' => $url.'/journal/'.$post->slug,
                            ])->values()->all(),
                        ],
                    ],
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Journal', 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('journal.index', compact('site', 'posts', 'head'));
    }

    public function show(Post $post)
    {
        // Off-topic slugs dilute topical authority: 410 Gone de-queues them
        // faster than a 404. This runs before every other guard so the slugs
        // can never be served, indexed, or soft-404'd.
        abort_if(in_array($post->slug, self::GONE_SLUGS, true), 410);

        // Future-dated rows are scheduled, not published — 404 until the slot arrives.
        abort_unless($post->date && $post->date <= now(), 404);

        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/journal/'.$post->slug;
        $portraitUrl = $url.'/images/about-portrait.png';

        // AdSense low-value guard: thin posts (<900 words) get noindex until expanded.
        // WordCount mirrors the JS auditor (strip_tags undercounts code/tables by ~70%).
        $wordCount = WordCount::count($post->content);
        $isThin = $wordCount < 900;

        // Duplicate-variant guard: slugs like *-variant-12 / *-v8 are near-duplicates
        // of a canonical post. When the base slug exists as a published post,
        // 301 to it so link equity consolidates instead of splitting; otherwise
        // noindex the variant and point canonical at the journal index.
        $isVariant = Post::isVariantSlug($post->slug);
        if ($isVariant) {
            $baseSlug = preg_replace('/-(variant-\d+|v\d+)$/', '', $post->slug);
            $canonicalPost = Post::published()->where('slug', $baseSlug)->first();
            if ($canonicalPost) {
                return redirect($url.'/journal/'.$canonicalPost->slug, 301);
            }
            $canonical = $url.'/journal';
        }

        $related = Post::published()->canonical()
            ->where('id', '!=', $post->id)
            ->where('category', $post->category)
            ->take(8)->get()
            ->reject(fn (Post $r) => Post::isVariantSlug($r->slug))
            ->take(3);
        if ($related->count() < 3) {
            $related = Post::published()->canonical()->where('id', '!=', $post->id)->take(8)->get()
                ->reject(fn (Post $r) => Post::isVariantSlug($r->slug))
                ->take(3);
        }

        $pageTitle = $post->title;
        if (!str_contains($pageTitle, $site['name'])) {
            if (mb_strlen($pageTitle . ' — ' . $site['name']) <= 65) {
                $pageTitle .= ' — ' . $site['name'];
            }
        }

        $head = [
            'title' => $pageTitle,
            'description' => $post->excerpt,
            'canonical' => $canonical,
            'og_type' => 'article',
            'og_image' => '/images/about-portrait.png',
            'robots' => ($isThin || $isVariant) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => array_values(array_filter([
                    [
                        '@type' => 'Article',
                        'headline' => $post->title,
                        'description' => $post->excerpt,
                        'datePublished' => $post->date?->toAtomString(),
                        'dateModified' => $post->date?->toAtomString(),
                        'author' => [
                            '@type' => 'Person',
                            '@id' => $url.'/#person',
                            'name' => $site['name'],
                            'jobTitle' => 'Best Web Developer, AI Expert & Automation Specialist',
                            'url' => $url.'/',
                            'image' => $portraitUrl,
                            'sameAs' => array_values($site['socials']),
                        ],
                        'publisher' => [
                            '@type' => 'Person',
                            '@id' => $url.'/#person',
                            'name' => $site['name'],
                            'url' => $url.'/',
                            'image' => $portraitUrl,
                        ],
                        'mainEntityOfPage' => $canonical,
                        'image' => [
                            '@type' => 'ImageObject',
                            'url' => $portraitUrl,
                            'contentUrl' => $portraitUrl,
                            'width' => 1122,
                            'height' => 1402,
                        ],
                        'url' => $canonical,
                    ],
                    self::faqPageNode($post->content),
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Journal', 'item' => $url.'/journal'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $post->title, 'item' => $canonical],
                        ],
                    ],
                ])),
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('journal.show', compact('site', 'post', 'head', 'related', 'isThin', 'isVariant', 'wordCount'));
    }

    /**
     * Build a schema.org FAQPage node from the post's "Frequently Asked
     * Questions" section (### question headings + following answer
     * paragraphs). Returns null unless at least 2 Q&As are found.
     */
    private static function faqPageNode(?string $content): ?array
    {
        $pairs = self::extractFaqPairs((string) $content);
        if (count($pairs) < 2) {
            return null;
        }

        return [
            '@type' => 'FAQPage',
            'mainEntity' => array_map(static fn (array $pair) => [
                '@type' => 'Question',
                'name' => $pair['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $pair['answer'],
                ],
            ], $pairs),
        ];
    }

    /**
     * Parse markdown source for a "## Frequently Asked Questions" section.
     * Each "### ..." heading starts a question; the paragraphs that follow
     * (up to the next ###/## heading or end of section) form the answer.
     * Both are stripped to plain text; answers are capped at 500 chars.
     *
     * @return array<int, array{question: string, answer: string}>
     */
    private static function extractFaqPairs(string $content): array
    {
        $text = str_replace(["\r\n", "\r"], "\n", $content);
        if (! preg_match('/^##\s+frequently asked questions\s*$/mi', $text, $m, PREG_OFFSET_CAPTURE)) {
            return [];
        }

        $section = substr($text, $m[0][1] + strlen($m[0][0]));
        // The FAQ section ends at the next same-or-higher-level heading.
        if (preg_match('/^#{1,2}\s+/m', $section, $end, PREG_OFFSET_CAPTURE)) {
            $section = substr($section, 0, $end[0][1]);
        }

        $parts = preg_split('/^###\s+(.+)$/m', $section, -1, PREG_SPLIT_DELIM_CAPTURE);
        if ($parts === false) {
            return [];
        }

        $pairs = [];
        for ($i = 1; $i + 1 < count($parts); $i += 2) {
            $question = self::faqPlainText($parts[$i]);
            $answer = self::faqPlainText($parts[$i + 1]);
            if ($question === '' || $answer === '') {
                continue;
            }
            $pairs[] = [
                'question' => $question,
                'answer' => mb_substr($answer, 0, 500),
            ];
        }

        return $pairs;
    }

    /**
     * Strip markdown/HTML syntax down to plain readable text.
     */
    private static function faqPlainText(string $fragment): string
    {
        $text = preg_replace('/```.*?```/s', ' ', $fragment) ?? '';
        $text = preg_replace('/`([^`]*)`/', '$1', $text) ?? '';
        $text = (string) preg_replace('/!\[([^\]]*)\]\([^)]*\)/', '$1', $text);
        $text = (string) preg_replace('/\[([^\]]*)\]\([^)]*\)/', '$1', $text);
        $text = strip_tags($text);
        $text = (string) preg_replace('/^(\s*(>+\s*|[-*+]\s+|\d+[.)]\s+))+/', '', $text);
        $text = (string) preg_replace('/(\*\*|__|\*|_|~~)/', '', $text);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = (string) preg_replace('/\s+/u', ' ', $text);

        return trim($text);
    }
}
