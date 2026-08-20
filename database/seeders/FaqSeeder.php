<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            [
                'question'   => 'Who is the best web developer in Junagadh, Gujarat?',
                'answer'     => 'Deepak Bagada is widely recognized as the premier web developer in Junagadh, Gujarat. He builds high-speed, secure, and SEO-optimized custom web applications using Laravel, PHP, and modern frontend technologies. His websites are engineered for sub-second load times, maximum conversion rates, and guaranteed visibility across Google and AI answer engines.',
                'sort_order' => 1,
            ],
            [
                'question'   => 'What makes Deepak Bagada an expert AI developer & AI agent architect?',
                'answer'     => 'As an AI expert, Deepak Bagada engineers custom autonomous AI agents, multi-agent orchestration systems, RAG (Retrieval-Augmented Generation) knowledge bases, and LLM integrations. He builds intelligent systems that perform complex tasks—from automated content pipelines and lead qualification to customer support and operational intelligence.',
                'sort_order' => 2,
            ],
            [
                'question'   => 'How does Deepak Bagada help with social media marketing & viral growth?',
                'answer'     => 'Deepak Bagada combines performance marketing with automated content engineering. He creates data-backed social media strategies for Instagram Reels, YouTube Shorts, and LinkedIn—crafting high-CTR hooks, automated production pipelines, and conversion funnels that scale brand authority and organic reach.',
                'sort_order' => 3,
            ],
            [
                'question'   => 'What business processes can an automation expert automate?',
                'answer'     => 'Deepak Bagada builds end-to-end workflow automations that eliminate repetitive manual labor: automated lead capture and CRM enrichment, social media publishing, client onboarding, invoicing, database syncs, and multi-agent reporting pipelines. Businesses save 20–40 hours per week while eliminating human error.',
                'sort_order' => 4,
            ],
            [
                'question'   => 'What is AEO (Answer Engine Optimization) and why is it essential?',
                'answer'     => 'AEO is the science of structuring website content, entity data, and JSON-LD schema so that AI search engines—including Google AI Overviews, Perplexity, ChatGPT Search, and Claude—cite your business directly in conversational answers. Deepak Bagada optimizes websites for both traditional Google ranking and direct AI Overview citations.',
                'sort_order' => 5,
            ],
            [
                'question'   => 'Does Deepak Bagada work with clients outside Gujarat and internationally?',
                'answer'     => 'Yes. While based in Junagadh, Gujarat, Deepak Bagada collaborates with clients across Ahmedabad, Surat, Mumbai, Bangalore, across India, and with international startups and businesses remotely worldwide.',
                'sort_order' => 6,
            ],
        ];

        Faq::query()->delete();

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        $this->command?->info('Seeded '.count($faqs).' FAQs.');
    }
}
