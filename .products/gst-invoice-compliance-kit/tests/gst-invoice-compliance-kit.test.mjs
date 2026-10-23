import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  auditInvoice,
  auditBatch,
  amountToWords,
  gstinChecksum,
  hsnBandLabel,
  hsnDigitsRequired,
  isValidGstin,
  parseInvoiceDate,
  summarise
} from '../skills/gst-invoice-compliance-kit/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = path.join(root, 'skills', 'gst-invoice-compliance-kit', 'scripts');
const examples = path.join(root, 'examples');
const TODAY = '2026-10-20';
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'gst-kit-test-'));

const load = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));
const clone = (value) => structuredClone(value);
const codes = (result) => result.findings.map((finding) => finding.code);
const finding = (result, code) => result.findings.find((item) => item.code === code);

const clean = await load('examples/invoice.clean.json');
const broken = await load('examples/invoice.fixture.json');

function audit(invoice, options = {}) {
  return auditInvoice(invoice, { today: TODAY, ...options });
}

function run(script, args) {
  try {
    const stdout = execFileSync(process.execPath, [path.join(scripts, script), ...args], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
    });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      status: error.status,
      stdout: error.stdout ? String(error.stdout) : '',
      stderr: error.stderr ? String(error.stderr) : ''
    };
  }
}

function b2b(invoice) {
  const copy = clone(invoice);
  copy.recipient.gstin = '27AAECS1234F1ZO';
  copy.recipient.stateCode = '27';
  copy.placeOfSupply = '27-Maharashtra';
  return copy;
}

test('clean invoice scores 100 with no findings', () => {
  const result = audit(clean);
  assert.equal(result.summary.score, 100);
  assert.equal(result.summary.verdict, 'READY TO ISSUE');
  assert.deepEqual(result.summary.counts, { critical: 0, high: 0, medium: 0, low: 0 });
  assert.equal(result.findings.length, 0);
  assert.equal(result.context.eInvoiceRequired, false);
  assert.equal(result.context.supplyType, 'intra-state');
});

test('broken fixture is blocked with the expected critical codes', () => {
  const result = audit(broken);
  const found = codes(result);
  for (const code of ['SUP_GSTIN_INVALID', 'TAX_SPLIT_WRONG', 'GRAND_TOTAL_MISMATCH', 'EINV_IRN_MISSING']) {
    assert.ok(found.includes(code), `missing ${code}; got ${found.join(', ')}`);
  }
  assert.equal(result.summary.verdict, 'DO NOT ISSUE');
  assert.ok(result.summary.score < 50);
});

test('GSTIN validation applies the real 15-character checksum', () => {
  assert.equal(gstinChecksum('29AAECS1234F1Z'), 'K');
  assert.equal(isValidGstin('29AAECS1234F1ZK'), true);
  assert.equal(isValidGstin('27AAECS1234F1ZO'), true);
  assert.equal(isValidGstin('29AAECS1234F1Z5'), false);
  assert.equal(isValidGstin('29AAECS1234F1ZZ'), false);
  assert.equal(isValidGstin('not-a-gstin'), false);

  const badSupplier = clone(clean);
  badSupplier.supplier.gstin = '29AAECS1234F1Z5';
  assert.equal(finding(audit(badSupplier), 'SUP_GSTIN_CHECKSUM').severity, 'critical');

  const badRecipient = b2b(clean);
  badRecipient.recipient.gstin = '27AAECS1234F1ZX';
  const result = audit(badRecipient);
  assert.equal(finding(result, 'REC_GSTIN_CHECKSUM').severity, 'high');
});

test('intra-state supply charged with IGST is critical', () => {
  const invoice = clone(clean);
  invoice.lines[0].cgst = 0;
  invoice.lines[0].sgst = 0;
  invoice.lines[0].igst = 24.9;
  const result = audit(invoice);
  assert.equal(finding(result, 'TAX_SPLIT_WRONG').severity, 'critical');
});

test('inter-state supply charged with CGST/SGST is critical', () => {
  const invoice = b2b(clean);
  const result = audit(invoice);
  assert.equal(finding(result, 'TAX_SPLIT_WRONG').severity, 'critical');
});

