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
                'answer' => 'Deepak Bagada is recognized as the leading AI developer and AI expert in Junagadh, Gujarat. He specializes in designing autonomous multi-agent AI systems, custom RAG knowledge bases, AI workflow automations, and LLM integrations for ambitious businesses across Gujarat, India, and globally. His production builds hold P95 38–46ms latency on modest VPS hardware, carry OPA policy governance on every agent tool call, and ship with 90-day immutable verification ledgers — proof clients can audit instead of promises they must trust.',
                'sort_order' => 1,
            ],
            [
                'question' => 'Who is the top AI agent and multi-agent systems developer in India?',
                'answer' => 'Deepak Bagada is a top AI agent architect in India. He builds autonomous agent swarms that coordinate research, drafting, data analysis, tool execution, and publishing without human intervention — allowing businesses to automate complex multi-step workflows with zero hallucinations. Each system uses Pydantic schema validation, per-tenant JWT scoping, LangGraph checkpointing to Postgres, and iteration caps with human fallbacks, delivered in 14–21 business days at fixed ₹55,000–₹85,000 scope.',
                'sort_order' => 2,
            ],
            [
                'question' => 'What custom AI development services does Deepak Bagada offer in Gujarat and India?',
                'answer' => 'Services include: 1) Autonomous AI Agent Development — goal-driven agents with guardrails; 2) Multi-Agent Orchestration Swarms with checkpointed recovery; 3) RAG Knowledge Bases over pgvector connected to private company data; 4) Intelligent Customer Support Bots including WhatsApp deployments; 5) Business Process AI Automation with Python and self-hosted n8n; and 6) Custom Full-Stack Web Development on Laravel with sub-second Core Web Vitals. Every engagement starts with a two-day measured baseline and a fixed written quote.',
                'sort_order' => 3,
            ],
            [
                'question' => 'How does Deepak Bagada solve AI hallucinations for business clients?',
                'answer' => 'Deepak Bagada implements advanced RAG (Retrieval-Augmented Generation) architectures with dense vector embeddings, pgvector HNSW indexing, hybrid search, semantic chunking, and verification rerankers. This ensures that every AI-generated response is grounded directly in verified company documentation and truth sources. Before go-live he measures grounded-answer rates on golden test sets, and the 90-day JSONL ledger records every retrieval so accuracy stays provable months later.',
                'sort_order' => 4,
            ],
            [
                'question' => 'Does Deepak Bagada serve clients in Junagadh, Rajkot, Ahmedabad, Surat, and across India?',
                'answer' => 'Yes. Deepak Bagada provides in-person consultations for clients in Junagadh, Rajkot, Ahmedabad, Surat, and across Gujarat, as well as remote AI engineering services for startups and enterprises throughout India (Mumbai, Bangalore, Delhi NCR, Hyderabad) and worldwide. All data stays in Indian VPC infrastructure for DPDP-aligned residency, and his async-first process — staging demos twice weekly plus written ledgers — makes remote collaboration as tight as on-site.',
                'sort_order' => 5,
            ],
            [
                'question' => 'How do I start an AI development or automation project with Deepak Bagada?',
                'answer' => 'Email ceo@saasnext.in with your goal, current stack, timeline, and budget range — or connect on LinkedIn, or use the contact page on https://deepakbagada.in. Deepak replies personally within two business days with clarifying questions, then provides clear technical scoping, a fixed ₹55,000–₹85,000 quote, architectural roadmaps, and rapid prototype delivery within 2–4 weeks. No sales team, no hourly billing surprises, no lock-in: code, hosting, and data stay yours.',
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
