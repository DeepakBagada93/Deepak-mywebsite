<?php

namespace App\Http\Controllers;

use App\Models\Post;

class PostController extends Controller
{
    public function show(Post $post)
    {
        abort_unless($post->date, 404);

        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url . '/journal/' . $post->slug;
        $portraitUrl = $url . '/images/about-portrait.png';

        $head = [
            'title'       => $post->title . ' — ' . $site['name'] . ' | Best Web Developer & AI Expert',
            'description' => $post->excerpt,
            'canonical'   => $canonical,
            'og_type'     => 'article',
            'og_image'    => '/images/about-portrait.png',
            'json_ld'     => json_encode([
                '@context' => 'https://schema.org',
                '@graph'   => [
                    [
                        '@type'            => 'Article',
                        'headline'         => $post->title,
                        'description'      => $post->excerpt,
                        'datePublished'    => $post->date?->toDateString(),
                        'dateModified'     => $post->date?->toDateString(),
                        'author'           => [
                            '@type'    => 'Person',
                            '@id'      => $url . '/#person',
                            'name'     => $site['name'],
                            'jobTitle' => 'Best Web Developer, AI Expert & Automation Specialist',
                            'url'      => $url . '/',
                            'image'    => $portraitUrl,
                            'sameAs'   => array_values($site['socials']),
                        ],
                        'publisher'        => [
                            '@type'    => 'Person',
                            '@id'      => $url . '/#person',
                            'name'     => $site['name'],
                            'url'      => $url . '/',
                            'image'    => $portraitUrl,
                        ],
                        'mainEntityOfPage' => $canonical,
                        'image'            => [
                            '@type'      => 'ImageObject',
                            'url'        => $portraitUrl,
                            'contentUrl' => $portraitUrl,
                            'width'      => 1122,
                            'height'     => 1402,
                        ],
                        'url'              => $canonical,
                    ],
                    [
                        '@type'           => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url . '/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Journal', 'item' => $url . '/#journal'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $post->title, 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('journal.show', compact('site', 'post', 'head'));
    }
}
