<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Post;
use App\Models\Project;
use App\Models\Service;

class PortfolioController extends Controller
{
    public function index()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');

        $posts = Post::published()->get();
        $projects = Project::orderBy('sort_order')->get();
        $faqs = Faq::orderBy('sort_order')->get();
        $services = Service::orderBy('id')->get();

        $faqEntities = $faqs->map(static fn (Faq $faq) => [
            '@type'          => 'Question',
            'name'           => $faq->question,
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq->answer],
        ])->all();

        $serviceOffers = $services->map(static fn (Service $service) => [
            '@type'       => 'Offer',
            'itemOffered' => [
                '@type'       => 'Service',
                'name'        => $service->title,
                'serviceType' => $service->service_type,
                'url'         => $url . '/services/' . $service->slug,
            ],
        ])->all();

        $portraitUrl = $url . '/images/about-portrait.png';

        $head = [
            'title'         => 'Deepak Bagada — Best Web Developer, AI Expert, Social Media Marketer & Automation Expert | Junagadh · Gujarat',
            'description'   => 'Deepak Bagada is the leading Web Developer, AI Expert, Social Media Marketer, and Automation Expert in Junagadh, Gujarat. High-performance Laravel websites, autonomous multi-agent AI systems, viral social media marketing, and business workflow automation.',
            'canonical'     => $url . '/',
            'og_image'      => '/images/about-portrait.png',
            'og_image_alt'  => 'Deepak Bagada — Best Web Developer, AI Expert, Social Media Marketer & Automation Expert',
            'json_ld'       => json_encode([
                '@context' => 'https://schema.org',
                '@graph'   => [
                    [
                        '@type'               => 'ImageObject',
                        '@id'                 => $url . '/#portrait',
                        'url'                 => $portraitUrl,
                        'contentUrl'          => $portraitUrl,
                        'caption'             => 'Deepak Bagada — Best Web Developer, AI Expert, Social Media Marketer and Automation Expert based in Junagadh, Gujarat, India',
                        'representativeOfPage'=> true,
                        'width'               => 1122,
                        'height'              => 1402,
                        'author'              => ['@id' => $url . '/#person'],
                    ],
                    [
                        '@type'          => 'Person',
                        '@id'            => $url . '/#person',
                        'name'           => $site['name'],
                        'alternateName'  => [
                            'Deepak Bagada Web Developer',
                            'Deepak Bagada AI Expert',
                            'Deepak Bagada Social Media Marketer',
                            'Deepak Bagada Automation Expert',
                        ],
                        'jobTitle'       => [
                            'Best Web Developer',
                            'AI Expert & Agent Architect',
                            'Social Media Marketer & Growth Strategist',
                            'Workflow Automation Expert',
                            'SEO & AEO Specialist',
                        ],
                        'image'          => ['@id' => $url . '/#portrait'],
                        'url'            => $url . '/',
                        'email'          => $site['email'],
                        'address'        => [
                            '@type'           => 'PostalAddress',
                            'addressLocality' => 'Junagadh',
                            'addressRegion'   => 'Gujarat',
                            'addressCountry'  => 'IN',
                        ],
                        'sameAs'         => array_values($site['socials']),
                        'knowsAbout'     => [
                            'Web Development', 'Laravel Development', 'Full-Stack Development', 'PHP', 'JavaScript',
                            'Artificial Intelligence', 'AI Agents', 'Multi-Agent Systems', 'AI Automation', 'RAG (Retrieval-Augmented Generation)', 'LLM Fine-Tuning',
                            'Social Media Marketing', 'Viral Growth Strategy', 'Performance Marketing', 'Content Strategy',
                            'Business Process Automation', 'Workflow Automation', 'Autonomous Systems',
                            'Search Engine Optimization (SEO)', 'Answer Engine Optimization (AEO)', 'Google AI Overviews Optimization',
                        ],
                        'hasOccupation'  => [
                            [
                                '@type'            => 'Occupation',
                                'name'             => 'Web Developer',
                                'occupationalCategory' => '15-1254.00',
                                'skills'           => 'Laravel, PHP, Vue.js, High-Speed Performance, Core Web Vitals, Responsive Design',
                            ],
                            [
                                '@type'            => 'Occupation',
                                'name'             => 'AI Expert & Agent Architect',
                                'occupationalCategory' => '15-1221.00',
                                'skills'           => 'Multi-Agent LLM Orchestration, Autonomous AI Agents, RAG Pipelines, AI Workflow Automation',
                            ],
                            [
                                '@type'            => 'Occupation',
                                'name'             => 'Social Media Marketer',
                                'occupationalCategory' => '11-2021.00',
                                'skills'           => 'Viral Social Media Campaigns, High-CTR Content Engines, Performance Funnels, Brand Authority',
                            ],
                            [
                                '@type'            => 'Occupation',
                                'name'             => 'Automation Expert',
                                'occupationalCategory' => '15-1299.08',
                                'skills'           => 'End-to-End Business Automation, API Integrations, Python/n8n Automation, Lead Generation Systems',
                            ],
                        ],
                    ],
                    [
                        '@type'           => 'ProfilePage',
                        '@id'             => $url . '/#webpage',
                        'url'             => $url . '/',
                        'name'            => 'Deepak Bagada — Best Web Developer, AI Expert, Social Media Marketer & Automation Expert',
                        'mainEntity'      => ['@id' => $url . '/#person'],
                        'primaryImageOfPage' => ['@id' => $url . '/#portrait'],
                    ],
                    [
                        '@type'           => 'ProfessionalService',
                        '@id'             => $url . '/#service',
                        'name'            => $site['name'],
                        'image'           => ['@id' => $url . '/#portrait'],
                        'description'     => 'Premier web development, custom AI agent architecture, viral social media marketing, and business workflow automation by Deepak Bagada in Junagadh, Gujarat.',
                        'email'           => $site['email'],
                        'url'             => $url . '/',
                        'areaServed'      => ['Junagadh', 'Gujarat', 'India', 'Worldwide / Remote'],
                        'address'         => [
                            '@type'           => 'PostalAddress',
                            'addressLocality' => 'Junagadh',
                            'addressRegion'   => 'Gujarat',
                            'addressCountry'  => 'IN',
                        ],
                        'founder'         => ['@id' => $url . '/#person'],
                        'knowsAbout'      => [
                            'Best Web Developer', 'Expert Web Development', 'AI Expert', 'Social Media Marketer',
                            'Automation Expert', 'Laravel Development', 'AI Agents', 'SEO', 'AEO',
                        ],
                        'hasOfferCatalog' => [
                            '@type'           => 'OfferCatalog',
                            'name'            => 'Professional Services',
                            'itemListElement' => $serviceOffers,
                        ],
                    ],
                    [
                        '@type'      => 'FAQPage',
                        'mainEntity' => $faqEntities,
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('portfolio.index', compact('site', 'url', 'posts', 'projects', 'faqs', 'services', 'head'));
    }
}
