# Spam Trigger Words & Algorithmic Red Flags Blacklist

Modern NLP-based spam filters (Google SpamBrain, Microsoft SmartScreen, Barracuda, SpamAssassin) analyze semantic clustering rather than simple keyword matches. However, high concentrations of high-urgency, hype-heavy, and financially deceptive terms will immediately degrade your spam score and inbox placement.

---

## 1. High-Risk Red Flag Words (Strictly Prohibited in Subject Lines & Cold Outreach)

### Urgency & Pressure
- Act now / Act immediately
- Apply now / Apply today
- Urgent / Urgent notice / Immediate response required
- Don't delete / Don't hesitate
- Once in a lifetime / Expiring tonight
- For a limited time only / Hurry up
- Last chance / Final call

### Financial & Monetary Hype
- 100% free / Absolutely free / Risk-free
- Big bucks / Fast cash / Easy money / Make money fast
- Earn extra income / Double your wealth
- Billion dollars / Millionaire / Pure profit
- No credit check / Pre-approved / Lowest interest
- Guarantee / Guaranteed returns / Zero risk
- Penny stock / Crypto jackpot / Wire transfer

### Artificial Claims & Over-Promises
- Miraculous / Miracle cure / Revolutionary breakthrough
- Secret trick / Insider secret / Magic formula
- You have won / Winner / Claim your prize
- Risk-free trial / No catch / No strings attached
- Work from home / Passive income on autopilot

### Shady Marketing Gimmicks
- Dear friend / Friend / Attention
- Click here / Click now / Tap this link (Use natural contextual hyperlink text instead)
- As seen on / Meet singles / Free consultation (in cold B2B)
- Increase traffic / Increase sales 10x (Without specific data/proof mechanism)
- Special promotion / Unbelievable offer

---

## 2. Formatting & Syntax Red Flags

- **ALL CAPS SUBJECT LINES**: e.g., `QUICK QUESTION REGARDING YOUR PIPELINE` (Trigger rate: 98%).
- **Excessive Punctuation**: e.g., `Quick idea???`, `Check this out!!!`, `$$$ Special Deal $$$`.
- **Mismatch between Display Text and Hyperlink**: If the email text says `https://stripe.com/help` but the actual href links to `https://redirect.trackinghub.com/xyz`.
- **High Image-to-Text Ratio**: Emails that contain only one large sliced image or minimal text with large graphics. Maintain at least a **60:40 text-to-image ratio**.
- **Hidden Text**: White text on white background or microfont sizing (`font-size: 1px`).
- **Missing Plain-Text Part (MIME)**: Sending multipart/alternative without a valid `text/plain` fallback.

---

## 3. High-Converting, Low-Risk Alternatives

| Spammy / Trigger Phrase | High-Deliverability, High-Conversion Replacement |
| :--- | :--- |
| "Free consultation" | "Worth a 3-minute glance?" / "Quick exploratory chat" |
| "Guaranteed to increase your revenue" | "Helped [Similar Company] cut CAC by 28% in 60 days" |
| "Act now before spots fill up" | "We have bandwidth to onboard 2 teams this quarter" |
| "Click here to see demo" | "Put together a 90-second video walkthrough here" |
| "URGENT: Follow up" | "Re: [Specific Project/Observation]" / "Checking back on this" |
| "Are you the decision maker?" | "Should I be speaking with someone else on your team?" |
| "Best deal on the market" | "Transparent breakdown of our pricing & deliverables" |
