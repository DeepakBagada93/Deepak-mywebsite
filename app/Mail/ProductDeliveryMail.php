<?php

namespace App\Mail;

use App\Models\ProductOrder;
use App\Models\Subscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class ProductDeliveryMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  Collection<int, ProductOrder>  $orders
     */
    public function __construct(public Collection $orders) {}

    public function envelope(): Envelope
    {
        $many = $this->orders->count() > 1;

        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: $many
                ? 'Your '.$this->orders->count().' downloads are ready'
                : 'Your download is ready — '.$this->orders->first()->product_title,
        );
    }

    public function content(): Content
    {
        $email = strtolower(trim((string) $this->orders->first()?->customer_email));
        $subscriber = $email ? Subscriber::where('email', $email)->first() : null;

        return new Content(
            view: 'emails.product-delivery',
            with: [
                'site' => config('site'),
                'orders' => $this->orders,
                'customer' => $this->orders->first()->customer_name,
                'total' => $this->orders->sum('amount'),
                'subscriber' => $subscriber,
            ],
        );
    }
}
