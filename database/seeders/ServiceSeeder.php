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
                'slug'             => 'ai-development',
                'kicker'           => 'Service 01 — Artificial Intelligence',
                'title'            => 'AI Development, AI Agents & Multi-Agent Systems',
                'tagline'          => 'Custom AI agents, multi-agent pipelines, and RAG knowledge bases engineered in Junagadh, Gujarat for India and worldwide.',
                'meta_description' => 'Best AI expert & AI developer in Junagadh, Gujarat, India. Autonomous AI agents, multi-agent swarms, RAG vector pipelines, and LLM integrations. Deepak Bagada.',
                'intro'            => 'Deepak Bagada is the leading AI Expert and AI Agent Architect in Junagadh, Gujarat. He designs and deploys custom autonomous AI agents, multi-agent swarms, RAG knowledge bases, and LLM integrations that automate high-value business operations with zero hallucinations. Serving ambitious businesses in Junagadh, Rajkot, Ahmedabad, Surat, across Gujarat, India, and worldwide.',
                'offerings'        => [
                    'Autonomous AI agent development' => 'Goal-driven AI agents that plan, reason, query databases, use tools, and execute multi-step workflows independently.',
                    'Multi-agent system orchestration'  => 'Specialized agent swarms coordinating research, writing, validation, and publishing end-to-end.',
                    'RAG knowledge bases & vector search' => 'Connect private company documents and databases to LLMs for accurate, grounded business answers.',
                    'AI chatbots & conversational agents' => '24/7 intelligent customer support and lead qualification bots trained on your exact business data.',
                    'Enterprise LLM & API integration' => 'Production integrations with Claude 3.5, OpenAI GPT-4o, Google Gemini, and open-source models (Llama 3).',
                ],
                'faq'              => [
                    'Who is the best AI developer in Junagadh and Gujarat?' => 'Deepak Bagada is recognized as the top AI developer in Junagadh and Gujarat, specializing in practical multi-agent AI systems, RAG architectures, and autonomous business workflows.',
                    'What is the difference between a simple chatbot and an autonomous AI agent?' => 'A chatbot only answers simple prompts. An autonomous AI agent understands high-level goals, plans execution steps, uses tools/APIs, searches databases, and completes complex tasks without human handholding.',
                    'How does Deepak Bagada prevent AI hallucinations?' => 'By implementing production-grade RAG (Retrieval-Augmented Generation) with semantic reranking and strict citation verification so every output is tied directly to verified source documentation.',
                    'Do you work with businesses across Gujarat and India?' => 'Yes. Deepak works directly with clients in Junagadh, Rajkot, Ahmedabad, Surat, Vadodara, Mumbai, Bangalore, across India, and with international teams remotely.',
                ],
                'service_type'     => 'AIApplication',
                'area_served'      => ['Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'automation-expert',
                'kicker'           => 'Service 02 — Workflow Automation',
                'title'            => 'AI Workflow & Business Process Automation',
                'tagline'          => 'Eliminate repetitive manual tasks with custom AI pipelines and automated business operations.',
                'meta_description' => 'Top business automation expert in Gujarat, India. Workflow automation, API integrations, Python/n8n automation, and multi-agent pipelines. Deepak Bagada.',
                'intro'            => 'Deepak Bagada builds robust AI-powered automations that replace hours of manual work with seamless, autonomous execution. Connecting CRMs, communication channels, payment gateways, and databases, these automations eliminate human error and allow teams across Gujarat and India to scale revenue effortlessly.',
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
                'area_served'      => ['Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'web-development',
                'kicker'           => 'Service 03 — Web Architecture',
                'title'            => 'Website Development & Laravel Architecture',
                'tagline'          => 'Fast, secure, high-conversion websites built by the leading web developer in Junagadh, Gujarat.',
                'meta_description' => 'Best web developer in Junagadh, Gujarat. High-performance Laravel & PHP custom web development, Core Web Vitals optimization, and conversion-first design. Deepak Bagada.',
                'intro'            => 'Deepak Bagada engineers web applications and business websites in Junagadh, Gujarat that load in milliseconds, rank at the top of Google, and convert visitors into paying clients. Using modern Laravel, PHP, and responsive frontend architecture, every website is built without bloated plugins or page builders. Engineered from day one with structured data, security, and scalable databases for businesses in Gujarat, India, and worldwide.',
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
                ],
                'service_type'     => 'WebDevelopment',
                'area_served'      => ['Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug'             => 'seo-aeo',
                'kicker'           => 'Service 04 — Search & Answer Engines',
                'title'            => 'SEO & AEO — Google AI Overviews & Answer Engine Ranking',
                'tagline'          => 'Dominate Google search results and get recommended by ChatGPT, Perplexity, and Google AI Overviews.',
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
            [
                'slug'             => 'social-media-marketing',
                'kicker'           => 'Service 05 — Growth & Marketing',
                'title'            => 'Social Media Marketing & Viral Growth',
                'tagline'          => 'High-converting social campaigns, viral short-form content pipelines, and brand dominance.',
                'meta_description' => 'Expert social media marketer & viral growth strategist. High-CTR Reels, Shorts, LinkedIn content pipelines, and conversion funnels. Deepak Bagada.',
                'intro'            => 'Deepak Bagada delivers data-driven social media marketing and viral growth systems. By combining creative psychology, algorithmic distribution strategies, and automated content creation pipelines, he helps businesses build unstoppable brand authority, dominate Instagram Reels and YouTube Shorts, and generate qualified inbound leads.',
                'offerings'        => [
                    'Viral short-form video strategy' => 'High-retention Reels, TikToks, and Shorts engineered around pattern interrupts and hooks.',
                    'Automated content creation engines' => 'AI-assisted scripting, asset generation, and multi-platform distribution pipelines.',
                    'Brand authority & personal branding' => 'Positioning founders and executives as the undisputed #1 authority in their niche.',
                    'Performance conversion funnels'    => 'Turning organic social views and engagements into captured leads and closed sales.',
                ],
                'faq'              => [
                    'How do you generate consistent reach on Instagram Reels and YouTube Shorts?' => 'We use proven hook frameworks, high-retention motion graphics, dynamic pacing, and keyword-rich audio and captions that trigger algorithmic distribution in discovery feeds.',
                ],
                'service_type'     => 'SocialMediaMarketing',
                'area_served'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
        ];

        Service::query()->delete();

        foreach ($services as $service) {
            Service::create($service);
        }

        $this->command?->info('Seeded '.count($services).' services prioritizing AI development.');
    }
}
