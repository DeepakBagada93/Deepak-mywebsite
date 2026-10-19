@php
    $site = config('site');
    $first = $orders->first();
    $currency = $first->currency ?? 'INR';
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>New sale</title>
</head>
<body style="margin:0;padding:0;background:#f1f1f1;font-family:'Helvetica Neue',Arial,sans-serif;color:#161616;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f1f1;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #dddddd;">
                    <tr>
                        <td style="padding:28px 32px;background:#161616;color:#ffffff;">
                            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">{{ $site['name'] }} · Store Alert</p>
                            <h1 style="margin:10px 0 0;font-size:22px;">🛒 New sale — {{ \App\Support\Money::format($total, $currency) }} {{ $currency }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:26px 32px;">
                            <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">A new purchase just completed. Details below.</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dddddd;margin-bottom:20px;">
                                <tr>
                                    <td style="padding:14px 16px;border-bottom:1px solid #dddddd;background:#fafafa;font-size:13px;">
                                        <strong>Customer</strong><br>
                                        {{ $first->customer_name }}<br>
                                        <a href="mailto:{{ $first->customer_email }}" style="color:#161616;">{{ $first->customer_email }}</a>
                                        @if ($first->customer_phone)<br>{{ $first->customer_phone }}@endif
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:14px 16px;font-size:13px;">
                                        <strong>Order</strong> {{ $first->cart_reference }}<br>
                                        @if ($first->cf_order_id)<strong>Cashfree</strong> {{ $first->cf_order_id }}<br>@endif
                                        <strong>Paid at</strong> {{ optional($first->paid_at)->format('d M Y, H:i') ?? now()->format('d M Y, H:i') }}
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dddddd;">
                                <tr style="background:#fafafa;">
                                    <td style="padding:10px 16px;font-size:12px;font-family:'Courier New',monospace;">ITEM</td>
                                    <td style="padding:10px 16px;font-size:12px;font-family:'Courier New',monospace;text-align:right;">PRICE</td>
                                </tr>
                                @foreach ($orders as $order)
                                <tr>
                                    <td style="padding:12px 16px;font-size:14px;border-top:1px solid #eeeeee;">{{ $order->product_title }}</td>
                                    <td style="padding:12px 16px;font-size:14px;border-top:1px solid #eeeeee;text-align:right;">{{ \App\Support\Money::format($order->amount, $order->currency) }}</td>
                                </tr>
                                @endforeach
                                <tr>
                                    <td style="padding:12px 16px;font-size:14px;font-weight:bold;border-top:2px solid #161616;">Total</td>
                                    <td style="padding:12px 16px;font-size:14px;font-weight:bold;border-top:2px solid #161616;text-align:right;">{{ \App\Support\Money::format($total, $currency) }}</td>
                                </tr>
                            </table>

                            <p style="margin:20px 0 0;font-size:13px;color:#6f6f6f;">The customer has already received their download link by email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
