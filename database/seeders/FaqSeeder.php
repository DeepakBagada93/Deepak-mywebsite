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
                'question'   => 'Who is the best website developer in Junagadh, Gujarat?',
                'answer'     => 'Deepak Bagada is a website developer based in Junagadh, Gujarat who builds fast, SEO-ready websites on Laravel and PHP — sites that rank on Google and convert visitors into customers. He also develops AI systems and automation, and works with clients across Gujarat, India, and remotely.',
                'sort_order' => 1,
            ],
            [
                'question'   => 'What does an AI expert / AI developer in Junagadh do?',
                'answer'     => 'An AI developer builds the systems that use AI: AI agents and chatbots, multi-agent automation, RAG knowledge bases and custom tools that do real work such as content pipelines, customer support and back-office automation. Deepak Bagada does this from Junagadh, Gujarat for businesses across India.',
                'sort_order' => 2,
            ],
            [
                'question'   => 'Is Deepak Bagada a digital marketer / SEO expert?',
                'answer'     => 'Yes. Deepak Bagada is an SEO and AEO (answer engine optimization) expert in Junagadh, Gujarat. He does technical SEO, local SEO, content strategy and structured data — work that ranks businesses on Google and gets them cited by ChatGPT, Gemini, Perplexity and Google AI Overviews.',
                'sort_order' => 3,
            ],
            [
                'question'   => 'Does Deepak Bagada work with clients outside Junagadh?',
                'answer'     => 'Yes. Based in Junagadh, Gujarat, Deepak works with clients across Gujarat, all over India, and remotely worldwide — websites, AI systems and SEO/AEO for businesses of any size.',
                'sort_order' => 4,
            ],
        ];

        Faq::query()->delete();

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        $this->command?->info('Seeded '.count($faqs).' FAQs.');
    }
}
