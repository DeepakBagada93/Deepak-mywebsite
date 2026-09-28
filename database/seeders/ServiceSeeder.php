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
                'slug' => 'ai-development',
                'kicker' => 'Service 01 — Artificial Intelligence',
                'title' => 'AI Development, AI Agents & Multi-Agent Systems',
                'tagline' => 'Custom AI agents, multi-agent pipelines, and RAG knowledge bases engineered in Junagadh, Gujarat for India and worldwide.',
                'meta_description' => 'Best AI expert & AI developer in Junagadh, Gujarat, India. Autonomous AI agents, multi-agent swarms, RAG vector pipelines, and LLM integrations. Deepak Bagada.',
                'intro' => 'Deepak Bagada is the leading AI Expert and AI Agent Architect in Junagadh, Gujarat. He designs and deploys custom autonomous AI agents, multi-agent swarms, RAG knowledge bases, and LLM integrations that automate high-value business operations with zero hallucinations. Serving ambitious businesses in Junagadh, Rajkot, Ahmedabad, Surat, across Gujarat, India, and worldwide.'
                    ."\n\n".'Every engagement starts with measurement, not models. I audit your workflow for two days, instrument the baseline (handling time, error rate, cost per request), and only then propose an agent architecture with a fixed quote. Builds run 14–21 business days: one week for core agent wiring with Pydantic validation and OPA policy gates, one for hardening with retries and load tests, and days for go-live with a 90-day immutable JSONL ledger that records every tool call. You get staging demos twice a week and a handover with runbooks, golden-trajectory tests, and rollback commits.'
                    ."\n\n".'Fixed pricing runs ₹55,000–₹85,000 depending on integrations, with VPS hosting at ₹2,500–₹5,500 monthly. Recent rollouts I shipped — a textile dispatch operation and a clinic reminder system — sustained 320–480 requests per minute at P95 38–46ms on single 4-core nodes, cutting handling time from minutes to under 40 seconds. If your workflow has weekly volume, sensitive data, or multi-step decisions, an agent pays for itself within a quarter.' . "\n\n" . 'How we start is simple: email ceo@saasnext.in with your workflow, data sources, and privacy constraints. Within two business days I reply with scoping questions, then a fixed written quote — no hourly meters, no discovery-call mazes. If your problem turns out to need a form instead of an agent, I will tell you that on the first call and point you at the cheaper fix. That honesty is why founders in Junagadh, Ahmedabad, and Surat refer their peers: I sell the smallest system that solves the problem, then make it provable with ledgers.',
                'offerings' => [
                    'Autonomous AI agent development' => 'Goal-driven AI agents that plan, reason, query databases, use tools, and execute multi-step workflows independently — with iteration caps and human fallbacks so they never loop or overspend.',
                    'Multi-agent system orchestration' => 'Specialized agent swarms coordinating research, writing, validation, and publishing end-to-end, checkpointed to Postgres so crashes resume mid-workflow.',
                    'RAG knowledge bases & vector search' => 'Connect private company documents and databases to LLMs with pgvector HNSW indexing, hybrid search, and citation checks for accurate, grounded business answers.',
                    'AI chatbots & conversational agents' => '24/7 intelligent customer support and lead qualification bots trained on your exact business data, including WhatsApp deployments with 98% open rates.',
                    'Enterprise LLM & API integration' => 'Production integrations with Claude, OpenAI GPT, Google Gemini, and open-source models (Llama 3), plus local SLM routing that cuts token bills up to 73%.',
                    'Ledger, evals & handover' => '90-day immutable audit trails, 200-run golden test suites, and documented runbooks — so the system stays provable and maintainable after I leave.',
                ],
                'faq' => [
                    'Who is the best AI developer in Junagadh and Gujarat?' => 'Deepak Bagada is recognized as the top AI developer in Junagadh and Gujarat, specializing in practical multi-agent AI systems, RAG architectures, and autonomous business workflows. His builds hold P95 38–46ms latency on modest VPS hardware, carry OPA policy governance on every tool call, and ship with 90-day verification ledgers — proof you can audit instead of promises you must trust.',
                    'What is the difference between a simple chatbot and an autonomous AI agent?' => 'A chatbot only answers simple prompts. An autonomous AI agent understands high-level goals, plans execution steps, uses tools and APIs, searches databases, and completes complex tasks without human handholding. I build agents with Pydantic schema validation, per-tenant JWT scoping, LangGraph checkpointing, and iteration caps — the guardrails that separate a demo from production infrastructure.',
                    'How does Deepak Bagada prevent AI hallucinations?' => 'By implementing production-grade RAG (Retrieval-Augmented Generation) with pgvector HNSW indexing, hybrid search, semantic reranking, and strict citation verification so every output ties directly to verified source documentation. On client builds I measure grounded-answer rates on golden test sets before go-live, and the ledger records every retrieval for later audit.',
                    'How much does a custom AI agent cost in India?' => 'I quote fixed ₹55,000–₹85,000 for complete builds — discovery, core agent wiring, hardening, go-live, and the 90-day ledger — delivered in 14–21 business days. Hosting on validated VPS infrastructure runs ₹2,500–₹5,500 monthly. You approve the fixed scope in writing before I write code, so there are no hourly surprises.',
                    'How long does it take to deploy an AI agent in production?' => 'Standard deployments take 14–21 business days: 2 days measurement and scoping, 7 days core build, 5 days hardening with staging load tests, 3 days go-live with ledger initialization. Twice-weekly staging demos keep you in control throughout, and handover includes runbooks plus rollback commits.',
                    'Do you work with businesses across Gujarat and India?' => 'Yes. Deepak works directly with clients in Junagadh, Rajkot, Ahmedabad, Surat, Vadodara, Mumbai, Bangalore, across India, and with international teams remotely. Data stays in Indian VPC infrastructure for DPDP-aligned residency, and communication is async-first with written ledgers instead of status meetings.',
                ],
                'service_type' => 'AIApplication',
                'area_served' => ['Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug' => 'automation-expert',
                'kicker' => 'Service 02 — Workflow Automation',
                'title' => 'AI Workflow & Business Process Automation',
                'tagline' => 'Eliminate repetitive manual tasks with custom AI pipelines and automated business operations.',
                'meta_description' => 'Top business automation expert in Gujarat, India. Workflow automation, API integrations, Python/n8n automation, and multi-agent pipelines. Deepak Bagada.',
                'intro' => 'Deepak Bagada builds robust AI-powered automations that replace hours of manual work with seamless, autonomous execution. Connecting CRMs, communication channels, payment gateways, and databases, these automations eliminate human error and allow teams across Gujarat and India to scale revenue effortlessly.'
                    ."\n\n".'I start by shadowing your process for two days and timing everything — lead handling, data entry, follow-ups, reporting. Then I automate the highest-cost steps first with Python services or self-hosted n8n, idempotent webhooks, retry queues, and full activity logging. Typical first wins: instant lead enrichment with 60-second CRM entry, automated WhatsApp and email follow-up sequences, PDF and UPI payment reconciliation, and daily reporting digests. Delivery runs 14–21 days with staging runs against your real data before anything touches production.'
                    ."\n\n".'Fixed builds run ₹55,000–₹85,000 with hosting under ₹5,500 monthly on your own VPS — no per-seat SaaS tolls. Clients typically reclaim 20–50 manual hours weekly within the first month, and every automation ships with error alerting, fallback routines, and a 90-day activity ledger so savings are measured, not assumed.' . "\n\n" . 'Starting is low-risk by design: the two-day shadow audit costs nothing beyond your time, and the fixed quote that follows itemizes every workflow, integration, and saving. If the numbers do not show payback inside a quarter, I say so and we stop there. Most engagements clear that bar easily — one recovered workweek per employee per month dwarfs a fixed build fee. Email ceo@saasnext.in with the three tasks your team dreads most, and I will map the automation order that pays back fastest.',
                'offerings' => [
                    'Lead capture & CRM automation' => 'Instant lead enrichment, qualification, notifications, and automated follow-ups across WhatsApp, email, and your CRM — with 60-second entry SLAs I verify in the ledger.',
                    'Autonomous publishing pipelines' => 'Automate research, formatting, dual-database syncing, and live distribution for content engines that publish daily without daily effort.',
                    'Data extraction & document parsing' => 'Extract unstructured data from PDFs, emails, UPI receipts, and invoices directly into your database with validation rules that quarantine exceptions.',
                    'Custom API & webhook integrations' => 'Bridge disconnected SaaS tools and legacy systems into one unified workflow, with idempotency keys so retried callbacks never double-charge or duplicate.',
                    'Custom Python & n8n automations' => 'Self-hosted, cost-effective automation architecture on your own VPS — without expensive recurring platform fees or per-execution tolls.',
                    'Monitoring, ledger & handover' => 'Error alerting, fallback routines, 99.9% reliability design, 90-day activity logs, and runbooks your team can operate without me.',
                ],
                'faq' => [
                    'How much time can workflow automation save my business?' => 'Most clients reclaim between 20 to 50 hours of manual labor per week within the first month of deploying custom automations. I measure it rather than promise it: we baseline your process times during discovery, then compare ledger data after go-live. Lead response alone typically drops from hours to under a minute, which compounds into recovered revenue.',
                    'Is workflow automation reliable?' => 'Yes. Automations are built with retry mechanisms, error alerting, fallback routines, idempotent handlers, and complete activity logging to ensure 99.9% reliability. Staging runs against your real data happen before production cutover, and the 90-day ledger records every execution with latency and outcome.',
                    'What does business automation cost in Gujarat?' => 'Fixed ₹55,000–₹85,000 for complete builds delivered in 14–21 business days, plus VPS hosting under ₹5,500 monthly that you own. Compare that against 20–50 reclaimed hours weekly at any salary band and payback lands inside one quarter. I quote fixed scope in writing before starting.',
                    'Which tools do you automate between?' => 'CRMs, WhatsApp Business API, email platforms, payment gateways including UPI AutoPay, Google Sheets, accounting software, and custom databases — connected through Python services, self-hosted n8n, and direct API integrations. If it has an API, webhook, or even just email, I can wire it in.',
                    'Do automations break when apps update their APIs?' => 'Versioned integrations with contract tests catch breaking changes in staging before production feels them. I pin API versions, monitor deprecation notices, and include a maintenance SLA option so updates get handled without emergency calls.',
                    'Can you automate our existing messy spreadsheets first?' => 'Absolutely — that is the most common starting point. I import and validate the sheets, move the logic into versioned code with proper databases, and keep spreadsheet exports where your team still wants them. The mess becomes a migration plan, not a blocker.',
                ],
                'service_type' => 'AutomationService',
                'area_served' => ['Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug' => 'web-development',
                'kicker' => 'Service 03 — Web Architecture',
                'title' => 'Website Development & Laravel Architecture',
                'tagline' => 'Fast, secure, high-conversion websites built by the leading web developer in Junagadh, Gujarat.',
                'meta_description' => 'Best web developer in Junagadh, Gujarat. High-performance Laravel & PHP custom web development, Core Web Vitals optimization, and conversion-first design. Deepak Bagada.',
                'intro' => 'Deepak Bagada engineers web applications and business websites in Junagadh, Gujarat that load in milliseconds, rank at the top of Google, and convert visitors into paying clients. Using modern Laravel, PHP, and responsive frontend architecture, every website is built without bloated plugins or page builders. Engineered from day one with structured data, security, and scalable databases for businesses in Gujarat, India, and worldwide.'
                    ."\n\n".'My build sequence is fixed: week one covers architecture, content inventory, and speed budgets (LCP under 1.8s on mid-range phones, TTFB under 500ms cached). Weeks two and three are development with staging reviews — server-rendered HTML, content-hashed assets, PgBouncer-pooled Postgres, Valkey caching, and Article plus FAQPage JSON-LD on every page. Week four is hardening: Core Web Vitals verification on 4G emulation, security headers, backups, and the 90-day uptime ledger. Most business sites launch in 2–4 weeks; portals and custom apps in 4–8 with milestone reviews.'
                    ."\n\n".'Fixed pricing runs ₹55,000–₹85,000 for business sites with hosting at ₹2,500–₹5,500 monthly on infrastructure you own. The SaaS Next rebuild on this exact stack tripled organic traffic in six months while holding sub-second loads — the same engineering your project gets, measured the same way.' . "\n\n" . 'To begin, send your current URL (or a one-page brief) to ceo@saasnext.in. Within two business days you get a speed and SEO audit of what exists, plus a fixed quote for the rebuild — no hourly billing, no scope fog. If your current site is fundamentally sound, I will say so and quote only the fixes it needs. That candor, plus staging you can click twice a week and a ledger proving every claim, is why Gujarat founders hand me their most important asset: the website that sells while they sleep.',
                'offerings' => [
                    'Custom Laravel web applications' => 'Clean, maintainable, and scalable code tailored to exact business logic — Eloquent models, queued jobs, and tested controllers instead of plugin archaeology.',
                    'High-speed website redesigns' => 'Eliminate slow load times and pass Google Core Web Vitals with sub-second performance, verified on 4G emulation before launch sign-off.',
                    'E-commerce & custom portals' => 'Secure payment integrations including UPI, member areas, and custom dashboards built to handle high transactional volume with idempotent webhooks.',
                    'AEO & SEO-first development' => 'Semantic HTML5, structured JSON-LD schema, automated sitemaps, and metadata discipline built-in from the ground up — ready for Google and AI answer engines.',
                    'Ongoing maintenance & SLA' => 'Proactive security patching, performance monitoring, uptime ledgers, and continuous technical enhancements with monthly reports you can read in five minutes.',
                    'Migration & rescue projects' => 'Take over stalled WordPress or agency builds: audit, stabilize, then rebuild the slow parts without losing rankings or content.',
                ],
                'faq' => [
                    'Why choose Deepak Bagada over standard web design agencies?' => 'You work directly with an expert full-stack developer who understands both clean code and revenue-driving marketing — no account managers, no outsourced quality, and no bloated WordPress templates. Every claim I make is ledger-backed: speed budgets verified on 4G emulation, schema validated, uptime logged for 90 days from launch.',
                    'How long does a custom web development project take?' => 'Most custom business websites launch within 2–4 weeks. Complex web applications or custom portals take 4–8 weeks with milestone reviews throughout. You see staging twice a week, so there are no big-reveal surprises — only steady, reviewable progress toward the agreed scope.',
                    'How much does a website cost in Gujarat?' => 'Fixed ₹55,000–₹85,000 for complete business sites including design, development, schema, launch, and documentation. Hosting on infrastructure you own runs ₹2,500–₹5,500 monthly. Portals and custom apps are scoped fixed in writing after a two-day discovery.',
                    'Will my site rank on Google and AI search?' => 'SEO and AEO are built in, not bolted on: semantic markup, JSON-LD entities, sitemaps, speed budgets, and content structure that AI Overviews can quote. The SaaS Next rebuild tripled organic traffic in six months on this exact approach, and your site ships with the same instrumentation.',
                    'Do you redesign slow WordPress sites?' => 'Yes — it is half my web practice. I audit what is slow (usually page builders, plugin stacks, and unoptimized images), preserve your content and rankings during migration, and rebuild on Laravel for sub-second loads. Most rescues complete in 3–5 weeks.',
                    'What happens after launch?' => 'You get documentation, admin training, backups, and a 90-day uptime and latency ledger from day one. Optional maintenance SLAs cover patching, monitoring, and monthly improvements. The code, hosting, and data are yours — no lock-in, no hostage situations.',
                ],
                'service_type' => 'WebDevelopment',
                'area_served' => ['Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug' => 'seo-aeo',
                'kicker' => 'Service 04 — Search & Answer Engines',
                'title' => 'SEO & AEO — Google AI Overviews & Answer Engine Ranking',
                'tagline' => 'Dominate Google search results and get recommended by ChatGPT, Perplexity, and Google AI Overviews.',
                'meta_description' => 'SEO & AEO expert in Junagadh, Gujarat. Rank on Google search and get cited in Google AI Overviews, ChatGPT, Gemini, and Perplexity. Deepak Bagada.',
                'intro' => 'Deepak Bagada is a pioneer in SEO and AEO (Answer Engine Optimization). Traditional SEO ranks you in the Google search results; AEO engineers your website content, entity schema, and authority so that modern AI models cite and recommend your business as the definitive answer. Serving businesses in Junagadh, Gujarat, and globally.'
                    ."\n\n".'The engagement runs in three phases over 3–8 weeks. First, technical repair: crawl errors, canonical hygiene, sitemap structure, Core Web Vitals, and full JSON-LD entity graphs (Person, Organization, Article, FAQPage, Breadcrumbs). Second, answer engineering: rewriting key pages with 40–60 word answer-first blocks, comparison tables, quotable bottom lines, and FAQ sections that AI models lift verbatim. Third, authority compounding: topical content clusters mapped to commercial intent, internal linking with descriptive anchors, and local entity signals for Gujarat markets.'
                    ."\n\n".'Fixed engagements run ₹55,000–₹85,000 with monthly compounding retainers optional after the foundation ships. Technical fixes index within days; ranking movement and AI Overview citations typically build over 3–8 weeks. Everything is reported against Search Console and citation tracking — positions, impressions, and named AI citations, not vanity traffic.' . "\n\n" . 'Start with a baseline I can measure: share your domain and top three commercial pages, and within two business days you receive a technical and citation-gap audit plus a fixed quote for the foundation. No retainer traps, no guaranteed positions — just the complete work, reported weekly against Search Console and citation tracking. Most clients see technical wins indexed within days and ranking movement inside two months. Email ceo@saasnext.in and let the data make the case before you spend anything.',
                'offerings' => [
                    'Google AI Overview (SGE) optimization' => 'Structure content to trigger direct quotation and author attribution in AI summaries — answer blocks, tables, and definitions models can lift cleanly.',
                    'Entity & JSON-LD knowledge graph schema' => 'Comprehensive Person, Organization, ImageObject, and FAQ structured data that tells Google and AI models exactly who you are and why you are authoritative.',
                    'Technical SEO & Core Web Vitals' => 'Flawless site architecture, canonical hygiene, XML sitemaps, and sub-second speed — the foundation rankings and citations both require.',
                    'Local SEO for Gujarat & India' => 'Targeted local entity signals, Google Business optimization, NAP citations across Justdial, IndiaMART, and Sulekha, plus review velocity systems.',
                    'Authority content strategy' => 'High-CTR topical cluster architecture mapped to commercial user intent, with briefs your team can write to or I can deliver.',
                    'Measurement & citation tracking' => 'Search Console reporting plus AI-citation monitoring across Overviews, ChatGPT, and Perplexity — you see exactly where you are quoted.',
                ],
                'faq' => [
                    'What is AEO (Answer Engine Optimization)?' => 'AEO is the practice of optimizing content so AI answer engines like Google AI Overviews, Perplexity, Claude, and ChatGPT can easily extract, trust, and quote your website as the primary source of truth. It combines entity schema, answer-first formatting, quotable statistics, and topical authority — everything a model needs to cite you by name instead of your competitor.',
                    'How soon can I see results from SEO and AEO optimization?' => 'Technical and schema fixes are indexed within days; noticeable ranking improvements and AI Overview citations typically occur within 3–8 weeks. Content clusters compound over 3–6 months — the SaaS Next engine tripled organic traffic in six months on this exact playbook. I report weekly against Search Console so progress is visible, not promised.',
                    'How much does SEO and AEO cost in India?' => 'Fixed ₹55,000–₹85,000 for the foundation engagement: technical repair, entity schema, answer engineering on key pages, and the content cluster roadmap. Monthly compounding (new briefs, citation tracking, iteration) is quoted separately and is optional — the foundation keeps working regardless.',
                    'My site already ranks — why do I need AEO?' => 'Because zero-click answers are eating informational traffic: ranking first matters less when the Overview above it answers the question. AEO makes your site the quoted source inside that answer, which is the new position zero. Clients who combine both keep their traffic while competitors watch theirs divert into unattributed summaries.',
                    'Do you guarantee first-page rankings?' => 'No honest SEO guarantees positions — anyone who does is selling you something. What I guarantee is the complete foundation (technical, schema, content structure), weekly transparent reporting, and iteration against real data. Rankings follow the work; I show you the work every week.',
                    'Can you fix our Core Web Vitals as part of SEO?' => 'Yes — speed is a ranking factor and a conversion lever, so I treat it as SEO work. I budget LCP under 1.8s on mid-range phones, verify on 4G emulation, and fix the usual culprits: unoptimized images, render-blocking scripts, and missing caching. Most sites pass within the foundation engagement.',
                ],
                'service_type' => 'SearchEngineOptimization',
                'area_served' => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
            [
                'slug' => 'social-media-marketing',
                'kicker' => 'Service 05 — Growth & Marketing',
                'title' => 'Social Media Marketing & Viral Growth',
                'tagline' => 'High-converting social campaigns, viral short-form content pipelines, and brand dominance.',
                'meta_description' => 'Expert social media marketer & viral growth strategist. High-CTR Reels, Shorts, LinkedIn content pipelines, and conversion funnels. Deepak Bagada.',
                'intro' => 'Deepak Bagada delivers data-driven social media marketing and viral growth systems. By combining creative psychology, algorithmic distribution strategies, and automated content creation pipelines, he helps businesses build unstoppable brand authority, dominate Instagram Reels and YouTube Shorts, and generate qualified inbound leads.'
                    ."\n\n".'The system has three layers. First, positioning: one-line promise, proof bank, and content pillars derived from what your buyers already search. Second, production: hook-first scripts, pattern-interrupt editing, keyword-rich captions, and a posting cadence the algorithm can learn — Reels and Shorts engineered for retention graphs, LinkedIn for authority compounding. Third, pipelines: AI-assisted scripting, approval workflows, and multi-platform distribution so output stays consistent when motivation dips. Sprints run in 30-day cycles with retention and reach reviews each week.'
                    ."\n\n".'Fixed 30-day sprint builds run ₹55,000–₹85,000 including positioning, templates, and the content pipeline setup; monthly production retainers are quoted on volume. I optimize for qualified inbound — profile visits that become DMs that become calls — and report reach, retention, and lead counts without vanity fog.' . "\n\n" . 'Begin with a 30-day sprint, not a 12-month contract: positioning, pillars, templates, and the pipeline, all fixed-scope and fixed-price. By day 30 you own a running system and the data to judge it — reach curves, retention graphs, and inbound counts. If the numbers earn a second sprint, we scale volume; if not, you keep everything built so far. Email ceo@saasnext.in with your niche and current channels, and I will reply with an honest read on whether short-form can move your revenue needle.',
                'offerings' => [
                    'Viral short-form video strategy' => 'High-retention Reels, TikToks, and Shorts engineered around pattern interrupts, hooks in the first second, and retention-graph editing.',
                    'Automated content creation engines' => 'AI-assisted scripting, asset generation, approval queues, and multi-platform distribution pipelines your team can run weekly.',
                    'Brand authority & personal branding' => 'Positioning founders and executives as the undisputed authority in their niche with proof-led content pillars and consistent publishing.',
                    'Performance conversion funnels' => 'Turning organic social views and engagements into captured leads and closed sales — profile architecture, DM scripts, and call booking flows.',
                    'LinkedIn authority systems' => 'Thought-leadership sequences, comment strategies, and distribution loops that compound professional credibility quarter after quarter.',
                    'Analytics & iteration sprints' => 'Weekly retention and reach reviews, hook testing frameworks, and 30-day sprint planning driven by what the data actually rewards.',
                ],
                'faq' => [
                    'How do you generate consistent reach on Instagram Reels and YouTube Shorts?' => 'We use proven hook frameworks, high-retention motion graphics, dynamic pacing, and keyword-rich audio and captions that trigger algorithmic distribution in discovery feeds. Consistency comes from systems: scripted hooks, editing templates, posting cadence, and weekly retention reviews — not from posting and praying. Reach compounds when every video teaches the algorithm who to show the next one to.',
                    'How much does social media marketing cost in Gujarat?' => 'Fixed ₹55,000–₹85,000 for a 30-day sprint build: positioning, content pillars, templates, and the production pipeline. Monthly production retainers depend on volume (12–30 pieces) and are quoted fixed after the sprint. No percentage-of-ad-spend games on organic work.',
                    'How fast will we see leads from social media?' => 'Reach signals appear in 2–4 weeks; qualified inbound typically builds over 60–90 days as the algorithm learns your audience and the content library compounds. I report profile visits, DMs, and booked calls weekly so you see the funnel forming, not just view counts climbing.',
                    'Do you run paid ads too?' => 'My core practice is organic authority systems, and I keep it that way on purpose — paid is a different discipline with different incentives. For clients who need paid, I design the landing and tracking foundation so their ads convert, then refer trusted media buyers for the spend side.',
                    'Who owns the content and accounts?' => 'You do — always. Accounts, raw footage, templates, and pipelines are created under your ownership with documented access. If we stop working together, the system keeps running because your team was trained on it from week one.',
                    'Can this work for B2B and boring industries?' => 'Boring is an advantage: low competition for attention and buyers who desperately want clear answers. I have frameworks for technical, industrial, and professional niches — proof-led explainers, process breakdowns, and founder authority content that competitors in dull markets never produce.',
                ],
                'service_type' => 'SocialMediaMarketing',
                'area_served' => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
            ],
        ];

        Service::query()->delete();

        foreach ($services as $service) {
            Service::create($service);
        }

        $this->command?->info('Seeded '.count($services).' services prioritizing AI development.');
    }
}
