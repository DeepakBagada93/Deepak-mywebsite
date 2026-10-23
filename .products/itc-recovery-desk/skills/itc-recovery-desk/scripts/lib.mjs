import { promises as fs } from 'node:fs';
import path from 'node:path';

export const PRODUCT = 'ITC Recovery Desk';
export const VERSION = '1.0.0';
export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const FIELD_ALIASES = {
  supplierGstin: [
    'supplier_gstin', 'supplier gstin', 'supplier_gstin_no', 'supplier gstin no',
    'gstin', 'gstin_no', 'gstin no', 'supplier_gstin_number'
  ],
  invoiceNumber: [
    'invoice_number', 'invoice number', 'invoice_no', 'invoice no', 'document_number',
    'document number', 'document_no', 'document no', 'bill_number', 'bill number',
    'bill_no', 'bill no', 'voucher_number', 'voucher number', 'voucher_no', 'voucher no'
  ],
  invoiceDate: [
    'invoice_date', 'invoice date', 'document_date', 'document date', 'bill_date',
    'bill date', 'date'
  ],
  taxableValue: [
    'taxable_value', 'taxable value', 'taxable_amount', 'taxable amount', 'taxable',
    'value'
  ],
  igst: ['igst', 'igst_amount', 'igst amount'],
  cgst: ['cgst', 'cgst_amount', 'cgst amount'],
  sgst: ['sgst', 'sgst_amount', 'sgst amount'],
  cess: ['cess', 'cess_amount', 'cess amount'],
  total: [
    'total', 'invoice_total', 'invoice total', 'grand_total', 'grand total',
    'total_amount', 'total amount', 'invoice_value', 'invoice value'
  ],
  itcAvailable: ['itc_available', 'itc available', 'itc_availability', 'itc availability'],
  returnPeriod: ['return_period', 'return period', 'tax_period', 'tax period', 'period']
};

const ALIAS_LOOKUP = Object.fromEntries(
  Object.entries(FIELD_ALIASES).map(([field, aliases]) => [
    field,
    new Set(aliases.map((alias) => normalizeHeader(alias)))
  ])
);

const REQUIRED_FIELDS = ['supplierGstin', 'invoiceNumber', 'invoiceDate', 'taxableValue'];
const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };

export function normalizeHeader(value) {
  return String(value ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function parseCsv(text) {
  const source = String(text ?? '').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (inQuotes) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (inQuotes) throw new Error('CSV has an unterminated quoted field.');
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => String(cell).trim() !== ''));
}

export function readTable(text, source) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error(`${source}: expected a header row and at least one data row.`);
  const headers = rows[0].map(normalizeHeader);
  const indexes = {};
  for (const field of Object.keys(FIELD_ALIASES)) {
    const index = headers.findIndex((header) => ALIAS_LOOKUP[field].has(header));
    if (index >= 0) indexes[field] = index;
  }
  for (const field of REQUIRED_FIELDS) {
    if (indexes[field] === undefined) {
      throw new Error(
        `${source}: missing required column "${FIELD_ALIASES[field][0]}". ` +
        `Found headers: ${headers.filter(Boolean).join(', ')}`
      );
    }
  }
  return rows.slice(1).map((cells, offset) =>
    normalizeRecord(cells, indexes, source, offset + 2)
  );
}

export function gstinChecksum(gstin) {
  const value = String(gstin ?? '').toUpperCase().trim();
  if (value.length !== 14 && value.length !== 15) return null;
  let sum = 0;
  for (let index = 0; index < 14; index += 1) {
    const digit = BASE36.indexOf(value[index]);
    if (digit < 0) return null;
    const factor = index % 2 === 0 ? 1 : 2;
    const product = digit * factor;
    sum += Math.floor(product / 36) + (product % 36);
  }
  return BASE36[(36 - (sum % 36)) % 36];
}

export function isValidGstin(gstin) {
  const value = normalizeGstin(gstin);
  if (!GSTIN_PATTERN.test(value)) return false;
  return gstinChecksum(value) === value[14];
}

export function normalizeGstin(value) {
  return String(value ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '');
}

export function normalizeInvoiceNumber(value) {
  return String(value ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '');
}

