import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  priceOffer,
  priceBreakdown,
  netFactor,
  nextPsychPrice,
  previousPsychPrice,
  auditOfferPage,
  GSTIN_PATTERN
} from '../skills/india-offer-pricing-kit/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));

test('single product ladder keeps every tier above the floor', async () => {
  const pricing = priceOffer(await load('examples/economics.single.json'));
  assert.deepEqual(pricing.tiers.map((tier) => tier.price), [1499, 3499, 6999]);
  for (const tier of pricing.tiers) assert.ok(tier.netRevenue >= 1000, tier.name);
  assert.equal(pricing.tiers[1].netRevenue, 2895.27);
  assert.equal(pricing.launchPrice, 999);
});

test('GST and gateway maths match the stated model', () => {
  assert.ok(Math.abs(netFactor(18, 2, 18) - 0.8275) < 0.001);
  const breakdown = priceBreakdown(1499, { gstRate: 18, gatewayFeePct: 2, feeGstPercent: 18 });
  assert.equal(breakdown.gst, 228.66);
  assert.equal(breakdown.gatewayFee, 29.98);
  assert.equal(breakdown.netRevenue, 1240.36);
});

test('ad economics use the advertised price and compute break-even CPA', async () => {
  const pricing = priceOffer(await load('examples/economics.single.json'));
  assert.equal(pricing.economics.breakEvenCPA, 1240.36);
  assert.equal(pricing.economics.breakEvenROAS, 1.21);
  assert.equal(pricing.economics.roas, 1.66);
  assert.equal(pricing.economics.verdict, 'PROFITABLE TEST');
  assert.equal(pricing.economics.clicks, 1667);
});

test('bundle pricing lands on a psychological point with a real discount', async () => {
  const pricing = priceOffer(await load('examples/economics.bundle.json'));
  assert.equal(pricing.bundlePrice, 2999);
  assert.ok(pricing.bundleSavingPct >= 15);
  assert.equal(pricing.launchPrice, 1999);
  assert.equal(pricing.tiers[0].price, 2999);
  assert.equal(pricing.warnings.length, 0);
});

test('psychological price helpers round in both directions', () => {
  assert.equal(nextPsychPrice(1087), 1199);
  assert.equal(nextPsychPrice(1200), 1299);
  assert.equal(previousPsychPrice(3227), 2999);
  assert.equal(previousPsychPrice(50), 99);
});

test('GSTIN validation accepts a well-formed number and rejects junk', () => {
  assert.ok(GSTIN_PATTERN.test('24ABCDE1234F1Z5'));
  assert.ok(!GSTIN_PATTERN.test('INVALID123'));
});

test('clean offer page scores 100 and refund wording is not treated as a guarantee claim', async () => {
  const result = auditOfferPage(await load('examples/offer-page.clean.json'));
  assert.equal(result.summary.score, 100);
  assert.equal(result.summary.verdict, 'READY TO SELL');
  assert.ok(!result.findings.some((finding) => finding.code === 'CLAIM_GUARANTEE'));
});

test('non-compliant page is blocked for GST, dark patterns and claims', async () => {
  const result = auditOfferPage(await load('examples/offer-page.fixture.json'));
  const codes = result.findings.map((finding) => finding.code);
  for (const code of [
    'OFFER_GST_EXCLUSIVE', 'DARK_FALSE_URGENCY', 'CLAIM_INCOME',
    'CLAIM_GUARANTEE', 'OFFER_NO_REFUND', 'OFFER_NO_CONTACT', 'OFFER_NO_CTA'
  ]) assert.ok(codes.includes(code), code);
  assert.equal(result.summary.verdict, 'DO NOT LAUNCH');
  assert.equal(result.summary.score, 0);
});
