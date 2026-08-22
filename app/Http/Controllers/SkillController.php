<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/library';

        $categories = SkillCategory::orderBy('sort_order', 'asc')->get();
        $selectedCategorySlug = $request->query('category');

        $query = Skill::with('category')->published();

        if ($selectedCategorySlug) {
            $query->whereHas('category', function ($q) use ($selectedCategorySlug) {
                $q->where('slug', $selectedCategorySlug);
            });
        }

        $skills = $query->paginate(16)->withQueryString();

        $head = [
            'title' => 'Open-Source AI Skills & Agent Architectures — '.$site['name'],
            'description' => 'Browse production-tested open-source AI skills, agent workflows, Model Context Protocol (MCP) servers, and automation blueprints curated by Deepak Bagada.',
            'canonical' => $canonical,
            'og_type' => 'website',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'CollectionPage',
                        'name' => 'Open-Source AI Skills & Agent Blueprint Library',
                        'description' => 'Curated library of production AI skills, multi-agent frameworks, and automation pipelines by Deepak Bagada.',
                        'url' => $canonical,
                        'mainEntity' => [
                            '@type' => 'ItemList',
                            'itemListElement' => $skills->map(static fn (Skill $skill, int $index) => [
                                '@type' => 'ListItem',
                                'position' => $index + 1,
                                'name' => $skill->title,
                                'url' => $url.'/library/'.$skill->slug,
                            ])->values()->all(),
                        ],
                    ],
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Library', 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('library.index', compact('site', 'skills', 'categories', 'selectedCategorySlug', 'head'));
    }

    public function show(Skill $skill)
    {
        abort_unless($skill->status === 'published', 404);

        $skill->load(['category', 'architectures']);

        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url.'/library/'.$skill->slug;
        $portraitUrl = $url.'/images/about-portrait.png';

        $relatedSkills = Skill::where('id', '!=', $skill->id)
            ->where('category_id', $skill->category_id)
            ->published()
            ->take(3)
            ->get();

        if ($relatedSkills->isEmpty()) {
            $relatedSkills = Skill::where('id', '!=', $skill->id)
                ->published()
                ->take(3)
                ->get();
        }

        $head = [
            'title' => $skill->title.' — AI Skill Library | '.$site['name'],
            'description' => $skill->summary ?: 'Production AI skill specification and architecture for '.$skill->title,
            'canonical' => $canonical,
            'og_type' => 'article',
            'og_image' => '/images/about-portrait.png',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'TechArticle',
                        'headline' => $skill->title,
                        'description' => $skill->summary,
                        'datePublished' => $skill->published_at?->toDateString() ?: $skill->created_at->toDateString(),
                        'dateModified' => $skill->updated_at->toDateString(),
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
                        'url' => $canonical,
                    ],
                    [
                        '@type' => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url.'/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Library', 'item' => $url.'/library'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $skill->title, 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('library.show', compact('site', 'skill', 'relatedSkills', 'head'));
    }

    public function category(SkillCategory $category)
    {
        return redirect()->route('library.index', ['category' => $category->slug]);
    }
}
