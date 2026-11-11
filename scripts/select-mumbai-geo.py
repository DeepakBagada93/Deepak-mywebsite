#!/usr/bin/env python3
"""Select the 50 best Mumbai contacts for the GEO Visibility OS campaign.

Order: GEO-fit niches first (SEO, digital, web, marketing, content, brand,
growth, ecommerce), then the highest-scoring company-domain leads to fill.
Hooks and pain are rewritten to the GEO angle; scores and evidence are kept.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "research/leads-2026-10-26-mumbai-solo-enriched.json",
    ROOT / "research/leads-2026-10-27-mumbai-solo-batch2-enriched.json",
]
OUT_DIR = ROOT / "research/mumbai-geo-2026-11-10"
OUT = OUT_DIR / "leads.json"

FREE = {
    "gmail.com", "googlemail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "live.com", "icloud.com", "rediffmail.com", "protonmail.com", "aol.com",
    "mail.com", "zoho.com",
}
FIT = re.compile(r"seo|digital|web|marketing|social|content|brand|growth|ecommerce|shopify|performance", re.I)

leads = []
for path in FILES:
    leads.extend(json.loads(path.read_text()))

seen_email, seen_domain = set(), set()
unique = []
for lead in sorted(leads, key=lambda row: -row.get("research_score", 0)):
    email = (lead.get("email") or "").lower()
    domain = (lead.get("domain") or "").lower()
    if not email or email in seen_email:
        continue
    if domain and domain not in FREE:
        if domain in seen_domain:
            continue
        seen_domain.add(domain)
    seen_email.add(email)
    unique.append(lead)

fit = [lead for lead in unique if FIT.search(lead.get("niche", ""))]
fit_emails = {lead["email"] for lead in fit}
SKIP = re.compile(r"chartered|account|tax|hr consulting|nutrition|coaching", re.I)
company_fill = [
    lead for lead in unique
    if lead["email"] not in fit_emails
    and lead["email"].split("@")[1] not in FREE
    and not SKIP.search(lead.get("niche", ""))
]
selected = fit[:48] + company_fill[:2]

for lead in selected:
    first = lead.get("first_name") or (lead.get("name") or "").split(" ")[0] or "there"
    company = lead.get("company") or lead.get("name") or "your studio"
    niche = lead.get("niche") or "digital work"
    lead["product_fit"] = "GEO Visibility OS"
    lead["personalization_hook"] = (
        f"{first}, {company} runs {niche} in Mumbai — when a client asks whether they "
        f"show up in ChatGPT or Perplexity, the answer usually takes a bespoke research sprint."
    )
    lead["pain_hypothesis"] = (
        f"{company} can show classic rankings, but AI-search visibility is still quoted "
        f"as a one-off research project with no repeatable 40-check audit."
    )
    lead["why_now"] = (
        "AI-search referrals are growing while most Mumbai reports still show only classic rankings."
    )

OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(selected, indent=2, ensure_ascii=False))
print(f"Selected {len(selected)} leads -> {OUT}")
company_domain = sum(1 for l in selected if l["email"].split("@")[1] not in FREE)
print(f"  company-domain: {company_domain} · free mailbox: {len(selected) - company_domain}")
for lead in selected:
    print(f"  {lead['research_score']:2d} {lead['tier']} {lead['email']:40s} {lead.get('niche','')[:40]}")
