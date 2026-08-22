<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\SkillArchitecture;

class BlueprintController extends Controller
{
    public function index()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url . '/blueprints';

        $architectures = SkillArchitecture::with('skill.category')
            ->orderBy('sort_order', 'asc')
            ->get();

        $head = [
            'title'       => 'AI Architecture Blueprints & System Diagrams — ' . $site['name'],
            'description' => 'Interactive visual system diagrams and architecture blueprints for multi-agent loops, RAG vector pipelines, and autonomous AI systems.',
            'canonical'   => $canonical,
            'og_type'     => 'website',
            'og_image'    => '/images/about-portrait.png',
            'json_ld'     => json_encode([
                '@context' => 'https://schema.org',
                '@graph'   => [
                    [
                        '@type'        => 'CollectionPage',
                        'name'         => 'AI Architecture Blueprints & System Diagrams',
                        'description'  => 'Visual system diagrams and architectural blueprints for AI workflows by Deepak Bagada.',
                        'url'          => $canonical,
                    ],
                    [
                        '@type'           => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url . '/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blueprints', 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('blueprints.index', compact('site', 'architectures', 'head'));
    }

    public function show($id)
    {
        $blueprint = SkillArchitecture::with('skill.category')->findOrFail($id);

        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url . '/blueprints/' . $blueprint->id;

        $relatedBlueprints = SkillArchitecture::where('id', '!=', $blueprint->id)
            ->take(3)
            ->get();

        $head = [
            'title'       => $blueprint->title . ' — AI Blueprint | ' . $site['name'],
            'description' => $blueprint->description ?: 'Architecture blueprint and system diagram for ' . $blueprint->title,
            'canonical'   => $canonical,
            'og_type'     => 'article',
            'og_image'    => '/images/about-portrait.png',
            'json_ld'     => json_encode([
                '@context' => 'https://schema.org',
                '@graph'   => [
                    [
                        '@type'        => 'TechArticle',
                        'headline'     => $blueprint->title,
                        'description'  => $blueprint->description,
                        'url'          => $canonical,
                    ],
                    [
                        '@type'           => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url . '/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blueprints', 'item' => $url . '/blueprints'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $blueprint->title, 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('blueprints.show', compact('site', 'blueprint', 'relatedBlueprints', 'head'));
    }
}