export function parseAmount(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? round2(value) : null;
  let text = String(value).trim();
  if (!text || text === '-') return null;
  let negative = false;
  if (/^\(.*\)$/.test(text)) {
    negative = true;
    text = text.slice(1, -1);
  }
  text = text.replace(/[₹$,\s]/g, '').replace(/[A-Za-z]/g, '');
  if (text.startsWith('-')) {
    negative = true;
    text = text.slice(1);
  }
  if (!/^\d+(\.\d+)?$/.test(text)) return null;
  const number = Number(text);
  if (!Number.isFinite(number)) return null;
  return round2(negative ? -number : number);
}

export function parseDate(value) {
  const text = String(value ?? '').trim();
  if (!text) return null;
  let year;
  let month;
  let day;
  let match = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (match) {
    [, year, month, day] = match;
  } else {
    match = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (!match) return null;
    [, day, month, year] = match;
  }
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d
  ) return null;
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function valueAt(cells, indexes, field) {
  const index = indexes[field];
  return index === undefined ? '' : String(cells[index] ?? '').trim();
}

export function normalizeRecord(cells, indexes, source, rowNumber) {
  const gstinRaw = valueAt(cells, indexes, 'supplierGstin');
  const gstin = normalizeGstin(gstinRaw);
  const invoiceNumberRaw = valueAt(cells, indexes, 'invoiceNumber');
  const invoiceNumber = normalizeInvoiceNumber(invoiceNumberRaw);
  const invoiceDateRaw = valueAt(cells, indexes, 'invoiceDate');
  const invoiceDate = parseDate(invoiceDateRaw);
  const taxableValue = parseAmount(valueAt(cells, indexes, 'taxableValue'));
  const igst = parseAmount(valueAt(cells, indexes, 'igst')) ?? 0;
  const cgst = parseAmount(valueAt(cells, indexes, 'cgst')) ?? 0;
  const sgst = parseAmount(valueAt(cells, indexes, 'sgst')) ?? 0;
  const cess = parseAmount(valueAt(cells, indexes, 'cess')) ?? 0;
  const totalProvided = parseAmount(valueAt(cells, indexes, 'total'));
  const tax = round2(igst + cgst + sgst + cess);
  const computedTotal = taxableValue === null ? null : round2(taxableValue + tax);
  const total = totalProvided === null ? computedTotal : totalProvided;
  const issues = [];

  if (!gstin) {
    issues.push({
      type: 'missing_gstin', severity: 'critical',
      message: 'Supplier GSTIN is missing.',
      action: 'Add the supplier GSTIN before reconciling this row.'
    });
  } else if (!GSTIN_PATTERN.test(gstin)) {
    issues.push({
      type: 'invalid_gstin', severity: 'medium',
      message: `Supplier GSTIN "${gstinRaw}" is not a 15-character GSTIN.`,
      action: 'Correct the GSTIN from the supplier document; matching may fail.'
    });
  } else if (!isValidGstin(gstin)) {
    issues.push({
      type: 'invalid_gstin_checksum', severity: 'medium',
      message: `Supplier GSTIN "${gstin}" has an invalid check digit.`,
      action: 'Correct the GSTIN from the supplier document; matching may fail.'
    });
  }
  if (!invoiceNumber) {
    issues.push({
      type: 'missing_invoice_number', severity: 'high',
      message: 'Invoice number is missing.',
      action: 'Add the invoice number so the row can be matched reliably.'
    });
  }
  if (!invoiceDate) {
    issues.push({
      type: 'invalid_date', severity: 'high',
      message: invoiceDateRaw ? `Invoice date "${invoiceDateRaw}" is not a valid date.` : 'Invoice date is missing.',
      action: 'Use YYYY-MM-DD, DD/MM/YYYY or DD-MM-YYYY.'
    });
  }
  if (taxableValue === null) {
    issues.push({
      type: 'missing_taxable_value', severity: 'critical',
      message: 'Taxable value is missing or not a number.',
      action: 'Add a numeric taxable value before reconciling this row.'
    });
  }
  if (totalProvided !== null && computedTotal !== null && Math.abs(totalProvided - computedTotal) > 0.02) {
    issues.push({
      type: 'total_mismatch', severity: 'medium',
      message: `Invoice total ${totalProvided.toFixed(2)} does not equal taxable value plus tax ${computedTotal.toFixed(2)}.`,
      action: 'Correct the total or the tax columns in the source export.'
    });
  }
  if ((taxableValue !== null && taxableValue < 0) || tax < 0) {
    issues.push({
      type: 'negative_amount', severity: 'high',
      message: 'Taxable value or tax is negative.',
      action: 'Confirm whether this is a credit note; the v1 matcher expects invoices.'
    });
  }

  const invalidRow = !gstin || !invoiceNumber || !invoiceDate || taxableValue === null;
  return {
    id: `${source}:${rowNumber}`,
    source,
    rowNumber,
    gstin,
    gstinRaw,
    invoiceNumber,
    invoiceNumberRaw,
    invoiceDate,
    invoiceDateRaw,
    taxableValue: taxableValue ?? 0,
    igst,
    cgst,
    sgst,
    cess,
    tax,
    total: total ?? 0,
    itcAvailable: valueAt(cells, indexes, 'itcAvailable'),
    returnPeriod: valueAt(cells, indexes, 'returnPeriod'),
    issues,
    invalidRow,
    match: null
  };
}

