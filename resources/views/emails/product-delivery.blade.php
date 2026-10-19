@php
    $site = config('site');
    $currency = $orders->first()->currency ?? 'INR';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your download{{ $orders->count() > 1 ? 's are' : ' is' }} ready</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ec;font-family:Georgia,'Times New Roman',serif;color:#161616;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ec;padding:40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e3ddd2;">
                    <tr>
                        <td style="padding:40px 40px 24px;border-bottom:1px solid #e3ddd2;">
                            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#6f6f6f;">{{ $site['name'] }} · Digital Store</p>
                            <h1 style="margin:12px 0 0;font-size:26px;line-height:1.3;">Your download{{ $orders->count() > 1 ? 's are' : ' is' }} ready</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 40px;">
                            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hi {{ $customer }},</p>
                            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                                Thank you for your purchase. Your secure download link{{ $orders->count() > 1 ? 's are' : ' is' }} below —
                                valid for <strong>48 hours</strong> with up to <strong>5 downloads</strong> each.
                            </p>

                            @foreach ($orders as $order)
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border:1px solid #e3ddd2;">
                                <tr>
                                    <td style="padding:16px 18px;">
                                        <p style="margin:0 0 4px;font-size:15px;font-weight:bold;">{{ $order->product_title }}</p>
                                        <p style="margin:0 0 12px;font-size:13px;color:#6f6f6f;font-family:'Courier New',monospace;">{{ \App\Support\Money::format($order->amount, $order->currency) }} {{ $order->currency }}</p>
                                        <a href="{{ $order->download_url }}" style="display:inline-block;background:#161616;color:#ffffff;text-decoration:none;padding:10px 22px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;">⬇ Download</a>
                                    </td>
                                </tr>
                            </table>
                            @endforeach

                            <p style="margin:20px 0 8px;font-size:13px;color:#6f6f6f;font-family:'Courier New',monospace;">Order reference: {{ $orders->first()->cart_reference }}</p>
                            <p style="margin:0;font-size:13px;color:#6f6f6f;font-family:'Courier New',monospace;">Total paid: {{ \App\Support\Money::format($total, $currency) }} {{ $currency }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 40px 40px;border-top:1px solid #e3ddd2;">
                            <p style="margin:0 0 8px;font-size:14px;line-height:1.7;">Link expired or hit its limit? Just reply to this email and I will resend it.</p>
                            <p style="margin:0 0 12px;font-size:12px;color:#8a8377;line-height:1.6;">
                                You are enrolled to receive future engineering product releases & technical dispatches from Deepak Bagada.
                                @if (!empty($subscriber))
                                    · <a href="{{ $subscriber->getUnsubscribeUrl() }}" style="color:#6f6f6f;text-decoration:underline;">Unsubscribe</a>
                                @endif
                            </p>
                            <p style="margin:0;font-size:12px;color:#6f6f6f;font-family:'Courier New',monospace;">{{ $site['name'] }} — {{ $site['email'] }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
