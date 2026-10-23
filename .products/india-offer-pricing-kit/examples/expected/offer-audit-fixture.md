# Offer Page Audit — Get Rich AI Course

**Score:** 0/100 · **Verdict:** DO NOT LAUNCH

Critical 2 · High 7 · Medium 5 · Low 1

## Findings

| ID | Severity | Code | Finding | Fix |
| --- | --- | --- | --- | --- |
| F012 | critical | CLAIM_GUARANTEE | Absolute guarantee or risk-free claim. (GUARANTEED) | State the condition and the remedy: "7-day refund if the audit finds nothing", not a blanket guarantee. |
| F013 | critical | CLAIM_INCOME | Income, profit or return promise. (Double your income) | Remove the money promise. Show the mechanism and the range actually observed. |
| F001 | high | OFFER_CURRENCY | Currency is not INR on an India-targeted page. (USD) | Show INR. If you also accept USD, show both with the exchange basis. |
| F002 | high | OFFER_GST_EXCLUSIVE | Displayed price excludes GST. (4999) | Make the displayed price GST-inclusive and show the breakup. |
| F004 | high | OFFER_NO_REFUND | No refund policy. | State the window (for example 7 or 30 days), the condition and how to claim. |
| F006 | high | OFFER_NO_CONTACT | No email or WhatsApp contact. | Add a monitored email and, for India, a WhatsApp link. |
| F008 | high | OFFER_NO_CTA | No call to action. | Add one primary button with the price and what happens next. |
| F014 | high | DARK_FALSE_URGENCY | False urgency pattern (CCPA dark-pattern guidance). (Only 5 seats) | Use a real, dated deadline that applies to every buyer, or remove it. |
| F015 | high | DARK_DRIP_PRICING | Price excludes GST and adds it later (drip pricing). (GST extra) | Display the final GST-inclusive price on the page. Show the GST breakup, not a surprise at checkout. |
| F003 | medium | OFFER_GSTIN_INVALID | GSTIN does not match the 15-character format. (INVALID123) | Recheck the GSTIN on the GST portal before publishing. |
| F005 | medium | OFFER_NO_DELIVERY | Delivery time is not stated. | Say "instant download" or the exact turnaround. |
| F007 | medium | OFFER_NO_UPI | UPI is not listed as a payment method. (cards) | Enable UPI and show it at checkout; it is the dominant consumer payment rail in India. |
| F009 | medium | OFFER_UNNAMED_TESTIMONIAL | Testimonial has no name. (T1) | Use a real, attributable quote with permission, or remove it. |
| F011 | medium | OFFER_NO_LEGAL_LINKS | Terms or privacy page is missing. | Link both in the footer; digital sales need terms, refund and privacy pages. |
| F010 | low | OFFER_VAGUE_TESTIMONIAL | Testimonial has no specific result. (T1) | Add the before/after or the number the buyer reported. |

## What this audit does not check

- Whether the price is right for the market (run `price-offer.mjs` for that).
- GST filing correctness or legal advice.
- Page speed, checkout reliability and payment success rate.
