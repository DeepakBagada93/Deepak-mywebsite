#!/usr/bin/env node
/**
 * Agency Email Template Pack - deterministic HTML builder.
 * Regenerates templates/html/*.html from a single accessible, responsive shell.
 *
 * Usage: node scripts/build-templates.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'templates', 'html');

const variants = [
  {
    file: '01-cold-outreach.html',
    slug: 'cold-outreach',
    accent: '#2563eb',
    category: 'New note',
    subject: 'A quieter way to fix {{pain_point|the bottleneck}}',
    preheader: 'One trigger, one question, no calendar link.',
    headline: 'A quieter way to fix {{pain_point|the bottleneck}}',
    body1: 'Hi {{first_name|there}},',
    body2:
      'Saw {{trigger_event|the recent change}} at {{company|your team}}. Most agencies respond by adding more delivery hours. The teams that break the cycle usually remove one manual handoff first.',
    body3:
      'We mapped that handoff for {{peer_company|a similar agency}} and cut {{metric|turnaround time}} by {{metric_delta|38%}} without adding headcount.',
    callout: 'Worth a 2-minute look at the handoff map? No call needed.',
    ctaText: 'Send me the map',
    ctaUrl: '{{cta_url|https://your-agency.com/handoff-map}}',
    secondary: 'Or reply with “send it” and I will keep it to one email.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Cold outreach template. Keep Step 1 link-free; swap the CTA for a reply ask when sending from a new domain.'
  },
  {
    file: '02-discovery-follow-up.html',
    slug: 'discovery-follow-up',
    accent: '#0f766e',
    category: 'Follow-up',
    subject: 'The three notes from our call',
    preheader: 'The decision, the risk, and the next smallest step.',
    headline: 'The three notes from our call',
    body1: 'Hi {{first_name|there}},',
    body2:
      'Thanks for the candid walkthrough. I wrote down three things so we are deciding from the same page:',
    body3:
      '<strong>1. The goal:</strong> {{goal|ship the new offer without stretching the delivery team}}.<br><strong>2. The risk:</strong> {{risk|another quarter of manual reporting}}.<br><strong>3. The next step:</strong> {{next_step|a 20-minute scope check with your ops lead}}.',
    callout: 'If any of those notes are off, reply with the correction and I will rework the scope before we speak again.',
    ctaText: 'Confirm the next step',
    ctaUrl: '{{cta_url|https://your-agency.com/scope-check}}',
    secondary: 'No deck attached. Just the notes.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Send within 2 hours of the call while recall is high. Keep it under 150 words.'
  },
  {
    file: '03-proposal-nudge.html',
    slug: 'proposal-nudge',
    accent: '#7c3aed',
    category: 'Proposal',
    subject: 'One question before you decide',
    preheader: 'A useful nudge that does not chase.',
    headline: 'One question before you decide',
    body1: 'Hi {{first_name|there}},',
    body2:
      'You have had the proposal for {{days_since_sent|four days}}. I am not writing to chase a yes. I am writing to surface the one thing that usually stalls this decision.',
    body3:
      'Most teams pause on {{objection|internal capacity}}, not price. If that is the blocker, the scope can start with {{smaller_scope|one workflow}} and expand after the first result.',
    callout: 'Which is closer: budget timing, internal capacity, or the scope itself?',
    ctaText: 'Reply with A, B, or C',
    ctaUrl: 'mailto:{{sender_email|hello@your-agency.com}}?subject=Proposal%20question',
    secondary: 'A one-line reply is enough. I will adjust from there.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Use once per proposal. If there is no reply, send the polite close in the copy pack.'
  },
  {
    file: '04-client-onboarding.html',
    slug: 'client-onboarding',
    accent: '#b45309',
    category: 'Kickoff',
    subject: 'Your kickoff starts here',
    preheader: 'Access, owners, and the first 72 hours.',
    headline: 'Your kickoff starts here',
    body1: 'Hi {{first_name|there}},',
    body2:
      'We are ready to start on {{start_date|Monday}}. Three small things make the first week calm instead of chaotic:',
    body3:
      '<strong>1. Access:</strong> {{access_list|Analytics, ad account, and shared drive}}.<br><strong>2. Owners:</strong> {{owner_map|one approver and one day-to-day contact}}.<br><strong>3. First checkpoint:</strong> {{first_checkpoint|Thursday at 3pm, 20 minutes}}.',
    callout: 'Reply “confirmed” once the access is in place and we will send the kickoff agenda.',
    ctaText: 'Open the kickoff checklist',
    ctaUrl: '{{cta_url|https://your-agency.com/kickoff}}',
    secondary: 'If anything is missing, send what you have and we will start with that.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Send immediately after signature. This template doubles as the first onboarding sequence email.'
  },
  {
    file: '05-case-study-broadcast.html',
    slug: 'case-study-broadcast',
    accent: '#be123c',
    category: 'Proof',
    subject: 'How {{client_name|one agency}} cut {{metric|reporting time}} by {{metric_delta|41%}}',
    preheader: 'The before, the change, and the result.',
    headline: 'How {{client_name|one agency}} cut {{metric|reporting time}} by {{metric_delta|41%}}',
    body1: 'Hi {{first_name|there}},',
    body2:
      '{{client_name|The client}} had a familiar problem: the work was good, but every new account added another manual reporting loop. The team was winning clients faster than it could document them.',
    body3:
      'We rebuilt one handoff: {{intervention|a single source of truth for weekly account notes}}. No new headcount. No six-month rollout. {{result_detail|Reporting moved from nine hours to five hours per week, and the account lead stopped writing updates on Sundays}}.',
    callout: 'The full teardown is four screens: the old loop, the new loop, the numbers, and the trade-offs.',
    ctaText: 'Read the teardown',
    ctaUrl: '{{cta_url|https://your-agency.com/case-study}}',
    secondary: 'Prefer the 90-second version? Reply “video” and I will send it.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Broadcast to warm list or use as a case-study lead magnet. Lead with the client outcome, not the agency.'
  },
  {
    file: '06-winback-reactivation.html',
    slug: 'winback-reactivation',
    accent: '#475569',
    category: 'We saved your seat',
    subject: 'It has been a while — here is what changed',
    preheader: 'No guilt. Just the three updates that matter.',
    headline: 'It has been a while — here is what changed',
    body1: 'Hi {{first_name|there}},',
    body2:
      'You paused your work with us {{months_away|six months}} ago. I am not writing to pretend nothing changed. I am writing because three things did:',
    body3:
      '<strong>1.</strong> {{update_one|Faster onboarding: first deliverable in five working days}}.<br><strong>2.</strong> {{update_two|A smaller entry scope for teams testing the fit}}.<br><strong>3.</strong> {{update_three|One owner per account instead of a rotating pod}}.',
    callout: 'If the timing is still wrong, reply “not now” and I will close the loop for good.',
    ctaText: 'See the new scope',
    ctaUrl: '{{cta_url|https://your-agency.com/new-scope}}',
    secondary: 'If it is right, reply “tell me more” and I will send the one-page comparison.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Send to clients inactive 60-90 days. Never more than two win-back touches before suppressing.'
  },
  {
    file: '07-newsletter.html',
    slug: 'newsletter',
    accent: '#1d4ed8',
    category: 'The Operator’s Edge · Issue {{issue_number|12}}',
    subject: 'The handoff nobody owns',
    preheader: 'A 3-minute read on agency operations and one tool worth testing.',
    headline: 'The handoff nobody owns',
    body1: 'Hi {{first_name|there}},',
    body2:
      'Every agency has one handoff that exists only because nobody wants to own it. Ours was the weekly client note. Yours might be the QA pass, the invoice reconciliation, or the intake form.',
    body3:
      'This issue covers: why invisible handoffs survive, a 15-minute audit for finding yours, and the one metric that makes the cost visible to a client. Read time: 3 minutes.',
    callout: 'One practical idea, one real example, no motivational filler.',
    ctaText: 'Read this week’s issue',
    ctaUrl: '{{cta_url|https://your-agency.com/newsletter}}',
    secondary: 'Forward this to the person who owns operations. They will thank you.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Replace the issue title and body per send. Keep one primary CTA and one secondary forward ask.'
  },
  {
    file: '08-referral-request.html',
    slug: 'referral-request',
    accent: '#15803d',
    category: 'One small ask',
    subject: 'Know one team with this problem?',
    preheader: 'A 15-second ask, no awkward follow-up.',
    headline: 'Know one team with this problem?',
    body1: 'Hi {{first_name|there}},',
    body2:
      'We just wrapped {{project_name|the onboarding rebuild}} for {{client_name|a client}} and the result was {{result|a 41% cut in reporting time}}.',
    body3:
      'I am not asking for a testimonial. I am asking for one introduction to a team that is still stuck in {{problem|the same manual reporting loop}}.',
    callout: 'If one name comes to mind, reply with it and I will send a short forwardable note. No pressure if not.',
    ctaText: 'Introduce me',
    ctaUrl: 'mailto:{{sender_email|hello@your-agency.com}}?subject=Introduction',
    secondary: 'Thank you either way.',
    signatureName: '{{sender_name|Alex}}',
    signatureTitle: 'Founder, {{brand_name|Northline Studio}}',
    note: 'Send after a visible win, not after an invoice. One ask, one follow-up maximum.'
  }
];

function render(v) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Northline Studio — Agency Email Template</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; max-width: 100%; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f4f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; overflow: hidden; mso-hide: all; }
    a { color: ${v.accent}; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .px { padding-left: 22px !important; padding-right: 22px !important; }
      .headline { font-size: 27px !important; line-height: 34px !important; }
      .btn a { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .stack { display: block !important; width: 100% !important; }
    }
    @media (prefers-color-scheme: dark) {
      body, .bg { background-color: #101114 !important; }
      .card { background-color: #1a1c21 !important; border-color: #2c3037 !important; }
      .ink { color: #f4f4f5 !important; }
      .muted { color: #a7adba !important; }
      .callout { background-color: #22252b !important; border-color: #3a3f48 !important; }
      .footer { color: #8b919e !important; }
    }
  </style>
</head>
<body class="bg" style="margin:0;padding:0;background-color:#f4f4f0;color:#17181c;">
  <span class="preheader">${v.preheader}} &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;">
    <tr>
      <td align="center" style="padding:28px 14px 40px 14px;">
        <table role="presentation" class="container" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;">

          <tr>
            <td style="padding:0 4px 18px 4px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size:15px;font-weight:700;letter-spacing:0.02em;color:#17181c;" class="ink">
                    <a href="{{brand_website_url|https://your-agency.com}}" style="color:#17181c;text-decoration:none;" class="ink">{{brand_name|Northline Studio}}</a>
                  </td>
                  <td align="right" style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#7b8090;" class="muted">
                    ${v.category}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="card" style="background-color:#ffffff;border:1px solid #e2e1d9;border-radius:14px;padding:42px 40px 36px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom:18px;">
                    <span style="display:inline-block;width:46px;height:4px;border-radius:2px;background-color:${v.accent};"></span>
                  </td>
                </tr>
                <tr>
                  <td class="headline px ink" style="font-size:31px;line-height:39px;font-weight:700;letter-spacing:-0.02em;color:#17181c;padding-bottom:22px;">
                    ${v.headline}
                  </td>
                </tr>
                <tr>
                  <td class="muted px" style="font-size:16px;line-height:27px;color:#33363e;padding-bottom:16px;">
                    ${v.body1}
                  </td>
                </tr>
                <tr>
                  <td class="muted px" style="font-size:16px;line-height:27px;color:#33363e;padding-bottom:16px;">
                    ${v.body2}
                  </td>
                </tr>
                <tr>
                  <td class="muted px" style="font-size:16px;line-height:27px;color:#33363e;padding-bottom:26px;">
                    ${v.body3}
                  </td>
                </tr>
                <tr>
                  <td class="px" style="padding-bottom:26px;">
                    <table role="presentation" class="callout" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4ef;border:1px solid #e6e5dc;border-radius:10px;">
                      <tr>
                        <td style="padding:16px 18px;font-size:15px;line-height:24px;color:#2a2d34;" class="muted">
                          ${v.callout}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="btn px" style="padding-bottom:16px;">
                    <a href="${v.ctaUrl}" target="_blank" style="display:inline-block;background-color:${v.accent};color:#ffffff;text-decoration:none;font-size:16px;line-height:22px;font-weight:600;padding:15px 24px;border-radius:8px;">
                      ${v.ctaText}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td class="muted px" style="font-size:14px;line-height:23px;color:#6b7080;padding-bottom:30px;">
                    ${v.secondary}
                  </td>
                </tr>
                <tr>
                  <td class="px">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #ecebe4;">
                      <tr>
                        <td style="padding-top:22px;font-size:15px;line-height:24px;color:#33363e;" class="muted">
                          <strong style="color:#17181c;" class="ink">${v.signatureName}</strong><br>
                          <span style="color:#6b7080;">${v.signatureTitle}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="footer" style="padding:22px 8px 0 8px;text-align:center;font-size:12px;line-height:20px;color:#7b8090;">
              {{brand_name|Northline Studio}} · {{company_address|Your registered business address}}<br>
              You are receiving this because you {{consent_reason|asked to hear from us or we connected recently}}.<br>
              <a href="{{unsubscribe_url|https://your-agency.com/unsubscribe}}" style="color:#7b8090;text-decoration:underline;">Unsubscribe</a>
              &nbsp;·&nbsp;
              <a href="{{preferences_url|https://your-agency.com/preferences}}" style="color:#7b8090;text-decoration:underline;">Email preferences</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

await fs.mkdir(outDir, { recursive: true });
for (const variant of variants) {
  const html = render(variant);
  await fs.writeFile(path.join(outDir, variant.file), html, 'utf8');
  const copy = `# ${variant.slug.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} Template

- **File:** \`templates/html/${variant.file}\`
- **Accent:** \`${variant.accent}\`
- **When to use:** ${variant.note}
- **Default subject:** ${variant.subject}
- **Default preheader:** ${variant.preheader}

## Copy blocks

### Intro
${variant.body1}

### Context
${variant.body2}

### Detail
${variant.body3.replaceAll('<strong>', '**').replaceAll('</strong>', '**').replaceAll('<br>', '\\n')}

### Callout
${variant.callout}

### Primary CTA
${variant.ctaText} → ${variant.ctaUrl}

### Secondary action
${variant.secondary}

### Signature
${variant.signatureName}
${variant.signatureTitle}

## Merge tags

| Tag | Purpose | Fallback |
| --- | --- | --- |
| \`{{first_name}}\` | Recipient first name | there |
| \`{{company}}\` | Recipient company | your team |
| \`{{brand_name}}\` | Your agency name | Northline Studio |
| \`{{sender_name}}\` | Sender name | Alex |
| \`{{sender_title}}\` | Sender role | Founder, {{brand_name}} |
| \`{{cta_url}}\` | Primary destination | your-agency.com |
| \`{{unsubscribe_url}}\` | Compliance link | your-agency.com/unsubscribe |

## QA before send

1. Replace every demo value that should not ship.
2. Keep the preheader under 90 characters and different from the headline.
3. Test one desktop client, Gmail mobile, and dark mode.
4. Confirm the unsubscribe and address are populated.
5. Send a seed copy to yourself and check link tracking.
`;
  await fs.writeFile(path.join(root, 'templates', 'copy', `${variant.file.replace('.html', '.md')}`), copy, 'utf8');
}

await fs.writeFile(
  path.join(root, 'templates', 'manifest.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), templates: variants.map(({ file, slug, accent, subject }) => ({ file: `templates/html/${file}`, copy: `templates/copy/${file.replace('.html', '.md')}`, slug, accent, subject })) }, null, 2) + '\n',
  'utf8'
);

console.log(`Built ${variants.length} agency email templates in ${path.relative(process.cwd(), outDir)}/`);
