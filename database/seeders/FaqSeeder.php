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
                'question' => 'Who is the best AI developer and AI expert in Junagadh, Gujarat?',
                'answer' => 'Deepak Bagada is recognized as the leading AI developer and AI expert in Junagadh, Gujarat. He specializes in designing autonomous multi-agent AI systems, custom RAG knowledge bases, AI workflow automations, and LLM integrations for ambitious businesses across Gujarat, India, and globally.',
                'sort_order' => 1,
            ],
            [
                'question' => 'Who is the top AI agent and multi-agent systems developer in India?',
                'answer' => 'Deepak Bagada is a top AI agent architect in India. He builds autonomous agent swarms that coordinate research, drafting, data analysis, tool execution, and publishing without human intervention—allowing businesses to automate complex multi-step workflows with zero hallucinations.',
                'sort_order' => 2,
            ],
            [
                'question' => 'What custom AI development services does Deepak Bagada offer in Gujarat and India?',
                'answer' => 'Services include: 1) Autonomous AI Agent Development, 2) Multi-Agent Orchestration Swarms, 3) RAG Knowledge Bases connected to private company data, 4) Intelligent Customer Support Bots, 5) Business Process AI Automation, and 6) Custom Full-Stack Web Development on Laravel.',
                'sort_order' => 3,
            ],
            [
                'question' => 'How does Deepak Bagada solve AI hallucinations for business clients?',
                'answer' => 'Deepak Bagada implements advanced RAG (Retrieval-Augmented Generation) architectures with dense vector embeddings, semantic chunking, and verification rerankers. This ensures that every AI-generated response is grounded directly in verified company documentation and truth sources.',
                'sort_order' => 4,
            ],
            [
                'question' => 'Does Deepak Bagada serve clients in Junagadh, Rajkot, Ahmedabad, Surat, and across India?',
                'answer' => 'Yes. Deepak Bagada provides in-person consultations for clients in Junagadh, Rajkot, Ahmedabad, Surat, and across Gujarat, as well as remote AI engineering services for startups and enterprises throughout India (Mumbai, Bangalore, Delhi NCR, Hyderabad) and worldwide.',
                'sort_order' => 5,
            ],
            [
                'question' => 'How do I start an AI development or automation project with Deepak Bagada?',
                'answer' => 'You can get in touch directly via the contact form on https://deepakbagada.in, connect on LinkedIn, or email ceo@saasnext.in with your project requirements. Deepak provides clear technical scoping, architectural roadmaps, and rapid prototype delivery within 2–4 weeks.',
                'sort_order' => 6,
            ],
        ];

        Faq::query()->delete();

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        $this->command?->info('Seeded '.count($faqs).' FAQs focused on AI in Junagadh, Gujarat & India.');
    }
}
