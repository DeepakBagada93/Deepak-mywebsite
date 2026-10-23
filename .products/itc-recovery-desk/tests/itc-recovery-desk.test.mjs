import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  gstinChecksum,
  isValidGstin,
  parseAmount,
  parseCsv,
  parseDate,
  readTable,
  reconcile,
  writeOutputs
} from '../skills/itc-recovery-desk/scripts/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = path.join(root, 'skills', 'itc-recovery-desk', 'scripts');
const examples = path.join(root, 'examples');
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'itc-recovery-desk-test-'));

async function table(file, source) {
  return readTable(await fs.readFile(path.join(examples, file), 'utf8'), source);
}

async function resultFor(booksFile = 'books.csv', gstr2bFile = 'gstr2b.csv', options = {}) {
  return reconcile(
    await table(booksFile, 'books'),
    await table(gstr2bFile, 'gstr2b'),
    { tolerance: 1, generatedAt: '2026-10-20T00:00:00.000Z', ...options }
  );
}

function run(args) {
  try {
    return {
      status: 0,
      stdout: execFileSync(process.execPath, [path.join(scripts, 'reconcile.mjs'), ...args], {
        cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']
      }),
      stderr: ''
    };
  } catch (error) {
    return {
      status: error.status,
      stdout: error.stdout ? String(error.stdout) : '',
      stderr: error.stderr ? String(error.stderr) : ''
    };
  }
}

test('CSV parser handles quoted commas and CRLF', () => {
  const rows = parseCsv('a,b\r\n"1,000",2\r\n"say ""hi""",3\r\n');
  assert.deepEqual(rows, [['a', 'b'], ['1,000', '2'], ['say "hi"', '3']]);
});

test('amount parser handles Indian commas, currency and parentheses', () => {
  assert.equal(parseAmount('₹1,23,456.78'), 123456.78);
  assert.equal(parseAmount('(1,000.50)'), -1000.5);
  assert.equal(parseAmount(''), null);
  assert.equal(parseAmount('not-a-number'), null);
});

test('date parser supports ISO and Indian formats and rejects impossible dates', () => {
  assert.equal(parseDate('2026-09-03'), '2026-09-03');
  assert.equal(parseDate('03/09/2026'), '2026-09-03');
  assert.equal(parseDate('03-09-2026'), '2026-09-03');
  assert.equal(parseDate('31/02/2026'), null);
  assert.equal(parseDate('not-a-date'), null);
});

test('GSTIN checksum accepts known valid GSTINs and rejects a changed digit', () => {
  assert.equal(gstinChecksum('29AAECS1234F1Z'), 'K');
  assert.equal(isValidGstin('29AAECS1234F1ZK'), true);
  assert.equal(isValidGstin('27AAECS1234F1ZO'), true);
  assert.equal(isValidGstin('29AAECS1234F1Z5'), false);
});

test('clean demo reconciles six of seven invoices and finds the expected difference', async () => {
  const result = await resultFor();
  assert.equal(result.summary.verdict, 'REVIEW REQUIRED');
  assert.equal(result.summary.counts.booksRows, 7);
  assert.equal(result.summary.counts.gstr2bRows, 7);
  assert.equal(result.summary.counts.exactMatched, 4);
  assert.equal(result.summary.counts.valueMismatch, 1);
  assert.equal(result.summary.counts.dateMismatch, 1);
  assert.equal(result.summary.counts.missingIn2B, 1);
  assert.equal(result.summary.counts.missingInBooks, 1);
  assert.equal(result.summary.matchRate, 85.71);
  assert.equal(result.summary.amounts.booksTax, 14400);
  assert.equal(result.summary.amounts.gstr2bTax, 13410);
  assert.equal(result.summary.amounts.itcAtRisk, 1890);
  assert.equal(result.summary.amounts.potentialUnclaimed, 900);
  assert.equal(result.summary.amounts.netDifference, 990);
});

