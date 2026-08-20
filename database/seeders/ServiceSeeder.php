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
                'kicker'           => 'Service 01 — Web Architecture',
                'title'            => 'Website Development & Laravel Architecture',
                'tagline'          => 'Fast, secure, high-conversion websites built by the leading web developer in Junagadh, Gujarat.',
                'meta_description' => 'Best web developer in Junagadh, Gujarat. High-performance Laravel & PHP custom web development, Core Web Vitals optimization, and conversion-first design. Deepak Bagada.',
                'intro'            => 'Deepak Bagada engineers web applications and business websites that load in milliseconds, rank at the top of Google, and convert visitors into paying clients. Using modern Laravel, PHP, and responsive frontend architecture, every website is built without bloated plugins or page builders. Engineered from day one with structured data, security, and scalable databases for businesses in Junagadh, Gujarat, India, and worldwide.',
                'offerings'        => [
                    'Custom Laravel web applications' => 'Clean, maintainable, and scalable code tailored to exact business logic.',
                    'High-speed website redesigns'     => 'Eliminate slow load times and pass Google Core Web Vitals with sub-second performance.',
                    'E-commerce & custom portals'     => 'Secure, robust payment and member portals built to handle high transactional volume.',
                    'AEO & SEO-first development'      => 'Semantic HTML5, structured JSON-LD schema, and automated sitemaps built-in from the ground up.',
                    'Ongoing maintenance & SLA'        => 'Proactive security patching, performance monitoring, and continuous technical enhancements.',
                ],
                'faq'              => [
                    'Why choose Deepak Bagada over standard web design agencies?' => 'You work directly with an expert full-stack developer who understands both clean code and revenue-driving marketing—no account managers, no outsourced quality, and no bloated WordPress templates.',
                    'How long does a custom web development project take?' => 'Most custom business websites launch within 2–4 weeks. Complex web applications or custom portals take 4–8 weeks with milestone reviews throughout.',
                    'Do you optimize websites for mobile devices and Core Web Vitals?' => 'Every single build is tested across 15+ screen sizes and strictly audited for 95+ Google PageSpeed and Core Web Vitals scores.',
                ],
                'service_type'     => 'WebDevelopment',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'ai-development',
                'kicker'           => 'Service 02 — Artificial Intelligence',
                'title'            => 'AI Development & Autonomous Agents',
                'tagline'          => 'Custom AI agents, multi-agent pipelines, and RAG knowledge bases built for real business ROI.',
                'meta_description' => 'Leading AI expert & AI agent developer in Junagadh, Gujarat. Autonomous multi-agent systems, RAG vector pipelines, and LLM integrations. Deepak Bagada.',
                'intro'            => 'Deepak Bagada develops custom AI systems and autonomous agents that transform how businesses operate. From multi-agent orchestration pipelines that draft, audit, and publish content autonomously to RAG knowledge bases that answer customer queries without hallucination, every system is designed for measurable ROI and zero operational friction.',
                'offerings'        => [
                    'Autonomous AI agents'        => 'Intelligent agents that execute multi-step business workflows independently.',
                    'Multi-agent orchestration'    => 'Coordinated agent swarms handling research, drafting, validation, and execution.',
                    'RAG knowledge bases'          => 'Connect private business documentation to LLMs for accurate, grounded AI answers.',
                    'AI chatbots & assistants'     => '24/7 intelligent customer support and lead qualification bots tailored to your brand.',
                    'Enterprise LLM integrations' => 'Seamless API integrations with Claude, OpenAI, Gemini, and local open-source models.',
                ],
                'faq'              => [
                    'What is the difference between a simple chatbot and an autonomous AI agent?' => 'A chatbot merely responds to single prompts. An autonomous AI agent understands goals, plans steps, queries databases, uses tools, and executes complex tasks across multiple systems without human babysitting.',
                    'How do you prevent AI hallucinations in client projects?' => 'We implement strict RAG (Retrieval-Augmented Generation) architectures with vector embeddings, semantic rerankers, and citation verification so every output is tied directly to verified source data.',
                    'Can AI agents connect to our existing software and database?' => 'Yes. AI agents are built with secure REST APIs, webhooks, and database connectors to integrate directly into your existing CRM, ERP, or custom database.',
                ],
                'service_type'     => 'AIApplication',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'social-media-marketing',
                'kicker'           => 'Service 03 — Growth & Marketing',
                'title'            => 'Social Media Marketing & Viral Growth',
                'tagline'          => 'High-converting social campaigns, viral short-form content pipelines, and brand dominance.',
                'meta_description' => 'Expert social media marketer & viral growth strategist. High-CTR Reels, Shorts, LinkedIn content pipelines, and conversion funnels. Deepak Bagada.',
                'intro'            => 'Deepak Bagada delivers data-driven social media marketing and viral growth systems. By combining creative psychology, algorithmic distribution strategies, and automated content creation pipelines, he helps businesses build unstoppable brand authority, dominate Instagram Reels and YouTube Shorts, and generate qualified inbound leads.',
                'offerings'        => [
                    'Viral short-form video strategy' => 'High-retention Reels, TikToks, and Shorts engineered around pattern interrupts and hooks.',
                    'Automated content creation engines' => 'AI-assisted scripting, asset generation, and multi-platform distribution pipelines.',
                    'Brand authority & personal branding' => 'Positioning founders and executives as the undisputed #1 authority in their niche.',
                    'Performance conversion funnels'    => 'Turning organic social views and engagements into captured leads and closed sales.',
                    'Paid social advertising'           => 'Hyper-targeted Meta and LinkedIn ad campaigns with optimized return on ad spend (ROAS).',
                ],
                'faq'              => [
                    'How do you generate consistent reach on Instagram Reels and YouTube Shorts?' => 'We use proven hook frameworks, high-retention motion graphics, dynamic pacing, and keyword-rich audio and captions that trigger algorithmic distribution in discovery feeds.',
                    'What platforms do you specialize in?' => 'Instagram, YouTube Shorts, LinkedIn, X (Twitter), and Facebook—tailoring the format and tone specifically to where your target decision-makers spend attention.',
                ],
                'service_type'     => 'SocialMediaMarketing',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'automation-expert',
                'kicker'           => 'Service 04 — Workflow Automation',
                'title'            => 'Business Process & Workflow Automation',
                'tagline'          => 'Eliminate repetitive manual tasks with custom API integrations and automated operations.',
                'meta_description' => 'Top business automation expert in Gujarat, India. Workflow automation, API integrations, Python/n8n automation, and multi-agent pipelines. Deepak Bagada.',
                'intro'            => 'Deepak Bagada builds robust end-to-end automations that replace hours of manual work with seamless, automatic execution. Connecting CRMs, communication tools, payment gateways, and databases, these automations eliminate human error and free your team to focus exclusively on high-leverage growth.',
                'offerings'        => [
                    'Lead capture & CRM automation'     => 'Instant lead enrichment, qualification, notifications, and automated follow-ups.',
                    'Autonomous publishing pipelines'   => 'Automate research, formatting, dual-database syncing, and live distribution.',
                    'Data extraction & document parsing' => 'Extract unstructured data from PDFs, emails, and receipts directly into your database.',
                    'Custom API & webhook integrations'  => 'Bridge disconnected SaaS tools and legacy systems into one unified workflow.',
                    'Custom Python & n8n automations'   => 'Self-hosted, cost-effective automation architecture without expensive recurring platform fees.',
                ],
                'faq'              => [
                    'How much time can workflow automation save my business?' => 'Most clients reclaim between 20 to 50 hours of manual labor per week within the first month of deploying custom automations.',
                    'Is workflow automation reliable?' => 'Yes. Automations are built with retry mechanisms, error alerting, fallback routines, and complete activity logging to ensure 99.9% reliability.',
                ],
                'service_type'     => 'AutomationService',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'seo-aeo',
                'kicker'           => 'Service 05 — Search & Answer Engines',
                'title'            => 'SEO & AEO — Google AI Overviews & Answer Engine Ranking',
                'tagline'          => 'Dominate Google search results and get recommended by ChatGPT, Perplexity, and AI Overviews.',
                'meta_description' => 'SEO & AEO expert in Junagadh, Gujarat. Rank on Google search and get cited in Google AI Overviews, ChatGPT, Gemini, and Perplexity. Deepak Bagada.',
                'intro'            => 'Deepak Bagada is a pioneer in SEO and AEO (Answer Engine Optimization). Traditional SEO ranks you in the Google search results; AEO engineers your website content, entity schema, and authority so that modern AI models cite and recommend your business as the definitive answer. Serving businesses in Junagadh, Gujarat, and globally.',
                'offerings'        => [
                    'Google AI Overview (SGE) optimization' => 'Structure content to trigger direct quotation and author attribution in AI summaries.',
                    'Entity & JSON-LD knowledge graph schema' => 'Comprehensive Person, Organization, ImageObject, and FAQ structured data.',
                    'Technical SEO & Core Web Vitals'        => 'Flawless site architecture, canonical hygiene, XML sitemaps, and sub-second speed.',
                    'Local SEO for Gujarat & India'          => 'Targeted local entity signals, Google Business optimization, and regional citation building.',
                    'Authority content strategy'             => 'High-CTR topical cluster architecture mapped to commercial user intent.',
                ],
                'faq'              => [
                    'What is AEO (Answer Engine Optimization)?' => 'AEO is the practice of optimizing content so AI answer engines like Google AI Overviews, Perplexity, Claude, and ChatGPT can easily extract, trust, and quote your website as the primary source of truth.',
                    'How soon can I see results from SEO and AEO optimization?' => 'Technical and schema fixes are indexed within days; noticeable ranking improvements and AI Overview citations typically occur within 3–8 weeks.',
                ],
                'service_type'     => 'SearchEngineOptimization',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
        ];

        Service::query()->delete();

        foreach ($services as $service) {
            Service::create($service);
        }

        $this->command?->info('Seeded '.count($services).' services.');
    }
}
