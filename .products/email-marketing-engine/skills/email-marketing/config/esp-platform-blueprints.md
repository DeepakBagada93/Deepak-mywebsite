# ESP & Sending Platform Architecture Blueprints

Guide to selecting, configuring, and connecting the right sending platforms across Cold Outreach, SaaS Product Lifecycle, E-commerce Retention, and Editorial Newsletters.

---

## 1. Platform Category Matrix

| Category | Primary ESPs | Best For | Core Mechanics |
| :--- | :--- | :--- | :--- |
| **Cold Outbound Outreach** | Instantly.ai, Smartlead.ai, Apollo.io, Lemlist | B2B lead gen, sales prospecting, agency outreach | Unlimited inbox rotation, automated peer warmup, plain-text spintax, multi-step triggers |
| **E-commerce Lifecycle** | Klaviyo, Omnisend, Drip | Shopify, WooCommerce, BigCommerce stores | Deep RFM segmentation, abandoned checkout webhooks, dynamic product feeds, revenue attribution |
| **SaaS & Product Retention** | Customer.io, Loops.so, Resend, Postmark, ActiveCampaign | SaaS apps, developer tools, onboarding flows | Event-driven triggers, in-app product usage attributes, webhook sync, transactional & broadcast |
| **Creator / Newsletter** | Kit (formerly ConvertKit), Beehiiv, Substack, Brevo | Content creators, consultants, thought leaders | Subscriber recommendation networks, paywalled tiers, clean markdown editors, referral engines |

---

## 2. Cold Outreach ESP Blueprint (Instantly / Smartlead)

### Account & Workspace Setup:
1. **Secondary Domains**: Purchase via Cloudflare or Namecheap. Point nameservers to Cloudflare for instant DNS updates.
2. **Workspace Creation**: Set up Google Workspace ($6/mo per user) or Microsoft 365 Exchange Online ($4/user). Create accounts with realistic human names (e.g., `deepak@trysaas.io`, `deepak.b@getsaas.io`).
3. **Inbox Settings**:
   - Custom Tracking Domain: Enabled via CNAME (`inst.trysaas.io`).
   - Daily limit: Set to 30–35 maximum.
   - Send delay: 5 to 12 minutes randomized between sends.
   - Warmup enable: 15–20 warmup emails per day, reply rate 30%.
   - In-app rotation: Add 5–15 inboxes to one single campaign. The engine automatically rotates sends across all connected mailboxes.
4. **Spintax Configuration**:
   Use spintax variations to prevent fingerprinting by spam filters:
   `{{Hi|Hello|Hey}} {{first_name}}, {{hope you're having a productive week|quick question for you|wanted to share a quick idea}}...`

---

## 3. E-commerce Lifecycle Blueprint (Klaviyo / Shopify)

### Core Event Triggers & Tags:
- `Started Checkout` → Abandoned Checkout Flow (Wait 1 hr → Email 1, Wait 20 hrs → Email 2, Wait 24 hrs → Email 3).
- `Viewed Product` → Browse Abandonment Flow (Filter: Has not started checkout in last 7 days).
- `Placed Order` → Post-Purchase / VIP Flow (Immediate receipt → 3 days delivery prep → 10 days review request → 21 days cross-sell).
- `Active on Site` (Last 90 days = false) → Win-Back Flow (Discount incentive + 1-click survey).

### Segment Definitions:
- **Engaged 30 Days**: Opened or clicked in past 30 days OR Placed Order in past 30 days. (Send daily/weekly campaigns here).
- **Engaged 90 Days**: Opened or clicked in past 90 days. (Send major launches and seasonal promotions here).
- **Unengaged 120+ Days**: Never blast promotional mail here. Route into re-engagement or suppress to protect domain reputation.

---

## 4. SaaS & Developer-Led Blueprint (Loops / Resend / Customer.io)

### Event & User Attribute Schema:
```json
{
  "user_id": "usr_98124",
  "email": "alex@startup.io",
  "plan": "free_tier",
  "projects_created": 3,
  "has_invited_team": false,
  "api_keys_generated": 1,
  "last_login_at": "2026-10-24T14:22:00Z"
}
```

### Automation Branches:
- **Onboarding Velocity Branch**:
  - If `projects_created == 0` after 48 hours → Send "Need a hand setting up your first project? (3-min template inside)".
  - If `projects_created >= 1` AND `has_invited_team == false` after 5 days → Send "Collaborate 3x faster: Invite a teammate with 1 click".
- **Upgrade Milestone Trigger**:
  - When usage reaches 80% of monthly tier limit → Automated triggered warning + friction-free upgrade link.

---

## 5. Webhook & CRM Sync Architecture

```
[Lead Capture Form / App / Store]
       │
       ▼ (Webhook / API)
[ESP Ingestion Engine (Klaviyo / Loops / Kit)]
       │
       ├──► Assign Tags & Custom Properties
       ├──► Enroll in Active Onboarding / Nurture Sequence
       └──► Mirror Contact to CRM (HubSpot / Salesforce / Pipedrive)
```
