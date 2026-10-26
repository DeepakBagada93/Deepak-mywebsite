# Compatibility

| Platform | Support | Notes |
| --- | --- | --- |
| Gmail (web, iOS, Android) | Full | Inline CSS and media queries tested |
| Apple Mail (macOS, iOS) | Full | Dark mode supported |
| Outlook 2016–365 (Windows) | Full | MSO conditional comments included |
| Outlook.com | Full | Table layout, no flexbox |
| Yahoo Mail | Full | Inline styles primary |
| Brevo | Full | Replace pack merge tags with Brevo syntax |
| MailerLite | Full | Replace pack merge tags with MailerLite syntax |
| Mailchimp | Full | Replace pack merge tags with Mailchimp syntax |
| Klaviyo | Full | Replace pack merge tags with Klaviyo syntax |
| HubSpot | Full | Replace pack merge tags with HubSpot syntax |
| Make.com / n8n | Full | Send HTML through SMTP or ESP modules |

## Rendering constraints

- Width is capped at 600px.
- No JavaScript, web fonts, external CSS, or remote images.
- Body copy is at least 16px; tap targets are at least 44px.
- Dark mode uses `prefers-color-scheme` with explicit text colors.
- Every template includes a visible unsubscribe link and business address.

## Not supported

- AMP for Email.
- Interactive forms inside the email.
- Video embeds.
- Animated GIFs (the templates are text-first by design).

## Merge tag mapping

| Pack token | Brevo | MailerLite | Mailchimp |
| --- | --- | --- | --- |
| `{{first_name|there}}` | `{{ contact.FIRSTNAME | default: "there" }}` | `{$name}` | `*|FNAME|*` |
| `{{company|your team}}` | `{{ contact.COMPANY | default: "your team" }}` | `{$company}` | `*|COMPANY|*` |
| `{{unsubscribe_url}}` | `{{ unsubscribe }}` | `{$unsubscribe}` | `*|UNSUB|*` |

If your ESP does not support fallback syntax, create a default value at import time or use the ESP's own default filter.
