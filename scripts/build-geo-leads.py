#!/usr/bin/env python3
"""Build a fresh GEO Visibility OS lead batch from the uncontacted AI Automation DB profiles.

Only produces leads we can address by a real first name: either verified from the
public profile description or derived from a person-shaped mailbox. No invented
addresses, no purchased lists.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROFILES = ROOT / "research/us-automation/profiles-raw.json"
SUBS = Path("/tmp/subscribers.json")
OUT_DIR = ROOT / "research/geo-2026-11-10"
OUT = OUT_DIR / "leads-raw.json"

FREE = {
    "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "hotmail.com",
    "outlook.com", "live.com", "rediffmail.com", "icloud.com", "protonmail.com",
    "aol.com", "mail.com", "zoho.com", "yandex.com", "gmx.de", "web.de",
}

ROLE = {
    "info", "contact", "hello", "hallo", "hola", "bonjour", "kontakt", "kontact",
    "contato", "contacto", "sales", "support", "admin", "team", "enquiries",
    "enquiry", "office", "help", "accounts", "marketing", "service", "mail",
    "connect", "partners", "newbusiness", "jobs", "careers", "reception",
    "general", "email", "press", "media", "hi", "hey", "start", "grow", "business",
    "agency", "studio", "consult", "consulting", "services", "reachus", "touch",
    "getintouch", "sayhello", "welcome", "enquire", "ask", "billing", "legal",
    "privacy", "dev", "tech", "it", "hr", "recruiting", "hotline", "ops", "systems",
    "talktous", "success", "transform", "letsgo", "humans", "respondio", "automate",
    "cognitive", "growth", "solutions", "biuro", "comercial", "saudi", "app", "aitp",
    "usprinz", "aventoza", "espoir", "us.sales", "no-reply", "noreply",
}

# Names accepted for single-token mailboxes. Anything not here must be verified
# from the profile description or written as first.last.
NAMES = {
    "steve", "liam", "james", "ryan", "kristian", "yali", "ben", "harry",
    "gurleen", "ariel", "zain", "liem", "jacky", "daniel", "rob", "paul", "tash",
    "emily", "keith", "dennis", "harshit", "fahad", "karim", "clinton", "abi",
    "leo", "harish", "gytis", "zulekha", "toby", "steven", "barbara", "karthik",
    "bilva", "koushik", "timeo", "elkin", "jean", "yousef", "valtteri", "hugo",
    "romane", "noam", "agathe", "dario", "ves", "clyde", "yashica",
    "ramnarayanan", "vishal", "akshar", "dvir", "shaylee", "olaf", "sam",
    "romuald", "bohdan", "mike", "alice", "oliwer", "mateo", "scott", "jason",
    "matt", "mark", "luke", "adam", "alex", "andrew", "anthony", "chris",
    "david", "ed", "george", "jack", "joe", "john", "josh", "kevin", "marcus",
    "nick", "oliver", "peter", "phil", "richard", "sean", "simon", "tom", "will",
}

PERSON_PATTERNS = [
    re.compile(r"(?:founded by|founder|co-founder|ceo|managing director|director|led by|owner)\s*,?\s*(?:is\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z\-]+){1,2})", re.I),
    re.compile(r"([A-Z][a-z]+(?:\s+[A-Z][a-z\-]+){1,2})\s*,?\s*(?:the\s+)?(?:founder|co-founder|ceo|managing director)", re.I),
]


def verified_name(description: str, local: str):
    names = set()
    for pattern in PERSON_PATTERNS:
        for match in pattern.finditer(description or ""):
            names.add(match.group(1))
    squashed = local.replace(".", "").replace("-", "")
    for candidate in names:
        parts = [p.lower() for p in re.split(r"[\s\-]+", candidate) if p]
        if not parts:
            continue
        if local.startswith(parts[0]) or squashed.startswith(parts[0]):
            return " ".join(candidate.split()[:2])
    return None


def derive_name(lead: dict):
    email = (lead.get("email") or "").strip().lower()
    local = email.split("@")[0]
    verified = verified_name(lead.get("description") or "", local)
    if verified:
        return verified
    if "." in local:
        first = local.split(".")[0]
        if 3 <= len(first) <= 10 and first.isalpha() and first not in ROLE:
            return first.capitalize()
    token = local.replace("-", "").replace("_", "")
    if token in NAMES:
        return token.capitalize()
    return None


def clean_services(lead: dict):
    services = lead.get("services") or []
    if isinstance(services, str):
        services = [s.strip() for s in services.split(",") if s.strip()]
    return [s for s in services if isinstance(s, str) and s.strip()][:4]


def main():
    profiles = json.loads(PROFILES.read_text())
    subscribed = set(json.loads(SUBS.read_text())) if SUBS.exists() else set()
    today = "2026-11-10"
    seen_email, seen_domain = set(), set()
    leads = []

    for profile in profiles:
        email = (profile.get("email") or "").strip().lower()
        if "@" not in email or email in subscribed:
            continue
        local, domain = email.split("@", 1)
        if domain in FREE or local in ROLE:
            continue
        if (profile.get("country") or "").strip().lower() in {"india"}:
            continue  # USD pricing in the product config; keep India for an INR batch
        if email in seen_email or domain in seen_domain:
            continue
        name = derive_name(profile)
        if not name:
            continue
        company = (profile.get("name") or "").strip()
        if not company:
            continue
        city = (profile.get("city") or "").strip() or "your city"
        country = (profile.get("country") or "Global").strip()
        services = clean_services(profile)
        service_text = ", ".join(services) if services else "AI and automation delivery"
        founded = profile.get("founded")
        signal_bits = [f"AI Automation DB lists {company} as an agency offering {service_text} from {city}, {country}"]
        if founded:
            signal_bits.append(f"founded {founded}")
        signal = "; ".join(signal_bits) + "."
        first = name.split()[0]
        hook = (
            f"{first}, {company} runs {service_text} from {city} — when a client asks "
            f"whether they show up in ChatGPT or Perplexity, the answer usually takes a bespoke research sprint."
        )
        pain = (
            f"{company} can report classic rankings, but AI-search visibility for clients is "
            f"still quoted as a one-off research project with no repeatable 40-check audit."
        )
        seen_email.add(email)
        seen_domain.add(domain)
        leads.append({
            "id": f"GEO-{len(leads) + 1:03d}",
            "company": company,
            "domain": domain,
            "website": profile.get("website") or f"https://{domain}",
            "email": email,
            "name": name,
            "first_name": first,
            "title": "Founder",
            "role_tier": "founder",
            "city": city,
            "country": country,
            "metro": False,
            "segment": "agency",
            "niche": service_text,
            "source_url": profile.get("profile_url") or f"https://{domain}",
            "signal": signal,
            "tech_stack": services,
            "pain_hypothesis": pain,
            "personalization_hook": hook,
            "why_now": "AI-search referrals keep growing while most agency reports still show only classic rankings.",
            "product_fit": "GEO Visibility OS",
            "researched_at": today,
            "notes": "Uncontacted at batch build; first-name mailbox verified against public profile description where possible.",
        })

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(leads, indent=2, ensure_ascii=False))
    print(f"Built {len(leads)} leads -> {OUT}")
    for lead in leads[:5]:
        print(f"  {lead['email']:40s} {lead['name']:16s} {lead['company'][:30]}")


if __name__ == "__main__":
    main()
