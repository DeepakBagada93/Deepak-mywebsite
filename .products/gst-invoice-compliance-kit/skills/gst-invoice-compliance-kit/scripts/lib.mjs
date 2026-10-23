// GST Invoice & HSN Compliance Kit — deterministic rules engine.
// Pure Node, zero dependencies. Every rule below is a documented check, not a guess.
//
// Scope guard: this engine prepares and checks data. It does not file returns, does not
// determine your tax liability, and is not a substitute for a chartered accountant.

export const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
export const SEVERITY_WEIGHT = { critical: 20, high: 12, medium: 6, low: 2 };

export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const STANDARD_GST_RATES = [0, 5, 12, 18, 28];
// Notified special rates (for example 0.25% on rough diamonds, 1.5% on job-work,
// 3% on gold/silver jewellery, 6% on certain works contracts). These are links to a
// notification, not a licence to use them; the engine only asks you to confirm.
export const SPECIAL_GST_RATES = [0.25, 1.5, 3, 6];
export const VALID_GST_RATES = STANDARD_GST_RATES;

// HSN/SAC digit depth. Notification No. 78/2020-Central Tax (15 Oct 2020) and the
// GSTN Phase-3 advisory (effective for the May 2025 return period) require 4 digits
// for AATO up to ₹5 crore and 6 digits above ₹5 crore. There is no 8-digit band.
export const HSN_BANDS = [
  { maxAato: 50000000, digits: 4, label: 'AATO up to ₹5 crore' },
  { maxAato: Infinity, digits: 6, label: 'AATO above ₹5 crore' }
];

// E-invoicing threshold: aggregate annual turnover of ₹5 crore (5,00,00,000) or more.
export const E_INVOICE_AATO_THRESHOLD = 50000000;
// The IRP 30-day reporting restriction applies from 1 April 2025 and becomes a
// hard rule for businesses at ₹10 crore AATO and above.
export const E_INVOICE_WINDOW_AATO_THRESHOLD = 100000000;
export const E_WAY_BILL_THRESHOLD = 50000;

export const STATE_CODES = {
  '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
  '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
  '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur',
  '15': 'Mizoram', '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
  '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh',
  '24': 'Gujarat', '26': 'Dadra and Nagar Haveli and Daman and Diu', '27': 'Maharashtra',
  '29': 'Karnataka', '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu',
  '34': 'Puducherry', '35': 'Andaman and Nicobar Islands', '36': 'Telangana',
  '37': 'Andhra Pradesh', '38': 'Ladakh', '97': 'Other Territory', '96': 'Other Country'
};

// Orientation table only. Codes are HTS/SAC headings for common Indian products and
// services, used to sanity-check a code the buyer already holds. The kit never asserts
// that a code is correct — always confirm against the GST portal HSN/SAC master.
export const HSN_CATALOG = [
  { code: '0901', description: 'Coffee, tea, mate and spices', type: 'goods', rates: [5] },
  { code: '1701', description: 'Cane or beet sugar', type: 'goods', rates: [5] },
  { code: '1905', description: 'Bread, pastry, cakes, biscuits and other bakers wares', type: 'goods', rates: [5, 12, 18] },
  { code: '2106', description: 'Food preparations not elsewhere specified or included', type: 'goods', rates: [5, 12, 18] },
  { code: '2201', description: 'Waters, including natural or artificial mineral waters', type: 'goods', rates: [18] },
  { code: '2202', description: 'Non-alcoholic beverages, whether or not containing added sugar', type: 'goods', rates: [12, 18, 28] },
  { code: '3004', description: 'Medicaments, in measured doses or retail packings', type: 'goods', rates: [5, 12] },
  { code: '3304', description: 'Beauty or make-up preparations and skin care preparations', type: 'goods', rates: [18] },
  { code: '3305', description: 'Hair preparations', type: 'goods', rates: [18] },
  { code: '3401', description: 'Soap; organic surface-active products', type: 'goods', rates: [18] },
  { code: '3923', description: 'Plastic articles for packing or holding goods', type: 'goods', rates: [18] },
  { code: '4821', description: 'Paper and paperboard', type: 'goods', rates: [18] },
  { code: '6109', description: 'T-shirts, singlets and other vests, knitted or crocheted', type: 'goods', rates: [5] },
  { code: '6203', description: "Men's or boys' suits, ensembles, jackets, trousers and shorts", type: 'goods', rates: [5, 18] },
  { code: '6403', description: 'Footwear with outer soles of rubber, plastics or leather', type: 'goods', rates: [18] },
  { code: '7010', description: 'Glass tableware, kitchenware and other glassware', type: 'goods', rates: [18] },
  { code: '8507', description: 'Accumulators and other accumulators and their parts', type: 'goods', rates: [5, 18] },
  { code: '8517', description: 'Telephone sets and other transmission apparatus', type: 'goods', rates: [18] },
  { code: '8523', description: 'Discs, tapes, solid-state non-volatile storage devices and media', type: 'goods', rates: [18] },
  { code: '8524', description: 'Monitors, video projectors and television receivers', type: 'goods', rates: [18] },
  { code: '9403', description: 'Other furniture and parts thereof', type: 'goods', rates: [18] },
  { code: '9503', description: 'Toys, games and puzzles', type: 'goods', rates: [18] },
  { code: '9608', description: 'Pens and pencils', type: 'goods', rates: [18] },
  { code: '997331', description: 'Software publishing services', type: 'service', rates: [18] },
  { code: '997350', description: 'Computer programming, consultancy and computer facilities management services', type: 'service', rates: [18] },
  { code: '997360', description: 'Database activities', type: 'service', rates: [18] },
  { code: '997370', description: 'Other information technology service activities', type: 'service', rates: [18] },
  { code: '998311', description: 'Management consulting services', type: 'service', rates: [18] },
  { code: '998312', description: 'Financial auditing, accounting and tax consulting services', type: 'service', rates: [18] },
  { code: '998313', description: 'Human resource and employment support services', type: 'service', rates: [18] },
  { code: '998314', description: 'Marketing, advertising and public relations services', type: 'service', rates: [18] },
  { code: '998316', description: 'Information technology consulting and support services', type: 'service', rates: [18] },
  { code: '998317', description: 'Engineering services', type: 'service', rates: [18] },
  { code: '998360', description: 'Training and coaching services', type: 'service', rates: [18] },
  { code: '998362', description: 'Educational and learning support services', type: 'service', rates: [18] },
  { code: '998899', description: 'Other business support services n.e.c.', type: 'service', rates: [18] }
];

