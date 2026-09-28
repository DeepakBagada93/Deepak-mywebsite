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
                'summary' => 'AI content creation studio — from raw idea to published post, in your own voice. Voice-learned drafts, human approval gates, one-click publishing.',
                'description' => 'Curro started from my own frustration: generic AI writing tools flattened every founder voice into the same bland corporate tone, and my journal drafts took four hours each. I built Curro as an AI content studio that learns writing style from the user\'s own past work — vocabulary, sentence rhythm, formatting habits — then drafts articles, scripts, and social posts that sound like them on a good day, not like a chatbot. The pipeline runs idea → outline → draft → human approval gate → publish, with plagiarism and fact-flag checks before anything goes live. Under the hood it is a Laravel application with queued generation jobs, versioned drafts, and per-user style profiles stored as structured preferences rather than vague system prompts. I dogfood it daily: this portfolio\'s journal workflow — research briefs, audits, scheduled publishing — grew out of patterns I first prototyped in Curro. Measured on my own writing, a finished 1,300-word article went from roughly four hours to under 25 minutes of active effort, with quality gates catching thin or duplicated sections before publish. The roadmap I am working through now is multi-modal input (voice notes to drafts), team workspaces with shared voice profiles, and scheduled multi-platform distribution. If you publish expertise for a living, Curro is the compounding asset I wish I had bought years ago, so I built it instead. Stack: Laravel 13, queued jobs, Postgres with pgvector for style matching, Valkey caching. Timeline from first commit to paying users was eleven weeks of evenings alongside client work.',
                'image' => '/images/projects/project-1.png',
                'tags' => 'AI, Content, SaaS',
                'link' => 'https://curro.in/',
                'featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'SaaS Next',
                'slug' => 'saasnext',
                'summary' => 'Product, marketing, and content engine on Laravel — the stack that tripled organic traffic in six months and powers this portfolio.',
                'description' => 'SaaS Next is my main product and marketing site: product pages, pricing, launch campaigns, and a content engine, all on one Laravel codebase with no page builders and no plugin sprawl. The constraint I set was markingspeed as a feature — every page ships server-rendered HTML, content-hashed assets cached for a year, images sized and lazy-loaded, and Article plus FAQPage JSON-LD on everything publishable. The content engine is the interesting half: topic research, outline generation with search-intent checks, draft review against a 20-point audit (word count, internal links, FAQ completeness, E-E-A-T signals), and scheduled publishing with XML sitemap refreshes. Running that loop consistently tripled organic traffic in six months, and the same engine now drives the journal on this portfolio. Hosting is a single 4-core VPS with PgBouncer-pooled Postgres and Valkey caching, holding P95 response under 50ms at a few hundred requests per minute for roughly ₹5,000 a month all-in. What I would do differently: I added the measurement ledger in month three instead of day one, so the first quarter of growth is reconstructed from analytics rather than logged. Everything since is row-level provable, which is also why I can quote the numbers above without hedging. Stack: Laravel 13, Blade, Postgres, Valkey, single VPS. Typical client rebuilds on this stack take 2-4 weeks; content engines compound for 6-12 months before traffic triples.',
                'image' => '/images/projects/project-2.png',
                'tags' => 'Web, Laravel, SaaS',
                'link' => 'https://saasnext.in/',
                'featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'DailyAIWorld',
                'slug' => 'dailyaiworld',
                'summary' => 'A daily directory of AI tools and workflows — discover, compare, and learn one useful tool at a time, without the hype.',
                'description' => 'DailyAIWorld is a curated directory of AI tools and practical workflows, built for people who want the useful side of AI without doomscrolling launch announcements. The core loop is deliberately simple: one tool per day, each with what it does, who it suits, honest pricing, and a workflow showing it inside a real stack — plus comparisons and longer guides for the tools that survive a month of actual use. Curation is the product: I test tools against scripted tasks before listing, re-test quarterly, and delist what rots, so the directory stays a short list of working answers instead of a phone book. Technically it is a Laravel application with a structured tool database (categories, pricing models, platform tags), daily-pick scheduling, sitemap-driven SEO, and newsletter distribution for subscribers who prefer one email over ten tabs. The editorial standard I hold is that every listing must save a reader at least thirty minutes of evaluation or it does not ship. Growth comes from compounding usefulness — comparison pages that rank, a daily habit for subscribers, and zero paid acquisition so far. Stack: Laravel 13, structured MySQL dataset, scheduled picks, newsletter pipeline. A directory like this ships in 3-5 weeks; the curation habit is the ongoing cost and the moat. The next iteration adds user-submitted workflows with moderation and API access to the structured dataset for researchers and builders.',
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
