#!/usr/bin/env node
/**
 * Developer B2B Intent Scorer CLI
 * Standalone zero-dependency Node.js tool.
 *
 * Evaluates prospect company profiles, detects buying intent triggers,
 * scores readiness (0-100), and outputs personalized outreach hooks.
 *
 * Usage:
 *   node scripts/intent-scraper.mjs [path-to-leads.json]
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';

const inputFile = process.argv[2];

const INTENT_SIGNALS = {
  STALLED_JOB: { id: 'SIG-01', name: 'Open Dev Job > 30 Days', weight: 30, hook: 'Saw you have an open role for [role] since [days] days—most founders get bogged down screening resumes rather than shipping.' },
  TECH_MIGRATION: { id: 'SIG-02', name: 'Tech Stack Migration (e.g. Next.js / AI / Supabase)', weight: 25, hook: 'Noticed your team is adopting [tech]—we recently helped a similar team migrate without downtime.' },
  UX_PERFORMANCE: { id: 'SIG-03', name: 'Slow Performance / Mobile UX Friction', weight: 20, hook: 'Ran a quick audit on your web app and spotted a 3.4s LCP delay on the checkout flow.' },
  FUNDING_ANNOUNCEMENT: { id: 'SIG-04', name: 'Recent Seed / Series A Funding', weight: 15, hook: 'Congrats on the recent round! As you scale the product team, keeping release velocity high is critical.' },
  MISSING_INTEGRATION: { id: 'SIG-05', name: 'Missing Key Integration (Stripe, AI, Webhooks)', weight: 10, hook: 'Saw your users requesting [feature] on public forums—we built a drop-in integration for this.' }
};

async function processLeads() {
  let leads = [];

  if (inputFile) {
    const raw = await fs.readFile(path.resolve(inputFile), 'utf8');
    leads = JSON.parse(raw);
  } else {
    // Default sample leads
    leads = [
      {
        company: 'CloudMetrics SaaS',
        website: 'https://cloudmetrics-demo.io',
        contactName: 'Sarah Jenkins',
        contactRole: 'VP of Engineering',
        signals: ['STALLED_JOB', 'TECH_MIGRATION'],
        details: { role: 'Senior Next.js Engineer', daysOpen: 42, tech: 'Next.js App Router & Supabase' }
      },
      {
        company: 'Apex Logistics',
        website: 'https://apex-logistics-demo.com',
        contactName: 'David Vance',
        contactRole: 'Chief Operating Officer',
        signals: ['UX_PERFORMANCE', 'MISSING_INTEGRATION'],
        details: { feature: 'Automated Dispatch Webhooks', issue: 'Manual CSV re-entry' }
      }
    ];
  }

  const scoredLeads = leads.map(lead => {
    let score = 0;
    const activeHooks = [];

    for (const sigKey of lead.signals || []) {
      const signal = INTENT_SIGNALS[sigKey];
      if (signal) {
        score += signal.weight;
        let hookText = signal.hook;
        if (lead.details) {
          for (const [k, v] of Object.entries(lead.details)) {
            hookText = hookText.replace(`[${k}]`, v);
          }
        }
        activeHooks.push({ signal: signal.name, hook: hookText });
      }
    }

    return {
      company: lead.company,
      contact: `${lead.contactName} (${lead.contactRole})`,
      intentScore: Math.min(score, 100),
      priorityTier: score >= 50 ? 'Tier 1 (High Intent - Send Custom Loom)' : 'Tier 2 (Standard Email)',
      recommendedAngle: activeHooks[0]?.hook || 'Custom technical inquiry',
      detectedTriggers: activeHooks
    };
  });

  scoredLeads.sort((a, b) => b.intentScore - a.intentScore);

  console.error(`\n======================================================`);
  console.error(` Developer B2B Distribution Engine - Intent Scorer`);
  console.error(`======================================================`);
  console.error(` Scored ${scoredLeads.length} prospect companies.`);
  console.error(` Tier 1 High-Intent Leads: ${scoredLeads.filter(l => l.intentScore >= 50).length}`);
  console.error(`======================================================\n`);

  return scoredLeads;
}

if (process.argv[1] && process.argv[1].endsWith('intent-scraper.mjs')) {
  processLeads().then(res => {
    console.log(JSON.stringify(res, null, 2));
  }).catch(err => {
    console.error('Error running intent scorer:', err);
    process.exit(1);
  });
}

export { processLeads, INTENT_SIGNALS };
