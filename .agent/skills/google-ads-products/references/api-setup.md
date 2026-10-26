# Google Ads API setup

The skill uses the REST API directly (no SDK). You need five credentials and one Google Ads conversion action.

## 1. Developer token

1. Sign in to Google Ads with the **manager (MCC) account** you will use.
2. Tools & settings → **API Center**.
3. Copy the **developer token**.
4. A **test** token only works with test accounts. For a live account, apply for **Basic access** and wait for approval.

`GOOGLE_ADS_DEVELOPER_TOKEN` is sent in the `developer-token` header on every request.

## 2. Google Cloud OAuth client

1. Create or open a project at https://console.cloud.google.com.
2. Enable **Google Ads API**.
3. Configure the OAuth consent screen (External is fine; add your Google account as a test user while in testing).
4. Credentials → Create credentials → **OAuth client ID** → **Desktop app**.
5. Copy the client ID and client secret.

Scope used by this skill: `https://www.googleapis.com/auth/adwords`.

## 3. Refresh token

```bash
node .agent/skills/google-ads-products/scripts/oauth-setup.mjs \
  --client-id="YOUR_CLIENT_ID" \
  --client-secret="YOUR_CLIENT_SECRET" \
  --open
```

Sign in with the Google account that can access the Ads account. The script starts a local callback on `http://localhost:8085/oauth2callback`, exchanges the code, and prints a refresh token.

If Google returns no refresh token, revoke the app's access at https://myaccount.google.com/permissions and run again. The script requests `prompt=consent&access_type=offline`, which normally forces one.

## 4. Customer IDs

- `GOOGLE_ADS_CUSTOMER_ID` — the account where campaigns are created. Digits only, no dashes. Example: `123-456-7890` becomes `1234567890`.
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` — only when you access the account through a manager (MCC). It is the **manager's** customer ID. If you sign in directly to the ads account, leave it blank.

The API path is:

```
https://googleads.googleapis.com/v26/customers/{GOOGLE_ADS_CUSTOMER_ID}/...
```

Headers:

```
Authorization: Bearer <access token>
developer-token: <developer token>
login-customer-id: <manager id, only if set>
```

## 5. Conversion action

The plan names a conversion action, for example `Purchase`. Create it in Google Ads:

- Goals → Conversions → Summary → **New conversion action** → Website.
- Name it exactly the same as `conversion_tracking.action_name` in the brief.
- Set a value (₹2,499) so ROAS can be reported.
- Install the tag or import the purchase event from GA4.
- Verify it fires on the thank-you page in Google Tag Assistant.

The create script refuses to run if the named action is not `ENABLED`.

## 6. Environment variables

Add to the project `.env` (never commit it):

```bash
GOOGLE_ADS_DEVELOPER_TOKEN=...
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_LOGIN_CUSTOMER_ID=
GOOGLE_ADS_API_VERSION=v26
GOOGLE_ADS_CURRENCY=INR
GOOGLE_ADS_MAX_BUDGET=3000
```

`GOOGLE_ADS_MAX_BUDGET` is the hard ceiling for any plan this skill will create. Keep it at 3000 until you deliberately scale.

## 7. Preflight

```bash
node .agent/skills/google-ads-products/scripts/account-check.mjs
```

It prints the account name, currency, time zone, enabled conversion actions and recent campaigns. Fix anything it flags before creating.

## 8. API version

v26 is the current major version (released 2026-10-14, sunset November 2027). Override with `GOOGLE_ADS_API_VERSION` when upgrading. Major versions have a ~12-month life; check https://developers.google.com/google-ads/api/docs/sunset-dates.

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `invalid_grant` | Refresh token revoked/expired, or wrong client | Re-run `oauth-setup.mjs`; confirm client ID/secret match the token. |
| `DEVELOPER_TOKEN_NOT_APPROVED` | Test token used on a live account | Apply for Basic access, or use a test account. |
| `CUSTOMER_NOT_FOUND` | Wrong customer ID or missing `login-customer-id` | Use the child account ID; set the manager ID in `GOOGLE_ADS_LOGIN_CUSTOMER_ID`. |
| `USER_PERMISSION_DENIED` | Google account cannot access the Ads account | Grant access in Google Ads → Admin → Access and security. |
| `CURRENCY_MISMATCH` / wrong spend | Account currency differs from plan | Use an INR account or convert the plan deliberately. |
| `DUPLICATE_CAMPAIGN_NAME` | Same campaign name already exists | Change `campaign_name`; never create duplicates. |
| `CONVERSION_ACTION_NOT_FOUND` | Name mismatch or action removed | Match the exact conversion action name in Google Ads. |
| `POLICY_VIOLATION` | Ad copy/landing page issue | Fix the claim, capitalization, punctuation or landing-page mismatch. |
| `AUTHENTICATION_ERROR` with test account | Test tokens only create in test accounts | Use a test account for dry runs; production token for live. |

## Test-account workflow

1. Create a Google Ads **test account** under the manager account.
2. Use the test developer token and the test account's customer ID.
3. Run the full create; test accounts do not serve ads or spend money.
4. When the plan, copy and tracking are approved, repeat with the production token/account.

## Security

- The refresh token grants ad-account access. Treat it like a password.
- Do not paste tokens into chats, logs, screenshots or commits.
- Restrict the Google account to the minimum Ads access needed.
- Rotate the token if it leaks (revoke at https://myaccount.google.com/permissions).
- The skill never stores tokens in `runs/`; only campaign payloads and state are written.
