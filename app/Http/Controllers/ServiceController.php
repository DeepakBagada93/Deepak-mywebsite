<?php

namespace App\Http\Controllers;

use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $services = Service::orderBy('id')->get();

        $head = [
            'title'       => 'Services — Website Development, AI Development & SEO/AEO | ' . $site['name'] . ', Junagadh Gujarat',
            'description' => 'Services by Deepak Bagada, Junagadh Gujarat: website development (Laravel/PHP), AI development & AI agents, and SEO/AEO for Google and AI answers. India & remote.',
            'canonical'   => $url . '/services',
            'json_ld'     => json_encode([
                '@context'        => 'https://schema.org',
                '@type'           => 'ItemList',
                'name'            => 'Services by ' . $site['name'],
                'itemListElement' => $services->map(static fn (Service $service, int $index) => [
                    '@type'    => 'ListItem',
                    'position' => $index + 1,
                    'name'     => $service->title,
                    'url'      => $url . '/services/' . $service->slug,
                ])->values()->all(),
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('services.index', compact('site', 'services', 'head'));
    }

    public function show(Service $service)
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');
        $canonical = $url . '/services/' . $service->slug;

        $faqJson = collect($service->faq)->map(static fn (string $answer, string $question) => [
            '@type'          => 'Question',
            'name'           => $question,
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text'  => $answer,
            ],
        ])->values()->all();

        $head = [
            'title'       => $service->title . ' in ' . $site['location'] . ' | ' . $site['name'],
            'description' => $service->meta_description,
            'canonical'   => $canonical,
            'json_ld'     => json_encode([
                '@context' => 'https://schema.org',
                '@graph'   => [
                    [
                        '@type'       => 'Service',
                        'name'        => $service->title,
                        'serviceType' => $service->service_type,
                        'description' => $service->intro,
                        'url'         => $canonical,
                        'areaServed'  => $service->area_served,
                        'provider'    => [
                            '@type'    => 'Person',
                            'name'     => $site['name'],
                            'jobTitle' => 'AI Developer, Web Developer & SEO/AEO Expert',
                            'url'      => $url . '/',
                            'email'    => $site['email'],
                            'address'  => [
                                '@type'           => 'PostalAddress',
                                'addressLocality' => 'Junagadh',
                                'addressRegion'   => 'Gujarat',
                                'addressCountry'  => 'IN',
                            ],
                            'sameAs'   => array_values($site['socials']),
                        ],
                    ],
                    [
                        '@type'      => 'FAQPage',
                        'mainEntity' => $faqJson,
                    ],
                    [
                        '@type'           => 'BreadcrumbList',
                        'itemListElement' => [
                            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $url . '/'],
                            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Services', 'item' => $url . '/services'],
                            ['@type' => 'ListItem', 'position' => 3, 'name' => $service->title, 'item' => $canonical],
                        ],
                    ],
                ],
            ], JSON_UNESCAPED_SLASHES),
        ];

        return view('services.show', compact('site', 'service', 'head'));
    }
}
