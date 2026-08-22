<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Curro',
                'slug' => 'curro',
                'summary' => 'AI content creation studio — from raw idea to published post, in your own voice.',
                'description' => 'Curro turns rough notes, recordings and prompts into polished articles, scripts and social posts. Its writing engine learns your tone from your own past work — so the output sounds like you, just faster and with fewer typos. Idea to publish in minutes, not days.',
                'image' => '/images/projects/project-1.png',
                'tags' => 'AI, Content, SaaS',
                'link' => 'https://curro.in/',
                'featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'SaaS Next',
                'slug' => 'saasnext',
                'summary' => 'The main website — product, marketing and everything in between, built on Laravel.',
                'description' => 'The home of SaaS Next: product pages, pricing, launch campaigns and a content engine that tripled organic traffic in six months. Editorial design, Laravel under the hood — the same stack this portfolio runs on.',
                'image' => '/images/projects/project-2.png',
                'tags' => 'Web, Laravel, SaaS',
                'link' => 'https://saasnext.in/',
                'featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'DailyAIWorld',
                'slug' => 'dailyaiworld',
                'summary' => 'A daily directory of AI tools and workflows — discover, compare and learn, one tool at a time.',
                'description' => 'DailyAIWorld curates AI tools and practical workflows into a browsable directory with guides, comparisons and daily picks. Built for people who want the useful side of AI without the hype.',
                'image' => '/images/projects/project-3.png',
                'tags' => 'AI, Directory, Content',
                'link' => 'https://dailyaiworld.com/',
                'featured' => false,
                'sort_order' => 3,
            ],
        ];

        Project::query()->delete();

        foreach ($projects as $project) {
            Project::create($project);
        }

        $this->command?->info('Seeded '.count($projects).' projects.');
    }
}