export const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const near = (a, b, tolerance = 0.01) => Math.abs(Number(a) - Number(b)) <= tolerance;

function toFiniteNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

const BASE36 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Compute the 15th GSTIN check character using the published base-36 algorithm:
 * values alternate factor 1 and 2 starting at index 0, each product contributes
 * quotient + remainder when divided by 36, and the check digit is (36 - sum % 36) % 36.
 */
export function gstinChecksum(gstin) {
  const value = String(gstin || '').toUpperCase().trim();
  // Accept either the 14-character stem or the full 15-character GSTIN.
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
  const value = String(gstin || '').toUpperCase().trim();
  if (!GSTIN_PATTERN.test(value)) return false;
  return gstinChecksum(value) === value[14];
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (const token of argv) {
    if (token.startsWith('--')) {
      const [rawKey, ...rest] = token.slice(2).split('=');
      const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      args[key] = rest.length ? rest.join('=') : true;
    } else {
      args._.push(token);
    }
  }
  return args;
}

export function hsnDigitsRequired(aato) {
  const value = toFiniteNumber(aato);
  if (value === null) return null;
  return HSN_BANDS.find((band) => value <= band.maxAato).digits;
}

export function hsnBandLabel(aato) {
  const value = toFiniteNumber(aato);
  if (value === null) return 'AATO not provided';
  return HSN_BANDS.find((band) => value <= band.maxAato).label;
}

export function findHsn(code) {
  if (code === undefined || code === null) return null;
  const digits = String(code).replace(/\D/g, '');
  if (!digits) return null;
  return HSN_CATALOG.find((entry) => entry.code === digits) || null;
}