test('tolerance boundary is inclusive at one rupee and fails above it', async () => {
  const books = await table('books.csv', 'books');
  const gstr2b = await table('gstr2b.csv', 'gstr2b');
  gstr2b[0].tax = books[0].tax + 1;
  const within = reconcile(books, gstr2b, { tolerance: 1 });
  assert.equal(within.summary.counts.exactMatched, 4);
  assert.equal(within.summary.counts.valueMismatch, 1);

  const books2 = await table('books.csv', 'books');
  const gstr2b2 = await table('gstr2b.csv', 'gstr2b');
  gstr2b2[0].tax = books2[0].tax + 1.01;
  const outside = reconcile(books2, gstr2b2, { tolerance: 1 });
  assert.equal(outside.summary.counts.valueMismatch, 2);
});

test('missing invoice is reported as ITC at risk', async () => {
  const result = await resultFor();
  const missing = result.exceptions.find((item) => item.type === 'missing_in_2b');
  assert.equal(missing.invoiceNumber, 'INV-1005');
  assert.equal(missing.booksTax, 1800);
  assert.equal(missing.taxDifference, 1800);
});

test('GSTR-2B-only invoice is reported as potential unclaimed ITC', async () => {
  const result = await resultFor();
  const unclaimed = result.exceptions.find((item) => item.type === 'missing_in_books');
  assert.equal(unclaimed.invoiceNumber, 'INV-2001');
  assert.equal(unclaimed.twoBTax, 900);
});

test('value mismatch reports the signed tax difference', async () => {
  const result = await resultFor();
  const mismatch = result.exceptions.find((item) => item.type === 'value_mismatch');
  assert.equal(mismatch.invoiceNumber, 'INV-1006');
  assert.equal(mismatch.taxDifference, 90);
});

test('date mismatch is matched but flagged for review', async () => {
  const result = await resultFor();
  const mismatch = result.exceptions.find((item) => item.type === 'date_mismatch');
  assert.equal(mismatch.invoiceNumber, 'INV-1007');
  const book = result.books.find((item) => item.invoiceNumberRaw === 'INV-1007');
  assert.equal(book.match.status, 'date_mismatch');
});

test('messy fixture detects duplicates and an invalid GSTIN checksum', async () => {
  const result = await resultFor('books-messy.csv', 'gstr2b-messy.csv');
  assert.equal(result.summary.counts.duplicateBooks, 2);
  assert.equal(result.summary.counts.missingIn2B, 2);
  assert.equal(result.summary.amounts.itcAtRisk, 2700);
  assert.equal(result.summary.matchRate, 50);
  assert.ok(result.exceptions.some((item) => item.type === 'invalid_gstin_checksum'));
});

test('writeOutputs creates seven deterministic customer files', async () => {
  const result = await resultFor();
  const out = path.join(tmp, 'outputs');
  const written = await writeOutputs(result, out);
  assert.equal(written.files.length, 7);
  for (const file of written.files) {
    const stat = await fs.stat(path.join(out, file));
    assert.ok(stat.size > 0, `${file} is empty`);
  }
  const atRisk = await fs.readFile(path.join(out, 'itc-at-risk.csv'), 'utf8');
  assert.match(atRisk, /missing_in_2b/);
  const followup = await fs.readFile(path.join(out, 'supplier-followup.csv'), 'utf8');
  assert.match(followup, /29AAECS1234F1ZK/);
});

test('CLI writes outputs and strict mode exits 1 on exceptions', async () => {
  const out = path.join(tmp, 'cli');
  const response = run([
    '--books', 'examples/books.csv',
    '--gstr2b', 'examples/gstr2b.csv',
    '--out', out,
    '--period', '2026-09',
    '--now', '2026-10-20T00:00:00.000Z',
    '--strict'
  ]);
  assert.equal(response.status, 1);
  assert.match(response.stdout, /Potential ITC at risk/);
  const summary = JSON.parse(await fs.readFile(path.join(out, 'summary.json'), 'utf8'));
  assert.equal(summary.verdict, 'REVIEW REQUIRED');
});

test('CLI non-strict mode exits 0 even when exceptions exist', async () => {
  const out = path.join(tmp, 'cli-non-strict');
  const response = run([
    '--books', 'examples/books.csv',
    '--gstr2b', 'examples/gstr2b.csv',
    '--out', out,
    '--now', '2026-10-20T00:00:00.000Z'
  ]);
  assert.equal(response.status, 0);
});

test('missing required columns produce a clear input error', () => {
  assert.throws(
    () => readTable('invoice_no,date\n1,2026-09-01\n', 'books'),
    /missing required column "supplier_gstin"/
  );
});