function amountsClose(book, twoB, tolerance) {
  return (
    Math.abs(book.taxableValue - twoB.taxableValue) <= tolerance &&
    Math.abs(book.tax - twoB.tax) <= tolerance
  );
}

function exceptionFor(type, severity, book, twoB, message, action, taxDifference = 0) {
  return {
    type,
    severity,
    supplierGstin: book?.gstin || twoB?.gstin || '',
    invoiceNumber: book?.invoiceNumberRaw || twoB?.invoiceNumberRaw || '',
    invoiceDate: book?.invoiceDate || twoB?.invoiceDate || '',
    booksTaxable: book?.taxableValue ?? null,
    twoBTaxable: twoB?.taxableValue ?? null,
    booksTax: book?.tax ?? null,
    twoBTax: twoB?.tax ?? null,
    taxDifference: round2(taxDifference),
    message,
    action,
    sourceRow: book ? `${book.source}:${book.rowNumber}` : `${twoB.source}:${twoB.rowNumber}`
  };
}

function rowIssuesToExceptions(records) {
  const exceptions = [];
  for (const record of records) {
    for (const issue of record.issues) {
      exceptions.push({
        type: issue.type,
        severity: issue.severity,
        supplierGstin: record.gstin,
        invoiceNumber: record.invoiceNumberRaw,
        invoiceDate: record.invoiceDate || record.invoiceDateRaw,
        booksTaxable: record.source === 'books' ? record.taxableValue : null,
        twoBTaxable: record.source === 'gstr2b' ? record.taxableValue : null,
        booksTax: record.source === 'books' ? record.tax : null,
        twoBTax: record.source === 'gstr2b' ? record.tax : null,
        taxDifference: 0,
        message: issue.message,
        action: issue.action,
        sourceRow: `${record.source}:${record.rowNumber}`
      });
    }
  }
  return exceptions;
}

