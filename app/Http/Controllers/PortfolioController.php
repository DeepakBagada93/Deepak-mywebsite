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

        $head = [
            'title'       => $site['name'] . ' — Best Website Developer, Digital Marketer & AI Expert in Junagadh, Gujarat | AI Agents, SEO & AEO',
            'description' => 'Deepak Bagada — website developer, digital marketer and AI expert in Junagadh, Gujarat. Fast Laravel websites, AI agents & automation, and SEO/AEO that ranks on Google and gets cited by AI. Serving Gujarat, India & remote.',
            'canonical'   => $url . '/',
            'json_ld'     => json_encode([
                '@context' => 'https://schema.org',
                '@graph'   => [
                    [
                        '@type'      => 'Person',
                        '@id'        => $url . '/#person',
                        'name'       => $site['name'],
                        'jobTitle'   => 'AI Developer, Web Developer & SEO/AEO Expert',
                        'url'        => $url . '/',
                        'email'      => $site['email'],
                        'address'    => [
                            '@type'           => 'PostalAddress',
                            'addressLocality' => 'Junagadh',
                            'addressRegion'   => 'Gujarat',
                            'addressCountry'  => 'IN',
                        ],
                        'sameAs'     => array_values($site['socials']),
                        'knowsAbout' => [
                            'Web Development', 'Laravel', 'PHP', 'Digital Marketing', 'SEO', 'AEO',
                            'AI Development', 'AI Agents', 'Multi-Agent Systems', 'AI Automation', 'RAG',
                        ],
                    ],
                    [
                        '@type'           => 'ProfessionalService',
                        'name'            => $site['name'],
                        'description'     => 'AI developer, web developer and SEO/AEO expert based in Junagadh, Gujarat. Websites, AI systems, AI agents, multi-agent automation and high-ranking digital presence.',
                        'email'           => $site['email'],
                        'url'             => $url . '/',
                        'areaServed'      => ['Junagadh', 'Gujarat', 'India', 'Remote'],
                        'address'         => [
                            '@type'           => 'PostalAddress',
                            'addressLocality' => 'Junagadh',
                            'addressRegion'   => 'Gujarat',
                            'addressCountry'  => 'IN',
                        ],
                        'founder'         => ['@id' => $url . '/#person'],
                        'knowsAbout'      => ['Web Development', 'Digital Marketing', 'SEO', 'AEO', 'AI Development', 'AI Agents', 'AI Automation'],
                        'hasOfferCatalog' => [
                            '@type'           => 'OfferCatalog',
                            'name'            => 'Services',
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