test('HSN bands require 4 or 6 digits and do not mandate 8', () => {
  assert.equal(hsnDigitsRequired(4200000), 4);
  assert.equal(hsnDigitsRequired(50000000), 4);
  assert.equal(hsnDigitsRequired(50000001), 6);
  assert.equal(hsnDigitsRequired(500000000), 6);
  assert.equal(hsnDigitsRequired(900000000), 6);
  assert.equal(hsnBandLabel(60000000), 'AATO above ₹5 crore');
  assert.equal(hsnDigitsRequired(null), null);
  assert.equal(hsnDigitsRequired(''), null);
  assert.equal(hsnBandLabel(undefined), 'AATO not provided');
});

test('HSN depth is enforced against 4 versus 6 digit bands', () => {
  const four = clone(clean);
  assert.ok(!codes(audit(four, { aato: 4200000 })).includes('HSN_DIGITS'));

  const shortAtSix = clone(clean);
  const short = audit(shortAtSix, { aato: 60000000 });
  assert.equal(finding(short, 'HSN_DIGITS').severity, 'high');

  const six = clone(clean);
  six.lines[0].hsn = '190501';
  assert.ok(!codes(audit(six, { aato: 60000000 })).includes('HSN_DIGITS'));

  const five = clone(clean);
  five.lines[0].hsn = '19050';
  assert.equal(finding(audit(five), 'HSN_DIGITS').severity, 'high');

  const eight = clone(clean);
  eight.lines[0].hsn = '19050123';
  const eightResult = audit(eight, { aato: 600000000 });
  assert.equal(finding(eightResult, 'HSN_DIGITS').severity, 'medium');
});

test('missing HSN is medium only for small B2C suppliers and critical otherwise', () => {
  const b2cSmall = clone(clean);
  delete b2cSmall.lines[0].hsn;
  assert.equal(finding(audit(b2cSmall, { aato: 4200000 }), 'LINE_NO_HSN').severity, 'medium');

  const b2bSmall = b2b(clean);
  delete b2bSmall.lines[0].hsn;
  assert.equal(finding(audit(b2bSmall, { aato: 4200000 }), 'LINE_NO_HSN').severity, 'critical');

  const b2cLarge = clone(clean);
  delete b2cLarge.lines[0].hsn;
  assert.equal(finding(audit(b2cLarge, { aato: 60000000 }), 'LINE_NO_HSN').severity, 'critical');

  const unknownAato = clone(clean);
  delete unknownAato.business.aato;
  delete unknownAato.lines[0].hsn;
  const unknownResult = audit(unknownAato);
  assert.equal(unknownResult.context.aato, null);
  assert.equal(finding(unknownResult, 'LINE_NO_HSN').severity, 'critical');
});

test('e-invoicing applies to B2B but not domestic B2C', () => {
  const b2c = clone(clean);
  b2c.business.aato = 60000000;
  const b2cResult = audit(b2c);
  assert.equal(b2cResult.context.eInvoiceRequired, false);
  assert.ok(!codes(b2cResult).includes('EINV_IRN_MISSING'));

  const b2bInvoice = b2b(clean);
  b2bInvoice.business.aato = 60000000;
  const b2bResult = audit(b2bInvoice);
  assert.equal(b2bResult.context.eInvoiceRequired, true);
  assert.equal(finding(b2bResult, 'EINV_IRN_MISSING').severity, 'critical');

  const atThreshold = b2b(clean);
  atThreshold.business.aato = 50000000;
  const atThresholdResult = audit(atThreshold);
  assert.equal(atThresholdResult.context.eInvoiceRequired, false);
  assert.ok(!codes(atThresholdResult).includes('EINV_IRN_MISSING'));
});

test('the 30-day IRP window is enforced for AATO of ₹10 crore or more', () => {
  const old = b2b(clean);
  old.business.aato = 120000000;
  old.invoiceDate = '2026-08-01';
  const oldResult = audit(old);
  assert.equal(finding(oldResult, 'EINV_WINDOW_CLOSED').severity, 'high');

  const recent = b2b(clean);
  recent.business.aato = 120000000;
  recent.invoiceDate = '2026-10-01';
  assert.ok(!codes(audit(recent)).includes('EINV_WINDOW_CLOSED'));
});

test('e-way bill requires goods and a total strictly greater than ₹50,000', () => {
  const exact = clone(clean);
  exact.grandTotal = 50000;
  assert.ok(!codes(audit(exact)).includes('EWAY_MISSING'));

  const above = clone(clean);
  above.grandTotal = 50001;
  const result = audit(above);
  assert.equal(finding(result, 'EWAY_MISSING').severity, 'medium');

  const service = clone(clean);
  service.lines[0].sac = '998313';
  delete service.lines[0].hsn;
  service.grandTotal = 60000;
  assert.ok(!codes(audit(service)).includes('EWAY_MISSING'));
});

