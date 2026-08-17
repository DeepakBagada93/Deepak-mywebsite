<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'slug'             => 'web-development',
                'kicker'           => 'Service 01 — Websites',
                'title'            => 'Website Development',
                'tagline'          => 'Websites that load fast, rank on Google, and sell — built in Junagadh, Gujarat.',
                'meta_description' => 'Website developer in Junagadh, Gujarat. Laravel & PHP websites built to rank on Google and convert visitors into customers. Deepak Bagada — web developer, Gujarat, India.',
                'intro'            => 'Deepak Bagada builds websites in Junagadh, Gujarat that do not just look good — they load fast, rank on Google, and turn visitors into customers. Built on Laravel and PHP with editorial, conversion-first design, every site ships SEO-ready: clean structured data, fast pages, and copy that answers the questions your customers actually ask. Serving Junagadh, Gujarat, all of India, and remote clients worldwide.',
                'offerings'        => [
                    'Custom website development' => 'Laravel and PHP builds with clean, maintainable code — no page builders, no bloated plugins.',
                    'Redesign & performance'     => 'Slow, dated sites rebuilt for speed and Core Web Vitals — the fix that moves conversion rates.',
                    'SEO-ready builds'           => 'Structured data, canonical hygiene, meta and sitemaps wired in from day one — not bolted on later.',
                    'Landing & marketing pages'  => 'Focused pages engineered around one goal: turning a visitor into an enquiry.',
                    'Long-term care'             => 'Security updates, content edits and performance monitoring after launch.',
                ],
                'faq'              => [
                    'How much does a website cost in Junagadh?' => 'Most business websites from Deepak Bagada start around ₹25,000–₹60,000 depending on scope — a brochure site with a few pages is at the lower end, a custom Laravel build with an admin panel at the higher. You get a written quote before any work starts, with no hidden charges.',
                    'How long does it take to build a website?' => 'A typical business website is live in 2–4 weeks. Larger custom builds take longer. You will see progress in stages, and the site goes live only when you are happy with it.',
                    'Do you work with clients outside Junagadh?' => 'Yes. I work with clients across Gujarat, all over India, and remotely worldwide. Being based in Junagadh means local businesses get face-to-face meetings; everyone else gets clear communication and updates.',
                    'Why choose a Laravel website over a WordPress site?' => 'Laravel sites are faster, more secure and easier to extend than template-based WordPress builds. For a business that wants a site that ranks, loads instantly and can grow into an application, Laravel is the stronger foundation.',
                ],
                'service_type'     => 'WebDevelopment',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Remote'],
            ],
            [
                'slug'             => 'ai-development',
                'kicker'           => 'Service 02 — AI',
                'title'            => 'AI Development & AI Agents',
                'tagline'          => 'AI systems, agents and automation that do real work — from Junagadh, for businesses everywhere.',
                'meta_description' => 'AI developer in Junagadh, Gujarat. AI agents, multi-agent systems, RAG knowledge bases and workflow automation. Deepak Bagada — AI expert, Gujarat, India.',
                'intro'            => 'Deepak Bagada develops AI systems and AI agents in Junagadh, Gujarat — LLM integration, multi-agent automation, RAG knowledge bases and custom AI tools that do real work: content pipelines, customer support chatbots, document processing and back-office automation. The rule on every project: automation drafts, humans decide. Serving Junagadh, Gujarat, all of India, and remote clients.',
                'offerings'        => [
                    'AI agents & chatbots' => 'Support bots and assistants trained on your business — answering customers, booking enquiries, qualifying leads.',
                    'Multi-agent systems'  => 'Several AI agents working together on one workflow: research, drafting, review and publishing, end to end.',
                    'RAG knowledge bases'  => 'Your documents connected to an LLM, so answers are grounded in your facts — not hallucinated.',
                    'Workflow automation'  => 'The boring work automated: content pipelines, outreach drafts, reporting, meeting summaries, invoice chasing.',
                    'LLM integration'      => 'AI added to an existing website or product — API integration, prompting, evaluation and cost control.',
                ],
                'faq'              => [
                    'What can an AI agent actually do for my business?' => 'Practical examples: answer customer questions 24/7 from your own documents, draft content and emails in your voice, summarise meetings, qualify leads, and automate repetitive workflows. The goal is hours saved every week — not gimmicks.',
                    'Do I need fine-tuning or RAG?' => 'Usually RAG first. A knowledge base connected to a model gives accurate, up-to-date answers cheaply. Fine-tuning changes behaviour and tone, and is rarely the first step. Every project starts with the cheapest solution that solves the problem.',
                    'How long does an AI project take?' => 'A chatbot or automation workflow is typically live in 2–4 weeks. Larger multi-agent systems take longer. You will see a working prototype early, before the full build.',
                    'Do you work with businesses outside Gujarat?' => 'Yes. I work with clients across India and remotely worldwide. Local businesses in Junagadh and Gujarat get the same quality of work with the advantage of proximity.',
                ],
                'service_type'     => 'AIApplication',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Remote'],
            ],
            [
                'slug'             => 'seo-aeo',
                'kicker'           => 'Service 03 — Ranking',
                'title'            => 'SEO & AEO — Rank on Google, Get Cited by AI',
                'tagline'          => 'Search engine optimization and answer engine optimization from an SEO expert in Junagadh, Gujarat.',
                'meta_description' => 'SEO and AEO expert in Junagadh, Gujarat. Technical SEO, local SEO, content strategy and structured data that make Google rank you and AI engines cite you. Deepak Bagada.',
                'intro'            => "Deepak Bagada is an SEO and AEO expert in Junagadh, Gujarat. SEO gets you ranked on Google; AEO — answer engine optimization — gets you quoted by ChatGPT, Gemini, Perplexity and Google's AI Overviews. The work is technical SEO, local SEO, content strategy and structured data, and this website is the proof: it is built the way it advises its clients to build. Serving Junagadh, Gujarat, all of India, and remote.",
                'offerings'        => [
                    'Technical SEO'        => 'Structured data, canonical hygiene, sitemaps, page speed and crawl fixes — the foundation every ranking depends on.',
                    'Local SEO'            => 'Google Business Profile, consistent NAP, local citations and reviews so Junagadh and Gujarat customers find you first.',
                    'AEO — answer engines' => 'Content and schema engineered to be quoted by AI: FAQ blocks, answer-first copy, and clear, citable structure.',
                    'Content strategy'     => 'The right pages for the right keywords — mapping every customer question to a page that answers it completely.',
                    'Ranking audits'       => 'An honest report of where you stand, what is fixable, and what will move the needle first.',
                ],
                'faq'              => [
                    'What is AEO — answer engine optimization?' => 'AEO is the practice of structuring your content so AI answer engines — ChatGPT, Gemini, Perplexity, Google AI Overviews — can extract and cite your answers confidently. It is SEO for the AI era: clear answers, FAQ blocks, structured data, and real authorship.',
                    'How is AEO different from SEO?' => 'SEO optimizes for search results — the blue links. AEO optimizes for the answer itself: the quoted passage, the cited source. They overlap heavily — structured data, local grounding and good content help both — but AEO adds the layer that decides who AI engines cite.',
                    'How long until I rank?' => 'On-site fixes (this repo) show results in weeks; competitive keywords take 3–6 months of consistent content and links. Local keywords in Junagadh and Gujarat move faster than national ones — that is the unfair advantage of a local SEO expert.',
                    'Does SEO still matter when AI answers everything?' => 'Yes — more than ever. Search engines still send the buyers, and AI answers are now built on the same signals: structured data, authority, and clear content. Businesses optimized for both win twice.',
                ],
                'service_type'     => 'SearchEngineOptimization',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Remote'],
            ],
        ];

        Service::query()->delete();

        foreach ($services as $service) {
            Service::create($service);
        }

        $this->command?->info('Seeded '.count($services).' services.');
    }
}
