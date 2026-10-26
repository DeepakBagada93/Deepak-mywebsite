# Customer Tutorial & Implementation Guide

**Product**: Email Marketing & Cold Outreach Engine  
**Version**: 1.0.0  
**Author**: Deepak Bagada Systems  

---

## 1. 3-Minute Quickstart

### Step 1: Install into Your AI Agent
Copy the skill folder into your agent's skills directory:
```bash
# For Claude Code / Antigravity / Codex
cp -R skills/email-marketing ~/.agent/skills/

# Or copy into your active project workspace
cp -R skills/email-marketing ./my-project/.agent/skills/
```

### Step 2: Trigger Your First Campaign
Open your agent chat interface and issue a natural prompt:
```text
Build a complete cold outreach campaign for my SaaS:
Product: PipeFlow (Automated customer onboarding)
Target: VP of Customer Success at B2B SaaS companies (50-200 employees)
Core Metric: Cut onboarding time from 14 days to 4 days
```

### Step 3: Run the Pre-Send Validator
```bash
node skills/email-marketing/scripts/validate-email-campaign.mjs emails/pipeflow
```

---

## 2. Environment Integrations

### Using with Claude Code
Claude Code natively discovers skills placed inside `.agent/skills/` or `~/.claude/skills/`. You can instruct Claude:
> *"Load email-marketing skill and generate an abandoned checkout flow for our Shopify store."*

### Using with Cursor
Place the skill files inside your project repository. Reference the files using `@email-marketing` or `@SKILL.md` inside Cursor Composer.

### Using with Antigravity
The skill is natively recognized in Antigravity. Simply reference `/email-marketing` or ask for an outbound sequence or retention flow.

### Using with OpenAI Codex
Codex can execute the workflows by pointing directly to the workflow files in `workflows/` or executing the validation CLI.

---

## 3. Practical Production Recipes

### Recipe 1: Building a B2B Cold Outbound Campaign
1. Define the trigger event (e.g., company hiring 3+ SDRs).
2. Ask the agent to craft a 4-sentence initial touch with an interest CTA.
3. Review `03-cold-email-sequences.md` to ensure Step 1 is under 85 words.
4. Export the plain-text variations into Instantly or Smartlead.

### Recipe 2: Setting Up E-Commerce Abandoned Cart Recovery in Klaviyo
1. Review `templates/04-lifecycle-nurture-flows.template.md`.
2. Configure the 3-step sequence:
   - Email 1 (1 hour): Helpful assistance, dynamic cart link.
   - Email 2 (24 hours): Social proof, dermatologist/customer reviews, FAQ.
   - Email 3 (48 hours): Cart reservation expiration notice.
3. Use `templates/responsive-html-email.template.html` for clean layout.

### Recipe 3: Launching a Weekly Editorial Newsletter (Story → Lesson → Offer)
1. Pick a recent client problem or contrarian observation.
2. Structure the body using the SLO framework from `workflows/04-promotional-and-editorial-newsletters.md`.
3. Select an open-loop subject line from `templates/06-subject-line-copy-vault.template.md`.
4. Run the preheader through the preview text pairing rubric.

---

## 4. Troubleshooting & FAQ

### Q: Why shouldn't I include a Calendly booking link in cold email step 1?
**A**: Pushing a 30-minute calendar link on someone who doesn't know you creates high psychological friction (conversion < 1%). Furthermore, spam filters penalize emails with third-party booking links. Use permission-based micro-CTAs (*"Worth a 2-minute glance?"*) to initiate conversation first.

### Q: How do I prevent my secondary domains from getting blacklisted?
**A**: Keep cold outbound volume capped at 30–45 emails per mailbox per day, maintain continuous warmup at 15 emails/day, and verify your lead list with NeverBounce or ZeroBounce to keep hard bounce rates strictly under 2.0%.

### Q: What is the text-to-image ratio rule?
**A**: Maintain at least 60% HTML text and no more than 40% imagery. Image-only emails trigger spam filters and fail to render on email clients with image loading disabled by default.
