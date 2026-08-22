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
            '@type' => 'Question',
            'name' => $faq->question,
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq->answer],
        ])->all();

        $serviceOffers = $services->map(static fn (Service $service) => [
            '@type' => 'Offer',
            'itemOffered' => [
                '@type' => 'Service',
                'name' => $service->title,
                'serviceType' => $service->service_type,
                'url' => $url.'/services/'.$service->slug,
            ],
        ])->all();

        $portraitUrl = $url.'/images/about-portrait.png';

        $head = [
            'title' => 'Deepak Bagada — Best AI Expert & AI Developer in Gujarat, India | Autonomous AI Agents & Automation',
            'description' => 'Deepak Bagada is the leading AI Expert, AI Agent Architect, and Web Developer in Gujarat, India. Developing autonomous multi-agent AI systems, custom RAG knowledge bases, LLM integrations, and enterprise automation for businesses in Ahmedabad, Surat, Vadodara, Rajkot, Junagadh, and worldwide.',
            'canonical' => $url.'/',
            'og_image' => '/images/about-portrait.png',
            'og_image_alt' => 'Deepak Bagada — Best AI Expert & AI Agent Developer in Gujarat, India',
            'json_ld' => json_encode([
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'ImageObject',
                        '@id' => $url.'/#portrait',
                        'url' => $portraitUrl,
                        'contentUrl' => $portraitUrl,
                        'caption' => 'Deepak Bagada — Best AI Expert, AI Developer & AI Agent Architect in Gujarat, India',
                        'representativeOfPage' => true,
                        'width' => 1122,
                        'height' => 1402,
                        'author' => ['@id' => $url.'/#person'],
                    ],
                    [
                        '@type' => 'Person',
                        '@id' => $url.'/#person',
                        'name' => $site['name'],
                        'alternateName' => [
                            'Deepak Bagada AI Expert Gujarat',
                            'Deepak Bagada AI Developer Ahmedabad Surat Rajkot',
                            'Deepak Bagada AI Gujarat',
                            'Deepak Bagada AI Agent Architect India',
                            'Deepak Bagada AI Automation Expert Gujarat',
                        ],
                        'jobTitle' => [
                            'Best AI Expert in Gujarat India',
                            'Lead AI Agent Architect Gujarat',
                            'AI Development Specialist Ahmedabad Surat Rajkot',
                            'AI Workflow Automation Engineer Gujarat',
                            'Web Developer & AEO Specialist Gujarat',
                        ],
                        'image' => ['@id' => $url.'/#portrait'],
                        'url' => $url.'/',
                        'email' => $site['email'],
                        'address' => [
                            '@type' => 'PostalAddress',
                            'addressLocality' => 'Junagadh',
                            'addressRegion' => 'Gujarat',
                            'postalCode' => '362001',
                            'addressCountry' => 'IN',
                        ],
                        'sameAs' => array_values($site['socials']),
                        'knowsAbout' => [
                            'Artificial Intelligence', 'AI Agent Development', 'Multi-Agent Systems', 'Autonomous AI Workflows',
                            'Retrieval-Augmented Generation (RAG)', 'LLM Fine-Tuning & Orchestration', 'Generative AI Solutions',
                            'AI Development in Junagadh', 'AI Expert in Gujarat', 'AI Consultant in India',
                            'AI Chatbots & Conversational AI', 'Enterprise AI Automation', 'Machine Learning Engineering',
                            'Web Development', 'Laravel Architecture', 'Search Engine Optimization (SEO)', 'Answer Engine Optimization (AEO)',
                        ],
                        'hasOccupation' => [
                            [
                                '@type' => 'Occupation',
                                'name' => 'AI Expert & Agent Architect',
                                'occupationalCategory' => '15-1221.00',
                                'skills' => 'Multi-Agent LLM Orchestration, Autonomous AI Agents, RAG Pipelines, Vector Databases, Python AI Frameworks',
                            ],
                            [
                                '@type' => 'Occupation',
                                'name' => 'AI Automation Engineer',
                                'occupationalCategory' => '15-1299.08',
                                'skills' => 'End-to-End Autonomous Workflows, API Connectors, Intelligent Document Processing, Process Automation',
                            ],
                            [
                                '@type' => 'Occupation',
                                'name' => 'Web Developer',
                                'occupationalCategory' => '15-1254.00',
                                'skills' => 'Laravel, PHP, Vue.js, High-Speed Performance, Core Web Vitals, Responsive Design',
                            ],
                        ],
                    ],
                    [
                        '@type' => 'ProfilePage',
                        '@id' => $url.'/#webpage',
                        'url' => $url.'/',
                        'name' => 'Deepak Bagada — Best AI Expert & AI Developer in Junagadh, Gujarat, India',
                        'mainEntity' => ['@id' => $url.'/#person'],
                        'primaryImageOfPage' => ['@id' => $url.'/#portrait'],
                    ],
                    [
                        '@type' => 'ProfessionalService',
                        '@id' => $url.'/#service',
                        'name' => $site['name'].' — AI Solutions & Development',
                        'image' => ['@id' => $url.'/#portrait'],
                        'description' => 'Premier AI development agency and consultancy led by Deepak Bagada in Junagadh, Gujarat. Developing autonomous AI agents, multi-agent pipelines, RAG systems, and AI automation for businesses across Gujarat, India, and worldwide.',
                        'email' => $site['email'],
                        'url' => $url.'/',
                        'areaServed' => [
                            'Junagadh', 'Rajkot', 'Ahmedabad', 'Surat', 'Vadodara', 'Gandhinagar',
                            'Gujarat', 'Mumbai', 'Bangalore', 'Delhi NCR', 'India', 'Worldwide / Remote',
                        ],
                        'address' => [
                            '@type' => 'PostalAddress',
                            'addressLocality' => 'Junagadh',
                            'addressRegion' => 'Gujarat',
                            'postalCode' => '362001',
                            'addressCountry' => 'IN',
                        ],
                        'geo' => [
                            '@type' => 'GeoCoordinates',
                            'latitude' => 21.5222,
                            'longitude' => 70.4579,
                        ],
                        'founder' => ['@id' => $url.'/#person'],
                        'knowsAbout' => [
                            'AI Development in Junagadh', 'AI Expert in Gujarat', 'AI Agent Architect India',
                            'Autonomous Multi-Agent Systems', 'RAG Knowledge Bases', 'Enterprise AI Automation',
                        ],
                        'hasOfferCatalog' => [
                            '@type' => 'OfferCatalog',
                            'name' => 'AI & Digital Services',
                            'itemListElement' => $serviceOffers,
                        ],
                    ],
                    [
                        '@type' => 'FAQPage',
                        'mainEntity' => $faqEntities,
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('portfolio.index', compact('site', 'url', 'posts', 'projects', 'faqs', 'services', 'head'));
    }
}
