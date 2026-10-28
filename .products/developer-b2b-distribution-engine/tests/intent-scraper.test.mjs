#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[1], '../../');
const scraperScript = path.join(root, 'scripts', 'intent-scraper.mjs');
const sampleData = path.join(root, 'examples', 'agency-pitch-pack', 'raw-lead-data.json');

test('Intent Scorer CLI Functional Verification', async (t) => {
  await t.test('intent scraper parses and scores leads accurately', () => {
    const stdout = execFileSync('node', [scraperScript, sampleData], { encoding: 'utf8' });
    const leads = JSON.parse(stdout);

    assert.ok(Array.isArray(leads), 'Output should be an array of scored leads');
    assert.strictEqual(leads.length, 2, 'Should process exactly 2 leads');

    const topLead = leads[0];
    assert.strictEqual(topLead.company, 'SaaSMetrics Inc');
    assert.strictEqual(topLead.intentScore, 55);
    assert.match(topLead.priorityTier, /Tier 1/);
    assert.match(topLead.recommendedAngle, /Senior Fullstack Engineer/);
  });
});
