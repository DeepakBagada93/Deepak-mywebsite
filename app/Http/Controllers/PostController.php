<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Support\WordCount;

class PostController extends Controller
{
    public function index()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/journal';
        $portraitUrl = $url.'/images/about-portrait.png';

        $posts = Post::published()->paginate(15);
        $listed = $posts->getCollection()
            ->reject(fn (Post $p) => (bool) preg_match('/-(variant-\d+|v\d+)$/', $p->slug))
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
        abort_unless($post->date, 404);

        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/journal/'.$post->slug;
        $portraitUrl = $url.'/images/about-portrait.png';

        // AdSense low-value guard: thin posts (<900 words) get noindex until expanded.
        // WordCount mirrors the JS auditor (strip_tags undercounts code/tables by ~70%).
        $wordCount = WordCount::count($post->content);
        $isThin = $wordCount < 900;

        // Duplicate-variant guard: slugs like *-variant-12 / *-v8 are near-duplicates
        // of a canonical post. Noindex them and point canonical at the base slug
        // when it exists, so link equity consolidates instead of splitting.
        $isVariant = (bool) preg_match('/-(variant-\d+|v\d+)$/', $post->slug);
        if ($isVariant) {
            $baseSlug = preg_replace('/-(variant-\d+|v\d+)$/', '', $post->slug);
            $canonicalPost = Post::where('slug', $baseSlug)->whereNotNull('date')->first();
            if ($canonicalPost) {
                $canonical = $url.'/journal/'.$canonicalPost->slug;
            } else {
                $canonical = $url.'/journal';
            }
        }

        $related = Post::published()
            ->where('id', '!=', $post->id)
            ->where('category', $post->category)
            ->take(8)->get()
            ->reject(fn (Post $r) => (bool) preg_match('/-(variant-\d+|v\d+)$/', $r->slug))
            ->take(3);
        if ($related->count() < 3) {
            $related = Post::published()->where('id', '!=', $post->id)->take(8)->get()
                ->reject(fn (Post $r) => (bool) preg_match('/-(variant-\d+|v\d+)$/', $r->slug))
                ->take(3);
        }

        $head = [
            'title' => $post->title.' — '.$site['name'].' | Best AI Developer & Web Expert',
            'description' => $post->excerpt,
            'canonical' => $canonical,
            'og_type' => 'article',
            'og_image' => '/images/about-portrait.png',
            'robots' => ($isThin || $isVariant) ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'Article',
                        'headline' => $post->title,
                        'description' => $post->excerpt,
                        'datePublished' => $post->date?->toDateString(),
                        'dateModified' => $post->date?->toDateString(),
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
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Journal', 'item' => $url.'/journal'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $post->title, 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('journal.show', compact('site', 'post', 'head', 'related', 'isThin', 'isVariant', 'wordCount'));
    }
}