test('amount in words tolerates Rupees/Rupee, punctuation and a trailing Only', () => {
  for (const words of [
    'Five Hundred Twenty Two Rupees and Ninety Paise Only',
    'FIVE HUNDRED TWENTY TWO RUPEE AND NINETY PAISE.',
    'Five Hundred Twenty Two Rupees, and Ninety Paise'
  ]) {
    const invoice = clone(clean);
    invoice.amountInWords = words;
    assert.ok(!codes(audit(invoice)).includes('AMOUNT_IN_WORDS_MISMATCH'), words);
  }

  const wrong = clone(clean);
  wrong.amountInWords = 'Five Hundred Twenty Two Rupees and Ninety One Paise Only';
  assert.equal(finding(audit(wrong), 'AMOUNT_IN_WORDS_MISMATCH').severity, 'high');
});

test('dates parse deterministically and impossible dates are rejected', () => {
  assert.equal(parseInvoiceDate('2026-10-20'), '2026-10-20');
  assert.equal(parseInvoiceDate('20/10/2026'), '2026-10-20');
  assert.equal(parseInvoiceDate('20-10-2026'), '2026-10-20');
  assert.equal(parseInvoiceDate('2026/10/20'), '2026-10-20');
  assert.equal(parseInvoiceDate('29/02/2024'), '2024-02-29');
  assert.equal(parseInvoiceDate('31/02/2026'), null);
  assert.equal(parseInvoiceDate('2026-02-29'), null);
  assert.equal(parseInvoiceDate('not a date'), null);

  const future = clone(clean);
  future.invoiceDate = '2026-12-01';
  assert.equal(finding(audit(future), 'INV_FUTURE_DATE').severity, 'high');

  const impossible = clone(clean);
  impossible.invoiceDate = '31/02/2026';
  assert.equal(finding(audit(impossible), 'INV_BAD_DATE').severity, 'high');
});

test('invoice numbers longer than 16 characters are high findings', () => {
  const invoice = clone(clean);
  invoice.invoiceNumber = 'INV-2026-0123456789';
  assert.ok(invoice.invoiceNumber.length > 16);
  assert.equal(finding(audit(invoice), 'INV_NUMBER_TOO_LONG').severity, 'high');
});

test('place of supply missing, unknown or conflicting is a high finding', () => {
  const missing = clone(clean);
  delete missing.placeOfSupply;
  assert.equal(finding(audit(missing), 'POS_MISSING').severity, 'high');

  const unknown = clone(clean);
  unknown.placeOfSupply = '99-Atlantis';
  assert.equal(finding(audit(unknown), 'POS_UNKNOWN').severity, 'high');

  const conflict = clone(clean);
  conflict.placeOfSupply = '27-Maharashtra';
  assert.equal(finding(audit(conflict), 'POS_MISMATCH').severity, 'high');
});

test('B2C invoices with only a place of supply still resolve the tax split', () => {
  const invoice = clone(clean);
  delete invoice.recipient.stateCode;
  const result = audit(invoice);
  assert.equal(result.context.supplyType, 'intra-state');
  assert.equal(result.context.recipientState, '29');
  assert.ok(!codes(result).includes('TAX_SPLIT_UNVERIFIED'));
});

test('notified special rates are informational, not high', () => {
  const invoice = clone(clean);
  invoice.lines[0].gstRate = 0.25;
  invoice.lines[0].cgst = 0.62;
  invoice.lines[0].sgst = 0.62;
  invoice.lines[0].igst = 0;
  invoice.lines[0].total = 499.24;
  invoice.totalTaxableValue = 498;
  invoice.totalTax = 1.24;
  invoice.grandTotal = 499.24;
  invoice.amountInWords = 'Four Hundred Ninety Nine Rupees and Twenty Four Paise Only';
  const result = audit(invoice);
  const special = finding(result, 'RATE_SPECIAL');
  assert.equal(special.severity, 'low');
  assert.ok(!codes(result).includes('RATE_INVALID'));
});

