<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to The Dispatch</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f6f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #161616; line-height: 1.65;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f6f2; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 36px 36px 20px 36px; border-bottom: 2px solid #161616;">
                            <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #777777; margin-bottom: 8px;">
                                // THE PRIVATE DISPATCH
                            </div>
                            <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: normal; color: #161616; letter-spacing: -0.01em;">
                                {{ $site['name'] }}
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px 36px;">
                            <p style="font-size: 16px; margin: 0 0 18px 0; color: #161616;">
                                Welcome to the private dispatch list.
                            </p>

                            <p style="font-size: 15px; margin: 0 0 18px 0; color: #333333; line-height: 1.7;">
                                You’ll receive unvarnished, deep technical breakdowns on autonomous AI agents, Model Context Protocol (MCP) servers, multi-agent orchestrations, and production web engineering.
                            </p>

                            <div style="background-color: #faf8f5; border-left: 3px solid #161616; padding: 16px 20px; margin: 24px 0;">
                                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #161616;">What to expect:</p>
                                <ul style="margin: 10px 0 0 0; padding-left: 18px; font-size: 14px; color: #444444; line-height: 1.6;">
                                    <li>Zero corporate fluff, zero sponsored listicles</li>
                                    <li>Runnable architecture patterns &amp; MCP schemas</li>
                                    <li>Direct field lessons from building AI systems in Gujarat, India</li>
                                    <li>Shipped once a week straight to your inbox</li>
                                </ul>
                            </div>

                            <p style="font-size: 15px; margin: 0 0 28px 0; color: #333333;">
                                While waiting for the next dispatch, you can explore the archives and open-source releases:
                            </p>

                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                                <tr>
                                    <td style="border-radius: 2px; background-color: #161616;">
                                        <a href="{{ rtrim($site['url'], '/') }}/journal" target="_blank" style="display: inline-block; padding: 13px 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;">
                                            Browse Technical Journal →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 14px; color: #555555; margin: 0;">
                                Best regards,<br>
                                <strong>{{ $site['name'] }}</strong><br>
                                <span style="font-size: 13px; color: #777777;">AI Expert &amp; Agent Architect · {{ $site['location'] }}</span>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 36px; background-color: #fafafa; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888; line-height: 1.6;">
                            <p style="margin: 0 0 10px 0;">
                                You received this email because you subscribed on <a href="{{ $site['url'] }}" style="color: #161616; text-decoration: underline;">{{ $site['name'] }}</a>.
                            </p>
                            <p style="margin: 0;">
                                Want to leave? <a href="{{ $unsubscribeUrl }}" style="color: #666666; text-decoration: underline;">Click here to unsubscribe instantly</a>.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
