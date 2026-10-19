<?php

namespace App\Mail;

use App\Models\ProductOrder;
use App\Support\Money;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class AdminPurchaseMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  Collection<int, ProductOrder>  $orders
     */
    public function __construct(public Collection $orders) {}

    public function envelope(): Envelope
    {
        $first = $this->orders->first();
        $extra = $this->orders->count() > 1 ? ' (+'.($this->orders->count() - 1).' more)' : '';
        $total = Money::format($this->orders->sum('amount'), $first->currency);

        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: '🛒 New sale: '.$total.' — '.$first->product_title.$extra,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-purchase',
            with: [
                'site' => config('site'),
                'orders' => $this->orders,
                'total' => $this->orders->sum('amount'),
            ],
        );
    }
}