function duplicateExceptions(records, source) {
  const groups = new Map();
  for (const record of records) {
    if (record.invalidRow || !record.gstin || !record.invoiceNumber) continue;
    const key = `${record.gstin}|${record.invoiceNumber}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  const exceptions = [];
  const flagged = new Set();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const record of group) {
      flagged.add(record.id);
      exceptions.push(exceptionFor(
        `duplicate_in_${source}`,
        'medium',
        source === 'books' ? record : null,
        source === 'gstr2b' ? record : null,
        `${group.length} rows share supplier GSTIN and invoice number ${record.invoiceNumberRaw}.`,
        'Confirm only one invoice is genuine before claiming ITC.'
      ));
    }
  }
  return { exceptions, flagged };
}

function matchMap(records, keyFn) {
  const map = new Map();
  for (const record of records) {
    if (record.invalidRow) continue;
    const key = keyFn(record);
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(record);
  }
  return map;
}

export function reconcile(books, gstr2b, options = {}) {
  const tolerance = Number.isFinite(Number(options.tolerance)) ? Number(options.tolerance) : 1;
  const used = new Set();
  const exceptions = [];
  const booksValid = books.filter((record) => !record.invalidRow);
  const gstr2bValid = gstr2b.filter((record) => !record.invalidRow);

  exceptions.push(...rowIssuesToExceptions(books));
  exceptions.push(...rowIssuesToExceptions(gstr2b));

  const bookDuplicates = duplicateExceptions(books, 'books');
  const gstr2bDuplicates = duplicateExceptions(gstr2b, 'gstr2b');
  exceptions.push(...bookDuplicates.exceptions, ...gstr2bDuplicates.exceptions);

  const exactMap = matchMap(gstr2b, (record) =>
    `${record.gstin}|${record.invoiceNumber}|${record.invoiceDate}`
  );

  for (const book of booksValid) {
    const key = `${book.gstin}|${book.invoiceNumber}|${book.invoiceDate}`;
    const candidates = (exactMap.get(key) || []).filter((record) => !used.has(record.id));
    if (!candidates.length) continue;
    const twoB = candidates[0];
    used.add(twoB.id);
    if (amountsClose(book, twoB, tolerance)) {
      book.match = { status: 'exact', twoB };
      twoB.match = { status: 'exact', book };
    } else {
      book.match = { status: 'value_mismatch', twoB };
      twoB.match = { status: 'value_mismatch', book };
      const difference = round2(book.tax - twoB.tax);
      exceptions.push(exceptionFor(
        'value_mismatch',
        'high',
        book,
        twoB,
        `Invoice ${book.invoiceNumberRaw} matches on GSTIN, invoice number and date, but taxable value or tax differs.`,
        difference > 0
          ? 'Ask the supplier to confirm or amend GSTR-1; the purchase register claims more tax than GSTR-2B.'
          : 'Check the purchase register; GSTR-2B shows more tax than the books record.',
        difference
      ));
    }
  }

  const noDateMap = matchMap(gstr2b, (record) => `${record.gstin}|${record.invoiceNumber}`);
  for (const book of booksValid) {
    if (book.match) continue;
    const key = `${book.gstin}|${book.invoiceNumber}`;
    const candidates = (noDateMap.get(key) || []).filter((record) => !used.has(record.id));
    if (!candidates.length) continue;
    const twoB = candidates[0];
    used.add(twoB.id);
    if (amountsClose(book, twoB, tolerance)) {
      book.match = { status: 'date_mismatch', twoB };
      twoB.match = { status: 'date_mismatch', book };
      exceptions.push(exceptionFor(
        'date_mismatch',
        'medium',
        book,
        twoB,
        `Invoice ${book.invoiceNumberRaw} matches on GSTIN and invoice number, but the dates differ (${book.invoiceDate} vs ${twoB.invoiceDate}).`,
        'Confirm the invoice date with the supplier; review whether the difference changes the return period.'
      ));
    } else {
      book.match = { status: 'value_mismatch', twoB };
      twoB.match = { status: 'value_mismatch', book };
      const difference = round2(book.tax - twoB.tax);
      exceptions.push(exceptionFor(
        'value_mismatch',
        'high',
        book,
        twoB,
        `Invoice ${book.invoiceNumberRaw} matches on GSTIN and invoice number, but the date and amounts differ.`,
        difference > 0
          ? 'Ask the supplier to confirm or amend GSTR-1; the purchase register claims more tax than GSTR-2B.'
          : 'Check the purchase register and the return period; GSTR-2B shows more tax than the books record.',
        difference
      ));
    }
  }

  for (const book of booksValid) {
    if (book.match) continue;
    book.match = { status: 'missing_in_2b' };
    exceptions.push(exceptionFor(
      'missing_in_2b',
      'high',
      book,
      null,
      `Invoice ${book.invoiceNumberRaw} is in the purchase register but not in GSTR-2B.`,
      'Ask the supplier to file or amend GSTR-1, and confirm the invoice is valid and not cancelled.',
      book.tax
    ));
  }

  for (const twoB of gstr2bValid) {
    if (used.has(twoB.id)) continue;
    twoB.match = { status: 'missing_in_books' };
    exceptions.push(exceptionFor(
      'missing_in_books',
      'high',
      null,
      twoB,
      `Invoice ${twoB.invoiceNumberRaw} is in GSTR-2B but not in the purchase register.`,
      'Locate the invoice and record it in the purchase register before claiming ITC.',
      0
    ));
  }

  const exactMatched = booksValid.filter((book) => book.match?.status === 'exact').length;
  const valueMismatch = booksValid.filter((book) => book.match?.status === 'value_mismatch').length;
  const dateMismatch = booksValid.filter((book) => book.match?.status === 'date_mismatch').length;
  const matched = exactMatched + valueMismatch + dateMismatch;
  const missingIn2B = booksValid.filter((book) => book.match?.status === 'missing_in_2b').length;
  const missingInBooks = gstr2bValid.filter((record) => record.match?.status === 'missing_in_books').length;

  const booksTax = round2(booksValid.reduce((sum, book) => sum + book.tax, 0));
  const gstr2bTax = round2(gstr2bValid.reduce((sum, record) => sum + record.tax, 0));
  const matchedTax = round2(booksValid
    .filter((book) => book.match && book.match.status !== 'missing_in_2b')
    .reduce((sum, book) => sum + book.tax, 0));

  const valueDifferences = exceptions
    .filter((exception) => exception.type === 'value_mismatch')
    .map((exception) => exception.taxDifference);
  const itcAtRisk = round2(
    exceptions
      .filter((exception) => exception.type === 'missing_in_2b')
      .reduce((sum, exception) => sum + (exception.booksTax ?? 0), 0) +
    valueDifferences.filter((difference) => difference > 0).reduce((sum, difference) => sum + difference, 0)
  );
  const potentialUnclaimed = round2(
    exceptions
      .filter((exception) => exception.type === 'missing_in_books')
      .reduce((sum, exception) => sum + (exception.twoBTax ?? 0), 0) +
    valueDifferences.filter((difference) => difference < 0).reduce((sum, difference) => sum + Math.abs(difference), 0)
  );

  const sortedExceptions = exceptions.sort((a, b) =>
    (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9) ||
    String(a.type).localeCompare(String(b.type)) ||
    String(a.supplierGstin).localeCompare(String(b.supplierGstin)) ||
    String(a.invoiceNumber).localeCompare(String(b.invoiceNumber))
  );

  const invalidRows = books.filter((record) => record.invalidRow).length +
    gstr2b.filter((record) => record.invalidRow).length;
  const verdict = sortedExceptions.length === 0
    ? 'RECONCILED'
    : (itcAtRisk > 0 || invalidRows > 0 ? 'REVIEW REQUIRED' : 'REVIEW SUGGESTED');

  return {
    product: PRODUCT,
    version: VERSION,
    generatedAt: options.generatedAt || null,
    period: options.period || '',
    inputs: {
      books: options.booksName || 'books',
      gstr2b: options.gstr2bName || 'gstr2b',
      tolerance
    },
    summary: {
      verdict,
      counts: {
        booksRows: books.length,
        gstr2bRows: gstr2b.length,
        validBooksRows: booksValid.length,
        validGstr2bRows: gstr2bValid.length,
        exactMatched,
        valueMismatch,
        dateMismatch,
        matched,
        missingIn2B,
        missingInBooks,
        duplicateBooks: bookDuplicates.flagged.size,
        duplicateGstr2b: gstr2bDuplicates.flagged.size,
        invalidRows,
        exceptions: sortedExceptions.length
      },
      amounts: {
        booksTax,
        gstr2bTax,
        matchedTax,
        itcAtRisk,
        potentialUnclaimed,
        netDifference: round2(itcAtRisk - potentialUnclaimed)
      },
      matchRate: booksValid.length ? round2((matched / booksValid.length) * 100) : 0
    },
    exceptions: sortedExceptions,
    books,
    gstr2b
  };
}

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(rows, columns) {
  const header = columns.map((column) => csvCell(column.label ?? column.key)).join(',');
  const body = rows.map((row) =>
    columns.map((column) => csvCell(typeof column.value === 'function' ? column.value(row) : row[column.key])).join(',')
  );
  return [header, ...body].join('\n') + '\n';
}

export function formatSummaryMarkdown(result) {
  const { summary, period, inputs } = result;
  const counts = summary.counts;
  const amounts = summary.amounts;
  const lines = [
    '# ITC Recovery Desk — Reconciliation Summary',
    '',
    `**Verdict:** ${summary.verdict}`,
    `**Period:** ${period || 'Not specified'}`,
    `**Books:** ${inputs.books}  `,
    `**GSTR-2B:** ${inputs.gstr2b}  `,
    `**Match rate:** ${summary.matchRate.toFixed(2)}%`,
    '',
    '## Counts',
    '',
    `- Purchase-register rows: ${counts.booksRows} (${counts.validBooksRows} valid)`,
    `- GSTR-2B rows: ${counts.gstr2bRows} (${counts.validGstr2bRows} valid)`,
    `- Exact matches: ${counts.exactMatched}`,
    `- Matched with a value exception: ${counts.valueMismatch}`,
    `- Matched with a date exception: ${counts.dateMismatch}`,
    `- In books, missing from GSTR-2B: ${counts.missingIn2B}`,
    `- In GSTR-2B, missing from books: ${counts.missingInBooks}`,
    `- Duplicate rows in books: ${counts.duplicateBooks}`,
    `- Duplicate rows in GSTR-2B: ${counts.duplicateGstr2b}`,
    `- Invalid rows: ${counts.invalidRows}`,
    '',
    '## Amounts',
    '',
    `- Tax in purchase register: ${amounts.booksTax.toFixed(2)}`,
    `- Tax in GSTR-2B: ${amounts.gstr2bTax.toFixed(2)}`,
    `- Tax in matched rows: ${amounts.matchedTax.toFixed(2)}`,
    `- **Potential ITC at risk:** ${amounts.itcAtRisk.toFixed(2)}`,
    `- **Potential unclaimed ITC:** ${amounts.potentialUnclaimed.toFixed(2)}`,
    `- Net difference: ${amounts.netDifference.toFixed(2)}`,
    '',
    '> Potential ITC at risk is a review amount, not a confirmed loss. Verify the invoice, the supplier filing and the applicable ITC conditions before making a claim.',
    ''
  ];

  if (result.exceptions.length) {
    lines.push('## Exceptions', '');
    lines.push('| Severity | Type | Supplier GSTIN | Invoice | Tax difference | Action |');
    lines.push('| --- | --- | --- | --- | ---: | --- |');
    for (const exception of result.exceptions) {
      lines.push(
        `| ${exception.severity} | ${exception.type} | ${exception.supplierGstin || '—'} | ` +
        `${exception.invoiceNumber || '—'} | ${exception.taxDifference.toFixed(2)} | ${exception.action} |`
      );
    }
    lines.push('');
  } else {
    lines.push('## Exceptions', '', 'No exceptions found in this file pair.', '');
  }

  lines.push(
    '## Next actions',
    '',
    '1. Review every `missing_in_2b` invoice with the supplier before claiming ITC.',
    '2. Record every `missing_in_books` invoice in the purchase register or explain why it is not claimable.',
    '3. Resolve value and date mismatches against the source invoice.',
    '4. Remove duplicates and correct invalid rows before the next reconciliation.',
    ''
  );
  return lines.join('\n');
}

function supplierFollowup(result) {
  const groups = new Map();
  for (const exception of result.exceptions) {
    const relevant = exception.type === 'missing_in_2b' ||
      exception.type === 'missing_in_books' ||
      exception.type === 'value_mismatch';
    if (!relevant) continue;
    const gstin = exception.supplierGstin || 'UNKNOWN';
    if (!groups.has(gstin)) {
      groups.set(gstin, {
        supplierGstin: gstin,
        issueCount: 0,
        invoices: new Set(),
        taxAtRisk: 0,
        potentialUnclaimed: 0,
        actions: new Set()
      });
    }
    const group = groups.get(gstin);
    group.issueCount += 1;
    if (exception.invoiceNumber) group.invoices.add(exception.invoiceNumber);
    if (exception.type === 'missing_in_2b') group.taxAtRisk += exception.booksTax ?? 0;
    if (exception.type === 'missing_in_books') group.potentialUnclaimed += exception.twoBTax ?? 0;
    if (exception.type === 'value_mismatch') {
      if (exception.taxDifference > 0) group.taxAtRisk += exception.taxDifference;
      if (exception.taxDifference < 0) group.potentialUnclaimed += Math.abs(exception.taxDifference);
    }
    group.actions.add(exception.action);
  }
  return [...groups.values()].map((group) => ({
    supplierGstin: group.supplierGstin,
    issueCount: group.issueCount,
    invoiceNumbers: [...group.invoices].sort().join(' | '),
    taxAtRisk: round2(group.taxAtRisk),
    potentialUnclaimed: round2(group.potentialUnclaimed),
    action: [...group.actions].join(' ')
  })).sort((a, b) => b.taxAtRisk - a.taxAtRisk || a.supplierGstin.localeCompare(b.supplierGstin));
}

export async function writeOutputs(result, outDir) {
  await fs.mkdir(outDir, { recursive: true });
  const exceptionColumns = [
    { key: 'type', label: 'issue_type' },
    { key: 'severity', label: 'severity' },
    { key: 'supplierGstin', label: 'supplier_gstin' },
    { key: 'invoiceNumber', label: 'invoice_number' },
    { key: 'invoiceDate', label: 'invoice_date' },
    { key: 'booksTaxable', label: 'books_taxable' },
    { key: 'twoBTaxable', label: 'gstr2b_taxable' },
    { key: 'booksTax', label: 'books_tax' },
    { key: 'twoBTax', label: 'gstr2b_tax' },
    { key: 'taxDifference', label: 'tax_difference' },
    { key: 'action', label: 'action' },
    { key: 'sourceRow', label: 'source_row' }
  ];
  const atRisk = result.exceptions.filter((exception) =>
    exception.type === 'missing_in_2b' ||
    (exception.type === 'value_mismatch' && exception.taxDifference > 0)
  );
  const unclaimed = result.exceptions.filter((exception) =>
    exception.type === 'missing_in_books' ||
    (exception.type === 'value_mismatch' && exception.taxDifference < 0)
  );
  const matchedRows = result.books
    .filter((book) => book.match && book.match.status !== 'missing_in_2b')
    .map((book) => ({
      status: book.match.status,
      supplierGstin: book.gstin,
      invoiceNumber: book.invoiceNumberRaw,
      booksDate: book.invoiceDate,
      gstr2bDate: book.match.twoB?.invoiceDate || '',
      booksTaxable: book.taxableValue,
      gstr2bTaxable: book.match.twoB?.taxableValue ?? '',
      booksTax: book.tax,
      gstr2bTax: book.match.twoB?.tax ?? '',
      taxDifference: round2(book.tax - (book.match.twoB?.tax ?? 0))
    }));

  await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify(result.summary, null, 2) + '\n');
  await fs.writeFile(path.join(outDir, 'summary.md'), formatSummaryMarkdown(result));
  await fs.writeFile(path.join(outDir, 'exceptions.csv'), toCsv(result.exceptions, exceptionColumns));
  await fs.writeFile(path.join(outDir, 'itc-at-risk.csv'), toCsv(atRisk, exceptionColumns));
  await fs.writeFile(path.join(outDir, 'itc-unclaimed.csv'), toCsv(unclaimed, exceptionColumns));
  await fs.writeFile(path.join(outDir, 'supplier-followup.csv'), toCsv(supplierFollowup(result), [
    { key: 'supplierGstin', label: 'supplier_gstin' },
    { key: 'issueCount', label: 'issue_count' },
    { key: 'invoiceNumbers', label: 'invoice_numbers' },
    { key: 'taxAtRisk', label: 'tax_at_risk' },
    { key: 'potentialUnclaimed', label: 'potential_unclaimed' },
    { key: 'action', label: 'action' }
  ]));
  await fs.writeFile(path.join(outDir, 'matched.csv'), toCsv(matchedRows, [
    { key: 'status', label: 'status' },
    { key: 'supplierGstin', label: 'supplier_gstin' },
    { key: 'invoiceNumber', label: 'invoice_number' },
    { key: 'booksDate', label: 'books_date' },
    { key: 'gstr2bDate', label: 'gstr2b_date' },
    { key: 'booksTaxable', label: 'books_taxable' },
    { key: 'gstr2bTaxable', label: 'gstr2b_taxable' },
    { key: 'booksTax', label: 'books_tax' },
    { key: 'gstr2bTax', label: 'gstr2b_tax' },
    { key: 'taxDifference', label: 'tax_difference' }
  ]));
  return {
    outDir,
    files: [
      'summary.json', 'summary.md', 'exceptions.csv', 'itc-at-risk.csv',
      'itc-unclaimed.csv', 'supplier-followup.csv', 'matched.csv'
    ]
  };
}