test('summarise recomputes counts, score and verdict from findings', () => {
  const summary = summarise([
    { severity: 'critical' },
    { severity: 'critical' },
    { severity: 'high' },
    { severity: 'medium' },
    { severity: 'low' }
  ]);
  assert.deepEqual(summary.counts, { critical: 2, high: 1, medium: 1, low: 1 });
  assert.equal(summary.score, 40);
  assert.equal(summary.verdict, 'DO NOT ISSUE');
});

test('batch groups three duplicates into one finding per invoice with the right count', () => {
  const result = auditBatch([clone(clean), clone(clean), clone(clean)], {
    today: TODAY,
    now: '2026-10-20T00:00:00.000Z'
  });
  assert.equal(result.duplicates.length, 1);
  assert.equal(result.duplicates[0].number, 'INV-2026-0142');
  assert.equal(result.duplicates[0].count, 3);
  assert.deepEqual(result.duplicates[0].indexes, [0, 1, 2]);
  for (const invoice of result.invoices) {
    const duplicates = invoice.findings.filter((item) => item.code === 'DUP_INVOICE_NUMBER');
    assert.equal(duplicates.length, 1);
    assert.match(duplicates[0].message, /appears on 3 invoices/);
    assert.deepEqual(invoice.summary.counts, { critical: 1, high: 0, medium: 0, low: 0 });
    assert.equal(invoice.summary.score, 80);
    assert.equal(invoice.summary.verdict, 'FIX BEFORE ISSUING');
  }
});

test('batch checkedAt is deterministic when now is supplied', () => {
  const first = auditBatch([clone(clean)], { today: TODAY, now: '2026-10-20T00:00:00.000Z' });
  const second = auditBatch([clone(clean)], { today: TODAY, now: '2026-10-20T00:00:00.000Z' });
  assert.equal(first.checkedAt, '2026-10-20T00:00:00.000Z');
  assert.deepEqual(first, second);
});

test('amountToWords covers Indian numbering and paise-only values', () => {
  const cases = {
    0: 'Zero Rupees Only',
    1: 'One Rupee Only',
    100: 'One Hundred Rupees Only',
    100000: 'One Lakh Rupees Only',
    10000000: 'One Crore Rupees Only',
    522.9: 'Five Hundred Twenty Two Rupees and Ninety Paise Only',
    0.75: 'Zero Rupees and Seventy Five Paise Only'
  };
  for (const [input, expected] of Object.entries(cases)) {
    assert.equal(amountToWords(Number(input)), expected, input);
  }
});

test('hsn lookup CLI reports 4 and 6 digit bands without an 8-digit claim', () => {
  const small = run('hsn-lookup.mjs', ['software development', '--aato=6000000']);
  assert.equal(small.status, 0, small.stderr);
  assert.match(small.stdout, /needs \*\*4 digits\*\*/);

  const large = run('hsn-lookup.mjs', ['software development', '--aato=60000000']);
  assert.equal(large.status, 0, large.stderr);
  assert.match(large.stdout, /needs \*\*6 digits\*\*/);
  assert.ok(!/needs \*\*8 digits\*\*/.test(large.stdout));
  assert.match(large.stdout, /Notification 78\/2020/);
});

test('CLI strict and batch exit codes are stable', async () => {
  const cleanRun = run('audit-invoice.mjs', ['examples/invoice.clean.json', `--today=${TODAY}`, '--strict']);
  assert.equal(cleanRun.status, 0, cleanRun.stderr);

  const brokenRun = run('audit-invoice.mjs', ['examples/invoice.fixture.json', `--today=${TODAY}`, '--strict']);
  assert.equal(brokenRun.status, 1);

  const batchRun = run('batch-audit.mjs', [
    'examples/invoices.batch.json', `--today=${TODAY}`, '--now=2026-10-20T00:00:00.000Z'
  ]);
  assert.equal(batchRun.status, 1);

  const badInput = run('audit-invoice.mjs', [path.join(tmp, 'missing.json')]);
  assert.equal(badInput.status, 2);

  const jsonPath = path.join(tmp, 'audit.json');
  const jsonRun = run('audit-invoice.mjs', [
    'examples/invoice.clean.json', `--today=${TODAY}`, '--strict', `--json=${jsonPath}`
  ]);
  assert.equal(jsonRun.status, 0, jsonRun.stderr);
  const report = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  assert.equal(report.summary.score, 100);
});

after(async () => {
  await fs.rm(tmp, { recursive: true, force: true });
});