export function suggestHsn(query, limit = 8) {
  const needle = String(query || '').toLowerCase().trim();
  if (!needle) return [];
  const words = needle.split(/[^a-z0-9]+/).filter(Boolean);
  return HSN_CATALOG.map((entry) => {
    const haystack = `${entry.code} ${entry.description} ${entry.type}`.toLowerCase();
    let score = 0;
    for (const word of words) {
      if (entry.code.startsWith(word)) score += 6;
      if (haystack.includes(word)) score += 2;
    }
    return { entry, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.code.localeCompare(b.entry.code))
    .slice(0, limit)
    .map((item) => ({
      code: item.entry.code,
      description: item.entry.description,
      type: item.entry.type,
      rateHint: item.entry.rates.join('%, ') + '%',
      confirm: 'Confirm the exact 6-digit code on the GST portal (Search Taxpayer → HSN/SAC master).'
    }));
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigits(value) {
  if (value < 20) return ONES[value];
  const tens = TENS[Math.floor(value / 10)];
  const ones = ONES[value % 10];
  return ones ? `${tens} ${ones}` : tens;
}

function threeDigits(value) {
  const hundreds = Math.floor(value / 100);
  const rest = value % 100;
  const parts = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(' ');
}

/** Indian system: crore, lakh, thousand, hundred. */
export function amountToWords(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  const negative = amount < 0;
  const absolute = Math.abs(round2(amount));
  const rupees = Math.floor(absolute);
  const paise = Math.round((absolute - rupees) * 100);
  let words = '';
  let remaining = rupees;
  for (const [unit, name] of [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand'], [100, 'Hundred']]) {
    const count = Math.floor(remaining / unit);
    if (count > 0) {
      words += `${words ? ' ' : ''}${threeDigits(count)} ${name}`;
      remaining %= unit;
    }
  }
  if (remaining > 0) words += `${words ? ' ' : ''}${threeDigits(remaining)}`;
  if (!words) words = 'Zero';
  let out = `${words} Rupee${rupees === 1 ? '' : 's'}`;
  if (paise > 0) out += ` and ${twoDigits(paise)} Paise`;
  out += ' Only';
  return `${negative ? 'Minus ' : ''}${out}`;
}

/** Normalise amount-in-words so Rupees/Rupee, punctuation and a trailing Only do not create false mismatches. */
export function normaliseAmountWords(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[.,;:'"()[\]{}-]/g, ' ')
    .replace(/\brupees\b/g, 'rupee')
    .replace(/\bpaisa\b/g, 'paise')
    .replace(/\bonly\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const normaliseWords = normaliseAmountWords;

/**
 * Parse the date formats the kit accepts and return an ISO YYYY-MM-DD string, or null.
 * Impossible calendar dates (31/02/2026) are rejected instead of rolling forward.
 */
export function parseInvoiceDate(value) {
  if (value === undefined || value === null) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  let year;
  let month;
  let day;
  let match;
  if ((match = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/))) {
    [, year, month, day] = match;
  } else if ((match = raw.match(/^(\d{4})\/(\d{2})\/(\d{2})$/))) {
    [, year, month, day] = match;
  } else if ((match = raw.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/))) {
    [, day, month, year] = match;
  } else {
    return null;
  }
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (y < 1900 || y > 2999 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Today's calendar date in Asia/Kolkata, as YYYY-MM-DD (no UTC drift after midnight IST). */
export function todayInKolkata(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function daysBetween(earlierIso, laterIso) {
  const earlier = Date.parse(`${earlierIso}T00:00:00Z`);
  const later = Date.parse(`${laterIso}T00:00:00Z`);
  if (!Number.isFinite(earlier) || !Number.isFinite(later)) return null;
  return Math.floor((later - earlier) / 86400000);
}

/** Resolve a two-digit state code from a GSTIN, a code, or a full state name. */
export function stateCodeOf(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const raw = String(value).trim();
  const match = raw.match(/^(\d{2})(?:\D|$)/) || raw.match(/(\d{2})/);
  if (match && STATE_CODES[match[1]]) return match[1];
  const name = raw.toLowerCase().replace(/\bstate\b/g, '').replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
  for (const [code, label] of Object.entries(STATE_CODES)) {
    if (label.toLowerCase() === name) return code;
  }
  return null;
}

/** Recompute score, verdict and severity counts from one findings list. */
export function summarise(findings = []) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  let score = 100;
  for (const finding of findings) {
    if (counts[finding.severity] === undefined) continue;
    counts[finding.severity] += 1;
    score -= SEVERITY_WEIGHT[finding.severity];
  }
  score = Math.max(0, score);
  const verdict = score >= 90 ? 'READY TO ISSUE' : score >= 70 ? 'FIX BEFORE ISSUING' : 'DO NOT ISSUE';
  return { score, verdict, counts };
}

export function auditInvoice(invoice, options = {}) {
  const findings = [];
  const checks = [];
  const add = (code, severity, message, fix, ref, field) => {
    findings.push({ code, severity, message, fix, ref, field });
  };
  const check = (code, label, status, detail) => checks.push({ code, label, status, detail });

  const doc = invoice && typeof invoice === 'object' ? invoice : {};
  const supplier = doc.supplier || {};
  const recipient = doc.recipient || {};
  const lines = Array.isArray(doc.lines) ? doc.lines : [];
  const charges = doc.charges || {};
  const aato = options.aato ?? doc.aato ?? doc.business?.aato ?? doc.turnover?.aato ?? null;
  const aatoNumber = toFiniteNumber(aato);
  const hasAato = aatoNumber !== null;
  const requiredDigits = hasAato ? hsnDigitsRequired(aatoNumber) : null;

  const supplierState = stateCodeOf(supplier.stateCode) || stateCodeOf(supplier.gstin);
  const supplierGstin = supplier.gstin ? String(supplier.gstin).toUpperCase().trim() : '';
  const recipientGstin = recipient.gstin ? String(recipient.gstin).toUpperCase().trim() : '';
  const recipientGstinState = stateCodeOf(recipientGstin);
  const recipientStatedState = stateCodeOf(recipient.stateCode) || stateCodeOf(recipient.state);
  const posProvided = doc.placeOfSupply !== undefined && doc.placeOfSupply !== null && String(doc.placeOfSupply).trim() !== '';
  const posState = stateCodeOf(doc.placeOfSupply);
  const isExport = doc.export === true || doc.isExport === true
    || ['96', '97'].includes(recipientGstinState)
    || ['96', '97'].includes(recipientStatedState)
    || ['96', '97'].includes(posState);
  // For a B2C invoice the place of supply is the only reliable state signal, so use it
  // as the recipient-state fallback rather than calling the split undeterminable.
  const recipientState = recipientGstinState || recipientStatedState || posState || null;
  const supplyType = supplierState && recipientState
    ? (supplierState === recipientState ? 'intra-state' : 'inter-state')
    : 'unknown';
  const isB2C = !recipientGstin && !isExport;
  // Notification 10/2023-Central Tax applies where turnover "exceeds five crore
  // rupees", so exactly ₹5 crore does not trigger e-invoicing. The same value is
  // the upper bound for the 4-digit HSN band and the B2C HSN relaxation.
  const eInvoiceRequired = hasAato
    && aatoNumber > E_INVOICE_AATO_THRESHOLD
    && (Boolean(recipientGstin) || isExport);

  const todayIso = parseInvoiceDate(options.today) || todayInKolkata();

  // --- Invoice identity -------------------------------------------------
  const invoiceNumber = doc.invoiceNumber || doc.number;
  if (invoiceNumber === undefined || invoiceNumber === null || !String(invoiceNumber).trim()) {
    add('INV_NO_NUMBER', 'critical', 'Invoice number is missing.', 'Add a unique, sequential invoice number.', 'CGST Rule 46', 'invoiceNumber');
  } else {
    const numberText = String(invoiceNumber).trim();
    check('INV_NO_NUMBER', 'Invoice number present', 'pass', numberText);
    if (numberText.length > 16) {
      add('INV_NUMBER_TOO_LONG', 'high', `Invoice number "${numberText}" is ${numberText.length} characters; the limit is 16.`, 'Shorten the invoice number to 16 characters or fewer.', 'CGST Rule 46 (proviso: invoice number not exceeding 16 characters)', 'invoiceNumber');
    }
  }

  const invoiceDate = doc.invoiceDate || doc.date;
  const invoiceDateIso = parseInvoiceDate(invoiceDate);
  if (invoiceDate === undefined || invoiceDate === null || String(invoiceDate).trim() === '') {
    add('INV_NO_DATE', 'critical', 'Invoice date is missing.', 'Add the date of issue in DD/MM/YYYY or ISO form.', 'CGST Rule 46', 'invoiceDate');
  } else if (!invoiceDateIso) {
    add('INV_BAD_DATE', 'high', `Invoice date "${invoiceDate}" is not a valid date.`, 'Use a real calendar date in YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY or YYYY/MM/DD form.', 'CGST Rule 46', 'invoiceDate');
  } else {
    check('INV_NO_DATE', 'Invoice date present', 'pass', String(invoiceDate));
    if (invoiceDateIso > todayIso) {
      add('INV_FUTURE_DATE', 'high', `Invoice date ${invoiceDate} is in the future relative to ${todayIso} (Asia/Kolkata).`, 'A future-dated invoice misstates the period; issue it on the real date.', 'CGST Rule 46', 'invoiceDate');
    }
  }

  // --- Supplier ---------------------------------------------------------
  if (!supplier.name) {
    add('SUP_NO_NAME', 'critical', 'Supplier legal name is missing.', 'Print the registered legal name of the supplier.', 'CGST Rule 46', 'supplier.name');
  }
  if (!supplier.address) {
    add('SUP_NO_ADDRESS', 'critical', 'Supplier address is missing.', 'Print the full registered address of the supplier.', 'CGST Rule 46', 'supplier.address');
  }
  if (!supplierGstin) {
    add('SUP_NO_GSTIN', 'critical', 'Supplier GSTIN is missing.', 'Print the 15-character GSTIN of the supplier.', 'CGST Rule 46', 'supplier.gstin');
  } else if (!GSTIN_PATTERN.test(supplierGstin)) {
    add('SUP_GSTIN_INVALID', 'critical', `Supplier GSTIN "${supplier.gstin}" is not a valid 15-character GSTIN.`, 'Copy the GSTIN from the GST portal certificate; do not type it by hand.', 'CGST Rule 46', 'supplier.gstin');
  } else if (!isValidGstin(supplierGstin)) {
    add('SUP_GSTIN_CHECKSUM', 'critical', `Supplier GSTIN "${supplierGstin}" has an invalid check digit (expected ${gstinChecksum(supplierGstin)}).`, 'Copy the GSTIN from the GST portal certificate; a single mistyped character changes the checksum.', 'GSTN GSTIN checksum algorithm', 'supplier.gstin');
  } else {
    const embedded = supplierGstin.slice(0, 2);
    if (supplierState && embedded !== supplierState) {
      add('SUP_STATE_MISMATCH', 'high', `GSTIN state code ${embedded} does not match the stated state code ${supplierState}.`, 'Both must be the same place of supply for the supplier.', 'CGST Rule 46', 'supplier.stateCode');
    }
    check('SUP_GSTIN_INVALID', 'Supplier GSTIN valid', 'pass', supplierGstin);
  }
  if (!supplier.phone && !supplier.email) {
    add('SUP_NO_CONTACT', 'medium', 'Supplier phone or email is missing.', 'Print a contact so the buyer can reconcile a query.', 'CGST Rule 46', 'supplier.phone');
  }

  // --- Recipient --------------------------------------------------------
  if (!recipient.name) {
    add('REC_NO_NAME', 'high', 'Recipient name is missing.', 'Print the name of the person or business receiving the supply.', 'CGST Rule 46', 'recipient.name');
  }
  if (!recipient.address) {
    add('REC_NO_ADDRESS', 'high', 'Recipient address is missing.', 'Print the recipient address.', 'CGST Rule 46', 'recipient.address');
  }
  if (recipientGstin && !GSTIN_PATTERN.test(recipientGstin)) {
    add('REC_GSTIN_INVALID', 'high', `Recipient GSTIN "${recipient.gstin}" is not a valid 15-character GSTIN.`, 'Leave it blank for a B2C sale, or correct the B2B GSTIN.', 'CGST Rule 46', 'recipient.gstin');
  } else if (recipientGstin && !isValidGstin(recipientGstin)) {
    add('REC_GSTIN_CHECKSUM', 'high', `Recipient GSTIN "${recipientGstin}" has an invalid check digit (expected ${gstinChecksum(recipientGstin)}).`, 'Correct the B2B GSTIN from the buyer\'s registration certificate.', 'GSTN GSTIN checksum algorithm', 'recipient.gstin');
  }
  if (!recipientGstin && !recipient.uniqueId && !recipient.identificationNumber) {
    add('REC_NO_UNIQUE_ID', 'high', 'Recipient has no GSTIN and no unique identification number.', 'For a B2C invoice, print a unique ID such as the mobile number, PAN or Aadhaar last 4 digits.', 'CGST Rule 46', 'recipient.uniqueId');
  }

  // --- Place of supply / state -----------------------------------------
  if (!posProvided) {
    add('POS_MISSING', 'high', 'Place of supply is missing.', 'Print the place of supply (state code) as required for the supply.', 'Section 10(1)(a) / Section 12', 'placeOfSupply');
  } else if (!posState) {
    add('POS_UNKNOWN', 'high', `Place of supply "${doc.placeOfSupply}" does not contain a recognized state code.`, 'Use a two-digit GST state code such as 29 for Karnataka or 27 for Maharashtra.', 'Section 10(1)(a) / Section 12', 'placeOfSupply');
  } else if (!isExport) {
    const conflicting = [recipientGstinState, recipientStatedState]
      .filter(Boolean)
      .some((state) => state !== posState);
    if (conflicting) {
      add('POS_MISMATCH', 'high', `Place of supply ${posState} does not match the recipient state (${recipientGstinState || recipientStatedState}).`, 'Place of supply is normally the recipient state for a domestic supply.', 'Section 10(1)(a) / Section 12', 'placeOfSupply');
    }
  }
  if (supplyType === 'unknown') {
    add('TAX_SPLIT_UNVERIFIED', 'high', 'Supplier or recipient state could not be determined, so the CGST/SGST versus IGST split could not be verified.', 'Print both state codes (or a GSTIN for a registered buyer) so the tax split can be checked.', 'Section 10(1)(a) / Section 12', 'placeOfSupply');
  }

  // --- Lines, HSN, tax --------------------------------------------------
  if (!lines.length) {
    add('INV_NO_LINES', 'critical', 'Invoice has no line items.', 'Add at least one line with description, quantity, rate, HSN and tax.', 'CGST Rule 46', 'lines');
  }

  let computedTaxable = 0;
  let computedTax = 0;
  let computedLineTotals = 0;

  lines.forEach((line, index) => {
    const field = `lines[${index}]`;
    const description = line.description || line.name;
    if (!description) {
      add('LINE_NO_DESCRIPTION', 'critical', `Line ${index + 1} has no description of goods or services.`, 'Write what was supplied.', 'CGST Rule 46', `${field}.description`);
    }

    const code = line.hsn || line.sac;
    const isService = line.type === 'service' || Boolean(line.sac);
    if (!code) {
      const b2cRelaxation = isB2C && hasAato && aatoNumber <= E_INVOICE_AATO_THRESHOLD;
      if (b2cRelaxation) {
        add(isService ? 'LINE_NO_SAC' : 'LINE_NO_HSN', 'medium', `Line ${index + 1} has no HSN/SAC code. A B2C supply from a supplier with AATO up to ₹5 crore may omit it under the Notification 78/2020 proviso.`, 'Add the code your business already uses for cleaner records; confirm it on the GST portal.', 'Notification 78/2020-Central Tax, proviso', `${field}.hsn`);
      } else {
        add(isService ? 'LINE_NO_SAC' : 'LINE_NO_HSN', 'critical', `Line ${index + 1} has no HSN/SAC code.`, 'Add the code your business already uses; confirm it on the GST portal.', 'CGST Rule 46 / Notification 78/2020-Central Tax', `${field}.hsn`);
      }
    } else {
      const digits = String(code).replace(/\D/g, '');
      if (digits.length < 2) {
        add('HSN_INVALID', 'critical', `Line ${index + 1} code "${code}" is too short.`, 'Use the HSN/SAC code from the GST portal master.', 'CGST Rule 46', `${field}.hsn`);
      } else if (digits.length === 8) {
        add('HSN_DIGITS', 'medium', `Line ${index + 1} code "${code}" has 8 digits; an 8-digit code is valid on the invoice, but GSTR-1 Table 12 expects 4 or 6 digits.`, 'Use the 6-digit form for GSTR-1 reporting; keep the 8-digit code internally if your CA needs it.', 'Notification 78/2020-Central Tax; GSTN Phase-3 (May 2025)', `${field}.hsn`);
      } else if (![4, 6].includes(digits.length)) {
        add('HSN_DIGITS', 'high', `Line ${index + 1} code "${code}" has ${digits.length} digits; HSN/SAC codes are 2, 4, 6 or 8 digits, and GSTR-1 expects 4 or 6.`, 'Use a 4-digit code up to ₹5 crore AATO or a 6-digit code above ₹5 crore.', 'Notification 78/2020-Central Tax; GSTN Phase-3 (May 2025)', `${field}.hsn`);
      } else if (requiredDigits && digits.length < requiredDigits) {
        add('HSN_DIGITS', 'high', `Line ${index + 1} code "${code}" has ${digits.length} digits; ${requiredDigits} digits are required (${hsnBandLabel(aato)}).`, 'Extend the code to the digit depth your turnover band requires.', 'Notification 78/2020-Central Tax; GSTN Phase-3 (May 2025)', `${field}.hsn`);
      } else {
        check('HSN_DIGITS', `Line ${index + 1} HSN depth`, 'pass', `${digits.length} digits (need ${requiredDigits ?? 'n/a'})`);
      }
      const known = findHsn(code);
      const rate = Number(line.gstRate ?? 0);
      if (known && Number.isFinite(rate) && STANDARD_GST_RATES.includes(rate) && !known.rates.includes(rate)) {
        add('RATE_MISMATCH', 'medium', `Line ${index + 1} charges ${line.gstRate}% GST on ${known.code} (${known.description}); this heading is commonly ${known.rates.join('% or ')}%.`, 'Verify the rate on the GST portal rate finder for your exact product. A wrong rate is a bigger risk than a missing HSN.', 'GST rate finder', `${field}.gstRate`);
      }
    }

    const rate = Number(line.gstRate ?? 0);
    if (!Number.isFinite(rate)) {
      add('RATE_INVALID', 'high', `Line ${index + 1} GST rate ${line.gstRate} is not a number.`, 'Use a standard slab or a notified special rate.', 'GST rate slabs', `${field}.gstRate`);
    } else if (STANDARD_GST_RATES.includes(rate)) {
      check('RATE_VALID', `Line ${index + 1} GST rate`, 'pass', `${rate}%`);
    } else if (SPECIAL_GST_RATES.includes(rate)) {
      add('RATE_SPECIAL', 'low', `Line ${index + 1} uses ${rate}%, a notified special rate; confirm the notification applies to this exact supply.`, 'Keep the notification reference on file; special rates are product- and condition-specific.', 'GST rate notifications', `${field}.gstRate`);
    } else {
      add('RATE_INVALID', 'high', `Line ${index + 1} GST rate ${line.gstRate} is not a standard slab or a notified special rate.`, 'Use one of 0%, 5%, 12%, 18% or 28%, or a notified special rate with its reference.', 'GST rate slabs', `${field}.gstRate`);
    }

    const quantity = Number(line.quantity);
    const unitPrice = Number(line.unitPrice ?? line.rate);
    const discount = Number(line.discount ?? 0);
    const taxableValue = Number(line.taxableValue ?? line.value);
    if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
      add('LINE_QTY_RATE', 'high', `Line ${index + 1} has a missing quantity or unit rate.`, 'State quantity, unit and rate so the taxable value can be recomputed.', 'CGST Rule 46', `${field}.quantity`);
    } else {
      const expected = round2(quantity * unitPrice - discount);
      if (!near(expected, taxableValue, 0.05)) {
        add('LINE_TAXABLE_MISMATCH', 'high', `Line ${index + 1} taxable value is ${taxableValue}; ${quantity} × ${unitPrice} − ${discount} = ${expected}.`, 'Recompute the line total. Mismatched lines are the most common GSTR-1 rejection.', 'CGST Rule 46', `${field}.taxableValue`);
      }
      computedTaxable = round2(computedTaxable + taxableValue);
    }

    const cgst = Number(line.cgst ?? 0);
    const sgst = Number(line.sgst ?? 0);
    const igst = Number(line.igst ?? 0);
    if (supplyType === 'intra-state') {
      if (igst > 0) {
        add('TAX_SPLIT_WRONG', 'critical', `Line ${index + 1} charges IGST for an intra-state supply (supplier ${supplierState} → recipient ${recipientState}).`, 'Intra-state supply uses CGST and SGST; IGST belongs to inter-state supply.', 'Section 10(1)(a) / Section 12', `${field}.igst`);
      }
      if ((cgst === 0) !== (sgst === 0)) {
        add('TAX_SPLIT_UNEVEN', 'high', `Line ${index + 1} has CGST ${cgst} and SGST ${sgst}; one is zero while the other is not.`, 'In an intra-state supply charge both CGST and SGST at half the rate each.', 'Section 10(1)(a) / Section 12', `${field}.cgst`);
      } else if (cgst > 0 && sgst > 0 && !near(cgst, sgst, 0.01)) {
        add('TAX_SPLIT_UNEVEN', 'high', `Line ${index + 1} CGST ${cgst} and SGST ${sgst} are not equal.`, 'In an intra-state supply CGST and SGST are always half the tax each.', 'Section 10(1)(a) / Section 12', `${field}.cgst`);
      }
    }
    if (supplyType === 'inter-state') {
      if (cgst > 0 || sgst > 0) {
        add('TAX_SPLIT_WRONG', 'critical', `Line ${index + 1} charges CGST/SGST for an inter-state supply (supplier ${supplierState} → recipient ${recipientState}).`, 'Inter-state supply is charged IGST only.', 'Section 10(1)(a) / Section 12', `${field}.cgst`);
      }
    }

    const lineTax = round2(cgst + sgst + igst);
    const computedLineTax = round2((Number.isFinite(taxableValue) ? taxableValue : 0) * rate / 100);
    if (Number.isFinite(taxableValue) && !near(lineTax, computedLineTax, 0.05)) {
      add('LINE_TAX_MISMATCH', 'high', `Line ${index + 1} tax is ${lineTax}; ${taxableValue} × ${rate}% = ${computedLineTax}.`, 'Recompute the tax from the taxable value and the rate.', 'CGST Rule 46', `${field}.gstRate`);
    }
    computedTax = round2(computedTax + lineTax);
    computedLineTotals = round2(computedLineTotals + (Number(line.total ?? round2((taxableValue || 0) + lineTax))));

    if (line.total !== undefined && Number.isFinite(Number(line.total))) {
      const expectedTotal = round2((taxableValue || 0) + lineTax);
      if (!near(expectedTotal, Number(line.total), 0.05)) {
        add('LINE_TOTAL_MISMATCH', 'high', `Line ${index + 1} total is ${line.total}; expected ${expectedTotal}.`, 'Line total must equal taxable value plus tax.', 'CGST Rule 46', `${field}.total`);
      }
    }
  });

  // --- Totals -----------------------------------------------------------
  const statedTaxable = Number(doc.totalTaxableValue);
  if (!Number.isFinite(statedTaxable)) {
    add('NO_TAXABLE_TOTAL', 'critical', 'Invoice does not state a total taxable value.', 'Print the total taxable value of the supply.', 'CGST Rule 46', 'totalTaxableValue');
  } else if (!near(computedTaxable, statedTaxable, 0.05)) {
    add('SUBTOTAL_MISMATCH', 'high', `Stated taxable value ${statedTaxable} does not match the sum of lines ${computedTaxable}.`, 'Reconcile the line totals against the invoice total.', 'CGST Rule 46', 'totalTaxableValue');
  }

  const statedTax = Number(doc.totalTax ?? doc.totalGST);
  if (!Number.isFinite(statedTax)) {
    add('NO_TAX_BREAKUP', 'critical', 'Invoice does not state a total tax amount.', 'Print the total GST on the invoice.', 'CGST Rule 46', 'totalTax');
  } else if (!near(computedTax, statedTax, 0.05)) {
    add('TOTAL_TAX_MISMATCH', 'high', `Stated total tax ${statedTax} does not match the sum of line tax ${computedTax}.`, 'Reconcile the tax breakup.', 'CGST Rule 46', 'totalTax');
  }

  const shipping = Number(charges.shipping ?? 0);
  const other = Number(charges.other ?? 0);
  const documentDiscount = Number(doc.discount ?? 0);
  const roundOff = Number(doc.roundOff ?? 0);
  if (Math.abs(roundOff) > 1) {
    add('ROUND_OFF_EXCEEDS', 'low', `Round-off ${roundOff} is larger than ₹1.`, 'Round-off should be a rounding of a few paise, not a discount.', 'CGST Rule 46', 'roundOff');
  }
  const expectedGrand = round2((Number.isFinite(statedTaxable) ? statedTaxable : computedTaxable)
    + (Number.isFinite(statedTax) ? statedTax : computedTax)
    + shipping + other - documentDiscount + roundOff);
  const grandTotal = Number(doc.grandTotal ?? doc.total);
  if (!Number.isFinite(grandTotal)) {
    add('NO_GRAND_TOTAL', 'critical', 'Invoice does not state a total invoice value.', 'Print the total invoice value.', 'CGST Rule 46', 'grandTotal');
  } else if (!near(expectedGrand, grandTotal, 0.05)) {
    add('GRAND_TOTAL_MISMATCH', 'critical', `Invoice total ${grandTotal} does not match the computed ${expectedGrand}.`, 'Recompute: taxable + tax + charges − discount + round-off.', 'CGST Rule 46', 'grandTotal');
  }

  // --- Amount in words --------------------------------------------------
  if (!doc.amountInWords) {
    add('NO_AMOUNT_IN_WORDS', 'high', 'Amount in words is missing.', 'Print the total invoice value in words.', 'CGST Rule 46', 'amountInWords');
  } else if (Number.isFinite(grandTotal)) {
    const expected = amountToWords(grandTotal);
    if (normaliseWords(doc.amountInWords) !== normaliseWords(expected)) {
      add('AMOUNT_IN_WORDS_MISMATCH', 'high', `Amount in words "${doc.amountInWords}" does not match ${grandTotal} ("${expected}").`, 'Rewrite the amount in words using the Indian numbering system.', 'CGST Rule 46', 'amountInWords');
    } else {
      check('AMOUNT_IN_WORDS_MISMATCH', 'Amount in words matches total', 'pass', expected);
    }
  }

  // --- E-invoice (B2B and exports only) ---------------------------------
  const eInvoice = doc.eInvoice || doc.einvoice || null;
  if (eInvoiceRequired) {
    if (!eInvoice || !eInvoice.irn) {
      add('EINV_IRN_MISSING', 'critical', `Aggregate annual turnover is ₹${aatoNumber.toLocaleString('en-IN')}, so this ${isExport ? 'export' : 'B2B'} supply needs an IRN on the IRP portal.`, 'Generate the IRN and QR, then print IRN, ACK number, ACK date and the QR on the invoice.', 'GSTN e-invoice notification (B2B and exports)', 'eInvoice.irn');
      const age = ageInDays(invoiceDateIso, todayIso);
      if (aatoNumber >= E_INVOICE_WINDOW_AATO_THRESHOLD && age !== null && age > 30) {
        add('EINV_WINDOW_CLOSED', 'high', `Invoice is ${age} days old. For AATO of ₹10 crore or more, IRP reporting is restricted to 30 days from the invoice date (effective 1 April 2025).`, 'Report the invoice on the IRP within 30 days, or treat the IRN as unavailable and do not issue this document as an e-invoice.', 'IRP 30-day reporting restriction (effective 1 April 2025)', 'eInvoice.irn');
      }
    } else {
      const missing = ['ackNo', 'ackDate', 'qrCode'].filter((key) => !eInvoice[key]);
      if (missing.length) {
        add('EINV_FIELDS_INCOMPLETE', 'high', `IRN is present but ${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} missing.`, 'Print the acknowledgement number, acknowledgement date and the QR code alongside the IRN.', 'GSTN e-invoice notification', 'eInvoice');
      }
      if (eInvoice.niCode && supplierState && String(eInvoice.niCode) !== String(supplierState)) {
        add('EINV_NI_CODE', 'medium', `NI code ${eInvoice.niCode} does not match the supplier state code ${supplierState}.`, 'NI code is the state of the supplier for the IRP registration.', 'GSTN e-invoice notification', 'eInvoice.niCode');
      }
      if (eInvoice.mcCode && !/^[A-Z]{4}$/.test(String(eInvoice.mcCode).toUpperCase())) {
        add('EINV_MC_CODE', 'medium', `MC code "${eInvoice.mcCode}" is not a 4-character code.`, 'Use AURC for unregistered buyers and the buyer state code for registered buyers.', 'GSTN e-invoice notification', 'eInvoice.mcCode');
      }
    }
  } else if (eInvoice && eInvoice.irn) {
    add('EINV_NOT_EXPECTED', 'low', 'An IRN is present although the stated turnover and supply type do not require e-invoicing.', 'Confirm the turnover used. If the buyer is a supplier with turnover above ₹5 crore, keep the IRN.', 'GSTN e-invoice notification', 'eInvoice.irn');
  }

  // --- E-way bill (goods only) ------------------------------------------
  const ewayThreshold = options.ewayBillThreshold ?? E_WAY_BILL_THRESHOLD;
  const hasGoods = lines.some((line) => !(line.type === 'service' || line.sac));
  if (hasGoods && Number.isFinite(grandTotal) && grandTotal > ewayThreshold && !doc.eWayBill && !doc.ewayBill) {
    add('EWAY_MISSING', 'medium', `Goods supply of ₹${grandTotal} exceeds the ₹${Number(ewayThreshold).toLocaleString('en-IN')} e-way bill threshold. State-specific thresholds may differ.`, 'Generate the e-way bill for the consignment and record its number on the invoice; confirm your state threshold.', 'GSTN e-way bill rules', 'eWayBill');
  }

  // --- Payment terms ----------------------------------------------------
  if (!doc.paymentTerms && !doc.paymentMode) {
    add('NO_PAYMENT_TERMS', 'low', 'No payment terms or payment mode is stated.', 'State the payment mode and due date; it decides when tax is due.', 'Section 31(3) / Section 13', 'paymentTerms');
  }

  // --- Score ------------------------------------------------------------
  const summary = summarise(findings);

  return {
    invoice: {
      number: invoiceNumber ? String(invoiceNumber).trim() : null,
      date: invoiceDate || null,
      supplier: supplier.name || null,
      supplierGstin: supplierGstin || null,
      recipient: recipient.name || null,
      placeOfSupply: doc.placeOfSupply || null,
      grandTotal: Number.isFinite(grandTotal) ? grandTotal : null
    },
    context: {
      aato: hasAato ? aatoNumber : null,
      aatoCrore: hasAato ? round2(aatoNumber / 10000000) : null,
      hsnBand: hsnBandLabel(aatoNumber),
      hsnDigitsRequired: requiredDigits,
      eInvoiceRequired,
      supplyType,
      supplierState: supplierState || null,
      recipientState: recipientState || null,
      isB2C,
      isExport,
      auditDate: todayIso
    },
    summary,
    findings: findings.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    checks
  };
}

function ageInDays(invoiceDateIso, todayIso) {
  if (!invoiceDateIso || !todayIso) return null;
  return daysBetween(invoiceDateIso, todayIso);
}

export function renderInvoiceAudit(result) {
  const lines = [];
  const { invoice, context, summary, findings, checks } = result;
  lines.push('# GST Invoice Audit');
  lines.push('');
  lines.push(`**${invoice.number || 'Unnumbered invoice'}** · ${invoice.date || 'no date'} · ${invoice.supplier || 'no supplier'}`);
  lines.push('');
  lines.push(`- Score: **${summary.score}/100** — ${summary.verdict}`);
  lines.push(`- Critical ${summary.counts.critical} · High ${summary.counts.high} · Medium ${summary.counts.medium} · Low ${summary.counts.low}`);
  lines.push(`- Supply type: ${context.supplyType}${context.supplierState ? ` (supplier ${context.supplierState} → recipient ${context.recipientState ?? 'unknown'})` : ''}`);
  lines.push(`- HSN depth required: ${context.hsnDigitsRequired ?? 'n/a'} (${context.hsnBand})`);
  lines.push(`- E-invoice required: ${context.eInvoiceRequired ? 'yes' : 'no'}${context.isB2C ? ' (domestic B2C)' : context.isExport ? ' (export)' : ''}`);
  lines.push(`- Audit date: ${context.auditDate}`);
  lines.push('');
  if (findings.length) {
    lines.push('## Findings');
    lines.push('');
    lines.push('| Severity | Code | Field | Finding | Fix | Reference |');
    lines.push('| --- | --- | --- | --- | --- | --- |');
    for (const finding of findings) {
      const cell = (text) => String(text ?? '').replace(/\|/g, '\\|');
      lines.push(`| ${finding.severity} | ${finding.code} | ${cell(finding.field)} | ${cell(finding.message)} | ${cell(finding.fix)} | ${cell(finding.ref)} |`);
    }
  } else {
    lines.push('## Findings');
    lines.push('');
    lines.push('No findings. Every checked rule passed.');
  }
  lines.push('');
  if (checks.length) {
    lines.push('## Checks passed');
    lines.push('');
    for (const item of checks) lines.push(`- ${item.label}: ${item.detail}`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push('Data preparation and rule checking only. Not tax advice, not a return filing, not a substitute for your chartered accountant. HSN/SAC depth follows Notification 78/2020-Central Tax and GSTN Phase-3 (May 2025). Confirm codes and rates on the GST portal before issuing.');
  lines.push('');
  return lines.join('\n');
}

export function auditBatch(invoices, options = {}) {
  const results = [];
  const groups = new Map();

  invoices.forEach((invoice, index) => {
    const result = auditInvoice(invoice, options);
    results.push(result);
    const number = result.invoice.number;
    if (number) {
      const key = String(number);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(index);
    }
  });

  const duplicates = [];
  for (const [number, indexes] of groups) {
    if (indexes.length < 2) continue;
    duplicates.push({ number, count: indexes.length, indexes });
    for (const index of indexes) {
      const finding = {
        code: 'DUP_INVOICE_NUMBER',
        severity: 'critical',
        message: `Invoice number ${number} appears on ${indexes.length} invoices.`,
        fix: 'Every invoice number must be unique within a financial year.',
        ref: 'CGST Rule 46',
        field: 'invoiceNumber'
      };
      results[index].findings = [finding, ...results[index].findings];
      results[index].summary = summarise(results[index].findings);
    }
  }

  const totals = results.reduce((acc, result) => {
    acc.score += result.summary.score;
    acc.critical += result.summary.counts.critical;
    acc.high += result.summary.counts.high;
    acc.medium += result.summary.counts.medium;
    acc.low += result.summary.counts.low;
    return acc;
  }, { score: 0, critical: 0, high: 0, medium: 0, low: 0 });

  return {
    checkedAt: options.now ? String(options.now) : new Date().toISOString(),
    invoiceCount: results.length,
    duplicates,
    totals: {
      averageScore: results.length ? round2(totals.score / results.length) : 0,
      ...totals
    },
    invoices: results
  };
}

export function renderBatchAudit(result) {
  const lines = [];
  lines.push('# GST Invoice Batch Audit');
  lines.push('');
  lines.push(`- Invoices checked: **${result.invoiceCount}**`);
  lines.push(`- Average score: **${result.totals.averageScore}/100**`);
  lines.push(`- Critical ${result.totals.critical} · High ${result.totals.high} · Medium ${result.totals.medium} · Low ${result.totals.low}`);
  lines.push(`- Duplicate invoice numbers: ${result.duplicates.length ? result.duplicates.map((d) => `${d.number} (${d.count})`).join(', ') : 'none'}`);
  lines.push('');
  lines.push('| Invoice | Date | Supplier | Total | Score | Verdict | Top finding |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const item of result.invoices) {
    const top = item.findings[0];
    const cell = (text) => String(text ?? '').replace(/\|/g, '\\|');
    lines.push(`| ${cell(item.invoice.number || '—')} | ${cell(item.invoice.date || '—')} | ${cell(item.invoice.supplier || '—')} | ${item.invoice.grandTotal ?? '—'} | ${item.summary.score} | ${item.summary.verdict} | ${cell(top ? `${top.code}: ${top.message}` : 'clean')} |`);
  }
  lines.push('');
  lines.push('## CA handoff list');
  lines.push('');
  const handoff = [];
  for (const item of result.invoices) {
    for (const finding of item.findings) {
      handoff.push({ invoice: item.invoice.number || '—', severity: finding.severity, code: finding.code, field: finding.field, fix: finding.fix });
    }
  }
  if (!handoff.length) {
    lines.push('Nothing to hand off. Every invoice passed every rule.');
  } else {
    lines.push('| Invoice | Severity | Code | Field | Action |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const row of handoff) {
      const cell = (text) => String(text ?? '').replace(/\|/g, '\\|');
      lines.push(`| ${cell(row.invoice)} | ${row.severity} | ${row.code} | ${cell(row.field)} | ${cell(row.fix)} |`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('This is a data-preparation list for your accountant. It is not a return, not a liability computation and not tax advice.');
  lines.push('');
  return lines.join('\n');
}
