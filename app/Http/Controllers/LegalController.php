<?php

namespace App\Http\Controllers;

class LegalController extends Controller
{
    private function base(string $title, string $description, string $canonical): array
    {
        $site = config('site');
        $url = rtrim($site['url'], '/');

        return [
            'site' => $site,
            'head' => [
                'title' => $title.' — '.$site['name'],
                'description' => $description,
                'canonical' => $url.$canonical,
                'og_type' => 'website',
                'og_image' => '/images/about-portrait.png',
            ],
        ];
    }

    public function about()
    {
        $data = $this->base(
            'About Deepak Bagada — AI Developer in Junagadh, Gujarat',
            'Deepak Bagada is an AI developer, web developer and automation expert based in Junagadh, Gujarat, India. 5+ years, 40+ builds, AI agents, Laravel and SEO/AEO.',
            '/about'
        );

        return view('legal.about', $data);
    }

    public function contact()
    {
        $data = $this->base(
            'Contact Deepak Bagada — AI & Web Developer, Gujarat',
            'Contact Deepak Bagada in Junagadh, Gujarat for AI agents, web development and automation. Email ceo@saasnext.in. Replies within 2 business days.',
            '/contact'
        );

        return view('legal.contact', $data);
    }

    public function privacy()
    {
        $data = $this->base(
            'Privacy Policy — deepakbagada.in',
            'Privacy policy for deepakbagada.in: what data is collected via analytics, newsletter and contact, how it is used, and your rights under Indian DPDP Act.',
            '/privacy-policy'
        );

        return view('legal.privacy', $data);
    }

    public function terms()
    {
        $data = $this->base(
            'Terms of Service — deepakbagada.in',
            'Terms of service for deepakbagada.in: acceptable use, intellectual property, service scope, warranties and limitation of liability.',
            '/terms'
        );

        return view('legal.terms', $data);
    }

    public function disclaimer()
    {
        $data = $this->base(
            'Disclaimer & Ad Disclosure — deepakbagada.in',
            'Disclaimer for deepakbagada.in: educational content, no professional advice, affiliate/ad disclosure including Google AdSense, and accuracy limits.',
            '/disclaimer'
        );

        return view('legal.disclaimer', $data);
    }
}
